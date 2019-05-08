// core module
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// npm module
import { LoadingModule } from 'ngx-loading';
import { SimpleNotificationsModule, NotificationsService } from 'angular2-notifications';
import { CookieModule } from 'ngx-cookie';

// import interceptor
import { ApiPrefixInterceptor, SuccessErrorInterceptor } from './_helpers/index';

// import Module
import { routing } from './app.routing';

// import service
import { CommonAPIService, SisService, ProcesstypeService, RoutingStateService, FeeService } from './_services/index';
import { ResolverService } from './_services/resolver.service';
import { UserTypeService } from './usertype/usertype.service';

// import component
import { AppComponent } from './app.component';
import { MAT_DATE_LOCALE } from '@angular/material';
import { AuthGuard } from './_guards';
const providers = [CommonAPIService,
	SisService,
	ProcesstypeService,
	NotificationsService,
	RoutingStateService,
	FeeService,
	AuthGuard,
	UserTypeService,
	ResolverService,
	{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
	{ provide: HTTP_INTERCEPTORS, useClass: ApiPrefixInterceptor, multi: true },
	{ provide: HTTP_INTERCEPTORS, useClass: SuccessErrorInterceptor, multi: true }];
@NgModule({
	declarations: [
		AppComponent
	],
	imports: [
		BrowserModule,
		HttpClientModule,
		routing,
		RouterModule,
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
export class FeesSharedModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: AppModule,
			providers: [providers]
		};
	}
}
