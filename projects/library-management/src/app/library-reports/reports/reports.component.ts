import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonAPIService, SisService } from '../../_services';
import { ErpCommonService } from 'src/app/_services';
@Component({
	selector: 'app-reports',
	templateUrl: './reports.component.html',
	styleUrls: ['./reports.component.css'],
	encapsulation: ViewEncapsulation.Emulated
})
export class ReportsComponent implements OnInit {
	accountFlag = false;
	reportFlag = true;
	previousIndex = 0;
	reportTypeArray: any[] = [];
	feeReportArray: any[] = [
		{
			report_id: '1',
			report_name: 'Accession Report',
			report_image: '/assets/images/Fee Reports/collection_report.png',
			main_text_class: 'text-left inline-flex margin-top-5 icon-spacer',
			report_main_image_class: '',
			report_middle_class: 'inline-flex',
			report_check_icon_class: ''
		},
		{
			report_id: '2',
			report_name: 'Issue / Return Log',
			report_image: '/assets/images/Fee Reports/fee_defaulter_list.png',
			main_text_class: 'text-left inline-flex margin-top-5 icon-spacer',
			report_main_image_class: '',
			report_middle_class: 'inline-flex',
			report_check_icon_class: ''
		},
		{
			report_id: '3',
			report_name: 'Over Due Books Log',
			report_image: '/assets/images/Fee Reports/fee_ledger.png',
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
	constructor(private erpCommonService: ErpCommonService) { }

	ngOnInit() {
		console.log('fdgn');
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		// this.erpCommonService.getUser().subscribe((res: any) => {
		// 	if (res && res.status === 'ok') {
		// 		this.userArray = [];
		// 		this.userArray = res.data;
		// 		const findex = this.userArray.findIndex(f => Number(f.au_login_id) === Number(this.currentUser.login_id));
		// 		if (findex !== -1) {
		// 			this.userName = this.userArray[findex].au_full_name;
		// 		}
		// 	}
		// });
	}
	checkEnable(report_id) {
		return 'report-card mat-card';
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
			return 'col-12 col-lg-2 col-half-offset col-md-6 col-sm-6';
		}
	}
	displyRep($event) {
		// if ($event.report_id) {
		// 	// if ($event.report_index === 1) {
		// 	// 	if ($event.report_id !== 'mfr') {
		// 	// 		this.reportHeader = 'Collection Report - ' + $event.report_name;
		// 	// 	} else {
		// 	// 		this.reportHeader = 'Collection  - ' + $event.report_name;
		// 	// 	}
		// 	// }
		// 	// if ($event.report_index === 2) {
		// 	// 	this.reportHeader = 'Outstanding Report - ' + $event.report_name;
		// 	// }
		// 	// if ($event.report_index === 8) {
		// 	// 	this.reportHeader = 'Concession - ' + $event.report_name;
		// 	// }
		// 	// if ($event.report_index === 10) {
		// 	// 	this.reportHeader = 'Structure - ' + $event.report_name;
		// 	// }
		// 	// if ($event.report_index === 15) {
		// 	// 	this.reportHeader = 'Transport - ' + $event.report_name;
		// 	// }
		// } else {
			this.reportHeader = $event.report_name;
		// }
	}
}
