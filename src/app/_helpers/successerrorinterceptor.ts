import { Injectable } from '@angular/core';
import {
	HttpEvent, HttpInterceptor,
	HttpHandler, HttpRequest, HttpResponse,
	HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry, mergeMap } from 'rxjs/operators';
import { CommonAPIService } from '../_services/index';
import { CookieService } from 'ngx-cookie';
import { Router } from '@angular/router';
import { ProcesstypeService } from 'projects/sis/src/app/_services';
import { ProcesstypeFeeService } from 'projects/fee/src/app/_services';   
import { ProcesstypeExamService } from 'projects/examination/src/app/_services';   
import { AngularFireMessaging } from '@angular/fire/messaging';
@Injectable()
export class SuccessErrorInterceptor implements HttpInterceptor {
	constructor(private service: CommonAPIService, private cookieService: CookieService,
		private router: Router,
		private processtypeService: ProcesstypeService,
		private angularFireMessaging: AngularFireMessaging,
		private processtypeFeeService: ProcesstypeFeeService,
		private processtypeExamService: ProcesstypeExamService) { }
	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		const session = JSON.parse(localStorage.getItem('session'));
		const loginSource = localStorage.getItem('loginSource');
		if (localStorage.getItem('currentUser') && JSON.parse(localStorage.getItem('currentUser'))['device_details']) {
		const deviceType = JSON.parse(JSON.parse(localStorage.getItem('currentUser'))['device_details']);
		
		if (deviceType && deviceType.length > 0) {
			request = request.clone({ headers: request.headers.set('DeviceType', 'web') });
		}}
		if (loginSource && loginSource == 'support') {
			request = request.clone({ headers: request.headers.set('LoginSource', 'support') });
		}
		const cookieData: any = this.service.getCokkieData();
		

		if (this.service.getUserPrefix()) {
			request = request.clone({ headers: request.headers.set('Prefix', this.service.getUserPrefix()) });
		}
		if (cookieData) {
			if (cookieData['PF']) {
				if (!this.service.getUserPrefix()) {
					request = request.clone({ headers: request.headers.set('Prefix', cookieData['PF']) });
				}
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
			if (this.processtypeFeeService.getProcesstype() &&
				localStorage.getItem('project') &&
				(JSON.parse(localStorage.getItem('project')).pro_url === 'fees')) {
				request = request.clone({ headers: request.headers.set('Processtype', this.processtypeFeeService.getProcesstype()) });
			}
			if (this.processtypeExamService.getProcesstype() &&
				localStorage.getItem('project') &&
				(JSON.parse(localStorage.getItem('project')).pro_url === 'exam')) {
				request = request.clone({ headers: request.headers.set('Processtype', this.processtypeExamService.getProcesstype()) });
			}
		}
		return next.handle(request).pipe(
			map((event: HttpEvent<any>) => {
				if (event instanceof HttpResponse) {
					if (event.body && event.body.status === 'error' &&
						(event.body.data === 'Token Expired' || event.body.data === 'Logout Successfully' ||
							event.body.data === 'Token Not Matched')) {
						this.deleteToken();
						localStorage.clear();
						this.cookieService.removeAll();
						this.router.navigate(['/login']);
					}
					this.service.stopLoading();
				}
				return event;
			}),
			catchError((error: HttpErrorResponse) => {
				this.service.stopLoading();
				if (error.error instanceof Error) {
					// A client-side or network error occurred.
					retry(3);
				} else {
				}
				return throwError(error);
			}));
	}
	deleteToken() {
		this.angularFireMessaging.getToken
		  .pipe(mergeMap(token => this.angularFireMessaging.deleteToken(token)))
		  .subscribe(
			(token) => { console.log('Deleted!'); },
		  );
	  }
}
