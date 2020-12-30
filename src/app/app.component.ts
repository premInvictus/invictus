import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import {
	Event,
	NavigationCancel,
	NavigationEnd,
	NavigationError,
	NavigationStart,
	Router,
	ActivatedRoute
} from '@angular/router';
import { CommonAPIService } from './_services/commonAPI.service';
import { HttpRequest } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material';
import { TimeoutModalComponent } from './timeout-modal/timeout-modal.component';
import { CookieService } from 'ngx-cookie';
import { RouteStore } from 'projects/fee/src/app/feemaster/student-route-move-store.service';
import { UserIdleService } from 'angular-user-idle';
import { MessagingService } from './_services';
import { mergeMap } from 'rxjs/operators';
import { AngularFireMessaging } from '@angular/fire/messaging';
@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
	request: HttpRequest<any>;
	title = 'Invictus DigiSoft';
	userData: any;
	dialogRef: MatDialogRef<TimeoutModalComponent>;
	public _counter = 0;
	public _status = 'Initialized.';
	currenturl = '';
	public options = {
		position: ['bottom', 'right'],
		timeOut: 3000,
		lastOnBottom: true
	};
	showLoadingFlag;
	proUrl: any;
	schoolInfo: any;
	x: NodeJS.Timer;
	message: any;
	currentUser: any = {};
	constructor(private router: Router, private loaderService: CommonAPIService,
		private angularFireMessaging: AngularFireMessaging,
		private messagingService: MessagingService,
		private _cookieService: CookieService,
		private route: ActivatedRoute,
		private diaog: MatDialog,
		private idle: UserIdleService,
		private changeRef: ChangeDetectorRef) {
		this.loaderService.showLoading.subscribe((flag: boolean) => {
			setTimeout(() => this.showLoadingFlag = flag, 0);
		});
		// this.loaderService.sessionSub.subscribe((flag: boolean) => {
		// 	if (flag) {
		// 		let expire_time: any = '';
		// 		if (JSON.parse(localStorage.getItem('expire_time'))) {
		// 			expire_time = JSON.parse(localStorage.getItem('expire_time')).expire_time;
		// 			this.idle.setConfigValues(
		// 				{ idle: expire_time, timeout: 1, ping: 30 }
		// 			)
		// 		}
		// 		this.sessionTimeout();
		// 	}
		// });
		this.router.events.subscribe((event: Event) => {
			switch (true) {
				case event instanceof NavigationStart: {
					this.showLoadingFlag = true;
					break;
				}

				case event instanceof NavigationEnd:
				case event instanceof NavigationCancel:
				case event instanceof NavigationError: {
					this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
					this.loaderService.counterTimer = 4;
					this.idle.resetTimer();
					this.idle.startWatching();
					this.showLoadingFlag = false;
					break;
				}
				default: {
					break;
				}
			}
		});
	}
	deleteToken() {
		this.angularFireMessaging.getToken
			.pipe(mergeMap(token => this.angularFireMessaging.deleteToken(token)))
			.subscribe(
				(token) => { console.log('Deleted!'); },
			);
	}
	ngOnInit() {
		this.messagingService.receiveMessage();
		this.message = this.messagingService.currentMessage;
		console.log(this.message);
		document.addEventListener('mousemove', (e) => {
			this.idle.resetTimer();
		});
		this.getCurrentUrl();
		this.sessionTimeout();
		let prefix: any = '';

		const xhr = new XMLHttpRequest();
		const load: any = this.loaderService;
		if (!localStorage.getItem('Prefix')) {
			const method = 'head';
			const url: any = window.location.href;
			xhr.open(method, url, true);
			xhr.send(null);
			xhr.onreadystatechange = function () {
				if (xhr.readyState) {
					prefix = xhr.getResponseHeader('prefix');
					if (prefix) {
						load.setUserPrefix(prefix);
						localStorage.setItem('Prefix', JSON.stringify({ pre: prefix }));
					}
				}

			};
		} else {
			load.setUserPrefix((JSON.parse(localStorage.getItem('Prefix')).pre));
		}
	}
	getCurrentUrl() {
		this.router.events.subscribe(event => {
			if (event instanceof NavigationEnd) {
				this.currenturl = event.url;
			}
		});
	}

	startWindowOpen() {
		this.loaderService.counterTimer = 4;
		this.x = setInterval(() => {
			this.loaderService.setCounter(this.loaderService.counterTimer);
			this.loaderService.counterTimer--;
			if (this.loaderService.counterTimer === 0) {
				clearInterval(this.x);
				this.diaog.closeAll();
				this.idle.stopTimer();
				this.logout();
				this.idle.stopWatching();
			}
		}, 1000);
	}

	sessionTimeout() {
		const x = setInterval(() => {
			 console.log('ter');
			if (localStorage.getItem('expire_time') && JSON.parse(localStorage.getItem('expire_time')).expire_time) {
				let expire_time;
				expire_time = JSON.parse(localStorage.getItem('expire_time')).expire_time;
				this.idle.stopWatching();
				this.idle.setConfigValues(
					{ idle: 1, timeout: 99, ping: 30 }
				);
				console.log("dhdhdhd", this.idle.getConfigValue());
				//this.idle.stopWatching();
				this.idle.startWatching();
				clearInterval(x);
			}
		}, 1);
		this.loaderService.counterTimer = 4;
		this.idle.onTimerStart().subscribe((count: any) => {
			console.log("i am count", count);
			const valJson: any = this.idle.getConfigValue();
			const routeData: any = this.route.snapshot;
			const routeUrl: String = routeData._routerState.url;
			const pageUrl = (routeData._routerState.url).substring(1, routeData._routerState.url.length);

			if (JSON.parse(localStorage.getItem('project'))) {
				this.proUrl = JSON.parse(localStorage.getItem('project')).pro_url;
			}

			if (!(pageUrl === 'login') && !(routeUrl.includes('axiom'))
				&& Number(this.currentUser.role_id) !== 4
				&& Number(count) === Number(valJson['timeout'])) {

				this.dialogRef = this.diaog.open(TimeoutModalComponent, {
					disableClose: true,
					'height': '180px',
					'width': '400px',
					position: {
						'top': '20%'
					}
				});
				this.startWindowOpen();
				this.idle.stopWatching();

				this.dialogRef.beforeClosed().subscribe((res: any) => {
					if (res && res.extend) {
						clearInterval(this.x);
						this.idle.resetTimer();
						this.loaderService.counterTimer = 4;
						this.idle.startWatching();
						this.changeRef.markForCheck();
						this.getSchool();
					} else {
						clearInterval(this.x);
						this.idle.stopTimer();
						this.diaog.closeAll();
						this.logout();
						this.loaderService.counterTimer = 4;
						this.idle.stopWatching();
					}
				});
			}
		});

	}
	logout() {
		if (this._cookieService.get('userData')) {
			this.userData = JSON.parse(this._cookieService.get('userData'));
			if (this.userData) {
				if (localStorage && localStorage.getItem('session')) {
					const saveStateJSON = {
						pro_url: this.proUrl ? this.proUrl : '',
						ses_id: JSON.parse(localStorage.getItem('session')).ses_id
					};
					this.loaderService.logout({
						au_login_id: this.userData['LN'],
						user_default_data: JSON.stringify(saveStateJSON)
					}).subscribe(
						(result: any) => {
							if (result.status === 'ok') {
								this.deleteToken();
								const prefix = (JSON.parse(localStorage.getItem('Prefix')) ? JSON.parse(localStorage.getItem('Prefix')).pre: JSON.parse(localStorage.getItem('currentUser')).Prefix);
								localStorage.clear();
								localStorage.setItem('Prefix', JSON.stringify({ pre: prefix }));
								this.loaderService.setUserPrefix(prefix);
								const routeStore: RouteStore = new RouteStore();
								routeStore.adm_no = '';
								routeStore.login_id = '';
								this._cookieService.removeAll();
								this.router.navigate(['/login']);
							} else {
							}
						});
				} else {
					this.router.navigate(['/login']);
				}
			} else {
				this.router.navigate(['/login']);
			}
		}
	}
	getSchool() {
		this.loaderService.getSchool2().subscribe((result: any) => {
			if (result.status === 'ok') {
				this.schoolInfo = {};
				this.schoolInfo = result.data[0];
			}
		});
	}
}
