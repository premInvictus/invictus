import { Component, OnInit, OnChanges, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { CommonAPIService, SisService, FeeService } from '../../_services';
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
	conDesc: string;
	conStatus = 'pending';
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
	transport_history: any[] = [];
	hostel_history: any[] = [];
	lastRecordId;
	loginId: any;
	terminateStatus: any;
	hostelStatus: any;
	existFlag = false;
	hostelTerminateFlag = false;
	showTransport = false;
	showHostel = false;
	@ViewChild('editModal') editModal;
	@Input() viewOnly = true;
	@Input() feeLoginId: any;
	@Input() studentDetails: any;
	@Output() editChange = new EventEmitter();
	finalSibReqArray: any[] = [];
	finalArray: any[] = [];
	reasonArr: any[] = [];
	accountDetails: any = {};
	slabModel: any = '';
	reqObj: any = {};
	currentImage: any;
	documentsArray: any[] = [];
	finalDocumentArray: any[] = [];
	currentFileChangeEvent: any;
	multipleFileArray: any[] = [];
	counter: any = 0;
	documentPath: any;
	additionalFeeComponentArray: any[] = [];
	buildingArray: any[] = [];
	roomArray: any[] = [];
	bedArray: any[] = [];
	userConcessionArray: any[] = [];
	userConcessionForm: FormGroup;
	indexUpdate = -1;
	currentUser: any = {};
	constructor(
		private fbuild: FormBuilder,
		private feeService: FeeService,
		private commonAPIService: CommonAPIService,
		private sisService: SisService,

	) { }

	ngOnInit() {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		//console.log('this.loginId', this.loginId);
		this.stoppageArray = [];
		this.slabArray = [];
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
		if (this.feeLoginId) {
			this.getFeeAccount(this.feeLoginId);
			this.getConcessionPerUser(this.feeLoginId);
		}

	}
	ngOnChanges() {
		//console.log('this.feeLoginId', this.feeLoginId);
		if (this.feeLoginId) {
			this.userConcessionArray = [];
			this.getFeeAccount(this.feeLoginId);
			this.getConcessionPerUser(this.feeLoginId);
		} else {
			if(this.accountsForm) {
				this.accountsForm.reset()
			}
			this.transportFlag = false;
			this.hostelFlag = false;
			this.modeFlag = false;
			this.terminationFlag = false;
			this.existFlag = false;
			this.hostelTerminateFlag = false;
			this.showTransport = false;
			this.showHostel = false;
		}
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
			optedFacilites:'3'
		});
		this.userConcessionForm = this.fbuild.group({
			
			tucc_con_end_date: "",
			tucc_con_start_date: "",
			tucc_created_by: "",
			tucc_doc_url: "",
			tucc_fcg_id: "",
			tucc_id: "",
			tucc_login_id: "",
			tucc_remarks: "",
			tucc_status: ""
		})
	}
	getConcessionByIdInTable(id) {
		let na = this.conGroupArray.filter((element) => {
			if(id == element.fcg_id) {
				return true
			}
		});
		if(na.length > 0) {
			return na[0].fcg_name
		} else {
			return '-'
		}
		
		
	}

	getConcessionDescByIdInTable(id) {
		let na =  this.conGroupArray.filter((element) => {
			if(id == element.fcg_id) {
				return true
			}
		});
		if(na.length > 0) {
			return  na[0].fcg_description
		}else {
			return '-';
		}
		
		
	}

	getStatus(item) {
		if(item == "" || item =="0") {
			return "Pending"
		} else if( item == "1") {
			return "Approved"
		} else if(item == '2') {
			return "Rejected"
		}
	}

	addUserConcessionGrouptoUser() {
		console.log("i am here", this.userConcessionForm.valid);
		
		if (this.userConcessionForm.valid) {
			this.userConcessionForm.patchValue({
				tucc_con_start_date: new DatePipe('en-in').transform(this.userConcessionForm.value.tucc_con_start_date, 'yyyy-MM-dd') ,
				tucc_con_end_date: new DatePipe('en-in').transform(this.userConcessionForm.value.tucc_con_end_date, 'yyyy-MM-dd'),
				tucc_login_id: this.feeLoginId,
				tucc_created_by: this.currentUser.login_id

			});
			this.userConcessionArray.push(this.userConcessionForm.value);
			this.userConcessionForm.reset();
		}
	}
	getConcessionPerUser(feeLoginId) {
		
		this.sisService.getConcessionPerUser({au_login_id: feeLoginId}).subscribe((res:any) => {
			if(res.data) {
				this.userConcessionArray = res.data
				console.log("i am res.data", this.userConcessionArray);
				
			}
		})
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
		this.feeService.getHostelConfigType({hc_type: 'building',hc_status: '1'}).subscribe((result: any) => {
				if (result.status === 'ok') {
			this.buildingArray = result.data;
		  }
		});
	}
	getRoom() {
		this.roomArray = [];
		this.feeService.getHostelConfigType({hc_type: 'room',hc_status: '1',hm_building: this.accountsForm.value.hs_building}).subscribe((result: any) => {
				if (result.status === 'ok') {
			this.roomArray = result.data;
		  }
		});
	}
	getBed() {
		this.bedArray = [];
		this.feeService.getHostelConfigType({hc_type: 'bed',hc_status: '1',hm_building: this.accountsForm.value.hs_building,hm_room: this.accountsForm.value.hs_room}).subscribe((result: any) => {
				if (result.status === 'ok') {
			this.bedArray = result.data;
		  }
		});
	}
	additionalFeeComponent(class_id) {
		this.feeService.getAdditionFeeHeadComponent({ fh_class_id: class_id ? class_id : '' }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.additionalFeeComponentArray = [];
				//console.log('additionalFeeComponentArray--', result.data);
				for (var i=0; i<result.data.length;i++) {
					if (result.data[i]['fs_classification']=='group') {
						result.data[i]['fh_id'] = 'g-'+result.data[i]['fs_id'];
						result.data[i]['fh_name'] = result.data[i]['fs_name'];
						this.additionalFeeComponentArray.push(result.data[i]);
					} else {
						this.additionalFeeComponentArray.push(result.data[i]);
					}
				}
				
			}
		});
	}

	getFeeAccount(au_login_id) {
		this.showTransport = false;
		this.showHostel = false;
		this.accountDetails = {};
		this.accountsForm.reset();
		this.accountsForm.patchValue({
			accd_transport_mode: '',
			accd_tr_id: '',
			accd_tsp_id: '',
			accd_ts_id: '',
			accd_is_terminate: 'N',
			accd_transport_from: '',
			accd_transport_to: '',
			accd_remark: '',
			optedFacilites :'3'
		});
		this.stoppageArray = [];
		this.slabArray = [];
		this.transportFlag = false;
		this.hostelFlag = false;
		this.modeFlag = false;
		this.terminationFlag = false;
		this.hostelTerminateFlag = false;
		this.existFlag = false;
		this.feeService.getFeeAccount({ accd_login_id: au_login_id }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.existFlag = true;
				this.accountDetails = result.data[0];
				this.conStatus = this.accountDetails.accd_fcg_status;
				console.log(this.conStatus);
				this.transport_history = result.data[0]['transport_history'];
				this.hostel_history = result.data[0]['hostel_history'];
				if (this.accountDetails.accd_is_transport === 'Y') {
					this.transportFlag = true;
					this.accountsForm.patchValue({
						optedFacilites :'1'
					})
				} else {
					this.transportFlag = false;
				}
				if (this.accountDetails.accd_transport_mode === '1' && this.accountDetails.accd_is_transport === 'Y') {
					this.modeFlag = true;
				} else {
					this.modeFlag = false;
				}
				if (this.accountDetails.accd_is_terminate === 'Y' && this.modeFlag) {
					this.terminationFlag = true;
					this.terminateStatus = 'Terminate Transport Facility';
				} else {
					this.terminationFlag = false;
					this.terminateStatus = 'Terminate Transport Facility';
				}
				if (this.accountDetails.accd_is_hostel_terminate === 'Y') {
					this.hostelTerminateFlag = true;
					this.hostelStatus = 'Terminate Hostel Facility';
				} else {
					this.hostelTerminateFlag = false;
					this.hostelStatus = 'Terminate Hostel Facility';
				}
				if (this.accountDetails.accd_is_hostel === 'Y') {
					this.hostelFlag = true;
					this.accountsForm.patchValue({
						optedFacilites :'2'
					})
					if(this.accountDetails.hostel_details) {
						this.accountsForm.patchValue({
							hs_building: this.accountDetails.hostel_details.hs_building,
							hs_room: this.accountDetails.hostel_details.hs_room,
							hs_bed: this.accountDetails.hostel_details.hs_bed,
						});
						this.getRoom();
						this.getBed();
					}
				} else {
					this.hostelFlag = false;
				}
				//console.log('this.accountDetails.accd_login_id', this.accountDetails.accd_login_id);
				this.enableMode(this.accountDetails.accd_transport_mode);
				this.getStoppages(this.accountDetails.accd_tr_id);
				this.getSlab(this.accountDetails.accd_tsp_id);
				console.log("just check me",   this.accountDetails.accd_remark_id);
				
				this.accountsForm.patchValue({
					accd_id: this.accountDetails.accd_id,
					accd_login_id: this.accountDetails.accd_login_id,
					accd_fo_id: this.accountDetails.accd_fo_id,
					accd_fs_id: this.accountDetails.accd_fs_id,
					accd_fcg_id: this.accountDetails.accd_fcg_id,
					accd_reason_id: this.accountDetails.accd_reason_id,
					accd_remark_id: this.accountDetails.accd_fcg_id > 0 ? this.accountDetails.accd_remark_id : '',
					// accd_is_transport: this.accountDetails.accd_is_transport === 'N' ? false : true,
					// accd_is_hostel: this.accountDetails.accd_is_hostel === 'N' ? false : true,
					accd_transport_mode: this.accountDetails.accd_transport_mode,
					accd_tr_id: this.accountDetails.accd_tr_id,
					accd_tsp_id: this.accountDetails.accd_tsp_id,
					accd_ts_id: this.accountDetails.accd_ts_id,
					accd_is_terminate: this.accountDetails.accd_is_terminate === 'N' ? false : true,
					accd_is_hostel_terminate: this.accountDetails.accd_is_hostel_terminate === 'Y' ? true : false,
					accd_transport_from: this.accountDetails.accd_transport_from.split('-')[0] === '1970' ? '' : this.accountDetails.accd_transport_from,
					accd_transport_to: this.accountDetails.accd_transport_to.split('-')[0] === '1970' ? '' : this.accountDetails.accd_transport_to,
					accd_remark: this.accountDetails.accd_remark,
					accd_hostel_fs_id: this.accountDetails.accd_hostel_fs_id,
					accd_hostel_fcc_id: this.accountDetails.accd_hostel_fcc_id,
					accd_hostel_from: this.accountDetails.accd_hostel_from.split('-')[0] === '1970' ? '' : this.accountDetails.accd_hostel_from,
					accd_hostel_to: this.accountDetails.accd_hostel_to.split('-')[0] === '1970' ? '' : this.accountDetails.accd_hostel_to,
					accd_ses_id: this.accountDetails.ses_id,
					accd_status: this.accountDetails.accd_status,
					accd_afc_id: this.accountDetails.accd_additional_fee_head ? JSON.parse(this.accountDetails.accd_additional_fee_head) : []
				});
				//console.log('this.accountsForm', this.accountsForm);
				this.setDescription({ value: this.accountsForm.value.accd_fcg_id });
				this.slabModel = this.accountDetails.accd_ts_id;
				this.additionalFeeComponent(this.accountDetails.class_id);
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
	setDescription(event) {
		this.conDesc = '';
		const cindex = this.conGroupArray.findIndex(e => e.fcg_id === event.value);
		if (cindex !== -1) {
			this.conDesc = this.conGroupArray[cindex].fcg_description;
		}
	}
	changeValue(event) {
		if (Number(this.accountDetails.accd_fcg_id) === Number(event.value)) {
			this.conStatus = 'approved';
		} else {
			this.conStatus = 'pending';
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
		console.log(event.value == '1');
		if(event.value == '1'){
			this.accountsForm.patchValue({
				accd_transport_mode: '1',
			});
			this.modeFlag = true;
			this.transportFlag = true;
			console.log(this.accountDetails);
			
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
			this.slabArray = [];
			this.stoppageArray = [];
			this.transportFlag = false;
			this.terminationFlag = false;
		} else if(event.value == '3'){
			this.accountsForm.patchValue({
				accd_hostel_fs_id: '',
				accd_hostel_fcc_id: '',
				accd_hostel_from: '',
				accd_hostel_to: '',
				accd_is_hostel_terminate: 'N',
			});
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
		//console.log('bbbbb', this.accountsForm.value.accd_transport_mode)
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
			this.hostelTerminateFlag = false;
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
			if (this.accountsForm.value.accd_tr_id && this.accountsForm.value.accd_tr_id !== '0' &&
				this.accountsForm.value.accd_tsp_id && this.accountsForm.value.accd_tsp_id !== '0' &&
				this.accountsForm.value.accd_ts_id && this.accountsForm.value.accd_ts_id !== '0' &&
				this.accountsForm.value.accd_transport_from && this.accountsForm.value.accd_transport_from !== '0') {
				if (this.terminationFlag) {
					if (!this.accountsForm.value.accd_transport_to) {
						this.accountsForm.get('accd_transport_to').markAsDirty();
						validateFlag = false;
					}
				}
			} else {
				this.accountsForm.get('accd_tr_id').markAsDirty();
				this.accountsForm.get('accd_tsp_id').markAsDirty();
				this.accountsForm.get('accd_ts_id').markAsDirty();
				this.accountsForm.get('accd_transport_from').markAsDirty();
				validateFlag = false;
			}
		}
		if (this.accountsForm.value.accd_fcg_id && this.accountsForm.value.accd_fcg_id !== '0' && this.conStatus !== 'approved') {
			if (!this.accountsForm.value.accd_remark_id.trim()) {
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
				accd_fcg_document: JSON.stringify(this.documentPath),
				accd_reason_id: this.accountsForm.value.accd_reason_id,
				accd_remark_id: this.accountsForm.value.accd_remark_id ? this.accountsForm.value.accd_remark_id :'',
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
				accd_afc_id: JSON.stringify(this.accountsForm.value.accd_afc_id),
				accd_status: '1',
				hs_building: this.accountsForm.value.hs_building,
				hs_room: this.accountsForm.value.hs_room,
				hs_bed: this.accountsForm.value.hs_bed,
				concess_table: this.userConcessionArray
			};
			this.feeService.insertFeeAccount(accountJSON).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.commonAPIService.showSuccessErrorMessage('Inserted SucessFully', 'success');
					this.userConcessionArray = [];
					this.getFeeAccount(this.feeLoginId);
					this.getConcessionPerUser(this.feeLoginId);
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
			this.commonAPIService.showSuccessErrorMessage('Please choose a student to proceed', 'error');
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
			if (this.accountsForm.value.accd_tr_id && this.accountsForm.value.accd_tr_id !== '0' &&
				this.accountsForm.value.accd_tsp_id && this.accountsForm.value.accd_tsp_id !== '0' &&
				this.accountsForm.value.accd_ts_id && this.accountsForm.value.accd_ts_id !== '0' &&
				this.accountsForm.value.accd_transport_from && this.accountsForm.value.accd_transport_from !== '0') {
				if (this.terminationFlag) {
					if (!this.accountsForm.value.accd_transport_to) {
						this.accountsForm.get('accd_transport_to').markAsDirty();
						validateFlag = false;
					}
				}
			} else {
				this.accountsForm.get('accd_tr_id').markAsDirty();
				this.accountsForm.get('accd_tsp_id').markAsDirty();
				this.accountsForm.get('accd_ts_id').markAsDirty();
				this.accountsForm.get('accd_transport_from').markAsDirty();
				validateFlag = false;
			}
		}

		if (this.hostelFlag) {
			if (this.accountsForm.value.accd_hostel_fs_id && this.accountsForm.value.accd_hostel_fs_id !== '0' &&
				this.accountsForm.value.accd_hostel_from && this.accountsForm.value.accd_hostel_from !== '0' &&
				this.accountsForm.value.hs_building && 
				this.accountsForm.value.hs_room && 
				this.accountsForm.value.hs_bed) {
				if (this.accountsForm.value.accd_is_hostel_terminate === 'Y' && !this.accountsForm.value.accd_hostel_to) {
					validateFlag = false;
				}
			} else {
				validateFlag = false;
			}
		}
		console.log('shsashsh', this.userConcessionArray, this.feeLoginId);
		if (this.accountsForm.value.accd_fcg_id && this.accountsForm.value.accd_fcg_id !== '0' && this.conStatus !== 'approved') {
			
			this.accountsForm.value.accd_remark_id = '';
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
				accd_fcg_document: JSON.stringify(this.documentPath),
				accd_reason_id: this.accountsForm.value.accd_reason_id,
				accd_remark_id: this.accountsForm.value.accd_remark_id ?  this.accountsForm.value.accd_remark_id: '',
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
				hs_bed: this.accountsForm.value.hs_bed,
				concess_table: this.userConcessionArray
			};
			if (this.isExist('350')) {
				this.feeService.updateFeeAccount(accountJSON).subscribe((result: any) => {
					if (result && result.status === 'ok') {
						this.commonAPIService.showSuccessErrorMessage('Updated SucessFully', 'success');
						this.userConcessionArray = [];
						this.getFeeAccount(this.feeLoginId);
						this.getConcessionPerUser(this.feeLoginId);
						this.editChange.emit(this.feeLoginId);
					} else {
						this.editChange.emit(this.feeLoginId);
					}
				});
			}
		} else {
			console.log(this.accountsForm.value);
			this.commonAPIService.showSuccessErrorMessage('Please select required fields', 'error');
		}
	}
	editRequest() {
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
		if (this.accountsForm.value.accd_fcg_id && this.accountsForm.value.accd_fcg_id !== '0' && this.conStatus !== 'approved') {
			if (!this.accountsForm.value.accd_remark_id) {
				this.accountsForm.get('accd_fcg_id').markAsDirty();
				this.accountsForm.get('accd_reason_id').markAsDirty();
				this.accountsForm.get('accd_remark_id').markAsDirty();
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
				accd_fcg_document: JSON.stringify(this.documentPath),
				accd_reason_id: this.accountsForm.value.accd_reason_id,
				accd_remark_id: this.accountsForm.value.accd_remark_id ?  this.accountsForm.value.accd_remark_id : '',
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
				accd_afc_id: this.accountsForm.value.accd_afc_id,
				concess_table: this.userConcessionArray
			};
			this.checkFormChangedValue();
		} else {
			this.commonAPIService.showSuccessErrorMessage('Please select required fields', 'error');
		}
	}
	next(admno) {
		this.loginId = admno;
		this.userConcessionArray = [];
		this.getFeeAccount(this.loginId);
		this.getConcessionPerUser(this.feeLoginId);
	}
	prev(admno) {
		this.userConcessionArray = [];
		this.loginId = admno;
		this.getFeeAccount(this.loginId);
		this.getConcessionPerUser(this.feeLoginId);
	}
	first(admno) {
		this.userConcessionArray = [];
		this.loginId = admno;
		this.getFeeAccount(this.loginId);
		this.getConcessionPerUser(this.feeLoginId);
	}
	last(admno) {
		this.userConcessionArray = [];
		this.loginId = admno;
		this.getFeeAccount(this.loginId);
		this.getConcessionPerUser(this.feeLoginId);
	}
	key(admno) {
		this.userConcessionArray = [];
		this.loginId = admno;
		this.getFeeAccount(this.loginId);
		this.getConcessionPerUser(this.feeLoginId);
	}
	getPreviousData() {
		this.userConcessionArray = [];
		this.getFeeAccount(this.feeLoginId);
		this.viewOnly = true;
		this.editChange.emit(this.feeLoginId);
		this.getConcessionPerUser(this.feeLoginId);
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
	deleteUserConcessionGroup(si) {
		if (si > -1) {
			this.userConcessionArray.splice(si, 1);
			this.userConcessionForm.reset();
		}
	}

	editUserConcessionGroup(si) {
		this.indexUpdate = si;
		if (si > -1) {
			this.userConcessionForm.patchValue({
				tucc_con_end_date: this.userConcessionArray[si].tucc_con_end_date,
				tucc_con_start_date: this.userConcessionArray[si].tucc_con_start_date,
				tucc_created_by: this.userConcessionArray[si].tucc_created_by,
				tucc_doc_url: this.userConcessionArray[si].tucc_doc_url,
				tucc_fcg_id: this.userConcessionArray[si].tucc_fcg_id,
				tucc_id: this.userConcessionArray[si].tucc_id,
				tucc_login_id: this.userConcessionArray[si].tucc_login_id,
				tucc_remarks: this.userConcessionArray[si].tucc_remarks,
				tucc_status: this.userConcessionArray[si].tucc_status
			});
			
		}
	}

	updateConcessions() {
		if (this.indexUpdate > -1) {
			this.userConcessionForm.patchValue({
				tucc_con_start_date: new DatePipe('en-in').transform(this.userConcessionForm.value.tucc_con_start_date, 'yyyy-MM-dd') ,
				tucc_con_end_date: new DatePipe('en-in').transform(this.userConcessionForm.value.tucc_con_end_date, 'yyyy-MM-dd') 
			});
			this.userConcessionArray[this.indexUpdate] = this.userConcessionForm.value;
		
			this.userConcessionForm.reset();
			this.indexUpdate = -1;
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
				} else if (key === 'accd_is_terminate' || key === 'accd_is_transport'
					|| key === 'accd_is_hostel' || key === 'accd_is_hostel_terminate') {
					sibReqArray.push({
						rff_where_id: 'accd_id',
						rff_where_value: this.accountDetails['accd_id'],
						rff_field_name: key,
						rff_new_field_value: formControl.value ? 'Y' : 'N',
						rff_old_field_value: this.accountDetails[key],
					});
				} else if (key === 'accd_fcg_id' || key === 'accd_reason_id'
					|| key === 'accd_remark_id') {
					sibReqArray.push({
						rff_where_id: 'accd_id',
						rff_where_value: this.accountDetails['accd_id'],
						rff_field_name: key,
						rff_new_field_value: formControl.value,
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
		//console.log(this.finalArray);
		this.reqObj = {
			req_login_id: this.feeLoginId,
			req_process_type: '4',
			req_tab_id: '4',
			req_priority: '',
			req_remarks: '',
			req_reason: '',
			req_date: datepipe.transform(new Date, 'yyyy-MM-dd'),
			req_param: []
		};
		if (this.finalArray.length > 0) {
			//console.log('reqObj', this.reqObj);
			this.editModal.openModal({ data: [this.finalArray], reqParam: [this.reqObj] });
		}
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
						this.userConcessionForm.patchValue({
							tucc_doc_url: result.data[0].file_url
						})

					}
				});
			}
		};
		reader.readAsDataURL(files);
	}
}
