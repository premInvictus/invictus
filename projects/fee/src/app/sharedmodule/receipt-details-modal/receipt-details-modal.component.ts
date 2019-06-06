import { Component, OnInit, EventEmitter, ViewChild, Inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ReceiptDetails } from './receipt-details.model';
import { FeeService, CommonAPIService } from '../../_services/index';
import { saveAs } from 'file-saver';
@Component({
	selector: 'app-receipt-details-modal',
	templateUrl: './receipt-details-modal.component.html',
	styleUrls: ['./receipt-details-modal.component.scss']
})
export class ReceiptDetailsModalComponent implements OnInit {
	@ViewChild('deleteModal') deleteModal;
	@ViewChild('recalculateModal') recalculateModal;
	@ViewChild('editReference') editReference;
	ELEMENT_DATA: ReceiptDetails[] = [];
	displayedColumns: string[] = ['srno', 'feehead', 'feedue', 'concession', 'adjustment', 'netpay'];
	dataSource = new MatTableDataSource<ReceiptDetails>(this.ELEMENT_DATA);
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
	constructor(
		public dialogRef: MatDialogRef<ReceiptDetailsModalComponent>,
		@Inject(MAT_DIALOG_DATA) public data,
		private feeService: FeeService,
		private fb: FormBuilder,
		public commonAPIService: CommonAPIService
	) { }

	ngOnInit() {
		this.getReceiptBifurcation(this.data.invoiceNo);
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
					this.getReceiptBifurcation(this.data.invoiceNo);
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
					this.getReceiptBifurcation(this.data.invoiceNo);
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
				netpay: Number(item.invg_fh_amount) - Number(item.invg_fcc_amount)
				- (Number(item.invg_adj_amount) ? Number(item.invg_adj_amount) : 0),
				invg_id: item.invg_id
			};
			this.invoiceTotal += element.netpay;
			this.ELEMENT_DATA.push(element);
		});
		this.dataSource = new MatTableDataSource<ReceiptDetails>(this.ELEMENT_DATA);
	}
	getReceiptBifurcation(invoiceNo) {
		this.invoiceBifurcationArray = [];
		let recieptJSON = {};
		if (this.data.from) {
			recieptJSON = {inv_id : invoiceNo};
		} else {
			recieptJSON = {flgr_invoice_receipt_no: invoiceNo };
		}
		this.feeService.getReceiptBifurcation(recieptJSON).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				if (result.data.length > 0) {
					this.invoiceDetails = result.data[0];
					this.class_name = this.invoiceDetails.class_name;
					this.section_name = this.invoiceDetails.sec_name;
					if(this.section_name != ' '){
						this.class_sec = this.class_name +' - '+ this.section_name;
					}else{
						this.class_sec = this.class_name;
					}
					if (this.invoiceDetails.invoice_bifurcation.length > 0) {
						this.invoiceBifurcationArray = this.invoiceDetails.invoice_bifurcation;
						this.invoiceDetialsTable(this.invoiceDetails.invoice_bifurcation);
					}

				}
			}
		});
	}
	editConfirm() {}
	printReceipt() {
		this.feeService.printReceipt({ receipt_id: [this.data.invoiceNo] }).subscribe((result: any) => {
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

}
