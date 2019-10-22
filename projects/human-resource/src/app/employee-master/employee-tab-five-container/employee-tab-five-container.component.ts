import { Component, OnInit, ViewChild, OnChanges } from '@angular/core';
import { SisService, CommonAPIService } from '../../_services/index';
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
	@ViewChild('editReference') editReference;

	constructor(public commonAPIService: CommonAPIService, private fbuild: FormBuilder,
		private sisService: SisService) {

	}

	setActionControls(data) {
		if (data.addMode) {
			this.addOnly = true;
			this.viewOnly = false;
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
