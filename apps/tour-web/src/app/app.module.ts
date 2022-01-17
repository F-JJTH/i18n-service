import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { I18nClientAngularModule } from '@kizeo/i18n/client';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    I18nClientAngularModule.forRoot({
      appId: 'b1a88bf4-fcb4-4452-8e90-75df8cbe0b27',
      env: 'dev',
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
