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
	lastEmployeeDetails: any;
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
	departmentArray = [];
	wingArray = [];
	designationArray = [];
	multipleFileArray: any[] = [];
	savedSettingsArray: any[] = [];
	settingsArray: any[] = [];
	enrolmentPlaceholder = 'Enrollment Id';
	deleteMessage = 'Are you sure, you want to delete ?';
	studentdetailsflag = false;
	lastRecordId;
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
		this.buildForm();
		this.getDepartment();
		this.getDesignation();
		this.getWing();
		var result = this.employeedetails;
		// if (result) {
		// 	this.employeeDetailsForm.patchValue({
		// 		emp_profile_pic: '',
		// 		emp_id: result.emp_id,
		// 		emp_name: result.emp_name,			
		// 		emp_honorific_id: result.emp_honorific_detail && result.emp_honorific_detail.hon_id ? result.emp_honorific_detail.hon_id : '',
		// 		emp_designation_id: result.emp_designation_detail && result.emp_designation_detail.des_id ? result.emp_designation_detail.des_id : '',
		// 		emp_department_id:  result.emp_department_detail && result.emp_department_detail.dpt_id ? result.emp_department_detail.dpt_id : '',
		// 		emp_wing_id: result.emp_wing_detail && result.emp_wing_detail.wing_id ? result.emp_wing_detail.wing_id : '',			
		// 	});
		// }

		this.commonAPIService.employeeData.subscribe((data: any) => {
			if (data && data.last_record) {
				if (this.login_id !== data.last_record) {
					this.studentdetailsflag = true;
				}
				this.login_id = data.last_record;
				this.lastRecordId = data.last_record;
				this.lastEmployeeDetails = {};
				if (this.lastrecordFlag) {
					this.lastEmployeeDetails.emp_id = this.lastRecordId;
					this.lastrecordFlag = false;
				}
				this.getEmployeeDetail(data.last_record);
				this.divFlag = true;
				this.stopFlag = true;
			}
		});

		this.commonAPIService.reRenderForm.subscribe((data: any) => {
			if (data) {
				this.studentdetailsflag = true;
				if ((data && data.reRenderForm) || (data && data.viewMode)) {
					this.getEmployeeDetail(this.lastRecordId);
				}
			}
			this.setActionControls(data);
		});

		this.getEmployeeDetail(result.emp_id);

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
		this.commonAPIService.getAllDesignation({}).subscribe((result: any) => {
			if (result) {
				this.designationArray = result;
			} else {
				this.designationArray = [];
			}

		});
	}


	getWing() {
		this.commonAPIService.getAllWing({}).subscribe((result: any) => {
			if (result) {
				this.wingArray = result;
			} else {
				this.wingArray = [];
			}

		});
	}


	getEmployeeDetail(emp_id) {
		this.previousB = true;
		this.nextB = true;
		this.firstB = true;
		this.lastB = true;
		this.commonAPIService.getEmployeeDetail({ emp_id: emp_id }).subscribe((result: any) => {
			//console.log('result', result);
			if (result) {
				this.employeeDetailsForm.patchValue({
					emp_profile_pic: result.emp_profile_pic,
					emp_id: result.emp_id,
					emp_name: result.emp_name,
					emp_honorific_id: result.emp_honorific_detail.hon_id,
					emp_designation_id: result.emp_designation_detail.des_id,
					emp_department_id: result.emp_department_detail.dpt_id,
					emp_wing_id: result.emp_wing_detail.wing_id,
				});
				if (result.emp_profile_pic) {
					this.defaultsrc = result.emp_profile_pic
				} else {
					this.defaultsrc = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/other.svg';
				}
			}
			this.navigation_record = result.navigation;
			if (this.navigation_record) {
				this.viewOnly = true;
				if (this.navigation_record.first_record &&
					this.navigation_record.first_record !== this.employeeDetailsForm.value.emp_id &&
					this.viewOnly) {
					this.firstB = false;
				}
				if (this.navigation_record.last_record &&
					this.navigation_record.last_record !== this.employeeDetailsForm.value.emp_id &&
					this.viewOnly) {
					this.lastB = false;
				}
				if (this.navigation_record.next_record && this.viewOnly) {
					this.nextB = false;
				}
				if (this.navigation_record.prev_record && this.viewOnly) {
					this.previousB = false;
				}
			}
			// this.lastRecordId = result.emp_id;
			// this.commonAPIService.employeeData.next(
			// 	{
			// 		last_record: emp_id
			// 	});
			const inputElem = <HTMLInputElement>this.myInput.nativeElement;
			inputElem.select();
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
			this.enrolmentPlaceholder = 'New Emp. Id';

		}
		if (data.editMode) {
			this.editOnly = false;
			this.addOnly = false;
			this.viewOnly = false;
			this.deleteOnly = false;
			this.stopFlag = true;
			this.divFlag = true;
			this.enrolmentPlaceholder = 'Emp. Id';
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
			this.lastEmployeeDetails = {};
			if (this.lastEmployeeDetails['emp_id'] === this.employeeDetailsForm.value.emp_id) {
				this.firstB = false;
				this.previousB = false;
				this.lastB = true;
				this.nextB = true;
			} else {
				this.navigationEmployeeDetails(false);
			}
			this.enrolmentPlaceholder = 'Emp. Id';
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
	// read image from html and bind with formGroup
	bindImageToForm(event) {
		this.openCropDialog(event);
	}

	uploadImage(fileName, au_profileimage) {
		this.sisService.uploadDocuments([
			{ fileName: fileName, imagebase64: au_profileimage, module: 'profile' }]).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.defaultsrc = result.data[0].file_url;
					this.employeeDetailsForm.patchValue({
						emp_profile_pic: result.data[0].file_url
					});
					if (result.data[0].file_url && this.employeeDetailsForm.value.emp_id) {
						this.commonAPIService.updateEmployee({
							emp_id: this.employeeDetailsForm.value.emp_id,
							emp_profile_pic: result.data[0].file_url
						}).subscribe((result1: any) => {
							if (result1 && result1.status === 'ok') {
								this.commonAPIService.showSuccessErrorMessage(result1.data, 'success');
							}
						});
					}
				}
			});
	}

	nextUser(next_au_login_id) {
		this.nextEvent.next('1000');
		//this.router.navigate([`../${this.belongToForm}`], { queryParams: { login_id: next_au_login_id }, relativeTo: this.route });
		this.commonAPIService.employeeData.next('1001');
	}
	nextId(admno) {
		this.lastRecordId = admno;
		this.commonAPIService.employeeData.next(
			{
				last_record: admno
			});
	}
	previousId(admno) {
		this.lastRecordId = admno;	
		this.commonAPIService.employeeData.next(
			{
				last_record: admno
			});
	}
	firstId(admno) {
		this.lastRecordId = admno;
		this.commonAPIService.employeeData.next(
			{
				last_record: admno
			});
	}
	lastId(admno) {
		this.lastRecordId = admno;
		this.commonAPIService.employeeData.next(
			{
				last_record: admno
			});
	}
	acceptCrop(result) {
		this.uploadImage(result.filename, result.base64);
	}

	getEmployeeId($event) {
		$event.preventDefault();
		this.getEmployeeDetail($event.target.value);
	}

	addNew() {
		this.commonAPIService.reRenderForm.next({ reRenderForm: false, addMode: true, editMode: false, deleteMode: false });
		this.setActionControls({ addMode: true });
		this.navigationEmployeeDetails(true);
	}
	navigationEmployeeDetails(value) {
		this.previousB = value;
		this.nextB = value;
		this.firstB = value;
		this.lastB = value;
	}

	editForm() {
		this.navigationEmployeeDetails(true);
		this.setActionControls({ editMode: true });
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


	openSearchDialog() {

	}
}
