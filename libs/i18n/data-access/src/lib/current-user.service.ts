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
      languages: await this.canAccessLanguagesForProduct(product),
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

  async canAccessLanguagesForProduct(product: Product): Promise<boolean> {
    const userIsAdmin = await this.isAdmin()
    const userPayload = await this.getPayload()
    return userIsAdmin || (product.authorizations?.find(a => a?.id === userPayload.sub)?.authorizations.languages || false)
  }

  async canAccessTranslationsForProduct(product: Product): Promise<boolean> {
    const userIsAdmin = await this.isAdmin()
    const userPayload = await this.getPayload()
    return userIsAdmin || (product.authorizations?.find(a => a?.id === userPayload.sub)?.authorizations.translations?.length !== 0 || false)
  }

  async getPayload(): Promise<UserPayload> {
    return (await Auth.currentSession()).getIdToken().payload as UserPayload
  }
}