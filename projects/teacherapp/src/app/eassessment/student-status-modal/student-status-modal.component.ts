import { Component, OnInit, Inject, AfterViewInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QelementService } from '../../questionbank/service/qelement.service';
import { NotificationService, SocketService } from '../../_services/index';
import { MatPaginator, MatTableDataSource, MatSort, MatInput } from '@angular/material';

@Component({
  selector: 'app-student-status-modal',
  templateUrl: './student-status-modal.component.html',
  styleUrls: ['./student-status-modal.component.css']
})
export class StudentStatusModalComponent implements OnInit, AfterViewInit {

  presentSIDArray: any[] = [];
	scheduleExam: any;
	studentArray: any[] = [];
	presentSArray: any[] = [];
	examAttandanceList: any[] = [];
	es_id: number;
	testInitiationScreenDiv = true;
	ELEMENT_DATA: TestElement[] = [];
  tableCollection = false;
  displayedColumns = [
		'position',
		'admission',
		'student',
		'class',
    'status',
    'action'
	];
  dataSource = new MatTableDataSource<TestElement>(this.ELEMENT_DATA);
  testArray:any[]=[];
  statusArr = ['yet to start','inprogress','exam submited','result published'];
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
  constructor(
    public dialogRef: MatDialogRef<StudentStatusModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private fbuild: FormBuilder,
    private route: ActivatedRoute,
		private qelementService: QelementService,
		private notif: NotificationService,
		private socketService: SocketService,
		private router: Router
  ) { }

  ngOnInit() {
    console.log('data',this.data);
    this.es_id = this.data.es_id;
		// this.getExamAttendance();
		this.qelementService
			.getScheduledExam({ es_id: this.es_id })
			.subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.scheduleExam = result.data[0];
					console.log('scheduleExam', this.scheduleExam);
					this.getStudents();
				}
			});
		// jquery dependancy exist so currently commented
		// $('body').addClass(this.bodyClasses);
  }
  ngAfterViewInit() {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
  }
  applyFilter(filterValue: string) {
		filterValue = filterValue.trim().toLowerCase();
		this.dataSource.filter = filterValue;
  }
  getStudents() {
    this.qelementService.getExamAttendance({ es_id: this.data.es_id }).toPromise().then(
			(result: any) => {
				if (result && result.status === 'ok' ) {
					this.testArray = result.data;
				}
			}
		);
		this.qelementService
			.getUser({
				class_id: this.scheduleExam.es_class_id,
				sec_id: this.scheduleExam.es_sec_id,
				role_id: '4',
				status: '1'
			})
			.toPromise().then((result: any) => {
				if (result && result.status === 'ok') {
					this.studentArray = result.data;
					let position = 1;

					for (const stu of this.studentArray) {
            let status = this.statusArr[0];
            let eva_details = {};
            const findex = this.testArray.findIndex(e => e.eva_login_id == stu.au_login_id);
            if(findex != -1){
			eva_details = this.testArray[findex];
              if(this.testArray[findex].eva_status == 0){
                status=this.statusArr[1];
              } else if(this.testArray[findex].eva_status == 1){
                status=this.statusArr[2];
              } else if(this.testArray[findex].eva_status == 2){
                status=this.statusArr[3];
              }
            }
						this.ELEMENT_DATA.push({
							position: position,
							admission: stu.au_admission_no,
							loginid: stu.au_login_id,
							student: stu.au_full_name,
							class: this.scheduleExam.class_name,
							section: this.scheduleExam.sec_name,
              status: status,
              eva_details:eva_details
						});
						this.dataSource = new MatTableDataSource<TestElement>(
							this.ELEMENT_DATA
						);
						position++;
					}
				}
			});
  }
  getStudentAttandance(value) {
		const findex = this.presentSIDArray.indexOf(value);
		if (findex === -1) {
			this.presentSIDArray.push(value);
		} else {
			this.presentSIDArray.splice(findex, 1);
		}
		console.log(this.presentSIDArray);
	}
  closeDialog(): void {
    this.dialogRef.close();
  }
  changeStatus(eva_id,eva_status) {
	// console.log('chagestatus');
    this.qelementService.teacherFinalSubmit({ eva_id: eva_id, eva_status: eva_status }).subscribe(
      // tslint:disable-next-line:no-shadowed-variable
      (result: any) => {
        if (result && result.status === 'ok') {
		  this.notif.showSuccessErrorMessage('Submitted successfully', 'success');
		  this.getStudents();
        }
      }
    );
  }

}
export interface TestElement {
	position: number;
	admission: any;
	loginid: any;
	student: string;
	class: string;
	section: string;
  	status: string;
  	eva_details:any;

} 
