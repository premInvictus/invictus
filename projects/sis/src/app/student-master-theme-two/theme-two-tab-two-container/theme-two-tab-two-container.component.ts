import { Component, OnInit, ViewChild, OnChanges } from '@angular/core';
import { SisService, CommonAPIService, ProcesstypeService } from '../../_services/index';
import { DynamicComponent } from '../../sharedmodule/dynamiccomponent';
import { DatePipe } from '@angular/common';
import { FormEnabledService } from '../../sharedmodule/dynamic-content/formEnabled.service';
import { AccountDetailsThemeTwoComponent } from '../account-details-theme-two/account-details-theme-two.component';
import { FormControl } from '@angular/forms';
import { saveAs } from 'file-saver';
@Component({
	selector: 'app-theme-two-tab-two-container',
	templateUrl: './theme-two-tab-two-container.component.html',
	styleUrls: ['./theme-two-tab-two-container.component.scss']
})
export class ThemeTwoTabTwoContainerComponent extends DynamicComponent implements OnInit, OnChanges {
	@ViewChild('edu') edu;
	@ViewChild('skill') skill;
	@ViewChild('doc') doc;
	@ViewChild('account') account: AccountDetailsThemeTwoComponent;
	addOnly = false;
	viewOnly = true;
	editOnly = false;
	disabledApiCall = false;
	educationDetails: any[] = [];
	educationDetailsNew: any[] = [];
	awardsDetails: any[] = [];
	awardsDetailsNew: any[] = [];
	documentDetails: any[] = [];
	login_id: any;
	saveFlag = false;
	editRequestFlag = false;
	@ViewChild('editReference') editReference;
	reqObj: any = {};
	finalSibReqArray: any[];
	finalSibReqArray2: any[];
	finalSibReqArray3: any[] = [];
	finalArray: any[];
	parentId;
	editableStatus = '0';
	params: any[] = [];
	settingsArray: any[] = [];
	currentTab: number;
	accountDetails: any = {};
	constructor(private sisService: SisService,
		public common: CommonAPIService,
		private processtypeService: ProcesstypeService,
		private formEnabledService: FormEnabledService) { super(); }

	ngOnInit() {
		this.settingsArray = this.context.configSetting;
		this.common.tabChange.subscribe((data: any) => {
			this.currentTab = data.currrentTab;
			if (data && (data.currrentTab === 1)) {
				this.getAdditionalDetails(this.context.studentdetails.studentdetailsform.value.au_login_id);
				this.getFeeAccount(this.context.studentdetails.studentdetailsform.value.au_login_id);
				const processType = this.processtypeService.getProcesstype();
				if (processType === '1') {
					this.parentId = '157';
				}
				if (processType === '2') {
					this.parentId = '158';
				}
				if (processType === '3') {
					this.parentId = '159';
				}
				if (processType === '4') {
					this.parentId = '160';
				}
				if (processType === '5') {
					this.parentId = '161';
				}
			}
		});
		this.common.studentData.subscribe((data: any) => {
			this.login_id = data.au_login_id;
			this.editableStatus = data.editable_status;
			if (this.currentTab === 1) {
				this.getAdditionalDetails(data.au_login_id);
				this.getFeeAccount(data.au_login_id);
			}
		});
		this.common.reRenderForm.subscribe((data: any) => {
			if (data && data.addMode) {
				this.viewOnly = false;
				this.addOnly = true;
				if (this.edu) {
					this.edu.previousEducations = [];
				}
				if (this.doc) {
					this.doc.finalDocumentArray = [];
				}

				if (this.skill) {
					this.skill.finalAwardArray = [];
					this.skill.finalSpannedArray = [];
				}
				this.educationDetails = [];
				this.documentDetails = [];
				this.awardsDetails = [];
				this.awardsDetailsNew = [];
				this.accountDetails = {};

				if (this.account) {
					this.account.accountsForm.reset();
				}
			}
			if (data && data.viewMode) {
				this.viewOnly = true;
				this.addOnly = false;
				this.editOnly = false;
				this.saveFlag = false;
				this.editRequestFlag = false;
			}
			if (data && data.editMode) {
				this.viewOnly = false;
				this.saveFlag = true;
			}
		});
	}
	ngOnChanges() { }
	saveForm() {
		this.disabledApiCall = true;
		for (const item of this.educationDetails) {
			item.eed_login_id = this.context.studentdetails.studentdetailsform.value.au_login_id;
		}
		const tabTwoJSON = {
			au_login_id: this.context.studentdetails.studentdetailsform.value.au_login_id,
			educationDetails: this.edu ? this.edu.previousEducations : [],
			documentDetails: this.doc ? this.doc.finalDocumentArray : [],
			awardsDetails: this.skill ? this.skill.finalAwardArray : []
		};
		this.sisService.addAdditionalDetails(tabTwoJSON).subscribe((result: any) => {
			if (result.status === 'ok') {
				if (this.common.isExistUserAccessMenuByLabel(this.parentId, 'Accounts')) {
					this.disabledApiCall = false;
					this.account.submit();
				}
				this.common.showSuccessErrorMessage('Additional Details Added Successfully', 'success');
				const invoiceJSON = { login_id: [this.context.studentdetails.studentdetailsform.value.au_login_id] };
				if (this.processtypeService.getProcesstype() === '2' ||
					this.processtypeService.getProcesstype() === '3' || this.processtypeService.getProcesstype() === '4') {
					this.sisService.insertInvoice(invoiceJSON).subscribe((result2: any) => {
						if (result2.data && result2.status === 'ok') {
							const length = result2.data.split('/').length;
							saveAs(result2.data, result2.data.split('/')[length - 1]);
						}
					});
				}
				if (this.processtypeService.getProcesstype() === '1' ||
					this.processtypeService.getProcesstype() === '2' || this.processtypeService.getProcesstype() === '5') {
					this.common.reRenderForm.next({ reRenderForm: true, viewMode: true, editMode: false, deleteMode: false, addMode: false });
				} else {
					this.common.renderTab.next({ tabMove: true });
				}
			} else {
				this.disabledApiCall = false;
			}
		});
	}
	openEditDialog = (data) => this.editReference.openModal(data);
	getAdditionalDetails(login_id) {
		this.educationDetails = [];
		this.documentDetails = [];
		this.awardsDetails = [];
		this.awardsDetailsNew = [];
		this.sisService.getAdditionalDetails({ au_login_id: login_id }).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.educationDetails = result.data[0].educationDetails;
				this.awardsDetails = result.data[0].awardsDetails;
				this.documentDetails = result.data[0].documentDetails;
			}
		});
	}
	getFeeAccount(au_login_id) {
		this.accountDetails = {};
		if (au_login_id && au_login_id !== '0') {
			this.sisService.getFeeAccount({ accd_login_id: au_login_id }).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.accountDetails = result.data[0];
				}
			});
		}
	}
	isExistUserAccessMenu(actionT) {
		return this.context.studentdetails.isExistUserAccessMenu(actionT);
	}
	editRequest() {
		this.viewOnly = false;
		this.editOnly = false;
		this.editRequestFlag = true;
		this.saveFlag = false;
	}
	cancelForm() {
		if (this.addOnly) {
			this.common.reRenderForm.next({ reRenderForm: true, viewMode: true, editMode: false, deleteMode: false, addMode: false });
		} else if (this.saveFlag || this.editRequestFlag) {
			this.common.reRenderForm.next({ viewMode: true, editMode: false, deleteMode: false, addMode: false });
			this.getAdditionalDetails(this.context.studentdetails.studentdetailsform.value.au_login_id);
			this.getFeeAccount(this.context.studentdetails.studentdetailsform.value.au_login_id);
		}
	}
	updateForm(isview) {
		const tabTwoJSON = {
			au_login_id: this.context.studentdetails.studentdetailsform.value.au_login_id,
			educationDetails: this.edu ? this.edu.previousEducations : [],
			documentDetails: this.doc ? this.doc.finalDocumentArray : [],
			awardsDetails: this.skill ? this.skill.finalAwardArray : []
		};
		if (this.account.formValidation()) {
			if (this.context.studentdetails.studentdetailsform.valid) {
				this.sisService.addStudentInformation(this.context.studentdetails.studentdetailsform.value).subscribe((result1: any) => {
					if (result1.status === 'ok') {
					} else {
						this.common.showSuccessErrorMessage(result1.data, 'error');
					}
				});
			}
			this.sisService.addAdditionalDetails(tabTwoJSON).subscribe((result1: any) => {
				if (result1.status === 'ok') {
					if (this.accountDetails && this.common.isExistUserAccessMenuByLabel(this.parentId, 'Accounts')) {
						this.account.update();
					} else if (!this.accountDetails && this.common.isExistUserAccessMenuByLabel(this.parentId, 'Accounts')) {
						this.account.submit();
					}
					this.common.showSuccessErrorMessage(result1.data, 'success');
					this.editOnly = false;
					this.getAdditionalDetails(this.context.studentdetails.studentdetailsform.value.au_login_id);
					this.getFeeAccount(this.context.studentdetails.studentdetailsform.value.au_login_id);
					if (isview) {
						this.common.reRenderForm.next({ viewMode: true, editMode: false, deleteMode: false, addMode: false });
					} else {
						this.common.renderTab.next({ tabMove: true });
					}
				} else {
					this.common.showSuccessErrorMessage(result1.data, 'error');
				}
			});
		} else {
			this.common.showSuccessErrorMessage('Please fill all required field', 'error');
		}
	}
	checkFormChangedValue() {
		this.awardsDetailsNew = [];
		this.educationDetailsNew = [];
		this.finalSibReqArray = [];
		this.finalSibReqArray2 = [];
		this.finalSibReqArray3 = [];
		this.finalArray = [];
		let param: any = {};
		this.sisService.getAdditionalDetails({
			au_login_id: this.context.studentdetails.studentdetailsform.value.au_login_id
		}).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.educationDetailsNew = result.data[0].educationDetails;
				this.awardsDetailsNew = result.data[0].awardsDetails;
				const datepipe = new DatePipe('en-US');
				let i = 0;
				for (const item of this.edu.previousEducations) {
					if (item.eaw_id === '') {
						const sibReqArray: any[] = [];
						const fieldArray: any[] = [];
						const oldFieldValue: any[] = [];
						const newFieldValue: any[] = [];
						Object.keys(this.edu.previousEducations[i]).forEach(key => {
							if (key !== 'eed_id' && key !== 'eed_login_id'
								&& key !== 'eed_status') {
								fieldArray.push(key);
								oldFieldValue.push('');
								newFieldValue.push(this.edu.previousEducations[i][key]);
							}
						});
						sibReqArray.push({
							rff_where_id: 'eed_id',
							rff_where_value: '',
							rff_field_name: fieldArray,
							rff_new_field_value: newFieldValue,
							rff_old_field_value: oldFieldValue,
						});
						this.finalSibReqArray.push({ item: sibReqArray });
					} else {
						const sibReqArray: any[] = [];
						Object.keys(this.edu.previousEducations[i]).forEach((key: any) => {
							if (key !== 'eed_id' && key !== 'eed_login_id'
								&& key !== 'eed_status') {
								if (key === 'eed_joining_from' || key === 'eed_joining_to') {
									this.educationDetailsNew[i][key] = this.dateConversion(this.educationDetailsNew[i][key], 'yyyy-MM-dd');
									this.edu.previousEducations[i][key] = this.dateConversion(this.edu.previousEducations[i][key], 'yyyy-MM-dd');
								}
								if (this.edu.previousEducations[i][key] !== this.educationDetailsNew[i][key]) {
									sibReqArray.push({
										rff_where_id: 'eaw_id',
										rff_where_value: this.edu.previousEducations[i]['eaw_id'],
										rff_field_name: key,
										rff_new_field_value: this.edu.previousEducations[i][key],
										rff_old_field_value: this.educationDetailsNew[i][key],
									});
								}
							}
						});
						this.finalSibReqArray.push({ item: sibReqArray });
					}
					i++;
				}
				console.log(this.finalSibReqArray);
				for (const sib of this.finalSibReqArray) {
					for (const titem of sib.item) {
						this.finalArray.push(titem);
					}
				}
				if (this.finalSibReqArray.length > 0 && this.finalArray.length > 0) {
					param.req_login_id = this.login_id;
					param.req_process_type = this.context.processType;
					param.req_tab_id = '5';
					param.req_priority = '';
					param.req_remarks = '';
					param.req_reason = '';
					param.req_date = datepipe.transform(new Date, 'yyyy-MM-dd');
					param.req_param = [];
					this.params.push(param);
				} else {
					param = {};
				}
				let param2: any = {};
				let n = 0;
				for (const item of this.skill.finalAwardArray) {
					if (item.eaw_id === '') {
						const sibReqArray: any[] = [];
						const fieldArray: any[] = [];
						const oldFieldValue: any[] = [];
						const newFieldValue: any[] = [];
						Object.keys(this.skill.finalAwardArray[n]).forEach(key => {
							if (key !== 'eaw_id' && key !== 'eaw_login_id'
								&& key !== 'eaw_status' && key !== 'eaw_ses_id') {
								fieldArray.push(key);
								oldFieldValue.push('');
								newFieldValue.push(this.skill.finalAwardArray[n][key]);
							}
						});
						sibReqArray.push({
							rff_where_id: 'eaw_id',
							rff_where_value: '',
							rff_field_name: fieldArray,
							rff_new_field_value: newFieldValue,
							rff_old_field_value: oldFieldValue,
						});
						this.finalSibReqArray2.push({ item: sibReqArray });
					} else {
						const sibReqArray: any[] = [];
						Object.keys(this.skill.finalAwardArray[n]).forEach((key: any) => {
							if (key !== 'eaw_id' && key !== 'eaw_login_id'
								&& key !== 'eaw_status' && key !== 'eaw_ses_id') {
								if (this.skill.finalAwardArray[n][key] !== this.awardsDetailsNew[n][key]) {
									sibReqArray.push({
										rff_where_id: 'eaw_id',
										rff_where_value: this.skill.finalAwardArray[n]['eaw_id'],
										rff_field_name: key,
										rff_new_field_value: this.skill.finalAwardArray[n][key],
										rff_old_field_value: this.awardsDetailsNew[n][key],
									});
								}
							}
						});
						this.finalSibReqArray2.push({ item: sibReqArray });
					}
					n++;
				}
				for (const sib of this.finalSibReqArray2) {
					for (const titem of sib.item) {
						this.finalArray.push(titem);
					}
				}
				if (this.finalSibReqArray2.length > 0) {
					param2.req_login_id = this.login_id;
					param2.req_process_type = this.context.processType;
					param2.req_tab_id = '6';
					param2.req_priority = '';
					param2.req_remarks = '';
					param2.req_reason = '';
					param2.req_date = datepipe.transform(new Date, 'yyyy-MM-dd');
					param2.req_param = [];
					this.params.push(param2);
				} else {
					param2 = {};
				}
				let param3: any = {};
				const sibReqArray3: any[] = [];
				Object.keys(this.account.accountsForm.value).forEach((key: any) => {
					const formControl = <FormControl>this.account.accountsForm.controls[key];
					if (formControl.dirty) {
						if (key === 'accd_transport_from' || key === 'accd_transport_to'
							|| key === 'accd_hostel_to' || key === 'accd_hostel_from') {
							sibReqArray3.push({
								rff_where_id: 'accd_id',
								rff_where_value: this.accountDetails['accd_id'],
								rff_field_name: key,
								rff_new_field_value: new DatePipe('en-in').transform(formControl.value, 'yyyy-MM-dd'),
								rff_old_field_value: this.accountDetails[key],
							});
						}
						if (key === 'accd_is_terminate' || key === 'accd_is_transport'
							|| key === 'accd_is_hostel' || key === 'accd_is_hostel_terminate') {
							sibReqArray3.push({
								rff_where_id: 'accd_id',
								rff_where_value: this.accountDetails['accd_id'],
								rff_field_name: key,
								rff_new_field_value: formControl.value ? 'Y' : 'N',
								rff_old_field_value: this.accountDetails[key],
							});
						} else {
							sibReqArray3.push({
								rff_where_id: 'accd_id',
								rff_where_value: this.accountDetails['accd_id'],
								rff_field_name: key,
								rff_new_field_value: formControl.value,
								rff_old_field_value: this.accountDetails[key],
							});
						}
					}
				});
				this.finalSibReqArray3.push({ item: sibReqArray3 });
				for (const sib of this.finalSibReqArray3) {
					for (const titem of sib.item) {
						this.finalArray.push(titem);
					}
				}
				if (this.finalSibReqArray3.length > 0) {
					param3.req_login_id = this.login_id;
					param3.req_process_type = this.context.processType;
					param3.req_tab_id = '4';
					param3.req_priority = '';
					param3.req_remarks = '';
					param3.req_reason = '';
					param3.req_date = datepipe.transform(new Date, 'yyyy-MM-dd');
					param3.req_param = [];
					this.params.push(param3);
				} else {
					param3 = {};
				}
			}
		});
	}
	dateConversion(value, format) {
		const datePipe = new DatePipe('en-in');
		return datePipe.transform(value, format);
	}
	editConfirm() { }
}
