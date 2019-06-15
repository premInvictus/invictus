import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { StudentFormConfigTwoService } from '../../sharedmodule/dynamic-content-theme-two/student-form-config-two.service';
import { FormEnabledTwoService } from '../../sharedmodule/dynamic-content-theme-two/formEnabledTwo.service';
import { StudentDetailsThemeTwoComponent } from '../student-details-theme-two/student-details-theme-two.component';
import { DynamicContentThemeTwoComponent } from '../../sharedmodule/dynamic-content-theme-two/dynamic-content-theme-two.component';
import { ActivatedRoute } from '@angular/router';
import { SisService, CommonAPIService, ProcesstypeService } from '../../_services/index';


@Component({
	selector: 'app-provisional-theme-two',
	templateUrl: './provisional-theme-two.component.html',
	styleUrls: ['./provisional-theme-two.component.scss']
})
export class ProvisionalThemeTwoComponent implements OnInit, OnDestroy {
	@ViewChild(StudentDetailsThemeTwoComponent) studentdetails: StudentDetailsThemeTwoComponent;
	public formname = 'provisional';
	public config: any = { login_id: '', form_action: '' };
	tabSelectedIndex = 0;
	formsTab: any[] = [];
	settingsArray: any[] = [];
	reRenderFormSubscription: any;
	reRenderTabSubscription: any;
	studentRecord: any = {};
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
		this.studentRecord = this.commonAPIService.getStudentData();
		this.processtypeService.setProcesstype('3');
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
				this.settingsArray = result.data;
				if (this.settingsArray) {
					this.getLastRecord();
				}
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

	getLastRecord() {
		if (this.studentRecord.id && this.studentRecord.process_type === '3') {
			this.commonAPIService.studentSearchByName.next(this.studentRecord.id);
			for (let i = 0; i < this.formname.length; i++) {
				this.formEnabledTwoService.setFormEnabled(i);
			}
		} else {
			this.sisService.getStudentLastRecordPerProcessType().subscribe((result: any) => {
				this.commonAPIService.studentData.next(result.data[0]);
				for (let i = 0; i < this.formname.length; i++) {
					this.formEnabledTwoService.setFormEnabled(i);
				}
			});
		}
	}
}
