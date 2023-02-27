import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { ShellModule } from '@kizeo/i18n/features/shell';
import { AmplifyAuthenticatorModule } from '@aws-amplify/ui-angular';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { environment } from '../environments/environment';
import { I18nClientAngularModule } from '@kizeo/i18n/client';
import { createErrorHandler } from "@sentry/angular";
import { I18n } from 'aws-amplify';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AmplifyAuthenticatorModule,
    ShellModule,
    I18nClientAngularModule.forRoot({
      appId: environment.i18n.appId,
      env: environment.i18n.env,
      url: environment.i18n.url
    }),
  ],
  providers: [
    { provide: 'ENVIRONMENT', useValue: environment},
    {
      provide: ErrorHandler,
      useValue: environment.production ? createErrorHandler() : new ErrorHandler(),
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {
    I18n.putVocabulariesForLanguage('en', {
      'Sign In': 'Login', // Tab header
      'Sign in': 'Log in', // Button label
      'Sign in to your account': 'Welcome Back!',
      Username: 'Enter your email', // Username label
      Password: 'Enter your password', // Password label
      'Forgot your password?': 'Reset Password',
    })

    I18n.setLanguage('en')
  }
}
