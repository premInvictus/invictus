import {
	Component,
	OnInit,
	OnChanges,
	Input,
	EventEmitter,
	Output
} from '@angular/core';
import {
	FormGroup,
	FormBuilder,
	FormControl,
	FormGroupDirective,
	NgForm
} from '@angular/forms';
import {
	SisService,
	CommonAPIService,
	ProcesstypeFeeService,
	FeeService
} from '../../_services';
import {
	Router,
	ActivatedRoute,
	NavigationEnd,
	RouterStateSnapshot
} from '@angular/router';
import { ErrorStateMatcher } from '@angular/material';
import { StudentRouteMoveStoreService } from '../student-route-move-store.service';

@Component({
	selector: 'app-common-student-profile',
	templateUrl: './common-student-profile.component.html',
	styleUrls: ['./common-student-profile.component.scss']
})
export class CommonStudentProfileComponent implements OnInit, OnChanges {
	@Input() loginId: any;
	@Output() next = new EventEmitter();
	@Output() prev = new EventEmitter();
	@Output() first = new EventEmitter();
	@Output() last = new EventEmitter();
	@Output() key = new EventEmitter();
	@Output() next2 = new EventEmitter();
	@Output() prev2 = new EventEmitter();
	@Output() first2 = new EventEmitter();
	@Output() last2 = new EventEmitter();
	@Output() key2 = new EventEmitter();
	@Output() processTypeEmit = new EventEmitter();
	studentdetailsform: FormGroup;
	accountsForm: FormGroup;
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
	divFlag = false;
	stopFlag = false;
	addOnly = true;
	iddesabled = true;
	backOnly = false;
	defaultsrc = '/assets/images/student.png';
	classArray = [];
	sectionArray = [];
	houseArray = [];
	feeOtherCategory: any[] = [];
	feeStructureArray: any[] = [];
	conGroupArray: any[] = [];
	multipleFileArray: any[] = [];
	savedSettingsArray: any[] = [];
	settingsArray: any[] = [];
	enrolmentPlaceholder = 'Enrollment Id';
	deleteMessage = 'Are you sure, you want to delete ?';
	studentdetailsflag = false;
	lastRecordId;
	nextFlag = false;
	prevFlag = false;
	firstFlag = false;
	lastFlag = false;
	keyFlag = false;
	studentLoginId: any;
	invoice_creation_individual_flag = true;
	student_profile_flag = true;
	fee_ledger_flag = true;
	fee_transaction_entry_individual_flag = true;
	processType: any = '';
	processTypeArray: any[] = [
		{ id: '1', name: 'Enquiry No.' },
		{ id: '2', name: 'Registration No.' },
		{ id: '3', name: 'Provisional Admission No.' },
		{ id: '4', name: 'Admission No.' },
		{ id: '5', name: 'Alumni No.' }
	];
	constructor(
		private fbuild: FormBuilder,
		private feeService: FeeService,
		private sisService: SisService,
		private router: Router,
		private route: ActivatedRoute,
		private commonAPIService: CommonAPIService,
		public processtypeService: ProcesstypeFeeService,
		public studentRouteMoveStoreService: StudentRouteMoveStoreService
	) { }

	ngOnInit() {
		this.buildForm();
		if (this.studentRouteMoveStoreService.getProcesRouteType()) {
			this.processType = this.studentRouteMoveStoreService.getProcesRouteType();
		} else {
			this.processType = '4';
		}
		this.processtypeService.setProcesstype(this.processType);
		this.processTypeEmit.emit(this.processType);
		const currentUrl = this.route.snapshot.routeConfig.path;
		if (currentUrl !== '') {
			if (currentUrl === 'invoice-creation-individual') {
				this.invoice_creation_individual_flag = false;
			} else if (currentUrl === 'student-profile') {
				this.student_profile_flag = false;
			} else if (currentUrl === 'fee-ledger') {
				this.fee_ledger_flag = false;
			} else if (currentUrl === 'fee-transaction-entry-individual') {
				this.fee_transaction_entry_individual_flag = false;
			}
		}
	}
	goToPage(url) {
		this.router.navigate([`../${url}`], { relativeTo: this.route });
	}
	ngOnChanges() {
		if (this.loginId) {
			this.studentdetailsflag = true;
			this.getStudentInformation(this.loginId);
		}
	}
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
	getStudentInformation(au_login_id) {
		this.studentLoginId = '';
		if (au_login_id && this.studentdetailsflag) {
			this.studentdetailsflag = false;
			this.sisService
				.getStudentInformation({ au_login_id: au_login_id, au_status: '1' })
				.subscribe((result: any) => {
					if (result && result.status === 'ok') {
						this.nextB = true;
						this.firstB = true;
						this.lastB = true;
						this.previousB = true;
						this.studentdetails = [];
						this.defaultsrc = '/assets/images/student.png';
						if (result && result.data && result.data[0]) {
							this.studentdetails = result.data[0];
							if (Number(this.processType) === 4) {
								this.studentRouteMoveStoreService.setRouteStore(
									this.studentdetails.em_admission_no,
									this.studentdetails.au_login_id
								);
								this.studentRouteMoveStoreService.setProcessRouteType(
									this.processType
								);
							} else if (Number(this.processType) === 3) {
								this.studentRouteMoveStoreService.setRouteStore(
									this.studentdetails.em_provisional_admission_no,
									this.studentdetails.au_login_id
								);
								this.studentRouteMoveStoreService.setProcessRouteType(
									this.processType
								);
							} else if (Number(this.processType) === 2) {
								this.studentRouteMoveStoreService.setRouteStore(
									this.studentdetails.em_regd_no,
									this.studentdetails.au_login_id
								);
								this.studentRouteMoveStoreService.setProcessRouteType(
									this.processType
								);
							} else if (Number(this.processType) === 1) {
								this.studentRouteMoveStoreService.setRouteStore(
									this.studentdetails.em_enq_no,
									this.studentdetails.au_login_id
								);
								this.studentRouteMoveStoreService.setProcessRouteType(
									this.processType
								);
							} else if (Number(this.processType) === 5) {
								this.studentRouteMoveStoreService.setRouteStore(
									this.studentdetails.em_alumini_no,
									this.studentdetails.au_login_id
								);
								this.studentRouteMoveStoreService.setProcessRouteType(
									this.processType
								);
							}
							this.studentLoginId = this.studentdetails.au_login_id;
							if (Number(this.processType) === 4) {
								if (this.nextFlag) {
									this.next.emit(this.studentLoginId);
									this.next2.emit(this.studentdetails.em_admission_no);
								}
								if (this.prevFlag) {
									this.prev.emit(this.studentLoginId);
									this.prev2.emit(this.studentdetails.em_admission_no);
								}
								if (this.firstFlag) {
									this.first.emit(this.studentLoginId);
									this.first2.emit(this.studentdetails.em_admission_no);
								}
								if (this.lastFlag) {
									this.last.emit(this.studentLoginId);
									this.last2.emit(this.studentdetails.em_admission_no);
								}
								if (this.keyFlag) {
									this.key.emit(this.studentLoginId);
									this.key2.emit(this.studentdetails.em_admission_no);
								}
							} else if (Number(this.processType) === 2) {
								if (this.nextFlag) {
									this.next.emit(this.studentLoginId);
									this.next2.emit(this.studentdetails.em_regd_no);
								}
								if (this.prevFlag) {
									this.prev.emit(this.studentLoginId);
									this.prev2.emit(this.studentdetails.em_regd_no);
								}
								if (this.firstFlag) {
									this.first.emit(this.studentLoginId);
									this.first2.emit(this.studentdetails.em_regd_no);
								}
								if (this.lastFlag) {
									this.last.emit(this.studentLoginId);
									this.last2.emit(this.studentdetails.em_regd_no);
								}
								if (this.keyFlag) {
									this.key.emit(this.studentLoginId);
									this.key2.emit(this.studentdetails.em_regd_no);
								}
							} else if (Number(this.processType) === 3) {
								if (this.nextFlag) {
									this.next.emit(this.studentLoginId);
									this.next2.emit(
										this.studentdetails.em_provisional_admission_no
									);
								}
								if (this.prevFlag) {
									this.prev.emit(this.studentLoginId);
									this.prev2.emit(
										this.studentdetails.em_provisional_admission_no
									);
								}
								if (this.firstFlag) {
									this.first.emit(this.studentLoginId);
									this.first2.emit(
										this.studentdetails.em_provisional_admission_no
									);
								}
								if (this.lastFlag) {
									this.last.emit(this.studentLoginId);
									this.last2.emit(
										this.studentdetails.em_provisional_admission_no
									);
								}
								if (this.keyFlag) {
									this.key.emit(this.studentLoginId);
									this.key2.emit(
										this.studentdetails.em_provisional_admission_no
									);
								}
							} else if (Number(this.processType) === 1) {
								if (this.nextFlag) {
									this.next.emit(this.studentLoginId);
									this.next2.emit(this.studentdetails.em_enq_no);
								}
								if (this.prevFlag) {
									this.prev.emit(this.studentLoginId);
									this.prev2.emit(this.studentdetails.em_enq_no);
								}
								if (this.firstFlag) {
									this.first.emit(this.studentLoginId);
									this.first2.emit(this.studentdetails.em_enq_no);
								}
								if (this.lastFlag) {
									this.last.emit(this.studentLoginId);
									this.last2.emit(this.studentdetails.em_enq_no);
								}
								if (this.keyFlag) {
									this.key.emit(this.studentLoginId);
									this.key2.emit(this.studentdetails.em_enq_no);
								}
							} else if (Number(this.processType) === 5) {
								if (this.nextFlag) {
									this.next.emit(this.studentLoginId);
									this.next2.emit(this.studentdetails.em_alumini_no);
								}
								if (this.prevFlag) {
									this.prev.emit(this.studentLoginId);
									this.prev2.emit(this.studentdetails.em_alumini_no);
								}
								if (this.firstFlag) {
									this.first.emit(this.studentLoginId);
									this.first2.emit(this.studentdetails.em_alumini_no);
								}
								if (this.lastFlag) {
									this.last.emit(this.studentLoginId);
									this.last2.emit(this.studentdetails.em_alumini_no);
								}
								if (this.keyFlag) {
									this.key.emit(this.studentLoginId);
									this.key2.emit(this.studentdetails.em_alumini_no);
								}
							}
						}
						if (result && result.data && result.data[0].navigation[0]) {
							this.navigation_record = result.data[0].navigation[0];
						}
						if (this.processtypeService.getProcesstype() === '4') {
							this.studentdetailsform.patchValue({
								au_enrollment_id: this.studentdetails.em_admission_no
							});
						} else if (this.processtypeService.getProcesstype() === '2') {
							this.studentdetailsform.patchValue({
								au_enrollment_id: this.studentdetails.em_regd_no
							});
						} else if (this.processtypeService.getProcesstype() === '1') {
							this.studentdetailsform.patchValue({
								au_enrollment_id: this.studentdetails.em_enq_no
							});
						} else if (this.processtypeService.getProcesstype() === '3') {
							this.studentdetailsform.patchValue({
								au_enrollment_id: this.studentdetails
									.em_provisional_admission_no
							});
						}
						this.studentdetailsform.patchValue({
							au_profileimage: this.studentdetails.au_profileimage
								? this.studentdetails.au_profileimage
								: this.defaultsrc,
							au_login_id: this.studentdetails.au_login_id
						});
						this.defaultsrc =
							this.studentdetails.au_profileimage !== ''
								? this.studentdetails.au_profileimage
								: this.defaultsrc;
						if (this.navigation_record) {
							this.viewOnly = true;
							if (
								this.navigation_record.first_record &&
								this.navigation_record.first_record !==
								this.studentdetailsform.value.au_enrollment_id &&
								this.viewOnly
							) {
								this.firstB = false;
							}
							if (
								this.navigation_record.last_record &&
								this.navigation_record.last_record !==
								this.studentdetailsform.value.au_enrollment_id &&
								this.viewOnly
							) {
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
	loadOnEnrollmentId($event) {
		this.keyFlag = false;
		this.keyFlag = true;
		$event.preventDefault();
		this.getStudentDetailsByAdmno($event.target.value);
	}
	getStudentDetailsByAdmno(admno) {
		this.studentdetailsflag = true;
		this.getStudentInformation(admno);
	}
	nextId(admno) {
		this.nextFlag = false;
		this.prevFlag = false;
		this.firstFlag = false;
		this.lastFlag = false;
		this.nextFlag = true;
		this.getStudentDetailsByAdmno(admno);
		// this.studentRouteMoveStoreService.setRouteStore(admno, null);
	}
	prevId(admno) {
		this.nextFlag = false;
		this.prevFlag = false;
		this.firstFlag = false;
		this.lastFlag = false;
		this.prevFlag = true;
		this.getStudentDetailsByAdmno(admno);
		// this.studentRouteMoveStoreService.setRouteStore(admno, null);
	}
	firstId(admno) {
		this.nextFlag = false;
		this.prevFlag = false;
		this.firstFlag = false;
		this.lastFlag = false;
		this.firstFlag = true;
		this.getStudentDetailsByAdmno(admno);
		// this.studentRouteMoveStoreService.setRouteStore(admno, null);
	}
	lastId(admno) {
		this.nextFlag = false;
		this.prevFlag = false;
		this.firstFlag = false;
		this.lastFlag = false;
		this.lastFlag = true;
		this.getStudentDetailsByAdmno(admno);
		// this.studentRouteMoveStoreService.setRouteStore(admno, null);
	}
	changeProcessType($event) {
		this.processType = $event.value;
		this.processtypeService.setProcesstype(this.processType);
		this.processTypeEmit.emit(this.processType);
	}
}
