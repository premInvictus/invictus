import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { DynamicComponent } from '../../sharedmodule/dynamiccomponent';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonAPIService, SisService } from '../../_services/index';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
	selector: 'app-change-enrolment-number',
	templateUrl: './change-enrolment-number.component.html',
	styleUrls: ['./change-enrolment-number.component.scss']
})
export class ChangeEnrolmentNumberComponent implements OnInit {
	changeNumberForm: FormGroup;
	changeEnrollmentNumberData: any[] = [];
	reasonDataArray: any[] = [];
	events: string[] = [];
	enrollMentTypeArray: any[] = [
		{
			au_process_type: '2', au_process_name: 'Registration'
		},
		{
			au_process_type: '3', au_process_name: 'Provisional Admission'
		},
		{
			au_process_type: '4', au_process_name: 'Admission'
		},
		{
			au_process_type: '5', au_process_name: 'Alumini'
		}];
	viewFlag = false;
	availabilityStatus = 0;
	enrolmentPlaceholder = 'Enrolment';
	constructor(private fbuild: FormBuilder, public sanitizer: DomSanitizer,
		private notif: CommonAPIService, private sisService: SisService,
		private router: Router,
		private route: ActivatedRoute) { }

	ngOnInit() {
		this.buildForm();
		this.getReason();
		localStorage.removeItem('change_enrolment_number_last_state');
	}

	buildForm() {
		this.changeNumberForm = this.fbuild.group({
			login_id: '',
			enrollment_no: '',
			au_full_name: '',
			class_section: '',
			enrolment_type: '',
			doa: '',
			enrolment_to: '',
			reason_id: '',
			remarks: ''
		});

		const enrollment_no = this.route.snapshot.queryParams
			&& this.route.snapshot.queryParams.login_id !== '' ?
			this.route.snapshot.queryParams.login_id : '';
		const enrollment_type = this.route.snapshot.queryParams
			&& this.route.snapshot.queryParams.enrolment_type !== '' ?
			this.route.snapshot.queryParams.enrolment_type : '';

		if (enrollment_no) {
			// this.suspensionForm.value.susp_login_id = param_login_id;
			this.changeNumberForm.patchValue({
				'enrolment_type': enrollment_type,
				'enrollment_no': enrollment_no
			});
			this.setEnrolmentPlaceholder('');
			this.getStudentData('');
		}
	}

	getReason() {
		this.sisService.getReason({ reason_type: 7 }).subscribe((result: any) => {
			if (result) {
				this.reasonDataArray = result.data;
			}
		});
	}

	getStudentData(event) {
		if (event) {
			event.stopPropagation();
		}
		if (this.changeNumberForm.value.enrolment_type === '' || this.changeNumberForm.value.enrollment_no === '') {
			this.notif.showSuccessErrorMessage('Please choose enrolment type and fill enrolment no to get data', 'error');
		} else {
			const inputJson = {
				enrollment_type: this.changeNumberForm.value.enrolment_type
			};
			if (this.changeNumberForm.value.enrolment_type === '1') {
				inputJson['enq_no'] = this.changeNumberForm.value.enrollment_no;
			} else if (this.changeNumberForm.value.enrolment_type === '3') {
				inputJson['provisional_admission_no'] = this.changeNumberForm.value.enrollment_no;
				inputJson['pmap_status'] = '1';
			} else if (this.changeNumberForm.value.enrolment_type === '4') {
				inputJson['admission_no'] = this.changeNumberForm.value.enrollment_no;
				inputJson['pmap_status'] = '1';
			} else if (this.changeNumberForm.value.enrolment_type === '2') {
				inputJson['regd_no'] = this.changeNumberForm.value.enrollment_no;
			} else if (this.changeNumberForm.value.enrolment_type === '5') {
				inputJson['alumini_no'] = this.changeNumberForm.value.enrollment_no;
				inputJson['pmap_status'] = '1';
			}
			if (inputJson) {
				this.sisService.getMasterStudentDetail(inputJson).subscribe((result: any) => {
					if (result && result.data && result.data[0]['au_login_id']) {
						let enrollment_no = '';
						if (result.data[0]['au_process_type'] === '1') {
							enrollment_no = result.data[0]['em_enq_no'];
						} else if (result.data[0]['au_process_type'] === '2') {
							enrollment_no = result.data[0]['em_regd_no'];
						} else if (result.data[0]['au_process_type'] === '3') {
							enrollment_no = result.data[0]['em_provisional_admission_no'];
						} else if (result.data[0]['au_process_type'] === '4') {
							enrollment_no = result.data[0]['em_admission_no'];
						} else if (result.data[0]['au_process_type'] === '5') {
							enrollment_no = result.data[0]['em_alumini_no'];
						}

						this.changeNumberForm.patchValue({
							login_id: result.data[0]['au_login_id'],
							enrollment_no: enrollment_no,
							au_full_name: result.data[0]['au_full_name'],
							class_section: result.data[0]['class_name'] + '-' + result.data[0]['sec_name'],
							enrolment_type: result.data[0]['au_process_type'],
							doa: result.data[0]['upd_doj'],
						});
						this.viewFlag = true;
					} else {
						this.notif.showSuccessErrorMessage('No Record found for this Student', 'error');
						this.changeNumberForm.reset();
					}
				});
			}
		}
	}



	viewStudentProfile() {
		// this.router.navigate(['../../studentmaster/admission'], {queryParams: {login_id: '1133'}, relativeTo: this.route});
		if (this.changeNumberForm.value.enrolment_type === '1') {
			this.router.navigate(['../../studentmaster/enquiry'], {
				queryParams: { login_id: this.changeNumberForm.value.enrollment_no },
				relativeTo: this.route
			});
		} else if (this.changeNumberForm.value.enrolment_type === '3') {
			this.router.navigate(['../../studentmaster/provisional'], {
				queryParams: { login_id: this.changeNumberForm.value.enrollment_no },
				relativeTo: this.route
			});
		} else if (this.changeNumberForm.value.enrolment_type === '4') {
			this.router.navigate(['../../studentmaster/admission'], {
				queryParams: { login_id: this.changeNumberForm.value.enrollment_no },
				relativeTo: this.route
			});
		} else if (this.changeNumberForm.value.enrolment_type === '2') {
			this.router.navigate(['../../studentmaster/registration'], {
				queryParams: { login_id: this.changeNumberForm.value.enrollment_no },
				relativeTo: this.route
			});
		} else if (this.changeNumberForm.value.enrolment_type === '5') {
			this.router.navigate(['../../studentmaster/alumini'], {
				queryParams: { login_id: this.changeNumberForm.value.enrollment_no },
				relativeTo: this.route
			});
		}

		const last_state_json = {
			url: JSON.stringify(['../../auxilliarytool/change-enrolment-number']),
			login_id: this.changeNumberForm.value.enrollment_no,
			enrolment_type: this.changeNumberForm.value.enrolment_type
		};
		localStorage.setItem('change_enrolment_number_last_state', JSON.stringify(last_state_json));
	}



	saveEnrolmentNumber() {

		if (this.changeNumberForm.valid) {
			const inputJson = {
				login_id: this.changeNumberForm.value.login_id,
				process_type: this.changeNumberForm.value.enrolment_type,
				enrollment_no: this.changeNumberForm.value.enrollment_no,
				enrollment_to: this.changeNumberForm.value.enrolment_to,
				enrollment_reason: this.changeNumberForm.value.reason_id,
				enrollment_remark: this.changeNumberForm.value.remarks
			};

			this.checkEnrolmentNumberAvailability(inputJson);


		} else {
			this.notif.showSuccessErrorMessage('Please fill all required fields', 'error');
		}
	}

	checkEnrolmentNumberAvailability(formJson) {
		const inputJson = {
			process_type: this.changeNumberForm.value.enrolment_type
		};
		this.sisService.maxEnrollmentNo(inputJson).subscribe((result: any) => {

			if (result && result.status === 'ok') {
				this.availabilityStatus = result['available_id'];
				if (this.availabilityStatus) {
					this.sisService.changeEnrolmentNumber(formJson).subscribe((resultn: any) => {
						if (resultn && resultn.status === 'ok') {
							this.notif.showSuccessErrorMessage('Student Enrolment Number Changed Successfully', 'success');
							this.reset();
						} else {
							this.notif.showSuccessErrorMessage('Required Enrolment Number not available, please choose another ', 'error');
						}
					});
				}
			} else {
				this.notif.showSuccessErrorMessage('Required Enrolment Number not available, please choose another', 'error');
				this.availabilityStatus = 0;
			}
		});
	}

	reset() {
		this.changeNumberForm.reset();
	}



	enrolAdmissionToEvent(type: string, event: MatDatepickerInputEvent<Date>) {
		this.events.push(`${type}: ${event.value}`);
		const datePipe = new DatePipe('en-US');
		const convertedDate = datePipe.transform(this.changeNumberForm.value.doa, 'yyyy-MM-dd');
		this.changeNumberForm.patchValue({
			'doa': convertedDate
		});
	}

	setEnrolmentPlaceholder(event) {
		if (this.changeNumberForm.value.enrolment_type === '1') {
			this.enrolmentPlaceholder = 'Enquiry';
		} else if (this.changeNumberForm.value.enrolment_type === '2') {
			this.enrolmentPlaceholder = 'Registration';
		} else if (this.changeNumberForm.value.enrolment_type === '3') {
			this.enrolmentPlaceholder = 'Provisional Admission';
		} else if (this.changeNumberForm.value.enrolment_type === '4') {
			this.enrolmentPlaceholder = 'Admission';
		} else if (this.changeNumberForm.value.enrolment_type === '5') {
			this.enrolmentPlaceholder = 'Alumini';
		} else {
			this.enrolmentPlaceholder = 'Enrolment';
		}
	}

}
