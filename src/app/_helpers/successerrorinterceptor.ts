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
import { LoaderService } from 'projects/axiom/src/app/_services/loader.service';
import { appConfig } from 'projects/axiom/src/app//app.config';
import { Router } from '@angular/router';
import { ProcesstypeService } from 'projects/sis/src/app/_services';
@Injectable()
export class SuccessErrorInterceptor implements HttpInterceptor {
	constructor(private service: CommonAPIService, private cookieService: CookieService,
		private router: Router,
		private processtypeService: ProcesstypeService,
		private loaderService: LoaderService) { }
	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		const session = JSON.parse(localStorage.getItem('session'));
		const cookieData: any = this.service.getCokkieData();
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
			if (this.processtypeService.getProcesstype() &&
			localStorage.getItem('project') &&
			(JSON.parse(localStorage.getItem('project')).pro_url === 'sis')) {
				request = request.clone({ headers: request.headers.set('Processtype', this.processtypeService.getProcesstype()) });
			}
			if (
			localStorage.getItem('project') &&
			(JSON.parse(localStorage.getItem('project')).pro_url === 'fees')) {
				request = request.clone({ headers: request.headers.set('Processtype', '4') });
			}
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
