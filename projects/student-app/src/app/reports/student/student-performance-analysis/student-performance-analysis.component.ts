import { Component, OnInit } from '@angular/core';
import { QelementService } from 'projects/axiom/src/app/questionbank/service/qelement.service';
import { ReportService } from 'projects/axiom/src/app/reports/service/report.service';
import { AcsetupService } from 'projects/axiom/src/app/acsetup/service/acsetup.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
	selector: 'app-student-performance-analysis',
	templateUrl: './student-performance-analysis.component.html',
	styleUrls: ['./student-performance-analysis.component.css']
})
export class StudentPerformanceAnalysisComponent implements OnInit {

	studentSubjectFilter: FormGroup;
	dlArray: any[] = [];
	skillArray: any[] = [];
	topicArray: any[] = [];
	subTypeArray: any[] = [];
	reportDLArray: any[] = [];
	reportSkillArray: any[] = [];
	reportSubtypeArray: any[] = [];
	subjectArray: any[] = [];
	classArray: any[] = [];
	performanceDiv = false;
	userDetail: any = {};
	sub_id;
	class_id;
	loading = false;
	tableWidth: any;
	topicLength: number;
	topicHeader: number;
	tdtopicWidth: any;
	topicHeaderStyle: any;
	tdtStudentOverallWidth: any;
	tdSubtypeWidth: any;
	tdDlWidth: any;
	studentOverallStyle: any;
	skillHeaderStyle: any;
	dlHeaderStyle: any;
	qstHeaderStyle: any;
	tableWidthCopy: any;
	tdSkillWidth: any;

	constructor(
		private fbuild: FormBuilder,
		private qelementService: QelementService,
		private reportService: ReportService,
		private acsetupService: AcsetupService
	) { }

	buildForm() {
		this.studentSubjectFilter = this.fbuild.group({
			class_id: '',
			sub_id: ''
		});
	}

	ngOnInit() {
		this.performanceDiv = false;
		const currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.qelementService.getUser({ login_id: currentUser.login_id, role_id: currentUser.role_id }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.performanceDiv = false;
					this.userDetail = result.data[0];
					this.class_id = this.userDetail.au_class_id;
					this.getClass();
					this.getLod();
					this.getSkill();
					this.getQsubtype();
					this.getSubjectsByClass(this.class_id);
				}
			}

		);
	}

	getClass() {
		this.performanceDiv = false;
		this.qelementService.getClass().subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.classArray = result.data;
				}
			}
		);
	}
	/* Adding getSubjectByClass to display the "Subject" dropdown  */
	getSubjectsByClass(param) {
		this.performanceDiv = false;
		this.subjectArray = [];
		this.qelementService.getSubjectsByClass(param).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.subjectArray = result.data;
				}
			}
		);
	}

	getLod() {
		this.performanceDiv = false;
		this.acsetupService.getLod().subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.dlArray = result.data;
				}
			}
		);
	}

	getSkill() {
		this.performanceDiv = false;
		this.acsetupService.getSkill().subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.skillArray = result.data;
				}
			}
		);
	}

	getQsubtype() {
		this.performanceDiv = false;
		this.acsetupService.getQsubtype().subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.subTypeArray = result.data;
				}
			}
		);
	}

	viewReportSkillType(value) {
		this.sub_id = value;
		const currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.reportService.viewReportSkillType({ login_id: currentUser.login_id, sub_id: this.sub_id }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.reportSkillArray = result.data;
				}
			}
		);
	}

	viewReportDifficultyLevel(value) {
		this.sub_id = value;
		const currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.reportService.viewReportDifficultyLevel({ login_id: currentUser.login_id, sub_id: this.sub_id }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.reportDLArray = result.data;
				}
			}
		);
	}

	viewReportQuestionType(value) {
		this.sub_id = value;
		this.performanceDiv = false;
		this.viewReportSkillType(value);
		this.viewReportDifficultyLevel(value);
		this.getTopicByClassSubject(value);
		const currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.reportService.viewReportQuestionType({ login_id: currentUser.login_id, sub_id: this.sub_id }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.reportSubtypeArray = result.data;
				}
			}
		);
	}

	getTopicByClassSubject(value) {
		this.sub_id = value;
		this.acsetupService.getTopicByClassSubject({ class_id: this.class_id, sub_id: this.sub_id }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.topicArray = result.data;
				}
			}
		);
	}

	getDLPercentage(topic_id, dl_id) {
		for (const report of this.reportDLArray) {
			if (report.dl_id === dl_id && report.topic_id === topic_id) {
				return Number((report.mark_scored * 100) / report.max_mark).toFixed(1);
			}
		}
	}

	getDLOverallPercentage(dl_id) {
		let total = 0, count = 0;
		for (const report of this.reportDLArray) {
			if (report.dl_id === dl_id) {
				total += Number((report.mark_scored * 100) / report.max_mark);
				count ++;
			}
		}
		if (isNaN(total / count)) {
			return '';
		} else {
			return (total / count).toFixed(1);

		}
	}

	getSkillPercentage(topic_id, skill_id) {
		for (const report of this.reportSkillArray) {
			if (report.skill_id === skill_id && report.topic_id === topic_id) {
				return Number((report.mark_scored * 100) / report.max_mark).toFixed(1);
			}
		}
	}

	getSkillOverallPercentage(skill_id) {
		let total = 0, count = 0;
		for (const report of this.reportSkillArray) {
			if (report.skill_id === skill_id) {
				total += Number((report.mark_scored * 100) / report.max_mark);
				count ++;
			}
		}
		if (isNaN(total / count)) {
			return '';
		} else {
			return (total / count).toFixed(1);

		}
	}

	getSubTypePercentage(topic_id, qst_id) {
		for (const report of this.reportSubtypeArray) {
			if (report.qst_id === qst_id && report.topic_id === topic_id) {
				return Number((report.mark_scored * 100) / report.max_mark).toFixed(1);
			}
		}
	}

	getSubTypeOverallPercentage(qst_id) {
		let total = 0, count = 0;
		for (const report of this.reportSubtypeArray) {
			if (report.qst_id === qst_id) {
				total += Number((report.mark_scored * 100) / report.max_mark);
				count ++;
			}
		}
		if (isNaN(total / count)) {
			return '';
		} else {
			return (total / count).toFixed(1);

		}
	}

	getStudentOverall(topic_id) {
		let total = 0, count = 0;
		for (const report of this.reportSubtypeArray) {
			if (report.topic_id === topic_id) {
				total += Number((report.mark_scored * 100) / report.max_mark);
				count ++;
			}
		}
		for (const report of this.reportSkillArray) {
			if (report.topic_id === topic_id) {
				total += Number((report.mark_scored * 100) / report.max_mark);
				count ++;
			}
		}
		for (const report of this.reportDLArray) {
			if (report.topic_id === topic_id) {
				total += Number((report.mark_scored * 100) / report.max_mark);
				count ++;
			}
		}
		if (isNaN(total / count)) {
			return '';
		} else {
			return (total / count).toFixed(1);

		}
	}

	getOverall() {
		let total = 0, count = 0;
		for (const report of this.reportSubtypeArray) {
			total += Number((report.mark_scored * 100) / report.max_mark);
			count++;
		}
		for (const report of this.reportSkillArray) {
			total += Number((report.mark_scored * 100) / report.max_mark);
			count++;
		}
		for (const report of this.reportDLArray) {
			total += Number((report.mark_scored * 100) / report.max_mark);
			count++;
		}
		if (isNaN(total / count)) {
			return '';
		} else {
			return (total / count).toFixed(1);
		}
	}

	getPercentageColor(value) {
		if (Number(value) > 90) {
			return '#009688';
		} else if (Number(value) > 80) {
			return '#4caf50';
		} else if (Number(value) > 70) {
			return '#04cde4';
		} else if (Number(value) > 60) {
			return '#ccdb39';
		} else if (Number(value) > 50) {
			return '#fe9800';
		} else if (Number(value) > 40) {
			return '#fe756d';
		} else if (Number(value) > 32) {
			return '#e81e63';
		} else if (Number(value) >= 1 && Number(value) <= 32) {
			return '#EB1010';
		} else if (Number(value) < 0) {
			return '#32475c';
		} else {
			return '#e1e1e1';
		}
	}
	displayReport() {
		this.performanceDiv = true;
		setTimeout(() => this.getTableWidth(), 10);
	}
	getTableWidth() {
		this.tableWidth = document.getElementById('topicContainer').offsetWidth;
		this.tableWidthCopy = document.getElementById('topicContainer').offsetWidth;
		this.tdtopicWidth = document.getElementById('tdTopic').offsetWidth;
		this.tdtStudentOverallWidth = document.getElementById('tdStudentOverAll').offsetWidth;
		this.tdSubtypeWidth = document.getElementById('tdSubType').offsetWidth;
		// this.tdDlWidth = document.getElementById('tdDlType').offsetWidth;
		this.tdSkillWidth = document.getElementById('tdSkill').offsetWidth;
		this.tableWidth = Number(this.tableWidth) - Number(this.tdtopicWidth);
		this.topicLength = this.topicArray.length;
		this.topicHeader = Number(this.tableWidth) / (this.topicLength + 1);
		this.topicHeaderStyle = Math.floor(this.topicHeader) + 'px';
		// tslint:disable-next-line:max-line-length
		this.studentOverallStyle = Math.floor((Number(this.tableWidthCopy) - Number(this.tdtStudentOverallWidth)) / (this.topicLength + 1)) + 'px';
		this.qstHeaderStyle = Math.floor((Number(this.tableWidthCopy) - Number(this.tdSubtypeWidth)) / (this.topicLength + 1)) + 'px';
		this.dlHeaderStyle = Math.floor((Number(this.tableWidthCopy) - Number(this.tdDlWidth)) / (this.topicLength + 1)) + 'px';
		this.skillHeaderStyle = Math.floor((Number(this.tableWidthCopy) - Number(this.tdSkillWidth)) / (this.topicLength + 1)) + 'px';
		}
		printPerformanceAnalysisGraph() {
			const printModal2 = document.getElementById('printModal');
			const popupWin = window.open('', '_blank', 'width=screen.width,height=screen.height');
			popupWin.document.open();
			popupWin.document.write('<html>' +
			// tslint:disable-next-line:max-line-length
			'<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.13/css/all.css" integrity="sha384-DNOHZ68U8hZfKXOrtjWvjxusGo9WQnrNx2sqG0tfsghAvtVlRW3tvkXWZh58N9jp" crossorigin="anonymous">' +
			'<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">' +
			'<style>button.submit-button {display:none}' +
			'.qstStyle{width: 0.1rem;vertical-align: middle !important;}' +
			// tslint:disable-next-line:max-line-length
			'.btn-emp {background-color: #fff;border: none;color: #ffffff;font-weight: bold !important;width: 50px;height: 50px;border-radius: 100%;margin: auto !important;display: block !important;}' +
			'.table-striped tbody tr:nth-of-type(odd) {background-color: rgba(0,0,0,.05);}' +
			'.user-table {padding-top: 10px;overflow-x: auto;width: 100%;}' +
			'table thead th{vertical-align: text-bottom !important;}' +
			'tr, th, td {padding: 5px;}' +
			'table {font-size: 14px;width:100%}' +
			'.hor {border-width: 1px;border-color: #000;}' +
			'.qstStyle{width: 0.1rem;vertical-align: middle !important;}' +
			'td{word-break: initial !important;}' +
			'th {vertical-align: middle !important;}' +
			'.padding{margin-right: 20px;}' +
			'h4.text-center {text-align: center;font-size: 16px;}' +
			'mat-tab-header {display: none;}' +
			'mat-form-field {display: none; !important}' +
			'.report-information-bar {background-color: #e6e5df;}' +
			'b{font-weight: bolder;}' +
			'.info-first-circle {color: #f44a66;}' +
			'.info-second-circle {color: #32bea2;}' +
			'.info-third-circle {color: #6c65c8;}' +
			'.info-four-circle {color: #ffb519;}' +
			'.row{display:flex !important}' +
			'.information-bar-content {font-size: 14px !important;text-align: center !important;}' +
			'.col-lg-12 {width: 100%;}' +
			'.col-lg-4 {padding:10px !important;margin-bottom:5px !important;width:100%}' +
			'.white-box-content-title {text-align: center;font-size: 25px;}' +
			'</style>'
			+ '<body onload="window.print()">' + printModal2.innerHTML + '</html>');
			popupWin.document.close();
		}
}

