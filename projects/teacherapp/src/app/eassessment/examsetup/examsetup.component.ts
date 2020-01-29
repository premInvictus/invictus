import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { QelementService } from '../../questionbank/service/qelement.service';
import { NotificationService, BreadCrumbService, HtmlToTextService, SmartService } from '../../_services/index';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../../../src/environments/environment';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';
import { MatDialog, MatDialogRef } from '@angular/material';
import { QuestionPaperDialogComponent } from '../../questionbank/question-paper-dialog/question-paper-dialog.component';

@Component({
	selector: 'app-examsetup',
	templateUrl: './examsetup.component.html',
	styleUrls: ['./examsetup.component.css']
})
export class ExamsetupComponent implements OnInit {

	Exam_setup_Form: FormGroup;
	exam_toggle_Form: FormGroup;
	scheduleExamDetail: any = {};
	classArray: any[];
	subjectArray: any[];
	sectionArray: any[];
	teacherArray: any[];
	examTypeArray: any[] = [];
	hosturl = environment.apiAxiomUrl;
	optionHA = ['A', 'B', 'C', 'D', 'E'];
	optionmatchHA = ['P', 'Q', 'R', 'S', 'T'];
	schoolInfo: any;
	questionArray: any[];
	filterArray: any[];
	filterQuestionList: any[] = [];
	viewCurrentQP: any;
	paperListDiv = true;
	questionpaperArray: any[] = [];
	labArray: any[];
	viewCurrentQPDiv = false;
	es_id = 0;
	updateExamFlag = false;
	public qp_name: any;
	homeUrl: string;
	start_datetime: Date;
	current_qptime: number;
	currentQuestion: any;
	mintoday: string;
	events: string[] = [];
	dialogRef: MatDialogRef<QuestionPaperDialogComponent>;
	showGraceTime = false;
	hourArray: any[] = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10'];
	minutesArray: any[] = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10'];

	constructor(
		private fbuild: FormBuilder,
		private qelementService: QelementService,
		private notif: NotificationService,
		private htt: HtmlToTextService,
		private route: ActivatedRoute,
		private router: Router,
		private breadCrumbService: BreadCrumbService,
		private dialog: MatDialog,
		private smartService: SmartService
	) { }

	ngOnInit() {
		const today = new Date();
		this.mintoday = today.getFullYear().toString();
		const tmon = today.getMonth() + 1;
		const tdate = today.getDate();
		if (tmon < 10) {
			this.mintoday = this.mintoday + '-0' + tmon;
		} else {
			this.mintoday = this.mintoday + '-' + tmon;
		}
		if (tdate < 10) {
			this.mintoday = this.mintoday + '-0' + tdate;
		} else {
			this.mintoday = this.mintoday + '-' + tdate;
		}
		this.homeUrl = this.breadCrumbService.getUrl();
		if (this.route.snapshot.queryParams['es_id']) {
			this.es_id = this.route.snapshot.queryParams['es_id'];
			this.updateExamFlag = true;
			this.getScheduleExam();
		}
		this.getExamType();
		this.buildForm();
		this.getClass();
		this.getSubjectsByClass();
		this.getLabInfo();
		this.getSchool();
		for (let i = 11; i <= 24; i++) {
			this.hourArray.push(i.toString());
		}
		for (let i = 11; i <= 60; i++) {
			this.minutesArray.push(i.toString());
		}
	}

	buildForm() {
		this.Exam_setup_Form = this.fbuild.group({
			es_teacher_id: null,
			es_class_id: '',
			es_sec_id: '',
			es_sub_id: '',
			es_qp_id: '',
			es_lab_id: '',
			es_start_date: '',
			es_start_time: '',
			es_end_date: '',
			es_end_time: '',
			es_qt_status: '2',
			es_exam_type: '',
			es_template_type: ''
		});

		this.exam_toggle_Form = this.fbuild.group({
			es_shuffle_question: '',
			es_clock_format: '',
			es_rank_duplication: '',
			es_test_taker_report: '',
			es_notify_test: '',
			es_notify_result: '',
			es_notify_negative_mark: '',
			es_grace_time_extend: '',
			es_grace_hour: '',
			es_grace_minute: '',
			es_grace_extended_time: '',
			es_pass_marks: '',
			es_message: ''
		});
	}
	// Material Calendar
	addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
		this.events.push(`${type}: ${event.value}`);
		const datePipe = new DatePipe('en-US');
		const convertedDate = datePipe.transform(this.Exam_setup_Form.value.es_start_date, 'yyyy-MM-dd');
		this.Exam_setup_Form.patchValue({
			'es_start_date': convertedDate
		});
	}
	addEvent1(type: String, event: MatDatepickerInputEvent<Date>) {
		this.events.push(`${type}: ${event.value}`);
		const datePipe = new DatePipe('en-US');
		const convertedDate = datePipe.transform(this.Exam_setup_Form.value.es_end_date, 'yyyy-MM-dd');
		this.Exam_setup_Form.patchValue({
			'es_end_date': convertedDate
		});
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
	getExamType() {
		this.qelementService.getExamType().subscribe(
			(result: any) => {
				if (result) {
					this.examTypeArray = result;
				}
			}
		);
	}

	htmlToText(html) {
		return this.htt.htmlToText(html);
	}

	getCurrentQuestionpaper(value): void {
		if (value) {
			for (const item of this.questionpaperArray) {
				if (value === item.qp_id) {
					this.currentQuestion = item;
					this.current_qptime = Number(item.tp_time_alloted);
					const questionIdArray: any[] = [];
					for (const qitem of item.qlist) {
						questionIdArray.push(qitem.qpq_qus_id);
					}
					this.qelementService.getQuestionsInTemplate({ qus_id: questionIdArray }).subscribe(
						(result: any) => {
							if (result && result.status === 'ok') {
								if (result.data.length > 0) {
									for (const qus of result.data) {
										if (Number(qus.qus_qst_id) > 5 && Number(qus.qus_qst_id) < 13) {
											this.Exam_setup_Form.controls.es_qt_status.setValue('1');
											break;
										}
									}
								}
							}
						}
					);
				}
			}
		}
	}

	setEndTime() {
		const examStartTime = this.Exam_setup_Form.controls.es_start_time.value;
		if (this.Exam_setup_Form.controls.es_qp_id.value) {
			const startTime = examStartTime.split(':');
			let hh = Number(startTime[0]);
			let mm = Number(startTime[1]) + this.current_qptime;
			let hhS: string;
			let mmS: string;
			while (mm > 59) {
				hh++;
				mm = mm - 60;
			}
			if (hh < 10) {
				hhS = '0' + hh;
			} else {
				hhS = '' + hh;
			}
			if (mm < 10) {
				mmS = '0' + mm;
			} else {
				mmS = '' + mm;
			}
			this.Exam_setup_Form.controls.es_end_time.setValue(hhS + ':' + mmS);
		} else {
			this.notif.showSuccessErrorMessage('Please select question paper', 'error');
		}
	}

	getScheduleExam() {
		this.qelementService.getScheduledExam({ es_id: this.es_id }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.scheduleExamDetail = result.data[0];
					if (Number(this.scheduleExamDetail.es_grace_time_extend) === 1) {
						this.showGraceTime = true;
					}
					this.Exam_setup_Form.patchValue({
						'es_teacher_id': this.scheduleExamDetail.es_teacher_id,
						'es_class_id': this.scheduleExamDetail.es_class_id,
						'es_sec_id': this.scheduleExamDetail.es_sec_id,
						'es_sub_id': this.scheduleExamDetail.es_sub_id,
						'es_qp_id': this.scheduleExamDetail.es_qp_id,
						'es_lab_id': this.scheduleExamDetail.es_lab_id,
						'es_start_date': this.scheduleExamDetail.es_start_date,
						'es_end_date': this.scheduleExamDetail.es_end_date,
						'es_start_time': this.scheduleExamDetail.es_start_time,
						'es_end_time': this.scheduleExamDetail.es_end_time,
						'es_exam_type': this.scheduleExamDetail.es_exam_type,
						'es_template_type': this.scheduleExamDetail.es_template_type,
						'es_qt_status': this.scheduleExamDetail.es_qt_status
					});
					this.getSectionsByClass();
					this.getSubjectsByClass();
					this.getQuestionPaper();
					this.getAllTeacher();
					this.exam_toggle_Form.patchValue({
						'es_shuffle_question': this.scheduleExamDetail.es_shuffle_question === '1' ? true : false,
						'es_clock_format': this.scheduleExamDetail.es_clock_format === '1' ? true : false,
						'es_rank_duplication': this.scheduleExamDetail.es_rank_duplication === '1' ? true : false,
						'es_test_taker_report': this.scheduleExamDetail.es_test_taker_report === '1' ? true : false,
						'es_notify_test': false,
						'es_notify_result': this.scheduleExamDetail.es_notify_result === '1' ? true : false,
						'es_notify_negative_mark': this.scheduleExamDetail.es_notify_negative_mark === '1' ? true : false,
						'es_grace_time_extend': this.scheduleExamDetail.es_grace_time_extend === '1' ? true : false,
						'es_grace_hour': this.scheduleExamDetail.es_grace_extended_time.split(':')[0],
						'es_grace_minute': this.scheduleExamDetail.es_grace_extended_time.split(':')[1],
						'es_pass_marks': this.scheduleExamDetail.es_pass_marks,
						'es_message': this.scheduleExamDetail.es_message
					});
				}
			}
		);
	}

	// Add new exam setup
	applyForm() {
		// Form validations
		if (!this.Exam_setup_Form.value.es_class_id) {
			this.notif.showSuccessErrorMessage('Class is required', 'error');
		}
		if (!this.Exam_setup_Form.value.es_sec_id) {
			this.notif.showSuccessErrorMessage('Section is required', 'error');
		}
		if (!this.Exam_setup_Form.value.es_sub_id) {
			this.notif.showSuccessErrorMessage('Subject is required', 'error');
		}
		if (!this.Exam_setup_Form.value.es_qp_id) {
			this.notif.showSuccessErrorMessage('Question paper is required', 'error');
		}
		if (!this.Exam_setup_Form.value.es_lab_id) {
			this.notif.showSuccessErrorMessage('Lab location is required', 'error');
		}
		if (!this.Exam_setup_Form.value.es_start_date) {
			this.notif.showSuccessErrorMessage('Start date is required', 'error');
		}
		if (!this.Exam_setup_Form.value.es_start_time) {
			this.notif.showSuccessErrorMessage('Start time is required', 'error');
		}
		if (!this.Exam_setup_Form.value.es_end_time) {
			this.notif.showSuccessErrorMessage('End time is required', 'error');
		}
		if (!this.exam_toggle_Form.value.es_pass_marks) {
			this.notif.showSuccessErrorMessage('Passing marks is required', 'error');
		}
		if (this.showGraceTime) {
			if (!this.exam_toggle_Form.value.es_grace_hour) {
				this.notif.showSuccessErrorMessage('Grace hour is required', 'error');
			}
			if (!this.exam_toggle_Form.value.es_grace_minute) {
				this.notif.showSuccessErrorMessage('Grace minutes is required', 'error');
			}
		}
		/* Form Validation Ends */
		if (this.showGraceTime) {
			this.exam_toggle_Form.value.es_grace_extended_time =
				this.exam_toggle_Form.value.es_grace_hour + ':' + this.exam_toggle_Form.value.es_grace_minute + ':' + '00';
		}
		const setup_form: any = {};
		for (const key in this.Exam_setup_Form.value) {
			if (this.Exam_setup_Form.value.hasOwnProperty(key)) {
				setup_form[key] = this.Exam_setup_Form.value[key];
			}
		}
		for (const key in this.exam_toggle_Form.value) {
			if (this.exam_toggle_Form.value.hasOwnProperty(key)) {
				setup_form[key] = this.exam_toggle_Form.value[key];
			}
		}
		if (this.Exam_setup_Form.value.es_exam_type === '2') {
			setup_form.es_status = '1';
		}
		if (this.Exam_setup_Form.value.es_exam_type !== '2') {
			setup_form.es_end_date = this.Exam_setup_Form.value.es_start_date;
		}
		if (this.Exam_setup_Form.valid && this.exam_toggle_Form.valid) {
			const datePipe = new DatePipe('en-US');
			setup_form.es_start_date = datePipe.transform(setup_form.es_start_date, 'yyyy-MM-dd');
			setup_form.es_end_date = datePipe.transform(setup_form.es_end_date, 'yyyy-MM-dd');
			this.qelementService.addExamSetup(setup_form).subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.notif.showSuccessErrorMessage('Exam created successfully', 'success');
						if (result.notifytest) {
							this.qelementService.sendExamSetupSms(setup_form).subscribe(
								(result1: any) => {
									if (result1 && result1.status === 'ok') {
										// if (result1.data.studentData.length > 0) {
										// 	for (const eachstudent of result1.data.studentData) {
										// 		const url = 'http://api.msg91.com/api/sendhttp.php?authkey='
										// 			+ result1.data.authkey + '&mobiles=' + eachstudent.au_mobile +
										// 			'&message=' + result1.data.message + '&sender=' + result1.data.sender + '&route=' + result1.data.route;
										// 		const xhr = new XMLHttpRequest();
										// 		xhr.open('GET', url, true);
										// 		xhr.send();
										// 	}
										// }

										this.notif.showSuccessErrorMessage('SMS Sent successfully', 'success');
									}
								});
						}
					} else {
						this.notif.showSuccessErrorMessage('Exam setup not created', 'error');
					}
					this.Exam_setup_Form.patchValue({
						'es_class_id': '',
						'es_teacher_id': '',
						'es_sub_id': '',
						'es_sec_id': '',
						'es_qp_id': '',
						'es_lab_id': '',
						'es_start_date': '',
						'es_start_time': '',
						'es_end_time': '',
						'es_exam_type': '',
						'es_template_type': ''
					});
					this.exam_toggle_Form.patchValue({
						'es_shuffle_question': '',
						'es_clock_format': '',
						'es_rank_duplication': '',
						'es_test_taker_report': '',
						'es_notify_test': '',
						'es_notify_result': '',
						'es_notify_negative_mark': '',
						'es_grace_time_extend': '',
						'es_grace_extended_time': '',
						'es_pass_marks': '',
						'es_message': ''
					});
					this.currentQuestion = [];
					if (this.showGraceTime) {
						this.showGraceTime = false;
					}
				}
			);
		}
	}

	updateExamSetup() {
		if (!this.Exam_setup_Form.value.es_class_id) {
			this.notif.showSuccessErrorMessage('Class is required', 'error');
		}
		if (!this.Exam_setup_Form.value.es_sec_id) {
			this.notif.showSuccessErrorMessage('Section is required', 'error');
		}
		if (!this.Exam_setup_Form.value.es_sub_id) {
			this.notif.showSuccessErrorMessage('Subject is required', 'error');
		}
		if (!this.Exam_setup_Form.value.es_qp_id) {
			this.notif.showSuccessErrorMessage('Question paper is required', 'error');
		}
		if (!this.Exam_setup_Form.value.es_lab_id) {
			this.notif.showSuccessErrorMessage('Lab location is required', 'error');
		}
		if (!this.Exam_setup_Form.value.es_start_date) {
			this.notif.showSuccessErrorMessage('Start date is required', 'error');
		}
		if (!this.Exam_setup_Form.value.es_start_time) {
			this.notif.showSuccessErrorMessage('Start time is required', 'error');
		}
		if (!this.Exam_setup_Form.value.es_end_time) {
			this.notif.showSuccessErrorMessage('End time is required', 'error');
		}
		if (!this.exam_toggle_Form.value.es_pass_marks) {
			this.notif.showSuccessErrorMessage('Passing marks is required', 'error');
		}
		if (this.showGraceTime) {
			if (!this.exam_toggle_Form.value.es_grace_hour) {
				this.notif.showSuccessErrorMessage('Grace hour is required', 'error');
			}
			if (!this.exam_toggle_Form.value.es_grace_minute) {
				this.notif.showSuccessErrorMessage('Grace minutes is required', 'error');
			}
		}
		if (this.showGraceTime) {
			this.exam_toggle_Form.value.es_grace_extended_time =
				this.exam_toggle_Form.value.es_grace_hour + ':' + this.exam_toggle_Form.value.es_grace_minute + ':' + '00';
		}
		const setup_form: any = {};
		for (const key in this.Exam_setup_Form.value) {
			if (this.Exam_setup_Form.value.hasOwnProperty(key)) {
				setup_form[key] = this.Exam_setup_Form.value[key];
			}
		}
		for (const key in this.exam_toggle_Form.value) {
			if (this.exam_toggle_Form.value.hasOwnProperty(key)) {
				setup_form[key] = this.exam_toggle_Form.value[key];
			}
		}
		setup_form.es_id = this.es_id;
		if (this.Exam_setup_Form.valid && this.exam_toggle_Form.valid) {
			const datePipe = new DatePipe('en-US');
			setup_form.es_start_date = datePipe.transform(setup_form.es_start_date, 'yyyy-MM-dd');
			setup_form.es_end_date = datePipe.transform(setup_form.es_end_date, 'yyyy-MM-dd');
			this.qelementService.updateExamSetup(setup_form).subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.updateExamFlag = false;
						this.notif.showSuccessErrorMessage('Exam Details Updated Successfully', 'success');
						this.router.navigate(['../schedule_exam'], { relativeTo: this.route });
					} else {
						this.notif.showSuccessErrorMessage('Exam setup not updated', 'error');
					}
					this.Exam_setup_Form.patchValue({
						'es_class_id': '',
						'es_teacher_id': '',
						'es_sub_id': '',
						'es_sec_id': '',
						'es_qp_id': '',
						'es_lab_id': '',
						'es_start_date': '',
						'es_start_time': '',
						'es_end_time': ''
					});
					this.exam_toggle_Form.patchValue({
						'es_shuffle_question': '',
						'es_clock_format': '',
						'es_rank_duplication': '',
						'es_test_taker_report': '',
						'es_notify_test': '',
						'es_notify_result': '',
						'es_notify_negative_mark': '',
						'es_grace_time_extend': '',
						'es_grace_extended_time': '',
						'es_pass_marks': '',
						'es_message': ''
					});
				}
			);
		}
	}

	getClass() {
		this.qelementService.getClass().subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.classArray = result.data;
				}
			}
		);
	}

	openQuestionPaperDialog(currentQus) {
		this.dialogRef = this.dialog.open(QuestionPaperDialogComponent, {
			height: '90vh',
			width: '950px',
			data: { currentQus: currentQus }
		});
	}

	getSectionsByClass(): void {
		this.qelementService.getSectionsByClass(this.Exam_setup_Form.value.es_class_id).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.sectionArray = result.data;
				} else {
					this.sectionArray = [];
				}
			}
		);
	}

	getSubjectsByClass(): void {
		this.subjectArray = [];
		this.qelementService.getSubjectsByClass(this.Exam_setup_Form.value.es_class_id).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.subjectArray = result.data;
				}
			}
		);
	}

	async getAllTeacher() {
		this.teacherArray = [];
		const param: any = {};
		param.class_id = this.Exam_setup_Form.value.es_class_id;
		param.sub_id = this.Exam_setup_Form.value.es_sub_id;
		param.sec_id = this.Exam_setup_Form.value.es_sec_id;
		param.status = '1';
		if(param.class_id && param.sec_id && param.sub_id) {
			const smartparam: any = {};
			smartparam.tgam_config_type = '1';
			smartparam.tgam_axiom_config_id = param.class_id;
			smartparam.tgam_global_sec_id = param.sec_id;
			await this.smartService.getSmartToAxiom(smartparam).toPromise().then((result: any) => {
				if(result && result.status === 'ok') {
					param.class_id = result.data[0].tgam_global_config_id;
				}
			});
			const smartparam1: any = {};
			smartparam1.tgam_config_type = '2';
			smartparam1.tgam_axiom_config_id = param.sub_id;
			await this.smartService.getSmartToAxiom(smartparam1).toPromise().then((result: any) => {
				if(result && result.status === 'ok') {
					param.sub_id = result.data[0].tgam_global_config_id;
				}
			});
			await this.qelementService.getAllTeacher(param).toPromise().then(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.teacherArray = result.data;
					}
				}
			);
		}
	}

	getQuestionPaper() {
		this.questionpaperArray = [];
		const param: any = {};
		param.class_id = this.Exam_setup_Form.value.es_class_id;
		param.sec_id = this.Exam_setup_Form.value.es_sec_id;
		param.sub_id = this.Exam_setup_Form.value.es_sub_id;
		param.qp_status = 1;
		this.qelementService.getQuestionPaper(param).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.questionpaperArray = result.data;
					if (this.route.snapshot.queryParams['es_id']) {
						this.getCurrentQuestionpaper(this.scheduleExamDetail.es_qp_id);
					}
				}
			}
		);
	}

	getLabInfo() {
		this.qelementService.getLabInfo().subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.labArray = result.data;
				}
			}
		);
	}

	saveief() {
		this.Exam_setup_Form.reset();
		this.exam_toggle_Form.reset();
	}

	getQusPosFromCurrentQP(qus_id) {
		for (const qus of this.viewCurrentQP.qlist) {
			if (qus.qpq_qus_id === qus_id) {
				return qus.qpq_qus_position;
			}
		}
	}

	viewQuestionPaper(item) {
		this.viewCurrentQP = [];
		this.filterQuestionList = [];
		this.viewCurrentQP = item;
		this.questionArray = [];
		const questionIdArray = [];
		for (const qitem of item.qlist) {
			questionIdArray.push(qitem.qpq_qus_id);
		}
		this.qelementService.getQuestionsInTemplate({ qus_id: questionIdArray }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.questionArray = result.data;
					this.qelementService.getTemplate({ tp_id: item.qp_tp_id, tp_tt_id: item.tp_tt_id }).subscribe(
						// tslint:disable-next-line:no-shadowed-variable
						(result: any) => {
							if (result && result.status === 'ok') {
								this.filterArray = result.data[0].filters;
								const filters: any[] = [];

								for (const filter of this.filterArray) {
									const filterQuestionArray: any[] = [];

									for (const qitem of item.qlist) {
										if (filter.tf_id === qitem.qpq_tf_id) {
											filterQuestionArray.push(this.questionArray[this.questionArray.findIndex(function (ques, i) {
												return ques.qus_id === qitem.qpq_qus_id;
											})]);
										}
									}
									filter.qlist = filterQuestionArray;
									filters.push(filter);
									this.filterQuestionList.push(filter);
								}
								this.viewCurrentQPDiv = true;
								this.paperListDiv = false;
							}
						}
					);
				}
			}
		);
	}
	getGraceTimeToggle($event) {
		if ($event.checked === true) {
			this.showGraceTime = true;
		} else {
			this.showGraceTime = false;
		}
	}
}
