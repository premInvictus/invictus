import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { LoadingModule } from 'ngx-loading';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CookieModule } from 'ngx-cookie';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { AppRoutingModule } from './app.routing';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from './login/login/authentication.service';
import { CommonAPIService } from './_services/commonAPI.service';
import { AuthGuard } from './_guards/index';
import { ApiPrefixInterceptor, SuccessErrorInterceptor } from './_helpers';
import { UserAccessMenuService, MessagingService } from './_services';
import { LOCALE_ID, Injector, APP_INITIALIZER } from '@angular/core';
import { LOCATION_INITIALIZED } from "@angular/common";
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { UserIdleModule } from 'angular-user-idle';
import { AngularSlickgridModule, CollectionService } from 'angular-slickgrid';
import { TranslateModule, TranslateService, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TimeoutModalComponent } from './timeout-modal/timeout-modal.component';
import { MatDialogModule } from '@angular/material';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';


@NgModule({
	declarations: [
		AppComponent,
		TimeoutModalComponent,
	],
	imports: [
		CommonModule,
		BrowserModule,
		MatDialogModule,
		HttpClientModule,
		AppRoutingModule,
		UserIdleModule.forRoot({ idle: 600, timeout: 1, ping: 30 }),
		LoadingModule,
		RouterModule,
		BrowserAnimationsModule,
		CookieModule.forRoot(),
		SimpleNotificationsModule.forRoot(),
		TranslateModule.forRoot({}),
		AngularSlickgridModule.forRoot(),
		AngularFireDatabaseModule,
		AngularFireAuthModule,
		AngularFireMessagingModule,
		AngularFireModule.initializeApp(environment.firebase)
	],
	providers: [
		AuthenticationService, CommonAPIService, AuthGuard, UserAccessMenuService, TranslateService,
		MessagingService,
		{ provide: HTTP_INTERCEPTORS, useClass: ApiPrefixInterceptor, multi: true },
		{ provide: HTTP_INTERCEPTORS, useClass: SuccessErrorInterceptor, multi: true }],
	bootstrap: [AppComponent],
	entryComponents: [TimeoutModalComponent]
})
export class AppModule { }

