import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SisService, AxiomService, CommonAPIService, SmartService } from '../../../_services';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
	selector: 'app-edit-classwork-modal',
	templateUrl: './edit-classwork-modal.component.html',
	styleUrls: ['./edit-classwork-modal.component.css']
})
export class EditClassworkModalComponent implements OnInit {

	editclassworkform: FormGroup;
	subjectArray: any[] = [];
	classSectionArray: any[] = [];
	topicArray: any[] = [];
	subtopicArray: any[] = [];
	categoryArray: any[] = [];
	teacherId;

	constructor(
		private dialogRef: MatDialogRef<EditClassworkModalComponent>,
		@Inject(MAT_DIALOG_DATA) private data,
		private smartService: SmartService,
		private axiomService: AxiomService,
		private commonAPIService: CommonAPIService,
		private fb: FormBuilder
	) { }

	ngOnInit() {
		console.log(this.data);
		this.teacherId = this.data.cw_teacher_id;
		this.buildForm().then(() => {
			this.ctrList();
			this.getSubjectByTeacherId();
			this.getClassSectionByTeacherIdSubjectId();
			this.getTopicByClassSubject();
			this.getSubtopicByTopic();
		});
	}
	buildForm() {
		return new Promise(resolve => {
			this.editclassworkform = this.fb.group({
				cw_id: this.data.cw_id,
				cw_sub_id: this.data.cw_sub_id,
				cw_ctr_id: this.data.cw_ctr_id,
				cw_class_id: this.data.cw_class_id + '-' + this.data.cw_sec_id,
				cw_sec_id: '',
				cw_topic_id: this.data.cw_topic_id,
				cw_st_id: this.data.cw_st_id,
			});
			console.log(this.editclassworkform.value);
			return resolve();
		});

	}

	getSubjectByTeacherId() {
		this.subjectArray = [];
		this.smartService.getSubjectByTeacherId({ teacher_id: this.teacherId }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.subjectArray = result.data;
			} else {
				// this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}
	ctrList() {
		this.categoryArray = [];
		this.smartService.ctrList().subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.categoryArray = result.data;
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}
	getClassSectionByTeacherIdSubjectId() {
		this.classSectionArray = [];
		// this.resetClassworkFormForSubjectChange();
		this.smartService.getClassSectionByTeacherIdSubjectId({
			teacher_id: this.teacherId,
			sub_id: this.editclassworkform.value.cw_sub_id
		}).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					const csArray = result.data;
					if (csArray.length > 0) {
						csArray.forEach(element => {
							this.classSectionArray.push({
								cs_id: element.class_id + '-' + element.sec_id,
								cs_name: element.class_name + ' - ' + element.sec_name
							});
						});
					}
				} else {
					this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
				}
			});
	}

	resetSuptopic() {
		this.editclassworkform.patchValue({
			cw_st_id: ''
		});
	}
	getTopicByClassSubject() {
		this.topicArray = [];
		console.log(this.editclassworkform.value);
		const csArray = this.editclassworkform.value.cw_class_id.split('-');
		const param = { class_id: csArray[0], sub_id: this.editclassworkform.value.cw_sub_id };
		this.smartService.getTopicByClassIdSubjectId(param).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.topicArray = result.data;
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}
	getSubtopicByTopic() {
		this.subtopicArray = [];
		this.smartService.getSubtopicByTopicId({ topic_id: this.editclassworkform.value.cw_topic_id }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.subtopicArray = result.data;
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}

	resetClassworkFormForSubjectChange() {
		Object.keys(this.editclassworkform.controls).forEach(key => {
			if (key === 'cw_id' || key === 'cw_sub_id') {
			} else {
				this.editclassworkform.controls[key].reset();
			}
		});
		this.topicArray = [];
		this.subtopicArray = [];
	}

	closeDialog() {
		this.dialogRef.close();
	}
	resetTopicSubtopic() {
		this.editclassworkform.patchValue({
			cw_topic_id: '',
			cw_st_id: ''
		});
	}
	updateClasswork() {
		if (this.editclassworkform.valid) {
			const csArray = this.editclassworkform.value.cw_class_id.split('-');
			this.editclassworkform.patchValue({
				cw_class_id: csArray[0],
				cw_sec_id: csArray[1]
			});
			this.smartService.updateClasswork(this.editclassworkform.value).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.commonAPIService.showSuccessErrorMessage(result.message, 'success');
					this.dialogRef.close({ update: 'success' });
				}
			});
		} else {
      this.commonAPIService.showSuccessErrorMessage('Please select required field', 'success');
    }


	}

}
