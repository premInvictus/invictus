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
	@Input() employeeCommonDetails;
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
		{ id: 1, name: 'Father' },
		{ id: 2, name: 'Mother' },
		{ id: 3, name: 'Guardian' },
		{ id: 4, name: 'Spouse' }
	];
	editableStatus = '0';
	cityId: any;
	cityCountryArray: any[] = [];
	arrayState: any[] = [];
	@ViewChild('editReference') editReference;
	honrificArr = [
		{ hon_id: "1", hon_name: 'Mr.' },
		{ hon_id: "2", hon_name: 'Mrs.' },
		{ hon_id: "3", hon_name: 'Miss.' },
		{ hon_id: "4", hon_name: 'Ms.' },
		{ hon_id: "5", hon_name: 'Mx.' },
		{ hon_id: "6", hon_name: 'Sir.' },
		{ hon_id: "7", hon_name: 'Dr.' },
		{ hon_id: "8", hon_name: 'Lady.' }

	];
	departmentArray;
	designationArray;
	wingArray;
	categoryOneArray: any[] = [];
	constructor(private sisService: SisService, private fbuild: FormBuilder,
		public commonAPIService: CommonAPIService) { }
	ngOnInit() {
		this.commonAPIService.reRenderForm.subscribe((data: any) => {
			if (data) {
				if (data.addMode) {
					this.setActionControls({ addMode: true });
				}
				if (data.editMode) {
					this.setActionControls({ editMode: true });
				}
				if (data.viewMode) {
					this.setActionControls({ viewMode: true });
				}
			}
		});
	}

	setActionControls(data) {
		if (data.addMode) {
			this.addOnly = true;
			this.editOnly = false;
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
			this.addOnly = false;
			this.viewOnly = false;
			this.saveFlag = true;
		}
		if (data.viewMode) {
			this.viewOnly = true;
			this.addOnly = false;
			this.editOnly = false;
			this.saveFlag = false;
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
		this.getCategoryOne();
		this.getState();
		this.getDepartment();
		this.getDesignation();
		this.getWing();
		if (this.employeedetails) {
			this.getPersonaContactsdata();
		}
	}

	getDepartment() {
		this.sisService.getDepartment({}).subscribe((result: any) => {
			if (result && result.status == 'ok') {
				this.departmentArray = result.data;
			} else {
				this.departmentArray = [];
			}

		});
	}
	getDesignation() {
		this.commonAPIService.getMaster({ type_id: '2' }).subscribe((result: any) => {
			if (result) {
				this.designationArray = result;
			} else {
				this.designationArray = [];
			}

		});
	}
	getWing() {
		this.commonAPIService.getMaster({ type_id: '1' }).subscribe((result: any) => {
			if (result) {
				this.wingArray = result;
			} else {
				this.wingArray = [];
			}

		});
	}
	getPersonaContactsdata() {
		if (this.employeedetails && this.employeedetails.emp_personal_contact && this.employeedetails.emp_personal_contact.relationship_personal_detail) {
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
		if (this.personalContacts.valid) {
			if (this.employeedetails) {
				this.employeedetails.emp_id = this.employeeCommonDetails.employeeDetailsForm.value.emp_id;
				this.employeedetails.emp_name = this.employeeCommonDetails.employeeDetailsForm.value.emp_name;
				this.employeedetails.emp_profile_pic = this.employeeCommonDetails.employeeDetailsForm.value.emp_profile_pic;
				this.employeedetails.emp_department_detail = {
					dpt_id: this.employeeCommonDetails.employeeDetailsForm.value.emp_department_id,
					dpt_name: this.getDepartmentName(this.employeeCommonDetails.employeeDetailsForm.value.emp_department_id)
				};
				this.employeedetails.emp_designation_detail = {
					des_id: this.employeeCommonDetails.employeeDetailsForm.value.emp_designation_id,
					des_name: this.getDesignationName(this.employeeCommonDetails.employeeDetailsForm.value.emp_designation_id)
				};
				this.employeedetails.emp_honorific_detail = {
					hon_id: this.employeeCommonDetails.employeeDetailsForm.value.emp_honorific_id,
					hon_name: this.getHonorificName(this.employeeCommonDetails.employeeDetailsForm.value.emp_honorific_id)
				};
				this.employeedetails.emp_wing_detail = {
					wing_id: this.employeeCommonDetails.employeeDetailsForm.value.emp_wing_id,
					wing_name: this.getWingName(this.employeeCommonDetails.employeeDetailsForm.value.emp_wing_id)
				};
				this.employeedetails.emp_category_detail = {
					cat_id: this.employeeCommonDetails.employeeDetailsForm.value.emp_category_id,
					cat_name: this.getCategoryOneName(this.employeeCommonDetails.employeeDetailsForm.value.emp_category_id)
				};
			}
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
				if (result) {
					this.commonAPIService.renderTab.next({ tabMove: true });
					this.commonAPIService.showSuccessErrorMessage('Employee Personal Contact Saved Successfully', 'success');
				} else {
					this.commonAPIService.showSuccessErrorMessage('Error While Save Employee Personal Contact', 'error');
				}
			});

		} else {
			this.commonAPIService.showSuccessErrorMessage('Please fill all required field', 'error');
		}
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
			this.getPersonaContactsdata();
			this.commonAPIService.reRenderForm.next({ viewMode: true, editMode: false, deleteMode: false, addMode: false });
		}
	}
	updateForm(isview) {
		if (this.personalContacts.valid) {
			if (this.employeedetails) {
				this.employeedetails.emp_id = this.employeeCommonDetails.employeeDetailsForm.value.emp_id;
				this.employeedetails.emp_name = this.employeeCommonDetails.employeeDetailsForm.value.emp_name;
				this.employeedetails.emp_profile_pic = this.employeeCommonDetails.employeeDetailsForm.value.emp_profile_pic;
				this.employeedetails.emp_department_detail = {
					dpt_id: this.employeeCommonDetails.employeeDetailsForm.value.emp_department_id,
					dpt_name: this.getDepartmentName(this.employeeCommonDetails.employeeDetailsForm.value.emp_department_id)
				};
				this.employeedetails.emp_designation_detail = {
					des_id: this.employeeCommonDetails.employeeDetailsForm.value.emp_designation_id,
					des_name: this.getDesignationName(this.employeeCommonDetails.employeeDetailsForm.value.emp_designation_id)
				};
				this.employeedetails.emp_honorific_detail = {
					hon_id: this.employeeCommonDetails.employeeDetailsForm.value.emp_honorific_id,
					hon_name: this.getHonorificName(this.employeeCommonDetails.employeeDetailsForm.value.emp_honorific_id)
				};
				this.employeedetails.emp_wing_detail = {
					wing_id: this.employeeCommonDetails.employeeDetailsForm.value.emp_wing_id,
					wing_name: this.getWingName(this.employeeCommonDetails.employeeDetailsForm.value.emp_wing_id)
				};
				this.employeedetails.emp_category_detail = {
					cat_id: this.employeeCommonDetails.employeeDetailsForm.value.emp_category_id,
					cat_name: this.getCategoryOneName(this.employeeCommonDetails.employeeDetailsForm.value.emp_category_id)
				};
			}
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
				if (result) {
					this.commonAPIService.showSuccessErrorMessage('Employee Personal Contact Saved Successfully', 'success');
					if (isview) {
						this.commonAPIService.renderTab.next({ tabMove: true });
					} else {
						this.getPersonaContactsdata();
						this.commonAPIService.reRenderForm.next({ viewMode: true, editMode: false, deleteMode: false, addMode: false });
					}
				} else {
					this.commonAPIService.showSuccessErrorMessage('Error While Save Employee Personal Contact', 'error');
				}
			});

		} else {
			this.commonAPIService.showSuccessErrorMessage('Please fill all required field', 'error');
		}
	}
	dateConversion(value, format) {
		const datePipe = new DatePipe('en-in');
		return datePipe.transform(value, format);
	}
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
	getDepartmentName(dpt_id) {
		const findIndex = this.departmentArray.findIndex(f => Number(f.dept_id) === Number(dpt_id));
		if (findIndex !== -1) {
			return this.departmentArray[findIndex].dept_name;
		}
	}

	getHonorificName(hon_id) {
		const findIndex = this.honrificArr.findIndex(f => Number(f.hon_id) === Number(hon_id));
		if (findIndex !== -1) {
			return this.honrificArr[findIndex].hon_name;
		}
	}
	getCategoryOne() {
		this.commonAPIService.getCategoryOne({}).subscribe((res: any) => {
			if (res) {
				this.categoryOneArray = [];
				this.categoryOneArray = res;
			}
		});
	}
	getCategoryOneName(cat_id) {
		const findex = this.categoryOneArray.findIndex(e => Number(e.cat_id) === Number(cat_id));
		if (findex !== -1) {
			return this.categoryOneArray[findex].cat_name;
		}
	}
	getWingName(wing_id) {
		const findIndex = this.wingArray.findIndex(f => Number(f.config_id) === Number(wing_id));
		if (findIndex !== -1) {
			return this.wingArray[findIndex].name;
		}
	}
	getDesignationName(des_id) {
		const findIndex = this.designationArray.findIndex(f => Number(f.config_id) === Number(des_id));
		if (findIndex !== -1) {
			return this.designationArray[findIndex].name;
		}
	}
}
