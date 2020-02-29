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
	constructor(private fbuild: FormBuilder,
		private commonService: CommonAPIService,
		private sisService: SisService,
		private erpCommonService: ErpCommonService) { }

	ngOnInit() {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.getGlobalSettingGroup();
		this.getClass();
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
			return element.gs_value && element.gs_value !== '' ? JSON.parse(element.gs_value) : '';
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
			console.log(this.settingForm);
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
}
