import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { SimpleNotificationsModule, NotificationsService } from 'angular2-notifications';
import { CookieModule } from 'ngx-cookie';
import { LoadingModule } from 'ngx-loading';
import { AuthGuard } from './_guards';
import { LoaderService, CommonAPIService, SisService, AxiomService, SmartService } from './_services';
import { SmartusertypeService } from './smartusertype/smartusertype.service';

import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { TooltipDirective } from './_directives/tooltip.directive';

const providers = [NotificationsService,
	AuthGuard,
	LoaderService,
	CommonAPIService,
	SmartusertypeService,
	SisService,
	AxiomService,
	SmartService];
@NgModule({
	declarations: [
		AppComponent,
		TooltipDirective,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		HttpClientModule,
		RouterModule,
		NgxMaterialTimepickerModule,
		LoadingModule,
		BrowserAnimationsModule,
		CookieModule.forRoot(),
		SimpleNotificationsModule.forRoot(),
	],
	providers: providers,
	bootstrap: [AppComponent]
})
export class AppModule { }
@NgModule({})
export class SmartSharedAppModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: AppModule,
			providers: providers
		};
	}
}
