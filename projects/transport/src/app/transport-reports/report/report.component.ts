import { Component, OnInit } from '@angular/core';
import { CommonAPIService } from '../../_services';

@Component({
	selector: 'app-report',
	templateUrl: './report.component.html',
	styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

	accountFlag = false;
	reportFlag = true;
	previousIndex = 0;
	reportTypeArray: any[] = [];
	feeReportArray: any[] = [
		{
			report_id: '1',
			report_name: 'Service Log',
			report_image: '/assets/images/Transport Report/service-64.png',
			main_text_class: 'text-left inline-flex margin-top-5 icon-spacer',
			report_main_image_class: '',
			report_middle_class: 'inline-flex',
			report_check_icon_class: ''
		},
		{
			report_id: '2',
			report_name: 'Fuel Log',
			report_image: '/assets/images/Transport Report/fuel-64.png',
			main_text_class: 'text-left inline-flex margin-top-5 icon-spacer',
			report_main_image_class: '',
			report_middle_class: 'inline-flex',
			report_check_icon_class: ''
		},
		{
			report_id: '3',
			report_name: 'Tyre Log',
			report_image: '/assets/images/Transport Report/tyre-64.png',
			main_text_class: 'text-left inline-flex margin-top-5 icon-spacer',
			report_main_image_class: '',
			report_middle_class: 'inline-flex',
			report_check_icon_class: ''
		},
		{
			report_id: '4',
			report_name: 'Running Log',
			report_image: '/assets/images/Transport Report/cab-stand-64.png',
			main_text_class: 'text-left inline-flex margin-top-5 icon-spacer',
			report_main_image_class: '',
			report_middle_class: 'inline-flex',
			report_check_icon_class: ''
		},
		{
			report_id: '5',
			report_name: 'Vehicle Details',
			report_image: '/assets/images/Transport Report/icons8-public-transportation-48.png',
			main_text_class: 'text-left inline-flex margin-top-5 icon-spacer',
			report_main_image_class: '',
			report_middle_class: 'inline-flex',
			report_check_icon_class: ''
		}
		// {
		// 	report_id: '6',
		// 	report_name: 'Negative Report',
		// 	report_image: '/assets/images/Transport Report/fee_defaulter_list.png',
		// 	main_text_class: 'text-left inline-flex margin-top-5 icon-spacer',
		// 	report_main_image_class: '',
		// 	report_middle_class: 'inline-flex',
		// 	report_check_icon_class: ''
		// }
	];
	reportType: string;
	reportHeader: any;
	userArray: any[] = [];
	userName: any = '';
	currentUser: any = {};
	constructor(private CommonAPIService: CommonAPIService) { }

	ngOnInit() {
		console.log("u laa laa >>>>>");
		
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
	}
	checkEnable(report_id) {
		/* if (Number(report_id) === 3 || Number(report_id) === 4 || Number(report_id) === 13
			|| Number(report_id) === 14) {
			return 'report-card1 mat-card';
		} else {
			return 'report-card mat-card';
    } */
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
		setTimeout(() => this.reportFlag = false, 300);
		setTimeout(() => this.accountFlag = true, 300);
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
				this.reportHeader = 'Report - ' + $event.report_name;
			}
			if ($event.report_index === 2) {
				this.reportHeader = 'Report - ' + $event.report_name;
			}
		} else {
			this.reportHeader = $event.report_name;
		}
	}
	isExistUserAccessMenu(actionT) {
		if (actionT === '1') {
			return this.CommonAPIService.isExistUserAccessMenu('969');
		}
		if (actionT === '2') {
			return this.CommonAPIService.isExistUserAccessMenu('970');
		}
		if (actionT === '3') {
			return this.CommonAPIService.isExistUserAccessMenu('971');
		}
		if (actionT === '4') {
			return this.CommonAPIService.isExistUserAccessMenu('972');
		}
		if (actionT === '5') {
			return this.CommonAPIService.isExistUserAccessMenu('973');
		}
		if (actionT === '6') {
			return true;
		}
	}
}
