import { Injectable } from '@angular/core';

@Injectable()
export class FormEnabledTwoService {
		private formEnabledArray: any[] = [0];
		private tabbifurcation: any[] = [];
		constructor() { }
		setFormEnabled(formIndex: number) {
				const tabindex = this.formEnabledArray.findIndex(element => element === formIndex);
				if (tabindex === -1) {
						this.formEnabledArray.push(formIndex);
				}
		}
		getLastValue() {
				return this.formEnabledArray[this.formEnabledArray.length - 1];
		}
		checkFormEnabled(formIndex: number): boolean {
				for (const element of this.formEnabledArray) {
						if (element === formIndex) {
								return false;
						}
				}
				return true;
		}
		resetFromEnable() {
				this.formEnabledArray = [0];
		}
		setTabbirfurcation(value) {
				this.tabbifurcation = value;
		}
		getTabid(tabname) {
				let tabid = 0;
				if (this.tabbifurcation.length > 0) {
						for (const tab of this.tabbifurcation) {
								if (tab.tb_name === tabname) {
										tabid = tab.tb_id;
										break;
								}
						}
				}
				return tabid;
		}
		getTabname(tabid) {
				let tabname = '';
				if (this.tabbifurcation.length > 0) {
						for (const tab of this.tabbifurcation) {
								if (tab.tb_id === tabid) {
										tabname = tab.tb_name;
										break;
								}
						}
				}
				return tabname;
		}
}
