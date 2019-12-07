import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonAPIService, FeeService } from '../../../_services';
import { DecimalPipe } from '@angular/common';
import { IndianCurrency } from '../../../_pipes';
@Component({
	selector: 'app-school-dashboard',
	templateUrl: './school-dashboard.component.html',
	styleUrls: ['./school-dashboard.component.scss']
})
export class SchoolDashboardComponent implements OnInit {
	schoolInfo: any = {};
	feeprojectionlinechart: any = {};
	feeprojectiondonutchart: any = {};
	feeoutstandingchart: any = {};
	feeclassoutstandingchart: any = {};
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
	lessthanmonth = 0;
	morethan3month = 0;
	month13 = 0;
	totalfeeoutstanding = 0;
	totalfeeclassoutstanding = 0;
	currentDate = new Date();
	cumcurrentTab = 0;

	feeprojectionlinechartflag = false;
	feeprojectiondonutchartflag = false;
	feeoutstandingchartflag = false;
	feeclassoutstandingchartflag = false;
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
		this.getFeeOutstanding();
		this.getClassWiseFeeOutstanding();
		this.getFeeMonths();
	}
	getFeeOutstanding() {
		this.feeService.getFeeOutstanding({ projectionType: 'yearly' }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				console.log(result.data);
				const feedata = result.data;
				if (feedata.length > 0) {
					this.totalfeeoutstanding = 0;
					feedata.forEach(value => {
						const amt = value.total_fee_amount ? Number(value.total_fee_amount) : 0;
						this.totalfeeoutstanding = this.totalfeeoutstanding + amt;
						if (value.label === 'Less Than Month') {
							this.lessthanmonth = amt;
						} else if (value.label === '1-3 Month') {
							this.month13 = amt;
						} else if (value.label === 'More Than 3 Months') {
							this.morethan3month = amt;
						}
					});
					this.FeeOutstandingCalculation(this.lessthanmonth, this.month13, this.morethan3month);
				}
			}
		});
	}
	FeeOutstandingCalculation(lessthanmonth, month13, morethan3month) {
		this.feeoutstandingchartflag = true;
		this.feeoutstandingchart = {
			chart: {
				type: 'pie',
				height: '300px',
				options3d: {
					enabled: false,
					alpha: 45
				}
			},
			title: {
				text: '<b>' + (new IndianCurrency().transform(this.totalfeeoutstanding)) + '<b><br><b>Total Outstanding <b>',
				align: 'center',
				verticalAlign: 'middle',
				y: 25
			},
			plotOptions: {
				pie: {
					innerSize: 200,
					depth: 45,
					dataLabels: {
						enabled: false
					},
					colors: [
						'#45aaf2',
						'#FFA502',
						'#F93434',

					],
				}
			},
			series: [{
				name: 'Outstanding amount',
				data: [
					['Less than 1 month', lessthanmonth],
					['Between 2 to 3 months Month', month13],
					['More than 3 months', morethan3month],


				]
			}]
		};
	}
	getClassWiseFeeOutstanding() {
		this.feeService.getClassWiseFeeOutstanding({ projectionType: 'yearly' }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				console.log(result.data);
				const xcategories: string[] = [];
				const projected: any[] = result.data;
				const projectedSeries: any[] = [];
				if (projected.length > 0) {
					this.totalfeeclassoutstanding = 0;
					this.currentDate = projected[0].current_date;
					projected.forEach(value => {
						const amt = value.total_fee_amount ? Number(value.total_fee_amount) : 0;
						xcategories.push(value.label);
						projectedSeries.push(amt);
						this.totalfeeclassoutstanding = this.totalfeeclassoutstanding + amt;
					});
					this.ClassWiseFeeOutstandingCalculation(xcategories, projectedSeries);
				} else {
					this.norecordflag = true;
					//this.common.showSuccessErrorMessage('No Record Found', 'error');
				}
			}
		});
	}
	ClassWiseFeeOutstandingCalculation(xcategories, data) {
		this.feeclassoutstandingchartflag = true;
		this.feeclassoutstandingchart = {
			chart: {
				type: 'column',
				height: '400px'
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
			tooltip: {
				useHTML: true,
				formatter: function () {
					return '<b>' + this.x + '</b><br/>' +
						this.series.name + ': ' + '<i class="fas fa-rupee-sign"></i> ' +
						new IndianCurrency().transform(this.y)
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
				name: 'Class Wise Outstanding',
				color: '#FF7979',
				data: data
			}]
		};
	}
	projectiontab(tabindex) {
		this.feeprojectionlinechartflag = false;
		this.feeprojectiondonutchartflag = false;
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
		if (this.cumcurrentTab) {
			param.cumulative = true;
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
					//this.common.showSuccessErrorMessage('No Record Found', 'error');
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
		if (this.cumcurrentTab) {
			param.cumulative = true;
		}
		this.feeService.getFeeProjectionReport(param).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				
				const xcategories: string[] = [];
				const projected: any[] = result.data.projected;
				const received: any[] = result.data.received;
				const projectedSeries: any[] = [];
				const receivedSeries: any[] = [];
				if (received.length > 0) {
					this.totalprojected = 0;
					this.totalreceived = 0;
					projected.forEach(value => {
						if (this.currentTabIndex === 0) {
							xcategories.push(value.month_day);
						} else if (this.currentTabIndex === 1) {
							if (value.year) {
								xcategories.push(value.month_name.substr(0, 3) + "'" + value.year.toString().substring(value.year.toString().length -2, value.year.toString().length));
							} else {
								xcategories.push(value.month_name.substr(0, 3));
							}
							
						}
						const amt = value.total_fee_amount ? Number(value.total_fee_amount) : 0;
						projectedSeries.push(amt);
						this.totalprojected = this.totalprojected + amt;
					});
					received.forEach(value => {
						if (this.currentTabIndex === 0) {
							xcategories.push(value.month_day);
						} else if (this.currentTabIndex === 1) {
							if (value.year) {
								xcategories.push(value.month_name.substr(0, 3) + "'" + value.year.toString().substring(value.year.toString().length -2, value.year.toString().length));
							} else {
								xcategories.push(value.month_name.substr(0, 3));
							}							
						}
						const amt = value.total_fee_amount ? Number(value.total_fee_amount) : 0;
						receivedSeries.push({
							y: amt,
							color: value.color
						});
						this.totalreceived = this.totalreceived + amt;
					});
					this.norecordflag = false;
					this.FeeProjectionReportCalculation(xcategories, projectedSeries, receivedSeries);
				} else {
					this.norecordflag = true;
					//this.common.showSuccessErrorMessage('No Record Found', 'error');
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
				height: '300px',
				options3d: {
					enabled: false,
					alpha: 45
				},
				innerSize: '%'
			},
			title: {
				text: '<b>' + (new IndianCurrency().transform(this.totalreceipt)) + '<b><br><b>Total Receipt <b>',
				align: 'center',
				verticalAlign: 'middle',
				y: 25
			},
			plotOptions: {
				pie: {
					innerSize: 200,
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
				type: 'column',
				height: '400px',
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
			tooltip: {
				useHTML: true,
				formatter: function () {
					return '<b>' + this.x + '</b><br/>' +
						this.series.name + ': ' + '<i class="fas fa-rupee-sign"></i> ' +
						new IndianCurrency().transform(this.y)
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
			series: [
				{
					name: 'Collection',
					color: '#66BB6A',
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

	changeTab(event) {

		
		this.cumcurrentTab  = event.index;
		if (!(this.cumcurrentTab)) {
			this.currentTabIndex = 0;			
			this.getFeeProjectionReport();
			this.getFeeReceiptReport();
			this.getFeeOutstanding();
			this.getClassWiseFeeOutstanding();
		} else {
			this.currentTabIndex = 0;
			this.getFeeProjectionReport();
			this.getFeeReceiptReport();
		}
	}
}



