import { Injectable } from '@angular/core';
import { ChildDetailsComponent } from '../../student-master/child-details/child-details.component';
import { ParentDetailsComponent } from '../../student-master/parent-details/parent-details.component';
import { EducationDetailsComponent } from '../../student-master/education-details/education-details.component';
import { AccountsComponent } from '../../student-master/accounts/accounts.component';
import { MedicalInformationComponent } from '../../student-master/medical-information/medical-information.component';
import { SkillsAwardsComponent } from '../../student-master/skills-awards/skills-awards.component';
import { DocumentsComponent } from '../../student-master/documents/documents.component';
import { ParentGeneralRemarksComponent } from '../../student-master/parent-general-remarks/parent-general-remarks.component';
import { AdmissionConcessionComponent } from '../../student-master/admission-concession/admission-concession.component';
import { AdmissionRemarksComponent } from '../../student-master/admission-remarks/admission-remarks.component';
@Injectable()
export class StudentFormConfigService {
		mappings = {
				'app-child-details': ChildDetailsComponent,
				'app-parent-details': ParentDetailsComponent,
				'app-education-details': EducationDetailsComponent,
				'app-accounts': AccountsComponent,
				'app-medical-information': MedicalInformationComponent,
				'app-documents': DocumentsComponent,
				'app-skills-awards': SkillsAwardsComponent,
				'app-parent-general-remarks': ParentGeneralRemarksComponent,
				'app-admission-concession': AdmissionConcessionComponent,
				'app-admission-remarks': AdmissionRemarksComponent
		};
		tabArray = [
				{ 'label': 'Personal Details', 'component': 'app-child-details' },
				{ 'label': 'Parent Details', 'component': 'app-parent-details' },
				{ 'label': 'Accounts', 'component': 'app-accounts' },
				{ 'label': 'Medical Information', 'component': 'app-medical-information' },
				{ 'label': 'Education Details', 'component': 'app-education-details' },
				{ 'label': 'Skills & Awards', 'component': 'app-skills-awards' },
				{ 'label': 'Documents', 'component': 'app-documents' },
				{ 'label': 'Management Remarks', 'component': 'app-parent-general-remarks' },
				{ 'label': 'General Remarks', 'component': 'app-admission-concession' },
				{ 'label': 'Admission Remarks', 'component': 'app-admission-remarks' }
		];
		formconfig = {
				'enquiry': [0, 1],
				'registration': [0, 1, 3, 4, 5, 6, 7],
				'provisional': [0, 1, 3, 4, 5, 6, 7, 8, 9],
				'admission': [0, 1, 3, 4, 5, 6, 7, 8, 9],
				'alumini': [0, 1, 4]
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
