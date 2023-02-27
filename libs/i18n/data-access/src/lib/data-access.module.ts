import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Auth } from '@aws-amplify/auth'
import awsmobile from './aws-exports';

Auth.configure(awsmobile);

@NgModule({
  imports: [CommonModule, HttpClientModule],
  providers: []
})
export class DataAccessModule {}
