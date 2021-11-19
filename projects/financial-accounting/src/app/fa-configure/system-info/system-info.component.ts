import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroupDirective, FormControl, NgForm, FormGroup } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSort, ErrorStateMatcher } from '@angular/material';
import { ConfigElement } from './system-info.model';
import { ConfirmValidParentMatcher } from '../../ConfirmValidParentMatcher';
import { ErpCommonService, CommonAPIService } from 'src/app/_services';
import { SisService, HtmlToTextService } from '../../_services/index';
import {ckconfig } from "./ckeditorconfig";
import {environment} from 'src/environments/environment';
declare var CKEDITOR: any;
@Component({
	selector: 'app-system-info',
	templateUrl: './system-info.component.html',
	styleUrls: ['./system-info.component.scss']
})
export class SystemInfoComponent implements OnInit, AfterViewInit {

	@ViewChild('deleteModal') deleteModal;
	@ViewChild('paginator') paginator: MatPaginator;
	@ViewChild('answerckeditor') answerckeditor: any;
	@ViewChild(MatSort) sort: MatSort;
	confirmValidParentMatcher = new ConfirmValidParentMatcher();
	deleteMessage: any = 'Are You Sure you want to Delete...?';
	formGroupArray: any[] = [];
	dptFormGroupArray: any[] = [];
	configValue: any;
	vaccinationArray: any[] = [];
	departmentArray: any[] = [];
	configFlag = false;
	updateFlag = false;
	settings: any;
	templateArray: any[] = [];
	ckeConfig: any;
	configArray: any[] = [];
	loadConfig: boolean = false;
	constructor(private fbuild: FormBuilder,
		private commonService: CommonAPIService,
		private sisService: SisService,
		private htt: HtmlToTextService,
		private erpCommonService: ErpCommonService) { }

	ngOnInit() {
		this.ckeConfig = ckconfig;
		this.getSLCTCFormConfig();
		this.buildForm();
		this.getDepartment();
		this.getSMStemplate();
	}

	ngAfterViewInit() {
	}

	buildForm() {
		this.formGroupArray = [
			{
				formGroup: this.fbuild.group({
					id: '',
					title: '',
					body: '',
					status: '',
				})
			}
		];
	}

	getDepartment() {
		this.sisService.getDepartment({}).subscribe((result: any) => {
			if (result && result.status == 'ok') {
				this.departmentArray = result.data;

				for (let i = 0; i < this.departmentArray.length; i++) {
					this.dptFormGroupArray.push({
						formGroup: this.fbuild.group({
							dpt_id: this.departmentArray[i]['dept_id'],
							leave_credit_count: ''
						})
					});
				}

			} else {
				this.departmentArray = [];
			}

		});
	}
	htmlToText(html) {
		return this.htt.htmlToText(html);
	}
	getSMStemplate() {
		// this.sisService.getSMStemplate().subscribe((res:any) => {
		// 	console.log("i am res", res);

		// })
		this.sisService.getTemplate2({ tpl_type: 'S' }).subscribe((res: any) => {
			console.log("this is template", res);
			if (res && res.data.length > 0) {
				this.templateArray = res.data
			}

		})
	}
	getGlobalSetting(that) {
		this.erpCommonService.getGlobalSetting({ "gs_alias": "employee_monthly_leave_credit" }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.settings = result.data;
				for (let i = 0; i < this.settings.length; i++) {
					if (this.settings[i]['gs_alias'] === 'employee_monthly_leave_credit') {
						const settingData = JSON.parse(this.settings[i]['gs_value']);

						for (let j = 0; j < settingData.length; j++) {
							this.dptFormGroupArray[j].formGroup.patchValue({
								'dpt_id': settingData[j]['dpt_id'],
								'leave_credit_count': settingData[j]['leave_credit_count']
							});
						}

					}
				}


			}
		});
	}

	updateGlobalSetting() {
		let temp_arr = [];
		for (var i = 0; i < this.departmentArray.length; i++) {
			temp_arr.push(this.dptFormGroupArray[i].formGroup.value);
		}

		let inputJson = { 'employee_monthly_leave_credit': JSON.stringify(temp_arr) };
		if (this.formGroupArray[this.configValue - 1].formGroup.valid) {
			//let inputJson = {'library_user_setting' : JSON.stringify(this.formGroupArray[this.configValue-1].formGroup.value)};
			this.erpCommonService.updateGlobalSetting(inputJson).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.commonService.showSuccessErrorMessage(result.message, result.status);
				} else {
					this.commonService.showSuccessErrorMessage(result.message, result.status);
				}
			});
		} else {
			this.commonService.showSuccessErrorMessage('Please Fill All Required Fields', 'error');
		}

	}

	resetForm() {
		this.formGroupArray[0].formGroup.reset();
	}

	loadConfiguration($event) {
		this.configFlag = false;
		this.updateFlag = false;
		this.configValue = $event.value;
		if (Number(this.configValue) === 1) {
			this.getGlobalSetting(this);
			this.configFlag = true;
		}
	}
	deleteConfirm($event) {

	}
	deleteCancel() {

	}
	editStep(item) {
		console.log("i am item------", item);
		this.formGroupArray[0].formGroup.patchValue({
			id: item.tpl_id,
			title: item.tpl_title,
			body: item.tpl_body,
			status: item.tpl_status
		})
		
	}


	addAndUpdateTemplate() {
		console.log('------------------', this.formGroupArray[0].formGroup.value);
		let value = this.formGroupArray[0].formGroup.value
		this.sisService.addAndUpdateTemplate(value).subscribe((res:any) => {
			this.getSMStemplate();
			this.resetForm();
		})
		

	}

	changeStat(element, item) {
		console.log("i am element-----------------", element, item);
		this.sisService.changeStatus({tpl_id: item.tpl_id, tpl_status: element.checked}).subscribe((res:any) => {
			console.log("i am res", res);	
		})
	}

	getSLCTCFormConfig() {
		this.configArray = [];
		this.sisService.getSlcTcFormConfig({ tmap_usts_id: "18" }).subscribe((result: any) => {
			if (result.status === 'ok') {
				for (const item of result.data) {
					this.configArray.push({
						sff_label: item.sff_label,
						sff_ff_id: item.sff_ff_id,
						sff_id: item.sff_id,
						sff_field_tag: item.sff_field_tag,
						sff_field_type: item.sff_field_type
					});
				}
				this.loadPlugin();
			}
		});
	}
	loadPlugin() {
		console.log('load plugin');
		let array2 = [];
		array2 = this.configArray;
		console.log(this.configArray, ' --------------------------------------------------------------');
		// tslint:disable-next-line:forin
		console.log(CKEDITOR.plugins);
		delete CKEDITOR.plugins.registered['strinsertExt'];
		if (!(CKEDITOR.plugins.registered['strinsertExt'])) {
			console.log('inside plugin');
			CKEDITOR.plugins.add('strinsertExt', {
				requires: ['richcombo'],
				init: editor => {
					// array of strings to choose from that'll be inserted into the editor
					const strings2: any = [];
					for (const item of array2) {
						if (item.sff_field_type === 'prefetch') {
							strings2.push(['{{' + item.sff_field_tag + '}}', item.sff_label, 'Choose ' + item.sff_label, item.sff_ff_id]);
						}
					}
					for (const item of array2) {
						if (item.sff_field_type === 'custom') {
							strings2.push(['((' + item.sff_field_tag + '))', item.sff_label, 'Choose ' + item.sff_label, item.sff_ff_id]);
						}
					}
					console.log(strings2);
					// add the menu to the editor
					editor.ui.addRichCombo('strinsertExt', {
						label: 'Choose Label',
						title: 'Choose Label',
						voiceLabel: 'Choose Label',
						className: 'Choose Label',
						multiSelect: false,
						panel: {
							css: [editor.config.contentsCss, CKEDITOR.skin.getPath('editor')],
							voiceLabel: editor.lang.panelVoiceLabel
						},
						init: function () {
							this.startGroup('Choose Labels');
							// tslint:disable-next-line:forin
							for (const i in strings2) {
								this.add(strings2[i][0], strings2[i][1], strings2[i][2]);
							}
						},
						onClick: function (value) {
							editor.focus();
							editor.fire('saveSnapshot');
							editor.insertHtml(value);
							editor.fire('saveSnapshot');
						}
					});
				}

			});

			this.ckeConfig = {
				allowedContent: true,
				pasteFromWordRemoveFontStyles: false,
				contentsCss: ['https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css'],
				disallowedContent: 'm:omathpara',
				height: '263px',
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

			this.loadConfig = true;
		}

		// this.loadCkEditorConfiguration();
	}

}
