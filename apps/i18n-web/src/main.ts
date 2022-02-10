import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import * as Sentry from "@sentry/angular";

if (environment.production) {
  enableProdMode();
  Sentry.init({
    dsn: "https://a8c95a86a5a14d91acc4c4213b90052e@sentry.kizeo.net/22",
  })
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
