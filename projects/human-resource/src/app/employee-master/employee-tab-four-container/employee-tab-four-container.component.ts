import { Component, OnInit, ViewChild, OnChanges } from '@angular/core';
import { AxiomService, SisService, CommonAPIService } from '../../_services/index';
import { FormGroup, FormBuilder, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { DatePipe } from '@angular/common';


@Component({
	selector: 'app-employee-tab-four-container',
	templateUrl: './employee-tab-four-container.component.html',
	styleUrls: ['./employee-tab-four-container.component.scss']
})
export class EmployeeTabFourContainerComponent implements OnInit, OnChanges {

	Education_Form: FormGroup;
	Experience_Form: FormGroup;
	educationsArray: any[] = [];
	experiencesArray: any[] = [];
	qualficationArray: any[] = [];
	boardArray: any[] = [];
	panelOpenState = true;
	addOnly = false;
	editOnly = false;
	viewOnly = true;
	saveFlag = false;
	editRequestFlag = false;
	taboneform: any = {};
	login_id = '';
	divisonArray: any[] = [
		{ id: 0, name: 'First Divison' },
		{ id: 1, name: 'Second Divison' },
		{ id: 2, name: 'Third Divison' }
	];

	@ViewChild('editReference') editReference;
	constructor(public commonAPIService: CommonAPIService, private fbuild: FormBuilder, private axiomService: AxiomService,
		private sisService: SisService) {

	}
	setActionControls(data) {
		if (data.addMode) {
			this.addOnly = true;
			this.viewOnly = false;
		}
		if (data.editMode) {
			this.editOnly = true;
			this.viewOnly = false;
			this.saveFlag = true;
		}
		if (data.viewMode) {
			this.viewOnly = true;
			this.saveFlag = false;
			this.editRequestFlag = false;

			if (this.addOnly) {
				this.sisService.getStudentLastRecordPerProcessType().subscribe((result: any) => {
					if (result.status === 'ok') {
						this.commonAPIService.studentData.next(result.data[0]);
						this.addOnly = false;
					}
				});
			} else {
				//this.commonAPIService.studentData.next(this.context.studentdetails.studentdetailsform.value.au_enrollment_id);
			}
		}
	}

	ngOnInit() {
		this.buildForm();
		this.getQualifications();
		this.getBoard();
		this.years();
	}
	ngOnChanges() {

	}
	years() {
		var currentYear = new Date().getFullYear(),
			years = [];
		var startYear = 1980;
		while (startYear <= currentYear) {
			years.push(startYear++);
		}
		console.log(years);
	}

	buildForm() {
		this.Education_Form = this.fbuild.group({
			qualification: '',
			board: '',
			year: '',
			division: '',
			percentage: '',
			subject: '',
		});
		this.Experience_Form = this.fbuild.group({
			organisation: '',
			designation: '',
			last_salary: '',
			start_date: '',
			end_date: '',
		});
	}
	addPreviousEducations() {
		if (this.Education_Form.valid) {
			this.educationsArray.push(this.Education_Form.value);
			this.Education_Form.patchValue({
				qualification: '',
				board: '',
				year: '',
				division: '',
				percentage: '',
				subject: '',
			});
		} else {
			Object.keys(this.Education_Form.value).forEach(key => {
				const formControl = <FormControl>this.Education_Form.controls[key];
				if (formControl.invalid) {
					formControl.markAsDirty();
				}
			});
		}
	}
	addexperience() {
		if (this.Experience_Form.valid) {
			this.experiencesArray.push(this.Experience_Form.value);
			this.Experience_Form.patchValue({
				organisation: '',
				designation: '',
				last_salary: '',
				start_date: '',
				end_date: '',
			});
		} else {
			Object.keys(this.Experience_Form.value).forEach(key => {
				const formControl = <FormControl>this.Experience_Form.controls[key];
				if (formControl.invalid) {
					formControl.markAsDirty();
				}
			});
		}
	}
	getQualifications() {
		this.sisService.getQualifications().subscribe((result: any) => {
			if (result.status === 'ok') {
				this.qualficationArray = result.data;
			}
		});
	}
	getBoard() {
		this.axiomService.getBoard().subscribe((result: any) => {
			if (result.status === 'ok') {
				this.boardArray = result.data;
			}
		});
	}
	isExistUserAccessMenu(actionT) {
		// if (this.context && this.context.studentdetails) {
		// 	return this.context.studentdetails.isExistUserAccessMenu(actionT);
		// }
	}
	editConfirm() { }
} 
