export interface IEnvironment {
  production: boolean,
  version: string,
  i18n: {
    url: string
    env: string
    appId: string
  }
}