import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DynamicContentComponent } from '../../sharedmodule/dynamic-content/dynamic-content.component';
import { StudentFormConfigService } from '../../sharedmodule/dynamic-content/student-form-config.service';
import { FormEnabledService } from '../../sharedmodule/dynamic-content/formEnabled.service';
import { StudentDetailsComponent } from '../student-details/student-details.component';
import { ActivatedRoute, Router } from '@angular/router';
import { SisService, CommonAPIService, ProcesstypeService } from '../../_services/index';
import { config } from 'rxjs';
import { Subject } from 'rxjs';

@Component({
	selector: 'app-enquiry',
	templateUrl: './enquiry.component.html',
	styleUrls: ['./enquiry.component.scss']
})
export class EnquiryComponent implements OnInit, OnDestroy {
	@ViewChild(StudentDetailsComponent) studentdetails: StudentDetailsComponent;
	public formname = 'enquiry';
	public config: any = { login_id: '', form_action: '' };
	tabSelectedIndex = 0;
	formsTab: any[] = [];
	reRenderFormSubscription: any;
	reRenderTabSubscription: any;
	constructor(
		private studentFormConfigService: StudentFormConfigService,
		public formEnabledService: FormEnabledService,
		private route: ActivatedRoute,
		private router: Router,
		private processtypeService: ProcesstypeService,
		private commonAPIService: CommonAPIService,
		private sisService: SisService
	) { }

	ngOnInit() {
		this.getTabBifurcation();
		this.processtypeService.setProcesstype('1');
		this.formEnabledService.resetFromEnable();
		this.formsTab = this.studentFormConfigService.getForm(this.formname);
		console.log('this.formsTab',this.formsTab);
		this.route.queryParams.subscribe(value => {
			if (value.login_id) {
				this.tabSelectedIndex = 0;
				this.sisService.getStudentDetails({ au_login_id: value.login_id }).subscribe((result: any) => {
					if (result.status === 'ok') {
						this.commonAPIService.studentData.next({ last_record: value.login_id, au_login_id: result.data[0].au_login_id });
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
				this.formEnabledService.resetFromEnable();
				this.tabSelectedIndex = 0;
			}
			if (data && (data.viewMode || data.editMode)) {
				for (let i = 0; i < this.formsTab.length; i++) {
					this.formEnabledService.setFormEnabled(i);
				}
			}

		});

		this.reRenderTabSubscription = this.commonAPIService.renderTab.subscribe((data: any) => {
			if (data && data.tabMove) {
				this.tabSelectedIndex += 1;
			}
		});
		this.getLastRecord();
	}
	getTabBifurcation() {
		this.sisService.getTabBifurcation().subscribe((result: any) => {
			if (result.status === 'ok') {
				this.formEnabledService.setTabbirfurcation(result.data);
			}
		});
	}

	ngOnDestroy(): void {
		this.reRenderTabSubscription.unsubscribe();
		this.reRenderFormSubscription.unsubscribe();
	}


	checkFormEnabled(value) {
		return this.formEnabledService.checkFormEnabled(value);
	}

	setTabValue(value) {
		this.tabSelectedIndex = value;
	}
	// getSelectedIndex(selectedIndex) {
	//   return this.config.form_action = 'view' ? 0 : this.formEnabledService.getLastValue();
	// }

	getLastRecord() {
		this.sisService.getStudentLastRecordPerProcessType().subscribe((result: any) => {
			this.commonAPIService.studentData.next(result.data[0]);
			this.commonAPIService.reRenderForm.next({ viewMode: true, addMode: false, editMode: false, deleteMode: false });
			for (let i = 0; i < this.formname.length; i++) {
				this.formEnabledService.setFormEnabled(i);
			}
		});
	}
}
