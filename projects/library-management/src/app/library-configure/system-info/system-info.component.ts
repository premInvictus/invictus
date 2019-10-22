import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroupDirective, FormControl, NgForm, FormGroup } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSort, ErrorStateMatcher } from '@angular/material';
import { ConfigElement } from './system-info.model';
import { ConfirmValidParentMatcher } from '../../ConfirmValidParentMatcher';
import { ErpCommonService, CommonAPIService } from 'src/app/_services';
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
	configValue: any;
	vaccinationArray: any[] = [];
	configFlag = false;
	updateFlag = false;	
	settings: any;
	constructor(private fbuild: FormBuilder,
		private commonService: CommonAPIService,
		private erpCommonService: ErpCommonService) { }

	ngOnInit() {
		this.buildForm();
	}

	ngAfterViewInit() {
	}

	buildForm() {
		this.formGroupArray = [{
			formGroup: this.fbuild.group({
				book_issued_limit_staff: '',
				book_return_days_staff: '',
				book_request_for_staff:'',
				book_issued_limit_teacher: '',
				book_return_days_teacher: '',
				book_request_for_teacher: '',
				book_issued_limit_student: '',
				book_return_days_student: '',
				book_request_for_student: '',
				class_book_issue_for_student:''
			})
		}];
	}

	getGlobalSetting(that) {
		this.erpCommonService.getGlobalSetting({"gs_alias":"library_user_setting"}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.settings = result.data;
				for (let i=0; i< this.settings.length;i++) {
					if (this.settings[i]['gs_alias'] === 'library_user_setting') {
						const settingData = JSON.parse(this.settings[i]['gs_value']);
						console.log('settingData', settingData);
						this.formGroupArray[this.configValue-1].formGroup.patchValue({
							'book_issued_limit_staff': settingData['book_issued_limit_staff'],
							'book_return_days_staff': settingData['book_return_days_staff'],
							'book_request_for_staff': settingData['book_request_for_staff'],
							'book_issued_limit_teacher': settingData['book_issued_limit_teacher'],
							'book_return_days_teacher': settingData['book_return_days_teacher'],
							'book_request_for_teacher': settingData['book_request_for_teacher'],
							'book_issued_limit_student': settingData['book_issued_limit_student'],
							'book_return_days_student': settingData['book_return_days_student'],
							'book_request_for_student': settingData['book_request_for_student'],
							'class_book_issue_for_student' : settingData['class_book_issue_for_student'],
						});
					}
				}
				
				
			}
		});
	}

	updateGlobalSetting() {
		if (this.formGroupArray[this.configValue-1].formGroup.valid) {
			let inputJson = {'library_user_setting' : JSON.stringify(this.formGroupArray[this.configValue-1].formGroup.value)};
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
