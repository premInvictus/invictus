import { Component, OnInit } from '@angular/core';
import { QelementService } from '../../questionbank/service/qelement.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NotificationService } from '../../_services/index';

@Component({
	selector: 'app-school-student-reports',
	templateUrl: './school-student-reports.component.html',
	styleUrls: ['./school-student-reports.component.css']
})
export class SchoolStudentReportsComponent implements OnInit {
	adminOverallFilter: FormGroup;
	subjectArray: any[] = [];
	classArray: any[] = [];
	sectionsArray: any[];
	userDetail: any = [];
	homeUrl: string;
	currentUser: any;
	currentusername: any;
	currentUserClass: any;
	currentUserSec: any;
	userAdmision: any;
	reportFlag = false;
	tabFlag = false;
	tabFlag6 = false;
	constructor( private fbuild: FormBuilder,
		private qelementService: QelementService,
		private notif: NotificationService) { }

	ngOnInit() {
		this.getClass();
		this.buildForm();
	}
	buildForm() {
		this.adminOverallFilter = this.fbuild.group({
			sub_id: '',
			es_class_id: '',
			es_sec_id: '',
			es_studentName_id: '',
			au_admission_no: ''
		});
	}

	getUser() {
		this.userDetail = [];
		this.qelementService.getUser({ class_id: this.adminOverallFilter.value.es_class_id,
			sec_id: this.adminOverallFilter.value.es_sec_id, role_id: '4' }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.userDetail = result.data;
					this.reportFlag = false;
					this.tabFlag = false;
				} else {
					this.notif.showSuccessErrorMessage('No student  in this section', 'error');
					this.reportFlag = false;
					this.tabFlag = false;
				}
			}
		);
	}

	getCurrentUser(value): void {
		this.currentUser = [];
		this.currentusername = [];
		this.currentUserClass = [];
		this.currentUserSec = [];
		for (const item of this.userDetail) {
			if (value === item.au_login_id) {
				this.currentUser = item;
				this.reportFlag = false;
				this.tabFlag = false;
				this.tabFlag6 = false;
			}
		}
	}

	getClass() {
		this.qelementService.getClass().subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.classArray = result.data;
				}
			}
		);
	}

	getSectionsByClass() {
		this.sectionsArray = [];
		this.qelementService.getSectionsByClass(this.adminOverallFilter.value.es_class_id).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.sectionsArray = result.data;
					this.reportFlag = false;
					this.tabFlag = false;
					this.tabFlag6 = false;
				} else {
					this.reportFlag = false;
					this.tabFlag = false;
					this.tabFlag6 = false;
				}
			}
		);
	}
	/* Calling getSubjectsByClass to display the "Subject" dropdown  */
	getSubjectsByClass() {
		this.subjectArray = [];
		this.qelementService.getSubjectsByClass(this.adminOverallFilter.value.es_class_id).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.subjectArray = result.data;
				}
			}
		);
}
displayReport() {
	this.reportFlag = true;
}
setTabFlag() {
	this.tabFlag = true;
}
setTabFlag6() {
	this.tabFlag6 = true;
}
}
