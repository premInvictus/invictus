import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { StudentFormConfigTwoService } from '../../sharedmodule/dynamic-content-theme-two/student-form-config-two.service';
import { FormEnabledTwoService } from '../../sharedmodule/dynamic-content-theme-two/formEnabledTwo.service';
import { StudentDetailsThemeTwoComponent } from '../student-details-theme-two/student-details-theme-two.component';
import { DynamicContentThemeTwoComponent } from '../../sharedmodule/dynamic-content-theme-two/dynamic-content-theme-two.component';
import { ActivatedRoute } from '@angular/router';
import { SisService, CommonAPIService, ProcesstypeService } from '../../_services/index';


@Component({
	selector: 'app-registration-theme-two',
	templateUrl: './registration-theme-two.component.html',
	styleUrls: ['./registration-theme-two.component.scss']
})
export class RegistrationThemeTwoComponent implements OnInit, OnDestroy {
	@ViewChild(StudentDetailsThemeTwoComponent) studentdetails: StudentDetailsThemeTwoComponent;
	public formname = 'registration';
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
		this.processtypeService.setProcesstype('2');
		this.formEnabledTwoService.resetFromEnable();
		this.formsTab = this.studentFormConfigTwoService.getForm(this.formname);

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
				this.settingsArray = result.data;
				this.route.queryParams.subscribe(value => {
					if (value && value.login_id) {
						this.tabSelectedIndex = 0;
						this.sisService.getStudentDetails({ au_login_id: value.login_id }).subscribe((result1: any) => {
							if (result.status === 'ok') {
								this.commonAPIService.studentData.next({
									last_record: value.login_id, au_login_id: result1.data[0].au_login_id, editable_status: result1.data[0].editable_status
								});
							}
						});
					} else {
						this.getLastRecord();
					}
				});
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
