import { Component, OnInit, ViewChild } from '@angular/core';
declare const require: any;
const Highcharts = require('highcharts');
@Component({
	selector: 'app-school-dashboard',
	templateUrl: './school-dashboard.component.html',
	styleUrls: ['./school-dashboard.component.scss']
})
export class SchoolDashboardComponent implements OnInit {


	constructor() { }

	ngOnInit() {
		document.addEventListener('DOMContentLoaded', function () {
			const myChart = Highcharts.chart('containerone', {
				chart: {
					type: 'line',
					height: '480px',
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
					// name: 'Tokyo',
					color: '#66BB6A',
					data: [7.0, 6.9, 9.5, 14.5, 18.4, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
				}, {
					// name: 'London',
					color: '#D1D8E0',
					data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
				}]
			});
		});

		document.addEventListener('DOMContentLoaded', function () {
			const myChart = Highcharts.chart('containertwo', {
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
							'#4B7BEC',
							'#26DE81',
							'#45AAF2',
							'#FED330',
							'#D1D8E0',

						],
					}
				},
				series: [{
					name: 'Payment Method',
					data: [
						['Cheque', 8],
						['Cash', 3],
						['Payment Gateway', 1],
						['Net Banking', 6],
						['Others', 8],


					]
				}]
			});
		});


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







	// chart = new Chart({
	// 	chart: {
	// 		type: 'line',
	// 		height: '480px',
	// 	},
	// 	title: {
	// 		text: ''
	// 	},

	// 	xAxis: {
	// 		categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
	// 	},
	// 	yAxis: {
	// 		title: {
	// 			text: 'Rupees (in Lacs)'
	// 		}
	// 	},
	// 	plotOptions: {
	// 		line: {
	// 			dataLabels: {
	// 				enabled: true
	// 			},
	// 			enableMouseTracking: false
	// 		}
	// 	},
	// 	series: [{
	// 		name: 'Tokyo',
	// 		color: '#66BB6A',
	// 		data: [7.0, 6.9, 9.5, 14.5, 18.4, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
	// 	}, {
	// 		name: 'London',
	// 		color: '#D1D8E0',
	// 		data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
	// 	}]
	//   });

	//   chartTwo = new Chart({
	// 	chart: {
	// 		type: 'pie',
	// 		options3d: {
	// 			enabled: true,
	// 			alpha: 45
	// 		}
	// 	},
	// 	title: {
	// 		text: 'Mode of Payment'
	// 	},

	// 	plotOptions: {
	// 		pie: {
	// 			innerSize: 250,
	// 			depth: 45,
	// 			// colors: [
	// 			// 	'#4B7BEC',
	// 			// 	'#26DE81',
	// 			// 	'#45AAF2',
	// 			// 	'#FED330',
	// 			// 	'#D1D8E0',

	// 			//   ],
	// 		}
	// 	},
	// 	series: [{
	// 		name: 'Delivered amount',
	// 		data: [
	// 			['Cheque', 8],
	// 			['Cash', 3],
	// 			['Payment Gateway', 1],
	// 			['Net Banking', 6],
	// 			['Others', 8],


	// 		]
	// 	}]
	//   });

	//   chartThree = new Chart({
	// 	chart: {
	// 		type: 'pie',
	// 		options3d: {
	// 			enabled: true,
	// 			alpha: 45
	// 		}
	// 	},
	// 	title: {
	// 		text: 'Payment Time'
	// 	},

	// 	plotOptions: {
	// 		pie: {
	// 			innerSize: 250,
	// 			depth: 45,
	// 			// colors: [
	// 			// 	'#FFD558',
	// 			// 	'#FFA502',
	// 			// 	'#F93434',

	// 			//   ],
	// 		}
	// 	},
	// 	series: [{
	// 		name: 'Outstanding amount',
	// 		data: [
	// 			['Less than Month', 8],
	// 			['1-3 Month', 3],
	// 			['More than 3 Month', 1],


	// 		]
	// 	}]
	//   });

	//   chartFour = new Chart({
	// 	chart: {
	// 		type: 'line',
	// 		height: '500px'
	// 	},
	// 	title: {
	// 		text: 'Payment Period'
	// 	},

	// 	xAxis: {
	// 		categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
	// 	},
	// 	yAxis: {
	// 		title: {
	// 			text: 'Rupees (in Lacs)'
	// 		}
	// 	},
	// 	plotOptions: {
	// 		line: {
	// 			dataLabels: {
	// 				enabled: true
	// 			},
	// 			enableMouseTracking: false
	// 		}
	// 	},
	// 	series: [ {
	// 		name: 'London',
	// 		color: '#FF7979',
	// 		data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
	// 	}]
	//   });

	tabClick() {
		window.location.reload();
	}
}



