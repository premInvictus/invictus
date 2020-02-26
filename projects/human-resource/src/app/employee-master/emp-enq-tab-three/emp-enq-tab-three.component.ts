import { Component, OnInit, ViewChild, OnChanges, Input } from '@angular/core';
import { AxiomService, SisService, CommonAPIService, SmartService } from '../../_services/index';
import { FormGroup, FormBuilder, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ConfirmValidParentMatcher } from '../../ConfirmValidParentMatcher';
import { PreviewDocumentComponent } from '../employee-tab-six-container/preview-document/preview-document.component';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-emp-enq-tab-three',
  templateUrl: './emp-enq-tab-three.component.html',
  styleUrls: ['./emp-enq-tab-three.component.scss']
})
export class EmpEnqTabThreeComponent implements OnInit {
  dialogRef2: MatDialogRef<PreviewDocumentComponent>;
  @Input() employeedetails;
  @Input() employeeCommonDetails;
  confirmValidParentMatcher = new ConfirmValidParentMatcher();
  toMin = new Date();
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
  remarksForm: FormGroup;
  taboneform: any = {};
  login_id = '';
  otherFlag = false;
  documentArray: any[] = [];
  imageArray: any[] = [];
  documentFormData: any[] = [];
  finalJSon: any[] = [];
  finalDocumentArray: any[] = [];
  verifyArray: any[] = [];
  finalArray: any = [];
  settingsArray: any[] = [];
  currentFileChangeEvent: any;
  multipleFileArray: any[] = [];
  counter: any = 0;
  currentImage: any;
  currentUser: any;
  subjectArray: any[] = [];
  documentsArray: any[] = [
    { docreq_id: 1, docreq_name: "Id & Address Proof", docreq_alias: "Id", docreq_is_required: "1", docreq_status: "1", verified_status: false },
    { docreq_id: 2, docreq_name: "Education", docreq_alias: "Education", docreq_is_required: "1", docreq_status: "1", verified_status: false },
    { docreq_id: 3, docreq_name: "Experience", docreq_alias: "Experience", docreq_is_required: "1", docreq_status: "1", verified_status: false },
    { docreq_id: 4, docreq_name: "Resume", docreq_alias: "Resume", docreq_is_required: "1", docreq_status: "1", verified_status: false },
    { docreq_id: 5, docreq_name: "Others", docreq_alias: "Others", docreq_is_required: "1", docreq_status: "1", verified_status: false }
  ];
  divisonArray: any[] = [
    { id: 0, name: 'First Divison' },
    { id: 1, name: 'Second Divison' },
    { id: 2, name: 'Third Divison' }
  ];
  honrificArr = [
    { hon_id: "1", hon_name: 'Mr.' },
    { hon_id: "2", hon_name: 'Mrs.' },
    { hon_id: "3", hon_name: 'Miss.' },
    { hon_id: "4", hon_name: 'Ms.' },
    { hon_id: "5", hon_name: 'Mx.' },
    { hon_id: "6", hon_name: 'Sir.' },
    { hon_id: "7", hon_name: 'Dr.' },
    { hon_id: "8", hon_name: 'Lady.' }

  ];
  departmentArray;
  designationArray;
  wingArray;
  categoryOneArray: any[] = [];
  disabledApiButton = false;
  @ViewChild('editReference') editReference;
  constructor(public commonAPIService: CommonAPIService, private fbuild: FormBuilder, private axiomService: AxiomService,
    private sisService: SisService, private dialog: MatDialog, private smartService: SmartService) {

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
    this.getAllSubjects();
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
    this.documentArray = [];
    this.verifyArray = [];
    this.finalDocumentArray = [];
    this.imageArray = [];
    console.log('employeedjhjhjhetails', this.employeedetails);
    if (this.employeedetails) {
      // this.remarksForm.patchValue({
      //   management_remarks: this.employeedetails && this.employeedetails.enq_remarks && this.employeedetails.enq_remarks[0].management_remark ?
      //     this.employeedetails.enq_remarks[0].management_remark : '-',
      //   interview_remarks: this.employeedetails && this.employeedetails.enq_remarks && this.employeedetails.enq_remarks[0].interview_remark ?
      //     this.employeedetails.enq_remarks[0].interview_remark : '-',
      // });
      this.experiencesArray = this.employeedetails.enq_work_experience_detail ? this.employeedetails.enq_work_experience_detail : [];
      this.educationsArray = this.employeedetails.enq_academic_detail ? this.employeedetails.enq_academic_detail : [];
    } else {
      this.experiencesArray = [];
      this.educationsArray = [];
    }
    if (this.employeedetails && this.employeedetails.enq_skills_detail && this.employeedetails.enq_skills_detail.length > 0) {
      this.skillsArray = this.employeedetails.enq_skills_detail;
    } else {
      this.skillsArray = [];
    }
    this.documentArray = this.employeedetails.enq_documents ? this.employeedetails.enq_documents : [];
    this.finalJSon = this.documentArray;
    for (const item of this.documentArray) {
      if (item && item.files_data) {
        for (const iitem of item.files_data) {
          this.imageArray.push({
            docreq_id: item.document_id,
            imgName: iitem.file_url
          });
        }
      }
      if (item.document_id === 1) {
        this.documentsArray[0]['verified_status'] = true;
      }
      if (item.document_id === 2) {
        this.documentsArray[1]['verified_status'] = true;
      }
      if (item.document_id === 3) {
        this.documentsArray[2]['verified_status'] = true;
      }
      if (item.document_id === 4) {
        this.documentsArray[3]['verified_status'] = true;
      }
    }
    const tempArray: any[] = [];
    for (const item of this.documentArray) {
      const findex = tempArray.indexOf(item.docreq_id);
      if (findex === -1) {
        tempArray.push(item.docreq_id);
      }
    }
    this.verifyArray = tempArray;

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

  }
  addPreviousEducations() {
    if (this.Education_Form.value.qualification && this.Education_Form.value.board && this.Education_Form.value.year
      && this.Education_Form.value.percentage && this.Education_Form.value.subject) {
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
      });
    } else {
      Object.keys(this.Education_Form.value).forEach(key => {
        const formControl = <FormControl>this.Education_Form.controls[key];
        if (formControl.invalid) {
          formControl.markAsDirty();
        }
      });
    }
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
    const findex = this.divisonArray.findIndex(f => Number(f.id) === Number(value));
    if (findex !== -1) {
      return this.divisonArray[findex].name;
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
      subject: this.educationsArray[value].subject
    });
  }
  updateEducation() {
    this.educationsArray[this.educationValue] = this.Education_Form.value;
    this.otherFlag = false;
    this.commonAPIService.showSuccessErrorMessage('Education List Updated', 'success');
    this.Education_Form.reset();
    this.educationUpdateFlag = false;
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
    this.experiencesArray[this.experienceValue] = this.Experience_Form.value;
    this.commonAPIService.showSuccessErrorMessage('Experience List Updated', 'success');
    this.Experience_Form.reset();
    this.experienceUpdateFlag = false;
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
    if (this.employeedetails) {
      this.employeedetails['enq_personal_detail'] = {
        enq_full_name: this.employeeCommonDetails.employeeDetailsForm.value.enq_name,
      };
      this.employeedetails['enq_applied_job_detail'] = [
        {
          enq_applied_for: {
            post_id: Number(this.employeeCommonDetails.employeeDetailsForm.value.enq_applied_for),
            post_name: this.getCategoryOneName(this.employeeCommonDetails.employeeDetailsForm.value.enq_applied_for),
          },
          enq_department: {
            dept_id: Number(this.employeeCommonDetails.employeeDetailsForm.value.enq_department),
            dept_name: this.getDepartmentName(this.employeeCommonDetails.employeeDetailsForm.value.enq_department)
          },
          enq_subject: [
            {
              sub_id: Number(this.employeeCommonDetails.employeeDetailsForm.value.enq_subject),
              sub_name: this.getSubjectName(this.employeeCommonDetails.employeeDetailsForm.value.enq_subject)
            }
          ]
        }];
      this.employeedetails.emp_id = this.employeeCommonDetails.employeeDetailsForm.value.emp_id;
      this.employeedetails.enq_profile_pic = this.employeeCommonDetails.employeeDetailsForm.value.enq_profile_pic;
    }
    this.employeedetails['enq_remarks'] = [
      {
        management_remark: this.remarksForm.value.management_remarks,
        interview_remark: this.remarksForm.value.interview_remarks
      }
    ];
    this.employeedetails['enq_academic_detail'] = this.educationsArray;
    this.employeedetails['enq_work_experience_detail'] = this.experiencesArray;
    this.employeedetails['enq_skills_detail'] = this.skillsArray;
    this.employeedetails['enq_documents'] = this.finalJSon;
    this.commonAPIService.updateCareerEnq(this.employeedetails).subscribe((result: any) => {
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
      this.employeedetails['enq_personal_detail'] = {
        enq_full_name: this.employeeCommonDetails.employeeDetailsForm.value.enq_name,
      };
      this.employeedetails['enq_applied_job_detail'] = [
        {
          enq_applied_for: {
            post_id: Number(this.employeeCommonDetails.employeeDetailsForm.value.enq_applied_for),
            post_name: this.getCategoryOneName(this.employeeCommonDetails.employeeDetailsForm.value.enq_applied_for),
          },
          enq_department: {
            dept_id: Number(this.employeeCommonDetails.employeeDetailsForm.value.enq_department),
            dept_name: this.getDepartmentName(this.employeeCommonDetails.employeeDetailsForm.value.enq_department)
          },
          enq_subject: [
            {
              sub_id: Number(this.employeeCommonDetails.employeeDetailsForm.value.enq_subject),
              sub_name: this.getSubjectName(this.employeeCommonDetails.employeeDetailsForm.value.enq_subject)
            }
          ]
        }];
      this.employeedetails.emp_id = this.employeeCommonDetails.employeeDetailsForm.value.emp_id;
      this.employeedetails.enq_profile_pic = this.employeeCommonDetails.employeeDetailsForm.value.enq_profile_pic;
    }
    this.employeedetails['enq_remarks'] = [
      {
        management_remark: this.remarksForm.value.management_remarks,
        interview_remark: this.remarksForm.value.interview_remarks
      }
    ];
    this.employeedetails['enq_academic_detail'] = this.educationsArray;
    this.employeedetails['enq_work_experience_detail'] = this.experiencesArray;
    this.employeedetails['enq_skills_detail'] = this.skillsArray;
    this.employeedetails['enq_documents'] = this.finalJSon;
    if (!moveNext) {
      this.commonAPIService.updateCareerEnq(this.employeedetails).subscribe((result: any) => {
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
      this.commonAPIService.updateCareerEnq(this.employeedetails).subscribe((result: any) => {
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
  previewImage(imgArray, index) {
    this.dialogRef2 = this.dialog.open(PreviewDocumentComponent, {
      data: {
        imageArray: imgArray,
        index: index
      },
      height: '100vh',
      width: '100vh'
    });
  }
  getDocuments() {
    this.documentArray = [];
    this.verifyArray = [];
    this.finalDocumentArray = [];
    this.imageArray = [];
    this.documentArray = this.employeedetails.enq_documents ? this.employeedetails.enq_documents : [];

    this.finalJSon = this.documentArray;

    for (const item of this.documentArray) {
      if (item && item.files_data) {
        for (const iitem of item.files_data) {
          this.imageArray.push({
            docreq_id: item.document_id,
            imgName: iitem.file_url
          });
        }

      }
      if (item.document_id === 1) {
        this.documentsArray[0]['verified_status'] = true;
      }
      if (item.document_id === 2) {
        this.documentsArray[1]['verified_status'] = true;
      }
      if (item.document_id === 3) {
        this.documentsArray[2]['verified_status'] = true;
      }
      if (item.document_id === 4) {
        this.documentsArray[3]['verified_status'] = true;
      }
    }
    const tempArray: any[] = [];
    for (const item of this.documentArray) {
      const findex = tempArray.indexOf(item.docreq_id);
      if (findex === -1) {
        tempArray.push(item.docreq_id);
      }
    }
    this.verifyArray = tempArray;
  }
  getFileName(doc_req_id) {
    const findIndex = this.documentsArray.findIndex(f => f.docreq_id === doc_req_id);
    if (findIndex !== -1) {
      return this.documentsArray[findIndex].docreq_alias;
    }
  }
  fileChangeEvent(fileInput, doc_req_id) {
    this.multipleFileArray = [];
    this.counter = 0;
    this.currentFileChangeEvent = fileInput;
    const files = fileInput.target.files;
    for (let i = 0; i < files.length; i++) {
      this.IterateFileLoop(files[i], doc_req_id);
    }
  }

  IterateFileLoop(files, doc_req_id) {
    const reader = new FileReader();
    reader.onloadend = (e) => {
      this.currentImage = reader.result;
      const fileJson = {
        fileName: files.name,
        imagebase64: this.currentImage,
        module: 'attachment'
      };
      this.multipleFileArray.push(fileJson);
      this.counter++;
      if (this.counter === this.currentFileChangeEvent.target.files.length) {
        this.sisService.uploadDocuments(this.multipleFileArray).subscribe((result: any) => {
          if (result) {
            for (const item of result.data) {
              const findex = this.finalJSon.findIndex(f => f.document_id === doc_req_id);
              const findex2 = this.imageArray.findIndex(f => f.imgName === item.file_url && f.docreq_id === doc_req_id);
              if (findex === -1) {
                this.finalDocumentArray.push({
                  docreq_id: doc_req_id,
                  ed_name: item.file_name,
                  ed_link: item.file_url,
                });
                this.finalJSon.push({
                  document_id: doc_req_id,
                  document_name: this.getFileName(doc_req_id),
                  verified_staus: false,
                  files_data: [
                    {
                      file_name: item.file_name,
                      file_url: item.file_url
                    }
                  ]

                });
              } else {
                this.finalJSon.splice(findex, 1);
              }
              if (findex2 === -1) {
                this.imageArray.push({
                  docreq_id: doc_req_id,
                  imgName: item.file_url
                });
              } else {
                this.imageArray.splice(findex2, 1);
              }

            }
          }
        });
      }
    };
    reader.readAsDataURL(files);
  }

  checkThumbnail(url: any) {
    if (url.match(/jpg/) || url.match(/png/) || url.match(/bmp/) ||
      url.match(/gif/) || url.match(/jpeg/) ||
      url.match(/JPG/) || url.match(/PNG/) || url.match(/BMP/) ||
      url.match(/GIF/) || url.match(/JPEG/)) {
      return true;
    } else {
      return false;
    }
  }

  fileUploadedStatus(doc_req_id) {
    for (let i = 0; i < this.finalDocumentArray.length; i++) {
      if (this.finalDocumentArray[i]['docreq_id'] === doc_req_id) {
        return true;
      }
    }
  }
  deleteFile(doc_name, doc_req_id) {
    const findex = this.finalJSon.findIndex(f => f.document_id === doc_req_id);
    const findex2 = this.imageArray.findIndex(f => f.docreq_id === doc_req_id && f.imgName === doc_name);
    if (findex !== -1) {
      this.finalJSon.splice(findex, 1);
    }
    if (findex2 !== -1) {
      this.imageArray.splice(findex2, 1);
    }
  }
  //  Get Class List function
  getAllSubjects() {
    this.smartService.getAllSubjects({})
      .subscribe(
        (result: any) => {
          if (result && result.status === 'ok') {
            this.subjectArray = result.data;
          }
        }
      );
  }

  getSubjectName(sub_id) {
    const findex = this.subjectArray.findIndex(e => Number(e.sub_id) === Number(sub_id));
    if (findex !== -1) {
      return this.subjectArray[findex].sub_name;
    }
  }
  getDepartmentName(dept_id) {
    const findex = this.departmentArray.findIndex(e => Number(e.config_id) === Number(dept_id));
    if (findex !== -1) {
      return this.departmentArray[findex].name;
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

} 
