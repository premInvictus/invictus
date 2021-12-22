import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { QelementService } from '../../questionbank/service/qelement.service';
import { HtmlToTextService } from '../../_services/index';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
// import {SpecificTemplateReviewComponent} from '../specific-template-review/specific-template-review.component'

@Component({
	selector: 'app-template-dialog',
	templateUrl: './template-dialog.component.html',
	styleUrls: ['./template-dialog.component.css']
})
export class TemplateDialogComponent implements OnInit {

	currentQues: any[];
	classArray: any[];
	subjectArray: any[];
	templateArray: any[] = [];
	printTemplate: any = {};
	filterform: FormGroup;


	constructor(
		private qelementService: QelementService,
		private fbuild: FormBuilder,
		private htt: HtmlToTextService,
		// private SpecificTemplate:SpecificTemplateReviewComponent,
		@Inject(MAT_DIALOG_DATA) private data,
		public dialogRef: MatDialogRef<TemplateDialogComponent>,
	) { }

	ngOnInit() {
		this.buildForm();
		this.getClass();
		this.getSpecificList();

	}

	buildForm() {
		this.filterform = this.fbuild.group({
			tp_class_id: this.data.tp_class_id,
			tp_sub_id: this.data.tp_sub_id,
		});
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

	getSubjectsByClass(): void {
		this.qelementService.getSubjectsByClass(this.filterform.value.tp_class_id).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {

					this.subjectArray = result.data;
				} else {

					this.subjectArray = [];
				}
				this.filterform.controls.tp_sub_id.setValue('');
			}
		);
	}
	getTotal(i1, i2) {
		return Number(i1) * Number(i2);
	}

	closeDialog(): void {
		this.dialogRef.close();
	}

	printStudentCopy() {
		const printModal2 = document.getElementById('printModal2');
		const popupWin = window.open('', '_blank', 'width=900,height=500');
		popupWin.document.open();
		// tslint:disable-next-line:max-line-length
		popupWin.document.write('<html><style>button { display:none; } </style><body onload="window.print()">' + printModal2.innerHTML + '</html>');
		popupWin.document.close();
	}
	getSpecificList() {
		// Form validations

		this.templateArray = [];
		const tt_id = '1';
		const tp_status = '0';
		// tslint:disable-next-line:max-line-length
		this.qelementService.getTemplate({ tt_id: tt_id, tp_status: tp_status, class_id: this.filterform.value.tp_class_id, sub_id: this.filterform.value.tp_sub_id }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {

					this.templateArray = result.data;
					this.printTemplate = this.data.item;
				}
			}
		);
	}
}

