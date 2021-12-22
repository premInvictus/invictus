import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { QbankService } from '../../questionbank/service/qbank.service';
import { QelementService } from '../../questionbank/service/qelement.service';
import { MatPaginator, MatTableDataSource, MatSort, MatDialogRef, MatDialog } from '@angular/material';
import { BreadCrumbService, NotificationService, CommonAPIService } from '../../_services/index';
import { AddInstructionComponent } from '../../shared-module/add-instruction/add-instruction.component';

@Component({
	selector: 'app-generictemplate',
	templateUrl: './generictemplate.component.html',
	styleUrls: ['./generictemplate.component.css']
})
export class GenerictemplateComponent implements OnInit {

	templatesform1: FormGroup;
	templatesform2: FormGroup;
	instruction_form: FormGroup;
	rowActivecolor = false;
	rowActiveindex: number;
	qsubtypemarks = 0;
	tpmarks = 0;
	leftmarks = 0;
	templates: any[] = [];
	questionTypeArray: any[];
	questionSubtypeArray: any[];
	skillTypeArray: any[];
	// tslint:disable-next-line:max-line-length
	papertimeArray: any = [];
	questionstypeArray: any[] = [];
	lodArray: any[];
	marksArray: any[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	papermarksArray: any[] = [];
	negativemarksArray: any[] = [-1, -2, -3, -4, -5];
	weightageArray: any[] = [];
	instructionArray: any[];
	editInstructionFlag = false;
	templateArray: any[];
	editTemplateFlag = false;
	homeUrl: string;
	startIndex = 1;
	title: any;
	TEMPLATE_ELEMENT_DATA: TempElement[] = [];

	templatedisplayedColumns = ['position', 'subtype', 'noofquestion', 'marks', 'lod', 'skill', 'action'];

	templatedataSource = new MatTableDataSource<TempElement>(this.TEMPLATE_ELEMENT_DATA);

	dialogRef: MatDialogRef<AddInstructionComponent>;

	constructor(
		private fbuild: FormBuilder,
		private qbankService: QbankService,
		private qelementService: QelementService,
		private route: ActivatedRoute,
		private notif: NotificationService,
		private commonAPIService: CommonAPIService,
		private breadCrumbService: BreadCrumbService,
		private dialog: MatDialog
	) { }

	ngOnInit() {
		this.homeUrl = this.breadCrumbService.getUrl();
		this.buildForm();
		this.getQuestionTypeData();
		this.getSkillData();
		this.getLodData();
		this.getInstruction();
		this.getQueryParams();
		for (let i = 1; i <= 300; i++) {
			this.papertimeArray.push(i);
			this.questionstypeArray.push(i);
		}
		for (let i = 1; i <= 1000; i++) {
			this.papermarksArray.push(i);
		}
		for (let i = 1; i <= 100; i++) {
			this.weightageArray.push(i);
		}
	}

	getQueryParams() {
		if (this.route.snapshot.queryParamMap.get('tp_id')) {
			this.editTemplateFlag = true;
			this.title = 'Update Template';
			this.getTemplate(this.route.snapshot.queryParamMap.get('tp_id'));
		} else {
			this.editTemplateFlag = false;
			this.title = 'Create Template';
		}
	}

	getTemplate(tp_id) {
		const tp_tt_id = 2;
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
					this.templatesform1.controls.tp_id.patchValue(this.templateArray[i].tp_id);
					this.templatesform1.controls.tp_name.patchValue(this.templateArray[i].tp_name);
					this.templatesform1.controls.tp_tt_id.patchValue(this.templateArray[i].tp_tt_id);
					this.templatesform1.controls.tp_ti_id.patchValue(this.templateArray[i].tp_ti_id);
					this.templatesform1.controls.tp_marks.patchValue(Number(this.templateArray[i].tp_marks));
					this.templatesform1.controls.tp_time_alloted.patchValue(Number(this.templateArray[i].tp_time_alloted));
					this.templatesform1.controls.tp_exclusive.patchValue(this.templateArray[i].tp_exclusive === '1' ? true : false);
					this.templates = this.templateArray[i].filters;
					this.editTemplateFlag = true;
					this.leftmarks = 0;
					this.tpmarks = this.templateArray[i].tp_marks;
					this.qsubtypemarks = this.templateArray[i].tp_marks;
				}
			}
		);
	}

	buildForm() {
		this.templatesform1 = this.fbuild.group({
			tp_tt_id: '',
			tp_class_id: '0',
			tp_sub_id: '0',
			tp_id: '',
			tp_sec_id: '0',
			tp_ti_id: '',
			tp_name: '',
			tp_marks: '',
			tp_time_alloted: '',
			tp_exclusive: '',
			filters: []
		});
		this.templatesform2 = this.fbuild.group({
			tf_qt_id: '',
			tf_qst_id: '',
			tf_st_id: '0',
			tf_skill_id: '',
			tf_dl_id: '1',
			tf_qcount: '',
			tf_topic_id: '0',
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
		this.questionSubtypeArray = [];
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
			if (this.rowActiveindex === i) {
				return '#b3c6ff';
			}
		} else {
			return '';
		}
	}

	addQuestionList() {
		if (this.templatesform1.valid && this.templatesform2.valid) {
			this.tpmarks = this.templatesform1.controls.tp_marks.value;
			this.qsubtypemarks = this.qsubtypemarks + this.templatesform2.controls.tf_qcount.value * this.templatesform2.controls.tf_weightage.value;
			if (this.qsubtypemarks <= this.tpmarks) {
				let template: any;
				template = this.templatesform2.value;
				const template_tf_qcount = this.templatesform2.controls.tf_qcount.value;
				this.qelementService.getQuestionSubtypeNameById(this.templatesform2.value.tf_qst_id).subscribe(
					(result: any) => {
						if (result && result.status === 'ok') {
							this.notif.showSuccessErrorMessage('Added successfully', 'success');
							template.qst_name = result.data[0].qst_name;
							// tslint:disable-next-line:max-line-length
							this.TEMPLATE_ELEMENT_DATA.push({ position: this.startIndex, subtype: template.qst_name, marks: (template.tf_qcount * template.tf_weightage), noofquestion: template.tf_qcount, skill: template.skill_name, lod: template.lod_name, action: template });
							this.templatedataSource = new MatTableDataSource<TempElement>(this.TEMPLATE_ELEMENT_DATA);
							this.startIndex++;
						}
					}
				);
				let pushFlag = 0;
				for (const item of this.templates) {
					// tslint:disable-next-line:max-line-length
					if (item.tf_skill_id === this.templatesform2.value.tf_skill_id && /* item.tf_dl_id === this.templatesform2.value.tf_dl_id && */ item.tf_qst_id === this.templatesform2.value.tf_qst_id && item.tf_qt_id === this.templatesform2.value.tf_qt_id) {
						item.tf_qcount = Number(item.tf_qcount) + Number(template_tf_qcount);
						pushFlag = 1;
					}
				}
				if (pushFlag === 0) {
					this.templates.push(template);
				}
				this.leftmarks =  Number(this.tpmarks) -  Number(this.qsubtypemarks);
			} else {
				// tslint:disable-next-line:max-line-length
				this.qsubtypemarks =  Number(this.qsubtypemarks) -  Number(this.templatesform2.controls.tf_qcount.value) *
				Number(this.templatesform2.controls.tf_weightage.value);
				this.notif.showSuccessErrorMessage('The template selected exceeds the total marks', 'error');
			}
		}
		/*Adding Form Validation for Form 1*/
		if (!this.templatesform1.value.tp_name) {
			this.notif.showSuccessErrorMessage('Template name is required', 'error');
		}
		if (!this.templatesform1.value.tp_marks) {
			this.notif.showSuccessErrorMessage('Total marks is required', 'error');
		}
		if (!this.templatesform1.value.tp_time_alloted) {
			this.notif.showSuccessErrorMessage('Time allotted is required', 'error');
		}
		/* Form Validation Ends */

		/*Adding Form Validation for Form 2*/
		if (!this.templatesform2.value.tf_qt_id) {
			this.notif.showSuccessErrorMessage('Question type is required', 'error');
		}
		if (!this.templatesform2.value.tf_qst_id) {
			this.notif.showSuccessErrorMessage('Question sub-type is required', 'error');
		}
		if (!this.templatesform2.value.tf_skill_id) {
			this.notif.showSuccessErrorMessage('Skill type is required', 'error');
		}
		/*   if (!this.templatesform2.value.tf_dl_id) {
        this.notif.showSuccessErrorMessage('Level of difficulty is required', 'error');
      } */
		if (!this.templatesform2.value.tf_qcount) {
			this.notif.showSuccessErrorMessage('No. of questions is required', 'error');
		}
		if (!this.templatesform2.value.tf_weightage) {
			this.notif.showSuccessErrorMessage('Weightage is required', 'error');
		}
		/* Form Validation Ends */
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
		// this.notif.showSuccessErrorMessage('Instruction deleted successfully', 'success');
	}

	addTemplate() {
		/*Adding Form Validation for Form 1*/
		if (!this.templatesform1.value.tp_name) {
			this.notif.showSuccessErrorMessage('Template name is required', 'error');
		}
		if (!this.templatesform1.value.tp_marks) {
			this.notif.showSuccessErrorMessage('Total marks is required', 'error');
		}
		if (!this.templatesform1.value.tp_time_alloted) {
			this.notif.showSuccessErrorMessage('Time allotted is required', 'error');
		}
		/* Form Validation Ends */

		/*Adding Form Validation for Form 2*/
		if (!this.templatesform2.value.tf_qt_id) {
			this.notif.showSuccessErrorMessage('Question type is required', 'error');
		}
		if (!this.templatesform2.value.tf_qst_id) {
			this.notif.showSuccessErrorMessage('Question sub-type is required', 'error');
		}
		if (!this.templatesform2.value.tf_skill_id) {
			this.notif.showSuccessErrorMessage('Skill type is required', 'error');
		}
		/* if (!this.templatesform2.value.tf_dl_id) {
      this.notif.showSuccessErrorMessage('Level of difficulty is required', 'error');
    } */
		if (!this.templatesform2.value.tf_qcount) {
			this.notif.showSuccessErrorMessage('No. of questions is required', 'error');
		}
		if (!this.templatesform2.value.tf_weightage) {
			this.notif.showSuccessErrorMessage('Weightage is required', 'error');
		}
		if (!this.instruction_form.value.ti_id) {
			this.notif.showSuccessErrorMessage('Instruction is required', 'error');
		}
		/* Form Validation Ends */
		if (this.templatesform1.valid && this.templatesform2.valid && this.leftmarks === 0) {
			this.templatesform1.controls.filters.setValue(this.templates);
			this.templatesform1.controls.tp_tt_id.setValue(2);
			if (this.instruction_form.value.ti_id) {
				this.qelementService.addTemplate(this.templatesform1.value).subscribe(
					(result: any) => {
						if (result && result.status === 'ok') {
							this.notif.showSuccessErrorMessage('Template Created Successfully', 'success');
						}
						this.templatesform1.reset();
						this.templatesform2.reset();
						this.templates = [];
						this.qsubtypemarks = 0;
						this.tpmarks = 0;
						this.leftmarks = 0;
					}
				);
			}
		} else {
			this.notif.showSuccessErrorMessage('Please check the marks left', 'error');
		}
	}

	updateTemplate() {
		this.templatesform1.controls.filters.setValue(this.templates);
		this.qelementService.updateTemplate(this.templatesform1.value).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.notif.showSuccessErrorMessage('Updated successfully', 'success');
				}
			}
		);
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
		for (const item of arr) {
			if (item[id] === idvalue) {
				return item[name];
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
						this.resetInstruction();
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
		this.instruction_form.controls.ti_id.setValue(value.ti_id);
		this.instruction_form.controls.ti_instruction.setValue(value.ti_instruction);
		this.instruction_form.controls.ti_tags.setValue(value.ti_tags);
		this.instruction_form.controls.ti_description.setValue(value.ti_description);
	}

	updateInstruction() {
		if (this.instruction_form.valid) {
			this.qbankService.updateInstruction(this.instruction_form.value).subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.getInstruction();
						this.editInstructionFlag = false;
						this.notif.showSuccessErrorMessage('Instruction updated successfully', 'success');
						this.resetInstruction();
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

	// Submit instruction false method call
	submitInstruction() {
	}

	getInstructionId(ti_id) {
		this.templatesform1.controls.tp_ti_id.setValue(ti_id);
	}
}

export interface TempElement {
	position: number;

	subtype: any;
	noofquestion: any;
	marks: any;
	lod: string;
	skill: string;
	action: any;
}
