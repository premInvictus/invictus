import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AxiomService, SisService, SmartService, CommonAPIService } from '../../_services';
import { EditClassworkModalComponent } from './edit-classwork-modal/edit-classwork-modal.component';
import * as XLSX from 'xlsx';
declare var require;
import * as Excel from 'exceljs/dist/exceljs';
const jsPDF = require('jspdf');
import 'jspdf-autotable';
import { TitleCasePipe, DatePipe } from '@angular/common';
import { saveAs } from 'file-saver';
import { CapitalizePipe } from '../../../../../fee/src/app/_pipes';

@Component({
	selector: 'app-view-classwork',
	templateUrl: './view-classwork.component.html',
	styleUrls: ['./view-classwork.component.css']
})
export class ViewClassworkComponent implements OnInit {

	paramForm: FormGroup;
	teacherArray: any[] = [];
	classworkArray: any[] = [];
	teacherId = '';
	currentUser: any = {};
	periodSup = ['st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th'];
	noDataFlag = true;
	toMin = new Date();
	dataArr: any[] = [];
	sessionArray: any[] = [];
	schoolInfo: any = {};
	sessionName: any;
	length: any;
	lengthArr: any;
	period = 0;
	session: any;
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
		private axiomService: AxiomService,
		private sisService: SisService,
		private smartService: SmartService,
		private commonAPIService: CommonAPIService,
		public dialog: MatDialog
	) {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.session = JSON.parse(localStorage.getItem('session'));
	}
	ngOnInit() {
		this.buildForm();
		this.getSession();
		this.getSchool();
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		if (this.currentUser.role_id === '3') {
			this.teacherId = this.currentUser.login_id;
			this.paramForm.patchValue({
				teacher_id: this.currentUser.login_id
			});
			this.getClasswork();
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
						this.schoolInfo = result.data[0];
					}
				});
	}
	openEditClassworkModal(value) {
		const dialogRef = this.dialog.open(EditClassworkModalComponent, {
			width: '600px',
			height: '420px',
			data: value
		});
		dialogRef.afterClosed().subscribe(dresult => {
			if (dresult && dresult.update) {
				if (dresult.update === 'success') {
					this.getClasswork();
				}
			}
		});
	}
	buildForm() {
		this.paramForm = this.fbuild.group({
			teacher_name: '',
			teacher_id: ['', Validators.required],
			from: [new Date(), Validators.required],
			to: [new Date(), Validators.required]
		});
	}
	setMinTo(event) {
		this.toMin = event.value;
	}
	getTeacherInfo(event) {
		console.log(event.target.value);
		this.teacherArray = [];
		if (event.target.value) {
			this.axiomService.getAllTeacher({ full_name: event.target.value, role_id: '3', status: '1' }).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.teacherArray = result.data;
					console.log(result.data);
				} else {
					this.commonAPIService.showSuccessErrorMessage(result.data, 'error');
					this.classworkArray = [];
					this.noDataFlag = true;

				}
			});
		}
	}
	setTeacherId(teacherDetails) {
		this.paramForm.patchValue({
			teacher_name: teacherDetails.au_full_name,
			teacher_id: teacherDetails.au_login_id
		});
		this.teacherId = teacherDetails.au_login_id;
		this.getClasswork();
	}

	getClassworkForDate(datestr, cwarray) {
		const tempcw: any[] = [];
		if (cwarray.length > 0) {
			cwarray.forEach(item => {
				if (this.commonAPIService.dateConvertion(item.cw_entry_date) === datestr) {
					tempcw.push(item);
				}
			});
		}
		return tempcw;
	}
	getClasswork() {
		if (this.paramForm.valid) {
			this.classworkArray = [];
			const param: any = {};
			if (this.paramForm.value.teacher_id) {
				param.teacher_id = this.paramForm.value.teacher_id;
			}
			if (this.paramForm.value.from) {
				param.from = this.commonAPIService.dateConvertion(this.paramForm.value.from);
			}
			if (this.paramForm.value.to) {
				param.to = this.commonAPIService.dateConvertion(this.paramForm.value.to);
			}
			this.smartService.getClasswork(param).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.noDataFlag = false;
					console.log(result.data);
					this.dataArr = result.data;
					const tempcw = result.data;
					const dateSet = new Set();
					if (tempcw.length > 0) {
						tempcw.forEach(element => {
							dateSet.add(this.commonAPIService.dateConvertion(new Date(element.cw_entry_date)));
							element.csName = element.sec_name ? element.class_name + '-' + element.sec_name : element.class_name;
						});
					}
					dateSet.forEach(item => {
						this.classworkArray.push({
							cw_entry_date: item,
							cw_array: this.getClassworkForDate(item, tempcw)
						});
					});
					console.log(this.classworkArray);

				} else {
					this.noDataFlag = true;
					this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
				}
			});
		} else {
			this.commonAPIService.showSuccessErrorMessage('Please select teacher name', 'error');
		}
	}

	// export excel code
	exportAsExcel() {
		let reportType: any = '';
		let reportType2: any = '';
		const columns: any = [];
		columns.push({
			key: 'cw_period_id',
			width: this.checkWidth('cw_period_id', 'Period')
		});
		columns.push({
			key: 'sub_name',
			width: this.checkWidth('sub_name', 'Subject')
		});
		columns.push({
			key: 'ctr_name',
			width: this.checkWidth('ctr_name', 'Category')
		});
		columns.push({
			key: 'class_name',
			width: this.checkWidth('class_name', 'Class')
		});
		columns.push({
			key: 'topic_name',
			width: this.checkWidth('topic_name', 'Topic')
		});
		columns.push({
			key: 'st_name',
			width: this.checkWidth('st_name', 'SubTopic')
		});
		reportType2 = new TitleCasePipe().transform('view classwork repo_') + this.sessionName;
		reportType = new TitleCasePipe().transform('view classwork report: ') + this.sessionName;
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
		worksheet.getCell('A4').value = 'Period';
		worksheet.getCell('B4').value = 'Subject';
		worksheet.getCell('C4').value = 'Category';
		worksheet.getCell('D4').value = 'Class';
		worksheet.getCell('E4').value = 'Topic';
		worksheet.getCell('F4').value = 'SubTopic';
		worksheet.columns = columns;
		this.length = worksheet._rows.length + 1;
		for (const item of this.classworkArray) {
			worksheet.mergeCells('A' + this.length + ':' + 'F' + this.length);
			worksheet.getCell('A' + this.length).value = 'As on date :' + new DatePipe('en-in').transform(item.cw_entry_date, 'd-MMM-y');
			for (const dety of item.cw_array) {
				this.length++;
				worksheet.getCell('A' + this.length).value = dety.cw_period_id + this.periodSup[dety.cw_period_id - 1];
				if (dety.sub_name !== null) {
					worksheet.getCell('B' + this.length).value = dety.sub_name;
				} else {
					worksheet.getCell('B' + this.length).value = '-';
				}
				worksheet.getCell('C' + this.length).value = dety.ctr_name;
				if (dety.class_name !== null) {
					worksheet.getCell('D' + this.length).value = dety.class_name + '-' + dety.sec_name;
				} else {
					worksheet.getCell('D' + this.length).value = '-';
				}
				if (dety.topic_name !== null) {
					worksheet.getCell('E' + this.length).value = dety.topic_name;
				} else {
					worksheet.getCell('E' + this.length).value = '-';
				}
				if (dety.st_name !== null) {
					worksheet.getCell('F' + this.length).value = dety.st_name;
				} else {
					worksheet.getCell('F' + this.length).value = '-';
				}
			}
			this.length++;
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
					if (cell._address.charAt(0) !== 'A') {
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
			// tslint:disable-next-line: max-line-length
			head: [[new TitleCasePipe().transform(this.schoolInfo.school_name) + ', ' + this.schoolInfo.school_city + ', ' + this.schoolInfo.school_state]],
			didDrawPage: function (data) {
				doc.setFont('Roboto');
			},
			headerStyles: {
				fontStyle: 'bold',
				fillColor: '#ffffff',
				textColor: 'black',
				halign: 'center',
				fontSize: 10,
			},
			useCss: true,
			theme: 'grid'
		});
		doc.autoTable({
			head: [[new TitleCasePipe().transform('view classwork report: ') + this.sessionName]],
			didDrawPage: function (data) {
				doc.setFont('Roboto');
			},
			headerStyles: {
				fontStyle: 'bold',
				fillColor: '#ffffff',
				textColor: 'black',
				halign: 'center',
				fontSize: 10,
			},
			useCss: true,
			theme: 'grid'
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

}
