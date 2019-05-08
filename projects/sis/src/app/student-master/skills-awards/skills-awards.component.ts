import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { CommonAPIService } from '../../_services/index';
import { SisService, ProcesstypeService } from '../../_services/index';
import { DynamicComponent } from '../../sharedmodule/dynamiccomponent';
import { ErrorStateMatcher } from '@angular/material';
import { FormEnabledService } from '../../sharedmodule/dynamic-content/formEnabled.service';
import { DatePipe } from '@angular/common';
import { ConfirmValidParentMatcher } from '../../ConfirmValidParentMatcher';
@Component({
	selector: 'app-skills-awards',
	templateUrl: './skills-awards.component.html',
	styleUrls: ['./skills-awards.component.scss']
})
export class SkillsAwardsComponent extends DynamicComponent implements OnInit {
	@ViewChild('editReference') editReference;
	confirmValidParentMatcher = new ConfirmValidParentMatcher();
	activityform: FormGroup;
	awardsform: FormGroup;
	activityUpdateFlag = false;
	awardUpdateFlag = false;
	activityArray: any[] = [];
	activityClubArray: any[] = [];
	levelOfIntrestArray: any[] = [];
	eventLevelArray: any[] = [];
	skillsValue: any;
	awardsValue: any;
	authorityArray: any[] = [];
	finalActivityArray: any[] = [];
	finalActivityArray2: any[] = [];
	finalAwardArray: any[] = [];
	finalAwardArray2: any[] = [];
	currentUser: any;
	addOnly = false;
	viewOnly = false;
	editOnly = false;
	editFlag = false;
	editRequestFlag = false;
	saveFlag = false;
	skillAwardsArray: any[] = [];
	login_id: any;
	finalSibReqArray: any[] = [];
	finalSibReqArray2: any[] = [];
	finalArray: any[] = [];
	reqObj: any = {};
	savedSettingsArray: any[] = [];
	settingsArray: any[] = [];
	constructor(private fbuild: FormBuilder, private notif: CommonAPIService, private sisService: SisService,
		private formEnabledService: FormEnabledService,
		private processtypeService: ProcesstypeService) {
		super();
	}

	ngOnInit() {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.buildForm();
		this.getActivity();
		this.getActivityClub();
		this.getLevelOfInterest();
		this.getEventLevel();
		this.getAuthority();
		this.getConfigureSetting();
		this.notif.studentData.subscribe((data: any) => {
			if (data && data.au_login_id) {
				this.login_id = data.au_login_id;
				const processType = this.processtypeService.getProcesstype();
				if (processType === '2' || processType === '3' || processType === '4') {
					this.getSkillsAwards(this.login_id);
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
		this.activityform = this.fbuild.group({
			esk_id: '',
			esk_activity_name: '0',
			esk_level_of_interest: '0',
			esk_activity_club: '0',
			esk_enrollment_duration: '',
			esk_teacher_remark: '',
		});
		this.awardsform = this.fbuild.group({
			eaw_id: '',
			eaw_activity_name: '0',
			eaw_level_of_interest: '0',
			eaw_authority: '0',
			eaw_event_level: '0',
			eaw_teacher_remark: '',
		});
	}
	openEditDialog = (data) => this.editReference.openModal(data);
	addActivityList() {
		if (this.activityform.valid) {
			this.finalActivityArray.push(this.activityform.value);
			this.activityform.patchValue({
				'esk_activity_name': '',
				'esk_activity_club': '',
				'esk_level_of_interest': '',
				'esk_enrollment_duration': '',
				'esk_teacher_remark': ''
			});
		} else {
			this.notif.showSuccessErrorMessage('Please fill all required fields', 'error');
		}
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
	editActivityList(value) {
		this.activityUpdateFlag = true;
		this.skillsValue = value;
		this.activityform.patchValue({
			'esk_activity_name': this.finalActivityArray[value].esk_activity_name,
			'esk_activity_club': this.finalActivityArray[value].esk_activity_club,
			'esk_level_of_interest': this.finalActivityArray[value].esk_level_of_interest,
			'esk_enrollment_duration': this.finalActivityArray[value].esk_enrollment_duration,
			'esk_teacher_remark': this.finalActivityArray[value].esk_teacher_remark,
			'esk_id': this.finalActivityArray[value].esk_id
		});
	}
	updateActivityList() {
		this.finalActivityArray[this.skillsValue] = this.activityform.value;
		this.notif.showSuccessErrorMessage('Activity List Updated', 'success');
		this.activityform.patchValue({
			'esk_activity_name': '',
			'esk_activity_club': '',
			'esk_level_of_interest': '',
			'esk_enrollment_duration': '',
			'esk_teacher_remark': ''
		});
		this.activityUpdateFlag = false;
	}
	addAwardsList() {
		if (this.awardsform.valid) {
			this.finalAwardArray.push(this.awardsform.value);
			this.awardsform.patchValue({
				'eaw_activity_name': '',
				'eaw_authority': '',
				'eaw_event_level': '',
				'eaw_level_of_interest': '',
				'eaw_teacher_remark': ''
			});
		} else {
			this.notif.showSuccessErrorMessage('Please fill all required fields', 'error');
		}
	}
	editAwardsList(value) {
		this.awardUpdateFlag = true;
		this.awardsValue = value;
		this.awardsform.patchValue({
			'eaw_activity_name': this.finalAwardArray[value].eaw_activity_name,
			'eaw_level_of_interest': this.finalAwardArray[value].eaw_level_of_interest,
			'eaw_event_level': this.finalAwardArray[value].eaw_event_level,
			'eaw_authority': this.finalAwardArray[value].eaw_authority,
			'eaw_teacher_remark': this.finalAwardArray[value].eaw_teacher_remark,
			'eaw_id': this.finalAwardArray[value].eaw_id
		});
	}
	updateAwardsList() {
		this.finalAwardArray[this.awardsValue] = this.awardsform.value;
		this.notif.showSuccessErrorMessage('Awards List Updated', 'success');
		this.awardsform.reset();
		this.awardUpdateFlag = false;
	}
	deleteActivityList(value) {
		this.finalActivityArray.splice(value, 1);
	}
	deleteAwardList(value) {
		this.finalAwardArray.splice(value, 1);
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
	insertSkillsAwards() {
		if (this.context.studentdetails.studentdetailsform.valid) {
			this.context.studentdetails.studentdetailsform.value.au_process_type = this.context.processType;
			this.sisService.updateStudentDetails(this.context.studentdetails.studentdetailsform.value).subscribe((result1: any) => {
				if (result1.status === 'ok') {
				}
			});
		}
		this.sisService.insertSkillsAwards({
			login_id: this.context.studentdetails.studentdetailsform.value.au_login_id,
			skills: this.finalActivityArray,
			awards: this.finalAwardArray
		}).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.formEnabledService.setFormEnabled(this.formEnabledService.getLastValue() + 1);
				this.notif.showSuccessErrorMessage('Skills and awards added', 'success');
				this.notif.renderTab.next({ tabMove: true });
			} else {
				this.notif.showSuccessErrorMessage(result.data, 'error');
			}
		});
	}
	enableEditing() {
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
	getSkillsAwards(login_id) {
		if (login_id) {
			this.finalAwardArray = [];
			this.finalActivityArray = [];
			this.finalActivityArray2 = [];
			this.finalAwardArray2 = [];
			this.skillAwardsArray = [];
			this.sisService.getSkillAwards({
				login_id: login_id
			}).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.skillAwardsArray.push(result.awards);
					this.skillAwardsArray.push(result.skills);
					if (this.skillAwardsArray[0]) {
						for (const item of this.skillAwardsArray[0]) {
							this.finalAwardArray.push(item);
							this.finalAwardArray2.push(item);
						}
					}
					if (this.skillAwardsArray[1]) {
						for (const item of this.skillAwardsArray[1]) {
							this.finalActivityArray.push(item);
							this.finalActivityArray2.push(item);
						}
					}
				} else {
					this.finalAwardArray = [];
					this.finalAwardArray2 = [];
					this.finalActivityArray = [];
					this.finalActivityArray2 = [];
					this.skillAwardsArray = [];
				}
			});
		}
	}
	updateSkillsAwards(isview) {
		if (this.context.studentdetails.studentdetailsform.valid) {
			this.context.studentdetails.studentdetailsform.value.au_process_type = this.context.processType;
			this.sisService.updateStudentDetails(this.context.studentdetails.studentdetailsform.value).subscribe((result1: any) => {
				if (result1.status === 'ok') {
				}
			});
		}
		this.sisService.updateSkillsAwards({
			login_id: this.context.studentdetails.studentdetailsform.value.au_login_id,
			skills: this.finalActivityArray,
			awards: this.finalAwardArray
		}).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.notif.showSuccessErrorMessage('Skills and awards updated', 'success');
				this.getSkillsAwards(this.login_id);
				if (isview) {
					// this.commonAPIService.studentData.next(this.context.studentdetails.studentdetailsform.value.au_enrollment_id);
					this.notif.reRenderForm.next({ viewMode: true, editMode: false, deleteMode: false, addMode: false });
				}
			} else {
				this.notif.showSuccessErrorMessage(result.data, 'error');
			}
		});
	}
	checkFormChangedValue() {
		let i = 0;
		this.finalSibReqArray = [];
		this.finalSibReqArray2 = [];
		this.finalArray = [];
		const datepipe = new DatePipe('en-US');
		for (const item of this.finalActivityArray) {
			if (item.esk_id === '') {
				const sibReqArray: any[] = [];
				const fieldArray: any[] = [];
				const oldFieldValue: any[] = [];
				const newFieldValue: any[] = [];
				Object.keys(this.finalActivityArray[i]).forEach(key => {
					if (key !== 'esk_id') {
						fieldArray.push(key);
						oldFieldValue.push('');
						newFieldValue.push(this.finalActivityArray[i][key]);
					}
				});
				sibReqArray.push({
					rff_where_id: 'esk_id',
					rff_where_value: '',
					rff_field_name: fieldArray,
					rff_new_field_value: newFieldValue,
					rff_old_field_value: oldFieldValue,
				});
				this.finalSibReqArray.push({ item: sibReqArray });
			} else {
				const sibReqArray: any[] = [];
				Object.keys(this.finalActivityArray[i]).forEach((key: any) => {
					if (key !== 'esk_id' && key !== 'esk_login_id' && key !== 'esk_status') {
						if (this.finalActivityArray[i][key] !== this.finalActivityArray2[i][key]) {
							sibReqArray.push({
								rff_where_id: 'esk_id',
								rff_where_value: this.finalActivityArray[i]['esk_id'],
								rff_field_name: key,
								rff_new_field_value: this.finalActivityArray[i][key],
								rff_old_field_value: this.finalActivityArray2[i][key],
							});
						}
					}
				});
				this.finalSibReqArray.push({ item: sibReqArray });
			}
			i++;
		}
		for (const sib of this.finalSibReqArray) {
			for (const titem of sib.item) {
				this.finalArray.push(titem);
			}
		}
		let n = 0;
		for (const item of this.finalAwardArray) {
			if (item.eaw_id === '') {
				const sibReqArray: any[] = [];
				const fieldArray: any[] = [];
				const oldFieldValue: any[] = [];
				const newFieldValue: any[] = [];
				Object.keys(this.finalAwardArray[n]).forEach(key => {
					if (key !== 'eaw_id') {
						fieldArray.push(key);
						oldFieldValue.push('');
						newFieldValue.push(this.finalAwardArray[n][key]);
					}
				});
				sibReqArray.push({
					rff_where_id: 'eaw_id',
					rff_where_value: '',
					rff_field_name: fieldArray,
					rff_new_field_value: newFieldValue,
					rff_old_field_value: oldFieldValue,
				});
				this.finalSibReqArray2.push({ item: sibReqArray });
			} else {
				const sibReqArray: any[] = [];
				Object.keys(this.finalAwardArray[n]).forEach((key: any) => {
					if (key !== 'eaw_id' && key !== 'eaw_login_id' && key !== 'eaw_status') {
						if (this.finalAwardArray[n][key] !== this.finalAwardArray2[n][key]) {
							sibReqArray.push({
								rff_where_id: 'eaw_id',
								rff_where_value: this.finalAwardArray[n]['eaw_id'],
								rff_field_name: key,
								rff_new_field_value: this.finalAwardArray[n][key],
								rff_old_field_value: this.finalAwardArray2[n][key],
							});
						}
					}
				});
				this.finalSibReqArray2.push({ item: sibReqArray });
			}
			n++;
		}
		for (const sib of this.finalSibReqArray2) {
			for (const titem of sib.item) {
				this.finalArray.push(titem);
			}
		}
		this.reqObj = {
			req_login_id: this.login_id,
			req_process_type: this.context.processType,
			req_tab_id: this.formEnabledService.getTabid('Skills & Awards'),
			req_priority: '',
			req_remarks: '',
			req_reason: '',
			req_date: datepipe.transform(new Date, 'yyyy-MM-dd'),
			req_param: []
		};
	}
	editConfirm($event) {
		this.viewOnly = true;
		this.editRequestFlag = false;
		this.saveFlag = false;
	}

	cancelForm() {
		if (this.addOnly) {
			this.notif.reRenderForm.next({ reRenderForm: true, viewMode: true, editMode: false, deleteMode: false, addMode: false });
		} else if (this.saveFlag || this.editRequestFlag) {
			this.notif.reRenderForm.next({ viewMode: true, editMode: false, deleteMode: false, addMode: false });
		}
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
	isExistUserAccessMenu(actionT) {
		return this.context.studentdetails.isExistUserAccessMenu(actionT);
	}
}
// export class ConfirmValidParentMatcher implements ErrorStateMatcher {
// 	isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
// 		return control && control.invalid && (control.dirty || control.touched);
// 	}
// }
