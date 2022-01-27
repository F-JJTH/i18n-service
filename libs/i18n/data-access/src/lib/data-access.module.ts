import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import Amplify from 'aws-amplify';
import { Auth } from '@aws-amplify/auth'
import awsmobile from './aws-exports';
import { HttpClientModule } from '@angular/common/http';

Amplify.configure(awsmobile);
Auth.configure(awsmobile);

@NgModule({
  imports: [CommonModule, HttpClientModule],
  providers: []
})
export class DataAccessModule {}
