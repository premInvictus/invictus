import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LoadingModule } from 'ngx-loading';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CookieModule } from 'ngx-cookie';
import { SimpleNotificationsModule } from 'angular2-notifications';
import {AppRoutingModule} from './app.routing';
import { LoginModule } from './login/login.module';
import { CommonModule } from '@angular/common';
import { AuthenticationService} from './login/login/authentication.service';
import {CommonAPIService} from './_services/commonAPI.service';
@NgModule({
	declarations: [
		AppComponent,
	],
	imports: [
		CommonModule,
		BrowserModule,
		HttpClientModule,
		AppRoutingModule,
		LoadingModule,
		RouterModule,
		LoginModule,
		BrowserAnimationsModule,
		CookieModule.forRoot(),
		SimpleNotificationsModule.forRoot(),

	],
	providers: [
		AuthenticationService, CommonAPIService],
	bootstrap: [AppComponent]
})
export class AppModule { }
