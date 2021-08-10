import { Component, AfterViewInit, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { ckconfig } from '../../config/ckeditorconfig';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { DynamicComponent } from '../../sharedmodule/dynamiccomponent';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonAPIService, SisService,SmartService } from '../../_services/index';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatDialogRef, MatDialog } from '@angular/material';
import { PreviewDocumentComponent } from '../../student-master/documents/preview-document/preview-document.component';

export interface Parent {
	select: number;
	parent: string;
	student: string;
	class: string;
	section: string;
	email: string;
}

export interface Student {
	select: number;
	student: string;
	class: string;
	section: string;
	email: string;
}

export interface Teacher {
	select: number;
	teacher: string;
	sub: string;
	email: string;
}

// const ELEMENT_DATA: Parent[] = [
// 	// tslint:disable-next-line:max-line-length
// 	{ select: 1, parent: 'Dhruv Singh Chaudhary', student:
// 'Jeevesh Chaudhary', class: 'III', section: 'A', email: 'jeeveshchaudhary@gmail.com' },
// 	// tslint:disable-next-line:max-line-length
// 	{ select: 2, parent: 'Dhruv Singh Chaudhary', student:
// 'Jeevesh Chaudhary', class: 'III', section: 'A', email: 'jeeveshchaudhary@gmail.com' },
// ];



// const ELEMENT_DATA_TWO: Student[] = [
// 	{ select: 1, student: 'Jeevesh Chaudhary', class: 'III', section: 'A', email: 'jeeveshchaudhary@gmail.com' },
// 	{ select: 2, student: 'Jeevesh Chaudhary', class: 'III', section: 'A', email: 'jeeveshchaudhary@gmail.com' },
// ];

// const ELEMENT_DATA_THREE: Teacher[] = [
// 	{ select: 1, teacher: 'Jeevesh Chaudhary', sub: 'EVS', email: 'jeeveshchaudhary@gmail.com' },
// 	{ select: 2, teacher: 'Jeevesh Chaudhary', sub: 'EVS', email: 'jeeveshchaudhary@gmail.com' },
// ];

@Component({
	selector: 'app-email-notification',
	templateUrl: './email-notification.component.html',
	styleUrls: ['./email-notification.component.scss']
})
export class EmailNotificationComponent implements OnInit, AfterViewInit {
	ckeConfig: any;
	displayedColumns: string[] = ['select', 'user', 'parent', 'class', 'section', 'email'];
	displayedColumnsTwo: string[] = ['select', 'user', 'class', 'section', 'email'];
	displayedColumnsThree: string[] = ['select', 'user', 'sub', 'email'];
	// dataSource = new MatTableDataSource(ELEMENT_DATA);
	// dataSourceTwo = new MatTableDataSource(ELEMENT_DATA_TWO);
	// dataSourceThree = new MatTableDataSource(ELEMENT_DATA_THREE);
	emailTemplateForm: FormGroup;
	emailScheduleForm: FormGroup;
	sendEmailForm: FormGroup;
	templateDataArr: any[] = [];
	classDataArr: any[] = [];
	sectionDataArr: any[] = [];
	userDataArr: any[] = [];
	USER_ELEMENT_DATA: any[] = [];
	userDataSource = new MatTableDataSource<Element>(this.USER_ELEMENT_DATA);
	editFlag = false;
	allUserSelectFlag = false;
	currentReceivers = 'Student';
	initTable = false;
	selectedUserArr: any[] = [];
	multipleFileArray: any[] = [];
	fileCounter = 0;
	currentFileChangeEvent: any;
	currentFile: any;
	attachmentArray: any[] = [];
	showSection = true;
	showScheduleBox = false;
	events: any[] = [];
	currentScheduleId = 0;
	scheduleEmailData: any[] = [];
	editMode = false;
	viewMode = false;
	showSendNow = true;
	not_id = 0;
	@ViewChild(MatSort) sort: MatSort;
	dialogRef2: MatDialogRef<PreviewDocumentComponent>;
	@ViewChild('inputFile') myInputVariable: ElementRef;

	constructor(private fbuild: FormBuilder, public sanitizer: DomSanitizer,
		private notif: CommonAPIService, private sisService: SisService,
		private router: Router,private SmartService:SmartService,
		private route: ActivatedRoute,
		private dialog: MatDialog) { }

	ngOnInit() {
		this.route.queryParams.subscribe(value => {
			if (value.schedule_id) {
				this.editMode = true;
				this.viewMode = false;
				this.getScheduleEmail(value.schedule_id);
			}
			if (value.view_schedule_id) {
				this.viewMode = true;
				this.editMode = false;
				this.getScheduleEmail(value.view_schedule_id);
			}
		});

		this.userDataSource.sort = this.sort;
		this.ckeConfig = ckconfig;
		this.buildForm();
		this.getTemplate();
		this.getClass();
	}

	ngAfterViewInit() {
		this.userDataSource.sort = this.sort;
	}

	buildForm() {
		this.emailTemplateForm = this.fbuild.group({
			tpl_id: '',
			tpl_title: '',
			tpl_subject: '',
			tpl_body: ''
		});
		this.emailScheduleForm = this.fbuild.group({
			recievers: '1',
			class_id: '',
			sec_id: ''
		});
		this.sendEmailForm = this.fbuild.group({
			check_schedule_status: 'sendNow',
			schedule_date: '',
			schedule_time: ''
		});
	}

	getScheduleEmail(schedule_id) {
		this.sisService.getNotificationEmail({ schedule_id }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.scheduleEmailData = result.data;
				this.patchScheduleEmailData(result.data);
			} else {
				this.currentScheduleId = 0;
				this.notif.showSuccessErrorMessage('No Record Found', 'error');
				this.router.navigate(['../../notifications/email-list'], { queryParams: {}, relativeTo: this.route });
			}
		});
	}


	patchScheduleEmailData(result) {
		this.not_id = result[0]['not_ns_id'];
		this.currentScheduleId = result[0]['ns_id'];
		this.emailTemplateForm.patchValue({
			tpl_id: result[0]['ns_template_id'],
			tpl_title: result[0]['tpl_title'],
			tpl_subject: result[0]['ns_title'],
			tpl_body: result[0]['ns_desc']
		});
		this.emailScheduleForm.patchValue({
			recievers: result[0]['not_receivers'] === 'S' ? '1' : (result[0]['not_receivers'] === 'P' ? '2' : '3'),
			class_id: result[0]['not_receiver_class_id']
		});
		this.sendEmailForm.patchValue({
			check_schedule_status: result[0]['ns_schedule_status'] === 'I' ? 'sendNow' : 'Schedule',
			schedule_date: result[0]['ns_schedule_date'],
			schedule_time: result[0]['ns_schedule_time']
		});

		if (this.sendEmailForm.value.check_schedule_status === 'sendNow') {
			this.showSendNow = false;
		} else {
			this.showSendNow = true;
		}

		if (result[0]['not_receiver_contact']) {
			if (result[0]['not_receivers'] === 'S') {
				this.currentReceivers = 'Student';
			} else if (result[0]['not_receivers'] === 'P') {
				this.currentReceivers = 'Parent';
			} else {
				this.currentReceivers = 'Teacher';
			}
		}

		if (result[0]['ns_schedule_date']) {
			this.showScheduleBox = true;
		}

		this.attachmentArray = JSON.parse(result[0]['ns_attachments']);

		if (result[0]['not_receiver_class_id']) {
			this.getSectionByClass({ value: result[0]['not_receiver_class_id'] });
		} else {
			this.generateStudentList('');
		}
	}

	getTemplate() {
		const inputJson = {
			tpl_type: 'E'
		};

		this.sisService.getTemplate(inputJson).subscribe((result: any) => {
			if (result && result.data && result.data[0]) {
				this.templateDataArr = result.data;
			}
		});
	}

	getClass() {
		this.SmartService.getClassData({}).subscribe((result: any) => {
			if (result && result.data && result.data[0]) {
				this.classDataArr = result.data;
			}
		});
	}

	getSectionByClass(event) {
		this.emailScheduleForm.patchValue({ sec_id: '' });
		if (event.value !== 'all') {
			this.showSection = true;
			this.sisService.getSectionsByClass({ class_id: event.value }).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.sectionDataArr = result.data;
					if ((this.editMode || this.viewMode) && this.currentScheduleId > 0) {
						this.emailScheduleForm.patchValue({
							sec_id: this.scheduleEmailData[0]['not_receiver_sec_id']
						});
						this.generateStudentList('');
					}

				} else {
					this.sectionDataArr = [];
					this.generateStudentList('');
				}
			});
		} else {
			this.showSection = false;
			this.generateStudentList('');
		}
	}

	generateStudentList(event) {
		const inputJson = {
			class_id: this.emailScheduleForm.value.class_id === 'all' ? '' : this.emailScheduleForm.value.class_id,
			sec_id: this.emailScheduleForm.value.sec_id === 'all' ? '' : this.emailScheduleForm.value.sec_id
		};

		if (this.currentReceivers === 'Teacher') {
			inputJson['role_id'] = '3';
			this.sisService.getUser(inputJson).subscribe((result: any) => {
				if (result && result.data && result.data[0]['au_login_id']) {
					this.resetGrid();
					this.userDataArr = result.data;
					this.prepareDataSource();
				} else {
					this.resetGrid();
					this.notif.showSuccessErrorMessage(result.data, 'error');
				}
			});
		} else {
			inputJson['pmap_status'] = '1';
			this.sisService.getMasterStudentDetail(inputJson).subscribe((result: any) => {
				if (result && result.data && result.data[0]['au_login_id']) {
					this.resetGrid();
					this.userDataArr = result.data;
					this.prepareDataSource();
				} else {
					this.notif.showSuccessErrorMessage(result.data, 'error');
					this.resetGrid();
				}
			});

		}
	}

	resetGrid() {
		this.USER_ELEMENT_DATA = [];
		this.userDataArr = [];
		this.userDataSource = new MatTableDataSource<Element>(this.USER_ELEMENT_DATA);
	}

	getUser(event) {
		this.initTable = false;
		this.userDataArr = [];
		this.allUserSelectFlag = false;
		this.selectedUserArr = [];
		this.USER_ELEMENT_DATA = [];
		if (event.value === '1') {
			this.currentReceivers = 'Student';
		} else if (event.value === '2') {
			this.currentReceivers = 'Parent';
		} else if (event.value === '3') {
			this.currentReceivers = 'Teacher';
		}
	}

	prepareDataSource() {
		this.initTable = true;
		this.selectedUserArr = [];
		this.userDataSource = new MatTableDataSource<Element>(this.USER_ELEMENT_DATA);
		let counter = 1;
		let receiver_contact_arr = [];
		if (this.editMode && this.currentScheduleId > 0) {
			receiver_contact_arr = this.scheduleEmailData[0]['not_receiver_contact'].split(',');
		}
		for (let i = 0; i < this.userDataArr.length; i++) {
			const tempObj = {
				select: 0,
				user: '',
				email: '',
				sub: '',
				parent: '',
				class: '',
				section: '',
				au_login_id: ''
			};
			tempObj['au_login_id'] = this.userDataArr[i]['au_login_id'];
			tempObj['select'] = counter;
			if (this.currentReceivers === 'Student') {
				tempObj['email'] = this.userDataArr[i]['au_email'];

			}
			if (this.currentReceivers === 'Teacher') {
				tempObj['email'] = this.userDataArr[i]['au_email'];
				tempObj['sub'] = this.userDataArr[i]['cs_relations'];
			}

			if (this.currentReceivers === 'Parent') {
				if (this.userDataArr[i]['active_parent'] === 'G') {
					tempObj['parent'] = this.userDataArr[i]['guardian_name'];
					tempObj['email'] = this.userDataArr[i]['guardian_email'];
				} else if (this.userDataArr[i]['active_parent'] === 'F') {
					tempObj['parent'] = this.userDataArr[i]['father_name'];
					tempObj['email'] = this.userDataArr[i]['father_email'];
				} else if (this.userDataArr[i]['active_parent'] === 'M') {
					tempObj['parent'] = this.userDataArr[i]['mother_name'];
					tempObj['email'] = this.userDataArr[i]['mother_email'];
				}
			}
			tempObj['user'] = this.userDataArr[i]['au_full_name'];
			tempObj['class'] = this.userDataArr[i]['class_name'];
			tempObj['class_id'] = this.userDataArr[i]['class_id'];
			tempObj['section'] = this.userDataArr[i]['sec_name'];
			tempObj['sec_id'] = this.userDataArr[i]['sec_id'];

			if (receiver_contact_arr.indexOf(tempObj['email']) > -1) {
				tempObj['checked'] = true;

				this.selectedUserArr.push({
					login_id: tempObj['au_login_id'],
					class_id: tempObj['class_id'],
					sec_id: tempObj['sec_id'],
					class: tempObj['class'],
					section: tempObj['section'],
					email: tempObj['email'],
					user: tempObj['user'],
					parent: tempObj['parent']
				});

			} else {
				tempObj['checked'] = false;
			}

			this.USER_ELEMENT_DATA.push(tempObj);
			counter++;
		}
		this.userDataSource = new MatTableDataSource(this.USER_ELEMENT_DATA);
		this.userDataSource.sort = this.sort;
	}

	checkAllUserList($event) {
		this.selectedUserArr = [];
		if ($event.checked === true) {
			this.allUserSelectFlag = true;
			for (const item of this.USER_ELEMENT_DATA) {
				this.selectedUserArr.push({
					login_id: item.au_login_id,
					class_id: item.class_id,
					sec_id: item.sec_id,
					class: item.class,
					section: item.section,
					email: item.email,
					user: item.user,
					parent: item.parent
				});
			}
		} else {
			this.allUserSelectFlag = false;
		}
	}

	prepareSelectedRowData($event, item) {
		const findex = this.selectedUserArr.findIndex(f => f.login_id === item.au_login_id);
		if (findex === -1) {
			this.selectedUserArr.push({
				login_id: item.au_login_id,
				class_id: item.class_id,
				sec_id: item.sec_id,
				class: item.class,
				section: item.section,
				email: item.email,
				user: item.user,
				parent: item.parent
			});
		} else {
			this.selectedUserArr.splice(findex, 1);
		}
	}

	editTemplate(event) {
		const templateData = this.templateDataArr.filter((tplObj) => {
			return tplObj.tpl_id.toString() === event.value;
		});

		if (templateData && templateData.length > 0) {
			this.editFlag = true;
			this.emailTemplateForm.patchValue({
				tpl_title: templateData ? templateData[0]['tpl_title'] : '',
				tpl_subject: templateData ? templateData[0]['tpl_subject'] : '',
				tpl_body: templateData ? templateData[0]['tpl_body'] : '',
			});
		} else {
			this.editFlag = false;
		}
	}

	saveTemplate() {
		if (this.emailTemplateForm.valid) {
			const inputJson = {
				'tpl_title': this.emailTemplateForm.value.tpl_title,
				'tpl_subject': this.emailTemplateForm.value.tpl_subject,
				'tpl_body': this.emailTemplateForm.value.tpl_body,
				'tpl_type': 'E'
			};
			this.sisService.saveTemplate(inputJson).subscribe((result: any) => {
				if (result) {
					this.notif.showSuccessErrorMessage('Email Template Saved Successfully', 'success');
					this.getTemplate();
				}
			});
		} else {
			this.notif.showSuccessErrorMessage('Please fill all required fields to save Template', 'error');
		}

	}

	updateTemplate() {
		if (this.emailTemplateForm.valid) {
			const inputJson = {
				'tpl_id': this.emailTemplateForm.value.tpl_id,
				'tpl_title': this.emailTemplateForm.value.tpl_title,
				'tpl_subject': this.emailTemplateForm.value.tpl_subject,
				'tpl_body': this.emailTemplateForm.value.tpl_body,
				'tpl_type': 'E'
			};
			this.sisService.updateTemplate(inputJson).subscribe((result: any) => {
				if (result) {
					this.notif.showSuccessErrorMessage('Email Template Saved Successfully', 'success');
					this.getTemplate();
				}
			});
		} else {
			this.notif.showSuccessErrorMessage('Please fill all required fields to save Template', 'error');
		}
	}

	fileChangeEvent(fileInput) {
		this.multipleFileArray = [];
		this.fileCounter = 0;
		this.currentFileChangeEvent = fileInput;
		const files = fileInput.target.files;
		for (let i = 0; i < files.length; i++) {
			this.IterateFileLoop(files[i]);
		}
	}
	IterateFileLoop(files) {
		const reader = new FileReader();
		reader.onloadend = (e) => {
			this.currentFile = reader.result;
			const fileJson = {
				fileName: files.name,
				imagebase64: this.currentFile
			};
			this.multipleFileArray.push(fileJson);
			this.fileCounter++;
			if (this.fileCounter === this.currentFileChangeEvent.target.files.length) {
				this.sisService.uploadDocuments(this.multipleFileArray).subscribe((result: any) => {
					if (result) {
						for (const item of result.data) {
							const findex2 = this.attachmentArray.findIndex(f => f.imgUrl === item.file_url);
							if (findex2 === -1) {
								this.attachmentArray.push({
									imgUrl: item.file_name,
									imgName: item.file_url
								});
							} else {
								this.attachmentArray.splice(findex2, 1);
							}
						}
					}
				});
			}
		};
		reader.readAsDataURL(files);
	}

	deleteAttachment(index) {
		this.attachmentArray.splice(index, 1);
	}

	generateEmailSchedule() {
		if (this.emailScheduleForm.valid) {
			if (this.emailTemplateForm.value.tpl_subject === '') {
				this.notif.showSuccessErrorMessage('Please Fill Email Subject to send Email', 'error');
			} else {
				this.sendEmailSchedule();
			}
		} else {
			this.notif.showSuccessErrorMessage('Please Fill Required Fields to Schedule Email', 'error');
		}
	}

	sendEmailSchedule() {
		if (this.emailTemplateForm.value.tpl_subject === '') {
			this.notif.showSuccessErrorMessage('Please Fill Email Subject to send Email', 'error');
			if (this.selectedUserArr.length > 0) {
				this.notif.showSuccessErrorMessage('Please Choose Atleast one ' + this.currentReceivers + ' to whom you want to send Email', 'error');
			} else {
				let inputJsonForSchedule = {};
				inputJsonForSchedule = {
					ns_schedule_date: this.sendEmailForm.value.schedule_date,
					ns_schedule_time: this.sendEmailForm.value.schedule_time,
					ns_title: this.emailTemplateForm.value.tpl_subject,
					ns_schedule_status: this.showScheduleBox ? 'S' : 'I',
					ns_template_id: this.emailTemplateForm.value.tpl_id,
					ns_desc: this.emailTemplateForm.value.tpl_body,
					ns_attachments: JSON.stringify(this.attachmentArray),
					ns_type: 'E'
				};
				if (this.editMode && this.currentScheduleId > 0) {
					inputJsonForSchedule['scheduleId'] = this.currentScheduleId;
				}
				this.sisService.insertEmailScheduler(inputJsonForSchedule).subscribe((result: any) => {
					if (result && result.data && result.data) {
						if (result.data['schedule_id'] !== '0') {
							this.currentScheduleId = result.data['schedule_id'];
						}
						this.notif.showSuccessErrorMessage('Email Data Scheduled Successfully', 'success');
						this.generateEmailData();
					}
				});
			}
		}

	}

	generateEmailData() {
		const generateEmailDataArr = [];
		if (this.emailTemplateForm.value.tpl_subject !== '') {
			if (this.selectedUserArr.length > 0) {
				let inputJsonForEmail = {};
				const finalJsonForEmail = {};
				let currentReceiver = '';
				if (this.currentReceivers === 'Student') {
					currentReceiver = 'S';
				} else if (this.currentReceivers === 'Parent') {
					currentReceiver = 'P';
				} else if (this.currentReceivers === 'Teacher') {
					currentReceiver = 'T';
				}

				for (let i = 0; i < this.selectedUserArr.length; i++) {
					inputJsonForEmail = {
						'not_ns_id': this.currentScheduleId,
						'not_receivers': currentReceiver,
						'not_receiver_class_id': this.selectedUserArr[i]['class_id'] ? this.selectedUserArr[i]['class_id'] : 0,
						'not_receiver_sec_id': this.selectedUserArr[i]['sec_id'] ? this.selectedUserArr[i]['sec_id'] : 0,
						'not_sent_status': 'P',
						'not_receiver_email': this.selectedUserArr[i]['email'],
						'not_receiver_login_id': this.selectedUserArr[i]['login_id'],
						'class': this.selectedUserArr[i]['class'],
						'section': this.selectedUserArr[i]['section'],
						'user': this.selectedUserArr[i]['user'],
					};

					generateEmailDataArr.push(inputJsonForEmail);
				}

				if (this.editMode && this.not_id) {
					finalJsonForEmail['not_id'] = this.not_id;
				}
				finalJsonForEmail['email_data'] = generateEmailDataArr;
				this.sisService.insertEmailData(finalJsonForEmail).subscribe((result: any) => {
					if (result) {
						if (!this.showScheduleBox) {
							this.sendEmail(this.currentScheduleId);
						} else {
							this.router.navigate(['../../notifications/email-list'], { queryParams: {}, relativeTo: this.route });
							this.resetForm();
						}
					}
				});

			} else {
				this.notif.showSuccessErrorMessage('Please Choose Atleast one ' + this.currentReceivers + ' to whom you want to send Email', 'error');
			}
		} else {
			this.notif.showSuccessErrorMessage('Please Fill Email Subject to send Email', 'error');
		}
	}

	sendEmail(schedule_id) {
		this.sisService.sendEmail({ schedule_id }).subscribe((result: any) => {
			this.notif.showSuccessErrorMessage('Email has been Sent Successfully', 'success');
			this.resetForm();
			this.router.navigate(['../../notifications/email-list'], { queryParams: {}, relativeTo: this.route });
		});
	}

	cancel() {
		this.router.navigate(['../../notifications/email-list'], { queryParams: {}, relativeTo: this.route });
	}

	applyFilterEmail(filterValue: string) {
		this.userDataSource.filter = filterValue.trim().toLowerCase();
	}

	scheduleDate(type: string, event: MatDatepickerInputEvent<Date>) {
		this.events.push(`${type}: ${event.value}`);
		const datePipe = new DatePipe('en-US');
		const convertedDate = datePipe.transform(this.sendEmailForm.value.schedule_date, 'yyyy-MM-dd');
		this.sendEmailForm.patchValue({
			'schedule_date': convertedDate
		});
	}

	resetForm() {
		this.emailTemplateForm.reset();
		this.emailScheduleForm.reset();
		this.sendEmailForm.reset();
		this.attachmentArray = [];
		this.USER_ELEMENT_DATA = [];
		this.userDataSource = new MatTableDataSource<Element>(this.USER_ELEMENT_DATA);
		this.initTable = false;
		this.sendEmailForm.value.check_schedule_status = 'sendNow';
		this.showScheduleBox = false;
	}

	backToEmailList() {
		this.router.navigate(['../../notifications/email-list'], { queryParams: {}, relativeTo: this.route });
	}

	isExistUserAccessMenu(mod_id) {
		return this.notif.isExistUserAccessMenu(mod_id);
	}

	previewImage(imgArray, index) {
		this.dialogRef2 = this.dialog.open(PreviewDocumentComponent, {
			data: {
				imageArray: imgArray,
				index: index
			},
			height: '70vh',
			width: '70vh'
		});
	}

	checkThumbnail(url: any) {
		if (url.match(/jpg/) || url.match(/png/) || url.match(/bmp/) ||
			url.match(/gif/) || url.match(/jpeg/) ||
			url.match(/JPG/) || url.match(/PNG/) || url.match(/BMP/) ||
			url.match(/GIF/) || url.match(/JPEG/)) {
			return true;
		} else {
			return false;
		}
	}
}
