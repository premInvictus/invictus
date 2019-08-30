import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonAPIService, SisService, AxiomService, SmartService } from '../../_services';
import { MatDialog } from '@angular/material/dialog';
import { Element } from './rollno.model';
import { MatSort, MatTableDataSource, ErrorStateMatcher } from '@angular/material';

@Component({
	selector: 'app-rollno-allotment',
	templateUrl: './rollno-allotment.component.html',
	styleUrls: ['./rollno-allotment.component.css']
})
export class RollnoAllotmentComponent implements OnInit {
	displayedColumns: string[] = ['sr_no', 'au_admission_no', 'au_full_name', 'au_roll_no', 'au_board_rll_no'];
	firstForm: FormGroup;
	rollNoForm: FormGroup;
	classArray: any[];
	sectionArray: any[];
	studentArray: any[];
	currentUser: any;
	ELEMENT_DATA: Element[] = [];
	rollNoDataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
	formgroupArray: any[] = [];
	finalArray: any[] = [];
	constructor(
		public dialog: MatDialog,
		private fbuild: FormBuilder,
		private smartService: SmartService,
		public commonService: CommonAPIService,
		public axiomService: AxiomService,
		public sisService: SisService,
	) {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
	}

	ngOnInit() {
		this.buildForm();
		this.getClass();
	}

	buildForm() {
		this.firstForm = this.fbuild.group({
			syl_class_id: '',
			syl_section_id: ''
		});
	}
	//  Get Class List function
	getClass() {
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
	fetchDetails() {
		this.formgroupArray = [];
		const studentParam: any = {};
		studentParam.au_class_id = this.firstForm.value.syl_class_id;
		studentParam.au_sec_id = this.firstForm.value.syl_section_id;
		studentParam.au_role_id = '4';
		studentParam.au_status = '1';
		this.axiomService.getUser(studentParam)
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.studentArray = result.data;
						let counter = 1;
						for (const item of this.studentArray) {
							this.ELEMENT_DATA.push({
								sr_no: counter,
								au_admission_no: item.au_admission_no,
								au_full_name: item.au_full_name,
								au_roll_no: '-',
								au_board_roll_no: '-'
							});
							counter++;
							this.formgroupArray.push({
								formGroup: this.fbuild.group({
									class_id: this.firstForm.value.syl_class_id,
									sec_id: this.firstForm.value.syl_section_id,
									login_id: item.au_login_id,
									roll_no: '',
									board_roll_no: ''
								})
							});
						}
						this.rollNoDataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
					} else {
						this.studentArray = [];
					}
				}
			);
	}
	finalSubmit() {
		for (const item of this.formgroupArray) {
			console.log('item', item);
			this.finalArray.push(item.formGroup.value);
		}
		console.log(this.finalArray);
	}

}
