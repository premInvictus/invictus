import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonAPIService, SisService, AxiomService, SmartService, TransportService } from '../../_services';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material';
import { Element } from './service-logs.model';
import { CapitalizePipe } from '../../../../../examination/src/app/_pipes';
import { DatePipe } from '@angular/common';
import { PreviewDocumentComponent } from '../../transport-shared/preview-document/preview-document.component';
import {ServiceLogItemsComponent } from '../service-log-items/service-log-items.component';
import { TransportLogFilterComponent} from '../../transport-shared/transport-log-filter/transport-log-filter.component'

@Component({
	selector: 'app-service-logs',
	templateUrl: './service-logs.component.html',
	styleUrls: ['./service-logs.component.scss']
})
export class ServiceLogsComponent implements OnInit {
	displayedColumns: string[] = ['date', 'bus_id', 'workshop', 'items', 'amount', 'attachment', 'modify'];
	@ViewChild('deleteModal') deleteModal;
	subExamForm: FormGroup;
	currentUser: any;
	session: any;
	disableApiCall = false;
	ckeConfig: any = {};
	transportlogsArray: any[] = [];
	ELEMENT_DATA: Element[] = [];
	UpdateFlag = false;
	viewOnly = true;
	param: any = {};
	subExamDataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
	multipleFileArray: any[] = [];
	imageArray: any[] = [];
	finalDocumentArray: any[] = [];
	counter: any = 0;
	currentFileChangeEvent: any;
	currentImage: any;
	bus_arr = [];
	tiersArray: any[] = [];
	gradeDataFrmArr: any[] = [];
	filter:any;
	constructor(
		public dialog: MatDialog,
		private fbuild: FormBuilder,
		private smartService: SmartService,
		public commonService: CommonAPIService,
		public axiomService: AxiomService,
		public sisService: SisService,
		public transportService: TransportService
	) {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.session = JSON.parse(localStorage.getItem('session'));
	}
	ngOnInit() {
		for (let i = 0; i < 25; i++) {
			this.tiersArray.push(i);
		}
		const currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.buildForm();
		this.getAllTransportLogs();
		this.getAllTransportVehicle();
	}
	buildForm() {
		this.subExamForm = this.fbuild.group({
			'tl_id': '',
			'date': '',
			'bus_id': '',
			'workshop': '',
			'fuel_type': '',
			'nature': '',
			'no_of_item': '',
			'amount' : '',
			'logs_type': '',
			'attachment': [],
			'status': ''
		});
	}
	prepareGradeData(event) {
		const gradeDataTier = event.value;
		this.gradeDataFrmArr = [];
		for (let i = 0; i < gradeDataTier; i++) {
			this.gradeDataFrmArr.push({
				formGroup: this.fbuild.group({
					item: '',
					quantity: '',
					rate: ''
				})
			});
		}

	}

	setGradeData(gradeDataTier) {
		this.gradeDataFrmArr = [];
		for (let i = 0; i < gradeDataTier.length; i++) {
			this.gradeDataFrmArr.push({
				formGroup: this.fbuild.group({
					item: gradeDataTier[i]['item'],
					quantity: gradeDataTier[i]['quantity'],
					rate: gradeDataTier[i]['rate']
				})
			});
		}
	}
	deleteGradeData(index) {
		const no_of_item = this.subExamForm.value.no_of_item - 1;
		this.subExamForm.patchValue({
			no_of_item: no_of_item
		});
		this.gradeDataFrmArr.splice(index, 1);
	}
	// delete dialog open modal function
	openDeleteModal(value) {
		this.param.tl_id = value;
		this.param.text = 'Delete';
		this.deleteModal.openModal(this.param);
	}
	resetForm() {
		this.subExamForm.patchValue({
			'tl_id': '',
			'date': '',
			'bus_id': '',
			'workshop': '',
			'fuel_type': '',
			'nature': '',
			'no_of_item': '',
			'amount':'',
			'logs_type': '',
			'attachment': [],
			'status': ''
		});
		this.imageArray = [];
		this.UpdateFlag = false;
		this.gradeDataFrmArr = [];
		this.viewOnly = true;
	}
	submit() {
		if (this.subExamForm.valid) {
			this.disableApiCall = true;
			const inputJson = JSON.parse(JSON.stringify(this.subExamForm.value));
			if (inputJson.date) {
				inputJson.date = new DatePipe('en-in').transform(inputJson.date, 'yyyy-MM-dd');
				inputJson.logs_type = 'service';
				inputJson.status = '1';
				inputJson.attachment = this.imageArray;
				inputJson.created_by = { login_id: this.currentUser.login_id, full_name: this.currentUser.full_name };
				let items = [];
				this.gradeDataFrmArr.forEach(element => {
					items.push(element.formGroup.value)
				});
				inputJson.items = items;
				inputJson.amount = this.getTotal(items);
			}
			this.transportService.insertTransportLogs(inputJson).subscribe((result_i: any) => {
				if (result_i) {
					this.getAllTransportLogs();
					this.resetForm();
					this.disableApiCall = false;
					this.commonService.showSuccessErrorMessage('Transport Logs Added Successfully', 'success');
				} else {
					this.commonService.showSuccessErrorMessage('Insert failed', 'error');
					this.disableApiCall = false;
				}
			});
		} else {
			this.commonService.showSuccessErrorMessage('Please fill required fields', 'error');
		}
	}
	getAllTransportVehicle() {
		this.bus_arr = [];
		this.transportService.getAllTransportVehicle({ status: '1' }).subscribe((result: any) => {
			if (result && result.length > 0) {
				this.bus_arr = result;
			}
		});
	}
	getTotal(gradeDataTier) {
		let total = 0;
		for (let i = 0; i < gradeDataTier.length; i++) {
			total += (gradeDataTier[i].quantity * gradeDataTier[i].rate)
		}
		return total;
	}
	getAllTransportLogs() {
		this.ELEMENT_DATA = [];
		this.subExamDataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
		const param:any = this.filter ? JSON.parse(JSON.stringify(this.filter)) : {};
		param['status'] = '1';
		param['logs_type'] = 'service';
		param['sort'] = { date: -1 };
		this.transportService.getAllTransportLogs(param).subscribe((result: any) => {
			if (result && result.length > 0) {
				this.transportlogsArray = result;
				for (const item of this.transportlogsArray) {
					const element = {
						tl_id: item.tl_id,
						date: item.date,
						bus_id: item.transport_vehicle.bus_number,
						workshop: item.workshop,
						fuel_type: item.fuel_type,
						nature: item.nature,
						items:item.items,
						no_of_item: item.no_of_item,
						amount: item.amount,
						attachment: item.attachment,
						logs_type: item.logs_type,
						status: item.status,
						modify: item.tl_id,
						action: item
					};

					this.ELEMENT_DATA.push(element);
				}
				this.subExamDataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
			}
		});
	}
	getActiveStatus(value: any) {
		if (value.status === '1') {
			return true;
		}
	}
	toggleStatus(value: any) {
		if (value.status === '1') {
			value.status = '0';
		} else {
			value.status = '1';
		}
		this.transportService.updateTransportLogs(value).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.commonService.showSuccessErrorMessage('Status Changed', 'success');
				this.getAllTransportLogs();
			}
		});
	}
	formEdit(value: any) {
		this.UpdateFlag = true;
		this.viewOnly = false;
		this.subExamForm.patchValue({
			tl_id: value.tl_id,
			date: value.date,
			bus_id: value.bus_id,
			workshop: value.workshop,
			fuel_type: value.fuel_type,
			nature: value.nature,
			no_of_item: value.no_of_item,
			logs_type: value.logs_type,
			attachment: value.attachment,
			status: value.status
		});
		if (value.attachment.length > 0) {
			this.imageArray = value.attachment;
		}
		this.setGradeData(value.items)

	}
	updateTransportLogs() {
		if (this.subExamForm.valid) {
			const inputJson = JSON.parse(JSON.stringify(this.subExamForm.value));
			if (inputJson.date) {
				inputJson.date = new DatePipe('en-in').transform(inputJson.date, 'yyyy-MM-dd');
				inputJson.logs_type = 'service';
				inputJson.attachment = this.imageArray;
				let items = [];
				this.gradeDataFrmArr.forEach(element => {
					items.push(element.formGroup.value)
				});
				inputJson.items = items;
				inputJson.amount = this.getTotal(items);
			}
			this.transportService.updateTransportLogs(inputJson).subscribe((result: any) => {
				if (result) {
					this.commonService.showSuccessErrorMessage('Updated Succesfully', 'success');
					this.getAllTransportLogs();
					this.resetForm();
				}
			});
		} else {
			this.commonService.showSuccessErrorMessage('Please fill required fields', 'error');
		}

	}
	deleteTransportLogs($event) {
		const deleteJson = {
			tl_id: $event.tl_id,
			status: '5'
		};
		this.transportService.updateTransportLogs(deleteJson).subscribe((result: any) => {
			if (result) {
				this.commonService.showSuccessErrorMessage('Deleted Succesfully', 'success');
				this.getAllTransportLogs();
				this.resetForm();
			}
		});
	}
	fileChangeEvent(fileInput) {
		this.multipleFileArray = [];
		this.currentFileChangeEvent = fileInput;
		const files = fileInput.target.files;
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
				imagebase64: this.currentImage,
				module: 'classworkupdate'
			};
			this.multipleFileArray.push(fileJson);
			if (this.multipleFileArray.length === this.currentFileChangeEvent.target.files.length) {
				this.sisService.uploadDocuments(this.multipleFileArray).subscribe((result: any) => {
					if (result && result.status === 'ok') {
						for (const item of result.data) {
							console.log('item', item);
							this.imageArray.push({
								file_name: item.file_name,
								file_url: item.file_url
							});
						}
						console.log('image array', this.imageArray);
					}
				});
			}
		};
		reader.readAsDataURL(files);
	}
	deleteFile(index) {
		this.imageArray.splice(index, 1);
	}

	resetAttachment() {
		this.imageArray = [];
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
	previewDocuments(attachmentArray) {
		if (attachmentArray && attachmentArray.length > 0) {
			const dialogRef = this.dialog.open(PreviewDocumentComponent, {
				height: '80%',
				width: '1000px',
				data: {
					index: '',
					images: attachmentArray
				}
			});
		}
	}
	openDialogItemDetail(item): void {
		const dialogRef = this.dialog.open(ServiceLogItemsComponent, {
			height: '80%',
			width: '1000px',
		  	data: item
		});
	
		dialogRef.afterClosed().subscribe(result => {
		});
	  }
	  openDialogFilter(): void {
		const dialogRef = this.dialog.open(TransportLogFilterComponent, {
			height: '80%',
			width: '1000px',
		  	data: {}
		});
	
		dialogRef.afterClosed().subscribe(result => {
			if(result){
				console.log(result);
				this.filter = result
				this.getAllTransportLogs()
			}
		});
	  }

}
