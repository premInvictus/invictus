import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { DynamicComponent } from '../../sharedmodule/dynamiccomponent';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonAPIService, SisService, ProcesstypeService } from '../../_services/index';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { saveAs } from 'file-saver';
@Component({
	selector: 'app-change-enrolment-status',
	templateUrl: './change-enrolment-status.component.html',
	styleUrls: ['./change-enrolment-status.component.scss']
})
export class ChangeEnrolmentStatusComponent implements OnInit {

	changeEnrolmentStatusForm: FormGroup;
	changeEnrolmentStatusForm2: FormGroup;
	changeEnrollmentNumberData: any[] = [];
	reasonDataArray: any[] = [];
	events: string[] = [];
	students: any[] = [];
	disableApiCall = false;
	showCancelDate = false;
	enrolmentPlaceholder = 'Enrolment';
	enrollMentTypeArray: any[] = [{
		au_process_type: '1', au_process_name: 'Enquiry'
	},
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
	},
	{
		au_process_type: '6', au_process_name: 'Dropout'
	}];
	enrollMentToArray: any[] = [];
	viewFlag = false;
	showCancel = false;
	showLeft = false;
	showActive = false;
	change_status = '';
	currIndex: any;
	selectedMembers: any[] = [];
	selectedMembersEnrolls: any[] = [];
	constructor(private fbuild: FormBuilder, public sanitizer: DomSanitizer,
		private notif: CommonAPIService, private sisService: SisService,
		private processType: ProcesstypeService,
		private router: Router,
		private route: ActivatedRoute) { }

	ngOnInit() {
		this.buildForm();
		this.getReason(8);
		localStorage.removeItem('change_enrolment_status_last_state');
	}

	buildForm() {
		this.changeEnrolmentStatusForm = this.fbuild.group({
			login_id: '',
			au_login_id: '',
			au_full_name: '',
			class: '',
			section: '',
			enrolment_type: '',
			doa: '',
			enrolment_to: '',
			reason_id: '',
			remarks: '',
			cancel_date: ''
		});
		this.changeEnrolmentStatusForm2 = this.fbuild.group({
			login_id: '',
			au_login_id: '',
			au_full_name: '',
			class: '',
			section: '',
			enrolment_type: '',
			doa: '',
			enrolment_to: '',
			reason_id: '',
			remarks: '',
			cancel_date: ''
		});

		const enrollment_no = this.route.snapshot.queryParams && this.route.snapshot.queryParams.login_id !== '' ?
			this.route.snapshot.queryParams.login_id : '';
		const enrollment_type = this.route.snapshot.queryParams && this.route.snapshot.queryParams.enrolment_type !== '' ?
			this.route.snapshot.queryParams.enrolment_type : '';

		if (enrollment_no) {
			// this.suspensionForm.value.susp_login_id = param_login_id;
			this.changeEnrolmentStatusForm.patchValue({
				'enrolment_type': enrollment_type,
				'au_login_id': enrollment_no
			});
			this.getStudentData('');
			this.prepareEnrolmentToArray('');
		}

	}

	changeTab($event) {

		this.currIndex = $event.index
		if (this.currIndex === 0) {
			this.changeEnrolmentStatusForm.reset();
		} else {
			this.changeEnrolmentStatusForm2.reset();
			this.selectedMembers = [];
			this.selectedMembersEnrolls = [];
			this.students = [];
		}
	}
	selectAll($event) {
		if ($event.checked) {
			this.selectedMembers = [];
			this.selectedMembersEnrolls = [];
			for (const item of this.students) {
				this.selectedMembers.push(item.au_login_id);
				this.selectedMembersEnrolls.push(item.au_admission_no);
			}
		} else {
			this.selectedMembers = [];
			this.selectedMembersEnrolls = [];
		}
	}
	checkIfExist(no) {
		const findex = this.selectedMembers.indexOf(no);
		if (findex !== -1) {
			return true;
		} else {
			return false;
		}
	}
	resetBulk() {
		this.changeEnrolmentStatusForm2.reset();
		this.selectedMembers = [];
		this.selectedMembersEnrolls = [];
		this.students = [];
	}
	chooseSelectedMembers(no, no2) {
		const findex = this.selectedMembers.indexOf(no);
		const findex2 = this.selectedMembersEnrolls.indexOf(no2);
		if (findex === -1) {
			this.selectedMembers.push(no);
		} else {
			this.selectedMembers.splice(findex, 1);
		}
		if (findex2 === -1) {
			this.selectedMembersEnrolls.push(no2);
		} else {
			this.selectedMembersEnrolls.splice(findex2, 1);
		}
	}

	getStudentData(event) {
		if (event) {
			event.stopPropagation();
		}

		if (this.changeEnrolmentStatusForm.value.enrolment_type === '' || this.changeEnrolmentStatusForm.value.au_login_id === '') {
			this.notif.showSuccessErrorMessage('Please choose enrolment type and fill enrolment no to get data', 'error');
		} else {
			const inputJson = {
				enrollment_type: this.changeEnrolmentStatusForm.value.enrolment_type,
			};
			if (this.changeEnrolmentStatusForm.value.enrolment_type === '1') {
				inputJson['enq_no'] = this.changeEnrolmentStatusForm.value.au_login_id;
			} else if (this.changeEnrolmentStatusForm.value.enrolment_type === '3') {
				inputJson['provisional_admission_no'] = this.changeEnrolmentStatusForm.value.au_login_id;
				inputJson['pmap_status'] = '1';
			} else if (this.changeEnrolmentStatusForm.value.enrolment_type === '4') {
				inputJson['admission_no'] = this.changeEnrolmentStatusForm.value.au_login_id;
				inputJson['pmap_status'] = '1';
			} else if (this.changeEnrolmentStatusForm.value.enrolment_type === '2') {
				inputJson['regd_no'] = this.changeEnrolmentStatusForm.value.au_login_id;
			} else if (this.changeEnrolmentStatusForm.value.enrolment_type === '5') {
				inputJson['alumini_no'] = this.changeEnrolmentStatusForm.value.au_login_id;
				inputJson['pmap_status'] = '1';
			} else if (this.changeEnrolmentStatusForm.value.enrolment_type === '6') {
				inputJson['admission_no'] = this.changeEnrolmentStatusForm.value.au_login_id;
				inputJson['pmap_status'] = '1';
			}
			if (inputJson) {
				this.sisService.getMasterStudentDetail(inputJson).subscribe((result: any) => {
					if (result && result.data && result.data[0]['au_login_id']) {
						console.log('getMasterStudentDetail');
						this.viewFlag = true;
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
						// if (result.data[0]['au_process_type'] === '3' || result.data[0]['au_process_type'] === '4'){
						// 	if (result.data[0]['au_enrollment_status'] === 'left') {

						// 		const indext = this.enrollMentToArray.findIndex(e => e.au_process_name == 'Dropout');
						// 		this.enrollMentToArray.splice(indext,1);
						// 		this.enrollMentToArray.push({au_process_type: '7', au_process_name: 'Re-admission'});
						// 	} else {
						// 		const indext = this.enrollMentToArray.findIndex(e => e.au_process_name == 'Re-admission');
						// 		this.enrollMentToArray.splice(indext,1);
						// 		this.enrollMentToArray.push({au_process_type: '6', au_process_name: 'Dropout'});
						// 	}
						// }
						this.changeEnrolmentStatusForm.patchValue({
							login_id: result.data[0]['au_login_id'],
							au_login_id: enrollment_no,
							au_full_name: result.data[0]['au_full_name'],
							class: result.data[0]['class_name'],
							section: result.data[0]['sec_name'],
							doa: result.data[0]['upd_doj'],
						});
						this.change_status = '';
					} else {
						this.notif.showSuccessErrorMessage('No Record found for this Student', 'error');
						this.changeEnrolmentStatusForm.reset();
					}
				});
			}
		}

	}

	checkForCancelDate(event, value) {
		if (event.checked) {

			this.change_status = value;
		} else {
			this.change_status = '';
		}
		if (this.change_status === 'cancel' || this.change_status === 'left') {
			this.showCancelDate = true;
		} else {
			this.showCancelDate = false;
		}
	}

	getReason(reason_type) {
		this.sisService.getReason({ reason_type }).subscribe((result: any) => {
			if (result) {
				this.reasonDataArray = result.data;

			}
		});
	}

	prepareEnrolmentToArray(event) {
		if (this.currIndex === 1) {
			this.sisService.getStudentsDataPerProcessType({
				process_type_from: event.value
			}).subscribe((res: any) => {
				if (res && res.status === 'ok') {
					this.selectedMembers = [];
					this.selectedMembersEnrolls = [];
					this.students = [];
					this.students = res.data;
				} else {
					this.selectedMembers = [];
					this.selectedMembersEnrolls = [];
					this.students = [];
				}
			});
		}
		const temp_arr = [];
		this.enrollMentToArray = [];
		for (let i = 0; i < this.enrollMentTypeArray.length; i++) {
			if (this.changeEnrolmentStatusForm.value.enrolment_type === '1'
				|| this.changeEnrolmentStatusForm2.value.enrolment_type === '1') {
				this.enrolmentPlaceholder = 'Enquiry';
				if (this.enrollMentTypeArray[i]['au_process_type'] === '2') {
					temp_arr.push(this.enrollMentTypeArray[i]);
				}
				this.showCancel = true;
				this.showLeft = false;
				this.showActive = false;
			} else if (this.changeEnrolmentStatusForm.value.enrolment_type === '2' ||
				this.changeEnrolmentStatusForm2.value.enrolment_type === '2') {
				this.enrolmentPlaceholder = 'Regisrtation';
				if (this.enrollMentTypeArray[i]['au_process_type'] !== '2' &&
					this.enrollMentTypeArray[i]['au_process_type'] !== '1' && this.enrollMentTypeArray[i]['au_process_type'] !== '5'
					&& this.enrollMentTypeArray[i]['au_process_type'] !== '6') {
					temp_arr.push(this.enrollMentTypeArray[i]);
				}
				this.showCancel = true;
				this.showLeft = false;
				this.showActive = false;
			} else if (this.changeEnrolmentStatusForm.value.enrolment_type === '3'
				|| this.changeEnrolmentStatusForm2.value.enrolment_type === '3') {
				this.enrolmentPlaceholder = 'Provisional Admission';
				if (this.enrollMentTypeArray[i]['au_process_type'] !== '1' && this.enrollMentTypeArray[i]['au_process_type'] !== '2'
					&& this.enrollMentTypeArray[i]['au_process_type'] !== '3') {
					temp_arr.push(this.enrollMentTypeArray[i]);
				}
				this.showCancel = false;
				this.showLeft = true;
				this.showActive = false;
			} else if (this.changeEnrolmentStatusForm.value.enrolment_type === '4'
				|| this.changeEnrolmentStatusForm2.value.enrolment_type === '4') {
				this.enrolmentPlaceholder = 'Admission';
				if (this.enrollMentTypeArray[i]['au_process_type'] !== '1' && this.enrollMentTypeArray[i]['au_process_type'] !== '2'
					&& this.enrollMentTypeArray[i]['au_process_type'] !== '4') {
					temp_arr.push(this.enrollMentTypeArray[i]);
				}
				this.showCancel = false;
				this.showLeft = true;
				this.showActive = false;
			} else if (this.changeEnrolmentStatusForm.value.enrolment_type === '5'
				|| this.changeEnrolmentStatusForm2.value.enrolment_type === '5') {
				this.enrolmentPlaceholder = 'Alumini';
				if (this.enrollMentTypeArray[i]['au_process_type'] !== '1' && this.enrollMentTypeArray[i]['au_process_type'] !== '2'
					&& this.enrollMentTypeArray[i]['au_process_type'] !== '5'
					&& this.enrollMentTypeArray[i]['au_process_type'] !== '6') {
					temp_arr.push(this.enrollMentTypeArray[i]);
				}
				this.showCancel = false;
				this.showLeft = false;
				this.showActive = true;
			} else {
				this.enrolmentPlaceholder = 'Enrolment';
			}

		}
		this.enrollMentToArray = temp_arr;
		// if (this.changeEnrolmentStatusForm.value.enrolment_type === '3' || this.changeEnrolmentStatusForm.value.enrolment_type === '4') {
		// 	this.enrollMentToArray.push({au_process_type: '6', au_process_name: 'Dropout'});
		// }
		if (this.changeEnrolmentStatusForm.value.enrolment_type === '6'
			|| this.changeEnrolmentStatusForm2.value.enrolment_type === '6') {
			this.enrollMentToArray = [];
			this.enrollMentToArray.push({ au_process_type: '7', au_process_name: 'Re-admission' });
		}

	}

	viewStudentProfile() {
		if (this.changeEnrolmentStatusForm.value.enrolment_type === '1') {
			this.router.navigate(['../../studentmaster/enquiry'], {
				queryParams: { login_id: this.changeEnrolmentStatusForm.value.au_login_id },
				relativeTo: this.route
			});
		} else if (this.changeEnrolmentStatusForm.value.enrolment_type === '3') {
			this.router.navigate(['../../studentmaster/provisional'], {
				queryParams: { login_id: this.changeEnrolmentStatusForm.value.au_login_id },
				relativeTo: this.route
			});
		} else if (this.changeEnrolmentStatusForm.value.enrolment_type === '4') {
			this.router.navigate(['../../studentmaster/admission'], {
				queryParams: { login_id: this.changeEnrolmentStatusForm.value.au_login_id },
				relativeTo: this.route
			});
		} else if (this.changeEnrolmentStatusForm.value.enrolment_type === '2') {
			this.router.navigate(['../../studentmaster/registration'], {
				queryParams: { login_id: this.changeEnrolmentStatusForm.value.au_login_id },
				relativeTo: this.route
			});
		} else if (this.changeEnrolmentStatusForm.value.enrolment_type === '5') {
			this.router.navigate(['../../studentmaster/alumini'], {
				queryParams: { login_id: this.changeEnrolmentStatusForm.value.au_login_id },
				relativeTo: this.route
			});
		}

		const last_state_json = {
			url: JSON.stringify(['../../auxilliarytool/change-enrolment-status']),
			login_id: this.changeEnrolmentStatusForm.value.au_login_id,
			enrolment_type: this.changeEnrolmentStatusForm.value.enrolment_type
		};
		localStorage.setItem('change_enrolment_status_last_state', JSON.stringify(last_state_json));
	}
	saveEnrolmentStatusBulk() {
		if (this.selectedMembers.length > 0 && this.changeEnrolmentStatusForm2.valid) {
			this.disableApiCall = true;
			const inputJson = {
				login_id: this.selectedMembers,
				enrollment_no: this.selectedMembersEnrolls,
				process_type_from: this.changeEnrolmentStatusForm2.value.enrolment_type,
				process_type_to: this.changeEnrolmentStatusForm2.value.enrolment_to,
				enrollment_reason: this.changeEnrolmentStatusForm2.value.reason_id,
				enrollment_remark: this.changeEnrolmentStatusForm2.value.remarks,
				enrollment_status: this.change_status,
				cancel_date: this.changeEnrolmentStatusForm2.value.cancel_date ? this.changeEnrolmentStatusForm2.value.cancel_date : '',
			};
			this.sisService.changeEnrollBulk(inputJson).subscribe((res: any) => {
				if (res && res.status == 'ok') {
					this.selectedMembersEnrolls = [];
					this.selectedMembers = [];
					this.students = [];
					this.disableApiCall = false;
					this.notif.showSuccessErrorMessage("Status changed successfully", 'success');
					this.changeEnrolmentStatusForm2.reset();
				}
			});
		}
	}
	saveEnrolmentStatus() {
		if (this.changeEnrolmentStatusForm.valid) {
			this.disableApiCall = true;
			const inputJson = {
				login_id: this.changeEnrolmentStatusForm.value.login_id,
				enrollment_no: this.changeEnrolmentStatusForm.value.au_login_id,
				process_type_from: this.changeEnrolmentStatusForm.value.enrolment_type,
				process_type_to: this.changeEnrolmentStatusForm.value.enrolment_to,
				enrollment_reason: this.changeEnrolmentStatusForm.value.reason_id,
				enrollment_remark: this.changeEnrolmentStatusForm.value.remarks,
				enrollment_status: this.change_status,
				cancel_date: this.changeEnrolmentStatusForm.value.cancel_date ? this.changeEnrolmentStatusForm.value.cancel_date : '',
			};
			this.sisService.changeEnrollmentStatus(inputJson).subscribe((result: any) => {
				if (result.data && result.status === 'ok') {
					this.disableApiCall = false;
					this.notif.showSuccessErrorMessage(result.message, 'success');
					if (inputJson['process_type_from'] === '1' || inputJson['process_type_from'] === '2') {
						const invoiceJSOn = {
							processFrom: this.changeEnrolmentStatusForm.value.enrolment_type,
							processTo: this.changeEnrolmentStatusForm.value.enrolment_to,
							login_id: [result.data.toString()]
						};
						this.disableApiCall = true;
						this.sisService.insertInvoice(invoiceJSOn).subscribe((result2: any) => {
							if (result2.data && result2.status === 'ok') {
								const length = result2.data.split('/').length;
								saveAs(result2.data, result2.data.split('/')[length - 1]);
								this.change_status = '';
								this.showCancel = false;
								this.showLeft = false;
								this.showActive = false;
								this.disableApiCall = false;
								this.reset();
							} else {
								this.disableApiCall = false;
							}
						});
					} else {
						this.change_status = '';
						this.showCancel = false;
						this.showLeft = false;
						this.showActive = false;
						this.disableApiCall = false;
						this.reset();
					}
				} else {
					this.disableApiCall = false;
				}
			});

		} else {
			this.notif.showSuccessErrorMessage('Please fill all required fields', 'error');
		}
	}

	reset() {
		this.changeEnrolmentStatusForm.reset();
	}

	enrolStatusToEvent(type: string, event: MatDatepickerInputEvent<Date>) {
		this.events.push(`${type}: ${event.value}`);
		const datePipe = new DatePipe('en-US');
		const convertedDate = datePipe.transform(this.changeEnrolmentStatusForm.value.doa, 'yyyy-MM-dd');
		this.changeEnrolmentStatusForm.patchValue({
			'doa': convertedDate
		});
	}

	enrolCancelToEvent(type: string, event: MatDatepickerInputEvent<Date>) {
		this.events.push(`${type}: ${event.value}`);
		const datePipe = new DatePipe('en-US');
		const convertedDate = datePipe.transform(this.changeEnrolmentStatusForm.value.cancel_date, 'yyyy-MM-dd');
		this.changeEnrolmentStatusForm.patchValue({
			'cancel_date': convertedDate
		});
	}
	setProcess($event) {
		if ($event.value === '5' && this.changeEnrolmentStatusForm.value.enrolment_type !== '5') {
			this.getReason(10);
		} else {
			this.getReason(8);
		}
		this.processType.setProcesstype($event.value);
	}


}
