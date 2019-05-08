import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
	LoaderService,
	NotificationService,
	SocketService,
	CommonAPIService,
	UserAccessMenuService,
	HtmlToTextService,
	BreadCrumbService
} from 'projects/axiom/src/app/_services';
import { AuthGuard } from './_guards/auth.guard';
import { UserTypeService } from 'projects/axiom/src/app/user-type/user-type.service';
import { AdminService } from 'projects/axiom/src/app/user-type/admin/services/admin.service';
import { QelementService } from 'projects/axiom/src/app/questionbank/service/qelement.service';
import { ReportService } from 'projects/axiom/src/app/reports/service/report.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
const providers = [
	AuthGuard,
	LoaderService,
	NotificationService,
	SocketService,
	CommonAPIService,
	UserAccessMenuService,
	HtmlToTextService,
	BreadCrumbService,
	UserTypeService,
	AdminService,
	QelementService,
	ReportService
];
@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserModule,
		FormsModule,
		ReactiveFormsModule,
		HttpClientModule
	],
	providers: [providers],
	bootstrap: [AppComponent]
})
export class AppModule {}
@NgModule({})
export class StudentAppSharedModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: AppModule,
			providers: [providers]
		};
	}
}
