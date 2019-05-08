import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { StudentFormConfigTwoService } from '../../sharedmodule/dynamic-content-theme-two/student-form-config-two.service';
import { FormEnabledTwoService } from '../../sharedmodule/dynamic-content-theme-two/formEnabledTwo.service';
// import { StudentDetailsThemeTwoComponent } from '../student-details-theme-two/student-details-theme-two.component';
import { DynamicContentThemeTwoComponent } from '../../sharedmodule/dynamic-content-theme-two/dynamic-content-theme-two.component';
import { ActivatedRoute } from '@angular/router';
import { SisService, CommonAPIService, ProcesstypeService } from '../../_services/index';
@Component({
	selector: 'app-enquiry-theme-two',
	templateUrl: './enquiry-theme-two.component.html',
	styleUrls: ['./enquiry-theme-two.component.scss']
})
export class EnquiryThemeTwoComponent implements OnInit, OnDestroy {
	@ViewChild('studentdetails') studentdetails;
	public formname = 'enquiry';
	public config: any = { login_id: '', form_action: '' };
	tabSelectedIndex = 0;
	formsTab: any[] = [];
	settingsArray: any[] = [];
	reRenderFormSubscription: any;
	reRenderTabSubscription: any;
	constructor(
		private studentFormConfigTwoService: StudentFormConfigTwoService,
		public formEnabledTwoService: FormEnabledTwoService,
		private route: ActivatedRoute,
		private processtypeService: ProcesstypeService,
		private commonAPIService: CommonAPIService,
		private sisService: SisService
	) { }

	ngOnInit() {
		this.getTabBifurcation();
		this.processtypeService.setProcesstype('1');
		this.formEnabledTwoService.resetFromEnable();
		this.formsTab = this.studentFormConfigTwoService.getForm(this.formname);
		this.route.queryParams.subscribe(value => {
			if (value.login_id) {
				this.tabSelectedIndex = 0;
				this.sisService.getStudentDetails({ au_login_id: value.login_id }).subscribe((result: any) => {
					if (result.status === 'ok') {
						// this.commonAPIService.studentData.next({last_record: value.login_id, au_login_id: result.data[0].au_login_id});
						this.commonAPIService.studentData.next({
							last_record: value.login_id, au_login_id: result.data[0].au_login_id, editable_status: result.data[0].editable_status
						});
						this.commonAPIService.reRenderForm.next(
							{ reRenderForm: false, addMode: false, editMode: false, deleteMode: false, viewMode: true });
					}
				});
			}
		});

		this.reRenderFormSubscription = this.commonAPIService.reRenderForm.subscribe((data: any) => {
			if (data && data.reRenderForm) {
				this.tabSelectedIndex = 0;
				this.getLastRecord();
			}
			if (data && data.addMode) {
				this.formEnabledTwoService.resetFromEnable();
				this.tabSelectedIndex = 0;
			}
			if (data && (data.viewMode || data.editMode)) {
				for (let i = 0; i < this.formsTab.length; i++) {
					this.formEnabledTwoService.setFormEnabled(i);
				}
			}

		});

		this.reRenderTabSubscription = this.commonAPIService.renderTab.subscribe((data: any) => {
			if (data && data.tabMove) {
				this.tabSelectedIndex += 1;
			}
		});


		this.getConfigureSetting();
	}
	getConfigureSetting() {
		this.sisService.getConfigureSetting({
			cos_process_type: this.processtypeService.getProcesstype()
		}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				// this.savedSettingsArray = result.data;
				this.settingsArray = result.data;
				if (this.settingsArray) {
					this.getLastRecord();
				}

				/* for (const item of this.savedSettingsArray) {
         if (item.cos_tb_id === '2') {
         this.settingsArray.push({
           cos_tb_id: item.cos_tb_id,
           cos_ff_id: item.cos_ff_id,
           cos_status: item.cos_status,
           ff_field_name: item.ff_field_name
         });
        }
       } */
			}
		});
	}
	getTabBifurcation() {
		this.sisService.getTabBifurcation().subscribe((result: any) => {
			if (result.status === 'ok') {
				this.formEnabledTwoService.setTabbirfurcation(result.data);
			}
		});
	}

	ngOnDestroy(): void {
		// this.unsubscribe$.next();
		this.reRenderTabSubscription.unsubscribe();
		this.reRenderFormSubscription.unsubscribe();
	}


	checkFormEnabled(value) {
		return this.formEnabledTwoService.checkFormEnabled(value);
	}

	setTabValue(value) {
		this.tabSelectedIndex = value;
		this.commonAPIService.tabChange.next({ 'currrentTab': this.tabSelectedIndex });
	}
	// getSelectedIndex(selectedIndex) {
	//   return this.config.form_action = 'view' ? 0 : this.formEnabledTwoService.getLastValue();
	// }

	getLastRecord() {
		this.sisService.getStudentLastRecordPerProcessType().subscribe((result: any) => {
			this.commonAPIService.studentData.next(result.data[0]);
			// this.commonAPIService.reRenderForm.next({ viewMode: true, addMode: false, editMode: false, deleteMode: false });
			for (let i = 0; i < this.formname.length; i++) {
				this.formEnabledTwoService.setFormEnabled(i);
			}
		});
	}
}
