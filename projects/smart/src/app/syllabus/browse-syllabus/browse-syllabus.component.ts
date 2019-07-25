import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonAPIService, SisService, AxiomService, SmartService } from '../../_services';
import { MatDialog } from '@angular/material/dialog';
import * as XLSX from 'xlsx';
declare var require;
const jsPDF = require('jspdf');
import 'jspdf-autotable';

@Component({
	selector: 'app-browse-syllabus',
	templateUrl: './browse-syllabus.component.html',
	styleUrls: ['./browse-syllabus.component.css']
})
export class BrowseSyllabusComponent implements OnInit {
	@ViewChild('UnpublishModal') UnpublishModal;
	public reviewform: FormGroup;
	public classArray: any[];
	public subjectArray: any[];
	public finalSyllabusArray: any[];
	public topicArray: any[];
	finalSpannedArray: any[] = [];
	editRequestFlag = false;
	finaldivflag = true;
	syl_id: any;
	sd_status: any;
	param: any = {};
	currentUser: any;
	UnpublishParam: any = {};
	constructor(
		public dialog: MatDialog,
		private fbuild: FormBuilder,
		private syllabusService: SmartService,
		public commonService: CommonAPIService,
		public axiomService: AxiomService,
		public sisService: SisService,
	) {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
	}
	buildForm() {
		this.reviewform = this.fbuild.group({
			syl_class_id: '',
			syl_sub_id: ''
		});
	}
	ngOnInit() {
		this.buildForm();
		this.getClass();
	}

	openunPublish(syl_id, topic_id) {
		this.UnpublishParam.syl_id = syl_id;
		this.UnpublishParam.topic_id = topic_id;
		this.UnpublishModal.openunpublishModal(this.UnpublishParam);
	}

	//  Get Class List function
	getClass() {
		this.finalSpannedArray = [];
		const classParam: any = {};
		classParam.role_id = this.currentUser.role_id;
		classParam.login_id = this.currentUser.login_id;
		this.sisService.getClass(classParam)
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.classArray = result.data;
					}
				}
			);
		this.reviewform.patchValue({
			'syl_sub_id': ''
		});
	}

	//  Get Subject By Class function
	getSubjectsByClass(): void {
		this.finalSpannedArray = [];
		const subjectParam: any = {};
		subjectParam.class_id = this.reviewform.value.syl_class_id;
		this.axiomService.getSubjectsByClass(subjectParam)
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.subjectArray = result.data;
					} else {
						this.subjectArray = [];
						this.commonService.showSuccessErrorMessage('No Record Found', 'error');
					}
				}
			);
	}

	//  Get Topic List function
	getTopicByClassSubject() {
		this.axiomService.getTopicByClassSubject(this.reviewform.value.syl_class_id, this.reviewform.value.syl_sub_id)
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.topicArray = result.data;
					} else {
						this.topicArray = [];
					}
				}
			);
	}

	//  Get Topic Name from existion Array for details table
	getTopicName(value) {
		const topIndex = this.topicArray.findIndex(f => Number(f.topic_id) === Number(value));
		if (topIndex !== -1) {
			return this.topicArray[topIndex].topic_name;
		}
	}

	//  Get Sub Topic Name
	getSubTopicName(value): void {
		this.axiomService.getSubtopicByTopic(value)
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						return result.data.st_name;
					}
				});
	}
	// get Class name from existing array
	getClassName(value) {
		const classIndex = this.classArray.findIndex(f => Number(f.class_id) === Number(value));
		if (classIndex !== -1) {
			return this.classArray[classIndex].class_name;
		}
	}
	// get subject name from existing array
	getSubjectName(value) {
		const ctrIndex = this.subjectArray.findIndex(f => Number(f.sub_id) === Number(value));
		if (ctrIndex !== -1) {
			return this.subjectArray[ctrIndex].sub_name;
		}
	}
	// export excel code
	exportAsExcel() {
		// tslint:disable-next-line:max-line-length
		const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(document.getElementById('report_table')); // converts a DOM TABLE element to a worksheet
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
		XLSX.writeFile(wb, 'Report_' + (new Date).getTime() + '.xlsx');

	}
	// pdf download
	pdfDownload() {
		const doc = new jsPDF('landscape');
		doc.autoTable({
			head: [['Browse Syllabus Of Class : ' + this.getClassName(this.reviewform.value.syl_class_id) + '    Subject : ' +
				this.getSubjectName(this.reviewform.value.syl_sub_id)]],
			didDrawPage: function (data) {
				doc.setFont('Roboto');
			},
			headerStyles: {
				fontStyle: 'bold',
				fillColor: '#ffffff',
				textColor: 'black',
				halign: 'center',
				fontSize: 15,
			},
			useCss: true,
			theme: 'striped'
		});
		doc.autoTable({
			html: '#report_table',
			headerStyles: {
				fontStyle: 'normal',
				fillColor: '#ffffff',
				textColor: 'black',
				halign: 'center',
				fontSize: 14,
			},
			useCss: true,
			styles: {
				fontSize: 14,
				cellWidth: 'auto',
				textColor: 'black',
				lineColor: 'red',
			},
			theme: 'grid'
		});
		doc.save('table.pdf');
	}
	// function for unpublish Syllabus list
	unpublishSyllabus($event) {
		if ($event) {
			const param2: any = {};
			param2.sd_syl_id = this.UnpublishParam.syl_id;
			param2.sd_topic_id = this.UnpublishParam.topic_id;
			param2.sd_unpublish_reason_id = this.UnpublishParam.req_reason;
			param2.sd_unpublish_remark = this.UnpublishParam.req_reason_text;
			param2.sd_unpublish_by_user_id = this.currentUser.login_id;
			param2.sd_status = '0';
			this.syllabusService.updatePublishStatus(param2)
				.subscribe(
					(result: any) => {
						if (result && result.status === 'ok') {
							const param: any = {};
							param.mod_review_row_id = param2.sd_syl_id + '-' + param2.sd_topic_id;
							param.mod_review_by = this.currentUser.login_id;
							param.mod_review_remark = param2.sd_unpublish_remark;
							param.mod_review_reason_id = param2.sd_unpublish_reason_id;
							param.mod_review_status = '2';
							param.mod_title = '1';
							param.mod_project_id = '4';
							this.syllabusService.insertPublishSyllabus(param)
								.subscribe(
									(updateResult: any) => {
										if (updateResult && updateResult.status === 'ok') {
											this.fetchSyllabusDetails();
											this.commonService.showSuccessErrorMessage('Syllabus Unpublish Successfully', 'success');
										}
									});
						}
					});
		}
	}

	// fetch syllabus details for table
	fetchSyllabusDetails() {
		this.finaldivflag = false;
		this.syllabusService.getSylIdByClassSubject(this.reviewform.value.syl_class_id, this.reviewform.value.syl_sub_id)
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.getTopicByClassSubject();
						const param: any = {};
						param.syl_id = result.data[0].syl_id;
						param.sd_status = 1;
						if (param.syl_id !== '') {
							this.syllabusService.getSyllabusDetails(param)
								.subscribe(
									(result1: any) => {
										if (result1 && result1.status === 'ok') {
											this.finalSyllabusArray = result1.data;
											if (!this.editRequestFlag) {
												this.finalSpannedArray = [];
											}
											for (let i = 0; i < this.finalSyllabusArray.length; i++) {
												let sd_period_teacher: any = '';
												let sd_period_test: any = '';
												let sd_period_revision: any = '';

												if (this.finalSyllabusArray[i].sd_ctr_id === '1') {
													sd_period_teacher = this.finalSyllabusArray[i].sd_period_req;
												} else if (this.finalSyllabusArray[i].sd_ctr_id === '2') {
													sd_period_test = this.finalSyllabusArray[i].sd_period_req;
												} else {
													sd_period_revision = this.finalSyllabusArray[i].sd_period_req;
												}
												const spannArray: any[] = [];
												spannArray.push({
													sd_topic_id: this.finalSyllabusArray[i].sd_topic_id,
													sd_st_id: this.finalSyllabusArray[i].sd_st_id,
													sd_period_req: this.finalSyllabusArray[i].sd_period_req,
													sd_period_teacher: sd_period_teacher,
													sd_period_test: sd_period_test,
													sd_period_revision: sd_period_revision,
													sd_ctr_id: this.finalSyllabusArray[i].sd_ctr_id,
													sd_desc: this.finalSyllabusArray[i].sd_desc,
													sd_topic_name: this.finalSyllabusArray[i].topic_name,
													sd_st_name: this.finalSyllabusArray[i].st_name,
													sd_id: this.finalSyllabusArray[i].sd_id,
												});
												for (let j = i + 1; j < this.finalSyllabusArray.length; j++) {
													let sd_period_teacher1: any = '';
													let sd_period_test1: any = '';
													let sd_period_revision1: any = '';
													if (this.finalSyllabusArray[i].sd_topic_id === this.finalSyllabusArray[j].sd_topic_id) {
														if (this.finalSyllabusArray[j].sd_ctr_id === '1') {
															sd_period_teacher1 = this.finalSyllabusArray[j].sd_period_req;
														} else if (this.finalSyllabusArray[j].sd_ctr_id === '2') {
															sd_period_test1 = this.finalSyllabusArray[j].sd_period_req;
														} else {
															sd_period_revision1 = this.finalSyllabusArray[j].sd_period_req;
														}
														spannArray.push({
															sd_topic_id: this.finalSyllabusArray[i].sd_topic_id,
															sd_st_id: this.finalSyllabusArray[j].sd_st_id,
															sd_period_req: this.finalSyllabusArray[j].sd_period_req,
															sd_period_teacher: sd_period_teacher1,
															sd_period_test: sd_period_test1,
															sd_period_revision: sd_period_revision1,
															sd_ctr_id: this.finalSyllabusArray[j].sd_ctr_id,
															sd_desc: this.finalSyllabusArray[j].sd_desc,
															sd_topic_name: this.finalSyllabusArray[j].topic_name,
															sd_st_name: this.finalSyllabusArray[j].st_name,
															sd_id: this.finalSyllabusArray[j].sd_id,
														});
													}
												}
												const findex = this.finalSpannedArray.findIndex(f => f.sd_topic_id === this.finalSyllabusArray[i].sd_topic_id);
												if (findex === -1) {
													this.finalSpannedArray.push({
														sd_topic_id: this.finalSyllabusArray[i].sd_topic_id,
														details: spannArray,
														total: this.finalSyllabusArray[i].sd_period_req,
														syl_id: param.syl_id
													});
												} else {
													// tslint:disable-next-line: max-line-length
													this.finalSpannedArray[findex].total = Number(this.finalSpannedArray[findex].total) + Number(this.finalSyllabusArray[i].sd_period_req);
												}
											}
										} else {
											this.finalSpannedArray = [];
											this.finaldivflag = true;
											this.commonService.showSuccessErrorMessage('No Record Found', 'error');
										}
									});
						} else {
							this.finalSpannedArray = [];
							this.finaldivflag = true;
							this.commonService.showSuccessErrorMessage('No Record Found', 'error');
						}

					} else {
						this.finalSpannedArray = [];
						this.finaldivflag = true;
						this.commonService.showSuccessErrorMessage('No Record Found', 'error');
					}
				}
			);

	}

}

