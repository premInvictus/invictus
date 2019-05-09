import { Component, OnInit } from '@angular/core';
import { QelementService } from 'projects/axiom/src/app/questionbank/service/qelement.service';
import { ReportService } from 'projects/axiom/src/app/reports/service/report.service';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-overall-student-performance',
	templateUrl: './overall-student-performance.component.html',
	styleUrls: ['./overall-student-performance.component.css']
})
export class OverallStudentPerformanceComponent implements OnInit {

	constructor(
		private reportService: ReportService,
		private qelementService: QelementService,
		private route: ActivatedRoute
	) { }
	overAllFlag = false;
	loading = false;
	login_id: string;
	subjectArray: any[];
	classArray: any[];
	userDetail: any;
	examMarksArray: any[] = [];
	testArray: any[] = ['Test1', 'Test2', 'Test3', 'Test4', 'Test5', 'Test6', 'Test7', 'Test8', 'Test9', 'Test10'];
	subjectNameArray: any[] = [];
	overallPerformance: any[] = [];
	overallPerformanceTestMark: any[] = [];
	overAllPerformanceDiv = true;
	marks: any;
	seriesArray: any[] = [];
	grade: any;
	overallPerformanceArray: any[];
	testTotalMarks: any[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	testsMarks: any[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	overAllOptions: any = {

		title: {
			text: ''
		},
		xAxis: {
			categories: this.testArray,
			title: {
				text: 'Test Name'
		}
		},
		yAxis: {
			min: 0,
			title: {
					text: 'Marks'
			}
	},
		labels: {
			items: [{
				html: 'Overall Performance',
				style: {
					left: '50px',
					top: '18px'
				}
			}]
		},
		// tslint:disable-next-line:max-line-length
		colors: ['#04cde4', '#fe756d', '#6610f2', '#3f51b5', '#4caf50', '#e81e63', '#fe9800', '#795548', '#374046', '#009688', '#ccdb39', '#9c27b0'],
		series: this.seriesArray
	};

	ngOnInit() {
		const currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.login_id = currentUser.login_id;
		this.qelementService.getUser({ login_id: currentUser.login_id, role_id: '4' }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.userDetail = result.data[0];
					this.getSubjectsByClass();
					this.getOverallPerformance();
				}
			}
		);
	}

	// Calling getSubjectsByClass
	getSubjectsByClass(): void {
		this.subjectArray = [];
		this.qelementService.getSubjectsByClass(this.userDetail.au_class_id).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.subjectArray = result.data;
					for (const item of this.subjectArray) {
						this.subjectNameArray.push(item.sub_name);
					}
				}
			}
		);
	}

	marksBySubject(marks) {
		if (marks) {
			return marks;
		} else {
			return '-';
		}
	}

	getTotalBySubject(sub_id) {
		let total = 0;
		for (const item of this.examMarksArray) {
			if (item.sub_id === sub_id) {
				total += Number(item.total_mark);
			}
		}
		return total;
	}

	getAverageBySubject(sub_id) {
		let total = 0;
		let countExam = 0;
		for (const item of this.examMarksArray) {
			if (item.sub_id === sub_id) {
				countExam++;
				total += Number(item.total_mark);
			}
		}
		return total / countExam;
	}

	getOverallPerformance() {
		this.overallPerformanceArray = [];
		this.reportService.studentOveralPerformance({ class_id: this.userDetail.au_class_id, login_id: this.login_id }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					let testMarks: any[] = [];
					let stotal = 0;
					let tcount = 0;
					const ttotal = 0;
					let ttmi = 0;
					this.overallPerformanceArray = result.data;
					for (const item of this.overallPerformanceArray) {
						ttmi = 0;
						stotal = 0;
						tcount = 0;
						testMarks = [];
						testMarks.push(Number(item.T1));
						testMarks.push(Number(item.T2));
						testMarks.push(Number(item.T3));
						testMarks.push(Number(item.T4));
						testMarks.push(Number(item.T5));
						testMarks.push(Number(item.T6));
						testMarks.push(Number(item.T7));
						testMarks.push(Number(item.T8));
						testMarks.push(Number(item.T9));
						testMarks.push(Number(item.T10));
						for (const marks of testMarks) {
							stotal += Number(marks);
							if (Number(marks) > 0) {
								tcount++;
							}
						}
						const subject_avg = stotal / tcount;
						let str = subject_avg.toString();
							if (str === 'NaN') {
								str = '0';
							}
						// tslint:disable-next-line:max-line-length
						this.overallPerformance.push({ sub_total: stotal, sub_avg: str.slice(0, 4), sub_id: item.sub_id, sub_name: item.sub_name, test: testMarks });
						for (const tmark of testMarks) {
							this.testTotalMarks[ttmi++] += Number(tmark);
						}
						this.overallPerformanceTestMark.push({ test_total: ttotal, test_avg: ttotal / ttmi, test: testMarks });
						this.seriesArray.push({
							type: 'spline',
							name: item.sub_name,
							data: testMarks
						});
						this.loading = false;
					}
					this.overAllOptions.series = this.seriesArray;
					this.overAllFlag = true;
				}
			});
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
	printOverAllPerformance() {
		const printModal2 = document.getElementById('printModal');
		const popupWin = window.open('', '_blank', 'width=screen.width,height=screen.height');
		popupWin.document.open();
		// tslint:disable-next-line:max-line-length
		popupWin.document.write('<html><style>button.submit-button { display:none; } .table{width:100%} @page {size:landscape}.table td, .table th {padding: .75rem;vertical-align: top;border-top: 1px solid #dee2e6;} .dialog-table-review-header {background-color: #e6e5df !important;}td, th {text-align: center;}.table-dialog-review-row:nth-child(even) {background-color: #f1f1f1;}</style><body onload="window.print()">' + printModal2.innerHTML + '</html>');
		popupWin.document.close();
	}
}
