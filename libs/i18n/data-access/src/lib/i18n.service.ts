import {Injectable} from "@angular/core";
import {DataStore, Storage} from "aws-amplify";
import {Definition, Language, MemberAuthorization, Product, Translation} from "..";

@Injectable({providedIn: 'root'})
export class I18nService {
  constructor() {
  }

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
    if (!product) return Promise.reject(`Product ${productId} not found`)

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
    if (!product) return Promise.reject(`Product ${productId} not found`)

    return await DataStore.save(Product.copyOf(product, updated => {
      updated.authorizations = product.authorizations?.map(a => {
        if (a?.id !== memberId) return a
        return {...a!, authorizations}
      })
    }))
  }

  async deleteMemberFromProduct(memberId: string, productId: string) {
    const product = await this.getProductById(productId)
    if (!product) return Promise.reject(`Product ${productId} not found`)

    return await DataStore.save(Product.copyOf(product, updated => {
      updated.members = product.members?.filter(m => m !== memberId)
      updated.authorizations = product.authorizations?.filter(a => a?.id !== memberId)
    }))
  }

  async updateProductName(name: string, id: string) {
    const product = await this.getProductById(id)
    if (!product) return Promise.reject(`Product ${id} not found`)

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
          languages: true,
          translations: ['ALL']
        }
      }]
    }))

    await DataStore.save(new Language({
      code: defaultLanguage.code,
      name: defaultLanguage.label,
      isDefault: true,
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
    let promises: Promise<any>[] = []
    const modifiedLanguages: Map<string, Language> = new Map()

    translationItems.forEach(async translationItem => {
      const translation = await DataStore.query(Translation, translationItem.id)
      if (!translation) return

      modifiedLanguages.set(translation.language.id, translation.language)

      promises.push(
        DataStore.save(
          Translation.copyOf(translation, updated => {
            updated.value = translationItem.value
            updated.isRequireTranslatorAction = translationItem.value ? false : true
          })
        )
      )
    })

    await Promise.all(promises)

    promises = Array.from(modifiedLanguages.values()).map(async language => {
      const translationsRequiringTranslatorAction = (await DataStore.query(Translation))
        .filter(t => t.language.id === language.id && t.isRequireTranslatorAction === true)
      return DataStore.save(
        Language.copyOf(language, updated => {
          updated.isRequireTranslatorAction = translationsRequiringTranslatorAction.length > 0 ? true : false
        })
      )
    })

    await Promise.all(promises)
  }

  async updateDefinition(id: string, slug: string, defaultValue: string) {
    const definition = await DataStore.query(Definition, id)
    if (!definition) return Promise.reject(`Definition ${id} not found`)

    await DataStore.save(Definition.copyOf(definition, updated => {
      updated.slug = slug,
        updated.defaultValue = defaultValue
    }))

    const translations = (await DataStore.query(Translation))
      .filter(t => t.definition.id === definition!.id)

    let promises: Promise<any>[] = []
    translations.forEach(t => {
      promises.push(
        DataStore.save(
          Translation.copyOf(t, updated => {
            if (t.language.isDefault) {
              updated.value = defaultValue
            }
            updated.isRequireTranslatorAction = t.language.isDefault ? false : true
          })
        )
      )

      if (!t.language.isDefault) {
        promises.push(
          DataStore.save(
            Language.copyOf(t.language!, updated => {
              updated.isRequireTranslatorAction = true
            })
          )
        )
      }
    })

    return await Promise.all(promises)
  }

  async addDefinition(slug: string, defaultValue: string, productId: string) {
    const product = await DataStore.query(Product, productId)

    if (!product) {
      return Promise.reject(`Product ${productId} not found`)
    }

    const definition = await DataStore.save(new Definition({
      defaultValue: defaultValue,
      slug: slug,
      product
    }))

    const languages = await this.getLanguagesByProductId(product.id)

    languages.forEach(language => {
      const value = language.isDefault ? definition.defaultValue : ""
      DataStore.save(new Translation({
        definition,
        language,
        product,
        value,
        isRequireTranslatorAction: language.isDefault ? false : true
      }))

      DataStore.save(Language.copyOf(language, updated => {
        updated.isRequireTranslatorAction = language.isDefault ? false : true
      }))
    })

    return Promise.resolve()
  }

  async addLanguage(languageCode: string, languageLabel: string, productId: string) {
    const product = await DataStore.query(Product, productId)

    if (!product) {
      return Promise.reject(`Product ${productId} not found`)
    }

    const definitions = (await DataStore.query(Definition))
      .filter(d => d.product.id === product.id)

    const language = await DataStore.save(new Language({
      code: languageCode,
      name: languageLabel,
      isDefault: false,
      product: product,
      isRequireTranslatorAction: definitions.length ? true : false
    }))

    definitions.forEach(definition => {
      DataStore.save(new Translation({
        definition,
        language,
        product,
        value: "",
        isRequireTranslatorAction: true
      }))
    })

    return Promise.resolve()
  }

  async deleteLanguage(id: string) {
    return DataStore.delete(Language, id)
  }

  async deleteProduct(id: string) {
    return DataStore.delete(Product, id)
  }

  async deleteDefinition(id: string) {
    return DataStore.delete(Definition, id)
  }

  async publishPreprodTranslationsForProduct(id: string) {
    const languages = await this.getLanguagesByProductId(id)

    const promises = languages.map(async l => {
      return new Promise(async (resolve, reject) => {
        const translations = await this.getTranslationsByLanguageId(l.id)
        const fileContent = translations.reduce((prev, t) => {
          return {...prev, [t.definition.slug]: t.value}
        }, {})
        try {
          const result = await Storage.put(`${id}/preprod/${l.code}.json`, fileContent)

          resolve(result)
        } catch (err) {
          console.warn(err)
          reject("cannot write to s3")
        }
      })
    })

    await Promise.all(promises)

    const product = await this.getProductById(id)
    if (!product) {
      return Promise.reject(`Product ${id} not found`)
    }
    DataStore.save(Product.copyOf(product, updated => {
      updated.publishedPreprodAt = new Date().toISOString()
    }))

    return Promise.resolve()
  }

  async publishProdTranslationsForProduct(id: string) {
    const preprodFiles = await Storage.list(`${id}/preprod/`)
    preprodFiles.forEach(pf => {
      Storage.copy({ key: pf.key! }, { key: pf.key!.replace("preprod", "prod") });
    })

    const product = await this.getProductById(id)
    if (!product) {
      return Promise.reject(`Product ${id} not found`)
    }
    DataStore.save(Product.copyOf(product, updated => {
      updated.publishedProdAt = new Date().toISOString()
    }))

    return Promise.resolve()
  }
}
