import { Component, OnInit, EventEmitter, ViewChild, Inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ReceiptDetails } from './receipt-details.model';
import { FeeService, CommonAPIService } from '../../_services/index';
import { saveAs } from 'file-saver';
import {animate, state, style, transition, trigger} from '@angular/animations';
@Component({
	selector: 'app-receipt-details-modal',
	templateUrl: './receipt-details-modal.component.html',
	styleUrls: ['./receipt-details-modal.component.scss'],
	animations: [
		trigger('detailExpand', [
		  state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
		  state('expanded', style({height: '*'})),
		  transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
		]),
	  ],
})
export class ReceiptDetailsModalComponent implements OnInit {
	@ViewChild('deleteModal') deleteModal;
	@ViewChild('recalculateModal') recalculateModal;
	@ViewChild('editReference') editReference;
	ELEMENT_DATA: ReceiptDetails[] = [];
	DETAIL_ELEMENT_DATA: ReceiptDetails[] = [];
	displayedColumns: string[] = ['srno', 'feehead','feedue', 'concession', 'adjustment', 'netpay'];
	dataSource = new MatTableDataSource<ReceiptDetails>(this.ELEMENT_DATA);
	detaildataSource = new MatTableDataSource<ReceiptDetails>(this.DETAIL_ELEMENT_DATA);
	selection = new SelectionModel<ReceiptDetails>(true, []);
	invoiceBifurcationArray: any[] = [];
	invoiceDetails: any;
	invoiceTotal = 0;
	adjustmentForm: FormGroup;
	modificationFlag = false;
	adjRemark: string;
	checkChangedFieldsArray = [];
	class_name: any;
	section_name: any;
	class_sec: any;
	defaultsrc = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/other.png';
	gender: any;
	balance: number;
	selectedRowItem:any[] = [];
	constructor(
		public dialogRef: MatDialogRef<ReceiptDetailsModalComponent>,
		@Inject(MAT_DIALOG_DATA) public data,
		private feeService: FeeService,
		private fb: FormBuilder,
		public commonAPIService: CommonAPIService
	) { }

	ngOnInit() {
		this.getReceiptBifurcation(this.data);
	}
	openEditDialog = (data) => this.editReference.openModal(data);
	openDeleteDialog = (data) => this.deleteModal.openModal(data);
	openRecalculateDialog = (data) => this.recalculateModal.openModal(data);
	buildForm() {
		this.adjustmentForm = this.fb.group({
			adjustmentField: this.fb.array([])
		});
	}
	closemodal(): void {
		this.dialogRef.close();
	}
	modifyInvoice() {
		this.modificationFlag = true;
		this.checkChangedFieldsArray = [];
	}
	changeAdjAmt(invg_id, $event) {
		const invg_id_idx = this.invoiceBifurcationArray.findIndex(item => item.invg_id === invg_id);
		if (invg_id_idx !== -1 && $event.target.value > -1) {
			this.checkChangedFieldsArray.push({
				rff_where_id: 'invg_id',
				rff_where_value: invg_id,
				rff_field_name: 'invg_adj_amount',
				rff_new_field_value: $event.target.value,
				rff_old_field_value: this.invoiceBifurcationArray[invg_id_idx].invg_adj_amount,
				rff_custom_data: this.invoiceBifurcationArray[invg_id_idx].invg_fh_name,
			});
			this.invoiceBifurcationArray[invg_id_idx].invg_adj_amount = $event.target.value;
		}
		this.invoiceDetialsTable(this.invoiceBifurcationArray);
	}
	recalculateInvoice(event) {
		this.feeService.insertInvoice({ recalculation_flag: '1', inv_id: [this.invoiceDetails.inv_id], inv_activity: 'invoice' })
			.subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.commonAPIService.showSuccessErrorMessage(result.message, 'success');
					this.getReceiptBifurcation(this.data);
				} else {
					this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
				}
			});
	}
	cancelInvoice() {
		this.modificationFlag = false;
		this.getReceiptBifurcation(this.invoiceDetails.inv_id);
	}
	updateInvoice() {
		const adj: any = { inv_id: '', adjustment: [], remark: '' };
		adj.inv_id = this.invoiceDetails.inv_id;
		this.invoiceBifurcationArray.forEach(item => {
			adj.adjustment.push({ invg_id: item.invg_id, invg_adj_amount: item.invg_adj_amount });
		});
		adj.remark = this.adjRemark;
		this.modificationFlag = false;
		// this.commonAPIService.isExistUserAccessMenu('358') || this.commonAPIService.isExistUserAccessMenu('365') 
		if (false) {
			this.feeService.invoiceAdjustmentRemark(adj).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.commonAPIService.showSuccessErrorMessage(result.message, 'success');
				}
			});
		} else {
			const param: any = {};
			const params: any[] = [];
			const datalist: any[] = [];
			if (this.checkChangedFieldsArray.length > 0) {
				param.req_login_id = this.invoiceDetails.login_id ? this.invoiceDetails.login_id : '';
				param.req_process_type = '4';
				param.req_tab_id = '18';
				param.req_priority = '';
				param.req_remarks = '';
				param.req_reason = '';
				param.req_param = [];
				param.req_date = this.commonAPIService.dateConvertion(new Date, 'yyyy-MM-dd');
				param.req_custom_data = JSON.stringify({
					belongsTo: 'invoice',
					belongsToFieldId: 'inv_id',
					belongsToFieldValue: this.invoiceDetails.inv_id,
					belongsToFieldAlias: 'inv_invoice_no',
					belongsToFieldAliasValue: this.invoiceDetails.inv_invoice_no
				});
				params.push(param);
				datalist.push(this.checkChangedFieldsArray);
			}
			this.openEditDialog({ data: datalist, reqParam: params });
		}
	}
	deleteInvoice(event) {
		this.feeService.deleteInvoice({ inv_id: [this.invoiceDetails.inv_id] })
			.subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.commonAPIService.showSuccessErrorMessage(result.message, 'success');
					this.getReceiptBifurcation(this.data);
				} else {
					this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
				}
			});
	}
	invoiceDetialsTable(arr) {
		this.ELEMENT_DATA = [];
		this.invoiceTotal = 0;
		let i = 0;
		if (this.invoiceDetails.inv_prev_balance && Number(this.invoiceDetails.inv_prev_balance) !== 0) {
			const element = {
				srno: ++i,
				feehead: 'Previous Balance',
				feedue: Number(this.invoiceDetails.inv_prev_balance),
				concession: 0,
				adjustment: 0,
				netpay: Number(this.invoiceDetails.inv_prev_balance),
				invg_id: ''
			};
			this.invoiceTotal += element.netpay;
			this.ELEMENT_DATA.push(element);
		}
		arr.forEach(item => {
			const element = {
				srno: ++i,
				feehead: item.invg_fh_name,
				fs_name:item.fs_name ? item.fs_name : '',
				feedue: Number(item.invg_fh_amount),
				concession: Number(item.invg_fcc_amount),
				adjustment: Number(item.invg_adj_amount),
				netpay: item.invg_total_amount ? Number(item.invg_total_amount) : 0,
				invg_id: item.invg_id,
				grouped_data: item.group_detail ? true : false,
				action:item
			};
			this.invoiceTotal += element.netpay;
			this.ELEMENT_DATA.push(element);
		});
		if (this.invoiceDetails.late_fine_amt && Number(this.invoiceDetails.late_fine_amt > 0)) {
			const element = {
				srno: ++i,
				feehead: 'Fine & Penalties',
				feedue: Number(this.invoiceDetails.late_fine_amt),
				concession: 0,
				adjustment: 0,
				netpay: Number(this.invoiceDetails.late_fine_amt),
				invg_id: '',
				
			};
			this.invoiceTotal += element.netpay;
			this.ELEMENT_DATA.push(element);
		}
		this.dataSource = new MatTableDataSource<ReceiptDetails>(this.ELEMENT_DATA);
	}

	

	// prepareAdhocPaymentHead() {
	// 	this.ELEMENT_DATA = [];
	// 	this.invoiceTotal = this.invoiceDetails.rpt_net_amount;
	// 	let i = 0;
	// 		const element = {
	// 			srno: ++i,
	// 			feehead: 'Adhoc Payment',
	// 			feedue: 0,
	// 			concession: 0,
	// 			adjustment: 0,
	// 			netpay: Number(this.invoiceTotal),
	// 			invg_id: '0'
	// 		};
	// 		this.ELEMENT_DATA.push(element);
	// 	this.dataSource = new MatTableDataSource<ReceiptDetails>(this.ELEMENT_DATA);
	// }
	getReceiptBifurcation(data) {
		console.log('data--', data);
		this.invoiceBifurcationArray = [];		
		let param:any= {};
			param.gs_name = ['show_grouped_head_receipt_bifurcation'];
			this.feeService.getGlobalSetting(param).subscribe((result: any) => {
			if (result && result.status === 'ok' && result.data) {
				if (result.data[0]['gs_value'] == '1') {
					this.getReceiptGroupBifurcation(data);
				} else {
					this.callReceiptBifurcationAPI(data);
				}
			
			} else {
				this.callReceiptBifurcationAPI(data);
			}
			});
	}

	callReceiptBifurcationAPI(data) {
		let recieptJSON = {};
		
		if (this.data.invoiceNo) {
			recieptJSON = { inv_id: this.data.invoiceNo };
		} else {
			recieptJSON = { rpt_id: this.data.rpt_id };
		}
		this.feeService.getReceiptBifurcation(recieptJSON).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				if (result.data.length > 0) {
					this.invoiceDetails = result.data[0];
					this.class_name = this.invoiceDetails.class_name;
					this.section_name = this.invoiceDetails.sec_name;
					this.balance = Number(this.invoiceDetails.inv_fee_amount) - Number(this.invoiceDetails.rpt_net_amount);
					if (this.section_name !== ' ') {
						this.class_sec = this.class_name + ' - ' + this.section_name;
					} else {
						this.class_sec = this.class_name;
					}
					this.gender = this.invoiceDetails.au_gender;
					if (this.gender === 'M') {
						this.defaultsrc = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/man.png';
					} else if (this.gender === 'F') {
						this.defaultsrc = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/girl.png';
					} else {
						this.defaultsrc = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/other.png';
					}
					if (this.invoiceDetails.invoice_bifurcation.length > 0) {
						this.invoiceBifurcationArray = this.invoiceDetails.invoice_bifurcation;
						this.invoiceDetialsTable(this.invoiceDetails.invoice_bifurcation);
					}

					if (this.adjustmentForm) {
						this.adjustmentForm.patchValue({
							au_profileimage: this.invoiceDetails.au_profileimage
								? this.invoiceDetails.au_profileimage
								: this.defaultsrc,
						});
					}

					this.defaultsrc =
						this.invoiceDetails.au_profileimage !== ''
							? this.invoiceDetails.au_profileimage
							: this.defaultsrc;

				}
			}
		});
	}

	getReceiptGroupBifurcation(data:any) {
		this.invoiceBifurcationArray = [];
		let recieptJSON = {};
		if (this.data.invoiceNo) {
			recieptJSON = { inv_id: this.data.invoiceNo };
		} else {
			recieptJSON = { rpt_id: this.data.rpt_id };
		}
		this.feeService.getReceiptGroupBifurcation(recieptJSON).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				if (result.data.length > 0) {
					this.invoiceDetails = result.data[0];
					this.class_name = this.invoiceDetails.class_name;
					this.section_name = this.invoiceDetails.sec_name;
					this.balance = Number(this.invoiceDetails.inv_fee_amount) - Number(this.invoiceDetails.rpt_net_amount);
					if (this.section_name !== ' ') {
						this.class_sec = this.class_name + ' - ' + this.section_name;
					} else {
						this.class_sec = this.class_name;
					}
					this.gender = this.invoiceDetails.au_gender;
					if (this.gender === 'M') {
						this.defaultsrc = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/man.png';
					} else if (this.gender === 'F') {
						this.defaultsrc = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/girl.png';
					} else {
						this.defaultsrc = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/other.png';
					}
					if (this.invoiceDetails.invoice_bifurcation.length > 0) {
						this.invoiceBifurcationArray = this.invoiceDetails.invoice_bifurcation;
						this.invoiceDetialsTable(this.invoiceDetails.invoice_bifurcation);
					}

					if (this.adjustmentForm) {
						this.adjustmentForm.patchValue({
							au_profileimage: this.invoiceDetails.au_profileimage
								? this.invoiceDetails.au_profileimage
								: this.defaultsrc,
						});
					}

					this.defaultsrc =
						this.invoiceDetails.au_profileimage !== ''
							? this.invoiceDetails.au_profileimage
							: this.defaultsrc;

				}
			}
		});
	}
	editConfirm() { }
	printReceipt(rpt_id) {
		console.log('this.data', this.data);
		this.feeService.printReceipt({ receipt_id: [rpt_id] }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'success');
				const length = result.data.split('/').length;
				saveAs(result.data, result.data.split('/')[length - 1]);
				window.open(result.data, '_blank');
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});

	}

	showStructureDetail(element) {
		console.log(element);
		this.DETAIL_ELEMENT_DATA = [];
		this.selectedRowItem = element.action.group_detail;
		var i=0;
		this.selectedRowItem.forEach(item => {
			const element = {
				srno: ++i,
				feehead: item.group_detail ? '-' : item.invg_fh_name,
				fs_name: item.fs_name ? item.fs_name : '',
				feedue: Number(item.invg_fh_amount),
				concession: Number(item.invg_fcc_amount),
				adjustment: Number(item.invg_adj_amount),
				netpay: Number(item.invg_fh_amount) - Number(item.invg_fcc_amount) - (Number(item.invg_adj_amount) ? Number(item.invg_adj_amount) : 0),
				invg_id: item.invg_id,
				grouped_data: item.group_detail ? true : false,
				action:item
			};
			
			
			// this.invoiceTotal += element.netpay;
			console.log('item', item);
			console.log('this.invoiceTotal',this.invoiceTotal);
			this.DETAIL_ELEMENT_DATA.push(element);
		});
		this.detaildataSource = new MatTableDataSource<ReceiptDetails>(this.DETAIL_ELEMENT_DATA);
		console.log('this.detaildatasource', this.detaildataSource);
		// this.detaildataSource = element.action.group_detail
	}

}
