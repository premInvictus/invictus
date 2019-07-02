import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonAPIService, SisService, AxiomService, SmartService } from '../../_services';
@Component({
	selector: 'app-system-info',
	templateUrl: './system-info.component.html',
	styleUrls: ['./system-info.component.css']
})
export class SystemInfoComponent implements OnInit {
	configValue: any;
	currentUser: any;
	session: any;
	classArray: any[];
	detailArray: any[];
	systemInfoForm: FormGroup;
	setupUpdateFlag = false;
  editFlag = false;
  finaldivflag = true;
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
		this.getDetailsCdpRelation();
	}
	buildForm() {
		this.systemInfoForm = this.fbuild.group({
			class_id: '',
			no_of_day: '',
			no_of_period: '',
		});
	}
	getClass() {
		const classParam: any = {};
		classParam.role_id = this.currentUser.role_id;
		classParam.login_id = this.currentUser.login_id;
		this.sisService.getClass(classParam)
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
            this.classArray = result.data;
            this.finaldivflag = false;
					}
				}
			);
	}

	//  Get Class Name from existion Array for details table
	getSetupClass(class_id) {
		const cindex = this.classArray.findIndex(f => Number(f.class_id) === Number(class_id));
		if (cindex !== -1) {
			return this.classArray[cindex].class_name;
		}
	}

	// Edit syllabus list function
	editSyllabusList(value) {
		this.setupUpdateFlag = true;
		this.editFlag = true;
		this.systemInfoForm.patchValue({
			'class_id': this.detailArray[value].class_id.toString(),
			'no_of_day': this.detailArray[value].no_of_day.toString(),
			'no_of_period': this.detailArray[value].no_of_period.toString(),
		});
	}
	updateConfiguration() {
		this.editFlag = false;
		this.setupUpdateFlag = false;
		if (this.systemInfoForm.valid) {
			this.syllabusService.updateClasswisePeriod(this.systemInfoForm.value).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.commonService.showSuccessErrorMessage('Classwise setup updated successfully', 'success');
					this.resetForm();
					this.getDetailsCdpRelation();
				}
			});
		} else {
			this.commonService.showSuccessErrorMessage('Please fill all required field', 'error');
		}
	}

	// Reset setup  form 
	resetForm() {
		this.systemInfoForm.patchValue({
			'class_id': '',
			'no_of_day': '',
			'no_of_period': '',
		});
		this.editFlag = false;
		this.setupUpdateFlag = false;

	}

	// add class wise day and period 
	addConfiguration() {
		if (this.systemInfoForm.valid) {
			const classArray: any = {};
			classArray.class_id = this.systemInfoForm.value.class_id;
			this.syllabusService.checkClassEntry(classArray).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.commonService.showSuccessErrorMessage('Classwise setup Already added', 'error');
				} else {
					this.syllabusService.insertClasswisePeriod(this.systemInfoForm.value).subscribe((result: any) => {
						if (result && result.status === 'ok') {
							this.commonService.showSuccessErrorMessage('Classwise setup insert successfully', 'success');
							this.resetForm();
							this.getDetailsCdpRelation();
						}
					});
				}
			});
		} else {
			this.commonService.showSuccessErrorMessage('Please fill all required field', 'error');
		}
	}

	// get class wise day and period details
	getDetailsCdpRelation() {
		this.syllabusService.getDetailsCdpRelation()
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.detailArray = result.data;
					}
				}
			);
	}
}
