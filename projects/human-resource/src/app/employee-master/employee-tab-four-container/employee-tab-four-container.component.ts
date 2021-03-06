import { Component, OnInit, ViewChild, OnChanges, Input } from '@angular/core';
import { AxiomService, SisService, CommonAPIService } from '../../_services/index';
import { FormGroup, FormBuilder, FormControl, FormGroupDirective, NgForm, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DatePipe } from '@angular/common';

import { ConfirmValidParentMatcher } from '../../ConfirmValidParentMatcher';

@Component({
  selector: 'app-employee-tab-four-container',
  templateUrl: './employee-tab-four-container.component.html',
  styleUrls: ['./employee-tab-four-container.component.scss']
})
export class EmployeeTabFourContainerComponent implements OnInit, OnChanges {
  @Input() employeedetails;
  @Input() employeeCommonDetails;
  confirmValidParentMatcher = new ConfirmValidParentMatcher();
  toMin = new Date();
  today = new Date();
  Education_Form: FormGroup;
  Experience_Form: FormGroup;
  educationsArray: any[] = [];
  experiencesArray: any[] = [];
  qualficationArray: any[] = [];
  boardArray: any[] = [];
  skillsArray: any[] = [];
  remarksArray: any = {};
  panelOpenState = true;
  educationUpdateFlag = false;
  experienceUpdateFlag = false;
  experienceaddFlag = true;
  addOnly = false;
  editOnly = false;
  viewOnly = true;
  saveFlag = false;
  editRequestFlag = false;
  educationValue: any;
  experienceValue: any;
  skills: any;
  skillForm: FormGroup;
  roleForm: FormGroup;
  remarksForm: FormGroup;
  taboneform: any = {};
  login_id = '';
  otherFlag = false;
  divisonArray: any[] = [
    { id: 1, name: 'First Divison' },
    { id: 2, name: 'Second Divison' },
    { id: 3, name: 'Third Divison' }
  ];
  honrificArr = [
    { hon_id: "1", hon_name: 'Mr.' },
    { hon_id: "2", hon_name: 'Mrs.' },
    { hon_id: "3", hon_name: 'Miss.' },
    { hon_id: "4", hon_name: 'Ms.' },
    { hon_id: "5", hon_name: 'Mx.' },
    { hon_id: "6", hon_name: 'Sir.' },
    { hon_id: "7", hon_name: 'Dr.' },
    { hon_id: "8", hon_name: 'Lady.' },
    { hon_id: "9", hon_name: 'Late' },
    { hon_id: "10", hon_name: 'Md.' }

  ];
  departmentArray;
  designationArray;
  wingArray;
  categoryOneArray: any[] = [];
  disabledApiButton = false;
  qualificationOrder: any;
  @ViewChild('editReference') editReference;
  constructor(public commonAPIService: CommonAPIService, private fbuild: FormBuilder, private axiomService: AxiomService,
    private sisService: SisService) {

  }
  setActionControls(data) {
    if (data.addMode) {
      this.addOnly = true;
      this.viewOnly = false;
      this.editOnly = false;

    }
    if (data.editMode) {
      this.editOnly = true;
      this.addOnly = false;
      this.viewOnly = false;
      this.saveFlag = true;
    }
    if (data.viewMode) {
      this.viewOnly = true;
      this.saveFlag = false;
      this.addOnly = false;
      this.editOnly = false;
    }
  }

  ngOnInit() {
    // this.buildForm();
    // this.getQualifications();
    // this.getBoard();
    // this.getRemarksDetails();
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
  ngOnChanges() {
    this.buildForm();
    this.getCategoryOne();
    this.getDepartment();
    this.getDesignation();
    this.getWing();
    this.getQualifications();
    this.getBoard();
    this.getRemarksDetails();
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
  getRemarksDetails() {
    if (this.employeedetails && this.employeedetails.emp_remark_detail) {
      this.remarksForm.patchValue({
        management_remarks: this.employeedetails.emp_remark_detail.management_remark,
        interview_remarks: this.employeedetails.emp_remark_detail.interview_remark,
      });
      this.roleForm.patchValue({
        role_and_responsibilities: this.employeedetails.emp_remark_detail.role_and_responsibilities
      })
      this.experiencesArray = this.employeedetails.emp_remark_detail.experience_detail ? this.employeedetails.emp_remark_detail.experience_detail : [];
      this.educationsArray = this.employeedetails.emp_remark_detail.education_detail ? this.employeedetails.emp_remark_detail.education_detail : [];
    } else {
      this.experiencesArray = [];
      this.educationsArray = [];
    }
    if (this.employeedetails && this.employeedetails.emp_remark_detail && this.employeedetails.emp_remark_detail.skills
      && this.employeedetails.emp_remark_detail.skills.length > 0) {
      this.skillsArray = this.employeedetails.emp_remark_detail.skills;
    } else {
      this.skillsArray = [];
    }

  }
  dateConversion(value, format) {
    const datePipe = new DatePipe('en-in');
    return datePipe.transform(value, format);
  }
  years() {
    var currentYear = new Date().getFullYear(),
      years = [];
    var startYear = 1980;
    while (startYear <= currentYear) {
      years.push(startYear++);
    }
  }

  buildForm() {
    this.Education_Form = this.fbuild.group({
      qualification: '',
      board: '',
      other_board: '',
      year: '',
      division: '',
      percentage: '',
      subject: '',
      order: ''
    });
    this.Experience_Form = this.fbuild.group({
      organisation: '',
      designation: '',
      last_salary: '',
      start_date: '',
      end_date: '',
    });
    this.skillForm = this.fbuild.group({
      skill_id: ''
    });
    this.remarksForm = this.fbuild.group({
      management_remarks: '',
      interview_remarks: ''
    });
    this.roleForm = this.fbuild.group({
      role_and_responsibilities: ''
    })

  }
  addPreviousEducations() {
    if (this.Education_Form.value.qualification && this.Education_Form.value.board && this.Education_Form.value.year
      && this.Education_Form.value.percentage && this.Education_Form.value.subject) {
      this.Education_Form.patchValue({ order: this.qualificationOrder }) // Passing the order key to the form
      this.educationsArray.push(this.Education_Form.value);
      this.otherFlag = false;
      this.Education_Form.patchValue({
        qualification: '',
        board: '',
        other_board: '',
        year: '',
        division: '',
        percentage: '',
        subject: '',
        order: ''
      });
    } else {
      Object.keys(this.Education_Form.value).forEach(key => {
        const formControl = <FormControl>this.Education_Form.controls[key];
        if (formControl.invalid) {
          formControl.markAsDirty();
        }
      });
    }
    console.log('this.educationsArray', this.educationsArray);
  }
  addexperience() {
    if (this.Experience_Form.valid) {
      this.experiencesArray.push(this.Experience_Form.value);
      this.Experience_Form.patchValue({
        organisation: '',
        designation: '',
        last_salary: '',
        start_date: '',
        end_date: '',
      });
    } else {
      Object.keys(this.Experience_Form.value).forEach(key => {
        const formControl = <FormControl>this.Experience_Form.controls[key];
        if (formControl.invalid) {
          formControl.markAsDirty();
        }
      });
    }
  }
  getQualifications() {
    this.sisService.getQualifications().subscribe((result: any) => {
      if (result.status === 'ok') {
        this.qualficationArray = result.data;
      }
    });
  }
  getBoard() {
    this.commonAPIService.getMaster({ type_id: '12' }).subscribe((result: any) => {
      if (result) {
        this.boardArray = result;
      } else {
        this.boardArray = [];
      }

    });
    // this.axiomService.getBoard().subscribe((result: any) => {
    // 	if (result.status === 'ok') {
    // 		this.boardArray = result.data;
    // 	}
    // });
  }
  getQualificationsName(value) {
    const findex = this.qualficationArray.findIndex(f => Number(f.qlf_id) === Number(value));
    if (findex !== -1) {
      return this.qualficationArray[findex].qlf_name;
    }
  }
  getBoardName(value) {
    const findex = this.boardArray.findIndex(f => Number(f.config_id) === Number(value));
    if (findex !== -1) {
      return this.boardArray[findex].name;
    }
  }
  getdivisonName(value) {
    // console.log('this.divisonArray', this.divisonArray);
    const findex = this.divisonArray.findIndex(f => Number(f.id) === Number(value));
    if (findex !== -1) {
      return this.divisonArray[findex].name;
    } else {
      return '';
    }
  }
  editEducation(value) {
    console.log(this.educationsArray[value].other_board);
    if (this.educationsArray[value].other_board) {
      this.otherFlag = true;
      this.Education_Form.patchValue({
        other_board: this.educationsArray[value].other_board
      });
    }
    this.educationUpdateFlag = true;
    this.educationValue = value;
    this.Education_Form.patchValue({
      qualification: this.educationsArray[value].qualification,
      board: this.educationsArray[value].board,
      eed_specify_reason: this.educationsArray[value].eed_specify_reason,
      year: this.educationsArray[value].year,
      division: this.educationsArray[value].division,
      percentage: this.educationsArray[value].percentage,
      subject: this.educationsArray[value].subject,
      order: this.educationsArray[value].order
    });
  }
  updateEducation() {
    if (this.Education_Form.valid) {
      this.educationsArray[this.educationValue] = this.Education_Form.value;
      this.otherFlag = false;
      this.commonAPIService.showSuccessErrorMessage('Education List Updated', 'success');
      this.Education_Form.reset();
      this.educationUpdateFlag = false;
    } else {
      this.commonAPIService.showSuccessErrorMessage('Please fill all required fields', 'error');
    }

  }
  editExperience(value) {
    this.experienceUpdateFlag = true;
    this.experienceValue = value;
    this.Experience_Form.patchValue({
      organisation: this.experiencesArray[value].organisation,
      designation: this.experiencesArray[value].designation,
      last_salary: this.experiencesArray[value].last_salary,
      start_date: this.dateConversion(this.experiencesArray[value].start_date, 'yyyy-MM-dd'),
      end_date: this.dateConversion(this.experiencesArray[value].end_date, 'yyyy-MM-dd'),
    });
  }
  updateExperience() {
    this.Experience_Form.patchValue({
      'start_date': this.dateConversion(this.Experience_Form.value.start_date, 'd-MMM-y')
    });
    this.Experience_Form.patchValue({
      'end_date': this.dateConversion(this.Experience_Form.value.end_date, 'd-MMM-y')
    });
    if (this.Experience_Form.valid) {
      this.experiencesArray[this.experienceValue] = this.Experience_Form.value;
      this.commonAPIService.showSuccessErrorMessage('Experience List Updated', 'success');
      this.Experience_Form.reset();
      this.experienceUpdateFlag = false;
    } else {
      this.commonAPIService.showSuccessErrorMessage('Please fill all required fields', 'error');
    }

  }
  deleteEducation(index) {
    this.educationsArray.splice(index, 1);
    this.Education_Form.reset();
  }
  deleteExperience(index) {
    this.experiencesArray.splice(index, 1);
    this.Experience_Form.reset();
  }
  isExistUserAccessMenu(isexist) {

  }
  insertSkill($event) {
    this.skills = $event.srcElement.value;
    if ($event.code !== 'NumpadEnter' || $event.code !== 'Enter') {
      const index = this.skillsArray.indexOf($event.srcElement.value);
      if (index === -1) {
        this.skillsArray.push(this.skillForm.value.skill_id);
        this.skillForm.patchValue({
          skill_id: ''
        });
      } else {
        this.skillForm.patchValue({
          skill_id: ''
        });
      }
    } else {
      const index = this.skillsArray.indexOf($event.srcElement.value); String
      if (index === -1) {
        this.skillForm.patchValue({
          skill_id: ''
        });
      } else {
        this.skillsArray.splice(index, 1);
      }
    }
  }
  deleteSkill(skill_id) {
    const index = this.skillsArray.indexOf(skill_id);
    if (index !== -1) {
      this.skillsArray.splice(index, 1);
    }
  }
  saveForm() {
    this.disabledApiButton = true;
    this.employeedetails['emp_remark_detail'] = {
      education_detail: this.educationsArray,
      experience_detail: this.experiencesArray,
      management_remark: this.remarksForm.value.management_remarks,
      interview_remark: this.remarksForm.value.interview_remarks,
      skills: this.skillsArray,
      role_and_responsibilities: this.roleForm.value.role_and_responsibilities
    };
    if (this.employeedetails) {
      this.employeedetails.emp_id = this.employeeCommonDetails.employeeDetailsForm.value.emp_id;
      this.employeedetails.emp_name = this.employeeCommonDetails.employeeDetailsForm.value.emp_name;
      this.employeedetails.emp_reference = this.employeeCommonDetails.employeeDetailsForm.value.emp_reference;
      this.employeedetails.emp_profile_pic = this.employeeCommonDetails.employeeDetailsForm.value.emp_profile_pic;
      this.employeedetails.emp_department_detail = {
        dpt_id: this.employeeCommonDetails.employeeDetailsForm.value.emp_department_id,
        dpt_name: this.getDepartmentName(this.employeeCommonDetails.employeeDetailsForm.value.emp_department_id)
      };
      this.employeedetails.emp_designation_detail = {
        des_id: this.employeeCommonDetails.employeeDetailsForm.value.emp_designation_id,
        des_name: this.getDesignationName(this.employeeCommonDetails.employeeDetailsForm.value.emp_designation_id)
      };
      this.employeedetails.emp_honorific_detail = {
        hon_id: this.employeeCommonDetails.employeeDetailsForm.value.emp_honorific_id,
        hon_name: this.getHonorificName(this.employeeCommonDetails.employeeDetailsForm.value.emp_honorific_id)
      };
      this.employeedetails.emp_wing_detail = {
        wing_id: this.employeeCommonDetails.employeeDetailsForm.value.emp_wing_id,
        wing_name: this.getWingName(this.employeeCommonDetails.employeeDetailsForm.value.emp_wing_id)
      };
      this.employeedetails.emp_category_detail = {
        cat_id: this.employeeCommonDetails.employeeDetailsForm.value.emp_category_id,
        cat_name: this.getCategoryOneName(this.employeeCommonDetails.employeeDetailsForm.value.emp_category_id)
      };
    }
    this.commonAPIService.updateEmployee(this.employeedetails).subscribe((result: any) => {
      if (result) {
        this.disabledApiButton = false;
        this.commonAPIService.showSuccessErrorMessage('Employee Remark Detail Inserted Successfully', 'success');
        this.commonAPIService.renderTab.next({ tabMove: true });
      } else {
        this.disabledApiButton = false;
        this.commonAPIService.showSuccessErrorMessage('Error while inserting Employee Remark Detail', 'error');
      }
    });
  }

  updateForm(moveNext) {
    this.disabledApiButton = true;
    if (this.employeedetails) {
      this.employeedetails.emp_id = this.employeeCommonDetails.employeeDetailsForm.value.emp_id;
      this.employeedetails.emp_name = this.employeeCommonDetails.employeeDetailsForm.value.emp_name;
      this.employeedetails.emp_reference = this.employeeCommonDetails.employeeDetailsForm.value.emp_reference;
      this.employeedetails.emp_profile_pic = this.employeeCommonDetails.employeeDetailsForm.value.emp_profile_pic;
      this.employeedetails.emp_department_detail = {
        dpt_id: this.employeeCommonDetails.employeeDetailsForm.value.emp_department_id,
        dpt_name: this.getDepartmentName(this.employeeCommonDetails.employeeDetailsForm.value.emp_department_id)
      };
      this.employeedetails.emp_designation_detail = {
        des_id: this.employeeCommonDetails.employeeDetailsForm.value.emp_designation_id,
        des_name: this.getDesignationName(this.employeeCommonDetails.employeeDetailsForm.value.emp_designation_id)
      };
      this.employeedetails.emp_honorific_detail = {
        hon_id: this.employeeCommonDetails.employeeDetailsForm.value.emp_honorific_id,
        hon_name: this.getHonorificName(this.employeeCommonDetails.employeeDetailsForm.value.emp_honorific_id)
      };
      this.employeedetails.emp_wing_detail = {
        wing_id: this.employeeCommonDetails.employeeDetailsForm.value.emp_wing_id,
        wing_name: this.getWingName(this.employeeCommonDetails.employeeDetailsForm.value.emp_wing_id)
      };
      this.employeedetails.emp_category_detail = {
        cat_id: this.employeeCommonDetails.employeeDetailsForm.value.emp_category_id,
        cat_name: this.getCategoryOneName(this.employeeCommonDetails.employeeDetailsForm.value.emp_category_id)
      };
    }
    this.employeedetails['emp_remark_detail'] = {
      education_detail: this.educationsArray,
      experience_detail: this.experiencesArray,
      management_remark: this.remarksForm.value.management_remarks,
      interview_remark: this.remarksForm.value.interview_remarks,
      skills: this.skillsArray,
      role_and_responsibilities: this.roleForm.value.role_and_responsibilities
    };
    if (!moveNext) {
      this.commonAPIService.updateEmployee(this.employeedetails).subscribe((result: any) => {
        if (result) {
          this.disabledApiButton = false;
          this.commonAPIService.showSuccessErrorMessage('Employee Remark Detail Updated Successfully', 'success');
          this.commonAPIService.renderTab.next({ tabMove: true });
        } else {
          this.disabledApiButton = false;
          this.commonAPIService.showSuccessErrorMessage('Error while updating Employee Remark Detail', 'error');
        }
      });
    } else {
      this.commonAPIService.updateEmployee(this.employeedetails).subscribe((result: any) => {
        if (result) {
          this.disabledApiButton = false;
          this.commonAPIService.showSuccessErrorMessage('Employee Remark Detail Updated Successfully', 'success');
          this.getQualifications();
          this.getBoard();
          this.getRemarksDetails();
          this.commonAPIService.reRenderForm.next({ viewMode: true, editMode: false, deleteMode: false, addMode: false });
        } else {
          this.disabledApiButton = false;
          this.commonAPIService.showSuccessErrorMessage('Error while updating Employee Remark Detail', 'error');
        }
      });
    }
  }

  cancelForm() {
    if (this.addOnly) {
      this.commonAPIService.reRenderForm.next({ reRenderForm: true, viewMode: true, editMode: false, deleteMode: false, addMode: false });
    } else if (this.saveFlag || this.editRequestFlag) {
      //this.context.studentdetails.getStudentInformation(this.context.studentdetails.studentdetailsform.value.au_enrollment_id);
      this.getQualifications();
      this.getBoard();
      this.getRemarksDetails();
      this.commonAPIService.reRenderForm.next({ viewMode: true, editMode: false, deleteMode: false, addMode: false });
    }
  }

  getDepartmentName(dpt_id) {
    const findIndex = this.departmentArray.findIndex(f => Number(f.dept_id) === Number(dpt_id));
    if (findIndex !== -1) {
      return this.departmentArray[findIndex].dept_name;
    }
  }
  getHonorificName(hon_id) {
    const findIndex = this.honrificArr.findIndex(f => Number(f.hon_id) === Number(hon_id));
    if (findIndex !== -1) {
      return this.honrificArr[findIndex].hon_name;
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
  setMinTo(event) {
    this.toMin = event.value;
  }
  getBoardValue($event) {
    console.log($event.value);
    if ($event.value) {
      var boardName = this.getBoardName($event.value);
      boardName = boardName.toLowerCase();
      if (boardName === 'others') {
        this.otherFlag = true;
      } else {
        this.otherFlag = false;
      }
    }
  }

  selectQualificationOrder(item) {
    this.qualficationArray.forEach((e) => {
      if (e.qlf_id == this.Education_Form.value.qualification) this.qualificationOrder = e.qlf_order;
    })
  }
} 
