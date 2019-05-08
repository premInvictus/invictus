import { Injectable } from '@angular/core';
import {
	HttpEvent, HttpInterceptor,
	HttpHandler, HttpRequest, HttpResponse,
	HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { CommonAPIService, ProcesstypeService } from '../_services/index';
import { environment } from '../../environments/environment';
import {CookieService} from 'ngx-cookie';
@Injectable()
export class SuccessErrorInterceptor implements HttpInterceptor {
	constructor(private service: CommonAPIService, private processtypeService: ProcesstypeService,
		private cookieService: CookieService) { }
	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		if (!request.headers.has('Content-Type')) {
			request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
		}
		const currentUser = JSON.parse(localStorage.getItem('currentUser'));
		const session = JSON.parse(localStorage.getItem('session'));
		const cookieData = this.service.getCokkieData();
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
			if (this.processtypeService.getProcesstype()) {
				request = request.clone({ headers: request.headers.set('Processtype', this.processtypeService.getProcesstype()) });
			}
		}
		return next.handle(request).pipe(
			map((event: HttpEvent<any>) => {
				if (event instanceof HttpResponse) {
					if (event.body.status === 'error' && (
						event.body.data === 'Token Expired' || event.body.data === 'Logout Successfully' ||
						event.body.data === 'Token Not Matched')) {
							localStorage.clear();
							this.cookieService.removeAll();
							window.location.href = environment.logoutUrl;
					}

					this.service.stopLoading();
				}
				return event;
			}),
			catchError((error: HttpErrorResponse) => {
				if (error.error instanceof Error) {
					// A client-side or network error occurred.
					retry(3);
				} else {
					this.service.stopLoading();
				}
				return throwError(error);
			}));
	}
}
