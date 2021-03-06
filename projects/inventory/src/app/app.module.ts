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
import { LoaderService, CommonAPIService, SisService, AxiomService, InventoryService } from './_services';

const providers = [NotificationsService,
  AuthGuard,
  LoaderService,
  CommonAPIService,
  SisService,
  AxiomService,
  InventoryService];
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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
@NgModule({})
export class InventorySharedAppModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: AppModule,
      providers: providers
    };
  }
}

