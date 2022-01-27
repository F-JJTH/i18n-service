import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { DataStore, Storage } from "aws-amplify";
import { AdminQueriesService, CurrentUserService } from "..";
import { Definition, Language, MemberAuthorization, Product, Translation } from "./models";

export type ProductListItem = Product & {page: string}

@Injectable({providedIn: 'root'})
export class I18nService {
  constructor(
    private readonly adminQueries: AdminQueriesService,
    private readonly currentUser: CurrentUserService,
    private readonly http: HttpClient,
  ) {}

  clearLocalDB() {
    console.warn('clearLocalDB() is deprecated');
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




  // /product GET Route✅
  async getProducts(): Promise<Product[]> {
    let products = await DataStore.query(Product)

    const isAdmin = await this.currentUser.isAdmin()
    if (!isAdmin) {
      const user: any = await this.currentUser.getPayload()
      products = products.filter(p => p.members?.includes(user.sub) || false)
    }

    return products
  }

  // /product/:id GET Route✅
  getProductById(id: string) {
    return DataStore.query(Product, id)
  }

  // /product/:id PATCH Route✅
  async updateProductName(name: string, id: string) {
    const product = await this.getProductById(id)
    if (!product) { throw new Error(`Product ${id} not found`) }

    const updatedProduct = Product.copyOf(product, updated => {
      updated.name = name
    })
    return await DataStore.save(updatedProduct)
  }

  // /product POST Route✅
  async createProduct(name: string, defaultLanguage: { code: string, label: string }, currentUser: { sub: string, email: string }) {
    const product = await DataStore.save(new Product({
      name: name,
      defaultLanguage: defaultLanguage.code,
      members: [currentUser.sub],
      authorizations: [{
        id: currentUser.sub,
        email: currentUser.email,
        authorizations: {
          validator: true,
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

  // /product/:id DELETE Route✅
  async deleteProduct(id: string) {
    return DataStore.delete(Product, id)
  }

  // /product/:id/publish/:env GET Route✅
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

  // /product/:id/publish/:env GET Route✅
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

  // /product/:id/member POST Route✅
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

  // /product/:id/member PATCH Route✅
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

  // /product/:id/member DELETE Route✅
  async deleteMemberFromProduct(memberId: string, productId: string) {
    const product = await this.getProductById(productId)
    if (!product) { throw new Error(`Product ${productId} not found`) }

    return await DataStore.save(Product.copyOf(product, updated => {
      updated.members = product.members?.filter(m => m !== memberId)
      updated.authorizations = product.authorizations?.filter(a => a?.id !== memberId)
    }))
  }

  // /product/:id/language GET Route✅
  async getLanguagesByProductId(productId: string) {
    return (await DataStore.query(Language))
      .filter(d => d.product?.id === productId)
  }

  // /product/:id/definition GET Route✅
  async getDefinitionsByProductId(productId: string) {
    return (await DataStore.query(Definition))
      .filter(d => d.product?.id === productId)
  }

  // /product/:id/translation GET Route✅
  async getTranslationsByProductId(productId: string) {
    console.log("aaaa")
    return (await DataStore.query(Translation))
      .filter(d => d.product?.id === productId)
  }





  // /language POST Route✅
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

  // /language/:id/is-disabled Route✅
  async setIsDisabledForLanguage(id: string, isDisabled: boolean) {
    const language = await DataStore.query(Language, id)
    if (!language) { throw new Error(`Language ${id} not found`) }


    await DataStore.save(Language.copyOf(language, updated => {
      updated.isDisabled = isDisabled
    }))

    this.publishDevTranslationsForProduct(language.product!.id)
  }

  // /language/:id DELETE Route✅
  async deleteLanguage(id: string) {
    const language = await DataStore.query(Language, id)
    if (!language) { throw new Error(`Language ${id} not found`) }

    await  DataStore.delete(Language, id)
    this.publishDevTranslationsForProduct(language.product!.id)
  }




  // /translation/:id/is-valid POST Route✅
  async setIsValidForTranslation(id: string, isValid: boolean) {
    const translation = await DataStore.query(Translation, id)
    if (!translation) { throw new Error(`Translation ${id} not found`) }

    return DataStore.save(
      Translation.copyOf(translation, updated => {
        updated.isValid = isValid
      })
    )
  }

  // /translation PATCH Route✅
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

  // /translation/import POST Route✅
  async importTranslations(translations: {slug: string, translation: string}[], productId: string, languageId: string) {
    const product = await this.getProductById(productId)
    const language = await this.getLanguageById(languageId)
    if (!product || !language) {
      return
    }

    await Promise.all(translations.map(v => {
      return new Promise<void | string>(async (resolve, reject) => {
        const definition = await this.getDefinitionBySlug(v.slug)
        if (!definition) { return resolve(`Unknown slug '${v.slug}'`) }

        const translation = (await DataStore.query(Translation)).filter(t => t.definition!.id === definition.id && t.language!.id === languageId && t.product!.id === productId)[0]
        if (!translation) { return resolve(`Unknown translation for slug '${v.slug}' and language '${languageId}'`) }

        await DataStore.save(
          Translation.copyOf(translation, updated => {
            updated.value = v.translation,
            updated.isRequireTranslatorAction = v.translation ? false : true
          })
        )
        resolve()
      })
    }))

    this.publishDevTranslationsForProduct(productId)

    const translationsRequiringTranslatorAction = (await DataStore.query(Translation))
      .filter(t => t.language!.id === language.id && t.isRequireTranslatorAction === true)
    return DataStore.save(
      Language.copyOf(language, updated => {
        updated.isRequireTranslatorAction = translationsRequiringTranslatorAction.length > 0 ? true : false
      })
    )
  }




  // /definition POST Route✅
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

  // /definition/:id PATCH Route✅
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

  // /definition/import POST Route✅
  async importDefinitions(definitions: {slug: string, defaultValue: string}[], productId: string) {
    return Promise.all(definitions.map(v => {
      return this.addDefinition(v.slug, v.defaultValue, productId)
    }))
  }

  // /definition/:id DELETE Route✅
  async deleteDefinition(id: string) {
    const definition = await DataStore.query(Definition, id)
    if (!definition) { throw new Error(`Definition ${id} not found`) }

    await  DataStore.delete(Definition, id)
    this.publishDevTranslationsForProduct(definition.product!.id)
  }




  private async publishDevTranslationsForProduct(id: string) {
    const languages = (await this.getLanguagesByProductId(id)).filter(l => !l.isDisabled)
    await this.deleteOldTranslationsForProduct(id, "dev")
    await this.uploadTranslationsFilesForLanguages(languages, "dev")
  }

  private getLanguageById(id: string) {
    return DataStore.query(Language, id)
  }

  private async getTranslationsByLanguageId(languageId: string) {
    return (await DataStore.query(Translation))
      .filter(d => d.language?.id === languageId)
  }

  private async getDefinitionBySlug(slug: string) {
    return (await DataStore.query(Definition)).filter(d => d.slug === slug)[0]
  }

  private async deleteOldTranslationsForProduct(id: string, env: 'dev' | 'preprod' | 'prod') {
    const files = await Storage.list(`${id}/${env}/`)

    const promises = files.map(pf => {
      return Storage.remove(pf.key!);
    })
    return Promise.all(promises)
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

  async listUsers() {
    return this.adminQueries.listUsers()
  }
}
