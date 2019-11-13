import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup , FormBuilder } from '@angular/forms';
import { QbankService } from '../../questionbank/service/qbank.service';
import { QelementService } from '../../questionbank/service/qelement.service';
import { NotificationService } from '../../_services';
import { ckconfig } from '../../questionbank/ckeditorconfig';

@Component({
	selector: 'app-add-instruction',
	templateUrl: './add-instruction.component.html',
	styleUrls: ['./add-instruction.component.css']
})
export class AddInstructionComponent implements OnInit {

	instruction_form: FormGroup;
	instructionArray: any[];

	editInstructionFlag = false;

	tableCollection = true;

	instructionForm = false ;
	generateQuesBtn: boolean;
	addInstructBtn: boolean;
	express_form_one: FormGroup;
	finalResultArray: any[] = [];
	templatesform1: FormGroup;
	title: any;
	ckeConfig: any;

	constructor(  private fbuild: FormBuilder,
		private qbankService: QbankService,
		private qelementService: QelementService,
		private notif: NotificationService,
		public dialogRef: MatDialogRef<AddInstructionComponent>,
		@Inject(MAT_DIALOG_DATA) public data) {}


	ngOnInit() {
		this.ckeConfig = ckconfig;
		this.buildForm();
		this.getInstruction();
	}

	buildForm() {
		this.instruction_form = this.fbuild.group({
			ti_id: this.data.ti_id,
			ti_instruction: this.data.ti_instruction,
			ti_tags: this.data.ti_tags,
			ti_description: this.data.ti_description
		});
		this.express_form_one = this.fbuild.group({
			'tp_ti_id': this.data.tp_ti_id
		});

		this.templatesform1 = this.fbuild.group({
			'tp_ti_id': this.data.tp_ti_id,
});
	}

	getInstructionId(value) {
		this.express_form_one.patchValue({
			'tp_ti_id' : value
		});
		this.instruction_form.patchValue({
			'ti_id' : value
		});

		this.templatesform1.patchValue({
			'tp_ti_id' : value
		});

		this.finalResultArray[0] = this.express_form_one;
		this.finalResultArray[1] = this.instruction_form;
		this.finalResultArray[2] = this.templatesform1;
		this.generateQuesBtn = true;
		this.addInstructBtn = false;
	}
	clickaddinstruction() {
		this.instruction_form.reset();
		this.tableCollection = false;
		this.instructionForm = true;
		this.title = 'Add Instruction';
	}

	gobacktable() {
		this.tableCollection = true;
		this.instructionForm = false;
	}

	closeMainDialog() {
		this.dialogRef.close();
	}

	closeDialog(): void {

		this.dialogRef.close(this.finalResultArray);
		// this.instruction_form.value.ti_id=this.data.ti_id
		if (this.instruction_form.value.ti_id) {
			this.notif.showSuccessErrorMessage('Instruction Added Succesfully', 'success');

		}

	}

	insertInstruction() {
		if (this.instruction_form.valid) {
			this.qbankService.insertInstruction(this.instruction_form.value).subscribe(
				(result: any) =>  {
					if (result && result.status === 'ok') {
						this.getInstruction();
						this.instruction_form.reset();
						this.tableCollection = true;
						this.instructionForm = false;
						this.notif.showSuccessErrorMessage(result.message, 'success');
					} else {
						this.notif.showSuccessErrorMessage(result.message, 'error');
					}
				}
			);
		}
	}

	getInstruction() {
		this.qbankService.getInstruction().subscribe(
			(result: any) =>  {
				if (result) {
					this.instructionArray = result.data;
				}
			}
		);
	}

	resetInstruction() {
		this.instruction_form.reset();
	}

	editInstructionForm(value) {
		this.editInstructionFlag = true;
		this.instructionForm = true;
		this.tableCollection = false;
		this.title = 'Update Instruction';
		this.instruction_form.controls.ti_id.setValue(value.ti_id);
		this.instruction_form.controls.ti_instruction.setValue(value.ti_instruction);
		this.instruction_form.controls.ti_tags.setValue(value.ti_tags);
		this.instruction_form.controls.ti_description.setValue(value.ti_description);
	}

	updateInstruction() {
		if (this.instruction_form.valid) {
			this.qbankService.updateInstruction(this.instruction_form.value).subscribe(
				(result: any) =>  {
					if (result && result.status === 'ok') {
						this.getInstruction();
						this.editInstructionFlag = false;
						this.instruction_form.reset();
						this.tableCollection = true;
						this.instructionForm = false;
						this.editInstructionFlag = false;
						this.notif.showSuccessErrorMessage(result.message, 'success');
					} else {
						this.notif.showSuccessErrorMessage(result.message, 'error');
					}
				}
			);
		}
	}

	deleteInstruction(ti_id) {
		if (confirm('Are you sure you want to delete?') === true) {
			this.qbankService.deleteInstruction(ti_id).subscribe(
				(result: any) =>  {
					if (result) {
						this.getInstruction();
					}
				}
			);
		}
	}

}
