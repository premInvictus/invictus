import { NgModule, ModuleWithProviders } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { routing } from './app.routing';
import { AuthGuard, RouteAccessGuard } from './_guards/index';
import { AppComponent } from './app.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FpasswordComponent } from './fpassword/fpassword.component';
import { HttpClientModule } from '@angular/common/http';
import { LoadingModule } from 'ngx-loading';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { CookieModule } from 'ngx-cookie';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRadioModule } from '@angular/material//radio';
import { MatButtonModule } from '@angular/material/button';
import {
	LoaderService,
	AuthenticationService, FpasswordService, NotificationService, CommonAPIService,
	SocketService, TreeviewService, UserAccessMenuService, HtmlToTextService, BreadCrumbService
} from './_services';
import { ResolverService } from './_services/resolver.service';
import { SmartService } from './_services/smart.service';
import { UserTypeService } from './user-type/user-type.service';
import { AdminService } from './user-type/admin/services/admin.service';
import { AcsetupService } from './acsetup/service/acsetup.service';
import { QelementService } from './questionbank/service/qelement.service';
import { QbankService } from './questionbank/service/qbank.service';
import { ReportService } from './reports/service/report.service';
import { UserRedirectComponent } from './user-type/user-redirect/user-redirect.component';
const providers = [
	AuthGuard,
	RouteAccessGuard,
	LoaderService,
	AuthenticationService,
	NotificationService,
	FpasswordService,
	SocketService,
	ResolverService,
	TreeviewService,
	CommonAPIService,
	UserAccessMenuService,
	HtmlToTextService,
	BreadCrumbService,
	UserTypeService,
	AdminService,
	AcsetupService,
	QelementService,
	QbankService,
	SmartService,
	ReportService];
@NgModule({
	imports: [
		BrowserModule,
		FormsModule,
		ReactiveFormsModule,
		HttpModule,
		HttpClientModule,
		routing,
		BsDropdownModule.forRoot(),
		TooltipModule.forRoot(),
		ModalModule.forRoot(),
		LoadingModule,
		BrowserAnimationsModule,
		SimpleNotificationsModule.forRoot(),
		CookieModule.forRoot(),
		MatInputModule,
		MatCardModule,
		MatTooltipModule,
		MatRadioModule,
		MatButtonModule,
	],
	declarations: [
		AppComponent,
		FpasswordComponent,
		UserRedirectComponent
	],
	providers: [providers],
	bootstrap: [AppComponent]
})

export class AppModule { }
@NgModule({})
export class AxiomSharedModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: AppModule,
			providers: [providers]
		};
	}
}

