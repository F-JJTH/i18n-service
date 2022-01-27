export interface MemberAuthorization {
  definitions: boolean;
  settings: boolean;
  deploy: boolean;
  validator?: boolean;
  translations?: string[];
}

export interface Member {
  id: string;
  email: string;
  authorizations: MemberAuthorization;
}

export interface Product {
  id: string;
  name: string;
  defaultLanguage: string;
  languages?: Language[];
  definitions?: Definition[];
  translations?: Translation[];
  members?: string[];
  authorizations?: Member[];
  publishedPreprodAt?: string;
  publishedProdAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Language {
  id: string;
  name: string;
  code: string;
  isDefault: boolean;
  isDisabled?: boolean;
  product?: Product;
  translations?: Translation[];
  isRequireTranslatorAction?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Translation {
  id: string;
  definition?: Definition;
  language?: Language;
  product?: Product;
  value?: string;
  isRequireTranslatorAction?: boolean;
  isValid?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Definition {
  id: string;
  slug: string;
  defaultValue: string;
  product?: Product;
  translations?: Translation[];
  link?: string;
  picture?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Definition
export interface CreateDefinitionRequest {
  slug: string
  defaultValue: string
  productId: string
}
export interface CreateDefinitionResponse {}

export interface ImportDefinitionRequest {
  definitions: {slug: string, defaultValue: string}[]
  productId: string
}
export interface ImportDefinitionResponse {}

export interface UpdateDefinitionRequest {
  slug: string
  defaultValue: string
}
export interface UpdateDefinitionResponse {}


// Language
export interface CreateLanguageRequest {
  languageCode: string
  languageLabel: string
  productId: string
}
export interface CreateLanguageResponse {}

export interface UpdateIsDisabledLanguageRequest {
  isDisabled: boolean
}
export interface UpdateIsDisabledLanguageResponse {}


// Product
export interface AddMemberRequest {
  memberId: string
  memberEmail: string
  authorizations: MemberAuthorization
}
export interface AddMemberResponse {}

export interface CreateProductRequest {
  name: string
  defaultLanguage: { code: string, label: string }
}
export interface CreateProductResponse {}

export interface UpdateMemberRequest {
  authorizations: MemberAuthorization
}
export interface UpdateMemberResponse {}

export interface UpdateProductRequest {
  name: string
}
export interface UpdateProductResponse {}


// Translation
export interface ImportTranslationRequest {
  translations: {slug: string, translation: string}[]
  productId: string
  languageId: string
}
export interface ImportTranslationResponse {}

export interface UpdateIsValidTranslationRequest {
  isValid: boolean
}
export interface UpdateIsValidTranslationResponse {}

export interface UpdateTranslationRequest {
  translationItems: { id: string, value: string }[]
}
export interface UpdateTranslationResponse {}