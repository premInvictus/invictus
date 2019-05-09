import { Component, OnInit, ViewChild } from '@angular/core';
import { QelementService } from 'projects/axiom/src/app/questionbank/service/qelement.service';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from 'projects/axiom/src/app/_services/index';
import { Element } from './testReportElement.model';

@Component({
	selector: 'app-test-report',
	templateUrl: './test-report.component.html',
	styleUrls: ['./test-report.component.css']
})
export class TestReportComponent implements OnInit {


	classArray: any[];
	scheduleExamArray: any[] = [];
	userDetail: any;
	login_id: string;
	ELEMENT_DATA: Element[] = [];
	es_exam_type = 1;
	examTypeArray: any = [
		{ exam_type_id: '1', exam_type_name: 'Class'},
		{ exam_type_id: '2', exam_type_name: 'Home'}
	];
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	displayedColumns = ['position', 'name', 'class', 'subject', 'duration', 'marks', 'location', 'date', 'time', 'action'];
	dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);

	constructor(
		private qelementService: QelementService,
		private router: Router,
		private route: ActivatedRoute,
		private notif: NotificationService
	) { }

	ngOnInit() {
		this.getClass();
		const currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.login_id = currentUser.login_id;
		this.qelementService.getUser({ login_id: currentUser.login_id, role_id: '4' }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.userDetail = result.data[0];
					this.getScheduleExam();
				}
			}
		);

	}

	applyFilter(filterValue: string) {
		filterValue = filterValue.trim().toLowerCase(); this.dataSource.filter = filterValue;
	}
	setexamtype(value) {
		this.es_exam_type = value;
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
	checkExamPublish(es_id) {
		this.qelementService.getExamAttendance({ login_id: this.login_id, es_id: es_id }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					const evaDetails: any = result.data[0];
					if (evaDetails.eva_status === '2') {
						this.router.navigate(['/student/report/report-analysis', es_id]);
					} else {
						this.notif.showSuccessErrorMessage('Test is being evaluated,result would be published soon...', 'success');
					}
				}  else {
					this.notif.showSuccessErrorMessage('You have not appeared in this exam', 'error');
				}
			}
		);
	}

	getScheduleExam() {
		this.scheduleExamArray = [];
		this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
		this.ELEMENT_DATA = [];
		// tslint:disable-next-line:max-line-length
		this.qelementService.getScheduledExam({ es_class_id: this.userDetail.au_class_id, es_sec_id: this.userDetail.au_sec_id, es_status: 2, es_exam_type: this.es_exam_type }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.paginator.pageIndex = 0;
					this.scheduleExamArray = result.data;
					let ind = 1;
					for (const t of this.scheduleExamArray) {
						// tslint:disable-next-line:max-line-length
						this.ELEMENT_DATA.push({ position: ind, name: t.qp_name, class: t.class_name, subject: t.sub_name, duration: t.tp_time_alloted, marks: t.tp_marks, location: t.lab_name, date: t.es_start_date, time: t.es_start_time, action: t });
						ind++;
					}
					this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
					this.dataSource.paginator = this.paginator;
				} else {
					this.paginator.pageIndex = 0;
					this.paginator.length = 0;
					this.ELEMENT_DATA = [];
					this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
					this.notif.showSuccessErrorMessage('No Record Found', 'error');
				}
			}
		);
	}
}

