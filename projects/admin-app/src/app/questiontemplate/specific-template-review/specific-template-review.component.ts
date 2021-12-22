import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { QelementService } from '../../questionbank/service/qelement.service';
import { UserAccessMenuService, NotificationService, BreadCrumbService } from '../../_services/index';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { Element } from './specific-template-review.model';
import { MatDialog, MatDialogRef } from '@angular/material';
import { TemplateDialogComponent } from '../template-dialog/template-dialog.component';


@Component({
	selector: 'app-specific-template-review',
	templateUrl: './specific-template-review.component.html',
	styleUrls: ['./specific-template-review.component.css']
})
export class SpecificTemplateReviewComponent implements OnInit, AfterViewInit {
	filterform: FormGroup;
	currentQues: any[];
	classArray: any[];
	subjectArray: any[];
	templateArray: any[] = [];
	printTemplate: any = {};
	tableCollection = false;
	homeUrl: string;
	ELEMENT_DATA: Element[] = [];
	dialogRef: MatDialogRef<TemplateDialogComponent>;


	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild('deleteModalRef') deleteModalRef;

	displayedColumns = ['position', 'name', 'class', 'subject', 'topic', 'mark', 'time', 'reasons', 'action'];
	dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);

	constructor(
		private fbuild: FormBuilder,
		private qelementService: QelementService,
		private userAccessMenuService: UserAccessMenuService,
		private notif: NotificationService,
		private breadCrumbService: BreadCrumbService,
		private dialog: MatDialog

	) { }

	ngOnInit() {
		this.homeUrl = this.breadCrumbService.getUrl();
		this.buildForm();
		this.getClass();
	}

	ngAfterViewInit() {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
	}

	applyFilter(filterValue: string) {
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}
	isExistUserAccessMenu(mod_id) {
		return this.userAccessMenuService.isExistUserAccessMenu(mod_id);
	}

	buildForm() {
		this.filterform = this.fbuild.group({
			tp_class_id: '',
			tp_sub_id: '',
		});
	}
	/*Fetching the list of class*/
	getClass() {
		this.qelementService.getClass().subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.classArray = result.data;
				}
			}
		);
	}
	/*Fetching the list of Subjects based on class*/
	getSubjectsByClass(): void {
		this.qelementService.getSubjectsByClass(this.filterform.value.tp_class_id).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {

					this.subjectArray = result.data;
				} else {

					this.subjectArray = [];
				}
				this.filterform.controls.tp_sub_id.setValue('');
			}
		);
	}
	/*Fetching the list of specific template questions*/
	getSpecificList() {
		// Form validations
		if (!this.filterform.value.tp_class_id) {
			this.tableCollection = false;
			this.notif.showSuccessErrorMessage('Class is required', 'error');
		}
		if (!this.filterform.value.tp_sub_id) {
			this.tableCollection = false;
			this.notif.showSuccessErrorMessage('Subject is required', 'error');
		}
		this.templateArray = [];
		this.ELEMENT_DATA = [];
		const tt_id = '1';
		const tp_status = '0';
		if (this.filterform.valid) {
			this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
			// tslint:disable-next-line:max-line-length
			this.qelementService.getTemplate({ tt_id: tt_id, tp_status: tp_status, class_id: this.filterform.value.tp_class_id, sub_id: this.filterform.value.tp_sub_id }).subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {

						this.templateArray = result.data;
						let ind = 1;
						let curTopic_name = '';
						let etopicArray = [];
						for (const t of this.templateArray) {
							etopicArray = [];

							for (const item of t.filters) {
								if (curTopic_name !== item.topic_name) {
									curTopic_name = item.topic_name;
									etopicArray.push({ topic_name: curTopic_name });
								}
							}
							let topic_name_list = '';
							for (const titem of etopicArray) {
								if (etopicArray.length > 1) {
									topic_name_list += ' ' + '<li>' + titem.topic_name + '</li>';
								} else {
									topic_name_list += ' ' + titem.topic_name;
								}
							}
							let reasons = '';
							if (t.tp_unpublish_reason_desc) {
								reasons = reasons + '<span class="text-danger">Reason</span>:&nbsp;&nbsp<span>' + t.tp_unpublish_reason_desc + '</span><br>'
									+ '<span>Remark:&nbsp;&nbsp' + t.qus_unpublish_remark + '</span><br>'
									+ '<span>Unpublisher:&nbsp;&nbsp' + t.tp_unpublish_by_user_name + '</span>';
							} else {
								reasons = 'Not Applicable';
							}
							this.ELEMENT_DATA.push({
								position: ind,
								name: t.tp_name,
								class: t.class_name,
								section: t.sec_name,
								subject: t.sub_name,
								topic: topic_name_list,
								mark: t.tp_marks,
								time: t.tp_time_alloted,
								reasons: reasons,
								action: t
							});
							ind++;
							curTopic_name = '';
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
			this.tableCollection = true;
		}
	}

	publishTemplate(tp_id) {

		const tp_unpublish_remark = '';
		this.qelementService.publishUnpublishTemplate(tp_id, 1, tp_unpublish_remark, '', '').subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.notif.showSuccessErrorMessage('Question published successfully', 'success');
					this.getSpecificList();
				}
			}
		);
	}

	unpublishTemplate(tp_id, tp_status, tp_unpublish_remark) {
		this.qelementService.publishUnpublishTemplate(tp_id, 0, tp_unpublish_remark, '', '').subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.getSpecificList();
				}
			}
		);
	}

	updateTemplate(value) {
		this.qelementService.updateTemplate(value).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.notif.showSuccessErrorMessage('Question updated successfully', 'success');
					this.getSpecificList();
				}

			}
		);
	}

	deleteTemp(value) {
		for (const item of this.templateArray) {
			if (value === item.tp_id) {
				this.currentQues = item.tp_id;
			}
		}
	}

	deleteTemplate(currentQues) {
		this.qelementService.deleteTemplate(currentQues).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.getSpecificList();
					this.notif.showSuccessErrorMessage('Question deleted successfully', 'success');
				} else {
					this.notif.showSuccessErrorMessage('Deletion failed', 'error');
				}
			}
		);
	}

	getNameById(arr, id, idvalue, name) {
		for (const item of arr) {
			if (item[id] === idvalue) {
				return item[name];
			}
		}
	}
	printStudentCopy() {
		const printModal2 = document.getElementById('printModal2');
		const popupWin = window.open('', '_blank', 'width=900,height=500');
		popupWin.document.open();
		// tslint:disable-next-line:max-line-length
		popupWin.document.write('<html><style>button { display:none; } </style><body onload="window.print()">' + printModal2.innerHTML + '</html>');
		popupWin.document.close();
	}

	viewTemplate(item) {
		// this.printTemplate = item;
		this.dialogRef = this.dialog.open(TemplateDialogComponent, {
			width: '850px',
			data: {
				item: item,
				tp_class_id: '',
				tp_sub_id: ''

			}
		});
	}

	getTotal(i1, i2) {
		return Number(i1) * Number(i2);
	}
	openModal = (data) => this.deleteModalRef.openDeleteModal(data);
	deleteComCancel() { }
}
