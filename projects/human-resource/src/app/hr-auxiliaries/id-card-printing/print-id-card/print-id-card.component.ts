import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CommonAPIService, SisService } from '../../../_services/index';

@Component({
	selector: 'app-print-id-card',
	templateUrl: './print-id-card.component.html',
	styleUrls: ['./print-id-card.component.scss']
})
export class PrintIdCardComponent implements OnInit {

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
	studentDetailsArray: any[] = [];
	constructor(public dialogRef: MatDialogRef<PrintIdCardComponent>,
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
	print() {
		const printModal2 = document.getElementById('printCard');
		const popupWin = window.open('', '_blank', 'width=' + screen.width + ',height=' + screen.height);
		popupWin.document.open();
		popupWin.document.write('<html> <link rel="stylesheet" href="../../../../../../assets/css/idcardstyle1.css">' +
			'<link rel="stylesheet" href=""' +
			'integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">' +
			'<body onload="window.print()">' + printModal2.innerHTML + '</html>');
		popupWin.document.close();
	}
}
