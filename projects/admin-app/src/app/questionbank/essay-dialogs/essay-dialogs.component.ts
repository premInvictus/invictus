import { Component, OnInit, Inject , ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { QelementService } from '../service/qelement.service';
import { NotificationService } from 'projects/axiom/src/app/_services/index';
import { ckconfig } from '../ckeditorconfig';
@Component({
	selector: 'app-essay-dialogs',
	templateUrl: './essay-dialogs.component.html',
	styleUrls: ['./essay-dialogs.component.css']
})
export class EssayDialogsComponent implements OnInit {
	// @ViewChild(Editor)
	// editor:Editor;
	essayForm: FormGroup;
	paraDetailForm: FormGroup;
	essayArray: any[] = [];
	essayDetails: any = {};
	// essayDiv can be add, list, detail
	essayDiv = '';
	updateDiv = false;
	essaytable = false;
	selectEssayList = true;

	addnewEssay = false;
	ckeConfig: any;
	@ViewChild('question') ckeditor: any;
	constructor(
		private essayDialogRef: MatDialogRef<EssayDialogsComponent>,
		@Inject(MAT_DIALOG_DATA) private data,
		private fb: FormBuilder,
		private qelementService: QelementService,
		private notif: NotificationService
	) { }

	ngOnInit() {
		this.ckeConfig = ckconfig;
		this.buildForm();
		this.essayDiv = this.data.essayDiv;
		if (this.essayDiv === 'list') {
			this.getEssay();
		}
		if (this.essayDiv === 'detail') {
			this.getEssayById();
		}
	}
	buildForm() {
		this.essayForm = this.fb.group({
			ess_id: this.data.ess_id,
			ess_title: '',
			ess_description: '',
			ess_class_id: this.data.ess_class_id,
			ess_sub_id: this.data.ess_sub_id,
			ess_topic_id: this.data.ess_topic_id,
			ess_st_id: this.data.ess_st_id,
			ess_status: ''
		});
		this.paraDetailForm = this.fb.group({
			ess_description: ''
		});
	}
	addEssay() {
		this.essaytable = false;
		if (!this.essayForm.value.ess_description || !this.essayForm.value.ess_title) {

			this.notif.showSuccessErrorMessage('Please add an Essay ', 'error');

		} else {
		this.qelementService.addEssay(this.essayForm.value).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.notif.showSuccessErrorMessage('Submited Successfully', 'success');
					this.essayDialogRef.close({ess_id: result.data.ess_id});
				}
			}
		);
	}
	}
	getEssay() {
		this.essayForm.patchValue({
			'ess_status' : '1'
		});
		this.qelementService.getEssay(this.essayForm.value).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.essayArray = result.data;
				}
			}
		);
	}
	getEssayById() {
		this.qelementService.getEssay({ess_id: this.essayForm.value.ess_id}).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.essayDetails = result.data[0];
				}
			}
		);
	}
	setEssayDetails(value) {
		this.selectEssayList = false;
		this.essaytable = true;
		this.essayDetails = value;
		this.paraDetailForm.setValue({
			'ess_description' : this.essayDetails.ess_description
		});
	}
	selectEssay() {
		if (!this.essayDetails.ess_id) {
			this.notif.showSuccessErrorMessage('Please select essay Title', 'error');
	} else {
		this.notif.showSuccessErrorMessage('Submitted Successfully', 'success');
		this.essayDialogRef.close({ess_id: this.essayDetails.ess_id});


	}
}
	openAddDialog() {
		this.essaytable = false;
		this.essayDiv = 'add';
		this.addnewEssay = true;
	}
	backEssayList() {
		this.essayDiv = 'list';
	}
	editEssay(essaydetail) {
		this.essayDiv = 'add';
		this.updateDiv = true;
		this.addnewEssay = true;
		this.essayForm.patchValue({
			'ess_id'  : essaydetail.ess_id,
			'ess_title' : essaydetail.ess_title,
			'ess_description' : essaydetail.ess_description,
			'ess_status' : essaydetail.ess_status
		});
	}
	updateEssay() {
		this.essaytable = false;
		if (!this.essayForm.value.ess_description || !this.essayForm.value.ess_title) {

			this.notif.showSuccessErrorMessage('Please add Title and Description ', 'error');

		} else {
		this.qelementService.updateEssay(this.essayForm.value).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.essayArray = result.data;
					this.notif.showSuccessErrorMessage('Updatted Successfully', 'success');
					this.essayDiv = 'list';
					this.updateDiv = false;
					this.essayForm.patchValue({
						'ess_id'  : ''
					});
					this.getEssay();
				}
			}
		);
	}
	}
	deleteEssay(essaydetail) {
		this.qelementService.deleteEssay({ess_id: essaydetail.ess_id}).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.notif.showSuccessErrorMessage('Deleted Successfully', 'success');
					this.essayForm.patchValue({
						'ess_id'  : ''
					});
					this.getEssay();
				}
			}
		);
	}
	closeMainDialog() {
		this.essayDialogRef.close();
	}

	movebacktoSelect() {
		this.essaytable =  false;
		this.selectEssayList = true;
	}

}
