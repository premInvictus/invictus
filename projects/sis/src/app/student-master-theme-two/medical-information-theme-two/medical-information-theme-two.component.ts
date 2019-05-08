import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { FormEnabledTwoService } from '../../sharedmodule/dynamic-content-theme-two/formEnabledTwo.service';
import { SisService, CommonAPIService, ProcesstypeService } from '../../_services/index';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';
import { ConfirmValidParentMatcher } from '../../ConfirmValidParentMatcher';
import { DynamicComponent } from '../../sharedmodule/dynamiccomponent';

@Component({
	selector: 'app-medical-information-theme-two',
	templateUrl: './medical-information-theme-two.component.html',
	styleUrls: ['./medical-information-theme-two.component.scss']
})
export class MedicalInformationThemeTwoComponent extends DynamicComponent implements OnInit {

	@Input() addOnly: boolean;
	@Input() editOnly: boolean;
	@Input() viewOnly: boolean;
	@Input() configSetting: any;
	medicalform: FormGroup;
	bloodGroupArray: any[] = [];
	medicalInfoArray: any[] = [];
	settingsArray: any[] = [];
	savedSettingsArray: any[] = [];
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
	constructor(
		private formEnabledTwoService: FormEnabledTwoService,
		private fbuild: FormBuilder,
		private commonAPIService: CommonAPIService,
		private sisService: SisService,
		private processtypeService: ProcesstypeService
	) { super(); }

	ngOnInit() {
		this.buildForm();
		this.getBloodGroup();
		this.getMedications();
		this.getVaccinationByDuration();
		this.settingsArray = this.configSetting;
		// this.getConfigureSetting();
	}
	buildForm() {
		this.medicalform = this.fbuild.group({
			mi_id: '',
			mi_login_id: '',
			mi_blood_group: '',
			mi_identification_mark: '',
			mi_emergency_contact_name: '',
			mi_emergency_contact_no: '',
			mi_status: '',
			mi_special_need: '',
			mi_history_explanation: '',
			mi_height: '',
			mi_weight: '',
			mi_allergic_medication: [],
			mi_allergic_others: [],
			mi_allergic_others_explanation: '',
			mi_student_known: '',
			mi_lives_with: 'B',
			mi_family_info: [],
			mi_family_explanation: '',
			mi_student_known_time: '',
			medVac: ''
		});
	}
	getBloodGroup() {
		this.bloodGroupArray = [];
		this.sisService.getBloodGroup().subscribe((result: any) => {
			if (result) {
				this.bloodGroupArray = result.data;
			}
		});
	}
	// getConfigureSetting() {
	// 	this.sisService.getConfigureSetting({
	// 		cos_process_type: this.processtypeService.getProcesstype()
	// 	}).subscribe((result: any) => {
	// 		if (result.status === 'ok') {
	// 			this.savedSettingsArray = result.data;
	// 			for (const item of this.savedSettingsArray) {
	// 				if (item.cos_tb_id === '5' || item.cos_tb_id === '2') {
	// 					this.settingsArray.push({
	// 						cos_tb_id: item.cos_tb_id,
	// 						cos_ff_id: item.cos_ff_id,
	// 						cos_status: item.cos_status,
	// 						ff_field_name: item.ff_field_name
	// 					});
	// 				}
	// 			}
	// 		}
	// 	});
	// }
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
	patchMedicaldetails(medicalDetails) {
		if (medicalDetails && medicalDetails.length > 0) {
			this.medicalform.patchValue({
				mi_id: medicalDetails[0].mi_id,
				mi_login_id: medicalDetails[0].mi_login_id,
				mi_blood_group: medicalDetails[0].mi_blood_group,
				mi_identification_mark: medicalDetails[0].mi_identification_mark,
				mi_emergency_contact_name: medicalDetails[0].mi_emergency_contact_name,
				mi_emergency_contact_no: medicalDetails[0].mi_emergency_contact_no,
				mi_status: medicalDetails[0].mi_status,
				mi_special_need: medicalDetails[0].mi_special_need,
				mi_history_explanation: medicalDetails[0].mi_history_explanation,
				mi_height: medicalDetails[0].mi_height,
				mi_weight: medicalDetails[0].mi_weight,
				mi_allergic_others_explanation: medicalDetails[0].mi_allergic_others_explanation,
				mi_student_known: medicalDetails[0].mi_student_known,
				mi_allergic_medication: medicalDetails[0].mi_allergic_medication,
				mi_family_explanation: medicalDetails[0].mi_family_explanation,
			});
			let i = 0;
			if (medicalDetails[0] && medicalDetails[0].medVac) {
				for (const item of medicalDetails[0].medVac) {
					if (item.vd_id && (JSON.parse(item.mh_vac_id)).length > 0) {
						for (const titem of JSON.parse(item.mh_vac_id)) {
							this.vaccinationArray.push({ id: i, vac_id: titem, vd_id: item.vd_id });
						}
					}
					i++;
				}
			}
			if (medicalDetails[0].mi_lives_with === 'G') {
				this.infoFlagArray[0] = true;
				this.infoFlagArray[1] = true;
				this.infoFlagArray[2] = true;
				this.infoFlagArray[3] = true;
				this.medicalform.patchValue({
					mi_lives_with: medicalDetails[0].mi_lives_with
				});
			} else {
				this.infoFlagArray[0] = false;
				this.infoFlagArray[1] = false;
				this.infoFlagArray[2] = false;
				this.infoFlagArray[3] = false;
				this.medicalform.patchValue({
					mi_lives_with: medicalDetails[0].mi_lives_with
				});
			}
			if (medicalDetails[0].mi_family_info) {
				for (const item of medicalDetails[0].mi_family_info) {
					if (item === 'Parent Seperated' || item === 'Parent Divorced') {
						this.infoBasedOnSeperated = true;
					} else {
						this.infoBasedOnSeperated = false;
					}
					this.medicalInfoArray.push(item);
				}
			}
			this.medicalform.value.mi_family_info = this.medicalInfoArray;
		} else {
			this.medicalform.reset();
		}

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
		this.medicalform.value.mi_lives_with = $event.value;
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
		this.medicalform.value.mi_family_info = this.finalFamilyInfoArray;
		for (const item of this.medicineDetailArray) {
			this.finalMedicineArray.push(item.med_id);
		}
		this.medicalform.value.mi_allergic_medication = this.finalMedicineArray;
		for (const item of this.vaccinationByDurationArray) {
			const vac_list: any[] = [];
			for (const titem of this.vaccinationArray) {
				if (Number(item.vd_id) === Number(titem.vd_id)) {
					vac_list.push(titem.vac_id);
				}
			}
			this.medVac.push({
				mh_login_id: '',
				mh_vac_id: vac_list,
				mh_vd_id: item.vd_id
			});
		}
		this.medicalform.patchValue({
			medVac: this.medVac
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
					this.medicalform.patchValue({
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
						this.medicalform.patchValue({
							mi_lives_with: this.showMedicalHistory.mi_lives_with
						});
					} else {
						this.infoFlagArray[0] = false;
						this.infoFlagArray[1] = false;
						this.infoFlagArray[2] = false;
						this.infoFlagArray[3] = false;
						this.medicalform.patchValue({
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
					this.medicalform.value.mi_family_info = this.medicalInfoArray;
				}
			} else {
				this.medicalform.reset();
				this.medicalform.value.mi_lives_with = 'B';
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

}
