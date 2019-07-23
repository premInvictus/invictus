import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonAPIService, SisService, AxiomService, SmartService } from '../../_services';
import * as moment from 'moment/moment';
import * as XLSX from 'xlsx';
declare var require;
const jsPDF = require('jspdf');
import 'jspdf-autotable';

@Component({
	selector: 'app-view-syllabus',
	templateUrl: './view-syllabus.component.html',
	styleUrls: ['./view-syllabus.component.css']
})
export class ViewSyllabusComponent implements OnInit {

	public reviewform: FormGroup;
	public classArray: any[];
	sectionArray: any[] = [];
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
	teachingSum = 0;
	testSum = 0;
	revisionSum = 0;
	constructor(
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
			syl_sec_id: '',
			syl_sub_id: ''
		});
	}
	ngOnInit() {
		this.buildForm();
		this.getClass();
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

	getSectionsByClass() {
		this.sectionArray = [];
		this.sisService.getSectionsByClass({ class_id: this.reviewform.value.syl_class_id }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.sectionArray = result.data;
			} else {
				this.commonService.showSuccessErrorMessage(result.message, 'error');
			}
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

	// fetch syllabus details for table
	fetchSyllabusDetails() {
		if (this.reviewform.value.syl_class_id && this.reviewform.value.syl_sub_id && this.reviewform.value.syl_sec_id) {
			this.syllabusService.getSylIdByClassSubject(this.reviewform.value.syl_class_id, this.reviewform.value.syl_sub_id)
				.subscribe(
					(result: any) => {
						if (result && result.status === 'ok') {
							this.getTopicByClassSubject();
							const param: any = {};
							param.syl_id = result.data[0].syl_id;
							param.sd_status = 1;
							if (this.reviewform.value.syl_class_id) {
								param.syl_class_id = this.reviewform.value.syl_class_id;
							}
							if (this.reviewform.value.syl_sec_id) {
								param.syl_sec_id = this.reviewform.value.syl_sec_id;
							}
							if (this.reviewform.value.syl_sub_id) {
								param.syl_sub_id = this.reviewform.value.syl_sub_id;
							}
							if (param.syl_id !== '') {
								this.syllabusService.getViewSyllabusDetails(param)
									.subscribe(
										(result1: any) => {
											if (result1 && result1.status === 'ok') {
												this.finalSyllabusArray = result1.data.syllabusDetails;
												const topicwiseDetails = result1.data.topicwiseDetails;
												const periodCoundDetails = result1.data.periodCoundDetails;
												const scheduleDetails = result1.data.scheduleDetails;
												const sessionStartDate = result1.data.sessionStartDate;
												const sessionEndDate = result1.data.sessionEndDate;
												if (!this.editRequestFlag) {
													this.finalSpannedArray = [];
												}
												for (let i = 0; i < this.finalSyllabusArray.length; i++) {
													let sd_period_teacher: any = '';
													let sd_period_test: any = '';
													let sd_period_revision: any = '';

													if (this.finalSyllabusArray[i].sd_ctr_id === '1') {
														this.teachingSum = this.teachingSum + Number(this.finalSyllabusArray[i].sd_period_req);
														sd_period_teacher = this.finalSyllabusArray[i].sd_period_req;
													} else if (this.finalSyllabusArray[i].sd_ctr_id === '2') {
														this.testSum = this.testSum + Number(this.finalSyllabusArray[i].sd_period_req);
														sd_period_test = this.finalSyllabusArray[i].sd_period_req;
													} else {
														this.revisionSum = this.revisionSum + Number(this.finalSyllabusArray[i].sd_period_req);
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
												if (this.finalSpannedArray.length > 0) {
													let totalPeriodFromInitial = 0;
													this.finalSpannedArray.forEach(element => {
														totalPeriodFromInitial = totalPeriodFromInitial + Number(element.total);
														let estimateDate = '';
														if (sessionStartDate && sessionEndDate && scheduleDetails) {
															let notp = totalPeriodFromInitial;
															console.log(totalPeriodFromInitial);
															const sessionSD = moment(sessionStartDate);
															const sessionED = moment(sessionEndDate);
															for (const d = sessionSD; d.diff(sessionED) <= 0; d.add(1, 'days')) {
																// console.log(d.format('YYYY-MM-DD'));
																// if day is sunday
																if (d.day() === 0) {
																	continue;
																} else {
																	if (scheduleDetails && scheduleDetails.length > 0) {
																		const sdIndex = scheduleDetails.findIndex(e => e.sc_date === d.format('YYYY-MM-DD'));
																		if (sdIndex !== -1) {
																			continue;
																		} else {
																			notp = notp - periodCoundDetails[d.day()];
																			if (notp <= 0) {
																				estimateDate = d.format('YYYY-MM-DD');
																				break;
																			}
																		}

																	}
																}

															}
														}
														const eachTopicStatus: any = {};
														eachTopicStatus.statusStr = 'Yet To Start';
														eachTopicStatus.statusDate = '';
														eachTopicStatus.statusFlag = false;
														if (topicwiseDetails && topicwiseDetails.length > 0) {
															const findex = topicwiseDetails.findIndex(e => e.tw_topic_id === element.sd_topic_id);
															if (findex !== -1) {
																const tempArr = topicwiseDetails[findex].ctr_group.split(',');
																if (tempArr.length === 3) {
																	eachTopicStatus.statusStr = 'Completed';
																	eachTopicStatus.statusDate = topicwiseDetails[findex].compilation_date;
																	eachTopicStatus.statusFlag = true;
																} else if (tempArr.length > 0) {
																	eachTopicStatus.statusStr = 'Inprogress';
																}
															}
														}
														element.statusDetails = eachTopicStatus;
														element.initialTotal = totalPeriodFromInitial;
														element.estimateDate = estimateDate;
													});
												}
												this.finaldivflag = false;
												console.log('finalSpannedArray', this.finalSpannedArray);
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

}
