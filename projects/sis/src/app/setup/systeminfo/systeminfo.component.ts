import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroupDirective, FormControl, NgForm } from '@angular/forms';
import { SisService, CommonAPIService, SmartService } from '../../_services/index';
import { MatTableDataSource, MatPaginator, MatSort, ErrorStateMatcher } from '@angular/material';
import { ConfigElement } from './system.model';
import { ConfirmValidParentMatcher } from '../../ConfirmValidParentMatcher';
import { element } from 'protractor';
import {environment} from 'src/environments/environment';
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
	cityCountryArray:any = [];
	cityCountryArray2:any = [];
	arrayState: any[] = [];
	arrayDist: any[] = [];
	configValue: any;
	sesId;
	bgImgUrl;
	ckeConfig: any;
	certificate_type_arr: any[] = [];
	disableApiCall = false;
	customs: any[] = [
		{ type: 'custom', name: 'Custom Type' },
		{ type: 'learn', name: 'Learning Type' },
	];
	vaccinationArray: any[] = [];
	reasonTypeArray: any[] = [];
	CONFIG_ELEMENT_DATA: ConfigElement[] = [];
	configDataSource = new MatTableDataSource<ConfigElement>(this.CONFIG_ELEMENT_DATA);
	displayedColumns: any[] = ['position', 'name', 'alias', 'action', 'modify'];
	firstHeaderArray: any[] = ['Blood Group', 'Document Name',
		'House Name', 'Medicine Name',
		'Religion Name', 'Mother Tongue',
		'Qualification', 'Occupation',
		'Income Range', 'Vaccination',
		'Age', 'Activity', 'Level of Intrest', 'Event Level',
		'Activity Club', 'Authority', 'Area', 'Reason Title', 'Session Name', 'Category', 'Nationality', 'Tag',
		'Question','','','Name','Name'];
	secondHeaderArray: any[] = ['Alias', 'Required',
		'Alias', 'Type',
		'Alias', 'Alias',
		'Alias', 'Alias',
		'', 'Alias', 'Vaccinations', 'Alias', 'Alias', 'Alias', 'Alias',
		'Alias', 'Alias', 'Description', 'Alias', 'Alias', 'Alias', 'Alias', 'Type', 'Settings','','Alias','Alias'];
	configFlag = false;
	updateFlag = false;
	classArray: any[] = [];
	subjectArray: any[] = [];
	subjectArray1: any[] = [];
	typeArray: any[] = [];
	requiredArray: any[] = [{ docreq_is_required: '1', docreq_is_required_name: 'Yes' },
	{ docreq_is_required: '0', docreq_is_required_name: 'No' }];
	reason_type: any = '1';
	constructor(private fbuild: FormBuilder,
		private SmartService: SmartService,
		private sisService: SisService,
		private commonService: CommonAPIService,
	) { }

	ngOnInit() {
		this.buildForm();
		this.getReasonType();
		this.getVaccinations();
		this.getClassAll();
		this.getSubjectAll();
		this.getTypeAll();
		this.getState();
		this.getDist();
		this.getSlcTcTemplateSetting();
		this.sesId = JSON.parse(localStorage.getItem('session')).ses_id ? JSON.parse(localStorage.getItem('session')).ses_id : 0;
	}
	ngAfterViewInit() {
		this.configDataSource.sort = this.sort;
		this.configDataSource.paginator = this.paginator;
	}
	openDeleteDialog = (data) => this.deleteModal.openModal(data);
	getSubjectAll() {
		this.sisService.getAllSubject().subscribe((result: any) => {
			console.log(" i am result", result);
			this.subjectArray = result;
			this.subjectArray1 = result;

		})
	}

	loadPlugin(){
		this.ckeConfig = {
			allowedContent: true,
			pasteFromWordRemoveFontStyles: false,
			contentsCss: ['https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css'],
			disallowedContent: 'm:omathpara',
			height: '800',
			width: '100%',
			// tslint:disable-next-line:max-line-length 
			extraPlugins: 'strinsertExt,language,html5audio,html5video,clipboard,undo,uploadfile,uploadimage,uploadwidget,filetools,notificationaggregator,notification,simpleImageUpload',

			scayt_multiLanguageMod: true,
			filebrowserUploadMethod: 'form',
			uploadUrl: environment.apiAxiomUrl + '/uploadS3.php',
			imageUploadUrl: environment.apiAxiomUrl + '/uploadS3.php',
			filebrowserUploadUrl: environment.apiAxiomUrl + '/uploadS3.php',
			toolbar: [
				// tslint:disable-next-line:max-line-length
				['Source', 'Font', 'FontSize', 'Subscript', 'Superscript', 'Videoembed', 'Bold', 'Italic', 'Underline', 'Strikethrough', 'Image', 'Table', 'Templates',
					{ name: 'strinsertExt', items: ['strinsertExt'] },
					{ name: 'SimpleImageUpload', items: ['SimpleImageUpload'] }
				]
			],
			removeDialogTabs: 'image:advanced;image:Link'
		};
	}

	getTypeAll() {
		this.sisService.getTypeAll().subscribe((res: any) => {
			this.typeArray = res;
			console.log("i am type array", this.typeArray);
		})
	}

	filterSubject($event) {
		// keyCode
		if (Number($event.keyCode) !== 40 && Number($event.keyCode) !== 38) {
			if ($event.target.value !== '' && $event.target.value.length >= 1) {
				this.subjectArray = this.subjectArray1.filter(e => e.parameter_value.toLowerCase().includes($event.target.value.toLowerCase()))
			}
		}
	}

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
				docreq_class: '',
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
		},
		{
			formGroup: this.fbuild.group({
				tag_id: '',
				tag_name: '',
				tag_alias: '',
				tag_status: ''
			})
		},
		{
			formGroup: this.fbuild.group({
				equs_id: '',
				equs_name: '',
				equs_type: '',
				equs_placeholder: '',
				equs_status: ''
			})
		},
		{
			formGroup: this.fbuild.group({
				parameter_id: '',
				parameter_name: '',
				parameter_type: '',
				parameter_class: [],
				parameter_status: '',
				parameter_order: 0
			})
		},
		{
			formGroup: this.fbuild.group({
				city_id: '',
				city_name: '',
				dist_id: '',
				dist_name: '',
				state_id: '',
				state_name: '',
				item_main: {}
			})
		},
		{
			formGroup: this.fbuild.group({
				tb_id: '',
				tb_name: '',
				tb_alias: '',
				
			})
		},
		{
			formGroup: this.fbuild.group({
				usts_id: '',
				usts_name : '',
				usts_alias : '',
				usts_status : '',
				usts_paper : '',
				usts_orientation : '',
				usts_template: '',
				usts_bg_img : ''				
			})
		},
		];
	}
	loadConfiguration($event) {
		console.log("check me");

		this.displayedColumns = ['position', 'name', 'alias', 'action', 'modify'];
		this.configFlag = false;
		this.updateFlag = false;
		this.configValue = $event.value;
		if (Number(this.configValue) === 1) {
			this.getBloodGroupAll(this);
			this.configFlag = true;
		} else if (Number(this.configValue) === 2) {
			this.getClassAll();
			this.getDocumentsAll(this);
			this.displayedColumns = ['position', 'name', 'alias', 'class', 'action', 'modify'];
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
		} else if (Number(this.configValue) === 22) {
			this.getStudentTagAll(this);
			this.configFlag = true;
		} else if (Number(this.configValue) === 23) {
			this.getCustomAll(this);
			this.displayedColumns = ['position', 'name', 'alias', 'placeholder', 'action', 'modify'];
			this.configFlag = true;
		} else if (Number(this.configValue) === 24) {
			this.getParameterTable(this);
			this.displayedColumns = [ 'parameter', 'type', 'class', 'action', 'modify']
			this.configFlag = true;
		} else if(Number(this.configValue) === 25){
			this.displayedColumns = ['position', 'name', 'alias', 'placeholder', 'modify'];
			this.getCityStateDist(this);
			this.configFlag = true;
		} else if(Number(this.configValue) === 26){
			this.displayedColumns = ['position', 'name', 'alias', 'modify'];
			this.getBanksDetail(this);
			this.configFlag = true;
		} else if(Number(this.configValue) === 27){
			// this.displayedColumns = ['usts_id', 'usts_name', 'usts_alias', 'usts_status','modify'];
			this.getCertificateAll(this);
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
		} else if (Number(this.configValue) === 22) {
			if (value.tag_status === '1') {
				return true;
			}
		}
		else if (Number(this.configValue) === 23) {
			if (value.equs_status === '1') {
				return true;
			}
		} else if (Number(this.configValue) === 24) {
			if (value[0].gf_status === '1') {
				return true;
			}
		} else if (Number(this.configValue) === 27) {
			if (value.usts_status === '1') {
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
		} else if (Number(this.configValue) === 22) {
			if (value.tag_status === '1') {
				value.tag_status = '0';
			} else {
				value.tag_status = '1';
			}
			this.sisService.updatestudenttags(value).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.commonService.showSuccessErrorMessage('Status Changed', 'success');
					this.getStudentTagAll(this);
				}
			});
		}
		else if (Number(this.configValue) === 23) {
			if (value.equs_status === '1') {
				value.equs_status = '0';
			} else {
				value.equs_status = '1';
			}
			this.sisService.updateCustomRemarks(value).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.commonService.showSuccessErrorMessage('Status Changed', 'success');
					this.getCustomAll(this);
				}
			});
		}
		else if (Number(this.configValue) === 24) {
			let array_id = [];
			let status = '0'
			value.forEach(element => {
				array_id.push(element.gf_id)
			});
			if (value[0].gf_status == '0') {
				status = '1'
			}
			console.log("i am value", array_id);
			this.sisService.changeSubjectStatusId({ array_id: array_id, status: status }).subscribe((result: any) => {
				console.log("i am result")
			})


		}
		else if (Number(this.configValue) === 27) {
			if (value.usts_status === '1') {
				value.usts_status = '0';
			} else {
				value.usts_status = '1';
			}
			this.sisService.changeCertificatePrintSetupStatusId({ usts_id: value.usts_id, usts_status: value.usts_status }).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.commonService.showSuccessErrorMessage('Status Changed', 'success');
					this.getCertificateAll(this);
				}
			});


		}
	}
	changeTypeQues($event) {
		if ($event.value === 'custom') {
			this.formGroupArray[Number(this.configValue) - 1].formGroup.patchValue({
				'equs_placeholder': ''
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
			case '22':
				this.deleteEntry(data, 'deletestudenttags', this.getStudentTagAll);
				break;
			case '23':
				data.equs_status = '5';
				this.deleteEntry(data, 'updateCustomRemarks', this.getCustomAll);
				break;
			case '24':
				data.equs_status = '5';
				this.deleteEntry(data, 'deleteSubjectStatusId', this.getParameterTable);
				break;
			case '25':
				data.equs_status = '5';
				this.deleteEntry(data, 'deleteCityFromCityTable', this.getCityStateDist);
				break;
			case '26':
				this.deleteEntry(data, 'deleteBanksSoft', this.getBanksDetail);
				break;
			case '27':
				this.deleteEntry(data, 'deleteCertificate', this.getCertificateAll);
				this.getCertificateAll(this);
				break;
		}
	}

	getSlcTcTemplateSetting() {
		this.sisService.getSlcTcTemplateSetting({'usts_status':'1'}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				console.log("certs template ", result.data);
				this.certificate_type_arr = result.data;
			}
		})
	}
	getVaccinations() {
		this.sisService.getVaccinations().subscribe((result: any) => {
			if (result.status === 'ok') {
				this.vaccinationArray = result.data;
			}
		});
	}
	getCustomAll(that) {
		that.CONFIG_ELEMENT_DATA = [];
		that.configDataSource = new MatTableDataSource<ConfigElement>(that.CONFIG_ELEMENT_DATA);
		that.sisService.getCustomRemarks({}).subscribe((result: any) => {
			if (result.status === 'ok') {
				let pos = 1;
				for (const item of result.data) {
					that.CONFIG_ELEMENT_DATA.push({
						position: pos,
						name: item.equs_name,
						alias: item.equs_type,
						placeholder: item.equs_placeholder ? item.equs_placeholder : '-',
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

	getParameterTable(that) {
		that.CONFIG_ELEMENT_DATA = [];
		that.configDataSource = new MatTableDataSource<ConfigElement>(that.CONFIG_ELEMENT_DATA);
		that.sisService.getParameterForRemarks().subscribe((result: any) => {
			console.log("-------------------------------", that.classArray);
			let arr_sub_id = [];
			let arr_type_id = [];
			result.forEach(element => {
				if (arr_sub_id.filter(e => e == element.parameter_id).length == 0) {
					if (element.parameter_id != null)
						arr_sub_id.push(element.parameter_id);
				}
				if (arr_type_id.filter(e => e == element.gt_id).length == 0) {
					arr_type_id.push(element.gt_id)
				}
			});

			let super_arr = [];
			for (let i = 0; i < arr_sub_id.length; i++) {
				let a1 = [];
				let a2 = [];
				for (let j = 0; j < arr_type_id.length; j++) {
					a1 = result.filter(e => e.parameter_id == arr_sub_id[i] && e.gt_id == arr_type_id[j] && e.gt_status == '0');
					a2 = result.filter(e => e.parameter_id == arr_sub_id[i] && e.gt_id == arr_type_id[j] && e.gt_status == '1');
					if (a1.length > 0)
						super_arr.push(a1);
					if (a2.length > 0)
						super_arr.push(a2);
				}
				// a1 = result.filter(e => )
			}
			
			let pos = 1;
			for (const item of super_arr) {
				let s = [];
				// let ids = [];
				item.forEach(element => {
					// ids.push(element.gf_id);
					if (element.class_id)
						s.push(that.classArray.filter(e => e.class_id == element.class_id)[0].class_name);
				});

				// console.log("i am here", item[0].gt_status);

				that.CONFIG_ELEMENT_DATA.push({
					position: pos,
					parameter: item[0].parameter_value,
					type: item[0].gt_name,
					class: s,
					action: item,
					order: parseInt(item[0].parameter_order)
					// id: ids
				});
				pos++;
			}
			that.CONFIG_ELEMENT_DATA.sort((a,b) => (a.order > b.order? 1:-1));
			that.configDataSource = new MatTableDataSource<ConfigElement>(that.CONFIG_ELEMENT_DATA);
			that.configDataSource.paginator = that.paginator;
			that.sort.sortChange.subscribe(() => that.paginator.pageIndex = 0);
			that.configDataSource.sort = that.sort;


		})
	}

	getCityStateDist(that) {
		that.CONFIG_ELEMENT_DATA = [];
		that.configDataSource = new MatTableDataSource<ConfigElement>(that.CONFIG_ELEMENT_DATA);
		that.sisService.getStateCountryByCity().subscribe((result: any) => {
			// console.log("i am result", result);
			that.cityCountryArray = result.data;
			that.cityCountryArray2 = result.data;
			let pos = 1;
			result.data.forEach(element => {
				that.CONFIG_ELEMENT_DATA.push({
					position: pos,
					name: element.cit_name,
					alias: element.dist_name,
					placeholder: element.sta_name,
					action: element
				})
				pos++;
			});
			that.configDataSource = new MatTableDataSource<ConfigElement>(that.CONFIG_ELEMENT_DATA);
			that.configDataSource.paginator = that.paginator;
			that.sort.sortChange.subscribe(() => that.paginator.pageIndex = 0);
			
		})
	}

	getBanksDetail(that) {
		that.CONFIG_ELEMENT_DATA = [];
		that.configDataSource = new MatTableDataSource<ConfigElement>(that.CONFIG_ELEMENT_DATA);
		that.sisService.getBanks().subscribe((result: any) => {
			console.log("i am result", result);
			let pos = 1;
			result.data.forEach(element => {
				that.CONFIG_ELEMENT_DATA.push({
					position: pos,
					name: element.tb_name,
					alias: element.tb_alias,
					action: element
				})
				pos++;
			});
			that.configDataSource = new MatTableDataSource<ConfigElement>(that.CONFIG_ELEMENT_DATA);
			that.configDataSource.paginator = that.paginator;
			that.sort.sortChange.subscribe(() => that.paginator.pageIndex = 0);
			
		})
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
					const class_arr = [];
					for (let ci = 0; ci < item.docreq_class.length; ci++) {
						const class_name = that.getClassName(item.docreq_class[ci]);
						class_arr.push(class_name);
					}
					that.CONFIG_ELEMENT_DATA.push({
						position: pos,
						name: item.docreq_name,
						alias: item.docreq_is_required === '0' ? 'No' : 'Yes',
						class: class_arr.toString(),
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

	getCertificateAll(that) {
		that.CONFIG_ELEMENT_DATA = [];
		that.configDataSource = new MatTableDataSource<ConfigElement>(that.CONFIG_ELEMENT_DATA);
		let payload = {
		};
		that.sisService.getCertificateAll({}).subscribe((result: any) => {
			let pos = 1;
			console.log("cert all : ",result);
			if (result.status === 'ok') {
				this.certificate_type_arr = result.data;
				for (const item of result.data) {
					that.CONFIG_ELEMENT_DATA.push({
						position: pos,
						name: item.usts_name,
						alias: item.usts_alias,
						action: item
					});
					pos++;
				}
				that.configDataSource = new MatTableDataSource<ConfigElement>(that.CONFIG_ELEMENT_DATA);
				that.configDataSource.paginator = that.paginator;
				that.sort.sortChange.subscribe(() => that.paginator.pageIndex = 0);
				that.configDataSource.sort = that.sort;
				// this.getSlcTcTemplateSetting();
			}
		});
	}

	uploadCertBgImage(event){
		console.log("i am uploading image",event);
		const file: File = event.target.files[0];
        const reader = new FileReader();
        reader.onloadend = (e) => {
            const fileJson = {
                fileName: file.name,
                imagebase64: reader.result
            };
            this.sisService.uploadDocuments([fileJson]).subscribe((result: any) => {
                if (result.status === 'ok') {
                    console.log("yahooooooo ", result);
					this.bgImgUrl = result.data[0].file_url;
					console.log(this.bgImgUrl);
					this.commonService.showSuccessErrorMessage('Upload Successful', 'success');
                }
            });
        };
        reader.readAsDataURL(file);
	}
	deleteCertBgImage(e){
		console.log("i am deleting image",e);
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
		this.bgImgUrl = "";
	}
	addConfiguration(value) {
		if (!this.formGroupArray[value - 1].formGroup.valid) {
			this.commonService.showSuccessErrorMessage('Enter required fields', 'error');
		} else {
			this.disableApiCall = true;
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
				case '22':
					this.formGroupArray[value - 1].formGroup.value.tag_status = '1';
					this.addEntry(this.formGroupArray[value - 1].formGroup.value, 'insertstudenttags', this.getStudentTagAll);
					break;
				case '23':
					this.formGroupArray[value - 1].formGroup.value.equs_status = '1';
					if (this.formGroupArray[value - 1].formGroup.value.equs_type === 'learn') {
						if (this.formGroupArray[value - 1].formGroup.value.equs_placeholder) {
							this.addEntry(this.formGroupArray[value - 1].formGroup.value, 'insertCustomRemarks', this.getCustomAll);
						} else {
							this.commonService.showSuccessErrorMessage('Enter required fields', 'error');
						}
					} else {
						this.addEntry(this.formGroupArray[value - 1].formGroup.value, 'insertCustomRemarks', this.getCustomAll);
					}

					break;
				case '24':
					console.log(this.formGroupArray[value - 1].formGroup.value);
					let checkNewSubject = true;
					let subject_id = this.subjectArray1.length;
					let checkforsubject = this.subjectArray1.filter(e => e.parameter_value.toLowerCase().includes(this.formGroupArray[value - 1].formGroup.value.parameter_name.toLowerCase()));
					if (checkforsubject.length > 0) {
						subject_id = checkforsubject[0].parameter_id,
							checkNewSubject = false
					}
					let obj: any = {
						checkNewSubject: checkNewSubject,
						subject_id: subject_id,
						parameter_type: this.formGroupArray[value - 1].formGroup.value.parameter_type,
						parameter_name: this.formGroupArray[value - 1].formGroup.value.parameter_name,
						parameter_class: this.formGroupArray[value - 1].formGroup.value.parameter_class,
						parameter_order: this.formGroupArray[value - 1].formGroup.value.parameter_order,
					}
					this.sisService.addNewRemarkParameterAndClass(obj).subscribe((result: any) => {
						console.log("i am result", result);
						this.resetForm(this.configValue);
						this.getParameterTable(this);
						this.disableApiCall = false;
					})
					break;

				case '25':
					console.log(this.formGroupArray[value - 1].formGroup.value);
					if(Object.keys(this.formGroupArray[value - 1].formGroup.value.item_main).length === 0) {
						this.addEntry(this.formGroupArray[value - 1].formGroup.value, 'insertclassintable', this.getCityStateDist);
						
					} else {
						console.log("i am empty");
						this.addEntry(this.formGroupArray[value - 1].formGroup.value, 'updateclassintable', this.getCityStateDist);
					}
					break;
				case '26':
					this.addEntry(this.formGroupArray[value - 1].formGroup.value, 'insertOrUpdateBankDetails', this.getBanksDetail);
					break;
			
				case '27':
					this.formGroupArray[value - 1].formGroup.value.usts_status = '1';
					this.formGroupArray[value - 1].formGroup.value.usts_bg_img = this.bgImgUrl ? this.bgImgUrl : 'no image';
					this.addEntry(this.formGroupArray[value - 1].formGroup.value, 'insertOrUpdateCertificate', this.getCertificateAll);
					this.getCertificateAll(this);
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
				docreq_is_required: value.docreq_is_required,
				docreq_class: value.docreq_class
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
		} else if (Number(this.configValue) === 22) {
			this.updateFlag = true;
			this.formGroupArray[this.configValue - 1].formGroup.patchValue({
				tag_id: value.tag_id,
				tag_name: value.tag_name,
				tag_alias: value.tag_alias,
				tag_status: value.tag_status
			});
		}
		else if (Number(this.configValue) === 23) {
			this.updateFlag = true;
			this.formGroupArray[this.configValue - 1].formGroup.patchValue({
				equs_id: value.equs_id,
				equs_name: value.equs_name,
				equs_placeholder: value.equs_placeholder,
				equs_type: value.equs_type,
				equs_status: value.equs_status
			});
		}
		else if (Number(this.configValue) === 24) {
			this.updateFlag = true;
			let id = [];
			let class1 = [];
			value.forEach(element => {
				id.push(element.gf_id);
				class1.push(element.class_id)
			});
			this.formGroupArray[this.configValue - 1].formGroup.patchValue({
				parameter_name: value[0].parameter_value,
				parameter_type: value[0].gt_id,
				parameter_class: class1,
				parameter_id: value,
				parameter_order: value[0].parameter_order
			});
			// console.log("i am value", value);

		} else if(Number(this.configValue) === 25) {
			this.updateFlag = true;
			this.formGroupArray[Number(this.configValue) - 1].formGroup.patchValue({
				city_id: value.cit_id,
				city_name: value.cit_name,
				dist_id: value.dist_id,
				dist_name: value.dist_name,
				state_id: value.sta_id,
				state_name: value.sta_name,
				item_main: value
			})
		} else if(Number(this.configValue) == 26) {
			this.updateFlag = true;
			this.formGroupArray[Number(this.configValue) - 1].formGroup.patchValue({
				tb_id: value.tb_id,
				tb_name: value.tb_name,
				tb_alias: value.tb_alias,
			})
		} else if(Number(this.configValue) == 27) {
			this.updateFlag = true;
			console.log("hiiii", value.usts_bg_img);
			this.bgImgUrl = value.usts_bg_img;
			this.formGroupArray[Number(this.configValue) - 1].formGroup.patchValue({
				usts_id: value.usts_id,
				usts_name: value.usts_name,
				usts_alias: value.usts_alias,
				usts_bg_img: value.usts_bg_img,
				usts_template: value.usts_template,
				usts_paper: JSON.parse(value.usts_settings).cs_paper,
				usts_orientation: JSON.parse(value.usts_settings).cs_orientation,
			})
		}
	}
	getOrderValue(value) {
		console.log("i am value")
		this.formGroupArray[this.configValue - 1].formGroup.patchValue({
			parameter_name: value.parameter_value,
			parameter_order: value.parameter_order
		})
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
				case '22':
					this.updateEntry(this.formGroupArray[value - 1].formGroup.value, 'updatestudenttags', this.getStudentTagAll);
					break;
				case '23':

					if (this.formGroupArray[value - 1].formGroup.value.equs_type === 'learn') {
						if (this.formGroupArray[value - 1].formGroup.value.equs_placeholder) {
							this.updateEntry(this.formGroupArray[value - 1].formGroup.value, 'updateCustomRemarks', this.getCustomAll);
						} else {
							this.commonService.showSuccessErrorMessage('Enter required fields', 'error');
						}
					} else {
						this.updateEntry(this.formGroupArray[value - 1].formGroup.value, 'updateCustomRemarks', this.getCustomAll);
					}
					break;
				case '24':
					//check for grade change
					if(this.formGroupArray[value - 1].formGroup.value.parameter_id[0].parameter_order != this.formGroupArray[value - 1].formGroup.value.parameter_order) {
						this.sisService.updateOrderType({parameter_order: this.formGroupArray[value - 1].formGroup.value.parameter_order, parameter_name:this.formGroupArray[value - 1].formGroup.value.parameter_name }).subscribe((res:any) => {
							this.getParameterTable(this);
						});
					}
					console.log('++++++++++++++++++++++++++++', this.formGroupArray[value - 1].formGroup.value);
					if(this.formGroupArray[value - 1].formGroup.value.parameter_id[0].parameter_value != this.formGroupArray[value - 1].formGroup.value.parameter_name ) {
						
						let obj = this.subjectArray.filter((e:any) => e.parameter_value === this.formGroupArray[value - 1].formGroup.value.parameter_name);
						let arr = [];
						this.formGroupArray[value - 1].formGroup.value.parameter_id.forEach(element => {
							arr.push(element.mf_id)
						});
						console.log("i am here", obj[0]);
						this.sisService.updateAccordingToClass({subject_id: obj[0] ? obj[0].parameter_id: '', mf_id_array: arr, parameter_name: this.formGroupArray[value - 1].formGroup.value.parameter_name}).subscribe((res:any) => {
							console.log("i am here");
							this.getParameterTable(this);
						})
					}
					
					//lets check for cases such as remark type
					if (this.formGroupArray[value - 1].formGroup.value.parameter_id[0].gt_id != this.formGroupArray[value - 1].formGroup.value.parameter_type) {
						let arr = [];
						this.formGroupArray[value - 1].formGroup.value.parameter_id.forEach(element => {
							arr.push(element.gf_id);
						});
						this.sisService.updateGradeType({ id_arr: arr, type: this.formGroupArray[value - 1].formGroup.value.parameter_type }).subscribe((res:any) => {
							this.getParameterTable(this);
						})
					}
					let barr = [];
					this.formGroupArray[value - 1].formGroup.value.parameter_id.forEach(element => {
						barr.push(element.class_id);
					});
					if (JSON.stringify(barr) != JSON.stringify(this.formGroupArray[value - 1].formGroup.value.parameter_class)) {
						//check for remove
						let remove_id = []
						for (let i = 0; i < barr.length; i++) {
							if (!this.formGroupArray[value - 1].formGroup.value.parameter_class.includes(barr[i])) {
								remove_id.push(barr[i]);
							}
						}

						let obj: any = [];
						remove_id.forEach(e => {
							let temp = this.formGroupArray[value - 1].formGroup.value.parameter_id.filter(element => element.class_id == e);
							let obj1: any = {
								'gf_id': temp[0].gf_id,
								'mf_id': temp[0].mf_id
							}
							obj.push(obj1);
						});
						if (obj.length > 0)
							this.sisService.removeClassFromList({ obj: obj }).subscribe((result: any) => {
								this.getParameterTable(this);
							});
						obj = [];
						this.formGroupArray[value - 1].formGroup.value.parameter_class.forEach(element => {
							if(!barr.includes(element)) {
								let obj1 : any = {
									gf_status : this.formGroupArray[value - 1].formGroup.value.parameter_id[0].gf_status,
									gf_gt_id: this.formGroupArray[value - 1].formGroup.value.parameter_id[0].gf_gt_id,
									class_id: element,
									mf_value: this.formGroupArray[value - 1].formGroup.value.parameter_id[0].mf_value
								}
								obj.push(obj1);
							}
						});
						if(obj.length > 0) {
							this.sisService.addClassToList({obj:obj}).subscribe((res:any) => {
								this.getParameterTable(this);
							});
						}
					}
					this.resetForm(this.configValue);
					this.updateFlag = false;
					this.commonService.showSuccessErrorMessage('Updated Succesfully', 'success');
					// this.updateEntry('', 'getParameterForRemarks', this.getParameterTable);
					
					break;
				case '25':
					console.log(this.formGroupArray[value - 1].formGroup.value);
					if(Object.keys(this.formGroupArray[value - 1].formGroup.value.item_main).length === 0) {
						this.addEntry(this.formGroupArray[value - 1].formGroup.value, 'insertclassintable', this.getCityStateDist);
						
					} else {
						console.log("i am empty");
						this.addEntry(this.formGroupArray[value - 1].formGroup.value, 'updateclassintable', this.getCityStateDist);
					}
					break;
				case '26':
					this.addEntry(this.formGroupArray[value - 1].formGroup.value, 'insertOrUpdateBankDetails', this.getBanksDetail);
					break;

			
				case '27':
					this.formGroupArray[value - 1].formGroup.value.usts_status = '1';
					this.formGroupArray[value - 1].formGroup.value.usts_bg_img = this.bgImgUrl ? this.bgImgUrl : 'no image';
					console.log(this.formGroupArray[value - 1].formGroup.value);
					this.addEntry(this.formGroupArray[value - 1].formGroup.value, 'insertOrUpdateCertificate', this.getCertificateAll);
					this.getCertificateAll(this);
					break;
			}
		}
	}
	applyFilter(event) { }
	deleteCancel() { }
	deleteEntry(deletedData, serviceName, next) {
		if (serviceName == 'deleteSubjectStatusId') {
			console.log("i am delete data", deletedData);
			let array_id = [];
			let mf_id = [];
			deletedData.forEach(element => {
				array_id.push(element.gf_id);
				mf_id.push(element.mf_id);
			});
			console.log("i am value", array_id);
			this.sisService.deleteSubjectStatusId({ array_id: array_id, mf_id: mf_id }).subscribe((result: any) => {
				next(this);
				this.commonService.showSuccessErrorMessage('Deleted Succesfully', 'success');
			})
		}
		else {
			this.sisService[serviceName](deletedData).subscribe((result: any) => {
				if (result.status === 'ok') {
					next(this);
					this.commonService.showSuccessErrorMessage('Deleted Succesfully', 'success');
				}else{
					this.commonService.showSuccessErrorMessage('Deleted Unsuccessful', 'error');
				}
			});
		}

	}
	addEntry(data, serviceName, next) {
		this.sisService[serviceName](data).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.resetForm(this.configValue);
				next(this);
				this.commonService.showSuccessErrorMessage('Added Succesfully', 'success');
				this.disableApiCall = false;
			} else {
				this.commonService.showSuccessErrorMessage('Add Unsuccesfull', 'error');
				this.disableApiCall = false;
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
				this.commonService.showSuccessErrorMessage('Fetched Succesfully', 'success');
			}
		});
	}
	getStudentTagAll(that) {
		that.CONFIG_ELEMENT_DATA = [];
		that.configDataSource = new MatTableDataSource<ConfigElement>(that.CONFIG_ELEMENT_DATA);
		that.sisService.getstudenttags().subscribe((result: any) => {
			if (result.status === 'ok') {
				let pos = 1;
				for (const item of result.data) {
					that.CONFIG_ELEMENT_DATA.push({
						position: pos,
						name: item.tag_name,
						alias: item.tag_alias,
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
	// get end month and start month of school
	getReasonType() {
		this.sisService.getReasonType()
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.reasonTypeArray = result.data;
					}
				});
	}
	getClassAll() {
		this.SmartService.getClassData({}).subscribe((res: any) => {
			if (res && res.status === 'ok') {
				this.classArray = [];
				this.classArray = res.data;
			}
		});
	}
	getClassName(classId) {
		for (const item of this.classArray) {
			if (Number(item.class_id) === Number(classId)) {
				return item.class_name;
			}
		}
	}

	getCityPerId(item, value) {
		console.log("i am item", item, value);
		this.formGroupArray[Number(this.configValue) - 1].formGroup.patchValue({
			city_id: item.cit_id,
			city_name: item.cit_name,
			dist_id: item.dist_id,
			dist_name: item.dist_name,
			state_id: item.sta_id,
			state_name: item.sta_name,
			item_main: item
		})
		// this.
		
	}

	filterCityStateCountry($event) {
		// keyCode
		if (Number($event.keyCode) !== 40 && Number($event.keyCode) !== 38) {
			if ($event.target.value !== '' && $event.target.value.length >= 1 ) {
				this.cityCountryArray = [];
				this.sisService.getStateCountryByCity({ cit_name: $event.target.value }).subscribe((result: any) => {
					if (result.status === 'ok') {
						this.cityCountryArray2 = result.data;
					}
				});
			}
		}
	}

	getState() {
		this.sisService.getState().subscribe(
			(result: any) => {
				if (result.status === 'ok') {
					this.arrayState = result.data;
				}
			}
		);
	}
	getDist() {
		this.sisService.getDistrict().subscribe(
			(result: any) => {
				if (result.status === 'ok') {
					this.arrayDist = result.data;
				}
			}
		);
	}
}
// export class ConfirmValidParentMatcher implements ErrorStateMatcher {
// 	isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
// 		return control && control.invalid && (control.dirty || control.touched || form.submitted);
// 	}
// }

