import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SisService, AxiomService, CommonAPIService } from '../../_services';

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
	class_id;
	sec_id;
	sub_id;
	topic_id;
	assignment_desc;
	ckeConfig: any = {};

	constructor(
		public dialogRef: MatDialogRef<AssignmentAttachmentDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data,
		private sisService: SisService,
		private commonAPIService: CommonAPIService,
		private axiomService: AxiomService
	) { }

	ngOnInit() {
		this.editFlag = this.data.edit;
		this.imageArray = this.data.attachments;
		this.class_id = this.data.class_id;
		this.sec_id = this.data.sec_id;
		this.sub_id = this.data.sub_id;
		this.topic_id = this.data.topic_id;
		this.assignment_desc = this.data.assignment_desc;
		this.getClass();
		this.ckeConfig = {
			allowedContent: true,
			pasteFromWordRemoveFontStyles: false,
			contentsCss: ['https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css'],
			disallowedContent: 'm:omathpara',
			height: '150',
			width: '100%',
			// tslint:disable-next-line:max-line-length
			extraPlugins: '',
			scayt_multiLanguageMod: true,
			toolbar: [
				// tslint:disable-next-line:max-line-length
				['Font', 'FontSize', 'Bold', 'Italic', 'Underline', 'Strikethrough', 'Image', 'Table', 'Templates']
			],
			removeDialogTabs: 'image:advanced;image:Link'
		};
	}
	getClass() {
		this.classArray = [];
		this.sisService.getClass({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.classArray = result.data;
				this.getSectionsByClass();
				this.getSubjectsByClass();
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}
	getSectionsByClass() {
		this.sectionArray = [];
		this.sisService.getSectionsByClass({ class_id: this.class_id }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.sectionArray = result.data;
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}
	getSubjectsByClass() {
		this.subjectArray = [];
		this.axiomService.getSubjectsByClass({ class_id: this.class_id }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.subjectArray = result.data;
				this.getTopicByClassSubject();
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}
	getTopicByClassSubject() {
		this.topicArray = [];
		this.axiomService.getTopicByClassSubject(this.class_id, this.sub_id).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.topicArray = result.data;
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
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

	submitAttachment() {
		this.dialogRef.close({ attachments: this.imageArray, assignment_desc: this.assignment_desc });
	}
	closeDialog() {
		this.dialogRef.close();
	}
}
