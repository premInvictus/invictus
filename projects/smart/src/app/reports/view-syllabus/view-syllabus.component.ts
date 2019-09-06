import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonAPIService, SisService, AxiomService, SmartService } from '../../_services';
import * as moment from 'moment/moment';
import * as XLSX from 'xlsx';
declare var require;
import * as Excel from 'exceljs/dist/exceljs';
const jsPDF = require('jspdf');
import 'jspdf-autotable'; 
import { TitleCasePipe, DatePipe } from '@angular/common';
import { saveAs } from 'file-saver';
import { CapitalizePipe } from '../../../../../fee/src/app/_pipes';

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
	dataArr: any[] = [];
	sessionArray: any[] = [];
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
	session: any;
	sessionName: any;
	length: any;
	alphabetJSON = {
		1: 'A',
		2: 'B',
		3: 'C',
		4: 'D',
		5: 'E',
		6: 'F',
		7: 'G',
		8: 'H',
		9: 'I',
		10: 'J',
		11: 'K',
		12: 'L',
		13: 'M',
		14: 'N',
		15: 'O',
		16: 'P',
		17: 'Q',
		18: 'R',
		19: 'S',
		20: 'T',
		21: 'U',
		22: 'V',
		23: 'W',
		24: 'X',
		25: 'Y',
		26: 'Z',
		27: 'AA',
		28: 'AB',
		29: 'AC',
		30: 'AD',
		31: 'AE',
		32: 'AF',
		33: 'AG',
		34: 'AH',
		35: 'AI',
		36: 'AJ',
		37: 'AK',
		38: 'AL',
		39: 'AM',
		40: 'AN',
		41: 'AO',
		42: 'AP',
		43: 'AQ',
		44: 'AR',

	};
	schooInfo: any;
	constructor(
		private fbuild: FormBuilder,
		private syllabusService: SmartService,
		public commonService: CommonAPIService,
		public axiomService: AxiomService,
		public sisService: SisService,
	) {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.session = JSON.parse(localStorage.getItem('session'));
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
		this.getSession();
		this.getSchool();
	}
	// get session name by session id
	getSession() {
		this.sisService.getSession()
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						for (const citem of result.data) {
							this.sessionArray[citem.ses_id] = citem.ses_name;
						}
						this.sessionName = this.sessionArray[this.session.ses_id];
					}
				});
	}
	// get end month and start month of school
	getSchool() {
		this.sisService.getSchool()
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.schooInfo = result.data[0];
					}
				});
	}
	//  Get Class List function
	getClass() {
		this.finalSpannedArray = [];
		const classParam: any = {};
		classParam.role_id = this.currentUser.role_id;
		classParam.login_id = this.currentUser.login_id;
		this.syllabusService.getClassData(classParam)
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
		this.syllabusService.getSectionsByClass({ class_id: this.reviewform.value.syl_class_id }).subscribe((result: any) => {
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
		this.finaldivflag = true;
		subjectParam.class_id = this.reviewform.value.syl_class_id;
		this.syllabusService.getSubjectsByClass(subjectParam)
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
		this.syllabusService.getTopicByClassSubject(this.reviewform.value.syl_class_id, this.reviewform.value.syl_sub_id)
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
		this.syllabusService.getSubTopic({ st_topic_id: value })
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						return result.data.st_name;
					}
				});
	}
	// get subject name from existing array
	getSubjectName(value) {
		const ctrIndex = this.subjectArray.findIndex(f => Number(f.sub_id) === Number(value));
		if (ctrIndex !== -1) {
			return this.subjectArray[ctrIndex].sub_name;
		}
	}
	// get Class name from existing array
	getClassName(value) {
		const classIndex = this.classArray.findIndex(f => Number(f.class_id) === Number(value));
		if (classIndex !== -1) {
			return this.classArray[classIndex].class_name;
		}
	}
	// get section from existing array
	getSectionName(value) {
		const sectionIndex = this.sectionArray.findIndex(f => Number(f.sec_id) === Number(value));
		if (sectionIndex !== -1) {
			return this.sectionArray[sectionIndex].sec_name;
		}
	}
	// export excel code
	exportAsExcel() {
		let reportType: any = '';
		let reportType2: any = '';
		const columns: any = [];
		columns.push({
			key: 'sd_topic_name',
			width: this.checkWidth('sd_topic_name', 'Topic')
		});
		columns.push({
			key: 'sd_st_name',
			width: this.checkWidth('sd_st_name', 'Sub Topic')
		});
		columns.push({
			key: 'sd_desc',
			width: this.checkWidth('sd_desc', 'Description')
		});
		columns.push({
			key: 'sd_period_teacher',
			width: this.checkWidth('sd_period_teacher', 'Teaching')
		});
		columns.push({
			key: 'sd_period_test',
			width: this.checkWidth('sd_period_test', 'Test')
		});
		columns.push({
			key: 'sd_period_revision',
			width: this.checkWidth('sd_period_revision', 'Revision')
		});
		columns.push({
			key: 'total',
			width: this.checkWidth('total', 'Total')
		});
		columns.push({
			key: 'estimateDate',
			width: this.checkWidth('estimateDate', 'Estimated Date Of Compilation')
		});
		reportType2 = new TitleCasePipe().transform('view syllabus repo_') + this.sessionName;
		reportType = new TitleCasePipe().transform('view syllabus report: ') + this.sessionName;
		const fileName = reportType + '.xlsx';
		const workbook = new Excel.Workbook();
		const worksheet = workbook.addWorksheet(reportType, { properties: { showGridLines: true } },
			{ pageSetup: { fitToWidth: 7 } });
		worksheet.mergeCells('A1:' + this.alphabetJSON[7] + '1');
		worksheet.getCell('A1').value =
			new TitleCasePipe().transform(this.schooInfo.school_name) + ', ' + this.schooInfo.school_city + ', ' + this.schooInfo.school_state;
		worksheet.getCell('A1').alignment = { horizontal: 'left' };
		worksheet.mergeCells('A2:' + this.alphabetJSON[7] + '2');
		worksheet.getCell('A2').value = reportType;
		worksheet.getCell(`A2`).alignment = { horizontal: 'left' };
		worksheet.mergeCells('A4:A5');
		worksheet.getCell('A4').value = 'Topic';
		worksheet.mergeCells('B4:B5');
		worksheet.getCell('B4').value = 'SubTopic';
		worksheet.mergeCells('C4:C5');
		worksheet.getCell('C4').value = 'Description';
		worksheet.mergeCells('D4:F4');
		worksheet.getCell('D4').value = 'No. of Period Required';
		worksheet.getCell('D5').value = 'Teaching';
		worksheet.getCell('E5').value = 'Test';
		worksheet.getCell('F5').value = 'Revision';
		worksheet.mergeCells('G4:G5');
		worksheet.getCell('G4').value = 'Total';
		worksheet.mergeCells('H4:H5');
		worksheet.getCell('H4').value = 'Estimated Date Of Compilation';
		worksheet.columns = columns;
		this.length = worksheet._rows.length;
		for (const item of this.finalSpannedArray) {
			const prev = this.length + 1;
			const obj: any = {};
			if (item.sd_topic_id === item.details[0].sd_topic_id) {
				for (const dety of item.details) {
					this.length++;
					if (dety.sd_ctr_id === '1') {
						worksheet.getCell('B' + this.length).value = dety.sd_st_name;
					} else if (dety.sd_ctr_id === '2') {
						worksheet.getCell('B' + this.length).value = 'Test';
					} else {
						worksheet.getCell('B' + this.length).value = 'Revision';
					}
					worksheet.getCell('C' + this.length).value = this.commonService.htmlToText(dety.sd_desc);
					worksheet.getCell('D' + this.length).value = dety.sd_period_teacher;
					worksheet.getCell('E' + this.length).value = dety.sd_period_test;
					worksheet.getCell('F' + this.length).value = dety.sd_period_revision;
				}
				worksheet.mergeCells('A' + prev + ':' + 'A' + this.length);
				worksheet.getCell('A' + prev).value = this.getTopicName(item.sd_topic_id);
				worksheet.mergeCells('G' + prev + ':' + 'G' + this.length);
				worksheet.getCell('G' + prev).value = item.total;
				worksheet.mergeCells('H' + prev + ':' + 'H' + this.length);
				worksheet.getCell('H' + prev).value = new DatePipe('en-in').transform(item.estimateDate, 'd-MMM-y');
			}
			worksheet.addRow(obj);
		}
		worksheet.eachRow((row, rowNum) => {
			if (rowNum === 1) {
				row.font = {
					name: 'Arial',
					size: 16,
					bold: true
				};
			}
			if (rowNum === 2) {
				row.font = {
					name: 'Arial',
					size: 14,
					bold: true
				};
			}
			if (rowNum === 4 || rowNum === 5) {
				row.eachCell(cell => {
					cell.font = {
						name: 'Arial',
						size: 10,
						bold: true,
						color: { argb: '636a6a' }
					};
					cell.fill = {
						type: 'pattern',
						pattern: 'solid',
						fgColor: { argb: 'c8d6e5' },
						bgColor: { argb: 'c8d6e5' },
					};
					cell.border = {
						top: { style: 'thin' },
						left: { style: 'thin' },
						bottom: { style: 'thin' },
						right: { style: 'thin' }
					};
					cell.alignment = { horizontal: 'center', vertical: 'top', wrapText: true };
				});
			}
			if (rowNum > 5 && rowNum <= worksheet._rows.length) {
				row.eachCell(cell => {
					if (cell._address.charAt(0) !== 'A' && cell._address.charAt(0) !== 'G' && cell._address.charAt(0) !== 'H') {
						if (rowNum % 2 === 0) {
							cell.fill = {
								type: 'pattern',
								pattern: 'solid',
								fgColor: { argb: 'ffffff' },
								bgColor: { argb: 'ffffff' },
							};
						} else {
							cell.fill = {
								type: 'pattern',
								pattern: 'solid',
								fgColor: { argb: '888888' },
								bgColor: { argb: '888888' },
							};
						}
					}
					cell.font = {
						color: { argb: 'black' },
						bold: false,
						name: 'Arial',
						size: 10
					};
					cell.border = {
						top: { style: 'thin' },
						left: { style: 'thin' },
						bottom: { style: 'thin' },
						right: { style: 'thin' }
					};
					cell.alignment = { horizontal: 'center', vertical: 'top', wrapText: true };
				});
			}
		});
		const obj3: any = {};
		obj3['sd_topic_name'] = 'Grand Total';
		obj3['sd_st_name'] = '';
		obj3['sd_desc'] = '';
		obj3['sd_period_teacher'] = this.dataArr.map(t => t['sd_period_teacher']).reduce((acc, val) => Number(acc) + Number(val), 0);
		obj3['sd_period_test'] = this.dataArr.map(t => t['sd_period_test']).reduce((acc, val) => Number(acc) + Number(val), 0);
		obj3['sd_period_revision'] = this.dataArr.map(t => t['sd_period_revision']).reduce((acc, val) => Number(acc) + Number(val), 0);
		obj3['total'] = this.dataArr.map(t => t['sd_period_teacher']).reduce((acc, val) => Number(acc) + Number(val), 0) +
			this.dataArr.map(t => t['sd_period_test']).reduce((acc, val) => Number(acc) + Number(val), 0) +
			this.dataArr.map(t => t['sd_period_revision']).reduce((acc, val) => Number(acc) + Number(val), 0);
		obj3['estimateDate'] = '';
		worksheet.addRow(obj3);
		worksheet.eachRow((row, rowNum) => {
			if (rowNum === worksheet._rows.length) {
				row.eachCell(cell => {
					cell.fill = {
						type: 'pattern',
						pattern: 'solid',
						fgColor: { argb: '004261' },
						bgColor: { argb: '004261' },
					};
					cell.font = {
						color: { argb: 'ffffff' },
						bold: true,
						name: 'Arial',
						size: 10
					};
					cell.border = {
						top: { style: 'thin' },
						left: { style: 'thin' },
						bottom: { style: 'thin' },
						right: { style: 'thin' }
					};
					cell.alignment = { horizontal: 'center' };
				});
			}
		});
		workbook.xlsx.writeBuffer().then(data => {
			const blob = new Blob([data], { type: 'application/octet-stream' });
			saveAs(blob, fileName);
		});

	}
	// check the max  width of the cell
	checkWidth(id, header) {
		const res = this.dataArr.map((f) => f[id] !== '-' && f[id] ? f[id].toString().length : 1);
		const max2 = header.toString().length;
		const max = Math.max.apply(null, res);
		return max2 > max ? max2 : max;
	}


	// pdf download
	pdfDownload() {
		const doc = new jsPDF('landscape');
		doc.autoTable({
			head: [['View Syllabus of Class : ' + this.getClassName(this.reviewform.value.syl_class_id) + '-' +
				this.getSectionName(this.reviewform.value.syl_sec_id) + '    Subject : ' +
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

	// fetch syllabus details for table
	fetchSyllabusDetails() {
		this.teachingSum = 0;
		this.testSum = 0;
		this.revisionSum = 0;
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
												const classworkDetails = result1.data.classworkDetails;
												const periodCoundDetails = result1.data.periodCoundDetails;
												const scheduleDetails = result1.data.scheduleDetails;
												const sessionStartDate = result1.data.sessionStartDate;
												const sessionEndDate = result1.data.sessionEndDate;
												// if (!this.editRequestFlag) {
												// 	this.finalSpannedArray = [];
												// }
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
													this.dataArr = [];
													for (const item of this.finalSpannedArray) {
														const obj: any = {};
														for (const dety of item.details) {
															this.dataArr.push(dety);
														}
													}
												}
												if (this.finalSpannedArray.length > 0) {
													let totalPeriodFromInitial = 0;
													this.finalSpannedArray.forEach(element => {
														totalPeriodFromInitial = totalPeriodFromInitial + Number(element.total);
														let estimateDate = '';
														if (sessionStartDate && sessionEndDate && scheduleDetails) {
															let notp = totalPeriodFromInitial;
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
														eachTopicStatus.color = 'red';
														eachTopicStatus.statusFlag = false;
														if (topicwiseDetails && topicwiseDetails.length > 0) {
															const findex = topicwiseDetails.findIndex(e => e.tw_topic_id === element.sd_topic_id);
															if (findex !== -1) {
																const tempArr = topicwiseDetails[findex].ctr_group.split(',');
																if (tempArr.length === 3) {
																	eachTopicStatus.statusStr = 'Completed';
																	eachTopicStatus.statusDate = topicwiseDetails[findex].compilation_date;
																	eachTopicStatus.statusFlag = true;
																	eachTopicStatus.color = 'green';
																} else if (tempArr.length === 2) {
																	eachTopicStatus.statusStr = 'Revision Done';
																	eachTopicStatus.statusDate = topicwiseDetails[findex].compilation_date;
																	eachTopicStatus.statusFlag = true;
																	eachTopicStatus.color = 'green';
																} else if (tempArr.length === 1) {
																	eachTopicStatus.statusStr = 'Course Completed';
																	eachTopicStatus.statusDate = topicwiseDetails[findex].compilation_date;
																	eachTopicStatus.statusFlag = true;
																	eachTopicStatus.color = 'green';
																}
															} else {
																const cindex = classworkDetails.findIndex(c => c.cw_topic_id === element.sd_topic_id);
																if (cindex !== -1) {
																	eachTopicStatus.statusStr = 'In Progress';
																	eachTopicStatus.color = 'yellow';
																	eachTopicStatus.statusFlag = false;
																}
															}
														} else {
															const cindex = classworkDetails.findIndex(c => c.cw_topic_id === element.sd_topic_id);
															if (cindex !== -1) {
																eachTopicStatus.statusStr = 'In Progress';
																eachTopicStatus.color = 'yellow';
																eachTopicStatus.statusFlag = false;
															}
														}
														element.statusDetails = eachTopicStatus;
														element.initialTotal = totalPeriodFromInitial;
														element.estimateDate = estimateDate;
													});
												}
												this.finaldivflag = false;
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
