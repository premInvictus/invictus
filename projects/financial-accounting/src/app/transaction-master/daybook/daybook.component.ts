
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
	
	constructor(
		private fbuild: FormBuilder,
		private faService: FaService,
		public router: Router,
		public route: ActivatedRoute,
		private sisService: SisService,
		private common: CommonAPIService
	) { }
	
  
	ngOnInit(){
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
					this.adjustmentStatus = result.data[0]['gs_value'] == '1'? 1 : 0 ;
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
		if(this.currentTabIndex == 0) {	
			let pdfrowdata = [];
			this.faService.getInvoiceDayBook({ sessionId: this.session.ses_id, monthId: Number(this.paramform.value.month), vc_process: 'automatic/invoice' }).subscribe(
				(result: any) => {
					console.log("i am result", result);
					let dataArray = result.invoice_due_data;
					if(this.paramform.value.month == "04") {
						let a = result.previous_years_data
						let dummyArray = ['Previous Due', 0,0,0,0,0,0,0,0,0,0,0,0];
						let sum = 0;
						for(let i = 0; i < a.length; i ++) {
							if(a[i].fh_id == 45) {
								dummyArray[1] += a[i].total_amt;
								sum += a[i].total_amt;
							} else if(a[i].fh_id == 65) {
								dummyArray[2] += a[i].total_amt;
								sum += a[i].total_amt;
							} else if(a[i].fh_id == 67) {
								dummyArray[3] += a[i].total_amt;
								sum += a[i].total_amt;
							} else if(a[i].fh_id == 69) {
								dummyArray[4] += a[i].total_amt;
								sum += a[i].total_amt;
							} else if(a[i].fh_id == 71) {
								dummyArray[5] += a[i].total_amt;
								sum += a[i].total_amt;
							} else if(a[i].fh_id == 73) {
								dummyArray[6] += a[i].total_amt;
								sum += a[i].total_amt;
							} else if(a[i].fh_id == 74) {
								dummyArray[7] += a[i].total_amt;
								sum += a[i].total_amt;
							} else if(a[i].fh_id == 75) {
								dummyArray[8] += a[i].total_amt;
								sum += a[i].total_amt;
							} else if(a[i].fh_id == 76) {
								dummyArray[9] += a[i].total_amt;
								sum += a[i].total_amt;
							} else if(a[i].fh_id == 77) {
								dummyArray[10] += a[i].total_amt;
								sum += a[i].total_amt;
							} else if(a[i].fh_id == -1) {
								dummyArray[11] += a[i].total_amt;
								sum += a[i].total_amt;
							} else if(a[i].fh_id == null) {
								dummyArray[12] += a[i].total_amt;
								sum += a[i].total_amt;
							} 
						}
						dummyArray.push(sum);
						pdfrowdata.push(dummyArray);
						
					}
					for(let i = 0; i< dataArray.length; i++) {
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
					
					for(let i = 0; i< 13; i++) {
						let sum = 0
						for(let j = 0; j < pdfrowdata.length; j++) {
							sum += pdfrowdata[j][i+1];
						}
						a.push(sum);
						sum = 0;
					}
					pdfrowdata.push(a);
					for(let i = 1; i <14; i++) {
						for(let j = 0; j < pdfrowdata.length; j++) {
							pdfrowdata[j][i] = new IndianCurrency().transform(pdfrowdata[j][i]);
						}
					}
					
					console.log("-------------------------------", pdfrowdata);
					doc.levelHeading = [];
					doc.levelTotalFooter = [];
					doc.levelSubtotalFooter = [];
					doc.autoTable({
						head: [[ new TitleCasePipe().transform('Income Due Report')]],
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
								doc.setFontSize('18');
								doc.setTextColor('#ffffff');
								doc.setFillColor(0, 62, 120);
							}
			
							// level more than 0
							const lsfIndex = doc.levelSubtotalFooter.findIndex(item => item === data.row.index);
							if (lsfIndex !== -1) {
								doc.setFontStyle('bold');
								doc.setFontSize('18');
								doc.setTextColor('#ffffff');
								doc.setFillColor(229, 136, 67);
							}
			
							// group heading
							const lhIndex = doc.levelHeading.findIndex(item => item === data.row.index);
							if (lhIndex !== -1) {
								doc.setFontStyle('bold');
								doc.setFontSize('18');
								doc.setTextColor('#5e666d');
								doc.setFillColor('#c8d6e5');
							}
			
							// grand total
							if (data.row.index === rows.length - 1) {
								doc.setFontStyle('bold');
								doc.setFontSize('18');
								doc.setTextColor('#ffffff');
								doc.setFillColor(67, 160, 71);
							}
						},
						headStyles: {
							fontStyle: 'bold',
							fillColor: '#c8d6e5',
							textColor: '#5e666d',
							fontSize: 18,
						},
						alternateRowStyles: {
							fillColor: '#f1f4f7'
						},
						useCss: true,
						styles: {
							fontSize: 18,
							cellWidth: 'auto',
							textColor: 'black',
							lineColor: '#89a8c8',
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
					doc.save('Income_due_'+this.paramform.value.month+".pdf");
				}
			);
		} else if(this.currentTabIndex == 1 ) {			
			doc.autoTable({
				head: [[ new TitleCasePipe().transform('Receipt(Current) Report')]],
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
		} else if(this.currentTabIndex == 2 ) {			
			doc.autoTable({
				head: [[ new TitleCasePipe().transform('Receipt(Advance) Report')]],
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
		} else if(this.currentTabIndex == 3 ) {			
			doc.autoTable({
				head: [[ new TitleCasePipe().transform('Fee Adjustment Report')]],
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
		} else if(this.currentTabIndex == 4 ) {			
			doc.autoTable({
				head: [[ new TitleCasePipe().transform('Voucher Listings')]],
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