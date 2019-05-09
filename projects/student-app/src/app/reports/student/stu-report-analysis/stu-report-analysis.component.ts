import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { QelementService } from 'projects/axiom/src/app/questionbank/service/qelement.service';
import { ReportService } from 'projects/axiom/src/app/reports/service/report.service';
import { ActivatedRoute } from '@angular/router';
// import { chart } from 'highcharts';
import { HtmlToTextService } from 'projects/axiom/src/app/_services/htmltotext.service';
import * as Highcharts from 'highcharts';
declare var require: any;
require('highcharts/highcharts-more')(Highcharts);
require('highcharts/modules/solid-gauge')(Highcharts);
require('highcharts/modules/heatmap')(Highcharts);
require('highcharts/modules/treemap')(Highcharts);
require('highcharts/modules/funnel')(Highcharts);
import { BreadCrumbService } from 'projects/axiom/src/app/_services/index';

@Component({
	selector: 'app-stu-report-analysis',
	templateUrl: './stu-report-analysis.component.html',
	styleUrls: ['./stu-report-analysis.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class StuReportAnalysisComponent implements OnInit, AfterViewInit {
	// For Pie chart configuration
	// Vishnu
	percentageValue: (value: number) => string;
	homeUrl: string;
	gaugeValue1;
	gaugeValue2;
	es_id: number;
	eva_id: number;
	login_id: string;
	viewReports: any = {};
	examDetail: any = {};
	currentQP: any = {};
	questionIdArray: any[] = [];
	questionsArray: any[] = [];
	questionsArrayResult: any[] = [];
	currentQA: any = {};
	currentQAIndex = 0;
	evalutionDetail: any = {};
	timeTakenDetail: any = {};
	examQuestionStatusArray: any[] = [];
	public optionHA = ['A', 'B', 'C', 'D', 'E'];
	public optionmatchHA = ['P', 'Q', 'R', 'S', 'T'];
	questionpaperDetail: any = {};
	presentStudentArray: any[] = [];
	highestMarks: number;
	classAverage: number;
	marksDetails: any = {};
	marksDetailsArray: any[] = [];
	rankDetails: any = {};
	TopicSubtopicArray: any[] = [];
	repostTopicArray: any[] = [];
	subtopicNameArray: any[] = [];
	topicMarkArray: any[] = [];
	correctQArray: any[] = [];
	incorrectQArray: any[] = [];
	skipQArray: any[] = [];
	stArray: any[] = [];
	etopicArray: any[] = [];
	estArray: any[] = [];
	topicSubtopicArray: any[] = [];
	testQuestionArray: any[] = [];
	tableCollection = false;
	studentArray: any[] = [];
	highestMarkArray: any[] = [];
	subtopicHighestArray: any[] = [];
	subtopicAverageArray: any[] = [];
	averageMarkArray: any[] = [];
	getScheduledExamFlag = false;
	getExamAttendenceFlag = false;
	viewReportTimeTakenFlag = false;
	viewRankObtainedFlag = false;
	correctQuestioFlag = false;
	skipQuestionFlag = false;
	maxMarks: any;
	markScored: any;
	bookmarkQuestion = false;
	reportOverviewStudentTable = false;
	getInfoScoreCard = true;
	trimmedPercentageVal: any;
	subjectArrayOfQP: any[] = [];
	subjectWiseTopicArray: any[] = [];
	topicSubtopicArrayTemp: any[] = [];
	marksScoredSubjectWiseArray: any[] = [];
	totalMarksSubtopics: any;
	public pieChartLabels: string[] = ['Correct', 'Incorrect', 'Skipped'];
	public pieChartData: number[];
	public pieChartType = 'pie';
	public chartColors: any[] = [
		{
			backgroundColor: ['#00b197', '#ff5872', '#fed000']
		}];
	accuracy: String;

	firstGauge = false;
	secondGauge = false;
	gaugeOptions: any = {
		chart: {
			type: 'solidgauge',
			height: 235,
			width: 250,
			events: {
				render: ''
			}
		},

		title: {
			text: '',
			style: {
				fontSize: '10px'
			}
		},

		tooltip: {
			borderWidth: 0,
			backgroundColor: 'none',
			shadow: false,
			style: {
				fontSize: '14px'
			},
			pointFormat: '{series.name}<br><span style="font-size:16px; color: {point.color}; font-weight: bold;">{point.y}</span>',
			positioner: function (labelWidth) {
				return {
					x: (this.chart.chartWidth - labelWidth) / 40,
					y: (this.chart.plotHeight / 2) - 117
				};
			}
		},

		pane: {
			startAngle: 0,
			endAngle: 360,
			background: [{ // Track for Highest
				outerRadius: '112%',
				innerRadius: '88%',
				backgroundColor: '#04cde430',
				borderWidth: 0
			},
				{ // Track for Marks
				outerRadius: '87%',
				innerRadius: '63%',
				backgroundColor: '#6610f238',
				borderWidth: 0
			}, { // Track for Class
				outerRadius: '65%',
				innerRadius: '38%',
				backgroundColor: '#ffd2cf6b',
				borderWidth: 0
			}]
		},

		yAxis: {
			min: 0,
			max: '',
			lineWidth: 0,
			tickPositions: []
		},

		plotOptions: {
			solidgauge: {
				cursor:  'pointer',
				dataLabels: {
					enabled: false
				},
				linecap: '',
				stickyTracking: false,
			}
		},

		series: [{
			name: 'Highest Marks',
			data: [{
				color: '#04CDE4',
				radius: '112%',
				innerRadius: '88%',
				y: ''
			}]
		},
			{
			name: 'Marks Scored',
			data: [{
				color: '#6610f2',
				radius: '87%',
				innerRadius: '63%',
				y: ''
			}]
		}, {
			name: 'Class Average',
			data: [{
				color: '#fe756d',
				radius: '65%',
				innerRadius: '38%',
				y: ''
			}]
		}]
	};
	// gaugeOptions2 : any = {
	//   chart: {
	//       type: 'solidgauge',
	//       height:120,
	//       width:200

	//   },

	//   title: null,

	//   pane: {
	//       size: '100%',
	//       startAngle: -90,
	//       endAngle: 90,
	//       background: {
	//           backgroundColor: '#EEE',
	//           innerRadius: '60%',
	//           outerRadius: '100%',
	//           shape: 'arc'
	//       }
	//   },

	//   tooltip: {
	//       enabled: false
	//   },

	//   // the value axis
	//   yAxis: {
	//       min: 0,
	//       max: 100,
	//       title: {
	//           text: ''
	//       },
	//       lineWidth: 0,
	//       minorTickInterval: null,
	//       tickAmount: 2,
	//       labels: {
	//           y: 16
	//       }
	//   },

	//   plotOptions: {
	//       solidgauge: {
	//           dataLabels: {
	//               y: 5,
	//               borderWidth: 0,
	//               useHTML: true
	//           }
	//       }
	//   },
	//   series: [{
	//       name: 'Speed',
	//       data: [80],
	//       tooltip: {
	//           valueSuffix: ' km/h'
	//       }
	//   }]
	// }
	// showPerformanceGraph = false;
	pieFlag = false;
	options: any = {
		chart: {
				type: 'pie',
				height: 235,
				width: 250
		},
		title: {
				text: ''
		},
		tooltip: {
				pointFormat: '{series.data.name} <b>{point.y}</b>'
		},
		plotOptions:  {
							pie:  {
									allowPointSelect:  true,
									cursor:  'pointer',
									dataLabels:  {
											enabled:  false,
											format:  '',
											distance:  -50,
									},
							}
					},
					colors: ['#04CDE4', '#fe756d', '#6610f2'],
		series: [{
				name: 'Answer',
				colorByPoint: true,
				data: []
		}]
		};

	lineChart: any = {
		title: {
			text: 'Subtopicwise Exam Report'
		},
		xAxis: {
			categories: this.subtopicNameArray
		},
		labels: {
			items: [{
				html: 'Subtopicwise Exam Report',
				style: {
					left: '50px',
					top: '18px',
				}
			}]
		},
		plotOptions: {
			column: {
				stacking: 'normal',
				dataLabels: {
					enabled: true,
					color: 'white',
					format: '<span style="text-decoration:none !important;>{series.name}: {point.y}</span>'
				}
			}
		},
		series: [{
			type: 'column',
			name: 'Marks',
			color: '#6610f2',
			data: this.topicMarkArray
		},
		{
			type: 'spline',
			name: 'Class Average',
			color: '#fe756d',
			data: this.subtopicAverageArray

		}, {
			type: 'spline',
			name: 'Highest Marks',
			color: '#04CDE4',
			data: this.subtopicHighestArray

		}]
	};
	lineChartFlag = false;

	constructor(
		private qelementService: QelementService,
		private route: ActivatedRoute,
		private htt: HtmlToTextService,
		private reportService: ReportService,
		private breadCrumbService: BreadCrumbService
	) {
		this.percentageValue = function (value: number): string {
			return `${Math.round(value)} / ${this['max']}`;



		};
	}
	ngAfterViewInit() {
		this.viewReportTopic();
	}

	bookmarkQues() {
		setTimeout(() => this.bookmarkQuestion = true, 500);
	}

	ngOnInit() {
		this.gaugeValue1 = '99';
		this.gaugeValue2 = '75';
		this.es_id = this.route.snapshot.params['id'];
		const currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.login_id = currentUser.login_id;
		this.getScheduledExam();
		this.getExamAttendence();
		this.viewReportTimeTaken();
		this.correctQuestion();
		this.qelementService.getExamAttendance({ es_id: this.es_id, login_id: currentUser.login_id }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.evalutionDetail = result.data[0];
					this.eva_id = this.evalutionDetail.eva_id;
					this.reportService.viewRankObtained({ es_id: this.es_id }).subscribe(
						(result2: any) => {
							if (result2 && result2.status === 'ok') {
								for (const item of result2.data) {
									if (this.eva_id === item.eva_id) {
										this.rankDetails = item;
										break;
									}
								}
								this.viewRankObtainedFlag = true;
							} else {
								this.viewRankObtainedFlag = true;
							}
						}
					);
					this.viewMarkObtained();

					this.qelementService.examQuestionStatus({ evd_eva_id: this.evalutionDetail.eva_id }).subscribe(
						(result1: any) => {
							if (result1 && result1.status === 'ok') {
								this.examQuestionStatusArray = result.data;
							}
						}
					);

				}
			}
		);
	}
	getScorecordDiv() {
		// tslint:disable-next-line:max-line-length
		if (this.getScheduledExamFlag && this.getExamAttendence && this.viewReportTimeTakenFlag && this.viewRankObtainedFlag && this.correctQuestioFlag && this.skipQuestionFlag) {
			return true;
		}
	}

	viewStudentTable() {
		this.getTopicDetails();
		this.reportOverviewStudentTable = true;
		this.getInfoScoreCard = false;
	}

	gobackScorecard() {
		this.reportOverviewStudentTable = false;
		this.getInfoScoreCard = true;
	}

	getScheduledExam() {
		this.qelementService.getScheduledExam({ es_id: this.es_id, es_status: '2' }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.examDetail = result.data[0];
					this.getStudents();
					this.qelementService.getQuestionPaper({ qp_id: this.examDetail.es_qp_id }).subscribe(
						(result1: any) => {
							if (result1 && result1.status === 'ok') {
								this.questionpaperDetail = result1.data[0];
								const subIdArray = this.questionpaperDetail.qp_sub_id.replace(/\s/g, '').split(',');
								const subNameArray = this.questionpaperDetail.sub_name.replace(/\s/g, '').split(',');
								if (subIdArray.length === subNameArray.length) {
									for (let i = 0; i < subIdArray.length; i++) {
										const subDetail = {
											sub_id: subIdArray[i],
											sub_name: subNameArray[i]
										};
										this.subjectArrayOfQP.push(subDetail);
									}
								}

								for (const item of this.subjectArrayOfQP) {
									for (const titem of this.questionpaperDetail.qlist) {
										if (Number(titem.topic_sub_id) === Number(item.sub_id)) {
										const findex = this.subjectWiseTopicArray.findIndex((f) =>
										Number(f.topic_id) === Number(titem.topic_id)
											&&
											Number(f.st_id) === Number(titem.st_id));
											if ( findex === -1) {
											this.subjectWiseTopicArray.push({
												topic_id: titem.topic_id,
												topic_name: titem.topic_name,
												st_name: titem.st_name,
												st_id: titem.st_id,
												sub_id: item.sub_id
											});
										} else {
											continue;
										}
										} else {
											continue;
										}
									}
								}
								// this.gaugeOptions.yAxis.max = this.questionpaperDetail.tp_marks
								// this.gaugeOptions2.yAxis.max = this.questionpaperDetail.tp_marks
								this.gaugeOptions.yAxis.max = Number(this.questionpaperDetail.tp_marks);
								this.getScheduledExamFlag = true;
							} else {
								this.getScheduledExamFlag = true;
							}
						}
					);
				}
			}
		);
	}

	getQusColor(answerStatus) {
		if (answerStatus === '') {
			return '#6f42c1';
		} else if (answerStatus === '0') {
			return '#ff5872';
		} else if (answerStatus === '1') {
			return '#00b197';
		}
	}

	getColormcqmr(qansai) {
		if (this.currentQA.options[qansai].qopt_answer === '1') {
			return '2px solid #00b197';
		}    else {
			return '';
		}
	}
	htmlToText(html) {
		return this.htt.htmlToText(html);
	}

	getExamAttendence() {
		this.qelementService.getExamAttendance({ es_id: this.es_id }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.presentStudentArray = result.data;
					this.getExamAttendenceFlag = true;
				} else {
					this.getExamAttendenceFlag = true;
				}
			}
		);
	}

	viewMarkObtained() {
		this.reportService.viewMarkObtained({ es_id: this.es_id }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.marksDetailsArray = result.data;
					this.highestMarks = 0;
					this.classAverage = 0;
					let totalStu = 0;
					for (const marks of this.marksDetailsArray) {
						totalStu++;
						this.classAverage += Number(marks.total_mark);
						if (Number(marks.total_mark) >= this.highestMarks) {
							this.highestMarks = Number(marks.total_mark);
							this.gaugeOptions.series[0].data[0].y = this.highestMarks;
						}
						if (marks.eva_id === this.eva_id) {
							this.marksDetails = marks;
						}
						this.gaugeValue1 = this.marksDetails.total_mark;
					this.gaugeValue2 = this.classAverage / totalStu;
				}
				// tslint:disable-next-line:radix
				this.gaugeOptions.series[1].data[0].y = [parseInt(this.gaugeValue1)];
				// tslint:disable-next-line:radix
				this.gaugeOptions.series[2].data[0].y = [parseInt(this.gaugeValue2)];
				this.firstGauge = true;
				this.secondGauge = true;
			}
			});
	}

	viewReportTopicSubtopic() {
		this.stArray = [];
		this.testQuestionArray = [];
		this.etopicArray = [];
		this.estArray = [];
		this.subtopicNameArray = [];
		this.topicMarkArray = [];
		this.highestMarkArray = [];
		this.subtopicHighestArray = [];
		this.subtopicAverageArray = [];
		this.averageMarkArray = [];
		this.topicSubtopicArray = [];
		this.TopicSubtopicArray = [];
		this.topicSubtopicArrayTemp = [];
		this.totalMarksSubtopics = 0;
		this.reportService.viewReportTopicSubtopic({ es_id: this.es_id, login_id: this.login_id }).subscribe(
			(result: any) => {

				if (result && result.status === 'ok') {
					this.TopicSubtopicArray = result.data;

					const topSubstopicSubjetWiseArray: any[] = [];
					for (const item of this.TopicSubtopicArray) {
						topSubstopicSubjetWiseArray.push(item);
					}

					for (const item of this.subjectWiseTopicArray) {
						for (const titem of topSubstopicSubjetWiseArray) {
							if (Number(item.st_id) === Number(titem.st_id)) {
								this.subtopicNameArray.push(item.st_name);
								this.topicMarkArray.push(Number(titem.mark_scored));
								break;
							}
						}
					}
					for (const item of this.topicMarkArray) {
						this.totalMarksSubtopics = this.totalMarksSubtopics + item;
					}
					this.totalMarksSubtopics = this.totalMarksSubtopics.toFixed(2);
						this.lineChart.xAxis.categories = this.subtopicNameArray;
						this.lineChart.series[0].data = this.topicMarkArray;
					this.reportService.classHighest({ es_id: this.es_id }).subscribe(
						(result1: any) => {
							if (result1 && result1.status === 'ok') {
								this.highestMarkArray = result1.data;
								for (const item of this.subjectWiseTopicArray) {
									for (const titem of this.highestMarkArray) {
										if (Number(item.st_id) === Number(titem.st_id)) {
											this.subtopicHighestArray.push(Number(titem.highest));
											break;
										}
									}
								}

									this.lineChart.series[2].data = this.subtopicHighestArray;
								this.reportService.classAverage({ es_id: this.es_id }).subscribe(
									(result2: any) => {
										if (result2 && result2.status === 'ok') {
											this.averageMarkArray = result2.data;
											for (const item of this.subjectWiseTopicArray) {
												for (const titem of this.averageMarkArray) {
													if (Number(item.st_id) === Number(titem.st_id)) {
														this.subtopicAverageArray.push(Number(this.convertFloat(titem.average_score)));
														break;
													}
												}
											}
											this.lineChart.series[1].data = this.subtopicAverageArray;
										}
										this.lineChartFlag = true;
									});
							}
						});
					let curTopic_id = 0;
					let curTopic_name = '';
					for (const item of this.TopicSubtopicArray) {
						if (curTopic_id !== item.topic_id) {
							curTopic_id = item.topic_id;
							curTopic_name = item.topic_name;
							this.etopicArray.push({ topic_id: curTopic_id, topic_name: curTopic_name });
						}
					}
					let curst_id = 0;
					let curst_name = '';
					for (const item of this.TopicSubtopicArray) {
						if (curst_id !== item.st_id) {
							curst_id = item.st_id;
							curst_name = item.st_name;
							curTopic_id = item.topic_id;
							this.maxMarks = item.max_mark;
							this.markScored = item.mark_scored;
							const percentage = ((this.markScored) / (this.maxMarks) * 100);
							const str = percentage.toString();
							this.trimmedPercentageVal = str.slice(0, 4);
							this.estArray.push({
								topic_id: curTopic_id, st_id: curst_id,
								st_name: curst_name, max_mark: this.maxMarks,
								mark_scored: this.markScored, percentage: this.trimmedPercentageVal });
						}
					}
					let jitem: any = {};
					for (const titem of this.etopicArray) {
						jitem = {};
						jitem.topic_name = titem.topic_name;
						jitem.topic_id = titem.topic_id;
						const stArray = [];
						for (const sitem of this.estArray) {
							if (sitem.topic_id === titem.topic_id) {
								stArray.push(sitem);
							}
						}
						jitem.stArray = stArray;
						this.topicSubtopicArray.push(jitem);
						let cntRowSpan = 0;
						jitem.row_span = jitem.stArray.length.toString();
						cntRowSpan += jitem.stArray.length;
						jitem.row_span = cntRowSpan.toString();
						this.tableCollection = true;
					}

					for (const item of this.subjectWiseTopicArray) {
						for (const titem of this.topicSubtopicArray) {
							for (const st of titem.stArray) {
								if (Number(item.st_id) === Number(st.st_id)) {
									const findex = this.topicSubtopicArrayTemp.findIndex(f =>
										Number(f.topic_id) === Number(titem.topic_id));
										if (findex === -1) {
									this.topicSubtopicArrayTemp.push({
										row_span: titem.row_span,
										stArray: titem.stArray,
										topic_id: titem.topic_id,
										topic_name: titem.topic_name,
										sub_id: item.sub_id
									});
								}
								}
							}
						}
					}
				}
			}
		);
	}

	getTopicDetails() {
		this.stArray = [];
		this.testQuestionArray = [];
		this.etopicArray = [];
		this.estArray = [];
		this.subtopicNameArray = [];
		this.topicMarkArray = [];
		this.highestMarkArray = [];
		this.subtopicHighestArray = [];
		this.subtopicAverageArray = [];
		this.averageMarkArray = [];
		this.topicSubtopicArray = [];
		this.TopicSubtopicArray = [];
		this.topicSubtopicArrayTemp = [];
		this.totalMarksSubtopics = 0;
		this.reportService.viewReportTopicSubtopic({ es_id: this.es_id, login_id: this.login_id }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.TopicSubtopicArray = result.data;
					const topSubstopicSubjetWiseArray: any[] = [];
					for (const item of this.TopicSubtopicArray) {
						topSubstopicSubjetWiseArray.push(item);
					}

					for (const item of this.subjectWiseTopicArray) {
						for (const titem of topSubstopicSubjetWiseArray) {
							if (Number(item.st_id) === Number(titem.st_id)) {
								this.subtopicNameArray.push(item.st_name);
								this.topicMarkArray.push(Number(titem.mark_scored));
								break;
							}
						}
					}
					for (const item of this.topicMarkArray) {
					this.totalMarksSubtopics = this.totalMarksSubtopics + item;
				}
				this.totalMarksSubtopics = this.totalMarksSubtopics.toFixed(2);
				this.lineChart.xAxis.categories = this.subtopicNameArray;
						this.lineChart.series[0].data = this.topicMarkArray;

					this.reportService.classHighest({ es_id: this.es_id }).subscribe(
						(response: any) => {
							if (response && response.status === 'ok') {
								this.highestMarkArray = response.data;
								for (const item of this.subjectWiseTopicArray) {
									for (const titem of this.highestMarkArray) {
										if (Number(item.st_id) === Number(titem.st_id)) {
											this.subtopicHighestArray.push(Number(titem.highest));
											break;
										}
									}
								}
								this.lineChart.series[2].data = this.subtopicHighestArray;
								this.reportService.classAverage({ es_id: this.es_id }).subscribe(
									(res: any) => {
										if (res && res.status === 'ok') {
											this.averageMarkArray = res.data;
											for (const item of this.subjectWiseTopicArray) {
												for (const titem of this.averageMarkArray) {
													if (Number(item.st_id) === Number(titem.st_id)) {
														this.subtopicAverageArray.push(Number(this.convertFloat(titem.average_score)));
														break;
													}
												}
											}
											this.lineChart.series[1].data = this.subtopicAverageArray;
										}
									});
							}
						});
					let curTopic_id = 0;
					let curTopic_name = '';
					for (const item of this.TopicSubtopicArray) {
						if (curTopic_id !== item.topic_id) {
							curTopic_id = item.topic_id;
							curTopic_name = item.topic_name;
							this.etopicArray.push({ topic_id: curTopic_id, topic_name: curTopic_name });
						}
					}
					let curst_id = 0;
					let curst_name = '';
					for (const item of this.TopicSubtopicArray) {
						if (curst_id !== item.st_id) {
							curst_id = item.st_id;
							curst_name = item.st_name;
							curTopic_id = item.topic_id;
							this.maxMarks = item.max_mark;
							this.markScored = item.mark_scored;
							const percentage = ((this.markScored) / (this.maxMarks) * 100);
							const str = percentage.toString();
							this.trimmedPercentageVal = str.slice(0, 4);
							this.estArray.push({
								topic_id: curTopic_id, st_id: curst_id,
								st_name: curst_name, max_mark: this.maxMarks, mark_scored: this.markScored, percentage: this.trimmedPercentageVal
							});
						}
					}
					let jitem: any = {};
					this.topicSubtopicArray = [];
					for (const titem of this.etopicArray) {
						jitem = {};
						jitem.topic_name = titem.topic_name;
						jitem.topic_id = titem.topic_id;
						const stArray = [];
						for (const sitem of this.estArray) {
							if (sitem.topic_id === titem.topic_id) {
								stArray.push(sitem);
							}
						}
						jitem.stArray = stArray;
						this.topicSubtopicArray.push(jitem);
						let cntRowSpan = 0;
						jitem.row_span = jitem.stArray.length.toString();
						cntRowSpan += jitem.stArray.length;
						jitem.row_span = cntRowSpan.toString();
						this.tableCollection = true;
					}
					for (const item of this.subjectWiseTopicArray) {
						for (const titem of this.topicSubtopicArray) {
							for (const st of titem.stArray) {
								if (Number(item.st_id) === Number(st.st_id)) {
									const findex = this.topicSubtopicArrayTemp.findIndex(f =>
										Number(f.topic_id) === Number(titem.topic_id));
										if (findex === -1) {
									this.topicSubtopicArrayTemp.push({
										row_span: titem.row_span,
										stArray: titem.stArray,
										topic_id: titem.topic_id,
										topic_name: titem.topic_name,
										sub_id: item.sub_id
									});
								}
								}
							}
						}
					}
				}

			}
		);
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

	viewReportTopic() {
		this.reportService.viewReportTopic({ es_id: this.es_id, login_id: this.login_id }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.repostTopicArray = result.data;
				}
			}
		);
	}

	correctQuestion() {
		this.reportService.correctQuestion({ es_id: this.es_id, login_id: this.login_id }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					// adding data
					// vishnu
					this.options.series[0].data.push({
						name: 'Correct',
						y: (result.data && result.data.length) || 0
					});
					this.correctQArray = result.data;
					this.incorrectQuestion();
					this.correctQuestioFlag = true;
				} else {
					// adding data
					// vishnu
					this.options.series[0].data.push({
						name: 'Correct',
						y: 0
					});
					this.correctQArray = [];
					this.incorrectQuestion();
					this.correctQuestioFlag = true;
				}
			}
		);
	}

	incorrectQuestion() {
		this.reportService.incorrectQuestion({ es_id: this.es_id, login_id: this.login_id }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.incorrectQArray = result.data;
					// adding data
					// vishnu
					this.options.series[0].data.push({
						name: 'Incorrect',
						y: (result.data && result.data.length) || 0
					});
					this.accuracy = Number((this.correctQArray.length * 100) / (this.correctQArray.length + this.incorrectQArray.length)).toFixed(0);
					this.skipQuestion();
				} else {
					// adding data
					// vishnu
					this.options.series[0].data.push({
						name: 'Incorrect',
						y: 0
					});
					this.incorrectQArray = [];
					this.accuracy = '0';
					this.skipQuestion();
				}
			}
		);
	}

	skipQuestion() {
		this.reportService.skipQuestion({ es_id: this.es_id, login_id: this.login_id }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.skipQArray = result.data;
					// adding data
					// vishnu
					this.options.series[0].data.push({
						name: 'Skipped',
						y: (result.data && result.data.length) || 0
					});
					this.pieChartData = [this.correctQArray.length, this.incorrectQArray.length, this.skipQArray.length];
					this.skipQuestionFlag = true;
				} else {
					this.skipQArray = [];
					// adding data
					// vishnu
					this.options.series[0].data.push({
						name: 'Skipped',
						y: 0
					});
					this.pieChartData = [this.correctQArray.length, this.incorrectQArray.length, this.skipQArray.length];
					this.skipQuestionFlag = true;
				}
			}
		);
		this.pieFlag = true;
	}

	viewReportTimeTaken() {
		this.reportService.viewReportTimeTaken({ es_id: this.es_id, login_id: this.login_id }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.timeTakenDetail = result.data[0];
					const timeMin = this.timeTakenDetail.time_taken;
					const a = timeMin.split(':'); // split it at the colons
					// Hours are worth 60 minutes.
					const minutes = (+a[0]) * 60 + (+a[1]);
					this.timeTakenDetail.time_taken = minutes;
					this.viewReportTimeTakenFlag = true;
				}
			}
		);
	}

	getFlag(value) {
		if (value >= 60) {
			return 'Achievement';
		}  else if (value > 40) {
			return 'Needs Improvement';
		} else {
			return 'Critical';
		}
	}

	getColor(value) {
		if (value >= 60) {
			return '<i class="far fa-flag teacher-score-flag-green"></i>';
		} else if (value > 40) {
			return '<i class="far fa-flag teacher-score-flag-yellow"></i>';
		} else {
			return '<i class="far fa-flag teacher-score-flag-red"></i>';
		}
	}

	getStudents() {

		this.qelementService.getUser({
			class_id: this.examDetail.es_class_id, sec_id: this.examDetail.es_sec_id, role_id: '4', status: '1' }).subscribe(
			(result: any) => {

				if (result && result.status === 'ok') {
					this.studentArray = result.data;
				}
			}
		);
	}
	showPerformanceGraph() {
		this.viewReportTopicSubtopic();
	}
	printPerformanceGraph() {
		const printModal2 = document.getElementById('printModal3');
		const popupWin = window.open('', '_blank', 'width=screen.width,height=screen.height');
		popupWin.document.open();
		popupWin.document.write('<html>' +
		// tslint:disable-next-line:max-line-length
		'<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.13/css/all.css" integrity="sha384-DNOHZ68U8hZfKXOrtjWvjxusGo9WQnrNx2sqG0tfsghAvtVlRW3tvkXWZh58N9jp" crossorigin="anonymous">'
		+ '<style>button { display:none; } @page {size:landscape}' +
		'mat-tab-header {display: none;}' +
			'.report-information-bar {background-color: #e6e5df;}' +
			'b{font-weight: bolder;}' +
			'.info-first-circle {color: #f44a66;}' +
			'.info-second-circle {color: #32bea2;}' +
			'.info-third-circle {color: #6c65c8;}' +
			'.info-four-circle {color: #ffb519;}' +
			'.row{display:flex !important}' +
			'.information-bar-content {font-size: 14px !important;text-align: center !important;}' +
			'.col-lg-12 {padding-left: 15px;width: 100%;}' +
			'.col-lg-3 {padding:10px !important;margin-bottom:5px !important;width:100%}' +
		'</style><body onload="window.print()">' + printModal2.innerHTML + '</html>');
		popupWin.document.close();
	}
	printScoreCard() {
		const printModal2 = document.getElementById('printModal3');
		const popupWin = window.open('', '_blank', 'width=screen.width,height=screen.height');
		popupWin.document.open();
		popupWin.document.write('<html>' +
		// tslint:disable-next-line:max-line-length
		'<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.13/css/all.css" integrity="sha384-DNOHZ68U8hZfKXOrtjWvjxusGo9WQnrNx2sqG0tfsghAvtVlRW3tvkXWZh58N9jp" crossorigin="anonymous">' +
		'<style>body{font-family: Roboto,"Helvetica Neue",Arial,sans-serif; font-size: 10px;}' +
			'.teacher-score-card-sub-title{font-size: 8px;}' +
			' button { display:none; } @page {size:landscape} img{height:55px !important;width:75px !important}' +
			' .print-top-card-title{width:205px}' +
			' .print-avail-space{width: -webkit-fill-available !important}' +
			' .mat-card:not([class*=mat-elevation-z]) ' +
			'{box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12) !important }' +
			' mat-card { display: block !important;position: relative !important;padding:24px !important; border-radius:10px !important}' +
			'.col-lg-3 {padding:12px !important;margin-bottom:5px !important;width:100%}' +
			' .row{display:flex !important}.remove-col-modal-padding {padding-right: 0px !important;padding-left: 0px !important;}' +
			' mat-card.score-card-info-card-main-box score-card-report-overview{display:none}' +
			'.col-lg-12 {width: 100%;}' +
			'.teacher-score-card-dynamic-value {margin-top: 20px !important;font-size: 24px;font-weight: 700;}' +
			'.teacher-score-card-sub-title {font-size: 12px;}' +
			'.remove-col-modal-padding {padding-right: 0px !important;padding-left: 0px !important;}' +
			'.float-right {float: right!important;}' +
			'.print-top-card-title-2 {margin-left: 232px;}' +
			'.hide-report-overview{display:none !important}' +
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
			'.ongoing-marking{margin-top:-10px !important;margin-left:50px !important}' +
			'</style><body onload="window.print()">' + printModal2.innerHTML + '</html>');
		popupWin.document.close();
	}
	convertFloat(value) {
			const parseValue = Math.round(value * 100) / 100;
			return parseValue;
	}
	getMarksScoredSubtopicPerSubject(sub_id) {
		let sum = 0;
		for (const item of this.topicSubtopicArrayTemp) {
			if (Number(item.sub_id) === Number(sub_id)) {
				for (const titem of item.stArray) {
					sum = sum + Number(titem.mark_scored);
				}
			}
		}
		return sum.toFixed(2);
	}

}
