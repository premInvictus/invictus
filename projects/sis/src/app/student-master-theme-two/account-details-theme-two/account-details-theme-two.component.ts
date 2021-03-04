import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ConfirmValidParentMatcher } from '../../ConfirmValidParentMatcher';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FeeService } from 'projects/fee/src/app/_services';
import { ProcesstypeService, CommonAPIService, SisService } from '../../_services';
import { DatePipe } from '@angular/common';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { PreviewDocumentComponent } from '../../student-master/documents/preview-document/preview-document.component';

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
	dialogRef2: MatDialogRef<PreviewDocumentComponent>;
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
	reasonArr: any[] = [];
	concessionArray: any[] = [];
	lastRecordId;
	loginId: any;
	terminateStatus: any;
	hostelStatus: any;
	existFlag = false;
	conStatus: any;
	concession_document: any;
	hostelTerminateFlag = false;
	@Input() editFlag = true;
	@Input() permissionFlag = false;
	@Input() feeLoginId: any;
	validateFlag = false;
	slabModel: any;
	conDesc: string;
	conDescFlag = false;;
	currentImage: any;
	documentsArray: any[] = [];
	finalDocumentArray: any[] = [];
	currentFileChangeEvent: any;
	multipleFileArray: any[] = [];
	counter: any = 0;
	documentPath: any;
	additionalFeeComponentArray: any[] = [];
	userClassId: '';
	buildingArray: any[] = [];
	roomArray: any[] = [];
	bedArray: any[] = [];
	constructor(
		private fbuild: FormBuilder,
		private feeService: FeeService,
		private commonAPIService: CommonAPIService,
		public processtypeService: ProcesstypeService,
		public sisService: SisService,
		private dialog: MatDialog,

	) { }

	ngOnInit() {
		this.terminateStatus = 'Terminate Transport Facility';
		this.hostelStatus = 'Terminate Hostel Facility';
		this.buildForm();
		this.getBuilding();
		this.getReason();
		this.getFeeOtherCategory();
		this.getConGroup();
		this.getFeeStructures();
		this.getHostelConGroup();
		this.getHostelFeeStructures();
		this.getTransportMode();
		this.getRoutes();
	}
	ngOnChanges() {
		if (this.feeDet && this.feeDet.class_id) {
			this.userClassId = this.feeDet.class_id;
		}
		this.additionalFeeComponent();
		this.renderData();
		console.log(this.feeDet, 'dfghfgh');
	}
	buildForm() {
		this.accountsForm = this.fbuild.group({
			accd_id: '',
			accd_login_id: '',
			accd_fo_id: '',
			accd_fs_id: '',
			accd_afc_id: '',
			accd_fcg_id: '',
			accd_fcg_document: '',
			accd_reason_id: '',
			accd_remark_id: '',
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
			accd_status: 1,
			hs_building: '',
			hs_room: '',
			hs_bed: '',
			optedFacilites:''
		});
	}
	isAllocatedToStudent() {
		this.feeService.isAllocatedToStudent({
			hs_building: this.accountsForm.value.hs_building,
			hs_room: this.accountsForm.value.hs_room,
			hs_bed: this.accountsForm.value.hs_bed,
		}).subscribe((result: any) => {
			if (result.status === 'ok') {
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
				this.accountsForm.patchValue({
					hs_bed: ''
				});
			}
		});
	}
	getBuilding() {
		this.buildingArray = [];
		this.feeService.getHostelConfigType({ hc_type: 'building', hc_status: '1' }).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.buildingArray = result.data;
			}
		});
	}
	getRoom() {
		this.roomArray = [];
		this.feeService.getHostelConfigType({ hc_type: 'room', hc_status: '1', hm_building: this.accountsForm.value.hs_building }).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.roomArray = result.data;
			}
		});
	}
	getBed() {
		this.bedArray = [];
		this.feeService.getHostelConfigType({ hc_type: 'bed', hc_status: '1', hm_building: this.accountsForm.value.hs_building, hm_room: this.accountsForm.value.hs_room }).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.bedArray = result.data;
			}
		});
	}
	additionalFeeComponent() {
		this.feeService.getAdditionFeeHeadComponent({ fh_class_id: this.userClassId }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.additionalFeeComponentArray = result.data;
			}
		});
	}


	renderData() {
		console.log(this.feeDet, 'renderData');
		this.conStatus = '';
		this.concessionArray = [];
		this.stoppageArray = [];
		this.slabArray = [];
		//this.accountsForm.reset();
		this.transportFlag = false;
		this.hostelFlag = false;
		this.modeFlag = false;
		this.terminationFlag = false;
		this.existFlag = false;
		this.concession_document = this.feeDet.accd_fcg_id > 0 && this.feeDet.accd_fcg_document ? this.feeDet.accd_fcg_document : '';
		this.documentPath = this.feeDet.accd_fcg_document ? this.feeDet.accd_fcg_document : '';
		this.concessionArray.push({
			ed_docreq_id: 0,
			imgName: this.concession_document
		});
		this.concessionArray.push(this.concession_document);
		if (this.feeDet.accd_login_id) {
			if (this.feeDet.accd_is_transport === 'Y') {
				this.transportFlag = true;
				this.accountsForm.patchValue({
					optedFacilites :'1'
				})
			} else {
				this.transportFlag = false;
			}
			if (this.feeDet.accd_tr_id === '1' && this.feeDet.accd_is_transport === 'Y') {
				this.modeFlag = true;
			} else {
				this.modeFlag = false;
			}
			if (this.feeDet.accd_is_terminate === 'Y' && this.transportFlag) {
				this.terminationFlag = true;
				this.terminateStatus = 'Terminate Transport Facility';
			} else {
				this.terminationFlag = false;
				this.terminateStatus = 'Terminate Transport Facility';
			}
			if (this.feeDet.accd_is_hostel_terminate === 'Y') {
				this.hostelTerminateFlag = true;
				this.hostelStatus = 'Terminate Hostel Facility';
			} else {
				this.hostelTerminateFlag = false;
				this.hostelStatus = 'Terminate Hostel Facility';
			}
			if (this.feeDet.accd_is_hostel === 'Y') {
				this.hostelFlag = true;
				this.accountsForm.patchValue({
					optedFacilites :'2'
				})
				if (this.feeDet.hostel_details) {
					this.accountsForm.patchValue({
						hs_building: this.feeDet.hostel_details.hs_building,
						hs_room: this.feeDet.hostel_details.hs_room,
						hs_bed: this.feeDet.hostel_details.hs_bed,
					});
					this.getRoom();
					this.getBed();
				}
			} else {
				this.hostelFlag = false;
			}
			this.enableMode(this.feeDet.accd_transport_mode);
			this.getStoppages(this.feeDet.accd_tr_id);
			this.getSlab(this.feeDet.accd_tsp_id);
			if (this.feeDet.accd_fcg_id > 0) {
				this.conStatus = this.feeDet.accd_fcg_status;
				this.conDescFlag = true;
			} else {
				this.conDescFlag = false;
			}
			this.accountsForm.patchValue({
				accd_id: this.feeDet.accd_id,
				accd_login_id: this.feeDet.accd_login_id,
				accd_fo_id: this.feeDet.accd_fo_id,
				accd_fs_id: this.feeDet.accd_fs_id,
				accd_fcg_id: this.feeDet.accd_fcg_id,
				accd_reason_id: this.feeDet.accd_reason_id,
				accd_remark_id: this.feeDet.accd_fcg_id > 0 && this.feeDet.accd_remark_id ? this.feeDet.accd_remark_id : '',
				// accd_is_transport: this.feeDet.accd_is_transport === 'N' ? false : true,
				// accd_is_hostel: this.feeDet.accd_is_hostel === 'N' ? false : true,
				accd_transport_mode: this.feeDet.accd_transport_mode,
				accd_tr_id: this.feeDet.accd_tr_id,
				accd_tsp_id: this.feeDet.accd_tsp_id,
				accd_ts_id: this.feeDet.accd_ts_id,
				accd_is_terminate: this.feeDet.accd_is_terminate === 'N' ? false : true,
				accd_is_hostel_terminate: this.feeDet.accd_is_hostel_terminate === 'N' ? false : true,
				accd_transport_from: this.feeDet.accd_transport_from.split('-')[0] === '1970' ? '' : this.feeDet.accd_transport_from,
				accd_transport_to: this.feeDet.accd_transport_to.split('-')[0] === '1970' ? '' : this.feeDet.accd_transport_to,
				accd_remark: this.feeDet.accd_remark,
				accd_hostel_fs_id: this.feeDet.accd_hostel_fs_id,
				accd_hostel_fcc_id: this.feeDet.accd_hostel_fcc_id,
				accd_hostel_from: this.feeDet.accd_hostel_from.split('-')[0] === '1970' ? '' : this.feeDet.accd_hostel_from,
				accd_hostel_to: this.feeDet.accd_hostel_to.split('-')[0] === '1970' ? '' : this.feeDet.accd_hostel_to,
				accd_ses_id: this.feeDet.ses_id,
				accd_status: this.feeDet.accd_status,
				accd_afc_id: this.feeDet.accd_additional_fee_head ? JSON.parse(this.feeDet.accd_additional_fee_head) : []
			});
			this.setDesc({ value: this.feeDet.accd_fcg_id });
			this.slabModel = this.feeDet.accd_ts_id;
		} else {
			this.accountsForm.reset();
			this.transportFlag = false;
			this.hostelFlag = false;
			this.modeFlag = false;
			this.terminationFlag = false;
			this.existFlag = false;
		}

	}
	setDescription(event) {
		this.conDesc = '';
		this.conDescFlag = false;
		this.accountsForm.patchValue({
			accd_remark_id: '',
		});
		if (this.accountsForm.value.accd_fcg_id === this.feeDet.accd_fcg_id) {
			this.accountsForm.patchValue({
				accd_remark_id: this.feeDet.accd_remark_id,
			});
		}
		const cindex = this.conGroupArray.findIndex(e => e.fcg_id === event.value);
		if (cindex !== -1) {
			this.conDesc = this.conGroupArray[cindex].fcg_description;
			this.conDescFlag = true;
		}
	}
	setDesc(event) {
		this.conDesc = '';
		this.feeService.getConcessionGroup({ fcg_is_hostel_fee: 0 }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.conGroupArray = result.data;
				const cindex = this.conGroupArray.findIndex(e => e.fcg_id === event.value);
				if (cindex !== -1) {
					this.conDesc = this.conGroupArray[cindex].fcg_description;
				}
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
		this.feeService.getFeeStructure({ fs_is_hostel_fee: 0, fs_status: 1 }).subscribe((result: any) => {
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
		this.feeService.getFeeStructure({ fs_is_hostel_fee: 1, fs_status: 1 }).subscribe((result: any) => {
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
	optedFacilitesEvent(event){
		console.log(event);
		console.log(event.value);
		if(event.value == '1'){
			this.accountsForm.patchValue({
				accd_transport_mode: '1',
			});
			this.modeFlag = true;
			this.transportFlag = true;

			this.accountsForm.patchValue({
				accd_hostel_fs_id: '',
				accd_hostel_fcc_id: '',
				accd_hostel_from: '',
				accd_hostel_to: '',
				accd_is_hostel_terminate: 'N',
			});
			this.hostelTerminateFlag = false;
			this.hostelFlag = false;
		} else if(event.value == '2'){
			this.hostelFlag = true;

			this.accountsForm.patchValue({
				accd_transport_mode: '',
				accd_tr_id: '',
				accd_tsp_id: '',
				accd_ts_id: '',
				accd_is_terminate: false,
				accd_transport_from: '',
				accd_transport_to: '',
				accd_remark: ''
			});
			this.transportFlag = false;
			this.terminationFlag = false;
		} else if(event.value == '3') {
			
			this.hostelTerminateFlag = false;
			this.hostelFlag = false;
			this.transportFlag = false;
			this.terminationFlag = false;
		}
	}
	enableTransport($event) {
		if ($event.checked) {
			this.accountsForm.patchValue({
				accd_transport_mode: '1',
			});
			this.modeFlag = true;
			this.transportFlag = true;
			/*if (this.feeDet) {
				this.getStoppages(this.feeDet.accd_tr_id);
				this.getSlab(this.feeDet.accd_tsp_id);
				this.terminationFlag = this.feeDet.accd_is_terminate === 'Y' ? true : false;
				if (this.feeDet.accd_transport_mode && this.feeDet.accd_transport_mode !== '0') {
					this.modeFlag = true;
				}
				this.accountsForm.patchValue({
					accd_transport_mode: this.feeDet.accd_transport_mode,
					accd_tr_id: this.feeDet.accd_tr_id,
					accd_tsp_id: this.feeDet.accd_tsp_id,
					accd_ts_id: this.feeDet.accd_ts_id,
					accd_is_terminate: this.feeDet.accd_is_terminate === 'Y' ? true : false,
					accd_transport_from: this.feeDet.accd_transport_from.split('-')[0] === '1970' ? '' : this.feeDet.accd_transport_from,
					accd_transport_to: this.feeDet.accd_transport_to.split('-')[0] === '1970' ? '' : this.feeDet.accd_transport_to,
				});
			} */
		} else {
			this.accountsForm.patchValue({
				accd_transport_mode: '',
				accd_tr_id: '',
				accd_tsp_id: '',
				accd_ts_id: '',
				accd_is_terminate: false,
				accd_transport_from: '',
				accd_transport_to: '',
				accd_remark: ''
			});
			this.slabArray = [];
			this.stoppageArray = [];
			this.transportFlag = false;
			this.terminationFlag = false;
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
			this.hostelTerminateFlag = false;
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
			this.terminateStatus = 'Terminate Transport Facility';
		} else {
			this.terminationFlag = false;
			this.terminateStatus = 'Terminate Transport Facility';
		}
	}
	hostel($event) {
		if ($event.checked) {
			this.hostelTerminateFlag = true;
			this.hostelStatus = 'Terminate Hostel Facility';
		} else {
			this.hostelTerminateFlag = false;
			this.hostelStatus = 'Terminate Hostel Facility';
		}
	}
	formValidation() {
		this.validateFlag = true;
		if (!this.feeLoginId) {
			this.validateFlag = false;
			this.commonAPIService.showSuccessErrorMessage('Please choose a student to proceed', 'error');
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
			if (this.accountsForm.value.accd_tr_id && this.accountsForm.value.accd_tr_id !== '0' &&
				this.accountsForm.value.accd_tsp_id && this.accountsForm.value.accd_tsp_id !== '0' &&
				this.accountsForm.value.accd_ts_id && this.accountsForm.value.accd_ts_id !== '0' &&
				this.accountsForm.value.accd_transport_from && this.accountsForm.value.accd_transport_from !== '0') {
				if (this.terminationFlag) {
					if (!this.accountsForm.value.accd_transport_to) {
						this.accountsForm.get('accd_transport_to').markAsDirty();
						this.validateFlag = false;
					}
				}
			} else {
				this.accountsForm.get('accd_tr_id').markAsDirty();
				this.accountsForm.get('accd_tsp_id').markAsDirty();
				this.accountsForm.get('accd_ts_id').markAsDirty();
				this.accountsForm.get('accd_transport_from').markAsDirty();
				this.validateFlag = false;
			}
		}
		if (this.accountsForm.value.accd_fcg_id && this.accountsForm.value.accd_fcg_id !== '0') {
			if (!this.accountsForm.value.accd_remark_id) {
				this.validateFlag = false;
			}
		}
		if (this.hostelFlag) {
			if (this.accountsForm.value.accd_hostel_fs_id && this.accountsForm.value.accd_hostel_fs_id !== '0' &&
				this.accountsForm.value.accd_hostel_from && this.accountsForm.value.accd_hostel_from !== '0' &&
				this.accountsForm.value.hs_building &&
				this.accountsForm.value.hs_room &&
				this.accountsForm.value.hs_bed) {
				if (this.accountsForm.value.accd_is_hostel_terminate === 'Y' && !this.accountsForm.value.accd_hostel_to) {
					this.validateFlag = false;
				}
			} else {
				this.validateFlag = false;
			}
		}

		return this.validateFlag;
	}
	submit() {
		if (this.formValidation()) {
			const datePipe = new DatePipe('en-in');
			let accountJSON = {};
			accountJSON = {
				accd_id: this.accountsForm.value.accd_id,
				accd_login_id: this.feeLoginId,
				accd_fo_id: this.accountsForm.value.accd_fo_id,
				accd_fs_id: this.accountsForm.value.accd_fs_id,
				accd_fcg_id: this.accountsForm.value.accd_fcg_id,
				accd_fcg_document: JSON.stringify(this.documentPath),
				accd_reason_id: this.accountsForm.value.accd_reason_id,
				accd_remark_id: this.accountsForm.value.accd_remark_id,
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
				accd_status: '1',
				accd_afc_id: JSON.stringify(this.accountsForm.value.accd_afc_id),
				hs_building: this.accountsForm.value.hs_building,
				hs_room: this.accountsForm.value.hs_room,
				hs_bed: this.accountsForm.value.hs_bed
			};
			this.feeService.insertFeeAccount(accountJSON).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.additionalFeeComponent();
					this.renderData();
				}
			});
		}
	}
	update() {
		if (this.formValidation()) {
			const datePipe = new DatePipe('en-in');
			let accountJSON = {};
			accountJSON = {
				accd_id: this.accountsForm.value.accd_id,
				accd_login_id: this.feeLoginId,
				accd_fo_id: this.accountsForm.value.accd_fo_id,
				accd_fs_id: this.accountsForm.value.accd_fs_id,
				accd_fcg_id: this.accountsForm.value.accd_fcg_id,
				accd_fcg_document: JSON.stringify(this.documentPath),
				accd_reason_id: this.accountsForm.value.accd_reason_id,
				accd_remark_id: this.accountsForm.value.accd_remark_id,
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
				accd_status: this.accountsForm.value.accd_status,
				accd_afc_id: JSON.stringify(this.accountsForm.value.accd_afc_id),
				hs_building: this.accountsForm.value.hs_building,
				hs_room: this.accountsForm.value.hs_room,
				hs_bed: this.accountsForm.value.hs_bed
			};
			if (this.accountsForm.value.accd_id) {
				this.sisService.updateFeeAccount(accountJSON).subscribe((result: any) => {
					if (result && result.status === 'ok') {
						this.additionalFeeComponent();
						this.renderData();
					}
				});
			} else {
				this.feeService.insertFeeAccount(accountJSON).subscribe((result: any) => {
					if (result && result.status === 'ok') {
						this.additionalFeeComponent();
						this.renderData();
					}
				});
			}
		}
	}
	isExist(mod_id) {
		return this.commonAPIService.isExistUserAccessMenu(mod_id);
	}
	getStoppages(value) {
		this.accountsForm.patchValue({
			accd_tsp_id: '',
			accd_ts_id: ''
		});
		this.stoppageArray = [];
		this.feeService.getStoppagesPerRoute({ tr_id: value }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.stoppageArray = result.data;
			}
		});
	}
	getSlab(value) {
		if (value && value !== '0') {
			this.slabArray = [];
			this.feeService.getTransportSlabPerStoppages({ tsp_id: value }).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.slabArray = result.data;
					this.slabModel = this.slabArray[0].ts_id;
				}
			});
		}
	}
	getReason() {
		this.reasonArr = [];
		this.sisService.getReason({ reason_type: '15' }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.reasonArr = result.data;
			}
		});
	}
	fileChangeEvent(fileInput, doc_req_id) {
		this.multipleFileArray = [];
		this.counter = 0;
		this.currentFileChangeEvent = fileInput;
		const files = fileInput.target.files;
		for (let i = 0; i < files.length; i++) {
			this.IterateFileLoop(files[i], doc_req_id);
		}
	}
	IterateFileLoop(files, doc_req_id) {
		const reader = new FileReader();
		reader.onloadend = (e) => {
			this.currentImage = reader.result;
			const fileJson = {
				fileName: files.name,
				imagebase64: this.currentImage,
				module: 'attachment'
			};
			this.multipleFileArray.push(fileJson);
			this.counter++;
			if (this.counter === this.currentFileChangeEvent.target.files.length) {
				this.sisService.uploadDocuments(this.multipleFileArray).subscribe((result: any) => {
					if (result) {
						this.documentPath = result.data[0].file_url;
						//console.log(this.documentPath);

					}
				});
			}
		};
		reader.readAsDataURL(files);
	}
	previewImage(imgArray, index) {
		this.dialogRef2 = this.dialog.open(PreviewDocumentComponent, {
			data: {
				imageArray: imgArray,
				index: index
			},
			height: '100vh',
			width: '100vh'
		});
	}
	checkThumbnail(url: any) {
		if (url.match(/jpg/) || url.match(/png/) || url.match(/bmp/) ||
			url.match(/gif/) || url.match(/jpeg/) ||
			url.match(/JPG/) || url.match(/PNG/) || url.match(/BMP/) ||
			url.match(/GIF/) || url.match(/JPEG/)) {
			return true;
		} else {
			return false;
		}
	}
}
