import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AxiomService, SisService, SmartService, CommonAPIService } from '../../_services';
import { EditClassworkModalComponent } from './edit-classwork-modal/edit-classwork-modal.component';
import * as XLSX from 'xlsx';
declare var require;
const jsPDF = require('jspdf');
import 'jspdf-autotable';

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
	constructor(
		private fbuild: FormBuilder,
		private axiomService: AxiomService,
		private sisService: SisService,
		private smartService: SmartService,
		private commonAPIService: CommonAPIService, 
		public dialog: MatDialog
	) {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
	 }

	ngOnInit() {
		this.buildForm();
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		if (this.currentUser.role_id === '3') {
			this.teacherId = this.currentUser.login_id;
			this.paramForm.patchValue({
				teacher_id: this.currentUser.login_id
			});
			this.getClasswork();
		}
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
			head: [['View Classwork']],
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
