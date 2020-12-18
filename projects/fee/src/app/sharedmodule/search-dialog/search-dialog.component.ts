import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CommonAPIService } from 'src/app/_services';
import { SisService, FeeService } from '../../_services';
import { MatTableDataSource } from '@angular/material';
import { DatePipe } from '@angular/common';
@Component({
	selector: 'app-search-dialog',
	templateUrl: './search-dialog.component.html',
	styleUrls: ['./search-dialog.component.css']
})
export class SearchDialogComponent implements OnInit {

	displayedColumns: string[] = ['srno', 'feehead', 'feedue', 'concession', 'adjustment', 'netpay'];
	INVOICE_ELEMENT_DATA: any[] = [];
	dataSource = new MatTableDataSource<any>(this.INVOICE_ELEMENT_DATA);
	inputData: any;
	searchForm: FormGroup;
	reasonArr: any;
	invoiceArrayForm: any[]= [];
	invoiceArray:any[]=[];
	invoice:any;
	invoiceTotal=0;
	invoiceFormArrayClone:any[]=[];
	@Input() deleteMessage;
	@Output() deleteOk = new EventEmitter<any>();
	@Output() deleteCancel = new EventEmitter<any>();
	dialogRef: MatDialogRef<SearchDialogComponent>;
	@ViewChild('searchDialogModal') searchDialogModal;
	receiptData:any;
	showTable =false;
	constructor(private feeService:FeeService,private sisService: SisService, private dialog: MatDialog, private fbuild: FormBuilder, public common: CommonAPIService, ) { }

	ngOnInit() {
		this.buildForm();
	}

	buildForm() {
		this.searchForm = this.fbuild.group({
			'inv_id': '',
			'receipt_number': ''
		});
	}


	openModal(data) {
		console.log('data', data);
		this.inputData = data;
		this.showTable =false;
		this.searchForm.patchValue({
			'inv_id': data,
			'receipt_number': ''
		});
		this.getInvoices(data[0])
		this.dialogRef = this.dialog.open(this.searchDialogModal, {
			'height': '450px',
			'width': '60%',
			position: {
				'top': '15%'
			}
		});
	}

	getInvoices(inv_number) {
		const datePipe = new DatePipe('en-in');
		this.INVOICE_ELEMENT_DATA = [];
		this.invoiceArrayForm = [];
		this.invoiceFormArrayClone=[];
		this.dataSource = new MatTableDataSource<any>(this.INVOICE_ELEMENT_DATA);
		this.invoiceArray = [];
		const invoiceJSON: any = {
			inv_id: inv_number,
			
		};
		this.feeService.getInvoiceBifurcation(invoiceJSON).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.invoiceArrayForm = [];
				this.invoiceFormArrayClone = [];

				this.INVOICE_ELEMENT_DATA = [];
				this.dataSource = new MatTableDataSource<any>(this.INVOICE_ELEMENT_DATA);
				this.invoice = {};
				this.invoice = result.data[0];
				this.invoice.netPay = this.invoice.late_fine_amt ?
					Number(this.invoice.late_fine_amt) + Number(this.invoice.fee_amount) :
					Number(this.invoice.fee_amount);


				if (this.invoice.balance_amt) {
					this.invoice.balance_amt = Number(this.invoice.balance_amt);
					this.invoice.netPay += Number(this.invoice.balance_amt);
				}
				// if (this.invoice.prev_balance) {
				// 	this.invoice.netPay += Number(this.invoice.prev_balance);
				// 	this.invoice.balance_amt += Number(this.invoice.prev_balance);
				// }

				if (this.invoice.netPay < 0) {
					this.invoice.netPay = 0;
				}

				

				this.invoiceArray = this.invoice.invoice_bifurcation;

				

				
				let pos = 1;
				this.invoiceTotal = 0;
				if (this.invoice.inv_prev_balance && Number(this.invoice.inv_prev_balance) !== 0) {
					const element = {
						srno: pos,
						feehead: 'Previous Balance',
						feedue: Number(this.invoice.inv_prev_balance),
						concession: 0,
						adjustment: 0,
						netpay: Number(this.invoice.inv_prev_balance)
					};
					this.invoiceTotal += element.netpay;
					this.INVOICE_ELEMENT_DATA.push(element);
					pos++;
					// var fb = this.fbuild.group({	
					// 	rm_inv_id:'',
					// 	rm_head_type:'',
					// 	rm_fm_id:'',
					// 	rm_fh_id:'',
					// 	rm_fh_name:'',
					// 	rm_fh_amount:'',
					// 	rm_fcc_id:'',
					// 	rm_fcc_name:'',
					// 	rm_fcc_amount:'',
					// 	rm_adj_amount:'',
					// 	rm_total_amount:'',


					// 	netpay:Number(this.invoice.inv_prev_balance),
					// 	feehead: 'Previous Balance'
					// });
					// this.invoiceArrayForm.push(fb);
				}
				for (const item of this.invoiceArray) {
					if (Number(item.head_bal_amount) != 0 ) {
					this.INVOICE_ELEMENT_DATA.push({
						srno: pos,
						feehead: item.invg_fh_name,
						feedue: item.invg_fh_amount,
						concession: item.invg_fcc_amount,
						adjustment: item.invg_adj_amount,
						// tslint:disable-next-line: max-line-length
						//netpay: Number(item.invg_fh_amount) - Number(item.invg_fcc_amount) - (Number(item.invg_adj_amount) ? Number(item.invg_adj_amount) : 0),
						netpay: Number(item.head_bal_amount)
					});
					// tslint:disable-next-line: max-line-length
					if (item.invg_fh_name != 'Previous Received Amt.') {
					var fb = this.fbuild.group({
						rm_inv_id:item.invg_inv_id,
						rm_head_type:item.invg_head_type,
						rm_fm_id:item.invg_fm_id,
						rm_fh_id:item.invg_fh_id,
						rm_fh_name:item.invg_fh_name,
						rm_fh_amount:item.invg_fh_amount,
						rm_fcc_id:item.invg_fcc_id,
						rm_fcc_name:item.invg_fcc_name,
						rm_fcc_amount:item.invg_fcc_amount,
						rm_adj_amount:item.invg_adj_amount,
						rm_total_amount:Number(item.head_bal_amount) > 0 ? Number(item.head_bal_amount) : 0,
						//netpay:Number(item.invg_fh_amount) - Number(item.invg_fcc_amount) - (Number(item.invg_adj_amount) ? Number(item.invg_adj_amount) : 0)
						netpay: Number(item.head_bal_amount)
					});
					this.invoiceArrayForm.push(fb);
					this.invoiceFormArrayClone.push(fb);}
					pos++;
				}
					
					this.invoiceTotal += Number(item.invg_fh_amount) - Number(item.invg_fcc_amount) - (Number(item.invg_adj_amount) ? Number(item.invg_adj_amount) : 0);
					
					
					
				}
				if (this.invoice.inv_fine_amount && Number(this.invoice.inv_fine_amount > 0)) {
					const element = {
						srno: pos,
						feehead: 'Fine & Penalties',
						feedue: Number(this.invoice.inv_fine_amount),
						concession: 0,
						adjustment: 0,
						netpay: Number(this.invoice.inv_fine_amount),
					};
					this.invoiceTotal += element.netpay;
					this.INVOICE_ELEMENT_DATA.push(element);
					// var fb = this.fbuild.group({
					// 	rm_inv_id:'',
					// 	rm_head_type:'',
					// 	rm_fm_id:'',
					// 	rm_fh_id:'',
					// 	rm_fh_name:'',
					// 	rm_fh_amount:'',
					// 	rm_fcc_id:'',
					// 	rm_fcc_name:'',
					// 	rm_fcc_amount:'',
					// 	rm_adj_amount:'',
					// 	rm_total_amount:'',						
					// 	netpay:Number(this.invoice.inv_fine_amount)
					// });
					// this.invoiceArrayForm.push(fb);
				}
				
				this.dataSource = new MatTableDataSource<any>(this.INVOICE_ELEMENT_DATA);
			}
		});
	}


	search(event) {
		var code = event.keyCode || event.which; 
  if (code  == 13) {               
    event.preventDefault();
    return false;
  }
		console.log('this.searchForm.value.receipt_number--',code,this.searchForm.value.receipt_number);
		//this.invoiceArrayForm = this.invoiceFormArrayClone;
		this.feeService.getReceiptBifurcation({flgr_invoice_receipt_no:this.searchForm.value.receipt_number}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.showTable = true;
				console.log('result--', result);
				console.log('this.invoiceArray--',this.invoiceArrayForm);
				if (result && result.data && result.data[0]) {
					let receipt_amt = Number(result.data[0]['ftr_amount']);
					this.receiptData = result.data[0];
					for(var i=0; i<this.invoiceArrayForm.length;i++) {
						 console.log('receipt_amt--',receipt_amt, i,Number(this.invoiceArrayForm[i].value.rm_total_amount))
						if (this.invoiceArrayForm[i] && (Number(this.invoiceArrayForm[i].value.rm_total_amount) >= Number(receipt_amt))) {
							this.invoiceArrayForm[i].patchValue({
								rm_total_amount: Number(receipt_amt),
								netpay: Number(receipt_amt)
							});
							receipt_amt =Number(receipt_amt) - Number(this.invoiceArrayForm[i].value.rm_total_amount);
						} else if (this.invoiceArrayForm[i] && (Number(this.invoiceArrayForm[i].value.rm_total_amount) < Number(receipt_amt))) {
							this.invoiceArrayForm[i].patchValue({
								rm_total_amount: Number(this.invoiceArrayForm[i].value.rm_total_amount),
								netpay: Number(this.invoiceArrayForm[i].value.rm_total_amount)
							});
							receipt_amt = Number(receipt_amt) - Number(this.invoiceArrayForm[i].value.rm_total_amount);
						} else {
							if (this.invoiceArrayForm[i]) {
							this.invoiceArrayForm[i].patchValue({
								rm_total_amount: 0,
								netpay: 0
							});}
							
						}	
						this.setNetPay();



					}

				}
				
				// this.common.showSuccessErrorMessage(result.message, 'success');
				// this.getFeeLedger(this.loginId);
				// this.feeRenderId = this.commonStudentProfileComponent.studentdetailsform.value.au_enrollment_id;
			} else {
				// this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});
		// if (this.searchForm.valid) {
		// 	this.deleteOk.emit(this.searchForm.value);
		// 	this.dialogRef.close();
		// 	this.searchForm.patchValue({
		// 		'inv_id': [],
		// 		'receipt_number': ''
		// 	});
		// } else {
		// 	this.common.showSuccessErrorMessage('Please choose reason to delete invoice', 'error');
		// }

	}

	cancel() {
		this.deleteCancel.emit(this.searchForm.value);
	}
	closeDialog() {
		this.deleteCancel.emit(this.searchForm.value);
		this.dialogRef.close();
	}

	setNetPay() {
		console.log(this.invoiceArrayForm);
		this.invoiceTotal = 0;
		// this.invoiceArrayForm[i].patchValue({
		// 	netpay:Number(this.invoiceArrayForm[i].value.feedue)-Number(this.invoiceArrayForm[i].value.concession) - Number(this.invoiceArrayForm[i].value.adjustment)
		// });
		for (let i=0; i<this.invoiceArrayForm.length;i++) {
			if (this.invoiceArrayForm[i]) {
			this.invoiceTotal = this.invoiceTotal+Number(this.invoiceArrayForm[i].value.netpay);
			this.invoiceArrayForm[i].patchValue({rm_total_amount : this.invoiceArrayForm[i].value.netpay});
			}
		}

		// this.feeTransactionForm.patchValue({
		// 	ftr_amount:this.invoiceTotal
		// })


	}

	submitReceipt(event) {
		var code = event.keyCode || event.which; 
		if (code  == 13) {               
			event.preventDefault();
			return false;
		} else {
		
		let inputJson = this.searchForm.value;
		let receiptMappArr = [];
		for (var i=0;i<this.invoiceArrayForm.length;i++) {
			if (this.invoiceArrayForm[i].value.rm_inv_id && Number(this.invoiceArrayForm[i].value.rm_total_amount) != 0 ) {
			receiptMappArr.push({
				rm_rpt_id:this.receiptData.rpt_id,
				rm_rpt_no:this.receiptData.rpt_receipt_no,
				rm_inv_id:this.invoiceArrayForm[i].value.rm_inv_id,
				rm_head_type:this.invoiceArrayForm[i].value.rm_head_type,
				rm_fm_id:this.invoiceArrayForm[i].value.rm_fm_id,
				rm_fh_id:this.invoiceArrayForm[i].value.rm_fh_id,
				rm_fh_name:this.invoiceArrayForm[i].value.rm_fh_name,
				rm_fh_amount:this.invoiceArrayForm[i].value.rm_fh_amount,
				rm_fcc_id:this.invoiceArrayForm[i].value.rm_fcc_id,
				rm_fcc_name:this.invoiceArrayForm[i].value.rm_fcc_name,
				rm_fcc_amount:this.invoiceArrayForm[i].value.rm_fcc_amount,
				rm_adj_amount:this.invoiceArrayForm[i].value.rm_adj_amount,
				rm_total_amount:this.invoiceArrayForm[i].value.rm_total_amount,
			}) }
		}
		inputJson.receipt_mapping= receiptMappArr;

		if (this.searchForm.valid) {
			this.deleteOk.emit(inputJson);
			this.invoiceArrayForm = [];
			this.invoiceFormArrayClone=[];
			this.dialogRef.close();
			this.searchForm.patchValue({
				'inv_id': [],
				'receipt_number': ''
			});
		} else {
			this.common.showSuccessErrorMessage('Please choose reason to delete invoice', 'error');
		}
	}}

}
