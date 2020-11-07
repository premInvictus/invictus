import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
	LoaderService,
	
	SocketService,
	CommonAPIService,
	
} from 'projects/axiom/src/app/_services';
import { UserAccessMenuService,
	NotificationService,
	HtmlToTextService,
	BreadCrumbService } from 'projects/admin-app/src/app/_services';
import { AuthGuard } from './_guards/auth.guard';
import { UserTypeService } from 'projects/axiom/src/app/user-type/user-type.service';
import { QelementService } from './questionbank/service/qelement.service';
import { AdminService } from './admin-user-type/admin/services/admin.service';
import { AcsetupService } from './acsetup/service/acsetup.service';
import { QbankService } from './questionbank/service/qbank.service';
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
	QelementService,
	AdminService,
	AcsetupService,
	QbankService
];
@NgModule({
	declarations: [AppComponent],
	imports: [BrowserModule, AppRoutingModule],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {}
@NgModule({})
export class AdminAppSharedModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: AppModule,
			providers: [providers]
		};
	}
}
