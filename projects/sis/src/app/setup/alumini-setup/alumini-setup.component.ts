import { Component, OnInit } from '@angular/core';
import { StudentFormConfigService } from '../../sharedmodule/dynamic-content/student-form-config.service';
import { CommonAPIService, SisService } from '../../_services/index';
@Component({
	selector: 'app-alumini-setup',
	templateUrl: './alumini-setup.component.html',
	styleUrls: ['./alumini-setup.component.scss']
})
export class AluminiSetupComponent implements OnInit {

	formsTab: any[] = [];
	finalFormTab: any[] = [{ label: 'Student Details', component: 'app-student-details', tab_id: '1' }];
	formFieldArray: any[] = [];
	finalFieldsArray: any[][] = [];
	formLabelArray: any[] = [];
	settingsArray: any[] = [];
	savedSettingsArray: any[] = [];
	tabIdArray: any[] = [];
	constructor(private studentFormConfigService: StudentFormConfigService,
		private sisService: SisService,
		private common: CommonAPIService) { }

	ngOnInit() {
		this.getTabsIndexes();
		this.formsTab = this.studentFormConfigService.getForm('alumini');
		for (const item of this.formsTab) {
			this.finalFormTab.push({
				label: item.label,
				component: item.component,
				tab_id: ''
			});
		}
		let i = 0;
		for (const item of this.tabIdArray) {
			this.finalFormTab[i + 1].tab_id = (Number(item) + 2).toString();
			i++;
		}
		this.getFormFields();
	}
	getFormFields() {
		this.sisService.getFormFields({ ff_tab_id: '' }).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.formFieldArray = result.data;
				this.getConfigureSetting();
			}
		});
	}
	statusChangeEvent($event, id, tab_id) {
		const findex = this.settingsArray.findIndex(f => Number(f.cos_ff_id) === Number(id)
			&& Number(f.cos_tb_id) === Number(tab_id));
		if (findex === -1 && $event.checked === true) {
			this.settingsArray.push({
				cos_tb_id: tab_id,
				cos_ff_id: id,
				cos_status: 'Y'
			});
		} else if (findex === -1 && $event.checked === false) {
			this.settingsArray.push({
				cos_tb_id: tab_id,
				cos_ff_id: id,
				cos_status: 'N'
			});
		} else if (findex !== -1 && $event.checked === false) {
			this.settingsArray.splice(findex, 1);
			this.settingsArray.push({
				cos_tb_id: tab_id,
				cos_ff_id: id,
				cos_status: 'N'
			});
		} else if (findex !== -1 && $event.checked === true) {
			this.settingsArray.splice(findex, 1);
			this.settingsArray.push({
				cos_tb_id: tab_id,
				cos_ff_id: id,
				cos_status: 'Y'
			});
		}
	}
	saveEnquirySettings() {
		const settingsJson = {
			cos_process_type: '5',
			configRelation: this.settingsArray
		};
		this.sisService.insertConfigureSetting(settingsJson).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.common.showSuccessErrorMessage('Form settings changed', ' success');
				this.getConfigureSetting();
			}
		});
	}
	getConfigureSetting() {
		this.settingsArray = [];
		this.sisService.getConfigureSetting({
			cos_process_type: '5'
		}).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.savedSettingsArray = result.data;
				for (const item of this.savedSettingsArray) {
					this.settingsArray.push({
						cos_tb_id: item.cos_tb_id,
						cos_ff_id: item.cos_ff_id,
						cos_status: item.cos_status
					});
				}
			}
		});
	}
	checkFieldsStatus(id, tab_id) {
		const findex = this.settingsArray.findIndex(f => Number(f.cos_ff_id) === Number(id)
			&& Number(f.cos_tb_id) === Number(tab_id));
		if (findex !== -1 && this.settingsArray[findex]['cos_status'] === 'Y') {
			return true;
		}
		if (findex !== -1 && this.settingsArray[findex]['cos_status'] === 'N') {
			return false;
		}
	}
	getTabsIndexes() {
		this.tabIdArray = this.studentFormConfigService.getTabsIndex('alumini');
	}
}
