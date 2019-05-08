import { ChangeDetectorRef, Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatSidenav, MatTooltip } from '@angular/material';
import { environment } from '../../../environments/environment';
import { ManageUsersService } from '../../manage-users/service/manage-users.service';
import { SisService, CommonAPIService } from '../../_services/index';
import { Router, CanActivate, ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CookieService } from 'ngx-cookie';
@Component({
	selector: 'app-top-nav',
	templateUrl: './top-nav.component.html',
	styleUrls: ['./top-nav.component.scss']
})



export class TopNavComponent implements OnInit, OnDestroy, AfterViewInit {
	@ViewChild('sidenav') sidenav: MatSidenav;
	@ViewChild('tooltip') tooltip: MatTooltip;


	hosturl = environment.apiSisUrl;
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
	private _mobileQueryListener: () => void;


	constructor(
		changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
		private sisService: SisService,
		private router: Router,
		private manageUsersService: ManageUsersService,
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
	}

	ngAfterViewInit() {
		this.tooltip.show();
	}
	getSession() {
		this.sisService.getSession().subscribe((result2: any) => {
			if (result2.status === 'ok') {
				this.sessionArray = result2.data;
				this.getSchool();
			}
		});
	}
	setSession(ses_id) {
		localStorage.removeItem('session');
		this.session = {};
		this.session.ses_id = ses_id;
		localStorage.setItem('session', JSON.stringify(this.session));
		location.reload();

	}
	getSchool() {
		this.sisService.getSchool().subscribe((result: any) => {
			if (result.status === 'ok') {
				this.schoolInfo = result.data[0];
			}
			const findex = this.projectsArray.findIndex(f => f.pro_id === '2');
			if (findex !== -1) {
				this.defaultProject = this.projectsArray[findex].pro_name;
			}
		});
	}
	goToProject(pro_url, pro_status, pro_id) {
		console.log(pro_id);
		const findex = this.projectsArray.findIndex(f => f.pro_id === pro_id);
		if (findex !== -1) {
			this.defaultProject = this.projectsArray[findex].pro_name;
		}
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
	getSessionName(id) {
		const findex = this.sessionArray.findIndex(f => f.ses_id === id);
		if (findex !== -1) {
			return this.sessionArray[findex].ses_name;
		}
	}
	getProjectList() {
		this.manageUsersService.getProjectList({}).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.projectsArray = result.data;
				}
			});
	}

	logout() {
		if (this._cookieService.get('userData')) {
			this.userData = JSON.parse(this._cookieService.get('userData'));
			if (this.userData) {
				this.sisService.logout({ au_login_id: this.userData['LN'] }).subscribe(
					(result: any) => {
						if (result.status === 'ok') {
							localStorage.clear();
							this._cookieService.removeAll();
							this.router.navigate(['/login']);
						} else {
							this.commonAPIService.showSuccessErrorMessage('Error While Logout', 'error');
						}
					});
			}
		} else {
			this.router.navigate(['/login']);
		}
	}


}
