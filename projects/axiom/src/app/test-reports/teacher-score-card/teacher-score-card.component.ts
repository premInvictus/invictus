import { Component, OnInit, ViewChild } from '@angular/core';
import { QelementService } from '../../questionbank/service/qelement.service';
import { ReportService } from '../../reports/service/report.service';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource, MatSort, Sort, MatPaginator } from '@angular/material';
import { CommonAPIService, SmartService } from '../../_services/index';


@Component({
	selector: 'app-teacher-score-card',
	templateUrl: './teacher-score-card.component.html',
	styleUrls: ['./teacher-score-card.component.css']
})
export class TeacherScoreCardComponent implements OnInit {
	@ViewChild(MatSort) sort: MatSort;
	reportArray: any[] = [];
	rankArray: any[] = [];
	login_id: string;
	es_id: number;
	examDetail: any = {};
	studentArray: any[] = [];
	questionpaperDetail: any = {};
	attendanceArray: any[] = [];
	marksDetailsArray: any[] = [];
	viewReports: any = {};
	scoreCardDiv = false;
	passMarks: any;
	REPORT_ELEMENT_DATA: ReportElement[] = [];
	reportdatasource = new MatTableDataSource<ReportElement>(this.REPORT_ELEMENT_DATA);
	reportdisplayedColumns =
		['position', 'admissionNo', 'studentName', 'rank',
			'max_marks', 'attempted', 'correct', 'incorrect', 'skip', 'score', 'percentage', 'cutoff', 'status'];
	sortedData: ReportElement[] = [];
	grade: any;

	constructor(
		private qelementService: QelementService,
		private route: ActivatedRoute,
		private reportService: ReportService,
		private common: CommonAPIService,
		private smartService: SmartService
	) { }

	ngOnInit() {

		this.es_id = this.route.snapshot.params['id'];
		const currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.login_id = currentUser.login_id;
		this.getScheduledExam();
		this.viewMarkObtained();
		this.getReportOverview();
		this.qelementService.getExamAttendance({ es_id: this.es_id }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.attendanceArray = result.data;
				}
			}
		);
	}

	getScheduledExam() {
		this.qelementService.getScheduledExam({ es_id: this.es_id, es_status: '2' }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.examDetail = result.data[0];
					this.passMarks = this.examDetail.es_pass_marks;
					this.getStudents();

					this.qelementService.getQuestionPaper({ qp_id: this.examDetail.es_qp_id }).subscribe(
						(result1: any) => {
							if (result1 && result1.status === 'ok') {
								this.questionpaperDetail = result1.data[0];

							}
						}
					);
				}
			}
		);
	}

	viewMarkObtained() {
		this.reportService.viewMarkObtained({ es_id: this.es_id }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.marksDetailsArray = result.data;
				}
			}
		);
	}


	getFlag(login_id) {
		let value = 0;
		for (const mark of this.marksDetailsArray) {
			if (mark.au_login_id === login_id) {
				value = Number(mark.total_mark) / Number(this.questionpaperDetail.tp_marks) * 100;
			}
		}
		if (value >= 60) {
			return 'Achievement';
		} else if (value > 40) {
			return 'Needs Improvement';
		} else {
			return 'Critical';
		}
	}

	getColor(login_id) {
		let value = 0;
		for (const mark of this.marksDetailsArray) {
			if (mark.au_login_id === login_id) {
				value = Number(mark.total_mark) / Number(this.questionpaperDetail.tp_marks) * 100;
			}
		}
		if (value >= 60) {
			return '<i class=\'far fa-flag teacher-score-flag-green\'></i>';
		} else if (value > 40) {
			return '<i class=\'far fa-flag teacher-score-flag-yellow\'></i>';
		} else {
			return '<i class=\'far fa-flag  teacher-score-flag-red\'></i>';
		}
	}



	viewReport() {

		this.reportService.viewReport({ login_id: this.login_id }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					for (const item of result.data) {
						if (this.login_id === item.login_id) {
							this.viewReports = item;
							break;
						}
					}
				}
			}
		);

	}
	sortRank(sort: Sort) {
		const data = this.REPORT_ELEMENT_DATA.slice();
		if (!sort.active || sort.direction === '') {
			this.sortedData = data;
			this.reportdatasource = new MatTableDataSource<ReportElement>(this.sortedData);
			return;
		} else {
			this.sortedData = data.sort((a, b) => {
				const isAsc = sort.direction;
				switch (sort.active) {
					case 'rank':
						return compare(Number(a.rank), Number(b.rank), isAsc);
					default: return 0;
				}
			});
			this.reportdatasource = new MatTableDataSource<ReportElement>(this.sortedData);
		}
		function compare(a, b, isAsc) {
			return (a > b ? -1 : 1) * (isAsc ? 1 : -1);
		}

	}
	getScore(value) {
		if (Number(value) > 0 || Number(value) < 0) {
			return value;
		} else {
			return '0';
		}
	}
	printPageById(print_id) {
		const printModal2 = document.getElementById(print_id);
		const popupWin = window.open('', '_blank', 'width=' + screen.width + ',height=' + screen.height);
		popupWin.document.open();
		popupWin.document.write('<html><link rel="stylesheet" type="text/css" media="print"' +
		'href="../../../styles.css"><style>button { display:none; }' +
		'iframe{background-image:url("https://www.c-comsat.com/wp-content/uploads/youtube_play_button.jpg");background-size:100% 100%}' +
		' .my_passage{font-size:14px !important} .option_width_essay{width: 30% !important} .option_width{width:20% !important;} ' +
		'.ques_name{width:60rem !important;} .question-paper-table th {vertical-align:top !important;} .question-paper-table-essay' +
		'th {vertical-align:top !important;}' +
		'.question-paper-table tbody tr th{width:1rem;}.question-paper-table-essay{padding-top :40px !important;}' +
		'.question-paper-table-essay tbody tr th{width:1rem;} .ques-paper-logo{width:45px;height:45px;}' +
		'.logo{text-align:center;} .qp_name{font-size:12px} table{font-size:12px}' +
		'.imgClassExpress p img{height:100px;width:auto;margin-bottom:10px} .imgclassQpList p img {height:100px;margin-bottom:10px}' +
		'.qus_position{width:10rem !important;padding-top:20px !important} .qst_name{text-align:center;}' +
		'.moveTd{padding-left:400px;width:800px}' +
		'.ques_name{padding-top: 19px !important} @media print{body{-webkit-print-color-adjust: exact; !important}}' +
		'</style><body onload="window.print()">' + printModal2.innerHTML + '</html>');
		popupWin.document.close();
	}
	getReportOverview() {
		this.reportArray = [];
		this.reportService.testReportOverview({ es_id: this.es_id }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.reportArray = result.data;
					let ind = 1;
					for (const item of this.reportArray) {
						this.REPORT_ELEMENT_DATA.push({
							position: ind,
							admissionNo: item.au_login_id,
							loginid: '',
							studentName: item.au_full_name,
							rank: item.au_login_id,
							max_marks: item.max_mark,
							correct: item.correct,
							incorrect: item.incorrect,
							skip: item.skip,
							score: item.score,
							percentage: '',
							cutoff: ''
						});
						ind++;
					}
					this.reportService.viewRankObtained({ es_id: this.es_id }).subscribe(
						(result1: any) => {
							if (result1 && result1.status === 'ok') {
								this.rankArray = result1.data;
								for (const item of this.REPORT_ELEMENT_DATA) {
									if (this.getRankByevaid(item.rank)) {
										item.rank = this.getRankByevaid(item.rank);
									} else {
										item.rank = this.REPORT_ELEMENT_DATA.length;
									}
								}
								for (let i = 0; i < this.REPORT_ELEMENT_DATA.length - 1; i++) {
									for (let j = 0; j < this.REPORT_ELEMENT_DATA.length - i - 1; j++) {
										if (this.REPORT_ELEMENT_DATA[j].rank > this.REPORT_ELEMENT_DATA[j + 1].rank) {
											const temp = this.REPORT_ELEMENT_DATA[j];
											this.REPORT_ELEMENT_DATA[j] = this.REPORT_ELEMENT_DATA[j + 1];
											this.REPORT_ELEMENT_DATA[j + 1] = temp;
										}
									}
								}
								for (let i = 0; i < this.REPORT_ELEMENT_DATA.length; i++) {
									this.REPORT_ELEMENT_DATA[i].position = i + 1;
								}
								for (const item of this.attendanceArray) {
									let i = 0;
									for (const titem of this.REPORT_ELEMENT_DATA) {
										if (Number(item.eva_login_id) === Number(titem.admissionNo)) {
											this.REPORT_ELEMENT_DATA[i].loginid = item.au_admission_no;
											break;
										} else {
											i++;
										}
									}
								}
								for (const item of this.REPORT_ELEMENT_DATA) {
									item.percentage = this.convertFloat((((item.score) / (item.max_marks)) * 100));
									if ((item.percentage - this.passMarks) > 0) {
									item.cutoff = '<span class="text-success">' + '+' + (item.percentage - this.passMarks) + '</span>';
									} else if ((item.percentage - this.passMarks) < 0) {
										item.cutoff = '<span class="text-danger">' + (item.percentage - this.passMarks) + '</span>';
										} else {
											item.cutoff = item.percentage - this.passMarks;
										}
								}
								this.reportdatasource = new MatTableDataSource<ReportElement>(this.REPORT_ELEMENT_DATA);
								// this.sort.sortChange.subscribe(
								// 	() => (this.paginator.pageIndex = 0)
								// );
								this.reportdatasource.sort = this.sort;

								this.scoreCardDiv = true;
							} else {
								for (const item of this.REPORT_ELEMENT_DATA) {
									item.rank = '-';
								}
								this.scoreCardDiv = true;
							}
						}
					);
				}
			}
		);

	}
	getRankByevaid(au_login_id) {
		for (const value of this.rankArray) {
			if (value.au_login_id === au_login_id) {
				return value.rank;
			}
		}
	}
	getAttempted(corr, incorr) {
		return Number(corr) + Number(incorr);
	}

	getStudents() {
		const param: any = {};
		param.tgam_config_type = '1';
		param.tgam_axiom_config_id = this.examDetail.es_class_id;
		param.tgam_global_sec_id = this.examDetail.es_sec_id;
		this.smartService.getSmartToAxiom(param).subscribe((result1: any) => {
			if (result1 && result1.status === 'ok') {
				this.common.getMasterStudentDetail({ class_id: result1.data[0].tgam_global_config_id,
					sec_id: result1.data[0].tgam_global_sec_id, role_id: '4', enrollment_type: '4' }).subscribe(
					(result: any) => {
						if (result && result.status === 'ok') {
							this.studentArray = result.data;
						}
					}
				);
			}
		})
	}
	printTeacherScoreCard() {
		const printModal2 = document.getElementById('printModal');
		const popupWin = window.open('', '_blank', 'width=screen.width,height=screen.height');
		popupWin.document.open();
		popupWin.document.write('<html><link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.13/css/all.css"' +
		'integrity="sha384-DNOHZ68U8hZfKXOrtjWvjxusGo9WQnrNx2sqG0tfsghAvtVlRW3tvkXWZh58N9jp" crossorigin="anonymous">'
			+ '<style>button.submit-button{ display:none; }' +
			' @page {size:landscape} body{font-family: Roboto,"Helvetica Neue",Arial,sans-serif; font-size: 10px;}' +
			'img{height:55px !important;width:75px !important} .mat-card:not([class*=mat-elevation-z])' +
			'{box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12) !important }' +
			'mat-card {display: block !important;position: relative !important;padding:24px !important; border-radius:10px !important}' +
			'.col-lg-3 {display:inline-block !important;padding:20px !important;margin-bottom:5px !important;width:25%}' +
			'.row{display:flex !important}' +
			'.remove-col-modal-padding {padding-right: 0px !important;padding-left: 0px !important;}' +
			'mat-card.score-card-info-card-main-box score-card-report-overview{display:none}' +
			'.table-main-structure {height: 300px;margin: 20px;border: 1px solid #f1f1f1;}' +
			'mat-table{display:block}' +
			'.mat-header-row, .mat-row {display: flex;border-bottom-width: 1px;border-bottom-style: solid;align-items: center;padding: 0 24px;' +
			'box-sizing: border-box;}' +
			'.mat-header-row {background-color: #f1f1f1;min-height: 56px;}' +
			'.mat-header-row, .mat-row {border-bottom-color: rgba(0,0,0,.12);}' +
			'.mat-header-row, .mat-row {display: flex;border-bottom-width: 1px;border-bottom-style: solid;align-items: center;' +
			'padding: 0 24px;box-sizing: border-box;}' +
			'mat-header-row, .mat-row {border-bottom-color: rgba(0,0,0,.12);}' +
			'.mat-row {min-height: 48px;} .te-adm-print {padding-right:25px;}' +
			'.mat-header-row, .mat-row {border-bottom-color: rgba(0,0,0,.12);}' +
			'mat-row:nth-child(odd) {padding-top: 10px;padding-bottom: 10px;background-color: #f1f1f1;}' +
			'.mat-cell, .mat-header-cell {flex: 1;overflow: hidden;word-wrap: break-word;}' +
			'.mat-header-cell {color: rgba(0,0,0,.54);}' +
			'.mat-header-cell {font-size: 12px;font-weight: 500;}' +
			'.mat-sort-header-button {border: none;background: 0 0;display: flex;align-items: center;padding: 0;cursor: inherit;' +
			'outline: 0;font: inherit;color: currentColor;}' +
			'.col-lg-12{position: relative;width: 100%;min-height: 1px;padding-right: 15px;padding-left: 15px;}' +
			'a{ pointer-events: none !important;cursor: default !important;text-decoration: none !important;color: black !important;}' +
			'.fa-flag:before {content: "\\f024";}' +
			'.fa, .far, .fas {font-family: Font Awesome\\ 5 Free;}' +
			'.teacher-score-flag-red {color: #dc3545 !important;font-size: 16px !important;}' +
			'.teacher-score-flag-green {color: #28a745 !important;font-size: 16px !important;}' +
			'.teacher-score-flag-yellow {color: #ffc108 !important;font-size: 16px !important;}' +
			'mat-tab-header {display: none;}' +
			'.report-information-bar {background-color: #e6e5df;}' +
			'b{font-weight: bolder;}' +
			'.info-first-circle {color: #f44a66;}' +
			'.info-second-circle {color: #32bea2;}' +
			'.info-third-circle {color: #6c65c8;}' +
			'.info-four-circle {color: #ffb519;}' +
			'.information-bar-content {font-size: 14px !important;text-align: center !important;}' +
			'.student-score-card-legend {font-size: 10px !important;}' +
			'.attempted-icon {color: #00c4db;}' +
			'.skipped-icon {color: #fe756d;}' +
			'.bookmark-icon {color: #6610f2;}' +
			'</style><body onload="window.print()">' + printModal2.innerHTML + '</html>');
		popupWin.document.close();
	}
	convertFloat(value) {
		const parseValue = Math.round(value * 100) / 100;
		return parseValue;
	}
	getPercentageColor(value) {
		if (Number(value) > 90) {
			this.grade = 'A1';
			return '#009688';
		} else if (Number(value) > 80) {
			this.grade = 'A2';
			return '#4caf50';
		} else if (Number(value) > 70) {
			this.grade = 'B1';
			return '#04cde4';
		} else if (Number(value) > 60) {
			this.grade = 'B2';
			return '#ccdb39';
		} else if (Number(value) > 50) {
			this.grade = 'C1';
			return '#fe9800';
		} else if (Number(value) > 40) {
			this.grade = 'C2';
			return '#fe756d';
		} else if (Number(value) > 32) {
			this.grade = 'D';
			return '#e81e63';
		} else {
			this.grade = 'E';
			return '#EB1010';
		}
	}
}
export interface ReportElement {
	position: number;
	admissionNo: any;
	studentName: any;
	max_marks: number;
	rank: any;
	correct: any;
	incorrect: any;
	percentage: any;
	cutoff: any;
	skip: any;
	score: number;
	loginid: any;
}

