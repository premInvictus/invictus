import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TitleCasePipe } from '@angular/common';
import { CommonAPIService, SisService, AxiomService, SmartService } from '../../_services';
import * as XLSX from 'xlsx';
declare var require;
import * as Excel from 'exceljs/dist/exceljs';
const jsPDF = require('jspdf');
import 'jspdf-autotable';
import { saveAs } from 'file-saver';
import { CapitalizePipe } from '../../../../../fee/src/app/_pipes';

@Component({
	selector: 'app-subject-period-counter',
	templateUrl: './subject-period-counter.component.html',
	styleUrls: ['./subject-period-counter.component.css']
})
export class SubjectPeriodCounterComponent implements OnInit {

	finalDivFlag = false;
	defaultFlag = true;
	toMin = new Date();
	subjectPeriodForm: FormGroup;
	classArray: any[];
	sectionArray: any[];
	subjectArray: any[];
	classwiseArray: any[] = [];
	classwisetableArray: any[] = [];
	daywisetableArray: any[] = [];
	periodWiseArray: any[] = [];
	subCountArray: any[] = [];
	weekCounterArray: any[] = [];
	subjectCountArray: any[] = [];
	finalCountArray: any[] = [];
	finalArr: any[] = [];
	sessionArray: any[] = [];
	currentUser: any;
	session: any;
	toDate: any;
	fromDate: any;
	sum = 0;
	monday = 0;
	tuesday = 0;
	wednesday = 0;
	thursday = 0;
	friday = 0;
	saturday = 0;
	sunday = 0;
	overallTotal = 0;
	schoolInfo: any = {};
	sessionName: any;
	length: any;
	period = 0;
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
	constructor(
		private fbuild: FormBuilder,
		private smartService: SmartService,
		public commonService: CommonAPIService,
		public axiomService: AxiomService,
		public sisService: SisService,
	) {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.session = JSON.parse(localStorage.getItem('session'));
	}
	ngOnInit() {
		this.buildForm();
		this.getSession();
		this.getSchool();
	}
	buildForm() {
		this.subjectPeriodForm = this.fbuild.group({
			sc_from: '',
			sc_to: '',
			tt_class_id: '',
			tt_section_id: '',
			tt_subject_id: '',
		});
	}
	// set minimum date for from date
	setMinTo(event) {
		this.toMin = event.value;
	}
	//  Get Class List function
	getClass() {
		const classParam: any = {};
		classParam.role_id = this.currentUser.role_id;
		classParam.login_id = this.currentUser.login_id;
		classParam.class_status = '1';
		this.smartService.getClass(classParam)
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.classArray = result.data;

					} else {
						this.classArray = [];
					}
				}
			);
	}
	// get section list according to selected class
	getSectionsByClass() {
		this.finalCountArray = [];
		this.defaultFlag = true;
		this.finalDivFlag = false;
		this.subjectPeriodForm.patchValue({
			'tt_section_id': ''
		});
		const sectionParam: any = {};
		sectionParam.class_id = this.subjectPeriodForm.value.tt_class_id;
		this.smartService.getSectionsByClass(sectionParam)
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.sectionArray = result.data;
						this.getSubjectsByClass();
					} else {
						this.sectionArray = [];
					}
				}
			);
	}
	// get subject list according to selected class
	getSubjectsByClass() {
		const subjectParam: any = {};
		subjectParam.class_id = this.subjectPeriodForm.value.tt_class_id;
		this.smartService.getSubjectsByClass(subjectParam)
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.subjectArray = result.data;
					} else {
						this.subjectArray = [];
					}
				}
			);
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
	// get session year of the selected session
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
	getSchool() {
		this.sisService.getSchool().subscribe((res: any) => {
			if (res && res.status === 'ok') {
				this.schoolInfo = res.data[0];
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
		reportType2 = new TitleCasePipe().transform('class wise timetable _') + this.sessionName;
		reportType = new TitleCasePipe().transform('class wise timetable report: ') + this.sessionName;
		const fileName = reportType + '.xlsx';
		const workbook = new Excel.Workbook();
		const worksheet = workbook.addWorksheet(reportType, { properties: { showGridLines: true } },
			{ pageSetup: { fitToWidth: 7 } });
		worksheet.mergeCells('A1:' + this.alphabetJSON[7] + '1');
		worksheet.getCell('A1').value =
			new TitleCasePipe().transform(this.schoolInfo.school_name) + ', ' + this.schoolInfo.school_city + ', ' + this.schoolInfo.school_state;
		worksheet.getCell('A1').alignment = { horizontal: 'left' };
		worksheet.mergeCells('A2:' + this.alphabetJSON[7] + '2');
		worksheet.getCell('A2').value = reportType;
		worksheet.getCell(`A2`).alignment = { horizontal: 'left' };
		worksheet.getCell('A4').value = 'Subject';
		worksheet.getCell('B4').value = 'Monday';
		worksheet.getCell('C4').value = 'Tuesday';
		worksheet.getCell('D4').value = 'Wednesday';
		worksheet.getCell('E4').value = 'Thursday';
		worksheet.getCell('F4').value = 'Friday';
		worksheet.getCell('G4').value = 'Saturday';
		worksheet.getCell('H4').value = 'Sunday';
		worksheet.getCell('I4').value = 'Total';
		worksheet.columns = columns;
		this.length = worksheet._rows.length;
		for (const item of this.daywisetableArray) {
			const prev = this.length + 1;
			const obj: any = {};
			this.length++;
			const periodcount = this.period++;
			worksheet.getCell('A' + this.length).value = this.getSubjectName(item.sub_id);
			for (const dety of item.dataArr) {
				if (dety.day_id === 1) {
					if (dety.day !== '-') {
						worksheet.getCell('B' + this.length).value = Number(dety.count) * Number(this.weekCounterArray[dety.day]);
					} else {
						worksheet.getCell('B' + this.length).value = '-';
					}

				} else if (dety.day_id === 2) {
					if (dety.day !== '-') {
						worksheet.getCell('C' + this.length).value = Number(dety.count) * Number(this.weekCounterArray[dety.day]);
					} else {
						worksheet.getCell('C' + this.length).value = '-';
					}
				} else if (dety.day_id === 3) {
					if (dety.day !== '-') {
						worksheet.getCell('D' + this.length).value = Number(dety.count) * Number(this.weekCounterArray[dety.day]);
					} else {
						worksheet.getCell('D' + this.length).value = '-';
					}
				} else if (dety.day_id === 4) {
					if (dety.day !== '-') {
						worksheet.getCell('E' + this.length).value = Number(dety.count) * Number(this.weekCounterArray[dety.day]);
					} else {
						worksheet.getCell('E' + this.length).value = '-';
					}
				} else if (dety.day_id === 5) {
					if (dety.day !== '-') {
						worksheet.getCell('F' + this.length).value = Number(dety.count) * Number(this.weekCounterArray[dety.day]);
					} else {
						worksheet.getCell('F' + this.length).value = '-';
					}
				} else if (dety.day_id === 6) {
					if (dety.day !== '-') {
						worksheet.getCell('G' + this.length).value = Number(dety.count) * Number(this.weekCounterArray[dety.day]);
					} else {
						worksheet.getCell('G' + this.length).value = '-';
					}
				} else if (dety.day_id === 7) {
					if (dety.day !== '-') {
						worksheet.getCell('H' + this.length).value = Number(dety.count) * Number(this.weekCounterArray[dety.day]);
					} else {
						worksheet.getCell('H' + this.length).value = '-';
					}
				}
			}
			worksheet.getCell('I' + this.length).value = this.getExcelSum(item.dataArr);
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
			if (rowNum === 4) {
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
			if (rowNum >= 5 && rowNum <= worksheet._rows.length) {
				row.eachCell(cell => {
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
					cell.alignment = { horizontal: 'center', vertical: 'top', wrapText: true };
				});
			}
		});
		const lengthFinal = Number(this.length) + 1;
		worksheet.getCell('A' + lengthFinal).value = 'Grand Total';
		worksheet.getCell('B' + lengthFinal).value = this.monday;
		worksheet.getCell('C' + lengthFinal).value = this.tuesday;
		worksheet.getCell('D' + lengthFinal).value = this.wednesday;
		worksheet.getCell('E' + lengthFinal).value = this.thursday;
		worksheet.getCell('F' + lengthFinal).value = this.friday;
		worksheet.getCell('G' + lengthFinal).value = this.saturday;
		worksheet.getCell('H' + lengthFinal).value = this.sunday;
		worksheet.getCell('I' + lengthFinal).value = this.overallTotal;
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
		const res = this.finalArr.map((f) => f[id] !== '-' && f[id] ? f[id].toString().length : 1);
		const max2 = header.toString().length;
		const max = Math.max.apply(null, res);
		return max2 > max ? max2 : max;
	}
	// pdf download
	pdfDownload() {
		const doc = new jsPDF('landscape');
		doc.autoTable({
			head: [['Period Wise Summary Of Class ' + this.getClassName(this.subjectPeriodForm.value.tt_class_id) + '-' +
				this.getSectionName(this.subjectPeriodForm.value.tt_section_id)]],
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
			html: '#periodwise_table',
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
		doc.autoTable({
			head: [['Day Wise Summary Of Class ' + this.getClassName(this.subjectPeriodForm.value.tt_class_id) + '-' +
				this.getSectionName(this.subjectPeriodForm.value.tt_section_id)]],
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
			html: '#daywise_table',
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
		doc.autoTable({
			head: [['Subject Wise Summary Of Class ' + this.getClassName(this.subjectPeriodForm.value.tt_class_id) + '-' +
				this.getSectionName(this.subjectPeriodForm.value.tt_section_id)]],
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
			html: '#subjectwise_table',
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
		doc.save('subject-period-counter_' + (new Date).getTime() + '.pdf');
	}
	// get sum of total count of subject in week
	getSum(dety, index, sub_id) {
		this.sum = 0;
		this.subjectCountArray = [];
		for (const titem of dety) {
			if (titem.day !== '-') {
				this.sum = this.sum + (Number(titem.count) * Number(this.weekCounterArray[titem.day]));
			}
		}
		const findex = this.subjectCountArray.findIndex(f => Number(f.id) === Number(index));
		if (findex === -1) {
			this.subjectCountArray.push({
				id: index,
				sub_name: sub_id,
				count: this.sum
			});
		}
		for (const citem of this.subjectCountArray) {
			this.finalCountArray[citem.sub_name] = citem.count;
		}
		return this.sum;
	}
	// get sum of total count of subject in week
	getExcelSum(dety) {
		this.sum = 0;
		for (const titem of dety) {
			if (titem.day !== '-') {
				this.sum = this.sum + (Number(titem.count) * Number(this.weekCounterArray[titem.day]));
			}
		}
		return this.sum;
	}
	// get class wise details
	getclasswisedetails() {
		this.daywisetableArray = [];
		this.subCountArray = [];
		this.classwisetableArray = [];
		this.fromDate = this.commonService.dateConvertion(this.subjectPeriodForm.value.sc_from);
		this.toDate = this.commonService.dateConvertion(this.subjectPeriodForm.value.sc_to);
		if (this.fromDate === null) {
			this.commonService.showSuccessErrorMessage('Please Select from Date', 'error');
			return false;
		}
		const dateParam: any = {};
		dateParam.datefrom = this.fromDate;
		dateParam.dateto = this.toDate;
		dateParam.class_id = this.subjectPeriodForm.value.tt_class_id;
		this.smartService.GetHolidayDays(dateParam).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.periodWiseArray = result.data;
				this.weekCounterArray = result.data.weekcountArray;
			}
		});
		const timetableparam: any = {};
		timetableparam.tt_class_id = this.subjectPeriodForm.value.tt_class_id;
		timetableparam.tt_section_id = this.subjectPeriodForm.value.tt_section_id;
		this.smartService.getTimeTableId(timetableparam)
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.finalDivFlag = true;
						this.defaultFlag = false;
						const param: any = {};
						param.td_tt_id = result.data[0].tt_id;
						if (param.td_tt_id !== '') {
							this.smartService.getClasswiseDetails(param)
								.subscribe(
									(final_result: any) => {
										if (final_result && final_result.status === 'ok') {
											this.classwisetableArray = [];
											this.classwiseArray = [];
											this.classwiseArray = final_result.data;
											for (let i = 0; i < this.classwiseArray.length; i++) {
												this.classwisetableArray.push({
													'classwise': JSON.parse(this.classwiseArray[i].td_no_of_day)
												});
											}
											for (const item of this.classwisetableArray) {
												for (const titem of item.classwise) {
													const findex = this.subCountArray.findIndex(f => f.subject_name === titem.subject_name);
													if (findex === -1) {
														if (titem.subject_id !== '-') {
															this.subCountArray.push({
																'subject_name': titem.subject_name,
																'subject_id': titem.subject_id,
																'count': 1,
																'day': titem.day,
															});
														}
													} else {
														this.subCountArray[findex].count = this.subCountArray[findex].count + 1;

													}
												}
											}
											const periodCounter: any = {};
											periodCounter.td_tt_id = param.td_tt_id;
											periodCounter.class_id = this.subjectPeriodForm.value.tt_class_id;
											this.smartService.subjectPeriodCounter(periodCounter).subscribe((periodCounter_result: any) => {
												if (periodCounter_result && periodCounter_result.status === 'ok') {
													Object.keys(periodCounter_result.data).forEach(key => {
														if (key !== '-') {
															this.daywisetableArray.push({
																sub_id: key,
																dataArr: periodCounter_result.data[key]
															});
														}
													});
													console.log(this.daywisetableArray);
													for (const item of this.daywisetableArray) {
														for (const titem of item.dataArr) {
															this.finalArr.push(titem);
															if (titem.day !== '-') {
																this.overallTotal = this.overallTotal + (Number(titem.count) * Number(this.weekCounterArray[titem.day]));
															}
															if (titem.day === 'Monday') {
																this.monday = this.monday + (Number(titem.count) * Number(this.weekCounterArray[titem.day]));
															}
															if (titem.day === 'Tuesday') {
																this.tuesday = this.tuesday + (Number(titem.count) * Number(this.weekCounterArray[titem.day]));
															}
															if (titem.day === 'Wednesday') {
																this.wednesday = this.wednesday + (Number(titem.count) * Number(this.weekCounterArray[titem.day]));
															}
															if (titem.day === 'Thursday') {
																this.thursday = this.thursday + (Number(titem.count) * Number(this.weekCounterArray[titem.day]));
															}
															if (titem.day === 'Friday') {
																this.friday = this.friday + (Number(titem.count) * Number(this.weekCounterArray[titem.day]));
															}
															if (titem.day === 'Saturday') {
																this.saturday = this.saturday + (Number(titem.count) * Number(this.weekCounterArray[titem.day]));
															}
															if (titem.day === 'Sunday') {
																this.sunday = this.sunday + (Number(titem.count) * Number(this.weekCounterArray[titem.day]));
															}
														}
													}
												}
											});
										}
									});

						}
					} else {
						this.commonService.showSuccessErrorMessage('No Record Found', 'error');
					}
				});

	}
}
