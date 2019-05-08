import { Component, OnInit, EventEmitter, ViewChild, Inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { InvoiceDetails } from './invoice-details.model';
import { FeeService, CommonAPIService } from '../../_services/index';

@Component({
	selector: 'app-invoice-details-modal',
	templateUrl: './invoice-details-modal.component.html',
	styleUrls: ['./invoice-details-modal.component.scss']
})
export class InvoiceDetailsModalComponent implements OnInit {
	@ViewChild('deleteModal') deleteModal;
	@ViewChild('recalculateModal') recalculateModal;
	@ViewChild('editReference') editReference;
	ELEMENT_DATA: InvoiceDetails[] = [];
	displayedColumns: string[] = ['srno', 'feehead', 'feedue', 'concession', 'adjustment', 'netpay'];
	dataSource = new MatTableDataSource<InvoiceDetails>(this.ELEMENT_DATA);
	selection = new SelectionModel<InvoiceDetails>(true, []);
	invoiceBifurcationArray: any[] = [];
	invoiceDetails: any;
	invoiceTotal = 0;
	adjustmentForm: FormGroup;
	modificationFlag = false;
	adjRemark: string;
	checkChangedFieldsArray = [];
	constructor(
		public dialogRef: MatDialogRef<InvoiceDetailsModalComponent>,
		@Inject(MAT_DIALOG_DATA) public data,
		private feeService: FeeService,
		private fb: FormBuilder,
		private commonAPIService: CommonAPIService
	) { }

	ngOnInit() {
		console.log(this.data);
		this.getInvoiceBifurcation(this.data.invoiceNo);
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
		console.log(invg_id, $event, $event.target.value);
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
			console.log(this.checkChangedFieldsArray);
			this.invoiceBifurcationArray[invg_id_idx].invg_adj_amount = $event.target.value;
		}
		console.log(this.invoiceBifurcationArray);
		this.invoiceDetialsTable(this.invoiceBifurcationArray);
	}
	recalculateInvoice() {
		this.feeService.insertInvoice({ recalculation_flag: '1', inv_id: [this.invoiceDetails.inv_id], inv_activity: 'invoice' })
			.subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.commonAPIService.showSuccessErrorMessage(result.message, 'success');
					this.getInvoiceBifurcation(this.data.invoiceNo);
				} else {
					this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
				}
			});
	}
	cancelInvoice() {
		this.modificationFlag = false;
		this.getInvoiceBifurcation(this.invoiceDetails.inv_id);
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
			console.log('adjustment', adj);
			console.log(this.invoiceDetails);
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
	deleteInvoice() {
		this.feeService.deleteInvoice({ inv_id: [this.invoiceDetails.inv_id] })
			.subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.commonAPIService.showSuccessErrorMessage(result.message, 'success');
					this.getInvoiceBifurcation(this.data.invoiceNo);
				} else {
					this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
				}
			});
	}
	invoiceDetialsTable(arr) {
		this.ELEMENT_DATA = [];
		this.invoiceTotal = 0;
		let i = 0;
		arr.forEach(item => {
			const element = {
				srno: ++i,
				feehead: item.invg_fh_name,
				feedue: Number(item.invg_fh_amount),
				concession: Number(item.invg_fcc_amount),
				adjustment: Number(item.invg_adj_amount),
				netpay: Number(item.invg_fh_amount) - (Number(item.invg_adj_amount) ? Number(item.invg_adj_amount) : 0),
				invg_id: item.invg_id
			};
			this.invoiceTotal += element.netpay;
			this.ELEMENT_DATA.push(element);
		});
		this.dataSource = new MatTableDataSource<InvoiceDetails>(this.ELEMENT_DATA);
	}
	getInvoiceBifurcation(invoiceNo) {
		this.invoiceBifurcationArray = [];
		this.feeService.getInvoiceBifurcation({ inv_id: invoiceNo }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				console.log(result);
				if (result.data.length > 0) {
					this.invoiceDetails = result.data[0];
					if (this.invoiceDetails.invoice_bifurcation.length > 0) {
						this.invoiceBifurcationArray = this.invoiceDetails.invoice_bifurcation;
						this.invoiceDetialsTable(this.invoiceDetails.invoice_bifurcation);
					}

				}
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.data, 'error');
			}
		});
	}
	printInvoice() {

	}

}
