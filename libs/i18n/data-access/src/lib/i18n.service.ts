import { Injectable } from "@angular/core";
import { DataStore } from "aws-amplify";
import { Definition, Language, Product, Translation } from "..";

@Injectable({providedIn: 'root'})
export class I18nService {
  constructor() { }

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

    const languages = (await DataStore.query(Language))
      .filter(d => d.product?.id === product.id)

    languages.forEach(language => {
      const value = language.isDefault ? definition.defaultValue : ""
      DataStore.save(new Translation({
        definition,
        language,
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
        value: "",
        isRequireTranslatorAction: true
      }))
    })

    return Promise.resolve()
  }
}