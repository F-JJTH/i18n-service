/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.
import { Injectable } from "@angular/core";
import API, { graphqlOperation, GraphQLResult } from "@aws-amplify/api-graphql";
import { Observable } from "zen-observable-ts";

export interface SubscriptionResponse<T> {
  value: GraphQLResult<T>;
}

export type __SubscriptionContainer = {
  onCreateProduct: OnCreateProductSubscription;
  onUpdateProduct: OnUpdateProductSubscription;
  onDeleteProduct: OnDeleteProductSubscription;
  onCreateLanguage: OnCreateLanguageSubscription;
  onUpdateLanguage: OnUpdateLanguageSubscription;
  onDeleteLanguage: OnDeleteLanguageSubscription;
  onCreateDefinition: OnCreateDefinitionSubscription;
  onUpdateDefinition: OnUpdateDefinitionSubscription;
  onDeleteDefinition: OnDeleteDefinitionSubscription;
  onCreateTranslation: OnCreateTranslationSubscription;
  onUpdateTranslation: OnUpdateTranslationSubscription;
  onDeleteTranslation: OnDeleteTranslationSubscription;
};

export type CreateProductInput = {
  id?: string | null;
  name: string;
  defaultLanguage: string;
  members?: Array<string | null> | null;
  authorizations?: Array<MemberInput | null> | null;
  _version?: number | null;
};

export type MemberInput = {
  id: string;
  email: string;
  authorizations: MemberAuthorizationInput;
};

export type MemberAuthorizationInput = {
  definitions: boolean;
  languages: boolean;
  deploy: boolean;
  translations?: Array<string | null> | null;
};

export type ModelProductConditionInput = {
  name?: ModelStringInput | null;
  defaultLanguage?: ModelStringInput | null;
  members?: ModelStringInput | null;
  and?: Array<ModelProductConditionInput | null> | null;
  or?: Array<ModelProductConditionInput | null> | null;
  not?: ModelProductConditionInput | null;
};

export type ModelStringInput = {
  ne?: string | null;
  eq?: string | null;
  le?: string | null;
  lt?: string | null;
  ge?: string | null;
  gt?: string | null;
  contains?: string | null;
  notContains?: string | null;
  between?: Array<string | null> | null;
  beginsWith?: string | null;
  attributeExists?: boolean | null;
  attributeType?: ModelAttributeTypes | null;
  size?: ModelSizeInput | null;
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null"
}

export type ModelSizeInput = {
  ne?: number | null;
  eq?: number | null;
  le?: number | null;
  lt?: number | null;
  ge?: number | null;
  gt?: number | null;
  between?: Array<number | null> | null;
};

export type Product = {
  __typename: "Product";
  id: string;
  name: string;
  defaultLanguage: string;
  languages?: ModelLanguageConnection | null;
  definitions?: ModelDefinitionConnection | null;
  members?: Array<string | null> | null;
  authorizations?: Array<Member | null> | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type ModelLanguageConnection = {
  __typename: "ModelLanguageConnection";
  items: Array<Language | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type Language = {
  __typename: "Language";
  id: string;
  name: string;
  code: string;
  isDefault: boolean;
  product: Product;
  translations?: ModelTranslationConnection | null;
  isRequireTranslatorAction?: boolean | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  productLanguagesId?: string | null;
};

export type ModelTranslationConnection = {
  __typename: "ModelTranslationConnection";
  items: Array<Translation | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type Translation = {
  __typename: "Translation";
  id: string;
  definition: Definition;
  language: Language;
  value?: string | null;
  isRequireTranslatorAction?: boolean | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  languageTranslationsId?: string | null;
  definitionTranslationsId?: string | null;
};

export type Definition = {
  __typename: "Definition";
  id: string;
  slug: string;
  defaultValue: string;
  product: Product;
  translations?: ModelTranslationConnection | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  productDefinitionsId?: string | null;
};

export type ModelDefinitionConnection = {
  __typename: "ModelDefinitionConnection";
  items: Array<Definition | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type Member = {
  __typename: "Member";
  id: string;
  email: string;
  authorizations: MemberAuthorization;
};

export type MemberAuthorization = {
  __typename: "MemberAuthorization";
  definitions: boolean;
  languages: boolean;
  deploy: boolean;
  translations?: Array<string | null> | null;
};

export type UpdateProductInput = {
  id: string;
  name?: string | null;
  defaultLanguage?: string | null;
  members?: Array<string | null> | null;
  authorizations?: Array<MemberInput | null> | null;
  _version?: number | null;
};

export type DeleteProductInput = {
  id: string;
  _version?: number | null;
};

export type CreateLanguageInput = {
  id?: string | null;
  name: string;
  code: string;
  isDefault: boolean;
  isRequireTranslatorAction?: boolean | null;
  _version?: number | null;
  productLanguagesId?: string | null;
};

export type ModelLanguageConditionInput = {
  name?: ModelStringInput | null;
  code?: ModelStringInput | null;
  isDefault?: ModelBooleanInput | null;
  isRequireTranslatorAction?: ModelBooleanInput | null;
  and?: Array<ModelLanguageConditionInput | null> | null;
  or?: Array<ModelLanguageConditionInput | null> | null;
  not?: ModelLanguageConditionInput | null;
  productLanguagesId?: ModelIDInput | null;
};

export type ModelBooleanInput = {
  ne?: boolean | null;
  eq?: boolean | null;
  attributeExists?: boolean | null;
  attributeType?: ModelAttributeTypes | null;
};

export type ModelIDInput = {
  ne?: string | null;
  eq?: string | null;
  le?: string | null;
  lt?: string | null;
  ge?: string | null;
  gt?: string | null;
  contains?: string | null;
  notContains?: string | null;
  between?: Array<string | null> | null;
  beginsWith?: string | null;
  attributeExists?: boolean | null;
  attributeType?: ModelAttributeTypes | null;
  size?: ModelSizeInput | null;
};

export type UpdateLanguageInput = {
  id: string;
  name?: string | null;
  code?: string | null;
  isDefault?: boolean | null;
  isRequireTranslatorAction?: boolean | null;
  _version?: number | null;
  productLanguagesId?: string | null;
};

export type DeleteLanguageInput = {
  id: string;
  _version?: number | null;
};

export type CreateDefinitionInput = {
  id?: string | null;
  slug: string;
  defaultValue: string;
  _version?: number | null;
  productDefinitionsId?: string | null;
};

export type ModelDefinitionConditionInput = {
  slug?: ModelStringInput | null;
  defaultValue?: ModelStringInput | null;
  and?: Array<ModelDefinitionConditionInput | null> | null;
  or?: Array<ModelDefinitionConditionInput | null> | null;
  not?: ModelDefinitionConditionInput | null;
  productDefinitionsId?: ModelIDInput | null;
};

export type UpdateDefinitionInput = {
  id: string;
  slug?: string | null;
  defaultValue?: string | null;
  _version?: number | null;
  productDefinitionsId?: string | null;
};

export type DeleteDefinitionInput = {
  id: string;
  _version?: number | null;
};

export type CreateTranslationInput = {
  id?: string | null;
  value?: string | null;
  isRequireTranslatorAction?: boolean | null;
  _version?: number | null;
  languageTranslationsId?: string | null;
  definitionTranslationsId?: string | null;
};

export type ModelTranslationConditionInput = {
  value?: ModelStringInput | null;
  isRequireTranslatorAction?: ModelBooleanInput | null;
  and?: Array<ModelTranslationConditionInput | null> | null;
  or?: Array<ModelTranslationConditionInput | null> | null;
  not?: ModelTranslationConditionInput | null;
  languageTranslationsId?: ModelIDInput | null;
  definitionTranslationsId?: ModelIDInput | null;
};

export type UpdateTranslationInput = {
  id: string;
  value?: string | null;
  isRequireTranslatorAction?: boolean | null;
  _version?: number | null;
  languageTranslationsId?: string | null;
  definitionTranslationsId?: string | null;
};

export type DeleteTranslationInput = {
  id: string;
  _version?: number | null;
};

export type ModelProductFilterInput = {
  id?: ModelIDInput | null;
  name?: ModelStringInput | null;
  defaultLanguage?: ModelStringInput | null;
  members?: ModelStringInput | null;
  and?: Array<ModelProductFilterInput | null> | null;
  or?: Array<ModelProductFilterInput | null> | null;
  not?: ModelProductFilterInput | null;
};

export type ModelProductConnection = {
  __typename: "ModelProductConnection";
  items: Array<Product | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type ModelLanguageFilterInput = {
  id?: ModelIDInput | null;
  name?: ModelStringInput | null;
  code?: ModelStringInput | null;
  isDefault?: ModelBooleanInput | null;
  isRequireTranslatorAction?: ModelBooleanInput | null;
  and?: Array<ModelLanguageFilterInput | null> | null;
  or?: Array<ModelLanguageFilterInput | null> | null;
  not?: ModelLanguageFilterInput | null;
  productLanguagesId?: ModelIDInput | null;
};

export type ModelDefinitionFilterInput = {
  id?: ModelIDInput | null;
  slug?: ModelStringInput | null;
  defaultValue?: ModelStringInput | null;
  and?: Array<ModelDefinitionFilterInput | null> | null;
  or?: Array<ModelDefinitionFilterInput | null> | null;
  not?: ModelDefinitionFilterInput | null;
  productDefinitionsId?: ModelIDInput | null;
};

export type ModelTranslationFilterInput = {
  id?: ModelIDInput | null;
  value?: ModelStringInput | null;
  isRequireTranslatorAction?: ModelBooleanInput | null;
  and?: Array<ModelTranslationFilterInput | null> | null;
  or?: Array<ModelTranslationFilterInput | null> | null;
  not?: ModelTranslationFilterInput | null;
  languageTranslationsId?: ModelIDInput | null;
  definitionTranslationsId?: ModelIDInput | null;
};

export type CreateProductMutation = {
  __typename: "Product";
  id: string;
  name: string;
  defaultLanguage: string;
  languages?: {
    __typename: "ModelLanguageConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  definitions?: {
    __typename: "ModelDefinitionConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  members?: Array<string | null> | null;
  authorizations?: Array<{
    __typename: "Member";
    id: string;
    email: string;
  } | null> | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type UpdateProductMutation = {
  __typename: "Product";
  id: string;
  name: string;
  defaultLanguage: string;
  languages?: {
    __typename: "ModelLanguageConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  definitions?: {
    __typename: "ModelDefinitionConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  members?: Array<string | null> | null;
  authorizations?: Array<{
    __typename: "Member";
    id: string;
    email: string;
  } | null> | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type DeleteProductMutation = {
  __typename: "Product";
  id: string;
  name: string;
  defaultLanguage: string;
  languages?: {
    __typename: "ModelLanguageConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  definitions?: {
    __typename: "ModelDefinitionConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  members?: Array<string | null> | null;
  authorizations?: Array<{
    __typename: "Member";
    id: string;
    email: string;
  } | null> | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type CreateLanguageMutation = {
  __typename: "Language";
  id: string;
  name: string;
  code: string;
  isDefault: boolean;
  product: {
    __typename: "Product";
    id: string;
    name: string;
    defaultLanguage: string;
    members?: Array<string | null> | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  };
  translations?: {
    __typename: "ModelTranslationConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  isRequireTranslatorAction?: boolean | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  productLanguagesId?: string | null;
};

export type UpdateLanguageMutation = {
  __typename: "Language";
  id: string;
  name: string;
  code: string;
  isDefault: boolean;
  product: {
    __typename: "Product";
    id: string;
    name: string;
    defaultLanguage: string;
    members?: Array<string | null> | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  };
  translations?: {
    __typename: "ModelTranslationConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  isRequireTranslatorAction?: boolean | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  productLanguagesId?: string | null;
};

export type DeleteLanguageMutation = {
  __typename: "Language";
  id: string;
  name: string;
  code: string;
  isDefault: boolean;
  product: {
    __typename: "Product";
    id: string;
    name: string;
    defaultLanguage: string;
    members?: Array<string | null> | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  };
  translations?: {
    __typename: "ModelTranslationConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  isRequireTranslatorAction?: boolean | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  productLanguagesId?: string | null;
};

export type CreateDefinitionMutation = {
  __typename: "Definition";
  id: string;
  slug: string;
  defaultValue: string;
  product: {
    __typename: "Product";
    id: string;
    name: string;
    defaultLanguage: string;
    members?: Array<string | null> | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  };
  translations?: {
    __typename: "ModelTranslationConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  productDefinitionsId?: string | null;
};

export type UpdateDefinitionMutation = {
  __typename: "Definition";
  id: string;
  slug: string;
  defaultValue: string;
  product: {
    __typename: "Product";
    id: string;
    name: string;
    defaultLanguage: string;
    members?: Array<string | null> | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  };
  translations?: {
    __typename: "ModelTranslationConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  productDefinitionsId?: string | null;
};

export type DeleteDefinitionMutation = {
  __typename: "Definition";
  id: string;
  slug: string;
  defaultValue: string;
  product: {
    __typename: "Product";
    id: string;
    name: string;
    defaultLanguage: string;
    members?: Array<string | null> | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  };
  translations?: {
    __typename: "ModelTranslationConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  productDefinitionsId?: string | null;
};

export type CreateTranslationMutation = {
  __typename: "Translation";
  id: string;
  definition: {
    __typename: "Definition";
    id: string;
    slug: string;
    defaultValue: string;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    productDefinitionsId?: string | null;
  };
  language: {
    __typename: "Language";
    id: string;
    name: string;
    code: string;
    isDefault: boolean;
    isRequireTranslatorAction?: boolean | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    productLanguagesId?: string | null;
  };
  value?: string | null;
  isRequireTranslatorAction?: boolean | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  languageTranslationsId?: string | null;
  definitionTranslationsId?: string | null;
};

export type UpdateTranslationMutation = {
  __typename: "Translation";
  id: string;
  definition: {
    __typename: "Definition";
    id: string;
    slug: string;
    defaultValue: string;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    productDefinitionsId?: string | null;
  };
  language: {
    __typename: "Language";
    id: string;
    name: string;
    code: string;
    isDefault: boolean;
    isRequireTranslatorAction?: boolean | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    productLanguagesId?: string | null;
  };
  value?: string | null;
  isRequireTranslatorAction?: boolean | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  languageTranslationsId?: string | null;
  definitionTranslationsId?: string | null;
};

export type DeleteTranslationMutation = {
  __typename: "Translation";
  id: string;
  definition: {
    __typename: "Definition";
    id: string;
    slug: string;
    defaultValue: string;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    productDefinitionsId?: string | null;
  };
  language: {
    __typename: "Language";
    id: string;
    name: string;
    code: string;
    isDefault: boolean;
    isRequireTranslatorAction?: boolean | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    productLanguagesId?: string | null;
  };
  value?: string | null;
  isRequireTranslatorAction?: boolean | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  languageTranslationsId?: string | null;
  definitionTranslationsId?: string | null;
};

export type GetProductQuery = {
  __typename: "Product";
  id: string;
  name: string;
  defaultLanguage: string;
  languages?: {
    __typename: "ModelLanguageConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  definitions?: {
    __typename: "ModelDefinitionConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  members?: Array<string | null> | null;
  authorizations?: Array<{
    __typename: "Member";
    id: string;
    email: string;
  } | null> | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type ListProductsQuery = {
  __typename: "ModelProductConnection";
  items: Array<{
    __typename: "Product";
    id: string;
    name: string;
    defaultLanguage: string;
    members?: Array<string | null> | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type SyncProductsQuery = {
  __typename: "ModelProductConnection";
  items: Array<{
    __typename: "Product";
    id: string;
    name: string;
    defaultLanguage: string;
    members?: Array<string | null> | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  } | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type GetLanguageQuery = {
  __typename: "Language";
  id: string;
  name: string;
  code: string;
  isDefault: boolean;
  product: {
    __typename: "Product";
    id: string;
    name: string;
    defaultLanguage: string;
    members?: Array<string | null> | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  };
  translations?: {
    __typename: "ModelTranslationConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  isRequireTranslatorAction?: boolean | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  productLanguagesId?: string | null;
};

export type ListLanguagesQuery = {
  __typename: "ModelLanguageConnection";
  items: Array<{
    __typename: "Language";
    id: string;
    name: string;
    code: string;
    isDefault: boolean;
    isRequireTranslatorAction?: boolean | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    productLanguagesId?: string | null;
  } | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type SyncLanguagesQuery = {
  __typename: "ModelLanguageConnection";
  items: Array<{
    __typename: "Language";
    id: string;
    name: string;
    code: string;
    isDefault: boolean;
    isRequireTranslatorAction?: boolean | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    productLanguagesId?: string | null;
  } | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type GetDefinitionQuery = {
  __typename: "Definition";
  id: string;
  slug: string;
  defaultValue: string;
  product: {
    __typename: "Product";
    id: string;
    name: string;
    defaultLanguage: string;
    members?: Array<string | null> | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  };
  translations?: {
    __typename: "ModelTranslationConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  productDefinitionsId?: string | null;
};

export type ListDefinitionsQuery = {
  __typename: "ModelDefinitionConnection";
  items: Array<{
    __typename: "Definition";
    id: string;
    slug: string;
    defaultValue: string;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    productDefinitionsId?: string | null;
  } | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type SyncDefinitionsQuery = {
  __typename: "ModelDefinitionConnection";
  items: Array<{
    __typename: "Definition";
    id: string;
    slug: string;
    defaultValue: string;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    productDefinitionsId?: string | null;
  } | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type GetTranslationQuery = {
  __typename: "Translation";
  id: string;
  definition: {
    __typename: "Definition";
    id: string;
    slug: string;
    defaultValue: string;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    productDefinitionsId?: string | null;
  };
  language: {
    __typename: "Language";
    id: string;
    name: string;
    code: string;
    isDefault: boolean;
    isRequireTranslatorAction?: boolean | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    productLanguagesId?: string | null;
  };
  value?: string | null;
  isRequireTranslatorAction?: boolean | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  languageTranslationsId?: string | null;
  definitionTranslationsId?: string | null;
};

export type ListTranslationsQuery = {
  __typename: "ModelTranslationConnection";
  items: Array<{
    __typename: "Translation";
    id: string;
    value?: string | null;
    isRequireTranslatorAction?: boolean | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    languageTranslationsId?: string | null;
    definitionTranslationsId?: string | null;
  } | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type SyncTranslationsQuery = {
  __typename: "ModelTranslationConnection";
  items: Array<{
    __typename: "Translation";
    id: string;
    value?: string | null;
    isRequireTranslatorAction?: boolean | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    languageTranslationsId?: string | null;
    definitionTranslationsId?: string | null;
  } | null>;
  nextToken?: string | null;
  startedAt?: number | null;
};

export type OnCreateProductSubscription = {
  __typename: "Product";
  id: string;
  name: string;
  defaultLanguage: string;
  languages?: {
    __typename: "ModelLanguageConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  definitions?: {
    __typename: "ModelDefinitionConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  members?: Array<string | null> | null;
  authorizations?: Array<{
    __typename: "Member";
    id: string;
    email: string;
  } | null> | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type OnUpdateProductSubscription = {
  __typename: "Product";
  id: string;
  name: string;
  defaultLanguage: string;
  languages?: {
    __typename: "ModelLanguageConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  definitions?: {
    __typename: "ModelDefinitionConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  members?: Array<string | null> | null;
  authorizations?: Array<{
    __typename: "Member";
    id: string;
    email: string;
  } | null> | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type OnDeleteProductSubscription = {
  __typename: "Product";
  id: string;
  name: string;
  defaultLanguage: string;
  languages?: {
    __typename: "ModelLanguageConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  definitions?: {
    __typename: "ModelDefinitionConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  members?: Array<string | null> | null;
  authorizations?: Array<{
    __typename: "Member";
    id: string;
    email: string;
  } | null> | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
};

export type OnCreateLanguageSubscription = {
  __typename: "Language";
  id: string;
  name: string;
  code: string;
  isDefault: boolean;
  product: {
    __typename: "Product";
    id: string;
    name: string;
    defaultLanguage: string;
    members?: Array<string | null> | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  };
  translations?: {
    __typename: "ModelTranslationConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  isRequireTranslatorAction?: boolean | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  productLanguagesId?: string | null;
};

export type OnUpdateLanguageSubscription = {
  __typename: "Language";
  id: string;
  name: string;
  code: string;
  isDefault: boolean;
  product: {
    __typename: "Product";
    id: string;
    name: string;
    defaultLanguage: string;
    members?: Array<string | null> | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  };
  translations?: {
    __typename: "ModelTranslationConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  isRequireTranslatorAction?: boolean | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  productLanguagesId?: string | null;
};

export type OnDeleteLanguageSubscription = {
  __typename: "Language";
  id: string;
  name: string;
  code: string;
  isDefault: boolean;
  product: {
    __typename: "Product";
    id: string;
    name: string;
    defaultLanguage: string;
    members?: Array<string | null> | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  };
  translations?: {
    __typename: "ModelTranslationConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  isRequireTranslatorAction?: boolean | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  productLanguagesId?: string | null;
};

export type OnCreateDefinitionSubscription = {
  __typename: "Definition";
  id: string;
  slug: string;
  defaultValue: string;
  product: {
    __typename: "Product";
    id: string;
    name: string;
    defaultLanguage: string;
    members?: Array<string | null> | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  };
  translations?: {
    __typename: "ModelTranslationConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  productDefinitionsId?: string | null;
};

export type OnUpdateDefinitionSubscription = {
  __typename: "Definition";
  id: string;
  slug: string;
  defaultValue: string;
  product: {
    __typename: "Product";
    id: string;
    name: string;
    defaultLanguage: string;
    members?: Array<string | null> | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  };
  translations?: {
    __typename: "ModelTranslationConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  productDefinitionsId?: string | null;
};

export type OnDeleteDefinitionSubscription = {
  __typename: "Definition";
  id: string;
  slug: string;
  defaultValue: string;
  product: {
    __typename: "Product";
    id: string;
    name: string;
    defaultLanguage: string;
    members?: Array<string | null> | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
  };
  translations?: {
    __typename: "ModelTranslationConnection";
    nextToken?: string | null;
    startedAt?: number | null;
  } | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  productDefinitionsId?: string | null;
};

export type OnCreateTranslationSubscription = {
  __typename: "Translation";
  id: string;
  definition: {
    __typename: "Definition";
    id: string;
    slug: string;
    defaultValue: string;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    productDefinitionsId?: string | null;
  };
  language: {
    __typename: "Language";
    id: string;
    name: string;
    code: string;
    isDefault: boolean;
    isRequireTranslatorAction?: boolean | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    productLanguagesId?: string | null;
  };
  value?: string | null;
  isRequireTranslatorAction?: boolean | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  languageTranslationsId?: string | null;
  definitionTranslationsId?: string | null;
};

export type OnUpdateTranslationSubscription = {
  __typename: "Translation";
  id: string;
  definition: {
    __typename: "Definition";
    id: string;
    slug: string;
    defaultValue: string;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    productDefinitionsId?: string | null;
  };
  language: {
    __typename: "Language";
    id: string;
    name: string;
    code: string;
    isDefault: boolean;
    isRequireTranslatorAction?: boolean | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    productLanguagesId?: string | null;
  };
  value?: string | null;
  isRequireTranslatorAction?: boolean | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  languageTranslationsId?: string | null;
  definitionTranslationsId?: string | null;
};

export type OnDeleteTranslationSubscription = {
  __typename: "Translation";
  id: string;
  definition: {
    __typename: "Definition";
    id: string;
    slug: string;
    defaultValue: string;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    productDefinitionsId?: string | null;
  };
  language: {
    __typename: "Language";
    id: string;
    name: string;
    code: string;
    isDefault: boolean;
    isRequireTranslatorAction?: boolean | null;
    createdAt: string;
    updatedAt: string;
    _version: number;
    _deleted?: boolean | null;
    _lastChangedAt: number;
    productLanguagesId?: string | null;
  };
  value?: string | null;
  isRequireTranslatorAction?: boolean | null;
  createdAt: string;
  updatedAt: string;
  _version: number;
  _deleted?: boolean | null;
  _lastChangedAt: number;
  languageTranslationsId?: string | null;
  definitionTranslationsId?: string | null;
};

@Injectable({
  providedIn: "root"
})
export class APIService {
  async CreateProduct(
    input: CreateProductInput,
    condition?: ModelProductConditionInput
  ): Promise<CreateProductMutation> {
    const statement = `mutation CreateProduct($input: CreateProductInput!, $condition: ModelProductConditionInput) {
        createProduct(input: $input, condition: $condition) {
          __typename
          id
          name
          defaultLanguage
          languages {
            __typename
            nextToken
            startedAt
          }
          definitions {
            __typename
            nextToken
            startedAt
          }
          members
          authorizations {
            __typename
            id
            email
          }
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <CreateProductMutation>response.data.createProduct;
  }
  async UpdateProduct(
    input: UpdateProductInput,
    condition?: ModelProductConditionInput
  ): Promise<UpdateProductMutation> {
    const statement = `mutation UpdateProduct($input: UpdateProductInput!, $condition: ModelProductConditionInput) {
        updateProduct(input: $input, condition: $condition) {
          __typename
          id
          name
          defaultLanguage
          languages {
            __typename
            nextToken
            startedAt
          }
          definitions {
            __typename
            nextToken
            startedAt
          }
          members
          authorizations {
            __typename
            id
            email
          }
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <UpdateProductMutation>response.data.updateProduct;
  }
  async DeleteProduct(
    input: DeleteProductInput,
    condition?: ModelProductConditionInput
  ): Promise<DeleteProductMutation> {
    const statement = `mutation DeleteProduct($input: DeleteProductInput!, $condition: ModelProductConditionInput) {
        deleteProduct(input: $input, condition: $condition) {
          __typename
          id
          name
          defaultLanguage
          languages {
            __typename
            nextToken
            startedAt
          }
          definitions {
            __typename
            nextToken
            startedAt
          }
          members
          authorizations {
            __typename
            id
            email
          }
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <DeleteProductMutation>response.data.deleteProduct;
  }
  async CreateLanguage(
    input: CreateLanguageInput,
    condition?: ModelLanguageConditionInput
  ): Promise<CreateLanguageMutation> {
    const statement = `mutation CreateLanguage($input: CreateLanguageInput!, $condition: ModelLanguageConditionInput) {
        createLanguage(input: $input, condition: $condition) {
          __typename
          id
          name
          code
          isDefault
          product {
            __typename
            id
            name
            defaultLanguage
            members
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
          translations {
            __typename
            nextToken
            startedAt
          }
          isRequireTranslatorAction
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          productLanguagesId
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <CreateLanguageMutation>response.data.createLanguage;
  }
  async UpdateLanguage(
    input: UpdateLanguageInput,
    condition?: ModelLanguageConditionInput
  ): Promise<UpdateLanguageMutation> {
    const statement = `mutation UpdateLanguage($input: UpdateLanguageInput!, $condition: ModelLanguageConditionInput) {
        updateLanguage(input: $input, condition: $condition) {
          __typename
          id
          name
          code
          isDefault
          product {
            __typename
            id
            name
            defaultLanguage
            members
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
          translations {
            __typename
            nextToken
            startedAt
          }
          isRequireTranslatorAction
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          productLanguagesId
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <UpdateLanguageMutation>response.data.updateLanguage;
  }
  async DeleteLanguage(
    input: DeleteLanguageInput,
    condition?: ModelLanguageConditionInput
  ): Promise<DeleteLanguageMutation> {
    const statement = `mutation DeleteLanguage($input: DeleteLanguageInput!, $condition: ModelLanguageConditionInput) {
        deleteLanguage(input: $input, condition: $condition) {
          __typename
          id
          name
          code
          isDefault
          product {
            __typename
            id
            name
            defaultLanguage
            members
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
          translations {
            __typename
            nextToken
            startedAt
          }
          isRequireTranslatorAction
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          productLanguagesId
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <DeleteLanguageMutation>response.data.deleteLanguage;
  }
  async CreateDefinition(
    input: CreateDefinitionInput,
    condition?: ModelDefinitionConditionInput
  ): Promise<CreateDefinitionMutation> {
    const statement = `mutation CreateDefinition($input: CreateDefinitionInput!, $condition: ModelDefinitionConditionInput) {
        createDefinition(input: $input, condition: $condition) {
          __typename
          id
          slug
          defaultValue
          product {
            __typename
            id
            name
            defaultLanguage
            members
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
          translations {
            __typename
            nextToken
            startedAt
          }
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          productDefinitionsId
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <CreateDefinitionMutation>response.data.createDefinition;
  }
  async UpdateDefinition(
    input: UpdateDefinitionInput,
    condition?: ModelDefinitionConditionInput
  ): Promise<UpdateDefinitionMutation> {
    const statement = `mutation UpdateDefinition($input: UpdateDefinitionInput!, $condition: ModelDefinitionConditionInput) {
        updateDefinition(input: $input, condition: $condition) {
          __typename
          id
          slug
          defaultValue
          product {
            __typename
            id
            name
            defaultLanguage
            members
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
          translations {
            __typename
            nextToken
            startedAt
          }
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          productDefinitionsId
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <UpdateDefinitionMutation>response.data.updateDefinition;
  }
  async DeleteDefinition(
    input: DeleteDefinitionInput,
    condition?: ModelDefinitionConditionInput
  ): Promise<DeleteDefinitionMutation> {
    const statement = `mutation DeleteDefinition($input: DeleteDefinitionInput!, $condition: ModelDefinitionConditionInput) {
        deleteDefinition(input: $input, condition: $condition) {
          __typename
          id
          slug
          defaultValue
          product {
            __typename
            id
            name
            defaultLanguage
            members
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
          translations {
            __typename
            nextToken
            startedAt
          }
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          productDefinitionsId
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <DeleteDefinitionMutation>response.data.deleteDefinition;
  }
  async CreateTranslation(
    input: CreateTranslationInput,
    condition?: ModelTranslationConditionInput
  ): Promise<CreateTranslationMutation> {
    const statement = `mutation CreateTranslation($input: CreateTranslationInput!, $condition: ModelTranslationConditionInput) {
        createTranslation(input: $input, condition: $condition) {
          __typename
          id
          definition {
            __typename
            id
            slug
            defaultValue
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
            productDefinitionsId
          }
          language {
            __typename
            id
            name
            code
            isDefault
            isRequireTranslatorAction
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
            productLanguagesId
          }
          value
          isRequireTranslatorAction
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          languageTranslationsId
          definitionTranslationsId
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <CreateTranslationMutation>response.data.createTranslation;
  }
  async UpdateTranslation(
    input: UpdateTranslationInput,
    condition?: ModelTranslationConditionInput
  ): Promise<UpdateTranslationMutation> {
    const statement = `mutation UpdateTranslation($input: UpdateTranslationInput!, $condition: ModelTranslationConditionInput) {
        updateTranslation(input: $input, condition: $condition) {
          __typename
          id
          definition {
            __typename
            id
            slug
            defaultValue
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
            productDefinitionsId
          }
          language {
            __typename
            id
            name
            code
            isDefault
            isRequireTranslatorAction
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
            productLanguagesId
          }
          value
          isRequireTranslatorAction
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          languageTranslationsId
          definitionTranslationsId
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <UpdateTranslationMutation>response.data.updateTranslation;
  }
  async DeleteTranslation(
    input: DeleteTranslationInput,
    condition?: ModelTranslationConditionInput
  ): Promise<DeleteTranslationMutation> {
    const statement = `mutation DeleteTranslation($input: DeleteTranslationInput!, $condition: ModelTranslationConditionInput) {
        deleteTranslation(input: $input, condition: $condition) {
          __typename
          id
          definition {
            __typename
            id
            slug
            defaultValue
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
            productDefinitionsId
          }
          language {
            __typename
            id
            name
            code
            isDefault
            isRequireTranslatorAction
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
            productLanguagesId
          }
          value
          isRequireTranslatorAction
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          languageTranslationsId
          definitionTranslationsId
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <DeleteTranslationMutation>response.data.deleteTranslation;
  }
  async GetProduct(id: string): Promise<GetProductQuery> {
    const statement = `query GetProduct($id: ID!) {
        getProduct(id: $id) {
          __typename
          id
          name
          defaultLanguage
          languages {
            __typename
            nextToken
            startedAt
          }
          definitions {
            __typename
            nextToken
            startedAt
          }
          members
          authorizations {
            __typename
            id
            email
          }
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      id
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <GetProductQuery>response.data.getProduct;
  }
  async ListProducts(
    filter?: ModelProductFilterInput,
    limit?: number,
    nextToken?: string
  ): Promise<ListProductsQuery> {
    const statement = `query ListProducts($filter: ModelProductFilterInput, $limit: Int, $nextToken: String) {
        listProducts(filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
            __typename
            id
            name
            defaultLanguage
            members
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
          nextToken
          startedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <ListProductsQuery>response.data.listProducts;
  }
  async SyncProducts(
    filter?: ModelProductFilterInput,
    limit?: number,
    nextToken?: string,
    lastSync?: number
  ): Promise<SyncProductsQuery> {
    const statement = `query SyncProducts($filter: ModelProductFilterInput, $limit: Int, $nextToken: String, $lastSync: AWSTimestamp) {
        syncProducts(filter: $filter, limit: $limit, nextToken: $nextToken, lastSync: $lastSync) {
          __typename
          items {
            __typename
            id
            name
            defaultLanguage
            members
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
          nextToken
          startedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    if (lastSync) {
      gqlAPIServiceArguments.lastSync = lastSync;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <SyncProductsQuery>response.data.syncProducts;
  }
  async GetLanguage(id: string): Promise<GetLanguageQuery> {
    const statement = `query GetLanguage($id: ID!) {
        getLanguage(id: $id) {
          __typename
          id
          name
          code
          isDefault
          product {
            __typename
            id
            name
            defaultLanguage
            members
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
          translations {
            __typename
            nextToken
            startedAt
          }
          isRequireTranslatorAction
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          productLanguagesId
        }
      }`;
    const gqlAPIServiceArguments: any = {
      id
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <GetLanguageQuery>response.data.getLanguage;
  }
  async ListLanguages(
    filter?: ModelLanguageFilterInput,
    limit?: number,
    nextToken?: string
  ): Promise<ListLanguagesQuery> {
    const statement = `query ListLanguages($filter: ModelLanguageFilterInput, $limit: Int, $nextToken: String) {
        listLanguages(filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
            __typename
            id
            name
            code
            isDefault
            isRequireTranslatorAction
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
            productLanguagesId
          }
          nextToken
          startedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <ListLanguagesQuery>response.data.listLanguages;
  }
  async SyncLanguages(
    filter?: ModelLanguageFilterInput,
    limit?: number,
    nextToken?: string,
    lastSync?: number
  ): Promise<SyncLanguagesQuery> {
    const statement = `query SyncLanguages($filter: ModelLanguageFilterInput, $limit: Int, $nextToken: String, $lastSync: AWSTimestamp) {
        syncLanguages(filter: $filter, limit: $limit, nextToken: $nextToken, lastSync: $lastSync) {
          __typename
          items {
            __typename
            id
            name
            code
            isDefault
            isRequireTranslatorAction
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
            productLanguagesId
          }
          nextToken
          startedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    if (lastSync) {
      gqlAPIServiceArguments.lastSync = lastSync;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <SyncLanguagesQuery>response.data.syncLanguages;
  }
  async GetDefinition(id: string): Promise<GetDefinitionQuery> {
    const statement = `query GetDefinition($id: ID!) {
        getDefinition(id: $id) {
          __typename
          id
          slug
          defaultValue
          product {
            __typename
            id
            name
            defaultLanguage
            members
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
          translations {
            __typename
            nextToken
            startedAt
          }
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          productDefinitionsId
        }
      }`;
    const gqlAPIServiceArguments: any = {
      id
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <GetDefinitionQuery>response.data.getDefinition;
  }
  async ListDefinitions(
    filter?: ModelDefinitionFilterInput,
    limit?: number,
    nextToken?: string
  ): Promise<ListDefinitionsQuery> {
    const statement = `query ListDefinitions($filter: ModelDefinitionFilterInput, $limit: Int, $nextToken: String) {
        listDefinitions(filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
            __typename
            id
            slug
            defaultValue
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
            productDefinitionsId
          }
          nextToken
          startedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <ListDefinitionsQuery>response.data.listDefinitions;
  }
  async SyncDefinitions(
    filter?: ModelDefinitionFilterInput,
    limit?: number,
    nextToken?: string,
    lastSync?: number
  ): Promise<SyncDefinitionsQuery> {
    const statement = `query SyncDefinitions($filter: ModelDefinitionFilterInput, $limit: Int, $nextToken: String, $lastSync: AWSTimestamp) {
        syncDefinitions(filter: $filter, limit: $limit, nextToken: $nextToken, lastSync: $lastSync) {
          __typename
          items {
            __typename
            id
            slug
            defaultValue
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
            productDefinitionsId
          }
          nextToken
          startedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    if (lastSync) {
      gqlAPIServiceArguments.lastSync = lastSync;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <SyncDefinitionsQuery>response.data.syncDefinitions;
  }
  async GetTranslation(id: string): Promise<GetTranslationQuery> {
    const statement = `query GetTranslation($id: ID!) {
        getTranslation(id: $id) {
          __typename
          id
          definition {
            __typename
            id
            slug
            defaultValue
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
            productDefinitionsId
          }
          language {
            __typename
            id
            name
            code
            isDefault
            isRequireTranslatorAction
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
            productLanguagesId
          }
          value
          isRequireTranslatorAction
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          languageTranslationsId
          definitionTranslationsId
        }
      }`;
    const gqlAPIServiceArguments: any = {
      id
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <GetTranslationQuery>response.data.getTranslation;
  }
  async ListTranslations(
    filter?: ModelTranslationFilterInput,
    limit?: number,
    nextToken?: string
  ): Promise<ListTranslationsQuery> {
    const statement = `query ListTranslations($filter: ModelTranslationFilterInput, $limit: Int, $nextToken: String) {
        listTranslations(filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
            __typename
            id
            value
            isRequireTranslatorAction
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
            languageTranslationsId
            definitionTranslationsId
          }
          nextToken
          startedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <ListTranslationsQuery>response.data.listTranslations;
  }
  async SyncTranslations(
    filter?: ModelTranslationFilterInput,
    limit?: number,
    nextToken?: string,
    lastSync?: number
  ): Promise<SyncTranslationsQuery> {
    const statement = `query SyncTranslations($filter: ModelTranslationFilterInput, $limit: Int, $nextToken: String, $lastSync: AWSTimestamp) {
        syncTranslations(filter: $filter, limit: $limit, nextToken: $nextToken, lastSync: $lastSync) {
          __typename
          items {
            __typename
            id
            value
            isRequireTranslatorAction
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
            languageTranslationsId
            definitionTranslationsId
          }
          nextToken
          startedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    if (lastSync) {
      gqlAPIServiceArguments.lastSync = lastSync;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <SyncTranslationsQuery>response.data.syncTranslations;
  }
  OnCreateProductListener: Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onCreateProduct">>
  > = API.graphql(
    graphqlOperation(
      `subscription OnCreateProduct {
        onCreateProduct {
          __typename
          id
          name
          defaultLanguage
          languages {
            __typename
            nextToken
            startedAt
          }
          definitions {
            __typename
            nextToken
            startedAt
          }
          members
          authorizations {
            __typename
            id
            email
          }
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
      }`
    )
  ) as Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onCreateProduct">>
  >;

  OnUpdateProductListener: Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onUpdateProduct">>
  > = API.graphql(
    graphqlOperation(
      `subscription OnUpdateProduct {
        onUpdateProduct {
          __typename
          id
          name
          defaultLanguage
          languages {
            __typename
            nextToken
            startedAt
          }
          definitions {
            __typename
            nextToken
            startedAt
          }
          members
          authorizations {
            __typename
            id
            email
          }
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
      }`
    )
  ) as Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onUpdateProduct">>
  >;

  OnDeleteProductListener: Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onDeleteProduct">>
  > = API.graphql(
    graphqlOperation(
      `subscription OnDeleteProduct {
        onDeleteProduct {
          __typename
          id
          name
          defaultLanguage
          languages {
            __typename
            nextToken
            startedAt
          }
          definitions {
            __typename
            nextToken
            startedAt
          }
          members
          authorizations {
            __typename
            id
            email
          }
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
      }`
    )
  ) as Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onDeleteProduct">>
  >;

  OnCreateLanguageListener: Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onCreateLanguage">>
  > = API.graphql(
    graphqlOperation(
      `subscription OnCreateLanguage {
        onCreateLanguage {
          __typename
          id
          name
          code
          isDefault
          product {
            __typename
            id
            name
            defaultLanguage
            members
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
          translations {
            __typename
            nextToken
            startedAt
          }
          isRequireTranslatorAction
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          productLanguagesId
        }
      }`
    )
  ) as Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onCreateLanguage">>
  >;

  OnUpdateLanguageListener: Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onUpdateLanguage">>
  > = API.graphql(
    graphqlOperation(
      `subscription OnUpdateLanguage {
        onUpdateLanguage {
          __typename
          id
          name
          code
          isDefault
          product {
            __typename
            id
            name
            defaultLanguage
            members
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
          translations {
            __typename
            nextToken
            startedAt
          }
          isRequireTranslatorAction
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          productLanguagesId
        }
      }`
    )
  ) as Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onUpdateLanguage">>
  >;

  OnDeleteLanguageListener: Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onDeleteLanguage">>
  > = API.graphql(
    graphqlOperation(
      `subscription OnDeleteLanguage {
        onDeleteLanguage {
          __typename
          id
          name
          code
          isDefault
          product {
            __typename
            id
            name
            defaultLanguage
            members
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
          translations {
            __typename
            nextToken
            startedAt
          }
          isRequireTranslatorAction
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          productLanguagesId
        }
      }`
    )
  ) as Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onDeleteLanguage">>
  >;

  OnCreateDefinitionListener: Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onCreateDefinition">>
  > = API.graphql(
    graphqlOperation(
      `subscription OnCreateDefinition {
        onCreateDefinition {
          __typename
          id
          slug
          defaultValue
          product {
            __typename
            id
            name
            defaultLanguage
            members
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
          translations {
            __typename
            nextToken
            startedAt
          }
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          productDefinitionsId
        }
      }`
    )
  ) as Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onCreateDefinition">>
  >;

  OnUpdateDefinitionListener: Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onUpdateDefinition">>
  > = API.graphql(
    graphqlOperation(
      `subscription OnUpdateDefinition {
        onUpdateDefinition {
          __typename
          id
          slug
          defaultValue
          product {
            __typename
            id
            name
            defaultLanguage
            members
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
          translations {
            __typename
            nextToken
            startedAt
          }
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          productDefinitionsId
        }
      }`
    )
  ) as Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onUpdateDefinition">>
  >;

  OnDeleteDefinitionListener: Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onDeleteDefinition">>
  > = API.graphql(
    graphqlOperation(
      `subscription OnDeleteDefinition {
        onDeleteDefinition {
          __typename
          id
          slug
          defaultValue
          product {
            __typename
            id
            name
            defaultLanguage
            members
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
          }
          translations {
            __typename
            nextToken
            startedAt
          }
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          productDefinitionsId
        }
      }`
    )
  ) as Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onDeleteDefinition">>
  >;

  OnCreateTranslationListener: Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onCreateTranslation">>
  > = API.graphql(
    graphqlOperation(
      `subscription OnCreateTranslation {
        onCreateTranslation {
          __typename
          id
          definition {
            __typename
            id
            slug
            defaultValue
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
            productDefinitionsId
          }
          language {
            __typename
            id
            name
            code
            isDefault
            isRequireTranslatorAction
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
            productLanguagesId
          }
          value
          isRequireTranslatorAction
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          languageTranslationsId
          definitionTranslationsId
        }
      }`
    )
  ) as Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onCreateTranslation">>
  >;

  OnUpdateTranslationListener: Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onUpdateTranslation">>
  > = API.graphql(
    graphqlOperation(
      `subscription OnUpdateTranslation {
        onUpdateTranslation {
          __typename
          id
          definition {
            __typename
            id
            slug
            defaultValue
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
            productDefinitionsId
          }
          language {
            __typename
            id
            name
            code
            isDefault
            isRequireTranslatorAction
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
            productLanguagesId
          }
          value
          isRequireTranslatorAction
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          languageTranslationsId
          definitionTranslationsId
        }
      }`
    )
  ) as Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onUpdateTranslation">>
  >;

  OnDeleteTranslationListener: Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onDeleteTranslation">>
  > = API.graphql(
    graphqlOperation(
      `subscription OnDeleteTranslation {
        onDeleteTranslation {
          __typename
          id
          definition {
            __typename
            id
            slug
            defaultValue
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
            productDefinitionsId
          }
          language {
            __typename
            id
            name
            code
            isDefault
            isRequireTranslatorAction
            createdAt
            updatedAt
            _version
            _deleted
            _lastChangedAt
            productLanguagesId
          }
          value
          isRequireTranslatorAction
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          languageTranslationsId
          definitionTranslationsId
        }
      }`
    )
  ) as Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onDeleteTranslation">>
  >;
}
