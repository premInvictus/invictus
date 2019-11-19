import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatSort, MatTableDataSource, MatDialog, MatDialogRef } from '@angular/material';
import { CommonAPIService, SisService } from '../../_services/index';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BulkElement } from './idcardbulkprint.model';
import { ViewIdCardComponent } from './view-id-card/view-id-card.component';
import { PrintIdCardComponent } from './print-id-card/print-id-card.component';

@Component({
	selector: 'app-id-card-printing',
	templateUrl: './id-card-printing.component.html',
	styleUrls: ['./id-card-printing.component.scss']
})
export class IdCardPrintingComponent implements OnInit, AfterViewInit {
	displayedColumns: string[] = ['select', 'no', 'name', 'class', 'section', 'contact', 'print', 'action'];
	BULK_ELEMENT_DATA: BulkElement[] = [];
	dataSource = new MatTableDataSource<BulkElement>(this.BULK_ELEMENT_DATA);
	checkFlag = true;
	individualPrintForm: FormGroup;
	studentDetails: any;
	studentProfileImage: any = 'https://via.placeholder.com/150';
	schoolInfo: any;
	authSign: any;
	idCardSettings: any;
	@ViewChild(MatSort) sort: MatSort;
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
	checkStudents: any[] = [];
	dialogRef: MatDialogRef<ViewIdCardComponent>;
	dialogRef2: MatDialogRef<PrintIdCardComponent>;
	enrollMentTypeArray: any[] = [{
		au_process_type: '3', au_process_name: 'Provisional Admission'
	},
	{
		au_process_type: '4', au_process_name: 'Admission'
	}];
	showViewProfile = false;
	constructor(private sisService: SisService,
		private commonApiService: CommonAPIService,
		private fbuild: FormBuilder,
		private router: Router,
		private route: ActivatedRoute,
		public dialog: MatDialog) { }

	ngOnInit() {
		this.buildForm();
		this.getSchool();
		this.getIdCardSettings();
		localStorage.removeItem('id_card_view_last_state');
	}
	ngAfterViewInit() {
		this.dataSource.sort = this.sort;
	}

	buildForm() {
		this.individualPrintForm = this.fbuild.group({
			enrollment_type: '',
			print_option: '',
			au_login_id: '',
			au_admission_no: '',
			au_full_name: '',
			au_email: '',
			au_mobile: '',
			au_profileimage: '',
			class_id: '',
			class_name: '',
			sec_id: '',
			sec_name: '',
			ses_id: '',
			hou_id: '',
			hou_house_name: '',
			father_name: '',
			father_image: '',
			mother_name: '',
			mother_image: '',
			guardian_name: '',
			guardian_image: '',
			address1: '',
			address2: '',
			city: '',
			state: '',
			country: '',
			pincode: ''
		});

		const enrollment_no = this.route.snapshot.queryParams && this.route.snapshot.queryParams.login_id !== '' ?
			this.route.snapshot.queryParams.login_id : '';
		const enrollment_type = this.route.snapshot.queryParams && this.route.snapshot.queryParams.enrolment_type !== '' ?
			this.route.snapshot.queryParams.enrolment_type : '';
		const print_option = this.route.snapshot.queryParams && this.route.snapshot.queryParams.print_option !== '' ?
			this.route.snapshot.queryParams.print_option : '';

		if (enrollment_no) {
			this.individualPrintForm.patchValue({
				'enrollment_type': enrollment_type,
				'au_admission_no': enrollment_no,
				'print_option': print_option
			});
			this.getUserDetails('', enrollment_no);
		}

	}
	getUserDetails(event, adm_id) {
		if (event) {
			event.stopPropagation();
		}
		if (adm_id === '') {
			this.resetAllExceptEnrollMent();
			this.showIdCard = false;
		}
		if (adm_id !== '') {
			if (this.individualPrintForm.value.enrollment_type === '4') {
				this.studentDetails = {};
				this.sisService.printApplication({
					enrollment_type: this.individualPrintForm.value.enrollment_type,
					admission_no: adm_id,
					pmap_status: '1'
				}).subscribe((result: any) => {
					if (result.status === 'ok') {
						this.showIdCard = true;
						this.studentDetails = result.data[0];
						if (this.studentDetails.au_profileimage) {
							this.studentProfileImage = this.studentDetails.au_profileimage;
						} else {
							this.studentProfileImage = 'https://via.placeholder.com/150';
						}
						if (Number(this.idCardSettings.ps_missing_student) === 1 && this.studentProfileImage === 'https://via.placeholder.com/150') {
							this.dontPrintStatus = true;
						} else {
							this.dontPrintStatus = false;
						}
						if (Number(this.idCardSettings.ps_hide_photo) === 1 && this.studentProfileImage === 'https://via.placeholder.com/150') {
							this.showStudentImage = false;
						} else {
							this.showStudentImage = true;
						}
						this.individualPrintForm.patchValue({
							au_admission_no: this.studentDetails.au_admission_no,
							au_login_id: this.studentDetails.au_login_id,
							au_full_name: this.studentDetails.au_full_name,
							au_mobile: this.studentDetails.au_mobile,
							au_profileimage: this.studentDetails.au_profileimage,
							class_name: this.studentDetails.class_name,
							sec_name: this.studentDetails.sec_name,
							hou_house_name: this.studentDetails.hou_house_name,
							father_name: this.studentDetails.father_name,
							father_image: this.studentDetails.father_image,
							mother_name: this.studentDetails.mother_name,
							mother_image: this.studentDetails.mother_image,
							guardian_name: this.studentDetails.guardian_name,
							guardian_image: this.studentDetails.guardian_image,
							address1: this.studentDetails.address1,
							address2: this.studentDetails.address2,
							city: this.studentDetails.city,
							state: this.studentDetails.state,
							country: this.studentDetails.country,
							pincode: this.studentDetails.pincode
						});
						this.showViewProfile = true;
					} else {
						this.studentProfileImage = 'https://via.placeholder.com/150';
						this.showIdCard = false;
						this.commonApiService.showSuccessErrorMessage('No records Found', 'error');
						this.showViewProfile = false;
						this.individualPrintForm.reset();
					}
				});
			}
			if (this.individualPrintForm.value.enrollment_type === '3') {
				this.studentDetails = {};
				this.sisService.printApplication({
					enrollment_type: this.individualPrintForm.value.enrollment_type,
					provisional_admission_no: adm_id,
					pmap_status: '1'
				}).subscribe((result: any) => {
					if (result.status === 'ok') {
						this.showIdCard = true;
						this.studentDetails = result.data[0];
						this.individualPrintForm.patchValue({
							au_admission_no: this.studentDetails.au_admission_no,
							au_login_id: this.studentDetails.au_login_id,
							au_full_name: this.studentDetails.au_full_name,
							au_mobile: this.studentDetails.au_mobile,
							au_profileimage: this.studentDetails.au_profileimage,
							class_name: this.studentDetails.class_name,
							sec_name: this.studentDetails.sec_name,
							hou_house_name: this.studentDetails.hou_house_name,
							father_name: this.studentDetails.father_name,
							father_image: this.studentDetails.father_image,
							mother_name: this.studentDetails.mother_name,
							mother_image: this.studentDetails.mother_image,
							guardian_name: this.studentDetails.guardian_name,
							guardian_image: this.studentDetails.guardian_image,
							address1: this.studentDetails.address1,
							address2: this.studentDetails.address2,
							city: this.studentDetails.city,
							state: this.studentDetails.state,
							country: this.studentDetails.country,
							pincode: this.studentDetails.pincode
						});
						this.showViewProfile = true;
					} else {
						this.studentProfileImage = 'https://via.placeholder.com/150';
						this.showIdCard = false;
						this.commonApiService.showSuccessErrorMessage('No records Found', 'error');
						this.showViewProfile = false;
						this.individualPrintForm.reset();
					}
				});
			}
		}
	}
	viewStudentProfile() {
		if (this.individualPrintForm.value.enrollment_type === '4') {
			this.router.navigate(['../../studentmaster/admission'],
				{ queryParams: { login_id: this.individualPrintForm.value.au_admission_no }, relativeTo: this.route });
		} else {
			this.router.navigate(['../../studentmaster/provisional'],
				{ queryParams: { login_id: this.individualPrintForm.value.au_admission_no }, relativeTo: this.route });
		}

		const last_state_json = {
			url: JSON.stringify(['../../auxilliarytool/id-card-printing']),
			login_id: this.individualPrintForm.value.au_admission_no,
			enrolment_type: this.individualPrintForm.value.enrollment_type,
			print_option: this.individualPrintForm.value.print_option,
		};
		localStorage.setItem('id_card_view_last_state', JSON.stringify(last_state_json));
	}
	getSchool() {
		this.sisService.getSchool().subscribe((result: any) => {
			if (result.status === 'ok') {
				this.schoolInfo = result.data[0];
			}
		});
	}
	getIdCardSettings() {
		this.sisService.getIdCardPrintSettings().subscribe((result: any) => {
			if (result.status === 'ok') {
				this.idCardSettings = result.data[0];
			}
		});
	}
	showSettings() {
		window.open('school/setup/id-card-printing', '_blank');
	}
	checkEventChange(event) {
		if (event.value === '2') {
			this.getBulkStudents();
		}
	}
	radioEnableEvent() {
		if (!this.individualPrintForm.value.enrollment_type) {
			this.commonApiService.showSuccessErrorMessage('Please select an enrollment type to proceed', 'error');
		}
	}
	enableRadio($event) {
		if ($event) {
			this.resetAllExceptEnrollMent();
			this.disabled = false;
		}
	}
	getBulkStudents() {
		this.BULK_ELEMENT_DATA = [];
		this.dataSource = new MatTableDataSource<BulkElement>(this.BULK_ELEMENT_DATA);
		this.sisService.printApplication({
			enrollment_type: this.individualPrintForm.value.enrollment_type,
			pmap_status: '1'
		}).subscribe((result: any) => {
			if (result.status === 'ok') {
				let pos = 1;
				for (const item of result.data) {
					this.BULK_ELEMENT_DATA.push({
						select: pos,
						no: item.au_admission_no,
						name: item.au_full_name,
						class: item.class_name,
						section: item.sec_name,
						contact: item.au_mobile,
						print: '0',
						action: item
					});
					pos++;
				}
				this.dataSource = new MatTableDataSource<BulkElement>(this.BULK_ELEMENT_DATA);
				this.dataSource.sort = this.sort;
			}
		});
	}
	checkAllStudents($event) {
		this.checkStudents = [];
		if ($event.checked) {
			for (const item of this.BULK_ELEMENT_DATA) {
				this.checkStudents.push({
					no: item.no
				});
			}
			this.checkAllFlag = true;
		} else {
			this.checkStudents = [];
			this.checkAllFlag = false;
		}
	}
	getSelectedStudents($event, item) {
		const findex = this.checkStudents.findIndex(f => f.no === $event.source.value);
		if (findex === -1) {
			this.checkStudents.push({
				no: $event.source.value
			});
		} else {
			this.checkStudents.splice(findex, 1);
		}
	}
	resetAllExceptEnrollMent() {
		Object.keys(this.individualPrintForm.value).forEach((keys) => {
			const formControl = <FormControl>this.individualPrintForm.controls[keys];
			if (keys !== 'enrollment_type') {
				formControl.reset();
			}
		});
	}
	openIdCard(adm_id) {
		this.dialogRef = this.dialog.open(ViewIdCardComponent, {
			data: {
				adm_no: adm_id,
				enrollment_type: this.individualPrintForm.value.enrollment_type
			},
			'height': '80vh',
			'width': '65vh'
		});
	}
	printIdCard(adm_id) {
		this.dialogRef2 = this.dialog.open(PrintIdCardComponent, {
			data: {
				adm_no: adm_id,
				enrollment_type: this.individualPrintForm.value.enrollment_type
			},
			'height': '80vh',
			'width': '65vh'
		});
	}
	bulkPrint() {
		this.dialogRef2 = this.dialog.open(PrintIdCardComponent, {
			data: {
				no: this.checkStudents,
				enrollment_type: this.individualPrintForm.value.enrollment_type
			},
			'height': '100vh',
			'width': '100vh'
		});
	}
	isExistUserAccessMenu(mod_id) {
		return this.commonApiService.isExistUserAccessMenu(mod_id);
	}
	showPrint() {
		let id: any = '';
		if (Number(this.idCardSettings.ps_card_style) === 1) {
			id = 'card1';
			const printModal2 = document.getElementById(id);
			const popupWin = window.open('', '_blank', 'width=' + screen.width + ',height=' + screen.height);
			popupWin.document.open();
			popupWin.document.write('<html> <link rel="stylesheet"' +
				'href="../../../../../../assets/css/idcardstyle1.css">' +
				'<link rel="stylesheet" href=""' +
				'integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">' +
				'<body onload="window.print()">' + printModal2.innerHTML + '</html>');
			popupWin.document.close();
		} else if (Number(this.idCardSettings.ps_card_style) === 2) {
			id = 'card2';
			const printModal2 = document.getElementById(id);
			const popupWin = window.open('', '_blank', 'width=' + screen.width + ',height=' + screen.height);
			popupWin.document.open();
			popupWin.document.write('<html> <link rel="stylesheet" href="../../../../../../assets/css/idcardstyle1.css">' +
				'<link rel="stylesheet" href=""' +
				'integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">' +
				'<body onload="window.print()">' + printModal2.innerHTML + '</html>');
			popupWin.document.close();
		} else {
			id = 'card3';
			const printModal2 = document.getElementById(id);
			const popupWin = window.open('', '_blank', 'width=' + screen.width + ',height=' + screen.height);
			popupWin.document.open();
			popupWin.document.write('<html> <link rel="stylesheet" href="../../../../../../assets/css/idcardstyle1.css">' +
				'<link rel="stylesheet" href=""' +
				'integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">' +
				'<body onload="window.print()">' + printModal2.innerHTML + '</html>');
			popupWin.document.close();
		}
	}
}
export interface PeriodicElement {
	select: number;
	no: number;
	name: string;
	class: string;
	section: string;
	contact: number;
	print: number;
	action: number;
}
