import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { LoadingModule } from 'ngx-loading';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CookieModule } from 'ngx-cookie';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { AppRoutingModule} from './app.routing';
import { CommonModule } from '@angular/common';
import { AuthenticationService} from './login/login/authentication.service';
import { CommonAPIService} from './_services/commonAPI.service';
import { AuthGuard} from './_guards/index';
import { ApiPrefixInterceptor, SuccessErrorInterceptor } from './_helpers';
import { UserAccessMenuService } from './_services';
import { LOCALE_ID, Injector, APP_INITIALIZER } from '@angular/core';
import { LOCATION_INITIALIZED } from "@angular/common";
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AngularSlickgridModule, CollectionService } from 'angular-slickgrid';
import { TranslateModule, TranslateService, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

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
		BrowserAnimationsModule,
		CookieModule.forRoot(),
		SimpleNotificationsModule.forRoot(),
		TranslateModule.forRoot({}),
		AngularSlickgridModule.forRoot()
	],
	providers: [
		AuthenticationService, CommonAPIService, AuthGuard, UserAccessMenuService,TranslateService,
		{provide: HTTP_INTERCEPTORS, useClass: ApiPrefixInterceptor, multi: true },
		{ provide: HTTP_INTERCEPTORS, useClass: SuccessErrorInterceptor, multi: true}],
	bootstrap: [AppComponent]
})
export class AppModule { }

