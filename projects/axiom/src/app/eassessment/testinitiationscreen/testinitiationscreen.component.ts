import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QelementService } from '../../questionbank/service/qelement.service';
import { NotificationService, SocketService, SmartService, CommonAPIService } from '../../_services/index';
import { MatPaginator, MatTableDataSource, MatSort, MatInput } from '@angular/material';

@Component({
	selector: 'app-testinitiationscreen',
	templateUrl: './testinitiationscreen.component.html',
	styleUrls: ['./testinitiationscreen.component.css']
})
export class TestinitiationscreenComponent implements OnInit, AfterViewInit {
	presentSIDArray: any[] = [];
	scheduleExam: any;
	studentArray: any[] = [];
	presentSArray: any[] = [];
	examAttandanceList: any[] = [];
	es_id: number;
	testInitiationScreenDiv = true;
	ELEMENT_DATA: TestElement[] = [];
	tableCollection = false;
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	// jquery dependancy exist so currently commented
	// bodyClasses = 'page-initiation';

	constructor(
		private route: ActivatedRoute,
		private qelementService: QelementService,
		private notif: NotificationService,
		private socketService: SocketService,
		private router: Router,
		private smartService: SmartService,
		private common: CommonAPIService
	) { }

	displayedColumns = [
		'position',
		'admission',
		'student',
		'class',
		'section',
		'lab',
		'attendance'
	];
	dataSource = new MatTableDataSource<TestElement>(this.ELEMENT_DATA);
	ngOnInit() {
		this.es_id = this.route.snapshot.params['id'];
		// this.getExamAttendance();
		this.qelementService
			.getScheduledExam({ es_id: this.es_id })
			.subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.scheduleExam = result.data[0];
					console.log('scheduleExam', this.scheduleExam);
					if (this.scheduleExam.es_status === '1') {
						this.testInitiationScreenDiv = false;
						this.router.navigate(['../../teinvilagation', this.es_id], { relativeTo: this.route });
					}
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
	submitAttendance() {
		this.presentSArray = [];
		for (const stu of this.studentArray) {
			const presentS: any = {};

			for (const psid of this.presentSIDArray) {
				if (stu.au_login_id === psid) {
					presentS.eva_es_id = this.route.snapshot.params['id'];
					presentS.eva_login_id = psid;
					presentS.eva_ip_address = stu.au_last_login_ip;
					this.presentSArray.push(presentS);
				}
			}
		}
		if (this.presentSArray.length >= 1) {
			this.qelementService
				.addExamAttendance(this.presentSArray)
				.subscribe((result: any) => {
					if (result && result.status === 'ok' && Number(this.scheduleExam.es_grace_time_extend) !== 1) {
						this.qelementService
							.publishUnpublishScheduledExam({
								es_id: this.es_id,
								es_status: '1'
							})
							.subscribe((result1: any) => {
								if (result1 && result1.status === 'ok') {
									this.router.navigate(['../../teinvilagation', this.es_id], { relativeTo: this.route });
								}
							});
						this.notif.showSuccessErrorMessage(
							'Attendence marked successfully',
							'success'
						);
					} else if (
						result &&
						Number(this.scheduleExam.es_grace_time_extend) === 1
					) {
						this.router.navigate(['../../teinvilagation', this.es_id], { relativeTo: this.route });
						this.notif.showSuccessErrorMessage(
							'Attendence marked successfully',
							'success'
						);
					}
				});
		} else {
			this.notif.showSuccessErrorMessage('Please mark the attendence', 'error');
		}
	}

	async getStudents() {
		const param: any = {
			class_id: this.scheduleExam.es_class_id,
			sec_id: this.scheduleExam.es_sec_id,
			enrollment_type: '4',
			status: '1'
		}
		const smartparam: any = {};
		smartparam.tgam_config_type = '1';
		smartparam.tgam_axiom_config_id = param.class_id;
		smartparam.tgam_global_sec_id = param.sec_id;
		await this.smartService.getSmartToAxiom(smartparam).toPromise().then((result: any) => {
			if(result && result.status === 'ok') {
				param.class_id = result.data[0].tgam_global_config_id;
			}
		});
		await this.common
			.getMasterStudentDetail(param)
			.toPromise().then((result: any) => {
				if (result && result.status === 'ok') {
					this.studentArray = result.data;
					let position = 1;

					for (const stu of this.studentArray) {
						this.ELEMENT_DATA.push({
							position: position,
							admission: stu.au_login_id,
							loginid: stu.em_admission_no,
							student: stu.au_full_name,
							class: this.scheduleExam.class_name,
							section: this.scheduleExam.sec_name,
							lab: this.scheduleExam.lab_name,
							attendance: stu
						});
						this.dataSource = new MatTableDataSource<TestElement>(
							this.ELEMENT_DATA
						);
						position++;
					}
				}
			});
	}

	startTest() {
		if (this.presentSIDArray.length >= 1) {
			this.submitAttendance();
		} else {
			this.notif.showSuccessErrorMessage('Please mark the attendence', 'error');
		}
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
}
export interface TestElement {
	position: number;
	admission: any;
	loginid: any;
	student: string;
	class: string;
	section: string;
	lab: string;
	attendance: any;

}
