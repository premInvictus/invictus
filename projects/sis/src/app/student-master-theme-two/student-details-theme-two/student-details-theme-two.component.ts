import { Component, EventEmitter, OnInit, Output, Input, ViewChild, OnChanges, OnDestroy, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SisService, CommonAPIService, ProcesstypeService, SmartService } from '../../_services/index';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { saveAs } from 'file-saver';
import { MatDialog } from '@angular/material';
import { SearchViaNameComponent } from '../../sharedmodule/search-via-name/search-via-name.component';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
	selector: 'app-student-details-theme-two',
	templateUrl: './student-details-theme-two.component.html',
	styleUrls: ['./student-details-theme-two.component.scss']
})

export class StudentDetailsThemeTwoComponent implements OnInit, OnChanges, OnDestroy {
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
	defaultsrc = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/other.png';
	classArray = [];
	sectionArray = [];
	houseArray:any[] = [];
	bloodGroupArray: any[] = [];
	multipleFileArray: any[] = [];
	savedSettingsArray: any[] = [];
	settingsArray: any[] = [];
	settingsArray2: any[] = [];
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
		this.getStudentDetailsByAdmno(data);
	}
	generalRemarkData: any[] = [];
	managementRemarkData: any[] = [];
	admissionRemarkData: any[] = [];
	studentDet: any[] = [];
	parentDet: any[] = [];
	sibDet: any[] = [];
	pdfArray: any[] = [];
	previousSchoolDet: any[] = [];
	payMents: any[] = [];
	transportDet: any[] = [];
	customQArr: any[] = [];
	skillDetails: any[] = [];
	classArray2: any[] = [];
	sessionArray: any[] = [];
	nationalityArray: any[] = [];
	religionsArray: any[] = [];
	motherTongueArray: any[] = [];
	genderArray: any[] = [];
	categoryArray: any[] = [];
	countryArray: any[] = [];
	stateArray: any[] = [];
	qualificationArray: any[] = [];
	annualIncomeArray: any[] = [];
	occupationTypeArray: any[] = [];
	activityArray: any[] = [];
	activityClubArray: any[] = [];
	levelOfIntrestArray: any[] = [];
	eventLevelArray: any[] = [];
	authorityArray: any[] = [];
	busRouteArray: any[] = [];
	busStopArray: any[] = [];
	paymentmodes: any[] = [];
	schoolInfo: any = {};
	reasonArray: any[] = [];
	session: any = {};
	pdfUrl: any;
	registrationNo: any;
	cityName: any;
	contact_no:any;
	whatsapp_no:any;
	constructor(
		private fbuild: FormBuilder,
		private sisService: SisService,
		private SmartService: SmartService,
		private route: ActivatedRoute,
		public dom: DomSanitizer,
		private router: Router,
		private commonAPIService: CommonAPIService,
		public processtypeService: ProcesstypeService,
		public dialog: MatDialog
	) {
	}
	ngOnInit() {
		// this.getConfigureSetting();
		this.session = JSON.parse(localStorage.getItem('session'));
		this.settingsArray = this.configSetting;
		this.settingsArray2 = this.configSetting;
		this.buildForm();
		this.getSchool();
		this.getClass2();
		this.getConfigureSetting();
		this.getSession();
		this.getNationality();
		this.getReligionDetails();
		this.getMotherTongue();
		this.getCountry();
		this.getState();
		this.getGender();
		this.getCategory();
		this.getQualifications();
		this.getAnnualIncome();
		this.getOccupationType();
		this.getActivity();
		this.getActivityClub();
		this.getLevelOfInterest();
		this.getEventLevel();
		this.getAuthority();
		this.getBusRoute();
		this.getBusStop();
		this.getReason();
		this.getClass();
		this.getHouses();
		this.getBloodGroup();
		const inputElem = <HTMLInputElement>this.myInput.nativeElement;
		inputElem.select();
		this.commonAPIService.studentData.subscribe((data: any) => {
			if (data && data.last_record) {
				if (this.login_id !== data.last_record) {
					this.studentdetailsflag = true;
				}
				this.login_id = data.last_record;
				this.lastRecordId = data.last_record;
				if (this.lastrecordFlag) {
					this.lastStudentDetails.enrollment_id = data.last_record;
					this.lastrecordFlag = false;
				}
				this.getStudentInformation(data.last_record);
				this.divFlag = true;
				this.stopFlag = true;
			}
		});

		this.commonAPIService.reRenderForm.subscribe((data: any) => {
			if (data) {
				this.studentdetailsflag = true;
				if ((data && data.reRenderForm) || (data && data.viewMode)) {
					this.getStudentInformation(this.lastRecordId);
				}
			}
			this.setActionControls(data);
		});
		this.commonAPIService.studentSearchByName.subscribe((data: any) => {
			if (data) {
				this.getStudentDetailsByAdmno(data);
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
		if (this.processtypeService.getProcesstype() === '1' ||
			this.processtypeService.getProcesstype() === '2') {
			this.classPlaceHolder = 'Class Applied For';
		} else {
			this.classPlaceHolder = 'Class';
		}
	}
	getConfigureSetting() {
		this.settingsArray = [];
		this.sisService.getConfigureSetting({
			cos_process_type: this.processtypeService.getProcesstype()
		}).subscribe((res: any) => {
			if (res.status === 'ok') {
				this.savedSettingsArray = res.data;
				for (const item of this.savedSettingsArray) {
					this.settingsArray.push({
						cos_tb_id: item.cos_tb_id,
						cos_ff_id: item.cos_ff_id,
						cos_status: item.cos_status
					});
				}
			}
		});
	}
	getSession() {
		this.sisService.getSession().subscribe(
			(result: any) => {
				if (result.status === 'ok') {
					for (const item of result.data) {
						this.sessionArray[item.ses_id] = item.ses_name;
					}
				}
			}
		);
	}
	getNationality() {
		this.sisService.getNationality().subscribe(
			(result: any) => {
				if (result.status === 'ok') {
					for (const item of result.data) {
						this.nationalityArray[item.nat_id] = item.nat_name;
					}
				}
			}
		);
	}
	getReligionDetails() {
		this.sisService.getReligionDetails({}).subscribe(
			(result: any) => {
				if (result.status === 'ok') {
					for (const item of result.data) {
						this.religionsArray[item.rel_id] = item.rel_name;
					}
				}
			}
		);
	}
	getMotherTongue() {
		this.sisService.getMotherTongue({}).subscribe(
			(result: any) => {
				if (result.status === 'ok') {
					for (const item of result.data) {
						this.motherTongueArray[item.mt_id] = item.mt_name;
					}
				}
			}
		);
	}
	getGender() {
		this.sisService.getGender().subscribe(
			(result: any) => {
				if (result.status === 'ok') {
					for (const item of result.data) {
						this.genderArray[item.gen_alias] = item.gen_name;
					}
				}
			}
		);
	}
	getCategory() {
		this.sisService.getCategory().subscribe(
			(result: any) => {
				if (result.status === 'ok') {
					for (const item of result.data) {
						this.categoryArray[item.cat_id] = item.cat_name;
					}
				}
			}
		);
	}

	getCountry() {
		this.sisService.getCountry().subscribe(
			(result: any) => {
				if (result.status === 'ok') {
					for (const item of result.data) {
						this.countryArray[item.cou_id] = item.cou_name;
					}
				}
			}
		);
	}
	getState() {
		this.sisService.getState().subscribe(
			(result: any) => {
				if (result.status === 'ok') {
					for (const item of result.data) {
						this.stateArray[item.sta_id] = item.sta_name;
					}
				}
			}
		);
	}

	getQualifications() {
		this.sisService.getQualifications().subscribe((result: any) => {
			if (result) {
				for (const item of result.data) {
					this.qualificationArray[item.qlf_id] = item.qlf_name;
				}
			}
		});
	}
	getAnnualIncome() {
		this.sisService.getAnnualIncome().subscribe((result: any) => {
			if (result) {
				for (const item of result.data) {
					this.annualIncomeArray[item.ai_id] = item.ai_from_to;
				}
			}
		});
	}
	getOccupationType() {
		this.sisService.getOccupationType().subscribe((result: any) => {
			if (result) {
				for (const item of result.data) {
					this.occupationTypeArray[item.ocpt_id] = item.ocpt_name;
				}
			}
		});
	}
	getActivity() {
		this.sisService.getActivity().subscribe((result: any) => {
			if (result) {
				for (const item of result.data) {
					this.activityArray[item.act_id] = item.act_name;
				}
			}
		});
	}
	getActivityClub() {
		this.sisService.getActivityClub().subscribe((result: any) => {
			if (result) {
				for (const item of result.data) {
					this.activityClubArray[item.acl_id] = item.acl_name;
				}
			}
		});
	}

	getLevelOfInterest() {
		this.sisService.getLevelOfInterest().subscribe((result: any) => {
			if (result) {
				for (const item of result.data) {
					this.levelOfIntrestArray[item.loi_id] = item.loi_name;
				}
			}
		});
	}
	getEventLevel() {
		this.sisService.getEventLevel().subscribe((result: any) => {
			if (result) {
				for (const item of result.data) {
					this.eventLevelArray[item.el_id] = item.el_name;
				}
			}
		});
	}
	getAuthority() {
		this.sisService.getAuthority().subscribe((result: any) => {
			if (result) {
				for (const item of result.data) {
					this.authorityArray[item.aut_id] = item.aut_name;
				}
			}
		});
	}
	getBusRoute() {
		this.busRouteArray = [];
		this.sisService.getRoutes({}).subscribe(
			(result: any) => {
				if (result) {
					this.busRouteArray = result.data;
				}
			}
		);
	}

	getBusStop() {
		this.busStopArray = [];
		this.sisService.getStoppages({}).subscribe(
			(result: any) => {
				if (result) {
					this.busStopArray = result.data;
				}
			}
		);
	}
	getReason() {
		this.sisService.getReason({ reason_type: '4' }).subscribe((result: any) => {
			if (result) {
				for (const item of result.data) {
					this.reasonArray[item.reason_id] = item.reason_title;
				}
			}
		});
	}
	getSchool() {
		this.sisService.getSchool().subscribe(
			(result: any) => {
				if (result.status === 'ok') {
					this.schoolInfo = result.data[0];
				}
			}
		);
	}
	getClass2() {
		this.sisService.getClass({}).subscribe(
			(result: any) => {
				if (result.status === 'ok') {
					for (const item of result.data) {
						this.classArray2[item.class_id] = item.class_name;
					}
				}
			}
		);
	}
	checkIfFieldExist2(value) {
		const findex = this.savedSettingsArray.findIndex(f => f.ff_field_name === value);
		if (findex !== -1 && this.savedSettingsArray[findex]['cos_status'] === 'Y') {
			return true;
		} else if (findex !== -1 && this.savedSettingsArray[findex]['cos_status'] === 'N') {
			return false;
		} else {
			return false;
		}
	}
	ngOnChanges() {
		if (localStorage.getItem('remark_entry_last_state')) {
			this.backOnly = true;
		}
	}

	ngOnDestroy() {
		localStorage.removeItem('suspension_last_state');
		localStorage.removeItem('change_enrolment_number_last_state');
		localStorage.removeItem('change_enrolment_status_last_state');
		localStorage.removeItem('id_card_view_last_state');
		localStorage.removeItem('remark_entry_last_state');
	}
	checkIfFieldExist(value) {
		
		const findex = this.settingsArray2.findIndex(f => f.ff_field_name === value);
		if (findex !== -1 && this.settingsArray2[findex]['cos_status'] === 'Y') {
			return true;
		} else if (findex !== -1 && this.settingsArray2[findex]['cos_status'] === 'N') {
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
			this.defaultsrc = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/other.png';
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
			au_process_class: '',
			au_class_id: '',
			au_mobile: '',
			au_email: '',
			au_hou_id: '',
			au_sec_id: '',
			epd_parent_name: '',
			au_reference_no: '',
			epd_contact_no: '',
			epd_whatsapp_no: '',
			mi_emergency_contact_name: '',
			mi_emergency_contact_no: '',
			mi_blood_group: '',
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
	getStudentInformation(au_login_id) {
		if (au_login_id && this.studentdetailsflag) {
			this.studentdetailsflag = false;
			this.sisService.getStudentInformation({ au_login_id: au_login_id }).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.nextB = true;
					this.firstB = true;
					this.lastB = true;
					this.previousB = true;
					this.studentdetails = [];
					if (result && result.data && result.data[0]) {
						this.studentdetails = result.data[0];
						
						this.gender = this.studentdetails.au_gender;
						if (this.gender === 'M') {
							this.defaultsrc = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/man.png';
						} else if (this.gender === 'F') {
							this.defaultsrc = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/girl.png';
						} else {
							this.defaultsrc = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/other.png';
						}
					}
					if (result && result.data && result.data[0].navigation[0]) {
						this.navigation_record = result.data[0].navigation[0];
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
					const inputElem = <HTMLInputElement>this.myInput.nativeElement;
					inputElem.select();

				} else {
					this.commonAPIService.showSuccessErrorMessage(result.data, 'error');
				}
			});
		}

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
	patchStudentDetails() {
		console.log(this.studentdetails , ' ssssssssssssssssssssssssssssssssss', this.studentdetails.au_reference_no);
		
		this.studentdetailsform.patchValue({
			au_profileimage: this.studentdetails.au_profileimage ? this.studentdetails.au_profileimage : this.defaultsrc,
			au_login_id: this.studentdetails.au_login_id,
			au_full_name: this.studentdetails.au_full_name,
			au_process_class: this.studentdetails.au_process_class != "0" ? this.studentdetails.au_process_class : this.studentdetails.au_class_id,
			au_class_id: this.studentdetails.au_class_id,
			au_mobile: this.studentdetails.au_mobile,
			au_email: this.studentdetails.au_email,
			au_hou_id: this.studentdetails.au_hou_id,
			au_sec_id: this.studentdetails.au_sec_id,
			au_reference_no: this.studentdetails.au_reference_no,
			epd_parent_name: this.studentdetails.parentinfo && this.studentdetails.parentinfo.length > 0 ? this.studentdetails.parentinfo[0].epd_parent_name : '',
			epd_contact_no: this.studentdetails.parentinfo && this.studentdetails.parentinfo.length > 0 ? this.studentdetails.parentinfo[0].epd_contact_no : '',		
			epd_whatsapp_no: this.studentdetails.parentinfo && this.studentdetails.parentinfo.length > 0 ? this.studentdetails.parentinfo[0].epd_whatsapp_no : '',
			epd_parent_type: this.studentdetails.parentinfo && this.studentdetails.parentinfo.length > 0 ? this.studentdetails.parentinfo[0].epd_parent_type : '',
			mi_emergency_contact_name: this.studentdetails.medicalinfo && this.studentdetails.medicalinfo.length > 0 ?
				this.studentdetails.medicalinfo[0].mi_emergency_contact_name : '',
			mi_emergency_contact_no: this.studentdetails.medicalinfo && this.studentdetails.medicalinfo.length > 0 ? this.studentdetails.medicalinfo[0].mi_emergency_contact_no : '',
			mi_blood_group: this.studentdetails.medicalinfo && this.studentdetails.medicalinfo.length > 0 ? this.studentdetails.medicalinfo[0].mi_blood_group : '',
		});
		this.contact_no = this.studentdetails.parentinfo && this.studentdetails.parentinfo.length > 0 ? this.studentdetails.parentinfo[0].epd_contact_no : '';
		this.whatsapp_no= this.studentdetails.parentinfo && this.studentdetails.parentinfo.length > 0 ? this.studentdetails.parentinfo[0].epd_whatsapp_no : '';

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
		this.sisService.getStudentInformation({ au_login_id: admno }).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.lastRecordId = result.data[0].au_login_id;
				this.commonAPIService.studentData.next(
					{
						last_record: admno, au_login_id: result.data[0].au_login_id, editable_status: result.data[0].editable_status
					});
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.data, 'error');
				if (this.studentdetailsform) {
					this.studentdetailsform.reset();
				}
				this.commonAPIService.reRenderForm.next(
					{ reRenderForm: true, addMode: false, editMode: false, deleteMode: false, viewMode: true });
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
	deleteCancel() { }
	openConfig() {
		if (this.processtypeService.getProcesstype() === '1') {
			window.open('/sis/school/setup/enquiry', '_blank');
		} else if (this.processtypeService.getProcesstype() === '2') {
			window.open('/sis/school/setup/registration', '_blank');
		} else if (this.processtypeService.getProcesstype() === '3') {
			window.open('/sis/school/setup/provisional-admission', '_blank');
		} else if (this.processtypeService.getProcesstype() === '4') {
			window.open('/sis/school/setup/admission', '_blank');
		} else {
			window.open('/sis/school/setup/alumini', '_blank');
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
	getLiveLabel() {
		if (this.processtypeService.getProcesstype() === '1') {
			return 'Live Enq.';
		} else if (this.processtypeService.getProcesstype() === '2') {
			return 'Live Reg.';
		} else if (this.processtypeService.getProcesstype() === '3') {
			return 'Live Pr. Adm.';
		} else if (this.processtypeService.getProcesstype() === '4') {
			return 'Live Adm.';
		} else if (this.processtypeService.getProcesstype() === '5') {
			return 'Live Alumini';
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
				let url = '';
				if (Number(result.process_type) === 1) {
					url = 'enquiry';
				} else if (Number(result.process_type) === 2) {
					url = 'registration';
				} else if (Number(result.process_type) === 3) {
					url = 'provisional';
				} else if (Number(result.process_type) === 4) {
					url = 'admission';
				} else if (Number(result.process_type) === 5) {
					url = 'alumini';
				}
				this.commonAPIService.setStudentData(result.adm_no, result.process_type);
				if ((Number(result.process_type) === 1 && this.route.snapshot.routeConfig.path === 'enquiry')
					|| (Number(result.process_type) === 2 && this.route.snapshot.routeConfig.path === 'registration')
					|| (Number(result.process_type) === 3 && this.route.snapshot.routeConfig.path === 'provisional')
					|| (Number(result.process_type) === 4 && this.route.snapshot.routeConfig.path === 'admission')
					|| (Number(result.process_type) === 5 && this.route.snapshot.routeConfig.path === 'alumini')) {
					this.getStudentDetailsByAdmno(result.adm_no);
				} else {
					this.router.navigate(['../' + url], { relativeTo: this.route });
				}
			}
		});
	}
	getBloodGroup() {
		this.bloodGroupArray = [];
		this.sisService.getBloodGroup().subscribe((result: any) => {
			if (result) {
				this.bloodGroupArray = result.data;
			}
		});
	}
	printForm() {
		if (localStorage.getItem('tab_one_data')) {
			const firstTabDetails = JSON.parse(localStorage.getItem('tab_one_data'));
			this.studentDet.push({
				au_ses_id: this.session.ses_id,
				au_class_id: this.studentdetailsform.value.au_class_id,
				au_full_name: this.studentdetailsform.value.au_full_name,
				au_process_class: this.studentdetailsform.value.au_process_class,
				au_reference_no: this.studentdetailsform.value.au_reference_no
			});
			this.studentDet.push(firstTabDetails.personalDetails[0]);
			this.parentDet = firstTabDetails.parentDetails;
			this.registrationNo = this.studentdetailsform.value.au_enrollment_id;
			this.getCityNameByCityId(firstTabDetails.personalDetails[0].addressDetails[0].ea_city);
			this.pdfArray.push(1);

		}
	}
	checkProcessType() {
		if (Number(this.processtypeService.getProcesstype()) === 1) {
			return 'Enquiry';
		}
		if (Number(this.processtypeService.getProcesstype()) === 2) {
			return 'Registration';
		}
		if (Number(this.processtypeService.getProcesstype()) === 3) {
			return 'Provisional Admission';
		}
		if (Number(this.processtypeService.getProcesstype()) === 4) {
			return 'Admission';
		}
	}
	getRemarkData(login_id) {
		this.generalRemarkData = [];
		this.managementRemarkData = [];
		this.admissionRemarkData = [];
		if (login_id) {
			this.sisService.getStudentRemarkDataThemeTwo({ au_login_id: login_id }).subscribe((result: any) => {
				if (result.status === 'ok') {
					const remarkData = result.data;
					this.generalRemarkData = remarkData[0]['remarksGeneral'];
					this.managementRemarkData = remarkData[0]['remarksManagement'];
					this.admissionRemarkData = remarkData[0]['remarkAdmission'];
				}
			});
		}
	}
	getCityNameByCityId(city_id) {
		this.sisService.getCityNameByCityId({ city_id: city_id }).subscribe((result: any) => {
			if (result.status === 'ok') {
				if (result.data) {
					this.cityName = result.data[0].cit_name;
					this.getTabsData();
				}
			} else {
				this.cityName = '-';
				this.getTabsData();
			}
		});
	}
	getTabsData() {
		this.sisService.getAdditionalDetails({ au_login_id: this.studentdetailsform.value.au_login_id }).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.previousSchoolDet = result.data[0].educationDetails;
				this.skillDetails = result.data[0].awardsDetails;
				this.sisService.getFeeAccount({ accd_login_id: this.studentdetailsform.value.au_login_id }).subscribe((res: any) => {
					if (res && res.status === 'ok') {
						this.transportDet.push(res.data[0]);
						this.downPdf();
						
					} else {
						this.downPdf();
					}
				});
			} else {
				this.downPdf();
			}
		});
	}
	downPdf() {
		const studentJson: any = {};
			setTimeout(() => {
				const pdfHTML = document.getElementById('report_table').innerHTML;

				studentJson['html'] = pdfHTML;
				studentJson['id'] = this.studentdetailsform.value.au_enrollment_id;
				this.sisService.downPdf(studentJson).subscribe((res: any) => {
					if (res && res.status === 'ok') {
						this.pdfUrl = res.downloadData;
						const length = this.pdfUrl.split('/').length;
						saveAs(this.pdfUrl, this.pdfUrl.split('/')[length - 1]);
					}
				});

			}, 1000);
	}
}
