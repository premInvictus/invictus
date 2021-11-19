import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SisService, AxiomService, CommonAPIService, SmartService } from '../../_services';
import { FormBuilder, FormGroup } from '@angular/forms';

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
	sec_id: any;
	sub_id;
	topic_id;
	assignment_desc;
	ckeConfig: any = {};
	currentUser: any = {};
	isTeacher = false;
	assignmentForm: FormGroup;
	disabledApiButton = false;
	constructor(
		public dialogRef: MatDialogRef<AssignmentAttachmentDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data,
		private sisService: SisService,
		private fbuild: FormBuilder,
		private commonAPIService: CommonAPIService,
		private axiomService: AxiomService,
		private smartService: SmartService
	) { }
	buildForm() {
		this.assignmentForm = this.fbuild.group({
			class_id: '',
			sec_id: '',
			sub_id: '',
			topic_id: '',
			assignment_desc: ''
		});
	}
	ngOnInit() {
		console.log(this.data);
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		if (this.currentUser.role_id === '3') {
			this.isTeacher = true;
		}
		this.getClass();
		this.buildForm();
		this.editFlag = this.data.edit;
		this.imageArray = this.data.attachments;
		this.class_id = this.data.class_id;
		this.sec_id = this.data.sec_id;
		this.sub_id = this.data.sub_id;
		this.topic_id = this.data.topic_id;
		this.assignment_desc = this.data.assignment_desc;
		this.assignmentForm.patchValue({
			class_id: this.class_id,
			sec_id:this.sec_id,
			sub_id: this.sub_id,
			topic_id: this.topic_id,
			assignment_desc: this.assignment_desc
		});
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
	getClass() {
		this.classArray = [];
		if (this.isTeacher) {
			this.smartService.getClassByTeacherId({ teacher_id: this.currentUser.login_id }).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.classArray = result.data;
					if (this.class_id) {
						this.getSectionsByClass();
						this.getSubjectsByClass();
					}
				} else {
					this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
				}
			});
		} else {
			this.smartService.getClass({ class_status: '1' }).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.classArray = result.data;
					if (this.class_id) {
						this.getSectionsByClass();
						this.getSubjectsByClass();
					}
				} else {
					this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
				}
			});
		}
	}
	getSectionsByClass() {
		this.sectionArray = [];
		this.smartService.getSectionsByClass({ class_id: this.assignmentForm.value.class_id }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.sectionArray = result.data;
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}
	getSubjectsByClass() {
		this.subjectArray = [];
		if (this.isTeacher) {
			if (this.sec_id) {
				this.smartService.getSubjectByTeacherIdClassIdSectionId({
					teacher_id: this.currentUser.login_id,
					class_id: this.assignmentForm.value.class_id, 
					sec_id: this.assignmentForm.value.sec_id
				}).subscribe((result: any) => {
					if (result && result.status === 'ok') {
						this.subjectArray = result.data;
						if (this.sub_id) {
							this.getTopicByClassIdSubjectId();
						}
					} else {
						this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
					}
				});
			}
		} else {
			this.smartService.getSubjectsByClass({ class_id: this.assignmentForm.value.class_id,sub_timetable:1 }).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.subjectArray = result.data;
					if (this.sub_id) {
						this.getTopicByClassIdSubjectId();
					}
				} else {
					this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
				}
			});
		}
	}
	getTopicByClassIdSubjectId() {
		this.topicArray = [];
		this.smartService.getTopicByClassIdSubjectId({ class_id: this.assignmentForm.value.class_id,
			 sub_id: this.assignmentForm.value.sub_id }).subscribe((result: any) => {
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
		this.assignment_desc = '';
	}

	submitAttachment() {
		this.dialogRef.close({ attachments: this.imageArray, assignment_desc: this.assignmentForm.value.assignment_desc });
		/*if(this.assignment_desc) {
			this.dialogRef.close({ attachments: this.imageArray, assignment_desc: this.assignment_desc });
		} else {
			this.commonAPIService.showSuccessErrorMessage('Please fill all required field', 'error');
		}*/
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
	closeDialog() {
		this.dialogRef.close();
	}
	addAttachment() {
		console.log('addAttachment');
		if (this.assignmentForm.value.class_id && this.assignmentForm.value.sec_id
			&& this.assignmentForm.value.sub_id && this.assignmentForm.value.topic_id
			&& this.assignmentForm.value.assignment_desc) {
			this.disabledApiButton = true;
			const param: any = {};
			param.as_class_id = this.assignmentForm.value.class_id;
			param.as_sec_id = this.assignmentForm.value.sec_id;
			param.as_sub_id = this.assignmentForm.value.sub_id;
			param.as_topic_id = this.assignmentForm.value.topic_id;
			param.as_assignment_desc = this.assignmentForm.value.assignment_desc;
			param.as_attachment = this.imageArray;
			this.smartService.assignmentInsert(param).subscribe((result: any) => {
				this.disabledApiButton = false;
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
