import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { QelementService } from '../../questionbank/service/qelement.service';
import { ReportService } from '../../_services/report.service';
import { NotificationService, BreadCrumbService } from '../../_services/index';

@Component({
	selector: 'app-class-performance-report',
	templateUrl: './class-performance-report.component.html',
	styleUrls: ['./class-performance-report.component.css']
})
export class ClassPerformanceReportComponent implements OnInit, OnChanges {

	@Input() classPerformanceFilter: FormGroup;
	classArray: any[];
	@Input() subjectArray: any[];
	sectionsArray: any[];
	userDetail: any;
	sub_id: any;
	homeUrl: string;
	@Input() currentUser: any;
	PerformanceDiv = false;
	studentInfoDiv = false;
	classPerformanceArray: any[] = [];
	topicNameArray: any[] = [];
	subtopicNameArray: any[] = [];
	topicSubtopicArray: any[] = [];
	@Input() reportFlag: any;

	constructor(
		private fbuild: FormBuilder,
		private qelementService: QelementService,
		private breadCrumbService: BreadCrumbService,
		private notif: NotificationService,
		private reportService: ReportService) { }

	ngOnInit() {
		this.homeUrl = this.breadCrumbService.getUrl();
		this.PerformanceDiv = false;
	}
	ngOnChanges() {
		if (this.reportFlag) {
			this.classPerformanceFilter.value.sub_id = this.subjectArray[0].sub_id;
			this.classPerformance();
		} else {
			this.PerformanceDiv = false;
		}
	}
	getCurrentSubject(value): void {
		this.classPerformanceFilter.value.sub_id = value;
		this.classPerformance();
	}
	classPerformance(): void {
		if (this.classPerformanceFilter.valid) {
			this.classPerformanceArray = [];
			this.topicNameArray = [];
			this.subtopicNameArray = [];
			this.topicSubtopicArray = [];
			this.reportService.classPerformanceTopicSubtopicwise({
				class_id: this.classPerformanceFilter.value.class_id,
				sub_id: this.classPerformanceFilter.value.sub_id, sec_id: this.classPerformanceFilter.value.sec_id
			}).subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.studentInfoDiv = true;
						this.PerformanceDiv = true;
						this.classPerformanceArray = result.data;
					} else {
						this.PerformanceDiv = true;
					}
				}
			);
		}
	}
	printPerformance() {
		const printModal2 = document.getElementById('printModal');
		const popupWin = window.open('', '_blank', 'width=screen.width,height=screen.height');
		popupWin.document.open();
		popupWin.document.write('<html><link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.13/css/all.css"' +
			'integrity="sha384-DNOHZ68U8hZfKXOrtjWvjxusGo9WQnrNx2sqG0tfsghAvtVlRW3tvkXWZh58N9jp" crossorigin="anonymous">' +
			'<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">' +
			'<style>button.submit-button { display:none; } @page {size:landscape}' +
			'.dialog-table-review {font-size: 12px;width:100%}' +
			'.table-top-border-remove td{border-top: none !important;text-align:center !important}' +
			'.tStyle[_ngcontent-c20] {width: 26%;}' +
			'.dialog-table-review-header {background-color: #e6e5df !important;}' +
			'.teacher-other-tab-table {border: 1px solid #9c3;height:500px !important}' +
			'.change_mat_progress{display: block;height: 15px;overflow: hidden;position: relative;transition: opacity 250ms linear;}' +
			'.table-top-border-remove td{border-top: none !important;}' +
			'.user-table[_ngcontent-c15] {padding-top: 10px;width: 100%;max-width: 100%;overflow-x: hidden;}' +
			'table[_ngcontent-c15] {font-size: 14px;}' +
			'.table {width: 100%;max-width: 100%;margin-bottom: 0rem;background-color: transparent;}' +
			'tr[_ngcontent-c15],th[_ngcontent-c15],tD[_ngcontent-c15], {padding: 8px;}' +
			'.report-information-bar {background-color: #e6e5df;}' +
			'.mat-progress-bar .mat-progress-bar-element {height: 100% ;width: 100%;position:absolute}' +
			'.mat-progress-bar-buffer {background: #E4E8EB !important;}' +
			'.mat-progress-bar-primary.mat-progress-bar-fill.mat-progress-bar-element {transform: scaleX(0.02);}' +
			'.barStyle[_ngcontent-c20] {width: 30%;}' +
			'.mat-progress-bar .mat-progress-bar-fill {animation: none;transform-origin: top left;transition: transform 250ms ease;' +
			'transform: scaleX(0.02);}' +
			'.mat-progress-bar-primary.mat-progress-bar-fill.mat-progress-bar-element {background-color: #258cb3 !important;}' +
			'.teacher-score-flag-green {color: #28a745 !important;font-size: 16px !important;}' +
			'.teacher-score-flag-yellow {color: #ffc108 !important;font-size: 16px !important;}' +
			'.teacher-score-flag-red {color: #dc3545 !important;font-size: 16px !important;}' +
			'.float-right{float:right}' +
			'tr[_ngcontent-c20], th[_ngcontent-c20], td[_ngcontent-c20] {padding: 8px;}' +
			'.information-bar-content {padding: 10px;font-size: 14px !important;text-align: center !important;}' +
			'.info-third-circle {color: #6c65c8;}' +
			'.info-second-circle {color: #32bea2;}' +
			'.info-first-circle {color: #f44a66;}' +
			'mat-form-field {display: none;}' +
			'i{padding:5px}' +
			'.white-box-content-title {text-align: center;font-size: 20px;padding-bottom: 25px;padding-top: 25px;}' +
			'.float-right{float-right}' +
			'</style><body onload="window.print()">' + printModal2.innerHTML + '</html>');
		popupWin.document.close();
	}
	getFlag(value) {
		if (Number(value) > 60) {
			return '<i class="far fa-flag teacher-score-flag-green"></i>';
		} else if (Number(value) > 32) {
			return '<i class="far fa-flag teacher-score-flag-yellow"></i>';
		} else {
			return '<i class="far fa-flag  teacher-score-flag-red"></i>';
		}
	}
}
