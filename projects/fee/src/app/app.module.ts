// core module
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// npm module
import { LoadingModule } from 'ngx-loading';
import { SimpleNotificationsModule, NotificationsService } from 'angular2-notifications';
import { CookieModule } from 'ngx-cookie';
// import Module
import { routing } from './app.routing';

// import service
import { CommonAPIService, SisService, ProcesstypeFeeService, RoutingStateService, FeeService } from './_services/index';
import { ResolverService } from './_services/resolver.service';
import { UserTypeService } from './usertype/usertype.service';

// import component
import { AppComponent } from './app.component';
import { MAT_DATE_LOCALE } from '@angular/material';
import { AuthGuard } from './_guards';
import { LoaderService } from './_services/loader.service';
const providers = [CommonAPIService,
	SisService,
	ProcesstypeFeeService,
	NotificationsService,
	RoutingStateService,
	FeeService,
	AuthGuard,
	UserTypeService,
	ResolverService,
	LoaderService,
	{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }];
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
