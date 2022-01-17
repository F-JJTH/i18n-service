import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";



export declare class MemberAuthorization {
  readonly definitions: boolean;
  readonly settings: boolean;
  readonly deploy: boolean;
  readonly translations?: (string | null)[];
  constructor(init: ModelInit<MemberAuthorization>);
}

export declare class Member {
  readonly id: string;
  readonly email: string;
  readonly authorizations: MemberAuthorization;
  constructor(init: ModelInit<Member>);
}

type ProductMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type LanguageMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type TranslationMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type DefinitionMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class Product {
  readonly id: string;
  readonly name: string;
  readonly defaultLanguage: string;
  readonly languages?: (Language | null)[];
  readonly definitions?: (Definition | null)[];
  readonly translations?: (Translation | null)[];
  readonly members?: (string | null)[];
  readonly authorizations?: (Member | null)[];
  readonly publishedPreprodAt?: string;
  readonly publishedProdAt?: string;
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
  readonly isDisabled?: boolean;
  readonly product?: Product;
  readonly translations?: (Translation | null)[];
  readonly isRequireTranslatorAction?: boolean;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Language, LanguageMetaData>);
  static copyOf(source: Language, mutator: (draft: MutableModel<Language, LanguageMetaData>) => MutableModel<Language, LanguageMetaData> | void): Language;
}

export declare class Translation {
  readonly id: string;
  readonly definition?: Definition;
  readonly language?: Language;
  readonly product?: Product;
  readonly value?: string;
  readonly isRequireTranslatorAction?: boolean;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  readonly definitionTranslationsId?: string;
  constructor(init: ModelInit<Translation, TranslationMetaData>);
  static copyOf(source: Translation, mutator: (draft: MutableModel<Translation, TranslationMetaData>) => MutableModel<Translation, TranslationMetaData> | void): Translation;
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