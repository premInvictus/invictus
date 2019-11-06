import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { QbankService } from '../../questionbank/service/qbank.service';
import { QelementService } from '../../questionbank/service/qelement.service';
import { MatPaginator, MatTableDataSource, MatSort, MatDialogRef, MatDialog } from '@angular/material';
import { NotificationService, BreadCrumbService, CommonAPIService } from '../../_services/index';
import { AddInstructionComponent } from '../../shared-module/add-instruction/add-instruction.component';

@Component({
	selector: 'app-specifictemplate',
	templateUrl: './specifictemplate.component.html',
	styleUrls: ['./specifictemplate.component.css']
})
export class SpecifictemplateComponent implements OnInit {

	templatesform1: FormGroup;
	templatesform2: FormGroup;
	instruction_form: FormGroup;
	rowActivecolor = false;
	rowActiveindex: number;
	qsubtypemarks = 0;
	tpmarks = 0;
	leftmarks = 0;
	templates: any[] = [];
	classArray: any[];
	sectionArray: any[];
	subjectArray: any[];
	topicArray: any[];
	subtopicArray: any[];
	tpname: any;
	questionTypeArray: any[];
	questionSubtypeArray: any[];
	skillTypeArray: any[];
	lodArray: any[];
	templateArray: any[];
	editTemplateFlag = false;
	homeUrl: string;
	instructionArray: any[];
	editInstructionFlag = false;
	papertimeArray: any = [];
	papertimeMinlength = 1;
	papertimeMaxlength = 300;
	marksArray: any[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	papermarksArray: any[] = [];
	negativemarksArray: any[] = [-1, -2, -3, -4, -5];
	questionstypeArray: any[] = [];
	weightageArray: any[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 12, 13, 14, 15];
	startIndex = 1;
	insertQuestion: any;
	reset: any;
	title: any;

	TEMPLATE_ELEMENT_DATA: TempElement[] = [];

	templatedisplayedColumns = ['position', 'topic', 'subtopic', 'subtype', 'noofquestion', 'marks', 'lod', 'skill', 'action'];

	templatedataSource = new MatTableDataSource<TempElement>(this.TEMPLATE_ELEMENT_DATA);
	stitems: any;
	dialogRef: MatDialogRef<AddInstructionComponent>;

	constructor(
		private fbuild: FormBuilder,
		private qbankService: QbankService,
		private qelementService: QelementService,
		private commonAPIService: CommonAPIService,
		private route: ActivatedRoute,
		private notif: NotificationService,
		private breadCrumbService: BreadCrumbService,

		private dialog: MatDialog
	) { }

	ngOnInit() {
		this.homeUrl = this.breadCrumbService.getUrl();
		this.buildForm();
		this.getClass();
		this.getSkillData();
		this.getLodData();
		this.getInstruction();
		this.getQueryParams();

		for (let i = this.papertimeMinlength; i <= this.papertimeMaxlength; i++) {
			this.papertimeArray.push(i);
			this.questionstypeArray.push(i);
		}
		for (let i = this.papertimeMinlength; i <= 1000; i++) {
			this.papermarksArray.push(i);
		}
		for (let i = this.papertimeMinlength; i <= 100; i++) {
			this.weightageArray.push(i);
		}
	}
	addInstructionDialog(): void {
		this.dialogRef = this.dialog.open(AddInstructionComponent, {
			disableClose: true,
			width: '850px',
			data: {
				ti_id: '',
				ti_instruction: '',
				ti_tags: '',
				ti_description: '',
				tp_ti_id: ''


			}
		});
		this.dialogRef.afterClosed().subscribe(result => {
			let i = 0;
			for (const item of result) {
				if (i === 2) {
					this.templatesform1.patchValue(
						{
							'tp_ti_id': result[2].value.tp_ti_id


						}
					);

				} else if (i === 1) {
					this.instruction_form.patchValue(
						{
							'ti_id': result[1].value.ti_id

						}
					);
				}
				i++;

			}
		});




	}

	getQueryParams() {
		if (this.route.snapshot.queryParamMap.get('tp_id')) {
			const tp_id = this.route.snapshot.queryParamMap.get('tp_id');
			this.getTemplate(tp_id);
			this.title = 'Update Template';
			this.editTemplateFlag = true;
		} else {
			this.title = 'Create Template';
			this.editTemplateFlag = false;
		}
	}

	buildForm() {
		this.templatesform1 = this.fbuild.group({
			tp_id: '',
			tp_tt_id: '',
			tp_ti_id: '',
			tp_name: '',
			tp_class_id: '',
			tp_sub_id: '',
			tp_sec_id: '',
			tp_marks: '',
			tp_time_alloted: '',
			tp_exclusive: '',
			filters: []
		});
		this.templatesform2 = this.fbuild.group({
			tf_topic_id: '',
			topic_name: '',
			tf_st_id: '',
			st_name: '',
			tf_qt_id: '',
			tf_qst_id: '',
			qst_name: '',
			tf_skill_id: '',
			tf_dl_id: '1',
			tf_qcount: '',
			tf_weightage: '',
			tf_negative_marks: '',
			tf_status: ''
		});
		this.instruction_form = this.fbuild.group({
			ti_id: '',
			ti_instruction: '',
			ti_tags: '',
			ti_description: ''
		});
	}

	getTemplate(tp_id) {
		const tp_tt_id = 1;
		const tp_status = 0;
		this.qelementService.getTemplate({ tp_id: tp_id, tp_tt_id: tp_tt_id, tp_status: tp_status }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.templateArray = result.data;
					let i = 0;
					for (const item of this.templateArray) {
						if (item.tp_id === tp_id) {
							break;
						} else {
							i++;
						}
					}
					this.templatesform1.patchValue({
						'tp_id': this.templateArray[i].tp_id,
						'tp_name': this.templateArray[i].tp_name,
						'tp_tt_id': this.templateArray[i].tp_tt_id,
						'tp_ti_id': this.templateArray[i].tp_ti_id,
						'tp_class_id': this.templateArray[i].tp_class_id,
						'tp_sub_id': this.templateArray[i].tp_sub_id,
						'tp_sec_id': this.templateArray[i].tp_sec_id,
						'tp_marks': Number(this.templateArray[i].tp_marks),
						'tp_time_alloted': Number(this.templateArray[i].tp_time_alloted),
						'tp_exclusive': this.templateArray[i].tp_exclusive === '1' ? true : false
					});
					this.getSectionsByClass();
					this.getSubjectsByClass();
					this.getTopicByClassSubject();
					this.getSubtopicByTopic();
					this.templates = this.templateArray[0].filters;
					this.leftmarks = 0;
					this.tpmarks = this.templateArray[0].tp_marks;
					this.qsubtypemarks = this.templateArray[0].tp_marks;
					// document.getElementById('tp_marks').setAttribute('disabled', 'true');
				}
			}
		);
	}

	getClass() {
		this.qelementService.getClass().subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.classArray = result.data;
					this.getQuestionTypeData();
				}
			}
		);
	}

	getSubjectsByClass(): void {
		this.qelementService.getSubjectsByClass(this.templatesform1.value.tp_class_id).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.subjectArray = result.data;
				} else {
					this.subjectArray = [];
				}
			}
		);
	}

	getSectionsByClass(): void {
		this.qelementService.getSectionsByClass(this.templatesform1.value.tp_class_id).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.sectionArray = result.data;
				} else {
					this.sectionArray = [];
				}
			}
		);
	}

	getTopicByClassSubject(): void {
		console.log('1 this.templatesform1.value.tp_sub_id', this.templatesform1.value.tp_sub_id);
		this.qelementService.getTopicByClassSubject(this.templatesform1.value.tp_class_id, this.templatesform1.value.tp_sub_id).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.topicArray = result.data;
				} else {
					this.topicArray = [];
				}
				this.templatesform2.patchValue({
					'tf_topic_id': '',
					'tf_st_id': ''
				});
			}
		);
	}

	getSubtopicByTopic(): void {
		this.subtopicArray = [];
		this.qelementService.getSubtopicByTopic(this.templatesform2.value.tf_topic_id).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.subtopicArray = result.data;
				}
			}
		);
	}

	getQuestionTypeData(): void {
		this.commonAPIService.getQtype().subscribe(
			(result: any) => {
				if (result) {
					this.questionTypeArray = result;
				}
			}
		);
	}

	getQuestionSubtypeDataByQuestiontype(): void {
		this.commonAPIService.getQsubtype(this.templatesform2.value.tf_qt_id).subscribe(
			(result: any) => {
				if (result) {
					this.questionSubtypeArray = result;
				}
			}
		);
	}
	getSkillData(): void {
		this.qelementService.getSkillData().subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.skillTypeArray = result.data;
				}
			}
		);
	}
	getLodData(): void {
		this.qelementService.getLodData().subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.lodArray = result.data;
				}
			}
		);
	}

	moveUp(template: any, i: number) {
		if (i > 0) {
			this.rowActivecolor = true;
			this.rowActiveindex = i - 1;
			const tmp = this.templates[i - 1];
			this.templates[i - 1] = this.templates[i];
			this.templates[i] = tmp;
		}
	}

	moveDown(template: any, i: number) {
		if (i < this.templates.length - 1) {
			this.rowActivecolor = true;
			this.rowActiveindex = i + 1;
			const tmp = this.templates[i + 1];
			this.templates[i + 1] = this.templates[i];
			this.templates[i] = tmp;
		}
	}

	getColor(i: number) {
		if (this.rowActivecolor === true) {
			if (Number(this.rowActiveindex) === i) {
				return '#b3c6ff';
			} else {
				return '';
			}
		}
	}

	addQuestionList() {
		// tslint:disable-next-line:prefer-const
		let tf_qcount: number;
		let tf_qcount_value: number;
		let tf_weightage_value: number;
		this.tpmarks = this.templatesform1.controls.tp_marks.value;
		this.tpname = this.templatesform2.controls.topic_name.value;
		tf_qcount_value = this.templatesform2.controls.tf_qcount.value;
		tf_weightage_value = this.templatesform2.controls.tf_weightage.value;
		this.qsubtypemarks = Number(this.qsubtypemarks) + Number(tf_qcount_value) * Number(tf_weightage_value);
		if (this.templatesform1.valid && this.templatesform2.valid) {
			if (this.qsubtypemarks <= this.tpmarks) {
				let template: any = {};
				const template_tf_qcount =  Number(this.templatesform2.controls.tf_qcount.value);
				template = this.templatesform2.value;
				this.qelementService.getSubtopicNameById(this.templatesform2.value.tf_st_id).subscribe(
					(result: any) => {
						if (result && result.status === 'ok') {
							template.topic_name = result.data[0].topic_name;
							template.st_name = result.data[0].st_name;
						}
					}
				);
				this.qelementService.getQuestionSubtypeNameById(this.templatesform2.value.tf_qst_id).subscribe(
					(result: any) => {
						if (result && result.status === 'ok') {
							this.notif.showSuccessErrorMessage('Added successfully', 'success');
							template.qst_name = result.data[0].qst_name;
						}
					}
				);
				let pushFlag = 0;
				if (this.templates.length > 0) {
					this.leftmarks = 0;
					for (const item of this.templates) {
						if (item.tf_st_id === template.tf_st_id && item.tf_skill_id === template.tf_skill_id &&
					/* item.tf_dl_id === template.tf_dl_id && */ item.tf_qst_id === template.tf_qst_id && item.tf_qt_id === template.tf_qt_id) {
							item.tf_qcount = Number(item.tf_qcount) + Number(template_tf_qcount);
							pushFlag = 1;
							break;
						}
					}
				}
				if (Number(pushFlag) === 0) {
					this.templates.push(template);
				}
				this.leftmarks =  Number(this.tpmarks) -  Number(this.qsubtypemarks);
			} else {
				this.qsubtypemarks =  Number(this.qsubtypemarks) -  Number(tf_qcount_value) *  Number(tf_weightage_value);
				this.notif.showSuccessErrorMessage('The template selected exceeds the total marks', 'error');
			}
		} else {
		}
		/*Adding Form Validation for Form 1*/
		if (!this.templatesform1.value.tp_name) {
			this.notif.showSuccessErrorMessage('Template name is required', 'error');
		}
		if (!this.templatesform1.value.tp_class_id) {
			this.notif.showSuccessErrorMessage('Class is required', 'error');
		}
		if (!this.templatesform1.value.tp_sec_id) {
			this.notif.showSuccessErrorMessage('Section is required', 'error');
		}
		if (!this.templatesform1.value.tp_sub_id) {
			console.log('2 this.templatesform1.value.tp_sub_id', this.templatesform1.value.tp_sub_id);
			this.notif.showSuccessErrorMessage('Subject is required', 'error');
		}
		if (!this.templatesform1.value.tp_marks) {
			this.notif.showSuccessErrorMessage('Total marks is required', 'error');
		}
		if (!this.templatesform1.value.tp_time_alloted) {
			this.notif.showSuccessErrorMessage('Total time is required', 'error');
		}
		/* Form Validation Ends */

		/*Adding Form Validation for Form 2*/
		if (!this.templatesform2.value.tf_topic_id) {
			this.notif.showSuccessErrorMessage('Topic is required', 'error');
		}
		if (!this.templatesform2.value.tf_st_id) {
			this.notif.showSuccessErrorMessage('Subtopic is required', 'error');
		}
		if (!this.templatesform2.value.tf_qt_id) {
			this.notif.showSuccessErrorMessage('Question Type is required', 'error');
		}
		if (!this.templatesform2.value.tf_qst_id) {
			this.notif.showSuccessErrorMessage('Question SubType is required', 'error');
		}
		if (!this.templatesform2.value.tf_skill_id) {
			this.notif.showSuccessErrorMessage('Skill is required', 'error');
		}
		/* if (!this.templatesform2.value.tf_dl_id) {
      this.notif.showSuccessErrorMessage('LOD is required', 'error');
    } */
		if (!this.templatesform2.value.tf_qcount) {
			this.notif.showSuccessErrorMessage('No. of Question is required', 'error');
		}

		if (!this.templatesform2.value.tf_weightage) {
			this.notif.showSuccessErrorMessage('Weightage is required', 'error');
		}
		/* Form Validation Ends */
	}

	deleteQuestionList(deletei: number) {
		let i = 0;
		this.startIndex = this.startIndex - 1;
		this.qsubtypemarks = this.qsubtypemarks - (this.templates[deletei]['tf_qcount'] * this.templates[deletei]['tf_weightage']);
		this.leftmarks = this.tpmarks - this.qsubtypemarks;
		this.templates.splice(deletei, 1);
		for (const element of this.TEMPLATE_ELEMENT_DATA) {
			if (i > deletei) {
				this.TEMPLATE_ELEMENT_DATA[i].position = this.TEMPLATE_ELEMENT_DATA[i].position - 1;
				i++;
			} else {
				i++;
			}
		}
		this.TEMPLATE_ELEMENT_DATA.splice(deletei, 1);
		this.templatedataSource = new MatTableDataSource<TempElement>(this.TEMPLATE_ELEMENT_DATA);
		// this.templates.splice(deletei, 1);
	}

	addTemplate() {
		/*Adding Form Validation for Form 1*/
		if (!this.templatesform1.value.tp_name) {
			this.notif.showSuccessErrorMessage('Template name is required', 'error');
		}
		if (!this.templatesform1.value.tp_class_id) {
			this.notif.showSuccessErrorMessage('Class is required', 'error');
		}
		if (!this.templatesform1.value.tp_sec_id) {
			this.notif.showSuccessErrorMessage('Section is required', 'error');
		}
		if (!this.templatesform1.value.tp_sub_id) {
			console.log('3 this.templatesform1.value.tp_sub_id', this.templatesform1.value.tp_sub_id);
			this.notif.showSuccessErrorMessage('Subject is required', 'error');
		}
		if (!this.templatesform1.value.tp_marks) {
			this.notif.showSuccessErrorMessage('Total Marks is required', 'error');
		}
		if (!this.templatesform1.value.tp_time_alloted) {
			this.notif.showSuccessErrorMessage('Time alloted is required', 'error');
		}
		/* Form Validation Ends */

		/*Adding Form Validation for Form 2*/
		if (!this.templatesform2.value.tf_topic_id) {
			this.notif.showSuccessErrorMessage('Topic is required', 'error');
		}
		if (!this.templatesform2.value.tf_st_id) {
			this.notif.showSuccessErrorMessage('Subtopic is required', 'error');
		}
		if (!this.templatesform2.value.tf_qt_id) {
			this.notif.showSuccessErrorMessage('Question Type is required', 'error');
		}
		if (!this.templatesform2.value.tf_qst_id) {
			this.notif.showSuccessErrorMessage('Question Sub type is required', 'error');
		}
		if (!this.templatesform2.value.tf_skill_id) {
			this.notif.showSuccessErrorMessage('Skill is required', 'error');
		}
		/* if (!this.templatesform2.value.tf_dl_id) {
      this.notif.showSuccessErrorMessage('Level of Difficulty is required', 'error');
    } */
		if (!this.templatesform2.value.tf_qcount) {
			this.notif.showSuccessErrorMessage('No. of Question is required', 'error');
		}
		if (!this.templatesform2.value.tf_weightage) {
			this.notif.showSuccessErrorMessage('Weigthage is required', 'error');
		}
		if (!this.instruction_form.value.ti_id) {
			this.notif.showSuccessErrorMessage('Instruction is required', 'error');
		}
		/* Form Validation Ends */

		if (this.templatesform1.valid && this.templatesform2.valid && this.templates.length > 0 && Number(this.leftmarks) === 0) {
			this.templatesform1.patchValue({
				'filters': this.templates,
				'tp_tt_id': 1,
				'tp_sub_id': [this.templatesform1.value.tp_sub_id]
			});
			console.log('templatesform1', this.templatesform1.value);
			console.log('4 this.templatesform1.value.tp_sub_id', this.templatesform1.value.tp_sub_id);
			if (this.instruction_form.value.ti_id) {
				this.qelementService.addTemplate(this.templatesform1.value).subscribe(

					(result: any) => {
						if (result && result.status === 'ok') {
							this.notif.showSuccessErrorMessage('Template Created Successfully', 'success');
						}

						this.templatesform1.patchValue({
							'filters': [''],
							'tp_name': '',
							'tp_tt_id': '',
							'tp_ti_id': '',
							'tp_class_id': '',
							'tp_sub_id': '',
							'tp_sec_id': '',
							'tp_marks': '',
							'tp_time_alloted': '',
							'tp_exclusive': ''
						});
						this.templatesform2.patchValue({
							'tf_topic_id': '',
							'tf_st_id': '',
							'tf_qt_id': '',
							'tf_qst_id': '',
							'tf_skill_id': '',
							'tf_dl_id': '1',
							'tf_weightage': '',
							'tf_negative_marks': ''
						});
						this.qsubtypemarks = 0;
						this.tpmarks = 0;
						this.leftmarks = 0;
						this.templates = [];

					}
				);
			}
		} else {
			this.notif.showSuccessErrorMessage('Please check the marks left', 'error');
		}
	}

	updateTemplate() {
		// this.templatesform1.controls.filters.setValue(this.templates);
		this.templatesform1.patchValue({
			'filters': this.templates,
			'tp_sub_id': [this.templatesform1.value.tp_sub_id]
		});
		console.log('5 this.templatesform1.value.tp_sub_id', this.templatesform1.value.tp_sub_id);
		if (Number(this.leftmarks) === 0) {
			this.qelementService.updateTemplate(this.templatesform1.value).subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.notif.showSuccessErrorMessage('Template updated successfully', 'success');
					}
				}
			);
		} else {
			this.notif.showSuccessErrorMessage('Error adding the Template', 'error');
		}
	}

	resetTemplate() {
		this.templatesform1.reset();
		this.templatesform2.reset();
		this.templates = [];
		this.qsubtypemarks = 0;
		this.tpmarks = 0;
		this.leftmarks = 0;
	}

	getNameById(arr, id, idvalue, name) {
		if (arr) {
			for (const item of arr) {
				if (item[id] === idvalue) {
					return item[name];
				}
			}
		}
	}

	insertInstruction() {
		if (this.instruction_form.valid) {
			this.qbankService.insertInstruction(this.instruction_form.value).subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.getInstruction();
						this.notif.showSuccessErrorMessage('Instruction added successfully', 'success');
						this.instruction_form.patchValue({
							'ti_instruction': '',
							'ti_tags': '',
							'ti_description': ''
						});
					}
				}
			);
		}
	}

	resetInstruction() {
		this.instruction_form.reset();
	}

	getInstruction() {
		this.qbankService.getInstruction().subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.instructionArray = result.data;
				}
			}
		);
	}

	editInstructinForm(value) {
		this.editInstructionFlag = true;
		this.instruction_form.patchValue({
			'ti_id': value.ti_id,
			'ti_instruction': value.ti_instruction,
			'ti_tags': value.ti_tags,
			'ti_description': value.ti_description
		});
	}

	updateInstruction() {
		if (this.instruction_form.valid) {
			this.qbankService.updateInstruction(this.instruction_form.value).subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.notif.showSuccessErrorMessage('Instruction updated successfully', 'success');
						this.getInstruction();
						this.editInstructionFlag = false;
						this.instruction_form.patchValue({
							'ti_instruction': '',
							'ti_tags': '',
							'ti_description': ''
						});
					}
				}
			);
		}
	}

	deleteInstruction(ti_id) {
		this.qbankService.deleteInstruction(ti_id).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.getInstruction();
					this.notif.showSuccessErrorMessage('Instruction deleted successfully', 'success');
				}
			}
		);
	}

	submitInstruction() {
		// This method is being called to close the modal
	}

	getInstructionId(ti_id) {
		this.templatesform1.patchValue({
			'tp_ti_id': ti_id
		});
	}

}

export interface TempElement {
	position: number;
	topic: string;
	subtopic: string;
	subtype: any;
	noofquestion: any;
	marks: any;
	lod: string;
	skill: string;
	action: any;
}
