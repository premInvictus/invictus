import { Component, OnInit } from '@angular/core';
import { SisService, CommonAPIService } from '../../_services';
import { FormBuilder, FormGroup } from '@angular/forms';
declare var CKEDITOR: any;
@Component({
	selector: 'app-slctc-printing-setup',
	templateUrl: './slctc-printing-setup.component.html',
	styleUrls: ['./slctc-printing-setup.component.scss']
})
export class SlctcPrintingSetupComponent implements OnInit {
	templateForm: FormGroup;
	configArray: any[] = [];
	labelArray: any[] = ['Name of Pupil', 'Father\'s Name', 'Mother\'s Name',
		'Nationality (Indian/Others)', 'Date of first admission in the school with class',
		'Date of Birth (in Christian Era)-<br> according to Admission Register <br>In figures<br> In words',
		'Class in which the pupil last studied <br> In figures <br> In words',
		'Schoool/Board annual examination last taken', 'Wheter Passed or Failed',
		'Subject Studied', 'Wheter qualified for promotion to-<br>the higher class ,If so, to which class',
		'Month upto which pupil has paid the school dues',
		'Any fee concession availed of: If so the nature of such concession',
		'Total no of working days',
		'Tootal no of working days present',
		'Wheter NCC Cadet/Boy/Scout/Girl-<br>Guide(Details may be given)',
		'Games playedor extra- curricular activities in which pupil usually took part- <br>(mention achievement level there)',
		'General Comduct', 'Date of application for certificate', 'Date of issue of certificate', 'Reasons for leaving the school',
		'Any other Remarks'];
	ckeConfig: any;
	renderTable: any = '';
	constructor(private fbuild: FormBuilder,
		private sisService: SisService,
		private common: CommonAPIService) { }

	ngOnInit() {
		this.buildForm();
		this.ckeConfig = {
			allowedContent: true,
			pasteFromWordRemoveFontStyles: false,
			contentsCss: ['https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css'],
			disallowedContent: 'm:omathpara',
			height: '800',
			width: '100%',
			// tslint:disable-next-line:max-line-length
			extraPlugins: 'strinsertExt',
			scayt_multiLanguageMod: true,
			toolbar: [
				// tslint:disable-next-line:max-line-length
				['Source', 'Font', 'FontSize', 'Subscript', 'Superscript', 'Videoembed', 'Bold', 'Italic', 'Underline', 'Strikethrough', 'Image', 'Table', 'Templates',
					{ name: 'strinsertExt', items: ['strinsertExt'] }
				]
			],
			removeDialogTabs: 'image:advanced;image:Link'
		};
		this.getSLCTCFormConfig();
		this.getSLCTCFormConfig2();
		this.getTemplate();
	}
	buildForm() {
		this.templateForm = this.fbuild.group({
			usts_template: '',
			usts_name: '',
			usts_id: '1'
		});
	}
	insertTemplate() {
		this.sisService.insertSlcTcTemplateSetting(this.templateForm.value).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.common.showSuccessErrorMessage('Template Added', 'success');
				//this.getTemplate();
			}
		});
	}
	getTemplate() {
		this.sisService.getSlcTcTemplateSetting({ usts_id: this.templateForm.value.usts_id }).subscribe((result: any) => {
			if (result.status === 'ok') {
				console.log(result.data[0].usts_template);
				this.templateForm.patchValue({
					'usts_template': result.data[0].usts_template
				});
			}
		});
	}
	loadPlugin(array2: any) {
		// tslint:disable-next-line:forin
		if (!(CKEDITOR.plugins.registered['strinsertExt'])) {
			CKEDITOR.plugins.add('strinsertExt', {
				requires: ['richcombo'],
				init: function (editor) {
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
		}
	}
	getSLCTCFormConfig() {
		this.configArray = [];
		this.sisService.getSlcTcFormConfig({ tmap_usts_id: '1' }).subscribe((result: any) => {
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
				this.loadPlugin(this.configArray);
			}
		});
	}
	getSLCTCFormConfig2() {
		this.configArray = [];
		let i = 0;
		for (const item of this.labelArray) {
			this.renderTable = this.renderTable + '<tr style="text-align:left;"><td style="padding-top: 12px;' +
				'padding-bottom: 12px;border: 1px solid #ffff;padding-left: 15px;' +
				'text-align: center;width:10%;' +
				'padding-right: 15px;vertical-align: top">' + (i + 1) + '</td>' +
				'<td style="padding-top: 12px;width: 65%;' +
				'padding-bottom: 12px; border: 1px solid #ffff;">' + item + '</td>' +
				'<td style="padding-top: 12px;border: 1px solid #ffff;' +
				'padding-bottom: 12px;padding-left: 15px; font-weight: bold">-----</td>' +
				'</tr>';
			i++;
		}
		this.templateForm.patchValue({
			'usts_template': '<html lang="en"><head>' +
				'<meta charset="UTF-8">' +
				'<meta name="viewport" content="width=device-width, initial-scale=1.0">' +
				'<meta http-equiv="X-UA-Compatible" content="ie=edge">' +
				'<title>PrintConfig SLC/TC</title>' +
				'</head>' +
				'<body>' +
				'<table style="color: #333;border: 1px solid #ffff;font-family: Helvetica, Arial, sans-serif; width: 100%;' +
				'border-collapse: collapse; border-spacing: 0; padding-bottom: 100px;">' +
				'<thead class="table-skill__head text-center">' +
				'<tr style="text-align: center">' +
				'<td style="padding-top : 12px;' +
				'padding-bottom: 12px;" colspan="3">' +
				'<h4 style="margin-bottom:5px;text-transform:uppercase"><b>St. <span>Xaviers High School</span></b></h4>' +
				'<span style="font-size: 14px;">Durgapur, Satar Road, Deoghar, Jharkhand - 814 112</span><br>' +
				'<span style="font-size: 14px; text-transform:uppercase">(Co education engish medium school)' +
				'<br> (Affiliated to c.b.s.e new delhi )' +
				'</span></td></tr>' +
				'<tr style="text-align: center">' +
				'<td style="padding-top : 12px;' +
				'padding-bottom: 12px;border: 1px solid #ffff;" colspan="3">' +
				'<span style="font-size: 14px;text-transform:uppercase">Transfer Certificate</span><br>' +
				'</span></td></tr>' +
				'</thead>' +
				'  <tbody style="font-size: 14px;">' + this.renderTable + '</tbody>' +
				'</table>' +
				'<section></body></html'
		});
	}
}
