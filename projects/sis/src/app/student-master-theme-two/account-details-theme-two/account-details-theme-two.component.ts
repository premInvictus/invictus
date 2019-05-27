import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ConfirmValidParentMatcher } from '../../ConfirmValidParentMatcher';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FeeService } from 'projects/fee/src/app/_services';
import { ProcesstypeService, CommonAPIService } from '../../_services';
import { DatePipe } from '@angular/common';

@Component({
	selector: 'app-account-details-theme-two',
	templateUrl: './account-details-theme-two.component.html',
	styleUrls: ['./account-details-theme-two.component.css']
})
export class AccountDetailsThemeTwoComponent implements OnInit, OnChanges {
	@Input() addOnly = false;
	@Input() viewOnly = false;
	@Input() feeDet: any;
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
	@Input() editFlag = true;
	@Input() permissionFlag = false;
	@Input() feeLoginId: any;
	validateFlag = false;
	constructor(
		private fbuild: FormBuilder,
		private feeService: FeeService,
		private commonAPIService: CommonAPIService,
		public processtypeService: ProcesstypeService
	) { }

	ngOnInit() {
		this.terminateStatus = 'Transport Facility Available';
		this.hostelStatus = 'Hostel Facility Available';
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
		this.renderData();
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
	renderData() {
		if (this.feeDet.accd_login_id) {
			if (this.feeDet.accd_is_transport === 'Y') {
				this.transportFlag = true;
			} else {
				this.transportFlag = false;
			}
			if (this.feeDet.accd_tr_id === '1' && this.feeDet.accd_is_transport === 'Y') {
				this.modeFlag = true;
			} else {
				this.modeFlag = false;
			}
			if (this.feeDet.accd_is_terminate === 'Y') {
				this.terminationFlag = true;
				this.terminateStatus = 'Transport Facility Terminated';
			} else {
				this.terminationFlag = false;
				this.terminateStatus = 'Transport Facility Available';
			}
			if (this.feeDet.accd_is_hostel_terminate === 'Y') {
				this.hostelTerminateFlag = true;
				this.hostelStatus = 'Hostel Facility Terminated';
			} else {
				this.hostelTerminateFlag = false;
				this.hostelStatus = 'Hostel Facility Available';
			}
			if (this.feeDet.accd_is_hostel === 'Y') {
				this.hostelFlag = true;
			} else {
				this.hostelFlag = false;
			}
			this.getStoppages(this.feeDet.accd_tr_id);
			this.getSlab(this.feeDet.accd_tsp_id);
			this.accountsForm.patchValue({
				accd_id: this.feeDet.accd_id,
				accd_login_id: this.feeDet.accd_login_id,
				accd_fo_id: this.feeDet.accd_fo_id,
				accd_fs_id: this.feeDet.accd_fs_id,
				accd_fcg_id: this.feeDet.accd_fcg_id,
				accd_is_transport: this.feeDet.accd_is_transport === 'N' ? false : true,
				accd_is_hostel: this.feeDet.accd_is_hostel === 'N' ? false : true,
				accd_transport_mode: this.feeDet.accd_transport_mode,
				accd_tr_id: this.feeDet.accd_tr_id,
				accd_tsp_id: this.feeDet.accd_tsp_id,
				accd_ts_id: this.feeDet.accd_ts_id,
				accd_is_terminate: this.feeDet.accd_is_terminate === 'N' ? false : true,
				accd_is_hostel_terminate: this.feeDet.accd_is_hostel_terminate === 'N' ? false : true,
				accd_transport_from: this.feeDet.accd_transport_from,
				accd_transport_to: this.feeDet.accd_transport_to,
				accd_remark: this.feeDet.accd_remark,
				accd_hostel_fs_id: this.feeDet.accd_hostel_fs_id,
				accd_hostel_fcc_id: this.feeDet.accd_hostel_fcc_id,
				accd_hostel_from: this.feeDet.accd_hostel_from,
				accd_hostel_to: this.feeDet.accd_hostel_to,
				accd_ses_id: this.feeDet.ses_id,
				accd_status: this.feeDet.accd_status
			});
		} else {
			this.accountsForm.reset();
			this.transportFlag = false;
			this.hostelFlag = false;
			this.modeFlag = false;
			this.terminationFlag = false;
			this.existFlag = false;
		}
	}
	getFeeOtherCategory() {
		this.feeService.getFeeOthers({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.feeOtherCategory = result.data;
			}
		});
	}
	getFeeStructures() {
		this.feeService.getFeeStructure({ fs_is_hostel_fee: 0 }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.feeStructureArray = result.data;
			}
		});
	}
	getConGroup() {
		this.feeService.getConcessionGroup({ fcg_is_hostel_fee: 0 }).subscribe((result: any) => {
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
		this.feeService.getConcessionGroup({ fcg_is_hostel_fee: 1 }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.hostelConGroupArray = result.data;
			}
		});
	}
	enableTransport($event) {
		if ($event.checked) {
			this.transportFlag = true;
		} else {
			this.transportFlag = false;
		}
	}
	enableHostel($event) {
		if ($event.checked) {
			this.hostelFlag = true;
		} else {
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
			this.terminateStatus = 'Transport  Facility Available';
		}
	}
	hostel($event) {
		if ($event.checked) {
			this.hostelTerminateFlag = true;
			this.hostelStatus = 'Hostel Facility Terminated';
		} else {
			this.hostelTerminateFlag = false;
			this.hostelStatus = 'Hostel  Facility Available';
		}
	}
	submit() {
		this.validateFlag = true;
		if (!this.feeLoginId) {
			this.validateFlag = false;
			this.commonAPIService.showSuccessErrorMessage('Please choose a student  to proceed', 'error');
		}
		if (!this.accountsForm.value.accd_fo_id &&
			!this.accountsForm.value.accd_fs_id &&
			!this.modeFlag && !this.transportFlag && !this.hostelFlag
			&& !this.terminationFlag) {
			this.accountsForm.get('accd_fo_id').markAsDirty();
			this.accountsForm.get('accd_fs_id').markAsDirty();
			this.validateFlag = false;
		}
		if (this.transportFlag && !this.modeFlag) {
			if (!this.accountsForm.value.accd_transport_mode) {
				this.validateFlag = false;
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
				this.validateFlag = false;
			}
		}
		if (this.terminationFlag) {
			if (!this.accountsForm.value.accd_transport_to) {
				this.accountsForm.get('accd_transport_to').markAsDirty();
				this.validateFlag = false;
			}
		}  if (this.validateFlag) {
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
					// this.getFeeAccount(this.feeLoginId);
				}
			});
		}
	}
	update() {
		this.validateFlag = true;
		if (!this.feeLoginId) {
			this.validateFlag = false;
			this.commonAPIService.showSuccessErrorMessage('Please choose a student  to proceed', 'error');
		}
		if (!this.accountsForm.value.accd_fo_id &&
			!this.accountsForm.value.accd_fs_id &&
			!this.modeFlag && !this.transportFlag && !this.hostelFlag
			&& !this.terminationFlag) {
			this.accountsForm.get('accd_fo_id').markAsDirty();
			this.accountsForm.get('accd_fs_id').markAsDirty();
			this.validateFlag = false;
		}
		if (this.transportFlag && !this.modeFlag) {
			if (!this.accountsForm.value.accd_transport_mode) {
				this.validateFlag = false;
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
				this.validateFlag = false;
			}
		}
		if (this.terminationFlag) {
			if (!this.accountsForm.value.accd_transport_to) {
				this.accountsForm.get('accd_transport_to').markAsDirty();
				this.validateFlag = false;
			}
		} if (this.validateFlag) {
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
			this.feeService.updateFeeAccount(accountJSON).subscribe((result: any) => {
				if (result && result.status === 'ok') {
				}
			});
		}
	}
	isExist(mod_id) {
		return this.commonAPIService.isExistUserAccessMenu(mod_id);
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
			}
		});
	}
}
