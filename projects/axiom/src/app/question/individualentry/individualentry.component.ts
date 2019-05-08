import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { McqComponent } from '../qtype/mcq/mcq.component';
import { TfComponent } from '../qtype/tf/tf.component';
import { McqmrComponent } from '../qtype/mcqmr/mcqmr.component';
import { MtfComponent } from '../qtype/mtf/mtf.component';
import { MatrixComponent } from '../qtype/matrix/matrix.component';
import { FillintheblanksComponent } from '../qtype/fillintheblanks/fillintheblanks.component';
import { IdentifyComponent } from '../qtype/identify/identify.component';
import { OnelineComponent } from '../qtype/oneline/oneline.component';
import { QbankService } from '../../questionbank/service/qbank.service';
import { QelementService } from '../../questionbank/service/qelement.service';
import { AdminService } from '../../user-type/admin/services/admin.service';
import { VeryshortanswerComponent } from '../qtype/veryshortanswer/veryshortanswer.component';
import { ShortanswerComponent } from '../qtype/shortanswer/shortanswer.component';
import { LonganswerComponent } from '../qtype/longanswer/longanswer.component';
import { VerylonganswerComponent } from '../qtype/verylonganswer/verylonganswer.component';
import { BreadCrumbService, NotificationService, CommonAPIService } from '../../_services/index';
import { EssayDialogsComponent } from '../../questionbank/essay-dialogs/essay-dialogs.component';
import { MathJaxDirective } from './../../mathjax.directive';
import { Matrix4X5Component } from '../qtype/matrix4-x5/matrix4-x5.component';
import { SingleintegerComponent } from '../qtype/singleinteger/singleinteger.component';
import { DoubleintegerComponent } from '../qtype/doubleinteger/doubleinteger.component';
@Component({
	selector: 'app-individualentry',
	templateUrl: './individualentry.component.html',
	styleUrls: ['./individualentry.component.css'],
})
export class IndividualentryComponent implements OnInit {

	@ViewChild(McqComponent) mcqComponent: McqComponent;
	@ViewChild(McqmrComponent) mcqmrComponent: McqmrComponent;
	@ViewChild(TfComponent) tfComponent: TfComponent;
	@ViewChild(MtfComponent) mtfComponent: MtfComponent;
	@ViewChild(MatrixComponent) matrixComponent: MatrixComponent;
	@ViewChild(FillintheblanksComponent) fillintheblanksComponent: FillintheblanksComponent;
	@ViewChild(IdentifyComponent) identifyComponent: IdentifyComponent;
	@ViewChild(OnelineComponent) onelineComponent: OnelineComponent;
	@ViewChild(VeryshortanswerComponent) veryshortanswerComponent: VeryshortanswerComponent;
	@ViewChild(ShortanswerComponent) shortanswerComponent: ShortanswerComponent;
	@ViewChild(LonganswerComponent) longanswerComponent: LonganswerComponent;
	@ViewChild(VerylonganswerComponent) verylonganswerComponent: VerylonganswerComponent;
	@ViewChild(Matrix4X5Component) matrix45component: Matrix4X5Component;
	@ViewChild(SingleintegerComponent) singleintegercomponent: SingleintegerComponent;
	@ViewChild(DoubleintegerComponent) doubleintegercomponent: DoubleintegerComponent;

	ind_entry_form1: FormGroup;
	ind_entry_form2: FormGroup;
	ind_entry_form3: FormGroup;
	qtypeTemplate: number;
	boardArray: any[];
	classArray: any[];
	subjectArray: any[];
	topicArray: any[];
	schoolinfoArray: any = {};
	subtopicArray: any[];
	questionTypeArray: any[];
	questionSubtypeArray: any[];
	skillTypeArray: any[];
	lodArray: any[];
	marksArray: any[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	negativemarksArray: any[] = [0, -1, -2, -3, -4, -5];
	timeallotedArray: any[] = [1, 2, 3, 4, 5, 6, 7, 8, 10];
	homeUrl: string;
	essayDialogRef: MatDialogRef<EssayDialogsComponent>;
	essayButtonTitle = false;
	essayPara: any = {};
	currentUser: any;
	uniqueEntries = true;

	addQuestionDetail = false;

	constructor(
		private fbuild: FormBuilder,
		private qbankService: QbankService,
		private qelementService: QelementService,
		private adminService: AdminService,
		private notif: NotificationService,
		private breadCrumbService: BreadCrumbService,
		private commonAPIService: CommonAPIService,
		private dialog: MatDialog
	) { }

	ngOnInit() {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.homeUrl = this.breadCrumbService.getUrl();
		this.buildForm();
		this.getBoard();
		this.getClass();
		this.getSkillData();
		this.getLodData();
		this.getSchool();
	}

	buildForm(): void {
		this.ind_entry_form1 = this.fbuild.group({
			qus_board_id: '',
			qus_class_id: '',
			qus_sub_id: '',
			qus_topic_id: '',
			qus_st_id: '',
		});
		this.ind_entry_form2 = this.fbuild.group({
			qus_qt_id: '',
			qus_qst_id: '',
			qus_skill_id: '',
			qus_dl_id: '1',
			qus_marks: '',
			qus_negative_marks: '',
			qus_time_alloted: '',
			qus_historical_reference: '',
			qus_ess_id: ''
		});
		this.ind_entry_form3 = this.fbuild.group({
		});
	}
	checkDuplicateEntries(arr, key) {
		let entrystatus = true;
		for (let i = 0; i < arr.length - 1; i++) {
			for (let j = i + 1; j < arr.length; j++) {
				if ((arr[i][key].localeCompare(arr[j][key])) === 0) {
					entrystatus = false;
					break;
				}
			}
			if (!entrystatus) {
				break;
			}
		}
		return entrystatus;
	}
	getSchool() {
		this.qelementService.getSchool().subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.schoolinfoArray = result.data[0];
					this.getQuestionTypeData();
				}
			}
		);
	}

	getBoard(): void {
		this.qelementService.getBoard().subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.boardArray = result.data;
				}
			}
		);
	}

	getClass() {
		this.qelementService.getClass().subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.classArray = result.data;
				} else {
					this.classArray = [];
				}
			}
		);
	}

	getSubjectsByClass(): void {
		if (this.currentUser.role_id === '1') {
			// tslint:disable-next-line:max-line-length
			this.adminService.getUserAccessSubject({ login_id: this.currentUser.login_id, class_id: this.ind_entry_form1.value.qus_class_id }).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.subjectArray = result.data;
				} else {
					this.subjectArray = [];
					this.notif.showSuccessErrorMessage('No Record Found', 'error');
				}
			});
		} else {
			this.qelementService.getSubjectsByClass(this.ind_entry_form1.value.qus_class_id).subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.subjectArray = result.data;
					} else {
						this.subjectArray = [];
						this.notif.showSuccessErrorMessage('No Record Found', 'error');
					}
				}
			);
		}
		this.ind_entry_form1.patchValue({
			'qus_topic_id': '',
			'qus_st_id': '',
			'qus_sub_id': ''
		});
	}

	getTopicByClassSubject(): void {
		if (this.currentUser.role_id === '1') {
			// tslint:disable-next-line:max-line-length
			this.adminService.getUserAccessTopic({ login_id: this.currentUser.login_id, class_id: this.ind_entry_form1.value.qus_class_id, sub_id: this.ind_entry_form1.value.qus_sub_id }).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.topicArray = result.data;
				} else {
					this.topicArray = [];
				}
			});
		} else {
			this.qelementService.getTopicByClassSubject(this.ind_entry_form1.value.qus_class_id, this.ind_entry_form1.value.qus_sub_id).subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.topicArray = result.data;
					} else {
						this.notif.showSuccessErrorMessage('No Record Found', 'error');
						this.topicArray = [];
						this.subtopicArray = [];
					}
				}
			);
		}
		this.ind_entry_form1.patchValue({
			'qus_topic_id': '',
			'qus_st_id': ''
		});
	}

	getSubtopicByTopic(): void {
		this.subtopicArray = [];
		this.qelementService.getSubtopicByTopic(this.ind_entry_form1.value.qus_topic_id).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.subtopicArray = result.data;
				} else {
					this.notif.showSuccessErrorMessage('No Record Found', 'error');
					this.subtopicArray = [];
				}
				this.ind_entry_form1.patchValue({
					'qus_st_id': ''
				});
			}
		);
	}

	getQuestionTypeData(): void {
		this.commonAPIService.getQtype().subscribe(
			(result: any) => {
				if (result) {
					this.questionTypeArray = result;
				} else {
					this.notif.showSuccessErrorMessage('No Record Found', 'error');
				}
			}
		);
	}

	showQuesDetail() {
		this.addQuestionDetail = true;
	}

	getQuestionSubtypeDataByQuestiontype(): void {
		this.commonAPIService.getQsubtype(this.ind_entry_form2.value.qus_qt_id).subscribe(
			(result: any) => {
				if (result) {
					this.questionSubtypeArray = result;

				} else {
					this.notif.showSuccessErrorMessage('No Record Found', 'error');
				}
			}
		);
	}

	getSkillData(): void {
		this.qelementService.getSkillData().subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.skillTypeArray = result.data;
				} else {
					this.notif.showSuccessErrorMessage('No Record Found', 'error');
				}
			}
		);
	}

	getLodData(): void {
		this.qelementService.getLodData().subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.lodArray = result.data;
				} else {
					this.notif.showSuccessErrorMessage('No Record Found', 'error');
				}
			}
		);
	}

	loadQsubtype(qtypeval: number): void {
		this.qtypeTemplate = qtypeval;
	}
	selectEssay() {
		if (this.ind_entry_form1.valid) {
			this.essayDialogRef = this.dialog.open(EssayDialogsComponent, {
				height: '600px',
				width: '1000px',
				data: {
					essayDiv: 'list',
					ess_class_id: this.ind_entry_form1.controls.qus_class_id.value,
					ess_sub_id: this.ind_entry_form1.controls.qus_sub_id.value,
					ess_topic_id: this.ind_entry_form1.controls.qus_topic_id.value,
					ess_st_id: this.ind_entry_form1.controls.qus_st_id.value
				}
			});
			this.essayDialogRef.afterClosed().subscribe(result => {
				this.ind_entry_form2.patchValue({
					'qus_ess_id': result.ess_id
				});
				this.qelementService.getEssay({ ess_id: result.ess_id }).subscribe(
					(result1: any) => {
						if (result1) {
							this.essayPara = result1.data[0];
						}
					}
				);
			});
		}
	}
	/* Implementing add question functionality */
	insertQuestion(): void {
		if (Number(this.qtypeTemplate) === 1) {
			const options: any[] = [];
			const answer: any[] = [];
			let optionsLength = 0;

			if (this.mcqComponent.ind_entry_form3.value.qopt_options0) {
				options[0] = { 'qopt_options': this.mcqComponent.ind_entry_form3.value.qopt_options0 };
				optionsLength++;
			}
			if (this.mcqComponent.ind_entry_form3.value.qopt_options1) {
				options[1] = { 'qopt_options': this.mcqComponent.ind_entry_form3.value.qopt_options1 };
				optionsLength++;
			}
			if (this.mcqComponent.ind_entry_form3.value.qopt_options2) {
				options[2] = { 'qopt_options': this.mcqComponent.ind_entry_form3.value.qopt_options2 };
				optionsLength++;
			}
			if (this.mcqComponent.ind_entry_form3.value.qopt_options3) {
				options[3] = { 'qopt_options': this.mcqComponent.ind_entry_form3.value.qopt_options3 };
				optionsLength++;
			}
			this.mcqComponent.ind_entry_form3.controls.options.setValue(options);

			for (let i = 0; i < optionsLength; i++) {
				if (i === Number(this.mcqComponent.ind_entry_form3.value.qopt_answer)) {
					answer[i] = { 'qopt_answer': '1' };
				} else {
					answer[i] = { 'qopt_answer': '0' };
				}
			}
			this.mcqComponent.ind_entry_form3.controls.answer.setValue(answer);
			this.ind_entry_form3 = this.mcqComponent.ind_entry_form3;
		} else if (Number(this.qtypeTemplate) === 2) {
			const options: any[] = [];
			const answer: any[] = [];
			if (this.mcqmrComponent.ind_entry_form3.value.qopt_options0) {
				options[0] = { 'qopt_options': this.mcqmrComponent.ind_entry_form3.value.qopt_options0 };
				answer[0] = { 'qopt_answer': this.mcqmrComponent.ind_entry_form3.value.qopt_answer0 === true ? 1 : 0 };
			}
			if (this.mcqmrComponent.ind_entry_form3.value.qopt_options1) {
				options[1] = { 'qopt_options': this.mcqmrComponent.ind_entry_form3.value.qopt_options1 };
				answer[1] = { 'qopt_answer': this.mcqmrComponent.ind_entry_form3.value.qopt_answer1 === true ? 1 : 0 };
			}
			if (this.mcqmrComponent.ind_entry_form3.value.qopt_options2) {
				options[2] = { 'qopt_options': this.mcqmrComponent.ind_entry_form3.value.qopt_options2 };
				answer[2] = { 'qopt_answer': this.mcqmrComponent.ind_entry_form3.value.qopt_answer2 === true ? 1 : 0 };
			}
			if (this.mcqmrComponent.ind_entry_form3.value.qopt_options3) {
				options[3] = { 'qopt_options': this.mcqmrComponent.ind_entry_form3.value.qopt_options3 };
				answer[3] = { 'qopt_answer': this.mcqmrComponent.ind_entry_form3.value.qopt_answer3 === true ? 1 : 0 };
			}
			/* if (this.mcqmrComponent.ind_entry_form3.value.qopt_options4){
        options[4]={'qopt_options':this.mcqmrComponent.ind_entry_form3.value.qopt_options4};
        answer[4]={'qopt_answer':this.mcqmrComponent.ind_entry_form3.value.qopt_answer4 === true?1:0}
      }*/

			this.mcqmrComponent.ind_entry_form3.controls.options.setValue(options);
			this.mcqmrComponent.ind_entry_form3.controls.answer.setValue(answer);
			this.ind_entry_form3 = this.mcqmrComponent.ind_entry_form3;
		} else if (Number(this.qtypeTemplate) === 3) {
			const options: any[] = [];
			const answer: any[] = [];
			options[0] = { 'qopt_options': 'True' };
			options[1] = { 'qopt_options': 'False' };

			for (let i = 0; i < 2; i++) {
				if (i === Number(this.tfComponent.ind_entry_form3.value.qopt_answer)) {
					answer[i] = { 'qopt_answer': '1' };
				} else {
					answer[i] = { 'qopt_answer': '0' };
				}

			}
			this.tfComponent.ind_entry_form3.controls.options.setValue(options);
			this.tfComponent.ind_entry_form3.controls.answer.setValue(answer);
			this.ind_entry_form3 = this.tfComponent.ind_entry_form3;
		} else if (Number(this.qtypeTemplate) === 4) {
			const options: any[] = [];
			const options_match: any[] = [];
			const answer: any[] = [];
			options[0] = { 'qopt_options': this.mtfComponent.ind_entry_form3.value.optiona };
			options[1] = { 'qopt_options': this.mtfComponent.ind_entry_form3.value.optionb };
			options[2] = { 'qopt_options': this.mtfComponent.ind_entry_form3.value.optionc };
			options[3] = { 'qopt_options': this.mtfComponent.ind_entry_form3.value.optiond };
			options_match[0] = { 'qopt_options_match': this.mtfComponent.ind_entry_form3.value.optionp };
			options_match[1] = { 'qopt_options_match': this.mtfComponent.ind_entry_form3.value.optionq };
			options_match[2] = { 'qopt_options_match': this.mtfComponent.ind_entry_form3.value.optionr };
			options_match[3] = { 'qopt_options_match': this.mtfComponent.ind_entry_form3.value.optiont };
			answer[0] = { 'qopt_answer': this.mtfComponent.ind_entry_form3.value.apqrs1 };
			answer[1] = { 'qopt_answer': this.mtfComponent.ind_entry_form3.value.bpqrs1 };
			answer[2] = { 'qopt_answer': this.mtfComponent.ind_entry_form3.value.cpqrs1 };
			answer[3] = { 'qopt_answer': this.mtfComponent.ind_entry_form3.value.dpqrs1 };
			this.uniqueEntries = this.checkDuplicateEntries(options, 'qopt_options');
			if (this.uniqueEntries) {
				this.mtfComponent.ind_entry_form3.controls.options.setValue(options, );
				this.uniqueEntries = this.checkDuplicateEntries(options_match, 'qopt_options_match');
				if (this.uniqueEntries) {
					this.mtfComponent.ind_entry_form3.controls.options_match.setValue(options_match);
				} else {
					this.notif.showSuccessErrorMessage('Duplicate entries in oprions match', 'error');
				}
			} else {
				this.notif.showSuccessErrorMessage('Duplicate entries in oprions', 'error');
			}
			this.mtfComponent.ind_entry_form3.controls.answer.setValue(answer);
			this.ind_entry_form3 = this.mtfComponent.ind_entry_form3;
		} else if (Number(this.qtypeTemplate) === 5) {
			const options: any[] = [];
			const options_match: any[] = [];
			const answer: any[] = [];
			// Displaying options
			options[0] = { 'qopt_options': this.matrixComponent.ind_entry_form3.value.optiona };
			options[1] = { 'qopt_options': this.matrixComponent.ind_entry_form3.value.optionb };
			options[2] = { 'qopt_options': this.matrixComponent.ind_entry_form3.value.optionc };
			options[3] = { 'qopt_options': this.matrixComponent.ind_entry_form3.value.optiond };
			// Checking if the options match
			options_match[0] = { 'qopt_options_match': this.matrixComponent.ind_entry_form3.value.optionp };
			options_match[1] = { 'qopt_options_match': this.matrixComponent.ind_entry_form3.value.optionq };
			options_match[2] = { 'qopt_options_match': this.matrixComponent.ind_entry_form3.value.optionr };
			options_match[3] = { 'qopt_options_match': this.matrixComponent.ind_entry_form3.value.optiont };
			// Fetching the correct answer
			answer[0] = { 'qopt_answer': this.matrixComponent.ind_entry_form3.value.apqrs1 };
			answer[1] = { 'qopt_answer': this.matrixComponent.ind_entry_form3.value.apqrs2 };
			answer[2] = { 'qopt_answer': this.matrixComponent.ind_entry_form3.value.apqrs3 };
			answer[3] = { 'qopt_answer': this.matrixComponent.ind_entry_form3.value.apqrs4 };
			answer[4] = { 'qopt_answer': this.matrixComponent.ind_entry_form3.value.bpqrs1 };
			answer[5] = { 'qopt_answer': this.matrixComponent.ind_entry_form3.value.bpqrs2 };
			answer[6] = { 'qopt_answer': this.matrixComponent.ind_entry_form3.value.bpqrs3 };
			answer[7] = { 'qopt_answer': this.matrixComponent.ind_entry_form3.value.bpqrs4 };
			answer[8] = { 'qopt_answer': this.matrixComponent.ind_entry_form3.value.cpqrs1 };
			answer[9] = { 'qopt_answer': this.matrixComponent.ind_entry_form3.value.cpqrs2 };
			answer[10] = { 'qopt_answer': this.matrixComponent.ind_entry_form3.value.cpqrs3 };
			answer[11] = { 'qopt_answer': this.matrixComponent.ind_entry_form3.value.cpqrs4 };
			answer[12] = { 'qopt_answer': this.matrixComponent.ind_entry_form3.value.dpqrs1 };
			answer[13] = { 'qopt_answer': this.matrixComponent.ind_entry_form3.value.dpqrs2 };
			answer[14] = { 'qopt_answer': this.matrixComponent.ind_entry_form3.value.dpqrs3 };
			answer[15] = { 'qopt_answer': this.matrixComponent.ind_entry_form3.value.dpqrs4 };
			this.uniqueEntries = this.checkDuplicateEntries(options, 'qopt_options');
			if (this.uniqueEntries) {
				this.matrixComponent.ind_entry_form3.controls.options.setValue(options);
				this.uniqueEntries = this.checkDuplicateEntries(options_match, 'qopt_options_match');
				if (this.uniqueEntries) {
					this.matrixComponent.ind_entry_form3.controls.options_match.setValue(options_match);
				} else {
					this.notif.showSuccessErrorMessage('Duplicate entries in oprions match', 'error');
				}
			} else {
				this.notif.showSuccessErrorMessage('Duplicate entries in oprions', 'error');
			}
			this.matrixComponent.ind_entry_form3.controls.answer.setValue(answer);
			this.ind_entry_form3 = this.matrixComponent.ind_entry_form3;
		} else if (Number(this.qtypeTemplate) === 13) {
			const options: any[] = [];
			const options_match: any[] = [];
			const answer: any[] = [];
			// Displaying options
			options[0] = { 'qopt_options': this.matrix45component.ind_entry_form3.value.optiona };
			options[1] = { 'qopt_options': this.matrix45component.ind_entry_form3.value.optionb };
			options[2] = { 'qopt_options': this.matrix45component.ind_entry_form3.value.optionc };
			options[3] = { 'qopt_options': this.matrix45component.ind_entry_form3.value.optiond };
			// Checking if the options match
			options_match[0] = { 'qopt_options_match': this.matrix45component.ind_entry_form3.value.optionp };
			options_match[1] = { 'qopt_options_match': this.matrix45component.ind_entry_form3.value.optionq };
			options_match[2] = { 'qopt_options_match': this.matrix45component.ind_entry_form3.value.optionr };
			options_match[3] = { 'qopt_options_match': this.matrix45component.ind_entry_form3.value.optiont };
			options_match[4] = { 'qopt_options_match': this.matrix45component.ind_entry_form3.value.optionu };
			// Fetching the correct answer
			answer[0] = { 'qopt_answer': this.matrix45component.ind_entry_form3.value.apqrst1 };
			answer[1] = { 'qopt_answer': this.matrix45component.ind_entry_form3.value.apqrst2 };
			answer[2] = { 'qopt_answer': this.matrix45component.ind_entry_form3.value.apqrst3 };
			answer[3] = { 'qopt_answer': this.matrix45component.ind_entry_form3.value.apqrst4 };
			answer[4] = { 'qopt_answer': this.matrix45component.ind_entry_form3.value.apqrst5 };
			answer[5] = { 'qopt_answer': this.matrix45component.ind_entry_form3.value.bpqrst1 };
			answer[6] = { 'qopt_answer': this.matrix45component.ind_entry_form3.value.bpqrst2 };
			answer[7] = { 'qopt_answer': this.matrix45component.ind_entry_form3.value.bpqrst3 };
			answer[8] = { 'qopt_answer': this.matrix45component.ind_entry_form3.value.bpqrst4 };
			answer[9] = { 'qopt_answer': this.matrix45component.ind_entry_form3.value.bpqrst5 };
			answer[10] = { 'qopt_answer': this.matrix45component.ind_entry_form3.value.cpqrst1 };
			answer[11] = { 'qopt_answer': this.matrix45component.ind_entry_form3.value.cpqrst2 };
			answer[12] = { 'qopt_answer': this.matrix45component.ind_entry_form3.value.cpqrst3 };
			answer[13] = { 'qopt_answer': this.matrix45component.ind_entry_form3.value.cpqrst4 };
			answer[14] = { 'qopt_answer': this.matrix45component.ind_entry_form3.value.cpqrst5 };
			answer[15] = { 'qopt_answer': this.matrix45component.ind_entry_form3.value.dpqrst1 };
			answer[16] = { 'qopt_answer': this.matrix45component.ind_entry_form3.value.dpqrst2 };
			answer[17] = { 'qopt_answer': this.matrix45component.ind_entry_form3.value.dpqrst3 };
			answer[18] = { 'qopt_answer': this.matrix45component.ind_entry_form3.value.dpqrst4 };
			answer[19] = { 'qopt_answer': this.matrix45component.ind_entry_form3.value.dpqrst5 };
			this.uniqueEntries = this.checkDuplicateEntries(options, 'qopt_options');
			if (this.uniqueEntries) {
				this.matrix45component.ind_entry_form3.controls.options.setValue(options);
				this.uniqueEntries = this.checkDuplicateEntries(options_match, 'qopt_options_match');
				if (this.uniqueEntries) {
					this.matrix45component.ind_entry_form3.controls.options_match.setValue(options_match);
				} else {
					this.notif.showSuccessErrorMessage('Duplicate entries in oprions match', 'error');
				}
			} else {
				this.notif.showSuccessErrorMessage('Duplicate entries in oprions', 'error');
			}
			this.matrix45component.ind_entry_form3.controls.answer.setValue(answer);
			this.ind_entry_form3 = this.matrix45component.ind_entry_form3;
		} else if (Number(this.qtypeTemplate) === 14) {
			let answer: any;
			if (this.singleintegercomponent.ind_entry_form3.value.qopt_answer) {
				answer = { 'qopt_answer': this.singleintegercomponent.ind_entry_form3.value.qopt_answer };
			}
			this.singleintegercomponent.ind_entry_form3.controls.answer.setValue(answer);
			this.ind_entry_form3 = this.singleintegercomponent.ind_entry_form3;
		} else if (Number(this.qtypeTemplate) === 15) {
			let answer: any;
			if (this.doubleintegercomponent.ind_entry_form3.value.qopt_answer1 && this.doubleintegercomponent.ind_entry_form3.value.qopt_answer2) {
				// tslint:disable-next-line:max-line-length
				answer = { 'qopt_answer': (this.doubleintegercomponent.ind_entry_form3.value.qopt_answer1) + (this.doubleintegercomponent.ind_entry_form3.value.qopt_answer2) };
			}
			this.doubleintegercomponent.ind_entry_form3.controls.answer.setValue(answer);
			this.ind_entry_form3 = this.doubleintegercomponent.ind_entry_form3;
		} else if (Number(this.qtypeTemplate) === 6) {
			let answer: any;
			if (this.fillintheblanksComponent.ind_entry_form3.value.qopt_answer) {
				answer = { 'qopt_answer': this.fillintheblanksComponent.ind_entry_form3.value.qopt_answer };
			}
			this.fillintheblanksComponent.ind_entry_form3.controls.answer.setValue(answer);
			this.ind_entry_form3 = this.fillintheblanksComponent.ind_entry_form3;
		} else if (Number(this.qtypeTemplate) === 7) {
			let answer: any;
			if (this.identifyComponent.ind_entry_form3.value.qopt_answer) {
				answer = { 'qopt_answer': this.identifyComponent.ind_entry_form3.value.qopt_answer };
			}
			this.identifyComponent.ind_entry_form3.controls.answer.setValue(answer);
			this.ind_entry_form3 = this.identifyComponent.ind_entry_form3;
		} else if (Number(this.qtypeTemplate) === 8) {
			let answer: any;
			if (this.onelineComponent.ind_entry_form3.value.qopt_answer) {
				answer = { 'qopt_answer': this.onelineComponent.ind_entry_form3.value.qopt_answer };
			}
			this.onelineComponent.ind_entry_form3.controls.answer.setValue(answer);
			this.ind_entry_form3 = this.onelineComponent.ind_entry_form3;
		} else if (Number(this.qtypeTemplate) === 9) {
			let answer: any;
			if (this.veryshortanswerComponent.ind_entry_form3.value.qopt_answer) {
				answer = { 'qopt_answer': this.veryshortanswerComponent.ind_entry_form3.value.qopt_answer };
			}
			this.veryshortanswerComponent.ind_entry_form3.controls.answer.setValue(answer);
			this.ind_entry_form3 = this.veryshortanswerComponent.ind_entry_form3;
		} else if (Number(this.qtypeTemplate) === 10) {
			let answer: any;
			if (this.shortanswerComponent.ind_entry_form3.value.qopt_answer) {
				answer = { 'qopt_answer': this.shortanswerComponent.ind_entry_form3.value.qopt_answer };
			}
			this.shortanswerComponent.ind_entry_form3.controls.answer.setValue(answer);
			this.ind_entry_form3 = this.shortanswerComponent.ind_entry_form3;
		} else if (Number(this.qtypeTemplate) === 11) {
			let answer: any;
			if (this.longanswerComponent.ind_entry_form3.value.qopt_answer) {
				answer = { 'qopt_answer': this.longanswerComponent.ind_entry_form3.value.qopt_answer };
			}
			this.longanswerComponent.ind_entry_form3.controls.answer.setValue(answer);
			this.ind_entry_form3 = this.longanswerComponent.ind_entry_form3;
		} else if (Number(this.qtypeTemplate) === 12) {
			let answer: any;
			if (this.verylonganswerComponent.ind_entry_form3.value.qopt_answer) {
				answer = { 'qopt_answer': this.verylonganswerComponent.ind_entry_form3.value.qopt_answer };
			}
			this.verylonganswerComponent.ind_entry_form3.controls.answer.setValue(answer);
			this.ind_entry_form3 = this.verylonganswerComponent.ind_entry_form3;
		}

		const resultobj = {};
		const jsonobj1 = JSON.parse(JSON.stringify(this.ind_entry_form1.value));
		const jsonobj2 = JSON.parse(JSON.stringify(this.ind_entry_form2.value));
		const jsonobj3 = JSON.parse(JSON.stringify(this.ind_entry_form3.value));
		// tslint:disable-next-line:forin
		for (const key in jsonobj1) {
			resultobj[key] = jsonobj1[key];
		}
		// tslint:disable-next-line:forin
		for (const key in jsonobj2) {
			resultobj[key] = jsonobj2[key];
		}
		// tslint:disable-next-line:forin
		for (const key in jsonobj3) {
			resultobj[key] = jsonobj3[key];
		}
		if (Number(this.currentUser.role_id) === 1) {
			resultobj['qus_status'] = '2';
		} else {
			resultobj['qus_status'] = '0';
		}

		if (!this.ind_entry_form2.valid) {
			this.notif.showSuccessErrorMessage('Please fill the requisite question and answer fields', 'error');
		} else if (!this.ind_entry_form3.valid) {
			this.notif.showSuccessErrorMessage('Please fill the requisite question and answer fields', 'error');
		}
		/*Adding Form Validation for Form 2*/
		if (!this.ind_entry_form2.value.qus_qt_id) {
			this.notif.showSuccessErrorMessage('Question type is required', 'error');
		}
		if (!this.ind_entry_form2.value.qus_qst_id) {
			this.notif.showSuccessErrorMessage('Question sub-type is required', 'error');
		}
		if (!this.ind_entry_form2.value.qus_skill_id) {
			this.notif.showSuccessErrorMessage('Skill type is required', 'error');
		}
		if (!this.ind_entry_form2.value.qus_dl_id) {
			this.notif.showSuccessErrorMessage('Level of difficulty is required', 'error');
		}
		if (!this.ind_entry_form2.value.qus_marks) {
			this.notif.showSuccessErrorMessage('Marks is required', 'error');
		}
		/* Form Validation Ends */
		/* If all the forms are valid, insert the question into the database */
		if (Number(this.qtypeTemplate) === 5) {
			let row1: Boolean;
			let row2: Boolean;
			let row3: Boolean;
			let row4: Boolean;
			// tslint:disable-next-line:max-line-length
			row1 = this.matrixComponent.ind_entry_form3.value.apqrs1 || this.matrixComponent.ind_entry_form3.value.apqrs2 || this.matrixComponent.ind_entry_form3.value.apqrs3 || this.matrixComponent.ind_entry_form3.value.apqrs4;
			// tslint:disable-next-line:max-line-length
			row2 = this.matrixComponent.ind_entry_form3.value.bpqrs1 || this.matrixComponent.ind_entry_form3.value.bpqrs2 || this.matrixComponent.ind_entry_form3.value.bpqrs3 || this.matrixComponent.ind_entry_form3.value.bpqrs4;
			// tslint:disable-next-line:max-line-length
			row3 = this.matrixComponent.ind_entry_form3.value.cpqrs1 || this.matrixComponent.ind_entry_form3.value.cpqrs2 || this.matrixComponent.ind_entry_form3.value.cpqrs3 || this.matrixComponent.ind_entry_form3.value.cpqrs4;
			// tslint:disable-next-line:max-line-length
			row4 = this.matrixComponent.ind_entry_form3.value.dpqrs1 || this.matrixComponent.ind_entry_form3.value.dpqrs2 || this.matrixComponent.ind_entry_form3.value.dpqrs3 || this.matrixComponent.ind_entry_form3.value.dpqrs4;

			if (Number(this.qtypeTemplate) === 5) {
				if (!row1) {
					this.notif.showSuccessErrorMessage('Please Mark Answer in row 1', 'error');
				}

				if (!row2) {
					this.notif.showSuccessErrorMessage('Please Mark Answer in row 2', 'error');
				}

				if (!row3) {
					this.notif.showSuccessErrorMessage('Please Mark Answer in row 3', 'error');
				}

				if (!row4) {
					this.notif.showSuccessErrorMessage('Please Mark Answer in row 4', 'error');
				}
			}
			// tslint:disable-next-line:max-line-length
			if (this.uniqueEntries && this.ind_entry_form1.valid && this.ind_entry_form2.valid && this.ind_entry_form3.valid && (row1 && row2 && row3 && row4)) {
				this.qbankService.insertQuestion(resultobj)
					.subscribe(
					(result: any) => {
						if (result && result.status === 'ok') {
							this.notif.showSuccessErrorMessage('Question added successfully', 'success');
							this.ind_entry_form3.reset();
						} else {
							this.notif.showSuccessErrorMessage('Error to insert to database', 'error');
						}
					}
					);
			}
		} else if (Number(this.qtypeTemplate) === 13) {
			let row1: Boolean;
			let row2: Boolean;
			let row3: Boolean;
			let row4: Boolean;
			// tslint:disable-next-line:max-line-length
			row1 = this.matrix45component.ind_entry_form3.value.apqrst1 || this.matrix45component.ind_entry_form3.value.apqrst2 || this.matrix45component.ind_entry_form3.value.apqrst3 || this.matrix45component.ind_entry_form3.value.apqrst4 || this.matrix45component.ind_entry_form3.value.apqrst5;
			// tslint:disable-next-line:max-line-length
			row2 = this.matrix45component.ind_entry_form3.value.bpqrst1 || this.matrix45component.ind_entry_form3.value.bpqrst2 || this.matrix45component.ind_entry_form3.value.bpqrst3 || this.matrix45component.ind_entry_form3.value.bpqrst4 || this.matrix45component.ind_entry_form3.value.bpqrst5;
			// tslint:disable-next-line:max-line-length
			row3 = this.matrix45component.ind_entry_form3.value.cpqrst1 || this.matrix45component.ind_entry_form3.value.cpqrst2 || this.matrix45component.ind_entry_form3.value.cpqrst3 || this.matrix45component.ind_entry_form3.value.cpqrst4 || this.matrix45component.ind_entry_form3.value.cpqrst5;
			// tslint:disable-next-line:max-line-length
			row4 = this.matrix45component.ind_entry_form3.value.dpqrst1 || this.matrix45component.ind_entry_form3.value.dpqrst2 || this.matrix45component.ind_entry_form3.value.dpqrst3 || this.matrix45component.ind_entry_form3.value.dpqrst4 || this.matrix45component.ind_entry_form3.value.dpqrst5;

			if (Number(this.qtypeTemplate) === 13) {
				if (!row1) {
					this.notif.showSuccessErrorMessage('Please Mark Answer in row 1', 'error');
				}

				if (!row2) {
					this.notif.showSuccessErrorMessage('Please Mark Answer in row 2', 'error');
				}

				if (!row3) {
					this.notif.showSuccessErrorMessage('Please Mark Answer in row 3', 'error');
				}

				if (!row4) {
					this.notif.showSuccessErrorMessage('Please Mark Answer in row 4', 'error');
				}
			}
			// tslint:disable-next-line:max-line-length
			if (this.uniqueEntries && this.ind_entry_form1.valid && this.ind_entry_form2.valid && this.ind_entry_form3.valid && (row1 && row2 && row3 && row4)) {
				this.qbankService.insertQuestion(resultobj)
					.subscribe(
					(result: any) => {
						if (result && result.status === 'ok') {
							this.notif.showSuccessErrorMessage('Question added successfully', 'success');
							this.ind_entry_form3.reset();
						} else {
							this.notif.showSuccessErrorMessage('Error to insert to database.', 'error');
						}
					}
					);
			}
		} else if (Number(this.qtypeTemplate) === 14) {

			let check: Boolean;
			check = this.ind_entry_form3.value.qopt_answer;

			if (Number(this.qtypeTemplate) === 14) {
				if (!check) {
					this.notif.showSuccessErrorMessage('Please mark atleast one option', 'error');
				}
			}


			if (this.ind_entry_form1.valid && this.ind_entry_form2.valid && this.ind_entry_form3.valid && check) {
				this.qbankService.insertQuestion(resultobj)
					.subscribe(
					(result: any) => {
						if (result && result.status === 'ok') {
							this.notif.showSuccessErrorMessage('Question added successfully', 'success');
							console.log(JSON.stringify(resultobj));
							this.ind_entry_form3.reset();
							this.singleintegercomponent.digitValue = '-';
						} else {
							this.notif.showSuccessErrorMessage('Error to insert to database.', 'error');
						}
					}
					);
			}
		} else if (Number(this.qtypeTemplate) === 15) {

			let check1: Boolean;
			let check2: Boolean;
			check1 = this.ind_entry_form3.value.qopt_answer1;
			check2 = this.ind_entry_form3.value.qopt_answer2;

			if (Number(this.qtypeTemplate) === 15) {
				if (!check1) {
					this.notif.showSuccessErrorMessage('Please select the first value', 'error');
				}
				if (!check2) {
					this.notif.showSuccessErrorMessage('Please select the second value', 'error');
				}
			}


			if (this.ind_entry_form1.valid && this.ind_entry_form2.valid && this.ind_entry_form3.valid && check1 && check2) {
				this.qbankService.insertQuestion(resultobj)
					.subscribe(
					(result: any) => {
						if (result && result.status === 'ok') {
							this.notif.showSuccessErrorMessage('Question added successfully', 'success');
							console.log(JSON.stringify(resultobj));
							this.ind_entry_form3.reset();
							this.doubleintegercomponent.upperRowValue = '-';
							this.doubleintegercomponent.lowerRowValue = '-';
						} else {
							this.notif.showSuccessErrorMessage('Error to insert to database.', 'error');
						}
					}
					);
			}
		} else if (Number(this.qtypeTemplate) === 4) {
			let row1: Boolean;
			let row2: Boolean;
			let row3: Boolean;
			let row4: Boolean;
			row1 = this.mtfComponent.ind_entry_form3.value.apqrs1;
			row2 = this.mtfComponent.ind_entry_form3.value.bpqrs1;
			row3 = this.mtfComponent.ind_entry_form3.value.cpqrs1;
			row4 = this.mtfComponent.ind_entry_form3.value.dpqrs1;

			if (Number(this.qtypeTemplate) === 4) {
				if (!row1) {
					this.notif.showSuccessErrorMessage('Please Mark Answer in row 1', 'error');
				}

				if (!row2) {
					this.notif.showSuccessErrorMessage('Please Mark Answer in row 2', 'error');
				}

				if (!row3) {
					this.notif.showSuccessErrorMessage('Please Mark Answer in row 3', 'error');
				}

				if (!row4) {
					this.notif.showSuccessErrorMessage('Please Mark Answer in row 4', 'error');
				}
			}
			// tslint:disable-next-line:max-line-length
			if (this.uniqueEntries && this.ind_entry_form1.valid && this.ind_entry_form2.valid && this.ind_entry_form3.valid && (row1 && row2 && row3 && row4)) {
				this.qbankService.insertQuestion(resultobj)
					.subscribe(
					(result: any) => {
						if (result && result.status === 'ok') {
							this.notif.showSuccessErrorMessage('Question added successfully', 'success');
							this.ind_entry_form3.reset();
						} else {
							this.notif.showSuccessErrorMessage('Error to insert to database.', 'error');
						}
					}
					);
			}
		} else if (Number(this.qtypeTemplate) === 2) {
			let row1: Boolean;
			let row2: Boolean;
			let row3: Boolean;
			let row4: Boolean;
			let check: Boolean;
			row1 = this.mcqmrComponent.ind_entry_form3.value.qopt_answer0;
			row2 = this.mcqmrComponent.ind_entry_form3.value.qopt_answer1;
			row3 = this.mcqmrComponent.ind_entry_form3.value.qopt_answer2;
			row4 = this.mcqmrComponent.ind_entry_form3.value.qopt_answer3;
			check = row1 || row2 || row3 || row4;

			if (Number(this.qtypeTemplate) === 2) {
				if (!check) {
					this.notif.showSuccessErrorMessage('Please mark atleast one option', 'error');
				}
			}


			if (this.ind_entry_form1.valid && this.ind_entry_form2.valid && this.ind_entry_form3.valid && check) {
				this.qbankService.insertQuestion(resultobj)
					.subscribe(
					(result: any) => {
						if (result && result.status === 'ok') {
							this.notif.showSuccessErrorMessage('Question added successfully', 'success');
							this.ind_entry_form3.reset();
						} else {
							this.notif.showSuccessErrorMessage('Error to insert to database.', 'error');
						}
					}
					);
			}
		} else if (Number(this.qtypeTemplate) === 1) {

			let check: Boolean;
			check = this.ind_entry_form3.value.qopt_answer;

			if (Number(this.qtypeTemplate) === 1) {
				if (!check) {
					this.notif.showSuccessErrorMessage('Please mark atleast one option', 'error');
				}
			}


			if (this.ind_entry_form1.valid && this.ind_entry_form2.valid && this.ind_entry_form3.valid && check) {
				this.qbankService.insertQuestion(resultobj)
					.subscribe(
					(result: any) => {
						if (result && result.status === 'ok') {
							this.notif.showSuccessErrorMessage('Question added successfully', 'success');
							this.ind_entry_form3.reset();
						} else {
							this.notif.showSuccessErrorMessage('Error to insert to database.', 'error');
						}
					}
					);
			}
		} else if (Number(this.qtypeTemplate) === 3) {

			let check: Boolean;
			check = this.ind_entry_form3.value.qopt_answer;

			if (Number(this.qtypeTemplate) === 3) {
				if (!check) {
					this.notif.showSuccessErrorMessage('Please mark atleast one option', 'error');
				}
			}


			if (this.ind_entry_form1.valid && this.ind_entry_form2.valid && this.ind_entry_form3.valid && check) {
				this.qbankService.insertQuestion(resultobj)
					.subscribe(
					(result: any) => {
						if (result && result.status === 'ok') {
							this.notif.showSuccessErrorMessage('Question added successfully', 'success');
							this.ind_entry_form3.reset();
						} else {
							this.notif.showSuccessErrorMessage('Error to insert to database.', 'error');
						}
					}
					);
			}
		} else {
			if (this.ind_entry_form1.valid && this.ind_entry_form2.valid && this.ind_entry_form3.valid) {
				this.qbankService.insertQuestion(resultobj)
					.subscribe(
					(result: any) => {
						if (result && result.status === 'ok') {

							this.notif.showSuccessErrorMessage('Question added successfully', 'success');
							this.ind_entry_form3.reset();
						} else {
							this.notif.showSuccessErrorMessage('Error to insert to database.', 'error');
						}
					}
					);
			}
		}
	}


	getEssayDialog() {
		if (this.ind_entry_form2.value.qus_qt_id === '3') {
			// this.selectEssay();
			this.essayButtonTitle = true;
		} else {
			this.essayButtonTitle = false;
		}
	}

	hideQuesDetail() {
		this.addQuestionDetail = false;
	}

	reset() {

		this.ind_entry_form1.reset();
		this.ind_entry_form2.reset();
		if (Number(this.qtypeTemplate) === 1) {
			this.mcqComponent.ind_entry_form3.reset();
		}
		if (Number(this.qtypeTemplate) === 2) {
			this.mcqmrComponent.ind_entry_form3.reset();
		}
		if (Number(this.qtypeTemplate) === 3) {
			this.tfComponent.ind_entry_form3.reset();
		}
		if (Number(this.qtypeTemplate) === 4) {
			this.mtfComponent.ind_entry_form3.reset();
		}
		if (Number(this.qtypeTemplate) === 5) {
			this.matrixComponent.ind_entry_form3.reset();
		}
		if (Number(this.qtypeTemplate) === 6) {
			this.fillintheblanksComponent.ind_entry_form3.reset();
		}
		if (Number(this.qtypeTemplate) === 7) {
			this.identifyComponent.ind_entry_form3.reset();
		}
		if (Number(this.qtypeTemplate) === 8) {
			this.onelineComponent.ind_entry_form3.reset();
		}
		if (Number(this.qtypeTemplate) === 9) {
			this.veryshortanswerComponent.ind_entry_form3.reset();
		}
		if (Number(this.qtypeTemplate) === 10) {
			this.shortanswerComponent.ind_entry_form3.reset();
		}
		if (Number(this.qtypeTemplate) === 11) {
			this.longanswerComponent.ind_entry_form3.reset();
		}
		if (Number(this.qtypeTemplate) === 12) {
			this.verylonganswerComponent.ind_entry_form3.reset();
		}
		if (Number(this.qtypeTemplate) === 13) {
			this.matrix45component.ind_entry_form3.reset();
		}
		if (Number(this.qtypeTemplate) === 14) {
			this.singleintegercomponent.ind_entry_form3.reset();
		}
		if (Number(this.qtypeTemplate) === 15) {
			this.doubleintegercomponent.ind_entry_form3.reset();
		}

	}
}
