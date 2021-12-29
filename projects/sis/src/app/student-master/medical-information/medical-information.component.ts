import { Component, OnInit, ViewChild } from '@angular/core';
import { SisService, CommonAPIService, ProcesstypeService } from '../../_services/index';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { DynamicComponent } from '../../sharedmodule/dynamiccomponent';
import { FormEnabledService } from '../../sharedmodule/dynamic-content/formEnabled.service';
import { DatePipe } from '@angular/common';
@Component({
	selector: 'app-medical-information',
	templateUrl: './medical-information.component.html',
	styleUrls: ['./medical-information.component.scss']
})
export class MedicalInformationComponent extends DynamicComponent implements OnInit {
	@ViewChild('editReference') editReference;
	bloodGroupArray: any[] = [];
	medicalForm: FormGroup;
	livesWithArray: any[] = [{ efi_lives_with: 'F', efi_lives_with_name: 'Father' },
	{ efi_lives_with: 'M', efi_lives_with_name: 'Mother' },
	{ efi_lives_with: 'B', efi_lives_with_name: 'Both' },
	{ efi_lives_with: 'G', efi_lives_with_name: 'Guardian' }];
	infoArray: any[] = [{ efi_family_info: 'Father Deceased' },
	{ efi_family_info: 'Mother Deceased' },
	{ efi_family_info: 'Parent Divorced' },
	{ efi_family_info: 'Parent Seperated' },
	{ efi_family_info: 'Father Remarried' },
	{ efi_family_info: 'Mother Remarried' },
	{ efi_family_info: 'NRI' }];
	infoFlagArray: any[] = [false, false, false, false, true, true, true];
	infoBasedOnSeperated = false;
	vaccinationByDurationArray: any[] = [];
	vaccinationArray: any[] = [];
	formControlNameArray: any[] = ['evh_at_birth', 'evh_six_week', 'evh_ten_week', 'evh_fourteen_week', 'evh_six_month', 'evh_nine_month',
		'evh_five_eighteen_month', 'evh_two_year', 'evh_five_yearevh_ten_year'];
	familyInfoArray: any[] = [];
	finalFamilyInfoArray: any[] = [];
	medicineArray: any[] = [];
	medicineDetailArray: any[] = [];
	finalMedicineArray: any[] = [];
	medVac: any[] = [];
	showOthersDiv = false;
	medicalHistory: any = {};
	showMedicalHistory: any = {};
	login_id: any;
	addOnly = false;
	viewOnly = false;
	editOnly = false;
	editFlag = false;
	editRequestFlag = false;
	saveFlag = false;
	medicalInfoArray: any[] = [];
	finalSibReqArray: any[] = [];
	finalSibReqArray2: any[] = [];
	finalArray: any[] = [];
	reqObj: any = {};
	savedSettingsArray: any[] = [];
	settingsArray: any[] = [];
	constructor(private sisService: SisService,
		private processtypeService: ProcesstypeService,
		private fbuild: FormBuilder,
		private formEnabledService: FormEnabledService,
		private notif: CommonAPIService) { super(); }

	ngOnInit() {
		this.buildForm();
		this.getBloodGroup();
		this.getVaccinationByDuration();
		this.getMedications();
		this.getConfigureSetting();
		this.notif.studentData.subscribe((data: any) => {
			if (data && data.au_login_id) {
				this.login_id = data.au_login_id;
				const processType = this.processtypeService.getProcesstype();
				if (processType === '2' || processType === '3' || processType === '4') {
					this.getMedicalHistory(this.login_id);
				}

			}
		});
		this.notif.reRenderForm.subscribe((data: any) => {
			if (data && data.addMode) {
				this.buildForm();
				this.viewOnly = false;
				this.addOnly = true;
			}
			if (data && data.viewMode) {
				this.viewOnly = true;
				this.addOnly = false;
				this.editOnly = false;
				this.saveFlag = false;
				this.editRequestFlag = false;
			}
			if (data && data.editMode) {
				this.viewOnly = false;
				this.saveFlag = true;
			}
		});
	}

	buildForm() {
		this.medicalForm = this.fbuild.group({
			login_id: '',
			mi_blood_group: '',
			mi_id: '',
			mi_identification_mark: '',
			mi_family_physician_name: '',
			mi_physican_contact: '',
			mi_history_explanation: '',
			mi_height: '',
			mi_weight: '',
			mi_allergic_medication: [],
			mi_allergic_others: [],
			mi_allergic_others_explanation: '',
			mi_student_known: '',
			evh_at_birth: [],
			evh_six_week: [],
			evh_ten_week: [],
			evh_fourteen_week: [],
			evh_six_month: [],
			evh_nine_month: [],
			evh_five_eighteen_month: [],
			evh_two_year: [],
			evh_five_year: [],
			evh_ten_year: [],
			mi_lives_with: 'B',
			mi_family_info: [],
			mi_family_explanation: '',
			mi_student_known_time: '',
			mi_status: ''
		});
	}
	openEditDialog = (data) => this.editReference.openModal(data);
	getBloodGroup() {
		this.sisService.getBloodGroup().subscribe((result: any) => {
			if (result) {
				this.bloodGroupArray = result.data;
			}
		});
	}
	getLivesWithValue($event) {
		if ($event.value === 'G') {
			this.infoFlagArray[0] = true;
			this.infoFlagArray[1] = true;
			this.infoFlagArray[2] = true;
			this.infoFlagArray[3] = true;
		} else {
			this.infoFlagArray[0] = false;
			this.infoFlagArray[1] = false;
			this.infoFlagArray[2] = false;
			this.infoFlagArray[3] = false;
		}
		this.medicalForm.value.mi_lives_with = $event.value;
	}
	checkFamilyInfo($event) {
		if ($event.checked === true && $event.source.value === 'Parent Divorced' ||
			$event.checked === true && $event.source.value === 'Parent Seperated') {
			this.infoBasedOnSeperated = true;
		} else {
			this.infoBasedOnSeperated = false;
		}
		const findex = this.familyInfoArray.findIndex(f => f.f_id === $event.source.value);
		if (findex === -1) {
			this.familyInfoArray.push({ f_id: $event.source.value });
		} else {
			this.familyInfoArray.splice(findex, 1);
		}
	}
	addMedicalInfo() {
		for (const item of this.familyInfoArray) {
			this.finalFamilyInfoArray.push(item.f_id);
		}
		this.medicalForm.value.mi_family_info = this.finalFamilyInfoArray;
		for (const item of this.medicineDetailArray) {
			this.finalMedicineArray.push(item.med_id);
		}
		this.medicalForm.value.mi_allergic_medication = this.finalMedicineArray;

		for (const item of this.vaccinationByDurationArray) {
			const vac_list: any[] = [];
			for (const titem of this.vaccinationArray) {
				if (Number(item.vd_id) === Number(titem.vd_id)) {
					vac_list.push(titem.vac_id);
				}
			}
			this.medVac.push({
				mh_login_id: this.context.studentdetails.studentdetailsform.value.au_login_id,
				mh_vac_id: vac_list,
				mh_vd_id: item.vd_id
			});
		}
		this.medicalHistory = {
			login_id: this.context.studentdetails.studentdetailsform.value.au_login_id,
			mi_blood_group: this.medicalForm.value.mi_blood_group,
			mi_identification_mark: this.medicalForm.value.mi_identification_mark,
			mi_family_physician_name: this.medicalForm.value.mi_family_physician_name,
			mi_physican_contact: this.medicalForm.value.mi_physican_contact,
			mi_history_explanation: this.medicalForm.value.mi_history_explanation,
			mi_height: this.medicalForm.value.mi_height,
			mi_weight: this.medicalForm.value.mi_weight,
			mi_allergic_medication: this.medicalForm.value.mi_allergic_medication,
			mi_allergic_others: this.medicalForm.value.mi_allergic_others,
			mi_allergic_others_explanation: this.medicalForm.value.mi_allergic_others_explanation,
			mi_student_known: this.medicalForm.value.mi_student_known,
			mi_lives_with: this.medicalForm.value.mi_lives_with,
			mi_family_info: this.medicalForm.value.mi_family_info,
			mi_family_explanation: this.medicalForm.value.mi_family_explanation,
			mi_status: '1',
			medVac: this.medVac
		};
		this.sisService.insertMedicalHistory(this.medicalHistory).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.formEnabledService.setFormEnabled(this.formEnabledService.getLastValue() + 1);
				this.notif.showSuccessErrorMessage('Medical Details added', 'success');

				if (this.processtypeService.getProcesstype() === '2'
					|| this.processtypeService.getProcesstype() === '3'
					|| this.processtypeService.getProcesstype() === '4') {
					this.notif.renderTab.next({ tabMove: true });
				}
			}
		});
	}
	getVaccinationByDuration() {
		this.sisService.getVaccinationByDuration().subscribe((result: any) => {
			for (const item of result.data) {
				if (item.vd_status === '1') {
					this.vaccinationByDurationArray.push(item);
				}
			}
		});
	}
	getVaccinationValue($event, index, vd_id) {
		if ($event.checked || !$event.checked) {
			const findex = this.vaccinationArray.findIndex(f => Number(f.vac_id) === Number($event.source.value) && f.id === index);
			if (findex === -1) {
				this.vaccinationArray.push({ id: index, vac_id: $event.source.value, vd_id: vd_id });
			} else {
				this.vaccinationArray.splice(findex, 1);
			}
		}
	}
	getMedications() {
		this.sisService.getMedications().subscribe((result: any) => {
			if (result) {
				for (const item of result.data) {
					if (item.med_status === '1') {
						this.medicineArray.push(item);
					}
				}
			}
		});
	}
	getOthers($event) {
		if ($event.checked) {
			this.showOthersDiv = true;
		} else {
			this.showOthersDiv = false;
		}
	}
	getMedicineDetail($event) {
		const findex = this.medicineDetailArray.findIndex(f => Number(f.med_id) === Number($event.source.value));
		if (findex === -1) {
			this.medicineDetailArray.push({ med_id: $event.source.value });
		} else {
			this.medicineDetailArray.splice(findex, 1);
		}
	}
	checkMedicines(index, vac_id) {
		const findex = this.vaccinationArray.findIndex(f => f.id === index
			&& f.vac_id === vac_id);
		if (findex !== -1) {
			return true;
		} else {
			return false;
		}
	}
	getMedicalHistory(login_id) {
		this.medVac = [];
		this.vaccinationArray = [];
		this.medicalInfoArray = [];
		this.showMedicalHistory = {};
		this.sisService.getMedicalHistory({
			login_id: login_id,
		}).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.showMedicalHistory = result.data[0];
				if (this.showMedicalHistory) {
					this.medicalForm.patchValue({
						mi_id: this.showMedicalHistory.mi_id,
						mi_blood_group: this.showMedicalHistory.mi_blood_group,
						mi_identification_mark: this.showMedicalHistory.mi_identification_mark,
						mi_family_physician_name: this.showMedicalHistory.mi_family_physician_name,
						mi_physican_contact: this.showMedicalHistory.mi_physican_contact,
						mi_history_explanation: this.showMedicalHistory.mi_history_explanation,
						mi_height: this.showMedicalHistory.mi_height,
						mi_weight: this.showMedicalHistory.mi_weight,
						mi_allergic_others_explanation: this.showMedicalHistory.mi_allergic_others_explanation,
						mi_student_known: this.showMedicalHistory.mi_student_known,
						mi_allergic_medication: this.showMedicalHistory.mi_allergic_medication,
						mi_family_explanation: this.showMedicalHistory.mi_family_explanation,
					});
					let i = 0;
					if (this.showMedicalHistory.medVac) {
						for (const item of this.showMedicalHistory.medVac) {
							if ((JSON.parse(item.mh_vac_id)).length > 0) {
								for (const titem of JSON.parse(item.mh_vac_id)) {
									this.vaccinationArray.push({ id: i, vac_id: titem, vd_id: item.vd_id });
								}
							}
							i++;
						}
					}
					if (this.showMedicalHistory.mi_lives_with === 'G') {
						this.infoFlagArray[0] = true;
						this.infoFlagArray[1] = true;
						this.infoFlagArray[2] = true;
						this.infoFlagArray[3] = true;
						this.medicalForm.patchValue({
							mi_lives_with: this.showMedicalHistory.mi_lives_with
						});
					} else {
						this.infoFlagArray[0] = false;
						this.infoFlagArray[1] = false;
						this.infoFlagArray[2] = false;
						this.infoFlagArray[3] = false;
						this.medicalForm.patchValue({
							mi_lives_with: this.showMedicalHistory.mi_lives_with
						});
					}
					if (this.showMedicalHistory.mi_family_info) {
						for (const item of this.showMedicalHistory.mi_family_info) {
							if (item === 'Parent Seperated' || item === 'Parent Divorced') {
								this.infoBasedOnSeperated = true;
							} else {
								this.infoBasedOnSeperated = false;
							}
							this.medicalInfoArray.push(item);
						}
					}
					this.medicalForm.value.mi_family_info = this.medicalInfoArray;
				}
			} else {
				this.medicalForm.reset();
				this.medicalForm.value.mi_lives_with = 'B';
				this.medVac = [];
				this.vaccinationArray = [];
				this.medicalInfoArray = [];
				this.showMedicalHistory = {};
			}
		});
	}
	checkFamilyStatus(info) {
		for (const item of this.medicalInfoArray) {
			if (item === info) {
				return true;
			} else {
				return false;
			}
		}
	}
	enableEdit() {
		this.viewOnly = false;
		this.editFlag = true;
		this.saveFlag = true;
		this.context.studentdetails.viewOnly = false;
	}
	enableEditRequest() {
		this.viewOnly = false;
		this.editOnly = false;
		this.editRequestFlag = true;
		this.saveFlag = false;
		this.context.studentdetails.viewOnly = false;
	}
	cancelForm() {
		if (this.addOnly) {
			this.notif.reRenderForm.next({ reRenderForm: true, viewMode: true, editMode: false, deleteMode: false, addMode: false });
		} else if (this.saveFlag || this.editRequestFlag) {
			this.notif.reRenderForm.next({ viewMode: true, editMode: false, deleteMode: false, addMode: false });
		}

	}
	updateMedicalHistory(isview) {
		for (const item of this.vaccinationByDurationArray) {
			const vac_list: any[] = [];
			for (const titem of this.vaccinationArray) {
				if (Number(item.vd_id) === Number(titem.vd_id)) {
					vac_list.push(titem.vac_id);
				}
			}
			this.medVac.push({
				mh_login_id: this.login_id,
				mh_vac_id: vac_list,
				mh_vd_id: item.vd_id
			});
		}
		this.medicalHistory = {
			login_id: this.context.studentdetails.studentdetailsform.value.au_login_id,
			mi_blood_group: this.medicalForm.value.mi_blood_group,
			mi_identification_mark: this.medicalForm.value.mi_identification_mark,
			mi_family_physician_name: this.medicalForm.value.mi_family_physician_name,
			mi_physican_contact: this.medicalForm.value.mi_physican_contact,
			mi_history_explanation: this.medicalForm.value.mi_history_explanation,
			mi_height: this.medicalForm.value.mi_height,
			mi_weight: this.medicalForm.value.mi_weight,
			mi_allergic_medication: this.medicalForm.value.mi_allergic_medication,
			mi_allergic_others: this.medicalForm.value.mi_allergic_others,
			mi_allergic_others_explanation: this.medicalForm.value.mi_allergic_others_explanation,
			mi_student_known: this.medicalForm.value.mi_student_known,
			mi_lives_with: this.medicalForm.value.mi_lives_with ? this.medicalForm.value.mi_lives_with : 'B',
			mi_family_info: this.medicalForm.value.mi_family_info,
			mi_family_explanation: this.medicalForm.value.mi_family_explanation,
			mi_status: '1',
			medVac: this.medVac
		};
		this.sisService.updateMedicalHistory(this.medicalHistory).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.notif.showSuccessErrorMessage('Medical Details Updated', 'success');
				this.getMedicalHistory(this.login_id);
				if (isview) {
					this.notif.reRenderForm.next({ viewMode: true, editMode: false, deleteMode: false, addMode: false });
				}
			} else {
				this.notif.showSuccessErrorMessage(result.data, 'error');
			}
		});
	}
	isArray(obj: any) {
		return Array.isArray(obj);
	}

	checkFormChangedValue() {
		this.finalSibReqArray = [];
		this.finalSibReqArray2 = [];
		this.finalArray = [];
		const datepipe = new DatePipe('en-US');
		Object.keys(this.medicalForm.controls).forEach(keys => {
			const formControl = <FormControl>this.medicalForm.controls[keys];
			if (formControl.dirty) {
				this.finalArray.push({
					rff_where_id: 'mi_id',
					rff_where_value: formControl['mi_id'],
					rff_field_name: keys,
					rff_new_field_value: formControl.value,
					rff_old_field_value: this.medicalForm[keys]
				});
			}
		});
		this.reqObj = {
			req_login_id: this.context.config.login_id,
			req_process_type: this.context.processType,
			req_tab_id: this.formEnabledService.getTabid('Medical Information'),
			req_priority: '',
			req_remarks: '',
			req_reason: '',
			req_date: datepipe.transform(new Date, 'yyyy-MM-dd'),
			req_param: []
		};
	}
	getConfigureSetting() {
		this.sisService.getConfigureSetting({
			cos_process_type: this.processtypeService.getProcesstype()
		}).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.savedSettingsArray = result.data;
				for (const item of this.savedSettingsArray) {
					if (item.cos_tb_id === '5') {
						this.settingsArray.push({
							cos_tb_id: item.cos_tb_id,
							cos_ff_id: item.cos_ff_id,
							cos_status: item.cos_status,
							ff_field_name: item.ff_field_name
						});
					}
				}
			}
		});
	}
	checkIfFieldExist(value) {
		const findex = this.settingsArray.findIndex(f => f.ff_field_name === value);
		if (findex !== -1 && this.settingsArray[findex]['cos_status'] === 'Y') {
			return true;
		} else if (findex !== -1 && this.settingsArray[findex]['cos_status'] === 'N') {
			return false;
		} else {
			return false;
		}
	}
	isExistUserAccessMenu(actionT) {
		return this.context.studentdetails.isExistUserAccessMenu(actionT);
	}
}
