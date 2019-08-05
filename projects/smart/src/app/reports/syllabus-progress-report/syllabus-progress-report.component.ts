import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonAPIService, SisService, AxiomService, SmartService } from '../../_services';
import { MatDialog } from '@angular/material/dialog';
import * as XLSX from 'xlsx';
declare var require;
import * as Excel from 'exceljs/dist/exceljs';
const jsPDF = require('jspdf');
import 'jspdf-autotable';
import { TitleCasePipe } from '@angular/common';
import { saveAs } from 'file-saver';
import { CapitalizePipe } from '../../../../../fee/src/app/_pipes';

@Component({
	templateUrl: './syllabus-progress-report.component.html',
	styleUrls: ['./syllabus-progress-report.component.css']
})
export class SyllabusProgressReportComponent implements OnInit {
	@ViewChild('remarkModel') remarkModel;
	dataArr: any[] = [];
	editRequestFlag = false;
	finalDivFlag = true;
	headerDivFlag = false;
	todaydate = new Date();
	progressReportForm: FormGroup;
	classArray: any[];
	subjectArray: any[];
	subCountArray: any[] = [];
	finalArray: any[];
	classwisetableArray: any[];
	periodCompletionArray: any[] = [];
	remarkArray: any[] = [];
	createdByArray: any[] = [];
	UserArray: any[] = [];
	sectionArray: any[];
	finalSpannedArray: any[] = [];
	sessionArray: any[] = [];
	currentUser: any;
	seesion_id: any;
	sessionName: any;
	startMonth: any;
	endMonth: any;
	yeararray: any;
	currentYear: any;
	nextYear: any;
	tt_id: any;
	totalCompletion = 0;
	totalAvailed = 0;
	totalAvailable = 0;
	remarkParam: any = {};
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
		public dialog: MatDialog,
		private fbuild: FormBuilder,
		private smartService: SmartService,
		public commonService: CommonAPIService,
		public axiomService: AxiomService,
		public sisService: SisService,
	) {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.seesion_id = JSON.parse(localStorage.getItem('session'));
	}
	// Add remark open modal function
	openRemarkModal(tt_id, sub_id) {
		this.remarkParam.tt_id = tt_id;
		this.remarkParam.sub_id = sub_id;
		this.remarkParam.type = 'add';
		this.remarkModel.openRemarkModal(this.remarkParam);
	}
	// edit remark open modal function
	editRemarkModal(tt_id, sub_id) {
		this.remarkParam.tt_id = tt_id;
		this.remarkParam.sub_id = sub_id;
		this.remarkParam.type = 'edit';
		this.remarkModel.openRemarkModal(this.remarkParam);
	}
	buildForm() {
		this.progressReportForm = this.fbuild.group({
			sc_to: '',
			syl_class_id: '',
			syl_section_id: '',
			syl_sub_id: ''
		});
	}

	ngOnInit() {
		this.buildForm();
		this.getClass();
		this.getSession();
		this.getSchool();
		this.getUserName();
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
		this.progressReportForm.patchValue({
			'syl_sub_id': ''
		});
	}
	// get section list according to selected class
	getSectionsByClass() {
		this.progressReportForm.patchValue({
			'syl_section_id': ''
		});
		const sectionParam: any = {};
		sectionParam.class_id = this.progressReportForm.value.syl_class_id;
		this.sisService.getSectionsByClass(sectionParam)
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.sectionArray = result.data;
					} else {
						this.sectionArray = [];
					}
				}
			);
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
	// get session name by session id
	getSession() {
		this.sisService.getSession()
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						for (const citem of result.data) {
							this.sessionArray[citem.ses_id] = citem.ses_name;
						}
						this.sessionName = this.sessionArray[this.seesion_id.ses_id];
						this.yeararray = this.sessionName.split('-');
						this.currentYear = this.yeararray[0];
						this.nextYear = this.yeararray[1];
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
						this.startMonth = result.data[0].session_start_month;
						this.endMonth = result.data[0].session_end_month;
					}
				});
	}
	// export excel code
	exportAsExcel() {
		let reportType: any = '';
		let reportType2: any = '';
		const columns: any = [];
		columns.push({
			key: 'subject_name',
			width: this.checkWidth('subject_name', 'Subject')
		});
		columns.push({
			key: 'count',
			width: this.checkWidth('count', 'Required for Expected Completion')
		});
		columns.push({
			key: 'subject_id',
			width: this.checkWidth('subject_id', 'Availed')
		});
		columns.push({
			key: 'countYear',
			width: this.checkWidth('countYear', 'Avaliable')
		});
		columns.push({
			key: 'deviation',
			width: this.checkWidth('deviation', 'Deviation')
		});
		columns.push({
			key: 'remarks',
			width: this.checkWidth('remarks', 'Remarks')
		});
		columns.push({
			key: 'remarks_by',
			width: this.checkWidth('remarks_by', 'Remarks By')
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
		worksheet.getCell('A4').value = 'Subject';
		worksheet.mergeCells('B4:D4');
		worksheet.getCell('B4').value = 'No. of Periods';
		worksheet.getCell('B5').value = 'Required for Expected Completion';
		worksheet.getCell('C5').value = 'Availed';
		worksheet.getCell('D5').value = 'Available';
		worksheet.mergeCells('E4:E5');
		worksheet.getCell('E4').value = 'Deviation';
		worksheet.mergeCells('F4:F5');
		worksheet.getCell('F4').value = 'Remarks';
		worksheet.mergeCells('G4:G5');
		worksheet.getCell('G4').value = 'Remarks By';
		worksheet.columns = columns;
		for (const item of this.subCountArray) {
			const obj: any = {};
			obj['subject_name'] = item.subject_name;
			obj['count'] = item.count;
			if (this.periodCompletionArray[Number(item.subject_id)]) {
				obj['subject_id'] = this.periodCompletionArray[Number(item.subject_id)];
			} else {
				obj['subject_id'] = '-';
			}
			obj['countYear'] = item.countYear - item.count;
			if (this.periodCompletionArray[Number(item.subject_id)]) {
				obj['deviation'] = Number(item.count) - Number(this.periodCompletionArray[Number(item.subject_id)]);
			} else {
				obj['deviation'] = Number(item.count);
			}
			if (this.remarkArray[Number(item.subject_id)]) {
				obj['remarks'] = new CapitalizePipe().transform(this.remarkArray[Number(item.subject_id)]);
			} else {
				obj['remarks'] = '-';
			}
			if (this.createdByArray[Number(item.subject_id)] === this.currentUser.login_id) {
				obj['remarks_by'] = '-';
			} else if (this.createdByArray[Number(item.subject_id)] !== this.currentUser.login_id) {
				obj['remarks_by'] = new TitleCasePipe().transform(this.UserArray[this.createdByArray[Number(item.subject_id)]]);
			} else {
				obj['remarks_by'] = '-';
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
					cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
				});
			}
			if (rowNum > 5 && rowNum <= worksheet._rows.length) {
				let cellColor: any = '';
				let fontColor: any = '';
				row.eachCell(cell => {
					if (cell._address.charAt(0) === 'E') {
						if (Number(cell.model.value) > 0) {
							cellColor = '439f47';
							fontColor = 'ffffff';
						} else if (Number(cell.model.value) < 0) {
							cellColor = 'c9122b';
							fontColor = 'ffffff';
						} else if (Number(cell.model.value) === 0) {
							cellColor = 'ffffff';
							fontColor = 'black';
						}
						cell.fill = {
							type: 'pattern',
							pattern: 'solid',
							fgColor: { argb: cellColor },
							bgColor: { argb: cellColor },
						};
						cell.font = {
							color: { argb: fontColor },
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
						cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
					} else {
						cell.fill = {
							type: 'pattern',
							pattern: 'solid',
							fgColor: { argb: 'ffffff' },
							bgColor: { argb: 'ffffff' },
						};
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
						cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
					}
				});
			}
		});
		const obj3: any = {};
		obj3['subject_name'] = 'Grand Total';
		obj3['count'] = this.dataArr.map(t => t['count']).reduce((acc, val) => acc + val, 0);
		obj3['subject_id'] = this.dataArr.map(t => t['subject_id']).reduce((acc, val) => acc + val, 0);
		obj3['countYear'] = this.dataArr.map(t => t['countYear']).reduce((acc, val) => acc + val, 0);
		obj3['deviation'] = '';
		obj3['remarks'] = '';
		obj3['remarks_by'] = '';
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
			head: [['Syllabus Progress Report of ' + this.getClassName(this.progressReportForm.value.syl_class_id) + '-' +
				this.getSectionName(this.progressReportForm.value.syl_section_id)]],
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

	// get user name and login id
	getUserName() {
		this.smartService.getUserName()
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						for (const citem of result.data) {
							this.UserArray[citem.au_login_id] = citem.au_full_name;
						}
					}
				});
	}
	// delete remark entry from database
	deleteremark($event) {
		if ($event) {
			const param: any = {};
			param.rm_tt_id = $event.tt_id;
			param.rm_subject_id = $event.sub_id;
			this.smartService.deleteProgressReportRemarks(param)
				.subscribe(
					(result: any) => {
						if (result && result.status === 'ok') {
							this.fetchDetails();
							this.commonService.showSuccessErrorMessage('Remark deleted Successfully', 'success');
						}
					});
		}
	}
	// get background color according to value range
	getcolor(value) {
		if (Number(value) === 0) {
			return '#ffffff';
		} else if (Number(value) > 0) {
			return '#28a7456b';
		} else {
			return '#dc3545a6';
		}
	}
	// add remarks to database
	addremark($event) {
		if ($event) {
			const param: any = {};
			param.rm_tt_id = $event.tt_id;
			param.rm_subject_id = $event.sub_id;
			param.rm_remark = $event.remark;
			param.rm_created_by = this.currentUser.login_id;
			this.smartService.getProgressReportRemarks(param).subscribe((remark_r: any) => {
				if (remark_r && remark_r.status === 'ok') {
					this.smartService.updateProgressReportRemarks(param)
						.subscribe(
							(result: any) => {
								if (result && result.status === 'ok') {
									this.fetchDetails();
									this.commonService.showSuccessErrorMessage('Remark Updated Successfully', 'success');
								}
							});
				} else {
					this.smartService.insertProgressReportRemarks(param)
						.subscribe(
							(result: any) => {
								if (result && result.status === 'ok') {
									this.fetchDetails();
									this.commonService.showSuccessErrorMessage('Remark added Successfully', 'success');
								}
							});
				}

			});

		}
	}
	// fetch details for table
	fetchDetails() {
		this.totalAvailable = 0;
		this.totalCompletion = 0;
		this.totalAvailed = 0;
		this.headerDivFlag = true;
		this.finalDivFlag = true;
		this.subCountArray = [];
		this.remarkArray = [];
		this.createdByArray = [];
		this.periodCompletionArray = [];
		const timetableparam: any = {};
		timetableparam.tt_class_id = this.progressReportForm.value.syl_class_id;
		timetableparam.tt_section_id = this.progressReportForm.value.syl_section_id;
		this.smartService.getTimeTableId(timetableparam)
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.tt_id = result.data[0].tt_id;
						if (result.data[0].tt_id !== '') {
							const param: any = {};
							param.rm_tt_id = this.tt_id;
							this.smartService.getProgressReportRemarks(param).subscribe((remark_r: any) => {
								if (remark_r && remark_r.status === 'ok') {
									for (const citem of remark_r.data) {
										this.remarkArray[citem.rm_subject_id] = citem.rm_remark;
										this.createdByArray[citem.rm_subject_id] = citem.rm_created_by;
									}
								}
							});
							const dateParam: any = {};
							dateParam.datefrom = this.currentYear + '-' + this.startMonth + '-1';
							dateParam.dateyear = this.nextYear + '-' + this.endMonth + '-31';
							dateParam.dateto = this.commonService.dateConvertion(this.todaydate);
							dateParam.class_id = this.progressReportForm.value.syl_class_id;
							dateParam.td_tt_id = result.data[0].tt_id;
							dateParam.sec_id = this.progressReportForm.value.syl_section_id;
							this.smartService.cwSyllabusProgessReport(dateParam).subscribe((cwSyllabus_r: any) => {
								if (cwSyllabus_r && cwSyllabus_r.status === 'ok') {
									for (const citem of cwSyllabus_r.data) {
										this.totalAvailed = this.totalAvailed + Number(citem.cw_period_req);
										this.periodCompletionArray[citem.cw_sub_id] = citem.cw_period_req;
									}
								}
							});
							this.smartService.syllabusProgessReport(dateParam).subscribe((report_r: any) => {
								if (report_r && report_r.status === 'ok') {
									this.classwisetableArray = [];
									this.finalArray = [];
									Object.keys(report_r.data).forEach(key => {
										if (key !== '-') {
											this.classwisetableArray.push({
												sub_id: key,
												dataArr: report_r.data[key]
											});
										}
									});
									for (const item of this.classwisetableArray) {
										for (const titem of item.dataArr) {
											const findex = this.subCountArray.findIndex(f => f.subject_name === titem.subject_name);
											if (findex === -1) {
												if (titem.day !== '-') {
													this.totalCompletion = this.totalCompletion + titem.count * titem.daycount;
													this.totalAvailable = this.totalAvailable + titem.count * titem.daycountYear;
													this.subCountArray.push({
														'subject_id': titem.subject_id,
														'subject_name': titem.subject_name,
														'count': titem.count * titem.daycount,
														'countYear': titem.count * titem.daycountYear,
													});
												}
											} else {
												this.subCountArray[findex].count = this.subCountArray[findex].count + titem.count * titem.daycount;
												this.subCountArray[findex].countYear = this.subCountArray[findex].countYear + titem.count * titem.daycountYear;
												this.totalCompletion = this.totalCompletion + titem.count * titem.daycount;
												this.totalAvailable = this.totalAvailable + titem.count * titem.daycountYear;
											}
										}

									}
									this.dataArr = [];
									for (const item of this.subCountArray) {
										const obj: any = {};
										obj['subject_name'] = item.subject_name;
										obj['count'] = item.count;
										if (this.periodCompletionArray[Number(item.subject_id)]) {
											obj['subject_id'] = Number(this.periodCompletionArray[Number(item.subject_id)]);
										} else {
											obj['subject_id'] = 0;
										}
										obj['countYear'] = item.countYear - item.count;
										if (this.periodCompletionArray[Number(item.subject_id)]) {
											obj['deviation'] = Number(item.count) - Number(this.periodCompletionArray[Number(item.subject_id)]);
										} else {
											obj['deviation'] = Number(item.count);
										}
										if (this.remarkArray[Number(item.subject_id)]) {
											obj['remarks'] = new CapitalizePipe().transform(this.remarkArray[Number(item.subject_id)]);
										} else {
											obj['remarks'] = '-';
										}
										if (this.createdByArray[Number(item.subject_id)] === this.currentUser.login_id) {
											obj['remarks_by'] = '-';
										} else {
											obj['remarks_by'] = new TitleCasePipe().transform(this.UserArray[this.createdByArray[Number(item.subject_id)]]);
										}
										this.dataArr.push(obj);
									}
									this.finalDivFlag = false;
								}
							});
						}
					} else {
						this.commonService.showSuccessErrorMessage('No Record Found', 'error');
					}
				});
	}

}

