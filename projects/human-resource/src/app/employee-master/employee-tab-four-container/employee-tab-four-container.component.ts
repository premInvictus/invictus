import { Component, OnInit, ViewChild, OnChanges, Input } from '@angular/core';
import { AxiomService, SisService, CommonAPIService } from '../../_services/index';
import { FormGroup, FormBuilder, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { DatePipe } from '@angular/common';



@Component({
	selector: 'app-employee-tab-four-container',
	templateUrl: './employee-tab-four-container.component.html',
	styleUrls: ['./employee-tab-four-container.component.scss']
})
export class EmployeeTabFourContainerComponent implements OnInit, OnChanges {
	@Input() employeedetails;
	Education_Form: FormGroup;
	Experience_Form: FormGroup;
	educationsArray: any[] = [];
	experiencesArray: any[] = [];
	qualficationArray: any[] = [];
	boardArray: any[] = [];
	skillsArray: any[] = [];
	remarksArray: any = {};
	panelOpenState = true;
	educationUpdateFlag = false;
	experienceUpdateFlag = false;
	experienceaddFlag = true;
	addOnly = false;
	editOnly = false;
	viewOnly = true;
	saveFlag = false;
	editRequestFlag = false;
	educationValue: any;
	experienceValue: any;
	skills: any;
	skillForm: FormGroup;
	remarksForm: FormGroup;
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
	dateConversion(value, format) {
		const datePipe = new DatePipe('en-in');
		return datePipe.transform(value, format);
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
		this.skillForm = this.fbuild.group({
			skill_id: ''
		});
		this.remarksForm = this.fbuild.group({
			management_remarks: '',
			interview_remarks: ''
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
	getQualificationsName(value) {
		const findex = this.qualficationArray.findIndex(f => Number(f.qlf_id) === Number(value));
		if (findex !== -1) {
			return this.qualficationArray[findex].qlf_name;
		}
	}
	getBoardName(value) {
		const findex = this.boardArray.findIndex(f => Number(f.board_id) === Number(value));
		if (findex !== -1) {
			return this.boardArray[findex].board_name;
		}
	}
	getdivisonName(value) {
		const findex = this.divisonArray.findIndex(f => Number(f.id) === Number(value));
		if (findex !== -1) {
			return this.divisonArray[findex].name;
		}
	}
	editEducation(value) {
		this.educationUpdateFlag = true;
		this.educationValue = value;
		this.Education_Form.patchValue({
			qualification: this.educationsArray[value].qualification,
			board: this.educationsArray[value].board,
			eed_specify_reason: this.educationsArray[value].eed_specify_reason,
			year: this.educationsArray[value].year,
			division: this.educationsArray[value].division,
			percentage: this.educationsArray[value].percentage,
			subject: this.educationsArray[value].subject
		});
	}
	updateEducation() {
		this.educationsArray[this.educationValue] = this.Education_Form.value;
		this.commonAPIService.showSuccessErrorMessage('Education List Updated', 'success');
		this.Education_Form.reset();
		this.educationUpdateFlag = false;
	}
	editExperience(value) {
		this.experienceUpdateFlag = true;
		this.experienceValue = value;
		this.Experience_Form.patchValue({
			organisation: this.experiencesArray[value].organisation,
			designation: this.experiencesArray[value].designation,
			last_salary: this.experiencesArray[value].last_salary,
			start_date: this.dateConversion(this.experiencesArray[value].start_date, 'yyyy-MM-dd'),
			end_date: this.dateConversion(this.experiencesArray[value].end_date, 'yyyy-MM-dd'),
		});
	}
	updateExperience() {
		this.Experience_Form.patchValue({
			'start_date': this.dateConversion(this.Experience_Form.value.start_date, 'd-MMM-y')
		});
		this.Experience_Form.patchValue({
			'end_date': this.dateConversion(this.Experience_Form.value.end_date, 'd-MMM-y')
		});
		this.experiencesArray[this.experienceValue] = this.Experience_Form.value;
		this.commonAPIService.showSuccessErrorMessage('Experience List Updated', 'success');
		this.Experience_Form.reset();
		this.experienceUpdateFlag = false;
	}
	deleteEducation(index) {
		this.educationsArray.splice(index, 1);
		this.Education_Form.reset();
	}
	deleteExperience(index) {
		this.experiencesArray.splice(index, 1);
		this.Experience_Form.reset();
	}
	isExistUserAccessMenu(isexist) {

	}
	insertSkill($event) {
		this.skills = $event.srcElement.value;
		if ($event.code !== 'NumpadEnter' || $event.code !== 'Enter') {
			const index = this.skillsArray.indexOf($event.srcElement.value);
			if (index === -1) {
				this.skillsArray.push(this.skillForm.value.skill_id);
				this.skillForm.patchValue({
					skill_id: ''
				});
			} else {
				this.skillForm.patchValue({
					skill_id: ''
				});
			}
		} else {
			const index = this.skillsArray.indexOf($event.srcElement.value);String
			if (index === -1) {
				this.skillForm.patchValue({
					skill_id: ''
				});
			} else {
				this.skillsArray.splice(index, 1);
			}
		}
	}
	deleteSkill(skill_id) {
		const index = this.skillsArray.indexOf(skill_id);
		if (index !== -1) {
			this.skillsArray.splice(index, 1);
		}
	}
	saveForm() {
		this.employeedetails['emp_remark_detail'] = {
			education_detail: this.educationsArray,
			experience_detail: this.experienceValue,
			management_remark: this.remarksForm.value.management_remarks,
			interview_remark: this.remarksForm.value.interview_remarks,
			skills: this.skillsArray
		};
		console.log('tttt',this.employeedetails);
	}
} 
