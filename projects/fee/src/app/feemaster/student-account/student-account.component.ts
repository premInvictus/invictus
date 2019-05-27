import { Component, OnInit, OnChanges, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { CommonAPIService, FeeService } from '../../_services';
import { DatePipe } from '@angular/common';
import { ConfirmValidParentMatcher } from '../../_validationclass/confirmValidParentMatcher.class';

@Component({
	selector: 'app-student-account',
	templateUrl: './student-account.component.html',
	styleUrls: ['./student-account.component.scss']
})
export class StudentAccountComponent implements OnInit, OnChanges {

	confirmValidParentMatcher = new ConfirmValidParentMatcher();
	accountsForm: FormGroup;
	feeOtherCategory: any[] = [];
	feeStructureArray: any[] = [];
	conGroupArray: any[] = [];
	hostelFeeStructureArray: any[] = [];
	hostelConGroupArray: any[] = [];
	transportFlag = false;
	hostelFlag = false;
	modeFlag = false;
	terminationFlag = false;
	routeArray: any[] = [];
	stoppageArray: any[] = [];
	slabArray: any[] = [];
	transPortModes: any[] = [];
	lastRecordId;
	loginId: any;
	terminateStatus: any;
	hostelStatus: any;
	existFlag = false;
	hostelTerminateFlag = false;
	@ViewChild('editModal') editModal;
	@Input() viewOnly = true;
	@Input() feeLoginId: any;
	@Output() editChange = new EventEmitter();
	finalSibReqArray: any[] = [];
	finalArray: any[] = [];
	accountDetails: any = {};
	slabModel: any = '';
	reqObj: any = {};
	constructor(
		private fbuild: FormBuilder,
		private feeService: FeeService,
		private commonAPIService: CommonAPIService,
	) { }

	ngOnInit() {
		this.terminateStatus = 'Transport Facility Terminated';
		this.hostelStatus = 'Hostel Facility Terminated';
		this.buildForm();
		this.getFeeOtherCategory();
		this.getConGroup();
		this.getFeeStructures();
		this.getHostelConGroup();
		this.getHostelFeeStructures();
		this.getTransportMode();
		this.getRoutes();
	}
	ngOnChanges() {
		if (this.feeLoginId) {
			this.getFeeAccount(this.feeLoginId);
		}
	}
	buildForm() {
		this.accountsForm = this.fbuild.group({
			accd_id: '',
			accd_login_id: '',
			accd_fo_id: '',
			accd_fs_id: '',
			accd_fcg_id: '',
			accd_is_transport: '',
			accd_is_hostel: '',
			accd_transport_mode: '',
			accd_tr_id: '',
			accd_tsp_id: '',
			accd_ts_id: '',
			accd_is_terminate: '',
			accd_transport_from: '',
			accd_transport_to: '',
			accd_remark: '',
			accd_hostel_fs_id: '',
			accd_hostel_fcc_id: '',
			accd_hostel_from: '',
			accd_hostel_to: '',
			accd_ses_id: '',
			accd_created_by: '',
			accd_created_date: '',
			accd_is_hostel_terminate: '',
			accd_status: 1
		});
	}
	getFeeAccount(au_login_id) {
		this.stoppageArray = [];
		this.slabArray = [];
		this.transportFlag = false;
		this.hostelFlag = false;
		this.modeFlag = false;
		this.terminationFlag = false;
		this.existFlag = false;
		this.feeService.getFeeAccount({ accd_login_id: au_login_id }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.existFlag = true;
				this.accountDetails = result.data[0];
				if (this.accountDetails.accd_is_transport === 'Y') {
					this.transportFlag = true;
				} else {
					this.transportFlag = false;
				}
				if (this.accountDetails.accd_tr_id === '1' && this.accountDetails.accd_is_transport === 'Y') {
					this.modeFlag = true;
				} else {
					this.modeFlag = false;
				}
				if (this.accountDetails.accd_is_terminate === 'Y' && this.transportFlag && this.modeFlag) {
					this.terminationFlag = true;
					this.terminateStatus = 'Transport Facility Terminated';
				} else {
					this.terminationFlag = false;
					this.terminateStatus = 'Transport Facility Terminated';
				}
				if (this.accountDetails.accd_is_hostel_terminate === 'Y') {
					this.hostelTerminateFlag = true;
					this.hostelStatus = 'Hostel Facility Terminated';
				} else {
					this.hostelTerminateFlag = false;
					this.hostelStatus = 'Hostel Facility Terminated';
				}
				if (this.accountDetails.accd_is_hostel === 'Y') {
					this.hostelFlag = true;
				} else {
					this.hostelFlag = false;
				}
				this.enableMode(this.accountDetails.accd_transport_mode);
				this.getStoppages(this.accountDetails.accd_tr_id);
				this.getSlab(this.accountDetails.accd_tsp_id);
				this.accountsForm.patchValue({
					accd_id: this.accountDetails.accd_id,
					accd_login_id: this.accountDetails.accd_login_id,
					accd_fo_id: this.accountDetails.accd_fo_id,
					accd_fs_id: this.accountDetails.accd_fs_id,
					accd_fcg_id: this.accountDetails.accd_fcg_id,
					accd_is_transport: this.accountDetails.accd_is_transport === 'N' ? false : true,
					accd_is_hostel: this.accountDetails.accd_is_hostel === 'N' ? false : true,
					accd_transport_mode: this.accountDetails.accd_transport_mode,
					accd_tr_id: this.accountDetails.accd_tr_id,
					accd_tsp_id: this.accountDetails.accd_tsp_id,
					accd_ts_id: this.accountDetails.accd_ts_id,
					accd_is_terminate: this.accountDetails.accd_is_terminate === 'N' ? false : true,
					accd_is_hostel_terminate: this.accountDetails.accd_is_hostel_terminate === 'N' ? false : true,
					accd_transport_from: this.accountDetails.accd_transport_from.split('-')[0] === '1970' ? '' : this.accountDetails.accd_transport_from,
					accd_transport_to: this.accountDetails.accd_transport_to.split('-')[0] === '1970' ? '' : this.accountDetails.accd_transport_to,
					accd_remark: this.accountDetails.accd_remark,
					accd_hostel_fs_id: this.accountDetails.accd_hostel_fs_id,
					accd_hostel_fcc_id: this.accountDetails.accd_hostel_fcc_id,
					accd_hostel_from: this.accountDetails.accd_hostel_from.split('-')[0] === '1970' ? '' : this.accountDetails.accd_hostel_from,
					accd_hostel_to: this.accountDetails.accd_hostel_to.split('-')[0] === '1970' ? '' : this.accountDetails.accd_hostel_to,
					accd_ses_id: this.accountDetails.ses_id,
					accd_status: this.accountDetails.accd_status
				});
				this.slabModel = this.accountDetails.accd_ts_id;
			} else {
				this.accountsForm.reset();
				this.transportFlag = false;
				this.hostelFlag = false;
				this.modeFlag = false;
				this.terminationFlag = false;
				this.existFlag = false;
			}
		});
	}
	getFeeOtherCategory() {
		this.feeService.getFeeOthers({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.feeOtherCategory = result.data;
			}
		});
	}
	getFeeStructures() {
		this.feeService.getFeeStructure({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.feeStructureArray = result.data;
			}
		});
	}
	getConGroup() {
		this.feeService.getConcessionGroup({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.conGroupArray = result.data;
			}
		});
	}
	getHostelFeeStructures() {
		this.feeService.getFeeStructure({ fs_is_hostel_fee: 1 }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.hostelFeeStructureArray = result.data;
			}
		});
	}
	getHostelConGroup() {
		this.feeService.getConcessionGroup({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.hostelConGroupArray = result.data;
			}
		});
	}
	enableTransport($event) {
		if ($event.checked) {
			this.transportFlag = true;
		} else {
			this.accountsForm.patchValue({
				accd_transport_mode: '',
				accd_tr_id: '',
				accd_tsp_id: '',
				accd_ts_id: '',
				accd_is_terminate: 'N',
				accd_transport_from: '',
				accd_transport_to: '',
			});
			this.slabArray = [];
			this.stoppageArray = [];
			this.transportFlag = false;
		}
	}
	enableHostel($event) {
		if ($event.checked) {
			this.hostelFlag = true;
		} else {
			this.accountsForm.patchValue({
				accd_hostel_fs_id: '',
				accd_hostel_fcc_id: '',
				accd_hostel_from: '',
				accd_hostel_to: '',
				accd_is_hostel_terminate: 'N',
			});
			this.hostelFlag = false;
		}
	}
	getTransportMode() {
		this.feeService.getTransportMode().subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.transPortModes = result.data;
			}
		});
	}
	getRoutes() {
		this.feeService.getRoutes({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.routeArray = result.data;
			}
		});
	}
	enableMode($event) {
		if ($event === '1') {
			this.modeFlag = true;
		} else {
			this.modeFlag = false;
		}
	}
	terminate($event) {
		if ($event.checked) {
			this.terminationFlag = true;
			this.terminateStatus = 'Transport Facility Terminated';
		} else {
			this.terminationFlag = false;
			this.terminateStatus = 'Transport  Facility Terminated';
		}
	}
	hostel($event) {
		if ($event.checked) {
			this.hostelTerminateFlag = true;
			this.hostelStatus = 'Hostel Facility Terminated';
		} else {
			this.hostelTerminateFlag = false;
			this.hostelStatus = 'Hostel  Facility Terminated';
		}
	}
	submit() {
		let validateFlag = true;
		if (!this.accountsForm.value.accd_fo_id &&
			!this.accountsForm.value.accd_fs_id &&
			!this.modeFlag && !this.transportFlag && !this.hostelFlag
			&& !this.terminationFlag) {
			this.accountsForm.get('accd_fo_id').markAsDirty();
			this.accountsForm.get('accd_fs_id').markAsDirty();
			validateFlag = false;
		}
		if (this.transportFlag && !this.modeFlag) {
			if (!this.accountsForm.value.accd_transport_mode) {
				validateFlag = false;
				this.accountsForm.get('accd_transport_mode').markAsDirty();
			}
		}
		if (this.transportFlag && this.modeFlag) {
			if (!this.accountsForm.value.accd_tr_id &&
				!this.accountsForm.value.accd_tsp_id &&
				!this.accountsForm.value.accd_ts_id &&
				!this.accountsForm.value.accd_transport_from) {
				this.accountsForm.get('accd_tr_id').markAsDirty();
				this.accountsForm.get('accd_tsp_id').markAsDirty();
				this.accountsForm.get('accd_ts_id').markAsDirty();
				this.accountsForm.get('accd_transport_from').markAsDirty();
				validateFlag = false;
			}
		}
		if (this.terminationFlag) {
			if (!this.accountsForm.value.accd_transport_to) {
				this.accountsForm.get('accd_transport_to').markAsDirty();
				validateFlag = false;
			}
		} if (validateFlag) {
			const datePipe = new DatePipe('en-in');
			let accountJSON = {};
			accountJSON = {
				accd_id: this.accountsForm.value.accd_id,
				accd_login_id: this.feeLoginId,
				accd_fo_id: this.accountsForm.value.accd_fo_id,
				accd_fs_id: this.accountsForm.value.accd_fs_id,
				accd_fcg_id: this.accountsForm.value.accd_fcg_id,
				accd_is_transport: this.transportFlag ? 'Y' : 'N',
				accd_is_hostel: this.hostelFlag ? 'Y' : 'N',
				accd_transport_mode: this.accountsForm.value.accd_transport_mode,
				accd_tr_id: this.accountsForm.value.accd_tr_id,
				accd_tsp_id: this.accountsForm.value.accd_tsp_id,
				accd_ts_id: this.accountsForm.value.accd_ts_id,
				accd_is_terminate: this.terminationFlag ? 'Y' : 'N',
				accd_is_hostel_terminate: this.hostelTerminateFlag ? 'Y' : 'N',
				accd_transport_from: datePipe.transform(this.accountsForm.value.accd_transport_from, 'yyyy-MM-dd'),
				accd_transport_to: datePipe.transform(this.accountsForm.value.accd_transport_to, 'yyyy-MM-dd'),
				accd_remark: this.accountsForm.value.accd_remark,
				accd_hostel_fs_id: this.accountsForm.value.accd_hostel_fs_id,
				accd_hostel_fcc_id: this.accountsForm.value.accd_hostel_fcc_id,
				accd_hostel_from: datePipe.transform(this.accountsForm.value.accd_hostel_from, 'yyyy-MM-dd'),
				accd_hostel_to: datePipe.transform(this.accountsForm.value.accd_hostel_to, 'yyyy-MM-dd'),
				accd_status: '1'
			};
			this.feeService.insertFeeAccount(accountJSON).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.commonAPIService.showSuccessErrorMessage('Inserted SucessFully', 'success');
					this.getFeeAccount(this.feeLoginId);
					this.editChange.emit(this.feeLoginId);
				} else {
					this.editChange.emit(this.feeLoginId);
				}
			});
		} else {
			this.commonAPIService.showSuccessErrorMessage('Please select required fields', 'error');
		}
	}
	update() {
		let validateFlag = true;
		if (!this.feeLoginId) {
			validateFlag = false;
			this.commonAPIService.showSuccessErrorMessage('Please choose a student  to proceed', 'error');
		}
		if (!this.accountsForm.value.accd_fo_id &&
			!this.accountsForm.value.accd_fs_id &&
			!this.modeFlag && !this.transportFlag && !this.hostelFlag
			&& !this.terminationFlag) {
			this.accountsForm.get('accd_fo_id').markAsDirty();
			this.accountsForm.get('accd_fs_id').markAsDirty();
			validateFlag = false;
		}
		if (this.transportFlag && !this.modeFlag) {
			if (!this.accountsForm.value.accd_transport_mode) {
				validateFlag = false;
				this.accountsForm.get('accd_transport_mode').markAsDirty();
			}
		}
		if (this.transportFlag && this.modeFlag) {
			if (!this.accountsForm.value.accd_tr_id &&
				!this.accountsForm.value.accd_tsp_id &&
				!this.accountsForm.value.accd_ts_id &&
				!this.accountsForm.value.accd_transport_from) {
				this.accountsForm.get('accd_tr_id').markAsDirty();
				this.accountsForm.get('accd_tsp_id').markAsDirty();
				this.accountsForm.get('accd_ts_id').markAsDirty();
				this.accountsForm.get('accd_transport_from').markAsDirty();
				validateFlag = false;
			}
		}
		if (this.terminationFlag) {
			if (!this.accountsForm.value.accd_transport_to) {
				this.accountsForm.get('accd_transport_to').markAsDirty();
				validateFlag = false;
			}
		}
		if (validateFlag) {
			const datePipe = new DatePipe('en-in');
			let accountJSON = {};
			accountJSON = {
				accd_id: this.accountsForm.value.accd_id,
				accd_login_id: this.feeLoginId,
				accd_fo_id: this.accountsForm.value.accd_fo_id,
				accd_fs_id: this.accountsForm.value.accd_fs_id,
				accd_fcg_id: this.accountsForm.value.accd_fcg_id,
				accd_is_transport: this.transportFlag ? 'Y' : 'N',
				accd_is_hostel: this.hostelFlag ? 'Y' : 'N',
				accd_transport_mode: this.accountsForm.value.accd_transport_mode,
				accd_tr_id: this.accountsForm.value.accd_tr_id,
				accd_tsp_id: this.accountsForm.value.accd_tsp_id,
				accd_ts_id: this.accountsForm.value.accd_ts_id,
				accd_is_terminate: this.terminationFlag ? 'Y' : 'N',
				accd_is_hostel_terminate: this.hostelTerminateFlag ? 'Y' : 'N',
				accd_transport_from: datePipe.transform(this.accountsForm.value.accd_transport_from, 'yyyy-MM-dd'),
				accd_transport_to: datePipe.transform(this.accountsForm.value.accd_transport_to, 'yyyy-MM-dd'),
				accd_remark: this.accountsForm.value.accd_remark,
				accd_hostel_fs_id: this.accountsForm.value.accd_hostel_fs_id,
				accd_hostel_fcc_id: this.accountsForm.value.accd_hostel_fcc_id,
				accd_hostel_from: datePipe.transform(this.accountsForm.value.accd_hostel_from, 'yyyy-MM-dd'),
				accd_hostel_to: datePipe.transform(this.accountsForm.value.accd_hostel_to, 'yyyy-MM-dd'),
				accd_status: this.accountsForm.value.accd_status
			};
			if (this.isExist('350')) {
				this.feeService.updateFeeAccount(accountJSON).subscribe((result: any) => {
					if (result && result.status === 'ok') {
						this.commonAPIService.showSuccessErrorMessage('Updated SucessFully', 'success');
						this.getFeeAccount(this.feeLoginId);
						this.editChange.emit(this.feeLoginId);
					} else {
						this.editChange.emit(this.feeLoginId);
					}
				});
			}
			if (this.isExist('374')) {
				this.checkFormChangedValue();
			}
		} else {
			this.commonAPIService.showSuccessErrorMessage('Please select required fields', 'error');
		}
	}
	next(admno) {
		this.loginId = admno;
		this.getFeeAccount(this.loginId);
	}
	prev(admno) {
		this.loginId = admno;
		this.getFeeAccount(this.loginId);
	}
	first(admno) {
		this.loginId = admno;
		this.getFeeAccount(this.loginId);
	}
	last(admno) {
		this.loginId = admno;
		this.getFeeAccount(this.loginId);
	}
	key(admno) {
		this.loginId = admno;
		this.getFeeAccount(this.loginId);
	}
	getPreviousData() {
		this.getFeeAccount(this.feeLoginId);
		this.viewOnly = true;
		this.editChange.emit(this.feeLoginId);
	}
	isExist(mod_id) {
		return this.commonAPIService.isExistUserAccessMenu(mod_id);
	}
	confirmEdit($event) {
		if ($event) {
			this.viewOnly = true;
			this.editChange.emit(this.feeLoginId);
		}
	}
	cancelEdit($event) {
		if ($event) {
			this.viewOnly = true;
			this.editChange.emit(this.feeLoginId);
		}
	}
	checkFormChangedValue() {
		this.finalSibReqArray = [];
		this.finalArray = [];
		const datepipe = new DatePipe('en-US');
		const sibReqArray: any[] = [];
		Object.keys(this.accountsForm.value).forEach((key: any) => {
			const formControl = <FormControl>this.accountsForm.controls[key];
			if (formControl.dirty) {
				if (key === 'accd_transport_from' || key === 'accd_transport_to'
					|| key === 'accd_hostel_to' || key === 'accd_hostel_from') {
					sibReqArray.push({
						rff_where_id: 'accd_id',
						rff_where_value: this.accountDetails['accd_id'],
						rff_field_name: key,
						rff_new_field_value: new DatePipe('en-in').transform(formControl.value, 'yyyy-MM-dd'),
						rff_old_field_value: this.accountDetails[key],
					});
				}
				if (key === 'accd_is_terminate' || key === 'accd_is_transport'
					|| key === 'accd_is_hostel' || key === 'accd_is_hostel_terminate') {
					sibReqArray.push({
						rff_where_id: 'accd_id',
						rff_where_value: this.accountDetails['accd_id'],
						rff_field_name: key,
						rff_new_field_value: formControl.value ? 'Y' : 'N',
						rff_old_field_value: this.accountDetails[key],
					});
				} else {
					sibReqArray.push({
						rff_where_id: 'accd_id',
						rff_where_value: this.accountDetails['accd_id'],
						rff_field_name: key,
						rff_new_field_value: formControl.value,
						rff_old_field_value: this.accountDetails[key],
					});
				}
			}
		});
		this.finalSibReqArray.push({ item: sibReqArray });
		for (const sib of this.finalSibReqArray) {
			for (const titem of sib.item) {
				this.finalArray.push(titem);
			}
		}
		this.reqObj = {
			req_login_id: JSON.parse(localStorage.getItem('currentUser')).login_id,
			req_process_type: '4',
			req_tab_id: '4',
			req_priority: '',
			req_remarks: '',
			req_reason: '',
			req_date: datepipe.transform(new Date, 'yyyy-MM-dd'),
			req_param: []
		};
		if (this.finalArray.length > 0) {
			this.editModal.openModal({ data: [this.finalArray], reqParam: [this.reqObj] });
		}
	}
	getStoppages($event) {
		this.accountsForm.patchValue({
			accd_tsp_id: '',
			accd_ts_id: ''
		});
		this.stoppageArray = [];
		this.feeService.getStoppagesPerRoute({ tr_id: $event.value }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.stoppageArray = result.data;
			}
		});
	}
	getSlab($event) {
		this.slabArray = [];
		this.feeService.getTransportSlabPerStoppages({ tsp_id: $event.value }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.slabArray = result.data;
				this.slabModel = this.slabArray[0].ts_id;
			}
		});
	}
}
