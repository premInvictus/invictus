import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { DynamicComponent } from '../../sharedmodule/dynamiccomponent';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonAPIService, SisService } from '../../_services/index';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatDialogRef, MatDialog } from '@angular/material';
import { PreviewDocumentComponent } from '../../student-master/documents/preview-document/preview-document.component';

@Component({
	selector: 'app-suspension',
	templateUrl: './suspension.component.html',
	styleUrls: ['./suspension.component.scss']
})
export class SuspensionComponent implements OnInit {
	suspensionForm: FormGroup;
	suspensionFormData: any[] = [];
	reasonDataArray: any[] = [];
	disableApiCall = false;
	susp_docs: any;
	events: string[] = [];
	studentSuspensionData: any[] = [];
	showRevoke = false;
	viewFlag = true;
	authorityArray: any[] = [];
	susp_to_required = true;
	dialogRef2: MatDialogRef<PreviewDocumentComponent>;
	@ViewChild('inputFile') myInputVariable: ElementRef;
	constructor(private fbuild: FormBuilder, public sanitizer: DomSanitizer,
		private notif: CommonAPIService, private sisService: SisService,
		private router: Router,
		private route: ActivatedRoute,
		private dialog: MatDialog
	) { }

	ngOnInit() {
		this.buildForm();
		this.getReason();
		this.getAuthority();
		localStorage.removeItem('suspension_last_state');
	}

	buildForm() {
		this.suspensionForm = this.fbuild.group({
			susp_id: '',
			susp_login_id: '',
			au_login_id: '',
			au_full_name: '',
			class_section: '',
			au_mobile: '',
			au_email: '',
			au_father_name: '',
			au_mother_name: '',
			au_gurdian_name: '',
			susp_from: '',
			susp_to: '',
			susp_reason: '',
			susp_remark: '',
			susp_print_status: '',
			susp_intimate_parents: '',
			susp_aut_id: '',
			susp_indefinitely: ''
		});

		const param_login_id = this.route.snapshot.queryParams && this.route.snapshot.queryParams.login_id !== '' ?
			this.route.snapshot.queryParams.login_id : '';
		if (param_login_id) {
			// this.suspensionForm.value.susp_login_id = param_login_id;
			this.suspensionForm.patchValue({
				'susp_login_id': param_login_id
			});
			this.getStudentData('');
		}

	}

	getStudentData(event) {
		if (event) {
			event.stopPropagation();
		}
		const inputJson = {
			admission_no: this.suspensionForm.value.susp_login_id,
			pmap_status: '1'
		};

		this.sisService.getMasterStudentDetail(inputJson).subscribe((result: any) => {
			if (result && result.data && result.data[0]['au_login_id']) {
				this.fillStudentPersonalData(result.data[0]);
			} else {
				this.notif.showSuccessErrorMessage('No Record Found for this Student', 'error');

			}
		});

	}

	getReason() {
		this.sisService.getReason({ reason_type: 6 }).subscribe((result: any) => {
			if (result) {
				this.reasonDataArray = result.data;

			}
		});
	}

	fillStudentPersonalData(studentData) {
		this.suspensionForm.patchValue({
			'susp_login_id': studentData['em_admission_no'],
			'au_login_id': studentData['au_login_id'],
			'au_full_name': studentData['au_full_name'],
			'class_section': studentData['class_name'] ? studentData['class_name'] : '' + '-' +
				studentData['sec_name'] ? studentData['sec_name'] : '',
			'au_mobile': studentData['au_mobile'],
			'au_email': studentData['au_email'],
			'au_father_name': studentData['father_name'],
			'au_mother_name': studentData['mother_name'],
			'au_gurdian_name': studentData['guardian_name']
		});
		this.getStudentSuspensionDetail();
		this.viewFlag = false;
	}


	getStudentSuspensionDetail() {
		this.showRevoke = false;
		const inputJson = {
			'login_id': this.suspensionForm.value.au_login_id
		};
		this.sisService.getSuspendStudents(inputJson).subscribe((result: any) => {
			if (result && result.data && result.data[0]['susp_id']) {
				this.studentSuspensionData = result.data[0];
				this.suspensionForm.patchValue({
					'susp_id': this.studentSuspensionData['susp_id'],
					'susp_from': this.studentSuspensionData['susp_from'],
					'susp_to': this.studentSuspensionData['susp_to'],
					'susp_reason': this.studentSuspensionData['susp_reason'],
					'susp_aut_id': this.studentSuspensionData['susp_aut_id'],
					'susp_remark': this.studentSuspensionData['susp_remark'],
					'susp_print_status': this.studentSuspensionData['susp_print_status'] === '1' ? true : false,
					'susp_intimate_parents': this.studentSuspensionData['susp_intimate_parents'] === '1' ? true : false,
					'susp_indefinitely': this.studentSuspensionData['susp_indefinitely'] === '1' ? true : false,
				});

				if (this.studentSuspensionData && this.studentSuspensionData['susp_docs']) {
					this.susp_docs = this.studentSuspensionData['susp_docs'];
				}

				this.studentSuspensionData['susp_indefinitely'] === '1' ? this.susp_to_required = false : this.susp_to_required = true;

				this.showRevoke = true;
			} else {
				// this.notif.showSuccessErrorMessage('No Suspension Record Found for this Student', 'error');
				this.suspensionForm.patchValue({
					'susp_from': '',
					'susp_to': '',
					'susp_reason': '',
					'susp_remark': '',
					'susp_aut_id': '',
					'susp_print_status': '',
					'susp_intimate_parents': '',
					'susp_indefinitely': ''
				});

				this.studentSuspensionData['susp_indefinitely'] === '1' ? this.susp_to_required = false : this.susp_to_required = true;
			}
		});
	}

	bindImageToForm(event) {
		const file: File = event.target.files[0];
		const fileReader: FileReader = new FileReader();
		fileReader.onload = (e) => {
			this.uploadImage(file.name, fileReader.result);
		};
		fileReader.readAsDataURL(file);
	}

	uploadImage(fileName, au_profileimage) {
		this.sisService.uploadDocuments([
			{ fileName: fileName, imagebase64: au_profileimage, module: 'suspension' }]).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.susp_docs = result.data[0].file_url;
				}
			});
	}

	viewStudentProfile() {
		const last_state_json = {
			'url': JSON.stringify(['../../auxilliarytool/suspension']),
			login_id: this.suspensionForm.value.susp_login_id
		};
		localStorage.setItem('suspension_last_state', JSON.stringify(last_state_json));
		this.router.navigate(['../../studentmaster/admission'], {
			queryParams: { login_id: this.suspensionForm.value.susp_login_id },
			relativeTo: this.route
		});

	}

	suspendStudent() {
		this.setDate();
		if (this.suspensionForm.valid) {
			this.disableApiCall = true;
			const inputJson = {
				'susp_login_id': this.suspensionForm.value.au_login_id,
				'susp_docs': this.susp_docs && this.susp_docs.length > 0 ? this.susp_docs : '',
				'susp_from': this.suspensionForm.value.susp_from,
				'susp_to': this.suspensionForm.value.susp_to,
				'susp_reason': this.suspensionForm.value.susp_reason,
				'susp_remark': this.suspensionForm.value.susp_remark,
				'susp_aut_id': this.suspensionForm.value.susp_aut_id,
				'susp_intimate_parents': this.suspensionForm.value.susp_intimate_parents ? '1' : '0',
				'susp_print_status': this.suspensionForm.value.susp_print_status ? '1' : '0',
				'susp_indefinitely': this.suspensionForm.value.susp_indefinitely ? '1' : '0'
			};
			this.sisService.suspendStudent(inputJson).subscribe((result: any) => {
				if (result) {
					this.studentSuspensionData = result.data;
					this.notif.showSuccessErrorMessage('Student Suspended Successfully', 'success');
					this.disableApiCall = false;
					this.reset();

				} else {
					this.disableApiCall = false;
				}
			});

		} else {
			this.notif.showSuccessErrorMessage('Please fill all required fields', 'error');
		}
	}

	revokeEnrolmentNumber() {
		this.setDate();
		if (this.suspensionForm.valid) {
			this.disableApiCall = true;
			const inputJson = {
				'susp_id': this.suspensionForm.value.susp_id,
				'susp_login_id': this.suspensionForm.value.au_login_id,
				'susp_docs': this.susp_docs.length > 0 ? this.susp_docs : '',
				'susp_from': this.suspensionForm.value.susp_from,
				'susp_to': this.suspensionForm.value.susp_to,
				'susp_reason': this.suspensionForm.value.susp_reason,
				'susp_remark': this.suspensionForm.value.susp_remark,
				'susp_aut_id': this.suspensionForm.value.susp_aut_id,
				'susp_intimate_parents': this.suspensionForm.value.susp_intimate_parents ? '1' : '0',
				'susp_print_status': this.suspensionForm.value.susp_print_status ? '1' : '0',
				'susp_indefinitely': this.suspensionForm.value.susp_indefinitely ? '1' : '0'
			};
			this.sisService.revokeStudent(inputJson).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.studentSuspensionData = result.data;
					this.notif.showSuccessErrorMessage('Student Revoked Successfully', 'success');
					this.showRevoke = false;
					this.disableApiCall = false;
					this.reset();
				} else {
					this.disableApiCall = false;
				}
			});

		} else {
			this.notif.showSuccessErrorMessage('Please fill all required fields', 'error');
		}
	}


	getAuthority() {
		this.sisService.getAuthority().subscribe((result: any) => {
			if (result) {
				this.authorityArray = result.data;
			}
		});
	}

	reset() {
		this.myInputVariable.nativeElement.value = '';
		this.suspensionForm.reset();
		this.susp_docs = [];
	}

	// suspFromEvent(type: string, event: MatDatepickerInputEvent<Date>) {
	// 	this.events.push(`${type}: ${event.value}`);
	// 	const datePipe = new DatePipe('en-US');
	// 	const convertedDate = datePipe.transform(this.suspensionForm.value.susp_from, 'yyyy-MM-dd');
	// 	this.suspensionForm.patchValue({
	// 		'susp_from': convertedDate
	// 	});
	// }

	// suspToEvent(type: string, event: MatDatepickerInputEvent<Date>) {
	// 	this.events.push(`${type}: ${event.value}`);
	// 	const datePipe = new DatePipe('en-US');
	// 	const convertedDate = datePipe.transform(this.suspensionForm.value.susp_to, 'yyyy-MM-dd');
	// 	this.suspensionForm.patchValue({
	// 		'susp_to': convertedDate
	// 	});
	// }

	setDate() {
		const datePipe = new DatePipe('en-US');
		const susp_from = datePipe.transform(this.suspensionForm.value.susp_from, 'yyyy-MM-dd');
		const susp_to = datePipe.transform(this.suspensionForm.value.susp_to, 'yyyy-MM-dd');
		this.suspensionForm.patchValue({
			'susp_to': susp_to,
			'susp_from': susp_from
		});
	}

	deleteFile() {
		this.myInputVariable.nativeElement.value = '';
		this.susp_docs = [];
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
			height: '100vh',
			width: '100vh'
		});
	}

	setSuspendIndefinitely(event) {
		if (event.checked) {
			this.suspensionForm.value.susp_indefinitely = '1';
			this.susp_to_required = false;
		} else {
			this.suspensionForm.value.susp_indefinitely = '0';
			this.susp_to_required = true;
		}
	}

}
