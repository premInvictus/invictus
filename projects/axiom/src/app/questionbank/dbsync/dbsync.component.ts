import { Component, OnInit, TemplateRef, ViewChild, AfterViewInit } from '@angular/core';
import { BreadCrumbService, NotificationService } from '../../_services/index';
import { FormBuilder, FormGroup } from '@angular/forms';
import { QelementService } from '../service/qelement.service';
import { DBSyncElement } from './dbsync.model';
import {
	MatTableDataSource,
	MatPaginator,
	MatSort,
	Sort
} from '@angular/material';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
@Component({
	selector: 'app-dbsync',
	templateUrl: './dbsync.component.html',
	styleUrls: ['./dbsync.component.css']
})
export class DbsyncComponent implements OnInit, AfterViewInit {
	modalRef: BsModalRef;
	homeUrl: any;
	classArray: any[];
	subjectArray: any[];
	parameterform: FormGroup;
	schoolFlag = false;
	schoolArray: any[] = [];
	dbsyncdisplayedcolumns: any[] = ['position', 'question', 'action'];
	DBSYNC_ELEMENT_DATA: DBSyncElement[] = [];
	questionsArray: any[] = [];
	topicArray: any[] = [];
	topicSubtopicArray: any[] = [];
	finalStArrayQstType: any = [];
	synchedSchoolArray: any[] = [];
	revokeId: any;
	lengthArray: any;
	getSyncId: any;
	@ViewChild('template') template: TemplateRef<any>;
	@ViewChild('paginator') paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	checkDbsyncStatus = false;
	loaderText: any;
	dbsyncdatasource = new MatTableDataSource<DBSyncElement>(
		this.DBSYNC_ELEMENT_DATA
	);
	constructor(
		private breadCrumbService: BreadCrumbService,
		private fbuild: FormBuilder,
		private qlementService: QelementService,
		private notif: NotificationService,
		private modalService: BsModalService
	) {}

	ngOnInit() {
		this.homeUrl = this.breadCrumbService.getUrl();
		this.buildForm();
		this.getClass();
		this.getSchools();
	}
	ngAfterViewInit() {
		this.dbsyncdatasource.paginator = this.paginator;
		this.dbsyncdatasource.sort = this.sort;
	}

	buildForm() {
		this.parameterform = this.fbuild.group({
			school_id: '',
			sub_id: '',
			class_id: ''
		});
	}
	getClass() {
		this.qlementService.getClass().subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.classArray = result.data;
			}
		});
	}
	getSubjectByClass() {
		this.qlementService
			.getSubjectsByClass(this.parameterform.value.class_id)
			.subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.subjectArray = result.data;
				}
			});
	}
	getQuestionClassSubjectWise() {
		this.questionsArray = [];
		this.topicArray = [];
		this.topicSubtopicArray = [];
		this.finalStArrayQstType = [];
		this.synchedSchoolArray = [];
		this.DBSYNC_ELEMENT_DATA = [];
		this.dbsyncdatasource = new MatTableDataSource<DBSyncElement>(
			this.DBSYNC_ELEMENT_DATA
		);
		if (!this.parameterform.value.school_id) {
			this.notif.showSuccessErrorMessage('Please select a school', 'error');
		}
		if (!this.parameterform.value.class_id) {
			this.notif.showSuccessErrorMessage('Please select a class', 'error');
		}
		if (!this.parameterform.value.sub_id) {
			this.notif.showSuccessErrorMessage('Please select a subject', 'error');
		} else {
			this.checkDbsyncStatus = true;
			this.loaderText = 'Fetching Questions.Please Wait.....';
			this.qlementService
				.getQuestionsInTemplate({
					class_id: this.parameterform.value.class_id,
					sub_id: this.parameterform.value.sub_id,
					status: '1'
				})
				.subscribe((result: any) => {
					if (result && result.status === 'ok') {
						this.schoolFlag = true;
						this.checkDbsyncStatus = false;
						this.checkDbsyncStatus = true;
						this.loaderText = 'Checking Already Synched Status';
						this.questionsArray = result.data;
						for (const item of this.questionsArray) {
							const findex = this.topicArray.findIndex(
								f => Number(f.topic_id) === Number(item.qus_topic_id)
							);
							if (findex === -1) {
								this.topicArray.push({
									topic_id: item.qus_topic_id,
									topic_name: item.topic_name
								});
							}
						}
						for (const item of this.topicArray) {
							const stTempArray: any[] = [];
							const qstArray: any[] = [];
							for (const all of this.questionsArray) {
								if (Number(item.topic_id) === Number(all.qus_topic_id)) {
									const findex = stTempArray.findIndex(
										f =>
											Number(f.st_id) === Number(all.qus_st_id) &&
											f.st_name === all.st_name
									);
									if (findex === -1) {
										stTempArray.push({
											st_id: all.qus_st_id,
											st_name: all.st_name
										});
									}
									qstArray.push({
										st_id: all.qus_st_id,
										qst_id: all.qus_qst_id,
										qus_id: all.qus_id
									});
								}
							}
							this.topicSubtopicArray.push({
								topic_id: item.topic_id,
								topic_name: item.topic_name,
								stArray: stTempArray,
								qstArray: qstArray
							});
						}
						let ind = 1;
						for (const item of this.topicSubtopicArray) {
							let stName = '';
							for (const st of item.stArray) {
								stName = stName + st.st_name + '<br><br>';
							}
							this.finalStArrayQstType = [];
							for (const st of item.stArray) {
								const stArray: any[] = [];
								for (const qst of item.qstArray) {
									if (Number(st.st_id) === Number(qst.st_id)) {
										stArray.push({
											st_id: st.st_id,
											st_name: st.st_name,
											qst_id: qst.qst_id
										});
									}
								}
								this.finalStArrayQstType.push({
									st_name: st.st_name,
									fStQStArray: stArray
								});
							}
							let tableQstBased: any = '';
							for (const item2 of this.finalStArrayQstType) {
								tableQstBased =
									tableQstBased +
									'<tr class=\'table-dialog-review-row\'>' +
									'<td class=\'text-center dbsync-subtopic dbsync-padding\'>' +
									item2.st_name +
									'</td>' +
									'<td class=\'text-center dbsync-padding dbsync-width\'>' +
									this.getCountofQstType(1, item2.fStQStArray) +
									'</td>' +
									'<td class=\'text-center dbsync-padding dbsync-width\'>' +
									this.getCountofQstType(2, item2.fStQStArray) +
									'</td>' +
									'<td class=\'text-center dbsync-padding dbsync-width\'>' +
									this.getCountofQstType(3, item2.fStQStArray) +
									'</td>' +
									'<td class=\'text-center dbsync-padding dbsync-width\'>' +
									this.getCountofQstType(4, item2.fStQStArray) +
									'</td>' +
									'<td class=\'text-center dbsync-padding dbsync-width\'>' +
									this.getCountofQstType(5, item2.fStQStArray) +
									'</td>' +
									'<td class=\'text-center dbsync-padding dbsync-width\'>' +
									this.getCountofQstType(13, item2.fStQStArray) +
									'</td>' +
									'<td class=\'text-center dbsync-padding dbsync-width\'>' +
									this.getCountofQstType(14, item2.fStQStArray) +
									'</td>' +
									'<td class=\'text-center dbsync-padding dbsync-width\'>' +
									this.getCountofQstType(15, item2.fStQStArray) +
									'</td>' +
									'<td class=\'text-center dbsync-padding dbsync-width\'>' +
									this.getCountofQstType(6, item2.fStQStArray) +
									'</td>' +
									'<td class=\'text-center dbsync-padding dbsync-width\'>' +
									this.getCountofQstType(7, item2.fStQStArray) +
									'</td>' +
									'<td class=\'text-center dbsync-padding dbsync-width\'>' +
									this.getCountofQstType(8, item2.fStQStArray) +
									'</td>' +
									'<td class=\'text-center dbsync-padding dbsync-width\'>' +
									this.getCountofQstType(9, item2.fStQStArray) +
									'</td>' +
									'<td class=\'text-center dbsync-padding dbsync-width\'>' +
									this.getCountofQstType(10, item2.fStQStArray) +
									'</td>' +
									'<td class=\'text-center dbsync-padding dbsync-width\'>' +
									this.getCountofQstType(11, item2.fStQStArray) +
									'</td>' +
									'<td class=\'text-center dbsync-padding dbsync-width\'>' +
									this.getCountofQstType(12, item2.fStQStArray) +
									'</td>' +
									'<td class=\'text-center dbsync-padding dbsync-width\'>' +
									(this.getCountofQstType(1, item2.fStQStArray) +
										this.getCountofQstType(2, item2.fStQStArray) +
										this.getCountofQstType(3, item2.fStQStArray) +
										this.getCountofQstType(4, item2.fStQStArray) +
										this.getCountofQstType(5, item2.fStQStArray) +
										this.getCountofQstType(13, item2.fStQStArray) +
										this.getCountofQstType(15, item2.fStQStArray) +
										this.getCountofQstType(6, item2.fStQStArray) +
										this.getCountofQstType(7, item2.fStQStArray) +
										this.getCountofQstType(8, item2.fStQStArray) +
										this.getCountofQstType(9, item2.fStQStArray) +
										this.getCountofQstType(10, item2.fStQStArray) +
										this.getCountofQstType(11, item2.fStQStArray) +
										this.getCountofQstType(12, item2.fStQStArray)) +
									'</td>' +
									'</tr>';
							}
							this.DBSYNC_ELEMENT_DATA.push({
								position: ind,
								questionSubtypes:
									// tslint:disable-next-line:max-line-length
									'<table class=\'dialog-table-review table\'><tbody><tr class=\'dialog-table-review-header\'><th class=\'text-center dbsync-padding dbsync-width\'>Topic</th>' +
									'<th class=\'text-center dbsync-padding dbsync-width\'>Subtopic</th>' +
									'<th class=\'text-center dbsync-padding dbsync-width\'>MCQ</th>' +
									'<th class=\'text-center dbsync-padding dbsync-width\'>MCQMR</th>' +
									'<th class=\'text-center dbsync-padding dbsync-width\'>True/False</th>' +
									'<th class=\'text-center dbsync-padding dbsync-width\'>Match the Following</th>' +
									'<th class=\'text-center dbsync-padding dbsync-width\'>Matrix Match</th>' +
									'<th class=\'text-center dbsync-padding dbsync-width\'>Matrix Match 4X5</th>' +
									'<th class=\'text-center dbsync-padding dbsync-width\'>Single Integer</th>' +
									'<th class=\'text-center dbsync-padding dbsync-width\'>Double Integer</th>' +
									'<th class=\'text-center dbsync-padding dbsync-width\'>Fill in the Blanks</th>' +
									'<th class=\'text-center dbsync-padding dbsync-width\'>Identify</th>' +
									'<th class=\'text-center dbsync-padding dbsync-width\'>One Line Answer</th>' +
									'<th class=\'text-center dbsync-padding dbsync-width\'>Very Short Answer</th>' +
									'<th class=\'text-center dbsync-padding dbsync-width\'>Short Answer</th>' +
									'<th class=\'text-center dbsync-padding dbsync-width\'>Long Answer</th>' +
									'<th class=\'text-center dbsync-padding dbsync-width\'>Very Long Answer</th>' +
									'<th class=\'text-center dbsync-padding dbsync-width\'>Overall</th>' +
									'</tr>' +
									'<tr class=\'table-dialog-review-row\'><td ' +
									'rowspan=\'' +
									this.finalStArrayQstType.length * 3 +
									'\' class=\'align-middle dbsync-topic\'>' +
									item.topic_name +
									'</td>' +
									tableQstBased +
									'</tr>' +
									'<tr><td class=\'text-center dbsync-padding dbsync-width\'></td><td class=\'text-center dbsync-padding dbsync-width\'></td>' +
									'<td colspan=\'12\' class=\'text-center dbsync-padding dbsync-width\'>' +
									'</td>' +
									'<th colspan=\'2\' class=\'text-center dbsync-padding dbsync-width\'>Grand Total</tdh>' +
									'<th class=\'text-center dbsync-padding dbsync-width\'>' +
									item.qstArray.length +
									'</th>' +
									'</tr>' +
									'</tbody></table>',
								action: item,
								check: false,
								tooltip: 'Sync Question',
								sync_id: ''
							});
							ind++;
						}
						this.dbsyncdatasource = new MatTableDataSource<DBSyncElement>(
							this.DBSYNC_ELEMENT_DATA
						);
						this.dbsyncdatasource.paginator = this.paginator;
						this.sort.sortChange.subscribe(
							() => (this.paginator.pageIndex = 0)
						);
						this.dbsyncdatasource.sort = this.sort;

						this.lengthArray = this.DBSYNC_ELEMENT_DATA.length;
						this.qlementService
							.getQuestionBankDbSyncSetting({
								sync_sub_id: this.parameterform.value.sub_id,
								sync_class_id: this.parameterform.value.class_id,
								sync_school_id: this.parameterform.value.school_id
							})
							.subscribe((result2: any) => {
								if (result2 && result2.status === 'ok') {
									this.checkDbsyncStatus = false;
									this.synchedSchoolArray = result2.data;
									for (const item of this.synchedSchoolArray) {
										for (const titem of this.DBSYNC_ELEMENT_DATA) {
											if (Number(item.sync_status) === 1) {
												if (
													Number(item.sync_topic_id) ===
													Number(titem.action.topic_id)
												) {
													titem.sync_id = item.sync_id;
													titem.check = true;
													titem.tooltip = 'Already Synched';
												}
											}
										}
									}
								} else {
									this.checkDbsyncStatus = false;
								}
							});
					} else {
						this.schoolFlag = false;
						this.checkDbsyncStatus = false;
						this.notif.showSuccessErrorMessage('No records Found', 'error');
					}
				});
		}
	}
	getCountofQstType(value, array) {
		let sum = 0;
		for (const item of array) {
			if (Number(item.qst_id) === Number(value)) {
				sum++;
			}
		}
		return sum;
	}
	getSchools() {
		this.qlementService.getSchool().subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.schoolArray = result.data;
			}
		});
	}
	applyFilterDbsync(filterValue: any) {
		filterValue = filterValue.trim().toLowerCase(); // Remove whitespace
		this.dbsyncdatasource.filter = filterValue;
	}
	synchronizeData($event, value, synchro_id) {
		let lengtArray: any;
		if ($event.checked === true) {
			this.checkDbsyncStatus = true;
			this.loaderText = '';
			this.qlementService
				.insertQuestionBankDbSyncSetting({
					sync_school_id: this.parameterform.value.school_id,
					sync_no_of_question_to_import: '',
					sync_class_id: this.parameterform.value.class_id,
					sync_sub_id: this.parameterform.value.sub_id,
					sync_topic_id: value.topic_id,
					sync_st_id: '',
					sync_import_question_by_school_permission_flag: '1',
					sync_status: '0'
				})
				.subscribe((result: any) => {
					if (result && result.status === 'ok') {
						this.checkDbsyncStatus = false;
						this.checkDbsyncStatus = true;
						for (const item of this.topicSubtopicArray) {
							if (Number(item.topic_id) === Number(value.topic_id)) {
								lengtArray = item.qstArray.length;
								break;
							}
						}
						const indexArray: any[] = [];
						for (let k = 0; k < lengtArray; k++) {
							indexArray.push(k);
						}
						let i = 0;
						const x = setInterval(() => {
							const findex = indexArray.indexOf(i);
							if (findex !== -1) {
								this.loaderText =
									'Synchronizing ' +
									(i + 1) +
									'/' +
									indexArray.length +
									' questions ...';
							}
							i++;
						}, 1);
						this.qlementService
							.getQuestionsFromMaster({
								sync_id: result.data.sync_id.toString(),
								class_id: this.parameterform.value.class_id,
								sub_id: this.parameterform.value.sub_id,
								school_id: this.parameterform.value.school_id,
								topic_id: value.topic_id
							})
							.subscribe((result3: any) => {
								if (result3 && result3.status === 'ok') {
									clearInterval(x);
									this.checkDbsyncStatus = false;
									this.notif.showSuccessErrorMessage(
										'Question Synched Successfully',
										'success'
									);
									this.getQuestionClassSubjectWise();
								} else {
									this.checkDbsyncStatus = false;
								}
							});
					} else {
						this.checkDbsyncStatus = false;
					}
				});
		} else {
			this.getSyncId = synchro_id;
			this.modalRef = this.modalService.show(this.template, {
				class: 'modal-sm'
			});
		}
	}
	revokeAccess() {
		this.qlementService
			.revokeDbSyncSetting({ sync_id: this.getSyncId })
			.subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.notif.showSuccessErrorMessage(
						'Access Revoked Suceessfully',
						'success'
					);
				}
			});
	}

	sortData(event: Sort) {
		this.dbsyncdatasource.sort.active = event.active;
		this.dbsyncdatasource.sort.direction = event.direction;
		this.dbsyncdatasource.sort = this.sort;
	}
	reset() {
		this.schoolFlag = false;
		this.parameterform.reset();
	}
}
