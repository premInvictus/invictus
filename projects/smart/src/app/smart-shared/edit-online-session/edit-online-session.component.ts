
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SisService, AxiomService, CommonAPIService, SmartService } from '../../_services';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-edit-online-session',
  templateUrl: './edit-online-session.component.html',
  styleUrls: ['./edit-online-session.component.css']
})
export class EditOnlineSessionComponent implements OnInit {

	editFlag = false;
	multipleFileArray: any[] = [];
	imageArray: any[] = [];
	finalDocumentArray: any[] = [];
	counter: any = 0;
	currentFileChangeEvent: any;
	currentImage: any;
	checked: boolean = false;
	classArray: any[] = [];
	sectionArray: any[] = [];
	subjectArray: any[] = [];
	topicArray: any[] = [];
	subtopicArray: any[] = [];
	class_id;
	sec_id: any;
	sub_id;
	type_of_reccurring = "";
	topic_id;
	assignment_desc;
	ckeConfig: any = {};
	currentUser: any = {};
	isTeacher = false;
	teacherArray: any[] = [];
	assignmentForm: FormGroup;
	disabledApiButton = false;
	sessionArray: any[] = [];
	constructor(
		public dialogRef: MatDialogRef<EditOnlineSessionComponent>,
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
			teacher_id: '',
			session_start_time: '',
			session_end_time: '',
			session_date: '',
			session_no: '',
			session_url: '',
			session_meeting_id: '',
			session_password: '',
			session_status: '',
			session_platform: '',
			class_type: '',
			session_end_date: '',
			session_admin_name: '',
      id: ''
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
		this.getTeacher();
		this.editFlag = true;
		this.imageArray = this.data.attachments;
		this.class_id = this.data.class_id;
		this.sec_id = this.data.sec_id;
		this.sub_id = this.data.sub_id;
		this.topic_id = this.data.topic_id;
		this.assignment_desc = this.data.assignment_desc;
		this.assignmentForm.patchValue({
			class_id: this.data.currentAttachment.tsoc_class,
			sec_id:this.data.currentAttachment.tsoc_sec.split(", "),
			sub_id: this.sub_id,
			teacher_id: this.data.currentAttachment.tsoc_teacher,
			session_start_time: this.data.currentAttachment.tsoc_start_time,
			session_end_time: this.data.currentAttachment.tsoc_end_time,
			session_no: this.data.currentAttachment.tsoc_session,
			session_url: this.data.currentAttachment.tsoc_url,
			session_meeting_id: this.data.currentAttachment.tsoc_admin_email,
			session_password: this.data.currentAttachment.tsoc_password,
			session_status: this.data.currentAttachment.tsoc_status,
			session_platform : this.data.currentAttachment.tsoc_type,
      session_date: this.data.currentAttachment.tsoc_class_date,
      session_end_date: this.data.currentAttachment.tsoc_class_end_date,
			session_admin_name : this.data.currentAttachment.tsoc_admin_name,
      id: this.data.currentAttachment.tsoc_id,

		});
    if(this.data.currentAttachment.tsoc_class_type == "regular") {
      this.checked = true;
    }
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
					// this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
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
					// this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
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
				// this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}
	getTeacher() {
		this.smartService.getTeachers().subscribe((res:any) => {
			if(res.status == 'ok') {
				this.teacherArray = res.message
			}
		})
	}
	getSubjectsByClass() {
		this.subjectArray = [];
		
			this.smartService.getSubjectsByClass({ class_id: this.assignmentForm.value.class_id,sub_timetable:1 }).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.subjectArray = result.data;
				} else {
					// this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
				}
			});
			this.smartService.getSessionPerClassSec({
				class_id: this.assignmentForm.value.class_id, 
				sec_id: this.assignmentForm.value.sec_id
			}).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.sessionArray = result.data;
				} else {
					// this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
				}
			});
		
	}
	getTypeRecurring(e) {
		if(this.checked) {
			this.assignmentForm.patchValue({
				class_type : 'special'
			})
			this.checked = !this.checked;
		} else {
			this.assignmentForm.patchValue({
				class_type : 'regular'
			});
			this.checked = !this.checked;
		}
		// this.type_of_reccurring = this.assignmentForm.value.class_type;
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
		
	}
	
	closeDialog() {
		this.dialogRef.close();
	}
	
	addAttachment() {
		if (this.assignmentForm.valid) {
			this.disabledApiButton = true;
			const param: any = {};
			
			this.smartService.editOnlineSession(this.assignmentForm.value).subscribe((res:any) => {
				if(res.status == 'ok') {
					this.commonAPIService.showSuccessErrorMessage("Date inserted Successfully", 'success');
					this.dialogRef.close();
				} else {
					this.commonAPIService.showSuccessErrorMessage(res.message, 'error')
				}
			})
			
			// this.smartService.assignmentInsert(param).subscribe((result: any) => {
			// 	this.disabledApiButton = false;
			// 	if (result && result.status === 'ok') {
			// 		this.commonAPIService.showSuccessErrorMessage(result.message, 'success');
			// 		this.dialogRef.close({ added: true });
			// 	}
			// });
		} else {
			this.commonAPIService.showSuccessErrorMessage('Please enter all required fields', 'error');
		}
	}
  getteacher() {
		this.smartService.getTeacherByClassSectionAndSubject({class_id: this.assignmentForm.value.class_id, sec_id: this.assignmentForm.value.sec_id, sub_id: this.assignmentForm.value.sub_id }).subscribe((result:any) => {
			if(result && result.status === 'ok') {
				this.teacherArray =result.data
			}
		})
	}
	resetAddAttachment() {
		console.log('resetAddAttachment');

	}
}
