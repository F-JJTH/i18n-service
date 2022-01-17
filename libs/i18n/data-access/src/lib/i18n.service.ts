import { Injectable } from "@angular/core";
import { DataStore, Storage } from "aws-amplify";
import { AdminQueriesService, Definition, Language, MemberAuthorization, Product, Translation } from "..";

@Injectable({providedIn: 'root'})
export class I18nService {
  constructor(
    private readonly adminQueries: AdminQueriesService,
  ) {}

  clearLocalDB() {
    DataStore.clear()
  }

  observeProductById(id: string) {
    return DataStore.observe(Product, id)
  }

  observeProducts() {
    return DataStore.observe(Product)
  }

  observeLanguages() {
    return DataStore.observe(Language)
  }

  getProductById(id: string) {
    return DataStore.query(Product, id)
  }

  getProducts() {
    return DataStore.query(Product)
  }

  async addMemberToProduct(memberId: string, memberEmail: string, authorizations: MemberAuthorization, productId: string) {
    const product = await this.getProductById(productId)
    if (!product) { throw new Error(`Product ${productId} not found`) }

    return await DataStore.save(Product.copyOf(product, updated => {
      updated.members = [...product.members!, memberId]

      updated.authorizations = [...product.authorizations!, {
        email: memberEmail,
        id: memberId,
        authorizations
      }]
    }))
  }

  async updateMemberForProduct(memberId: string, authorizations: MemberAuthorization, productId: string) {
    const product = await this.getProductById(productId)
    if (!product) { throw new Error(`Product ${productId} not found`) }

    return await DataStore.save(Product.copyOf(product, updated => {
      updated.authorizations = product.authorizations?.map(a => {
        if (a?.id !== memberId) return a
        return {...a!, authorizations}
      })
    }))
  }

  async deleteMemberFromProduct(memberId: string, productId: string) {
    const product = await this.getProductById(productId)
    if (!product) { throw new Error(`Product ${productId} not found`) }

    return await DataStore.save(Product.copyOf(product, updated => {
      updated.members = product.members?.filter(m => m !== memberId)
      updated.authorizations = product.authorizations?.filter(a => a?.id !== memberId)
    }))
  }

  async updateProductName(name: string, id: string) {
    const product = await this.getProductById(id)
    if (!product) { throw new Error(`Product ${id} not found`) }

    const updatedProduct = Product.copyOf(product, updated => {
      updated.name = name
    })
    return await DataStore.save(updatedProduct)
  }

  async getProductsForMember(memberId: string) {
    return (await DataStore.query(Product))
      .filter(p => p.members?.includes(memberId) || false)
  }

  async createProduct(name: string, defaultLanguage: { code: string, label: string }, currentUser: { sub: string, email: string }) {
    const product = await DataStore.save(new Product({
      name: name,
      defaultLanguage: defaultLanguage.code,
      members: [currentUser.sub],
      authorizations: [{
        id: currentUser.sub,
        email: currentUser.email,
        authorizations: {
          definitions: true,
          deploy: true,
          settings: true,
          translations: ['ALL']
        }
      }]
    }))

    await DataStore.save(new Language({
      code: defaultLanguage.code,
      name: defaultLanguage.label,
      isDefault: true,
      isDisabled: false,
      product,
      isRequireTranslatorAction: false
    }))

    return product
  }

  async getLanguagesByProductId(productId: string) {
    return (await DataStore.query(Language))
      .filter(d => d.product?.id === productId)
  }

  async getDefinitionsByProductId(productId: string) {
    return (await DataStore.query(Definition))
      .filter(d => d.product?.id === productId)
  }

  async getTranslationsByProductId(productId: string) {
    return (await DataStore.query(Translation))
      .filter(d => d.product?.id === productId)
  }

  async getTranslationsByLanguageId(languageId: string) {
    return (await DataStore.query(Translation))
      .filter(d => d.language?.id === languageId)
  }

  async updateTranslations(translationItems: { id: string, value: string }[]) {
    const modifiedLanguages: Map<string, Language> = new Map()

    const promisesA = translationItems.map(async translationItem => {
      return new Promise<void>(async (resolve, reject) => {
        const translation = await DataStore.query(Translation, translationItem.id)
        if (!translation) { throw new Error(`Translation ${translationItem.id} not found`) }

        modifiedLanguages.set(translation.language!.id, translation.language!)
        await DataStore.save(
          Translation.copyOf(translation, updated => {
            updated.value = translationItem.value
            updated.isRequireTranslatorAction = translationItem.value ? false : true
          })
        )

        resolve()
      })
    })

    await Promise.all(promisesA)

    const promisesB = Array.from(modifiedLanguages.values()).map(async language => {
      const translationsRequiringTranslatorAction = (await DataStore.query(Translation))
        .filter(t => t.language!.id === language.id && t.isRequireTranslatorAction === true)
      return DataStore.save(
        Language.copyOf(language, updated => {
          updated.isRequireTranslatorAction = translationsRequiringTranslatorAction.length > 0 ? true : false
        })
      )
    })

    await Promise.all(promisesB)

    const languageId = Array.from(modifiedLanguages.values())[0].id
    const language = await DataStore.query(Language, languageId)
    if (!language) { throw new Error(`Language ${languageId} not found`) }

    this.publishDevTranslationsForProduct(language.product!.id)
  }

  async updateDefinition(id: string, slug: string, defaultValue: string) {
    const definition = await DataStore.query(Definition, id)
    if (!definition) { throw new Error(`Definition ${id} not found`) }

    await DataStore.save(Definition.copyOf(definition, updated => {
      updated.slug = slug,
        updated.defaultValue = defaultValue
    }))

    const translations = (await DataStore.query(Translation))
      .filter(t => t.definition!.id === definition!.id)

    const promises = translations.map(t => {
      return new Promise<void>(async (resolve, reject) => {
        await DataStore.save(
          Translation.copyOf(t, updated => {
            if (t.language!.isDefault) {
              updated.value = defaultValue
            }
            updated.isRequireTranslatorAction = t.language!.isDefault ? false : true
          })
        )

        if (!t.language!.isDefault) {
          await DataStore.save(
            Language.copyOf(t.language!, updated => {
              updated.isRequireTranslatorAction = true
            })
          )
        }

        resolve()
      })
    })

    await Promise.all(promises)

    this.publishDevTranslationsForProduct(definition.product!.id)
  }

  async addDefinition(slug: string, defaultValue: string, productId: string) {
    const product = await DataStore.query(Product, productId)
    if (!product) { throw new Error(`Product ${productId} not found`) }

    const definition = await DataStore.save(new Definition({
      defaultValue: defaultValue,
      slug: slug,
      product
    }))

    const languages = await this.getLanguagesByProductId(product.id)

    const promises = languages.map(language => {
      return new Promise<void>(async (resolve, reject) => {
        const value = language.isDefault ? definition.defaultValue : undefined
        await DataStore.save(new Translation({
          definition,
          language,
          product,
          value,
          isRequireTranslatorAction: language.isDefault ? false : true
        }))

        await DataStore.save(Language.copyOf(language, updated => {
          updated.isRequireTranslatorAction = language.isDefault ? false : true
        }))

        resolve()
      })
    })

    await Promise.all(promises)

    this.publishDevTranslationsForProduct(productId)
  }

  async addLanguage(languageCode: string, languageLabel: string, productId: string) {
    const product = await DataStore.query(Product, productId)
    if (!product) { throw new Error(`Product ${productId} not found`) }

    const definitions = (await DataStore.query(Definition))
      .filter(d => d.product!.id === product.id)

    const language = await DataStore.save(new Language({
      code: languageCode,
      name: languageLabel,
      isDefault: false,
      isDisabled: false,
      product: product,
      isRequireTranslatorAction: definitions.length ? true : false
    }))

    const promises = definitions.map(definition => {
      //FIXME: batch
      return DataStore.save(new Translation({
        definition,
        language,
        product,
        value: undefined,
        isRequireTranslatorAction: true
      }))
    })

    await Promise.all(promises)

    this.publishDevTranslationsForProduct(productId)
  }

  async setIsDisabledForLanguage(id: string, isDisabled: boolean) {
    const language = await DataStore.query(Language, id)
    if (!language) { throw new Error(`Language ${id} not found`) }


    await DataStore.save(Language.copyOf(language, updated => {
      updated.isDisabled = isDisabled
    }))

    this.publishDevTranslationsForProduct(language.product!.id)
  }

  async deleteLanguage(id: string) {
    const language = await DataStore.query(Language, id)
    if (!language) { throw new Error(`Language ${id} not found`) }

    await  DataStore.delete(Language, id)
    this.publishDevTranslationsForProduct(language.product!.id)
  }

  async deleteProduct(id: string) {
    return DataStore.delete(Product, id)
  }

  async deleteDefinition(id: string) {
    const definition = await DataStore.query(Definition, id)
    if (!definition) { throw new Error(`Definition ${id} not found`) }

    await  DataStore.delete(Definition, id)
    this.publishDevTranslationsForProduct(definition.product!.id)
  }

  private async uploadTranslationsFilesForLanguages(languages: Language[], env: 'dev' | 'preprod') {
    const promises = languages.map(async l => {
      return new Promise(async (resolve, reject) => {
        const translations = await this.getTranslationsByLanguageId(l.id)
        const fileContent = translations.reduce((prev, t) => {
          return {...prev, [t.definition!.slug]: t.value}
        }, {})
        try {
          const result = await Storage.put(`${l.product!.id}/${env}/${l.code}.json`, fileContent)

          resolve(result)
        } catch (err) {
          console.warn(err)
          reject("cannot write to s3")
        }
      })
    })

    await Promise.all(promises)
  }

  async publishDevTranslationsForProduct(id: string) {
    const languages = (await this.getLanguagesByProductId(id)).filter(l => !l.isDisabled)
    await this.deleteOldTranslationsForProduct(id, "dev")
    await this.uploadTranslationsFilesForLanguages(languages, "dev")
  }

  async publishPreprodTranslationsForProduct(id: string) {
    const languages = (await this.getLanguagesByProductId(id)).filter(l => !l.isDisabled)
    await this.deleteOldTranslationsForProduct(id, "preprod")
    await this.uploadTranslationsFilesForLanguages(languages, "preprod")

    const product = await this.getProductById(id)
    if (!product) { throw new Error(`Product ${id} not found`) }

    DataStore.save(Product.copyOf(product, updated => {
      updated.publishedPreprodAt = new Date().toISOString()
    }))

    return Promise.resolve()
  }

  async publishProdTranslationsForProduct(id: string) {
    await this.deleteOldTranslationsForProduct(id, "prod")

    const preprodFiles = await Storage.list(`${id}/preprod/`)
    preprodFiles.forEach(pf => {
      Storage.copy({ key: pf.key! }, { key: pf.key!.replace("preprod", "prod") });
    })

    const product = await this.getProductById(id)
    if (!product) { throw new Error(`Product ${id} not found`) }

    DataStore.save(Product.copyOf(product, updated => {
      updated.publishedProdAt = new Date().toISOString()
    }))

    return Promise.resolve()
  }

  private async deleteOldTranslationsForProduct(id: string, env: 'dev' | 'preprod' | 'prod') {
    const files = await Storage.list(`${id}/${env}/`)

    const promises = files.map(pf => {
      return Storage.remove(pf.key!);
    })
    return Promise.all(promises)
  }

  async listUsers() {
    return this.adminQueries.listUsers()
  }
}
