import { Component, EventEmitter, OnInit, Output, Input, ViewChild, OnChanges, OnDestroy, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SisService, CommonAPIService } from '../../_services/index';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material';
import { SearchViaNameComponent } from '../../hr-shared/search-via-name/search-via-name.component';
import { DatePipe } from '@angular/common';

@Component({
	selector: 'app-employee-common',
	templateUrl: './employee-common.component.html',
	styleUrls: ['./employee-common.component.scss']
})

export class EmployeeCommonComponent implements OnInit {
	@Input() employeedetails: any;
	@ViewChild('cropModal') cropModal;
	@ViewChild('editReference') editReference;
	@ViewChild('enrollmentFocus') enrollmentFocus: ElementRef;
	nextEvent = new Subject();
	@Output() nextUserEvent: EventEmitter<any> = new EventEmitter<any>();
	employeeDetailsForm: FormGroup;
	studentdetails: any = {};
	commonDetails: any;
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
	defaultsrc = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/other.png';
	classArray = [];
	sectionArray = [];
	departmentArray = [];
	wingArray = [];
	designationArray: any[] = [];
	multipleFileArray: any[] = [];
	savedSettingsArray: any[] = [];
	settingsArray: any[] = [];
	enrolmentPlaceholder = 'Enrollment Id';
	deleteMessage = 'Are you sure, you want to delete ?';
	activateMessage = 'Are you sure, you want to activate the Employee ?';
	processAction = 'activate';
	studentdetailsflag = false;
	lastRecordId = 0;
	categoryOneArray: any[] = [];
	@ViewChild('deleteModal') deleteModal;
	@ViewChild('activateModal') activateModal;
	@ViewChild('myInput') myInput: ElementRef;
	openDeleteDialog = (data) => {
		this.deleteModal.openModal({ text: '' });
	}
	openActivateDialog = (data) => {
		this.activateModal.openModal({ text: '' });
	}
	getStuData = (data) => {
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
		var result = this.employeedetails;
		this.commonAPIService.employeeData.subscribe((data: any) => {
			console.log('data--', data);
			if (data && data.last_record) {
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
				if ((data && data.reRenderForm) || (data && data.viewMode)) {
					//this.employeedetails = {};
					//this.employeedetails.emp_status = 'live';
					this.getEmployeeDetail(this.lastRecordId);
				}
			}
			this.setActionControls(data);
		});

		this.getEmployeeDetail(result.emp_code_no);

	}

	ngOnChanges() {
		this.buildForm();
		//this.employeedetails.emp_status == 'live';
		this.getDepartment();
		this.getDesignation();
		this.getWing();
		this.getCategoryOne();
		if (this.employeedetails) {
			this.getEmployeeDetail(this.employeedetails.emp_code_no);
		}
	}
	getDepartment() {
		this.commonAPIService.getMaster({ type_id: '7' }).subscribe((result: any) => {
			if (result) {
				this.departmentArray = result;
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
		this.commonAPIService.getMaster({ type_id: '1', status: '1' }).subscribe((result: any) => {
			if (result) {
				this.wingArray = result;
			} else {
				this.wingArray = [];
			}

		});
	}
	onCancelSet() {
		if (this.commonDetails) {
			const result = this.commonDetails;
			let emp_honorific_id = result.emp_honorific_detail ? result.emp_honorific_detail.hon_id : '';
			let emp_designation_id = result.emp_designation_detail ? result.emp_designation_detail.config_id : '';
			let emp_department_id = result.emp_department_detail ? result.emp_department_detail.config_id : '';
			let emp_category_id = result.emp_category_detail ? result.emp_category_detail.cat_id : '';
			let emp_wing_id = result.emp_wing_detail ? result.emp_wing_detail.config_id : '';

			this.employeeDetailsForm.patchValue({
				emp_profile_pic: result.emp_profile_pic,
				emp_id: result.emp_id,
				emp_code_no: result.emp_code_no,
				emp_name: result.emp_name,
				emp_reference: result.emp_reference,
				emp_honorific_id: emp_honorific_id ? emp_honorific_id.toString() : '',
				emp_designation_id: emp_designation_id ? emp_designation_id.toString() : '',
				emp_department_id: emp_department_id ? emp_department_id.toString() : '',
				emp_category_id: emp_category_id ? Number(emp_category_id) : '',
				emp_wing_id: emp_wing_id ? emp_wing_id.toString() : '',
				emp_status: result.emp_status
			});
			if (result.emp_profile_pic) {
				this.defaultsrc = result.emp_profile_pic
			} else {
				this.defaultsrc = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/other.png';
			}
		}
	}
	getEmployeeDetail(emp_code_no) {
		if (emp_code_no) {
			this.previousB = true;
			this.nextB = true;
			this.firstB = true;
			this.lastB = true;
			console.log('emp_code_no', emp_code_no);
			//this.setActionControls({viewMode : true})
			this.commonAPIService.getEmployeeDetail({ emp_code_no: Number(emp_code_no) }).subscribe((result: any) => {
				if (result) {
					this.commonDetails = result;
					let emp_honorific_id = result.emp_honorific_detail ? result.emp_honorific_detail.hon_id : '';
					let emp_designation_id = result.emp_designation_detail ? result.emp_designation_detail.config_id : '';
					let emp_department_id = result.emp_department_detail ? result.emp_department_detail.config_id : '';
					let emp_category_id = result.emp_category_detail ? result.emp_category_detail.cat_id : '';
					let emp_wing_id = result.emp_wing_detail ? result.emp_wing_detail.config_id : '';

					this.employeeDetailsForm.patchValue({
						emp_profile_pic: result.emp_profile_pic,
						emp_id: result.emp_id,
						emp_code_no: result.emp_code_no,
						emp_name: result.emp_name,
						emp_reference: result.emp_reference,
						emp_honorific_id: emp_honorific_id ? emp_honorific_id.toString() : '',
						emp_designation_id: emp_designation_id ? emp_designation_id.toString() : '',
						emp_department_id: emp_department_id ? emp_department_id.toString() : '',
						emp_category_id: emp_category_id ? Number(emp_category_id) : '',
						emp_wing_id: emp_wing_id ? emp_wing_id.toString() : '',
						emp_status: result.emp_status
					});
					if (result.emp_profile_pic) {
						this.defaultsrc = result.emp_profile_pic
					} else {
						this.defaultsrc = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/other.png';
					}
					this.navigation_record = result.navigation;
					//this.employeedetails['last_record'] = emp_id;
				}

				if (this.navigation_record) {
					if (this.navigation_record.first_record &&
						this.navigation_record.first_record !== this.employeeDetailsForm.value.emp_code_no &&
						this.viewOnly) {
						this.firstB = false;
					}
					if (this.navigation_record.last_record &&
						this.navigation_record.last_record !== this.employeeDetailsForm.value.emp_code_no &&
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

				const inputElem = <HTMLInputElement>this.myInput.nativeElement;
				inputElem.select();
			});
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
			this.employeedetails = {};
			this.employeedetails.emp_status = 'live';
			this.employeeDetailsForm.reset();
			this.defaultsrc = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/other.png';
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
			if (this.lastEmployeeDetails['emp_code_no'] === this.employeeDetailsForm.value.emp_code_no) {
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
			emp_code_no: '',
			emp_name: '',
			emp_reference: '',
			emp_category_id: '',
			emp_honorific_id: '',
			emp_designation_id: '',
			emp_department_id: '',
			emp_wing_id: '',
			emp_status: 'live'
		});

	}
	// read image from html and bind with formGroup
	bindImageToForm(event) {
		let files = event.target.files[0].name;
		var ext = files.substring(files.lastIndexOf('.') + 1);
		if (ext === 'svg') {
			this.commonAPIService.showSuccessErrorMessage('Only Jpeg and Png image allowed.', 'error');
		} else {
			this.openCropDialog(event);
		}
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
		this.commonAPIService.employeeData.next('1001');
	}
	nextId(admno) {
		this.viewOnly = true;
		this.lastRecordId = admno;
		this.commonAPIService.employeeData.next(
			{
				last_record: admno
			});
	}
	previousId(admno) {
		this.viewOnly = true;
		this.lastRecordId = admno;
		this.commonAPIService.employeeData.next(
			{
				last_record: admno
			});
	}
	firstId(admno) {
		this.viewOnly = true;
		this.lastRecordId = admno;
		this.commonAPIService.employeeData.next(
			{
				last_record: admno
			});
	}
	lastId(admno) {
		this.viewOnly = true;
		this.lastRecordId = admno;
		this.commonAPIService.employeeData.next(
			{
				last_record: admno
			});
	}
	acceptCrop(result) {
		this.uploadImage(result.filename, result.base64);
	}

	acceptNo(event) {
		event.target.value = '';
	}

	loadEmployee(event) {
		this.viewOnly = true;

		this.commonAPIService.reRenderForm.next({ viewMode: true, editMode: false, deleteMode: false, addMode: false });
		this.lastRecordId = event.target.value;
		this.commonAPIService.employeeData.next(
			{
				last_record: event.target.value
			});

	}

	getEmployeeId($event) {
		this.viewOnly = true;
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

	deleteUser($event) {

		const date = new DatePipe('en-in').transform($event.processDate, 'yyyy-MM-dd')
		this.commonAPIService.deleteEmployee({
			"emp_id": this.employeeDetailsForm.value.emp_id,
			"emp_status": 'left',
			"emp_salary_detail.emp_organisation_relation_detail.dol": date

		}).subscribe((result: any) => {
			if (result) {
				const empData = new FormData();
				empData.append('au_login_id', this.employeedetails.emp_login_id.toString());
				empData.append('au_status', '0');
				this.commonAPIService.updateUser(empData).subscribe(
					(result: any) => {
						if (result && result.status === 'ok') {
							this.commonAPIService.showSuccessErrorMessage('Employee Detail Deleted Successfully', 'success');
							this.commonAPIService.reRenderForm.next({ reRenderForm: true, addMode: false, editMode: false, deleteMode: false });
						} else {
							this.commonAPIService.showSuccessErrorMessage('Error While Deleting Employee Detail', 'error');
						}
					});

			} else {
				this.commonAPIService.showSuccessErrorMessage('Error While Deleting Employee Detail', 'error');
			}
		});
	}

	activateUser($event) {

		const date = new DatePipe('en-in').transform($event.processDate, 'yyyy-MM-dd')
		this.commonAPIService.deleteEmployee({
			"emp_id": this.employeeDetailsForm.value.emp_id,
			"emp_status": 'live',
			"emp_salary_detail.emp_organisation_relation_detail.dol": date

		}).subscribe((result: any) => {
			if (result) {
				const empData = new FormData();
				empData.append('au_login_id', this.employeedetails.emp_login_id.toString());
				empData.append('au_status', '0');
				this.commonAPIService.updateUser(empData).subscribe(
					(result: any) => {
						if (result && result.status === 'ok') {
							this.commonAPIService.showSuccessErrorMessage('Employee Detail Activated Successfully', 'success');
							this.commonAPIService.reRenderForm.next({ reRenderForm: true, addMode: false, editMode: false, deleteMode: false });
						} else {
							this.commonAPIService.showSuccessErrorMessage('Error While Activating Employee Detail', 'error');
						}
					});

			} else {
				this.commonAPIService.showSuccessErrorMessage('Error While Activating Employee Detail', 'error');
			}
		});
	}

	deleteCancel() { }
	activateCancel() { }
	openConfig() {

	}
	isExistUserAccessMenu(mod_id) {
		return this.commonAPIService.isExistUserAccessMenu(mod_id)
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
	openSearchDialog() {
		const diaogRef = this.dialog.open(SearchViaNameComponent, {
			width: '20%',
			height: '30%',
			position: {
				top: '10%'
			},
			data: {}
		});
		diaogRef.afterClosed().subscribe((result: any) => {
			if (result) {
				this.viewOnly = true;
				this.commonAPIService.reRenderForm.next({ viewMode: true, editMode: false, deleteMode: false, addMode: false });
				this.lastRecordId = result.emp_id;
				this.commonAPIService.employeeData.next(
					{
						last_record: result.emp_code_no
					});
			}
		});
	}
}
