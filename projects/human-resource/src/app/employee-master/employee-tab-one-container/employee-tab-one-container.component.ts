import { Component, OnInit, ViewChild, OnChanges } from '@angular/core';
import { SisService, CommonAPIService } from '../../_services/index';

// import { ChildDetailsEmployeeComponent } from '../child-details-theme-two/child-details-theme-two.component';
// import { ParentDetailsEmployeeComponent } from '../parent-details-theme-two/parent-details-theme-two.component';
// import { MedicalInformationEmployeeComponent } from '../medical-information-theme-two/medical-information-theme-two.component';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';


@Component({
	selector: 'app-employee-tab-one-container',
	templateUrl: './employee-tab-one-container.component.html',
	styleUrls: ['./employee-tab-one-container.component.scss']
})
export class EmployeeTabOneContainerComponent implements OnInit, OnChanges {
	personalDetails: FormGroup;
	personaldetails: any = {};
	addressFlag = false;
	panelOpenState = true;
	addOnly = false;
	editOnly = false;
	viewOnly = true;
	saveFlag = false;
	cityCountryArray: any[] = [];
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

	constructor(public commonAPIService: CommonAPIService,
		private sisService: SisService, private fbuild: FormBuilder, ) {

	}

	setActionControls(data) {
		if (data.addMode) {
			this.addOnly = true;
			//this.viewOnly = false;
		}
		if (data.editMode) {
			this.editOnly = true;
			//this.viewOnly = false;
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

			}
		}
	}

	ngOnInit() {
		this.buildForm();
	}
	ngOnChanges() {
	}
	buildForm() {
		this.personalDetails = this.fbuild.group({
			p_address: '',
			p_city: '',
			p_state: '',
			p_pincode: '',
			r_address: '',
			r_city: '',
			r_state: '',
			r_pincode: '',
			pri_mobile: '',
			sec_mobile: '',
			whatsapp_no: '',
			email_id: '',
		});
	}
	saveForm() {
		this.personaldetails.value['city'] = {
			cit_name: 'varanasi',
			cit_id: this.personalDetails.value.p_city
		};
		this.personaldetails.value['state'] = {
			sta_name: 'varanasi',
			sta_id: this.personalDetails.value.p_state
		};
		if (this.personalDetails.valid) {

		}
	}


	isExistUserAccessMenu(actionT) {
		// if (this.context && this.context.studentdetails) {
		// 	return this.context.studentdetails.isExistUserAccessMenu(actionT);
		// }
	}
	editConfirm() { }

	address_change(event) {
		if (event.checked) {
			this.addressFlag = true;
		} else {
			this.addressFlag = false;
		}
	}
	filterCityStateCountry($event) {
		// keyCode
		if (Number($event.keyCode) !== 40 && Number($event.keyCode) !== 38) {
			if ($event.target.value !== '' && $event.target.value.length >= 3 && !(this.viewOnly)) {
				this.cityCountryArray = [];
				this.sisService.getStateCountryByCity({ cit_name: $event.target.value }).subscribe((result: any) => {
					if (result.status === 'ok') {
						this.cityCountryArray = result.data;
					}
				});
			}
		}
	}
	
}
