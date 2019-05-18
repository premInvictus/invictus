import { ChangeDetectorRef, Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSidenav, MatTooltip } from '@angular/material';
import { CookieService } from 'ngx-cookie';
import { environment } from 'src/environments/environment';
import { UserTypeService } from 'projects/fee/src/app/usertype/usertype.service';
import { SisService } from 'projects/fee/src/app/_services';
import { CommonAPIService, NotificationService } from 'projects/axiom/src/app/_services/index';
import { QelementService } from 'projects/axiom/src/app/questionbank/service/qelement.service';
import { AdminService } from 'projects/axiom/src/app/user-type/admin/services/admin.service';
import { LoaderService } from 'projects/fee/src/app/_services/loader.service';
@Component({
	selector: 'app-top-nav',
	templateUrl: './top-nav.component.html',
	styleUrls: ['./top-nav.component.scss']
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
	clicked: any;
	finalFont: any[] = [];
	upperMenu: any;
	getUserDetail: any[] = [];
	usernane: any = '';
	schoolinfoArray: any;
	image: any;
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
	defaultProject;
	proUrl: any;
	private _mobileQueryListener: () => void;


	constructor(
		changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
		private sisService: SisService,
		private router: Router,
		private qelementService: QelementService,
		private adminService: AdminService,
		private userTypeService: UserTypeService,
		private notif: NotificationService,
		private loader: LoaderService,
		private commonAPIService: CommonAPIService, private _cookieService: CookieService,
		private route: ActivatedRoute) {

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
		this.getProjectList();
		this.checkUpdateProfile();
		this.checkViewProfile();
		const param: any = {};
		if (this.currentUser.role_id !== '4') {
			param.login_id = this.currentUser.login_id;
		}
		this.getUser();
		this.proUrl = JSON.parse(localStorage.getItem('project')).pro_url;
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
		this.sisService.getSession().subscribe((result2: any) => {
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
			const findex = this.projectsArray.findIndex(f => f.pro_id === '3');
			if (findex !== -1) {
				this.defaultProject = this.projectsArray[findex].pro_name;
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
		const saveStateJSON = {
			pro_url: this.proUrl,
			ses_id: JSON.parse(localStorage.getItem('session')).ses_id
		};
		this.sisService.saveUserLastState({ user_default_data: JSON.stringify(saveStateJSON) }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				if (Number(pro_id) === 1) {
					this.router.navigate(['/axiom']);
				}
				if (Number(pro_id) === 2) {
					this.router.navigate(['/sis']);
				}
				if (Number(pro_id) === 3) {
					this.router.navigate(['/fees']);
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
		this.userTypeService.getProjectList({}).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.projectsArray = result.data;
				}
			});
	}

	logout() {
		this.userData = JSON.parse(this._cookieService.get('userData'));
		if (this.userData) {
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
						localStorage.clear();
						this._cookieService.removeAll();
						this.router.navigate(['/login']);
					} else {
						this.notif.showSuccessErrorMessage('Error While Logout', 'error');
					}
				});
		}
	}



}
