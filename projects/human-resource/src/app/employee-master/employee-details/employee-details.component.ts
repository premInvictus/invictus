import { Component,	OnInit,	OnChanges,	Input,	EventEmitter,	Output,	ViewChild,	ElementRef} from '@angular/core';
import { ErrorStateMatcher, MatDialog } from '@angular/material';
import {FormGroup,FormBuilder,FormControl,FormGroupDirective,NgForm} from '@angular/forms';
@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.scss']
})
export class EmployeeDetailsComponent implements OnInit { 
  studentdetailsform: FormGroup;
  
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
	defaultsrc = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/other.svg';
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
	ropcessTypeArray: any[] = [
		{ id: '1', name: 'Enquiry No.' },
		{ id: '2', name: 'Registration No.' },
		{ id: '3', name: 'Provisional Admission No.' },
		{ id: '4', name: 'Admission No.' }
	];
  constructor(
    private fbuild: FormBuilder,
    public dialog: MatDialog
  ) { 
    
  }

  ngOnInit() {
    this.buildForm();
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

}
