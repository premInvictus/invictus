import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { QelementService } from '../../questionbank/service/qelement.service';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { UserAccessMenuService, BreadCrumbService, NotificationService, SocketService, CommonAPIService } from '../../_services/index';
import { Element } from './scheduleexam.model';
import { StudentStatusModalComponent } from '../student-status-modal/student-status-modal.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


@Component({
	selector: 'app-scheduleexam',
	templateUrl: './scheduleexam.component.html',
	styleUrls: ['./scheduleexam.component.css']
})
export class ScheduleexamComponent implements OnInit {

	currentQues: any[];
	Schedule_exam_Form: FormGroup;
	classArray: any[];
	subjectArray: any[];
	examTypeArray: any[];
	scheduleExamArray: any[] = [];
	public role_id: any;
	homeUrl: string;
	ELEMENT_DATA: Element[] = [];
	tableCollection: Boolean = false;
	examData:any;

	currentUser: any;
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild('deleteModalRef') deleteModalRef;
	@ViewChild('admitCodeModalRef') admitCodeModalRef;

	displayedColumns = ['position', 'name', 'location', 'marks', 'duration', 'date', 'time', 'action'];
	dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
	verifyAdmitCodeStatus = false;
	constructor(
		private formbuilder: FormBuilder,
		private qelementService: QelementService,
		private notif: NotificationService,
		private userAccessMenuService: UserAccessMenuService,
		private breadCrumbService: BreadCrumbService,
		private socketService: SocketService,
		private _commonAPIService: CommonAPIService,
		public dialog: MatDialog

	) {
		// this.socket = io.connect(appConfig.socketUrl);
	}

	ngOnInit() {
		this.homeUrl = this.breadCrumbService.getUrl();
		if (localStorage.getItem('currentUser')) {
			this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		}
		this.buildForm();
		this.getClass();
		this.getExamType();
	}

	applyFilter(filterValue: string) {
		this.dataSource.filter = filterValue.trim().toLowerCase(); // Remove whitespace
	}

	isExistUserAccessMenu(mod_id) {
		return this.userAccessMenuService.isExistUserAccessMenu(mod_id);
	}

	buildForm() {
		this.Schedule_exam_Form = this.formbuilder.group({
			es_class_id: '',
			es_sub_id: '',
			es_exam_type: '',
			es_scheduled_date: '',
			es_end_date: '',
		});
	}
	getExamType() {
		this.qelementService.getExamType().subscribe(
			(result: any) => {
				if (result) {
					this.examTypeArray = result;
				}
			}
		);
	}

	getScheduleExam() {
		// Form validation
		this.scheduleExamArray = [];
		this.ELEMENT_DATA = [];
		if (this.Schedule_exam_Form.valid) {
			this.Schedule_exam_Form.value.es_status = '0';
			if (this.Schedule_exam_Form.value.es_exam_type === '2') {
				this.Schedule_exam_Form.value.es_status = '1';
			}
			if (this.Schedule_exam_Form.valid) {
				this.qelementService.getScheduledExam(this.Schedule_exam_Form.value).subscribe(
					(result: any) => {
						if (result && result.status === 'ok') {
							const scheduleExamArrayTemp: any[] = result.data;
							const today = new Date();
							scheduleExamArrayTemp.forEach((element, index) => {
								const examscheduledate = new Date(element.es_start_date + ' 00:00:01');
								examscheduledate.setDate(examscheduledate.getDate() + 7);
								if (examscheduledate.getTime() >= today.getTime()) {
									this.scheduleExamArray.push(element);
								}
							});
							for (const sitem of this.scheduleExamArray) {
								if (sitem.es_exam_type === '2') {
									sitem.showEndTest = true;
									/* const onEndDay = sitem.es_end_date;
									const onEndTime = sitem.es_end_time;
									const onEndDate = new Date(onEndDay + ' ' + onEndTime).getTime();
									const now = new Date().getTime();
									const difference2 = onEndDate - now;
									if (difference2 < 0) {
										sitem.showEndTest = true;
									} */
								}
							}
							let ind = 1;
							for (const t of this.scheduleExamArray) {
								const sliced = t.es_start_time.slice(0, -3);
								this.ELEMENT_DATA.push({
									position: ind, name: t.qp_name, duration: t.tp_time_alloted, marks: t.tp_marks,
									location: t.lab_name, date: t.es_start_date, time: sliced, action: t
								});
								ind++;
							}
							this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
							this.dataSource.paginator = this.paginator;
							this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
							this.dataSource.sort = this.sort;
						} else {
							this.tableCollection = false;
							this.notif.showSuccessErrorMessage('No records found', 'error');
						}

					}
				);
			}
		}
		if (!this.Schedule_exam_Form.value.es_class_id) {
			this.notif.showSuccessErrorMessage('Class is required', 'error');
		}
		if (!this.Schedule_exam_Form.value.es_sub_id) {
			this.notif.showSuccessErrorMessage('Subject is required', 'error');
		} else {
			this.tableCollection = true;
		}
	}

	startTest(examData: any) {
		this.examData = examData;
		console.log('exam data--', examData);	
		// if (this.examData.action.es_admit_code === '1') {
		// 	this.verifyAdmitCodeStatus = false;
		// } else {
		// 	this.verifyAdmitCodeStatus = true;
		// }
		this.verifyAdmitCodeStatus = true;
		if (this.verifyAdmitCodeStatus) {
			for (const item of this.scheduleExamArray) {
				if (item.es_id === examData.action.es_id) {
					const examscheduledate = new Date(item.es_start_date + ' 00:00:01');
					const today = new Date();
					const year = today.getFullYear();
					const tmon = today.getMonth() + 1;
					const tdate = today.getDate();
					const examstartdate = new Date(year + '-' + (tmon) + '-' + tdate + ' 00:00:01');
					if (+examscheduledate > +examstartdate) {
						this.notif.showSuccessErrorMessage('Exam can not be started prior to the scheduled date', 'error');
					} else if (+examscheduledate < +examstartdate) {
						this.notif.showSuccessErrorMessage('The date of examination has lapsed', 'error');
					} else {
						let url1 = '';
						if (this.currentUser.role_id === '2') {
							url1 = 'axiom/school/';
						} else if (this.currentUser.role_id === '3') {
							url1 = 'axiom/teacher/';
						}
						const url = url1 + 'eassessment/testscreeen/' + examData.action.es_id;
	
						const param = 'width=' + screen.width + ',height=' + screen.height + ',toolbar=0,location=0,menubar=0,status=0,resizable=0';
						window.open(url, '_blank', param);
					}
					break;
	
				}
			}
		} else {
			this.admitCodeModalRef.openAdmitCodeConfirmationModal({login_id:this.currentUser.login_id, admitCode:''});
			this.notif.showSuccessErrorMessage('You are not authorized to give this test', 'error');
		}


		
	}

	

	verifyAdmitCode(data) {
		console.log('data--', data);
		
		this._commonAPIService.getAdmmitCodeVerification(data).subscribe((result:any)=>{
			if(result && result.status === 'ok') {
				this.verifyAdmitCodeStatus = true;
				//this.startTest(this.examData);
			} else {
				this.verifyAdmitCodeStatus = false;
				this.notif.showSuccessErrorMessage('Invalid Admit Code, Please Choose Another One', 'error');
			}
		})
	}

	getClass() {

		this.qelementService.getClass().subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.classArray = result.data;
				}

			}
		);

	}
	getSubjectsByClass(): void {
		this.subjectArray = [];
		this.qelementService.getSubjectsByClass(this.Schedule_exam_Form.value.es_class_id).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.subjectArray = result.data;
					this.Schedule_exam_Form.value.es_sub_id = '';
				} else {
					this.subjectArray = [];
				}
			}
		);
	}

	deleteExam(value) {
		for (const item of this.scheduleExamArray) {
			if (value === item.es_id) {
				this.currentQues = item.es_id;

			}
		}
	}

	deleteScheduledExam(currentQues) {
		this.qelementService.deleteScheduledExam({ es_id: currentQues }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.getScheduleExam();
					this.notif.showSuccessErrorMessage('Exam deleted successfully', 'success');
				} else {
					this.notif.showSuccessErrorMessage('Error deleting the exam', 'error');
				}
			}
		);
	}
	endTest(value) {
		if (confirm('Do you really wish to end the test') === true) {
			this.qelementService.teacherEndSession({ es_id: value.es_id, eva_status: value.es_qt_status }).subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.notif.showSuccessErrorMessage('Exam Ended successfully', 'success');
						this.getScheduleExam();
					}
				}
			);
		}
	}
	openModal = (data) => this.deleteModalRef.openDeleteModal(data);
	deleteComCancel() { }
	openStudentStatusModal(es_id) {
		const dialogRef = this.dialog.open(StudentStatusModalComponent, {
			width: '1000px',
			data: {es_id:es_id}
		});
		dialogRef.afterClosed().subscribe(dresult => {
			if (dresult && dresult.data) {
			}
		});
			
	}
}
