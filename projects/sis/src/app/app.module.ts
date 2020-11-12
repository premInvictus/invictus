// core module
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { HttpClientModule} from '@angular/common/http' ;
import { RouterModule } from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
// npm module
import {LoadingModule} from 'ngx-loading';
import {SimpleNotificationsModule, NotificationsService} from 'angular2-notifications';
import { CookieModule } from 'ngx-cookie';
// import Module
import { UsertypeSisModule } from './usertypesis/usertypesis.module';
import { routing } from './app.routing';

// import service
import {CommonAPIService, SisService, ProcesstypeService, RoutingStateService, SmartService, FeeService } from './_services/index';
import {ResolverService} from './_services/resolver.service';

// import component
import { AppComponent } from './app.component';
import { MAT_DATE_LOCALE } from '@angular/material';
import { LoaderService } from './_services/loader.service';
const providers = [CommonAPIService,
	SisService,
	FeeService,
	ProcesstypeService,
	NotificationsService,
	RoutingStateService,
	ResolverService,
	LoaderService, SmartService,
	{provide: MAT_DATE_LOCALE, useValue: 'en-GB'}];
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
