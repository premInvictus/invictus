import { Component, EventEmitter, OnInit, Output, Input, ViewChild, OnChanges, OnDestroy, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SisService, CommonAPIService } from '../../_services/index';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material';
// import { SearchViaNameComponent } from '../../sharedmodule/search-via-name/search-via-name.component';

@Component({
	selector: 'app-employee-common',
	templateUrl: './employee-common.component.html',
	styleUrls: ['./employee-common.component.scss']
})

export class EmployeeCommonComponent implements OnInit {

	@Input() belongToForm: string;
	@Input() config: any;
	@Input() configSetting: any;
	@ViewChild('cropModal') cropModal;
	@ViewChild('editReference') editReference;
	@ViewChild('enrollmentFocus') enrollmentFocus: ElementRef;
	nextEvent = new Subject();
	@Output() nextUserEvent: EventEmitter<any> = new EventEmitter<any>();
	studentdetailsform: FormGroup;
	studentdetails: any = {};
	lastStudentDetails: any = {};
	lastrecordFlag = true;
	navigation_record: any = {};
	au_profileimage: any;
	parent_type: any;
	type: any;
	minDate = new Date();
	maxDate = new Date();
	login_id;
	previousB = true;
	nextB = true;
	firstB = true;
	lastB = true;
	viewOnly = true;
	deleteOnly = true;
	editOnly = true;
	divFlag = false;
	stopFlag = false;
	addOnly = true;
	iddesabled = true;
	backOnly = false;
	defaultsrc = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/other.svg';
	classArray = [];
	sectionArray = [];
	houseArray = [];
	multipleFileArray: any[] = [];
	savedSettingsArray: any[] = [];
	settingsArray: any[] = [];
	enrolmentPlaceholder = 'Enrollment Id';
	deleteMessage = 'Are you sure, you want to delete ?';
	studentdetailsflag = false;
	lastRecordId;
	classPlaceHolder: any;
	gender: any;
	@ViewChild('deleteModal') deleteModal;
	@ViewChild('myInput') myInput: ElementRef;
	openDeleteDialog = (data) => {
		this.deleteModal.openModal(data);
	}
	getStuData = (data) => {
		console.log('yes');
		//this.getStudentDetailsByAdmno(data);
	}

	constructor(
		private fbuild: FormBuilder,
		private sisService: SisService,
		private route: ActivatedRoute,
		private router: Router,
		private commonAPIService: CommonAPIService,
		public dialog: MatDialog
	) {
	}
	ngOnInit() {
		//this.getConfigureSetting();
		this.settingsArray = this.configSetting;
		this.buildForm();
		// this.getClass();
		// this.getHouses();
		// const inputElem = <HTMLInputElement>this.myInput.nativeElement;
		// inputElem.select();
		// this.commonAPIService.studentData.subscribe((data: any) => {
		// 	if (data && data.last_record) {
		// 		if (this.login_id !== data.last_record) {
		// 			this.studentdetailsflag = true;
		// 		}
		// 		this.login_id = data.last_record;
		// 		this.lastRecordId = data.last_record;
		// 		if (this.lastrecordFlag) {
		// 			this.lastStudentDetails.enrollment_id = data.last_record;
		// 			this.lastrecordFlag = false;
		// 		}
		// 		this.getStudentInformation(data.last_record);
		// 		this.divFlag = true;
		// 		this.stopFlag = true;
		// 	}
		// });
	}

		// this.commonAPIService.reRenderForm.subscribe((data: any) => {
		// 	if (data) {
		// 		this.studentdetailsflag = true;
		// 		if ((data && data.reRenderForm) || (data && data.viewMode)) {
		// 			this.getStudentInformation(this.lastRecordId);
		// 		}
		// 	}
		// 	this.setActionControls(data);
		// });
		// this.commonAPIService.studentSearchByName.subscribe((data: any) => {
		// 	if (data) {
		// 		this.getStudentDetailsByAdmno(data);
		// 	}
		// });

		// if (localStorage.getItem('suspension_last_state')) {
		// 	this.backOnly = true;
		// }

		// if (localStorage.getItem('change_enrolment_number_last_state')) {
		// 	this.backOnly = true;
		// }

		// if (localStorage.getItem('change_enrolment_status_last_state')) {
		// 	this.backOnly = true;
		// }

		// if (localStorage.getItem('id_card_view_last_state')) {
		// 	this.backOnly = true;
		// }
		// if (this.processtypeService.getProcesstype() === '1' ||
		// 	this.processtypeService.getProcesstype() === '2') {
		// 	this.classPlaceHolder = 'Class Applied For';
		// } else {
		// 	this.classPlaceHolder = 'Class';
		// }
	
	// ngOnChanges() {
	// 	if (localStorage.getItem('remark_entry_last_state')) {
	// 		this.backOnly = true;
	// 	}
	// }

	// ngOnDestroy() {
	// 	localStorage.removeItem('suspension_last_state');
	// 	localStorage.removeItem('change_enrolment_number_last_state');
	// 	localStorage.removeItem('change_enrolment_status_last_state');
	// 	localStorage.removeItem('id_card_view_last_state');
	// 	localStorage.removeItem('remark_entry_last_state');
	// }
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
	setActionControls(data) {
		if (data.addMode) {
			this.editOnly = false;
			this.stopFlag = false;
			this.divFlag = false;
			this.addOnly = false;
			this.viewOnly = false;
			this.deleteOnly = false;
			this.studentdetailsform.reset();
			this.defaultsrc = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/other.svg';
			this.enrolmentPlaceholder = 'New Enrollment Id';

		}
		if (data.editMode) {
			this.editOnly = false;
			this.addOnly = false;
			this.viewOnly = false;
			this.deleteOnly = false;
			this.stopFlag = true;
			this.divFlag = true;
			this.enrolmentPlaceholder = 'Enrollment Id';
		}
		if (data.viewMode) {
			this.viewOnly = true;
			this.addOnly = true;
			this.stopFlag = true;
			this.divFlag = true;
			this.editOnly = true;
			this.deleteOnly = true;
			const inputElem = <HTMLInputElement>this.myInput.nativeElement;
			inputElem.select();
			// this.commonAPIService.studentData.next(this.studentdetailsform.value.au_enrollment_id);
			if (this.lastStudentDetails.enrollment_id === this.studentdetailsform.value.au_enrollment_id) {
				this.firstB = false;
				this.previousB = false;
				this.lastB = true;
				this.nextB = true;
			} else {
				this.nevigationStudentDetails(false);
			}
			this.enrolmentPlaceholder = 'Enrollment Id';
		}
	}

	openCropDialog = (imageFile) => this.cropModal.openModal(imageFile);
	openEditDialog = (data) => this.editReference.openModal(data);
	buildForm() {
		this.studentdetailsform = this.fbuild.group({
			au_profileimage: '',
			au_enrollment_id: '',
			au_login_id: '',
			au_full_name: '',
			au_class_id: '',
			au_mobile: '',
			au_email: '',
			au_hou_id: '',
			au_sec_id: '',
			epd_parent_name: '',
			epd_contact_no: '',
			epd_whatsapp_no: '',
			mi_emergency_contact_name: '',
			mi_emergency_contact_no: ''
		});

	}
	getClass() {
		this.classArray = [];
		// this.sisService.getClass({}).subscribe((result: any) => {
		// 	if (result.status === 'ok') {
		// 		this.classArray = result.data;
		// 	}
		// });
	}
	getHouses() {
		this.houseArray = [];
		// this.sisService.getHouses().subscribe((result: any) => {
		// 	if (result.status === 'ok') {
		// 		this.houseArray = result.data;
		// 	}
		// });
	}
	getSectionsByClass() {
		this.sectionArray = [];
		this.sisService.getSectionsByClass({ class_id: this.studentdetailsform.value.au_class_id }).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.sectionArray = result.data;
			}
		});
	}
	getStudentInformation(au_login_id) {
		if (au_login_id && this.studentdetailsflag) {
			this.studentdetailsflag = false;
			// this.sisService.getStudentInformation({ au_login_id: au_login_id }).subscribe((result: any) => {
			// 	if (result && result.status === 'ok') {
			// 		this.nextB = true;
			// 		this.firstB = true;
			// 		this.lastB = true;
			// 		this.previousB = true;
			// 		this.studentdetails = [];
			// 		if (result && result.data && result.data[0]) {
			// 			this.studentdetails = result.data[0];
			// 			this.gender = this.studentdetails.au_gender;
			// 			if (this.gender === 'M') {
			// 				this.defaultsrc = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/man.svg';
			// 			} else if (this.gender === 'F') {
			// 				this.defaultsrc = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/girl.svg';
			// 			} else {
			// 				this.defaultsrc = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/other.svg';
			// 			}
			// 		}
			// 		if (result && result.data && result.data[0].navigation[0]) {
			// 			this.navigation_record = result.data[0].navigation[0];
			// 		}
			// 		if (this.processtypeService.getProcesstype() === '1') {
			// 			this.studentdetailsform.patchValue({
			// 				au_enrollment_id: this.studentdetails.em_enq_no
			// 			});
			// 		} else if (this.processtypeService.getProcesstype() === '2') {
			// 			this.studentdetailsform.patchValue({
			// 				au_enrollment_id: this.studentdetails.em_regd_no
			// 			});
			// 		} else if (this.processtypeService.getProcesstype() === '3') {
			// 			this.studentdetailsform.patchValue({
			// 				au_enrollment_id: this.studentdetails.em_provisional_admission_no
			// 			});
			// 		} else if (this.processtypeService.getProcesstype() === '4') {
			// 			this.studentdetailsform.patchValue({
			// 				au_enrollment_id: this.studentdetails.em_admission_no
			// 			});
			// 		} else if (this.processtypeService.getProcesstype() === '5') {
			// 			this.studentdetailsform.patchValue({
			// 				au_enrollment_id: this.studentdetails.em_alumini_no
			// 			});
			// 		}
			// 		this.patchStudentDetails();
			// 		this.getSectionsByClass();

			// 		this.defaultsrc = this.studentdetails.au_profileimage !== '' ? this.studentdetails.au_profileimage : this.defaultsrc;
			// 		if (this.navigation_record) {
			// 			this.viewOnly = true;
			// 			if (this.navigation_record.first_record &&
			// 				this.navigation_record.first_record !== this.studentdetailsform.value.au_enrollment_id &&
			// 				this.viewOnly) {
			// 				this.firstB = false;
			// 			}
			// 			if (this.navigation_record.last_record &&
			// 				this.navigation_record.last_record !== this.studentdetailsform.value.au_enrollment_id &&
			// 				this.viewOnly) {
			// 				this.lastB = false;
			// 			}
			// 			if (this.navigation_record.next_record && this.viewOnly) {
			// 				this.nextB = false;
			// 			}
			// 			if (this.navigation_record.prev_record && this.viewOnly) {
			// 				this.previousB = false;
			// 			}
			// 		}
			// 		const inputElem = <HTMLInputElement>this.myInput.nativeElement;
			// 		inputElem.select();

			// 	} else {
			// 		this.commonAPIService.showSuccessErrorMessage(result.data, 'error');
			// 	}
			// });
		}

	}

	// read image from html and bind with formGroup
	bindImageToForm(event) {
		this.openCropDialog(event);
	}
	patchStudentDetails() {
		this.studentdetailsform.patchValue({
			au_profileimage: this.studentdetails.au_profileimage ? this.studentdetails.au_profileimage : this.defaultsrc,
			au_login_id: this.studentdetails.au_login_id,
			au_full_name: this.studentdetails.au_full_name,
			au_class_id: this.studentdetails.au_class_id,
			au_mobile: this.studentdetails.au_mobile,
			au_email: this.studentdetails.au_email,
			au_hou_id: this.studentdetails.au_hou_id,
			au_sec_id: this.studentdetails.au_sec_id,
			epd_parent_name: this.studentdetails.parentinfo.length > 0 ? this.studentdetails.parentinfo[0].epd_parent_name : '',
			epd_contact_no: this.studentdetails.parentinfo.length > 0 ? this.studentdetails.parentinfo[0].epd_contact_no : '',
			epd_whatsapp_no: this.studentdetails.parentinfo.length > 0 ? this.studentdetails.parentinfo[0].epd_whatsapp_no : '',
			epd_parent_type: this.studentdetails.parentinfo.length > 0 ? this.studentdetails.parentinfo[0].epd_parent_type : '',
			mi_emergency_contact_name: this.studentdetails.medicalinfo.length > 0 ?
				this.studentdetails.medicalinfo[0].mi_emergency_contact_name : '',
			mi_emergency_contact_no: this.studentdetails.medicalinfo.length > 0 ? this.studentdetails.medicalinfo[0].mi_emergency_contact_no : ''
		});
	}
	uploadImage(fileName, au_profileimage) {
		this.sisService.uploadDocuments([
			{ fileName: fileName, imagebase64: au_profileimage, module: 'profile' }]).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.defaultsrc = result.data[0].file_url;
					this.studentdetailsform.patchValue({
						au_profileimage: result.data[0].file_url
					});
					if (result.data[0].file_url && this.studentdetailsform.value.au_login_id) {
						// this.sisService.studentImageProfileUpload({
						// 	au_login_id: this.studentdetailsform.value.au_login_id,
						// 	au_profileimage: result.data[0].file_url
						// }).subscribe((result1: any) => {
						// 	if (result1 && result1.status === 'ok') {
						// 		this.commonAPIService.showSuccessErrorMessage(result1.data, 'success');
						// 	}
						// });
					}
				}
			});
	}

	// function to check filed belong to provisional or admission
	fieldEnableAtAdmission() {
		if (this.belongToForm === 'provisional' || this.belongToForm === 'admission' || this.belongToForm === 'alumini') {
			return true;
		}
		return false;
	}
	nextUser(next_au_login_id) {
		this.nextEvent.next('1000');
		this.router.navigate([`../${this.belongToForm}`], { queryParams: { login_id: next_au_login_id }, relativeTo: this.route });
		this.commonAPIService.studentData.next('1001');
	}
	nextId(admno) {
		this.getStudentDetailsByAdmno(admno);
	}
	previousId(admno) {
		this.getStudentDetailsByAdmno(admno);
	}
	firstId(admno) {
		this.getStudentDetailsByAdmno(admno);
	}
	lastId(admno) {
		this.getStudentDetailsByAdmno(admno);
	}
	acceptCrop(result) {
		this.uploadImage(result.filename, result.base64);
	}
	acceptNo(event) {
		event.target.value = '';
	}

	loadOnEnrollmentId($event) {
		$event.preventDefault();
		this.getStudentDetailsByAdmno($event.target.value);
	}
	getStudentDetailsByAdmno(admno) {
		// this.sisService.getStudentInformation({ au_login_id: admno }).subscribe((result: any) => {
		// 	if (result.status === 'ok') {
		// 		this.lastRecordId = result.data[0].au_login_id;
		// 		this.commonAPIService.studentData.next(
		// 			{
		// 				last_record: admno, au_login_id: result.data[0].au_login_id, editable_status: result.data[0].editable_status
		// 			});
		// 	} else {
		// 		this.commonAPIService.showSuccessErrorMessage(result.data, 'error');
		// 	}
		// });
	}
	addNew() {
		this.commonAPIService.reRenderForm.next({ reRenderForm: false, addMode: true, editMode: false, deleteMode: false });
		this.nevigationStudentDetails(true);
	}
	nevigationStudentDetails(value) {
		this.previousB = value;
		this.nextB = value;
		this.firstB = value;
		this.lastB = value;
	}

	editForm() {
		this.nevigationStudentDetails(true);
		this.commonAPIService.reRenderForm.next({ reRenderForm: false, addMode: false, editMode: true, deleteMode: false });
	}

	deleteUser() {
		// this.sisService.deleteStudentDetails({ au_login_id: this.studentdetailsform.value.au_login_id }).subscribe((result: any) => {
		// 	if (result.status === 'ok') {
		// 		this.commonAPIService.showSuccessErrorMessage('Deleted successfully', 'success');
		// 		this.commonAPIService.reRenderForm.next({ reRenderForm: true, addMode: false, editMode: false, deleteMode: false });

		// 	}
		// });
	}
	deleteCancel() { }
	openConfig() {
		// if (this.processtypeService.getProcesstype() === '1') {
		// 	window.open('/sis/school/setup/enquiry', '_blank');
		// } else if (this.processtypeService.getProcesstype() === '2') {
		// 	window.open('/sis/school/setup/registration', '_blank');
		// } else if (this.processtypeService.getProcesstype() === '3') {
		// 	window.open('/sis/school/setup/provisional-admission', '_blank');
		// } else if (this.processtypeService.getProcesstype() === '4') {
		// 	window.open('/sis/school/setup/admission', '_blank');
		// } else {
		// 	window.open('/sis/school/setup/alumini', '_blank');
		// }
	}
	isExistUserAccessMenu(actionT) {
		// if (this.processtypeService.getProcesstype() === '1') {
		// 	if (actionT === 'add') {
		// 		return this.commonAPIService.isExistUserAccessMenu('202');
		// 	} else if (actionT === 'edit') {
		// 		return this.commonAPIService.isExistUserAccessMenu('203');
		// 	} else if (actionT === 'delete') {
		// 		return this.commonAPIService.isExistUserAccessMenu('204');
		// 	} else if (actionT === 'config') {
		// 		return this.commonAPIService.isExistUserAccessMenu('205');
		// 	} else if (actionT === 'request') {
		// 		return this.commonAPIService.isExistUserAccessMenu('206');
		// 	}
		// } else if (this.processtypeService.getProcesstype() === '2') {
		// 	if (actionT === 'add') {
		// 		return this.commonAPIService.isExistUserAccessMenu('209');
		// 	} else if (actionT === 'edit') {
		// 		return this.commonAPIService.isExistUserAccessMenu('210');
		// 	} else if (actionT === 'delete') {
		// 		return this.commonAPIService.isExistUserAccessMenu('211');
		// 	} else if (actionT === 'config') {
		// 		return this.commonAPIService.isExistUserAccessMenu('212');
		// 	} else if (actionT === 'request') {
		// 		return this.commonAPIService.isExistUserAccessMenu('213');
		// 	}
		// } else if (this.processtypeService.getProcesstype() === '3') {
		// 	if (actionT === 'add') {
		// 		return this.commonAPIService.isExistUserAccessMenu('222');
		// 	} else if (actionT === 'edit') {
		// 		return this.commonAPIService.isExistUserAccessMenu('223');
		// 	} else if (actionT === 'delete') {
		// 		return this.commonAPIService.isExistUserAccessMenu('224');
		// 	} else if (actionT === 'config') {
		// 		return this.commonAPIService.isExistUserAccessMenu('228');
		// 	} else if (actionT === 'request') {
		// 		return this.commonAPIService.isExistUserAccessMenu('229');
		// 	}
		// } else if (this.processtypeService.getProcesstype() === '4') {
		// 	if (actionT === 'add') {
		// 		return this.commonAPIService.isExistUserAccessMenu('225');
		// 	} else if (actionT === 'edit') {
		// 		return this.commonAPIService.isExistUserAccessMenu('226');
		// 	} else if (actionT === 'delete') {
		// 		return this.commonAPIService.isExistUserAccessMenu('227');
		// 	} else if (actionT === 'config') {
		// 		return this.commonAPIService.isExistUserAccessMenu('239');
		// 	} else if (actionT === 'request') {
		// 		return this.commonAPIService.isExistUserAccessMenu('240');
		// 	}
		// } else if (this.processtypeService.getProcesstype() === '5') {
		// 	if (actionT === 'add') {
		// 		return this.commonAPIService.isExistUserAccessMenu('250');
		// 	} else if (actionT === 'edit') {
		// 		return this.commonAPIService.isExistUserAccessMenu('251');
		// 	} else if (actionT === 'delete') {
		// 		return this.commonAPIService.isExistUserAccessMenu('252');
		// 	} else if (actionT === 'config') {
		// 		return this.commonAPIService.isExistUserAccessMenu('253');
		// 	} else if (actionT === 'request') {
		// 		return this.commonAPIService.isExistUserAccessMenu('254');
		// 	}
		// }
	}
	getLiveLabel() {
		// if (this.processtypeService.getProcesstype() === '1') {
		// 	return 'Live Enq.';
		// } else if (this.processtypeService.getProcesstype() === '2') {
		// 	return 'Live Reg.';
		// } else if (this.processtypeService.getProcesstype() === '3') {
		// 	return 'Live Pr. Adm.';
		// } else if (this.processtypeService.getProcesstype() === '4') {
		// 	return 'Live Adm.';
		// } else if (this.processtypeService.getProcesstype() === '5') {
		// 	return 'Live Alumini';
		// }
	}

	backTo() {
		let last_state_arr;
		let url;
		let login_id;
		let enrolment_type;
		let print_option;
		if (localStorage.getItem('suspension_last_state')) {
			this.backOnly = true;
			last_state_arr = JSON.parse(localStorage.getItem('suspension_last_state'));
			url = JSON.parse(last_state_arr['url']);
			login_id = last_state_arr['login_id'];
			this.router.navigate(url, { queryParams: { login_id: login_id }, relativeTo: this.route });
		} else if (localStorage.getItem('change_enrolment_number_last_state')) {
			this.backOnly = true;
			last_state_arr = JSON.parse(localStorage.getItem('change_enrolment_number_last_state'));
			url = JSON.parse(last_state_arr['url']);
			login_id = last_state_arr['login_id'];
			enrolment_type = last_state_arr['enrolment_type'];
			this.router.navigate(url, { queryParams: { login_id: login_id, enrolment_type: enrolment_type }, relativeTo: this.route });
		} else if (localStorage.getItem('change_enrolment_status_last_state')) {
			this.backOnly = true;
			last_state_arr = JSON.parse(localStorage.getItem('change_enrolment_status_last_state'));
			url = JSON.parse(last_state_arr['url']);
			login_id = last_state_arr['login_id'];
			enrolment_type = last_state_arr['enrolment_type'];
			this.router.navigate(url, { queryParams: { login_id: login_id, enrolment_type: enrolment_type }, relativeTo: this.route });
		} else if (localStorage.getItem('id_card_view_last_state')) {
			this.backOnly = true;
			last_state_arr = JSON.parse(localStorage.getItem('id_card_view_last_state'));
			url = JSON.parse(last_state_arr['url']);
			login_id = last_state_arr['login_id'];
			enrolment_type = last_state_arr['enrolment_type'];
			print_option = last_state_arr['print_option'];
			this.router.navigate(url, {
				queryParams: {
					login_id: login_id, enrolment_type: enrolment_type, print_option: print_option
				},
				relativeTo: this.route
			});
		} else if (localStorage.getItem('remark_entry_last_state')) {
			this.backOnly = true;
			last_state_arr = JSON.parse(localStorage.getItem('remark_entry_last_state'));
			url = JSON.parse(last_state_arr['url']);
			login_id = last_state_arr['login_id'];
			this.router.navigate(url, { queryParams: { login_id: login_id }, relativeTo: this.route });
		} else {
			this.backOnly = false;
		}
	}
	parent_type_fun(type) {
		if (type === 'F') {
			return 'Father Name';
		} else if (type === 'M') {
			return 'Mother Name';
		} else {
			return 'Guardian Name';
		}
	}
	openSearchDialog() {
		// const diaogRef = this.dialog.open(SearchViaNameComponent, {
		// 	width: '20%',
		// 	height: '30%',
		// 	position: {
		// 		top: '10%'
		// 	},
		// 	data: {}
		// });
		// diaogRef.afterClosed().subscribe((result: any) => {
		// 	if (result) {
		// 		let url = '';
		// 		if (Number(result.process_type) === 1) {
		// 			url = 'enquiry';
		// 		} else if (Number(result.process_type) === 2) {
		// 			url = 'registration';
		// 		} else if (Number(result.process_type) === 3) {
		// 			url = 'provisional';
		// 		} else if (Number(result.process_type) === 4) {
		// 			url = 'admission';
		// 		} else if (Number(result.process_type) === 5) {
		// 			url = 'alumini';
		// 		}
		// 		this.commonAPIService.setStudentData(result.adm_no, result.process_type);
		// 		if ((Number(result.process_type) === 1 && this.route.snapshot.routeConfig.path === 'enquiry')
		// 			|| (Number(result.process_type) === 2 && this.route.snapshot.routeConfig.path === 'registration')
		// 			|| (Number(result.process_type) === 3 && this.route.snapshot.routeConfig.path === 'provisional')
		// 			|| (Number(result.process_type) === 4 && this.route.snapshot.routeConfig.path === 'admission')
		// 			|| (Number(result.process_type) === 5 && this.route.snapshot.routeConfig.path === 'alumini')) {
		// 			this.getStudentDetailsByAdmno(result.adm_no);
		// 		} else {
		// 			this.router.navigate(['../' + url], { relativeTo: this.route });
		// 		}
		// 	}
		// });
	}
}
