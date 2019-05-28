import { Component, OnInit, ViewChild } from '@angular/core';
import { SisService, CommonAPIService, ProcesstypeFeeService, FeeService } from '../../_services';
import { StudentAccountComponent } from '../student-account/student-account.component';
import { StudentRouteMoveStoreService } from '../student-route-move-store.service';
import { CommonStudentProfileComponent } from '../common-student-profile/common-student-profile.component';

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
	@ViewChild (CommonStudentProfileComponent) commonStu: CommonStudentProfileComponent;
	feeRenderId: any;
	constructor(
		private sisService: SisService,
		private commmon: CommonAPIService,
		public processtypeService: ProcesstypeFeeService,
		public studentRouteMoveStoreService: StudentRouteMoveStoreService
	) { }

	ngOnInit() {
		this.studentRouteMoveStoreService.getRouteStore().then((data: any) => {
			if (data.adm_no && data.login_id) {
				this.lastRecordId = data.adm_no;
				this.loginId = data.login_id;
			} else {
				this.sisService.getStudentLastRecordPerProcessType().subscribe((result: any) => {
					if (result.status === 'ok') {
						this.lastRecordId = result.data[0].last_record;
						this.loginId = result.data[0].au_login_id;
					}
				});
			}

		});
	}
	checkEmit(process_type) {
		if (process_type) {
			this.sisService.getStudentLastRecordPerProcessType().subscribe((result: any) => {
				if (result.status === 'ok') {
					if (result.data[0].last_record && result.data[0].au_login_id) {
					this.lastRecordId = result.data[0].last_record;
					this.loginId = result.data[0].au_login_id;
					}
				}
			});
		}
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
		this.feeRenderId = '';
		if (flag) {
		this.viewOnly = true;
		this.feeRenderId = this.commonStu.studentdetailsform.value.au_enrollment_id;
		}
		if (this.viewOnly && this.isExist('350') ) {
			this.editFlag = true;
		}
		if (this.viewOnly && this.commmon.isExistUserAccessMenu('374')) {
			this.editRequestFlag = true;
		}
	}
	isExist(mod_id) {
		if (mod_id === '350') {
			if (this.commmon.isExistUserAccessMenu(mod_id)) {
				this.editFlag = true;
				return true;
			}
		}
		if (mod_id === '374') {
			if (this.commmon.isExistUserAccessMenu(mod_id)) {
				this.editRequestFlag = true;
				return true;
			}
		}
	}
}
