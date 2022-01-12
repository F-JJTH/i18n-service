// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { IEnvironment } from "@kizeo/i18n/util";

export const environment: IEnvironment = {
  production: false,
  version: '1.0.0-dev',
  i18n: {
    appId: '3db7a5c4-dec4-44c6-b689-c3490025c372',
    env: 'preprod',
    url: 'https://z8hwo7cd3g.execute-api.eu-west-3.amazonaws.com/dev'
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
