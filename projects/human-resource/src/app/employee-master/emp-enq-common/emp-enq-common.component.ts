import { Component, EventEmitter, OnInit, Output, Input, ViewChild, OnChanges, OnDestroy, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SisService, CommonAPIService } from '../../_services/index';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material';
import { SearchViaNameComponent } from '../../hr-shared/search-via-name/search-via-name.component';
@Component({
  selector: 'app-emp-enq-common',
  templateUrl: './emp-enq-common.component.html',
  styleUrls: ['./emp-enq-common.component.scss']
})
export class EmpEnqCommonComponent implements OnInit {
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
  defaultsrc = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/other.png';
  classArray = [];
  sectionArray = [];
  departmentArray = [];
  wingArray = [];
  designationArray: any[] = [];
  multipleFileArray: any[] = [];
  savedSettingsArray: any[] = [];
  settingsArray: any[] = [];
  enrolmentPlaceholder = 'Enquiry Id';
  deleteMessage = 'Are you sure, you want to delete ?';
  studentdetailsflag = false;
  lastRecordId;
  categoryOneArray: any[] = [];
  @ViewChild('deleteModal') deleteModal;
  @ViewChild('myInput') myInput: ElementRef;
  openDeleteDialog = (data) => {
    this.deleteModal.openModal({ text: '' });
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
      if (data && data.last_record) {
        this.login_id = data.last_record;
        this.lastRecordId = data.last_record;
        this.lastEmployeeDetails = {};
        if (this.lastrecordFlag) {
          this.lastEmployeeDetails.enq_id = this.lastRecordId;
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
          this.employeedetails.enq_status = 'enquiry';
          this.getEmployeeDetail(this.lastRecordId);
        }
      }
      this.setActionControls(data);
    });

    this.getEmployeeDetail(result.enq_id);

  }

  ngOnChanges() {
    this.buildForm();
    this.employeedetails.enq_status == 'enquiry';
    if (this.employeedetails) {
      this.getEmployeeDetail(this.employeedetails.enq_id);
    }
  }

  getEmployeeDetail(enq_id) {
    if (enq_id) {
      this.previousB = true;
      this.nextB = true;
      this.firstB = true;
      this.lastB = true;
      //this.setActionControls({viewMode : true})
      this.commonAPIService.getCareerEnq({ enq_id: enq_id }).subscribe((result: any) => {
        if (result) {
          this.employeeDetailsForm.patchValue({
            enq_profile_pic: result.enq_personal_detail.enq_profile_pic,
            enq_id: result.enq_id,
            enq_name: result.enq_personal_detail.enq_full_name,
            enq_status: result.enq_status
          });
          if (result.enq_profile_pic) {
            this.defaultsrc = result.enq_profile_pic
          } else {
            this.defaultsrc = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/other.png';
          }
          this.navigation_record = result.navigation;
          //this.employeedetails['last_record'] = enq_id;
        }

        if (this.navigation_record) {
          if (this.navigation_record.first_record &&
            this.navigation_record.first_record !== this.employeeDetailsForm.value.enq_id &&
            this.viewOnly) {
            this.firstB = false;
          }
          if (this.navigation_record.last_record &&
            this.navigation_record.last_record !== this.employeeDetailsForm.value.enq_id &&
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
      this.employeedetails.enq_status = 'enquiry';
      this.employeeDetailsForm.reset();
      this.defaultsrc = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/other.png';
      this.enrolmentPlaceholder = 'New Enq. Id';

    }
    if (data.editMode) {
      this.editOnly = false;
      this.addOnly = false;
      this.viewOnly = false;
      this.deleteOnly = false;
      this.stopFlag = true;
      this.divFlag = true;
      this.enrolmentPlaceholder = 'Enq. Id';
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
      if (this.lastEmployeeDetails['enq_id'] === this.employeeDetailsForm.value.enq_id) {
        this.firstB = false;
        this.previousB = false;
        this.lastB = true;
        this.nextB = true;
      } else {
        this.navigationEmployeeDetails(false);
      }
      this.enrolmentPlaceholder = 'Enq. Id';
    }
  }

  openCropDialog = (imageFile) => this.cropModal.openModal(imageFile);
  openEditDialog = (data) => this.editReference.openModal(data);

  buildForm() {
    this.employeeDetailsForm = this.fbuild.group({
      enq_profile_pic: '',
      enq_id: '',
      enq_name: '',
      enq_status: 'enquiry'
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
            enq_profile_pic: result.data[0].file_url
          });
          if (result.data[0].file_url && this.employeeDetailsForm.value.enq_id) {
            this.commonAPIService.updateEmployee({
              enq_id: this.employeeDetailsForm.value.enq_id,
              enq_profile_pic: result.data[0].file_url
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

  deleteUser() {
    this.commonAPIService.deleteEmployee({ enq_id: this.employeeDetailsForm.value.enq_id, enq_status: 'left' }).subscribe((result: any) => {
      if (result) {
        this.commonAPIService.showSuccessErrorMessage('Employee Detail Deleted Successfully', 'success');
        this.commonAPIService.reRenderForm.next({ reRenderForm: true, addMode: false, editMode: false, deleteMode: false });
      } else {
        this.commonAPIService.showSuccessErrorMessage('Error While Deleting Employee Detail', 'error');
      }
    });
  }
  deleteCancel() { }
  openConfig() {

  }
  isExistUserAccessMenu(actionT) {
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
        this.lastRecordId = result.enq_id;
        this.commonAPIService.employeeData.next(
          {
            last_record: result.enq_id
          });
      }
    });
  }
}
