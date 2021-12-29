import { Component, OnInit , Inject} from '@angular/core';
import { QelementService } from '../service/qelement.service';
import { HtmlToTextService } from 'projects/axiom/src/app/_services/index';
import { appConfig } from 'projects/axiom/src/app/app.config';
import {  MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DomSanitizer} from '@angular/platform-browser';

@Component({
	selector: 'app-question-paper-dialog',
	templateUrl: './question-paper-dialog.component.html',
	styleUrls: ['./question-paper-dialog.component.css']
})

export class QuestionPaperDialogComponent implements OnInit {

	schoolInfo: any;
	viewCurrentQPDiv = true;
	viewCurrentQP: any;
	filterQuestionList: any[] = [];
	subjectArray: any[] = [];
	subjectArrayInCurrentPaperDetails: any[] = [];
	essayquestionArray: any[] = [];
	essayGroupArray: any[] = [];
	essayGroupQuestionArray: any[] = [];
	currentQus: any;
	scheduleExamDetail: any = {};
	hosturl = appConfig.apiUrl;
	optionHA = ['A', 'B', 'C', 'D', 'E'];
	optionmatchHA = ['P', 'Q', 'R', 'S', 'T'];
	questionArray: any[];
	filterArray: any[];
	paperListDiv = true;
	questionpaperArray: any[] = [];
	homeUrl: string;

	constructor(
		private qelementService: QelementService,
		private htt: HtmlToTextService,
		public dialogRef: MatDialogRef<QuestionPaperDialogComponent>,
		private sanitizer: DomSanitizer,
		@Inject(MAT_DIALOG_DATA) private data
	) { }

	ngOnInit() {
		this.getSchool();
		this.viewQuestionPaper(this.data);
		this.getSubjectsByClass(this.data.currentQus.qp_class_id);

	}
	getSchool() {
		this.qelementService.getSchool().subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.schoolInfo = result.data[0];
				}
			}
		);
	}
	getSubjectsByClass(class_id): void {

		this.qelementService.getSubjectsByClass(class_id).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {

					this.subjectArray = result.data;
				} else {
					this.subjectArray = [];
				}
			}
		);
	}
	getSubName(sub_id) {
		for (const element of this.subjectArray) {
			if (Number(element.sub_id) === Number(sub_id)) {
				return element.sub_name;
			}
		}
		return '';
	}

	belongToSub(sub1, sub2) {
		if (Number(sub1) === Number(sub2)) {
			return true;
		} else {
			return false;
		}
	}
	viewQuestionPaper(currentQus: any) {

		// this.viewCurrentQP = [];
		this.viewCurrentQP = this.data.currentQus;
		this.subjectArrayInCurrentPaperDetails = [];
		const subjectArrayInCurrentPaper = this.viewCurrentQP.qp_sub_id.replace(/\s/g, '').split(',');
		this.filterQuestionList = [];
		this.questionArray = [];
		const questionIdArray = [];
		for (const qitem of  this.data.currentQus.qlist) {
			questionIdArray.push(qitem.qpq_qus_id);
		}
		this.qelementService.getQuestionsInTemplate({ qus_id: questionIdArray }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.essayquestionArray = [];
					const questionArrayUnsorted = result.data;
					this.questionArray = [];
					for (const eachitem of this.data.currentQus.qlist) {
						for (const eachqus of questionArrayUnsorted) {
							if (eachitem.qpq_qus_id === eachqus.qus_id) {
								this.questionArray.push(eachqus);
							}
						}
					}
					for (const eachQus of this.questionArray) {
						if (Number(eachQus.qus_qt_id) === 3) {
							const eindex = this.questionArray.findIndex(value => value.qus_id === eachQus.qus_id);
							if (eindex !== -1) {
							this.essayquestionArray.push(eachQus);
							// this.questionArray.splice(eindex, 1);
							}
						}
					}
					for (const eachEQus of this.essayquestionArray) {
							const eindex = this.questionArray.findIndex(value => value.qus_id === eachEQus.qus_id);
						if (eindex !== -1) {
							this.questionArray.splice(eindex, 1);
						}
						if ((this.essayGroupArray.indexOf(eachEQus.qus_ess_id)) === -1) {
							this.essayGroupArray.push(eachEQus.qus_ess_id);
						}
					}
					for (const egroupValue of this.essayGroupArray) {
						const eachGroupQus: any[] = [];
							for (const eachEQus of this.essayquestionArray) {
							if (egroupValue === eachEQus.qus_ess_id) {
								eachGroupQus.push(eachEQus);
							}
						}
						this.essayGroupQuestionArray.push({ess_id: egroupValue, essayQuestionList: eachGroupQus, ess_sub_id: 0});
					}
					for (const egq of this.essayGroupQuestionArray) {
						this.qelementService.getEssay({ess_id: egq.ess_id}).subscribe(
							(result1: any) => {
								if (result1) {
									egq.ess_description = result1.data[0].ess_description;
									egq.ess_title = result1.data[0].ess_title;
									egq.ess_sub_id = result1.data[0].ess_sub_id;
								}
							}
						);
					}
					this.qelementService.getTemplate({ tp_id: this.data.currentQus.qp_tp_id, tp_tt_id:  this.data.currentQus.tp_tt_id }).subscribe(
						// tslint:disable-next-line:no-shadowed-variable
						(result: any) => {
							if (result && result.status === 'ok') {
								const templateArray = result.data;
								let i = 0;
								for (const item of templateArray) {
									if (item.tp_id === this.data.currentQus.qp_tp_id) {
										break;
									} else {
										i++;
									}
								}
								this.filterArray = result.data[i].filters;
								const filters: any[] = [];

								for (const filter of this.filterArray) {
									const filterQuestionArray: any[] = [];

									for (const qitem of this.data.currentQus.qlist) {
										if (filter.tf_id === qitem.qpq_tf_id) {
											const findex = this.questionArray.findIndex(ques => ques.qus_id === qitem.qpq_qus_id);
											if (this.questionArray[findex]) {
												filterQuestionArray.push(this.questionArray[findex]);
											}
										}
									}
									filter.qlist = filterQuestionArray;
									filters.push(filter);
									this.filterQuestionList.push(filter);
								}
								if (subjectArrayInCurrentPaper.length > 0) {
									for (const sub of subjectArrayInCurrentPaper) {
										const filterQuestionListSub = [];
										for (const filter of this.filterQuestionList) {
											if (filter.qlist.length > 0) {
												filterQuestionListSub.push(filter);
											}
										}
										this.subjectArrayInCurrentPaperDetails.push({
											sub_id : sub,
											sub_name : this.getSubName(sub),
											filterQuestionList: filterQuestionListSub,
											essayGroupQuestionArray: this.essayGroupQuestionArray
										});
									}
								}
								this.manipulateData(this.viewCurrentQP);
								this.manipulateDataEssay(this.viewCurrentQP);
								this.viewCurrentQPDiv = true;
								this.paperListDiv = false;
							}
						}
					);
				}
			}
		);
	}
	manipulateData(val) {
		for (const item of this.filterQuestionList) {
				if (item.qlist[0]) {
				for (const qitem of item.qlist) {
					for (const qpitem of val.qlist) {
						if (qitem.qus_id === qpitem.qpq_qus_id) {
							qitem.qus_marks = qpitem.qpq_marks;
							break;
						} else {
							continue;
						}
					}
				}
			}
		}
 }
 manipulateDataEssay(val) {
	for (const item of this.essayGroupQuestionArray) {
			if (item.essayQuestionList[0]) {
			for (const qitem of item.essayQuestionList) {
				for (const qpitem of val.qlist) {
					if (qitem.qus_id === qpitem.qpq_qus_id) {
						qitem.qus_marks = qpitem.qpq_marks;
						break;
					} else {
						continue;
					}
				}
			}
		}
 }
}
	// calling to get the selected question paper
	getQusPosFromCurrentQP(qus_id) {
		for (const qus of this.data.currentQus.qlist) {
			if (qus.qpq_qus_id === qus_id) {
				return qus.qpq_qus_position;
			}
		}
	}

	htmlToText(html) {
		return this.htt.htmlToText(html);
	}

	closeDialog() {
		this.dialogRef.close();
	}
}
