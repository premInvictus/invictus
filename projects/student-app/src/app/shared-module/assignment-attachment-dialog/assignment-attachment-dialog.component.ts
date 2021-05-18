import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {CommonAPIService, ErpCommonService } from 'src/app/_services'; 
import { SmartService } from 'projects/smart/src/app/_services/index';


@Component({
	selector: 'app-assignment-attachment-dialog',
	templateUrl: './assignment-attachment-dialog.component.html',
	styleUrls: ['./assignment-attachment-dialog.component.css']
})
export class AssignmentAttachmentDialogComponent implements OnInit {

	editFlag = false;
	multipleFileArray: any[] = [];
	imageArray: any[] = [];
	finalDocumentArray: any[] = [];
	counter: any = 0;
	currentFileChangeEvent: any;
	currentImage: any;
	classArray: any[] = [];
	sectionArray: any[] = [];
	subjectArray: any[] = [];
	topicArray: any[] = [];
	subtopicArray: any[] = [];
	assignment_desc;
	ckeConfig: any = {};
	currentUser: any = {};

	constructor(
		public dialogRef: MatDialogRef<AssignmentAttachmentDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data,
		private commonAPIService: CommonAPIService,
		private smartService: SmartService,
		private erpCommonService: ErpCommonService
	) { }

	ngOnInit() {
		console.log(this.data);
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.editFlag = this.data.edit;
		this.imageArray = this.data.attachments;
		this.assignment_desc = this.data.assignment_desc;
		this.ckeConfig = {
			allowedContent: true,
			pasteFromWordRemoveFontStyles: false,
			contentsCss: ['https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css'],
			disallowedContent: 'm:omathpara',
			height: '170',
			width: '100%',
			// tslint:disable-next-line:max-line-length
			extraPlugins: '',
			scayt_multiLanguageMod: true,
			toolbar: [
				// tslint:disable-next-line:max-line-length
				['Font', 'FontSize', 'Bold', 'Italic', 'Underline', 'Strikethrough', 'Image', 'Table', 'Templates']
			],
			removeDialogTabs: 'image:advanced;image:Link',
		};
		this.ckeConfig.font_defaultLabel = 'Arial';
		this.ckeConfig.fontSize_defaultLabel = '20';
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
				this.erpCommonService.uploadDocuments(this.multipleFileArray).subscribe((result: any) => {
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
		this.assignment_desc = '';
	}

	submitAttachment() {
		this.dialogRef.close({ attachments: this.imageArray, assignment_desc: this.assignment_desc });
	}
	closeDialog() {
		this.dialogRef.close();
	}
	addAttachment() {
		console.log('addAttachment');
		if (this.data.as_id && this.assignment_desc && this.imageArray.length > 0) {
			const param: any = {};
			param.sas_as_id = this.data.as_id;
			param.sas_login_id = this.data.login_id;
			param.sas_assignment_desc = this.assignment_desc;
			param.sas_attachment = this.imageArray;
			this.erpCommonService.insertAssignmentSubmit(param).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.commonAPIService.showSuccessErrorMessage(result.message, 'success');
					this.dialogRef.close({ added: true });
				}
			});
		} else {
			this.commonAPIService.showSuccessErrorMessage('Please enter all required fields', 'error');
		}
	}
	resetAddAttachment() {
		console.log('resetAddAttachment');

	}
}
