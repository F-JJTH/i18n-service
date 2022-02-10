// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { IEnvironment } from "@kizeo/i18n/util";

export const environment: IEnvironment = {
  production: false,
  version: '1.0.0-dev',
  apiUrl: '',
  i18n: {
    appId: '9b11cc7b-a9e9-464f-bf9d-36e2fe3262c4',
    env: 'dev',
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
