import {
	Component,
	OnInit,
	OnChanges,
	Input,
	EventEmitter,
	Output,
	ViewChild,
	ElementRef
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
import { ErrorStateMatcher, MatDialog } from '@angular/material';
import { StudentRouteMoveStoreService } from '../student-route-move-store.service';
import { SearchViaStudentComponent } from '../../sharedmodule/search-via-student/search-via-student.component';
import { element } from '@angular/core/src/render3/instructions';

@Component({
	selector: 'app-common-student-profile',
	templateUrl: './common-student-profile.component.html',
	styleUrls: ['./common-student-profile.component.scss']
})
export class CommonStudentProfileComponent implements OnInit, OnChanges {
	@Input() loginId: any;
	@Input() feeRenderId: any;
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
	@ViewChild('enrollmentFocus') enrollmentFocus: ElementRef;
	@ViewChild('myInput') myInput: ElementRef;
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
	defaultsrc = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/other.png';
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
	processType: any = '';
	previousProcessType: any = '';
	previousAdmno: any = '';
	previousLoginId = '';
	class_name: any;
	section_name: any;
	class_sec: any;
	gender: any;
	processTypeArray: any[] = [
		{ id: '1', name: 'Enquiry No.' },
		{ id: '2', name: 'Registration No.' },
		{ id: '3', name: 'Provisional Admission No.' },
		{ id: '4', name: 'Admission No.' }
	];
	constructor(
		private fbuild: FormBuilder,
		private feeService: FeeService,
		private sisService: SisService,
		private router: Router,
		private route: ActivatedRoute,
		private commonAPIService: CommonAPIService,
		public processtypeService: ProcesstypeFeeService,
		public studentRouteMoveStoreService: StudentRouteMoveStoreService,
		public dialog: MatDialog
	) { }

	ngOnInit() {
		this.buildForm();
		if (this.studentRouteMoveStoreService.getProcesRouteType()) {
			this.processType = this.studentRouteMoveStoreService.getProcesRouteType();
		} else {
			this.processType = '4';
		}
		this.processtypeService.setProcesstype(this.processType);
		const currentUrl = this.route.snapshot.routeConfig.path;
		if (currentUrl !== '') {
			if (currentUrl === 'invoice-creation-individual') {
			} else if (currentUrl === 'student-profile') {
			} else if (currentUrl === 'fee-ledger') {
			} else if (currentUrl === 'fee-transaction-entry-individual') {
			}
		}
		// document.getElementById('blur_id').focus();
		const fe = <HTMLInputElement>this.enrollmentFocus.nativeElement;
		fe.focus();
		fe.select();
	}
	goToPage(url) {
		this.router.navigate([`../${url}`], { relativeTo: this.route });
	}
	ngOnChanges() {
		
		if (this.loginId) {
			this.studentdetailsflag = true;
			this.getStudentInformation(this.loginId);
		} else {
			this.studentdetailsform.reset();
			this.studentdetails = [];
		}
		if (this.feeRenderId) {
			this.studentdetailsflag = true;
			this.getStudentInformation(this.feeRenderId);
		}
		// document.getElementById('blur_id').focus();
		const fe = <HTMLInputElement>this.enrollmentFocus.nativeElement;
		fe.focus();
		fe.select();
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
						this.studentRouteMoveStoreService.setProcessTypePrev(this.processType);
						this.nextB = true;
						this.firstB = true;
						this.lastB = true;
						this.previousB = true;
						this.studentdetails = [];
						if (result && result.data && result.data[0]) {
							this.studentdetails = result.data[0];
							this.previousLoginId = this.studentdetails.au_login_id;
							this.gender = this.studentdetails.au_gender;
							if (this.gender === 'M') {
								this.defaultsrc = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/man.png';
							} else if (this.gender === 'F') {
								this.defaultsrc = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/girl.png';
							} else {
								this.defaultsrc = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/other.png';
							}
							this.class_name = this.studentdetails.class_name;
							this.section_name = this.studentdetails.sec_name;
							if (this.section_name !== ' ') {
								this.class_sec = this.class_name + ' - ' + this.section_name;
							} else {
								this.class_sec = this.class_name;
							}
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
								this.previousAdmno = this.studentdetails.em_admission_no;
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
								this.previousAdmno = this.studentdetails.em_regd_no;
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
								this.previousAdmno = this.studentdetails.em_provisional_admission_no;
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
								this.previousAdmno = this.studentdetails.em_enq_no;
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
								this.previousAdmno = this.studentdetails.em_alumini_no;
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
						this.loginId = '';
						this.feeRenderId = '';

						//myInput.select()
						const inputElem = <HTMLInputElement>this.myInput.nativeElement;
						inputElem.select();
					} else {
						// this.commonAPIService.showSuccessErrorMessage(result.data, 'error');
						this.processtypeService.setProcesstype(this.studentRouteMoveStoreService.getProcessTypePrev());
						this.processType = this.studentRouteMoveStoreService.getProcessTypePrev();
						this.nextId(this.previousAdmno);
						this.next.emit(this.previousLoginId);
					}
				});
		}
	}
	loadOnEnrollmentId($event) {
		this.keyFlag = false;
		this.keyFlag = true;
		$event.preventDefault();
		this.getStudentDetailsByAdmno($event.target.value);
		document.getElementById('blur_id').blur();
	}
	getStudentDetailsByAdmno(admno) {
		this.studentdetailsflag = true;
		this.getStudentInformation(admno);
	}
	nextId(admno) {
		console.log(admno);
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
	parent_type_fun(type: any) {
		if (type.parentinfo && type.parentinfo.length > 0 && type.parentinfo[0].epd_parent_type === 'F') {
			return 'Father\'s Name';
		} else if (type.parentinfo && type.parentinfo.length > 0 && type.parentinfo[0].epd_parent_type === 'M') {
			return 'Mother\'s Name';
		} else if (type.parentinfo && type.parentinfo.length > 0 && type.parentinfo[0].epd_parent_type === 'G') {
			return 'Guardian\'s Name';
		} else {
			return 'Active Parent Name';
		}
	}
	openSearchDialog() {
		const diaogRef = this.dialog.open(SearchViaStudentComponent, {
			width: '20%',
			height: '30%',
			position: {
				top: '10%'
			},
			data: {}
		});
		diaogRef.afterClosed().subscribe((result: any) => {
			if (result) {
				this.processType = result.process_type;
				this.processtypeService.setProcesstype(result.process_type);
				this.nextId(result.adm_no);
			}
		});
	}
}
