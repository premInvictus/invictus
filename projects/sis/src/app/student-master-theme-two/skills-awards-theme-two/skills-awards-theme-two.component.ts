import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, NgForm, FormControl, FormGroupDirective } from '@angular/forms';
import { CommonAPIService, ProcesstypeService, SisService } from '../../_services';
import { FormEnabledService } from '../../sharedmodule/dynamic-content/formEnabled.service';
import { ErrorStateMatcher } from '@angular/material';

@Component({
	selector: 'app-skills-awards-theme-two',
	templateUrl: './skills-awards-theme-two.component.html',
	styleUrls: ['./skills-awards-theme-two.component.scss']
})
export class SkillsAwardsThemeTwoComponent implements OnInit, OnChanges {
	awardsform: FormGroup;
	activityUpdateFlag = false;
	awardUpdateFlag = false;
	activityArray: any[] = [];
	activityClubArray: any[] = [];
	levelOfIntrestArray: any[] = [];
	eventLevelArray: any[] = [];
	skillsValue: any;
	awardsValue1: any;
	awardsValue2: any;
	authorityArray: any[] = [];
	finalAwardArray: any[] = [];
	finalAwardArray2: any[] = [];
	finalSpannedArray: any[] = [];
	currentUser: any;
	skillAwardsArray: any[] = [];
	login_id: any;
	activityform: FormGroup;
	savedSettingsArray: any[] = [];
	settingsArray: any[] = [];
	session: any;
	sessionArray: any[] = [];
	currentSession: any;
	@Input() addOnly = false;
	@Input() viewOnly = false;
	@Input() editRequestFlag = false;
	@Input() skillsFormData: any;
	@Input() configSetting: any;
	constructor(private fbuild: FormBuilder, private notif: CommonAPIService, private sisService: SisService,
		private formEnabledService: FormEnabledService,
		private processtypeService: ProcesstypeService) { }

	ngOnInit() {
		this.settingsArray = this.configSetting;
		this.session = JSON.parse(localStorage.getItem('session'));
		this.buildForm();
		this.getActivity();
		this.getActivityClub();
		this.getLevelOfInterest();
		this.getEventLevel();
		this.getAuthority();
		// this.getConfigureSetting();
		this.getSession();
		this.rendrData();
	}
	ngOnChanges() {
		this.rendrData();
	}
	buildForm() {
		this.awardsform = this.fbuild.group({
			eaw_id: '',
			eaw_ses_id: this.session.ses_id,
			eaw_activity_name: '',
			eaw_level_of_interest: '',
			eaw_authority: '',
			eaw_event_level: '',
			eaw_teacher_remark: '',
		});
	}
	getConfigureSetting() {
		this.sisService.getConfigureSetting({
			cos_process_type: this.processtypeService.getProcesstype()
		}).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.savedSettingsArray = result.data;
				for (const item of this.savedSettingsArray) {
					if (item.cos_tb_id === '7') {
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
	getActivity() {
		this.sisService.getActivity().subscribe((result: any) => {
			if (result) {
				this.activityArray = result.data;
			}
		});
	}
	getActivityClub() {
		this.sisService.getActivityClub().subscribe((result: any) => {
			if (result) {
				this.activityClubArray = result.data;
			}
		});
	}
	getLevelOfInterest() {
		this.sisService.getLevelOfInterest().subscribe((result: any) => {
			if (result) {
				this.levelOfIntrestArray = result.data;
			}
		});
	}
	getEventLevel() {
		this.sisService.getEventLevel().subscribe((result: any) => {
			if (result) {
				this.eventLevelArray = result.data;
			}
		});
	}
	getAuthority() {
		this.sisService.getAuthority().subscribe((result: any) => {
			if (result) {
				this.authorityArray = result.data;
			}
		});
	}
	getActivityName(value) {
		for (const item of this.activityArray) {
			if (item.act_id === value) {
				return item.act_name;
			}
		}
	}
	getActivityClubName(value) {
		for (const item of this.activityClubArray) {
			if (item.acl_id === value) {
				return item.acl_name;
			}
		}
	}
	getAuthorityName(value) {
		for (const item of this.authorityArray) {
			if (item.aut_id === value) {
				return item.aut_name;
			}
		}
	}
	getEventLevelName(value) {
		for (const item of this.eventLevelArray) {
			if (item.el_id === value) {
				return item.el_name;
			}
		}
	}
	getLevelofInterestName(value) {
		for (const item of this.levelOfIntrestArray) {
			if (item.loi_id === value) {
				return item.loi_name;
			}
		}
	}
	addAwardsList() {
		if (!this.editRequestFlag) {
			this.finalSpannedArray = [];
		}
		if (this.awardsform.valid) {
			this.finalAwardArray.push(this.awardsform.value);
			for (let i = 0; i < this.finalAwardArray.length; i++) {
				const spannArray: any[] = [];
				spannArray.push({
					act_name: this.finalAwardArray[i].eaw_activity_name,
					eaw_id: this.finalAwardArray[i].eaw_id,
					eaw_ses_id: this.finalAwardArray[i].eaw_ses_id,
					eaw_level_of_interest: this.finalAwardArray[i].eaw_level_of_interest,
					eaw_authority: this.finalAwardArray[i].eaw_authority,
					eaw_event_level: this.finalAwardArray[i].eaw_event_level,
					eaw_teacher_remark: this.finalAwardArray[i].eaw_teacher_remark,
				});
				for (let j = i + 1; j < this.finalAwardArray.length; j++) {
					if (this.finalAwardArray[i].eaw_activity_name === this.finalAwardArray[j].eaw_activity_name) {
						spannArray.push({
							act_name: this.finalAwardArray[i].eaw_activity_name,
							eaw_id: this.finalAwardArray[j].eaw_id,
							eaw_ses_id: this.finalAwardArray[j].eaw_ses_id,
							eaw_level_of_interest: this.finalAwardArray[j].eaw_level_of_interest,
							eaw_authority: this.finalAwardArray[j].eaw_authority,
							eaw_event_level: this.finalAwardArray[j].eaw_event_level,
							eaw_teacher_remark: this.finalAwardArray[j].eaw_teacher_remark,
						});
					}
				}
				const findex = this.finalSpannedArray.findIndex(f => f.act_name === this.finalAwardArray[i].eaw_activity_name);
				if (findex === -1) {
					this.finalSpannedArray.push({
						act_name: this.finalAwardArray[i].eaw_activity_name,
						details: spannArray
					});
				}
			}
			this.resetForm();
		} else {
			this.notif.showSuccessErrorMessage('Please fill all required fields', 'error');
		}
	}
	editAwardsList(value1, value2) {
		this.awardUpdateFlag = true;
		this.awardsValue1 = value1;
		this.awardsValue2 = value2;
		this.awardsform.patchValue({
			'eaw_activity_name': this.finalSpannedArray[value1].act_name,
			'eaw_level_of_interest': this.finalSpannedArray[value1].details[value2].eaw_level_of_interest,
			'eaw_event_level': this.finalSpannedArray[value1].details[value2].eaw_event_level,
			'eaw_authority': this.finalSpannedArray[value1].details[value2].eaw_authority,
			'eaw_teacher_remark': this.finalSpannedArray[value1].details[value2].eaw_teacher_remark,
			'eaw_id': this.finalSpannedArray[value1].details[value2].eaw_id,
			'eaw_ses_id': this.finalSpannedArray[value1].details[value2].eaw_ses_id
		});
	}
	updateAwardsList() {
		const findex = this.finalAwardArray.findIndex(f => f.eaw_activity_name === this.finalSpannedArray[this.awardsValue1].act_name
			&& f.eaw_id === this.finalSpannedArray[this.awardsValue1].details[this.awardsValue2].eaw_id
			&& f.eaw_ses_id === this.finalSpannedArray[this.awardsValue1].details[this.awardsValue2].eaw_ses_id);
		this.finalAwardArray[findex] = this.awardsform.value;
		if (this.awardsform.value.eaw_activity_name === this.finalSpannedArray[this.awardsValue1].act_name) {
			this.finalSpannedArray[this.awardsValue1].act_name = this.awardsform.value.eaw_activity_name;
			this.finalSpannedArray[this.awardsValue1].details[this.awardsValue2] = this.awardsform.value;
		} else {
			const spannArray: any[] = [];
			spannArray.push({
				act_name: this.awardsform.value.eaw_activity_name,
				eaw_id: this.awardsform.value.eaw_id,
				eaw_ses_id: this.awardsform.value.eaw_ses_id,
				eaw_level_of_interest: this.awardsform.value.eaw_level_of_interest,
				eaw_authority: this.awardsform.value.eaw_authority,
				eaw_event_level: this.awardsform.value.eaw_event_level,
				eaw_teacher_remark: this.awardsform.value.eaw_teacher_remark,
			});
			this.finalSpannedArray.splice(this.awardsValue1, 1);
			this.finalSpannedArray.push({
				act_name: this.awardsform.value.eaw_activity_name,
				details: spannArray
			});
		}
		this.notif.showSuccessErrorMessage('Awards List Updated', 'success');
		this.resetForm();
		this.awardUpdateFlag = false;
	}
	deleteAwardList(value1, value2) {
		if (this.finalSpannedArray[value1].details.length > 1) {
			this.finalSpannedArray[value1].details.splice(value2, 1);
		} else {
			this.finalSpannedArray.splice(value1, 1);
		}
		this.finalAwardArray.splice(value1, 1);
		this.resetForm();
	}
	getSession() {
		this.sisService.getSession().subscribe((result: any) => {
			if ((result.status === 'ok')) {
				this.sessionArray = result.data;
			}
		});
	}
	getSessionName(id) {
		const findex = this.sessionArray.findIndex(f => f.ses_id === id);
		if (findex !== -1) {
			return this.sessionArray[findex].ses_name;
		}
	}
	resetForm() {
		this.awardsform.patchValue({
			'eaw_activity_name': '',
			'eaw_authority': '',
			'eaw_event_level': '',
			'eaw_level_of_interest': '',
			'eaw_teacher_remark': '',
		});
	}
	rendrData() {
		this.finalAwardArray = [];
		this.finalAwardArray = this.skillsFormData;
		for (let i = 0; i < this.finalAwardArray.length; i++) {
			const spannArray: any[] = [];
			spannArray.push({
				act_name: this.finalAwardArray[i].eaw_activity_name,
				eaw_id: this.finalAwardArray[i].eaw_id,
				eaw_ses_id: this.finalAwardArray[i].eaw_ses_id,
				eaw_level_of_interest: this.finalAwardArray[i].eaw_level_of_interest,
				eaw_authority: this.finalAwardArray[i].eaw_authority,
				eaw_event_level: this.finalAwardArray[i].eaw_event_level,
				eaw_teacher_remark: this.finalAwardArray[i].eaw_teacher_remark,
			});
			for (let j = i + 1; j < this.finalAwardArray.length; j++) {
				if (this.finalAwardArray[i].eaw_activity_name === this.finalAwardArray[j].eaw_activity_name) {
					spannArray.push({
						act_name: this.finalAwardArray[i].eaw_activity_name,
						eaw_id: this.finalAwardArray[j].eaw_id,
						eaw_ses_id: this.finalAwardArray[j].eaw_ses_id,
						eaw_level_of_interest: this.finalAwardArray[j].eaw_level_of_interest,
						eaw_authority: this.finalAwardArray[j].eaw_authority,
						eaw_event_level: this.finalAwardArray[j].eaw_event_level,
						eaw_teacher_remark: this.finalAwardArray[j].eaw_teacher_remark,
					});
				}
			}
			const findex = this.finalSpannedArray.findIndex(f => f.act_name === this.finalAwardArray[i].eaw_activity_name);
			if (findex === -1) {
				this.finalSpannedArray.push({
					act_name: this.finalAwardArray[i].eaw_activity_name,
					details: spannArray
				});
			}
		}
	}
	capitalizeRemarks($event) {
		let remark: any = '';
		for (let i = 0; i < $event.target.value.length ; i++) {
			if (i === 0) {
			remark  = $event.target.value.charAt(i).toUpperCase();
			} else {
				remark =  $event.target.value;
			}
		}
		this.awardsform.patchValue({
		'eaw_teacher_remark': remark
		});
	}
}
export class ConfirmValidParentMatcher implements ErrorStateMatcher {
	isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
		return control && control.invalid && (control.dirty || control.touched);
	}
}
