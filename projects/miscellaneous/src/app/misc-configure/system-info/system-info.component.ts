import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroupDirective, FormControl, NgForm, FormGroup } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSort, ErrorStateMatcher } from '@angular/material';
import { ConfigElement } from './system-info.model';
import { ConfirmValidParentMatcher } from '../../ConfirmValidParentMatcher';
import { ErpCommonService, CommonAPIService } from 'src/app/_services';
import { SisService } from '../../_services/index';
@Component({
	selector: 'app-system-info',
	templateUrl: './system-info.component.html',
	styleUrls: ['./system-info.component.scss']
})
export class SystemInfoComponent implements OnInit {
	configFlag = false;
	notifConfigArray: any[] = [];
	configValue: any;
	disabledApiButton = false;
	constructor(private fbuild: FormBuilder,
		private commonService: CommonAPIService,
		private sisService: SisService,
		private erpCommonService: ErpCommonService) { }

	ngOnInit() {
	}
	getGlobalSettings() {
		this.sisService.getGlobalSetting({
			gs_alias: 'school_push_notif'
		}).subscribe((res: any) => {
			this.notifConfigArray = [];
			this.notifConfigArray = JSON.parse(res.data[0]['gs_value']);
		});
	}
	loadConfiguration($event) {
		this.configFlag = false;
		this.configValue = $event.value;
		if (Number(this.configValue) === 1) {
			this.getGlobalSettings();
			this.configFlag = true;
		}

	}
	checkSubMenuCheckLevel(item) {
		let count = 0;
		if (item.sub_module && item.sub_module.length > 0) {
			if (item.sub_module.length > 1) {
				for (const sm of item.sub_module) {
					if (sm['status'] === "true") {
						count++;
					}
				}
			}
			if (count > 0 && count < item.sub_module.length) {
				return true;
			}
		} else {
			return false;
		}
	}
	checkMenu(item) {
		let count = 0;
		if (item.sub_module && item.sub_module.length > 0) {
			for (const sm of item.sub_module) {
				if (sm['status'] === "true") {
					count++;
				}
			}
			if (count > 0 && count == item.sub_module.length) {
				return true;
			}
		} else {
			if (item.status === 'true') {
				return true;
			} else {
				return false;
			}
		}
	}
	getSubMenuCheck(item) {
		if (item['status'] === "true") {
			return true;
		} else {
			return false;
		}
	}
	changeMenu(item, $event) {
		if (item.sub_module && item.sub_module.length > 0) {
			if ($event.checked) {
				for (const sitem of item.sub_module) {
					sitem['status'] = "true";
				}
			} else {
				for (const sitem of item.sub_module) {
					sitem['status'] = "false";
				}
			}
		} else {
			if ($event.checked) {
				item['status'] = "true";
			} else {
				item['status'] = "false";
			}
		}
	}
	changeSubMenu(item, $event) {
		if ($event.checked) {
			item['status'] = "true";
		} else {
			item['status'] = "false";
		}
	}
	updateGlobalSetting() {
		this.disabledApiButton = true;
		let inputJson = { 'school_push_notif': JSON.stringify(this.notifConfigArray) };
		this.erpCommonService.updateGlobalSetting(inputJson).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.disabledApiButton = false;
				this.commonService.showSuccessErrorMessage(result.message, result.status);
				this.getGlobalSettings();
			} else {
				this.disabledApiButton = false;
				this.commonService.showSuccessErrorMessage(result.message, result.status);
			}
		});
	}
}
