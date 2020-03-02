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
	currentUser: any;
	classArray: any[] = [];
	toggleArray: any[] = [
		{id:'1', name:'Yes'},
		{id:'0', name:'No'},
	];
	departmentArray: any[] = [];
	curl_call_urlArray: any[] = [];
	constructor(private fbuild: FormBuilder,
		private commonService: CommonAPIService,
		private sisService: SisService,
		private erpCommonService: ErpCommonService) { }

	ngOnInit() {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.getGlobalSettingGroup();
		this.getClass();
		this.getDepartment();
	}
	getDepartment() {
		this.sisService.getDepartment({}).subscribe((result: any) => {
			if (result && result.status == 'ok') {
				this.departmentArray = result.data;

			} else {
				this.departmentArray = [];
			}

		});
	}
	getGlobalSettingGroup() {
		this.gsettingGroupArr = [];
		this.sisService.getGlobalSettingGroup({}).subscribe((res: any) => {
			if(res && res.status === 'ok') {
				this.gsettingGroupArr = res.data;
			}
		});
	}
	getGs_value(element){
		if(element.gs_type == 'json') {
			if(element.gs_alias === 'library_user_setting') {
				const jsontemp = element.gs_value && element.gs_value !== '' ? JSON.parse(element.gs_value) : '';
				return this.fbuild.array([this.fbuild.group(jsontemp)]);
			} else if(element.gs_alias === 'employee_monthly_leave_credit') {
				const temp = element.gs_value && element.gs_value !== '' ? JSON.parse(element.gs_value) : '';
				const jsontemp = [];
				for(let i=0; i<this.departmentArray.length;i++) {
					jsontemp.push(this.fbuild.group({
						dpt_id: this.departmentArray[i]['dept_id'],
						leave_credit_count: temp[i] ? temp[i]['leave_credit_count'] : ''
					}))
					
				}
				return this.fbuild.array(jsontemp);
			} else if(element.gs_alias === 'school_push_notif') {
				this.notifConfigArray = JSON.parse(element.gs_value);
			} else if(element.gs_alias === 'curl_call_url') {
				this.curl_call_urlArray = element.gs_value && element.gs_value !== '' ? JSON.parse(element.gs_value) : [];
				const jsontemp = [];
				this.curl_call_urlArray.forEach(element => {
					jsontemp.push(this.fbuild.group({
						type: element.type,
						url: element.url
					}))
				});
				return this.fbuild.array(jsontemp);
			} else if(element.gs_alias === 'result_entry_options') {
				const temp = element.gs_value && element.gs_value !== '' ? JSON.parse(element.gs_value) : [];
				const jsontemp = [];
				temp.forEach(element => {
					jsontemp.push(this.fbuild.group({
						id: element.id,
						value: element.value
					}))
				});
				return this.fbuild.array(jsontemp);
			} else if(element.gs_alias === 'mis_report_admin') {
				const temp = element.gs_value && element.gs_value !== '' ? JSON.parse(element.gs_value) : [];
				const jsontemp = [];
				temp.forEach(element => {
					jsontemp.push(this.fbuild.group({
						name: element.name,
						email: element.email
					}))
				});
				return this.fbuild.array(jsontemp);
			}
		}
		if(element.gs_alias === 'gradecard_health_status' || element.gs_alias === 'comparative_analysis' || element.gs_alias === 'student_performance') {
			return element.gs_value && element.gs_value !== '' ? [element.gs_value.split(',')] : [''];
		} else {
		  return element.gs_value;
		} 
	}
	getGlobalSetting(value) {
		this.currentGsetup = value;
		this.gsettingArr = [];
		this.sisService.getGlobalSetting({gs_group: value,not_json: true}).subscribe((res: any) => {
			if(res && res.status === 'ok') {
				this.gsettingArr = res.data;
				if(this.gsettingArr.length > 0) {
					const temp: any = {};
					//temp[element.gs_alias] = this.getGs_value(element)
					this.gsettingArr.forEach(element => {
						element.gs_name = element.gs_name.replace(/_/g,' ');
						temp[element.gs_alias] = this.getGs_value(element)
					});
					this.settingForm = this.fbuild.group(temp);
				}
				this.formFlag = true;
			}
			//console.log(this.settingForm);
		});
	}
	updateGlobalSetting() {
		this.disabledApiButton = true;
		if (this.settingForm.value && this.settingForm.value.gradecard_health_status) {
			this.settingForm.value.gradecard_health_status = this.settingForm.value.gradecard_health_status.join(',').toString();
		}
		if (this.settingForm.value && this.settingForm.value.comparative_analysis) {
			this.settingForm.value.comparative_analysis = this.settingForm.value.comparative_analysis.join(',').toString();
		}
		if (this.settingForm.value && this.settingForm.value.student_performance) {
			this.settingForm.value.student_performance = this.settingForm.value.student_performance.join(',').toString();
		}
		if (this.settingForm.value && this.settingForm.value.library_user_setting) {
			this.settingForm.value.library_user_setting = JSON.stringify(this.settingForm.value.library_user_setting[0]);
		}
		if (this.settingForm.value && this.settingForm.value.employee_monthly_leave_credit) {
			this.settingForm.value.employee_monthly_leave_credit = JSON.stringify(this.settingForm.value.employee_monthly_leave_credit);
		}
		if (this.settingForm.value && this.settingForm.value.school_push_notif) {
			this.settingForm.value.school_push_notif = JSON.stringify(this.notifConfigArray);
		}
		if (this.settingForm.value && this.settingForm.value.curl_call_url) {
			this.settingForm.value.curl_call_url = JSON.stringify(this.settingForm.value.curl_call_url);
		}
		if (this.settingForm.value && this.settingForm.value.result_entry_options) {
			this.settingForm.value.result_entry_options = JSON.stringify(this.settingForm.value.result_entry_options);
		}
		if (this.settingForm.value && this.settingForm.value.mis_report_admin) {
			this.settingForm.value.mis_report_admin = JSON.stringify(this.settingForm.value.mis_report_admin);
		}
		this.erpCommonService.updateGlobalSetting(this.settingForm.value).subscribe((result: any) => {
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
	uploadFile($event, gs_alias) {
		const file: File = $event.target.files[0];
		const reader = new FileReader();
		reader.onloadend = (e) => {
			const fileJson = {
				fileName: file.name,
				imagebase64: reader.result
			};
			this.sisService.uploadDocuments([fileJson]).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.settingForm.get(gs_alias).patchValue(result.data[0].file_url);
				}
			});
		};
		reader.readAsDataURL(file);
	}
	getClass() {
		const classParam: any = {};
		classParam.role_id = this.currentUser.role_id;
		classParam.login_id = this.currentUser.login_id;
		this.sisService.getClass(classParam)
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.classArray = result.data;
					}
				}
			);
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
}
