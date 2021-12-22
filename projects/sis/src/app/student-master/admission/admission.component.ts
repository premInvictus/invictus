
import { Component, EventEmitter, OnInit, Output, ViewChild, OnChanges, OnDestroy } from '@angular/core';
import { DynamicContentComponent } from '../../sharedmodule/dynamic-content/dynamic-content.component';
import { StudentFormConfigService } from '../../sharedmodule/dynamic-content/student-form-config.service';
import { FormEnabledService } from '../../sharedmodule/dynamic-content/formEnabled.service';
import { StudentDetailsComponent } from '../student-details/student-details.component';
import { ActivatedRoute, Router } from '@angular/router';
import { config, Subject } from 'rxjs';
import { SisService, CommonAPIService, ProcesstypeService } from '../../_services/index';

@Component({
	selector: 'app-admission',
	templateUrl: './admission.component.html',
	styleUrls: ['./admission.component.scss']
})
export class AdmissionComponent implements OnInit, OnDestroy {
	@ViewChild(StudentDetailsComponent) studentdetails: StudentDetailsComponent;
	public formname = 'admission';
	public config: any = { login_id: '', form_action: '' };
	currentStudentDataId: any;
	formsTab: any[] = [];
	tabSelectedIndex = 0;
	reRenderFormSubscription: any;
	reRenderTabSubscription: any;
	constructor(
		private studentFormConfigService: StudentFormConfigService,
		public formEnabledService: FormEnabledService,
		private route: ActivatedRoute,
		private router: Router,
		private commonAPIService: CommonAPIService,
		private sisService: SisService,
		private processtypeService: ProcesstypeService
	) { }

	ngOnInit() {
		this.getTabBifurcation();
		this.processtypeService.setProcesstype('4');
		this.formEnabledService.resetFromEnable();
		this.formsTab = this.studentFormConfigService.getForm(this.formname);
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

	ngOnDestroy(): void {
		// this.unsubscribe$.next();
		this.reRenderTabSubscription.unsubscribe();
		this.reRenderFormSubscription.unsubscribe();
	}

	checkFormEnabled(value) {
		return this.formEnabledService.checkFormEnabled(value);
	}
	getSelectedIndex() {
		return this.formEnabledService.getLastValue();
	}
	getTabBifurcation() {
		this.sisService.getTabBifurcation().subscribe((result: any) => {
			if (result.status === 'ok') {
				this.formEnabledService.setTabbirfurcation(result.data);
			}
		});
	}
	isExist(param, value) {
		let exist = false;
		for (const key in param) {
			if (param[key] === value) {
				exist = true;
				break;
			}
		}
		return exist;
	}

	setTabValue(value) {
		this.tabSelectedIndex = value;
	}

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
