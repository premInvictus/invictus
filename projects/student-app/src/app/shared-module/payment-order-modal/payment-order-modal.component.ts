import { Component, OnInit, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';

@Component({
  selector: 'app-payment-order-modal',
  templateUrl: './payment-order-modal.component.html',
  styleUrls: ['./payment-order-modal.component.css']
})
export class PaymentOrderModalComponent implements OnInit {
	inputData: any;
	@Input() orderMessage;
	@Output() orderOk = new EventEmitter<any>();
	@Output() orderCancel = new EventEmitter<any>();
	dialogRef: MatDialogRef<PaymentOrderModalComponent>;
	@ViewChild('paymentOrderModel') paymentOrderModel;
	paytmResult: any;
	paytmResponsHtml = '';
	postURL = '';
	constructor(private dialog: MatDialog) { }

	ngOnInit() {
	}
	openModal(data) {
		console.log('data', data);
		const transactionUrl = 'https://securegw-stage.paytm.in/theia/processTransaction';
		this.postURL = transactionUrl;
		if (data.html) {
			this.paytmResult = data.responseData;
			this.paytmResponsHtml = data.html;
		} else {
			this.inputData = data;
			this.dialogRef = this.dialog.open(this.paymentOrderModel, {
				'height': '30vh',
				position: {
					'top': '20%'
				}
			});
		}
		
	}
	makeOrder() {
		this.orderOk.emit(this.inputData);
	}

	cancel() {
		this.orderCancel.emit(this.inputData);
	}
	closeDialog() {
		this.dialogRef.close();
	}
}
