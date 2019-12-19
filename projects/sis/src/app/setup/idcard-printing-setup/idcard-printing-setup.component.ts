import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArrayName, FormControl } from '@angular/forms';
import { CommonAPIService, SisService } from '../../_services/index';
import { MatDialogRef, MatDialog } from '@angular/material';
import { PreviewDocumentComponent } from '../../student-master/documents/preview-document/preview-document.component';
@Component({
	selector: 'app-idcard-printing-setup',
	templateUrl: './idcard-printing-setup.component.html',
	styleUrls: ['./idcard-printing-setup.component.scss']
})
export class IdcardPrintingSetupComponent implements OnInit {
	// Declaring variables
	idcardForm: FormGroup;
	pageArray: any[] = [];
	sizeArray: any[] = [{ id: '1', name: 'Extra Large' },
	{ id: '2', name: 'Large' },
	{ id: '3', name: 'Medium' },
	{ id: '4', name: 'Small' },
	{ id: '5', name: 'Extra Small' }];
	headerforecolor: any;
	headerbackcolor: any;
	stunameforecolor: any;
	stunamebackcolor: any;
	icarddetforecolor: any;
	footerforecolor: any;
	footerbackcolor: any;
	showImage = false;
	hideIfBlankFlag = false;
	templateImage: any;
	showTempImage = false;
	authSignFlag = false;
	schoolLogo: any = '';
	school_logo_image: any;
	showSchoolImage = false;
	showWaterImage = false;
	waterMarkImage: any = '';
	currentImage: any;
	logoPosition: any[] = [{ id: '1', pos: 'Top' },
	{ id: '2', pos: 'Bottom' },
	{ id: '3', pos: 'Left' },
	{ id: '4', pos: 'Right' }];
	styleArray: any[] = [{ ps_card_style: '1', ps_card_style_name: 'Style 1' },
	{ ps_card_style: '2', ps_card_style_name: 'Style 2' },
	{ ps_card_style: '3', ps_card_style_name: 'Style 3' }];
	layoutArray: any[] = [{ ps_card_layout: '1', ps_card_layout_name: 'Landscape' },
	{ ps_card_layout: '2', ps_card_layout_name: 'Potrait' }];
	addressFontSize: any[] = [];
	idCardSettings: any;
	multipleFileArray: any[] = [];
	authImage: any;
	dialogRef2: MatDialogRef<PreviewDocumentComponent>;
	constructor(private fbuild: FormBuilder,
		private sisService: SisService,
		private commonService: CommonAPIService,
		private dialog: MatDialog) { }

	ngOnInit() {
		for (let i = 0; i < 100; i++) {
			this.pageArray.push(i + 1);
		}
		this.buildForm();
		this.headerforecolor = '';
		this.headerbackcolor = '';
		this.stunameforecolor = '';
		this.stunamebackcolor = '';
		this.icarddetforecolor = '';
		this.footerforecolor = '';
		this.footerbackcolor = '';
		this.idcardForm.patchValue({
			ps_image_layout_size: 'Large'
		});
		this.getIdCardSettings();
		for (let i = 0; i < 100; i++) {
			this.addressFontSize.push(i + 1);
		}
	}
	buildForm() {
		this.idcardForm = this.fbuild.group({
			ps_card_style: '',
			ps_card_layout: '',
			ps_per_page: '',
			ps_border: '',
			ps_back_side: '',
			ps_barcode: '',
			ps_guardian_pic: '',
			ps_parent_pic: '',
			ps_header_fore_color: '',
			ps_footer_fore_color: '',
			ps_student_fore_color: '',
			ps_student_back_color: '',
			ps_header_back_color: '',
			ps_footer_back_color: '',
			ps_sch_addr_font_size: '',
			ps_image_layout_size: '',
			ps_id_color: '',
			ps_auth_sign: '',
			ps_hide_dob: '',
			ps_hide_transport: '',
			ps_show_authority: '',
			ps_show_parent_name: '',
			ps_show_parent_mobile: '',
			ps_sch_logo: '',
			ps_footer: '',
			ps_content_bold: '',
			ps_missing_student: '',
			ps_print_parent_card: '',
			ps_auth_sign_text: '',
			ps_hide_photo: '',
			ps_show_stu_addr: '',
			ps_hide_stu_bg: '',
		});
	}
	getHeaderForeColorChange($event) {
		this.headerforecolor = $event;
		this.idcardForm.patchValue({
			ps_header_fore_color: this.headerforecolor
		});
	}
	getHeaderBackColorChange($event) {
		this.headerbackcolor = $event;
		this.idcardForm.patchValue({
			ps_header_back_color: this.headerbackcolor
		});
	}
	getStuNameForeColorChange($event) {
		this.stunameforecolor = $event;
		this.idcardForm.patchValue({
			ps_student_fore_color: this.stunameforecolor
		});
	}
	getStuNameBackColorChange($event) {
		this.stunamebackcolor = $event;
		this.idcardForm.patchValue({
			ps_student_back_color: this.stunamebackcolor
		});
	}
	getICardForeColorChange($event) {
		this.icarddetforecolor = $event;
		this.idcardForm.patchValue({
			ps_id_color: this.icarddetforecolor
		});
	}
	getFooterBackColorChange($event) {
		this.footerbackcolor = $event;
		this.idcardForm.patchValue({
			ps_footer_back_color: this.footerbackcolor
		});
	}
	getFooterForeColorChange($event) {
		this.footerforecolor = $event;
		this.idcardForm.patchValue({
			ps_footer_fore_color: this.footerforecolor
		});
	}
	saveIdCardSettings() {
		this.idcardForm.value.ps_auth_sign = this.authImage;
		this.idcardForm.value.ps_user_type = 'student';
		this.sisService.addIdCardPrintSettings(this.idcardForm.value).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.commonService.showSuccessErrorMessage('Settings Saved', 'success');
				this.getIdCardSettings();
			} else {
				this.commonService.showSuccessErrorMessage('Settings Not Saved', 'error');
			}
		});
	}
	getIdCardSettings() {
		this.idCardSettings = {};
		this.sisService.getIdCardPrintSettings({
			user_type: 'student'
		}).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.idCardSettings = result.data[0];
				this.headerforecolor = this.idCardSettings.ps_header_fore_color;
				this.headerbackcolor = this.idCardSettings.ps_header_back_color;
				this.stunameforecolor = this.idCardSettings.ps_student_fore_color;
				this.stunamebackcolor = this.idCardSettings.ps_student_back_color;
				this.icarddetforecolor = this.idCardSettings.ps_id_color;
				this.footerforecolor = this.idCardSettings.ps_footer_fore_color;
				this.footerbackcolor = this.idCardSettings.ps_footer_back_color;
				this.authImage = this.idCardSettings.ps_auth_sign;
				this.showImage = true;
				if (this.idCardSettings.ps_missing_student === '1') {
					this.hideIfBlankFlag = false;
				} else {
					this.hideIfBlankFlag = true;
				}
				if (this.idCardSettings.ps_auth_sign_text === '1') {
					this.authSignFlag = true;
				} else {
					this.authSignFlag = false;
				}
				this.idcardForm.patchValue({
					ps_card_style: this.idCardSettings.ps_card_style,
					ps_card_layout: this.idCardSettings.ps_card_layout,
					ps_per_page: Number(this.idCardSettings.ps_per_page),
					ps_border: this.idCardSettings.ps_border === '1' ? true : false,
					ps_back_side: this.idCardSettings.ps_back_side === '1' ? true : false,
					ps_barcode: this.idCardSettings.ps_barcode === '1' ? true : false,
					ps_guardian_pic: this.idCardSettings.ps_guardian_pic === '1' ? true : false,
					ps_parent_pic: this.idCardSettings.ps_parent_pic === '1' ? true : false,
					ps_header_fore_color: this.idCardSettings.ps_header_fore_color,
					ps_footer_fore_color: this.idCardSettings.ps_footer_fore_color,
					ps_student_fore_color: this.idCardSettings.ps_student_fore_color,
					ps_student_back_color: this.idCardSettings.ps_student_back_color,
					ps_header_back_color: this.idCardSettings.ps_header_back_color,
					ps_footer_back_color: this.idCardSettings.ps_footer_back_color,
					ps_sch_addr_font_size: Number(this.idCardSettings.ps_sch_addr_font_size),
					ps_image_layout_size: this.idCardSettings.ps_image_layout_size,
					ps_id_color: this.idCardSettings.ps_id_color,
					ps_hide_dob: this.idCardSettings.ps_hide_dob === '1' ? true : false,
					ps_hide_transport: this.idCardSettings.ps_hide_transport === '1' ? true : false,
					ps_show_authority: this.idCardSettings.ps_show_authority === '1' ? true : false,
					ps_show_parent_name: this.idCardSettings.ps_show_parent_name === '1' ? true : false,
					ps_show_parent_mobile: this.idCardSettings.ps_show_parent_mobile === '1' ? true : false,
					ps_sch_logo: this.idCardSettings.ps_sch_logo === '1' ? true : false,
					ps_hide_photo: this.hideIfBlankFlag === true ? true : false,
					ps_footer: this.idCardSettings.ps_footer,
					ps_content_bold: this.idCardSettings.ps_content_bold === '1' ? true : false,
					ps_missing_student: this.idCardSettings.ps_missing_student === '1' ? true : false,
					ps_print_parent_card: this.idCardSettings.ps_print_parent_card === '1' ? true : false,
					ps_auth_sign_text: this.idCardSettings.ps_auth_sign_text === '1' ? true : false,
					ps_show_stu_addr: this.idCardSettings.ps_show_stu_addr === '1' ? true : false,
					ps_hide_stu_bg: this.idCardSettings.ps_hide_stu_bg === '1' ? true : false,
				});
			}
		});
	}
	uploadAuthSign($event) {
		this.multipleFileArray = [];
		const files: FileList = $event.target.files;
		for (let i = 0; i < files.length; i++) {
			this.IterateFileLoop(files[i]);
		}
	}
	IterateFileLoop(files) {
		const reader = new FileReader();
		reader.onloadend = (e) => {
			this.currentImage = reader.result;
			const fileJson = {
				fileName: files.name,
				imagebase64: this.currentImage
			};
			this.multipleFileArray.push(fileJson);
			this.sisService.uploadDocuments(this.multipleFileArray).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.authImage = result.data[0].file_url;
					this.showImage = true;
				}
			});
		};
		reader.readAsDataURL(files);
	}
	uploadLogo($event) {
		this.multipleFileArray = [];
		const files: FileList = $event.target.files;
		for (let i = 0; i < files.length; i++) {
			this.IterateFileLoop2(files[i]);
		}
	}
	IterateFileLoop2(files) {
		const reader = new FileReader();
		reader.onloadend = (e) => {
			this.currentImage = reader.result;
			const fileJson = {
				fileName: files.name,
				imagebase64: this.currentImage
			};
			this.multipleFileArray.push(fileJson);
			this.sisService.uploadDocuments(this.multipleFileArray).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.schoolLogo = result.data[0].file_url;
					this.showSchoolImage = true;
				}
			});
		};
		reader.readAsDataURL(files);
	}
	uploadTempImage($event) {
		this.multipleFileArray = [];
		const files: FileList = $event.target.files;
		for (let i = 0; i < files.length; i++) {
			this.IterateFileLoop3(files[i]);
		}
	}
	IterateFileLoop3(files) {
		const reader = new FileReader();
		reader.onloadend = (e) => {
			this.currentImage = reader.result;
			const fileJson = {
				fileName: files.name,
				imagebase64: this.currentImage
			};
			this.multipleFileArray.push(fileJson);
			this.sisService.uploadDocuments(this.multipleFileArray).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.templateImage = result.data[0].file_url;
					this.showTempImage = true;
				}
			});
		};
		reader.readAsDataURL(files);
	}
	uploadWaterImage($event) {
		this.multipleFileArray = [];
		const files: FileList = $event.target.files;
		for (let i = 0; i < files.length; i++) {
			this.IterateFileLoop4(files[i]);
		}
	}
	IterateFileLoop4(files) {
		const reader = new FileReader();
		reader.onloadend = (e) => {
			this.currentImage = reader.result;
			const fileJson = {
				fileName: files.name,
				imagebase64: this.currentImage
			};
			this.multipleFileArray.push(fileJson);
			this.sisService.uploadDocuments(this.multipleFileArray).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.waterMarkImage = result.data[0].file_url;
					this.showWaterImage = true;
				}
			});
		};
		reader.readAsDataURL(files);
	}
	idCardMissing($event) {
		if ($event.checked === true) {
			this.idcardForm.patchValue({
				ps_hide_photo: false
			});
			this.hideIfBlankFlag = false;
		} else {
			this.hideIfBlankFlag = true;
		}
	}
	checkAuthStatus($event) {
		if ($event.checked === true) {
			this.authSignFlag = true;
		} else {
			this.authSignFlag = false;
			this.authImage = '';
			this.idcardForm.patchValue({
				ps_auth_sign: this.authImage
			});
		}
	}
	previewImage(img) {
		const imgArray: any[] = [];
		imgArray.push({
			imgName: img,
			doc_req_id: ''
		});
		this.dialogRef2 = this.dialog.open(PreviewDocumentComponent, {
			data: {
				imageArray: imgArray
			},
			height: '70vh',
			width: '70vh'
		});
	}
}
