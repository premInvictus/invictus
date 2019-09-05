import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SisService, CommonAPIService, RoutingStateService } from '../../_services';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatTableDataSource, MatDatepickerInputEvent } from '@angular/material';
import { slctable } from './slctc.table';
import { PendingSlc, IssuedSlc } from './slctc.model';


@Component({
	selector: 'app-slctc',
	templateUrl: './slctc.component.html',
	styleUrls: ['./slctc.component.scss']
})
export class SlctcComponent implements OnInit, OnDestroy {

	printtcform: FormGroup;
	tc_array: any[] = [];
	events: string[] = [];
	classArray = [];
	sectionArray = [];
	tcform1: FormGroup;
	tcform2: FormGroup;
	dataSource: any;
	ELEMENT_DATA: any[];
	renderTable: any;
	tableDiv = false;
	defultFrom = new Date();
	defultTo = new Date();
	srTable = 'PendingSlc'; // selectedRenderTable
	divHeader = 'List of pending SLC/ TC';

	constructor(
		private sisService: SisService,
		private commonAPIService: CommonAPIService,
		private fbuild: FormBuilder,
		private router: Router,
		private route: ActivatedRoute,
		private rstate: RoutingStateService
	) { }

	applyFilter(filterValue: string) {
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}

	ngOnInit() {
		this.defultFrom.setMonth(this.defultFrom.getMonth() - 1);
		this.getClass();
		this.afterBuildForm().then(result => {
			const slcstate = this.rstate.getRoutingState('slc');
			if (slcstate) {
				this.tcform1.patchValue({
					tc_approval_status: slcstate.RouterState.tcform1.tc_approval_status
				});
				if (slcstate.RouterState.tcform1.tc_approval_status === '1') {
					this.srTable = 'IssuedSlc';
					this.divHeader = slctable[this.srTable].tablleHeader;
				} else {
					this.srTable = 'PendingSlc'; // selectedRenderTable
					this.divHeader = 'List of pending SLC/ TC';
				}
				this.tcform2.patchValue({
					based_on: slcstate.RouterState.tcform2.based_on,
					tc_fromdate: slcstate.RouterState.tcform2.tc_fromdate,
					tc_todate: slcstate.RouterState.tcform2.tc_todate,
					tc_admission_no: slcstate.RouterState.tcform2.tc_admission_no,
					class_id: slcstate.RouterState.tcform2.class_id,
					sec_id: slcstate.RouterState.tcform2.sec_id
				});
				if (this.tcform2.value.class_id) {
					this.getSectionsByClass();
				}
			}
			this.getSlcTc();
		});
		this.getSchool();
	}
	ngOnDestroy() {
		this.rstate.setRoutingState('slc', { tcform1: this.tcform1.value, tcform2: this.tcform2.value });
	}
	buildForm() {
		this.printtcform = this.fbuild.group({
			school_logo: '',
			school_name: ''
		});
		this.tcform1 = this.fbuild.group({
			tc_approval_status: '0'
		});
		this.tcform2 = this.fbuild.group({
			based_on: '',
			tc_fromdate: this.defultFrom,
			tc_todate: this.defultTo,
			tc_admission_no: '',
			class_id: '',
			sec_id: ''
		});
	}
	afterBuildForm() {
		return new Promise((resolve, reject) => {
			this.buildForm();
			resolve();
		});
	}
	approvalStatus() {
		// this.tcform2.reset();
		if (this.tcform1.value.tc_approval_status === '0') {
			this.srTable = 'PendingSlc';
			this.divHeader = slctable[this.srTable].tablleHeader;
			this.tableDiv = false;
		} else if (this.tcform1.value.tc_approval_status === '1') {
			this.srTable = 'IssuedSlc';
			this.divHeader = slctable[this.srTable].tablleHeader;
			this.tableDiv = false;
		}
	}
	getClass() {
		this.classArray = [];
		this.sisService.getClass({}).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.classArray = result.data;
			}
		});
	}
	getSectionsByClass() {
		this.sectionArray = [];
		if (this.tcform2.value.class_id) {
			this.sisService.getSectionsByClass({ class_id: this.tcform2.value.class_id }).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.sectionArray = result.data;
				}
			});
		}
	}
	getSchool() {
		this.sisService.getSchool().subscribe((result: any) => {
			if (result.status === 'ok') {
			}
		});
	}
	getSlcTc() {
		this.ELEMENT_DATA = [];
		this.dataSource = new MatTableDataSource<PendingSlc>(this.ELEMENT_DATA);
		this.renderTable = slctable[this.srTable];
		this.tableDiv = false;
		if (this.tcform1.value.tc_approval_status) {
			let param: any = {};
			this.tcform2.value.tc_fromdate = this.commonAPIService.dateConvertion(this.tcform2.value.tc_fromdate, 'yyyy-MM-dd');
			this.tcform2.value.tc_todate = this.commonAPIService.dateConvertion(this.tcform2.value.tc_todate, 'yyyy-MM-dd');
			param = this.tcform2.value;
			param.tc_approval_status = this.tcform1.value.tc_approval_status === '1' ? ['1', '2', '3', '5'] :
				this.tcform1.value.tc_approval_status;
			this.sisService.getSlcTc(param).subscribe((result: any) => {
				if (result.status === 'ok') {
					if (result.data.length > 0) {
						for (const item of result.data) {
							if (this.srTable === 'PendingSlc') {
								let sec_name = '';
								if (item.sec_name) {
									sec_name  = ' - ' + item.sec_name;
								}
								this.ELEMENT_DATA.push({
									requestno: item.tc_id,
									requestdate: this.commonAPIService.dateConvertion(item.tc_request_date, 'd-MMM-y'),
									studentname: item.au_full_name,
									admissionno: item.tc_admission_no,
									classsection: item.class_name + sec_name,
									status: item.tc_approval_status === '1' ? 'Approved' : 'Pending',
									action: item
								});
							} else if (this.srTable === 'IssuedSlc') {
								let status: any;
								if (item.tc_approval_status === '1') {
									status = 'Approved';
								} else if (item.tc_approval_status === '2') {
									status = 'Issued';
								} else if (item.tc_approval_status === '3') {
									status = 'Reissued';
								} else if (item.tc_approval_status === '5') {
									status = 'Printed';
								}
								let sec_name = '';
								if (item.sec_name) {
									sec_name  = ' - ' + item.sec_name;
								}
								this.ELEMENT_DATA.push({
									certificateno: item.tc_id,
									certificatedate: this.commonAPIService.dateConvertion(item.tc_request_date, 'd-MMM-y'),
									studentname: item.au_full_name,
									admissionno: item.tc_admission_no,
									classsection: item.class_name + sec_name,
									status: status,
									action: item
								});
							}
						}
						if (this.srTable === 'PendingSlc') {
							this.dataSource = new MatTableDataSource<PendingSlc>(this.ELEMENT_DATA);
						} else if (this.srTable === 'IssuedSlc') {
							this.dataSource = new MatTableDataSource<IssuedSlc>(this.ELEMENT_DATA);
						}
						this.tableDiv = true;
					} else {
						this.commonAPIService.showSuccessErrorMessage('No Records Found', 'error');
					}
				} else {
					this.commonAPIService.showSuccessErrorMessage(result.data, 'error');
				}
			});
		}
	}
	filterStatus() {
		this.tcform2.patchValue({
			tc_fromdate: '',
			tc_todate: '',
			tc_admission_no: '',
			class_id: '',
			sec_id: ''
		});
	}
	actionConfig(actionf, actionv) {
		switch (actionf) {
			case 'pendingapprove':
				this.pendingapprove(actionv); break;
			case 'pendingprint':
				this.pendingprint(actionv); break;
			case 'pendingaview':
				this.pendingaview(actionv); break;
			case 'pendingdelete':
				this.pendingdelete(actionv); break;
			case 'issuedprint':
				this.issuedprint(actionv); break;
			case 'issuedview':
				this.issuedview(actionv); break;
			case 'issueddelete':
				this.issueddelete(actionv); break;
			case 'issuedissue':
				this.issuedissue(actionv); break;
			case 'issuedreissue':
				this.issuedreissue(actionv); break;
		}
	}
	pendingapprove(value) {
		this.router.navigate(['../approve-slc'], { queryParams: { tc_id: value.tc_id }, relativeTo: this.route });
	}
	pendingprint(value) {
	}
	pendingaview(value) {
		this.router.navigate(['../view-slc'], { queryParams: { tc_id: value.tc_id }, relativeTo: this.route });
	}
	pendingdelete(value) {
		this.router.navigate(['../cancel-slc'], { queryParams: { tc_id: value.tc_id }, relativeTo: this.route });
	}
	issuedprint(value) {
		this.router.navigate(['../config-slc'], {
			queryParams: { tc_id: value.tc_id },
			relativeTo: this.route
		});
	}
	issuedview(value) {
		this.router.navigate(['../view-slc'], { queryParams: { tc_id: value.tc_id }, relativeTo: this.route });
	}
	issueddelete(value) {
		this.router.navigate(['../cancel-slc'], { queryParams: { tc_id: value.tc_id }, relativeTo: this.route });
	}
	issuedissue(value) {
		this.router.navigate(['../issue-slc'], { queryParams: { tc_id: value.tc_id }, relativeTo: this.route });
	}
	issuedreissue(value) {
		this.router.navigate(['../reissue-slc'], { queryParams: { tc_id: value.tc_id }, relativeTo: this.route });
	}
	requestSlctc() {
		this.router.navigate(['../request-slc'], { relativeTo: this.route });
	}
	isExistUserAccessMenu(mod_id) {
		return this.commonAPIService.isExistUserAccessMenu(mod_id);
	}

}
