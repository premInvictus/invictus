import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonAPIService, FeeService } from '../../../_services';
declare const require: any;
const Highcharts = require('highcharts');
@Component({
	selector: 'app-school-dashboard',
	templateUrl: './school-dashboard.component.html',
	styleUrls: ['./school-dashboard.component.scss']
})
export class SchoolDashboardComponent implements OnInit {
	schoolInfo: any = {};
	feeprojectionlinechart: any = {};
	feeprojectiondonutchart: any = {};
	norecordflag = false;
	feeMonthArray = [];
	months = '';
	currentMonth = '';
	dataMonth = '';
	currentTabIndex = 0;
	totalprojected = 0;
	totalcash = 0;
	totalcashatbank = 0;
	totalcheque = 0;
	totaldccard = 0;
	totalimps = 0;
	totalpgateway = 0;
	totalreceipt = 0;

	feeprojectionlinechartflag = false;
	feeprojectiondonutchartflag = false;
	totalreceived = 0;
	tabType = {
		0: 'monthly',
		1: 'yearly'
	};
	constructor(
		private common: CommonAPIService,
		private feeService: FeeService
	) { }

	ngOnInit() {
		this.currentMonth = ('0' + ((new Date()).getMonth() + 1)).slice(-2);
		this.months = this.currentMonth;
		this.getSchool();
		this.getFeeProjectionReport();
		this.getFeeReceiptReport();
		this.getFeeMonths();
		document.addEventListener('DOMContentLoaded', function () {
			const myChart = Highcharts.chart('containerthree', {
				chart: {
					type: 'pie',
					options3d: {
						enabled: true,
						alpha: 45
					}
				},
				title: {
					text: ''
				},

				plotOptions: {
					pie: {
						innerSize: 250,
						depth: 45,
						colors: [
							'#FFD558',
							'#FFA502',
							'#F93434',

						],
					}
				},
				series: [{
					name: 'Outstanding amount',
					data: [
						['Less than Month', 8],
						['1-3 Month', 3],
						['More than 3 Month', 1],


					]
				}]
			});
		});

		document.addEventListener('DOMContentLoaded', function () {
			const myChart = Highcharts.chart('containerfour', {
				chart: {
					type: 'line',
					height: '500px'
				},
				title: {
					text: ''
				},

				xAxis: {
					categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
				},
				yAxis: {
					title: {
						text: 'Rupees (in Lacs)'
					}
				},
				plotOptions: {
					line: {
						dataLabels: {
							enabled: true
						},
						enableMouseTracking: false
					}
				},
				series: [{
					// name: 'London',
					color: '#FF7979',
					data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
				}]
			});
		});


	}
	projectiontab(tabindex) {
		this.currentTabIndex = tabindex;
		if (tabindex === 0) {
			this.renderFeeProjectionReport(this.tabType[this.currentTabIndex], this.months);
			this.renderFeeReceiptReport(this.tabType[this.currentTabIndex], this.months);
		} else if (tabindex === 1) {
			this.renderFeeProjectionReport(this.tabType[this.currentTabIndex]);
			this.renderFeeReceiptReport(this.tabType[this.currentTabIndex]);
		}
	}
	async getFeeProjectionReport() {
		await this.renderFeeProjectionReport(this.tabType[this.currentTabIndex], this.months);
	}
	async getFeeReceiptReport() {
		await this.renderFeeReceiptReport(this.tabType[this.currentTabIndex], this.months);
	}
	renderFeeReceiptReport(receiptReportType, month = '') {
		const param: any = {};
		param.receiptReportType = receiptReportType;
		if (month) {
			param.month = month;
		}
		this.feeService.getFeeReceiptReport(param).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				console.log(result.data);
				this.totalreceipt = 0;
				const received: any[] = result.data.received;
				if (received.length > 0) {
					received.forEach(value => {
						const amt = value.total_fee_amount ? Number(value.total_fee_amount) : 0;
						this.totalreceipt += amt;
						if (value.pay_name === 'Cash') {
							this.totalcash = amt;
						} else if (value.pay_name === 'Cash at Bank') {
							this.totalcashatbank = amt;
						} else if (value.pay_name === 'Cheque') {
							this.totalcheque = amt;
						} else if (value.pay_name === 'Debit/Credit Card') {
							this.totaldccard = amt;
						} else if (value.pay_name === 'NEFT/RTGS/IMPS') {
							this.totalimps = amt;
						} else if (value.pay_name === 'Payment Gateway') {
							this.totalpgateway = amt;
						}
					});
					this.FeeReceiptReportCalculation(this.totalcash,
						this.totalcashatbank, this.totalcheque, this.totaldccard, this.totalimps, this.totalpgateway);
				} else {
					this.common.showSuccessErrorMessage('No Record Found', 'error');
				}
			} else {
				this.common.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}
	renderFeeProjectionReport(projectionType, month = '') {
		const param: any = {};
		param.projectionType = projectionType;
		if (month) {
			param.month = month;
		}
		this.feeService.getFeeProjectionReport(param).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				console.log(result.data);
				const xcategories: string[] = [];
				const projected: any[] = result.data.projected;
				const received: any[] = result.data.received;
				const projectedSeries: any[] = [];
				const receivedSeries: any[] = [];
				if (projected.length > 0 && received.length > 0) {
					this.totalprojected = 0;
					this.totalreceived = 0;
					projected.forEach(value => {
						if (this.currentTabIndex === 0) {
							xcategories.push(value.month_day);
						} else if (this.currentTabIndex === 1) {
							xcategories.push(value.month_name);
						}
						const amt = value.total_fee_amount ? Number(value.total_fee_amount) : 0;
						projectedSeries.push(amt);
						this.totalprojected = this.totalprojected + amt;
					});
					received.forEach(value => {
						const amt = value.total_fee_amount ? Number(value.total_fee_amount) : 0;
						receivedSeries.push(amt);
						this.totalreceived = this.totalreceived + amt;
					});
					this.norecordflag = false;
					this.FeeProjectionReportCalculation(xcategories, projectedSeries, receivedSeries);
				} else {
					this.norecordflag = true;
					this.common.showSuccessErrorMessage('No Record Found', 'error');
				}
			} else {
				this.common.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}
	FeeReceiptReportCalculation(cash, cashatbank, cheque, dccard, imps, pgateway) {
		this.feeprojectiondonutchartflag = true;
		this.feeprojectiondonutchart = {
			chart: {
				type: 'pie',
				options3d: {
					enabled: true,
					alpha: 45
				},
				innerSize: '%'
			},
			title: {
				text: this.totalreceipt + '<br>Total Recipt',
				align: 'center',
				verticalAlign: 'middle',
				y: 40
			},

			plotOptions: {
				pie: {
					innerSize: 250,
					depth: 45,
					dataLabels: {
						enabled: false
					},
					colors: [
						'#26DE81',
						'#fea502',
						'#4B7BEC',
						'#D1D8E0',
						'#FED330',
						'#45AAF2',

					],
				}
			},
			series: [{
				name: 'Payment Method',
				data: [
					['Cash', cash],
					['Cash at Bank', cashatbank],
					['Cheque', cheque],
					['Debit/Credit Card', dccard],
					['Net Banking', imps],
					['Payment Gateway', pgateway],
				]
			}]
		};
	}
	FeeProjectionReportCalculation(xcategories, projectedSeries, receivedSeries) {
		this.feeprojectionlinechartflag = false;
		this.feeprojectionlinechartflag = true;
		console.log('projectedSeries', projectedSeries);
		console.log('receivedSeries', receivedSeries);
		this.feeprojectionlinechart = {
			chart: {
				type: 'spline',
				height: '480px',
			},
			title: {
				text: ''
			},

			xAxis: {
				categories: xcategories
			},
			yAxis: {
				title: {
					text: 'Rupees (in Lacs)'
				}
			},
			plotOptions: {
				line: {
					dataLabels: {
						enabled: true
					},
					enableMouseTracking: false
				}
			},
			series: [{
				name: 'Projected',
				color: '#66BB6A',
				data: projectedSeries
			}, {
				name: 'Recieved',
				color: '#D1D8E0',
				data: receivedSeries
			}]
		};
	}

	getFeeMonths() {
		this.feeMonthArray = [];
		this.feeService.getFeeMonths({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				console.log(result.data);
				this.feeMonthArray = result.data;
			}
		});
	}
	getSchool() {
		this.common.getSchoolDetails().subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.schoolInfo = result.data[0];
			}
		});
	}
	getFeeProjectionReportMonthly() {
		this.renderFeeProjectionReport(this.tabType[this.currentTabIndex], this.months);
		this.renderFeeReceiptReport(this.tabType[this.currentTabIndex], this.months);
	}
}



