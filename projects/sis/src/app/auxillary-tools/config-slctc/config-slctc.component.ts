import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonAPIService, SisService } from '../../_services/index';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ViewSlctcPrintComponent } from './view-slctc-print/view-slctc-print.component';
import { saveAs } from 'file-saver';
import { DatePipe } from '@angular/common';
@Component({
	selector: 'app-config-slctc',
	templateUrl: './config-slctc.component.html',
	styleUrls: ['./config-slctc.component.scss',]
})
export class ConfigSlctcComponent implements OnInit {
	printmechanism = true;
	configEditorForm = false;
	printTransferCertificate = false;
	req_date2: any;
	tc_id: any;
	prefetchArray: any[] = [];
	formGroupArray: any[] = [];
	customArray: any[] = [];
	printSettings: any = {};
	ffIdArray: any[] = [];
	ackFlag: any = '0';
	valueArray: any[] = [];
	dateform: FormGroup;
	dialogRef: MatDialogRef<ViewSlctcPrintComponent>;
	finalArray: any[] = [];
	req_date: any;
	constructor(
		private commonService: CommonAPIService,
		private router: Router,
		private route: ActivatedRoute,
		private sisService: SisService,
		private fbuild: FormBuilder,
		private dialog: MatDialog,
		private _location: Location) { }

	ngOnInit() {
		this.buildForm();
		this.route.queryParams.subscribe((result: any) => {
			if (result) {
				this.tc_id = result.tc_id;
				this.getSlcTcPrintSetting(this.tc_id);
			}
		});
	}

	backClicked() {
		this._location.back();
	  }

	getConfigForm() {
		this.printmechanism = false;
		this.router.navigateByUrl('/school/setup/slc-tc-printing');

	}
	buildForm() {
		this.dateform = this.fbuild.group({
			pdate: new Date(),
			adate: ''
		});
	}

	print() {
		for (const item of this.formGroupArray) {
			this.valueArray.push({ usps_values: item.value.cust_val });
		}
		for (const item of this.ffIdArray) {
			this.finalArray.push({ usps_sff_id: item.usps_sff_id, usps_values: '' });
		}
		let i = 0;
		for (const item of this.valueArray) {
			this.finalArray[i].usps_values = item.usps_values;
			i++;
		}
		const customJSON = {
			preview_flag: '0',
			usps_tc_id: this.tc_id,
			usts_name: 'slctc',
			usts_id: '1',
			configRelation: this.finalArray,
			ackFlag: this.ackFlag,
			pdate: new DatePipe('en-in').transform(this.dateform.value.pdate, 'yyyy-MM-dd'),
			adate: new DatePipe('en-in').transform(this.dateform.value.adate, 'yyyy-MM-dd'),
		};
		this.sisService.insertSlcTcPrintSetting(customJSON).subscribe((result: any) => {
			console.log("insertSLC status", result.status);
			if (result.status === 'ok') {
				//   this.router.navigate(['../../auxilliarytool/slc'],
				// { queryParams: { issue_status: true}, relativeTo: this.route });
				//   const url = result.data;
				//   window.open(url, 'Download');
				// console.log("insertSLC", result.data);
				if (result.data) {
					const length = result.data.split('/').length;
					saveAs(result.data, result.data.split('/')[length - 1]);
					this.router.navigate(['../../auxilliarytool/slc'],
						{ queryParams: { issue_status: true }, relativeTo: this.route });
				}

			}
		});
	}

	save() {
		for (const item of this.formGroupArray) {
			this.valueArray.push({ usps_values: item.value.cust_val });
		}
		for (const item of this.ffIdArray) {
			this.finalArray.push({ usps_sff_id: item.usps_sff_id, usps_values: '' });
		}
		let i = 0;
		for (const item of this.valueArray) {
			this.finalArray[i].usps_values = item.usps_values;
			i++;
		}
		const customJSON = {
			preview_flag: '0',
			usps_tc_id: this.tc_id,
			usts_name: 'slctc',
			usts_id: '1',
			configRelation: this.finalArray,
			ackFlag: this.ackFlag,
			pdate: new DatePipe('en-in').transform(this.dateform.value.pdate, 'yyyy-MM-dd'),
			adate: new DatePipe('en-in').transform(this.dateform.value.adate, 'yyyy-MM-dd'),
		};
		this.sisService.savePrintProgress(customJSON).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.commonService.showSuccessErrorMessage("Data Saved", 'success');
			}else{
				this.commonService.showSuccessErrorMessage('Sorry Error saving data', 'error');
			}
		});
	}

	printTranferCertificate() {
		this.printmechanism = false;
		this.configEditorForm = false;
		this.printTransferCertificate = true;
	}
	getSlcTcPrintSetting(tc_id) {
		this.sisService.getSlcTcPrintSetting({ tc_id: tc_id }).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.printSettings = result.data[0];
				this.dateform.patchValue({
					adate: new DatePipe('en-in').transform(new Date(this.printSettings['tc_request_date']), 'yyyy-MM-dd'),
					pdate: new DatePipe('en-in').transform(new Date(this.printSettings['tc_approval_date']), 'yyyy-MM-dd')
				});
				this.req_date2 = this.dateform.value.adate
				const subjArr: any[] = result.data;
				console.log(this.printSettings);
				let subName = '';
				this.sisService.getSlcTcFormConfig({ tmap_usts_id: '1' }).subscribe((result2: any) => {
					if (result2.status === 'ok') {
						let customPrintSetting = this.printSettings['custom'] ? this.printSettings['custom'] : []
						Object.keys(this.printSettings).forEach(key => {
							for (const item of result2.data) {
								if (item.sff_field_tag === key && item.sff_field_type === 'prefetch') {
									if (key === 'upd_nationality') {
										this.printSettings[key] = 'Indian';
									}
									if (key === 'ess_sub_id') {
										for (const sub of subjArr) {
											subName = subName + sub.subject_name + ', ';
										}
										subName = subName.substring(0, subName.length - 1);
										this.printSettings[key] = subName;
									}
									this.prefetchArray.push({
										label: item.sff_label,
										value: this.printSettings[key]
									});
								}
							}
						});
						for (const item of result2.data) {
							if (item.sff_field_type === 'custom') {
								if (Number(item.sff_id) !== 16 && Number(item.sff_id) !== 18) {
									const eachprintSetting = customPrintSetting.find(e => e.sff_field_tag == item.sff_field_tag);
									this.customArray.push({
										label: item.sff_label,
										controlname : item.sff_field_tag,
										controlvalue : eachprintSetting  && eachprintSetting.usps_sff_value ? eachprintSetting.usps_sff_value : ''
									});
									this.ffIdArray.push({ usps_sff_id: item.sff_id });
								}
							}
						}
						console.log('this.customArray--',this.customArray)
						let i = 0;
						for (const item of this.customArray) {
							this.formGroupArray[i] = this.fbuild.group({
								cust_val: item.controlvalue
							});
							i++;
						}
					}
				});
			}
		});
	}
	openDialog() {
		this.valueArray = [];
		this.finalArray = [];
		for (const item of this.formGroupArray) {
			this.valueArray.push({ usps_values: item.value.cust_val });
		}
		for (const item of this.ffIdArray) {
			this.finalArray.push({ usps_sff_id: item.usps_sff_id, usps_values: '' });
		}
		let i = 0;
		for (const item of this.valueArray) {
			this.finalArray[i].usps_values = item.usps_values;
			i++;
		}
		const customJSON = {
			preview_flag: '1',
			usps_tc_id: this.tc_id,
			usts_name: 'slctc',
			usts_id: '1',
			configRelation: this.finalArray,
			pdate: new DatePipe('en-in').transform(this.dateform.value.pdate, 'yyyy-MM-dd'),
			adate: new DatePipe('en-in').transform(this.dateform.value.adate, 'yyyy-MM-dd'),
		};
		this.dialogRef = this.dialog.open(ViewSlctcPrintComponent, {
			data: {
				customJSON: customJSON
			},
			'height': '100vh',
			'width': '100vh'
		});
	}
	checkAck($event) {
		if ($event.checked) {
			this.ackFlag = '1';
		} else {
			this.ackFlag = '0';
		}
	}
}
