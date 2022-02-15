import { IEnvironment } from "@kizeo/i18n/util";
const packageJson = require("../../../../package.json");

export const environment: IEnvironment = {
  production: true,
  version: `${packageJson.version}`,
  apiUrl: '',
  i18n: {
    appId: '6c2e9c54-aa8c-4497-a443-0b5d0e7e8b13',
    env: 'prod',
  },
  sentryDsn: 'https://a8c95a86a5a14d91acc4c4213b90052e@sentry.kizeo.net/22'
};
