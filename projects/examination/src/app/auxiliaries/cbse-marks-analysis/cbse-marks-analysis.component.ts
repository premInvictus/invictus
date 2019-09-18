import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SmartService, ExamService, SisService } from '../../_services';

@Component({
  selector: 'app-cbse-marks-analysis',
  templateUrl: './cbse-marks-analysis.component.html',
  styleUrls: ['./cbse-marks-analysis.component.css']
})
export class CbseMarksAnalysisComponent implements OnInit {
  classArray: any[] = [];
  sessionArray: any[] = [];
  secondFlag = false;
  subjectArray: any[] = [];
  stuDetailsArray: any[] = [];
  tabSubArray: any[] = [];
  tabHeaderArray: any[] = [];
  tableFlag = false;
  tabSubDataArray: any[] = [];
  header: any = 'Analysis';
  succImg = '../../../../../../src/assets/images/examination/successful.svg';
  cardArray: any[] = [{
    id: '1',
    class: 'cbse-box-two',
    initialState: 'cbse-report-box disabled-box text-center',
    img: '../../../../../../src/assets/images/examination/marks_register.svg',
    header: 'Marks Register'
  },
  {
    id: '2',
    class: 'cbse-box-two',
    initialState: 'cbse-report-box disabled-box text-center',
    img: '../../../../../../src/assets/images/examination/best_five_subjects.svg',
    header: 'Best Five Subjects'
  },
  {
    id: '3',
    class: 'cbse-box-two',
    initialState: 'cbse-report-box disabled-box text-center',
    img: '../../../../../../src/assets/images/examination/subject_wise_analysis.svg',
    header: 'Subject Wise Analysis'
  },
  {
    id: '4',
    class: 'cbse-box-two',
    initialState: 'cbse-report-box disabled-box text-center',
    img: '../../../../../../src/assets/images/examination/trend_analysis.svg',
    header: 'Stream Wise Analysis'
  },
  {
    id: '5',
    class: 'cbse-box-two',
    initialState: 'cbse-report-box disabled-box text-center',
    img: '../../../../../../src/assets/images/examination/trend_analysis.svg',
    header: 'Trend Wise Analysis'
  }];
  previousIndex: any;
  ngOnInit() {
    this.getSubjects();
    this.getIsBoardClass();
    this.getSession();
  }
  getSubjects() {
    this.smart.getSubject({}).subscribe((res: any) => {
      if (res && res.status === 'ok') {
        this.subjectArray = [];
        this.subjectArray = res.data;
      }
    });
  }
  getMarksAnalysis(class_id) {
    this.header = 'Analysis';
    this.secondFlag = false;
    this.tableFlag = false;
    this.tabSubDataArray = [];
    this.tabSubArray = [];
    this.tabHeaderArray = [];
    this.stuDetailsArray = [];
    this.cardArray = [{
      id: '1',
      class: 'cbse-box-two',
      initialState: 'cbse-report-box disabled-box text-center',
      img: '../../../../../../src/assets/images/examination/marks_register.svg',
      header: 'Marks Register'
    },
    {
      id: '2',
      class: 'cbse-box-two',
      initialState: 'cbse-report-box disabled-box text-center',
      img: '../../../../../../src/assets/images/examination/best_five_subjects.svg',
      header: 'Best Five Subjects'
    },
    {
      id: '3',
      class: 'cbse-box-two',
      initialState: 'cbse-report-box disabled-box text-center',
      img: '../../../../../../src/assets/images/examination/subject_wise_analysis.svg',
      header: 'Subject Wise Analysis'
    },
    {
      id: '4',
      class: 'cbse-box-two',
      initialState: 'cbse-report-box disabled-box text-center',
      img: '../../../../../../src/assets/images/examination/trend_analysis.svg',
      header: 'Stream Wise Analysis'
    },
    {
      id: '5',
      class: 'cbse-box-two',
      initialState: 'cbse-report-box disabled-box text-center',
      img: '../../../../../../src/assets/images/examination/trend_analysis.svg',
      header: 'Trend Wise Analysis'
    }];
    this.exam.getMarksAnalysis({
      class_id: class_id
    }).subscribe((res: any) => {
      if (res && res.status === 'ok') {
        for (const titem of this.cardArray) {
          titem.initialState = 'cbse-report-box text-center'
        }
        this.stuDetailsArray = [];
        this.stuDetailsArray = res.data;
        let ind = 0;
        for (const item of this.stuDetailsArray) {
          Object.keys(this.stuDetailsArray[ind]).forEach((key: any) => {
            for (const titem of this.subjectArray) {
              if (titem.sub_code.toString() === key.toString()) {
                const findex = this.tabSubArray.findIndex(f => f.sub_code.toString() === key.toString());
                if (findex === -1) {
                  this.tabSubArray.push(this.stuDetailsArray[ind][key]);
                }
              }
            }
          });
          ind++;
        }
        let ind2 = 0;
        for (const item of this.stuDetailsArray) {
          const sub_data: any[] = [];
          for (const titem of this.tabSubArray) {
            if (this.stuDetailsArray[ind2][titem.sub_code]) {
              sub_data.push(this.stuDetailsArray[ind2][titem.sub_code]);
            } else {
              sub_data.push({
                grade: '-',
                marks: '-',
                sub_code: titem.sub_code,
                subject: titem.subject,
              })
            }
          }
          const findex = this.tabSubDataArray.findIndex(f => Number(f.index) === ind2);
          if (findex === -1) {
            this.tabSubDataArray.push({
              index: ind2,
              sub_data: sub_data
            });
          }
          ind2++;
        }
        console.log(this.tabSubArray);
        console.log(this.tabSubDataArray);
        for (const titem of this.tabSubArray) {
          this.tabHeaderArray.push(titem.subject);
          this.tabHeaderArray.push('Marks');
          this.tabHeaderArray.push('Grade');
        }
        console.log(this.tabSubDataArray);
      } else {
        for (const titem of this.cardArray) {
          titem.initialState = 'cbse-report-box disabled-box text-center'
        }
      }
    });
  }
  checkSubjectCodeIndex(value) {
    const findex = this.subjectArray.findIndex((f: any) => f.sub_code.toString() === value.toString());
    return findex;
  }
  getSubjectName(value) {
    const findex = this.subjectArray.findIndex((f: any) => f.sub_code.toString() === value.toString());
    if (findex !== -1) {
      return this.subjectArray[findex].sub_name;
    }
  }
  getSubjectColor(value) {
    const findex = this.subjectArray.findIndex((f: any) => f.sub_code.toString() === value.toString());
    if (findex !== -1) {
      return this.subjectArray[findex].sub_color;
    }
  }
  checkStatusColor(status) {
    if (status && status === 'pass') {
      return 'green';
    }
    if (status && status === 'comp') {
      return '#b7b734';
    } else {
      return 'red';
    }
  }
  getbtnbg(value) {
    if (Number(value) >= 90) {
      return '#009688';
    } else if (Number(value) >= 80) {
      return '#4caf50';
    } else if (Number(value) >= 70) {
      return '#04cde4';
    } else if (Number(value) >= 60) {
      return '#ccdb39';
    } else if (Number(value) >= 50) {
      return '#fe9800';
    } else if (Number(value) >= 40) {
      return '#fe756d';
    } else if (Number(value) >= 32) {
      return '#e81e63';
    } else {
      return '#EB1010';
    }
  }
  excecuteCard(index) {
    this.previousIndex = index;
    this.cardArray[index].class = 'cbse-check';
    this.cardArray[index].img = this.succImg;
    this.header = this.cardArray[index].header;
    setTimeout(() => this.secondFlag = true, 200);
    setTimeout(() => this.tableFlag = true, 200);
  }
  getMarks(class_id) {
    this.getMarksAnalysis(class_id);
  }
  constructor(public dialog: MatDialog, private smart: SmartService, private exam: ExamService,
    private sis: SisService) { }

  openUploadDialog(): void {
    const dialogRef = this.dialog.open(CbseMarksUploadDialog, {
      width: '60%',
      data: {
        classArray: this.classArray,
        sessionArray: this.sessionArray
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  getIsBoardClass() {
    this.exam.getIsBoardClass({ is_board: '1' }).subscribe((res: any) => {
      if (res && res.status === 'ok') {
        this.classArray = [];
        this.classArray = res.data;
      }
    });
  }
  getSession() {
    this.sis.getSession().subscribe((res: any) => {
      if (res && res.status === 'ok') {
        this.sessionArray = [];
        this.sessionArray = res.data;
      }
    });
  }

}

@Component({
  selector: 'cbse-marks-upload-dialog',
  templateUrl: 'cbse-marks-upload-dialog.html',
})
export class CbseMarksUploadDialog implements OnInit {
  classArray: any[] = [];
  sessionArray: any[] = [];
  subjectArray: any[] = [];
  stuDetailsArray: any[] = [];
  tabSubArray: any[] = [];
  tabHeaderArray: any[] = [];
  tableFlag = false;
  tabSubDataArray: any[] = [];
  class_id = '';
  ses_id = '';
  subjectClassArray: any[];
  currentUser: any = {};
  constructor(
    public dialogRef: MatDialogRef<CbseMarksUploadDialog>,
    private smart: SmartService,
    private exam: ExamService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.classArray = this.data.classArray;
    this.sessionArray = this.data.sessionArray;
    this.getSubjects();
  }
  getSubjects() {
    this.smart.getSubject({}).subscribe((res: any) => {
      if (res && res.status === 'ok') {
        this.subjectArray = [];
        this.subjectArray = res.data;
      }
    });
  }
  getSubjectByClass(class_id) {
    this.smart.getSubject({
      class_id: class_id
    }).subscribe((res: any) => {
      if (res && res.status === 'ok') {
        this.subjectClassArray = [];
        this.subjectClassArray = res.data;
      }
    });
  }
  getClass(value) {
    this.class_id = value;
    this.getSubjectByClass(this.class_id);
  }
  getSession(value) {
    this.ses_id = value;
  }
  upload($event) {
    this.tableFlag = false;
    this.tabSubDataArray = [];
    this.tabSubArray = [];
    this.tabHeaderArray = [];
    this.stuDetailsArray = [];
    const file = $event.target.files[0];
    const reader: FileReader = new FileReader();
    const finalArray: any[] = [];
    reader.onloadend = (e: any) => {
      const dataArr: any[] = e.target.result.split(/\r?\n/);
      const studentArray: any[] = [];
      for (const item of dataArr) {
        if (!item.match(/ROLL/) && !item.match(/MKS/)
          && !item.match(/------------/)
          && !item.match(/REGION/) && !item.match(/SCHOOL/) &&
          !item.match(/DATE/) && item) {
          studentArray.push(item);
        }
      }
      for (const titem of studentArray) {
        const stu: any[] = titem.split(' ');
        const tempArray: any[] = [];
        for (const ti of stu) {
          if (ti) {
            tempArray.push(ti);
          }
        }
        if (tempArray.length > 1) {
          finalArray.push(tempArray);
        }
      }
      console.log(finalArray);
      let i = 0;
      for (const item of finalArray) {
        let j = 0;
        for (const titem of finalArray[i]) {
          if (j < 2 && (finalArray[i][j].match(/M/) || finalArray[i][j].match(/F/))) {
            this.stuDetailsArray.push({
              cma_rollno: finalArray[i][j - 1],
              cma_sex: finalArray[i][j],
              cma_class_id: this.class_id,
              cma_ses_id: this.ses_id,
              cma_created_by: this.currentUser.login_id
            });
          }
          let k = 0;
          let stuName = '';
          for (const tt of finalArray[i]) {
            if (this.checkSubjectCodeIndex(tt) !== -1) {
              break;
            } else {
              if (k > 1) {
                stuName = stuName + finalArray[i][k] + ' ';
              }
              k++;
            }
          }
          if (j >= k && j <= finalArray[i].length - 2) {
            if (finalArray[i][j].match(/A/) ||
              finalArray[i][j].match(/A1/) ||
              finalArray[i][j].match(/A2/) ||
              finalArray[i][j].match(/B/) ||
              finalArray[i][j].match(/B1/) ||
              finalArray[i][j].match(/B2/) ||
              finalArray[i][j].match(/C/) ||
              finalArray[i][j].match(/C1/) ||
              finalArray[i][j].match(/C2/) ||
              finalArray[i][j].match(/D/) ||
              finalArray[i][j].match(/D1/) ||
              finalArray[i][j].match(/D2/) ||
              finalArray[i][j].match(/E/) ||
              finalArray[i][j].match(/E1/) ||
              finalArray[i][j].match(/E2/) ||
              finalArray[i][j].match(/F/) ||
              finalArray[i][j].match(/F1/) ||
              finalArray[i][j].match(/F2/)) {
              this.stuDetailsArray[i][finalArray[i][j - 2]] = {
                marks: finalArray[i][j - 1],
                grade: finalArray[i][j],
                sub_code: finalArray[i][j - 2],
                subject: this.getSubjectName(finalArray[i][j - 2])
              };
            }
          }
          if (j === finalArray[i].length - 1) {
            if (this.checkSubjectCodeIndex(finalArray[i][j]) !== -1) {
              this.stuDetailsArray[i]['cma_status'] = finalArray[i][j - 1].toLowerCase();
            } else {
              this.stuDetailsArray[i]['cma_status'] = finalArray[i][j].toLowerCase();
            }
            this.stuDetailsArray[i]['cma_student_name'] = stuName.substring(0, stuName.length - 1);
          }
          j++;
        }
        i++;
      }
      console.log(this.stuDetailsArray);
      this.exam.insertMarksAnalysis({
        studentData: this.stuDetailsArray,
        subjects: this.subjectClassArray
      }).subscribe((res: any) => {
        if (res && res.status === 'ok') {
        } else {
        }
      });
    };
    reader.readAsText(file);
  }
  checkSubjectCodeIndex(value) {
    const findex = this.subjectArray.findIndex((f: any) => f.sub_code.toString() === value.toString());
    return findex;
  }
  getSubjectName(value) {
    const findex = this.subjectArray.findIndex((f: any) => f.sub_code.toString() === value.toString());
    if (findex !== -1) {
      return this.subjectArray[findex].sub_name;
    }
  }
}
