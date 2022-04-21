import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { IEnvironment, PublishEnvironment } from "@kizeo/i18n/util";
import { firstValueFrom } from 'rxjs';
import {
  CreateProductRequest,
  Definition,
  Language,
  MemberAuthorization,
  Product,
  Translation
} from "./api.interface";

export type ProductListItem = Product & {page: string}

@Injectable({providedIn: 'root'})
export class I18nService {

  apiUrl = ''
  
  constructor(
    private readonly http: HttpClient,
    @Inject('ENVIRONMENT') private readonly environment: IEnvironment,
  ) {
    this.apiUrl = this.environment.apiUrl
  }

  // /product GET Route✅ Code✅
  async getProducts() {
    return firstValueFrom(this.http.get<Product[]>(`${this.apiUrl}/api/product`))
  }

  // /product/:id GET Route✅ Code✅
  getProductById(id: string) {
    return firstValueFrom(this.http.get<Product>(`${this.apiUrl}/api/product/${id}`))
  }

  // /product/:id PATCH Route✅ Code✅
  async updateProduct(options: {name: string, isSlackNotificationEnabled: boolean, slackNotificationChannelName?: string}, id: string) {
    return firstValueFrom(this.http.patch<Product>(`${this.apiUrl}/api/product/${id}`, {
      name: options.name,
      isSlackNotificationEnabled: options.isSlackNotificationEnabled,
      slackNotificationChannelName: options.slackNotificationChannelName,
    }))
  }

  // /product POST Route✅ Code✅
  async createProduct(createproductOptions: CreateProductRequest) {
    return firstValueFrom(this.http.post<Product>(`${this.apiUrl}/api/product`, createproductOptions))
  }

  // /product/:id DELETE Route✅ Code✅
  async deleteProduct(id: string) {
    return firstValueFrom(this.http.delete<Product>(`${this.apiUrl}/api/product/${id}`))
  }

  // /product/:id/publish/:env GET Route✅ Code✅
  async publishPreprodTranslationsForProduct(id: string) {
    return firstValueFrom(this.http.get(`${this.apiUrl}/api/product/${id}/publish/preprod`))
  }

  // /product/:id/publish/:env GET Route✅ Code✅
  async publishProdTranslationsForProduct(id: string) {
    return firstValueFrom(this.http.get(`${this.apiUrl}/api/product/${id}/publish/prod`))
  }

  // /product/:id/list-published/:env GET Route✅ Code✅
  async listPublishedTranslationsForProduct<T>(id: string, env: PublishEnvironment): Promise<T> {
    return firstValueFrom(this.http.get<T>(`${this.apiUrl}/api/product/${id}/list-published/${env}`))
  }

  // /product/:id/dl-translation/:env/:languageCode Route✅ Code✅
  async downloadTranslationFileForProduct(id: string, env: PublishEnvironment, languageCode: string) {
    const result = await firstValueFrom(this.http.get<{link: string}>(`${this.apiUrl}/api/product/${id}/dl-translation/${env}/${languageCode}`))
    window.open(result.link)
  }

  // /product/:id/member POST Route✅ Code✅
  async addMemberToProduct(memberId: string, memberEmail: string, authorizations: MemberAuthorization, productId: string) {
    return firstValueFrom(this.http.post<Product>(`${this.apiUrl}/api/product/${productId}/member`, {memberId, memberEmail, authorizations}))
  }

  // /product/:id/member PATCH Route✅ Code✅
  async updateMemberForProduct(memberId: string, authorizations: MemberAuthorization, productId: string) {
    return firstValueFrom(this.http.patch<Product>(`${this.apiUrl}/api/product/${productId}/member/${memberId}`, {authorizations}))
  }

  // /product/:id/member DELETE Route✅ Code✅
  async deleteMemberFromProduct(memberId: string, productId: string) {
    return firstValueFrom(this.http.delete<Product>(`${this.apiUrl}/api/product/${productId}/member/${memberId}`))
  }

  // /product/:id/language GET Route✅ Code✅
  async getLanguagesByProductId(productId: string) {
    return firstValueFrom(this.http.get<Language[]>(`${this.apiUrl}/api/product/${productId}/language`))
  }

  // /product/:id/definition GET Route✅ Code✅
  async getDefinitionsByProductId(productId: string) {
    return firstValueFrom(this.http.get<Definition[]>(`${this.apiUrl}/api/product/${productId}/definition`))
  }

  // /product/:id/translation GET Route✅ Code✅
  async getTranslationsByProductId(productId: string) {
    return firstValueFrom(this.http.get<Translation[]>(`${this.apiUrl}/api/product/${productId}/translation`))
  }

  async listAvailableTranslationsForProduct(productId: string) {
    return firstValueFrom(this.http.get<string[]>(`${this.apiUrl}/api/product/${productId}/list-available-translations`))
  }




  // /language POST Route✅ Code✅
  async addLanguage(languageCode: string, languageLabel: string, productId: string) {
    return firstValueFrom(this.http.post<Language>(`${this.apiUrl}/api/language`, {languageCode, languageLabel, productId}))
  }

  // /language/:id/is-disabled Route✅ Code✅
  async setIsDisabledForLanguage(id: string, isDisabled: boolean) {
    return firstValueFrom(this.http.post<Language>(`${this.apiUrl}/api/language/${id}/is-disabled`, {isDisabled}))
  }

  // /language DELETE Route✅ Code✅
  async deleteLanguage(languageId: string) {
    return firstValueFrom(this.http.delete<boolean>(`${this.apiUrl}/api/language/${languageId}`))
  }


  // /translation/:id/is-valid POST Route✅ Code✅
  async setIsValidForTranslation(id: string, isValid: boolean) {
    return firstValueFrom(this.http.post<Translation>(`${this.apiUrl}/api/translation/${id}/is-valid`, {isValid}))
  }

  // /translation PATCH Route✅ Code✅
  async updateTranslations(translationItems: { id: string, value: string | null }[]) {
    return firstValueFrom(this.http.patch<Translation>(`${this.apiUrl}/api/translation`, {translationItems}))
  }

  // /translation/import POST Route✅ Code✅
  async importTranslations(translations: {slug: string, translation: string}[], productId: string, languageId: string) {
    return firstValueFrom(this.http.post<Translation[]>(`${this.apiUrl}/api/translation/import`, {translations, productId, languageId}))
  }




  // /definition POST Route✅ Code✅
  async addDefinition(slug: string, defaultValue: string, productId: string) {
    return firstValueFrom(this.http.post<Definition>(`${this.apiUrl}/api/definition`, {slug, defaultValue, productId}))
  }

  // /definition/:id PATCH Route✅ Code✅
  async updateDefinition(id: string, slug: string, defaultValue: string) {
    return firstValueFrom(this.http.patch<Definition>(`${this.apiUrl}/api/definition/${id}`, {slug, defaultValue}))
  }

  // /definition/import POST Route✅ Code✅
  async importDefinitions(definitions: {slug: string, defaultValue: string}[], productId: string) {
    return firstValueFrom(this.http.post<Definition[]>(`${this.apiUrl}/api/definition/import`, {definitions, productId}))
  }

  // /definition/:id DELETE Route✅
  async deleteDefinition(id: string) {
    return firstValueFrom(this.http.delete<Definition>(`${this.apiUrl}/api/definition/${id}`))
  }

  // /definition/:id/set-link Route✅ Code✅
  async setLinkForDefinition(id: string, link: string | null) {
    return firstValueFrom(this.http.post<Definition>(`${this.apiUrl}/api/definition/${id}/set-link`, {link}))
  }

  // /api/definition/:id/set-picture Route✅ Code✅
  setPictureForDefinition(id: string, selectedFile: File | null) {
    if (selectedFile) {
      const formData = new FormData()
      formData.append('file', selectedFile)
      return firstValueFrom(this.http.post(`${this.apiUrl}/api/definition/${id}/set-picture`, formData))
    } else {
      return firstValueFrom(this.http.post(`${this.apiUrl}/api/definition/${id}/set-picture`, null))
    }
  }


  // /user Route✅ Code✅
  async listUsers() {
    return firstValueFrom(this.http.get<any>(`${this.apiUrl}/api/user`))
  }
}
