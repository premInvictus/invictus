import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonAPIService, SisService, AxiomService, SmartService, ExamService } from '../../_services';
import { MatDialog } from '@angular/material/dialog';
import { Element } from './rollno.model';
import { MatSort, MatTableDataSource } from '@angular/material';
import { CapitalizePipe } from '../../../../../examination/src/app/_pipes';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-rollno-allotment',
	templateUrl: './rollno-allotment.component.html',
	styleUrls: ['./rollno-allotment.component.css']
})
export class RollnoAllotmentComponent implements OnInit,AfterViewInit {
	defaultFlag = false;
	finalDivFlag = true;
	submitFlag = false;
	displayedColumns: string[] = [];
	firstForm: FormGroup;
	rollNoForm: FormGroup;
	classArray: any[];
	sectionArray: any[];
	studentArray: any[];
	currentUser: any;
	session: any;
	ELEMENT_DATA: Element[] = [];
	rollNoDataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
	formgroupArray: any[] = [];
	finalArray: any[] = [];
	boardArray: any[] = [
		{ id: 0, name: 'Board' },
		{ id: 1, name: 'Non-Board' },
	];
	boardClassArray: any[] = [
		{ class_id: 18, class_name: 'X' },
		{ class_id: 20, class_name: 'XII' },
	];
	@ViewChild(MatSort) sort: MatSort;
	constructor(
		public dialog: MatDialog,
		private fbuild: FormBuilder,
		private smartService: SmartService,
		public commonService: CommonAPIService,
		public axiomService: AxiomService,
		public sisService: SisService,
		public examService: ExamService
	) {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.session = JSON.parse(localStorage.getItem('session'));
	}

	ngOnInit() {
		this.buildForm();
	}

	ngAfterViewInit() {
		this.rollNoDataSource.sort = this.sort;
	}

	buildForm() {
		this.firstForm = this.fbuild.group({
			syl_board_id: '',
			syl_class_id: '',
			syl_section_id: ''
		});
		this.formgroupArray = [];
	}
	getClassByBoard() {
		this.submitFlag = false;
		this.defaultFlag = false;
		this.finalDivFlag = true;
		this.classArray = [];
		this.sectionArray = [];
		if (Number(this.firstForm.value.syl_board_id) === 0) {
			this.classArray = this.boardClassArray;
			this.displayedColumns = ['sr_no', 'au_admission_no', 'au_full_name', 'au_roll_no', 'au_board_roll_no'];
		} else {
			this.getClass();
			this.displayedColumns = ['sr_no', 'au_admission_no', 'au_full_name', 'au_roll_no'];
		}
	}
	//  Get Class List function
	getClass() {
		this.sectionArray = [];
		const classParam: any = {};
		classParam.role_id = this.currentUser.role_id;
		classParam.login_id = this.currentUser.login_id;
		this.smartService.getClassData(classParam)
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.classArray = result.data;
					}
				}
			);
	}
	// get section list according to selected class
	getSectionsByClass() {
		if (Number(this.firstForm.value.syl_board_id) === 0) {
			this.fetchDetails();
		} else {
			this.firstForm.patchValue({
				'syl_section_id': ''
			});
			const sectionParam: any = {};
			sectionParam.class_id = this.firstForm.value.syl_class_id;
			this.smartService.getSectionsByClass(sectionParam)
				.subscribe(
					(result: any) => {
						if (result && result.status === 'ok') {
							this.sectionArray = result.data;
						} else {
							this.sectionArray = [];
						}
					}
				);
		}

	}
	finalCancel() {
		this.formgroupArray = [];
		this.ELEMENT_DATA = [];
		this.defaultFlag = false;
		this.finalDivFlag = true;
		this.submitFlag = false;
		this.firstForm.patchValue({
			'syl_board_id': '',
			'syl_class_id': '',
			'syl_section_id': ''
		});
	}
	onTextChange($event) {
		this.submitFlag = true;
	}
	fetchDetails() {
		this.formgroupArray = [];
		this.ELEMENT_DATA = [];
		this.rollNoDataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
		const studentParam: any = {};
		studentParam.au_class_id = this.firstForm.value.syl_class_id;
		if (Number(this.firstForm.value.syl_board_id) === 1) {
			studentParam.au_sec_id = this.firstForm.value.syl_section_id;
		}
		studentParam.au_role_id = '4';
		studentParam.au_status = '1';
		this.examService.getRollNoUser(studentParam)
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.defaultFlag = true;
						this.finalDivFlag = false;
						this.studentArray = result.data;
						let counter = 1;
						for (const item of this.studentArray) {
							this.ELEMENT_DATA.push({
								sr_no: counter,
								au_admission_no: item.au_admission_no,
								au_full_name: new CapitalizePipe().transform(item.au_full_name),
								au_roll_no: item.r_rollno,
								au_board_roll_no: item.r_board_roll_no
							});
							counter++;
							this.formgroupArray.push({
								formGroup: this.fbuild.group({
									class_id: this.firstForm.value.syl_class_id,
									sec_id: item.au_sec_id,
									login_id: item.au_login_id,
									roll_no: item.r_rollno,
									board_roll_no: item.r_board_roll_no,
									session_id: this.session.ses_id,
									created_by: this.currentUser.login_id

								})
							});
						}
						this.rollNoDataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
						this.rollNoDataSource.sort = this.sort;
					} else {
						this.commonService.showSuccessErrorMessage('No record found', 'error');
						this.finalCancel();
					}
				}
			);
	}
	finalSubmit() {
		this.finalArray = [];
		for (const item of this.formgroupArray) {
			this.finalArray.push(item.formGroup.value);
		}
		const checkParam: any = {};
		checkParam.au_class_id = this.firstForm.value.syl_class_id;
		if (Number(this.firstForm.value.syl_board_id) === 1) {
			checkParam.au_sec_id = this.firstForm.value.syl_section_id;
		}
		checkParam.au_sec_id = this.firstForm.value.syl_section_id;
		checkParam.au_ses_id = this.session.ses_id;
		this.examService.checkRollNoForClass(checkParam).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.examService.insertRollNo(this.finalArray).subscribe((result_i: any) => {
					if (result_i && result_i.status === 'ok') {
						this.finalCancel();
						this.commonService.showSuccessErrorMessage('Roll No. Inserted Successfully', 'success');
					} else {
						this.commonService.showSuccessErrorMessage('Insert failed', 'error');
					}
				});
			}
		});
	}
}
