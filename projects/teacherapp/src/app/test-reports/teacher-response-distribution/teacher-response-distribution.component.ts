import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../_services/report.service';
import { ActivatedRoute } from '@angular/router';
import { QelementService } from '../../questionbank/service/qelement.service';
import { HtmlToTextService } from '../../_services/htmltotext.service';

@Component({
	selector: 'app-teacher-response-distribution',
	templateUrl: './teacher-response-distribution.component.html',
	styleUrls: ['./teacher-response-distribution.component.css']
})
export class TeacherResponseDistributionComponent implements OnInit {

	constructor(private reportService: ReportService,
		private route: ActivatedRoute,
		private qelementService: QelementService,
		private htt: HtmlToTextService) { }

	testQuestionArray: any[] = [];
	testQuestionArrayResult: any[] = [];
	topicSubtopicArray: any[] = [];
	teachertopicsubtopicDeiv = false;
	es_id: number;
	etopicArray: any[] = [];
	estArray: any[] = [];
	examDetail: any = {};
	questionpaperDetail: any = {};
	tableCollection = false;
	ngOnInit() {
		this.es_id = this.route.snapshot.params['id'];
		this.getTestQuestions();
		this.getScheduledExam();
	}
	htmlToText(html) {
		return this.htt.htmlToText(html);
	}

	getAttempted(num1, num2) {
		return Number(num1) + Number(num2);
	}
	getColormcqmr(qansai) {
		if (qansai === '1') {
			return '#50b7de';
		} else {
			return '';
		}
	}
	getTestQuestions(): void {
		this.testQuestionArray = [];
		this.reportService.testQuestionAnalysis({ es_id: this.es_id }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.testQuestionArrayResult = result.data;
					let curTopic_id = 0;
					let curTopic_name = '';
					let priPercentage = 0;
					let opt1Percentage = 0;
					let opt2Percentage = 0;
					let opt3Percentage = 0;
					let opt4Percentage = 0;
					let skipPercentage = 0;
					for (const item of this.testQuestionArrayResult) {
						if (curTopic_id !== item.topic_id) {
							curTopic_id = item.topic_id;
							curTopic_name = item.topic_name;
							this.etopicArray.push({ topic_id: curTopic_id, topic_name: curTopic_name });
						}
					}
					let curst_id = 0;
					let curst_name = '';
					for (const item of this.testQuestionArrayResult) {
						if (curst_id !== item.st_id) {
							curst_id = item.st_id;
							curst_name = item.st_name;
							curTopic_id = item.topic_id;
							this.estArray.push({ topic_id: curTopic_id, st_id: curst_id, st_name: curst_name, qusArray: [] });
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
					}
					for (const titem of this.topicSubtopicArray) {
						let cntRowSpan = 0;
						for (const sitem of titem.stArray) {
							for (const qus of this.testQuestionArrayResult) {
								if (qus.topic_id === titem.topic_id && qus.st_id === sitem.st_id) {
									priPercentage = Math.round((Number(qus.correct) / (Number(qus.correct) + Number(qus.incorrect) + Number(qus.skip))) * 100);
									if (priPercentage > 60) {
										qus.priority = '<i class=\'far fa-flag  teacher-score-flag-green\'></i>';
									} else if (priPercentage > 32) {
										qus.priority = '<i class=\'far fa-flag  teacher-score-flag-yellow\'></i>';
									} else {
										qus.priority = '<i class=\'far fa-flag  teacher-score-flag-red\'></i>';
									}
									if (Number(qus.qst_id) === 1) {
										opt1Percentage = Math.round((Number(qus.option1) / (Number(qus.correct) + Number(qus.incorrect) + Number(qus.skip))) * 100);
										opt2Percentage = Math.round((Number(qus.option2) / (Number(qus.correct) + Number(qus.incorrect) + Number(qus.skip))) * 100);
										opt3Percentage = Math.round((Number(qus.option3) / (Number(qus.correct) + Number(qus.incorrect) + Number(qus.skip))) * 100);
										opt4Percentage = Math.round((Number(qus.option4) / (Number(qus.correct) + Number(qus.incorrect) + Number(qus.skip))) * 100);
										qus.opt1Percentage = opt1Percentage + '%';
										qus.opt2Percentage = opt2Percentage + '%';
										qus.opt3Percentage = opt3Percentage + '%';
										qus.opt4Percentage = opt4Percentage + '%';
									}
									skipPercentage = Math.round((Number(qus.skip) / (Number(qus.correct) + Number(qus.incorrect) + Number(qus.skip))) * 100);
									qus.skipPercentage = skipPercentage + '%';
									sitem.qusArray.push(qus);
								}
							}
							sitem.row_span = sitem.qusArray.length.toString();
							cntRowSpan += sitem.qusArray.length;
						}
						titem.row_span = cntRowSpan.toString();
						this.testQuestionArray.push(titem);
					}

					this.tableCollection = true;
				}
			}
		);
	}


	getScheduledExam() {
		this.qelementService.getScheduledExam({ es_id: this.es_id, es_status: '2' }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {

					this.examDetail = result.data[0];
					this.qelementService.getQuestionPaper({ qp_id: this.examDetail.es_qp_id }).subscribe(
						(result1: any) => {
							if (result1 && result1.status === 'ok') {
								this.questionpaperDetail = result1.data[0];
								this.teachertopicsubtopicDeiv = true;
							}
						}
					);
				}
			}
		);
	}

	getQusPosition(qus_id) {
		for (let pi = 0; pi < this.questionpaperDetail.qlist.length; pi++) {
			if (qus_id === this.questionpaperDetail.qlist[pi].qpq_qus_id) {
				return pi + 1;
			}
		}
	}
}
