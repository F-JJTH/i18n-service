import { Injectable } from '@angular/core';
import { Auth } from 'aws-amplify';
import { Product } from '..';

export interface UserPayload {
  "cognito:groups"?: string[]
  "cognito:username": string
  email: string
  email_verified: boolean
  sub: string
}

@Injectable({providedIn: 'root'})
export class CurrentUserService {
  constructor() { }

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
    return userIsAdmin || (product.authorizations?.find(a => a?.id === userPayload.sub)?.authorizations.definitions || false)
  }

  async canAccessDeployForProduct(product: Product): Promise<boolean> {
    const userIsAdmin = await this.isAdmin()
    const userPayload = await this.getPayload()
    return userIsAdmin || (product.authorizations?.find(a => a?.id === userPayload.sub)?.authorizations.deploy || false)
  }

  async canAccessSettingsForProduct(product: Product): Promise<boolean> {
    const userIsAdmin = await this.isAdmin()
    const userPayload = await this.getPayload()
    return userIsAdmin || (product.authorizations?.find(a => a?.id === userPayload.sub)?.authorizations.settings || false)
  }

  async canAccessTranslationsForProduct(product: Product): Promise<boolean> {
    const userIsAdmin = await this.isAdmin()
    const userPayload = await this.getPayload()
    return userIsAdmin || (product.authorizations?.find(a => a?.id === userPayload.sub)?.authorizations.translations?.length !== 0 || false)
  }

  async getPayload(): Promise<UserPayload> {
    return (await Auth.currentSession()).getIdToken().payload as UserPayload
  }

  async getLandingPageForProduct(product: Product): Promise<string> {
    const authorizations = await this.getAuthorizationsForProduct(product)
    switch (true) {
      case authorizations.definitions:
        return 'definitions'
      case authorizations.translations:
        return 'translations'
      case authorizations.deploy:
        return 'deploy'
      case authorizations.settings:
        return 'settings'
      default:
        return '/'
    }

  }
}
