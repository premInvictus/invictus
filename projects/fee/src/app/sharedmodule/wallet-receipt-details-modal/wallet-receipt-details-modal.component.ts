import { Component, OnInit, EventEmitter, ViewChild, Inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FeeService, CommonAPIService,SisService } from '../../_services/index';
import { Element } from './receipt-details.model';

import { saveAs } from 'file-saver';
@Component({
	selector: 'app-wallet-receipt-details-modal',
	templateUrl: './wallet-receipt-details-modal.component.html',
	styleUrls: ['./wallet-receipt-details-modal.component.css']
})
export class WalletReceiptDetailsModalComponent implements OnInit {
	@ViewChild('deleteModal') deleteModal;
	@ViewChild('editReference') editReference;
	ELEMENT_DATA: Element[] = [];
	displayedColumns: string[] = ['srno', 'w_transaction_date', 'w_amount', 'w_amount_type'];
	dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
	selection = new SelectionModel<Element>(true, []);
	invoiceBifurcationArray: any[] = [];
	invoiceDetails: any;
	studentdetails:any;
	invoiceTotal = 0;
	adjRemark: string;
	checkChangedFieldsArray = [];
	class_name: any;
	section_name: any;
	class_sec: any;
	defaultsrc = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/other.png';
	gender: any;
	balance: number;
	parentinfo:any;
	constructor(
		public dialogRef: MatDialogRef<WalletReceiptDetailsModalComponent>,
		@Inject(MAT_DIALOG_DATA) public data,
		private feeService: FeeService,
		private sisService: SisService,
		private fb: FormBuilder,
		public commonAPIService: CommonAPIService
	) { }

	ngOnInit() {
		this.getReceiptBifurcation(this.data);
	}
	getStudentInformation(au_login_id) {
		this.sisService.getStudentInformation({ au_login_id: au_login_id, au_status: '1' })
		.subscribe((result: any) => {
			if (result && result.status === 'ok') {
				if (result && result.data && result.data[0]) {
          this.studentdetails = result.data[0];
          console.log('studentdetails',this.studentdetails);
					this.parentinfo=this.studentdetails.parentinfo[0] ? this.studentdetails.parentinfo[0] : {};
					this.gender = this.studentdetails.au_gender;
					if (this.gender === 'M') {
						this.defaultsrc = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/man.png';
					} else if (this.gender === 'F') {
						this.defaultsrc = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/girl.png';
					} else {
						this.defaultsrc = 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/other.png';
					}
					this.class_name = this.studentdetails.class_name;
					this.section_name = this.studentdetails.sec_name;
					if (this.section_name !== ' ') {
						this.class_sec = this.class_name + ' - ' + this.section_name;
					} else {
						this.class_sec = this.class_name;
          }
          if(this.studentdetails.au_process_type == 4){
            this.studentdetails['process_name'] = 'A';
            this.studentdetails['au_admission_no'] = this.studentdetails.em_admission_no;
          } else if(this.studentdetails.au_process_type == 3){
            this.studentdetails['process_name'] = 'P';
            this.studentdetails['au_admission_no'] = this.studentdetails.em_provisional_admission_no;
          }
				}
			}
		});
	}
	
	openDeleteDialog = (data) => this.deleteModal.openModal(data);
	closemodal(): void {
		this.dialogRef.close();
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
	invoiceDetialsTable(item) {
		this.ELEMENT_DATA = [];
		this.invoiceTotal = 0;
		const element = {
			srno: 1,
			w_amount: Number(item.w_amount),
			w_transaction_date:item.w_transaction_date,
			w_amount_type:item.w_amount_type
		};
		this.invoiceTotal = item.w_amount;
		this.ELEMENT_DATA.push(element);
		this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
	}
	getReceiptBifurcation(data) {
		console.log('data--', data);
		this.invoiceBifurcationArray = [];
		let recieptJSON = {};
		recieptJSON = { w_rpt_no: this.data.rpt_id };
		this.feeService.getWallets(recieptJSON).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				if (result.data.length > 0) {
					this.invoiceDetails = result.data[0];
					this.getStudentInformation(this.data.admission_id);
					this.invoiceDetialsTable(this.invoiceDetails)
				}
			}
		});
	}
	printReceipt(rpt_id) {
		console.log('this.data', this.data);
		this.feeService.printWalletReceipt({ w_rpt_no: rpt_id}).subscribe((result: any) => {
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

