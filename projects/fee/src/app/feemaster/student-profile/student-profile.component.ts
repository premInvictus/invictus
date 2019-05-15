import { Component, OnInit, ViewChild } from '@angular/core';
import { SisService, CommonAPIService, ProcesstypeService, FeeService } from '../../_services';
import { StudentAccountComponent } from '../student-account/student-account.component';
import { StudentRouteMoveStoreService } from '../student-route-move-store.service';

@Component({
	selector: 'app-student-profile',
	templateUrl: './student-profile.component.html',
	styleUrls: ['./student-profile.component.scss']
})
export class StudentProfileComponent implements OnInit {
	lastRecordId;
	loginId: any;
	editFlag: any;
	editRequestFlag: any;
	permissionFlag: any;
	viewOnly = true;
	@ViewChild(StudentAccountComponent) stuAcc: StudentAccountComponent;
	constructor(
		private sisService: SisService,
		private commmon: CommonAPIService,
		public processtypeService: ProcesstypeService,
		public studentRouteMoveStoreService: StudentRouteMoveStoreService
	) { }

	ngOnInit() {
		if (this.commmon.isExistUserAccessMenu('350')) {
			this.editFlag = true;
		}
		if (this.commmon.isExistUserAccessMenu('374')) {
			this.editRequestFlag = true;
		}
		this.studentRouteMoveStoreService.getRouteStore().then((data: any) => {
			if (data.adm_no && data.login_id) {
				this.lastRecordId = data.adm_no;
				this.loginId = data.login_id;
			} else {
				this.processtypeService.setProcesstype('4');
				this.sisService.getStudentLastRecordPerProcessType().subscribe((result: any) => {
					if (result.status === 'ok') {
						this.lastRecordId = result.data[0].last_record;
						this.loginId = result.data[0].au_login_id;
					}
				});
			}

		});
	}
	next(admno) {
		this.loginId = admno;
		this.stuAcc.getFeeAccount(this.loginId);
	}
	prev(admno) {
		this.loginId = admno;
		this.stuAcc.getFeeAccount(this.loginId);
	}
	first(admno) {
		this.loginId = admno;
		this.stuAcc.getFeeAccount(this.loginId);
	}
	last(admno) {
		this.loginId = admno;
		this.stuAcc.getFeeAccount(this.loginId);
	}
	key(admno) {
		this.loginId = admno;
		this.stuAcc.getFeeAccount(this.loginId);
	}
	enableEdit() {
		this.viewOnly = false;
		this.editFlag = false;
	}
	enableEditRequest() {
		this.viewOnly = false;
		this.editRequestFlag = false;
	}
	editChange(flag) {
		this.viewOnly = flag;
		if (this.viewOnly && this.commmon.isExistUserAccessMenu('350')) {
			this.editFlag = true;
		}
		if (this.viewOnly && this.commmon.isExistUserAccessMenu('374')) {
			this.editRequestFlag = true;
		}
	}
}
