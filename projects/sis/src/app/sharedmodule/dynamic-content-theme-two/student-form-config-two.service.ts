import { Injectable } from '@angular/core';
// tslint:disable-next-line: max-line-length
import { ThemeTwoTabOneContainerComponent } from '../../student-master-theme-two/theme-two-tab-one-container/theme-two-tab-one-container.component';
// tslint:disable-next-line: max-line-length
import { ThemeTwoTabTwoContainerComponent } from '../../student-master-theme-two/theme-two-tab-two-container/theme-two-tab-two-container.component';
// tslint:disable-next-line: max-line-length
import { ThemeTwoTabThreeContainerComponent } from '../../student-master-theme-two/theme-two-tab-three-container/theme-two-tab-three-container.component';
@Injectable()
export class StudentFormConfigTwoService {
		mappings = {
				'app-theme-two-tab-one-container': ThemeTwoTabOneContainerComponent,
				'app-theme-two-tab-two-container': ThemeTwoTabTwoContainerComponent,
				'app-theme-two-tab-three-container': ThemeTwoTabThreeContainerComponent,
		};
		tabArray = [
				{ 'label': 'Personal Details', 'component': 'app-theme-two-tab-one-container' },
				{ 'label': 'Additional Details', 'component': 'app-theme-two-tab-two-container' },
				{ 'label': 'Remarks', 'component': 'app-theme-two-tab-three-container' }
		];
		formconfig = {
				'enquiry': [0, 1, 2],
				'registration': [0, 1, 2],
				'provisional': [0, 1, 2],
				'admission': [0, 1, 2],
				'alumini': [0, 1]
		};
		processType = {
				'enquiry': '1',
				'registration': '2',
				'provisional': '3',
				'admission': '4',
				'alumini': '5'
		};

		constructor() { }

		getForm(formname) {
				const tabs: any[] = [];
				this.formconfig[formname].forEach(element => {
						tabs.push(this.tabArray[element]);
				});
				return tabs;
		}
		getProccessTypeName(value) {
				for (const key in this.processType) {
						if (this.processType[key] === value) {
								return key;
						}
				}
		}
		getTabsIndex(value) {
				for (const key in this.formconfig) {
						if (key === value) {
								return this.formconfig[key];
						}
				}
		}
}
