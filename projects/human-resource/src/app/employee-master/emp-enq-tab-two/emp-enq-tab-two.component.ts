import { Component, OnInit, ViewChild, OnChanges, Input } from '@angular/core';
import { SisService, CommonAPIService } from '../../_services/index';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { saveAs } from 'file-saver';
import { ConfirmValidParentMatcher } from '../../ConfirmValidParentMatcher';

@Component({
  selector: 'app-emp-enq-tab-two',
  templateUrl: './emp-enq-tab-two.component.html',
  styleUrls: ['./emp-enq-tab-two.component.scss']
})
export class EmpEnqTabTwoComponent implements OnInit {
  confirmValidParentMatcher = new ConfirmValidParentMatcher();
  @Input() employeeCommonDetails;
  @Input() employeedetails;
  addOnly = false;
  viewOnly = true;
  editOnly = false;
  educationDetails: any[] = [];
  educationDetailsNew: any[] = [];
  awardsDetails: any[] = [];
  awardsDetailsNew: any[] = [];
  documentDetails: any[] = [];
  login_id: any;
  saveFlag = false;
  editRequestFlag = false;
  contactsArray: any = {};
  personalContacts: FormGroup;
  disabledApiButton = false;

  editableStatus = '0';
  cityId: any;
  cityCountryArray: any[] = [];
  arrayState: any[] = [];
  @ViewChild('editReference') editReference;

  departmentArray;
  designationArray;
  wingArray;
  categoryOneArray: any[] = [];
  constructor(private sisService: SisService, private fbuild: FormBuilder,
    public commonAPIService: CommonAPIService) { }
  ngOnInit() {
    this.commonAPIService.reRenderForm.subscribe((data: any) => {
      if (data) {
        if (data.addMode) {
          this.setActionControls({ addMode: true });
        }
        if (data.editMode) {
          this.setActionControls({ editMode: true });
        }
        if (data.viewMode) {
          this.setActionControls({ viewMode: true });
        }
      }
    });
  }

  setActionControls(data) {
    if (data.addMode) {
      this.addOnly = true;
      this.editOnly = false;
      this.viewOnly = false;
      this.personalContacts.patchValue({
        enq_applied_for: '',
        enq_department: '',
        enq_subject: '',
        organisation: '',
        designation: '',
        from_date: '',
        to_date: '',
        salary_drawn: '',
        enq_expected_salary: '',
        enq_present_salary: '',
        qualification: '',
        university: '',
        year: '',
        division: '',
        percentage: '',
      });
    }
    if (data.editMode) {
      this.editOnly = true;
      this.addOnly = false;
      this.viewOnly = false;
      this.saveFlag = true;
    }
    if (data.viewMode) {
      this.viewOnly = true;
      this.addOnly = false;
      this.editOnly = false;
      this.saveFlag = false;
    }
  }
  buildForm() {
    this.personalContacts = this.fbuild.group({
      enq_applied_for: '',
      enq_department: '',
      enq_subject: '',
      organisation: '',
      designation: '',
      from_date: '',
      to_date: '',
      salary_drawn: '',
      enq_expected_salary: '',
      enq_present_salary: '',
      qualification: '',
      university: '',
      year: '',
      division: '',
      percentage: '',
    });
  }
  ngOnChanges() {
    this.buildForm();
    this.getCategoryOne();
    this.getState();
    this.getDepartment();
    this.getDesignation();
    this.getWing();
    if (this.employeedetails) {
      this.getPersonaContactsdata();
    }
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
    this.commonAPIService.getMaster({ type_id: '2' }).subscribe((result: any) => {
      if (result) {
        this.designationArray = result;
      } else {
        this.designationArray = [];
      }

    });
  }
  getWing() {
    this.commonAPIService.getMaster({ type_id: '1' }).subscribe((result: any) => {
      if (result) {
        this.wingArray = result;
      } else {
        this.wingArray = [];
      }

    });
  }
  getPersonaContactsdata() {
    console.log(this.employeedetails);
    if (this.employeedetails) {
      this.personalContacts.patchValue({
        enq_applied_for: this.employeedetails.enq_applied_job_detail && this.employeedetails.enq_applied_job_detail[0].enq_applied_for ?
          this.employeedetails.enq_applied_job_detail[0].enq_applied_for.post_id : '',
        enq_department: this.employeedetails.enq_applied_job_detail && this.employeedetails.enq_applied_job_detail[0].enq_department ?
          this.employeedetails.enq_applied_job_detail[0].enq_department.dept_id : '',
        enq_subject: this.employeedetails.enq_applied_job_detail && this.employeedetails.enq_applied_job_detail[0].enq_subject ?
          this.employeedetails.enq_applied_job_detail[0].enq_subject.subject_id : '',
        enq_expected_salary: this.employeedetails.enq_expected_salary ? this.employeedetails.enq_expected_salary : '',
        enq_present_salary: this.employeedetails.enq_present_salary ? this.employeedetails.enq_present_salary : '',
        organisation: this.employeedetails.enq_work_experience_detail && this.employeedetails.enq_work_experience_detail[0].organisation ?
          this.employeedetails.enq_work_experience_detail[0].organisation : '',
        designation: this.employeedetails.enq_work_experience_detail && this.employeedetails.enq_work_experience_detail[0].designation ?
          this.employeedetails.enq_work_experience_detail[0].designation : '',
        from_date: this.employeedetails.enq_work_experience_detail && this.employeedetails.enq_work_experience_detail[0].from_date ?
          this.employeedetails.enq_work_experience_detail[0].from_date : '',
        to_date: this.employeedetails.enq_work_experience_detail && this.employeedetails.enq_work_experience_detail[0].to_date ?
          this.employeedetails.enq_work_experience_detail[0].to_date : '',
        salary_drawn: this.employeedetails.enq_work_experience_detail && this.employeedetails.enq_work_experience_detail[0].salary_drawn ?
          this.employeedetails.enq_work_experience_detail[0].salary_drawn : '',
        qualification: this.employeedetails.enq_academic_detail ? this.employeedetails.enq_academic_detail[0].qualification : '',
        university: this.employeedetails.enq_academic_detail ? this.employeedetails.enq_academic_detail[0].university : '',
        year: this.employeedetails.enq_academic_detail ? this.employeedetails.enq_academic_detail[0].year : '',
        division: this.employeedetails.enq_academic_detail ? this.employeedetails.enq_academic_detail[0].division : '',
        percentage: this.employeedetails.enq_academic_detail ? this.employeedetails.enq_academic_detail[0].percentage : '',
      });
    }

  }
  saveForm() {
    if (this.personalContacts.valid) {
      this.disabledApiButton = true;


    } else {
      this.commonAPIService.showSuccessErrorMessage('Please fill all required field', 'error');
    }
  }
  isExistUserAccessMenu(actionT) {
    //return this.context.studentdetails.isExistUserAccessMenu(actionT);
  }
  editRequest() {
    this.viewOnly = false;
    this.editOnly = false;
    this.editRequestFlag = true;
    this.saveFlag = false;
  }
  cancelForm() {
    if (this.addOnly) {
      this.commonAPIService.reRenderForm.next({ reRenderForm: true, viewMode: true, editMode: false, deleteMode: false, addMode: false });
    } else if (this.saveFlag || this.editRequestFlag) {
      this.getPersonaContactsdata();
      this.commonAPIService.reRenderForm.next({ viewMode: true, editMode: false, deleteMode: false, addMode: false });
    }
  }
  updateForm(isview) {
    if (this.personalContacts.valid) {

    } else {
      this.commonAPIService.showSuccessErrorMessage('Please fill all required field', 'error');
    }
  }
  dateConversion(value, format) {
    const datePipe = new DatePipe('en-in');
    return datePipe.transform(value, format);
  }
  filterCityStateCountry($event) {
    // keyCode
    if (Number($event.keyCode) !== 40 && Number($event.keyCode) !== 38) {
      if ($event.target.value !== '' && $event.target.value.length >= 3) {
        this.cityCountryArray = [];
        this.sisService.getStateCountryByCity({ cit_name: $event.target.value }).subscribe((result: any) => {
          if (result.status === 'ok') {
            this.cityCountryArray = result.data;
          }
        });
      }
    }
  }
  getCityPerId(item: any) {
    this.cityId = item.cit_id;
    this.personalContacts.patchValue({
      city: this.getCityName(item.cit_id),
      state: item.sta_id,
    });
  }

  getCityName(id) {
    const findIndex = this.cityCountryArray.findIndex(f => f.cit_id === id);
    if (findIndex !== -1) {
      return this.cityCountryArray[findIndex].cit_name;
    }
  }
  getStateName(id) {
    const findIndex = this.arrayState.findIndex(f => f.sta_id === id);
    if (findIndex !== -1) {
      return this.arrayState[findIndex].sta_name;
    }
  }
  getState() {
    this.sisService.getState().subscribe(
      (result: any) => {
        if (result.status === 'ok') {
          this.arrayState = result.data;
        }
      }
    );
  }
  getDepartmentName(dpt_id) {
    const findIndex = this.departmentArray.findIndex(f => Number(f.dept_id) === Number(dpt_id));
    if (findIndex !== -1) {
      return this.departmentArray[findIndex].dept_name;
    }
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
  getWingName(wing_id) {
    const findIndex = this.wingArray.findIndex(f => Number(f.config_id) === Number(wing_id));
    if (findIndex !== -1) {
      return this.wingArray[findIndex].name;
    }
  }
  getDesignationName(des_id) {
    const findIndex = this.designationArray.findIndex(f => Number(f.config_id) === Number(des_id));
    if (findIndex !== -1) {
      return this.designationArray[findIndex].name;
    }
  }
}
