import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonAPIService, SisService, AxiomService, SmartService } from '../../_services';
import * as XLSX from 'xlsx';

@Component({
	selector: 'app-time-table',
	templateUrl: './time-table.component.html',
	styleUrls: ['./time-table.component.css']
})
export class TimeTableComponent implements OnInit {
	sampleTimeTableFlag = false;
	excelFlag = false;
	uploadTimeTableFlag = true;
	public uploadTimeTableForm: FormGroup;
	public classArray: any[];
	public sectionArray: any[];
	sampleTimeTableArray: any[] = [];
	finalXlslArray: any[] = [];
	finalSubmitArray: any[] = [];
	XlslArray: any[] = [];
	finalperiodArray: any[] = [];
	finalTimeTableArray: any[] = [];
	arrayBuffer: any;
	file: any;
	currentUser: any;
	session: any;
	monday: any;
	tuesday: any;
	wednesday: any;
	thursday: any;
	friday: any;
	saturday: any;
	sunday: any;
	noOFPeriod: any;
	classId: any;
	sectionId: any;
	noOfDay: any;
	period: any;
	tt_id: any;

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

	ngOnInit() {
		this.buildForm();
		this.getClass();
	}
	buildForm() {
		this.uploadTimeTableForm = this.fbuild.group({
			tt_class_id: '',
			tt_section_id: '',
			no_of_day: '',
			no_of_period: '',
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
					}
				}
			);
	}
	getSectionsByClass() {
		const sectionParam: any = {};
		sectionParam.class_id = this.uploadTimeTableForm.value.tt_class_id;
		this.sisService.getSectionsByClass(sectionParam)
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.sectionArray = result.data;
					}
				}
			);
	}




	// function to get excel data in file varaible
	incomingfile(event) {
		this.file = '';
		this.file = event.target.files[0];
		this.classId = this.uploadTimeTableForm.value.tt_class_id;
		this.sectionId = this.uploadTimeTableForm.value.tt_section_id;
		this.noOfDay = this.uploadTimeTableForm.value.no_of_day;
		this.period = this.uploadTimeTableForm.value.no_of_period;
		if (this.classId !== '' && this.sectionId !== '' && this.noOfDay !== '' && this.period !== '') {
			this.Upload();
		} else {
			this.commonService.showSuccessErrorMessage('Please fill all required field', 'error');
		}
	}

	// function to read excel data and assigned to final array for manipulation
	Upload() {
		this.sampleTimeTableFlag = false;
		this.excelFlag = true;
		this.XlslArray = [];
		this.finalXlslArray = [];
		const fileReader = new FileReader();
		fileReader.onload = (e) => {
			this.arrayBuffer = fileReader.result;
			const data = new Uint8Array(this.arrayBuffer);
			const arr = new Array();
			// tslint:disable-next-line: curly
			for (let i = 0; i !== data.length; ++i) arr[i] = String.fromCharCode(data[i]);
			const bstr = arr.join('');
			const workbook = XLSX.read(bstr, { type: 'binary' });
			const first_sheet_name = workbook.SheetNames[0];
			const worksheet = workbook.Sheets[first_sheet_name];
			this.XlslArray = XLSX.utils.sheet_to_json(worksheet, { raw: true });
			// console.log(this.XlslArray);
			for (let i = 0; i < this.XlslArray.length; i++) {
				this.monday = this.XlslArray[i].Monday ? this.XlslArray[i].Monday.split('-') : '-';
				this.tuesday = this.XlslArray[i].Tuesday ? this.XlslArray[i].Tuesday.split('-') : '-';
				this.wednesday = this.XlslArray[i].Wednesday ? this.XlslArray[i].Wednesday.split('-') : '-';
				this.thursday = this.XlslArray[i].Thursday ? this.XlslArray[i].Thursday.split('-') : '-';
				this.friday = this.XlslArray[i].Friday ? this.XlslArray[i].Friday.split('-') : '-';
				this.saturday = this.XlslArray[i].Saturday ? this.XlslArray[i].Saturday.split('-') : '-';
				this.sunday = this.XlslArray[i].Sunday ? this.XlslArray[i].Sunday.split('-') : '-';
				this.finalXlslArray.push({
					monday: this.monday[1],
					monday_id: this.monday[0],
					tuesday: this.tuesday[1],
					tuesday_id: this.tuesday[0],
					wednesday: this.wednesday[1],
					wednesday_id: this.wednesday[0],
					thursday: this.thursday[1],
					thursday_id: this.thursday[0],
					friday: this.friday[1],
					friday_id: this.friday[0],
					saturday: this.saturday[1],
					saturday_id: this.saturday[0],
					sunday: this.sunday[1],
					sunday_id: this.sunday[0],
				});
				// console.log(this.finalXlslArray);
			}


			// if (this.XlslArray.length === 0) {
			// 	this.commonService.showSuccessErrorMessage('Execel is blank. Please Choose another excel.', 'error');
			// 	return false;
			// }
			// const xlslHeader = Object.keys(this.XlslArray[0]);
			// console.log(xlslHeader);
			// if (xlslHeader[0] !== 'Monday' || xlslHeader[1] !== 'Tuesday' || xlslHeader[2] !== 'Wednesday'
			// || xlslHeader[3] !== 'Thursday' ||  xlslHeader[4] !== 'Friday') {
			// 	this.commonService.showSuccessErrorMessage('Excel heading should be same as Sample excel heading.', 'error');
			// 	return false;
			// }

		};
		fileReader.readAsArrayBuffer(this.file);

	}
	sampleTimeTable() {
		if (this.uploadTimeTableForm.valid) {
			this.sampleTimeTableFlag = true;
			this.noOFPeriod = this.uploadTimeTableForm.value.no_of_period;
			for (let i = 0; i < this.noOFPeriod; i++) {
				this.sampleTimeTableArray.push({
					count: i,
					monday: '',
				});
			}
		} else {
			this.commonService.showSuccessErrorMessage('Please fill all required field', 'error');
		}
	}
	finalSubmit() {
		for (let i = 0; i < this.finalXlslArray.length; i++) {
			if (this.finalXlslArray[i].monday_id !== '') {
				this.finalSubmitArray.push({
					day: 'Monday',
					day_id: 1,
					subject_id: this.finalXlslArray[i].monday_id,
					no_of_period: i,
				});
			}
			if (this.finalXlslArray[i].tuesday_id !== '') {
				this.finalSubmitArray.push({
					day: 'Tuesday',
					day_id: 2,
					subject_id: this.finalXlslArray[i].tuesday_id,
					no_of_period: i,
				});
			}
			if (this.finalXlslArray[i].wednesday_id !== '') {
				this.finalSubmitArray.push({
					day: 'Wednesday',
					day_id: 3,
					subject_id: this.finalXlslArray[i].wednesday_id,
					no_of_period: i,
				});
			}
			if (this.finalXlslArray[i].thursday_id !== '') {
				this.finalSubmitArray.push({
					day: 'Thursday',
					day_id: 4,
					subject_id: this.finalXlslArray[i].thursday_id,
					no_of_period: i,
				});
			}
			if (this.finalXlslArray[i].friday_id !== '') {
				this.finalSubmitArray.push({
					day: 'Friday',
					day_id: 5,
					subject_id: this.finalXlslArray[i].friday_id,
					no_of_period: i,
				});
			}
			if (this.finalXlslArray[i].saturday_id !== '') {
				this.finalSubmitArray.push({
					day: 'Saturday',
					day_id: 6,
					subject_id: this.finalXlslArray[i].saturday_id,
					no_of_period: i,
				});
			}
			if (this.finalXlslArray[i].sunday_id !== '') {
				this.finalSubmitArray.push({
					day: 'Sunday',
					day_id: 7,
					subject_id: this.finalXlslArray[i].sunday_id,
					no_of_period: i,
				});
			}
			// console.log(this.finalSubmitArray);
		}
		for (let i = 0; i < this.finalSubmitArray.length; i++) {

			const spannArray: any[] = [];
			spannArray.push({
				no_of_period: this.finalSubmitArray[i].no_of_period,
				day_id: this.finalSubmitArray[i].day_id,
				subject_id: this.finalSubmitArray[i].subject_id,
				day: this.finalSubmitArray[i].day,
			});
			for (let j = i + 1; j < this.finalSubmitArray.length; j++) {
				if (this.finalSubmitArray[i].no_of_period === this.finalSubmitArray[j].no_of_period) {
					spannArray.push({
						no_of_period: this.finalSubmitArray[i].no_of_period,
						day_id: this.finalSubmitArray[j].day_id,
						subject_id: this.finalSubmitArray[j].subject_id,
						day: this.finalSubmitArray[j].day,
					});
				}
			}
			const findex = this.finalperiodArray.findIndex(f => f.no_of_period === this.finalSubmitArray[i].no_of_period);
			if (findex === -1) {
				this.finalperiodArray.push({
					no_of_period: this.finalSubmitArray[i].no_of_period,
					details: spannArray
				});
			}

		}
		this.syllabusService.insertTimetable(this.uploadTimeTableForm.value).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.tt_id = result.data;
				for (const item of this.finalperiodArray) {
					this.finalTimeTableArray.push({
						td_tt_id: this.tt_id,
						td_no_of_day: JSON.stringify(item.details),
						td_no_of_period: item.no_of_period + 1,
						td_created_by: this.currentUser.login_id
					});
				}
				this.syllabusService.insertTimetableDetails(this.finalTimeTableArray).subscribe((result1: any) => {
					if (result1 && result1.status === 'ok') {
						// this.finalSpannedArray = [];
						// this.finalSubmitArray = [];
						// this.resetForm();
					}
				});
				console.log(this.finalTimeTableArray);
			}
		});
		
	}



}