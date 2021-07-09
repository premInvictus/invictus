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
import { AuthGuard } from 'src/app/_guards';
import { LoaderService, CommonAPIService, SisService, AxiomService,SmartService,TransportService } from './_services';
import { TransportusertypeService } from './transportusertype/transportusertype.service';
// import { GoogleMapsAngularModule } from 'google-maps-angular';
// import { AgmCoreModule } from '@agm/core';

const providers = [NotificationsService,
  AuthGuard,
  LoaderService,
  CommonAPIService,
  SisService,
  AxiomService,
  TransportusertypeService,
  SmartService,
  TransportService
];
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
    SimpleNotificationsModule.forRoot()
    // GoogleMapsAngularModule.forRoot({googleMapsKey: 'AIzaSyACQCah_G7cHhuOJFHjMuKHSIJSVJ6VQqE'}),
    // AgmCoreModule.forRoot({
		// 	apiKey: 'AIzaSyACQCah_G7cHhuOJFHjMuKHSIJSVJ6VQqE'
		// })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
@NgModule({})
export class TransportSharedAppModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: AppModule,
      providers: providers
    };
  }
}

