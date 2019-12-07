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
	currentUser: any = {};
	isTeacher = false;

	constructor(
		public dialogRef: MatDialogRef<AssignmentAttachmentDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data,
		private sisService: SisService,
		private commonAPIService: CommonAPIService,
		private axiomService: AxiomService
	) { }

	ngOnInit() {
		console.log(this.data);
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		if (this.currentUser.role_id === '3') {
			this.isTeacher = true;
		}
		this.editFlag = this.data.edit;
		this.imageArray = this.data.attachments;
		this.class_id = this.data.class_id;
		this.sec_id = this.data.sec_id;
		this.sub_id = this.data.sub_id;
		this.topic_id = this.data.topic_id;
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

	closeDialog() {

	}

	getSectionsByClass() {

	}

	getSubjectsByClass() {

	}

	getTopicByClassIdSubjectId() {

	}
	
}
