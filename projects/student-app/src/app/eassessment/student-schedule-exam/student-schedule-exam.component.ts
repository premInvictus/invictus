import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { QelementService } from 'projects/axiom/src/app/questionbank/service/qelement.service';
import { NotificationService, SocketService } from 'projects/axiom/src/app/_services/index';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { appConfig } from 'projects/axiom/src/app/app.config';
import { Event } from 'projects/axiom/src/app/_models/event';

@Component({
	selector: 'app-student-schedule-exam',
	templateUrl: './student-schedule-exam.component.html',
	styleUrls: ['./student-schedule-exam.component.css']
})
export class StudentScheduleExamComponent implements OnInit {

	Student_Schedule_Form: FormGroup;
	classArray: any[];
	subjectArray: any[];
	scheduleExamArray: any[] = [];
	examTypeArray: any = [
		{ exam_type_id: '1', exam_type_name: 'Class' },
		{ exam_type_id: '2', exam_type_name: 'Home' }
	];
	userDetail: any;
	public parameterError: any[] = [];
	ELEMENT_DATA: Element[] = [];
	tableCollection = false;
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	currentUser: any;
	displayedColumns = ['position', 'name', 'class', 'subject', 'duration', 'marks', 'location', 'date', 'time', 'action'];
	dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);


	constructor(
		private fbuild: FormBuilder,
		private notif: NotificationService,
		private qelementService: QelementService,
		private socketService: SocketService
	) { }

	ngOnInit() {
		this.formBuilder();
		this.getClass();
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.qelementService.getUser({ login_id: this.currentUser.login_id, role_id: this.currentUser.role_id }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.userDetail = result.data[0];
					this.getSubjectsByClass(this.userDetail.au_class_id);
				}
			}
		);
	}

	applyFilter(filterValue: string) {
		filterValue = filterValue.trim(); // Remove whitespace
		filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
		this.dataSource.filter = filterValue;
	}
	formBuilder() {
		this.Student_Schedule_Form = this.fbuild.group({
			es_class_id: '',
			es_sub_id: '',
			es_start_date: '',
			es_end_date: '',
			es_exam_type: ''
		});
	}

	getClass() {
		this.qelementService.getClass().subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.classArray = result.data;
				}
			},
			error => { }
		);
	}

	getSubjectsByClass(class_id): void {
		this.subjectArray = [];
		this.qelementService.getSubjectsByClass(class_id).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.subjectArray = result.data;
				}
			}
		);
	}

	getScheduleExam() {
		if (!this.Student_Schedule_Form.value.es_sub_id) {
			this.tableCollection = false;
			this.notif.showSuccessErrorMessage('Subject is required', 'error');
		}
		this.scheduleExamArray = [];
		this.ELEMENT_DATA = [];
		let es_status = '';
		if (this.Student_Schedule_Form.valid) {
			if (this.Student_Schedule_Form.value.es_exam_type !== '2') {
				es_status = '0';
				this.qelementService.getScheduledExam({
					es_class_id: this.userDetail.au_class_id, es_sec_id: this.userDetail.au_sec_id,
					es_sub_id: this.Student_Schedule_Form.value.es_sub_id, es_status: es_status
				}).subscribe(
					(result: any) => {
						if (result && result.status === 'ok') {
							const scheduleExamArrayTemp = result.data;
							const today = new Date();
							scheduleExamArrayTemp.forEach((element, index) => {
								const examscheduledate = new Date(element.es_start_date + ' 00:00:01');
								examscheduledate.setDate(examscheduledate.getDate() + 7);
								if (examscheduledate.getTime() >= today.getTime()) {
									this.scheduleExamArray.push(element);
								}
							});
							let ind = 1;
							const currentTime = new Date();
							// tslint:disable-next-line:max-line-length
							const timeString = ('0' + currentTime.getHours()).slice(-2) + ':' + ('0' + currentTime.getMinutes()).slice(-2) + ':' + ('0' + currentTime.getSeconds()).slice(-2);
							for (const t of this.scheduleExamArray) {
								const givenDate = t.es_start_date;
								const endTime = t.es_end_time;
								// tslint:disable-next-line:no-shadowed-variable
								const today = new Date().toJSON().split('T')[0];

								if (givenDate > today || givenDate === today) {
									this.ELEMENT_DATA.push(
										{
											position: ind, name: t.qp_name, class: t.class_name, subject: t.sub_name, duration: t.tp_time_alloted,
											marks: t.tp_marks, location: t.lab_name, date: t.es_start_date, time: t.es_start_time, action: t
										});
									ind++;



								}
							}
							console.log('this.ELEMENT_DATA', this.ELEMENT_DATA);
							this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
							this.dataSource.paginator = this.paginator;
						} else {
							this.tableCollection = false;
							this.notif.showSuccessErrorMessage('No records found', 'info');
						}
					});
				this.tableCollection = true;
			} else if (this.Student_Schedule_Form.value.es_exam_type === '2') {
				es_status = '1';
				this.qelementService.getScheduledExam({
					es_class_id: this.userDetail.au_class_id, es_sec_id: this.userDetail.au_sec_id,
					es_sub_id: this.Student_Schedule_Form.value.es_sub_id, es_status: es_status,
					es_exam_type: this.Student_Schedule_Form.value.es_exam_type
				}).subscribe(
					(result: any) => {
						if (result && result.status === 'ok') {
							this.scheduleExamArray = result.data;
							let ind = 1;
							const currentTime = new Date();

							// tslint:disable-next-line:max-line-length
							const timeString = ('0' + currentTime.getHours()).slice(-2) + ':' + ('0' + currentTime.getMinutes()).slice(-2) + ':' + ('0' + currentTime.getSeconds()).slice(-2);

							for (const t of this.scheduleExamArray) {

								const givenDate = t.es_end_date;

								const endTime = t.es_end_time;



								const today = new Date().toJSON().split('T')[0];

								if (givenDate >= today) {
									this.ELEMENT_DATA.push({
										position: ind, name: t.qp_name, class: t.class_name, subject: t.sub_name,
										duration: t.tp_time_alloted, marks: t.tp_marks, location: t.lab_name, date: t.es_start_date,
										time: t.es_start_time, action: t
									});
									ind++;



								}
							}
							this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
							this.dataSource.paginator = this.paginator;
						} else {
							this.tableCollection = false;
							this.notif.showSuccessErrorMessage('No records found', 'info');
						}
					}
				);
				this.tableCollection = true;
			}
		}
	}

	startTest(examDetail) {

		this.socketService.initSocket();

		this.socketService.onEvent(Event.CONNECT)
			.subscribe(() => {
				if (this.currentUser) {
					console.log('examDetail', examDetail);
					const userDetail = {
						examId: examDetail.es_id,
						userId: this.currentUser.login_id,
						paperId: examDetail.es_qp_id,
						schoolId: this.currentUser.Prefix,
						userType: this.currentUser.role_id
					};
					this.socketService.sendUserInformation(userDetail);
					userDetail['action'] = appConfig.testInitiateCode;
					this.socketService.sendUserTestActionDetail(userDetail);
				}
			}
			);
		this.socketService.onEvent(Event.DISCONNECT)
			.subscribe(() => {
				console.log('Disconnected');
			});

		let url = '';
		if (examDetail.es_template_type === '1') {
			url = '/student/test/instruction-screen/' + examDetail.es_id;
		} else if (examDetail.es_template_type === '2') {
			url = '/student/test/jee-mains-instruction/' + examDetail.es_id;
		} else if (examDetail.es_template_type === '3') {
			url = '/student/test/jee-advanced-instruction/' + examDetail.es_id;
		}
		const param = 'width=' + screen.width + ',height=' + screen.height + ',toolbar=0,location=0,menubar=0,status=0,resizable=0';
		window.open(url, '_blank', param);
	}
}

export interface Element {
	position: number;
	name: string;
	class: string;
	subject: string;
	duration: string;
	marks: number;
	location: string;
	date: string;
	time: string;
	action: any;
}
