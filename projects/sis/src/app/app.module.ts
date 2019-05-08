// core module
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http' ;
import { RouterModule } from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

// npm module
import {LoadingModule} from 'ngx-loading';
import {SimpleNotificationsModule, NotificationsService} from 'angular2-notifications';
import { CookieModule } from 'ngx-cookie';

// import interceptor
import { ApiPrefixInterceptor, SuccessErrorInterceptor } from './_helpers/index';

// import Module
import { UsertypeSisModule } from './usertypesis/usertypesis.module';
import { routing } from './app.routing';

// import service
import {CommonAPIService, SisService, ProcesstypeService, RoutingStateService} from './_services/index';
import {ResolverService} from './_services/resolver.service';

// import component
import { AppComponent } from './app.component';
import { MAT_DATE_LOCALE } from '@angular/material';
const providers = [CommonAPIService,
	SisService,
	ProcesstypeService,
	NotificationsService,
	RoutingStateService,
	ResolverService,
	{provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
	{provide: HTTP_INTERCEPTORS, useClass: ApiPrefixInterceptor, multi: true},
	{provide: HTTP_INTERCEPTORS, useClass: SuccessErrorInterceptor, multi: true}];
@NgModule({
	declarations: [
		AppComponent
	],
	imports: [
		BrowserModule,
		HttpClientModule,
		routing,
		RouterModule,
		UsertypeSisModule,
		LoadingModule,
		BrowserAnimationsModule,
		CookieModule.forRoot(),
		SimpleNotificationsModule.forRoot(),
	],
	providers: [providers],
	bootstrap: [AppComponent]
})
export class AppModule { }
@NgModule({})
export class SisSharedModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: AppModule,
			providers: [providers]
		};
	}
}
