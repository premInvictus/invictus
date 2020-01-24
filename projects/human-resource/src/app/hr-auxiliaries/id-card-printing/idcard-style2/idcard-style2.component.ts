import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { CommonAPIService, SisService } from '../../../_services/index';

@Component({
	selector: 'app-idcard-style2',
	templateUrl: './idcard-style2.component.html',
	styleUrls: ['./idcard-style2.component.scss']
})
export class IdcardStyle2Component implements OnInit, OnChanges {

	@Input() studentDetails: any;
	@Input() idCardConfig: any;
	studentProfileImage: any = 'https://via.placeholder.com/75';
	schoolInfo: any = {};
	authSign: any;
	container_box_idheader: any;
	container_box_idheader_bgColor: any;
	showSchoolLogo = false;
	showAuthority = false;
	showBorder: any;
	allContentBold: any;
	stuAddressFlag = false;
	dontPrintStatus = false;
	showStudentImage = false;
	studentNameForeColor: any;
	addressFontSize: any;
	currentDate = new Date();
	idColor: any;
	schoolLogo: any;
	bloodGroupArray: any[] = [];
	sessionPromote: any;
	studentNameBgColor: any;
	footerFontColor: any;
	footerBgColor: any;
	idcardBodyColor: any;
	showLandscape = false;
	showPotrait = false;
	dobFlag = false;
	showBackSide = false;
	showParentPhoto = false;
	showGuardianPhoto = false;
	photo: any = '';
	showParentMobile = false;
	showParentName = false;
	constructor(private sisService: SisService,
		private commonApiService: CommonAPIService) { }

	ngOnInit() {
	}
	ngOnChanges() {
		this.sessionPromote = (this.currentDate.getFullYear().toString()) + '-'
			+ ((this.currentDate.getFullYear() + 1).toString()).substring(2, 4);
		this.getSchool();
		this.getBloodGroup();
		if (this.studentDetails.au_profileimage) {
			this.studentProfileImage = this.studentDetails.au_profileimage;
		} else {
			this.studentProfileImage = 'https://via.placeholder.com/150';
		}
		if (Number(this.idCardConfig.ps_missing_student) === 1 && this.studentProfileImage === 'https://via.placeholder.com/75') {
			this.dontPrintStatus = true;
		} else {
			this.dontPrintStatus = false;
		}
		if (Number(this.idCardConfig.ps_hide_photo) === 1 && this.studentProfileImage === 'https://via.placeholder.com/75') {
			this.showStudentImage = false;
		} else {
			this.showStudentImage = true;
		}
		if (this.idCardConfig.ps_card_layout === '1') {
			this.showLandscape = true;
			this.showPotrait = false;
		} else {
			this.showLandscape = false;
			this.showPotrait = true;
		}
		if (this.idCardConfig.ps_hide_dob === '1') {
			this.dobFlag = false;
		} else {
			this.dobFlag = true;
		}
		if (this.idCardConfig.ps_back_side === '1') {
			this.showBackSide = true;
		} else {
			this.showBackSide = false;
		}
		this.schoolLogo = this.schoolInfo.school_logo ? this.schoolInfo.school_logo : 'https://via.placeholder.com/50';
		this.container_box_idheader = this.idCardConfig.ps_header_fore_color;
		this.container_box_idheader_bgColor = this.idCardConfig.ps_header_back_color;
		this.studentNameForeColor = this.idCardConfig.ps_student_fore_color;
		this.studentNameBgColor = this.idCardConfig.ps_student_back_color;
		this.footerFontColor = this.idCardConfig.ps_footer_fore_color;
		this.footerBgColor = this.idCardConfig.ps_footer_back_color;
		this.idColor = this.idCardConfig.ps_id_color;
		this.idcardBodyColor = this.idCardConfig.ps_id_color;
		this.authSign = this.idCardConfig.ps_auth_sign;
		this.addressFontSize = this.idCardConfig.ps_sch_addr_font_size + 'px';
		if (Number(this.idCardConfig.ps_sch_logo) === 1) {
			this.showSchoolLogo = true;
		} else {
			this.showSchoolLogo = false;
		}
		if (Number(this.idCardConfig.ps_auth_sign_text) === 1) {
			this.showAuthority = true;
		} else {
			this.showAuthority = false;
		}
		if (Number(this.idCardConfig.ps_border) === 1) {
			this.showBorder = '2px solid #000';
		} else {
			this.showBorder = '';
		}
		if (Number(this.idCardConfig.ps_content_bold) === 1) {
			this.allContentBold = 'bolder';
		} else {
			this.allContentBold = 'normal';
		}
		if (Number(this.idCardConfig.ps_show_stu_addr) === 1) {
			this.stuAddressFlag = true;
		} else {
			this.stuAddressFlag = false;
		}
		if (Number(this.idCardConfig.ps_parent_pic) === 1) {
			this.showParentPhoto = false;
		} else {
			this.showParentPhoto = true;
		}
		if (Number(this.idCardConfig.ps_guardian_pic) === 1) {
			this.showGuardianPhoto = false;
		} else {
			this.showGuardianPhoto = true;
		}
		if (Number(this.idCardConfig.ps_show_parent_mobile) === 1) {
			this.showParentMobile = true;
		} else {
			this.showParentMobile = false;
		}
		if (Number(this.idCardConfig.ps_show_parent_name) === 1) {
			this.showParentName = true;
		} else {
			this.showParentName = false;
		}
		this.photo = this.idCardConfig.ps_template_image ?
			this.idCardConfig.ps_template_image : ''
	}
	getSchool() {
		this.sisService.getSchool().subscribe((result: any) => {
			if (result.status === 'ok') {
				this.schoolInfo = result.data[0];
			}
		});
	}
	getBloodGroup() {
		this.commonApiService.getBloodGroup().subscribe((result: any) => {
			if (result.status === 'ok') {
				this.bloodGroupArray = result.data;
			}
		});
	}
	getBloodGroupName(id) {
		const findex = this.bloodGroupArray.findIndex(f => f.bg_id === id);
		if (findex !== -1) {
			return this.bloodGroupArray[findex]['bg_name'];
		}
	}
}
