import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroupDirective, FormControl, NgForm } from '@angular/forms';
import { SisService, CommonAPIService } from '../../_services/index';
import { MatTableDataSource, MatPaginator, MatSort, ErrorStateMatcher } from '@angular/material';
import { ConfigElement } from './system.model';
import { ConfirmValidParentMatcher } from '../../ConfirmValidParentMatcher';
@Component({
	selector: 'app-systeminfo',
	templateUrl: './systeminfo.component.html',
	styleUrls: ['./systeminfo.component.scss']
})

export class SysteminfoComponent implements OnInit, AfterViewInit {
	@ViewChild('deleteModal') deleteModal;
	@ViewChild('paginator') paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	confirmValidParentMatcher = new ConfirmValidParentMatcher();
	deleteMessage: any = 'Are You Sure you want to Delete...?';
	formGroupArray: any[] = [];
	configValue: any;
	vaccinationArray: any[] = [];
	CONFIG_ELEMENT_DATA: ConfigElement[] = [];
	configDataSource = new MatTableDataSource<ConfigElement>(this.CONFIG_ELEMENT_DATA);
	displayedColumns: any[] = ['position', 'name', 'alias', 'action', 'modify'];
	firstHeaderArray: any[] = ['Blood Group', 'Document Name',
		'House Name', 'Medicine Name',
		'Religion Name', 'Mother Tongue',
		'Qualification', 'Occupation',
		'Income Range', 'Vaccination',
		'Age', 'Activity', 'Level of Intrest', 'Event Level',
		'Activity Club', 'Authority', 'Area', 'Reason Title', 'Session Name', 'Category', 'Nationality'];
	secondHeaderArray: any[] = ['Alias', 'Required',
		'Alias', 'Type',
		'Alias', 'Alias',
		'Alias', 'Alias',
		'', 'Alias', 'Vaccinations', 'Alias', 'Alias', 'Alias', 'Alias',
		'Alias', 'Alias', 'Description', 'Alias', 'Alias', 'Alias'];
	configFlag = false;
	updateFlag = false;
	requiredArray: any[] = [{ docreq_is_required: '1', docreq_is_required_name: 'Yes' },
	{ docreq_is_required: '0', docreq_is_required_name: 'No' }];
	reasonTypeArray: any[] = [
		{ reason_type: '1', reason_type_desc: 'Question' },
		{ reason_type: '2', reason_type_desc: 'Question Paper' },
		{ reason_type: '3', reason_type_desc: 'Question Template' },
		{ reason_type: '4', reason_type_desc: 'Education Details' },
		{ reason_type: '5', reason_type_desc: 'Edit Request' },
		{ reason_type: '6', reason_type_desc: 'Suspension' },
		{ reason_type: '7', reason_type_desc: 'Change Enrolment Number' },
		{ reason_type: '8', reason_type_desc: 'Change Enrolment Status' },
		{ reason_type: '9', reason_type_desc: 'Request SLC/TC' },
		{ reason_type: '10', reason_type_desc: 'SLC/TC' }];
	reason_type: any = '1';
	constructor(private fbuild: FormBuilder,
		private sisService: SisService,
		private commonService: CommonAPIService) { }

	ngOnInit() {
		this.buildForm();
		this.getVaccinations();
	}
	ngAfterViewInit() {
		this.configDataSource.sort = this.sort;
		this.configDataSource.paginator = this.paginator;
	}
	openDeleteDialog = (data) => this.deleteModal.openModal(data);
	buildForm() {
		this.formGroupArray = [{
			formGroup: this.fbuild.group({
				bg_id: '',
				bg_name: '',
				bg_alias: '',
				bg_status: ''
			})
		},
		{
			formGroup: this.fbuild.group({
				docreq_name: '',
				docreq_alias: '',
				docreq_status: '',
				docreq_id: '',
				docreq_is_required: ''
			})
		},
		{
			formGroup: this.fbuild.group({
				hou_id: '',
				hou_house_name: '',
				hou_alias: '',
				hou_status: ''
			})
		},
		{
			formGroup: this.fbuild.group({
				med_id: '',
				med_name: '',
				med_type: '',
				med_status: ''
			})
		},
		{
			formGroup: this.fbuild.group({
				rel_id: '',
				rel_name: '',
				rel_alias: '',
				rel_status: ''
			})
		},
		{
			formGroup: this.fbuild.group({
				mt_id: '',
				mt_name: '',
				mt_alias: '',
				mt_status: ''
			})
		},
		{
			formGroup: this.fbuild.group({
				qlf_id: '',
				qlf_name: '',
				qlf_alias: '',
				qlf_status: ''
			})
		},
		{
			formGroup: this.fbuild.group({
				ocpt_id: '',
				ocpt_name: '',
				ocpt_alias: '',
				ocpt_status: ''
			})
		},
		{
			formGroup: this.fbuild.group({
				ai_from: '',
				ai_to: '',
				ai_id: '',
				ai_from_to: '',
				ai_status: ''
			})
		},
		{
			formGroup: this.fbuild.group({
				vac_id: '',
				vac_name: '',
				vac_alias: '',
				vac_status: ''
			})
		},
		{
			formGroup: this.fbuild.group({
				vd_id: '',
				vd_name: '',
				vd_status: '',
				vac_id: [],
				vd_alias: ''
			})
		},
		{
			formGroup: this.fbuild.group({
				act_id: '',
				act_name: '',
				act_alias: '',
				act_status: ''
			})
		},
		{
			formGroup: this.fbuild.group({
				loi_id: '',
				loi_name: '',
				loi_alias: '',
				loi_status: ''
			})
		},
		{
			formGroup: this.fbuild.group({
				el_id: '',
				el_name: '',
				el_alias: '',
				el_status: ''
			})
		},
		{
			formGroup: this.fbuild.group({
				acl_id: '',
				acl_name: '',
				acl_alias: '',
				acl_status: ''
			})
		},
		{
			formGroup: this.fbuild.group({
				aut_id: '',
				aut_name: '',
				aut_alias: '',
				aut_status: ''
			})
		},
		{
			formGroup: this.fbuild.group({
				ar_id: '',
				ar_name: '',
				ar_alias: '',
				ar_status: ''
			})
		},
		{
			formGroup: this.fbuild.group({
				reason_id: '',
				reason_title: '',
				login_id: '',
				reason_desc: '',
				reason_type: '1',
				reason_status: '',
			})
		},
		{
			formGroup: this.fbuild.group({
				ses_id: '',
				ses_from: '',
				ses_to: '',
				ses_name: '',
				ses_alias: '',
				ses_status: ''
			})
		},
		{
			formGroup: this.fbuild.group({
				cat_id: '',
				cat_name: '',
				cat_alias: '',
				cat_status: ''
			})
		},
		{
			formGroup: this.fbuild.group({
				nat_id: '',
				nat_name: '',
				nat_alias: '',
				nat_status: ''
			})
		}];
	}
	loadConfiguration($event) {
		this.configFlag = false;
		this.updateFlag = false;
		this.configValue = $event.value;
		if (Number(this.configValue) === 1) {
			this.getBloodGroupAll(this);
			this.configFlag = true;
		} else if (Number(this.configValue) === 2) {
			this.getDocumentsAll(this);
			this.configFlag = true;
		} else if (Number(this.configValue) === 3) {
			this.getHouses(this);
			this.configFlag = true;
		} else if (Number(this.configValue) === 4) {
			this.getMedications(this);
			this.configFlag = true;
		} else if (Number(this.configValue) === 5) {
			this.getReligions(this);
			this.configFlag = true;
		} else if (Number(this.configValue) === 6) {
			this.getMotherTongue(this);
			this.configFlag = true;
		} else if (Number(this.configValue) === 7) {
			this.getQualifications(this);
			this.configFlag = true;
		} else if (Number(this.configValue) === 8) {
			this.getOccupationType(this);
			this.configFlag = true;
		} else if (Number(this.configValue) === 9) {
			this.getAnnualIncome(this);
			this.configFlag = true;
		} else if (Number(this.configValue) === 10) {
			this.getVaccinationAll(this);
			this.configFlag = true;
		} else if (Number(this.configValue) === 11) {
			this.getVaccinationByDuration(this);
			this.configFlag = true;
		} else if (Number(this.configValue) === 12) {
			this.getActivityAll(this);
			this.configFlag = true;
		} else if (Number(this.configValue) === 13) {
			this.getLevelOfIntrestAll(this);
			this.configFlag = true;
		} else if (Number(this.configValue) === 14) {
			this.getEventLevelAll(this);
			this.configFlag = true;
		} else if (Number(this.configValue) === 15) {
			this.getActivityClubAll(this);
			this.configFlag = true;
		} else if (Number(this.configValue) === 16) {
			this.getAuthorityAll(this);
			this.configFlag = true;
		} else if (Number(this.configValue) === 17) {
			this.getAreaAll(this);
			this.configFlag = true;
		} else if (Number(this.configValue) === 18) {
			this.getReasonsAll(this);
			this.configFlag = true;
		} else if (Number(this.configValue) === 19) {
			this.getSessionsAll(this);
			this.configFlag = true;
		} else if (Number(this.configValue) === 20) {
			this.getCategoryAll(this);
			this.configFlag = true;
		} else if (Number(this.configValue) === 21) {
			this.getNationalityAll(this);
			this.configFlag = true;
		}
	}
	getActiveStatus(value: any) {
		if (Number(this.configValue) === 1) {
			if (value.bg_status === '1') {
				return true;
			}
		} else if (Number(this.configValue) === 2) {
			if (value.docreq_status === '1') {
				return true;
			}
		} else if (Number(this.configValue) === 3) {
			if (value.hou_status === '1') {
				return true;
			}
		} else if (Number(this.configValue) === 4) {
			if (value.med_status === '1') {
				return true;
			}
		} else if (Number(this.configValue) === 5) {
			if (value.rel_status === '1') {
				return true;
			}
		} else if (Number(this.configValue) === 6) {
			if (value.mt_status === '1') {
				return true;
			}
		} else if (Number(this.configValue) === 7) {
			if (value.qlf_status === '1') {
				return true;
			}
		} else if (Number(this.configValue) === 8) {
			if (value.ocpt_status === '1') {
				return true;
			}
		} else if (Number(this.configValue) === 9) {
			if (value.ai_status === '1') {
				return true;
			}
		} else if (Number(this.configValue) === 10) {
			if (value.vac_status === '1') {
				return true;
			}
		} else if (Number(this.configValue) === 11) {
			if (value.vd_status === '1') {
				return true;
			}
		} else if (Number(this.configValue) === 12) {
			if (value.act_status === '1') {
				return true;
			}
		} else if (Number(this.configValue) === 13) {
			if (value.loi_status === '1') {
				return true;
			}
		} else if (Number(this.configValue) === 14) {
			if (value.el_status === '1') {
				return true;
			}
		} else if (Number(this.configValue) === 15) {
			if (value.acl_status === '1') {
				return true;
			}
		} else if (Number(this.configValue) === 16) {
			if (value.aut_status === '1') {
				return true;
			}
		} else if (Number(this.configValue) === 17) {
			if (value.ar_status === '1') {
				return true;
			}
		} else if (Number(this.configValue) === 18) {
			if (value.reason_status === '1') {
				return true;
			}
		} else if (Number(this.configValue) === 19) {
			if (value.ses_status === '1') {
				return true;
			}
		} else if (Number(this.configValue) === 20) {
			if (value.cat_status === '1') {
				return true;
			}
		} else if (Number(this.configValue) === 21) {
			if (value.nat_status === '1') {
				return true;
			}
		}
	}
	toggleStatus(value: any) {
		if (Number(this.configValue) === 1) {
			if (value.bg_status === '1') {
				value.bg_status = '0';
			} else {
				value.bg_status = '1';
			}
			this.sisService.updateBloodGroup(value).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.commonService.showSuccessErrorMessage('Status Changed', 'success');
					this.getBloodGroupAll(this);
				}
			});
		} else if (Number(this.configValue) === 2) {
			if (value.docreq_status === '1') {
				value.docreq_status = '0';
			} else {
				value.docreq_status = '1';
			}
			this.sisService.updateDocumentRequired(value).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.commonService.showSuccessErrorMessage('Status Changed', 'success');
					this.getDocumentsAll(this);
				}
			});
		} else if (Number(this.configValue) === 3) {
			if (value.hou_status === '1') {
				value.hou_status = '0';
			} else {
				value.hou_status = '1';
			}
			this.sisService.updateHouses(value).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.commonService.showSuccessErrorMessage('Status Changed', 'success');
					this.getHouses(this);
				}
			});
		} else if (Number(this.configValue) === 4) {
			if (value.med_status === '1') {
				value.med_status = '0';
			} else {
				value.med_status = '1';
			}
			this.sisService.updateMedications(value).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.commonService.showSuccessErrorMessage('Status Changed', 'success');
					this.getMedications(this);
				}
			});
		} else if (Number(this.configValue) === 5) {
			if (value.rel_status === '1') {
				value.rel_status = '0';
			} else {
				value.rel_status = '1';
			}
			this.sisService.updateReligionDetails(value).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.commonService.showSuccessErrorMessage('Status Changed', 'success');
					this.getReligions(this);
				}
			});
		} else if (Number(this.configValue) === 6) {
			if (value.mt_status === '1') {
				value.mt_status = '0';
			} else {
				value.mt_status = '1';
			}
			this.sisService.updateMotherTongue(value).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.commonService.showSuccessErrorMessage('Status Changed', 'success');
					this.getMotherTongue(this);
				}
			});
		} else if (Number(this.configValue) === 7) {
			if (value.qlf_status === '1') {
				value.qlf_status = '0';
			} else {
				value.qlf_status = '1';
			}
			this.sisService.updateQualifications(value).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.commonService.showSuccessErrorMessage('Status Changed', 'success');
					this.getQualifications(this);
				}
			});
		} else if (Number(this.configValue) === 8) {
			if (value.ocpt_status === '1') {
				value.ocpt_status = '0';
			} else {
				value.ocpt_status = '1';
			}
			this.sisService.updateOccupationType(value).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.commonService.showSuccessErrorMessage('Status Changed', 'success');
					this.getOccupationType(this);
				}
			});
		} else if (Number(this.configValue) === 9) {
			if (value.ai_status === '1') {
				value.ai_status = '0';
			} else {
				value.ai_status = '1';
			}
			this.sisService.updateAnnualIncome(value).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.commonService.showSuccessErrorMessage('Status Changed', 'success');
					this.getAnnualIncome(this);
				}
			});
		} else if (Number(this.configValue) === 10) {
			if (value.vac_status === '1') {
				value.vac_status = '0';
			} else {
				value.vac_status = '1';
			}
			this.sisService.updateVaccinations(value).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.commonService.showSuccessErrorMessage('Status Changed', 'success');
					this.getVaccinationAll(this);
				}
			});
		} else if (Number(this.configValue) === 11) {
			if (value.vd_status === '1') {
				value.vd_status = '0';
			} else {
				value.vd_status = '1';
			}
			const param: any = {};
			param.vd_id = value.vd_id;
			param.vd_name = value.vd_name;
			param.vd_status = value.vd_status;
			const vac_id: any[] = [];
			for (const item of value.vac_id_list) {
				vac_id.push(item.vac_id);
			}
			param.vac_id = JSON.stringify(vac_id);
			this.sisService.updateVaccinationByDuration(param).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.commonService.showSuccessErrorMessage('Status Changed', 'success');
					this.getVaccinationByDuration(this);
				}
			});
		} else if (Number(this.configValue) === 12) {
			if (value.act_status === '1') {
				value.act_status = '0';
			} else {
				value.act_status = '1';
			}
			this.sisService.updateActivity(value).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.commonService.showSuccessErrorMessage('Status Changed', 'success');
					this.getActivityAll(this);
				}
			});
		} else if (Number(this.configValue) === 13) {
			if (value.loi_status === '1') {
				value.loi_status = '0';
			} else {
				value.loi_status = '1';
			}
			this.sisService.updateLevelOfInterest(value).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.commonService.showSuccessErrorMessage('Status Changed', 'success');
					this.getLevelOfIntrestAll(this);
				}
			});
		} else if (Number(this.configValue) === 14) {
			if (value.el_status === '1') {
				value.el_status = '0';
			} else {
				value.el_status = '1';
			}
			this.sisService.updateEventLevel(value).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.commonService.showSuccessErrorMessage('Status Changed', 'success');
					this.getEventLevelAll(this);
				}
			});
		} else if (Number(this.configValue) === 15) {
			if (value.acl_status === '1') {
				value.acl_status = '0';
			} else {
				value.acl_status = '1';
			}
			this.sisService.updateActivityClub(value).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.commonService.showSuccessErrorMessage('Status Changed', 'success');
					this.getActivityClubAll(this);
				}
			});
		} else if (Number(this.configValue) === 16) {
			if (value.aut_status === '1') {
				value.aut_status = '0';
			} else {
				value.aut_status = '1';
			}
			this.sisService.updateAuthority(value).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.commonService.showSuccessErrorMessage('Status Changed', 'success');
					this.getAuthorityAll(this);
				}
			});
		} else if (Number(this.configValue) === 17) {
			if (value.ar_status === '1') {
				value.ar_status = '0';
			} else {
				value.ar_status = '1';
			}
			this.sisService.updateArea(value).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.commonService.showSuccessErrorMessage('Status Changed', 'success');
					this.getAreaAll(this);
				}
			});
		} else if (Number(this.configValue) === 18) {
			if (value.reason_status === '1') {
				value.reason_status = '0';
			} else {
				value.reason_status = '1';
			}
			let param: any = {};
			param = value;
			param.login_id = (JSON.parse(localStorage.getItem('currentUser'))).login_id;
			this.sisService.updateReason(value).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.commonService.showSuccessErrorMessage('Status Changed', 'success');
					this.getReasonsAll(this);
				}
			});
		} else if (Number(this.configValue) === 19) {
			if (value.ses_status === '1') {
				value.ses_status = '0';
			} else {
				value.ses_status = '1';
			}
			this.sisService.updateSession(value).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.commonService.showSuccessErrorMessage('Status Changed', 'success');
					this.getSessionsAll(this);
				}
			});
		} else if (Number(this.configValue) === 20) {
			if (value.cat_status === '1') {
				value.cat_status = '0';
			} else {
				value.cat_status = '1';
			}
			this.sisService.updatecategory(value).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.commonService.showSuccessErrorMessage('Status Changed', 'success');
					this.getCategoryAll(this);
				}
			});
		} else if (Number(this.configValue) === 21) {
			if (value.nat_status === '1') {
				value.nat_status = '0';
			} else {
				value.nat_status = '1';
			}
			this.sisService.updatenationality(value).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.commonService.showSuccessErrorMessage('Status Changed', 'success');
					this.getNationalityAll(this);
				}
			});
		}
	}
	deleteConfirm({ data, type }) {
		switch (type) {
			case '1':
				this.deleteEntry(data, 'deleteBloodGroup', this.getBloodGroupAll);
				break;
			case '2':
				this.deleteEntry(data, 'deleteDocumentRequired', this.getDocumentsAll);
				break;
			case '3':
				this.deleteEntry(data, 'deleteHouses', this.getHouses);
				break;
			case '4':
				this.deleteEntry(data, 'deleteMedications', this.getMedications);
				break;
			case '5':
				this.deleteEntry(data, 'deleteReligionDetails', this.getReligions);
				break;
			case '6':
				this.deleteEntry(data, 'deleteMotherTongue', this.getMotherTongue);
				break;
			case '7':
				this.deleteEntry(data, 'deleteQualifications', this.getQualifications);
				break;
			case '8':
				this.deleteEntry(data, 'deleteOccupationType', this.getOccupationType);
				break;
			case '9':
				this.deleteEntry(data, 'deleteAnnualIncome', this.getAnnualIncome);
				break;
			case '10':
				this.deleteEntry(data, 'deleteVaccinations', this.getVaccinationAll);
				break;
			case '11':
				this.deleteEntry(data, 'deleteVaccinationDuration', this.getVaccinationByDuration);
				break;
			case '12':
				this.deleteEntry(data, 'deleteActivity', this.getActivityAll);
				break;
			case '13':
				this.deleteEntry(data, 'deleteLevelOfInterest', this.getLevelOfIntrestAll);
				break;
			case '14':
				this.deleteEntry(data, 'deleteEventLevel', this.getEventLevelAll);
				break;
			case '15':
				this.deleteEntry(data, 'deleteActivityClub', this.getActivityClubAll);
				break;
			case '16':
				this.deleteEntry(data, 'deleteAuthority', this.getAuthorityAll);
				break;
			case '17':
				this.deleteEntry(data, 'deleteArea', this.getAreaAll);
				break;
			case '18':
				this.deleteEntry(data, 'deleteReason', this.getReasonsAll);
				break;
			case '19':
				this.deleteEntry(data, 'deleteSession', this.getSessionsAll);
				break;
			case '20':
				this.deleteEntry(data, 'deletecategory', this.getCategoryAll);
				break;
			case '21':
				this.deleteEntry(data, 'deletenationality', this.getNationalityAll);
				break;
		}
	}
	getVaccinations() {
		this.sisService.getVaccinations().subscribe((result: any) => {
			if (result.status === 'ok') {
				this.vaccinationArray = result.data;
			}
		});
	}
	getBloodGroupAll(that) {
		that.CONFIG_ELEMENT_DATA = [];
		that.configDataSource = new MatTableDataSource<ConfigElement>(that.CONFIG_ELEMENT_DATA);
		that.sisService.getBloodGroup().subscribe((result: any) => {
			if (result.status === 'ok') {
				let pos = 1;
				for (const item of result.data) {
					that.CONFIG_ELEMENT_DATA.push({
						position: pos,
						name: item.bg_name,
						alias: item.bg_alias,
						action: item
					});
					pos++;
				}
				that.configDataSource = new MatTableDataSource<ConfigElement>(that.CONFIG_ELEMENT_DATA);
				that.configDataSource.paginator = that.paginator;
				that.sort.sortChange.subscribe(() => that.paginator.pageIndex = 0);
				that.configDataSource.sort = that.sort;
			}
		});
	}
	getDocumentsAll(that) {
		that.CONFIG_ELEMENT_DATA = [];
		that.configDataSource = new MatTableDataSource<ConfigElement>(that.CONFIG_ELEMENT_DATA);
		that.sisService.getDocumentRequired().subscribe((result: any) => {
			let pos = 1;
			if (result.status === 'ok') {
				for (const item of result.data) {
					that.CONFIG_ELEMENT_DATA.push({
						position: pos,
						name: item.docreq_name,
						alias: item.docreq_is_required === '0' ? 'No' : 'Yes',
						action: item
					});
					pos++;
				}
				that.configDataSource = new MatTableDataSource<ConfigElement>(that.CONFIG_ELEMENT_DATA);
				that.configDataSource.paginator = that.paginator;
				that.sort.sortChange.subscribe(() => that.paginator.pageIndex = 0);
				that.configDataSource.sort = that.sort;
			}
		});
	}
	getHouses(that) {
		that.CONFIG_ELEMENT_DATA = [];
		that.configDataSource = new MatTableDataSource<ConfigElement>(that.CONFIG_ELEMENT_DATA);
		that.sisService.getHouses().subscribe((result: any) => {
			let pos = 1;
			if (result.status === 'ok') {
				for (const item of result.data) {
					that.CONFIG_ELEMENT_DATA.push({
						position: pos,
						name: item.hou_house_name,
						alias: item.hou_alias,
						action: item
					});
					pos++;
				}
				that.configDataSource = new MatTableDataSource<ConfigElement>(that.CONFIG_ELEMENT_DATA);
				that.configDataSource.paginator = that.paginator;
				that.sort.sortChange.subscribe(() => that.paginator.pageIndex = 0);
				that.configDataSource.sort = that.sort;
			}
		});
	}
	getMedications(that) {
		that.CONFIG_ELEMENT_DATA = [];
		that.configDataSource = new MatTableDataSource<ConfigElement>(that.CONFIG_ELEMENT_DATA);
		that.sisService.getMedications().subscribe((result: any) => {
			let pos = 1;
			if (result.status === 'ok') {
				for (const item of result.data) {
					that.CONFIG_ELEMENT_DATA.push({
						position: pos,
						name: item.med_name,
						alias: item.med_type,
						action: item
					});
					pos++;
				}
				that.configDataSource = new MatTableDataSource<ConfigElement>(that.CONFIG_ELEMENT_DATA);
				that.configDataSource.paginator = that.paginator;
				that.sort.sortChange.subscribe(() => that.paginator.pageIndex = 0);
				that.configDataSource.sort = that.sort;
			}
		});
	}
	getReligions(that) {
		that.CONFIG_ELEMENT_DATA = [];
		that.configDataSource = new MatTableDataSource<ConfigElement>(that.CONFIG_ELEMENT_DATA);
		that.sisService.getReligionDetails({}).subscribe((result: any) => {
			let pos = 1;
			if (result.status === 'ok') {
				for (const item of result.data) {
					that.CONFIG_ELEMENT_DATA.push({
						position: pos,
						name: item.rel_name,
						alias: item.rel_alias,
						action: item
					});
					pos++;
				}
				that.configDataSource = new MatTableDataSource<ConfigElement>(that.CONFIG_ELEMENT_DATA);
				that.configDataSource.paginator = that.paginator;
				that.sort.sortChange.subscribe(() => that.paginator.pageIndex = 0);
				that.configDataSource.sort = that.sort;
			}
		});
	}
	getMotherTongue(that) {
		that.CONFIG_ELEMENT_DATA = [];
		that.configDataSource = new MatTableDataSource<ConfigElement>(that.CONFIG_ELEMENT_DATA);
		that.sisService.getMotherTongue({}).subscribe((result: any) => {
			let pos = 1;
			if (result.status === 'ok') {
				for (const item of result.data) {
					that.CONFIG_ELEMENT_DATA.push({
						position: pos,
						name: item.mt_name,
						alias: item.mt_alias,
						action: item
					});
					pos++;
				}
				that.configDataSource = new MatTableDataSource<ConfigElement>(that.CONFIG_ELEMENT_DATA);
				that.configDataSource.paginator = that.paginator;
				that.sort.sortChange.subscribe(() => that.paginator.pageIndex = 0);
				that.configDataSource.sort = that.sort;
			}
		});
	}
	getQualifications(that) {
		that.CONFIG_ELEMENT_DATA = [];
		that.configDataSource = new MatTableDataSource<ConfigElement>(that.CONFIG_ELEMENT_DATA);
		that.sisService.getQualifications().subscribe((result: any) => {
			let pos = 1;
			if (result.status === 'ok') {
				for (const item of result.data) {
					that.CONFIG_ELEMENT_DATA.push({
						position: pos,
						name: item.qlf_name,
						alias: item.qlf_alias,
						action: item
					});
					pos++;
				}
				that.configDataSource = new MatTableDataSource<ConfigElement>(that.CONFIG_ELEMENT_DATA);
				that.configDataSource.paginator = that.paginator;
				that.sort.sortChange.subscribe(() => that.paginator.pageIndex = 0);
				that.configDataSource.sort = that.sort;
			}
		});
	}
	getOccupationType(that) {
		that.CONFIG_ELEMENT_DATA = [];
		that.configDataSource = new MatTableDataSource<ConfigElement>(that.CONFIG_ELEMENT_DATA);
		that.sisService.getOccupationType().subscribe((result: any) => {
			let pos = 1;
			if (result.status === 'ok') {
				for (const item of result.data) {
					that.CONFIG_ELEMENT_DATA.push({
						position: pos,
						name: item.ocpt_name,
						alias: item.ocpt_alias,
						action: item
					});
					pos++;
				}
				that.configDataSource = new MatTableDataSource<ConfigElement>(that.CONFIG_ELEMENT_DATA);
				that.configDataSource.paginator = that.paginator;
				that.sort.sortChange.subscribe(() => that.paginator.pageIndex = 0);
				that.configDataSource.sort = that.sort;
			}
		});
	}
	getAnnualIncome(that) {
		that.CONFIG_ELEMENT_DATA = [];
		that.configDataSource = new MatTableDataSource<ConfigElement>(that.CONFIG_ELEMENT_DATA);
		that.sisService.getAnnualIncome().subscribe((result: any) => {
			let pos = 1;
			if (result.status === 'ok') {
				for (const item of result.data) {
					that.CONFIG_ELEMENT_DATA.push({
						position: pos,
						name: item.ai_from_to,
						alias: '',
						action: item
					});
					pos++;
				}
				that.configDataSource = new MatTableDataSource<ConfigElement>(that.CONFIG_ELEMENT_DATA);
				that.configDataSource.paginator = that.paginator;
				that.sort.sortChange.subscribe(() => that.paginator.pageIndex = 0);
				that.configDataSource.sort = that.sort;
			}
		});
	}
	getVaccinationAll(that) {
		that.CONFIG_ELEMENT_DATA = [];
		that.configDataSource = new MatTableDataSource<ConfigElement>(that.CONFIG_ELEMENT_DATA);
		that.sisService.getVaccinations().subscribe((result: any) => {
			let pos = 1;
			if (result.status === 'ok') {
				for (const item of result.data) {
					that.CONFIG_ELEMENT_DATA.push({
						position: pos,
						name: item.vac_name,
						alias: item.vac_alias,
						action: item
					});
					pos++;
				}
				that.configDataSource = new MatTableDataSource<ConfigElement>(that.CONFIG_ELEMENT_DATA);
				that.configDataSource.paginator = that.paginator;
				that.sort.sortChange.subscribe(() => that.paginator.pageIndex = 0);
				that.configDataSource.sort = that.sort;
			}
		});
	}
	getVaccinationByDuration(that) {
		that.CONFIG_ELEMENT_DATA = [];
		that.configDataSource = new MatTableDataSource<ConfigElement>(that.CONFIG_ELEMENT_DATA);
		that.sisService.getVaccinationByDuration().subscribe((result: any) => {
			let pos = 1;
			if (result.status === 'ok') {
				for (const item of result.data) {
					let vac_id_list: any = '';
					for (const vac of item.vac_id_list) {
						vac_id_list = vac_id_list + vac.vac_name + ',';
					}
					that.CONFIG_ELEMENT_DATA.push({
						position: pos,
						name: item.vd_name,
						alias: vac_id_list,
						action: item
					});
					pos++;
				}
				that.configDataSource = new MatTableDataSource<ConfigElement>(that.CONFIG_ELEMENT_DATA);
				that.configDataSource.paginator = that.paginator;
				that.sort.sortChange.subscribe(() => that.paginator.pageIndex = 0);
				that.configDataSource.sort = that.sort;
			}
		});
	}
	getActivityAll(that) {
		that.CONFIG_ELEMENT_DATA = [];
		that.configDataSource = new MatTableDataSource<ConfigElement>(that.CONFIG_ELEMENT_DATA);
		that.sisService.getActivity().subscribe((result: any) => {
			let pos = 1;
			if (result.status === 'ok') {
				for (const item of result.data) {
					that.CONFIG_ELEMENT_DATA.push({
						position: pos,
						name: item.act_name,
						alias: item.act_alias,
						action: item
					});
					pos++;
				}
				that.configDataSource = new MatTableDataSource<ConfigElement>(that.CONFIG_ELEMENT_DATA);
				that.configDataSource.paginator = that.paginator;
				that.sort.sortChange.subscribe(() => that.paginator.pageIndex = 0);
				that.configDataSource.sort = that.sort;
			}
		});
	}
	getLevelOfIntrestAll(that) {
		that.CONFIG_ELEMENT_DATA = [];
		that.configDataSource = new MatTableDataSource<ConfigElement>(that.CONFIG_ELEMENT_DATA);
		that.sisService.getLevelOfInterest().subscribe((result: any) => {
			let pos = 1;
			if (result.status === 'ok') {
				for (const item of result.data) {
					that.CONFIG_ELEMENT_DATA.push({
						position: pos,
						name: item.loi_name,
						alias: item.loi_alias,
						action: item
					});
					pos++;
				}
				that.configDataSource = new MatTableDataSource<ConfigElement>(that.CONFIG_ELEMENT_DATA);
				that.configDataSource.paginator = that.paginator;
				that.sort.sortChange.subscribe(() => that.paginator.pageIndex = 0);
				that.configDataSource.sort = that.sort;
			}
		});
	}
	getEventLevelAll(that) {
		that.CONFIG_ELEMENT_DATA = [];
		that.configDataSource = new MatTableDataSource<ConfigElement>(that.CONFIG_ELEMENT_DATA);
		that.sisService.getEventLevel().subscribe((result: any) => {
			let pos = 1;
			if (result.status === 'ok') {
				for (const item of result.data) {
					that.CONFIG_ELEMENT_DATA.push({
						position: pos,
						name: item.el_name,
						alias: item.el_alias,
						action: item
					});
					pos++;
				}
				that.configDataSource = new MatTableDataSource<ConfigElement>(that.CONFIG_ELEMENT_DATA);
				that.configDataSource.paginator = that.paginator;
				that.sort.sortChange.subscribe(() => that.paginator.pageIndex = 0);
				that.configDataSource.sort = that.sort;
			}
		});
	}
	getActivityClubAll(that) {
		that.CONFIG_ELEMENT_DATA = [];
		that.configDataSource = new MatTableDataSource<ConfigElement>(that.CONFIG_ELEMENT_DATA);
		that.sisService.getActivityClub().subscribe((result: any) => {
			let pos = 1;
			if (result.status === 'ok') {
				for (const item of result.data) {
					that.CONFIG_ELEMENT_DATA.push({
						position: pos,
						name: item.acl_name,
						alias: item.acl_alias,
						action: item
					});
					pos++;
				}
				that.configDataSource = new MatTableDataSource<ConfigElement>(that.CONFIG_ELEMENT_DATA);
				that.configDataSource.paginator = that.paginator;
				that.sort.sortChange.subscribe(() => that.paginator.pageIndex = 0);
				that.configDataSource.sort = that.sort;
			}
		});
	}
	getAuthorityAll(that) {
		that.CONFIG_ELEMENT_DATA = [];
		that.configDataSource = new MatTableDataSource<ConfigElement>(that.CONFIG_ELEMENT_DATA);
		that.sisService.getAuthority().subscribe((result: any) => {
			let pos = 1;
			if (result.status === 'ok') {
				for (const item of result.data) {
					that.CONFIG_ELEMENT_DATA.push({
						position: pos,
						name: item.aut_name,
						alias: item.aut_alias,
						action: item
					});
					pos++;
				}
				that.configDataSource = new MatTableDataSource<ConfigElement>(that.CONFIG_ELEMENT_DATA);
				that.configDataSource.paginator = that.paginator;
				that.sort.sortChange.subscribe(() => that.paginator.pageIndex = 0);
				that.configDataSource.sort = that.sort;
			}
		});
	}
	getAreaAll(that) {
		that.CONFIG_ELEMENT_DATA = [];
		that.configDataSource = new MatTableDataSource<ConfigElement>(that.CONFIG_ELEMENT_DATA);
		that.sisService.getArea().subscribe((result: any) => {
			let pos = 1;
			if (result.status === 'ok') {
				for (const item of result.data) {
					that.CONFIG_ELEMENT_DATA.push({
						position: pos,
						name: item.ar_name,
						alias: item.ar_alias,
						action: item
					});
					pos++;
				}
				that.configDataSource = new MatTableDataSource<ConfigElement>(that.CONFIG_ELEMENT_DATA);
				that.configDataSource.paginator = that.paginator;
				that.sort.sortChange.subscribe(() => that.paginator.pageIndex = 0);
				that.configDataSource.sort = that.sort;
			}
		});
	}
	getReasonsAll(that) {
		that.CONFIG_ELEMENT_DATA = [];
		that.configDataSource = new MatTableDataSource<ConfigElement>(that.CONFIG_ELEMENT_DATA);
		that.sisService.getReason({
			reason_type: that.reason_type
		}).subscribe((result: any) => {
			let pos = 1;
			if (result.status === 'ok') {
				for (const item of result.data) {
					that.CONFIG_ELEMENT_DATA.push({
						position: pos,
						name: item.reason_title,
						alias: item.reason_desc,
						action: item
					});
					pos++;
				}
				that.configDataSource = new MatTableDataSource<ConfigElement>(that.CONFIG_ELEMENT_DATA);
				that.configDataSource.paginator = that.paginator;
				that.sort.sortChange.subscribe(() => that.paginator.pageIndex = 0);
				that.configDataSource.sort = that.sort;
			}
		});
	}
	getSessionsAll(that) {
		that.CONFIG_ELEMENT_DATA = [];
		that.configDataSource = new MatTableDataSource<ConfigElement>(that.CONFIG_ELEMENT_DATA);
		that.sisService.getSession().subscribe((result: any) => {
			let pos = 1;
			if (result.status === 'ok') {
				for (const item of result.data) {
					that.CONFIG_ELEMENT_DATA.push({
						position: pos,
						name: item.ses_name,
						alias: item.ses_alias,
						action: item
					});
					pos++;
				}
				that.configDataSource = new MatTableDataSource<ConfigElement>(that.CONFIG_ELEMENT_DATA);
				that.configDataSource.paginator = that.paginator;
				that.sort.sortChange.subscribe(() => that.paginator.pageIndex = 0);
				that.configDataSource.sort = that.sort;
			}
		});
	}
	resetForm(value) {
		this.formGroupArray[value - 1].formGroup.reset();
	}
	addConfiguration(value) {
		if (!this.formGroupArray[value - 1].formGroup.valid) {
			this.commonService.showSuccessErrorMessage('Enter required fields', 'error');
		} else {
			switch (value) {
				case '1':
					this.formGroupArray[value - 1].formGroup.value.bg_status = '1';
					this.addEntry(this.formGroupArray[value - 1].formGroup.value, 'insertBloodGroup', this.getBloodGroupAll);
					break;
				case '2':
					this.formGroupArray[value - 1].formGroup.value.docreq_status = '1';
					this.addEntry(this.formGroupArray[value - 1].formGroup.value, 'insertDocumentRequired', this.getDocumentsAll);
					break;
				case '3':
					this.formGroupArray[value - 1].formGroup.value.hou_status = '1';
					this.addEntry(this.formGroupArray[value - 1].formGroup.value, 'insertHouses', this.getHouses);
					break;
				case '4':
					this.formGroupArray[value - 1].formGroup.value.med_status = '1';
					this.addEntry(this.formGroupArray[value - 1].formGroup.value, 'insertMedications', this.getMedications);
					break;
				case '5':
					this.formGroupArray[value - 1].formGroup.value.rel_status = '1';
					this.addEntry(this.formGroupArray[value - 1].formGroup.value, 'insertReligionDetails', this.getReligions);
					break;
				case '6':
					this.formGroupArray[value - 1].formGroup.value.mt_status = '1';
					this.addEntry(this.formGroupArray[value - 1].formGroup.value, 'insertMotherTongue', this.getMotherTongue);
					break;
				case '7':
					this.formGroupArray[value - 1].formGroup.value.qlf_status = '1';
					this.addEntry(this.formGroupArray[value - 1].formGroup.value, 'insertQualifications', this.getQualifications);
					break;
				case '8':
					this.formGroupArray[value - 1].formGroup.value.ocpt_status = '1';
					this.addEntry(this.formGroupArray[value - 1].formGroup.value, 'insertOccupationType', this.getOccupationType);
					break;
				case '9':
					this.formGroupArray[value - 1].formGroup.value.ai_status = '1';
					this.formGroupArray[value - 1].formGroup.value.ai_from_to = this.formGroupArray[value - 1].formGroup.value.ai_from + '-' +
						this.formGroupArray[value - 1].formGroup.value.ai_to;
					this.formGroupArray[value - 1].formGroup.value.ai_from = '';
					this.formGroupArray[value - 1].formGroup.value.ai_to = '';
					this.addEntry(this.formGroupArray[value - 1].formGroup.value, 'insertAnnualIncome', this.getAnnualIncome);
					break;
				case '10':
					this.formGroupArray[value - 1].formGroup.value.vac_status = '1';
					this.addEntry(this.formGroupArray[value - 1].formGroup.value, 'insertVaccinations', this.getVaccinationAll);
					break;
				case '11':
					this.formGroupArray[value - 1].formGroup.value.vd_status = '1';
					this.formGroupArray[value - 1].formGroup.value.vac_id = JSON.stringify(this.formGroupArray[value - 1].formGroup.value.vac_id);
					this.addEntry(this.formGroupArray[value - 1].formGroup.value, 'insertVaccinationByDuration', this.getVaccinationByDuration);
					break;
				case '12':
					this.formGroupArray[value - 1].formGroup.value.act_status = '1';
					this.addEntry(this.formGroupArray[value - 1].formGroup.value, 'insertActivity', this.getActivityAll);
					break;
				case '13':
					this.formGroupArray[value - 1].formGroup.value.loi_status = '1';
					this.addEntry(this.formGroupArray[value - 1].formGroup.value, 'insertLevelOfInterest', this.getLevelOfIntrestAll);
					break;
				case '14':
					this.formGroupArray[value - 1].formGroup.value.el_status = '1';
					this.addEntry(this.formGroupArray[value - 1].formGroup.value, 'insertEventLevel', this.getEventLevelAll);
					break;
				case '15':
					this.formGroupArray[value - 1].formGroup.value.acl_status = '1';
					this.addEntry(this.formGroupArray[value - 1].formGroup.value, 'insertActivityClub', this.getActivityClubAll);
					break;
				case '16':
					this.formGroupArray[value - 1].formGroup.value.aut_status = '1';
					this.addEntry(this.formGroupArray[value - 1].formGroup.value, 'insertAuthority', this.getAuthorityAll);
					break;
				case '17':
					this.formGroupArray[value - 1].formGroup.value.ar_status = '1';
					this.addEntry(this.formGroupArray[value - 1].formGroup.value, 'insertArea', this.getAreaAll);
					break;
				case '18':
					this.formGroupArray[value - 1].formGroup.value.reason_status = '1';
					this.addEntry(this.formGroupArray[value - 1].formGroup.value, 'insertReason', this.getReasonsAll);
					break;
				case '19':
					this.formGroupArray[value - 1].formGroup.value.ses_status = '1';
					const param: any = {};
					param.ses_id = this.formGroupArray[value - 1].formGroup.value.ses_id;
					param.ses_name = this.formGroupArray[value - 1].formGroup.value.ses_from + '-' +
						this.formGroupArray[value - 1].formGroup.value.ses_to;
					param.ses_alias = this.formGroupArray[value - 1].formGroup.value.ses_alias;
					param.ses_status = this.formGroupArray[value - 1].formGroup.value.ses_status;
					this.addEntry(param, 'insertSession', this.getSessionsAll);
					break;
				case '20':
					this.formGroupArray[value - 1].formGroup.value.cat_status = '1';
					this.addEntry(this.formGroupArray[value - 1].formGroup.value, 'insertcategory', this.getCategoryAll);
					break;
				case '21':
					this.formGroupArray[value - 1].formGroup.value.nat_status = '1';
					this.addEntry(this.formGroupArray[value - 1].formGroup.value, 'insertnationality', this.getNationalityAll);
					break;
			}
		}
	}
	formEdit(value: any) {
		if (Number(this.configValue) === 1) {
			this.updateFlag = true;
			this.formGroupArray[this.configValue - 1].formGroup.patchValue({
				bg_id: value.bg_id,
				bg_name: value.bg_name,
				bg_alias: value.bg_alias,
				bg_status: value.bg_status
			});
		} else if (Number(this.configValue) === 2) {
			this.updateFlag = true;
			this.formGroupArray[this.configValue - 1].formGroup.patchValue({
				docreq_id: value.docreq_id,
				docreq_name: value.docreq_name,
				docreq_alias: value.docreq_alias,
				docreq_status: value.docreq_status,
				docreq_is_required: value.docreq_is_required
			});
		} else if (Number(this.configValue) === 3) {
			this.updateFlag = true;
			this.formGroupArray[this.configValue - 1].formGroup.patchValue({
				hou_id: value.hou_id,
				hou_house_name: value.hou_house_name,
				hou_alias: value.hou_alias,
				hou_status: value.hou_status
			});
		} else if (Number(this.configValue) === 4) {
			this.updateFlag = true;
			this.formGroupArray[this.configValue - 1].formGroup.patchValue({
				med_id: value.med_id,
				med_name: value.med_name,
				med_type: value.med_type,
				med_status: value.med_status
			});
		} else if (Number(this.configValue) === 5) {
			this.updateFlag = true;
			this.formGroupArray[this.configValue - 1].formGroup.patchValue({
				rel_id: value.rel_id,
				rel_name: value.rel_name,
				rel_alias: value.rel_alias,
				rel_status: value.rel_status
			});
		} else if (Number(this.configValue) === 6) {
			this.updateFlag = true;
			this.formGroupArray[this.configValue - 1].formGroup.patchValue({
				mt_id: value.mt_id,
				mt_name: value.mt_name,
				mt_alias: value.mt_alias,
				mt_status: value.mt_status
			});
		} else if (Number(this.configValue) === 7) {
			this.updateFlag = true;
			this.formGroupArray[this.configValue - 1].formGroup.patchValue({
				qlf_id: value.qlf_id,
				qlf_name: value.qlf_name,
				qlf_alias: value.qlf_alias,
				qlf_status: value.qlf_status
			});
		} else if (Number(this.configValue) === 8) {
			this.updateFlag = true;
			this.formGroupArray[this.configValue - 1].formGroup.patchValue({
				ocpt_id: value.ocpt_id,
				ocpt_name: value.ocpt_name,
				ocpt_alias: value.ocpt_alias,
				ocpt_status: value.ocpt_status
			});
		} else if (Number(this.configValue) === 9) {
			this.updateFlag = true;
			this.formGroupArray[this.configValue - 1].formGroup.patchValue({
				ai_id: value.ai_id,
				ai_from: value.ai_from_to.split('-')[0],
				ai_to: value.ai_from_to.split('-')[1],
				ai_from_to: value.ai_from_to,
				ai_status: value.ai_status
			});
		} else if (Number(this.configValue) === 10) {
			this.updateFlag = true;
			this.formGroupArray[this.configValue - 1].formGroup.patchValue({
				vac_id: value.vac_id,
				vac_name: value.vac_name,
				vac_alias: value.vac_alias,
				vac_status: value.vac_status
			});
		} else if (Number(this.configValue) === 11) {
			this.updateFlag = true;
			const vac_id: any[] = [];
			for (const item of value.vac_id_list) {
				vac_id.push(item.vac_id);
			}
			this.formGroupArray[this.configValue - 1].formGroup.patchValue({
				vd_id: value.vd_id,
				vd_name: value.vd_name,
				vd_alias: value.vd_alias,
				vac_id: vac_id,
				vd_status: value.vd_status
			});
		} else if (Number(this.configValue) === 12) {
			this.updateFlag = true;
			this.formGroupArray[this.configValue - 1].formGroup.patchValue({
				act_id: value.act_id,
				act_name: value.act_name,
				act_alias: value.act_alias,
				act_status: value.act_status
			});
		} else if (Number(this.configValue) === 13) {
			this.updateFlag = true;
			this.formGroupArray[this.configValue - 1].formGroup.patchValue({
				loi_id: value.loi_id,
				loi_name: value.loi_name,
				loi_alias: value.loi_alias,
				loi_status: value.loi_status
			});
		} else if (Number(this.configValue) === 14) {
			this.updateFlag = true;
			this.formGroupArray[this.configValue - 1].formGroup.patchValue({
				el_id: value.el_id,
				el_name: value.el_name,
				el_alias: value.el_alias,
				el_status: value.el_status
			});
		} else if (Number(this.configValue) === 15) {
			this.updateFlag = true;
			this.formGroupArray[this.configValue - 1].formGroup.patchValue({
				acl_id: value.acl_id,
				acl_name: value.acl_name,
				acl_alias: value.acl_alias,
				acl_status: value.acl_status
			});
		} else if (Number(this.configValue) === 16) {
			this.updateFlag = true;
			this.formGroupArray[this.configValue - 1].formGroup.patchValue({
				aut_id: value.aut_id,
				aut_name: value.aut_name,
				aut_alias: value.aut_alias,
				aut_status: value.aut_status
			});
		} else if (Number(this.configValue) === 17) {
			this.updateFlag = true;
			this.formGroupArray[this.configValue - 1].formGroup.patchValue({
				ar_id: value.ar_id,
				ar_name: value.ar_name,
				ar_alias: value.ar_alias,
				ar_status: value.ar_status
			});
		} else if (Number(this.configValue) === 18) {
			this.updateFlag = true;
			this.formGroupArray[this.configValue - 1].formGroup.patchValue({
				reason_id: value.reason_id,
				reason_title: value.reason_title,
				reason_desc: value.reason_desc,
				reason_status: value.reason_status
			});
		} else if (Number(this.configValue) === 19) {
			this.updateFlag = true;
			this.formGroupArray[this.configValue - 1].formGroup.patchValue({
				ses_id: value.ses_id,
				ses_from: value.ses_name.split('-')[0],
				ses_to: value.ses_name.split('-')[1],
				ses_status: value.ses_status
			});
		} else if (Number(this.configValue) === 20) {
			this.updateFlag = true;
			this.formGroupArray[this.configValue - 1].formGroup.patchValue({
				cat_id: value.cat_id,
				cat_name: value.cat_name,
				cat_alias: value.cat_alias,
				cat_status: value.cat_status
			});
		} else if (Number(this.configValue) === 21) {
			this.updateFlag = true;
			this.formGroupArray[this.configValue - 1].formGroup.patchValue({
				nat_id: value.nat_id,
				nat_name: value.nat_name,
				nat_alias: value.nat_alias,
				nat_status: value.nat_status
			});
		}
	}
	updateConfiguration(value) {
		if (!this.formGroupArray[value - 1].formGroup.valid) {
			this.commonService.showSuccessErrorMessage('Enter required fields', 'error');
		} else {
			switch (value) {
				case '1':
					this.updateEntry(this.formGroupArray[value - 1].formGroup.value, 'updateBloodGroup', this.getBloodGroupAll);
					break;
				case '2':
					this.updateEntry(this.formGroupArray[value - 1].formGroup.value, 'updateDocumentRequired', this.getDocumentsAll);
					break;
				case '3':
					this.updateEntry(this.formGroupArray[value - 1].formGroup.value, 'updateHouses', this.getHouses);
					break;
				case '4':
					this.updateEntry(this.formGroupArray[value - 1].formGroup.value, 'updateMedications', this.getMedications);
					break;
				case '5':
					this.updateEntry(this.formGroupArray[value - 1].formGroup.value, 'updateReligionDetails', this.getReligions);
					break;
				case '6':
					this.updateEntry(this.formGroupArray[value - 1].formGroup.value, 'updateMotherTongue', this.getMotherTongue);
					break;
				case '7':
					this.updateEntry(this.formGroupArray[value - 1].formGroup.value, 'updateQualifications', this.getQualifications);
					break;
				case '8':
					this.updateEntry(this.formGroupArray[value - 1].formGroup.value, 'updateOccupationType', this.getOccupationType);
					break;
				case '9':
					this.formGroupArray[value - 1].formGroup.value.ai_from_to = this.formGroupArray[value - 1].formGroup.value.ai_from + '-' +
						this.formGroupArray[value - 1].formGroup.value.ai_to;
					this.formGroupArray[value - 1].formGroup.value.ai_from = '';
					this.formGroupArray[value - 1].formGroup.value.ai_to = '';
					this.updateEntry(this.formGroupArray[value - 1].formGroup.value, 'updateAnnualIncome', this.getAnnualIncome);
					break;
				case '10':
					this.updateEntry(this.formGroupArray[value - 1].formGroup.value, 'updateVaccinations', this.getVaccinationAll);
					break;
				case '11':
					this.formGroupArray[value - 1].formGroup.value.vac_id = JSON.stringify(this.formGroupArray[value - 1].formGroup.value.vac_id);
					this.updateEntry(this.formGroupArray[value - 1].formGroup.value, 'updateVaccinationByDuration', this.getVaccinationByDuration);
					break;
				case '12':
					this.updateEntry(this.formGroupArray[value - 1].formGroup.value, 'updateActivity', this.getActivityAll);
					break;
				case '13':
					this.updateEntry(this.formGroupArray[value - 1].formGroup.value, 'updateLevelOfInterest', this.getLevelOfIntrestAll);
					break;
				case '14':
					this.updateEntry(this.formGroupArray[value - 1].formGroup.value, 'updateEventLevel', this.getEventLevelAll);
					break;
				case '15':
					this.addEntry(this.formGroupArray[value - 1].formGroup.value, 'updateActivityClub', this.getActivityClubAll);
					break;
				case '16':
					this.updateEntry(this.formGroupArray[value - 1].formGroup.value, 'updateAuthority', this.getAuthorityAll);
					break;
				case '17':
					this.updateEntry(this.formGroupArray[value - 1].formGroup.value, 'updateArea', this.getAreaAll);
					break;
				case '18':
					this.formGroupArray[value - 1].formGroup.value.login_id = (JSON.parse(localStorage.getItem('currentUser'))).login_id;
					this.updateEntry(this.formGroupArray[value - 1].formGroup.value, 'updateReason', this.getReasonsAll);
					break;
				case '19':
					this.formGroupArray[value - 1].formGroup.value.ses_name = this.formGroupArray[value - 1].formGroup.value.ses_from + '-' +
						this.formGroupArray[value - 1].formGroup.value.ses_to;
					this.formGroupArray[value - 1].formGroup.value.ses_from = '';
					this.formGroupArray[value - 1].formGroup.value.ses_to = '';
					const param: any = {};
					param.ses_id = this.formGroupArray[value - 1].formGroup.value.ses_id;
					param.ses_name = this.formGroupArray[value - 1].formGroup.value.ses_name;
					param.ses_alias = this.formGroupArray[value - 1].formGroup.value.ses_alias;
					param.ses_status = this.formGroupArray[value - 1].formGroup.value.ses_status;
					this.updateEntry(param, 'updateSession', this.getSessionsAll);
					break;
				case '20':
					this.updateEntry(this.formGroupArray[value - 1].formGroup.value, 'updatecategory', this.getCategoryAll);
					break;
				case '21':
					this.updateEntry(this.formGroupArray[value - 1].formGroup.value, 'updatenationality', this.getNationalityAll);
					break;
			}
		}
	}
	applyFilter(event) { }
	deleteCancel() { }
	deleteEntry(deletedData, serviceName, next) {
		this.sisService[serviceName](deletedData).subscribe((result: any) => {
			if (result.status === 'ok') {
				next(this);
				this.commonService.showSuccessErrorMessage('Deleted Succesfully', 'success');
			}
		});
	}
	addEntry(data, serviceName, next) {
		this.sisService[serviceName](data).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.resetForm(this.configValue);
				next(this);
				this.commonService.showSuccessErrorMessage('Added Succesfully', 'success');
			}
		});
	}
	updateEntry(data, serviceName, next) {
		this.sisService[serviceName](data).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.resetForm(this.configValue);
				this.updateFlag = false;
				next(this);
				this.commonService.showSuccessErrorMessage('Updated Succesfully', 'success');
			}
		});
	}
	getReasonViaType($event) {
		this.reason_type = '';
		this.reason_type = $event.value;
		this.getReasonsAll(this);
	}
	getCategoryAll(that) {
		that.CONFIG_ELEMENT_DATA = [];
		that.configDataSource = new MatTableDataSource<ConfigElement>(that.CONFIG_ELEMENT_DATA);
		that.sisService.getcategory().subscribe((result: any) => {
			if (result.status === 'ok') {
				let pos = 1;
				for (const item of result.data) {
					that.CONFIG_ELEMENT_DATA.push({
						position: pos,
						name: item.cat_name,
						alias: item.cat_alias,
						action: item
					});
					pos++;
				}
				that.configDataSource = new MatTableDataSource<ConfigElement>(that.CONFIG_ELEMENT_DATA);
				that.configDataSource.paginator = that.paginator;
				that.sort.sortChange.subscribe(() => that.paginator.pageIndex = 0);
				that.configDataSource.sort = that.sort;
			}
		});
	}
	getNationalityAll(that) {
		that.CONFIG_ELEMENT_DATA = [];
		that.configDataSource = new MatTableDataSource<ConfigElement>(that.CONFIG_ELEMENT_DATA);
		that.sisService.getnationality().subscribe((result: any) => {
			if (result.status === 'ok') {
				let pos = 1;
				for (const item of result.data) {
					that.CONFIG_ELEMENT_DATA.push({
						position: pos,
						name: item.nat_name,
						alias: item.nat_alias,
						action: item
					});
					pos++;
				}
				that.configDataSource = new MatTableDataSource<ConfigElement>(that.CONFIG_ELEMENT_DATA);
				that.configDataSource.paginator = that.paginator;
				that.sort.sortChange.subscribe(() => that.paginator.pageIndex = 0);
				that.configDataSource.sort = that.sort;
			}
		});
	}
}
// export class ConfirmValidParentMatcher implements ErrorStateMatcher {
// 	isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
// 		return control && control.invalid && (control.dirty || control.touched || form.submitted);
// 	}
// }

