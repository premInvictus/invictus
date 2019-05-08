import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { DatePipe } from '@angular/common';
import { Component, Input, NgZone, OnChanges, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { FormEnabledService } from '../../sharedmodule/dynamic-content/formEnabled.service';
import { CommonAPIService, ProcesstypeService, SisService } from '../../_services/index';
import { PreviewDocumentComponent } from './../../student-master/documents/preview-document/preview-document.component';
import { formGroupNameProvider } from '@angular/forms/src/directives/reactive_directives/form_group_name';
import { ConfirmValidParentMatcher } from '../../ConfirmValidParentMatcher';
@Component({
	selector: 'app-management-remarks-theme-two',
	templateUrl: './management-remarks-theme-two.component.html',
	styleUrls: ['./management-remarks-theme-two.component.scss']
})
export class ManagementRemarksThemeTwoComponent implements OnInit, OnChanges {
	confirmValidParentMatcher = new ConfirmValidParentMatcher();
	dialogRef2: MatDialogRef<PreviewDocumentComponent>;

	// tslint:disable-next-line:no-input-rename
	@Input('addOnly') addOnly: boolean;
	// tslint:disable-next-line:no-input-rename
	@Input('editOnly') editOnly: boolean;
	// tslint:disable-next-line:no-input-rename
	@Input('viewOnly') viewOnly: boolean;
	// tslint:disable-next-line:no-input-rename
	@Input('formData') formData: boolean;
	@Input() configSetting: any;

	@ViewChild('autosize') autosize: CdkTextareaAutosize;
	@ViewChild('picker') picker;

	events: string[] = [];
	mtremark: any;
	dynamicMarksForm: any;
	admissionremarkform: FormGroup;
	studentremarkform: FormGroup;
	parentremarkform: FormGroup;
	finalremarksform: FormGroup;
	concessionremarksform: FormGroup;
	login_id;
	concessionArray = [];
	areaArray = [];
	classArray = [];
	authorityArray = [];
	editList = false;
	editlist = false;
	updateIndex;
	managementform: any = {};
	minDate = new Date();
	defaultsrc = '';
	checkChangedFieldsArray: any[] = [];
	savedSettingsArray: any[] = [];
	settingsArray: any[] = [];
	marksTableJson: any[] = [];
	markObjectLength;
	showForm = false;
	constructor(
		private fbuild: FormBuilder,
		private sisService: SisService,
		private commonAPIService: CommonAPIService,
		private processtypeService: ProcesstypeService,
		private formEnabledService: FormEnabledService,
		private dialog: MatDialog,
		private ngZone: NgZone
	) { }

	ngOnInit() {
		this.settingsArray = this.configSetting;
		this.getauthority();
		this.getArea();
		this.getClass();
		this.setFormDataAndState();
		// this.getConfigureSetting();
		// this.marksTableJson = [
		// 	{
		// 		'col_1': { 'feature_id': '1', 'feature_label': 'Grade', 'value': 'Marks' },
		// 		'col_2': { 'feature_id': '2', 'feature_label': 'English', 'value': '50' },
		// 		'col_3': { 'feature_id': '3', 'feature_label': 'Math', 'value': '60' },
		// 		'col_4': { 'feature_id': '4', 'feature_label': 'Science', 'value': '70' },
		// 		'col_5': { 'feature_id': '5', 'feature_label': 'Sibling', 'value': '70' },
		// 		'col_6': { 'feature_id': '6', 'feature_label': 'Alumini', 'value': '70' },
		// 		'col_7': { 'feature_id': '7', 'feature_label': 'Distance', 'value': '70' },
		// 		'col_8': { 'feature_id': '8', 'feature_label': 'Total', 'value': '70' }
		// 	},
		// 	{
		// 		'col_1': { 'feature_id': '1', 'feature_label': 'Grade', 'value': 'Percentage' },
		// 		'col_2': { 'feature_id': '2', 'feature_label': 'English', 'value': '50' },
		// 		'col_3': { 'feature_id': '3', 'feature_label': 'Math', 'value': '60' },
		// 		'col_4': { 'feature_id': '4', 'feature_label': 'Science', 'value': '70' },
		// 		'col_5': { 'feature_id': '5', 'feature_label': 'Sibling', 'value': '70' },
		// 		'col_6': { 'feature_id': '6', 'feature_label': 'Alumini', 'value': '70' },
		// 		'col_7': { 'feature_id': '7', 'feature_label': 'Distance', 'value': '70' },
		// 		'col_8': { 'feature_id': '5', 'feature_label': 'Total', 'value': '70' }
		// 	},
		// 	{
		// 		'col_1': { 'feature_id': '1', 'feature_label': 'Grade', 'value': 'Grade' },
		// 		'col_2': { 'feature_id': '2', 'feature_label': 'English', 'value': '50' },
		// 		'col_3': { 'feature_id': '3', 'feature_label': 'Math', 'value': '60' },
		// 		'col_4': { 'feature_id': '4', 'feature_label': 'Science', 'value': '70' },
		// 		'col_5': { 'feature_id': '5', 'feature_label': 'Sibling', 'value': '70' },
		// 		'col_6': { 'feature_id': '6', 'feature_label': 'Alumini', 'value': '70' },
		// 		'col_7': { 'feature_id': '7', 'feature_label': 'Distance', 'value': '70' },
		// 		'col_8': { 'feature_id': '5', 'feature_label': 'Total', 'value': '70' }
		// 	},
		// 	{
		// 		'col_1': { 'feature_id': '1', 'feature_label': 'Grade', 'value': 'Points' },
		// 		'col_2': { 'feature_id': '2', 'feature_label': 'English', 'value': '50' },
		// 		'col_3': { 'feature_id': '3', 'feature_label': 'Math', 'value': '60' },
		// 		'col_4': { 'feature_id': '4', 'feature_label': 'Science', 'value': '70' },
		// 		'col_5': { 'feature_id': '5', 'feature_label': 'Sibling', 'value': '70' },
		// 		'col_6': { 'feature_id': '6', 'feature_label': 'Alumini', 'value': '70' },
		// 		'col_7': { 'feature_id': '7', 'feature_label': 'Distance', 'value': '70' },
		// 		'col_8': { 'feature_id': '5', 'feature_label': 'Total', 'value': '70' }
		// 	}
		// ];
		// this.markObjectLength = Object.keys(this.marksTableJson[0]).length;
		this.buildForm();
	}

	ngOnChanges() {
		this.setFormDataAndState();
	}

	setFormDataAndState() {
		this.concessionArray = this.formData && this.formData['managementRemarks'] ? this.formData['managementRemarks'] : [];
		this.addOnly = this.addOnly ? this.addOnly : false;
		this.editOnly = this.editOnly ? this.editOnly : false;
		this.viewOnly = this.viewOnly ? this.viewOnly : false;
		if (this.formData) {
			this.patchMtRemarks(this.formData);
		}
	}

	buildForm() {
		this.admissionremarkform = this.fbuild.group({
			erm_id: '',
			erm_login_id: '',
			erm_type: 'admission',
			erm_mark_obtained: '',
			erm_remark: ''
		});
		this.studentremarkform = this.fbuild.group({
			erm_id: '',
			erm_login_id: '',
			erm_type: 'student',
			erm_mark_obtained: '',
			erm_remark: ''
		});
		this.parentremarkform = this.fbuild.group({
			erm_id: '',
			erm_login_id: '',
			erm_type: 'parent',
			erm_mark_obtained: '',
			erm_remark: ''
		});
		this.finalremarksform = this.fbuild.group({
			au_final_remark: '',
			au_is_eligible_adimission: '',
			au_process_class: ''
		});
		this.concessionremarksform = this.fbuild.group({
			era_doj: new Date(),
			era_ar_id: '',
			era_aut_id: '',
			era_teachers_remark: '',
			documents: ''
		});


		// const fGroupArr = [];
		// for (let i = 0; i < Object.keys(this.marksTableJson).length; i++) {
		// 	const markFormControlArr = [];
		// 	const key = Object.keys(this.marksTableJson[0])[i];
		// 	const inputJson = {};
		// 	const formControlArr = [];
		// 	for (let j = 0; j < Object.keys(this.marksTableJson[i]).length; j++) {
		// 		const key = Object.keys(this.marksTableJson[0])[j];
		// 		const subkey = Object.keys(this.marksTableJson[i][key])[j];

		// 		inputJson[key] = '';
		// 	}


		// 	fGroupArr.push(this.fbuild.group(inputJson));
		// }

		// this.dynamicMarksForm = fGroupArr;


	}

	addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
		this.events.push(`${type}: ${event.value}`);
		this.picker._dateAdapter.locale = 'en-in';
		const datePipe = new DatePipe('en-in');
		const convertedDate = datePipe.transform(this.concessionremarksform.value.era_doj, 'yyyy-MM-dd');
		this.concessionremarksform.patchValue({
			'era_doj': convertedDate
		});
	}

	addtolist() {
		if (this.concessionremarksform.valid) {
			this.concessionArray.push(this.concessionremarksform.value);
			this.concessionremarksform.reset();
		}
	}

	deletelist(index) {
		this.concessionArray.splice(index, 1);
		this.concessionremarksform.reset();
		this.editlist = false;
	}

	updatelist(index) {
		this.editlist = true;
		this.updateIndex = index;
		const item = this.concessionArray[index];
		this.concessionremarksform.patchValue({
			era_doj: item.era_doj,
			era_ar_id: item.era_ar_id,
			era_aut_id: item.era_aut_id,
			era_teachers_remark: item.era_teachers_remark
		});
	}

	updatetolist() {
		this.editlist = false;
		this.concessionArray[this.updateIndex] = this.concessionremarksform.value;
		this.concessionremarksform.reset();
	}

	patchMtRemarks(mtRemark) {
		const managementRemark = mtRemark;
		if (managementRemark && managementRemark['markSplit'] && managementRemark['markSplit'].length > 0) {
			this.prepareMarkSplitTable(managementRemark['markSplit']);
		}
		if (managementRemark && managementRemark['remarksMarks'] && managementRemark['remarksMarks'].length > 0) {
			managementRemark['remarksMarks'].forEach(element => {
				if (element.erm_type === 'admission' && this.admissionremarkform) {
					this.admissionremarkform.setValue({
						erm_id: element.erm_id,
						erm_login_id: element.erm_login_id,
						erm_type: element.erm_type,
						erm_mark_obtained: element.erm_mark_obtained,
						erm_remark: element.erm_remark
					});
				} else if (element.erm_type === 'student' && this.studentremarkform) {
					this.studentremarkform.setValue({
						erm_id: element.erm_id,
						erm_login_id: element.erm_login_id,
						erm_type: element.erm_type,
						erm_mark_obtained: element.erm_mark_obtained,
						erm_remark: element.erm_remark
					});
				} else if (element.erm_type === 'parent' && this.parentremarkform) {
					this.parentremarkform.setValue({
						erm_id: element.erm_id,
						erm_login_id: element.erm_login_id,
						erm_type: element.erm_type,
						erm_mark_obtained: element.erm_mark_obtained,
						erm_remark: element.erm_remark
					});
				}
			});

		} else {
			if (this.admissionremarkform) {
				this.admissionremarkform.setValue({
					erm_id: '',
					erm_login_id: '',
					erm_type: 'admission',
					erm_mark_obtained: '',
					erm_remark: ''
				});
			}
			if (this.studentremarkform) {
				this.studentremarkform.setValue({
					erm_id: '',
					erm_login_id: '',
					erm_type: 'student',
					erm_mark_obtained: '',
					erm_remark: ''
				});
			}
			if (this.parentremarkform) {
				this.parentremarkform.setValue({
					erm_id: '',
					erm_login_id: '',
					erm_type: 'parent',
					erm_mark_obtained: '',
					erm_remark: ''
				});
			}

		}

		if (managementRemark['finalRemark'] && this.finalremarksform) {
			this.finalremarksform.patchValue({
				au_final_remark: managementRemark['finalRemark']['au_final_remark'],
				au_is_eligible_adimission: managementRemark['finalRemark']['au_is_eligible_adimission'],
				au_process_class: managementRemark['finalRemark']['au_process_class']
			});
		} else {
			if (this.finalremarksform) {
				this.finalremarksform.patchValue({
					au_final_remark: '',
					au_is_eligible_adimission: '',
					au_process_class: ''
				});
			}
		}
	}

	prepareMarkSplitTable(markSplitData) {
		this.marksTableJson = markSplitData;
		this.markObjectLength = this.marksTableJson.length;
		const fGroupArr = [];
		for (let i = 0; i < markSplitData.length; i++) {
			const markFormControlArr = [];
			const inputJson = {};
			const formControlArr = [];
			for (let j = 0; j < markSplitData[i]['data'].length; j++) {
				const key = 'col' + j;
				inputJson[key] = markSplitData[i]['data'][j]['erms_value'];
			}
			fGroupArr.push(this.fbuild.group(inputJson));
		}

		// for(let k=0; k < fGroupArr.length; k++) {
		// 	const temp = <FormGroup>fGroupArr[k];
		// 	for (let l = 0; l < markSplitData[k]['data'].length; l++) {
		// 		const key = 'col' + l;
		// 		temp.patchValue({
		// 			au_final_remark: '',
		// 			au_is_eligible_adimission: '',
		// 			au_process_class: ''
		// 		});
		// 		temp.value[key]['erms_value'] = markSplitData[k]['data'][l]['erms_value'];
		// 	}
		// }

		this.dynamicMarksForm = fGroupArr;
	}

	getArea() {
		this.areaArray = [];
		this.sisService.getArea().subscribe((result: any) => {
			if (result.status === 'ok') {
				this.areaArray = result.data;
			}
		});
	}

	getauthority() {
		this.authorityArray = [];
		this.sisService.getAuthority().subscribe((result: any) => {
			if (result.status === 'ok') {
				this.authorityArray = result.data;
			}
		});
	}

	getClass() {
		this.classArray = [];
		this.sisService.getClass({}).subscribe((result: any) => {
			if (result) {
				this.classArray = result.data;
			}
		});
	}

	getAutName(id) {
		for (const item of this.authorityArray) {
			if (item.aut_id === id) {
				return item.aut_name;
			}
		}
	}

	getArName(id) {
		for (const item of this.areaArray) {
			if (item.ar_id === id) {
				return item.ar_name;
			}
		}
	}

	editForm() {
		this.viewOnly = false;
		this.editOnly = true;
		// this.context.studentdetails.viewOnly = false;
	}

	resetForm() {
		this.admissionremarkform.reset();
		this.studentremarkform.reset();
		this.parentremarkform.reset();
		this.finalremarksform.reset();
		this.concessionArray = [];
	}

	bindImageToForm(event) {
		const file = event.target.files[0];
		const fileReader = new FileReader();
		fileReader.onload = (e) => {
			this.uploadImage(file.name, fileReader.result);
		};
		fileReader.readAsDataURL(file);
	}

	uploadImage(fileName, au_profile_iamge) {
		this.sisService.uploadDocuments([
			{ fileName: fileName, imagebase64: au_profile_iamge, module: 'management' }]).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.defaultsrc = result.data[0].file_url;
					this.concessionremarksform.patchValue({
						documents: [{ erd_doc_name: result.data[0].file_name, erd_doc_link: result.data[0].file_url }]
					});
					this.defaultsrc = result.data[0].file_url;
					this.commonAPIService.showSuccessErrorMessage('File Uploaded Successfully', 'success');
				} else {
					this.commonAPIService.showSuccessErrorMessage('Error While Uploading File', 'error');
				}
			});
	}

	viewImage(imageLink) {
		this.dialogRef2 = this.dialog.open(PreviewDocumentComponent, {
			data: {
				imageArray: imageLink
			},
			height: '100vh',
			width: '100vh'
		});
	}

	triggerResize() {
		this.ngZone.onStable.pipe(take(1))
			.subscribe(() => this.autosize.resizeToFitContent(true));
	}

	// getConfigureSetting() {
	// 	this.sisService.getConfigureSetting({
	// 		cos_process_type: this.processtypeService.getProcesstype()
	// 	}).subscribe((result: any) => {
	// 		if (result.status === 'ok') {
	// 			this.savedSettingsArray = result.data;
	// 			for (const item of this.savedSettingsArray) {
	// 				if (item.cos_tb_id === '9') {
	// 					this.settingsArray.push({
	// 						cos_tb_id: item.cos_tb_id,
	// 						cos_ff_id: item.cos_ff_id,
	// 						cos_status: item.cos_status,
	// 						ff_field_name: item.ff_field_name
	// 					});
	// 				}
	// 			}
	// 		}
	// 	});
	// }

	checkIfFieldExist(value) {
		const findex = this.settingsArray.findIndex(f => f.ff_field_name === value);
		if (findex !== -1 && this.settingsArray[findex]['cos_status'] === 'Y') {
			return true;
		} else if (findex !== -1 && this.settingsArray[findex]['cos_status'] === 'N') {
			return false;
		} else {
			return false;
		}
	}

	resetAdmissionConcessionList() {
		this.concessionremarksform.reset();
	}
	capitalizeRemarks1($event) {
		let remark: any = '';
		for (let i = 0; i < $event.target.value.length; i++) {
			if (i === 0) {
				remark = $event.target.value.charAt(i).toUpperCase();
			} else {
				remark = remark + $event.target.value;
			}
		}
		this.admissionremarkform.patchValue({
			'erm_remark': remark
		});
	}
	capitalizeRemarks2($event) {
		let remark: any = '';
		for (let i = 0; i < $event.target.value.length; i++) {
			if (i === 0) {
				remark = $event.target.value.charAt(i).toUpperCase();
			} else {
				remark = remark + $event.target.value;
			}
		}
		this.studentremarkform.patchValue({
			'erm_remark': remark
		});
	}
	capitalizeRemarks3($event) {
		let remark: any = '';
		for (let i = 0; i < $event.target.value.length; i++) {
			if (i === 0) {
				remark = $event.target.value.charAt(i).toUpperCase();
			} else {
				remark = remark + $event.target.value;
			}
		}
		this.parentremarkform.patchValue({
			'erm_remark': remark
		});
	}
	capitalizeRemarks4($event) {
		let remark: any = '';
		for (let i = 0; i < $event.target.value.length; i++) {
			if (i === 0) {
				remark = $event.target.value.charAt(i).toUpperCase();
			} else {
				remark = remark + $event.target.value;
			}
		}
		this.finalremarksform.patchValue({
			'au_final_remark': remark
		});
	}

}

// export class ConfirmValidParentMatcher implements ErrorStateMatcher {
// 	isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
// 		return control && control.invalid && (control.dirty || control.touched || form.submitted);
// 	}
// }
