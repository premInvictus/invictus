import { Component, OnInit, Inject } from '@angular/core';
import { QelementService } from '../../questionbank/service/qelement.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import {  MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';


@Component({
	selector: 'app-view-template-partial',
	templateUrl: './view-template-partial.component.html',
	styleUrls: ['./view-template-partial.component.css']
})
export class ViewTemplatePartialComponent implements OnInit {

	templateArray: any[] = [];
		currentTemplate: any;
		filtersArray: any[];
		questionsArray: any[];
		questionsOfEachTemplateFilerArray: any[] = [];
		finalQuestionArray: any[] = [];
		printTemplate: any = {};
		qpspartial_form: FormGroup;
		finalTemplateArray: any;
	classArray: any;
	sectionArray: any;
	subjectArray: any;
	currSelectedTemplateClass: any;
	currSelectedTemplateSection: any;
	currSelectedTemplateSubject: any;

	constructor(private fb: FormBuilder, private qelementService: QelementService, @Inject(MAT_DIALOG_DATA) private data,
	public dialogRef: MatDialogRef<ViewTemplatePartialComponent>) { }

	ngOnInit() {
		this.buildForm();
		this.getClass();
		this.getSectionsByClass();
		this.getSubjectsByClass();

		this.getAllGenericList();

	}

	buildForm() {
		this.qpspartial_form = this.fb.group({
				qp_name: '',
				qp_tp_id: this.data.qp_tp_id,
				qp_qm_id: '',
				qp_class_id: this.data.qp_class_id,
				qp_sub_id: this.data.qp_sub_id,
				qp_sec_id: this.data.qp_sec_id,
				qlist: []
		});
}
getClass() {
	this.qelementService.getClass().subscribe(
		(result:  any) => {
				if (result && result.status === 'ok') {
					this.classArray = result.data;
					this.classArray.filter(item => {
						if (this.qpspartial_form.value.qp_class_id === item.class_id) {
							this.currSelectedTemplateClass = item.class_name;
						}
						});
				}
			}
		);
}

getSectionsByClass(): void {
	this.qelementService.getSectionsByClass(this.qpspartial_form.value.qp_class_id).subscribe(
		(result:  any) => {
				if (result && result.status === 'ok') {
					this.sectionArray = result.data;
					this.sectionArray.filter(item => {
						if (this.qpspartial_form.value.qp_sec_id === item.sec_id) {
							this.currSelectedTemplateSection = item.sec_name;
						}
						});
				} else {
					this.sectionArray = [];
				}
			}
		);
}

getSubjectsByClass(): void {
	this.qelementService.getSubjectsByClass(this.qpspartial_form.value.qp_class_id).subscribe(
		(result:  any) => {
			if (result && result.status === 'ok') {
				this.subjectArray = result.data;
				this.subjectArray.filter(item => {
					if (this.qpspartial_form.value.qp_sub_id === item.sub_id) {
						this.currSelectedTemplateSubject = item.sub_name;
					}
					});
			} else {
				this.subjectArray = [];
			}
		}
	);
}
	getAllGenericList() {
		const tt_id = 2;
		const tp_status = 1;
		const tp_id = this.qpspartial_form.value.qp_tp_id;
		this.qelementService.getAllGenericList({tt_id: tt_id, tp_status: tp_status}).subscribe (
			(result:  any) =>  {
				if (result && result.status === 'ok') {
					this.templateArray = result.data;
					for (const item of this.templateArray) {
						if (item.tp_id === tp_id) {
						this.printTemplate = item;

						}
				}
				}
			}
			);
	}
	getTotal(i1, i2) {
		return Number(i1) * Number(i2);
	}

	closeDialog(): void {
		this.dialogRef.close();
	}
}
