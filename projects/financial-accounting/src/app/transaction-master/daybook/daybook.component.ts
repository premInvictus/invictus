
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { CommonAPIService, FaService, SisService } from '../../_services/index';
import { Router, ActivatedRoute } from '@angular/router';
const jsPDF = require('jspdf');
import 'jspdf-autotable';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { p } from '@angular/core/src/render3';
import { IndianCurrency } from 'projects/admin-app/src/app/_pipes';
import { PreviewDocumentComponent } from 'projects/student-app/src/app/shared-module/preview-document/preview-document.component';
import * as Excel from 'exceljs/dist/exceljs';
import { saveAs } from 'file-saver';

@Component({
	selector: 'app-daybook',
	templateUrl: './daybook.component.html',
	styleUrls: ['./daybook.component.scss']
})
export class DaybookComponent implements OnInit {

	currentTabIndex = 3;
	feeMonthArray = [];
	paramform: FormGroup;
	adjustmentStatus = 0;
	schoolInfo: any;
	session: any;
	currentUser: any;
	notFormatedCellArray: any[] = [];
	alphabetJSON = {
		1: 'A',
		2: 'B',
		3: 'C',
		4: 'D',
		5: 'E',
		6: 'F',
		7: 'G',
		8: 'H',
		9: 'I',
		10: 'J',
		11: 'K',
		12: 'L',
		13: 'M',
		14: 'N',
		15: 'O',
		16: 'P',
		17: 'Q',
		18: 'R',
		19: 'S',
		20: 'T',
		21: 'U',
		22: 'V',
		23: 'W',
		24: 'X',
		25: 'Y',
		26: 'Z',
		27: 'AA',
		28: 'AB',
		29: 'AC',
		30: 'AD',
		31: 'AE',
		32: 'AF',
		33: 'AG',
		34: 'AH',
		35: 'AI',
		36: 'AJ',
		37: 'AK',
		38: 'AL',
		39: 'AM',
		40: 'AN',
		41: 'AO',
		42: 'AP',
		43: 'AQ',
		44: 'AR',

	};

	constructor(
		private fbuild: FormBuilder,
		private faService: FaService,
		public router: Router,
		public route: ActivatedRoute,
		private sisService: SisService,
		private common: CommonAPIService
	) { }


	ngOnInit() {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.session = JSON.parse(localStorage.getItem('session'));
		this.getSchool();
		this.buildForm();
		this.getFeeMonths();
		this.getGlobalSetting();
		this.route.queryParams.subscribe(param => {
			console.log(param);
		})
	}
	buildForm() {
		this.paramform = this.fbuild.group({
			month: ''
		})
	}

	getSchool() {
		this.sisService.getSchool().subscribe((res: any) => {
			if (res && res.status === 'ok') {
				this.schoolInfo = res.data[0];
				console.log('this.schoolInfo 202', this.schoolInfo)
				this.schoolInfo['disable'] = true;
				this.schoolInfo['si_school_prefix'] = this.schoolInfo.school_prefix;
				this.schoolInfo['si_school_name'] = this.schoolInfo.school_name;
			}
		});
	}
	setIndex(event) {
		console.log(event);
		this.currentTabIndex = event;
	}
	getGlobalSetting() {
		let param: any = {};
		param.gs_alias = ['fee_invoice_includes_adjustments'];
		this.faService.getGlobalSetting(param).subscribe((result: any) => {

			if (result && result.status === 'ok') {
				if (result.data && result.data[0]) {
					this.adjustmentStatus = result.data[0]['gs_value'] == '1' ? 1 : 0;
				}

			}
		})
	}
	downloadPdf() {
		const doc = new jsPDF('p', 'mm', 'a0');
		doc.autoTable({
			// tslint:disable-next-line:max-line-length
			head: [[new TitleCasePipe().transform(this.schoolInfo.school_name) + ', ' + this.schoolInfo.school_city + ', ' + this.schoolInfo.school_state]],
			didDrawPage: function (data) {

			},
			headStyles: {
				fontStyle: 'bold',
				fillColor: '#ffffff',
				textColor: 'black',
				halign: 'left',
				fontSize: 22,
			},
			useCss: true,
			theme: 'striped'
		});
		if (this.currentTabIndex == 0) {
			let pdfrowdata = [];
			this.faService.getInvoiceDayBook({ sessionId: this.session.ses_id, monthId: Number(this.paramform.value.month), vc_process: 'automatic/invoice' }).subscribe(
				(result: any) => {
					console.log("i am result", result);
					let dataArray = result.invoice_due_data;
					if (this.paramform.value.month == "04") {
						let a = result.previous_years_data
						let dummyArray = ['Previous Due', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
						let sum = 0;
						for (let i = 0; i < a.length; i++) {
							if (a[i].fh_id == 45) {
								dummyArray[1] += a[i].total_amt;
								sum += a[i].total_amt;
							} else if (a[i].fh_id == 65) {
								dummyArray[2] += a[i].total_amt;
								sum += a[i].total_amt;
							} else if (a[i].fh_id == 67) {
								dummyArray[3] += a[i].total_amt;
								sum += a[i].total_amt;
							} else if (a[i].fh_id == 69) {
								dummyArray[4] += a[i].total_amt;
								sum += a[i].total_amt;
							} else if (a[i].fh_id == 71) {
								dummyArray[5] += a[i].total_amt;
								sum += a[i].total_amt;
							} else if (a[i].fh_id == 73) {
								dummyArray[6] += a[i].total_amt;
								sum += a[i].total_amt;
							} else if (a[i].fh_id == 74) {
								dummyArray[7] += a[i].total_amt;
								sum += a[i].total_amt;
							} else if (a[i].fh_id == 75) {
								dummyArray[8] += a[i].total_amt;
								sum += a[i].total_amt;
							} else if (a[i].fh_id == 76) {
								dummyArray[9] += a[i].total_amt;
								sum += a[i].total_amt;
							} else if (a[i].fh_id == 77) {
								dummyArray[10] += a[i].total_amt;
								sum += a[i].total_amt;
							} else if (a[i].fh_id == -1) {
								dummyArray[11] += a[i].total_amt;
								sum += a[i].total_amt;
							} else if (a[i].fh_id == null) {
								dummyArray[12] += a[i].total_amt;
								sum += a[i].total_amt;
							}
						}
						dummyArray.push(sum);
						pdfrowdata.push(dummyArray);

					}
					for (let i = 0; i < dataArray.length; i++) {
						let a = [];
						a.push(this.common.dateConvertion(dataArray[i].date, 'd-MMM-y'));
						a.push(dataArray[i].value[0].total_amt);
						a.push(dataArray[i].value[1].total_amt);
						a.push(dataArray[i].value[2].total_amt);
						a.push(dataArray[i].value[3].total_amt);
						a.push(dataArray[i].value[4].total_amt);
						a.push(dataArray[i].value[5].total_amt);
						a.push(dataArray[i].value[6].total_amt);
						a.push(dataArray[i].value[7].total_amt);
						a.push(dataArray[i].value[8].total_amt);
						a.push(dataArray[i].value[9].total_amt);
						a.push(dataArray[i].value[10].total_amt);
						a.push(dataArray[i].value[11].total_amt);
						a.push(dataArray[i].value[0].total_amt + dataArray[i].value[0].total_amt + dataArray[i].value[1].total_amt + dataArray[i].value[2].total_amt + dataArray[i].value[3].total_amt + dataArray[i].value[4].total_amt + dataArray[i].value[5].total_amt + dataArray[i].value[6].total_amt + dataArray[i].value[7].total_amt + dataArray[i].value[8].total_amt + dataArray[i].value[9].total_amt + dataArray[i].value[10].total_amt + dataArray[i].value[11].total_amt)
						pdfrowdata.push(a);
					}
					let a = [];
					a.push("Grand Total");

					for (let i = 0; i < 13; i++) {
						let sum = 0
						for (let j = 0; j < pdfrowdata.length; j++) {
							sum += pdfrowdata[j][i + 1];
						}
						a.push(sum);
						sum = 0;
					}
					pdfrowdata.push(a);
					for (let i = 1; i < 14; i++) {
						for (let j = 0; j < pdfrowdata.length; j++) {
							pdfrowdata[j][i] = new IndianCurrency().transform(pdfrowdata[j][i]);
						}
					}
					doc.levelHeading = [];
					doc.levelTotalFooter = [];
					doc.levelSubtotalFooter = [];
					doc.autoTable({
						head: [[new TitleCasePipe().transform('Income Due Report')]],
						margin: { top: 0 },
						didDrawPage: function (data) {

						},
						headStyles: {
							fontStyle: 'bold',
							fillColor: '#ffffff',
							textColor: 'black',
							halign: 'left',
							fontSize: 20,
						},
						useCss: true,
						theme: 'striped'
					});
					doc.autoTable({
						head: [['Date', 'Registration Fee', 'Admission Fee', 'Tuition Fee', 'Examination Fee', 'Admission Fee (BT)', 'Smart Class Fee', 'Computer lab fee', 'Activity Fee', 'Library Fee', 'Activity Club', 'Fine', 'Transport Fee', 'Total']],
						body: pdfrowdata,
						startY: doc.previousAutoTable.finalY + 0.5,
						tableLineColor: 'black',
						didDrawPage: function (data) {
							doc.setFontStyle('bold');
						},
						willDrawCell: function (data) {
							// tslint:disable-next-line:no-shadowed-variable
							const doc = data.doc;
							const rows = data.table.body;

							// level 0
							const lfIndex = doc.levelTotalFooter.findIndex(item => item === data.row.index);
							if (lfIndex !== -1) {
								doc.setFontStyle('bold');
								doc.setFontSize('16');
								doc.setTextColor('#ffffff');
								doc.setFillColor(0, 62, 120);
							}

							// level more than 0
							const lsfIndex = doc.levelSubtotalFooter.findIndex(item => item === data.row.index);
							if (lsfIndex !== -1) {
								doc.setFontStyle('bold');
								doc.setFontSize('16');
								doc.setTextColor('#ffffff');
								doc.setFillColor(229, 136, 67);
							}

							// group heading
							const lhIndex = doc.levelHeading.findIndex(item => item === data.row.index);
							if (lhIndex !== -1) {
								doc.setFontStyle('bold');
								doc.setFontSize('16');
								doc.setTextColor('#5e666d');
								doc.setFillColor('#c8d6e5');
							}

							// grand total
							if (data.row.index === rows.length - 1) {
								doc.setFontStyle('bold');
								doc.setFontSize('16');
								doc.setTextColor('#ffffff');
								doc.setFillColor(67, 160, 71);
							}
						},
						headStyles: {
							fontStyle: 'bold',
							fillColor: '#c8d6e5',
							textColor: '#5e666d',
							fontSize: 16,
							halign: 'center',
						},
						alternateRowStyles: {
							fillColor: '#f1f4f7'
						},
						useCss: true,
						styles: {
							rowHeight: 20,
							fontSize: 18,
							cellWidth: 'auto',
							textColor: 'black',
							lineColor: '#89a8c8',
							valign: 'middle',
							halign: 'right',
						},
						theme: 'grid'
					});
					doc.autoTable({
						// tslint:disable-next-line:max-line-length
						head: [['Report Filtered as:  ' + this.feeMonthArray.filter(e => e.fm_id == this.paramform.value.month)[0].fm_name]],
						didDrawPage: function (data) {

						},
						headStyles: {
							fontStyle: 'bold',
							fillColor: '#ffffff',
							textColor: 'black',
							halign: 'left',
							fontSize: 20,
						},
						useCss: true,
						theme: 'striped'
					});
					doc.autoTable({
						// tslint:disable-next-line:max-line-length
						head: [['No of records: ' + dataArray.length]],
						didDrawPage: function (data) {

						},
						headStyles: {
							fontStyle: 'bold',
							fillColor: '#ffffff',
							textColor: 'black',
							halign: 'left',
							fontSize: 20,
						},
						useCss: true,
						theme: 'striped'
					});
					doc.autoTable({
						// tslint:disable-next-line:max-line-length
						head: [['Generated On: '
							+ new DatePipe('en-in').transform(new Date(), 'd-MMM-y')]],
						didDrawPage: function (data) {

						},
						headStyles: {
							fontStyle: 'bold',
							fillColor: '#ffffff',
							textColor: 'black',
							halign: 'left',
							fontSize: 20,
						},
						useCss: true,
						theme: 'striped'
					});
					doc.autoTable({
						// tslint:disable-next-line:max-line-length
						head: [['Generated By: ' + new TitleCasePipe().transform(this.currentUser.full_name)]],
						didDrawPage: function (data) {

						},
						headStyles: {
							fontStyle: 'bold',
							fillColor: '#ffffff',
							textColor: 'black',
							halign: 'left',
							fontSize: 20,
						},
						useCss: true,
						theme: 'striped'
					});
					doc.save('Income_due_' + this.paramform.value.month + ".pdf");
				}
			);
		} else if (this.currentTabIndex == 1) {
			let pdfrowdata = [];
			let pdfHeadRow = ['Date'];
			let param: any = {};
			param.gs_alias = ['fa_partial_payment'];
			doc.levelHeading = [];
			doc.levelTotalFooter = [];
			doc.levelSubtotalFooter = [];
			this.faService.getGlobalSetting(param).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					if (result.data && result.data[0]) {
						if (Number(result.data[0]['gs_value'])) {
							this.faService.getInvoiceDayBook({ sessionId: this.session.ses_id, monthId: Number(this.paramform.value.month) }).subscribe((data: any) => {
								let dataArray = data.receipt_data;
								console.log("i am here --------------", dataArray);
								for (let i = 0; i < dataArray[0].value.length; i++) {
									pdfHeadRow.push(dataArray[0].value[i].pay_name);
								}
								pdfHeadRow.push('Total');
								console.log("i am here ------------", pdfHeadRow);
								for (let i = 0; i < dataArray.length; i++) {
									let a = [];
									let sum = 0;
									a.push(this.common.dateConvertion(dataArray[i].date, 'd-MMM-y'));
									for (let j = 0; j < dataArray[i].value.length; j++) {
										a.push(dataArray[i].value[j].receipt_amt)
										sum += dataArray[i].value[j].receipt_amt;
									}
									a.push(sum);
									pdfrowdata.push(a);
								}
								let a = [];
								a.push("Grand Total");

								for (let i = 0; i < pdfrowdata[0].length; i++) {
									let sum = 0
									for (let j = 0; j < pdfrowdata.length; j++) {
										sum += pdfrowdata[j][i + 1];
									}
									a.push(sum);
									sum = 0;
								}
								pdfrowdata.push(a);
								for (let i = 1; i < pdfrowdata[0].length; i++) {
									for (let j = 0; j < pdfrowdata.length; j++) {
										pdfrowdata[j][i] = new IndianCurrency().transform(pdfrowdata[j][i]);
									}
								}

								doc.autoTable({
									head: [[new TitleCasePipe().transform('Receipt(Current) Report')]],
									margin: { top: 0 },
									didDrawPage: function (data) {

									},
									headStyles: {
										fontStyle: 'bold',
										fillColor: '#ffffff',
										textColor: 'black',
										halign: 'left',
										fontSize: 20,
									},
									useCss: true,
									theme: 'striped'
								});
								doc.autoTable({
									head: [pdfHeadRow],
									body: pdfrowdata,
									startY: doc.previousAutoTable.finalY + 0.5,
									tableLineColor: 'black',
									didDrawPage: function (data) {
										doc.setFontStyle('bold');
									},
									willDrawCell: function (data) {
										// tslint:disable-next-line:no-shadowed-variable
										const doc = data.doc;
										const rows = data.table.body;

										// level 0
										const lfIndex = doc.levelTotalFooter.findIndex(item => item === data.row.index);
										if (lfIndex !== -1) {
											doc.setFontStyle('bold');
											doc.setFontSize('16');
											doc.setTextColor('#ffffff');
											doc.setFillColor(0, 62, 120);
										}

										// level more than 0
										const lsfIndex = doc.levelSubtotalFooter.findIndex(item => item === data.row.index);
										if (lsfIndex !== -1) {
											doc.setFontStyle('bold');
											doc.setFontSize('16');
											doc.setTextColor('#ffffff');
											doc.setFillColor(229, 136, 67);
										}

										// group heading
										const lhIndex = doc.levelHeading.findIndex(item => item === data.row.index);
										if (lhIndex !== -1) {
											doc.setFontStyle('bold');
											doc.setFontSize('16');
											doc.setTextColor('#5e666d');
											doc.setFillColor('#c8d6e5');
										}

										// grand total
										if (data.row.index === rows.length - 1) {
											doc.setFontStyle('bold');
											doc.setFontSize('16');
											doc.setTextColor('#ffffff');
											doc.setFillColor(67, 160, 71);
										}
									},
									headStyles: {
										fontStyle: 'bold',
										fillColor: '#c8d6e5',
										textColor: '#5e666d',
										fontSize: 16,
										halign: 'center',
									},
									alternateRowStyles: {
										fillColor: '#f1f4f7'
									},
									useCss: true,
									styles: {
										rowHeight: 20,
										fontSize: 18,
										cellWidth: 'auto',
										textColor: 'black',
										lineColor: '#89a8c8',
										valign: 'middle',
										halign: 'right',
									},
									theme: 'grid'
								});
								doc.autoTable({
									// tslint:disable-next-line:max-line-length
									head: [['Report Filtered as:  ' + this.feeMonthArray.filter(e => e.fm_id == this.paramform.value.month)[0].fm_name]],
									didDrawPage: function (data) {

									},
									headStyles: {
										fontStyle: 'bold',
										fillColor: '#ffffff',
										textColor: 'black',
										halign: 'left',
										fontSize: 20,
									},
									useCss: true,
									theme: 'striped'
								});
								doc.autoTable({
									// tslint:disable-next-line:max-line-length
									head: [['No of records: ' + pdfrowdata.length]],
									didDrawPage: function (data) {

									},
									headStyles: {
										fontStyle: 'bold',
										fillColor: '#ffffff',
										textColor: 'black',
										halign: 'left',
										fontSize: 20,
									},
									useCss: true,
									theme: 'striped'
								});
								doc.autoTable({
									// tslint:disable-next-line:max-line-length
									head: [['Generated On: '
										+ new DatePipe('en-in').transform(new Date(), 'd-MMM-y')]],
									didDrawPage: function (data) {

									},
									headStyles: {
										fontStyle: 'bold',
										fillColor: '#ffffff',
										textColor: 'black',
										halign: 'left',
										fontSize: 20,
									},
									useCss: true,
									theme: 'striped'
								});
								doc.autoTable({
									// tslint:disable-next-line:max-line-length
									head: [['Generated By: ' + new TitleCasePipe().transform(this.currentUser.full_name)]],
									didDrawPage: function (data) {

									},
									headStyles: {
										fontStyle: 'bold',
										fillColor: '#ffffff',
										textColor: 'black',
										halign: 'left',
										fontSize: 20,
									},
									useCss: true,
									theme: 'striped'
								});
								doc.save('Reciept_current_report_' + this.paramform.value.month + ".pdf");
							})
						}
					}

				}
			})

		} else if (this.currentTabIndex == 2) {
			doc.autoTable({
				head: [[new TitleCasePipe().transform('Receipt(Advance) Report')]],
				margin: { top: 0 },
				didDrawPage: function (data) {

				},
				headStyles: {
					fontStyle: 'bold',
					fillColor: '#ffffff',
					textColor: 'black',
					halign: 'left',
					fontSize: 20,
				},
				useCss: true,
				theme: 'striped'
			});
		} else if (this.currentTabIndex == 3) {
			let pdfrowdata = [];
			this.faService.getAdjustmentDayBook({ sessionId: this.session.ses_id, monthId: Number(this.paramform.value.month), vc_process: 'automatic/adjustment' }).subscribe(
				(result: any) => {
					console.log("i am result", result);
					let dataArray = result.invoice_due_data;
					// if(this.paramform.value.month == "04") {
					// 	let a = result.previous_years_data
					// 	let dummyArray = ['Previous Due', 0,0,0,0,0,0,0,0,0,0,0,0];
					// 	let sum = 0;
					// 	for(let i = 0; i < a.length; i ++) {
					// 		if(a[i].fh_id == 45) {
					// 			dummyArray[1] += a[i].total_amt;
					// 			sum += a[i].total_amt;
					// 		} else if(a[i].fh_id == 65) {
					// 			dummyArray[2] += a[i].total_amt;
					// 			sum += a[i].total_amt;
					// 		} else if(a[i].fh_id == 67) {
					// 			dummyArray[3] += a[i].total_amt;
					// 			sum += a[i].total_amt;
					// 		} else if(a[i].fh_id == 69) {
					// 			dummyArray[4] += a[i].total_amt;
					// 			sum += a[i].total_amt;
					// 		} else if(a[i].fh_id == 71) {
					// 			dummyArray[5] += a[i].total_amt;
					// 			sum += a[i].total_amt;
					// 		} else if(a[i].fh_id == 73) {
					// 			dummyArray[6] += a[i].total_amt;
					// 			sum += a[i].total_amt;
					// 		} else if(a[i].fh_id == 74) {
					// 			dummyArray[7] += a[i].total_amt;
					// 			sum += a[i].total_amt;
					// 		} else if(a[i].fh_id == 75) {
					// 			dummyArray[8] += a[i].total_amt;
					// 			sum += a[i].total_amt;
					// 		} else if(a[i].fh_id == 76) {
					// 			dummyArray[9] += a[i].total_amt;
					// 			sum += a[i].total_amt;
					// 		} else if(a[i].fh_id == 77) {
					// 			dummyArray[10] += a[i].total_amt;
					// 			sum += a[i].total_amt;
					// 		} else if(a[i].fh_id == -1) {
					// 			dummyArray[11] += a[i].total_amt;
					// 			sum += a[i].total_amt;
					// 		} else if(a[i].fh_id == null) {
					// 			dummyArray[12] += a[i].total_amt;
					// 			sum += a[i].total_amt;
					// 		} 
					// 	}
					// 	dummyArray.push(sum);
					// 	pdfrowdata.push(dummyArray);

					// }
					for (let i = 0; i < dataArray.length; i++) {
						let a = [];
						let sum = 0;
						a.push(this.common.dateConvertion(dataArray[i].date, 'd-MMM-y'));
						a.push(dataArray[i].value[0].adjustment_amt + dataArray[i].value[0].concession_at);
						sum += dataArray[i].value[0].adjustment_amt + dataArray[i].value[0].concession_at;
						a.push(dataArray[i].value[1].adjustment_amt + dataArray[i].value[1].concession_at);
						sum += dataArray[i].value[1].adjustment_amt + dataArray[i].value[1].concession_at;
						a.push(dataArray[i].value[2].adjustment_amt + dataArray[i].value[2].concession_at);
						sum += dataArray[i].value[2].adjustment_amt + dataArray[i].value[2].concession_at;
						a.push(dataArray[i].value[3].adjustment_amt + dataArray[i].value[3].concession_at);
						sum += dataArray[i].value[3].adjustment_amt + dataArray[i].value[3].concession_at;
						a.push(dataArray[i].value[4].adjustment_amt + dataArray[i].value[4].concession_at);
						sum += dataArray[i].value[4].adjustment_amt + dataArray[i].value[4].concession_at;
						a.push(dataArray[i].value[5].adjustment_amt + dataArray[i].value[5].concession_at);
						sum += dataArray[i].value[5].adjustment_amt + dataArray[i].value[5].concession_at;
						a.push(dataArray[i].value[6].adjustment_amt + dataArray[i].value[6].concession_at);
						sum += dataArray[i].value[6].adjustment_amt + dataArray[i].value[6].concession_at;
						a.push(dataArray[i].value[7].adjustment_amt + dataArray[i].value[7].concession_at);
						sum += dataArray[i].value[7].adjustment_amt + dataArray[i].value[7].concession_at;
						a.push(dataArray[i].value[8].adjustment_amt + dataArray[i].value[8].concession_at);
						sum += dataArray[i].value[8].adjustment_amt + dataArray[i].value[8].concession_at;
						a.push(dataArray[i].value[9].adjustment_amt + dataArray[i].value[9].concession_at);
						sum += dataArray[i].value[9].adjustment_amt + dataArray[i].value[9].concession_at;
						a.push(dataArray[i].value[10].adjustment_amt + dataArray[i].value[10].concession_at);
						sum += dataArray[i].value[10].adjustment_amt + dataArray[i].value[10].concession_at;
						a.push(dataArray[i].value[11].adjustment_amt + dataArray[i].value[11].concession_at);
						sum += dataArray[i].value[11].adjustment_amt + dataArray[i].value[11].concession_at;
						a.push(sum)
						pdfrowdata.push(a);
					}
					let a = [];
					a.push("Grand Total");

					for (let i = 0; i < 13; i++) {
						let sum = 0
						for (let j = 0; j < pdfrowdata.length; j++) {
							sum += pdfrowdata[j][i + 1];
						}
						a.push(sum);
						sum = 0;
					}
					pdfrowdata.push(a);
					for (let i = 1; i < 14; i++) {
						for (let j = 0; j < pdfrowdata.length; j++) {
							pdfrowdata[j][i] = new IndianCurrency().transform(pdfrowdata[j][i]);
						}
					}
					doc.levelHeading = [];
					doc.levelTotalFooter = [];
					doc.levelSubtotalFooter = [];
					doc.autoTable({
						head: [[new TitleCasePipe().transform('Fee Adjustment Report')]],
						margin: { top: 0 },
						didDrawPage: function (data) {

						},
						headStyles: {
							fontStyle: 'bold',
							fillColor: '#ffffff',
							textColor: 'black',
							halign: 'left',
							fontSize: 20,
						},
						useCss: true,
						theme: 'striped'
					});
					doc.autoTable({
						head: [['Date', 'Registration Fee', 'Admission Fee', 'Tuition Fee', 'Examination Fee', 'Admission Fee (BT)', 'Smart Class Fee', 'Computer lab fee', 'Activity Fee', 'Library Fee', 'Activity Club', 'Fine', 'Transport Fee', 'Total']],
						body: pdfrowdata,
						startY: doc.previousAutoTable.finalY + 0.5,
						tableLineColor: 'black',
						didDrawPage: function (data) {
							doc.setFontStyle('bold');
						},
						willDrawCell: function (data) {
							// tslint:disable-next-line:no-shadowed-variable
							const doc = data.doc;
							const rows = data.table.body;

							// level 0
							const lfIndex = doc.levelTotalFooter.findIndex(item => item === data.row.index);
							if (lfIndex !== -1) {
								doc.setFontStyle('bold');
								doc.setFontSize('16');
								doc.setTextColor('#ffffff');
								doc.setFillColor(0, 62, 120);
							}

							// level more than 0
							const lsfIndex = doc.levelSubtotalFooter.findIndex(item => item === data.row.index);
							if (lsfIndex !== -1) {
								doc.setFontStyle('bold');
								doc.setFontSize('16');
								doc.setTextColor('#ffffff');
								doc.setFillColor(229, 136, 67);
							}

							// group heading
							const lhIndex = doc.levelHeading.findIndex(item => item === data.row.index);
							if (lhIndex !== -1) {
								doc.setFontStyle('bold');
								doc.setFontSize('16');
								doc.setTextColor('#5e666d');
								doc.setFillColor('#c8d6e5');
							}

							// grand total
							if (data.row.index === rows.length - 1) {
								doc.setFontStyle('bold');
								doc.setFontSize('16');
								doc.setTextColor('#ffffff');
								doc.setFillColor(67, 160, 71);
							}
						},
						headStyles: {
							fontStyle: 'bold',
							fillColor: '#c8d6e5',
							textColor: '#5e666d',
							fontSize: 16,
							halign: 'center',
						},
						alternateRowStyles: {
							fillColor: '#f1f4f7'
						},
						useCss: true,
						styles: {
							rowHeight: 20,
							fontSize: 18,
							cellWidth: 'auto',
							textColor: 'black',
							lineColor: '#89a8c8',
							valign: 'middle',
							halign: 'right',
						},
						theme: 'grid'
					});
					doc.autoTable({
						// tslint:disable-next-line:max-line-length
						head: [['Report Filtered as:  ' + this.feeMonthArray.filter(e => e.fm_id == this.paramform.value.month)[0].fm_name]],
						didDrawPage: function (data) {

						},
						headStyles: {
							fontStyle: 'bold',
							fillColor: '#ffffff',
							textColor: 'black',
							halign: 'left',
							fontSize: 20,
						},
						useCss: true,
						theme: 'striped'
					});
					doc.autoTable({
						// tslint:disable-next-line:max-line-length
						head: [['No of records: ' + dataArray.length]],
						didDrawPage: function (data) {

						},
						headStyles: {
							fontStyle: 'bold',
							fillColor: '#ffffff',
							textColor: 'black',
							halign: 'left',
							fontSize: 20,
						},
						useCss: true,
						theme: 'striped'
					});
					doc.autoTable({
						// tslint:disable-next-line:max-line-length
						head: [['Generated On: '
							+ new DatePipe('en-in').transform(new Date(), 'd-MMM-y')]],
						didDrawPage: function (data) {

						},
						headStyles: {
							fontStyle: 'bold',
							fillColor: '#ffffff',
							textColor: 'black',
							halign: 'left',
							fontSize: 20,
						},
						useCss: true,
						theme: 'striped'
					});
					doc.autoTable({
						// tslint:disable-next-line:max-line-length
						head: [['Generated By: ' + new TitleCasePipe().transform(this.currentUser.full_name)]],
						didDrawPage: function (data) {

						},
						headStyles: {
							fontStyle: 'bold',
							fillColor: '#ffffff',
							textColor: 'black',
							halign: 'left',
							fontSize: 20,
						},
						useCss: true,
						theme: 'striped'
					});
					doc.save('Fee_Adjusted_due_' + this.paramform.value.month + ".pdf");
				}
			);
		} else if (this.currentTabIndex == 4) {
			doc.autoTable({
				head: [[new TitleCasePipe().transform('Voucher Listings')]],
				margin: { top: 0 },
				didDrawPage: function (data) {

				},
				headStyles: {
					fontStyle: 'bold',
					fillColor: '#ffffff',
					textColor: 'black',
					halign: 'left',
					fontSize: 20,
				},
				useCss: true,
				theme: 'striped'
			});
		}
	}

	downloadExcel() {
		if (this.currentTabIndex == 0) {
			//lets define column definition first then map them to values
			this.faService.getInvoiceDayBook({ sessionId: this.session.ses_id, monthId: Number(this.paramform.value.month), vc_process: 'automatic/invoice' }).subscribe(
				(data: any) => {
					// console.log("i am data over here -----------", data.invoice_due_data);
					let columndefinition = [{
						name: 'Date',
						id: 'date'
					}];
					const columns: any[] = [];
					const columValue: any[] = [];
					for (let i = 0; i < data.invoice_due_data[0].value.length; i++) {
						let obj: any = {};
						if (Number(data.invoice_due_data[0].value[i].fh_id) != 0) {
							obj = {
								id: data.invoice_due_data[0].value[i].fh_id,
								name: data.invoice_due_data[0].value[i].fh_name
							}
						} else {
							obj = {
								id: 't_fd',
								name: data.invoice_due_data[0].value[i].fh_name
							}
						}
						columndefinition.push(obj);
					}

					columndefinition.push({
						name: "Total",
						id: 'total'
					});
					const workbook = new Excel.Workbook();
					const worksheet = workbook.addWorksheet('Income_due_report', { properties: { showGridLines: true } },
						{ pageSetup: { fitToWidth: 7 } });
					for (const item of columndefinition) {
						columns.push({
							key: item.id,
							width: 12
						});
						columValue.push(item.name);
					}
					worksheet.properties.defaultRowHeight = 25;
					worksheet.mergeCells('A1:' + this.alphabetJSON[columns.length] + '1'); // Extend cell over all column headers
					worksheet.getCell('A1').value =
						new TitleCasePipe().transform(this.schoolInfo.school_name) + ', ' + this.schoolInfo.school_city + ', ' + this.schoolInfo.school_state;
					worksheet.getCell('A1').alignment = { horizontal: 'left' };
					worksheet.mergeCells('A2:' + this.alphabetJSON[columns.length] + '2');
					worksheet.getCell('A2').value = "Income Due Report";
					worksheet.getCell(`A2`).alignment = { horizontal: 'left' };
					worksheet.getRow(4).values = columValue;
					worksheet.columns = columns;
					let obj2: any = {};
					obj2.date = "Grand Total";
					for (let i = 0; i < data.invoice_due_data.length; i++) {
						let obj: any = {};
						let sum = 0;

						obj.date = this.common.dateConvertion(data.invoice_due_data[i].date, 'd-MMM-y');
						for (let j = 0; j < data.invoice_due_data[i].value.length; j++) {
							let id = data.invoice_due_data[i].value[j].fh_id;
							console.log("i am id", id);
							if (Number(id) != 0) {
								obj[`${id}`] = new IndianCurrency().transform(data.invoice_due_data[i].value[j].total_amt);
								if (obj2[`${id}`]) {
									obj2[`${id}`] += data.invoice_due_data[i].value[j].total_amt;
								} else {
									obj2[`${id}`] = data.invoice_due_data[i].value[j].total_amt;
								}
							}
							else {
								obj[`t_fd`] = new IndianCurrency().transform(data.invoice_due_data[i].value[j].total_amt);
								if (obj2[`t_fd`]) {
									obj2[`t_fd`] += data.invoice_due_data[i].value[j].total_amt;
								} else {
									obj2[`t_fd`] = data.invoice_due_data[i].value[j].total_amt;
								}
							}
							sum += data.invoice_due_data[i].value[j].total_amt;
						}

						if (obj2.total) {
							obj2.total += sum;
						} else {
							obj2.total = sum;
						}
						obj.total = new IndianCurrency().transform(sum);
						worksheet.addRow(obj);
					}
					for (let key in obj2) {
						console.log("i am key", key)
						if (key != "date") {
							obj2[`${key}`] = new IndianCurrency().transform(obj2[`${key}`]);
						}
					}
					worksheet.addRow(obj2);

					worksheet.getRow(worksheet._rows.length).eachCell(cell => {
						columndefinition.forEach(element => {
							cell.font = {
								color: { argb: 'ffffff' },
								bold: true,
								name: 'Arial',
								size: 10
							};
							cell.alignment = { wrapText: true, horizontal: 'center' };
							cell.fill = {
								type: 'pattern',
								pattern: 'solid',
								fgColor: { argb: '439f47' },
								bgColor: { argb: '439f47' }
							};
							cell.border = {
								top: { style: 'thin' },
								left: { style: 'thin' },
								bottom: { style: 'thin' },
								right: { style: 'thin' }
							};
						});
					});
					// style all row of excel
					worksheet.eachRow((row, rowNum) => {
						if (rowNum === 1) {
							row.font = {
								name: 'Arial',
								size: 14,
								bold: true
							};
						} else if (rowNum === 2) {
							row.font = {
								name: 'Arial',
								size: 12,
								bold: true
							};
						} else if (rowNum === 4) {
							row.eachCell((cell) => {
								cell.font = {
									name: 'Arial',
									size: 12,
									bold: true
								};
								cell.fill = {
									type: 'pattern',
									pattern: 'solid',
									fgColor: { argb: 'bdbdbd' },
									bgColor: { argb: 'bdbdbd' },
								};
								cell.border = {
									top: { style: 'thin' },
									left: { style: 'thin' },
									bottom: { style: 'thin' },
									right: { style: 'thin' }
								};
								cell.alignment = { horizontal: 'center', wrapText: true };
							});
						} else if (rowNum > 4 && rowNum < worksheet._rows.length) {
							const cellIndex = this.notFormatedCellArray.findIndex(item => item === rowNum);
							if (cellIndex === -1) {
								row.eachCell((cell) => {
									cell.font = {
										name: 'Arial',
										size: 10,
									};
									cell.alignment = { wrapText: true, horizontal: 'center' };
								});
								if (rowNum % 2 === 0) {
									row.eachCell((cell) => {
										cell.fill = {
											type: 'pattern',
											pattern: 'solid',
											fgColor: { argb: 'ffffff' },
											bgColor: { argb: 'ffffff' },
										};
										cell.border = {
											top: { style: 'thin' },
											left: { style: 'thin' },
											bottom: { style: 'thin' },
											right: { style: 'thin' }
										};
									});
								} else {
									row.eachCell((cell) => {
										cell.fill = {
											type: 'pattern',
											pattern: 'solid',
											fgColor: { argb: 'ffffff' },
											bgColor: { argb: 'ffffff' },
										};
										cell.border = {
											top: { style: 'thin' },
											left: { style: 'thin' },
											bottom: { style: 'thin' },
											right: { style: 'thin' }
										};
									});
								}

							}
						}
						row.defaultRowHeight = 24;
					});

					worksheet.addRow({});

					worksheet.mergeCells('A' + (worksheet._rows.length + 1) + ':' +
						this.alphabetJSON[columns.length] + (worksheet._rows.length + 1));
					worksheet.getCell('A' + worksheet._rows.length).value = 'Report Filtered as: ' + this.feeMonthArray.filter(e => e.fm_id == this.paramform.value.month)[0].fm_name;
					worksheet.getCell('A' + worksheet._rows.length).font = {
						name: 'Arial',
						size: 10,
						bold: true
					};

					worksheet.mergeCells('A' + (worksheet._rows.length + 1) + ':' +
						this.alphabetJSON[columns.length] + (worksheet._rows.length + 1));
					worksheet.getCell('A' + worksheet._rows.length).value = 'No of records: ' + data.invoice_due_data.length;
					worksheet.getCell('A' + worksheet._rows.length).font = {
						name: 'Arial',
						size: 10,
						bold: true
					};

					worksheet.mergeCells('A' + (worksheet._rows.length + 1) + ':' +
						this.alphabetJSON[columns.length] + (worksheet._rows.length + 1));
					worksheet.getCell('A' + worksheet._rows.length).value = 'Generated On: '
						+ new DatePipe('en-in').transform(new Date(), 'd-MMM-y');
					worksheet.getCell('A' + worksheet._rows.length).font = {
						name: 'Arial',
						size: 10,
						bold: true
					};

					worksheet.mergeCells('A' + (worksheet._rows.length + 1) + ':' +
						this.alphabetJSON[columns.length] + (worksheet._rows.length + 1));
					worksheet.getCell('A' + worksheet._rows.length).value = 'Generated By: ' + this.currentUser.full_name;
					worksheet.getCell('A' + worksheet._rows.length).font = {
						name: 'Arial',
						size: 10,
						bold: true
					};
					workbook.xlsx.writeBuffer().then(data => {
						const blob = new Blob([data], { type: 'application/octet-stream' });
						saveAs(blob, "Invoice_due_report_" + this.paramform.value.month + ".xlsx");
					});


				}
			)

		} else if (this.currentTabIndex == 1) {
			let param: any = {};
			param.gs_alias = ['fa_partial_payment'];
			this.faService.getGlobalSetting(param).subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						if (result.data && result.data[0]) {
							if (Number(result.data[0]['gs_value'])) {
								this.faService.getInvoiceDayBook({ sessionId: this.session.ses_id, monthId: Number(this.paramform.value.month) }).subscribe(
									(data: any) => {
										let columndefinition = [{
											name: 'Date',
											id: 'date'
										}];
										const columns: any[] = [];
										const columValue: any[] = [];
										console.log("i am data", data.receipt_data);
										for (let i = 0; i < data.receipt_data[0].value.length; i++) {
											let obj = {
												id: data.receipt_data[0].value[i].pay_name,
												name: data.receipt_data[0].value[i].pay_name,
											}
											columndefinition.push(obj);
										}
										columndefinition.push({
											id: 'total',
											name: "Total"
										});
										console.log("here ----------",);
										
										const workbook = new Excel.Workbook();
										const worksheet = workbook.addWorksheet('Receipt_Current_report', { properties: { showGridLines: true } },
											{ pageSetup: { fitToWidth: 7 } });
										for (const item of columndefinition) {
											columns.push({
												key: item.id,
												width: 12
											});
											columValue.push(item.name);
										}
										worksheet.properties.defaultRowHeight = 25;
										worksheet.mergeCells('A1:' + this.alphabetJSON[columns.length] + '1'); // Extend cell over all column headers
										worksheet.getCell('A1').value =
											new TitleCasePipe().transform(this.schoolInfo.school_name) + ', ' + this.schoolInfo.school_city + ', ' + this.schoolInfo.school_state;
										worksheet.getCell('A1').alignment = { horizontal: 'left' };
										worksheet.mergeCells('A2:' + this.alphabetJSON[columns.length] + '2');
										worksheet.getCell('A2').value = "Reciept Current Report";
										worksheet.getCell(`A2`).alignment = { horizontal: 'left' };
										worksheet.getRow(4).values = columValue;
										worksheet.columns = columns;
										let obj2: any = {};
										obj2.date = "Grand Total";
										for (let i = 0; i < data.receipt_data.length; i++) {
											let obj: any = {};
											let sum = 0;

											obj.date = this.common.dateConvertion(data.receipt_data[i].date, 'd-MMM-y');
											for(let j = 0; j < data.receipt_data[i].value.length; j++) {
												let id = data.receipt_data[i].value[j].pay_name;
												obj[`${id}`] = new IndianCurrency().transform(data.receipt_data[i].value[j].receipt_amt);
												if(obj2[`${id}`]) {
													obj2[`${id}`] += data.receipt_data[i].value[j].receipt_amt;
												} else {
													obj2[`${id}`] = data.receipt_data[i].value[j].receipt_amt;
												}
												sum += data.receipt_data[i].value[j].receipt_amt;
											}
											obj['total'] = new IndianCurrency().transform(sum);
											if(obj2['total']) {
												obj2['total'] += sum
											} else {
												obj2['total'] = sum;
											}
											worksheet.addRow(obj);
										}
										for (let key in obj2) {
											console.log("i am key", key)
											if (key != "date") {
												obj2[`${key}`] = new IndianCurrency().transform(obj2[`${key}`]);
											}
										}
										worksheet.addRow(obj2);
					
										worksheet.getRow(worksheet._rows.length).eachCell(cell => {
											columndefinition.forEach(element => {
												cell.font = {
													color: { argb: 'ffffff' },
													bold: true,
													name: 'Arial',
													size: 10
												};
												cell.alignment = { wrapText: true, horizontal: 'center' };
												cell.fill = {
													type: 'pattern',
													pattern: 'solid',
													fgColor: { argb: '439f47' },
													bgColor: { argb: '439f47' }
												};
												cell.border = {
													top: { style: 'thin' },
													left: { style: 'thin' },
													bottom: { style: 'thin' },
													right: { style: 'thin' }
												};
											});
										});
										// style all row of excel
										worksheet.eachRow((row, rowNum) => {
											if (rowNum === 1) {
												row.font = {
													name: 'Arial',
													size: 14,
													bold: true
												};
											} else if (rowNum === 2) {
												row.font = {
													name: 'Arial',
													size: 12,
													bold: true
												};
											} else if (rowNum === 4) {
												row.eachCell((cell) => {
													cell.font = {
														name: 'Arial',
														size: 12,
														bold: true
													};
													cell.fill = {
														type: 'pattern',
														pattern: 'solid',
														fgColor: { argb: 'bdbdbd' },
														bgColor: { argb: 'bdbdbd' },
													};
													cell.border = {
														top: { style: 'thin' },
														left: { style: 'thin' },
														bottom: { style: 'thin' },
														right: { style: 'thin' }
													};
													cell.alignment = { horizontal: 'center', wrapText: true };
												});
											} else if (rowNum > 4 && rowNum < worksheet._rows.length) {
												const cellIndex = this.notFormatedCellArray.findIndex(item => item === rowNum);
												if (cellIndex === -1) {
													row.eachCell((cell) => {
														cell.font = {
															name: 'Arial',
															size: 10,
														};
														cell.alignment = { wrapText: true, horizontal: 'center' };
													});
													if (rowNum % 2 === 0) {
														row.eachCell((cell) => {
															cell.fill = {
																type: 'pattern',
																pattern: 'solid',
																fgColor: { argb: 'ffffff' },
																bgColor: { argb: 'ffffff' },
															};
															cell.border = {
																top: { style: 'thin' },
																left: { style: 'thin' },
																bottom: { style: 'thin' },
																right: { style: 'thin' }
															};
														});
													} else {
														row.eachCell((cell) => {
															cell.fill = {
																type: 'pattern',
																pattern: 'solid',
																fgColor: { argb: 'ffffff' },
																bgColor: { argb: 'ffffff' },
															};
															cell.border = {
																top: { style: 'thin' },
																left: { style: 'thin' },
																bottom: { style: 'thin' },
																right: { style: 'thin' }
															};
														});
													}
					
												}
											}
											row.defaultRowHeight = 24;
										});
					
										worksheet.addRow({});
					
										worksheet.mergeCells('A' + (worksheet._rows.length + 1) + ':' +
											this.alphabetJSON[columns.length] + (worksheet._rows.length + 1));
										worksheet.getCell('A' + worksheet._rows.length).value = 'Report Filtered as: ' + this.feeMonthArray.filter(e => e.fm_id == this.paramform.value.month)[0].fm_name;
										worksheet.getCell('A' + worksheet._rows.length).font = {
											name: 'Arial',
											size: 10,
											bold: true
										};
					
										worksheet.mergeCells('A' + (worksheet._rows.length + 1) + ':' +
											this.alphabetJSON[columns.length] + (worksheet._rows.length + 1));
										worksheet.getCell('A' + worksheet._rows.length).value = 'No of records: ' + data.receipt_data.length;
										worksheet.getCell('A' + worksheet._rows.length).font = {
											name: 'Arial',
											size: 10,
											bold: true
										};
					
										worksheet.mergeCells('A' + (worksheet._rows.length + 1) + ':' +
											this.alphabetJSON[columns.length] + (worksheet._rows.length + 1));
										worksheet.getCell('A' + worksheet._rows.length).value = 'Generated On: '
											+ new DatePipe('en-in').transform(new Date(), 'd-MMM-y');
										worksheet.getCell('A' + worksheet._rows.length).font = {
											name: 'Arial',
											size: 10,
											bold: true
										};
					
										worksheet.mergeCells('A' + (worksheet._rows.length + 1) + ':' +
											this.alphabetJSON[columns.length] + (worksheet._rows.length + 1));
										worksheet.getCell('A' + worksheet._rows.length).value = 'Generated By: ' + this.currentUser.full_name;
										worksheet.getCell('A' + worksheet._rows.length).font = {
											name: 'Arial',
											size: 10,
											bold: true
										};
										workbook.xlsx.writeBuffer().then(data => {
											const blob = new Blob([data], { type: 'application/octet-stream' });
											saveAs(blob, "Receipt_current_report_" + this.paramform.value.month + ".xlsx");
										});
					
									}
								)
							}
						}
					}
				})
		} else if (this.currentTabIndex == 2) {
			let param: any = {};
			param.gs_alias = ['fa_partial_payment'];
			this.faService.getGlobalSetting(param).subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						if (result.data && result.data[0]) {
							if (Number(result.data[0]['gs_value'])) {
								this.faService.getInvoiceDayBook({ sessionId: this.session.ses_id, monthId: Number(this.paramform.value.month) }).subscribe(
									(data: any) => {
										let columndefinition = [{
											name: 'Date',
											id: 'date'
										}];
										const columns: any[] = [];
										const columValue: any[] = [];
										console.log("i am data", data.receipt_data);
										for (let i = 0; i < data.receipt_data[0].value.length; i++) {
											let obj = {
												id: data.receipt_data[0].value[i].pay_name,
												name: data.receipt_data[0].value[i].pay_name,
											}
											columndefinition.push(obj);
										}
										columndefinition.push({
											id: 'total',
											name: "Total"
										});
										console.log("here ----------",);
										
										const workbook = new Excel.Workbook();
										const worksheet = workbook.addWorksheet('Receipt_Advance_report', { properties: { showGridLines: true } },
											{ pageSetup: { fitToWidth: 7 } });
										for (const item of columndefinition) {
											columns.push({
												key: item.id,
												width: 12
											});
											columValue.push(item.name);
										}
										worksheet.properties.defaultRowHeight = 25;
										worksheet.mergeCells('A1:' + this.alphabetJSON[columns.length] + '1'); // Extend cell over all column headers
										worksheet.getCell('A1').value =
											new TitleCasePipe().transform(this.schoolInfo.school_name) + ', ' + this.schoolInfo.school_city + ', ' + this.schoolInfo.school_state;
										worksheet.getCell('A1').alignment = { horizontal: 'left' };
										worksheet.mergeCells('A2:' + this.alphabetJSON[columns.length] + '2');
										worksheet.getCell('A2').value = "Reciept Advance Report";
										worksheet.getCell(`A2`).alignment = { horizontal: 'left' };
										worksheet.getRow(4).values = columValue;
										worksheet.columns = columns;
										let obj2: any = {};
										obj2.date = "Grand Total";
										for (let i = 0; i < data.receipt_data.length; i++) {
											let obj: any = {};
											let sum = 0;

											obj.date = this.common.dateConvertion(data.receipt_data[i].date, 'd-MMM-y');
											for(let j = 0; j < data.receipt_data[i].value.length; j++) {
												let id = data.receipt_data[i].value[j].pay_name;
												obj[`${id}`] = new IndianCurrency().transform(data.receipt_data[i].value[j].receipt_amt);
												if(obj2[`${id}`]) {
													obj2[`${id}`] += data.receipt_data[i].value[j].receipt_amt;
												} else {
													obj2[`${id}`] = data.receipt_data[i].value[j].receipt_amt;
												}
												sum += data.receipt_data[i].value[j].receipt_amt;
											}
											obj['total'] = new IndianCurrency().transform(sum);
											if(obj2['total']) {
												obj2['total'] += sum
											} else {
												obj2['total'] = sum;
											}
											worksheet.addRow(obj);
										}
										for (let key in obj2) {
											console.log("i am key", key)
											if (key != "date") {
												obj2[`${key}`] = new IndianCurrency().transform(obj2[`${key}`]);
											}
										}
										worksheet.addRow(obj2);
					
										worksheet.getRow(worksheet._rows.length).eachCell(cell => {
											columndefinition.forEach(element => {
												cell.font = {
													color: { argb: 'ffffff' },
													bold: true,
													name: 'Arial',
													size: 10
												};
												cell.alignment = { wrapText: true, horizontal: 'center' };
												cell.fill = {
													type: 'pattern',
													pattern: 'solid',
													fgColor: { argb: '439f47' },
													bgColor: { argb: '439f47' }
												};
												cell.border = {
													top: { style: 'thin' },
													left: { style: 'thin' },
													bottom: { style: 'thin' },
													right: { style: 'thin' }
												};
											});
										});
										// style all row of excel
										worksheet.eachRow((row, rowNum) => {
											if (rowNum === 1) {
												row.font = {
													name: 'Arial',
													size: 14,
													bold: true
												};
											} else if (rowNum === 2) {
												row.font = {
													name: 'Arial',
													size: 12,
													bold: true
												};
											} else if (rowNum === 4) {
												row.eachCell((cell) => {
													cell.font = {
														name: 'Arial',
														size: 12,
														bold: true
													};
													cell.fill = {
														type: 'pattern',
														pattern: 'solid',
														fgColor: { argb: 'bdbdbd' },
														bgColor: { argb: 'bdbdbd' },
													};
													cell.border = {
														top: { style: 'thin' },
														left: { style: 'thin' },
														bottom: { style: 'thin' },
														right: { style: 'thin' }
													};
													cell.alignment = { horizontal: 'center', wrapText: true };
												});
											} else if (rowNum > 4 && rowNum < worksheet._rows.length) {
												const cellIndex = this.notFormatedCellArray.findIndex(item => item === rowNum);
												if (cellIndex === -1) {
													row.eachCell((cell) => {
														cell.font = {
															name: 'Arial',
															size: 10,
														};
														cell.alignment = { wrapText: true, horizontal: 'center' };
													});
													if (rowNum % 2 === 0) {
														row.eachCell((cell) => {
															cell.fill = {
																type: 'pattern',
																pattern: 'solid',
																fgColor: { argb: 'ffffff' },
																bgColor: { argb: 'ffffff' },
															};
															cell.border = {
																top: { style: 'thin' },
																left: { style: 'thin' },
																bottom: { style: 'thin' },
																right: { style: 'thin' }
															};
														});
													} else {
														row.eachCell((cell) => {
															cell.fill = {
																type: 'pattern',
																pattern: 'solid',
																fgColor: { argb: 'ffffff' },
																bgColor: { argb: 'ffffff' },
															};
															cell.border = {
																top: { style: 'thin' },
																left: { style: 'thin' },
																bottom: { style: 'thin' },
																right: { style: 'thin' }
															};
														});
													}
					
												}
											}
											row.defaultRowHeight = 24;
										});
					
										worksheet.addRow({});
					
										worksheet.mergeCells('A' + (worksheet._rows.length + 1) + ':' +
											this.alphabetJSON[columns.length] + (worksheet._rows.length + 1));
										worksheet.getCell('A' + worksheet._rows.length).value = 'Report Filtered as: ' + this.feeMonthArray.filter(e => e.fm_id == this.paramform.value.month)[0].fm_name;
										worksheet.getCell('A' + worksheet._rows.length).font = {
											name: 'Arial',
											size: 10,
											bold: true
										};
					
										worksheet.mergeCells('A' + (worksheet._rows.length + 1) + ':' +
											this.alphabetJSON[columns.length] + (worksheet._rows.length + 1));
										worksheet.getCell('A' + worksheet._rows.length).value = 'No of records: ' + data.receipt_data.length;
										worksheet.getCell('A' + worksheet._rows.length).font = {
											name: 'Arial',
											size: 10,
											bold: true
										};
					
										worksheet.mergeCells('A' + (worksheet._rows.length + 1) + ':' +
											this.alphabetJSON[columns.length] + (worksheet._rows.length + 1));
										worksheet.getCell('A' + worksheet._rows.length).value = 'Generated On: '
											+ new DatePipe('en-in').transform(new Date(), 'd-MMM-y');
										worksheet.getCell('A' + worksheet._rows.length).font = {
											name: 'Arial',
											size: 10,
											bold: true
										};
					
										worksheet.mergeCells('A' + (worksheet._rows.length + 1) + ':' +
											this.alphabetJSON[columns.length] + (worksheet._rows.length + 1));
										worksheet.getCell('A' + worksheet._rows.length).value = 'Generated By: ' + this.currentUser.full_name;
										worksheet.getCell('A' + worksheet._rows.length).font = {
											name: 'Arial',
											size: 10,
											bold: true
										};
										workbook.xlsx.writeBuffer().then(data => {
											const blob = new Blob([data], { type: 'application/octet-stream' });
											saveAs(blob, "Receipt_Advance_report_" + this.paramform.value.month + ".xlsx");
										});
					
									}
								)
							}
						}
					}
				})
		} else if (this.currentTabIndex == 3) {
			this.faService.getAdjustmentDayBook({ sessionId: this.session.ses_id, monthId: Number(this.paramform.value.month), vc_process: 'automatic/adjustment' }).subscribe(
				(data: any) => {
					// console.log("i am data over here -----------", data.invoice_due_data);
					let columndefinition = [{
						name: 'Date',
						id: 'date'
					}];
					const columns: any[] = [];
					const columValue: any[] = [];
					for (let i = 0; i < data.invoice_due_data[0].value.length; i++) {
						let obj: any = {};
						if (Number(data.invoice_due_data[0].value[i].fh_id) != 0) {
							obj = {
								id: data.invoice_due_data[0].value[i].fh_id,
								name: data.invoice_due_data[0].value[i].fh_name
							}
						} else {
							obj = {
								id: 't_fd',
								name: data.invoice_due_data[0].value[i].fh_name
							}
						}
						columndefinition.push(obj);
					}

					columndefinition.push({
						name: "Total",
						id: 'total'
					});
					const workbook = new Excel.Workbook();
					const worksheet = workbook.addWorksheet('Fee_Adjustment_report', { properties: { showGridLines: true } },
						{ pageSetup: { fitToWidth: 7 } });
					for (const item of columndefinition) {
						columns.push({
							key: item.id,
							width: 8
							//width: this.checkWidth(item.id, item.name)
						});
						columValue.push(item.name);
					}
					worksheet.properties.defaultRowHeight = 25;
					worksheet.mergeCells('A1:' + this.alphabetJSON[columns.length] + '1'); // Extend cell over all column headers
					worksheet.getCell('A1').value =
						new TitleCasePipe().transform(this.schoolInfo.school_name) + ', ' + this.schoolInfo.school_city + ', ' + this.schoolInfo.school_state;
					worksheet.getCell('A1').alignment = { horizontal: 'left' };
					worksheet.mergeCells('A2:' + this.alphabetJSON[columns.length] + '2');
					worksheet.getCell('A2').value = "Fee Adjustment Report";
					worksheet.getCell(`A2`).alignment = { horizontal: 'left' };
					worksheet.getRow(4).values = columValue;
					worksheet.columns = columns;
					// console.log("i am column defination", columndefinition);
					let obj2: any = {};
					obj2.date = "Grand Total";
					for (let i = 0; i < data.invoice_due_data.length; i++) {
						let obj: any = {};
						let sum = 0;

						obj.date = this.common.dateConvertion(data.invoice_due_data[i].date, 'd-MMM-y');;
						for (let j = 0; j < data.invoice_due_data[i].value.length; j++) {
							let id = data.invoice_due_data[i].value[j].fh_id;
							console.log("i am id", id);
							if (Number(id) != 0) {
								obj[`${id}`] = new IndianCurrency().transform(data.invoice_due_data[i].value[j].adjustment_amt + data.invoice_due_data[i].value[j].concession_at);
								if (obj2[`${id}`]) {
									obj2[`${id}`] += data.invoice_due_data[i].value[j].adjustment_amt + data.invoice_due_data[i].value[j].concession_at;
								} else {
									obj2[`${id}`] = data.invoice_due_data[i].value[j].adjustment_amt + data.invoice_due_data[i].value[j].concession_at;
								}
							}
							else {
								obj[`t_fd`] = new IndianCurrency().transform(data.invoice_due_data[i].value[j].adjustment_amt + data.invoice_due_data[i].value[j].concession_at);
								if (obj2[`t_fd`]) {
									obj2[`t_fd`] += data.invoice_due_data[i].value[j].adjustment_amt + data.invoice_due_data[i].value[j].concession_at;
								} else {
									obj2[`t_fd`] = data.invoice_due_data[i].value[j].adjustment_amt + data.invoice_due_data[i].value[j].concession_at;
								}
							}
							sum += data.invoice_due_data[i].value[j].adjustment_amt + data.invoice_due_data[i].value[j].concession_at;
						}

						if (obj2.total) {
							obj2.total += sum;
						} else {
							obj2.total = sum;
						}
						// console.log("i am obj ------------------------", obj);
						obj.total = new IndianCurrency().transform(sum);
						worksheet.addRow(obj);
					}
					for (let key in obj2) {
						console.log("i am key", key)
						if (key != "date") {
							obj2[`${key}`] = new IndianCurrency().transform(obj2[`${key}`]);
						}
					}
					worksheet.addRow(obj2);

					worksheet.getRow(worksheet._rows.length).eachCell(cell => {
						columndefinition.forEach(element => {
							cell.font = {
								color: { argb: 'ffffff' },
								bold: true,
								name: 'Arial',
								size: 10
							};
							cell.alignment = { wrapText: true, horizontal: 'center' };
							cell.fill = {
								type: 'pattern',
								pattern: 'solid',
								fgColor: { argb: '439f47' },
								bgColor: { argb: '439f47' }
							};
							cell.border = {
								top: { style: 'thin' },
								left: { style: 'thin' },
								bottom: { style: 'thin' },
								right: { style: 'thin' }
							};
						});
					});
					// style all row of excel
					worksheet.eachRow((row, rowNum) => {
						if (rowNum === 1) {
							row.font = {
								name: 'Arial',
								size: 14,
								bold: true
							};
						} else if (rowNum === 2) {
							row.font = {
								name: 'Arial',
								size: 12,
								bold: true
							};
						} else if (rowNum === 4) {
							row.eachCell((cell) => {
								cell.font = {
									name: 'Arial',
									size: 12,
									bold: true
								};
								cell.fill = {
									type: 'pattern',
									pattern: 'solid',
									fgColor: { argb: 'bdbdbd' },
									bgColor: { argb: 'bdbdbd' },
								};
								cell.border = {
									top: { style: 'thin' },
									left: { style: 'thin' },
									bottom: { style: 'thin' },
									right: { style: 'thin' }
								};
								cell.alignment = { horizontal: 'center', wrapText: true };
							});
						} else if (rowNum > 4 && rowNum < worksheet._rows.length) {
							const cellIndex = this.notFormatedCellArray.findIndex(item => item === rowNum);
							if (cellIndex === -1) {
								row.eachCell((cell) => {
									cell.font = {
										name: 'Arial',
										size: 10,
									};
									cell.alignment = { wrapText: true, horizontal: 'center' };
								});
								if (rowNum % 2 === 0) {
									row.eachCell((cell) => {
										cell.fill = {
											type: 'pattern',
											pattern: 'solid',
											fgColor: { argb: 'ffffff' },
											bgColor: { argb: 'ffffff' },
										};
										cell.border = {
											top: { style: 'thin' },
											left: { style: 'thin' },
											bottom: { style: 'thin' },
											right: { style: 'thin' }
										};
									});
								} else {
									row.eachCell((cell) => {
										cell.fill = {
											type: 'pattern',
											pattern: 'solid',
											fgColor: { argb: 'ffffff' },
											bgColor: { argb: 'ffffff' },
										};
										cell.border = {
											top: { style: 'thin' },
											left: { style: 'thin' },
											bottom: { style: 'thin' },
											right: { style: 'thin' }
										};
									});
								}

							}
						}
						row.defaultRowHeight = 24;
					});

					worksheet.addRow({});
					// if (this.groupColumns.length > 0) {
					// 	worksheet.mergeCells('A' + (worksheet._rows.length + 1) + ':' +
					// 		this.alphabetJSON[columns.length] + (worksheet._rows.length + 1));
					// 	worksheet.getCell('A' + worksheet._rows.length).value = 'Groupded As: ' + this.getGroupColumns(this.groupColumns);
					// 	worksheet.getCell('A' + worksheet._rows.length).font = {
					// 		name: 'Arial',
					// 		size: 10,
					// 		bold: true
					// 	};
					// }

					worksheet.mergeCells('A' + (worksheet._rows.length + 1) + ':' +
						this.alphabetJSON[columns.length] + (worksheet._rows.length + 1));
					worksheet.getCell('A' + worksheet._rows.length).value = 'Report Filtered as: ' + this.feeMonthArray.filter(e => e.fm_id == this.paramform.value.month)[0].fm_name;
					worksheet.getCell('A' + worksheet._rows.length).font = {
						name: 'Arial',
						size: 10,
						bold: true
					};

					worksheet.mergeCells('A' + (worksheet._rows.length + 1) + ':' +
						this.alphabetJSON[columns.length] + (worksheet._rows.length + 1));
					worksheet.getCell('A' + worksheet._rows.length).value = 'No of records: ' + data.invoice_due_data.length;
					worksheet.getCell('A' + worksheet._rows.length).font = {
						name: 'Arial',
						size: 10,
						bold: true
					};

					worksheet.mergeCells('A' + (worksheet._rows.length + 1) + ':' +
						this.alphabetJSON[columns.length] + (worksheet._rows.length + 1));
					worksheet.getCell('A' + worksheet._rows.length).value = 'Generated On: '
						+ new DatePipe('en-in').transform(new Date(), 'd-MMM-y');
					worksheet.getCell('A' + worksheet._rows.length).font = {
						name: 'Arial',
						size: 10,
						bold: true
					};

					worksheet.mergeCells('A' + (worksheet._rows.length + 1) + ':' +
						this.alphabetJSON[columns.length] + (worksheet._rows.length + 1));
					worksheet.getCell('A' + worksheet._rows.length).value = 'Generated By: ' + this.currentUser.full_name;
					worksheet.getCell('A' + worksheet._rows.length).font = {
						name: 'Arial',
						size: 10,
						bold: true
					};
					workbook.xlsx.writeBuffer().then(data => {
						const blob = new Blob([data], { type: 'application/octet-stream' });
						saveAs(blob, "Fee_Adjustment_report_" + this.paramform.value.month + ".xlsx");
					});


				}
			)
		} else if (this.currentTabIndex == 4) {

		}
	}

	getFeeMonths() {
		this.feeMonthArray = [];
		this.faService.getFeeMonths({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				console.log(result.data);
				this.feeMonthArray = result.data;
			}
		});
	}
}