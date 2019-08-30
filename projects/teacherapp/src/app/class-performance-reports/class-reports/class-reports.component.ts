import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { QelementService } from '../../questionbank/service/qelement.service';
import { ReportService } from '../../_services/report.service';
import { NotificationService, BreadCrumbService } from '../../_services/index';
@Component({
	selector: 'app-class-reports',
	templateUrl: './class-reports.component.html',
	styleUrls: ['./class-reports.component.css']
})
export class ClassReportsComponent implements OnInit {
	classPerformanceFilter: FormGroup;
	classArray: any[];
	subjectArray: any[];
	sectionsArray: any[];
	userDetail: any;
	sub_id: any;
	currentusername: any;
	currentUserClass: any;
	currentUserSec: any;
	currentUser: any = {};
	homeUrl: string;
	currentUserSub: any;
	PerformanceDiv = false;
	studentInfoDiv = false;
	classPerformanceArray: any[] = [];
	topicNameArray: any[] = [];
	subtopicNameArray: any[] = [];
	topicSubtopicArray: any[] = [];
	reportFlag = false;
	tabFlag1 = false;
	tabFlag2 = false;
	tabFlag3 = false;
	constructor(private fbuild: FormBuilder,
		private qelementService: QelementService,
		private breadCrumbService: BreadCrumbService,
		private notif: NotificationService,
		private reportService: ReportService) { }

	ngOnInit() {
		this.homeUrl = this.breadCrumbService.getUrl();
		this.getClass();
		this.buildForm();
	}
	buildForm() {
		this.classPerformanceFilter = this.fbuild.group({
			class_id: '',
			sub_id: '',
			sec_id: ''
		});
	}

	getUser() {
		this.qelementService.getUser({
			class_id: this.classPerformanceFilter.value.class_id,
			sec_id: this.classPerformanceFilter.value.sec_id, role_id: '4'
		}).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.userDetail = result.data;
					for (const item of this.userDetail) {
						this.currentUser = item;
						this.reportFlag = false;
						this.tabFlag1 = false;
						this.tabFlag2 = false;
						this.tabFlag3 = false;
					}
				} else {
					this.reportFlag = false;
					this.tabFlag1 = false;
					this.tabFlag2 = false;
					this.tabFlag3 = false;
				}
			}
		);
	}
	getCurrentSubject(value): void {
		this.PerformanceDiv = false;
		this.studentInfoDiv = false;
		this.sub_id = value;
		for (const item of this.subjectArray) {
			if (value === item.sub_id) {
				this.currentUserSub = item.sub_name;
				this.reportFlag = false;
				this.tabFlag1 = false;
				this.tabFlag2 = false;
				this.tabFlag3 = false;
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
		this.qelementService.getSectionsByClass(this.classPerformanceFilter.value.class_id).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.sectionsArray = result.data;
					this.reportFlag = false;
					this.tabFlag1 = false;
					this.tabFlag2 = false;
					this.tabFlag3 = false;
				} else {
					this.reportFlag = false;
					this.tabFlag1 = false;
					this.tabFlag2 = false;
					this.tabFlag3 = false;
				}
			}
		);
	}

	getSubjectsByClass(): void {
		this.subjectArray = [];
		this.qelementService.getSubjectsByClass(this.classPerformanceFilter.value.class_id).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.subjectArray = result.data;
				}
			}
		);
	}
	classPerformance() {
		this.reportFlag = true;
	}
	setTab1() {
		this.tabFlag1 = true;
	}
	setTab2() {
		this.tabFlag2 = true;
	}
	setTab3() {
		this.tabFlag3 = true;
	}
}
