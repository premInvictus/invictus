import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';
import { SisService, CommonAPIService,SmartService } from '../../_services/index';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Student } from './student.modal';

@Component({
	selector: 'app-shuffling-tool',
	templateUrl: './shuffling-tool.component.html',
	styleUrls: ['./shuffling-tool.component.scss']
})
export class ShufflingToolComponent implements OnInit, AfterViewInit {
	studentsArray: any[] = [];
	shuffleStudentsArray: any[] = []; 
	classArray = [];
	disableApiCall = false;
	sectionArray = [];
	houseArray = [];
	allselected = false;
	STUDENT_ELEMENT_DATA: Student[];
	STUDENT_ELEMENT_DATA_ONE: any;
	SHUFFLE_ELEMENT_DATA: Student[];
	SHUFFLE_ELEMENT_DATA_ONE: any;
	sorttableflag = false;
	shuffletableflag = false;
	allShuffleFlag = false;
	selectedShuffleArray = [];
	selectedShuffleArrayValue = [];
	loginArray: any[] = [];
	displayedColumns: string[] = [
		'select',
		'no',
		'name',
		'class',
		'section',
		'house'
	];
	displayedColumns1: string[] = [
		'select',
		'no',
		'name',
		'class',
		'section',
		'house'
	];
	studentdataSource = new MatTableDataSource(this.STUDENT_ELEMENT_DATA);
	shuffledataSource = new MatTableDataSource(this.SHUFFLE_ELEMENT_DATA);
	shufflesortform: FormGroup;
	shufflebasedform: FormGroup;

	@ViewChild('sortP') sortP: MatSort;
	@ViewChild('sortD') sortD: MatSort;

	constructor(
		private sisService: SisService,
		private SmartService: SmartService,
		private commonAPIService: CommonAPIService,
		private fbuild: FormBuilder
	) { }

	ngOnInit() {
		this.getClass();
		this.getHouses();
		this.buildForm();
	}
	ngAfterViewInit() {
		this.studentdataSource.sort = this.sortP;
		this.shuffledataSource.sort = this.sortD; 
	}
	buildForm() {
		this.shufflesortform = this.fbuild.group({
			class_id: '',
			order_by: ''
		});
		this.shufflebasedform = this.fbuild.group({
			based_on: ''
		});
	}

	applyFilter(filterValue: string) {
		this.studentdataSource.filter = filterValue.trim().toLowerCase();
	}
	applyFilter1(filterValue: string) {
		this.shuffledataSource.filter = filterValue.trim().toLowerCase();
	}
	getClass() {
		this.classArray = [];
		this.SmartService.getClassData({}).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.classArray = result.data;
			}
		});
	}
	getSectionsByClass() {
		this.resetTableAndSelection();
		this.resetshuffletableflag();
		this.sectionArray = [];
		this.sisService.getSectionsByClass({ class_id: this.shufflesortform.value.class_id }).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.sectionArray = result.data;
			}
		});
	}
	getHouses() {
		this.houseArray = [];
		this.sisService.getHouses().subscribe((result: any) => {
			if (result.status === 'ok') {
				this.houseArray = result.data;
			}
		});
	}
	resetTableAndSelection() {
		this.sorttableflag = false;
		this.loginArray = [];
		this.STUDENT_ELEMENT_DATA = [];
		this.studentdataSource = new MatTableDataSource(this.STUDENT_ELEMENT_DATA);
	}
	getMasterStudentDetail() {
		if (this.shufflesortform.valid) {
			this.disableApiCall = true;
			this.resetTableAndSelection();
			this.shufflesortform.value.pmap_status = '1';
			this.shufflesortform.value.enrollment_type = '4';
			this.sisService.getMasterStudentDetail(this.shufflesortform.value).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.sorttableflag = true;
					this.studentsArray = result.data;
					let nos = 1;
					this.studentsArray.forEach(element => {
						this.STUDENT_ELEMENT_DATA.push({
							select: element.au_login_id,
							no: element.au_process_type === '4' ? element.em_admission_no : element.em_provisional_admission_no,
							name: element.au_full_name,
							class: element.class_name,
							section: element.sec_name,
							house: element.hou_house_name,
							action: element
						});
						nos++;
					});
					this.studentdataSource = new MatTableDataSource(this.STUDENT_ELEMENT_DATA);
					this.studentdataSource.sort = this.sortP;
					this.disableApiCall = false;
				} else {
					this.sorttableflag = false;
					this.commonAPIService.showSuccessErrorMessage(result.data, 'error');
					this.STUDENT_ELEMENT_DATA = [];
					this.studentdataSource = new MatTableDataSource(this.STUDENT_ELEMENT_DATA);
					this.disableApiCall = false;
				}
			});
		}
	}
	resetShuffleTableAndSelection() {
		this.allselected = false;
		this.selectedShuffleArrayValue = [];
		this.selectedShuffleArray = [];
		this.SHUFFLE_ELEMENT_DATA = [];
		this.shuffledataSource = new MatTableDataSource(this.SHUFFLE_ELEMENT_DATA);
	}
	getShuffleStudents() {
		if (this.shufflebasedform.valid) {
			this.resetShuffleTableAndSelection();
			const param: any = {};
			param.class_id = this.shufflesortform.value.class_id;
			param.order_by = this.shufflesortform.value.order_by;
			param.based_on = this.shufflebasedform.value.based_on;
			param.login_id = this.loginArray;
			this.disableApiCall = true;
			if (this.loginArray.length > 0) {
				this.sisService.getShuffleStudents(param).subscribe((result: any) => {
					if (result.status === 'ok') {
						this.shuffletableflag = true;
						this.shuffleStudentsArray = result.data;
						this.shuffleStudentsArray.forEach(element => {
							this.SHUFFLE_ELEMENT_DATA.push({
								select: element.au_login_id,
								no: element.au_process_type === '4' ? element.em_admission_no : element.em_provisional_admission_no,
								name: element.au_full_name,
								class: element.class_name,
								section: this.shufflebasedform.value.based_on === 'sec_id' ? element.shuf_sec_name : element.sec_name,
								house: this.shufflebasedform.value.based_on === 'hou_id' ? element.shuf_hou_house_name : element.hou_house_name,
								action: element
							});
							this.selectedShuffleArrayValue.push({
								login_id: element.au_login_id,
								class_id: element.class_id,
								ses_id: element.ses_id,
								sec_id: this.shufflebasedform.value.based_on === 'sec_id' ? element.shuf_sec_id : element.sec_id,
								hou_id: this.shufflebasedform.value.based_on === 'hou_id' ? element.shuf_hou_id : element.hou_id
							});
						});
						this.shuffledataSource = new MatTableDataSource(this.SHUFFLE_ELEMENT_DATA);
						this.shuffledataSource.sort = this.sortD;
						this.disableApiCall = false;
					} else {
						this.shuffletableflag = false;
						this.commonAPIService.showSuccessErrorMessage(result.data, 'error');
						this.SHUFFLE_ELEMENT_DATA = [];
						this.shuffledataSource = new MatTableDataSource(this.SHUFFLE_ELEMENT_DATA);
						this.disableApiCall = false;
					}
				});
			} else {
				this.commonAPIService.showSuccessErrorMessage('Please choose a student to proceed', 'error');
			}
		}
	}
	setSuffleStudent(login_id, field, value) {
		for (const item of this.selectedShuffleArrayValue) {
			if (item.login_id === login_id) {
				item[field] = value;
				break;
			}
		}
	}

	selectShuffleStudent(login_id) {
		const findex = this.selectedShuffleArray.findIndex(value => value === login_id);
		if (findex === -1) {
			this.selectedShuffleArray.push(login_id);
		} else {
			this.selectedShuffleArray.splice(findex, 1);
		}
	}
	isSelectedS(login_id) {
		return this.selectedShuffleArray.findIndex(f => f === login_id) !== -1 ? true : false;
	}
	resetshuffletableflag() {
		this.shuffletableflag = false;
		this.SHUFFLE_ELEMENT_DATA = [];
		this.shuffledataSource = new MatTableDataSource(this.SHUFFLE_ELEMENT_DATA);
	}
	freeze() {
		const paramArray: any[] = [];
		for (const item of this.selectedShuffleArrayValue) {
			for (const element of this.selectedShuffleArray) {
				if (item.login_id === element) {
					paramArray.push(item);
				}
			}
		}
		if (paramArray.length > 0) {
			this.disableApiCall = true;
			this.sisService.shuffle({ students: paramArray }).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.selectedShuffleArrayValue = [];
					this.shuffletableflag = false;
					this.SHUFFLE_ELEMENT_DATA = [];
					this.shuffledataSource = new MatTableDataSource(this.SHUFFLE_ELEMENT_DATA);
					this.commonAPIService.showSuccessErrorMessage('Suffled successfully', 'success');
					this.loginArray = [];
					this.allShuffleFlag = false;
					this.shufflebasedform.patchValue({
						based_on : ''
					});
					this.getMasterStudentDetail();
					this.disableApiCall = false;
				} else {
					this.disableApiCall = false;
				}
			});
		} else {
			this.commonAPIService.showSuccessErrorMessage('Please Select Records', 'error');
		}
	}
	/** Selects all rows if they are not all selected; otherwise clear selection. */
	masterToggle() {
		this.allselected = this.allselected ? false : true;
		if (this.allselected) {
			this.SHUFFLE_ELEMENT_DATA.forEach(element => {
				this.selectedShuffleArray.push(element.select);
			});
		} else {
			this.selectedShuffleArray = [];
		}
	}
	assignAll($event) {
		if ($event.checked) {
			this.allShuffleFlag = true;
			for (const item of this.STUDENT_ELEMENT_DATA) {
				this.loginArray.push(item.select);
			}
		} else {
			this.loginArray = [];
			this.allShuffleFlag = false;
		}
	}
	addLogin($event) {
		if ($event.checked === true) {
			this.loginArray.push($event.source.value);
		} else {
			const index = this.loginArray.indexOf($event.source.value);
			this.loginArray.splice(index, 1);
		}
		console.log(this.loginArray);
	}
	isSelectedP(login_id) {
		return this.loginArray.findIndex(f => f === login_id) !== -1 ? true : false;
	}
}
