import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





type ProductMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type LanguageMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type DefinitionMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type TranslationMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class Product {
  readonly id: string;
  readonly name: string;
  readonly defaultLanguage: string;
  readonly languages?: (Language | null)[];
  readonly definitions?: (Definition | null)[];
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Product, ProductMetaData>);
  static copyOf(source: Product, mutator: (draft: MutableModel<Product, ProductMetaData>) => MutableModel<Product, ProductMetaData> | void): Product;
}

export declare class Language {
  readonly id: string;
  readonly name: string;
  readonly code: string;
  readonly isDefault: boolean;
  readonly product?: Product;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Language, LanguageMetaData>);
  static copyOf(source: Language, mutator: (draft: MutableModel<Language, LanguageMetaData>) => MutableModel<Language, LanguageMetaData> | void): Language;
}

export declare class Definition {
  readonly id: string;
  readonly slug: string;
  readonly defaultValue: string;
  readonly product?: Product;
  readonly translations?: (Translation | null)[];
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Definition, DefinitionMetaData>);
  static copyOf(source: Definition, mutator: (draft: MutableModel<Definition, DefinitionMetaData>) => MutableModel<Definition, DefinitionMetaData> | void): Definition;
}

export declare class Translation {
  readonly id: string;
  readonly definition?: Definition;
  readonly value?: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Translation, TranslationMetaData>);
  static copyOf(source: Translation, mutator: (draft: MutableModel<Translation, TranslationMetaData>) => MutableModel<Translation, TranslationMetaData> | void): Translation;
}