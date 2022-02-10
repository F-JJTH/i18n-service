import { IEnvironment } from "@kizeo/i18n/util";

export const environment: IEnvironment = {
  production: true,
  version: '1.0.0',
  apiUrl: 'http://localhost:3333',
  i18n: {
    appId: '9b11cc7b-a9e9-464f-bf9d-36e2fe3262c4',
    env: 'prod',
  },
  sentryDsn: 'https://a8c95a86a5a14d91acc4c4213b90052e@sentry.kizeo.net/22'
};
