import { Component, Inject, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SmartService, SisService, CommonAPIService, TransportService } from '../../_services';
import { ErpCommonService } from 'src/app/_services';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TitleCasePipe, DatePipe } from '@angular/common';
import { PreviewDocumentComponent } from '../../transport-shared/preview-document/preview-document.component';
import * as moment from 'moment/moment';

@Component({
  selector: 'app-add-transport-staff',
  templateUrl: './add-transport-staff.component.html',
  styleUrls: ['./add-transport-staff.component.scss']
})
export class AddTransportStaffComponent implements OnInit {

  @ViewChild('cropModal') cropModal;
	@ViewChild('fileInput') myInputVariable: ElementRef;
	imageFlag = false;
	au_profileimage: any = '';
	url: any;
	imageUrl: any = '';
	personalDetails: FormGroup;
	imageArray = [];
	viewOnly = false;
	currentFileChangeEvent: any;
	multipleFileArray: any[] = [];
	counter: any = 0;
  currentImage: any;
  
  departmentArray = [];
	wingArray = [];
  designationArray: any[] = [];
  categoryOneArray: any[] = [];
	constructor(
		public dialogRef: MatDialogRef<AddTransportStaffComponent>,
		public dialogRef2: MatDialogRef<PreviewDocumentComponent>,
		private dialog: MatDialog,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private fbuild: FormBuilder,
		private commonAPIService: CommonAPIService,
		private sisService: SisService,
		private transportService: TransportService
	) { }

	ngOnInit() {
		console.log('data', this.data);
    this.builForm();
    this.getDepartment();
		this.getDesignation();
		this.getWing();
  }
  getDepartment() {
		this.sisService.getMaster({ type_id: '7' }).subscribe((result: any) => {
			if (result) {
				this.departmentArray = result;
			} else {
				this.departmentArray = [];
			}

		});
	}

	getDesignation() {
		this.sisService.getMaster({ type_id: '2' }).subscribe((result: any) => {
			if (result) {
				this.designationArray = result;
			} else {
				this.designationArray = [];
			}

		});
	}
	getWing() {
		this.sisService.getMaster({ type_id: '1', status: '1' }).subscribe((result: any) => {
			if (result) {
				this.wingArray = result;
			} else {
				this.wingArray = [];
			}

		});
  }
	builForm() {
		this.personalDetails = this.fbuild.group({
      ts_au_login_id:'',
      au_profileimage:'',
      au_full_name:'',
			p_address: '',		
			au_mobile: '',
			whatsapp_no: '',
			au_email: '',
			au_dob: '',
      batch_licence_no:'',
      driver_id:'',
      licence_type:'',
      licence_no:'',
      valid_upto:'',
      status:''
		});
		if(this.data.data){
			this.personalDetails.patchValue({
				ts_au_login_id: this.data.data.ts_au_login_id,
				au_full_name: this.data.data.au_full_name,
				p_address: this.data.data.p_address,
				au_mobile: this.data.data.au_mobile,
				whatsapp_no: this.data.data.whatsapp_no,
				au_email: this.data.data.au_email,
				au_dob: this.data.data.au_dob,
				batch_licence_no: this.data.data.batch_licence_no,
				driver_id: this.data.data.driver_id,
				licence_type: this.data.data.licence_type,
				licence_no: this.data.data.licence_no,
				valid_upto: this.data.data.valid_upto,
				status: this.data.data.status,
			})
			this.au_profileimage =  this.data.data.au_profileimage;
			if(this.data.action == 'view') {
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
					this.au_profileimage = result.data[0].file_url;
					this.imageFlag = true;
					this.myInputVariable.nativeElement.value = '';
				} else {
					this.myInputVariable.nativeElement.value = '';
				}
			});
	}
	
	acceptCrop(result) {
		this.uploadImage(result.filename, result.base64);
	}
	acceptNo(event) {
		event.target.value = '';
	}
	submit() {
		if (this.personalDetails.valid) {
			let inputJson:any = JSON.parse(JSON.stringify(this.personalDetails.value));
			inputJson.au_profileimage = this.au_profileimage;
			if(moment.isMoment(inputJson.au_dob)){
				inputJson.au_dob = inputJson.au_dob.format('YYYY-MM-DD');
			} else {
				inputJson.au_dob = new DatePipe('en-in').transform(inputJson.au_dob,'yyyy-MM-dd');
			}
			if(moment.isMoment(inputJson.valid_upto)){
				inputJson.valid_upto = inputJson.valid_upto.format('YYYY-MM-DD');
			} else {
				inputJson.valid_upto = new DatePipe('en-in').transform(inputJson.valid_upto,'yyyy-MM-dd');
			}
			console.log(inputJson);
			if(inputJson.ts_au_login_id){
				this.transportService.updateTransportStaff(inputJson).subscribe((result: any) => {
					if (result) {
						this.commonAPIService.showSuccessErrorMessage('Created Successfully', 'success');
						this.close({status:true});
					}
				})
			} else {
				inputJson.status = '1';
				this.transportService.insertTransportStaff(inputJson).subscribe((result: any) => {
					if (result) {
						this.commonAPIService.showSuccessErrorMessage('Created Successfully', 'success');
						this.close({status:true});
					}
				})
			}
			

		}
	}
	close(data=null){
		this.dialogRef.close(data)
	}

}
