import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { BsDropdownModule, TooltipModule, ModalModule } from 'ngx-bootstrap';
import { LoadingModule } from 'ngx-loading';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { CookieModule } from 'ngx-cookie';
import { AcsetupService} from './_services/acsetup.service';
import { MatInputModule, MatCardModule, MatTooltipModule, MatRadioModule, MatButtonModule } from '@angular/material';
import { AuthGuard } from 'projects/teacherapp/src/app/_guards/auth.guard';
import { RouteAccessGuard } from 'projects/teacherapp/src/app/_guards';
import {
	LoaderService,
	AuthenticationService,
	NotificationService,
	FpasswordService,
	SocketService,
	TreeviewService,
	HtmlToTextService,
	BreadCrumbService,
	SmartService,
	SisService,
	AxiomService,
	UserAccessMenuService
} from 'projects/teacherapp/src/app/_services';
import { CommonAPIService } from 'projects/teacherapp/src/app/_services/commonAPI.service';
import { UserTypeService } from 'projects/teacherapp/src/app/user-type-teacher/user-type.service';
import { AdminService } from 'projects/teacherapp/src/app/_services/admin.service';
import { QelementService } from 'projects/teacherapp/src/app/questionbank/service/qelement.service';
import { QbankService } from 'projects/teacherapp/src/app/questionbank/service/qbank.service';
import { ReportService } from 'projects/teacherapp/src/app/_services/report.service';
const providers = [
	AuthGuard,
	RouteAccessGuard,
	LoaderService,
	AuthenticationService,
	NotificationService,
	FpasswordService,
	SocketService,
	TreeviewService,
	CommonAPIService,
	UserAccessMenuService,
	HtmlToTextService,
	BreadCrumbService,
	UserTypeService,
	AcsetupService,
	AdminService,
	QelementService,
	QbankService,
	SisService,
	AxiomService,
	SmartService,
	ReportService];
@NgModule({
	declarations: [
		AppComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		ReactiveFormsModule,
		HttpModule,
		HttpClientModule,
		AppRoutingModule,
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
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
@NgModule({})
export class TeacherAppSharedModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: AppModule,
			providers: [providers]
		};
	}
}
