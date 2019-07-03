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
			report_name: 'Fee Outstanding Report',
			report_image: '/assets/images/Fee Reports/fee_defaulter_list.png',
			main_text_class: 'text-left inline-flex margin-top-5 icon-spacer',
			report_main_image_class: '',
			report_middle_class: 'inline-flex',
			report_check_icon_class: ''
		},
		{
			report_id: '3',
			report_name: 'Fee Projection Report',
			report_image: '/assets/images/Fee Reports/fee_projection.png',
			main_text_class: 'text-left inline-flex margin-top-5 icon-spacer',
			report_main_image_class: '',
			report_middle_class: 'inline-flex',
			report_check_icon_class: ''
		},
		{
			report_id: '4',
			report_name: 'Fee Transaction Report',
			report_image: '/assets/images/Fee Reports/fee_transaction.png',
			main_text_class: 'text-left inline-flex margin-top-5 icon-spacer',
			report_main_image_class: '',
			report_middle_class: 'inline-flex',
			report_check_icon_class: ''
		},
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
			report_name: 'Deleted Fee Transactions',
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
			report_name: 'Fee Concession Report',
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
		{
			report_id: '13',
			report_name: 'Online Transaction Details',
			report_image: '/assets/images/Fee Reports/online_transaction.png',
			main_text_class: 'text-left inline-flex margin-top-5 icon-spacer',
			report_main_image_class: '',
			report_middle_class: 'inline-flex',
			report_check_icon_class: ''
		},
		{
			report_id: '14',
			report_name: 'Dynamic Report',
			report_image: '/assets/images/Fee Reports/dynamics.png',
			main_text_class: 'text-left inline-flex margin-top-5 icon-spacer',
			report_main_image_class: '',
			report_middle_class: 'inline-flex',
			report_check_icon_class: ''
		},
		{
			report_id: '15',
			report_name: 'Transport Report',
			report_image: '/assets/images/Fee Reports/transport_report.png',
			main_text_class: 'text-left inline-flex margin-top-5 icon-spacer',
			report_main_image_class: '',
			report_middle_class: 'inline-flex',
			report_check_icon_class: ''
		}
	];
	reportType: string;
	reportHeader: any;
	constructor() { }

	ngOnInit() {
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
		setTimeout(() => this.reportFlag = false, 300);
		setTimeout(() => this.accountFlag = true, 300);
	}
	switchReport() {
		this.accountFlag = false;
		this.reportFlag = true;
	}
}
