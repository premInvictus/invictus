import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { QelementService } from '../../questionbank/service/qelement.service';
import { NotificationService } from '../../_services/index';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { Element } from './teacher-test-reportElement.model';

@Component({
	selector: 'app-teacher-test-report',
	templateUrl: './teacher-test-report.component.html',
	styleUrls: ['./teacher-test-report.component.css']
})
export class TeacherTestReportComponent implements OnInit {
	@ViewChild('deleteModalRef') deleteModalRef;
	teacherreportfilter: FormGroup;
	classArray: any[];
	subjectArray: any[];
	sectionsArray: any[];
	scheduleExamArray: any[];
	presentStudentArray: any[] = [];
	currentUser: any = {};
	userDetail: any;
	teacherFormDiv = false;
	tableCollection = false;
	ELEMENT_DATA: Element[] = [];
	examTypeArray: any = [
		{ exam_type_id: '1', exam_type_name: 'Class' },
		{ exam_type_id: '2', exam_type_name: 'Home' }
	];
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	displayedColumns = [
		'position',
		'name',
		'class',
		'subject',
		'date',
		'time',
		'duration',
		'marks',
		'appeared',
		'action'
	];
	dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
	deleted_es_id: any;

	constructor(
		private fbuild: FormBuilder,
		private qelementService: QelementService,
		private notif: NotificationService
	) {}

	ngOnInit() {
		this.buildForm();
		this.getClass();
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.qelementService
			.getUser({ login_id: this.currentUser.login_id, role_id: this.currentUser.role_id })
			.subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.userDetail = result.data[0];
					this.teacherFormDiv = true;
				}
			});
	}

	applyFilter(filterValue: string) {
		filterValue = filterValue.trim().toLowerCase();
		this.dataSource.filter = filterValue;
	}

	buildForm() {
		this.teacherreportfilter = this.fbuild.group({
			es_class_id: '',
			es_sub_id: '',
			es_sec_id: '',
			es_exam_type: ''
		});
	}

	getClass() {
		this.qelementService.getClass().subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.classArray = result.data;
			}
		});
	}
	getSectionsByClass() {
		this.sectionsArray = [];
		this.qelementService
			.getSectionsByClass(this.teacherreportfilter.value.es_class_id)
			.subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.sectionsArray = result.data;
				} else {
				}
				this.teacherreportfilter.patchValue({
					es_sec_id: '',
					es_sub_id: ''
				});
			});
	}

	getScheduleExam() {
		if (!this.teacherreportfilter.value.es_class_id) {
			this.notif.showSuccessErrorMessage('Class is required', 'error');
		}
		if (!this.teacherreportfilter.value.es_sec_id) {
			this.notif.showSuccessErrorMessage('Section is required', 'error');
		}
		if (!this.teacherreportfilter.value.es_sub_id) {
			this.notif.showSuccessErrorMessage('Subject is required', 'error');
		}
		this.scheduleExamArray = [];
		this.ELEMENT_DATA = [];
		if (this.teacherreportfilter.valid) {
			let param: any = {};
			param = this.teacherreportfilter.value;
			param.es_status = 2;
			this.qelementService.getScheduledExam(param).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.scheduleExamArray = result.data;
					let ind = 1;
					for (const sexam of this.scheduleExamArray) {
						this.qelementService
							.getExamAttendance({ es_id: sexam.es_id })
							.subscribe(
								// tslint:disable-next-line:no-shadowed-variable
								(result2: any) => {
									if (result2 && result2.status === 'ok') {
										this.presentStudentArray = result2.data;
										sexam.studentappeared =
											this.presentStudentArray.length + '';
										this.scheduleExamArray.push(sexam);
										const str = sexam.es_start_time;
										const time = str.slice(0, -3);
										// tslint:disable-next-line:max-line-length
										this.ELEMENT_DATA.push({
											position: ind,
											name: sexam.qp_name,
											class: sexam.class_name,
											section: sexam.sec_name,
											subject: sexam.sub_name,
											date: sexam.es_start_date,
											time: time,
											duration: sexam.tp_time_alloted,
											marks: sexam.tp_marks,
											appeared: sexam.studentappeared,
											action: sexam
										});
										ind++;
										this.dataSource = new MatTableDataSource<Element>(
											this.ELEMENT_DATA
										);
										this.dataSource.paginator = this.paginator;
										this.sort.sortChange.subscribe(
											() => (this.paginator.pageIndex = 0)
										);
										this.dataSource.sort = this.sort;
									}
								}
							);
					}
				} else {
					this.tableCollection = false;
					this.notif.showSuccessErrorMessage('No Record Found', 'error');
				}
			});
			this.tableCollection = true;
		}
	}

	getSubjectsByClass(): void {
		this.subjectArray = [];
		this.qelementService
			.getSubjectsByClass(this.teacherreportfilter.value.es_class_id)
			.subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.subjectArray = result.data;
				}
				this.teacherreportfilter.patchValue({
					es_sub_id: ''
				});
			});
	}
	reEvaluateTest(es_id) {
		this.qelementService
			.teacherEndSession({ es_id: es_id })
			.subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.notif.showSuccessErrorMessage(
						'Test Re-Evaluated Successfully',
						'success'
					);
					this.getScheduleExam();
				}
			});
	}
	openModal = (data) => this.deleteModalRef.openDeleteModal(data);
	deleteComCancel() {}
	setDeleteExam(es_id) {
		this.deleted_es_id = es_id;
	}
	deleteExam(es_id) {
		if (es_id) {
		this.qelementService.deleteScheduledExam({es_id: es_id}).subscribe(
			(result: any) => {
				if (result) {
					this.notif.showSuccessErrorMessage('Deleted Successfully', 'success');
					this.getScheduleExam();
				}
			}
		);
		}
	}
}
