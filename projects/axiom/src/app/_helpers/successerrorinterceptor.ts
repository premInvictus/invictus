import { Injectable } from '@angular/core';
import {
	HttpEvent, HttpInterceptor,
	HttpHandler, HttpRequest, HttpResponse,
	HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { CommonAPIService } from '../_services/index';
import { CookieService } from 'ngx-cookie';
import { LoaderService } from '../_services/loader.service';
import { appConfig } from '../app.config';
import { Router } from '@angular/router';
@Injectable()
export class SuccessErrorInterceptor implements HttpInterceptor {
	constructor(private service: CommonAPIService, private cookieService: CookieService,
		private router: Router,
		private loaderService: LoaderService) { }
	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		const session = JSON.parse(localStorage.getItem('session'));
		const cookieData: any = this.service.getCokkieData();
		if (localStorage.getItem('currentUser') && JSON.parse(localStorage.getItem('currentUser'))['device_details']) {
		const deviceType = JSON.parse(JSON.parse(localStorage.getItem('currentUser'))['device_details']);
		if (deviceType && deviceType.length > 0) {
			for (var i=0; i<deviceType.length;i++) {
				if (deviceType[i]['last_login'] ==="true") {
					request = request.clone({ headers: request.headers.set('DeviceType', deviceType[i]['type']) });
				}
			}
		}}
		if (cookieData) {
			if (cookieData['PF']) {
				request = request.clone({ headers: request.headers.set('Prefix', cookieData['PF']) });
				request = request.clone({ headers: request.headers.set('Loginid', cookieData['LN']) });
				request = request.clone({ headers: request.headers.set('Token', cookieData['AN']) });
				request = request.clone({ headers: request.headers.set('CID', cookieData['CID']) });
			}
			if (session) {
				request = request.clone({ headers: request.headers.set('Sessionid', session.ses_id) });
			}
		} else {
			// localStorage.clear();
			// this.cookieService.removeAll();
			// window.location.href = environment.logoutUrl;

		}
		return next.handle(request).pipe(
			map((event: HttpEvent<any>) => {
				if (event instanceof HttpResponse) {
					if (event.body.status === 'error' &&
						(event.body.data === 'Token Expired' || event.body.data === 'Logout Successfully' ||
						event.body.data === 'Token Not Matched')) {
						localStorage.clear();
						this.cookieService.removeAll();
						this.router.navigate(['/login']);
					}
					this.loaderService.stopLoading();
				}
				return event;
			}),
			catchError((error: HttpErrorResponse) => {
				this.loaderService.stopLoading();
				if (error.error instanceof Error) {
					// A client-side or network error occurred.
					retry(3);
				} else {
				}
				return throwError(error);
			}));
	}
}
