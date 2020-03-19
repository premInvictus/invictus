import { ChangeDetectorRef, Component, OnInit, OnDestroy, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSidenav, MatTooltip } from '@angular/material';
import { CookieService } from 'ngx-cookie';
import { environment } from 'src/environments/environment';
import { UserTypeService } from 'projects/fee/src/app/usertype/usertype.service';
import { SisService } from 'projects/fee/src/app/_services';
import { NotificationService } from 'projects/axiom/src/app/_services/index';
import { CommonAPIService } from '../../_services/index';
import { QelementService } from 'projects/axiom/src/app/questionbank/service/qelement.service';
import { AdminService } from 'projects/axiom/src/app/user-type/admin/services/admin.service';
import { LoaderService } from 'projects/fee/src/app/_services/loader.service';
import { RouteStore } from 'projects/fee/src/app/feemaster/student-route-move-store.service';
import { TruncatetextPipe } from '../../_pipes/truncatetext.pipe'
import { AngularFireMessaging } from '@angular/fire/messaging';
import { mergeMap } from 'rxjs/operators';
@Component({
	selector: 'app-top-nav',
	templateUrl: './top-nav.component.html',
	styleUrls: ['./top-nav.component.css']
})
export class TopNavComponent implements OnInit, OnDestroy, AfterViewInit {
	@ViewChild('sidenav') sidenav: MatSidenav;
	@ViewChild('tooltip') tooltip: MatTooltip;

	hosturl = environment.apiAxiomUrl;
	today = new Date().getFullYear();
	schooldetailsArray: any[];
	currentUser: any = {};
	userAccessMenuArray: any[] = [];
	menuSubmenuArray: any[] = [];
	notficationMsg: any[] = [];
	clicked: any;
	finalFont: any[] = [];
	upperMenu: any;
	getUserDetail: any[] = [];
	usernane: any = '';
	schoolinfoArray: any;
	image: any;
	showNotification = false;
	showImage = false;
	showImageBlank = false;
	schoolName: any;
	projectsArray: any[] = [];
	projectName: any;
	schoolInfo: any = {};
	academicYear: any;
	updateProfileFlag = false;
	viewProfileFlag = false;
	submenuLength = 0;
	submenuLengthArray: any[] = [];
	sessionArray: any[] = [];
	session: any = {};
	mobileQuery: MediaQueryList;
	currentDate = new Date();
	userData: any;
	defaultProject = 'AXIOM';
	proUrl: any;
	projectId: any;
	private _mobileQueryListener: () => void;
	innerHeight: any;
	resultArray: any[] = [];

	constructor(
		changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
		private angularFireMessaging: AngularFireMessaging,
		private sisService: SisService,
		private router: Router,
		private qelementService: QelementService,
		private adminService: AdminService,
		private userTypeService: UserTypeService,
		private notif: NotificationService,
		private loader: LoaderService,
		private commonAPIService: CommonAPIService, private _cookieService: CookieService,
		private route: ActivatedRoute) {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.mobileQuery = media.matchMedia('(max-width: 600px)');
		this._mobileQueryListener = () => changeDetectorRef.detectChanges();
		this.mobileQuery.addListener(this._mobileQueryListener);
	}

	ngOnDestroy(): void {
		this.mobileQuery.removeListener(this._mobileQueryListener);
	}
	sidenavOpen() {
		const element = document.getElementById('sidenav');
		const elementTwo = document.getElementById('sidenav-content');
		element.classList.toggle('custom-sidenav');
		elementTwo.classList.toggle('custom-sidenav-content');
	}
	ngOnInit() {
		this.getPushNotification();
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.session = JSON.parse(localStorage.getItem('session'));
		this.getSession();
		this.getProjectList();
		const wrapperMenu = document.querySelector('.wrapper-menu');

		wrapperMenu.addEventListener('click', function () {
			wrapperMenu.classList.toggle('open');
		});
		if (!(JSON.parse(localStorage.getItem('qSubType')))) {
			if (this._cookieService.get('userData')) {
				this.commonAPIService.getQTypeFromApi().subscribe((result: any) => {
					if (result && result.status === 'ok') {
						this.commonAPIService.setQType(result.data);
						localStorage.setItem('qSubType', JSON.stringify(result.data));
					}
				});
			}
		} else {
			this.commonAPIService.setQType(JSON.parse(localStorage.getItem('qSubType')));
		}
		this.upperMenu = '<i class=\'fas fa-users\'></i>';
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.session = JSON.parse(localStorage.getItem('session'));
		if (this.currentUser.role_id === 1) {
			this.getUserAccessSchool();
		}
		if (this.currentUser.full_name) {
			this.usernane = this.currentUser.full_name.charAt(0).toUpperCase() + this.currentUser.full_name.slice(1);
		}
		this.getSchool();
		this.checkUpdateProfile();
		this.checkViewProfile();
		const param: any = {};
		if (this.currentUser.role_id !== '4') {
			param.login_id = this.currentUser.login_id;
		}
		this.getUser();
		this.proUrl = JSON.parse(localStorage.getItem('project')).pro_url;
		if (localStorage.getItem('project')) {
			const url = JSON.parse(localStorage.getItem('project')).pro_url;
			if (url === 'axiom') {
				this.defaultProject = 'AXIOM';
				this.projectId = '1';
			} else if (url === 'sis') {
				this.defaultProject = 'Student Information System';
				this.projectId = '2';
			} else if (url === 'fees') {
				this.defaultProject = 'Fee Management';
				this.projectId = '3';
			} else if (url === 'smart') {
				this.defaultProject = 'SMART';
				this.projectId = '4';
			} else if (url === 'exam') {
				this.defaultProject = 'Examination';
				this.projectId = '5';
			} else if (url === 'library') {
				this.defaultProject = 'Library Management';
				this.projectId = '6';
			} else if (url === 'hr') {
				this.defaultProject = 'HRMS';
				this.projectId = '8';
			} else if (url === 'misc') {
				this.defaultProject = 'Miscellaneous';
				this.projectId = '11';
			} else if (url === 'inventory') {
				this.defaultProject = 'Inventory';
				this.projectId = '12';
			}
		}
		this.commonAPIService.messageSub.subscribe((res: any) => {
			if (res.message === 'Sent') {
				this.getPushNotification();
			}
		});
	}
	checkUpdateProfile() {
		if (this.currentUser.role_id === '4' || this.currentUser.role_id === '3') {
			this.updateProfileFlag = true;
		} else {
			this.updateProfileFlag = false;
		}
	}
	checkViewProfile() {
		if (this.currentUser.role_id === '4' || this.currentUser.role_id === '3') {
			this.viewProfileFlag = false;
		} else {
			this.viewProfileFlag = true;
		}
	}

	ngAfterViewInit() {
		if (this.tooltip) {
			this.tooltip.show();
		}
	}
	getSession() {
		this.commonAPIService.getSession().subscribe((result2: any) => {
			if (result2.status === 'ok') {
				this.sessionArray = result2.data;
				this.getSchool();
			}
		});
	}
	getUser() {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		const param: any = {};
		param.login_id = this.currentUser.login_id;
		param.role_id = this.currentUser.role_id;
		this.qelementService.getUser(param).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.getUserDetail = result.data;
					if (this.getUserDetail[0].au_profileimage && this.getUserDetail[0].au_profileimage.charAt(0) === '.') {
						this.image = this.getUserDetail[0].au_profileimage.substring(1, this.getUserDetail[0].au_profileimage.length);
					} else {
						this.image = this.getUserDetail[0].au_profileimage;
					}
					if (this.image) {
						this.showImage = true;
					} else {
						this.showImageBlank = true;
					}
				}
			});
	}

	getUserAccessSchool() {
		this.adminService.getUserAccessSchool({ login_id: this.currentUser.login_id }).subscribe(
			(result: any) => {
				if (result.status === 'ok') {
					this.schooldetailsArray = result.data;
				}
			});
	}
	setSession(ses_id) {
		localStorage.removeItem('session');
		this.session = {};
		this.session.ses_id = ses_id;
		localStorage.setItem('session', JSON.stringify(this.session));
		const saveStateJSON = {
			pro_url: this.proUrl ? this.proUrl : '',
			ses_id: ses_id
		};
		this.sisService.saveUserLastState({ user_default_data: JSON.stringify(saveStateJSON) }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				location.reload();
			}
		});

	}
	getSchool() {
		this.sisService.getSchool().subscribe((result: any) => {
			if (result.status === 'ok') {
				this.schoolInfo = result.data[0];
			}
		});
	}
	goToProject(pro_url, pro_status, pro_id) {
		this.loader.startLoading();
		const findex = this.projectsArray.findIndex(f => f.pro_id === pro_id);
		if (findex !== -1) {
			this.defaultProject = this.projectsArray[findex].pro_name;
		}
		if (Number(pro_id) === 1) {
			this.proUrl = 'axiom';
			localStorage.setItem('project', JSON.stringify({ pro_url: 'axiom' }));

		}
		if (Number(pro_id) === 2) {
			this.proUrl = 'sis';
			localStorage.setItem('project', JSON.stringify({ pro_url: 'sis' }));
		}
		if (Number(pro_id) === 3) {
			this.proUrl = 'fees';
			localStorage.setItem('project', JSON.stringify({ pro_url: 'fees' }));
		}
		if (Number(pro_id) === 4) {
			this.proUrl = 'smart';
			localStorage.setItem('project', JSON.stringify({ pro_url: 'smart' }));
		}
		if (Number(pro_id) === 5) {
			this.proUrl = 'exam';
			localStorage.setItem('project', JSON.stringify({ pro_url: 'exam' }));
		}
		if (Number(pro_id) === 6) {
			this.proUrl = 'library';
			localStorage.setItem('project', JSON.stringify({ pro_url: 'library' }));
		}
		if (Number(pro_id) === 8) {
			this.proUrl = 'hr';
			localStorage.setItem('project', JSON.stringify({ pro_url: 'hr' }));
		} if (Number(pro_id) === 11) {
			this.proUrl = 'misc';
			localStorage.setItem('project', JSON.stringify({ pro_url: 'misc' }));
		} if (Number(pro_id) === 12) {
			this.proUrl = 'inventory';
			localStorage.setItem('project', JSON.stringify({ pro_url: 'inventory' }));
		}
		const saveStateJSON = {
			pro_url: this.proUrl,
			ses_id: JSON.parse(localStorage.getItem('session')).ses_id
		};
		this.sisService.saveUserLastState({ user_default_data: JSON.stringify(saveStateJSON) }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				if (Number(pro_id) === 1) {
					this.router.navigate(['/axiom']);
					this.defaultProject = 'AXIOM';
					this.projectId = '1';
				}
				if (Number(pro_id) === 2) {
					this.router.navigate(['/sis']);
					this.defaultProject = 'Student Information System';
					this.projectId = '2';
				}
				if (Number(pro_id) === 3) {
					this.router.navigate(['/fees']);
					this.defaultProject = 'Fee Management';
					this.projectId = '3';
				}
				if (Number(pro_id) === 4) {
					this.router.navigate(['/smart']);
					this.defaultProject = 'SMART';
					this.projectId = '4';
				}
				if (Number(pro_id) === 5) {
					this.router.navigate(['/exam']);
					this.defaultProject = 'Examination';
					this.projectId = '5';
				}
				if (Number(pro_id) === 6) {
					this.router.navigate(['/library']);
					this.defaultProject = 'Library Management';
					this.projectId = '6';
				}
				if (Number(pro_id) === 8) {
					this.router.navigate(['/hr']);
					this.defaultProject = 'HRMS';
					this.projectId = '8';
				}
				if (Number(pro_id) === 11) {
					this.router.navigate(['/misc']);
					this.defaultProject = 'Miscellaneous';
					this.projectId = '11';
				}
				if (Number(pro_id) === 12) {
					this.router.navigate(['/inventory']);
					this.defaultProject = 'Inventory';
					this.projectId = '12';
				}
			}
		});
	}
	getSessionName(id) {
		const findex = this.sessionArray.findIndex(f => f.ses_id === id);
		if (findex !== -1) {
			return this.sessionArray[findex].ses_name;
		}
	}
	getProjectList() {
		let overALLProjectList = [];
		let userProjectList = [];
		this.projectsArray = [];
		this.userTypeService.getProjectList({}).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					overALLProjectList = result.data;
					this.adminService.getUserProject({ au_login_id: this.currentUser.login_id }).subscribe(
						(result: any) => {
							if (result && result.status === 'ok') {
								userProjectList = JSON.parse(result.data[0].au_project_mapped);
								for (let item of overALLProjectList) {
									const findex = userProjectList.findIndex(f => Number(f.pro_id) === Number(item.pro_id));
									if (findex !== -1) {
										this.projectsArray.push(item);
									}
								}
							} else {
								this.projectsArray = [{
									pro_id: "8",
									pro_name: "HRMS",
									pro_status: "1",
									pro_url: "hr"
								}];
							}
						});
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
	logout() {
		if (this._cookieService.get('userData')) {
			this.userData = JSON.parse(this._cookieService.get('userData'));
			if (this.userData) {
				if (localStorage && localStorage.getItem('session')) {
					const saveStateJSON = {
						pro_url: this.proUrl ? this.proUrl : '',
						ses_id: JSON.parse(localStorage.getItem('session')).ses_id
					};
					this.sisService.logout({
						au_login_id: this.userData['LN'],
						user_default_data: JSON.stringify(saveStateJSON)
					}).subscribe(
						(result: any) => {
							if (result.status === 'ok') {
								this.deleteToken();
								localStorage.clear();
								const routeStore: RouteStore = new RouteStore();
								routeStore.adm_no = '';
								routeStore.login_id = '';
								this._cookieService.removeAll();
								this.router.navigate(['/login']);
							} else {
								this.notif.showSuccessErrorMessage('Error While Logout', 'error');
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
	getPushNotification() {
		this.notficationMsg = [];
		this.commonAPIService.getWebPushNotification({ 'msg_to': this.currentUser.login_id }).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.resultArray = result.data;
				let i = 0;
				for (const item of this.resultArray) {
					if (i < 5) {
						this.notficationMsg.push(item);
					}
					i++;
				}
				for (const item of this.notficationMsg) {
					item.msg_description = new TruncatetextPipe().transform(item.msg_description, 80);
				}
			} else {
				this.resultArray = [];
				this.notficationMsg = [];
			}
		});

	}
	markRead(item) {
		item.msg_to[0].msg_status = [{
			'status_name': 'send'
		}, {
			'status_name': 'read'
		}]
		console.log(item.msg_to[0].msg_status);
	}
	redirectModule(event) {
		event.msg_to[0].msg_status = [
			{
				'status_name': 'send'
			}, {
				'status_name': 'read'
			}];
		this.commonAPIService.updateMessage(event).subscribe((result: any) => {
			if (result) {
				if (this.currentUser.role_id === '4') {
					if (event.notification_type.module === 'syllabus') {
						this.router.navigate(['../academics/view-classwork'], { relativeTo: this.route });
					}
					if (event.notification_type.module === 'assignment') {
						this.router.navigate(['../academics/assignment'], { relativeTo: this.route });
					}
					if (event.notification_type.module === 'fees') {
						this.router.navigate(['../fees/student-fee-detail'], { relativeTo: this.route });
					}
					if (event.notification_type.module === 'classwork') {
						this.router.navigate(['../academics/view-classwork'], { relativeTo: this.route });
					}
					if (event.notification_type.module === 'leave') {
						this.router.navigate(['../academics/leave'], { relativeTo: this.route });
					}
					if (event.notification_type.module === 'timetable') {
						this.router.navigate(['../academics/timetable'], { relativeTo: this.route });
					}
				}
				if (this.currentUser.role_id === '3') {
					if (event.notification_type.module === 'syllabus') {
						this.router.navigate(['../syllabus/add'], { relativeTo: this.route });
					}
					if (event.notification_type.module === 'assignment') {
						this.router.navigate(['../assignment/past-assignments'], { relativeTo: this.route });
					}
					if (event.notification_type.module === 'fees') {
						this.router.navigate(['../fees/student-fee-detail'], { relativeTo: this.route });
					}
					if (event.notification_type.module === 'classwork') {
						this.router.navigate(['../logentry/view-classwork'], { relativeTo: this.route });
					}
					if (event.notification_type.module === 'leave') {
						this.router.navigate(['../academics/leave'], { relativeTo: this.route });
					}
					if (event.notification_type.module === 'timetable') {
						this.router.navigate(['../auxillaries/classwise-table'], { relativeTo: this.route });
					}
				}
				if (this.currentUser.role_id === '2') {
					this.commonAPIService.setNotif(1);
					this.goToProject('misc', '1', '11');
				}
			}
		});
	}
	deleteNofiy(event) {
		event.msg_to[0].msg_status = [
			{
				'status_name': 'send'
			}, {
				'status_name': 'delete'
			}];
		this.commonAPIService.updateMessage(event).subscribe((result: any) => {
			if (result) {
				this.getPushNotification();
				this.commonAPIService.showSuccessErrorMessage('Notification deleted Successfully', 'success');
			} else {
				this.commonAPIService.showSuccessErrorMessage('Some error Occur !!', 'error');
			}
		});
	}
	viewAll() {
		this.showNotification = false;
		if (this.currentUser.role_id === '3') {
			this.router.navigate(['teacher/notification']);
		}
		if (this.currentUser.role_id === '4') {
			this.router.navigate(['student/notification']);
		}
		if (this.currentUser.role_id === '2') {
			this.commonAPIService.setNotif(1);
			this.goToProject('misc', '1', '11');
			// this.router.navigate(['communication/notification']);
		}


	}
}
