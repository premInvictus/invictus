import { Component, EventEmitter, OnInit, Output, Input, ViewChild, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SisService, CommonAPIService, ProcesstypeService,SmartService } from '../../_services/index';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ConfirmValidParentMatcher } from '../ConfirmValidParentMatcher';

@Component({
	selector: 'app-student-details',
	templateUrl: './student-details.component.html',
	styleUrls: ['./student-details.component.scss']
})
export class StudentDetailsComponent implements OnInit, OnChanges {
	@Input() belongToForm: string;
	@Input() config: any;
	@ViewChild('cropModal') cropModal;
	@ViewChild('editReference') editReference;
	nextEvent = new Subject();
	// @Input taken from form admission
	@Output() nextUserEvent: EventEmitter<any> = new EventEmitter<any>();
	studentdetailsform: FormGroup;
	studentdetails: any = {};
	lastStudentDetails: any = {};
	lastrecordFlag = true;
	navigation_record: any = {};
	au_profileimage: any;
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
	addOnly = true;
	iddesabled = true;
	backOnly = false;
	defaultsrc = '/assets/images/avatar-pic.png';
	classArray = [];
	sectionArray = [];
	houseArray = [];
	multipleFileArray: any[] = [];
	savedSettingsArray: any[] = [];
	settingsArray: any[] = [];
	enrolmentPlaceholder = 'Enrollment Id';
	deleteMessage = 'Are you sure, you want to delete ?';
	studentdetailsflag = false;
	@ViewChild('deleteModal') deleteModal;
	openDeleteDialog = (data) => {
		this.deleteModal.openModal(data);
	}

	constructor(
		private fbuild: FormBuilder,
		private sisService: SisService,
		private SmartService: SmartService,
		private route: ActivatedRoute,
		private router: Router,
		private commonAPIService: CommonAPIService,
		private processtypeService: ProcesstypeService
	) {
	}
	ngOnInit() {
		this.getConfigureSetting();
		this.buildForm();
		this.getClass();
		this.getHouses();
		this.commonAPIService.studentData.subscribe((data: any) => {
			if (data && data.last_record) {
				if (this.login_id !== data.last_record) {
					this.studentdetailsflag = true;
				}
				this.login_id = data.last_record;
				if (this.lastrecordFlag) {
					this.lastStudentDetails.enrollment_id = data.last_record;
					this.lastrecordFlag = false;
				}
				this.getStudentDetails(data.last_record);
			}
			this.defaultsrc = '/assets/images/avatar-pic.png';

		});

		this.commonAPIService.reRenderForm.subscribe((data: any) => {
			if (data) {
				this.setActionControls(data);
			}
		});

		if (localStorage.getItem('suspension_last_state')) {
			this.backOnly = true;
		}

		if (localStorage.getItem('change_enrolment_number_last_state')) {
			this.backOnly = true;
		}

		if (localStorage.getItem('change_enrolment_status_last_state')) {
			this.backOnly = true;
		}

		if (localStorage.getItem('id_card_view_last_state')) {
			this.backOnly = true;
		}
	}
	ngOnChanges() {
		if (localStorage.getItem('remark_entry_last_state')) {
			this.backOnly = true;
		}
	}
	getConfigureSetting() {
		this.sisService.getConfigureSetting({
			cos_process_type: this.processtypeService.getProcesstype()
		}).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.savedSettingsArray = result.data;
				for (const item of this.savedSettingsArray) {
					if (item.cos_tb_id === '1') {
						this.settingsArray.push({
							cos_tb_id: item.cos_tb_id,
							cos_ff_id: item.cos_ff_id,
							cos_status: item.cos_status,
							ff_field_name: item.ff_field_name
						});
					}
				}
			}
		});
	}
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
			this.addOnly = false;
			this.viewOnly = false;
			this.deleteOnly = false;
			this.studentdetailsform.reset();
			this.defaultsrc = '/assets/images/avatar-pic.png';
			this.enrolmentPlaceholder = 'New Enrollment Id';

		}
		if (data.editMode) {
			this.editOnly = false;
			this.addOnly = false;
			this.viewOnly = false;
			this.deleteOnly = false;
			this.enrolmentPlaceholder = 'Enrollment Id';
		}
		if (data.viewMode) {
			this.viewOnly = true;
			this.addOnly = true;
			this.editOnly = true;
			this.deleteOnly = true;
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
			au_sec_id: ''

		});
	}
	getClass() {
		this.classArray = [];
		this.SmartService.getClassData({}).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.classArray = result.data;
			}
		});
	}
	getHouses() {
		this.houseArray = [];
		this.sisService.getHouses().subscribe((result: any) => {
			if (result.status === 'ok') {
				this.houseArray = result.data;
			}
		});
	}
	getSectionsByClass() {
		this.sectionArray = [];
		this.sisService.getSectionsByClass({ class_id: this.studentdetailsform.value.au_class_id }).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.sectionArray = result.data;
			}
		});
	}
	getStudentDetails(au_login_id) {
		if (au_login_id && this.studentdetailsflag) {
			this.studentdetailsflag = false;
			this.sisService.getStudentDetails({ au_login_id: au_login_id, au_status: '1' }).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.nextB = true;
					this.firstB = true;
					this.lastB = true;
					this.previousB = true;
					if (result && result.data && result.data[0]) {
						this.studentdetails = result.data[0];
					}
					if (result && result.data && result.data[1]) {
						this.navigation_record = result.data[1].navigation_record[0];
					}
					if (this.processtypeService.getProcesstype() === '1') {
						this.studentdetailsform.patchValue({
							au_enrollment_id: this.studentdetails.em_enq_no
						});
					} else if (this.processtypeService.getProcesstype() === '2') {
						this.studentdetailsform.patchValue({
							au_enrollment_id: this.studentdetails.em_regd_no
						});
					} else if (this.processtypeService.getProcesstype() === '3') {
						this.studentdetailsform.patchValue({
							au_enrollment_id: this.studentdetails.em_provisional_admission_no
						});
					} else if (this.processtypeService.getProcesstype() === '4') {
						this.studentdetailsform.patchValue({
							au_enrollment_id: this.studentdetails.em_admission_no
						});
					} else if (this.processtypeService.getProcesstype() === '5') {
						this.studentdetailsform.patchValue({
							au_enrollment_id: this.studentdetails.em_alumini_no
						});
					}
					this.patchStudentDetails();
					this.getSectionsByClass();

					this.defaultsrc = this.studentdetails.au_profileimage !== '' ? this.studentdetails.au_profileimage : this.defaultsrc;
					if (this.navigation_record) {
						this.viewOnly = true;
						if (this.navigation_record.first_record &&
							this.navigation_record.first_record !== this.studentdetailsform.value.au_enrollment_id &&
							this.viewOnly) {
							this.firstB = false;
						}
						if (this.navigation_record.last_record &&
							this.navigation_record.last_record !== this.studentdetailsform.value.au_enrollment_id &&
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
				} else {
					this.commonAPIService.showSuccessErrorMessage(result.data, 'error');
				}
			});
		}

	}

	// read image from html and bind with formGroup
	bindImageToForm(event) {
		this.openCropDialog(event);
	}
	patchStudentDetails() {
		this.studentdetailsform.patchValue({
			au_profileimage: this.studentdetails.au_profileimage ? this.studentdetails.au_profileimage : '/assets/images/avatar-pic.png',
			au_login_id: this.studentdetails.au_login_id,
			au_full_name: this.studentdetails.au_full_name,
			au_class_id: this.studentdetails.au_class_id,
			au_mobile: this.studentdetails.au_mobile,
			au_email: this.studentdetails.au_email,
			au_hou_id: this.studentdetails.au_hou_id,
			au_sec_id: this.studentdetails.au_sec_id
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
						this.sisService.studentImageProfileUpload({
							au_login_id: this.studentdetailsform.value.au_login_id,
							au_profileimage: result.data[0].file_url
						}).subscribe((result1: any) => {
							if (result1 && result1.status === 'ok') {
								this.commonAPIService.showSuccessErrorMessage(result1.data, 'success');
							}
						});
					}
				}
			});
	}

	// function to check filed belong to provisional or admission
	fieldEnableAtAdmission() {
		if (this.belongToForm === 'provisional' || this.belongToForm === 'admission') {
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
		this.sisService.getStudentDetails({ au_login_id: admno }).subscribe((result: any) => {
			if (result.status === 'ok') {
				// localStorage.setItem('currentStudent',result.data);
				console.log("studentClass ls >>>>>>>>>>",localStorage.getItem('currentStudent'));
				this.commonAPIService.studentData.next({ last_record: admno, au_login_id: result.data[0].au_login_id });
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.data, 'error');
			}
		});
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
		this.sisService.deleteStudentDetails({ au_login_id: this.studentdetailsform.value.au_login_id }).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.commonAPIService.showSuccessErrorMessage('Deleted successfully', 'success');
				this.commonAPIService.reRenderForm.next({ reRenderForm: true, addMode: false, editMode: false, deleteMode: false });

			}
		});
	}
	deleteCancel() {}
	openConfig() {
		if (this.processtypeService.getProcesstype() === '1') {
			window.open('/school/setup/enquiry', '_blank');
		} else if (this.processtypeService.getProcesstype() === '2') {
			window.open('/school/setup/registration', '_blank');
		} else if (this.processtypeService.getProcesstype() === '3') {
			window.open('/school/setup/provisional-admission', '_blank');
		} else if (this.processtypeService.getProcesstype() === '4') {
			window.open('/school/setup/admission', '_blank');
		} else {
			window.open('/school/setup/alumini', '_blank');
		}
	}
	isExistUserAccessMenu(actionT) {
		if (this.processtypeService.getProcesstype() === '1') {
			if (actionT === 'add') {
				return this.commonAPIService.isExistUserAccessMenu('202');
			} else if (actionT === 'edit') {
				return this.commonAPIService.isExistUserAccessMenu('203');
			} else if (actionT === 'delete') {
				return this.commonAPIService.isExistUserAccessMenu('204');
			} else if (actionT === 'config') {
				return this.commonAPIService.isExistUserAccessMenu('205');
			} else if (actionT === 'request') {
				return this.commonAPIService.isExistUserAccessMenu('206');
			}
		} else if (this.processtypeService.getProcesstype() === '2') {
			if (actionT === 'add') {
				return this.commonAPIService.isExistUserAccessMenu('209');
			} else if (actionT === 'edit') {
				return this.commonAPIService.isExistUserAccessMenu('210');
			} else if (actionT === 'delete') {
				return this.commonAPIService.isExistUserAccessMenu('211');
			} else if (actionT === 'config') {
				return this.commonAPIService.isExistUserAccessMenu('212');
			} else if (actionT === 'request') {
				return this.commonAPIService.isExistUserAccessMenu('213');
			}
		} else if (this.processtypeService.getProcesstype() === '3') {
			if (actionT === 'add') {
				return this.commonAPIService.isExistUserAccessMenu('222');
			} else if (actionT === 'edit') {
				return this.commonAPIService.isExistUserAccessMenu('223');
			} else if (actionT === 'delete') {
				return this.commonAPIService.isExistUserAccessMenu('224');
			} else if (actionT === 'config') {
				return this.commonAPIService.isExistUserAccessMenu('228');
			} else if (actionT === 'request') {
				return this.commonAPIService.isExistUserAccessMenu('229');
			}
		} else if (this.processtypeService.getProcesstype() === '4') {
			if (actionT === 'add') {
				return this.commonAPIService.isExistUserAccessMenu('225');
			} else if (actionT === 'edit') {
				return this.commonAPIService.isExistUserAccessMenu('226');
			} else if (actionT === 'delete') {
				return this.commonAPIService.isExistUserAccessMenu('227');
			} else if (actionT === 'config') {
				return this.commonAPIService.isExistUserAccessMenu('239');
			} else if (actionT === 'request') {
				return this.commonAPIService.isExistUserAccessMenu('240');
			}
		} else if (this.processtypeService.getProcesstype() === '5') {
			if (actionT === 'add') {
				return this.commonAPIService.isExistUserAccessMenu('250');
			} else if (actionT === 'edit') {
				return this.commonAPIService.isExistUserAccessMenu('251');
			} else if (actionT === 'delete') {
				return this.commonAPIService.isExistUserAccessMenu('252');
			} else if (actionT === 'config') {
				return this.commonAPIService.isExistUserAccessMenu('253');
			} else if (actionT === 'request') {
				return this.commonAPIService.isExistUserAccessMenu('254');
			}
		}
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
				}, relativeTo: this.route
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
}
