import { Component, OnInit, ViewChild, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource, MatPaginator, PageEvent, MatSort, MatPaginatorIntl } from '@angular/material';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { TitleCasePipe } from '@angular/common';
import { AxiomService, SisService, SmartService, CommonAPIService } from '../../_services';
import { AssignmentModel } from './assignment-review.model';
import { PreviewDocumentComponent } from '../../smart-shared/preview-document/preview-document.component';
import * as XLSX from 'xlsx';
declare var require;
import * as Excel from 'exceljs/dist/exceljs';
const jsPDF = require('jspdf');
import 'jspdf-autotable';
import { saveAs } from 'file-saver';
import { CapitalizePipe } from '../../../../../fee/src/app/_pipes';
@Component({
	selector: 'app-past-assignments',
	templateUrl: './past-assignments.component.html',
	styleUrls: ['./past-assignments.component.css'],
	encapsulation: ViewEncapsulation.Emulated
})
export class PastAssignmentsComponent implements OnInit, AfterViewInit {

	paramForm: FormGroup;
	classArray: any[] = [];
	subjectArray: any[] = [];
	sectionArray: any[] = [];
	assignmentArray: any[] = [];
	toMin = new Date();
	ELEMENT_DATA: AssignmentModel[] = [];
	dataArr: any[] = [];
	sessionArray: any[] = [];
	displayedColumns = ['srno', 'class', 'subject', 'topic', 'assignment', 'entrydate', 'assignedby', 'publishedby', 'attachment'];
	dataSource = new MatTableDataSource<AssignmentModel>(this.ELEMENT_DATA);
	nodataFlag = true;
	@ViewChild('deleteModalRef') deleteModalRef;
	@ViewChild(MatPaginator) paginator: MatPaginator;
	currentUser: any = {};
	isTeacher = false;
	pageLength: number;
	pageSize = 10;
	pageSizeOptions = [5, 10, 25, 100];
	limit = this.pageSize;
	offset = 0;
	session: any;
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
		private axiomService: AxiomService,
		private sisService: SisService,
		private smartService: SmartService,
		private commonAPIService: CommonAPIService,
		public dialog: MatDialog
	) {
		this.session = JSON.parse(localStorage.getItem('session'));
	}
	ngOnInit() {
		this.buildForm();
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		if (this.currentUser.role_id === '3') {
			this.isTeacher = true;
			this.paramForm.patchValue({
				teacher_id: this.currentUser.login_id
			});
			this.getAssignment();
		}
		this.getClass();
		this.getSubject();
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
						this.schoolInfo = result.data[0];
					}
				});
	}
	ngAfterViewInit() {
		this.dataSource.paginator = this.paginator;
	}
	buildForm() {
		const from = new Date();
		from.setDate(from.getDate() - 7);
		this.paramForm = this.fbuild.group({
			teacher_name: '',
			teacher_id: '',
			from: [from, Validators.required],
			to: [new Date(), Validators.required],
			class_id: '',
			sec_id: '',
			sub_id: ''
		});
	}
	getClass() {
		this.classArray = [];
		this.smartService.getClass({class_status: '1'}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.classArray = result.data;
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}

	getSectionsByClass() {
		this.sectionArray = [];
		this.smartService.getSectionsByClass({ class_id: this.paramForm.value.class_id }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.sectionArray = result.data;
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}

	getSubjectsByClass() {
		this.subjectArray = [];
		this.paramForm.patchValue({
			sub_id: ''
		});
		this.smartService.getSubjectsByClass({ class_id: this.paramForm.value.class_id }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.subjectArray = result.data;
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}
	getSubject() {
		this.subjectArray = [];
		this.smartService.getSubject({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.subjectArray = result.data;
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}
	setMinTo(event) {
		this.toMin = event.value;
	}
	getAssignment() {
		if (this.paramForm.valid && (this.paramForm.value.class_id || this.paramForm.value.sec_id || this.paramForm.value.sub_id)) {
			this.assignmentArray = [];
			this.ELEMENT_DATA = [];
			this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
			const param = this.paramForm.value;
			if (param.from) {
				param.from = this.commonAPIService.dateConvertion(param.from);
			}
			if (param.to) {
				param.to = this.commonAPIService.dateConvertion(param.to);
			}
			param.as_status = ['1', '2']; // published or sent
			param.withDate = true;
			/* param.limit = this.limit;
			param.offset = this.offset; */
			this.smartService.getAssignment(param).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.assignmentArray = result.data;
					//console.log(result.data);
					if (this.assignmentArray.length > 0) {
						this.nodataFlag = false;
						let i = 0;
						this.assignmentArray.forEach(item => {
							if (item.as_attachment && item.as_attachment.length > 0) {
								item.as_attachment.forEach(element => {
									element.file_name = element.atmt_name;
									element.file_url = element.atmt_url;
								});
							}
							const each: any = {};
							each.srno = ++i;
							each.as_id = item.as_id;
							each.class = item.class_name + ' - ' + item.sec_name;
							each.subject = item.sub_name;
							each.topic = item.topic_name;
							each.assignment = item.as_assignment_desc;
							each.entryDate = item.as_entry_date;
							each.assignedBy = item.au_full_name;
							each.publishedBy = item.published_by;
							each.attachment = item.as_attachment.length;
							each.action = item;
							this.ELEMENT_DATA.push(each);
						});
						this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
						this.dataSource.paginator = this.paginator;
						this.pageLength = this.ELEMENT_DATA.length;
						console.log('final', this.ELEMENT_DATA);

					}
				} else {
					this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
					this.nodataFlag = true;
				}
			});
		}
	}

	resetParam() {
		this.paramForm.patchValue({
			class_id: '',
			sec_id: '',
			sub_id: ''
		});
		this.getSubject();
	}

	previewDocuments(attachmentArray) {
		if (attachmentArray && attachmentArray.length > 0) {
			const dialogRef = this.dialog.open(PreviewDocumentComponent, {
				height: '80%',
				width: '1000px',
				data: {
					index: '',
					images: attachmentArray
				}
			});
		}
	}

	doAssignmentFilter(value: string) {
		this.dataSource.filter = value.trim();
	}
	changePage(pageEvent: PageEvent) {
		console.log(pageEvent);
		// this.paginator.length = 100;
	}

	// export excel code
	exportAsExcel() {
		let reportType: any = '';
		let reportType2: any = '';
		const columns: any = [];
		columns.push({
			key: 'srno',
			width: this.checkWidth('srno', 'S.No.')
		});
		columns.push({
			key: 'class',
			width: this.checkWidth('class', 'Class')
		});
		columns.push({
			key: 'subject',
			width: this.checkWidth('subject', 'Subject')
		});
		columns.push({
			key: 'topic',
			width: this.checkWidth('topic', 'Topic')
		});
		columns.push({
			key: 'assignment',
			width: this.checkWidth('assignment', 'Assignment')
		});
		columns.push({
			key: 'entryDate',
			width: this.checkWidth('entryDate', 'Assigned On')
		});
		columns.push({
			key: 'assignedBy',
			width: this.checkWidth('assignedBy', 'Assigned By')
		});
		columns.push({
			key: 'publishedBy',
			width: this.checkWidth('publishedBy', 'Approved By')
		});
		columns.push({
			key: 'attachment',
			width: this.checkWidth('attachment', 'Attachment')
		});
		reportType2 = new TitleCasePipe().transform('past assignment repo_') + this.sessionName;
		reportType = new TitleCasePipe().transform('past assignment  report: ') + this.sessionName;
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
		worksheet.getCell('A4').value = 'S.No.';
		worksheet.getCell('B4').value = 'Class';
		worksheet.getCell('C4').value = 'Subject';
		worksheet.getCell('D4').value = 'Topic';
		worksheet.getCell('E4').value = 'Assignment';
		worksheet.getCell('F4').value = 'Assigned On';
		worksheet.getCell('G4').value = 'Assigned By';
		worksheet.getCell('H4').value = 'Approved By';
		worksheet.getCell('I4').value = 'Attachment';
		worksheet.columns = columns;
		this.length = worksheet._rows.length;
		for (const dety of this.ELEMENT_DATA) {
			const prev = this.length + 1;
			const obj: any = {};
			this.length++;
			worksheet.getCell('A' + this.length).value = dety.srno;
			worksheet.getCell('B' + this.length).value = dety.class;
			worksheet.getCell('C' + this.length).value = dety.subject;
			worksheet.getCell('D' + this.length).value = dety.topic;
			worksheet.getCell('E' + this.length).value = this.commonAPIService.htmlToText(dety.assignment);
			worksheet.getCell('F' + this.length).value = dety.entryDate;
			worksheet.getCell('G' + this.length).value = dety.assignedBy;
			worksheet.getCell('H' + this.length).value = dety.publishedBy;
			worksheet.getCell('I' + this.length).value = dety.attachment;
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
		const res = this.ELEMENT_DATA.map((f) => f[id] !== '-' && f[id] ? f[id].toString().length : 1);
		const max2 = header.toString().length;
		const max = Math.max.apply(null, res);
		return max2 > max ? max2 : max;
	}
	// pdf download
	pdfDownload() {
		const doc = new jsPDF('landscape');
		doc.autoTable({
			head: [[new TitleCasePipe().transform('past assignment  report: ') + this.sessionName]],
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


}
