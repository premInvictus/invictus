import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CommonAPIService } from 'src/app/_services';
import { SisService, FeeService } from '../../_services';
import { DatePipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { pureObjectDef } from '@angular/core/src/view';
@Component({
	selector: 'payment-forfit-modal',
	templateUrl: './payment-forfit-modal.component.html',
	styleUrls: ['./payment-forfit-modal.component.scss']
})
export class PaymentForfitModalComponent implements OnInit {
	reason_type: any;
	inputData: any = {};
	reasonForm: FormGroup;
	reasonArr: any;
	showTable = true;
	globalSecurity = 0;
	@Input() deleteMessage;
	@Output() deleteOk = new EventEmitter<any>();
	@Output() deleteCancel = new EventEmitter<any>();
	dialogRef: MatDialogRef<PaymentForfitModalComponent>;
	selection = new SelectionModel<any>(true, []);
	@ViewChild('deleteWithReasonModal') deleteWithReasonModal;
	displayedColumns: string[] = ['select', 'srno', 'feeperiod', 'concession', 'adjustment', 'netpay'];
	displayedColumns2: string[] = ['inv_no', 'fm_period', 'invg_fh_name', 'fh_amount', 'value', 'net_payable'];
	bifurcatedInvoices: any[] = [];
	adjsource = new MatTableDataSource<any>(this.bifurcatedInvoices);
	defaultsrc = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/other.png';
	invoiceBifurcationArray2: any[] = [];
	getdatafinalarray: any[] = [];
	invoiceDetails:any;
	constructor(private sisService: SisService, private feeService: FeeService, private dialog: MatDialog, private fbuild: FormBuilder, public common: CommonAPIService,) { }

	ngOnInit() {
		this.buildForm();
	}

	buildForm() {
		this.reasonForm = this.fbuild.group({
			'fsd_status': '',
			'fsd_payment_type': '',
			'fsd_created_date': '',
			'fsd_remarks': '',
			'adj_amount': 0
		});
	}

	addEvent() {
		// this.events.push(`${type}: ${event.value}`);
		const datePipe = new DatePipe('en-US');
		const convertedDate = datePipe.transform(this.reasonForm.value.fsd_created_date, 'yyyy-MM-dd hh:mm:ss');
		this.reasonForm.patchValue({
			'fsd_created_date': convertedDate
		});
	}


	openModal(data) {
		this.getReason(13);
		console.log("i am data", data);
		this.invoiceDetails = data;
		let date = new DatePipe('en-US').transform(new Date(), 'yyyy-MM-dd')
		this.globalSecurity = parseInt(data.invg_fh_amount);
		this.feeService.getInvoiceBifurcationByLoginId({ 'ftr_transaction_date': date, 'login_id': data.au_login_id }).subscribe((res: any) => {

			if (res && res.data.length > 0) {
				this.showTable = true;
				this.bifurcatedInvoices = res.data;
				for (let k = 0; k < this.bifurcatedInvoices.length; k++) {
					// this.bifurcatedInvoices[k].fee_amount = this.bifurcatedInvoices[k].fee_amount - this.bifurcatedInvoices[k]['getadjustment'];
					this.bifurcatedInvoices[k]['amount_static'] = this.bifurcatedInvoices[k].fee_amount;
					this.bifurcatedInvoices[k]['getadjustment'] = 0
				}
				this.adjsource = new MatTableDataSource<any>(this.bifurcatedInvoices);

				for (let k = 0; k < this.bifurcatedInvoices.length; k++) {
					if (this.bifurcatedInvoices[k].fp_months.length > 1 || this.bifurcatedInvoices[k].fp_months[0].includes("-")) {
						let objtech: any = {
							inv_id: this.bifurcatedInvoices[k].inv_id,
							inv_no: this.bifurcatedInvoices[k].fp_months,
							concess_arr: []
						};

						this.feeService.getConcessionInvoiceBifurcation({ inv_id: this.bifurcatedInvoices[k].inv_id }).subscribe((resi: any) => {
							if (resi && resi.status == 'ok' && resi.data.length > 0) {
								let aa = [];
								resi.data.forEach(ele => {
									let i = 0;
									let obj: any = {};
									obj.fp_id = ele.fp_months[0];
									obj.inv_id = ele.inv_id;
									obj.bifurcation = [];
									// if (ele.balance_amt && Number(ele.balance_amt) !== 0) {
									// 	const element = {
									// 		srno: ++i,
									// 		feehead: 'Previous Balance',
									// 		feedue: Number(ele.balance_amt),
									// 		concession: 0,
									// 		adjustment: 0,
									// 		netpay: Number(ele.balance_amt),
									// 		invg_id: ''
									// 	};
									// 	// this.invoiceTotal += element.netpay;
									// 	obj.bifurcation.push(element);
									// 	objtech.concess_arr.push(element);
									// }
									ele.invoice_bifurcation.forEach(item => {
										const element = {
											srno: ++i,
											inv_invoice_no: ele.inv_invoice_no,
											invg_fh_name: item.group_detail ? '-' : item.invg_fh_name,
											fp_months: ele.fp_months,
											fs_name: item.fs_name ? item.fs_name : '',
											invg_fh_amount: Number(item.invg_fh_amount) - Number(item.invg_fcc_amount) - (Number(item.invg_adj_amount) ? Number(item.invg_adj_amount) : 0),
											concession: Number(item.invg_fcc_amount),
											invg_adj_amount: 0,
											head_bal_amount: Number(item.invg_fh_amount) - Number(item.invg_fcc_amount) - (Number(item.invg_adj_amount) ? Number(item.invg_adj_amount) : 0),
											invg_id: item.invg_id,

											grouped_data: item.group_detail ? true : false,
											action: item
										};


										// this.invoiceTotal += element.netpay;
										// console.log('item', item);
										// console.log('this.invoiceTotal', this.invoiceTotal);
										obj.bifurcation.push(element);
										objtech.concess_arr.push(element);
									});
									// this.invoiceDetails.inv_fine_amount && Number(this.invoiceDetails.inv_fine_amount > 0
									// if (true) {
									// 	const element = {
									// 		srno: ++i,
									// 		feehead: 'Fine & Penalties',
									// 		feedue: Number(ele.inv_fine_amount),
									// 		concession: 0,
									// 		adjustment: 0,
									// 		netpay: Number(ele.inv_fine_amount),
									// 		invg_id: '',
									// 		inv_id: ele.inv_id
									// 	};
									// 	obj.bifurcation.push(element);
									// 	objtech.concess_arr.push(element);
									// }
									this.invoiceBifurcationArray2.push(obj);
									aa.push(obj)
								});
								this.bifurcatedInvoices[k].concess_arr = aa;
							}
						})
						this.getdatafinalarray.push(objtech);

					} else {
						for (let a = 0; a < this.bifurcatedInvoices[k].invoice_bifurcation.length; a++) {
							this.bifurcatedInvoices[k].invoice_bifurcation[a]['inv_invoice_no'] = this.bifurcatedInvoices[k].inv_invoice_no;
							this.bifurcatedInvoices[k].invoice_bifurcation[a]['fp_months'] = this.bifurcatedInvoices[k].fp_months;
							this.bifurcatedInvoices[k].invoice_bifurcation[a]['invg_fh_amount'] = this.bifurcatedInvoices[k].invoice_bifurcation[a].head_bal_amount;
							this.bifurcatedInvoices[k].invoice_bifurcation[a]['invg_adj_amount'] = 0
						}
						let objtech: any = {
							inv_id: this.bifurcatedInvoices[k].inv_id,
							inv_no: this.bifurcatedInvoices[k].fp_months,
							bifurcation: this.bifurcatedInvoices[k].invoice_bifurcation
						};
						this.getdatafinalarray.push(objtech);
						console.log("i am final", this.adjsource.data, this.getdatafinalarray);

					}
				}
			} else {
				this.showTable = false
			}


		})
		this.inputData = data;
		this.dialogRef = this.dialog.open(this.deleteWithReasonModal, {
			'height': '70vh',
			width: '80em',
			position: {
				'top': '20%'
			}
		});
	}

	checkinvoice(item) {
		let showData = false;
		this.selection.selected.map((el: any) => {
			if (el.inv_id == item.inv_id) {
				showData = true;
			}
		});
		return showData;
	}

	getReason(reason_type) {
		this.reasonArr = [];
		this.feeService.getPaymentMode({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.reasonArr = result.data;
			}
		});
	}


	delete() {
		if (this.reasonForm.valid) {
			
			this.dialogRef.close();
			console.log("get final invoice and cehck data", this.adjsource.data, this.getdatafinalarray);
			let finaldataarray = [];
			this.getdatafinalarray.map((el: any) => {
				if (el.bifurcation) {
					el.bifurcation.forEach((element: any) => {
						if (element.invg_adj_amount > 0) {
							console.log("in here", this.reasonForm.value.adj_amount, element.invg_adj_amount);
							
							this.reasonForm.patchValue({
								adj_amount: this.reasonForm.value.adj_amount + parseInt(element.invg_adj_amount)
							})
							let obj = {
								inv_id: element.invg_inv_id,
								invg_id: element.invg_id,
								adj_amt: element.invg_adj_amount,
								remarks: this.reasonForm.value.fsd_remarks
							}
							finaldataarray.push(obj);
						}
					});
				}
				if (el.concess_arr) {
					el.concess_arr.forEach(element => {
						if (element.invg_adj_amount > 0) {
							let obj = {
								inv_id: element.action.invg_inv_id,
								invg_id: element.action.invg_id,
								adj_amt: element.invg_adj_amount,
								remarks: this.reasonForm.value.fsd_remarks
							}
							
							for (let b = 0; b < this.adjsource.data.length; b++) {
								if (this.adjsource.data[b].inv_id == el.inv_id) {
									for (let g = 0; g < this.adjsource.data[b].invoice_bifurcation.length; g++) {
										if (element.action.invg_fh_id == this.adjsource.data[b].invoice_bifurcation[g].invg_fh_id) {
											let objt = {
												inv_id: this.adjsource.data[b].invoice_bifurcation[g].invg_inv_id,
												invg_id: this.adjsource.data[b].invoice_bifurcation[g].invg_id,
												adj_amt: element.invg_adj_amount,
												remarks: this.reasonForm.value.fsd_remarks
											}
											this.reasonForm.patchValue({
												adj_amount: this.reasonForm.value.adj_amount + parseInt(element.invg_adj_amount)
											})
											console.log("in here", this.reasonForm.value.adj_amount, element.invg_adj_amount);
											finaldataarray.push(objt)
										}
									}
								}
							}
							finaldataarray.push(obj)
						}
					});
				}
			});
			this.deleteOk.emit(this.reasonForm.value);
			console.log("------------------------", finaldataarray);
			this.feeService.createSecurityAdjustment(finaldataarray).subscribe((res:any) => {
				console.log("i am res", res);
				
			})
			
			this.bifurcatedInvoices = [];
			this.adjsource = new MatTableDataSource<any>(this.bifurcatedInvoices);
			this.selection = new SelectionModel<any>(true, []);
			this.getdatafinalarray = [];
			this.reasonForm.patchValue({
				'fsd_status': '',
				'fsd_payment_type': '',
				'fsd_created_date': '',
				'fsd_remarks': '',
				'adj_amount': 0
			});
		} else {
			this.common.showSuccessErrorMessage('Please fill the required fields', 'error');
		}

	}

	cancel() {
		this.deleteCancel.emit(this.reasonForm.value);
	}
	closeDialog() {
		this.dialogRef.close();
		this.bifurcatedInvoices = [];
		this.getdatafinalarray = [];
		this.adjsource = new MatTableDataSource<any>(this.bifurcatedInvoices);
		this.selection = new SelectionModel<any>(true, []);
		this.reasonForm.patchValue({
			'fsd_status': '',
			'fsd_payment_type': '',
			'fsd_created_date': '',
			'fsd_remarks': '',
			'adj_amount': 0
		});
	}

	masterToggle() {
		// this.selection.toggle();
		this.isAllSelected() ?
			this.selection.clear() :
			this.adjsource.data.forEach((row: any) => {
				this.selection.select(row);
			});
	}

	checkboxLabel(row?: any): string {
		if (!row) {
			return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
		}
		return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.srno + 1}`;
	}

	isAllSelected() {
		const numSelected = this.selection.selected.length;
		const numRows = this.adjsource.data.length;
		return numSelected === numRows;
	}

	manipulateAction(row) {
		this.selection.toggle(row);
	}
	changeAdjAmt2(element, event) {
		let inv = "";
		let checkconcess = false;
		let status_adj = 0;
		if(event.target.value < this.globalSecurity) {
			this.globalSecurity -= event.target.value;
			for (let k = 0; k < this.getdatafinalarray.length; k++) {
				if (true) {
					if (this.getdatafinalarray[k].bifurcation && this.getdatafinalarray[k].bifurcation.length > 0) {
						for (let j = 0; j < this.getdatafinalarray[k].bifurcation.length; j++) {
							if (this.getdatafinalarray[k].bifurcation[j]['invg_id'] == element.invg_id) {
								inv = element.invg_inv_id;
								this.getdatafinalarray[k].bifurcation[j]['head_bal_amount'] = parseInt(this.getdatafinalarray[k].bifurcation[j]['head_bal_amount']) - event.target.value + parseInt(this.getdatafinalarray[k].bifurcation[j]['invg_adj_amount']);
								this.getdatafinalarray[k].bifurcation[j]['invg_adj_amount'] = event.target.value;
							}
	
						}
					} else {
						checkconcess = true;
						for (let j = 0; j < this.getdatafinalarray[k].concess_arr.length; j++) {
							if (this.getdatafinalarray[k].concess_arr[j]['invg_id'] == element.invg_id) {
								inv = this.getdatafinalarray[k].inv_id;
								status_adj = this.getdatafinalarray[k].concess_arr[j]['invg_adj_amount'];
								this.getdatafinalarray[k].concess_arr[j]['head_bal_amount'] = parseInt(this.getdatafinalarray[k].concess_arr[j]['head_bal_amount']) - event.target.value + parseInt(this.getdatafinalarray[k].concess_arr[j]['invg_adj_amount']);
								this.getdatafinalarray[k].concess_arr[j]['invg_adj_amount'] = event.target.value;
							}
						}
					}
	
				}
			}
	
			for (let k = 0; k < this.adjsource.data.length; k++) {
				if (this.adjsource.data[k].inv_id == inv && !checkconcess) {
					this.adjsource.data[k].fee_amount = this.adjsource.data[k].fee_amount - event.target.value + this.adjsource.data[k].getadjustment;
					this.adjsource.data[k].getadjustment = event.target.value;
				}
				if (this.adjsource.data[k].inv_id == inv && checkconcess) {
					this.adjsource.data[k].fee_amount = parseInt(this.adjsource.data[k].fee_amount) - event.target.value + (status_adj);
					this.adjsource.data[k].getadjustment = parseInt(this.adjsource.data[k].getadjustment) + parseInt(event.target.value) - status_adj;
				}
			}
		} else {
			event.target.value = 0;
			this.common.showSuccessErrorMessage("Please check the amount", "error")
		}
		

	}

}
