import { Component, OnInit, ViewChild, OnChanges } from '@angular/core';
import { SisService, CommonAPIService } from '../../_services/index';
import { FormGroup, FormBuilder, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { DatePipe } from '@angular/common';


@Component({
	selector: 'app-employee-tab-four-container',
	templateUrl: './employee-tab-four-container.component.html',
	styleUrls: ['./employee-tab-four-container.component.scss']
})
export class EmployeeTabFourContainerComponent implements OnInit, OnChanges {

	Education_Form: FormGroup;
	educationsArray: any[] = [];
	qualficationArray: any[] = [];
	panelOpenState = true;
	addOnly = false;
	editOnly = false;
	viewOnly = true;
	saveFlag = false;
	editRequestFlag = false;
	taboneform: any = {};
	login_id = '';


	@ViewChild('editReference') editReference;

	constructor(public commonAPIService: CommonAPIService, private fbuild: FormBuilder,
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
	}
	ngOnChanges() {

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
	getQualifications(){
		this.sisService.getQualifications().subscribe((result: any) => {
			if (result.status === 'ok') {
				this.qualficationArray = result.data;
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
