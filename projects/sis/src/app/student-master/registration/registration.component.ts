
import { Component, EventEmitter, OnInit, Output, ViewChild, OnChanges, OnDestroy } from '@angular/core';
import { DynamicContentComponent } from '../../sharedmodule/dynamic-content/dynamic-content.component';
import { StudentFormConfigService } from '../../sharedmodule/dynamic-content/student-form-config.service';
import { FormEnabledService } from '../../sharedmodule/dynamic-content/formEnabled.service';
import { StudentDetailsComponent } from '../student-details/student-details.component';
import { ActivatedRoute, Router } from '@angular/router';
import { config, Subject } from 'rxjs';
import { SisService, CommonAPIService, ProcesstypeService } from '../../_services/index';


@Component({
	selector: 'app-registration',
	templateUrl: './registration.component.html',
	styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit, OnDestroy {
	@ViewChild(StudentDetailsComponent) studentdetails: StudentDetailsComponent;
	public formname = 'registration';
	public config: any = { login_id: '', form_action: '' };
	currentStudentDataId: any;
	formsTab: any[] = [];
	tabSelectedIndex = 0;
	private unsubscribe$ = new Subject();
	constructor(
		private studentFormConfigService: StudentFormConfigService,
		public formEnabledService: FormEnabledService,
		private route: ActivatedRoute,
		private router: Router,
		private commonAPIService: CommonAPIService,
		private sisService: SisService,
		private processtypeService: ProcesstypeService
	) { }

	// ngOnInit() {
	//   this.formEnabledService.resetFromEnable();
	//   const subject = new Subject<string>();
	//   // We subscribe to the subjec
	//   subject.subscribe((data) => {
	// });
	//   this.formsTab = this.studentFormConfigService.getForm(this.formname);
	//   this.route.queryParams.subscribe(value => {
	//     if (value.login_id) {
	//       for (let i = 0; i < 10; i++) {
	//         this.formEnabledService.setFormEnabled(i);
	//       }
	//       this.config.login_id = value.login_id;
	//       this.config.form_action = 'view';
	//     }
	//     if (value.au_login_id) {
	//       this.config.login_id = value.au_login_id;
	//       this.config.form_action = 'edit';
	//     }
	//   });

	//   this.commonAPIService.studentData.subscribe(data => {
	//     this.currentStudentDataId = data;
	//   });


	// }
	// ngOnChanges() {
	//   const subject = new Subject<string>();
	//   // We subscribe to the subjec
	//   subject.subscribe((data) => {
	//   });
	// }

	ngOnInit() {
		this.getTabBifurcation();
		this.processtypeService.setProcesstype('2');
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

		this.commonAPIService.reRenderForm.subscribe((data: any) => {
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

		this.commonAPIService.renderTab.subscribe((data: any) => {
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

	setTabValue(value) {
		this.tabSelectedIndex = value;
	}

	ngOnDestroy(): void {
		this.unsubscribe$.next();
	}

	checkFormEnabled(value) {
		return this.formEnabledService.checkFormEnabled(value);
	}
	getSelectedIndex() {
		return this.formEnabledService.getLastValue();
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
