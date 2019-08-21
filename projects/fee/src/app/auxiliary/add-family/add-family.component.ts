import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FeeService, CommonAPIService, SisService } from '../../_services';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-add-family',
	templateUrl: './add-family.component.html',
	styleUrls: ['./add-family.component.css']
})
export class AddFamilyComponent implements OnInit {
	keyChildCount = 0;
	childData: any[] = [];
	classArray: any[] = [];
	sectionArray: any[] = [];
	studentdetails: any;
	addFamilyForm: FormGroup;
	declaration_doc_url = '';
	@ViewChild('myInput') myInput: ElementRef;
	constructor(
		public feeService: FeeService,
		public sisService: SisService,
		private fbuild: FormBuilder,
		private common: CommonAPIService,
		public dialog: MatDialog,
		private route: ActivatedRoute,
		private router: Router
	) { }

	ngOnInit() {
		this.buildForm();
		this.getClass();
		this.getSection();
		const familyData = this.common.getFamilyData();
		console.log('familyData', familyData);
		if (familyData) {
			this.getFamilyInformation(familyData);
		}
	}

	buildForm() {
		this.addFamilyForm = this.fbuild.group({
			'fam_entry_number': '',
			'family_name': '',
			'adm_no': '',
			'class_id': '',
			'sec_id': '',
			'stu_name': ''
		});
	}

	addChild(event) {
		const inputJson = {};

		if (this.addFamilyForm.value.adm_no) {
			inputJson['au_login_id'] = this.addFamilyForm.value.adm_no;
		} else {
			if (this.addFamilyForm.value.class_id && this.addFamilyForm.value.sec_id && this.addFamilyForm.value.stu_name) {
				inputJson['au_class_id'] = this.addFamilyForm.value.class_id;
				inputJson['au_sec_id'] = this.addFamilyForm.value.sec_id;
				inputJson['au_full_name'] = this.addFamilyForm.value.stu_name;
			}
		}

		this.checkForChildExists(inputJson);
	}

	checkForChildExists(inputJson) {
		this.feeService.checkChildExists(inputJson).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.getStudentInformation(inputJson);
			} else {
				this.common.showSuccessErrorMessage('This Student Already Added in a Family, Please Choose Another One !', 'error');
			}
		});
	}

	reset(event) {
		this.addFamilyForm.patchValue({
			fam_entry_number: '',
			adm_no: '',
			class_id: '',
			sec_id: '',
			stu_name: ''
		});
	}

	resetAll(event) {
		this.addFamilyForm.patchValue({
			fam_entry_number: '',
			adm_no: '',
			class_id: '',
			sec_id: '',
			stu_name: '',
			family_name: ''
		});
	}

	getClass() {
		this.classArray = [];
		this.sisService.getClass({}).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.classArray = result.data;
			}
		});
	}

	getSection() {
		this.sectionArray = [];
		this.sisService.getSectionAll().subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.sectionArray = result.data;
			}
		});
	}

	getFamilyInformation(param) {
		if (param && param.fam_entry_number) {
			this.feeService.getFamilyInformation({fam_entry_number: param.fam_entry_number}).subscribe((result: any) => {
				if (result.status === 'ok') {
					console.log('data--', result.data);
					this.common.showSuccessErrorMessage(result.message, 'success');
					for (let i = 0; i < result.data.length; i++) {
						const cdata = result.data[i];
						let class_name = '', parent_name = '';

						if (cdata.sec_name) {
							class_name = cdata.class_name + '-' + cdata.sec_name;
						} else {
							class_name = cdata.class_name;
						}

						if (cdata.epd_parent_honorific) {
							parent_name = cdata.epd_parent_honorific + ' ' + cdata.epd_parent_name;
						} else {
							parent_name = cdata.epd_parent_honorific + ' ' + cdata.epd_parent_name;
						}

						this.addFamilyForm.patchValue({
							family_name: cdata.fam_family_name ? cdata.fam_family_name : '',
							fam_entry_number: cdata.fam_entry_number ? cdata.fam_entry_number : ''
						});

						if (cdata.fam_declaration_doc_url) {
							this.declaration_doc_url = cdata.fam_declaration_doc_url;
						}

						console.log('this.addFamilyForm', this.addFamilyForm);

						this.childData.push(
							{
								'stu_admission_no': cdata.au_admission_no ? cdata.au_admission_no : '0',
								'stu_login_no': cdata.au_login_id ? cdata.au_login_id : '0',
								'stu_name': cdata.au_full_name ? cdata.au_full_name : '-',
								'stu_class_name': class_name,
								'stu_active_parent_id': cdata.epd_id  ? cdata.epd_id : '0',
								'stu_active_parent_name': parent_name ? parent_name : '-',
								'stu_active_parent_contact_no': cdata.epd_contact_no ? cdata.epd_contact_no : '-',
								'stu_category': cdata.fo_name ? cdata.fo_name : '-',
								'stu_fee_structure': cdata.fs_name ? cdata.fs_name : '0',
								'stu_fee_structure_id': cdata.fs_id ? cdata.fs_id : '-',
								'stu_concession_group': cdata.fcg_name ? cdata.fcg_name : '-',
								'stu_transport': cdata.tr_route_name ? cdata.tr_route_name && cdata.tsp_name ? cdata.tr_route_name + ',' + cdata.tsp_name : cdata.tr_route_name : '-',
								'keyChild': cdata.fam_active_member ? cdata.fam_active_member : 0
							}
						);
					}
					//this.childData = [];
					//this.resetAll('');
				} else {
					this.common.showSuccessErrorMessage(result.message, 'error');
				}
			});
		}
	}

	getStudentInformation(inputJson) {
		if (Object.keys(inputJson).length > 0) {
			inputJson['au_status'] = '1';
			inputJson['processType'] = '4';
			this.sisService
				.getStudentFamilyInformation(inputJson)
				.subscribe((result: any) => {
					if (result && result.status === 'ok') {
						this.studentdetails = {};
						let class_name = '';
						if (result && result.data && result.data[0]) {
							this.studentdetails = result.data[0];

							this.addFamilyForm.patchValue({
								adm_no: this.studentdetails.em_admission_no,
								class_id: this.studentdetails.au_class_id,
								sec_id: this.studentdetails.au_sec_id,
								stu_name: this.studentdetails.au_full_name
							});

							if (this.studentdetails.sec_name) {
								class_name = this.studentdetails.class_name + '-' + this.studentdetails.sec_name;
							} else {
								class_name = this.studentdetails.class_name;
							}
						}

						let validateStatus = true;

						if (this.childData.length > 0) {
							validateStatus = this.checkForAlreadyAddedChild();
						}

						if (validateStatus) {
							this.childData.push({
								'stu_admission_no': this.studentdetails.em_admission_no ? this.studentdetails.em_admission_no : '0',
								'stu_login_no': this.studentdetails.au_login_id ? this.studentdetails.au_login_id : '0',
								'stu_name': this.studentdetails.au_full_name ? this.studentdetails.au_full_name : '-',
								'stu_class_name': class_name,
								'stu_active_parent_id': this.studentdetails.parentinfo && this.studentdetails.parentinfo[0] ? this.studentdetails.parentinfo[0]['epd_id'] : '0',
								'stu_active_parent_name': this.studentdetails.parentinfo && this.studentdetails.parentinfo[0] ? this.studentdetails.parentinfo[0]['epd_parent_name'] : '-',
								'stu_active_parent_contact_no': this.studentdetails.parentinfo && this.studentdetails.parentinfo[0] ? this.studentdetails.parentinfo[0]['epd_contact_no'] : '-',
								'stu_category': this.studentdetails.fee_category ? this.studentdetails.fee_category : '-',
								'stu_fee_structure': this.studentdetails.ead_fees_structure ? this.studentdetails.ead_fees_structure : '-',
								'stu_fee_structure_id': this.studentdetails.ead_fees_structure_id ? this.studentdetails.ead_fees_structure_id : '0',
								'stu_concession_group': this.studentdetails.ead_concession_category ? this.studentdetails.ead_concession_category : '-',
								'stu_transport': this.studentdetails.ead_bus_route ? this.studentdetails.ead_bus_route && this.studentdetails.ead_pickup_point ? this.studentdetails.ead_bus_route + ',' + this.studentdetails.ead_pickup_point : this.studentdetails.ead_bus_route : '-',
								'keyChild': '0'

							});
						} else {
							this.common.showSuccessErrorMessage('This Student Already Added in Family, Please Choose Another One !', 'error');
						}


						const inputElem = <HTMLInputElement>this.myInput.nativeElement;
						inputElem.select();
					} else {
						this.common.showSuccessErrorMessage(result.data, 'error');
					}
				});
		} else {
			this.common.showSuccessErrorMessage('Please Choose Filter Options', 'error');
		}
	}

	checkForAlreadyAddedChild() {
		let flag = true;
		for (let i = 0; i < this.childData.length; i++) {
			if (this.childData[i]['stu_admission_no'] === this.studentdetails.em_admission_no) {
				flag = false;
				break;
			}
		}
		return flag;
	}

	deleteChild(index) {
		this.childData.splice(index, 1);
	}

	setKeyChild(index) {
		this.keyChildCount = 0;
		for (let i = 0; i < this.childData.length; i++) {
			this.childData[i]['keyChild'] = '0';
			this.keyChildCount = 0;
		}

		this.childData[index]['keyChild'] = '1';
		this.keyChildCount = 1;
	}

	getKeyChildCount() {
		this.keyChildCount = 0;
		for (let i = 0; i < this.childData.length; i++) {
			if (this.childData[i]['keyChild'] === '1') {
				this.keyChildCount++;
			}
		}
		return this.keyChildCount;
	}

	addFamily() {
		const keyChildCount = this.getKeyChildCount();
		if (this.addFamilyForm.value.family_name && keyChildCount === 1) {
			const inputJson = {};
			inputJson['childData'] = this.childData;
			inputJson['fam_family_name'] = this.addFamilyForm.value.family_name;
			inputJson['fam_declaration_doc_url'] = '';
			this.feeService.addFamily(inputJson).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.common.showSuccessErrorMessage(result.message, 'success');
					this.childData = [];
					this.resetAll('');
				} else {
					this.common.showSuccessErrorMessage(result.message, 'error');
				}
			});
		} else if (!keyChildCount || keyChildCount > 1) {
			this.common.showSuccessErrorMessage('Please Choose One Key Child', 'error');
		} else {
			this.common.showSuccessErrorMessage('Please Enter Family Name', 'error');
		}
	}

	updateFamily() {
		const keyChildCount = this.getKeyChildCount();
		if (this.addFamilyForm.value.family_name && keyChildCount === 1) {
			const inputJson = {};
			inputJson['childData'] = this.childData;
			inputJson['fam_entry_number'] = this.addFamilyForm.value.fam_entry_number;
			inputJson['fam_family_name'] = this.addFamilyForm.value.family_name;
			inputJson['fam_declaration_doc_url'] = '';
			this.feeService.updateFamily(inputJson).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.common.showSuccessErrorMessage(result.message, 'success');
					this.childData = [];
					this.resetAll('');
				} else {
					this.common.showSuccessErrorMessage(result.message, 'error');
				}
			});
		} else if (!keyChildCount || keyChildCount > 1) {
			this.common.showSuccessErrorMessage('Please Choose One Key Child', 'error');
		} else {
			this.common.showSuccessErrorMessage('Please Enter Family Name', 'error');
		}
	}

	bindImageToForm($event) {
		let fileName = '';
		let au_profileimage = '';
		this.sisService.uploadDocuments([{ fileName: fileName, imagebase64: au_profileimage, module: 'family' }]).subscribe((result: any) => {
			if (result.status === 'ok') {
				// this.defaultsrc = result.data[0].file_url;
				// this.studentdetailsform.patchValue({
				// 	au_profileimage: result.data[0].file_url
				// });
				if (result.data[0].file_url && this.addFamilyForm.value.au_login_id) {
					this.sisService.studentImageProfileUpload({
						au_login_id: this.addFamilyForm.value.au_login_id,
						au_profileimage: result.data[0].file_url
					}).subscribe((result1: any) => {
						if (result1 && result1.status === 'ok') {
							this.common.showSuccessErrorMessage(result1.data, 'success');
						}
					});
				}
			}
		});
	}

	moveToFamilyWiseFee() {
		this.common.setFamilyData('');
		this.router.navigate(['../familywise-fee-reciept'], { relativeTo: this.route });
	}

	checkThumbnail(url: any) {
		if (url.match(/jpg/) || url.match(/png/) || url.match(/bmp/) ||
			url.match(/gif/) || url.match(/jpeg/) ||
			url.match(/JPG/) || url.match(/PNG/) || url.match(/BMP/) ||
			url.match(/GIF/) || url.match(/JPEG/)) {
			return true;
		} else {
			return false;
		}
	}


}
