import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SisService, CommonAPIService } from '../../_services/index';
import { saveAs } from 'file-saver';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
@Component({
	selector: 'app-voucher-entry',
	templateUrl: './voucher-entry.component.html',
	styleUrls: ['./voucher-entry.component.scss']
})
export class VoucherEntryComponent implements OnInit {
	paramform: FormGroup;
	voucherEntryArray:any[]=[];
	voucherFormGroupArray: any[] = [];
	constructor(
		private fbuild: FormBuilder,
		private commonAPIService: CommonAPIService
	) { }


	ngOnInit() {
		this.buildForm();
	}

	buildForm() {
		this.paramform = this.fbuild.group({
			vc_account_type_id: '',
			vc_particulars: '',
			vc_debit: '',
			vc_credit: ''
		});
		this.voucherFormGroupArray.push(this.paramform);
		console.log(this.voucherFormGroupArray);
	}

	addVoucher() {
		this.paramform = this.fbuild.group({
			vc_account_type_id: '',
			vc_particulars: '',
			vc_debit: '',
			vc_credit: ''
		});
		this.voucherFormGroupArray.push(this.paramform);
	}

	saveAsDraft() {

	}

	saveAndPublish() {

	}

	cancel() {

	}
}
