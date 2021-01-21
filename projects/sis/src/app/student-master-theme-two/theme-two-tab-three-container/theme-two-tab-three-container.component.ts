import { Component, OnInit, ViewChild, OnChanges } from '@angular/core';
import { SisService, CommonAPIService, ProcesstypeService } from '../../_services/index';
import { DynamicComponent } from '../../sharedmodule/dynamiccomponent';
import { saveAs } from 'file-saver';
@Component({
	selector: 'app-theme-two-tab-three-container',
	templateUrl: './theme-two-tab-three-container.component.html',
	styleUrls: ['./theme-two-tab-three-container.component.scss']
})
export class ThemeTwoTabThreeContainerComponent extends DynamicComponent implements OnInit, OnChanges {

	@ViewChild('general_remark') general_remark;
	@ViewChild('management_remark') management_remark;
	@ViewChild('admission_remark') admission_remark;

	addOnly = false;
	editOnly = false;
	viewOnly = true;
	saveFlag = false;
	isSubmit = false;
	disabledApiCall = false;
	login_id;
	parentId;
	generalRemarkData: any[] = [];
	admissionRemarkData: any;
	managementRemarkData: any;
	settingsArray: any[] = [];
	currentTab: number;
	constructor(public commonAPIService: CommonAPIService,
		private sisService: SisService,
		private processTypeService: ProcesstypeService) {

		super();
	}

	ngOnInit() {
		this.settingsArray = this.context.configSetting;
		this.commonAPIService.studentData.subscribe((data: any) => {
			if (data && data.au_login_id) {
				if (this.currentTab === 2) {
					this.getRemarkData(data.au_login_id);
				}
			}
			// 	const processType = this.processTypeService.getProcesstype();
			// 	if (processType === '3' || processType === '4') {
			// 		this.getRemarkData(this.login_id);
			// 	}
			// 	if (processType === '3') {
			// 		this.parentId = '159';
			// 	}
			// 	if (processType === '4') {
			// 		this.parentId = '160';
			// 	}
			// } 

		});

		this.commonAPIService.reRenderForm.subscribe((data: any) => {
			if (data && data.addMode) {
				this.viewOnly = false;
				this.addOnly = true;
				this.generalRemarkData = [];
				this.managementRemarkData = [];
				this.admissionRemarkData = [];
			}
			if (data && data.viewMode) {
				this.viewOnly = true;
				this.addOnly = false;
				this.editOnly = false;
				this.saveFlag = false;
			}
			if (data && data.editMode) {
				this.viewOnly = false;
				this.saveFlag = true;
				this.editOnly = true;
			}
		});

		this.commonAPIService.tabChange.subscribe((data: any) => {
			this.currentTab = data.currrentTab;
			if (data && (data.currrentTab === 2)) {
				// this.login_id = data.au_login_id;
				const processType = this.processTypeService.getProcesstype();
				if (processType === '1' || processType === '2' || processType === '3' || processType === '4') {
					this.getRemarkData(this.context.studentdetails.studentdetailsform.value.au_login_id);
				}
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
			}
		});
	}

	ngOnChanges() {
		// this.getRemarkData(this.login_id);
	}

	getRemarkData(login_id) {
		this.generalRemarkData = [];
		this.managementRemarkData = [];
		this.admissionRemarkData = [];
		if (login_id) {
			this.sisService.getStudentRemarkDataThemeTwo({ au_login_id: login_id, class_id: this.context.studentdetails.studentdetailsform.value.au_class_id }).subscribe((result: any) => {
				if (result.status === 'ok') {
					const remarkData = result.data;
					this.generalRemarkData = remarkData[0]['remarksGeneral'];
					this.managementRemarkData = remarkData[0]['remarksManagement'];
					this.admissionRemarkData = remarkData[0]['remarkAdmission'];
				}
			});
		}
	}

	saveForm() {
		const generalRemarkFormData = this.getGeneralRemarkFormData();
		const managementRemarkFormData = this.getManagementRemarkFormData();
		const admissionRemarkFormData = this.getAdmissionRemarkFormData();
		const remarkQuestionData = [];
		const markSplitData = this.prepareMarkSplitData();
		if (admissionRemarkFormData && admissionRemarkFormData['admissionRemarkFieldData']) {
			for (let i = 0; i < admissionRemarkFormData['admissionRemarkFieldData'].length; i++) {
				remarkQuestionData.push(admissionRemarkFormData['admissionRemarkFieldData'][i]);
			}
		}

		const remarkJson = {
			'au_login_id': this.context.studentdetails.studentdetailsform.value.au_login_id ?
				this.context.studentdetails.studentdetailsform.value.au_login_id : '',
			'remarksGeneral': generalRemarkFormData ? generalRemarkFormData : [],
			'remarksManagement': {
				'managementRemarks': managementRemarkFormData['concessionFormData'] ? managementRemarkFormData['concessionFormData'] : {},
				'finalRemark': managementRemarkFormData['finalRemarkData'] ? managementRemarkFormData['finalRemarkData'] : {},
				'remarksMarks': [
					managementRemarkFormData['admissionRemarkData'] ? managementRemarkFormData['admissionRemarkData'] : {},
					managementRemarkFormData['studentRemarkData'] ? managementRemarkFormData['studentRemarkData'] : {},
					managementRemarkFormData['parentRemarkData'] ? managementRemarkFormData['parentRemarkData'] : {}
				],
				'markSplit': markSplitData
			},
			'remarkAdmission': {
				'remarkQuestion': remarkQuestionData,
				'remarkLearn': admissionRemarkFormData['learnFieldData'] ? admissionRemarkFormData['learnFieldData'] : []
			}
		};

		let message = '';
		this.sisService.saveStudentRemarkDataThemeTwo(remarkJson).subscribe((result: any) => {
			if (result.status === 'ok') {
				message = this.addOnly ? 'Remarks Added Successfully' : this.editOnly ? 'Remarks Updated Successfully' : '';
				if (message) {
					this.disabledApiCall = true;
					this.commonAPIService.showSuccessErrorMessage(message, 'success');
					const invoiceJSON = { login_id: [this.context.studentdetails.studentdetailsform.value.au_login_id] };
					this.getRemarkData(this.context.studentdetails.studentdetailsform.value.au_login_id);
					if (this.processTypeService.getProcesstype() === '3' || this.processTypeService.getProcesstype() === '4') {
					this.sisService.insertInvoice(invoiceJSON).subscribe((result2: any) => {
						if (result2.data && result2.status === 'ok') {
							const length = result2.data.split('/').length;
							saveAs(result2.data, result2.data.split('/')[length - 1]);
							this.disabledApiCall = false;
							this.commonAPIService.reRenderForm.next({ reRenderForm: true, viewMode: true, editMode: false, deleteMode: false, addMode: false });
						} else {
							this.commonAPIService.reRenderForm.next({ reRenderForm: true, viewMode: true, editMode: false, deleteMode: false, addMode: false });
							this.disabledApiCall = false;
						}
					});
				}
					if (!this.isSubmit) {
						this.commonAPIService.reRenderForm.next({ reRenderForm: true, viewMode: true, editMode: false, deleteMode: false, addMode: false });
					} else {
						this.isSubmit = false;
					}
				}
			} else {
				message = this.addOnly ? result.data : this.editOnly ? result.data : '';
				this.disabledApiCall = false;
				this.commonAPIService.showSuccessErrorMessage(message, 'error');
			}
		});

		if (this.context && this.context.studentdetails &&
			this.context.studentdetails.studentdetailsform &&
			this.context.studentdetails.studentdetailsform.valid) {
				console.log(this.context.studentdetails.studentdetailsform.value);
			this.sisService.addStudentInformation(this.context.studentdetails.studentdetailsform.value).subscribe((result1: any) => {
				if (result1.status === 'ok') {
				}
			});
		}
	}

	getGeneralRemarkFormData() {
		let finalGeneralRemarkArray = [];
		if (this.general_remark && this.general_remark.finalGeneralRemarkArray && this.general_remark.finalGeneralRemarkArray.length > 0) {
			finalGeneralRemarkArray = this.general_remark.finalGeneralRemarkArray;
			for (const item of finalGeneralRemarkArray) {
				item.era_doj = this.commonAPIService.dateConvertion(item.era_doj, 'yyyy-MM-dd');
			}
			return finalGeneralRemarkArray;
		} else {
			finalGeneralRemarkArray = [];
		}
	}

	getManagementRemarkFormData() {
		const admissionRemarkData = this.management_remark && this.management_remark.admissionremarkform ?
			this.management_remark.admissionremarkform.value : {};
		const studentRemarkData = this.management_remark && this.management_remark.studentremarkform ?
			this.management_remark.studentremarkform.value : {};
		const parentRemarkData = this.management_remark && this.management_remark.parentremarkform ?
			this.management_remark.parentremarkform.value : {};
		const finalRemarkData = this.management_remark && this.management_remark ? this.management_remark.finalremarksform.value : {};
		const concessionFormData = this.management_remark && this.management_remark.concessionArray ?
			this.management_remark.concessionArray : [];
		/*
			&& (this.management_remark.studentremarkform.valid &&
			this.management_remark.admissionremarkform.valid &&
			this.management_remark.parentremarkform.valid &&
			this.management_remark.finalremarksform.valid &&
			concessionFormData.length > 0)
		*/
		if (this.management_remark) {
			for (const item of concessionFormData) {
				item.era_doj = this.commonAPIService.dateConvertion(item.era_doj, 'yyyy-MM-dd');
			}
			return { admissionRemarkData, studentRemarkData, parentRemarkData, finalRemarkData, concessionFormData };
		} else {
			console.log('admissionRemarkData, studentRemarkData, parentRemarkData, finalRemarkData, concessionFormData', admissionRemarkData, studentRemarkData, parentRemarkData, finalRemarkData, concessionFormData)
			return { admissionRemarkData, studentRemarkData, parentRemarkData, finalRemarkData, concessionFormData };
			// this.commonAPIService.showSuccessErrorMessage('Please Fill all Required Field for Management Remark', 'error');
		}
	}

	getAdmissionRemarkFormData() {
		const admissionRemarkFieldData = (this.admission_remark && this.admission_remark.admissionRemarkFields
			&& this.admission_remark.admissionRemarkFields.value) ? this.admission_remark.admissionRemarkFields.value : [];
		const learnFieldData = (this.admission_remark && this.admission_remark.learnFieldData
			&& this.admission_remark.learnFieldData.value) ? this.admission_remark.learnFields.value : [];
		return { admissionRemarkFieldData, learnFieldData };
	}

	cancelForm() {
		this.isSubmit = false;
		if (this.addOnly) {
			this.commonAPIService.reRenderForm.next({ reRenderForm: true, viewMode: true, editMode: false, deleteMode: false, addMode: false });
		} else if (this.saveFlag) {
			this.commonAPIService.reRenderForm.next({ viewMode: true, editMode: false, deleteMode: false, addMode: false });
		}
	}

	remainOnSame() {
		this.isSubmit = true;
		this.saveForm();
		this.commonAPIService.reRenderForm.next({ reRenderForm: false, viewMode: false, editMode: true, deleteMode: false, addMode: false });
	}

	prepareMarkSplitData() {
		const markSplitData = this.managementRemarkData['markSplit'];
		console.log('markSplitData',markSplitData);
		const dynamicRemarkForm = this.management_remark && this.management_remark.dynamicMarksForm ? this.management_remark.dynamicMarksForm : [];

		for (let i = 0; i < markSplitData.length; i++) {
			for (let j = 0; j < markSplitData[i]['data'].length; j++) {
				markSplitData[i]['data'][j]['erms_value'] = dynamicRemarkForm[i] ? dynamicRemarkForm[i]['value']['col' + j] : '';
			}
		}
		return markSplitData;
	}

}
