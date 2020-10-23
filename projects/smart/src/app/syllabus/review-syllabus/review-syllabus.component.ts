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
	selector: 'app-review-syllabus',
	templateUrl: './review-syllabus.component.html',
	styleUrls: ['./review-syllabus.component.css']
})
export class ReviewSyllabusComponent implements OnInit {
	@ViewChild('editModal') editModal;
	@ViewChild('deleteModal') deleteModal;
	@ViewChild('publishModal') publishModal;
	public reviewForm: FormGroup;
	public classArray: any[];
	public subjectArray: any[];
	public finalSyllabusArray: any[];
	public topicArray: any[];
	public subtopicArray: any[];
	finalSpannedArray: any[] = [];
	finalSubmitArray: any[] = [];
	termsArray: any[] = [];
	dataArr: any[] = [];
	editRequestFlag = false;
	finalDivFlag = true;
	param: any = {};
	publishParam: any = {};
	editParam: any = {};
	addParam: any = {};
	processType: any = {};
	syl_id: any;
	currentUser: any;
	session: any;
	teachingSum = 0;
	testSum = 0;
	revisionSum = 0;
	sessionName: any;
	length: any;
	sessionArray: any[] = [];
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
	termArray: any[] = ['', 'Term 1', 'Term 2', 'Term 3', 'Term 4', 'Term 5', 'Term 6', 'Term 7', 'Term 8', 'Term 9'];
	disabledApiButton = false;
	constructor(
		public dialog: MatDialog,
		private fbuild: FormBuilder,
		private syllabusService: SmartService,
		public commonService: CommonAPIService,
		public axiomService: AxiomService,
		public sisService: SisService,
	) {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.session = JSON.parse(localStorage.getItem('session'));
	}

	// Edit dialod open modal function
	openEditDialog(sd_id) {
		this.editParam.sd_id = sd_id;
		this.editParam.text = 'Edit';
		this.editModal.openEditModal(this.editParam);
	}
	openAddDialog(syl_id, topic_id) {
		this.addParam.syl_id = syl_id;
		this.addParam.topic_id = topic_id;
		this.addParam.text = 'Add';
		this.editModal.openEditModal(this.addParam);
	}
	// delete dialog open modal function
	openModal(i, j, sd_id) {
		this.param.indexi = i;
		this.param.indexj = j;
		this.param.sd_id = sd_id;
		this.param.text = 'Delete';
		this.deleteModal.openModal(this.param);
	}

	// Publish dialog open modal function
	openPublish(syl_id, topic_id) {
		this.publishParam.syl_id = syl_id;
		this.publishParam.topic_id = topic_id;
		this.publishModal.openpublishModal(this.publishParam);
	}
	buildForm() {
		this.reviewForm = this.fbuild.group({
			syl_class_id: '',
			syl_sub_id: '',
			syl_term_id: ''
		});
	}
	ngOnInit() {
		this.buildForm();
		this.getClass();
		this.getSession();
		this.getSchool();
		if (this.syllabusService.getProcesstype()) {
			this.processType = this.syllabusService.getProcesstype();
			this.reviewForm.patchValue({
				'syl_class_id': this.processType.class_id,
				'syl_sub_id': this.processType.sub_id,
			});
			this.getSubjectsByClass();
			this.fetchSyllabusDetails();
		}
	}
	getClassTerm() {
		this.termsArray = [];
		this.commonService.getClassTerm({ class_id: this.reviewForm.value.syl_class_id }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				result.data.ect_no_of_term.split(',').forEach(element => {
					this.termsArray.push({ id: element, name: result.data.ect_term_alias + ' ' + element });
				});
			} else {
				// this.commonAPIService.showSuccessErrorMessage(result.message, 'error'); 
			}
		});
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
	}

	//  Get Subject By Class function
	getSubjectsByClass(): void {
		this.reviewForm.patchValue({
			'syl_sub_id': ''
		});
		this.finalSpannedArray = [];
		const subjectParam: any = {};
		this.finalDivFlag = true;
		subjectParam.class_id = this.reviewForm.value.syl_class_id;
		subjectParam.sub_timetable=1;
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
		this.syllabusService.getTopicByClassSubject(this.reviewForm.value.syl_class_id, this.reviewForm.value.syl_sub_id)
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
		reportType2 = new TitleCasePipe().transform('review syllabus repo_') + this.sessionName;
		reportType = new TitleCasePipe().transform('review syllabus report: ') + this.sessionName;
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
					if (cell._address.charAt(0) !== 'A' && cell._address.charAt(0) !== 'G') {
						cell.fill = {
							type: 'pattern',
							pattern: 'solid',
							fgColor: { argb: 'ffffff' },
							bgColor: { argb: 'ffffff' },
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
			head: [['Review Syllabus Of Class : ' + this.getClassName(this.reviewForm.value.syl_class_id) + '    Subject : ' +
				this.getSubjectName(this.reviewForm.value.syl_sub_id)]],
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

	// delete syllabus list from database function
	deleteSyllabusList($event) {
		if ($event) {
			if (this.finalSpannedArray[this.param.indexi].details.length > 1) {
				this.finalSpannedArray[this.param.indexi].details.splice(this.param.indexj, 1);
			} else {
				this.finalSpannedArray.splice(this.param.indexi, 1);
			}
			this.finalSyllabusArray.splice(this.param.indexi, 1);
			const param: any = {};
			param.sd_id = this.param.sd_id;
			param.sd_status = '5';
			this.syllabusService.deleteSyllabusDetails(param)
				.subscribe(
					(result: any) => {
						if (result && result.status === 'ok') {
							this.fetchSyllabusDetails();
							this.commonService.showSuccessErrorMessage('Syllabus List Deleted Successfully', 'success');
						}
					});
		}
	}

	// publish syllabus list
	insertPublishSyllabus($event) {
		this.disabledApiButton = true;
		if ($event) {
			const publishParam: any = {};
			publishParam.sd_syl_id = this.publishParam.syl_id;
			publishParam.sd_topic_id = this.publishParam.topic_id;
			publishParam.sd_status = '1';
			this.syllabusService.updatePublishStatus(publishParam)
				.subscribe(
					(result: any) => {
						this.disabledApiButton = false;
						if (result && result.status === 'ok') {
							const param: any = {};
							param.mod_review_row_id = publishParam.sd_syl_id + '-' + publishParam.sd_topic_id;
							param.mod_review_by = this.currentUser.login_id;
							param.mod_review_status = '1';
							param.mod_title = '1';
							param.mod_project_id = '4';
							this.syllabusService.insertPublishSyllabus(param)
								.subscribe(
									(publishResult: any) => {
										this.disabledApiButton = false;
										if (publishResult && publishResult.status === 'ok') {
											this.fetchSyllabusDetails();
											this.commonService.showSuccessErrorMessage('Syllabus Publish Successfully', 'success');
										}
									});
						}
					});
		}
	}
	// Add syllabus
	addSyllabussEdit($event) {
		if ($event) {
			if ($event.sd_st_id === '') {
				$event.sd_st_id = '0';
			}
			this.finalSubmitArray.push({
				sd_syl_id: $event.syl_id,
				sd_ses_id: this.session.ses_id,
				sd_created_by: this.currentUser.login_id,
				sd_ctr_id: $event.sd_ctr_id,
				sd_topic_id: $event.topic_id,
				sd_period_req: $event.sd_period_req,
				sd_st_id: $event.sd_st_id,
				sd_desc: $event.sd_desc
			});
			this.syllabusService.insertSyllabusDetails(this.finalSubmitArray).subscribe((result1: any) => {
				if (result1 && result1.status === 'ok') {
					this.finalSubmitArray = [];
					this.fetchSyllabusDetails();
					this.commonService.showSuccessErrorMessage('Syllabus Added  Successfully', 'success');
				}
			});
		}
	}
	// updtae syllabus list function
	updateSyllabussEdit($event) {
		if ($event) {
			const param: any = {};
			param.sd_id = this.editParam.sd_id;
			param.sd_period_req = this.editParam.sd_period_req;
			param.sd_desc = this.editParam.sd_desc;
			this.syllabusService.updateSyllabusEditDetails(param)
				.subscribe(
					(result: any) => {
						if (result && result.status === 'ok') {
							this.fetchSyllabusDetails();
							this.commonService.showSuccessErrorMessage('Syllabus List Updated Successfully', 'success');
						}
					});
		}
	}
	// fetch syllabus details for table
	fetchSyllabusDetails() {
		this.teachingSum = 0;
		this.testSum = 0;
		this.revisionSum = 0;
		this.syllabusService.getSylIdByClassSubject(this.reviewForm.value)
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.finalDivFlag = false;
						this.getTopicByClassSubject();
						const param: any = {};
						param.syl_id = result.data[0].syl_id;
						param.sd_status = 0;
						this.reviewForm.value.sd_status = 0;
						if (param.syl_id !== '') {
							this.syllabusService.getSyllabusDetails(this.reviewForm.value)
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
													syl_term_id: this.finalSyllabusArray[i].syl_term_id,
													sd_topic_name: this.finalSyllabusArray[i].topic_name,
													sd_st_name: this.finalSyllabusArray[i].st_name,
													sd_id: this.finalSyllabusArray[i].sd_id,
													au_full_name: this.finalSyllabusArray[i].au_full_name,
													sd_unpublish_remark: this.finalSyllabusArray[i].sd_unpublish_remark,
													sd_unpublish_reason_id: this.finalSyllabusArray[i].sd_unpublish_reason_id,
												});
												for (let j = i + 1; j < this.finalSyllabusArray.length; j++) {
													let sd_period_teacher1: any = '';
													let sd_period_test1: any = '';
													let sd_period_revision1: any = '';
													if (this.finalSyllabusArray[i].sd_topic_id === this.finalSyllabusArray[j].sd_topic_id &&
														this.finalSyllabusArray[i].syl_term_id === this.finalSyllabusArray[j].syl_term_id) {
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
															syl_term_id: this.finalSyllabusArray[j].syl_term_id,
															sd_topic_name: this.finalSyllabusArray[j].topic_name,
															sd_st_name: this.finalSyllabusArray[j].st_name,
															sd_id: this.finalSyllabusArray[j].sd_id,
															au_full_name: this.finalSyllabusArray[i].au_full_name,
															sd_unpublish_remark: this.finalSyllabusArray[i].sd_unpublish_remark,
															sd_unpublish_reason_id: this.finalSyllabusArray[i].sd_unpublish_reason_id,
														});
													}
												}
												const findex = this.finalSpannedArray.findIndex(f => f.sd_topic_id === this.finalSyllabusArray[i].sd_topic_id
													&& f.syl_term_id === this.finalSyllabusArray[i].syl_term_id);
												if (findex === -1) {
													this.finalSpannedArray.push({
														syl_term_id: this.finalSyllabusArray[i].syl_term_id,
														sd_topic_id: this.finalSyllabusArray[i].sd_topic_id,
														details: spannArray,
														total: this.finalSyllabusArray[i].sd_period_req,
														syl_id: this.finalSyllabusArray[i].sd_syl_id,
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
										} else {
											this.finalSpannedArray = [];
											this.finalDivFlag = true;
											this.commonService.showSuccessErrorMessage('No Record Found', 'error');
										}
									});
						}
					} else {
						this.finalSpannedArray = [];
						this.finalDivFlag = true;
						this.commonService.showSuccessErrorMessage('No Record Found', 'error');
					}
				}
			);

	}


}
