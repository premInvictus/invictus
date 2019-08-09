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
	selector: 'app-comparitive',
	templateUrl: './comparitive.component.html',
	styleUrls: ['./comparitive.component.css']
})
export class ComparitiveComponent implements OnInit {

	editRequestFlag = false;
	finalDivFlag = true;
	headerDivFlag = false;
	comparitiveForm: FormGroup;
	todaydate = new Date();
	classArray: any[];
	subjectArray: any[];
	finalSyllabusArray: any[];
	topicArray: any[];
	subtopicArray: any[];
	sectionArray: any[];
	finalSpannedArray: any[] = [];
	dataArr: any[] = [];
	sessionArray: any[] = [];
	param: any = {};
	publishParam: any = {};
	editParam: any = {};
	processType: any = {};
	syl_id: any;
	currentUser: any;
	session_id: any;
	toDate: any;
	fromDate: any;
	teachingSum = 0;
	cwteachingSum = 0;
	testSum = 0;
	cwtestSum = 0;
	revisionSum = 0;
	cwrevisionSum = 0;
	deviationSum = 0;
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
	schoolInfo: any;
	constructor(
		public dialog: MatDialog,
		private fbuild: FormBuilder,
		private syllabusService: SmartService,
		public commonService: CommonAPIService,
		public axiomService: AxiomService,
		public sisService: SisService,
	) {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.session_id = JSON.parse(localStorage.getItem('session'));
	}
	buildForm() {
		this.comparitiveForm = this.fbuild.group({
			sc_from: '',
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
		this.comparitiveForm.patchValue({
			'syl_sub_id': ''
		});
	}
	// get section list according to selected class
	getSectionsByClass() {
		this.comparitiveForm.patchValue({
			'syl_section_id': '',
			'syl_sub_id': ''
		});
		const sectionParam: any = {};
		sectionParam.class_id = this.comparitiveForm.value.syl_class_id;
		this.syllabusService.getSectionsByClass(sectionParam)
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
	//  Get Subject By Class function
	getSubjectsByClass(): void {
		this.comparitiveForm.patchValue({
			'syl_sub_id': ''
		});
		this.finalSpannedArray = [];
		this.finalDivFlag = true;
		const subjectParam: any = {};
		subjectParam.class_id = this.comparitiveForm.value.syl_class_id;
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
		this.syllabusService.getTopicByClassSubject(this.comparitiveForm.value.syl_class_id, this.comparitiveForm.value.syl_sub_id)
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
						this.sessionName = this.sessionArray[this.session_id.ses_id];
					}
				});
	}
	// get end month and start month of school
	getSchool() {
		this.sisService.getSchool()
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.schoolInfo = result.data[0];
					}
				});
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
			key: 'cw_period_teacher',
			width: this.checkWidth('cw_period_teacher', 'Teaching')
		});
		columns.push({
			key: 'cw_period_test',
			width: this.checkWidth('cw_period_test', 'Test')
		});
		columns.push({
			key: 'cw_period_revision',
			width: this.checkWidth('cw_period_revision', 'Revision')
		});
		columns.push({
			key: 'total1',
			width: this.checkWidth('total1', 'Total2')
		});
		columns.push({
			key: 'deviation',
			width: this.checkWidth('deviation', 'Deviation')
		});
		columns.push({
			key: 'finaldeviation',
			width: this.checkWidth('finaldeviation', 'Deviation')
		});
		reportType2 = new TitleCasePipe().transform('comparative analysis repo_') + this.sessionName;
		reportType = new TitleCasePipe().transform('comparative analysis report: ') + this.sessionName;
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
		worksheet.mergeCells('A4:A5');
		worksheet.getCell('A4').value = 'Topic';
		worksheet.mergeCells('B4:B5');
		worksheet.getCell('B4').value = 'SubTopic';
		worksheet.mergeCells('C4:E4');
		worksheet.getCell('C4').value = 'No. of Period Required';
		worksheet.getCell('C5').value = 'Teach';
		worksheet.getCell('D5').value = 'Test';
		worksheet.getCell('E5').value = 'Revise';
		worksheet.mergeCells('F4:F5');
		worksheet.getCell('F4').value = 'Total';
		worksheet.mergeCells('G4:I4');
		worksheet.getCell('G4').value = 'No. of Period Taken To';
		worksheet.getCell('G5').value = 'Teac';
		worksheet.getCell('H5').value = 'Test';
		worksheet.getCell('I5').value = 'Revise';
		worksheet.mergeCells('J4:J5');
		worksheet.getCell('J4').value = 'Total2';
		worksheet.mergeCells('K4:L4');
		worksheet.getCell('K4').value = 'Deviation';
		worksheet.getCell('K5').value = 'Deviation 1';
		worksheet.getCell('L5').value = 'Deviation 2';
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
					worksheet.getCell('C' + this.length).value = dety.sd_period_teacher;
					worksheet.getCell('D' + this.length).value = dety.sd_period_test;
					worksheet.getCell('E' + this.length).value = dety.sd_period_revision;
					worksheet.getCell('G' + this.length).value = dety.cw_period_teacher;
					worksheet.getCell('H' + this.length).value = dety.cw_period_test;
					worksheet.getCell('I' + this.length).value = dety.cw_period_revision;
					worksheet.getCell('K' + this.length).value = dety.sd_period_req - dety.cw_period_req;
				}
				worksheet.mergeCells('A' + prev + ':' + 'A' + this.length);
				worksheet.getCell('A' + prev).value = this.getTopicName(item.sd_topic_id);
				worksheet.mergeCells('F' + prev + ':' + 'F' + this.length);
				worksheet.getCell('F' + prev).value = item.total;
				worksheet.mergeCells('J' + prev + ':' + 'J' + this.length);
				worksheet.getCell('J' + prev).value = item.total1;
				worksheet.mergeCells('L' + prev + ':' + 'L' + this.length);
				worksheet.getCell('L' + prev).value = item.total - item.total1;
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
					// tslint:disable-next-line: max-line-length
					if (cell._address.charAt(0) !== 'A' && cell._address.charAt(0) !== 'F' && cell._address.charAt(0) !== 'J' && cell._address.charAt(0) !== 'L') {
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
		obj3['cw_period_teacher'] = this.dataArr.map(t => t['cw_period_teacher']).reduce((acc, val) => Number(acc) + Number(val), 0);
		obj3['cw_period_test'] = this.dataArr.map(t => t['cw_period_test']).reduce((acc, val) => Number(acc) + Number(val), 0);
		obj3['cw_period_revision'] = this.dataArr.map(t => t['cw_period_revision']).reduce((acc, val) => Number(acc) + Number(val), 0);
		obj3['total'] = obj3['sd_period_teacher'] + obj3['sd_period_test'] + obj3['sd_period_revision'];
		obj3['total1'] = obj3['cw_period_teacher'] + obj3['cw_period_test'] + obj3['cw_period_revision'];
		obj3['deviation'] = obj3['total'] - obj3['total1'];
		obj3['finaldeviation'] = obj3['total'] - obj3['total1'];
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
			head: [['Comparative Analysis of ' + this.getClassName(this.comparitiveForm.value.syl_class_id) + '-' +
				this.getSectionName(this.comparitiveForm.value.syl_section_id) + '    Subject : ' +
				this.getSubjectName(this.comparitiveForm.value.syl_sub_id)]],
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
	// fetch syllabus details for table
	fetchSyllabusDetails() {
		this.teachingSum = 0;
		this.cwteachingSum = 0;
		this.testSum = 0;
		this.cwtestSum = 0;
		this.revisionSum = 0;
		this.cwrevisionSum = 0;
		this.deviationSum = 0;
		this.finalSpannedArray = [];
		this.finalDivFlag = false;
		this.headerDivFlag = true;
		const param: any = {};
		param.datefrom = this.commonService.dateConvertion(this.todaydate);
		param.class_id = this.comparitiveForm.value.syl_class_id;
		param.sec_id = this.comparitiveForm.value.syl_section_id;
		param.subject_id = this.comparitiveForm.value.syl_sub_id;
		this.syllabusService.getComparativeDetails(param)
			.subscribe(
				(result1: any) => {
					if (result1 && result1.status === 'ok') {
						this.getTopicByClassSubject();
						this.finalSyllabusArray = result1.data;
						for (let i = 0; i < this.finalSyllabusArray.length; i++) {
							let sd_period_teacher: any = '';
							let sd_period_test: any = '';
							let sd_period_revision: any = '';
							let cw_period_teacher: any = '';
							let cw_period_test: any = '';
							let cw_period_revision: any = '';
							if (this.finalSyllabusArray[i].sd_ctr_id === '1') {
								this.teachingSum = this.teachingSum + Number(this.finalSyllabusArray[i].sd_period_req);
								this.cwteachingSum = this.cwteachingSum + Number(this.finalSyllabusArray[i].cw_period_req);
								sd_period_teacher = this.finalSyllabusArray[i].sd_period_req;
								cw_period_teacher = this.finalSyllabusArray[i].cw_period_req;
							} else if (this.finalSyllabusArray[i].sd_ctr_id === '2') {
								this.testSum = this.testSum + Number(this.finalSyllabusArray[i].sd_period_req);
								this.cwtestSum = this.cwtestSum + Number(this.finalSyllabusArray[i].cw_period_req);
								sd_period_test = this.finalSyllabusArray[i].sd_period_req;
								cw_period_test = this.finalSyllabusArray[i].cw_period_req;
							} else {
								this.revisionSum = this.revisionSum + Number(this.finalSyllabusArray[i].sd_period_req);
								this.cwrevisionSum = this.cwrevisionSum + Number(this.finalSyllabusArray[i].cw_period_req);
								sd_period_revision = this.finalSyllabusArray[i].sd_period_req;
								cw_period_revision = this.finalSyllabusArray[i].cw_period_req;
							}
							const spannArray: any[] = [];
							spannArray.push({
								sd_topic_id: this.finalSyllabusArray[i].sd_topic_id,
								sd_st_id: this.finalSyllabusArray[i].sd_st_id,
								sd_period_req: this.finalSyllabusArray[i].sd_period_req,
								cw_period_req: this.finalSyllabusArray[i].cw_period_req,
								sd_period_teacher: sd_period_teacher,
								sd_period_test: sd_period_test,
								sd_period_revision: sd_period_revision,
								cw_period_teacher: cw_period_teacher,
								cw_period_test: cw_period_test,
								cw_period_revision: cw_period_revision,
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
								let cw_period_teacher1: any = '';
								let cw_period_test1: any = '';
								let cw_period_revision1: any = '';
								if (this.finalSyllabusArray[i].sd_topic_id === this.finalSyllabusArray[j].sd_topic_id) {
									if (this.finalSyllabusArray[j].sd_ctr_id === '1') {
										sd_period_teacher1 = this.finalSyllabusArray[j].sd_period_req;
										cw_period_teacher1 = this.finalSyllabusArray[j].cw_period_req;
									} else if (this.finalSyllabusArray[j].sd_ctr_id === '2') {
										sd_period_test1 = this.finalSyllabusArray[j].sd_period_req;
										cw_period_test1 = this.finalSyllabusArray[j].cw_period_req;
									} else {
										sd_period_revision1 = this.finalSyllabusArray[j].sd_period_req;
										cw_period_revision1 = this.finalSyllabusArray[j].cw_period_req;
									}
									spannArray.push({
										sd_topic_id: this.finalSyllabusArray[i].sd_topic_id,
										sd_st_id: this.finalSyllabusArray[j].sd_st_id,
										sd_period_req: this.finalSyllabusArray[j].sd_period_req,
										cw_period_req: this.finalSyllabusArray[j].cw_period_req,
										sd_period_teacher: sd_period_teacher1,
										sd_period_test: sd_period_test1,
										sd_period_revision: sd_period_revision1,
										sd_ctr_id: this.finalSyllabusArray[j].sd_ctr_id,
										cw_period_teacher: cw_period_teacher1,
										cw_period_test: cw_period_test1,
										cw_period_revision: cw_period_revision1,
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
									total1: this.finalSyllabusArray[i].cw_period_req,
									deviation: this.finalSyllabusArray[i].sd_period_req - this.finalSyllabusArray[i].cw_period_req,
								});
							} else {
								// tslint:disable-next-line: max-line-length
								this.finalSpannedArray[findex].total = Number(this.finalSpannedArray[findex].total) + Number(this.finalSyllabusArray[i].sd_period_req);
								// tslint:disable-next-line: max-line-length
								this.finalSpannedArray[findex].total1 = Number(this.finalSpannedArray[findex].total1) + Number(this.finalSyllabusArray[i].cw_period_req);
								// tslint:disable-next-line: max-line-length
								this.finalSpannedArray[findex].deviation = Number(this.finalSpannedArray[findex].total) - Number(this.finalSpannedArray[findex].total1);
							}
							this.dataArr = [];
							for (const item of this.finalSpannedArray) {
								const obj: any = {};
								for (const dety of item.details) {
									this.dataArr.push(dety);
								}
							}
							console.log('spanned', this.finalSpannedArray);
						}
						this.deviationSum = (this.teachingSum + this.testSum + this.revisionSum) - (this.cwteachingSum + this.cwtestSum + this.cwrevisionSum);
					} else {
						this.finalSpannedArray = [];
						this.finalDivFlag = true;
						this.commonService.showSuccessErrorMessage('No Record Found', 'error');
					}
				});

	}



}
