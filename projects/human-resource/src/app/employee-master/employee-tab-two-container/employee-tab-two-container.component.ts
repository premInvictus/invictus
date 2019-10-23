import { Component, OnInit, ViewChild, OnChanges } from '@angular/core';
import { SisService, CommonAPIService } from '../../_services/index';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { saveAs } from 'file-saver';
@Component({
	selector: 'app-employee-tab-two-container',
	templateUrl: './employee-tab-two-container.component.html',
	styleUrls: ['./employee-tab-two-container.component.scss']
})
export class EmployeeTabTwoContainerComponent implements OnInit, OnChanges {
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
	contactsArray: any = {};
	personalContacts: FormGroup;
	relationshipArray: any[] = [
		{ id: 0, name: 'Father' },
		{ id: 1, name: 'Mother' },
		{ id: 2, name: 'Guardian' },
		{ id: 3, name: 'Spouse' }
	];
	cityId: any;
	cityCountryArray: any[] = [];
	arrayState: any[] = [];
	@ViewChild('editReference') editReference;
	constructor(private sisService: SisService, private fbuild: FormBuilder,
		public common: CommonAPIService) { }
	ngOnInit() {
		this.buildForm();
		this.getState();
	}
	buildForm() {
		this.personalContacts = this.fbuild.group({
			relationship: '',
			fullname: '',
			occupation: '',
			education: '',
			mobile: '',
			email: '',
			organisation: '',
			designation: '',
			address: '',
			city: '',
			state: '',
			pincode: '',
			reference: ''
		});
	}
	ngOnChanges() { }
	saveForm() {

	}
	isExistUserAccessMenu(actionT) {
		//return this.context.studentdetails.isExistUserAccessMenu(actionT);
	}
	editRequest() {
		this.viewOnly = false;
		this.editOnly = false;
		this.editRequestFlag = true;
		this.saveFlag = false;
	}
	cancelForm() {

	}
	updateForm(isview) {
		this.contactsArray['emp_personal_contact'] = {
			relationship_personal_detail: {
				rel_category: this.personalContacts.value.relationship,
				rel_full_name: this.personalContacts.value.fullname,
				rel_occupation: this.personalContacts.value.occupation,
				rel_organisation: this.personalContacts.value.organisation,
				rel_designation: this.personalContacts.value.designation,
				rel_contact_detail: {
					rel_mobile_no: this.personalContacts.value.mobile,
					rel_email: this.personalContacts.value.email
				},
				rel_address_detail: {
					address: this.personalContacts.value.address,
					city: {
						cit_id: this.personalContacts.value.city,
						cit_name: this.getCityName(this.personalContacts.value.city)
					},
					state: {
						sta_id: this.personalContacts.value.state,
						sta_name: this.getStateName(this.personalContacts.value.state)
					},
					country: {
						ct_id: 101,
						ct_name: 'India'
					},
					pin: this.personalContacts.value.pincode
				},
				rel_reference_detail: {
					ref_person_name: this.personalContacts.value.reference
				}
			}
		};
	}
	dateConversion(value, format) {
		const datePipe = new DatePipe('en-in');
		return datePipe.transform(value, format);
	}
	editConfirm() { }
	filterCityStateCountry($event) {
		// keyCode
		if (Number($event.keyCode) !== 40 && Number($event.keyCode) !== 38) {
			if ($event.target.value !== '' && $event.target.value.length >= 3) {
				this.cityCountryArray = [];
				this.sisService.getStateCountryByCity({ cit_name: $event.target.value }).subscribe((result: any) => {
					if (result.status === 'ok') {
						this.cityCountryArray = result.data;
					}
				});
			}
		}
	}
	getCityPerId(item: any) {
		this.cityId = item.cit_id;
		this.personalContacts.patchValue({
			city: this.getCityName(item.cit_id),
			state: item.sta_id,
		});
	}

	getCityName(id) {
		const findIndex = this.cityCountryArray.findIndex(f => f.cit_id === id);
		if (findIndex !== -1) {
			return this.cityCountryArray[findIndex].cit_name;
		}
	}
	getStateName(id) {
		const findIndex = this.arrayState.findIndex(f => f.sta_id === id);
		if (findIndex !== -1) {
			return this.arrayState[findIndex].sta_name;
		}
	}
	getState() {
		this.sisService.getState().subscribe(
			(result: any) => {
				if (result.status === 'ok') {
					this.arrayState = result.data;
				}
			}
		);
	}
}
