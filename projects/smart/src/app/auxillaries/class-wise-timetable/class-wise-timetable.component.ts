import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DecimalPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { CommonAPIService, SisService, AxiomService, SmartService } from '../../_services';
import * as XLSX from 'xlsx';
declare var require;
const jsPDF = require('jspdf');
import 'jspdf-autotable';

@Component({
	selector: 'app-class-wise-timetable',
	templateUrl: './class-wise-timetable.component.html',
	styleUrls: ['./class-wise-timetable.component.css']
})
export class ClassWiseTimetableComponent implements OnInit {
	periodSup = ['st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th'];
	subjectwiseFlag = false;
	finaldivflag = true;
	excelTableFlag = false;
	public classArray: any[];
	public sectionArray: any[];
	public subjectArray: any[];
	classwiseArray: any[] = [];
	classwisetableArray: any[] = [];
	subCountArray: any[] = [];
	finalCountArray: any[] = [];
	classwiseForm: FormGroup;
	currentUser: any;
	session: any;
	noOfDay: any;
	anaimation: any;
	schoolInfo: any = {};
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
		this.getClass();
		this.getSchool();
	}
	buildForm() {
		this.classwiseForm = this.fbuild.group({
			tt_class_id: '',
			tt_section_id: '',
			tt_subject_id: '',
		});
	}

	//  Get Class List function
	getClass() {
		const classParam: any = {};
		classParam.role_id = this.currentUser.role_id;
		classParam.login_id = this.currentUser.login_id;
		this.sisService.getClass(classParam)
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.classArray = result.data;
						this.subjectwiseFlag = false;
					} else {
						this.classArray = [];
					}
				}
			);
		this.classwisetableArray = [];
		this.subCountArray = [];
		this.finalCountArray = [];
	}

	// get section list according to selected class
	getSectionsByClass() {
		this.finaldivflag = true;
		this.subjectwiseFlag = false;
		this.classwiseForm.patchValue({
			'tt_section_id': ''
		});
		const sectionParam: any = {};
		sectionParam.class_id = this.classwiseForm.value.tt_class_id;
		this.sisService.getSectionsByClass(sectionParam)
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.sectionArray = result.data;
						this.subCountArray = [];
						this.finalCountArray = [];
						this.classwisetableArray = [];
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
		subjectParam.class_id = this.classwiseForm.value.tt_class_id;
		this.axiomService.getSubjectsByClass(subjectParam)
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
		// tslint:disable-next-line:max-line-length
		const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(document.getElementById('report_table'));
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
		XLSX.writeFile(wb, 'Report_' + (new Date).getTime() + '.xlsx');
	}

	getSchool() {
		this.sisService.getSchool().subscribe((res: any) => {
			if (res && res.status === 'ok') {
				this.schoolInfo = res.data[0];
			}
		});
	}
	// pdf download
	pdfDownload() {
		const doc = new jsPDF('l', 'mm', 'a0');
		doc.autoTable({
			// tslint:disable-next-line:max-line-length
			head: [[new TitleCasePipe().transform(this.schoolInfo.school_name) + ', ' + this.schoolInfo.school_city + ', ' + this.schoolInfo.school_state]],
			didDrawPage: function (data) {

			},
			headStyles: {
				fontStyle: 'bold',
				fillColor: '#ffffff',
				textColor: 'black',
				halign: 'center',
				fontSize: 35,
			},
			useCss: true,
			theme: 'striped'
		});
		doc.autoTable({
			head: [['Class Wise Time table Of ' + this.getClassName(this.classwiseForm.value.tt_class_id) + '-' +
				this.getSectionName(this.classwiseForm.value.tt_section_id)]],
			didDrawPage: function (data) {
				doc.setFont('Roboto');
			},
			headStyles: {
				fontStyle: 'bold',
				fillColor: '#ffffff',
				textColor: 'black',
				halign: 'center',
				fontSize: 35,
			},
			useCss: false,
			theme: 'striped'
		});
		doc.autoTable({
			html: '#report_table',
			startY: 65,
			tableLineColor: 'black',
			didDrawPage: function (data) {
				doc.setFontStyle('bold');

			},
			headStyles: {
				fontStyle: 'bold',
				fillColor: '#c8d6e5',
				textColor: '#5e666d',
				fontSize: 45,
			},
			alternateRowStyles: {
				fillColor: '#f1f4f7'
			},
			useCss: false,
			styles: {
				fontSize: 35,
				cellWidth: 'auto',
				textColor: 'black',
				lineColor: '#89a8c8',
				halign: 'center'
			},
			theme: 'grid'
		});
		doc.save('classwise_timetable_' + this.getClassName(this.classwiseForm.value.tt_class_id) + '-' +
			this.getSectionName(this.classwiseForm.value.tt_section_id) + '.pdf');
	}
	// Timetable details based on class and section
	getclasswisedetails() {
		this.subCountArray = [];
		this.finalCountArray = [];
		this.classwisetableArray = [];
		const timetableparam: any = {};
		timetableparam.tt_class_id = this.classwiseForm.value.tt_class_id;
		timetableparam.tt_section_id = this.classwiseForm.value.tt_section_id;
		this.smartService.getTimeTableId(timetableparam)
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.finaldivflag = false;
						this.subjectwiseFlag = true;
						this.noOfDay = result.data[0].no_of_day;
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
											console.log(this.classwisetableArray);
											for (const item of this.classwisetableArray) {
												for (const titem of item.classwise) {
													const findex = this.subCountArray.findIndex(f => f.subject_name === titem.subject_name);
													if (findex === -1) {
														this.subCountArray.push({
															'subject_name': titem.subject_name,
															'count': 1,
														});
													} else {
														this.subCountArray[findex].count = this.subCountArray[findex].count + 1;

													}
												}
											}
											for (const citem of this.subCountArray) {
												this.finalCountArray[citem.subject_name] = citem.count;
											}
										}
									});
						}
					} else {
						this.commonService.showSuccessErrorMessage('No Record Found', 'error');
						this.finaldivflag = true;
						this.subjectwiseFlag = false;
					}
				});

	}

}
