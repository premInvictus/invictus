import { Component, OnInit } from '@angular/core';
import { CommonAPIService, SisService } from '../../_services/index';
import { FormGroup, FormBuilder } from '@angular/forms';
@Component({
	selector: 'app-external-enquiry-setup',
	templateUrl: './external-enquiry-setup.component.html',
	styleUrls: ['./external-enquiry-setup.component.scss']
})
export class ExternalEnquirySetupComponent implements OnInit {
	setupHeader: any = 'External Enquiry Form Configuration';
	tabBifurCationEnqCumRegistration: any[] = [];
	settingsArray: any[] = [];
	configArray: any[] = [];
	disabledArray: any[] = [
		{ tab_id: 12, value: false },
		{ tab_id: 13, value: false },
		{ tab_id: 14, value: false },
		{ tab_id: 15, value: false },
		{ tab_id: 16, value: true },
		{ tab_id: 17, value: false }
	];
	expandedArray: any[] = [
		{ tab_id: 12, value: false },
		{ tab_id: 13, value: false },
		{ tab_id: 14, value: false },
		{ tab_id: 15, value: false },
		{ tab_id: 16, value: false },
		{ tab_id: 17, value: false }
	];
	formFieldArray: any[] = [];
	savedSettingsArray: any[] = [];
	finalDocumentArray: any[] = [];
	imageArray: any[] = [];
	checkTabStatus = false;
	multipleFileArray: any[] = [];
	currentFileChangeEvent: any;
	counter = 0;
	currentImage: any;
	ckeConfig: any;
	insForm1: FormGroup;
	insForm2: FormGroup;
	instructionsArray: any = {};
	noteImportantInstructions: any[] = [];
	constructor(private sisService: SisService,
		private common: CommonAPIService,
		private fbuild: FormBuilder) { }

	ngOnInit() {
		this.buildForm();
		this.ckeConfig = {
			allowedContent: true,
			pasteFromWordRemoveFontStyles: false,
			removePlugins: '',
			contentsCss: ['https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css'],
			disallowedContent: 'm:omathpara',
			// tslint:disable-next-line:max-line-length
			scayt_multiLanguageMod: true,
			toolbar: [
				// tslint:disable-next-line:max-line-length
				['Font', 'FontSize', 'Subscript', 'Superscript', 'Videoembed', 'Bold', 'Italic', 'Underline', 'Strikethrough', 'Image', 'Table', 'Templates'
				]
			],
			removeDialogTabs: 'image:advanced;image:Link'
		};
		this.getInstructions();
		this.getTabBifurcationEnqCumRegistration();
		this.getFormFields();
		this.getConfigureSetting();
		this.getDocumentsAll(this);
		this.getInstructionsAll(this);
	}
	buildForm() {
		this.insForm1 = this.fbuild.group({
			schi_id: '',
			schi_important_note: '',
			schi_banner_url: ''
		});
		this.insForm2 = this.fbuild.group({
			schi_id: '',
			schi_important_note: '',
			schi_print_instruction: '',
			schi_banner_url: '',
			schi_status: ''


		});
	}
	getTabBifurcationEnqCumRegistration() {
		this.sisService.getTabBifurcation().subscribe((result: any) => {
			if (result.status === 'ok') {
				for (const tab of result.data) {
					if (Number(tab.tb_id) > 11) {
						this.tabBifurCationEnqCumRegistration.push(tab);
					}
				}
			}
		});
	}
	toggleTab($event, tab_id, index) {
		if ($event.checked === true) {
			this.disabledArray[index].value = false;
			this.expandedArray[index].value = true;
			const findex = this.settingsArray.findIndex(f => f.cos_tb_id === tab_id &&
				f.cos_status === 'N' && f.cos_ff_id === '0');
			if (findex !== -1) {
				this.settingsArray.splice(findex, 1);
			}
		} else {
			this.disabledArray[index].value = true;
			this.expandedArray[index].value = false;
			this.settingsArray.push({
				cos_tb_id: tab_id,
				cos_ff_id: '0',
				cos_status: 'N'
			});
		}
	}
	getFormFields() {
		this.sisService.getFormFields({ ff_tab_id: '' }).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.formFieldArray = result.data;
			}
		});
	}
	statusChangeEvent($event, id, tab_id) {
		const findex = this.settingsArray.findIndex(f => Number(f.cos_ff_id) === Number(id)
			&& Number(f.cos_tb_id) === Number(tab_id));
		if (findex === -1 && $event.checked === true) {
			this.settingsArray.push({
				cos_tb_id: tab_id,
				cos_ff_id: id,
				cos_status: 'Y'
			});
		} else if (findex === -1 && $event.checked === false) {
			this.settingsArray.push({
				cos_tb_id: tab_id,
				cos_ff_id: id,
				cos_status: 'N'
			});
		} else if (findex !== -1 && $event.checked === false) {
			this.settingsArray.splice(findex, 1);
			this.settingsArray.push({
				cos_tb_id: tab_id,
				cos_ff_id: id,
				cos_status: 'N'
			});
		} else if (findex !== -1 && $event.checked === true) {
			this.settingsArray.splice(findex, 1);
			this.settingsArray.push({
				cos_tb_id: tab_id,
				cos_ff_id: id,
				cos_status: 'Y'
			});
		}
	}
	checkFieldsStatus(id, tab_id) {
		const findex = this.settingsArray.findIndex(f => Number(f.cos_ff_id) === Number(id)
			&& Number(f.cos_tb_id) === Number(tab_id));
		if (findex !== -1 && this.settingsArray[findex]['cos_status'] === 'Y') {
			return true;
		}
		if (findex !== -1 && this.settingsArray[findex]['cos_status'] === 'N') {
			return false;
		}
	}
	saveEnquirySettings() {
		const settingsJson = {
			cos_process_type: '6',
			configRelation: this.settingsArray
		};
		this.sisService.insertConfigureSetting(settingsJson).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.common.showSuccessErrorMessage('Form settings changed', ' success');
				if (this.instructionsArray === {}) {
					this.insForm2.value.schi_important_note = this.insForm1.value.schi_important_note;
					this.insForm2.value.schi_banner_url = this.imageArray[0].imgName;
					this.insForm2.value.schi_status = '1';
					this.sisService.insertSchoolInstructions(this.insForm2.value).subscribe((result2: any) => {
						if (result2.status === 'ok') {
							this.common.showSuccessErrorMessage('Added SucessFully', 'succees');
						}
					});
				} else {
					this.insForm2.value.schi_important_note = this.insForm1.value.schi_important_note;
					this.insForm2.value.schi_banner_url = this.imageArray[0].imgName;
					this.insForm2.value.schi_status = '1';
					this.insForm2.value.schi_id = this.instructionsArray.schi_id;
					this.sisService.updateSchoolInstructions(this.insForm2.value).subscribe((result2: any) => {
						if (result2.status === 'ok') {
							this.common.showSuccessErrorMessage('Updated SucessFully', 'succees');
						}
					});
				}
				this.getConfigureSetting();
			}
		});
	}
	getConfigureSetting() {
		this.settingsArray = [];
		this.sisService.getConfigureSetting({
			cos_process_type: '6'
		}).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.savedSettingsArray = result.data;
				for (const item of this.savedSettingsArray) {
					this.settingsArray.push({
						cos_tb_id: item.cos_tb_id,
						cos_ff_id: item.cos_ff_id,
						cos_status: item.cos_status
					});
				}
				const findex = this.settingsArray.findIndex(f => f.cos_tb_id === '16' &&
					f.cos_ff_id === '0');
				if (findex !== -1) {
					this.disabledArray[4].value = true;
					this.expandedArray[4].value = false;
					this.checkTabStatus = false;
				} else {
					this.disabledArray[4].value = false;
					this.expandedArray[4].value = false;
					this.checkTabStatus = true;
				}
			}
		});
	}
	getDocumentsAll(that) {
		that.configArray = [];
		that.sisService.getDocumentRequired().subscribe((result: any) => {
			if (result.status === 'ok') {
				for (const item of result.data) {
					that.configArray.push(item);
				}
			}
		});
	}
	getInstructionsAll(that) {
		that.bannerArray = [];
		that.sisService.getSchoolInstructions().subscribe((result: any) => {
			if (result.status === 'ok') {
				for (const item of result.data) {
					that.bannerArray.push(item);
				}
			}
		});
	}
	toggleDocStatus(value: any) {
		if (value.docreq_status === '1') {
			value.docreq_status = '0';
		} else {
			value.docreq_status = '1';
		}
		this.sisService.updateDocumentRequired(value).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.common.showSuccessErrorMessage('Status Changed', 'success');
				this.getDocumentsAll(this);
			}
		});
	}
	getActiveDocStatus(value: any) {
		if (value.docreq_status === '1') {
			return true;
		}
	}
	fileChangeEvent(fileInput, doc_req_id) {
		this.multipleFileArray = [];
		this.finalDocumentArray = [];
		this.imageArray = [];
		this.counter = 0;
		this.currentFileChangeEvent = fileInput;
		const files = fileInput.target.files;
		for (let i = 0; i < files.length; i++) {
			this.IterateFileLoop(files[i], doc_req_id);
		}
	}
	IterateFileLoop(files, doc_req_id) {
		const reader = new FileReader();
		reader.onloadend = (e) => {
			this.currentImage = reader.result;
			const fileJson = {
				fileName: files.name,
				imagebase64: this.currentImage,
				module: 'banner'
			};
			this.multipleFileArray.push(fileJson);
			this.counter++;
			if (this.counter === this.currentFileChangeEvent.target.files.length) {
				this.sisService.uploadDocuments(this.multipleFileArray).subscribe((result: any) => {
					if (result) {
						for (const item of result.data) {
							this.finalDocumentArray.push({
								ed_name: item.file_name,
								ed_link: item.file_url,
							});
							this.imageArray.push({
								ed_docreq_id: doc_req_id,
								imgName: item.file_url
							});
						}
					}
				});
			}
		};
		reader.readAsDataURL(files);
	}
	getInstructions() {
		this.sisService.getSchoolInstructions().subscribe((result: any) => {
			if (result.status === 'ok') {
				this.instructionsArray = result.data[0];
				this.imageArray.push({ imgName: this.instructionsArray.schi_banner_url });
				this.insForm1.patchValue({
					schi_important_note: this.instructionsArray.schi_important_note
				});
				this.insForm2.patchValue({
					schi_print_instruction: this.instructionsArray.schi_print_instruction
				});
			}
		});
	}
}
