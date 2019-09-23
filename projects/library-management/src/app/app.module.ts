import { LoaderService, CommonAPIService, SisService, AxiomService, SmartService } from './_services';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NotificationsService } from 'angular2-notifications';
import { AuthGuard } from 'src/app/_guards/auth.guard';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { SimpleNotificationsModule, } from 'angular2-notifications';
import { CookieModule } from 'ngx-cookie';
import { LoadingModule } from 'ngx-loading';
import { LibraryusertypeService } from './library-usertype/libraryusertype.service';
const providers = [NotificationsService,
	AuthGuard,
	LoaderService,
	CommonAPIService,
  SisService,
  LibraryusertypeService,
	AxiomService,
	SmartService];
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
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
export class LibrarySharedAppModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: AppModule,
			providers: providers
		};
	}
}
