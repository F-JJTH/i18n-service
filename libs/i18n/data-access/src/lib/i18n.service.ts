import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
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
  constructor(
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
  async createProduct(createproductOptions: CreateProductRequest) {
    return firstValueFrom(this.http.post<Product>(`/api/product`, createproductOptions))
  }

  // /product/:id DELETE Route✅ Code✅
  async deleteProduct(id: string) {
    return firstValueFrom(this.http.delete<Product>(`/api/product/${id}`))
  }

  // /product/:id/publish/:env GET Route✅ Code✅
  async publishPreprodTranslationsForProduct(id: string) {
    return firstValueFrom(this.http.get(`/api/product/${id}/publish/preprod`))
  }

  // /product/:id/publish/:env GET Route✅ Code✅
  async publishProdTranslationsForProduct(id: string) {
    return firstValueFrom(this.http.get(`/api/product/${id}/publish/prod`))
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

  // /translation/import POST Route✅ Code✅
  async importTranslations(translations: {slug: string, translation: string}[], productId: string, languageId: string) {
    return firstValueFrom(this.http.post<Translation[]>(`/api/translation/import`, {translations, productId, languageId}))
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


  // /user Route✅ Code✅
  async listUsers() {
    return firstValueFrom(this.http.get<any>(`/api/user`))
  }
}
