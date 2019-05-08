import { Component, OnInit, ViewChild, OnChanges } from '@angular/core';
import { SisService, CommonAPIService, ProcesstypeService } from '../../_services/index';
import { DynamicComponent } from '../../sharedmodule/dynamiccomponent';
import { DatePipe } from '@angular/common';
import { FormEnabledService } from '../../sharedmodule/dynamic-content/formEnabled.service';
@Component({
	selector: 'app-theme-two-tab-two-container',
	templateUrl: './theme-two-tab-two-container.component.html',
	styleUrls: ['./theme-two-tab-two-container.component.scss']
})
export class ThemeTwoTabTwoContainerComponent extends DynamicComponent implements OnInit, OnChanges {
	@ViewChild('edu') edu;
	@ViewChild('skill') skill;
	@ViewChild('doc') doc;
	addOnly = false;
	viewOnly = true;
	editOnly = false;
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
	finalArray: any[];
	parentId;
	editableStatus = '0';
	params: any[] = [];
	settingsArray: any[] = [];
	currentTab: number;
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
				// this.login_id = data.au_login_id;
				// this.editableStatus = data.editable_status;
				const processType = this.processtypeService.getProcesstype();
				// if (processType === '2' || processType === '3' || processType === '4' || processType === '5') {
				// 	this.getAdditionalDetails(this.login_id);
				// }
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
			// if (data && data.au_login_id) {
			// 	this.login_id = data.au_login_id;
			// 	this.editableStatus = data.editable_status;
			// 	const processType = this.processtypeService.getProcesstype();
			// 	if (processType === '2' || processType === '3' || processType === '4' || processType === '5') {
			// 		this.getAdditionalDetails(this.login_id);
			// 	}
			// 	if (processType === '2') {
			// 		this.parentId = '158';
			// 	}
			// 	if (processType === '3') {
			// 		this.parentId = '159';
			// 	}
			// 	if (processType === '4') {
			// 		this.parentId = '160';
			// 	}
			// 	if (processType === '5') {
			// 		this.parentId = '161';
			// 	}
			// }
			this.login_id = data.au_login_id;
			this.editableStatus = data.editable_status;
			if (this.currentTab === 1) {
				this.getAdditionalDetails(data.au_login_id);
			}
		});
		this.common.reRenderForm.subscribe((data: any) => {
			if (data && data.addMode) {
				this.viewOnly = false;
				this.addOnly = true;
				this.edu.previousEducations = [];
				this.doc.finalDocumentArray = [];
				this.skill.finalAwardArray = [];
				this.skill.finalSpannedArray = [];
				this.educationDetails = [];
				this.documentDetails = [];
				this.awardsDetails = [];
				this.awardsDetailsNew = [];
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
	ngOnChanges() {
		// if (this.viewOnly) {
		// 	this.getAdditionalDetails(this.login_id);
		// }
	}
	saveForm() {
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
				this.common.showSuccessErrorMessage('Additional Details Added Successfully', 'success');
				if (this.processtypeService.getProcesstype() === '2' || this.processtypeService.getProcesstype() === '5') {
					this.common.reRenderForm.next({ reRenderForm: true, addMode: false, editMode: false, deleteMode: false });
				} else {
					this.common.renderTab.next({ tabMove: true });
				}
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
		}
	}
	updateForm(isview) {
		const tabTwoJSON = {
			au_login_id: this.context.studentdetails.studentdetailsform.value.au_login_id,
			educationDetails: this.edu ? this.edu.previousEducations : [],
			documentDetails: this.doc ? this.doc.finalDocumentArray : [],
			awardsDetails: this.skill ? this.skill.finalAwardArray : []
		};
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
				this.common.showSuccessErrorMessage(result1.data, 'success');
				this.editOnly = false;
				this.getAdditionalDetails(this.context.studentdetails.studentdetailsform.value.au_login_id);
				if (isview) {
					this.common.reRenderForm.next({ viewMode: true, editMode: false, deleteMode: false, addMode: false });
				} else {
					this.common.renderTab.next({ tabMove: true });
				}
			} else {
				this.common.showSuccessErrorMessage(result1.data, 'error');
			}
		});
	}
	checkFormChangedValue() {
		this.awardsDetailsNew = [];
		this.educationDetailsNew = [];
		this.finalSibReqArray = [];
		this.finalSibReqArray2 = [];
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
									this.educationDetailsNew[i][key] = this.dateConversion(this.educationDetailsNew[i][key], 'd-MMM-y');
									this.educationDetailsNew[i][key] = this.dateConversion(this.educationDetailsNew[i][key], 'd-MMM-y');
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
				for (const sib of this.finalSibReqArray) {
					for (const titem of sib.item) {
						this.finalArray.push(titem);
					}
				}
				if (this.finalSibReqArray.length > 0) {
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
			}
		});
	}
	dateConversion(value, format) {
		const datePipe = new DatePipe('en-in');
		return datePipe.transform(value, format);
	}
	editConfirm() { }
}
