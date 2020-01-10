import { Component, OnInit, ViewChild, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { CommonAPIService, SisService } from '../../_services/index';
import { ViewIdCardComponent } from './view-id-card/view-id-card.component';
import { PrintIdCardComponent } from './print-id-card/print-id-card.component';
import { FormGroup, FormBuilder } from '@angular/forms';
@Component({
	selector: 'app-id-card-printing',
	templateUrl: './id-card-printing.component.html',
	styleUrls: ['./id-card-printing.component.scss'],
	encapsulation: ViewEncapsulation.Emulated
})
export class IdCardPrintingComponent implements OnInit, AfterViewInit {
	checkFlag = true;
	studentDetails: any;
	studentProfileImage: any = 'https://via.placeholder.com/150';
	schoolInfo: any;
	authSign: any;
	idCardSettings: any;
	studentDetailsArray: any[] = [];
	@ViewChild('searchModal') searchModal;
	showIdCard = false;
	container_box_idheader: any;
	showSchoolLogo = false;
	showAuthority = false;
	showBorder: any;
	allContentBold: any;
	stuAddressFlag = false;
	dontPrintStatus = false;
	showStudentImage = false;
	studentNameForeColor: any;
	addressFontSize: any;
	idColor: any;
	disabled = true;
	checkAllFlag = false;
	barCodePrintForm: FormGroup;
	checkStudents: any[] = [];
	dialogRef: MatDialogRef<ViewIdCardComponent>;
	dialogRef2: MatDialogRef<PrintIdCardComponent>;
	showViewProfile = false;
	constructor(private sisService: SisService,
		private fbuild: FormBuilder,
		private commonApiService: CommonAPIService,
		public dialog: MatDialog) { }

	ngOnInit() {
		this.getSchool();
		this.getIdCardSettings();
		this.buildForm();
	}
	ngAfterViewInit() {
	}
	buildForm() {
		this.barCodePrintForm = this.fbuild.group({
			'emp_id': ''
		});
	}
	getSchool() {
		this.sisService.getSchool().subscribe((result: any) => {
			if (result.status === 'ok') {
				this.schoolInfo = result.data[0];
			}
		});
	}
	getIdCardSettings() {
		this.commonApiService.getIdCardPrintSettings({
			user_type: 'employee'
		}).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.idCardSettings = result.data[0];
			}
		});
	}
	showSettings() {
		window.open('school/setup/id-card-printing', '_blank');
	}
	isExistUserAccessMenu(mod_id) {
		return this.commonApiService.isExistUserAccessMenu(mod_id);
	}
	openFilter() {
		this.searchModal.openModal();
	}
	searchOk(event) {
		this.studentDetailsArray = [];
		this.commonApiService.getFilterData(event).subscribe((res: any) => {
			if (res && res.status === 'ok') {
				for (const item of res.data) {
					this.studentDetailsArray.push(item);
				}
			}
		});
	}
	print() {
		const printModal2 = document.getElementById('printCard');
		const popupWin = window.open('', '_blank', 'width=' + screen.width + ',height=' + screen.height);
		popupWin.document.open();
		popupWin.document.write('<html> <link rel="stylesheet" href="../../../../../../src/assets/css/idcardstyle2.css">' +
			'<link rel="stylesheet" href=""' +
			'integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">' +
			'<body onload="window.print()">' + printModal2.innerHTML + '</html>');
		popupWin.document.close();
	}
	getCode() {
		this.studentDetailsArray = [];
		if (this.barCodePrintForm.value.emp_id) {
		  let inputJson = { 'filters': [{ 'filter_type': 'emp_id', 'filter_value': this.barCodePrintForm.value.emp_id, 'type': 'text' }]};
		  this.commonApiService.getFilterData(inputJson).subscribe((res: any) => {
			if (res && res.status === 'ok') {
				for (const item of res.data) {
					this.studentDetailsArray.push(item);
				}
			}
		  });
		}
	  }
}
