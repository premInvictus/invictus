import { Component, OnInit } from '@angular/core';
import { QelementService } from '../../questionbank/service/qelement.service';
import { HtmlToTextService } from '../../_services/htmltotext.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../../../src/environments/environment';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

@Component({
	selector: 'app-teacher-copy',
	templateUrl: './teacher-copy.component.html',
	styleUrls: ['./teacher-copy.component.css']
})

export class TeacherCopyComponent implements OnInit {

	qp_id;
	questionArray: any[] = [];
	viewCurrentQP: any = {};
	teacherCopyPDiv = false;
	filterArray: any[];
	filterQuestionList: any[] = [];
	essayquestionArray: any[] = [];
	subjectArray: any[];
	essayGroupArray: any[] = [];
	essayGroupQuestionArray: any[] = [];
	subjectArrayInCurrentPaperDetails: any[] = [];
	optionHA = ['A', 'B', 'C', 'D', 'E'];
	optionmatchHA = ['P', 'Q', 'R', 'S', 'T'];
	hosturl = environment.apiAxiomUrl;
	schoolInfo: any = {};
	answerArray: any[] = [];
	answerArray3: any[] = [];
	answerArray3_2: any[] = [];
	answerArray_2: any[] = [];
	answerArray3_3: any[] = [];
	answerArray_3: any[] = [];
	answerArray3_4: any[] = [];
	answerArray_4: any[] = [];

	constructor(
		private qelementService: QelementService,
		private htt: HtmlToTextService,
		private route: ActivatedRoute,
		private sanitizer: DomSanitizer
	) { }

	ngOnInit() {
		this.qp_id = this.route.snapshot.params['id'];
		this.getQuestionPaper();
		this.getSchool();
	}

	getQuestionPaper() {
		this.qelementService.getQuestionPaper({ qp_id: this.qp_id, qp_status: 1 }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.viewCurrentQP = result.data[0];
					this.viewQuestionPaper();
				}
			}
		);
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

	viewQuestionPaper() {
		this.getSubjectsByClass(this.viewCurrentQP.qp_class_id);
		this.subjectArrayInCurrentPaperDetails = [];
		const subjectArrayInCurrentPaper = this.viewCurrentQP.qp_sub_id.replace(/\s/g, '').split(',');
		const questionIdArray = [];
		this.filterArray = [];
		this.filterQuestionList = [];
		this.essayquestionArray = [];
		this.essayGroupQuestionArray = [];
		this.essayGroupArray = [];
		this.questionArray = [];
		for (const qitem of this.viewCurrentQP.qlist) {
			questionIdArray.push(qitem.qpq_qus_id);
		}
		this.qelementService.getQuestionsInTemplate({ qus_id: questionIdArray }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					const questionArrayUnsorted = result.data;
					for (const eachitem of this.viewCurrentQP.qlist) {
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
						this.essayGroupQuestionArray.push({ ess_id: egroupValue, essayQuestionList: eachGroupQus, ess_sub_id: 0 });
					}
					for (const egq of this.essayGroupQuestionArray) {
						this.qelementService.getEssay({ ess_id: egq.ess_id }).subscribe(
							(result1: any) => {
								if (result1) {
									egq.ess_description = result1.data[0].ess_description;
									egq.ess_title = result1.data[0].ess_title;
									egq.ess_sub_id = result1.data[0].ess_sub_id;
								}
							}
						);
					}
					this.qelementService.getTemplate({ tp_id: this.viewCurrentQP.qp_tp_id, tp_tt_id: this.viewCurrentQP.tp_tt_id }).subscribe(
						// tslint:disable-next-line:no-shadowed-variable
						(result: any) => {
							if (result && result.status === 'ok') {
								const templateArray: any[] = result.data;
								let i = 0;
								for (const temp of templateArray) {
									if (Number(temp.tp_id) === Number(this.viewCurrentQP.qp_tp_id)) {
										break;
									} else {
										i++;
									}
								}
								this.filterArray = result.data[i].filters;
								const filters: any[] = [];
								for (const filter of this.filterArray) {
									const filterQuestionArray: any[] = [];
									for (const qitem of this.viewCurrentQP.qlist) {
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
								console.log(this.filterQuestionList);
								if (subjectArrayInCurrentPaper.length > 0) {
									for (const sub of subjectArrayInCurrentPaper) {
										const filterQuestionListSub = [];
										for (const filter of this.filterQuestionList) {
											if (filter.qlist.length > 0) {
												filterQuestionListSub.push(filter);
											}
										}
										this.subjectArrayInCurrentPaperDetails.push({
											sub_id: sub,
											sub_name: this.getSubName(sub),
											filterQuestionList: filterQuestionListSub,
											essayGroupQuestionArray: this.essayGroupQuestionArray
										});
									}
								}
								console.log(this.subjectArrayInCurrentPaperDetails);
								this.manipulateData(this.viewCurrentQP);
								this.manipulateDataEssay(this.viewCurrentQP);
								this.getMatrixAnswer();
								this.getMatrixEssayAnswer();
								this.getMatrix4X5Answer();
								this.getMatrixEssay4X5Answer();
								this.teacherCopyPDiv = true;
							}
						}
					);
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

	printTeacherCopy() {
		const printModal2 = document.getElementById('printModal2');
		const popupWin = window.open('', '_blank', 'width=900,height=500');
		popupWin.document.open();
		// tslint:disable-next-line:max-line-length
		popupWin.document.write(`<html>
		<style>
		@media print{
		button { display:none; } 
		iframe{background-image:url("http://www.c-comsat.com/wp-content/uploads/youtube_play_button.jpg");
		background-size:100% 100%} 
		.my_passage{font-size:14px !important} 


		.qst_name_head{text-align:center;font-size:15px; font-weight:bold}
		.qp_name_head{text-align:center;font-size:15px;}
		.logo{text-align:center;}
		.qus_position{width:2% !important}
		.ques_name{width:85% !important;}
		.moveTd{width:13% !important;font-weight:bold;}
		.imgClassExpress p img{height:100px;width:auto;margin-bottom:10px} 
		.imgclassQpList p img {height:100px;margin-bottom:10px} 
		table{margin:0px; padding:0px;}
		label{width:100% !important;margin:0px !important;}
		.general-inc{font-size:15px; font-weight:bold;}
		.text-center h5{text-align:center; margin:0;}
		.max_marks,.time_allowed{width:25% !important;}
		body{-webkit-print-color-adjust: exact; !important}
		.modifyWidth{width:92.5% !important} 
		.MJX_Assistive_MathML{display:none !important}
		mrow.MJX-TeXAtom-ORD{display:none !important}
		</style>
		<body onload="window.print()">
		${printModal2.innerHTML}
		</body>
		</html>
		`);
		popupWin.document.close();
	}

	getCorrectAnswer(answer) {
		if (answer === '1') {
			return true;
		}
	}

	htmlToText(html) {
		return this.htt.htmlToText(html);
	}

	getQusPosFromCurrentQP(qus_id) {
		for (const qus of this.viewCurrentQP.qlist) {
			if (qus.qpq_qus_id === qus_id) {
				return qus.qpq_qus_position;
			}
		}
	}
	getMatrixAnswer() {
		let ninthId = 0;
		let id13;
		for (const item of this.filterQuestionList) {
			for (const qitem of item.qlist) {
				if (qitem.qus_qst_id === '5') {
					let tenthId = 0;
					let id9 = 0;
					for (const answerrow of qitem.answer) {
						id13 = 0;
						// tslint:disable-next-line:no-shadowed-variable
						let answerText: any = '';
						while (id13 < 4) {
							if (answerrow[id13].qopt_answer === '1') {
								this.answerArray3[tenthId] = answerText + this.optionmatchHA[id13];
								answerText = answerText + this.optionmatchHA[id13];
							} else {
								this.answerArray3[tenthId] = answerText + '';
							}
							id13++;
						}
						tenthId++;
					}
					let answerText: any = '';
					while (id9 < 4) {
						this.answerArray[ninthId] = answerText + this.optionHA[id9] + '-' + this.answerArray3[id9];
						answerText = answerText + this.optionHA[id9] + '-' + this.answerArray3[id9] + '<br>';
						id9++;
					}
					ninthId++;
				}
			}
		}
	}
	// Matrix 4 * 5

	getMatrix4X5Answer() {
		let ninthId = 0;
		let id13;
		for (const item of this.filterQuestionList) {
			for (const qitem of item.qlist) {
				if (qitem.qus_qst_id === '13') {
					let tenthId = 0;
					let id9 = 0;
					for (const answerrow of qitem.answer) {
						id13 = 0;
						// tslint:disable-next-line:no-shadowed-variable
						let answerText: any = '';
						for (const answer of answerrow) {
							if (answer.qopt_answer === '1') {
								this.answerArray3_3[tenthId] = answerText + this.optionmatchHA[id13];
								answerText = answerText + this.optionmatchHA[id13];
							} else {
								this.answerArray3_3[tenthId] = answerText + '';
							}
							id13++;
						}
						tenthId++;
					}
					let answerText: any = '';
					while (id9 < 4) {
						this.answerArray_3[ninthId] = answerText + this.optionHA[id9] + '-' + this.answerArray3_3[id9];
						answerText = answerText + this.optionHA[id9] + '-' + this.answerArray3_3[id9] + '<br>';
						id9++;
					}
					ninthId++;
				}
			}
		}
	}
	//
	// Essay Matrix


	getMatrixEssayAnswer() {
		let ninthId = 0;
		let id13;
		for (const item of this.essayGroupQuestionArray) {
			for (const qitem of item.essayQuestionList) {
				if (qitem.qus_qst_id === '5') {
					let tenthId = 0;
					let id9 = 0;
					for (const answerrow of qitem.answer) {
						id13 = 0;
						// tslint:disable-next-line:no-shadowed-variable
						let answerText: any = '';
						while (id13 < 4) {
							if (answerrow[id13].qopt_answer === '1') {
								this.answerArray3_2[tenthId] = answerText + this.optionmatchHA[id13];
								answerText = answerText + this.optionmatchHA[id13];
							} else {
								this.answerArray3_2[tenthId] = answerText + '';
							}
							id13++;
						}
						tenthId++;
					}
					let answerText: any = '';
					while (id9 < 4) {
						this.answerArray_2[ninthId] = answerText + this.optionHA[id9] + '-' + this.answerArray3_2[id9];
						answerText = answerText + this.optionHA[id9] + '-' + this.answerArray3_2[id9] + '<br>';
						id9++;
					}
					ninthId++;
				}
			}
		}
	}
	// Essay Matrix 4 * 5

	getMatrixEssay4X5Answer() {
		let ninthId = 0;
		let id13;
		for (const item of this.essayGroupQuestionArray) {
			for (const qitem of item.essayQuestionList) {
				if (Number(qitem.qus_qst_id) === 13) {
					let tenthId = 0;
					let id9 = 0;
					for (const answerrow of qitem.answer) {
						id13 = 0;
						// tslint:disable-next-line:no-shadowed-variable
						let answerText: any = '';
						for (const answer of answerrow) {
							if (answer.qopt_answer === '1') {
								this.answerArray3_4[tenthId] = answerText + this.optionmatchHA[id13];
								answerText = answerText + this.optionmatchHA[id13];
							} else {
								this.answerArray3_4[tenthId] = answerText + '';
							}
							id13++;
						}
						tenthId++;
					}
					let answerText: any = '';
					while (id9 < 4) {
						this.answerArray_4[ninthId] = answerText + this.optionHA[id9] + '-' + this.answerArray3_4[id9];
						answerText = answerText + this.optionHA[id9] + '-' + this.answerArray3_4[id9] + '<br>';
						id9++;
					}
					ninthId++;
				}
			}
		}
		console.log(this.answerArray_4);
	}
	// End
	isEmpty(list) {
		if (list.length === 0) {
			return true;
		} else {
			return false;
		}
	}
}
