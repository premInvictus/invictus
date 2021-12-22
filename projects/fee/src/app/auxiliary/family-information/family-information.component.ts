import { Component, OnInit } from '@angular/core';
import { FeeService, CommonAPIService, SisService } from '../../_services';
import { Router, ActivatedRoute } from '@angular/router';
import { saveAs } from 'file-saver';
@Component({
	selector: 'app-family-information',
	templateUrl: './family-information.component.html',
	styleUrls: ['./family-information.component.css']
})
export class FamilyInformationComponent implements OnInit {
	familyOutstandingArr: any[] = [];
	childDataArr: any[] = [];
	netOutstanding = 0;
	printFamilyArr: any;
	constructor(
		private route: ActivatedRoute,
		private router: Router,
		public feeService: FeeService,
		public sisService: SisService,
		private common: CommonAPIService, ) { }

	ngOnInit() {

		const familyNumber = this.common.getFamilyInformation();
		if (familyNumber) {
			console.log('family number', familyNumber);
			this.getFamilyOutstandingDetail(familyNumber);
		} else {
			this.router.navigate(['../familywise-fee-receipt'], { relativeTo: this.route });
		}
	}
	getFamilyOutstandingDetail(familyNumber) {
		this.familyOutstandingArr = [];
		this.childDataArr = [];
		this.feeService.getFamilyOutstandingDetail({ fam_entry_number: familyNumber }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.familyOutstandingArr = result.data;
				this.netOutstanding = result.data['family_total_outstanding_amt'];
				for (let i = 0; i < result.data.childData.length; i++) {
					if (result.data.childData[i] && result.data.childData[i]['invoice_data']) {
						for (let j = 0; j < result.data.childData[i]['invoice_data'].length - 1; j++) {
							result.data.childData[i]['invoice_data'][j]['checked'] = true;
						}
					}
				}

				this.childDataArr = result.data.childData;
			}
		});
	}

	payFamilyOutstanding(familyEntryNumber) {
		console.log('familyEntryNumber', familyEntryNumber);
		console.log('this.childDataArr', this.childDataArr);
		const selectedChildInvoiceArr = [];
		const selectedChildDataArr = [];
		const finalArr = {
			'epd_contact_no': this.familyOutstandingArr['epd_contact_no'],
			'epd_id': this.familyOutstandingArr['epd_id'],
			'epd_parent_honorific': this.familyOutstandingArr['epd_parent_honorific'],
			'epd_parent_name': this.familyOutstandingArr['epd_parent_name'],
			'epd_profile_image': this.familyOutstandingArr['epd_profile_image'],
			'epd_status': this.familyOutstandingArr['epd_status'],
			'fam_created_date': this.familyOutstandingArr['fam_created_date'],
			'fam_entry_number': this.familyOutstandingArr['fam_entry_number'],
			'fam_family_name': this.familyOutstandingArr['fam_family_name'],
			'family_total_outstanding_amt': this.familyOutstandingArr['family_total_outstanding_amt']
		};
		for (let i = 0; i < this.childDataArr.length; i++) {
			const temp_arr = [];
			const childData = {
				'au_admission_no': this.childDataArr[i]['au_admission_no'],
				'au_full_name': this.childDataArr[i]['au_full_name'],
				'au_login_id': this.childDataArr[i]['au_login_id'],
				'class_id': this.childDataArr[i]['class_id'],
				'class_name': this.childDataArr[i]['class_name'],
				'fam_active_member': this.childDataArr[i]['fam_active_member'],
				'fam_active_parent_id': this.childDataArr[i]['fam_active_parent_id'],
				'fam_declaration_doc_url': this.childDataArr[i]['fam_declaration_doc_url'],
				'fam_entry_number': this.childDataArr[i]['fam_entry_number'],
				'fam_family_name': this.childDataArr[i]['fam_family_name'],
				'fam_member_enrol_no': this.childDataArr[i]['fam_member_enrol_no'],
				'fam_member_process_type': this.childDataArr[i]['fam_member_process_type'],
				'fam_status': this.childDataArr[i]['fam_status'],
				'fcg_name': this.childDataArr[i]['fcg_name'],
				'fo_name': this.childDataArr[i]['fo_name'],
				'fs_id': this.childDataArr[i]['fs_id'],
				'fs_name': this.childDataArr[i]['fs_name'],

			};
			if (this.childDataArr[i] && this.childDataArr[i]['invoice_data'] && this.childDataArr[i]['invoice_data'].length > 1) {
				for (let j = 0; j < this.childDataArr[i]['invoice_data'].length - 1; j++) {
					if (this.childDataArr[i]['invoice_data'][j]['checked']) {
						temp_arr.push(this.childDataArr[i]['invoice_data'][j]);
						selectedChildDataArr[i] = childData;
						selectedChildDataArr[i]['invoice_data'] = temp_arr;
					}
				}
			}
		}

		finalArr['childData'] = selectedChildDataArr;
		console.log('finalArr', finalArr);
		// this.common.setFamilyInformation(familyEntryNumber);
		this.common.setSelectedChildData(finalArr);
		this.router.navigate(['../family-transaction-entry'], { relativeTo: this.route });
	}

	setInvoiceCheck(checkedItem) {
		this.familyOutstandingArr['family_total_outstanding_amt'] = 0;
		for (let i = 0; i < this.childDataArr.length; i++) {
			if (this.childDataArr[i] && this.childDataArr[i]['invoice_data']) {
				for (let j = 0; j < this.childDataArr[i]['invoice_data'].length - 1; j++) {
					// tslint:disable-next-line: max-line-length
					if (this.childDataArr[i]['invoice_data'][j]['inv_invoice_no'].toString() === checkedItem.toString()) {
						if (this.childDataArr[i]['invoice_data'][j]['checked']) {
							this.childDataArr[i]['invoice_data'][j]['checked'] = false;
						} else {
							this.childDataArr[i]['invoice_data'][j]['checked'] = true;
						}

					}
					// tslint:disable-next-line: max-line-length
					if (this.childDataArr[i]['invoice_data'][j]['inv_invoice_no'].toString() === checkedItem.toString()) {
						// tslint:disable-next-line: max-line-length
						if (this.childDataArr[i]['invoice_data'][j]['checked']) {
							this.childDataArr[i]['outstanding_amt'] = this.childDataArr[i]['outstanding_amt'] + Number(this.childDataArr[i]['invoice_data'][j]['flgr_balance']);
						} else {
							this.childDataArr[i]['outstanding_amt'] = this.childDataArr[i]['outstanding_amt'] - Number(this.childDataArr[i]['invoice_data'][j]['flgr_balance']);
						}
					}
				}

				this.familyOutstandingArr['family_total_outstanding_amt'] = this.familyOutstandingArr['family_total_outstanding_amt'] + this.childDataArr[i]['outstanding_amt'];
			}
		}
	}

	moveToFamilyReceipt() {
		this.router.navigate(['../familywise-fee-receipt'], { relativeTo: this.route });
	}

	printFamilyInvoice(item) {
		this.printFamilyArr = [];
		this.printFamilyArr.push(item.fam_entry_number);
		const inputJson = {'family_entry_numbers' : this.printFamilyArr, 'with_summary' : true};
		this.feeService.printFamilyInvoice(inputJson).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				console.log('result', result.data);
				//this.familyDetailArr = result.data;
				const length = result.data.split('/').length;
				saveAs(result.data, result.data.split('/')[length - 1]);
				window.open(result.data, '_blank');
			}
		});
	}

}
