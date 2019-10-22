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

	// @Input() belongToForm: string;
	// @Input() config: any;
	@Input() employeedetails: any;
	@ViewChild('cropModal') cropModal;
	@ViewChild('editReference') editReference;
	@ViewChild('enrollmentFocus') enrollmentFocus: ElementRef;
	nextEvent = new Subject();
	@Output() nextUserEvent: EventEmitter<any> = new EventEmitter<any>();
	employeeDetailsForm: FormGroup;
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
		//this.settingsArray = this.configSetting;
		this.buildForm();
		console.log( this.employeedetails);
		//this.getEmployeeNavigationRecords();

		var result = this.employeedetails;
		if (result) {
			this.employeeDetailsForm.patchValue({
				emp_profile_pic: '',
				emp_id: result.emp_id,
				emp_name: result.emp_name,			
				emp_honorific_id: result.emp_honorific_detail && result.emp_honorific_detail.hon_id ? result.emp_honorific_detail.hon_id : '',
				emp_designation_id: result.emp_designation_detail && result.emp_designation_detail.des_id ? result.emp_designation_detail.des_id : '',
				emp_department_id:  result.emp_department_detail && result.emp_department_detail.dpt_id ? result.emp_department_detail.dpt_id : '',
				emp_wing_id: result.emp_wing_detail && result.emp_wing_detail.wing_id ? result.emp_wing_detail.wing_id : '',			
			});
		}
		
	}

	// getEmployeeNavigationRecords() {
	// 	this.commonAPIService.getEmployeeNavigationRecords({}).subscribe((result: any) => {
	// 		console.log('result', result);
	// 		this.getEmployeeDetail(result[0].emp_id);
	// 	});
	// }

	getEmployeeDetail(emp_id) {
		this.commonAPIService.getEmployeeDetail({emp_id:emp_id}).subscribe((result: any) => {
			console.log('result', result);
			this.employeeDetailsForm.patchValue({
				emp_profile_pic: '',
				emp_id: result.emp_id,
				emp_name: result.emp_name,			
				emp_honorific_id: result.emp_honorific_detail.hon_id,
				emp_designation_id: result.emp_designation_detail.des_id,
				emp_department_id:  result.emp_department_detail.dpt_id,
				emp_wing_id: result.emp_wing_detail.wing_id,			
			});
			console.log('this.employeeDetailsForm', this.employeeDetailsForm);
		});
	}
	
	setActionControls(data) {
		if (data.addMode) {
			this.editOnly = false;
			this.stopFlag = false;
			this.divFlag = false;
			this.addOnly = false;
			this.viewOnly = false;
			this.deleteOnly = false;
			this.employeeDetailsForm.reset();
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
			// this.commonAPIService.studentData.next(this.employeeDetailsForm.value.au_enrollment_id);
			if (this.lastStudentDetails.enrollment_id === this.employeeDetailsForm.value.au_enrollment_id) {
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
		this.employeeDetailsForm = this.fbuild.group({
			emp_profile_pic: '',
			emp_id: '',
			emp_name: '',			
			emp_honorific_id: '',
			emp_designation_id: '',
			emp_department_id: '',
			emp_wing_id: '',			
		});

	}
	
	getSectionsByClass() {
		this.sectionArray = [];
		this.sisService.getSectionsByClass({ class_id: this.employeeDetailsForm.value.au_class_id }).subscribe((result: any) => {
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
			// 			this.employeeDetailsForm.patchValue({
			// 				au_enrollment_id: this.studentdetails.em_enq_no
			// 			});
			// 		} else if (this.processtypeService.getProcesstype() === '2') {
			// 			this.employeeDetailsForm.patchValue({
			// 				au_enrollment_id: this.studentdetails.em_regd_no
			// 			});
			// 		} else if (this.processtypeService.getProcesstype() === '3') {
			// 			this.employeeDetailsForm.patchValue({
			// 				au_enrollment_id: this.studentdetails.em_provisional_admission_no
			// 			});
			// 		} else if (this.processtypeService.getProcesstype() === '4') {
			// 			this.employeeDetailsForm.patchValue({
			// 				au_enrollment_id: this.studentdetails.em_admission_no
			// 			});
			// 		} else if (this.processtypeService.getProcesstype() === '5') {
			// 			this.employeeDetailsForm.patchValue({
			// 				au_enrollment_id: this.studentdetails.em_alumini_no
			// 			});
			// 		}
			// 		this.patchStudentDetails();
			// 		this.getSectionsByClass();

			// 		this.defaultsrc = this.studentdetails.au_profileimage !== '' ? this.studentdetails.au_profileimage : this.defaultsrc;
			// 		if (this.navigation_record) {
			// 			this.viewOnly = true;
			// 			if (this.navigation_record.first_record &&
			// 				this.navigation_record.first_record !== this.employeeDetailsForm.value.au_enrollment_id &&
			// 				this.viewOnly) {
			// 				this.firstB = false;
			// 			}
			// 			if (this.navigation_record.last_record &&
			// 				this.navigation_record.last_record !== this.employeeDetailsForm.value.au_enrollment_id &&
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
		this.employeeDetailsForm.patchValue({
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
					this.employeeDetailsForm.patchValue({
						au_profileimage: result.data[0].file_url
					});
					if (result.data[0].file_url && this.employeeDetailsForm.value.au_login_id) {
						// this.sisService.studentImageProfileUpload({
						// 	au_login_id: this.employeeDetailsForm.value.au_login_id,
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
		// if (this.belongToForm === 'provisional' || this.belongToForm === 'admission' || this.belongToForm === 'alumini') {
		// 	return true;
		// }
		return false;
	}
	nextUser(next_au_login_id) {
		this.nextEvent.next('1000');
		//this.router.navigate([`../${this.belongToForm}`], { queryParams: { login_id: next_au_login_id }, relativeTo: this.route });
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

	getEmployeeId($event) {
		$event.preventDefault();
		this.getEmployeeDetail($event.target.value);
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
		// this.sisService.deleteStudentDetails({ au_login_id: this.employeeDetailsForm.value.au_login_id }).subscribe((result: any) => {
		// 	if (result.status === 'ok') {
		// 		this.commonAPIService.showSuccessErrorMessage('Deleted successfully', 'success');
		// 		this.commonAPIService.reRenderForm.next({ reRenderForm: true, addMode: false, editMode: false, deleteMode: false });

		// 	}
		// });
	}
	deleteCancel() { }
	openConfig() {
		
	}
	isExistUserAccessMenu(actionT) {
	}
	getLiveLabel() {
	}

	backTo() {
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

	}
}
