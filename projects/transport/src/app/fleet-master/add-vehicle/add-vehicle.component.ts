import { Component, Inject, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SmartService, SisService, CommonAPIService, TransportService } from '../../_services';
import { ErpCommonService } from 'src/app/_services';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TitleCasePipe, DatePipe } from '@angular/common';
import { PreviewDocumentComponent } from '../../transport-shared/preview-document/preview-document.component';
import * as moment from 'moment/moment';

@Component({
	selector: 'app-add-vehicle',
	templateUrl: './add-vehicle.component.html',
	styleUrls: ['./add-vehicle.component.scss']
})
export class AddVehicleComponent implements OnInit {
	@ViewChild('cropModal') cropModal;
	@ViewChild('fileInput') myInputVariable: ElementRef;
	imageFlag = false;
	bookImage: any = '';
	url: any;
	imageUrl: any = '';
	bookForm: FormGroup;
	imageArray = [];
	viewOnly = false;
	documentsArray = [
		{ id: 'insurance', name: 'Insurance', document: [] },
		{ id: 'rc', name: 'RC', document: [] },
		{ id: 'puc', name: 'PUC', document: [] },
		{ id: 'licence', name: 'Licence', document: [] },
		{ id: 'permits', name: 'Permits', document: [] },
		{ id: 'others', name: 'Others', document: [] }
	];
	currentFileChangeEvent: any;
	multipleFileArray: any[] = [];
	counter: any = 0;
	currentImage: any;
	userDataArr: any = [];
	constructor(
		public dialogRef: MatDialogRef<AddVehicleComponent>,
		public dialogRef2: MatDialogRef<PreviewDocumentComponent>,
		private dialog: MatDialog,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private fbuild: FormBuilder,
		private commonAPIService: CommonAPIService,
		private sisService: SisService,
		private transportService: TransportService
	) { }

	ngOnInit() {
		this.getAllTransportStaff();
		console.log('data', this.data);
		this.builForm();
	}
	// getUser() {
	// 	this.userDataArr = [];
	// 	const inputJson: any = {};
	// 	inputJson['role_id'] = '2';
	// 	inputJson['status'] = '1';
	// 	this.sisService.getUser(inputJson).subscribe((result: any) => {
	// 		if (result && result.data && result.data[0]['au_login_id']) {
	// 			this.userDataArr = result.data;
	// 		}
	// 	});
	// }
	getAllTransportStaff() {
		this.userDataArr = [];
		this.transportService.getAllTransportStaff({}).subscribe((result: any) => {
			if (result && result.length > 0) {
				this.userDataArr = result;
			}
		});
	}
	builForm() {
		this.bookForm = this.fbuild.group({
			tv_id: '',
			bus_number: '',
			bus_details: '',
			registration_no: '',
			registration_valid_upto: '',
			permit_valid_upto: '',
			insurance_valid_upto: '',
			puc_valid_upto: '',
			insurance_provider: '',
			bus_image: '',
			insurance_no: '',
			chasis_no: '',
			engine_no: '',
			device_no: '',
			documents: [],
			status: '',
			ses_id: '',
			driver_id: '',
			conductor_id: '',
			supervisor_id: '',
		});
		if (this.data.data) {
			this.bookForm.patchValue({
				tv_id: this.data.data.tv_id,
				bus_number: this.data.data.bus_number,
				bus_details: this.data.data.bus_details,
				registration_no: this.data.data.registration_no,
				registration_valid_upto: this.data.data.registration_valid_upto,
				permit_valid_upto: this.data.data.permit_valid_upto,
				insurance_valid_upto: this.data.data.insurance_valid_upto,
				puc_valid_upto: this.data.data.puc_valid_upto,
				insurance_provider: this.data.data.insurance_provider,
				bus_image: this.data.data.bus_image,
				insurance_no: this.data.data.insurance_no,
				chasis_no: this.data.data.chasis_no,
				engine_no: this.data.data.engine_no,
				device_no: this.data.data.device_no,
				documents: this.data.data.documents,
				status: this.data.data.status,
				ses_id: this.data.data.ses_id,
				driver_id: this.data.data.driver_id,
				conductor_id: this.data.data.conductor_id,
				supervisor_id: this.data.data.supervisor_id,
			})
			this.bookImage = this.data.data.bus_image;
			this.documentsArray = this.data.data.documents;
			if (this.data.action == 'view') {
				this.viewOnly = true;
			}
		}
	}
	readUrl(event: any) {
		this.openCropDialog(event);
	}
	openCropDialog = (imageFile) => this.cropModal.openModal(imageFile);
	uploadImage(fileName, au_profileimage) {
		this.imageFlag = false;
		this.sisService.uploadDocuments([
			{ fileName: fileName, imagebase64: au_profileimage, module: 'profile' }]).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.bookImage = result.data[0].file_url;
					this.imageFlag = true;
					this.myInputVariable.nativeElement.value = '';
				} else {
					this.myInputVariable.nativeElement.value = '';
				}
			});
	}
	fileChangeEvent(fileInput, doc_req_id) {
		this.multipleFileArray = [];
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
				module: 'attachment'
			};
			this.multipleFileArray.push(fileJson);
			this.counter++;
			if (this.counter === this.currentFileChangeEvent.target.files.length) {
				this.sisService.uploadDocuments(this.multipleFileArray).subscribe((result: any) => {
					if (result) {
						for (const item of result.data) {
							const findex = this.documentsArray.findIndex(f => f.id === doc_req_id);
							this.documentsArray[findex]['document'].push(item);
							this.imageArray.push({ id: doc_req_id, file_url: item.file_url });

						}
					}
				});
			}
		};
		reader.readAsDataURL(files);
	}
	// viewDocumentUploaded(doc_req_id, docreq_name) {
	// 	this.dialogRef = this.dialog.open(ViewDocumentsComponent, {
	// 		data: {
	// 			doc_req_id: doc_req_id,
	// 			doc_name: docreq_name,
	// 			login_id: this.login_id,
	// 			viewFlag: this.viewOnly,
	// 			editFlag: this.editFlag,
	// 			view_login_id: this.context.studentdetails.studentdetailsform.value.au_login_id,
	// 			docArray: this.finalDocumentArray
	// 		},
	// 		height: '70vh',
	// 		width: '70vh'
	// 	});
	// }
	previewImage(doc_index, doc_req_id) {
		const findex = this.documentsArray.findIndex(f => f.id === doc_req_id);
		console.log(this.documentsArray[findex]['document'], doc_index);
		this.dialogRef2 = this.dialog.open(PreviewDocumentComponent, {
			height: '80%',
			width: '1000px',
			data: {
				index: doc_index,
				images: this.documentsArray[findex]['document']
			}
		});
	}
	deleteFile(doc_index, doc_req_id) {
		const findex = this.documentsArray.findIndex(f => f.id === doc_req_id);
		this.documentsArray[findex]['document'].splice(doc_index, 1);
	}
	acceptCrop(result) {
		this.uploadImage(result.filename, result.base64);
	}
	acceptNo(event) {
		event.target.value = '';
	}
	getuploadurl(fileurl: string) {
		const filetype = fileurl.substr(fileurl.lastIndexOf('.') + 1);
		if (filetype === 'pdf') {
			return 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/exam/icon-pdf.png';
		} else if (filetype === 'doc' || filetype === 'docx') {
			return 'https://s3.ap-south-1.amazonaws.com/files.invictusdigisoft.com/images/exam/icon-word.png';
		} else {
			return fileurl;
		}
	}
	submit() {
		if (this.bookForm.valid) {
			let inputJson: any = JSON.parse(JSON.stringify(this.bookForm.value));
			inputJson.bus_image = this.bookImage;
			inputJson.documents = this.documentsArray
			if (moment.isMoment(inputJson.registration_valid_upto)) {
				inputJson.registration_valid_upto = inputJson.registration_valid_upto.format('YYYY-MM-DD');
			} else {
				inputJson.registration_valid_upto = new DatePipe('en-in').transform(inputJson.registration_valid_upto, 'yyyy-MM-dd');
			}
			if (moment.isMoment(inputJson.permit_valid_upto)) {
				inputJson.permit_valid_upto = inputJson.permit_valid_upto.format('YYYY-MM-DD');
			} else {
				inputJson.permit_valid_upto = new DatePipe('en-in').transform(inputJson.permit_valid_upto, 'yyyy-MM-dd');
			}
			if (moment.isMoment(inputJson.insurance_valid_upto)) {
				inputJson.insurance_valid_upto = inputJson.insurance_valid_upto.format('YYYY-MM-DD');
			} else {
				inputJson.insurance_valid_upto = new DatePipe('en-in').transform(inputJson.insurance_valid_upto, 'yyyy-MM-dd');
			}
			if (moment.isMoment(inputJson.puc_valid_upto)) {
				inputJson.puc_valid_upto = inputJson.puc_valid_upto.format('YYYY-MM-DD');
			} else {
				inputJson.puc_valid_upto = new DatePipe('en-in').transform(inputJson.puc_valid_upto, 'yyyy-MM-dd');
			}
			console.log(inputJson);
			if (inputJson.tv_id) {
				this.transportService.updateTransportVehicle(inputJson).subscribe((result: any) => {
					if (result) {
						this.commonAPIService.showSuccessErrorMessage('Created Successfully', 'success');
						this.close({ status: true });
					}
				})
			} else {
				inputJson.status = '1';
				this.transportService.insertTransportVehicle(inputJson).subscribe((result: any) => {
					if (result) {
						this.commonAPIService.showSuccessErrorMessage('Created Successfully', 'success');
						this.close({ status: true });
					}
				})
			}


		}
	}
	close(data = null) {
		this.dialogRef.close(data)
	}

}
