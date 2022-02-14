import { Injectable } from '@angular/core';
import { Auth } from 'aws-amplify';
import { Product } from './api.interface';

export interface UserPayload {
  "cognito:groups"?: string[]
  "cognito:username": string
  email: string
  email_verified: boolean
  sub: string
}

@Injectable({providedIn: 'root'})
export class CurrentUserService {
  idToken: string = ''
  accessToken: string = ''

  constructor() {
    this.setCurrentSession()
  }

  setCurrentSession() {
    if (this.idToken) return Promise.resolve()

    return Auth.currentSession().then(session => {
      this.idToken = session.getIdToken().getJwtToken()
      this.accessToken = session.getAccessToken().getJwtToken()
    })
  }

  async isAdmin() {
    return (await this.getPayload())['cognito:groups']?.includes('Admin') || false
  }

  async getAuthorizationsForProduct(product: Product) {
    return {
      definitions: await this.canAccessDefinitionsForProduct(product),
      deploy: await this.canAccessDeployForProduct(product),
      settings: await this.canAccessSettingsForProduct(product),
      translations: await this.canAccessTranslationsForProduct(product),
    }
  }

  async canAccessDefinitionsForProduct(product: Product): Promise<boolean> {
    const userIsAdmin = await this.isAdmin()
    const userPayload = await this.getPayload()
    return userIsAdmin || (product.authorizations?.find(a => a?.memberId === userPayload.sub)?.definitions || false)
  }

  async canAccessDeployForProduct(product: Product): Promise<boolean> {
    const userIsAdmin = await this.isAdmin()
    const userPayload = await this.getPayload()
    return userIsAdmin || (product.authorizations?.find(a => a?.memberId === userPayload.sub)?.deploy || false)
  }

  async canAccessSettingsForProduct(product: Product): Promise<boolean> {
    const userIsAdmin = await this.isAdmin()
    const userPayload = await this.getPayload()
    return userIsAdmin || (product.authorizations?.find(a => a?.memberId === userPayload.sub)?.settings || false)
  }

  async canAccessTranslationsForProduct(product: Product): Promise<boolean> {
    const userIsAdmin = await this.isAdmin()
    const userPayload = await this.getPayload()

    if (userIsAdmin) {
      return true
    }

    const productAuthorizations = product.authorizations?.find(a => a?.memberId === userPayload.sub)
    if (productAuthorizations) {
      return productAuthorizations.translations?.length !== 0 || productAuthorizations.validator || false
    }

    return false
  }

  async canAccessValidateTranslationsForProduct(product: Product): Promise<boolean> {
    const userIsAdmin = await this.isAdmin()
    const userPayload = await this.getPayload()

    return userIsAdmin || product.authorizations?.find(a => a?.memberId === userPayload.sub)?.validator || false
  }

  async getPayload(): Promise<UserPayload> {
    return (await Auth.currentSession()).getIdToken().payload as UserPayload
  }

  async getLandingPageForProduct(product: Product): Promise<string> {
    const isAdmin = await this.isAdmin()
    const authorizations = await this.getAuthorizationsForProduct(product)
    switch (true) {
      case isAdmin:
      case authorizations.definitions:
        return 'definitions'
      case authorizations.translations:
        return 'translations'
      case authorizations.deploy:
        return 'deploy'
      case authorizations.settings:
        return 'settings'
      default:
        return ''
    }

  }
}
