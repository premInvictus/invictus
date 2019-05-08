import { Component, OnInit, Input, OnChanges, ViewChild, AfterViewInit } from '@angular/core';
import { ExamElement } from '../view-all-exams.model';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { NotificationService, UserAccessMenuService, BreadCrumbService } from '../../../../_services';
import { QelementService } from '../../../../questionbank/service/qelement.service';
@Component({
	selector: 'app-table-renderer',
	templateUrl: './table-renderer.component.html',
	styleUrls: ['./table-renderer.component.css']
})
export class TableRendererComponent implements OnInit , OnChanges , AfterViewInit {
	@ViewChild('paginator') paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild('deleteModalRef') deleteModalRef;
	@Input() comingexamFlag: any = false;
	@Input() pastexamFlag: any = false;
	tableCollection = false;
	ELEMENT_DATA: ExamElement[] = [];
	scheduleExamArray: any[] = [];
	examJSon: any = {};
	displayedColumns = ['position', 'name', 'class' , 'subject', 'location', 'marks', 'duration', 'date', 'time', 'action'];
	dataSource = new MatTableDataSource<ExamElement>(this.ELEMENT_DATA);
	currentUser: any;
	constructor(private qelementService: QelementService,
		private notif: NotificationService,
		private userAccessMenuService: UserAccessMenuService,
		private breadCrumbService: BreadCrumbService) { }

	ngOnInit() {
	}
	ngAfterViewInit() {
		this.dataSource.sort = this.sort;
		this.dataSource.paginator = this.paginator;
	}
	applyFilter(filterValue: string) {
		this.dataSource.filter = filterValue.trim().toLowerCase(); // Remove whitespace
	}
	ngOnChanges() {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		if (this.comingexamFlag) {
			this.examJSon = {
			role_id: this.currentUser.role_id,
			es_status: '0'
			};
			this.getScheduleExam(this.examJSon);
		}
		if (this.pastexamFlag) {
			this.examJSon = {
			role_id: this.currentUser.role_id,
			es_status: '2'
			};
			this.getScheduleExam(this.examJSon);
		}
	}
	getScheduleExam(jsonOBJ: any) {
		this.scheduleExamArray = [];
		this.ELEMENT_DATA = [];
		this.dataSource = new MatTableDataSource<ExamElement>(this.ELEMENT_DATA);
			this.qelementService.getScheduledExam(jsonOBJ).subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						if (this.comingexamFlag) {
						const scheduleExamArrayTemp: any[] = result.data;
						const today = new Date();
						scheduleExamArrayTemp.forEach((element, index) => {
							const examscheduledate = new Date(element.es_start_date + ' 00:00:01');
							examscheduledate.setDate(examscheduledate.getDate() + 7);
							if (examscheduledate.getTime() >= today.getTime()) {
								this.scheduleExamArray.push(element);
							}
						});
					}
					if (this.pastexamFlag) {
						this.scheduleExamArray = result.data;
					}
						for (const sitem of this.scheduleExamArray) {
							if (sitem.es_exam_type === '2') {
								const onEndDay = sitem.es_end_date;
								const onEndTime = sitem.es_end_time;
								const onEndDate = new Date(onEndDay + ' ' + onEndTime).getTime();
								const now = new Date().getTime();
								const difference2 = onEndDate - now;
								if (difference2 < 0) {
									sitem.showEndTest = true;
								}
							}
						}
						let ind = 1;
						for (const t of this.scheduleExamArray) {
							const sliced = t.es_start_time.slice(0, -3);
							this.ELEMENT_DATA.push({
								position: ind,
								name: t.qp_name,
								class: t.class_name + '-' + t.sec_name,
								subject: t.sub_name,
								duration: t.tp_time_alloted,
								marks: t.tp_marks,
								location: t.lab_name,
								date: t.es_start_date,
								time: sliced,
								action: t });
							ind++;
						}
						this.dataSource = new MatTableDataSource<ExamElement>(this.ELEMENT_DATA);
						this.dataSource.paginator = this.paginator;
						this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
						this.dataSource.sort = this.sort;
					} else {
						this.notif.showSuccessErrorMessage('No records found', 'error');
					}

				}
			);
	}
	isExistUserAccessMenu(mod_id) {
		return this.userAccessMenuService.isExistUserAccessMenu(mod_id);
	}
	deleteScheduledExam(currentQues) {
		this.qelementService.deleteScheduledExam({ es_id: currentQues }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.getScheduleExam(this.examJSon);
					this.notif.showSuccessErrorMessage('Exam deleted successfully', 'success');
				} else {
					this.notif.showSuccessErrorMessage('Error deleting the exam', 'error');
				}
			}
		);
	}
	endTest(value) {
		if (confirm('Do you really wish to end the test') === true) {
			this.qelementService.teacherEndSession({ es_id: value.es_id, eva_status: value.es_qt_status}).subscribe(
				(result: any) => {
					if (result && result.status) {
						this.notif.showSuccessErrorMessage('Exam Ended successfully', 'success');
						this.getScheduleExam(this.examJSon);
					}
				}
			);
		}
	}
	startTest(es_id) {
		for (const item of this.scheduleExamArray) {
			if (item.es_id === es_id) {
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
						url1 = 'school/';
					} else if (this.currentUser.role_id === '3') {
						url1 = 'teacher/';
					}
					const url = url1 + 'eassessment/testscreeen/' + es_id;

					const param = 'width=' + screen.width + ',height=' + screen.height + ',toolbar=0,location=0,menubar=0,status=0,resizable=0';
					window.open(url, '_blank', param);
				}
				break;

			}
		}
	}
	openModal = (data) => this.deleteModalRef.openDeleteModal(data);
	deleteComCancel() {  }
}
