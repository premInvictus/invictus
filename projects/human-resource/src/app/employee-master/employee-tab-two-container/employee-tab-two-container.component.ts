import { Component, OnInit, ViewChild, OnChanges, Input } from '@angular/core';
import { SisService, CommonAPIService } from '../../_services/index';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { saveAs } from 'file-saver';
import { ConfirmValidParentMatcher } from '../../ConfirmValidParentMatcher';
@Component({
	selector: 'app-employee-tab-two-container',
	templateUrl: './employee-tab-two-container.component.html',
	styleUrls: ['./employee-tab-two-container.component.scss']
})
export class EmployeeTabTwoContainerComponent implements OnInit, OnChanges {
	confirmValidParentMatcher = new ConfirmValidParentMatcher();
	@Input() employeedetails;
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
	editableStatus = '0';
	cityId: any;
	cityCountryArray: any[] = [];
	arrayState: any[] = [];
	@ViewChild('editReference') editReference;
	constructor(private sisService: SisService, private fbuild: FormBuilder,
		public commonAPIService: CommonAPIService) { }
	ngOnInit() {
		this.buildForm();
		this.getState();
		if (this.employeedetails) {
			this.getPersonaContactsdata();
		}
		this.commonAPIService.reRenderForm.subscribe((data: any) => {
			if (data) {
				if (data.addMode) {
					this.setActionControls({ addMode: true });
				}
				if (data.editMode) {
					this.setActionControls({ editMode: true });
				} 
			}
		});
	}

	setActionControls(data) {
		if (data.addMode) {
			this.addOnly = true;
			this.viewOnly = false;
			this.personalContacts.patchValue({
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
		if (data.editMode) {
			this.editOnly = true;
			this.viewOnly = false;
			this.saveFlag = true;
		}
		if (data.viewMode) {
			this.viewOnly = true;
			this.saveFlag = false;
			this.editRequestFlag = false;


		}
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
	ngOnChanges() {
		this.buildForm();
		this.getState();
		if (this.employeedetails) {
			this.getPersonaContactsdata();
		}
	}
	getPersonaContactsdata() {
		if (this.employeedetails) {
			this.personalContacts.patchValue({
				relationship: this.employeedetails.emp_personal_contact.relationship_personal_detail.rel_category.rel_id,
				fullname: this.employeedetails.emp_personal_contact.relationship_personal_detail.rel_full_name,
				occupation: this.employeedetails.emp_personal_contact.relationship_personal_detail.rel_occupation,
				education: this.employeedetails.emp_personal_contact.relationship_personal_detail.rel_education,
				mobile: this.employeedetails.emp_personal_contact.relationship_personal_detail.rel_contact_detail.rel_mobile_no,
				email: this.employeedetails.emp_personal_contact.relationship_personal_detail.rel_contact_detail.rel_email,
				organisation: this.employeedetails.emp_personal_contact.relationship_personal_detail.rel_organisation,
				designation: this.employeedetails.emp_personal_contact.relationship_personal_detail.rel_designation,
				address: this.employeedetails.emp_personal_contact.relationship_personal_detail.rel_address_detail.address,
				city: this.employeedetails.emp_personal_contact.relationship_personal_detail.rel_address_detail.city,
				state: this.employeedetails.emp_personal_contact.relationship_personal_detail.rel_address_detail.state,
				pincode: this.employeedetails.emp_personal_contact.relationship_personal_detail.rel_address_detail.pin,
				reference: this.employeedetails.emp_personal_contact.relationship_personal_detail.rel_reference_detail.ref_person_name
			});
		}

	}
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
		if (this.addOnly) {
			this.commonAPIService.reRenderForm.next({ reRenderForm: true, viewMode: true, editMode: false, deleteMode: false, addMode: false });
		} else if (this.saveFlag || this.editRequestFlag) {
			//this.context.studentdetails.getStudentInformation(this.context.studentdetails.studentdetailsform.value.au_enrollment_id);
			this.getPersonaContactsdata();
			this.commonAPIService.reRenderForm.next({ viewMode: true, editMode: false, deleteMode: false, addMode: false });
		}
	}
	updateForm(isview) {
		this.employeedetails['emp_personal_contact'] = {
			relationship_personal_detail: {
				rel_category: {
					rel_id: this.personalContacts.value.relationship,
					rel_name: this.getRelationShipName(this.personalContacts.value.relationship)
				},
				rel_full_name: this.personalContacts.value.fullname,
				rel_occupation: this.personalContacts.value.occupation,
				rel_education: this.personalContacts.value.education,
				rel_organisation: this.personalContacts.value.organisation,
				rel_designation: this.personalContacts.value.designation,
				rel_contact_detail: {
					rel_mobile_no: this.personalContacts.value.mobile,
					rel_email: this.personalContacts.value.email
				},
				rel_address_detail: {
					address: this.personalContacts.value.address,
					city: this.personalContacts.value.city,
					state: this.personalContacts.value.state,
					pin: this.personalContacts.value.pincode
				},
				rel_reference_detail: {
					ref_person_name: this.personalContacts.value.reference
				}
			}
		};
		this.commonAPIService.updateEmployee(this.employeedetails).subscribe((result: any) => {
			if (result.status === 'ok') {

			}
		});
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
	getRelationShipName(id) {
		const findIndex = this.relationshipArray.findIndex(f => f.id === id);
		if (findIndex !== -1) {
			return this.relationshipArray[findIndex].name;
		}
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
