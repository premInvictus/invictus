import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CommonAPIService, SisService } from '../../../_services/index';
@Component({
	selector: 'app-view-id-card',
	templateUrl: './view-id-card.component.html',
	styleUrls: ['./view-id-card.component.scss']
})
export class ViewIdCardComponent implements OnInit {
	studentDetails: any = {};
	idCardConfig: any = {};
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
	showParentMobile = false;
	showParentName = false;
	studentProfileImage: any;
	constructor(public dialogRef: MatDialogRef<ViewIdCardComponent>,
		@Inject(MAT_DIALOG_DATA) public data,
		private sisService: SisService,
		private commonApiService: CommonAPIService) { }

	ngOnInit() {
	}
	getSchool() {
		this.sisService.getSchool().subscribe((result: any) => {
			if (result.status === 'ok') {
				this.schoolInfo = result.data[0];
			}
		});
	}
	getBloodGroupName(id) {
		const findex = this.bloodGroupArray.findIndex(f => f.bg_id === id);
		if (findex !== -1) {
			return this.bloodGroupArray[findex]['bg_name'];
		}
	}
	closeDialog() {
		this.dialogRef.close();
	}
}
