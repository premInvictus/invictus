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
export class SystemInfoComponent implements OnInit, AfterViewInit {

	@ViewChild('deleteModal') deleteModal;
	@ViewChild('paginator') paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	confirmValidParentMatcher = new ConfirmValidParentMatcher();
	deleteMessage: any = 'Are You Sure you want to Delete...?';
	formGroupArray: any[] = [];	
	dptFormGroupArray: any[] = [];
	configValue: any;
	vaccinationArray: any[] = [];
	departmentArray: any[] = [];
	configFlag = false;
	updateFlag = false;	
	settings: any;
	constructor(private fbuild: FormBuilder,
		private commonService: CommonAPIService,
		private sisService: SisService,
		private erpCommonService: ErpCommonService) { }

	ngOnInit() {
		this.buildForm();
		this.getDepartment();
	}

	ngAfterViewInit() {
	}

	buildForm() {
		this.formGroupArray = [{
			formGroup: this.fbuild.group({
				dept_id: '',
				leave_credit_count: ''
			})
		}];
	}

	getDepartment() {
		this.sisService.getDepartment({}).subscribe((result: any) => {
			if (result && result.status == 'ok') {
				this.departmentArray = result.data;

				for(let i=0; i<this.departmentArray.length;i++) {
					this.dptFormGroupArray.push({
						formGroup: this.fbuild.group({
							dpt_id: this.departmentArray[i]['dept_id'],
							leave_credit_count: ''
						})
					});
				}

			} else {
				this.departmentArray = [];
			}

		});
	}

	getGlobalSetting(that) {
		this.erpCommonService.getGlobalSetting({"gs_alias":"employee_monthly_leave_credit"}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.settings = result.data;
				for (let i=0; i< this.settings.length;i++) {
					if (this.settings[i]['gs_alias'] === 'employee_monthly_leave_credit') {
						const settingData = JSON.parse(this.settings[i]['gs_value']);

						for(let j=0; j<settingData.length;j++) {
							this.dptFormGroupArray[j].formGroup.patchValue({
								'dpt_id': settingData[j]['dpt_id'],
								'leave_credit_count': settingData[j]['leave_credit_count']							
							});
						}
						
					}
				}
				
				
			}
		});
	}

	updateGlobalSetting() {
		let temp_arr = [];
		for (var i=0; i<this.departmentArray.length;i++) {
			temp_arr.push(this.dptFormGroupArray[i].formGroup.value);
		}
		
		let inputJson = {'employee_monthly_leave_credit' : JSON.stringify(temp_arr)};
		if (this.formGroupArray[this.configValue-1].formGroup.valid) {
			//let inputJson = {'library_user_setting' : JSON.stringify(this.formGroupArray[this.configValue-1].formGroup.value)};
			this.erpCommonService.updateGlobalSetting(inputJson).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.commonService.showSuccessErrorMessage(result.message, result.status);
				} else {
					this.commonService.showSuccessErrorMessage(result.message, result.status);
				}
			});
		} else {
			this.commonService.showSuccessErrorMessage('Please Fill All Required Fields', 'error');
		}
		
	}

	resetForm() {
		this.formGroupArray[this.configValue-1].formGroup.reset();
	}

	loadConfiguration($event) {
		this.configFlag = false;
		this.updateFlag = false;
		this.configValue = $event.value;
		if (Number(this.configValue) === 1) {
			this.getGlobalSetting(this);
			this.configFlag = true;
		} 
	}
	deleteConfirm($event){

	}
	deleteCancel(){
		
	}

}
