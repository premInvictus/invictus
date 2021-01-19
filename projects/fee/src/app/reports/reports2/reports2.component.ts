import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FeeService, CommonAPIService, SisService } from '../../_services';
@Component({
	selector: 'app-reports2',
	templateUrl: './reports2.component.html',
	styleUrls: ['./reports2.component.css'],
	encapsulation: ViewEncapsulation.Emulated
})
export class Reports2Component implements OnInit {
	accountFlag = false;
	reportFlag = true;
	previousIndex = 0;
	reportTypeArray: any[] = [];
	feeReportArray: any[] = [
		{
			report_id: '1',
			report_name: 'Collection Report',
			report_image: '/assets/images/Fee Reports/collection_report.png',
			main_text_class: 'text-left inline-flex margin-top-5 icon-spacer',
			report_main_image_class: '',
			report_middle_class: 'inline-flex',
			report_check_icon_class: ''
		},
		{
			report_id: '2',
			report_name: 'Outstanding Report',
			report_image: '/assets/images/Fee Reports/fee_defaulter_list.png',
			main_text_class: 'text-left inline-flex margin-top-5 icon-spacer',
			report_main_image_class: '',
			report_middle_class: 'inline-flex',
			report_check_icon_class: ''
		},
		// {
		// 	report_id: '3',
		// 	report_name: 'Fee Projection Report',
		// 	report_image: '/assets/images/Fee Reports/fee_projection.png',
		// 	main_text_class: 'text-left inline-flex margin-top-5 icon-spacer',
		// 	report_main_image_class: '',
		// 	report_middle_class: 'inline-flex',
		// 	report_check_icon_class: ''
		// },
		// {
		// 	report_id: '4',
		// 	report_name: 'Fee Transaction Report',
		// 	report_image: '/assets/images/Fee Reports/fee_transaction.png',
		// 	main_text_class: 'text-left inline-flex margin-top-5 icon-spacer',
		// 	report_main_image_class: '',
		// 	report_middle_class: 'inline-flex',
		// 	report_check_icon_class: ''
		// },
		{
			report_id: '5',
			report_name: 'Fee Ledger Report',
			report_image: '/assets/images/Fee Reports/fee_ledger.png',
			main_text_class: 'text-left inline-flex margin-top-5 icon-spacer',
			report_main_image_class: '',
			report_middle_class: 'inline-flex',
			report_check_icon_class: ''
		},
		{
			report_id: '6',
			report_name: 'Deleted Fee Invoice',
			report_image:
				'/assets/images/Fee Reports/deleted_fee_transaction.png',
			main_text_class: 'text-left inline-flex margin-top-5 icon-spacer',
			report_main_image_class: '',
			report_middle_class: 'inline-flex',
			report_check_icon_class: ''
		},
		{
			report_id: '7',
			report_name: 'Fee Adjustment Report',
			report_image: '/assets/images/Fee Reports/fee_adjustment.png',
			main_text_class: 'text-left inline-flex margin-top-5 icon-spacer',
			report_main_image_class: '',
			report_middle_class: 'inline-flex',
			report_check_icon_class: ''
		},
		{
			report_id: '8',
			report_name: 'Concession Report',
			report_image: '/assets/images/Fee Reports/fee_concession.png',
			main_text_class: 'text-left inline-flex margin-top-5 icon-spacer',
			report_main_image_class: '',
			report_middle_class: 'inline-flex',
			report_check_icon_class: ''
		},
		{
			report_id: '9',
			report_name: 'Missing Fee Invoice',
			report_image:
				'/assets/images/Fee Reports/missing_fee_invoice.png',
			main_text_class: 'text-left inline-flex margin-top-5 icon-spacer',
			report_main_image_class: '',
			report_middle_class: 'inline-flex',
			report_check_icon_class: ''
		},
		{
			report_id: '10',
			report_name: 'Fee Structure Report',
			report_image: '/assets/images/Fee Reports/fee_structure.png',
			main_text_class: 'text-left inline-flex margin-top-5 icon-spacer',
			report_main_image_class: '',
			report_middle_class: 'inline-flex',
			report_check_icon_class: ''
		},
		{
			report_id: '11',
			report_name: 'Cheque Clearance Report',
			report_image: '/assets/images/Fee Reports/cheque_clearance.png',
			main_text_class: 'text-left inline-flex margin-top-5 icon-spacer',
			report_main_image_class: '',
			report_middle_class: 'inline-flex',
			report_check_icon_class: ''
		},
		{
			report_id: '12',
			report_name: 'Security Deposit',
			report_image: '/assets/images/Fee Reports/advanced_security.png',
			main_text_class: 'text-left inline-flex margin-top-5 icon-spacer',
			report_main_image_class: '',
			report_middle_class: 'inline-flex',
			report_check_icon_class: ''
		},
		// {
		// 	report_id: '13',
		// 	report_name: 'Online Transaction Details',
		// 	report_image: '/assets/images/Fee Reports/online_transaction.png',
		// 	main_text_class: 'text-left inline-flex margin-top-5 icon-spacer',
		// 	report_main_image_class: '',
		// 	report_middle_class: 'inline-flex',
		// 	report_check_icon_class: ''
		// },
		// {
		// 	report_id: '14',
		// 	report_name: 'Dynamic Report',
		// 	report_image: '/assets/images/Fee Reports/dynamics.png',
		// 	main_text_class: 'text-left inline-flex margin-top-5 icon-spacer',
		// 	report_main_image_class: '',
		// 	report_middle_class: 'inline-flex',
		// 	report_check_icon_class: ''
		// },
		{
			report_id: '15',
			report_name: 'Transport Report',
			report_image: '/assets/images/Fee Reports/transport_report.png',
			main_text_class: 'text-left inline-flex margin-top-5 icon-spacer',
			report_main_image_class: '',
			report_middle_class: 'inline-flex',
			report_check_icon_class: ''
		},
		{
			report_id: '16',
			report_name: 'Dropout Report',
			report_image: '/assets/images/Fee Reports/fee_defaulter_list.png',
			main_text_class: 'text-left inline-flex margin-top-5 icon-spacer',
			report_main_image_class: '',
			report_middle_class: 'inline-flex',
			report_check_icon_class: ''
		},
		{
			report_id: '17',
			report_name: 'Deleted Fee Receipts',
			report_image:
				'/assets/images/Fee Reports/deleted_fee_transaction.png',
			main_text_class: 'text-left inline-flex margin-top-5 icon-spacer',
			report_main_image_class: '',
			report_middle_class: 'inline-flex',
			report_check_icon_class: ''
		},
		{
			report_id: '18',
			report_name: 'Summarized Fee Review',
			report_image:
				'/assets/images/Fee Reports/deleted_fee_transaction.png',
			main_text_class: 'text-left inline-flex margin-top-5 icon-spacer',
			report_main_image_class: '',
			report_middle_class: 'inline-flex',
			report_check_icon_class: ''
		}
	];
	reportType: string;
	reportHeader: any;
	userArray: any[] = [];
	userName: any = '';
	currentUser: any = {};
	constructor(private service: FeeService, private CommonAPIService: CommonAPIService) { }

	ngOnInit() {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.service.getUserName().subscribe((res: any) => {
			if (res && res.status === 'ok') {
				this.userArray = [];
				this.userArray = res.data;
				const findex = this.userArray.findIndex(f => Number(f.au_login_id) === Number(this.currentUser.login_id));
				if (findex !== -1) {
					this.userName = this.userArray[findex].au_full_name;
				}
			}
		});
	}
	checkEnable(report_id) {
		if (Number(report_id) === 3 || Number(report_id) === 4 || Number(report_id) === 13
			|| Number(report_id) === 14) {
			return 'report-card1 mat-card';
		} else {
			return 'report-card mat-card';
		}
	}
	executeReport(report_id) {
		this.reportTypeArray = [];
		this.reportFlag = true;
		this.accountFlag = false;
		this.reportType = '';
		if (this.previousIndex >= 0) {
			this.feeReportArray[this.previousIndex].main_text_class = 'text-left inline-flex margin-top-5 icon-spacer';
			this.feeReportArray[this.previousIndex].report_main_image_class = '';
			this.feeReportArray[this.previousIndex].report_middle_class = 'inline-flex';
			this.feeReportArray[this.previousIndex].report_check_icon_class = '';
		}
		const findex = this.feeReportArray.findIndex(
			f => Number(f.report_id) === Number(report_id)
		);
		if (findex !== -1) {
			this.feeReportArray[findex].main_text_class =
				'text-left inline-flex main-text-container';
			this.feeReportArray[findex].report_main_image_class = 'report-main-image';
			this.feeReportArray[findex].report_middle_class = 'report-middle inline-flex';
			this.feeReportArray[findex].report_check_icon_class =
				'report-check-icon fas fa-check-circle';
			this.reportHeader = this.feeReportArray[findex].report_name;
			this.reportType = report_id;
		}
		this.previousIndex = findex;
		setTimeout(() => this.reportFlag = false, 500);
		setTimeout(() => this.accountFlag = true, 500);
	}
	switchReport() {
		this.accountFlag = false;
		this.reportFlag = true;
	}
	getClassPerIndex(index) {
		if (index === 0 || index === 5 || index === 10) {
			return 'col-12 col-lg-2  col-md-6 col-sm-6';
		} else {
			return 'col-12 col-lg-2  col-md-6 col-sm-6';
		}
	}
	displyRep($event) {
		if ($event.report_id) {
			if ($event.report_index === 1) {
				if ($event.report_id !== 'mfr') {
					this.reportHeader = 'Collection Report - ' + $event.report_name;
				} else {
					this.reportHeader = 'Collection  - ' + $event.report_name;
				}
			}
			if ($event.report_index === 2) {
				this.reportHeader = 'Outstanding Report - ' + $event.report_name;
			}
			if ($event.report_index === 8) {
				this.reportHeader = 'Concession - ' + $event.report_name;
			}
			if ($event.report_index === 10) {
				this.reportHeader = 'Structure - ' + $event.report_name;
			}
			if ($event.report_index === 15) {
				this.reportHeader = 'Transport - ' + $event.report_name;
			}
			if ($event.report_index === 16) {
				this.reportHeader = 'Dropout - ' + $event.report_name;
			}
			if ($event.report_index === 18) {
				this.reportHeader = 'Summarized Fee Review - ' + $event.report_name;
			}
		} else {
			this.reportHeader = $event.report_name;
		}
	}
	isExistUserAccessMenu(actionT) {
		if (actionT === '1') {
			return this.CommonAPIService.isExistUserAccessMenu('576');
		}
		if (actionT === '2') {
			return this.CommonAPIService.isExistUserAccessMenu('577');
		}
		if (actionT === '5') {
			return this.CommonAPIService.isExistUserAccessMenu('578');
		}
		if (actionT === '6') {
			return this.CommonAPIService.isExistUserAccessMenu('579');
		}
		if (actionT === '7') {
			return this.CommonAPIService.isExistUserAccessMenu('580');
		}
		if (actionT === '8') {
			return this.CommonAPIService.isExistUserAccessMenu('581');
		}
		if (actionT === '9') {
			return this.CommonAPIService.isExistUserAccessMenu('582');
		}
		if (actionT === '10') {
			return this.CommonAPIService.isExistUserAccessMenu('583');
		}
		if (actionT === '11') {
			return this.CommonAPIService.isExistUserAccessMenu('584');
		}
		if (actionT === '12') {
			return this.CommonAPIService.isExistUserAccessMenu('585');
		}
		if (actionT === '15') {
			return this.CommonAPIService.isExistUserAccessMenu('586');
		}
		if (actionT === '16') {
			return this.CommonAPIService.isExistUserAccessMenu('587');
		}
		if (actionT === '17') {
			return this.CommonAPIService.isExistUserAccessMenu('579');
		}
		if (actionT === '18') {
			return this.CommonAPIService.isExistUserAccessMenu('579');
		}
	}
}
