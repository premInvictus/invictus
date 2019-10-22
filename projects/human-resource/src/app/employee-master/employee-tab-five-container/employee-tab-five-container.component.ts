import { Component, OnInit, ViewChild, OnChanges } from '@angular/core';
import { SisService, CommonAPIService } from '../../_services/index';

// import { ChildDetailsEmployeeComponent } from '../child-details-theme-two/child-details-theme-two.component';
// import { ParentDetailsEmployeeComponent } from '../parent-details-theme-two/parent-details-theme-two.component';
// import { MedicalInformationEmployeeComponent } from '../medical-information-theme-two/medical-information-theme-two.component';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';


@Component({
	selector: 'app-employee-tab-five-container',
	templateUrl: './employee-tab-five-container.component.html',
	styleUrls: ['./employee-tab-five-container.component.scss']
})
export class EmployeeTabFiveContainerComponent implements OnInit, OnChanges {

	panelOpenState = true;
	classSection: FormGroup;
	addOnly = false;
	editOnly = false;
	viewOnly = true;
	saveFlag = false;
	editRequestFlag = false;
	taboneform: any = {};
	login_id = '';
	studentdetails: any = {};
	parentDetails2: any = {};
	addressDetails: any[] = [];
	parentJson: any[] = [];
	reqParamArray = [];
	finalSibReqArray = [];
	finalSibReqArray2 = [];
	checkChangedFieldsArray: any = [];
	finalArray: any = [];
	settingsArray: any[] = [];
	parentId;
	// @ViewChild(ChildDetailsEmployeeComponent) childDetails: ChildDetailsEmployeeComponent;
	// @ViewChild(ParentDetailsEmployeeComponent) parentDetails: ParentDetailsEmployeeComponent;
	// @ViewChild(MedicalInformationEmployeeComponent) medicalDetails: MedicalInformationEmployeeComponent;
	@ViewChild('editReference') editReference;

	constructor(public commonAPIService: CommonAPIService, private fbuild: FormBuilder,
		private sisService: SisService) {

	}

	setActionControls(data) {
		if (data.addMode) {
			this.addOnly = true;
			this.viewOnly = false;
			this.resetForm();
		}
		if (data.editMode) {
			this.editOnly = true;
			this.viewOnly = false;
			this.saveFlag = true;
		}
		if (data.viewMode) {
			this.viewOnly = true;
			this.saveFlag = false;
			this.editRequestFlag = false;

			if (this.addOnly) {
				this.sisService.getStudentLastRecordPerProcessType().subscribe((result: any) => {
					if (result.status === 'ok') {
						this.commonAPIService.studentData.next(result.data[0]);
						this.addOnly = false;
					}
				});
			} else {
				//this.commonAPIService.studentData.next(this.context.studentdetails.studentdetailsform.value.au_enrollment_id);
			}
		}
	}

	ngOnInit() {
		this.buildForm();
		// this.settingsArray = this.context.configSetting;
		// const processType = this.processTypeService.getProcesstype();
		// if (processType === '1') {
		// 	this.parentId = '157';
		// }
		// if (processType === '2') {
		// 	this.parentId = '158';
		// }
		// if (processType === '3') {
		// 	this.parentId = '159';
		// }
		// if (processType === '4') {
		// 	this.parentId = '160';
		// }
		// if (processType === '5') {
		// 	this.parentId = '161';
		// }

		// this.commonAPIService.studentData.subscribe((data: any) => {
		// 	if (data && data.au_login_id) {
		// 		this.login_id = data.au_login_id;
		// 		this.getStudent(this.login_id);
		// 	}
		// });
		// this.commonAPIService.reRenderForm.subscribe((data: any) => {
		// 	this.setActionControls(data);
		// });

		// this.getConfigureSetting();
	}
	ngOnChanges() {
	}
	buildForm() {
		this.classSection = this.fbuild.group({
			class: '',
			section: '',
			subject: '',
		});
	}
	saveForm() {
	
	}
	cancelForm() {
		// if (this.addOnly) {
		// 	this.commonAPIService.reRenderForm.next({ reRenderForm: true, viewMode: true, editMode: false, deleteMode: false, addMode: false });
		// } else if (this.saveFlag || this.editRequestFlag) {
		// 	this.context.studentdetails.getStudentInformation(this.context.studentdetails.studentdetailsform.value.au_enrollment_id);
		// 	this.getStudent(this.login_id);
		// 	this.commonAPIService.reRenderForm.next({ viewMode: true, editMode: false, deleteMode: false, addMode: false });
		// }
	}

	updateForm(isview) {
		this.classSection['emp_class_section_detail'] = [
			{
				class_detail: {
					class_id: this.classSection.value.class,
					class_name: ''
				},
				section_detail: {
					sec_id: this.classSection.value.section,
					sec_name: ''
				},
				subject_detail: {
					sub_id:this.classSection.value.subject,
					sub_name: ''
				},
				class_teacher_staus: false,
				status: ''
			}
		];
	}


	isExistUserAccessMenu(actionT) {
		// if (this.context && this.context.studentdetails) {
		// 	return this.context.studentdetails.isExistUserAccessMenu(actionT);
		// }
	}
	editConfirm() { }
}
