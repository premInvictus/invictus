import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonAPIService, SisService, AxiomService, SmartService } from '../../_services';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
	selector: 'app-time-table',
	templateUrl: './time-table.component.html',
	styleUrls: ['./time-table.component.css']
})
export class TimeTableComponent implements OnInit {
	periodSup = ['st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th'];
	sampleTimeTableFlag = false;
	excelFlag = false;
	uploadTimeTableFlag = true;
	defaultFlag = true;
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
	zero: any;
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
			period_checkbox: ''
		});
	}

	// Reset Syllabus Details form 
	resetForm() {
		this.uploadTimeTableForm.patchValue({
			'tt_class_id': '',
			'tt_section_id': '',
			'no_of_day': '',
			'no_of_period': '',
			'period_checkbox': ''
		});
	}

	// Function for cancel the perfor action and back to add class and subject
	finalCancel() {
		this.finalXlslArray = [];
		this.excelFlag = false;
		this.defaultFlag = true;
		this.resetForm();
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
					} else {
						this.classArray = [];
					}
				}
			);
	}

	// get section list according to selected class
	getSectionsByClass() {
		const sectionParam: any = {};
		sectionParam.class_id = this.uploadTimeTableForm.value.tt_class_id;
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
		this.uploadTimeTableForm.patchValue({
			'tt_section_id': '',
			'no_of_day': '',
			'no_of_period': '',
			period_checkbox: ''
		});
	}
	// get period and day by selected class
	getPeriodDayByClass() {
		const dayParam: any = {};
		dayParam.class_id = this.uploadTimeTableForm.value.tt_class_id;
		this.syllabusService.getPeriodDayByClass(dayParam)
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.uploadTimeTableForm.patchValue({
							'no_of_day': result.data[0].no_of_day.toString(),
							'no_of_period': result.data[0].no_of_period.toString(),
						});
					} else {
						this.commonService.showSuccessErrorMessage('Please add day and period for class.', 'error');
					}
				});
	}

	// add zero period
	addPeriod(event) {
		if (event.checked) {
			this.zero = 'true';
			this.uploadTimeTableForm.patchValue({
				no_of_period: Number(this.uploadTimeTableForm.value.no_of_period) + 1,
			});
		} else {
			this.zero = 'false';
			this.uploadTimeTableForm.patchValue({
				no_of_period: Number(this.uploadTimeTableForm.value.no_of_period) - 1,
			});
		}
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
		this.defaultFlag = false;
		this.excelFlag = true;
		this.XlslArray = [];
		const finalXlslArrayTemp: any[] = [];
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
			for (let m = 0; m < this.period; m++) {
				finalXlslArrayTemp[m] = {
					monday_id: '-',
					tuesday_id: '-',
					wednesday_id: '-',
					thursday_id: '-',
					friday_id: '-',
					saturday_id: '',
					sunday_id: '',

				};
			}
			for (let i = 0; i < this.XlslArray.length; i++) {
				if (i === Number(this.period)) {
					break;
				}
				this.monday = this.XlslArray[i].Monday ? this.XlslArray[i].Monday.split('-') : '-';
				this.tuesday = this.XlslArray[i].Tuesday ? this.XlslArray[i].Tuesday.split('-') : '-';
				this.wednesday = this.XlslArray[i].Wednesday ? this.XlslArray[i].Wednesday.split('-') : '-';
				this.thursday = this.XlslArray[i].Thursday ? this.XlslArray[i].Thursday.split('-') : '-';
				this.friday = this.XlslArray[i].Friday ? this.XlslArray[i].Friday.split('-') : '-';
				this.saturday = this.XlslArray[i].Saturday ? this.XlslArray[i].Saturday.split('-') : '-';
				this.sunday = this.XlslArray[i].Sunday ? this.XlslArray[i].Sunday.split('-') : '-';
				finalXlslArrayTemp[i].monday = this.monday[1];
				finalXlslArrayTemp[i].monday_id = this.monday[0];
				finalXlslArrayTemp[i].tuesday = this.tuesday[1];
				finalXlslArrayTemp[i].tuesday_id = this.tuesday[0];
				finalXlslArrayTemp[i].wednesday = this.wednesday[1];
				finalXlslArrayTemp[i].wednesday_id = this.wednesday[0];
				finalXlslArrayTemp[i].thursday = this.thursday[1];
				finalXlslArrayTemp[i].thursday_id = this.thursday[0];
				finalXlslArrayTemp[i].friday = this.friday[1];
				finalXlslArrayTemp[i].friday_id = this.friday[0];
				if (Number(this.uploadTimeTableForm.value.no_of_day) === 6 || Number(this.uploadTimeTableForm.value.no_of_day === 7)) {
					finalXlslArrayTemp[i].saturday = this.saturday[1];
					finalXlslArrayTemp[i].saturday_id = this.saturday[0];
				}
				if (Number(this.uploadTimeTableForm.value.no_of_day) === 7) {
					finalXlslArrayTemp[i].sunday = this.sunday[1];
					finalXlslArrayTemp[i].sunday_id = this.sunday[0];
				}
			}
			for (const item of finalXlslArrayTemp) {
				this.finalXlslArray.push(item);
			}
			if (this.XlslArray.length === 0) {
				this.commonService.showSuccessErrorMessage('Execel is blank. Please Choose another excel.', 'error');
				return false;
			}
			let count = 0;
			for (const item of this.finalXlslArray) {
				Object.keys(item).forEach((key: any) => {
					if (item[key] === '-') {
						count++;
					}
				});
			}
			if (count > 0) {
				this.commonService.showSuccessErrorMessage('Please fill all Periods in timetable.', 'error');
				this.finalXlslArray = [];
				this.excelFlag = false;
				this.defaultFlag = true;
				return false;
			}
		};
		fileReader.readAsArrayBuffer(this.file);

	}

	// download sample time table excel
	sampleTimeTable() {
		this.sampleTimeTableArray = [];
		if (this.uploadTimeTableForm.valid) {
			if (this.uploadTimeTableForm.value.no_of_period > 15) {
				this.commonService.showSuccessErrorMessage('Number of Periods should not more than 15.', 'error');
				return false;
			}
			this.defaultFlag = false;
			this.sampleTimeTableFlag = true;
			this.noOFPeriod = this.uploadTimeTableForm.value.no_of_period;
			for (let i = 0; i < this.noOFPeriod; i++) {
				this.sampleTimeTableArray.push({
					count: i,
					monday: '',
				});
			}
			const param: any = {};
			param.class_id = this.uploadTimeTableForm.value.tt_class_id;
			param.no_of_days = this.uploadTimeTableForm.value.no_of_day;
			param.no_of_period = this.uploadTimeTableForm.value.no_of_period;
			this.syllabusService.downloadTimeTableExcel(param)
				.subscribe(
					(excel_r: any) => {
						if (excel_r && excel_r.status === 'ok') {
							const length = excel_r.data.split('/').length;
							saveAs(excel_r.data, excel_r.data.split('/')[length - 1]);
							// this.resetForm();
						}
					});

		} else {
			this.commonService.showSuccessErrorMessage('Please fill all required field', 'error');
		}
	}
	// TimeTable details insert in database
	finalSubmit() {
		for (let i = 0; i < this.finalXlslArray.length; i++) {
			if (this.finalXlslArray[i].monday_id !== '') {
				this.finalSubmitArray.push({
					day: 'Monday',
					day_id: 1,
					subject_id: this.finalXlslArray[i].monday_id,
					subject_name: this.finalXlslArray[i].monday,
					no_of_period: i,
				});
			}
			if (this.finalXlslArray[i].tuesday_id !== '') {
				this.finalSubmitArray.push({
					day: 'Tuesday',
					day_id: 2,
					subject_id: this.finalXlslArray[i].tuesday_id,
					subject_name: this.finalXlslArray[i].tuesday,
					no_of_period: i,
				});
			}
			if (this.finalXlslArray[i].wednesday_id !== '') {
				this.finalSubmitArray.push({
					day: 'Wednesday',
					day_id: 3,
					subject_id: this.finalXlslArray[i].wednesday_id,
					subject_name: this.finalXlslArray[i].wednesday,
					no_of_period: i,
				});
			}
			if (this.finalXlslArray[i].thursday_id !== '') {
				this.finalSubmitArray.push({
					day: 'Thursday',
					day_id: 4,
					subject_id: this.finalXlslArray[i].thursday_id,
					subject_name: this.finalXlslArray[i].thursday,
					no_of_period: i,
				});
			}
			if (this.finalXlslArray[i].friday_id !== '') {
				this.finalSubmitArray.push({
					day: 'Friday',
					day_id: 5,
					subject_id: this.finalXlslArray[i].friday_id,
					subject_name: this.finalXlslArray[i].friday,
					no_of_period: i,
				});
			}
			if (Number(this.uploadTimeTableForm.value.no_of_day) === 6 || Number(this.uploadTimeTableForm.value.no_of_day === 7)) {
				if (this.finalXlslArray[i].saturday_id !== '') {
					this.finalSubmitArray.push({
						day: 'Saturday',
						day_id: 6,
						subject_id: this.finalXlslArray[i].saturday_id,
						subject_name: this.finalXlslArray[i].saturday,
						no_of_period: i,
					});
				}
			}
			if (Number(this.uploadTimeTableForm.value.no_of_day) === 7) {
				if (this.finalXlslArray[i].sunday_id !== '') {
					this.finalSubmitArray.push({
						day: 'Sunday',
						day_id: 7,
						subject_id: this.finalXlslArray[i].sunday_id,
						subject_name: this.finalXlslArray[i].sunday,
						no_of_period: i,
					});
				}
			}
			console.log('submit', this.finalSubmitArray);
		}
		for (let i = 0; i < this.finalSubmitArray.length; i++) {

			const spannArray: any[] = [];
			spannArray.push({
				no_of_period: this.finalSubmitArray[i].no_of_period,
				day_id: this.finalSubmitArray[i].day_id,
				subject_id: this.finalSubmitArray[i].subject_id,
				subject_name: this.finalSubmitArray[i].subject_name,
				day: this.finalSubmitArray[i].day,
			});
			for (let j = i + 1; j < this.finalSubmitArray.length; j++) {
				if (this.finalSubmitArray[i].no_of_period === this.finalSubmitArray[j].no_of_period) {
					spannArray.push({
						no_of_period: this.finalSubmitArray[i].no_of_period,
						day_id: this.finalSubmitArray[j].day_id,
						subject_id: this.finalSubmitArray[j].subject_id,
						subject_name: this.finalSubmitArray[j].subject_name,
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
		const timetableparam: any = {};
		timetableparam.tt_class_id = this.uploadTimeTableForm.value.tt_class_id;
		timetableparam.tt_section_id = this.uploadTimeTableForm.value.tt_section_id;
		this.syllabusService.getTimeTableId(timetableparam)
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.syllabusService.updateTimetableDetails({ 'td_tt_id': result.data[0].tt_id }).subscribe((updateDetails_r: any) => {
							if (updateDetails_r && updateDetails_r.status === 'ok') {
							}
						});
					}
					const timetable: any = {};
					timetable.tt_class_id = this.uploadTimeTableForm.value.tt_class_id;
					timetable.tt_section_id = this.uploadTimeTableForm.value.tt_section_id;
					timetable.no_of_day = this.uploadTimeTableForm.value.no_of_day;
					timetable.no_of_period = this.uploadTimeTableForm.value.no_of_period;
					timetable.zero_period = this.zero;
					this.syllabusService.insertTimetable(timetable).subscribe((timetable_r: any) => {
						if (timetable_r && timetable_r.status === 'ok') {
							this.tt_id = timetable_r.data;
							for (const item of this.finalperiodArray) {
								this.finalTimeTableArray.push({
									td_tt_id: this.tt_id,
									td_no_of_day: JSON.stringify(item.details),
									td_no_of_period: item.no_of_period + 1,
									td_created_by: this.currentUser.login_id
								});
							}
							this.syllabusService.insertTimetableDetails(this.finalTimeTableArray).subscribe((details_r: any) => {
								if (details_r && details_r.status === 'ok') {
									this.finalXlslArray = [];
									this.excelFlag = false;
									this.defaultFlag = true;
									this.resetForm();
								}
							});
						}
					});
				});
	}
}
