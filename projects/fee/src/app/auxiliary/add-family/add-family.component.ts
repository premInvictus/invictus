import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FeeService, CommonAPIService, SisService } from '../../_services';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
	selector: 'app-add-family',
	templateUrl: './add-family.component.html',
	styleUrls: ['./add-family.component.css']
})
export class AddFamilyComponent implements OnInit {
	childData: any[] = [];
	classArray: any[] = [];
	sectionArray: any[] = [];
	studentdetails: any;
	addFamilyForm: FormGroup;
	@ViewChild('myInput') myInput: ElementRef;
	constructor(
		public feeService: FeeService,
		public sisService: SisService,
		private fbuild: FormBuilder,
		private common: CommonAPIService,
		public dialog: MatDialog
	) { }

	ngOnInit() {
		this.buildForm();
		this.getClass();
		this.getSection();
	}

	buildForm() {
		this.addFamilyForm = this.fbuild.group({
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
		this.getStudentInformation(inputJson);
	}

	reset(event) {
		this.addFamilyForm.patchValue({
			adm_no: '',
			class_id: '',
			sec_id: '',
			stu_name: ''
		});
	}

	resetAll(event) {
		this.addFamilyForm.patchValue({
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
								'stu_admission_no': this.studentdetails.em_admission_no,
								'stu_name': this.studentdetails.au_full_name,
								'stu_class_name': class_name,
								'stu_active_parent_name': this.studentdetails.parentinfo && this.studentdetails.parentinfo[0] ? this.studentdetails.parentinfo[0]['epd_parent_name'] : '-',
								'stu_active_parent_contact_no': this.studentdetails.parentinfo && this.studentdetails.parentinfo[0] ? this.studentdetails.parentinfo[0]['epd_contact_no'] : '-',
								'stu_category': this.studentdetails.fee_category ? this.studentdetails.fee_category : '-',
								'stu_fee_structure': this.studentdetails.ead_fees_structure ? this.studentdetails.ead_fees_structure : '-',
								'stu_concession_group': this.studentdetails.ead_concession_category ? this.studentdetails.ead_concession_category : '-',
								'stu_transport': this.studentdetails.ead_bus_route ? this.studentdetails.ead_bus_route && this.studentdetails.ead_pickup_point ? this.studentdetails.ead_bus_route + ',' + this.studentdetails.ead_pickup_point : this.studentdetails.ead_bus_route : '-',
								'keyChild': 0
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
		for (let i = 0; i < this.childData.length; i++) {
			this.childData[index]['keyChild'] = 0;
		}
		this.childData[index]['keyChild'] = 1;
	}

	addFamily() {
		console.log('this.childData', this.childData);
	}

	bindImageToForm($event) {
		let fileName = '';
		let au_profileimage = '';
		this.sisService.uploadDocuments([{ fileName: fileName, imagebase64: au_profileimage, module: 'profile' }]).subscribe((result: any) => {
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

}
