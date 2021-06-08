import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonAPIService, SisService, AxiomService, SmartService, TransportService } from '../../_services';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material';
import { Element } from './service-logs.model';
import { CapitalizePipe } from '../../../../../examination/src/app/_pipes';
import { DatePipe } from '@angular/common';
import { PreviewDocumentComponent } from '../../transport-shared/preview-document/preview-document.component';

@Component({
  selector: 'app-tyre-logs',
  templateUrl: './tyre-logs.component.html',
  styleUrls: ['./tyre-logs.component.scss']
})
export class TyreLogsComponent implements OnInit {

  displayedColumns: string[] = ['date', 'bus_id','nature','quantity','rate','amount','attachment', 'modify'];
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
  bus_arr=[];
  nature_arr = ['resole' , 'change'];
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
      'item': '',
      'quantity': '',
      'rate': '',
      'amount': '',
      'logs_type': '',
      'attachment':[],
      'status':''
		});
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
      'item': '',
      'quantity': '',
      'rate': '',
      'amount': '',
      'logs_type': '',
      'attachment':[],
      'status':''
    });
    this.imageArray = [];
		this.UpdateFlag = false;
		this.viewOnly = true;
	}
	submit() {
		if (this.subExamForm.valid) {
			this.disableApiCall = true;
      const inputJson = JSON.parse(JSON.stringify(this.subExamForm.value));
      if(inputJson.date){
        inputJson.date = new DatePipe('en-in').transform(inputJson.date,'yyyy-MM-dd');
        inputJson.logs_type='tyre';
        inputJson.status='1';
        inputJson.attachment=this.imageArray;
        inputJson.created_by = {login_id: this.currentUser.login_id,full_name:this.currentUser.full_name}
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
  getAllTransportVehicle(){
    this.bus_arr = [];
    this.transportService.getAllTransportVehicle({ status: '1' }).subscribe((result: any) => {
			if (result && result.length > 0) {
        this.bus_arr = result;
      }
    });
  }
	getAllTransportLogs() {
		this.ELEMENT_DATA = [];
		this.subExamDataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
		this.transportService.getAllTransportLogs({ status: '1',logs_type:'tyre',sort:{date:-1} }).subscribe((result: any) => {
			if (result && result.length > 0) {
				this.transportlogsArray = result;
				for (const item of this.transportlogsArray) {
					this.ELEMENT_DATA.push({
            tl_id: item.tl_id,
            date: item.date,
            bus_id: item.transport_vehicle.bus_number,
            workshop: item.workshop,
            fuel_type: item.fuel_type,
            nature: item.nature,
            item: item.item,
            quantity: item.quantity,
            rate: item.rate,
            amount: item.amount,
            attachment: item.attachment,
            logs_type:item.logs_type,
            status:item.status,
            modify: item.tl_id,
            action:item
					});
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
      item: value.item,
      quantity: value.quantity,
      rate: value.rate,
      amount: value.amount,
      logs_type: value.logs_type,
      attachment: value.attachment,
      status:value.status
    });
    if(value.attachment.length > 0){
      this.imageArray = value.attachment;
    }
    
	}
	updateTransportLogs() {
    if(this.subExamForm.valid){
      const inputJson = JSON.parse(JSON.stringify(this.subExamForm.value));
      if(inputJson.date){
        inputJson.date = new DatePipe('en-in').transform(inputJson.date,'yyyy-MM-dd');
        inputJson.logs_type='tyre';
        inputJson.attachment=this.imageArray;
      }
      this.transportService.updateTransportLogs(this.subExamForm.value).subscribe((result: any) => {
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

}
