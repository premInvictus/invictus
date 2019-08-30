import { Component, OnInit, Inject } from '@angular/core';
import { QelementService } from '../../questionbank/service/qelement.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import {  MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
	selector: 'app-view-template',
	templateUrl: './view-template.component.html',
	styleUrls: ['./view-template.component.css']
})
export class ViewTemplateComponent implements OnInit {

	templateArray: any[] = [];
		currentTemplate: any;
		filtersArray: any[];
		questionsArray: any[];
		questionsOfEachTemplateFilerArray: any[] = [];
		finalQuestionArray: any[] = [];
		printTemplate: any = {};
		qpsfully_form: FormGroup;
		finalTemplateArray: any;

	constructor(
		private fb: FormBuilder,
			private qelementService: QelementService,
			@Inject(MAT_DIALOG_DATA) private data,
		public dialogRef: MatDialogRef<ViewTemplateComponent>
			) { }

	ngOnInit() {
		this.buildForm();
		this.getAllSpecificList();

	}

	buildForm() {
		this.qpsfully_form = this.fb.group({
				qp_name: '',
				qp_tp_id: this.data.qp_tp_id,
				qp_qm_id: '',
				qp_class_id: this.data.qp_class_id,
				qp_sub_id: this.data.qp_sub_id,
				qp_sec_id: this.data.qp_sec_id,
				qlist: []
		});
}
getAllSpecificList() {
	const tt_id = 1;
	const tp_status = 1;
	const tp_id = this.qpsfully_form.value.qp_tp_id;
	this.qelementService.getTemplate({ tt_id: tt_id, tp_status: tp_status, class_id: this.qpsfully_form.value.qp_class_id,
			sub_id: this.qpsfully_form.value.qp_sub_id , sec_id : this.qpsfully_form.value.qp_sec_id}).subscribe(
					(result: any) => {
							if (result && result.status === 'ok') {
									this.templateArray = result.data;
									for (const item of this.templateArray) {
										if (item.tp_id === tp_id) {
										this.printTemplate = item;
										break;
										}
								}
									} else {
									this.templateArray = [];

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
