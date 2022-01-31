import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom } from 'rxjs';
import { AdminQueriesService, CurrentUserService, Definition, Language, MemberAuthorization, Product, Translation } from "..";

export type ProductListItem = Product & {page: string}

@Injectable({providedIn: 'root'})
export class I18nService {
  constructor(
    private readonly adminQueries: AdminQueriesService,
    private readonly currentUser: CurrentUserService,
    private readonly http: HttpClient,
  ) {}

  // /product GET Route✅ Code✅
  async getProducts() {
    return firstValueFrom(this.http.get<Product[]>(`/api/product`))
  }

  // /product/:id GET Route✅ Code✅
  getProductById(id: string) {
    return firstValueFrom(this.http.get<Product>(`/api/product/${id}`))
  }

  // /product/:id PATCH Route✅ Code✅
  async updateProductName(name: string, id: string) {
    return firstValueFrom(this.http.patch<Product>(`/api/product/${id}`, {name}))
  }

  // /product POST Route✅ Code✅
  async createProduct(name: string, defaultLanguage: { code: string, label: string }) {
    return firstValueFrom(this.http.post<Product>(`/api/product`, { name, defaultLanguage }))
  }

  // /product/:id DELETE Route✅ Code✅
  async deleteProduct(id: string) {
    return firstValueFrom(this.http.delete<Product>(`/api/product/${id}`))
  }

  // /product/:id/publish/:env GET Route✅
  async publishPreprodTranslationsForProduct(id: string) {
    return firstValueFrom(this.http.get(`/api/product/${id}/publish/preprod`))
    // const languages = (await this.getLanguagesByProductId(id)).filter(l => !l.isDisabled)
    // await this.deleteOldTranslationsForProduct(id, "preprod")
    // await this.uploadTranslationsFilesForLanguages(languages, "preprod")

    // const product = await this.getProductById(id)
    // if (!product) { throw new Error(`Product ${id} not found`) }

    // DataStore.save(Product.copyOf(product, updated => {
    //   updated.publishedPreprodAt = new Date().toISOString()
    // }))

    // return Promise.resolve()
  }

  // /product/:id/publish/:env GET Route✅
  async publishProdTranslationsForProduct(id: string) {
    return firstValueFrom(this.http.get(`/api/product/${id}/publish/prod`))
    // await this.deleteOldTranslationsForProduct(id, "prod")

    // const preprodFiles = await Storage.list(`${id}/preprod/`)
    // preprodFiles.forEach(pf => {
    //   Storage.copy({ key: pf.key! }, { key: pf.key!.replace("preprod", "prod") });
    // })

    // const product = await this.getProductById(id)
    // if (!product) { throw new Error(`Product ${id} not found`) }

    // DataStore.save(Product.copyOf(product, updated => {
    //   updated.publishedProdAt = new Date().toISOString()
    // }))

    // return Promise.resolve()
  }

  // /product/:id/member POST Route✅ Code✅
  async addMemberToProduct(memberId: string, memberEmail: string, authorizations: MemberAuthorization, productId: string) {
    return firstValueFrom(this.http.post<Product>(`/api/product/${productId}/member`, {memberId, memberEmail, authorizations}))
  }

  // /product/:id/member PATCH Route✅ Code✅
  async updateMemberForProduct(memberId: string, authorizations: MemberAuthorization, productId: string) {
    return firstValueFrom(this.http.patch<Product>(`/api/product/${productId}/member/${memberId}`, {authorizations}))
  }

  // /product/:id/member DELETE Route✅ Code✅
  async deleteMemberFromProduct(memberId: string, productId: string) {
    return firstValueFrom(this.http.delete<Product>(`/api/product/${productId}/member/${memberId}`))
  }

  // /product/:id/language GET Route✅ Code✅
  async getLanguagesByProductId(productId: string) {
    return firstValueFrom(this.http.get<Language[]>(`/api/product/${productId}/language`))
  }

  // /product/:id/definition GET Route✅ Code✅
  async getDefinitionsByProductId(productId: string) {
    return firstValueFrom(this.http.get<Definition[]>(`/api/product/${productId}/definition`))
  }

  // /product/:id/translation GET Route✅ Code✅
  async getTranslationsByProductId(productId: string) {
    return firstValueFrom(this.http.get<Translation[]>(`/api/product/${productId}/translation`))
  }





  // /language POST Route✅ Code✅
  async addLanguage(languageCode: string, languageLabel: string, productId: string) {
    return firstValueFrom(this.http.post<Language>(`/api/language`, {languageCode, languageLabel, productId}))
  }

  // /language/:id/is-disabled Route✅ Code✅
  async setIsDisabledForLanguage(id: string, isDisabled: boolean) {
    return firstValueFrom(this.http.post<Language>(`/api/language/${id}/is-disabled`, {isDisabled}))
  }

  // /language/:id DELETE Route✅
  async deleteLanguage(id: string) {
    return firstValueFrom(this.http.delete<Language>(`/api/language/${id}`))
  }




  // /translation/:id/is-valid POST Route✅ Code✅
  async setIsValidForTranslation(id: string, isValid: boolean) {
    return firstValueFrom(this.http.post<Translation>(`/api/translation/${id}/is-valid`, {isValid}))
  }

  // /translation PATCH Route✅ Code✅
  async updateTranslations(translationItems: { id: string, value: string }[]) {
    return firstValueFrom(this.http.patch<Translation>(`/api/translation`, {translationItems}))
  }

  // /translation/import POST Route✅
  async importTranslations(translations: {slug: string, translation: string}[], productId: string, languageId: string) {
    return firstValueFrom(this.http.post<Translation[]>(`/api/translation/import`, {translations, productId, languageId}))
    // const product = await this.getProductById(productId)
    // const language = await this.getLanguageById(languageId)
    // if (!product || !language) {
    //   return
    // }

    // await Promise.all(translations.map(v => {
    //   return new Promise<void | string>(async (resolve, reject) => {
    //     const definition = await this.getDefinitionBySlug(v.slug)
    //     if (!definition) { return resolve(`Unknown slug '${v.slug}'`) }

    //     const translation = (await DataStore.query(Translation)).filter(t => t.definition!.id === definition.id && t.language!.id === languageId && t.product!.id === productId)[0]
    //     if (!translation) { return resolve(`Unknown translation for slug '${v.slug}' and language '${languageId}'`) }

    //     await DataStore.save(
    //       Translation.copyOf(translation, updated => {
    //         updated.value = v.translation,
    //         updated.isRequireTranslatorAction = v.translation ? false : true
    //       })
    //     )
    //     resolve()
    //   })
    // }))

    // this.publishDevTranslationsForProduct(productId)

    // const translationsRequiringTranslatorAction = (await DataStore.query(Translation))
    //   .filter(t => t.language!.id === language.id && t.isRequireTranslatorAction === true)
    // return DataStore.save(
    //   Language.copyOf(language, updated => {
    //     updated.isRequireTranslatorAction = translationsRequiringTranslatorAction.length > 0 ? true : false
    //   })
    // )
  }



  // /definition POST Route✅ Code✅
  async addDefinition(slug: string, defaultValue: string, productId: string) {
    return firstValueFrom(this.http.post<Definition>(`/api/definition`, {slug, defaultValue, productId}))
  }

  // /definition/:id PATCH Route✅ Code✅
  async updateDefinition(id: string, slug: string, defaultValue: string) {
    return firstValueFrom(this.http.patch<Definition>(`/api/definition/${id}`, {slug, defaultValue}))
  }

  // /definition/import POST Route✅ Code✅
  async importDefinitions(definitions: {slug: string, defaultValue: string}[], productId: string) {
    return firstValueFrom(this.http.post<Definition[]>(`/api/definition/import`, {definitions, productId}))
  }

  // /definition/:id DELETE Route✅
  async deleteDefinition(id: string) {
    return firstValueFrom(this.http.delete<Definition>(`/api/definition/${id}`))
  }

  // /definition/:id/set-link Route✅ Code✅
  async setLinkForDefinition(id: string, link: string | null) {
    return firstValueFrom(this.http.post<Definition>(`/api/definition/${id}/set-link`, {link}))
  }

  // FIXME: create /api/definition/:id/set-pitcture (upload file OR clear)




  // private async publishDevTranslationsForProduct(id: string) {
  //   const languages = (await this.getLanguagesByProductId(id)).filter(l => !l.isDisabled)
  //   await this.deleteOldTranslationsForProduct(id, "dev")
  //   await this.uploadTranslationsFilesForLanguages(languages, "dev")
  // }

  // private getLanguageById(id: string) {
  //   return DataStore.query(Language, id)
  // }

  // private async getTranslationsByLanguageId(languageId: string) {
  //   return (await DataStore.query(Translation))
  //     .filter(d => d.language?.id === languageId)
  // }

  // private async getDefinitionBySlug(slug: string) {
  //   return (await DataStore.query(Definition)).filter(d => d.slug === slug)[0]
  // }

  // private async deleteOldTranslationsForProduct(id: string, env: 'dev' | 'preprod' | 'prod') {
  //   const files = await Storage.list(`${id}/${env}/`)

  //   const promises = files.map(pf => {
  //     return Storage.remove(pf.key!);
  //   })
  //   return Promise.all(promises)
  // }

  // private async uploadTranslationsFilesForLanguages(languages: Language[], env: 'dev' | 'preprod') {
  //   const promises = languages.map(async l => {
  //     return new Promise(async (resolve, reject) => {
  //       const translations = await this.getTranslationsByLanguageId(l.id)
  //       const fileContent = translations.reduce((prev, t) => {
  //         return {...prev, [t.definition!.slug]: t.value}
  //       }, {})
  //       try {
  //         const result = await Storage.put(`${l.product!.id}/${env}/${l.code}.json`, fileContent)

  //         resolve(result)
  //       } catch (err) {
  //         console.warn(err)
  //         reject("cannot write to s3")
  //       }
  //     })
  //   })

  //   await Promise.all(promises)
  // }

  async listUsers() {
    return this.adminQueries.listUsers()
  }
}
