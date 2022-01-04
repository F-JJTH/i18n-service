import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { ShellModule } from '@kizeo/i18n/features/shell';
import { AmplifyAuthenticatorModule } from '@aws-amplify/ui-angular';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { environment } from '../environments/environment';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AmplifyAuthenticatorModule,
    ShellModule,
  ],
  providers: [{
    provide: 'ENVIRONMENT',
    useValue: environment
  }],
  bootstrap: [AppComponent],
})
export class AppModule {}
