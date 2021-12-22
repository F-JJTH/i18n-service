import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import Amplify from 'aws-amplify';
import { Auth } from '@aws-amplify/auth'
import awsmobile from './aws-exports';

Amplify.configure(awsmobile);
Auth.configure(awsmobile);

@NgModule({
  imports: [CommonModule],
  providers: []
})
export class AppsyncModule {}
