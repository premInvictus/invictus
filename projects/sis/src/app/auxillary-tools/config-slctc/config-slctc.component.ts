import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonAPIService, SisService } from '../../_services/index';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ViewSlctcPrintComponent } from './view-slctc-print/view-slctc-print.component';
import { saveAs } from 'file-saver';
@Component({
	selector: 'app-config-slctc',
	templateUrl: './config-slctc.component.html',
	styleUrls: ['./config-slctc.component.scss', ]
})
export class ConfigSlctcComponent implements OnInit {
	printmechanism = true;
	configEditorForm = false;
	printTransferCertificate = false;
	tc_id: any;
	prefetchArray: any[] = [];
	formGroupArray: any[] = [];
	customArray: any[] = [];
	printSettings: any = {};
	ffIdArray: any[] = [];
	valueArray: any[] = [];
	dialogRef: MatDialogRef<ViewSlctcPrintComponent>;
	finalArray: any[] = [];
	constructor(private router: Router,
		private route: ActivatedRoute,
		private sisService: SisService,
		private fbuild: FormBuilder,
		private dialog: MatDialog) { }

	ngOnInit() {
		this.route.queryParams.subscribe((result: any) => {
			if (result) {
				this.tc_id = result.tc_id;
				this.getSlcTcPrintSetting(this.tc_id);
			}
		});
	}

	getConfigForm() {
		this.printmechanism = false;
		this.router.navigateByUrl('/school/setup/slc-tc-printing');

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
			configRelation: this.finalArray
		};
		this.sisService.insertSlcTcPrintSetting(customJSON).subscribe((result: any) => {
			if (result.status === 'ok') {
				//   this.router.navigate(['../../auxilliarytool/slc'],
				// { queryParams: { issue_status: true}, relativeTo: this.route });
				//   const url = result.data;
				//   window.open(url, 'Download');
				if (result.data) {
					const length = result.data.split('/').length;
					saveAs(result.data, result.data.split('/')[length - 1]);
				}

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
				this.sisService.getSlcTcFormConfig({ tmap_usts_id: '1' }).subscribe((result2: any) => {
					if (result2.status === 'ok') {
						Object.keys(this.printSettings).forEach(key => {
							for (const item of result2.data) {
								if (item.sff_field_tag === key && item.sff_field_type === 'prefetch') {
									if (key === 'upd_nationality') {
										this.printSettings[key] = 'Indian';
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
								this.customArray.push({
									label: item.sff_label
								});
								this.ffIdArray.push({ usps_sff_id: item.sff_id });
							}
						}
						let i = 0;
						for (const item of this.customArray) {
							this.formGroupArray[i] = this.fbuild.group({
								cust_val: ''
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
			configRelation: this.finalArray
		};
		this.dialogRef = this.dialog.open(ViewSlctcPrintComponent, {
			data: {
				customJSON: customJSON
			},
			'height': '100vh',
			'width': '100vh'
		});
	}
}
