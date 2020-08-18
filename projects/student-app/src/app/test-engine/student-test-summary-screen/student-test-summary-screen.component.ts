import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { QelementService } from 'projects/axiom/src/app/questionbank/service/qelement.service';
import { ReportService } from 'projects/axiom/src/app/reports/service/report.service';
import { ActivatedRoute } from '@angular/router';
import { isNumber, isNull } from 'util';

import * as Highcharts from 'highcharts';
declare var require: any;
require('highcharts/highcharts-more')(Highcharts);
require('highcharts/modules/solid-gauge')(Highcharts);
require('highcharts/modules/heatmap')(Highcharts);
require('highcharts/modules/treemap')(Highcharts);
require('highcharts/modules/funnel')(Highcharts);


@Component({
	selector: 'app-student-test-summary-screen',
	templateUrl: './student-test-summary-screen.component.html',
	styleUrls: ['./student-test-summary-screen.component.css'],
	encapsulation: ViewEncapsulation.None,
	providers: [ReportService]
})
export class StudentTestSummaryScreenComponent implements OnInit {
	percentageValue: (value: number) => string;
	es_id: number;
	login_id: string;
	examDetail: any = {};
	marksDetails: any = {};
	timeTakenDetail: any = {};
	correctQArray: any[] = [];
	incorrectQArray: any[] = [];
	skipQArray: any[] = [];
	examDetailFlag = false;
	marksDetailsFlag = false;
	timeTakenDetailFlag = false;
	correctQArrayFlag = false;
	skipQArrayFlag = false;
	incorrectQArrayFlag = false;
	testSummaryDivFlag = false;
	questionIdArray: any[] = [];
	questionsArray: any[] = [];
	gaugeType = 'full';
	gaugeValue = 28.3;
	gaugeLabel = '';
	gaugeAppendText = '%';
	gaugeType1 = 'full';
	gaugeValue1 = 66;
	gaugeLabel1 = '';
	gaugeAppendText1 = '%';
	gaugeType2 = 'full';
	gaugeValue2 = 99;
	gaugeLabel2 = '';
	gaugeAppendText2 = '%';
	trimmedPercentageVal: any;
	trimmedPercentageValue: any;
	onlyObjectiveFlag = true;
	// jquery dependancy exist so currently commented
	// bodyClasses = 'student-report';

	gaugeOptions: any = {
		chart: {
			type: 'solidgauge'
		},

		title: null,

		pane: {
			center: ['50%', '85%'],
			size: '40%',
			startAngle: -90,
			endAngle: 90,
			background: {
				backgroundColor: '#EEE',
				innerRadius: '60%',
				outerRadius: '100%',
				shape: 'arc'
			}
		},

		tooltip: {
			enabled: false
		},

		// the value axis
		yAxis: {
			min: 0,
			max: 200,
			title: {
				text: 'Marks'
			},
			lineWidth: 0,
			minorTickInterval: null,
			tickAmount: 2,
			labels: {
				y: 16
			}
		},

		plotOptions: {
			solidgauge: {
				dataLabels: {
					y: 5,
					borderWidth: 0,
					useHTML: true
				}
			}
		},
		series: [
			{
				name: 'Marks Obtained',
				data: [99]
			}
		]
	};
	gaugeOptions2: any = {
		chart: {
			type: 'solidgauge'
		},

		title: null,

		pane: {
			center: ['50%', '85%'],
			size: '40%',
			startAngle: -90,
			endAngle: 90,
			background: {
				backgroundColor: '#EEE',
				innerRadius: '60%',
				outerRadius: '100%',
				shape: 'arc'
			}
		},

		tooltip: {
			enabled: false
		},

		// the value axis
		yAxis: {
			min: 0,
			max: 200,
			title: {
				text: 'Marks'
			},
			lineWidth: 0,
			minorTickInterval: null,
			tickAmount: 2,
			labels: {
				y: 16
			}
		},

		plotOptions: {
			solidgauge: {
				dataLabels: {
					y: 5,
					borderWidth: 0,
					useHTML: true
				}
			}
		},
		series: [
			{
				name: 'Marks Obtained',
				data: [99]
			}
		]
	};
	gaugeOptions3: any = {
		chart: {
			type: 'solidgauge'
		},

		title: null,

		pane: {
			center: ['50%', '85%'],
			size: '40%',
			startAngle: -90,
			endAngle: 90,
			background: {
				backgroundColor: '#EEE',
				innerRadius: '60%',
				outerRadius: '100%',
				shape: 'arc'
			}
		},

		tooltip: {
			enabled: false
		},

		// the value axis
		yAxis: {
			min: 0,
			max: 200,
			title: {
				text: 'Marks'
			},
			lineWidth: 0,
			minorTickInterval: null,
			tickAmount: 2,
			labels: {
				y: 16
			}
		},

		plotOptions: {
			solidgauge: {
				dataLabels: {
					y: 5,
					borderWidth: 0,
					useHTML: true
				}
			}
		},
		series: [
			{
				name: 'Marks Obtained',
				data: [99]
			}
		]
	};
	constructor(
		private qelementService: QelementService,
		private route: ActivatedRoute,
		private reportService: ReportService
	) {
		this.percentageValue = function (value: number): string {
			return `${Math.round(value)} / ${this['max']}`;
		};
	}

	ngOnInit(): void {
		this.es_id = this.route.snapshot.params['id'];
		const currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.login_id = currentUser.login_id;
		this.getScheduledExam();
		// this.viewMarkObtained();
		// this.correctQuestion();
		// this.incorrectQuestion();
		// this.skipQuestion();
		// this.viewReportTimeTaken();
		// jquery dependancy exist so currently commented
		// $('body').addClass(this.bodyClasses);
	}

	getTestSummaryDivStatus() {
		if (
			this.examDetailFlag === true &&
			this.marksDetailsFlag === true &&
			this.correctQArrayFlag === true &&
			this.incorrectQArrayFlag === true &&
			this.skipQArrayFlag === true &&
			this.timeTakenDetailFlag === true
		) {
			if (this.onlyObjectiveFlag === true) { return true; } else { return false; }
		}
	}
	getScheduledExam() {
		this.qelementService
			.getScheduledExam({ es_id: this.es_id })
			.subscribe((result: any) => {
				if (result && result.status === 'ok') {
					if (result.data.length > 0) {
						this.examDetail = result.data[0];
						this.examDetailFlag = true;
						if (this.examDetail.es_qt_status === '1') {
							this.onlyObjectiveFlag = false;
						} else {
							this.onlyObjectiveFlag = true;
						}
						if(this.examDetail.es_test_taker_report == 1){
							this.viewMarkObtained();
							this.correctQuestion();
							this.incorrectQuestion();
							this.skipQuestion();
							this.viewReportTimeTaken();
						}
					}
				}
			});
	}

	viewMarkObtained() {
		this.reportService
			.viewMarkObtained({ es_id: this.es_id, login_id: this.login_id })
			.subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.marksDetails = result.data[0];
					if (isNull(this.marksDetails.total_mark)) {
						this.marksDetails.total_mark = 0;
					}
					this.marksDetailsFlag = true;
				}
			});
	}

	correctQuestion() {
		this.reportService
			.correctQuestion({ es_id: this.es_id, login_id: this.login_id })
			.subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.correctQArray = result.data;
					this.correctQArrayFlag = true;
				} else {
					this.correctQArray = [];
					this.correctQArrayFlag = true;
				}
			});
	}

	incorrectQuestion() {
		this.reportService
			.incorrectQuestion({ es_id: this.es_id, login_id: this.login_id })
			.subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.incorrectQArray = result.data;
					this.incorrectQArrayFlag = true;
				} else {
					this.incorrectQArray = [];
					this.incorrectQArrayFlag = true;
				}
			});
	}

	skipQuestion() {
		this.reportService
			.skipQuestion({ es_id: this.es_id, login_id: this.login_id })
			.subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.skipQArray = result.data;
					this.skipQArrayFlag = true;
				} else {
					this.skipQArray = [];
					this.skipQArrayFlag = true;
				}
			});
	}

	viewReportTimeTaken() {
		this.reportService
			.viewReportTimeTaken({ es_id: this.es_id, login_id: this.login_id })
			.subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.timeTakenDetail = result.data[0];
					let timeMin = '0';

					if (!isNull(this.timeTakenDetail.time_taken)) {
						timeMin = this.timeTakenDetail.time_taken;
						const a = timeMin.split(':'); // split it at the colons
						// Hours are worth 60 minutes.
						const minutes = +a[0] * 60 + +a[1];
						this.timeTakenDetail.time_taken = minutes;
					} else {
						this.timeTakenDetail.time_taken = 0;
					}
					this.timeTakenDetailFlag = true;
				}
			});
	}

	getResultStatus(value1, value2) {
		const percentage = (Number(value1) / Number(value2)) * 100;
		if (percentage >= Number(this.examDetail.es_pass_marks)) {
			return 'Pass: <i class="fa fa-check"></i>';
		} else {
			return 'Fail: <i class="fa fa-times"></i>';
		}
	}

	gaugeValueMarkObt(value1, value2) {
		const percentage = (Number(value1) / Number(value2)) * 100;
		const str = percentage.toString();
		this.trimmedPercentageVal = str.slice(0, 4);
		return this.trimmedPercentageVal;
	}

	gaugeValueQuesAtt(value1, value2) {
		const percentage = (Number(value1) / Number(value2)) * 100;
		const str = percentage.toString();
		this.trimmedPercentageValue = str.slice(0, 4);
		return this.trimmedPercentageValue;
	}

	closeResult() {
		close();
	}
}
