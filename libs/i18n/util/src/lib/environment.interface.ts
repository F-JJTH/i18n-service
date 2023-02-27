import { I18nClientConfig } from "@kizeo/i18n/client";

export interface IEnvironment {
  production: boolean
  version: string
  apiUrl: string
  i18n: I18nClientConfig
  sentryDsn?: string
}