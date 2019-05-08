import { Component, OnInit, OnChanges, ViewChild, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { SisService, CommonAPIService, ProcesstypeService } from '../../_services/index';
import { DynamicComponent } from '../../sharedmodule/dynamiccomponent';
import { DatePipe } from '@angular/common';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { FormEnabledService } from '../../sharedmodule/dynamic-content/formEnabled.service';
import { PreviewDocumentComponent } from '../documents/preview-document/preview-document.component';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { take } from 'rxjs/operators';
import { ErrorStateMatcher } from '@angular/material';
import { ConfirmValidParentMatcher } from '../../ConfirmValidParentMatcher';

@Component({
	selector: 'app-parent-general-remarks',
	templateUrl: './parent-general-remarks.component.html',
	styleUrls: ['./parent-general-remarks.component.scss']
})
export class ParentGeneralRemarksComponent extends DynamicComponent implements OnInit, OnChanges {
	confirmValidParentMatcher = new ConfirmValidParentMatcher();
	dialogRef2: MatDialogRef<PreviewDocumentComponent>;
	@ViewChild('autosize') autosize: CdkTextareaAutosize;
	@ViewChild('picker') picker;
	events: string[] = [];
	mtremark: any;
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
	addOnly = false;
	viewOnly = false;
	editOnly = false;
	editFlag = false;
	saveFlag = false;
	editList = false;
	editlist = false;
	updateIndex;
	managementform: any = {};
	minDate = new Date();
	defaultsrc = '';
	checkChangedFieldsArray: any[] = [];
	savedSettingsArray: any[] = [];
	settingsArray: any[] = [];

	constructor(
		private fbuild: FormBuilder,
		private sisService: SisService,
		private commonAPIService: CommonAPIService,
		private processtypeService: ProcesstypeService,
		private formEnabledService: FormEnabledService,
		private dialog: MatDialog,
		private ngZone: NgZone
	) { super(); }

	ngOnInit() {
		this.buildForm();
		this.getauthority();
		this.getArea();
		this.getClass();
		this.commonAPIService.studentData.subscribe((data: any) => {
			if (data && data.au_login_id) {
				this.login_id = data.au_login_id;
				// this.getManagementRemarks(this.login_id);
				const processType = this.processtypeService.getProcesstype();
				if (processType === '2' || processType === '3' || processType === '4') {
					this.getManagementRemarks(this.login_id);
				}

			}
		});
		this.commonAPIService.reRenderForm.subscribe((data: any) => {
			if (data && data.addMode) {
				this.buildForm();
				this.viewOnly = false;
				this.addOnly = true;
			}
			if (data && data.viewMode) {
				this.viewOnly = true;
				this.addOnly = false;
				this.editOnly = false;
				this.saveFlag = false;
				this.commonAPIService.studentData.next(this.context.studentdetails.studentdetailsform.value.au_enrollment_id);
			}
			if (data && data.editMode) {
				this.viewOnly = false;
				this.saveFlag = true;
			}
		});
		this.getConfigureSetting();
	}
	ngOnChanges() {
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
	updateForm(isview) {
		if (this.studentremarkform.valid && this.admissionremarkform.valid && this.parentremarkform.valid && this.finalremarksform.valid) {
			for (const item of this.concessionArray) {
				item.era_doj = this.dateConverion(item.era_doj);
			}
			this.managementform.login_id = this.context.studentdetails.studentdetailsform.value.au_login_id;
			this.managementform.managementRemarks = this.concessionArray;
			this.admissionremarkform.value.erm_type = 'admission';
			this.studentremarkform.value.erm_type = 'student';
			this.parentremarkform.value.erm_type = 'parent';
			this.managementform.marks = [this.admissionremarkform.value, this.studentremarkform.value, this.parentremarkform.value];
			this.managementform.finalRemark = [this.finalremarksform.value];
			if (this.context.studentdetails.studentdetailsform.valid) {
				this.context.studentdetails.studentdetailsform.value.au_process_type = this.context.processType;
				this.sisService.updateStudentDetails(this.context.studentdetails.studentdetailsform.value).subscribe((result1: any) => {
					if (result1.status === 'ok') {
					}
				});
			}
			this.sisService.updateManagementRemarks(this.managementform).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.commonAPIService.showSuccessErrorMessage('Remarks Updated Successfully', 'success');
					this.getManagementRemarks(this.context.studentdetails.studentdetailsform.value.au_login_id);
					if (isview) {
						this.commonAPIService.reRenderForm.next({ viewMode: true, editMode: false, deleteMode: false, addMode: false });
					}
				} else {
					this.commonAPIService.showSuccessErrorMessage(result.data, 'error');
				}
			});
		} else {
			this.commonAPIService.showSuccessErrorMessage('Please fill all required fields', 'error');
		}

	}
	saveForm() {
		if (this.studentremarkform.valid && this.admissionremarkform.valid && this.parentremarkform.valid && this.finalremarksform.valid) {
			for (const item of this.concessionArray) {
				item.era_doj = this.dateConverion(item.era_doj);
			}
			this.managementform.login_id = this.context.studentdetails.studentdetailsform.value.au_login_id;
			this.managementform.managementRemarks = this.concessionArray;
			this.managementform.marks = [this.admissionremarkform.value, this.studentremarkform.value, this.parentremarkform.value];
			this.managementform.finalRemark = [this.finalremarksform.value];
			if (this.context.studentdetails.studentdetailsform.valid) {
				this.context.studentdetails.studentdetailsform.value.au_process_type = this.context.processType;
				this.sisService.updateStudentDetails(this.context.studentdetails.studentdetailsform.value).subscribe((result1: any) => {
					if (result1.status === 'ok') {
					}
				});
			}
			this.sisService.insertManagementRemarks(this.managementform).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.commonAPIService.showSuccessErrorMessage('Inserted Successfully', 'success');
					if (this.processtypeService.getProcesstype() === '2') {
						this.commonAPIService.reRenderForm.next({ reRenderForm: true, addMode: false, editMode: false, deleteMode: false });
					} else {
						this.commonAPIService.renderTab.next({ tabMove: true });
					}
				} else {
					this.commonAPIService.showSuccessErrorMessage(result.data, 'error');
				}
			});
		} else {
			this.commonAPIService.showSuccessErrorMessage('Please fill all required fields', 'error');
		}
	}
	dateConverion(value) {
		const datePipe = new DatePipe('en-US');
		return datePipe.transform(value, 'yyyy-MM-dd');
	}
	getManagementRemarks(login_id) {
		if (login_id) {
			this.sisService.getManagementRemarks({ login_id: login_id, era_type: 'management' }).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.mtremark = result.data[0];
					this.patchMtRemarks(result.data[0]);
					/* const managementRemark = result.data[0];
          this.concessionArray = managementRemark.managementRemarks;
          if (managementRemark.marks.length > 0) {
            managementRemark.marks.forEach(element => {
              if (element.erm_type === 'admission') {
                this.admissionremarkform.setValue({
                  erm_id: element.erm_id,
                  erm_login_id: element.erm_login_id,
                  erm_type: element.erm_type,
                  erm_mark_obtained: element.erm_mark_obtained,
                  erm_remark: element.erm_remark
                });
              } else if (element.erm_type === 'student') {
                this.studentremarkform.setValue({
                  erm_id: element.erm_id,
                  erm_login_id: element.erm_login_id,
                  erm_type: element.erm_type,
                  erm_mark_obtained: element.erm_mark_obtained,
                  erm_remark: element.erm_remark
                });
              } else if (element.erm_type === 'parent') {
                this.parentremarkform.setValue({
                  erm_id: element.erm_id,
                  erm_login_id: element.erm_login_id,
                  erm_type: element.erm_type,
                  erm_mark_obtained: element.erm_mark_obtained,
                  erm_remark: element.erm_remark
                });
              }
            });
          }
          this.finalremarksform.patchValue({
            au_final_remark: managementRemark.finalRemark[0].au_final_remark,
            au_is_eligible_adimission: managementRemark.finalRemark[0].au_is_eligible_adimission,
            au_process_class: managementRemark.finalRemark[0].au_process_class
          }); */
				} else if (result.status === 'error') {
					this.resetForm();
				}
			});
		}
	}
	patchMtRemarks(mtRemark) {
		const managementRemark = mtRemark;
		this.concessionArray = managementRemark.managementRemarks;
		if (managementRemark.marks.length > 0) {
			managementRemark.marks.forEach(element => {
				if (element.erm_type === 'admission') {
					this.admissionremarkform.setValue({
						erm_id: element.erm_id,
						erm_login_id: element.erm_login_id,
						erm_type: element.erm_type,
						erm_mark_obtained: element.erm_mark_obtained,
						erm_remark: element.erm_remark
					});
				} else if (element.erm_type === 'student') {
					this.studentremarkform.setValue({
						erm_id: element.erm_id,
						erm_login_id: element.erm_login_id,
						erm_type: element.erm_type,
						erm_mark_obtained: element.erm_mark_obtained,
						erm_remark: element.erm_remark
					});
				} else if (element.erm_type === 'parent') {
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
			this.admissionremarkform.setValue({
				erm_id: '',
				erm_login_id: '',
				erm_type: 'admission',
				erm_mark_obtained: '',
				erm_remark: ''
			});
			this.studentremarkform.setValue({
				erm_id: '',
				erm_login_id: '',
				erm_type: 'student',
				erm_mark_obtained: '',
				erm_remark: ''
			});
			this.parentremarkform.setValue({
				erm_id: '',
				erm_login_id: '',
				erm_type: 'parent',
				erm_mark_obtained: '',
				erm_remark: ''
			});
		}
		if (managementRemark.finalRemark.length > 0) {
			this.finalremarksform.patchValue({
				au_final_remark: managementRemark.finalRemark[0].au_final_remark,
				au_is_eligible_adimission: managementRemark.finalRemark[0].au_is_eligible_adimission,
				au_process_class: managementRemark.finalRemark[0].au_process_class
			});
		} else {
			this.finalremarksform.patchValue({
				au_final_remark: '',
				au_is_eligible_adimission: '',
				au_process_class: ''
			});
		}
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
		this.context.studentdetails.viewOnly = false;
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
				}
			});
	}
	viewImage(imageLink) {
		this.dialogRef2 = this.dialog.open(PreviewDocumentComponent, {
			data: {
				imageArray: imageLink
			},
			height: '70vh',
			width: '70vh'
		});
	}
	editRequest() {
		this.checkChangedFieldsArray = [];
		const param: any = {};
		if (this.studentremarkform.dirty) {
			Object.keys(this.studentremarkform.controls).forEach((keys) => {
				const tablePrefix = keys.split('_', 1);
				const tableKey = tablePrefix[0] + '_id';
				const tableKeyValue = this.studentremarkform.value[tableKey];
				const formControl = <FormControl>this.studentremarkform.controls[keys];
				if (formControl.dirty) {
					this.checkChangedFieldsArray.push(
						{
							id: tableKey,
							value: tableKeyValue,
							field_name: keys,
							field_value: formControl.value
						});
				}
			});
		}
		if (this.parentremarkform.dirty) {
			Object.keys(this.parentremarkform.controls).forEach((keys) => {
				const tablePrefix = keys.split('_', 1);
				const tableKey = tablePrefix[0] + '_id';
				const tableKeyValue = this.parentremarkform.value[tableKey];
				const formControl = <FormControl>this.parentremarkform.controls[keys];
				if (formControl.dirty) {
					this.checkChangedFieldsArray.push(
						{
							id: tableKey,
							value: tableKeyValue,
							field_name: keys,
							field_value: formControl.value
						});
				}
			});
		}
		if (this.admissionremarkform.dirty) {
			Object.keys(this.admissionremarkform.controls).forEach((keys) => {
				const tablePrefix = keys.split('_', 1);
				const tableKey = tablePrefix[0] + '_id';
				const tableKeyValue = this.admissionremarkform.value[tableKey];
				const formControl = <FormControl>this.admissionremarkform.controls[keys];
				if (formControl.dirty) {
					this.checkChangedFieldsArray.push(
						{
							id: tableKey,
							value: tableKeyValue,
							field_name: keys,
							field_value: formControl.value
						});
				}
			});
		}
		if (this.finalremarksform.dirty) {
			Object.keys(this.finalremarksform.controls).forEach((keys) => {
				const tablePrefix = keys.split('_', 1);
				const tableKey = tablePrefix[0] + '_id';
				const tableKeyValue = this.finalremarksform.value[tableKey];
				const formControl = <FormControl>this.finalremarksform.controls[keys];
				if (formControl.dirty) {
					this.checkChangedFieldsArray.push(
						{
							id: tableKey,
							value: tableKeyValue,
							field_name: keys,
							field_value: formControl.value
						});
				}
			});
		}
		if (this.checkChangedFieldsArray.length > 0) {
			param.req_login_id = this.context.studentdetails.studentdetailsform.value.au_login_id;
			param.req_process_type = this.context.processType;
			param.req_tab_id = this.formEnabledService.getTabid('Student Details');
			param.req_priority = 'high';
			const datepipe = new DatePipe('en-US');
			param.req_date = datepipe.transform(new Date, 'yyyy-MM-dd');
			param.req_param = JSON.stringify(this.checkChangedFieldsArray);
			this.sisService.insertEditRequest(param).subscribe((result: any) => {
				if (result.status === 'ok') {
				}
			});
		}
	}
	triggerResize() {
		this.ngZone.onStable.pipe(take(1))
			.subscribe(() => this.autosize.resizeToFitContent(true));
	}
	cancelForm() {
		if (this.addOnly) {
			this.commonAPIService.reRenderForm.next({ reRenderForm: true, viewMode: true, editMode: false, deleteMode: false, addMode: false });
		} else if (this.saveFlag) {
			this.getManagementRemarks(this.login_id);
			this.commonAPIService.reRenderForm.next({ viewMode: true, editMode: false, deleteMode: false, addMode: false });
		}
	}
	getConfigureSetting() {
		this.sisService.getConfigureSetting({
			cos_process_type: this.processtypeService.getProcesstype()
		}).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.savedSettingsArray = result.data;
				for (const item of this.savedSettingsArray) {
					if (item.cos_tb_id === '9') {
						this.settingsArray.push({
							cos_tb_id: item.cos_tb_id,
							cos_ff_id: item.cos_ff_id,
							cos_status: item.cos_status,
							ff_field_name: item.ff_field_name
						});
					}
				}
			}
		});
	}
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
}
// export class ConfirmValidParentMatcher implements ErrorStateMatcher {
// 	isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
// 		return control && control.invalid && (control.dirty || control.touched || form.submitted);
// 	}
// }
