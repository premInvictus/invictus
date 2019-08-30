import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { QelementService } from '../../questionbank/service/qelement.service';
import { BreadCrumbService, NotificationService, UserAccessMenuService } from '../../_services/index';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { Element } from './tableElement.model';

@Component({
	selector: 'app-concludedeassessment',
	templateUrl: './concludedeassessment.component.html',
	styleUrls: ['./concludedeassessment.component.css']
})
export class ConcludedeassessmentComponent implements OnInit {

	Conclude_Form: FormGroup;
	subjectArray: any[];
	classArray: any[];
	scheduleExamArrayResult: any[] = [];
	scheduleExamArray: any[] = [];
	public parameterError: any[] = [];
	presentStudentArray: any[] = [];
	testArray: any[];
	es_id: number;
	homeUrl: string;
	ELEMENT_DATA: Element[] = [];
	tableCollection = false;
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	// tslint:disable-next-line:max-line-length
	displayedColumns = ['position', 'name', 'class', 'subject', 'Test Date', 'Time', 'Duration', 'Maximum marks', 'Student Appeared', 'action'];
	dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);

	constructor(private fbuild: FormBuilder,
		private userAccessMenuService: UserAccessMenuService,
		private qelementService: QelementService,
		private notif: NotificationService,
		private breadCrumbService: BreadCrumbService
	) { }

	ngOnInit() {
		this.homeUrl = this.breadCrumbService.getUrl();
		this.buildForm();
		this.getClass();
	}

	applyFilter(filterValue: string) {
		filterValue = filterValue.trim().toLowerCase(); this.dataSource.filter = filterValue;
	}

	isExistUserAccessMenu(mod_id) {
		return this.userAccessMenuService.isExistUserAccessMenu(mod_id);
	}

	buildForm() {
		this.Conclude_Form = this.fbuild.group({
			es_class_id: '',
			es_sub_id: '',
			es_start_date: '',
			es_end_date: ''
		});
	}

	getScheduleExam() {
		this.scheduleExamArrayResult = [];
		this.ELEMENT_DATA = [];
		if (!this.Conclude_Form.value.es_class_id) {
			this.tableCollection = false;
			this.notif.showSuccessErrorMessage('Class is required', 'error');
		}
		if (!this.Conclude_Form.value.es_sub_id) {
			this.tableCollection = false;
			this.notif.showSuccessErrorMessage('Subject is required', 'error');
		}
		if (this.Conclude_Form.valid) {
			let param: any = {};
			param = this.Conclude_Form.value;
			param.es_status = 2;
			param.es_qt_status = 1;
			this.qelementService.getScheduledExam(param).subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.scheduleExamArrayResult = result.data;
						let ind = 1;
						for (const sexam of this.scheduleExamArrayResult) {
							this.qelementService.getExamAttendance({ es_id: sexam.es_id }).subscribe(
								// tslint:disable-next-line:no-shadowed-variable
								(result: any) => {
									if (result && result.status === 'ok') {
										this.presentStudentArray = result.data;
										sexam.presentStudent = this.presentStudentArray.length;
										this.scheduleExamArray.push(sexam);
										const str = sexam.es_start_time;
										const time = str.slice(0, -3);
										// tslint:disable-next-line:max-line-length
										this.ELEMENT_DATA.push({ position: ind, name: sexam.qp_name, class: sexam.class_name, section: sexam.sec_name, subject: sexam.sub_name, detail_date: sexam.es_start_date, detail_time: time, detail_alloted: sexam.tp_time_alloted, info_marks: sexam.tp_marks, info_app: sexam.presentStudent, action: sexam });
										ind++;
										this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
										this.dataSource.paginator = this.paginator;
										this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
										this.dataSource.sort = this.sort;
									} else {
										this.notif.showSuccessErrorMessage('No reords found', 'error');
									}
								}
							);
						}
					} else {
						this.tableCollection = false;
						this.notif.showSuccessErrorMessage('No reords found', 'error');
					}
				}
			);
			this.tableCollection = true;
		}
	}

	publishTest(eva_es_id) {
		this.qelementService.getExamAttendance({ es_id: eva_es_id }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok' ) {
					let publishStatus = true;
					this.testArray = result.data;
					for (const item of this.testArray) {
						if (item.eva_status !== '2') {
							publishStatus = false;
							break;
						}
					}
					if (publishStatus) {
						this.qelementService.publishUnpublishScheduledExam({ es_id: eva_es_id, es_status: '2' }).subscribe(
							// tslint:disable-next-line:no-shadowed-variable
							(result: any) => {
								if (result && result.status === 'ok') {
									this.notif.showSuccessErrorMessage('Published successfully', 'success');
								}
							}
						);
					} else {
						this.notif.showSuccessErrorMessage('Please check if all the students have been assigned marks', 'error');
					}
				}
			}
		);
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
		this.qelementService.getSubjectsByClass(this.Conclude_Form.value.es_class_id).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.subjectArray = result.data;
					this.Conclude_Form.controls.es_sub_id.setValue('');
				} else {
					this.subjectArray = [];
					this.Conclude_Form.controls.es_sub_id.setValue('');
				}
			}
		);
	}
}



