import { Component, OnInit } from '@angular/core';
import { QelementService } from '../../questionbank/service/qelement.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HtmlToTextService, NotificationService } from '../../_services/index';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

@Component({
	selector: 'app-studentanswerreview',
	templateUrl: './studentanswerreview.component.html',
	styleUrls: ['./studentanswerreview.component.css']
})
export class StudentanswerreviewComponent implements OnInit {

	Marks_Review_Form: FormGroup;
	eva_id: number;
	es_id: number;
	currentEssay: any = {};
	currentQAHasEssay = false;
	answer_reviewArray: any[] = [];
	answer_reviewArrayResult: any[] = [];
	currentQuestion: any = {};
	currentQIdx = 0;
	currentLoadQuestion: any = {};
	teacherMarksDetail: any;
	teacherMarksDetailArray: any[] = [];
	studentAnswerReviewDiv = false;
	hasSubjectiveDiv = false;
	showCorrect = false;
	examDetail: any;
	getCurrentQp: any;

	constructor(
		private fbuild: FormBuilder,
		private qelementService: QelementService,
		private route: ActivatedRoute,
		private htt: HtmlToTextService,
		private router: Router,
		private notif: NotificationService,
		public sanitizer: DomSanitizer
	) { }

	ngOnInit() {
		this.eva_id = this.route.snapshot.params['id1'];
		this.es_id = this.route.snapshot.params['id2'];
		this.qelementService.getScheduledExam({ es_id: this.es_id }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.examDetail = result.data[0];
				}
			});

		this.studentWiseAnswerReview();
		this.formBuilder();
	}

	formBuilder() {
		this.Marks_Review_Form = this.fbuild.group({
			evd_mark_obtained: ['', Validators.required],
			evd_remark: '',
			evd_qus_answer: ''
		});
	}

	teacherFinalSubmit() {
		this.qelementService.getTeacherInputMark({ eva_id: this.eva_id }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.teacherMarksDetailArray = result.data;
					let allSubjectiveQuestionsMarked = true;
					for (const eachQuestion of this.answer_reviewArray) {
						if (eachQuestion.marksStatus !== '1') {
							allSubjectiveQuestionsMarked = false;
						}
					}
					if (allSubjectiveQuestionsMarked) {
						this.qelementService.teacherFinalSubmit({ eva_id: this.eva_id, eva_status: '2' }).subscribe(
							// tslint:disable-next-line:no-shadowed-variable
							(result: any) => {
								if (result && result.status === 'ok') {
									this.notif.showSuccessErrorMessage('Submitted successfully', 'success');
									this.router.navigate(['../../../student_wise_evaluation', this.es_id], { relativeTo: this.route });
								}
							}
						);
					} else {
						this.router.navigate(['../../../student_wise_evaluation', this.es_id], { relativeTo: this.route });
					}
				} else {
					this.qelementService.teacherFinalSubmit({ eva_id: this.eva_id, eva_status: '2' }).subscribe(
						// tslint:disable-next-line:no-shadowed-variable
						(result: any) => {
							if (result && result.status === 'ok') {
								this.notif.showSuccessErrorMessage('Submitted successfully', 'success');
								this.router.navigate(['../../../student_wise_evaluation', this.es_id], { relativeTo: this.route });
							}
						}
					);
				}
			}
		);
	}

	viewCorrectAnswer() {
		this.showCorrect = true;
		const showdiv = document.getElementById('correct-answer');
		if (showdiv.style.display === 'none') {
			showdiv.style.display = 'block';
		} else {
			showdiv.style.display = 'none';
		}
	}

	getQusColor(marksStatus) {
		if (marksStatus === '0') {
			return '#dc3545';
		} else if (marksStatus === '1') {
			return '#28a745';
		}
	}

	studentWiseAnswerReview() {
		this.eva_id = this.route.snapshot.params['id1'];
		this.qelementService.studentWiseAnswerReview1({ evd_eva_id: this.eva_id }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					const evdquestionsArray = result.data;
					let totalsubjectivecount = 0;
					for (const evdqus of evdquestionsArray) {
						if (Number(evdqus.evd_qst_id) > 5 && Number(evdqus.evd_qst_id) < 13) {
							totalsubjectivecount++;
							this.answer_reviewArrayResult.push(evdqus);
						}
					}
					if (totalsubjectivecount > 0) {
						this.hasSubjectiveDiv = true;
					}
					// this.answer_reviewArrayResult = result.data;
					this.qelementService.getTeacherInputMark({ eva_id: this.eva_id }).subscribe(
						// tslint:disable-next-line:no-shadowed-variable
						(result: any) => {
							if (result && result.status === 'ok') {
								if (result.data.length > 0) {
									this.teacherMarksDetailArray = result.data;
									if (this.answer_reviewArrayResult.length > 0) {
										for (const qus of this.answer_reviewArrayResult) {
											qus.marksStatus = '0';
											for (const qus1 of this.teacherMarksDetailArray) {
												if (Number(qus1.res_qus_id) === Number(qus.evd_qus_id)) {
													if (qus1.res_mark_obtained !== '') {
														qus.marksStatus = '1';
													}
												}
											}
											this.answer_reviewArray.push(qus);
										}
										this.studentAnswerReviewDiv = true;
								this.loadQuestion(this.currentQIdx);
									} else {
										this.notif.showSuccessErrorMessage('student has not attempted any subjective question', 'error');
									}
								} else {
									this.answer_reviewArray = this.teacherMarksDetailArray;
								}
							} else {
								for (const qus of this.answer_reviewArrayResult) {
									qus.marksStatus = '0';
									this.answer_reviewArray.push(qus);
								}
								this.studentAnswerReviewDiv = true;
								this.loadQuestion(this.currentQIdx);
							}
						}
					);
				} else {
					this.currentQIdx = 0;
					this.answer_reviewArrayResult = [];
					this.studentAnswerReviewDiv = true;
					this.notif.showSuccessErrorMessage('student has not attempted any subjective question', 'error');

				}
			}
		);
	}

	loadQuestion(cqi) {
		this.currentQIdx = cqi;
		this.currentQAHasEssay = false;
		this.currentQuestion = this.answer_reviewArray[cqi];
		this.Marks_Review_Form.controls.evd_mark_obtained.setValue('');
		this.Marks_Review_Form.controls.evd_remark.setValue('');
		this.qelementService.getQuestionsInTemplate({ qus_id: this.currentQuestion.evd_qus_id }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.currentLoadQuestion = result.data[0];
					this.qelementService.getQuestionPaper({ qp_id: this.examDetail.es_qp_id, qp_status: 1 }).subscribe(
						(result1: any) => {
							if (result1 && result1.status === 'ok') {
								this.getCurrentQp = result1.data[0];
								if (this.getCurrentQp.qlist) {
									for (const item of this.getCurrentQp.qlist) {
										if (item.qpq_qus_id === this.currentLoadQuestion.qus_id) {
											this.currentLoadQuestion.qus_marks = item.qpq_marks;
											break;
										} else {
											continue;
										}
									}
								}
							}
						});
					if (this.currentLoadQuestion.qus_ess_id !== '' && this.currentLoadQuestion.qus_ess_id !== null) {
						this.qelementService.getEssay({ ess_id: this.currentLoadQuestion.qus_ess_id }).subscribe(
							(result3: any) => {
								if (result3) {
									this.currentEssay = result3.data[0];
									this.currentQAHasEssay = true;
								}
							}
						);
					}
				}
			}
		);
		this.qelementService.getTeacherInputMark({ eva_id: this.eva_id, qus_id: this.currentQuestion.evd_qus_id }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					if (result.data.length > 0) {
						this.teacherMarksDetail = result.data[0];
						this.Marks_Review_Form.controls.evd_mark_obtained.setValue(this.teacherMarksDetail.res_mark_obtained);
						this.Marks_Review_Form.controls.evd_remark.setValue(this.teacherMarksDetail.res_remark);
					} else {
					}
				}
			}
		);
	}

	firstQ() {
		this.loadQuestion(0);
	}

	lastQ() {
		this.loadQuestion(this.answer_reviewArray.length - 1);
	}

	nextQ() {
		if (this.currentQIdx < this.answer_reviewArray.length - 1) {
			this.loadQuestion(this.currentQIdx + 1);
		}
	}

	previousQ() {
		if (this.currentQIdx > 0) {
			this.loadQuestion(this.currentQIdx - 1);
		}
	}

	applyForm() {
		if (this.Marks_Review_Form.valid) {
			if ((Number(this.Marks_Review_Form.value.evd_mark_obtained) <= Number(this.currentLoadQuestion.qus_marks)) &&
				Number(this.Marks_Review_Form.value.evd_mark_obtained) >= 0) {
				// tslint:disable-next-line:max-line-length
				this.qelementService.teacherInputMark({ eva_id: this.eva_id, qus_id: this.currentQuestion.evd_qus_id, mark_obtained: this.Marks_Review_Form.value.evd_mark_obtained, remark: this.Marks_Review_Form.value.evd_remark }).subscribe(
					(result: any) => {
						if (result && result.status === 'ok') {
							this.answer_reviewArray[this.currentQIdx].marksStatus = '1';
							this.notif.showSuccessErrorMessage('Submitted Successfully', 'success');
							this.nextQ();
						} else {
							this.notif.showSuccessErrorMessage('Error receiving the data', 'error');
						}
					}
				);
			} else {
				this.notif.showSuccessErrorMessage('Marks  greater than that of question <br> or less than zero is not allowed', 'error');
			}
		} else {
			this.notif.showSuccessErrorMessage('Please enter marks alloted', 'error');
		}
	}

	htmlToText(html) {
		return this.htt.htmlToText(html);
	}
}
