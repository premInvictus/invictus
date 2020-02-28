import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroupDirective, FormControl, NgForm, FormGroup } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSort, ErrorStateMatcher } from '@angular/material';
import { ConfirmValidParentMatcher } from '../../ConfirmValidParentMatcher';
import { ErpCommonService, CommonAPIService } from 'src/app/_services';
import { SisService } from '../../_services/index';
@Component({
	selector: 'app-setup',
	templateUrl: './setup.component.html',
	styleUrls: ['./setup.component.css']
})
export class SetupComponent implements OnInit {

	currentGsetup: string;
	formFlag = false;
	settingForm: FormGroup;
	gsettingGroupArr: any[] = [];
	gsettingArr: any[] = [];
	configFlag = false;
	notifConfigArray: any[] = [];
	configValue: any;
	disabledApiButton = false;
	constructor(private fbuild: FormBuilder,
		private commonService: CommonAPIService,
		private sisService: SisService,
		private erpCommonService: ErpCommonService) { }

	ngOnInit() {
		this.getGlobalSettingGroup();
	}
	getGlobalSettingGroup() {
		this.gsettingGroupArr = [];
		this.sisService.getGlobalSettingGroup({}).subscribe((res: any) => {
			if(res && res.status === 'ok') {
				this.gsettingGroupArr = res.data;
			}
		});
	}
	getGlobalSetting(value) {
		this.currentGsetup = value;
		this.gsettingArr = [];
		this.sisService.getGlobalSetting({gs_group: value}).subscribe((res: any) => {
			if(res && res.status === 'ok') {
				this.gsettingArr = res.data;
				if(this.gsettingArr.length > 0) {
					const temp: any = {};
					this.gsettingArr.forEach(element => {
						temp[element.gs_alias] = element.gs_value
					});
					this.settingForm = this.fbuild.group(temp);
				}
				this.formFlag = true;
			}
			console.log(this.settingForm);
		});
	}
	updateGlobalSetting() {
		this.disabledApiButton = true;
		let inputJson = { 'school_push_notif': JSON.stringify(this.notifConfigArray) };
		this.erpCommonService.updateGlobalSetting(inputJson).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.disabledApiButton = false;
				this.commonService.showSuccessErrorMessage(result.message, result.status);
				this.getGlobalSetting(this.currentGsetup);
			} else {
				this.disabledApiButton = false;
				this.commonService.showSuccessErrorMessage(result.message, result.status);
			}
		});
	}
}
