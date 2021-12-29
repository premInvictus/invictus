import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { QbankService } from './../../../app/questionbank/service/qbank.service';
import { QelementService } from './../../../app/questionbank/service/qelement.service';
import { environment } from 'src/environments/environment';
import { BreadCrumbService, NotificationService, CommonAPIService } from '../../_services/index';
import { saveAs } from 'file-saver';

@Component({
	selector: 'app-system-info-upload',
	templateUrl: './system-info-upload.component.html',
	styleUrls: ['./system-info-upload.component.css']
})
export class SystemInfoUploadComponent implements OnInit {

	bulkuploadform: FormGroup;
	SelectForm: FormGroup;
	boardArray: any[];
	classArray: any[];
	subjectArray: any[];
	topicArray: any[];
	subtopicArray: any[];
	questionTypeArray: any[];
	questionSubtypeArray: any[];
	skillTypeArray: any[];
	schoolinfoArray: any = {};
	lodArray: any[];
	generateDiv = false; 
	homeUrl: string;

	constructor(
		private common : CommonAPIService,
		private fbuild: FormBuilder,
		private qelementService: QelementService,
		private notif: NotificationService,
		private breadCrumbService: BreadCrumbService
	) { }

	ngOnInit() {
		this.homeUrl = this.breadCrumbService.getUrl();
		this.buildForm();
		this.getBoard();
		this.getClass();
		this.getQuestionTypeData();
		this.getSkillData();
		this.getLodData();
		this.getSchool();
	}

	buildForm(): void {
		this.bulkuploadform = this.fbuild.group({
			board_id: '',
			class_id: '',
			sub_id: '',
			topic_id: ''
		});
		this.SelectForm = this.fbuild.group({
			selectfield: ''
		});
	}
	getBoard(): void {
		this.qelementService.getBoard().subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.boardArray = result.data;
				}
			}
		);
	}

	getSchool() {
		this.qelementService.getSchool().subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.schoolinfoArray = result.data[0];
					this.generateDiv = true;
				}
			}
		);

	}

	getClass() {
		this.qelementService.getClass().subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.classArray = result.data;
				}
			}
		);
	}

	getSubjectsByClass(): void {
		this.qelementService.getSubjectsByClass(this.bulkuploadform.value.class_id).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.subjectArray = result.data;
				} else {
					this.subjectArray = [];
				}
			}
		);
	}

	getTopicByClassSubject(): void {
		this.qelementService.getTopicByClassSubject(this.bulkuploadform.value.class_id, this.bulkuploadform.value.sub_id).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.topicArray = result.data;
				}
			}
		);
	}

	getSubtopicByTopic(): void {
		this.qelementService.getSubtopicByTopic(this.bulkuploadform.value.topic_id).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.subtopicArray = result.data;
				}
			}
		);
	}

	getQuestionTypeData(): void {
		this.qelementService.getQuestionTypeData().subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.questionTypeArray = result.data;
				}
			}
		);
	}

	getQuestionSubtypeDataByQuestiontype(): void {
		this.qelementService.getQuestionSubtypeDataByQuestiontype(this.bulkuploadform.value.qus_qt_id).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.questionSubtypeArray = result.data;
				}
			}
		);
	}

	getSkillData(): void {
		this.qelementService.getSkillData().subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.skillTypeArray = result.data;
				}
			}
		);
	}

	getLodData(): void {
		this.qelementService.getLodData().subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.lodArray = result.data;
				}
			}
		);
	}
	fileChange(event) {
		if (Number(this.SelectForm.value.selectfield) === 2) {
			this.qelementService.uploadExcelFileSection(event.target.files).subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.notif.showSuccessErrorMessage('File uploaded successfully', 'success');
					} else {
						this.notif.showSuccessErrorMessage('Error uploading the file', 'error');
					}
				}
			);
		} else if (Number(this.SelectForm.value.selectfield) === 3) {
			this.qelementService.uploadExcelFileSubject(event.target.files).subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.notif.showSuccessErrorMessage('File uploaded successfully', 'success');
					} else {
						this.notif.showSuccessErrorMessage('Error uploading the file', 'error');
					}
				}
			);
		} else if (Number(this.SelectForm.value.selectfield) === 4) {
			this.qelementService.uploadExcelFileClass(event.target.files).subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.notif.showSuccessErrorMessage('File uploaded successfully', 'success');
					} else {
						this.notif.showSuccessErrorMessage('Error uploading the file', 'error');
					}
				}
			);
		} else if (Number(this.SelectForm.value.selectfield) === 5) {
			this.qelementService.uploadExcelFileTopic(event.target.files).subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.notif.showSuccessErrorMessage('File uploaded successfully', 'success');
					} else {
						this.notif.showSuccessErrorMessage('Error uploading the file', 'error');
					}
				}
			);
		} else if (Number(this.SelectForm.value.selectfield) === 6) {
			this.qelementService.uploadExcelFileSubtopic(event.target.files).subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.notif.showSuccessErrorMessage('File uploaded successfully', 'success');
					} else {
						this.notif.showSuccessErrorMessage('Error uploading the file', 'error');
					}
				}
			);
		} else if (Number(this.SelectForm.value.selectfield) === 11) {
			this.qelementService.userUpload(event.target.files, 4).subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.notif.showSuccessErrorMessage('File uploaded successfully', 'success');
					} else {
						this.notif.showSuccessErrorMessage('Error uploading the file', 'error');
					}
				}
			);
		} else if (Number(this.SelectForm.value.selectfield) === 12) {
			this.qelementService.teacherMappingUpload(event.target.files,3).subscribe(
				(result: any) => {					
					if (result && result.status === 'ok') {
						this.notif.showSuccessErrorMessage('File uploaded successfully', 'success');
					} else {
						this.notif.showSuccessErrorMessage('Error uploading the file', 'error');
					}
				}
			);
		} else {
			this.notif.showSuccessErrorMessage('Please Select', 'error');
		}
	}

	generateExcel() {
		if (Number(this.SelectForm.value.selectfield) === 1) {
			// no api
		} else if (Number(this.SelectForm.value.selectfield) === 2) {

			this.qelementService.generateExcelFileSection(this.bulkuploadform.value).subscribe(
				(result: any) => {

					if (result && result.status === 'ok') {
						const length = result.data.split('/').length;
						saveAs(result.data, result.data.split('/')[length - 1]);
					}
				}
			);
		} else if (Number(this.SelectForm.value.selectfield) === 3) {

			this.qelementService.generateExcelFileSubject(this.bulkuploadform.value).subscribe(
				(result: any) => {

					if (result && result.status === 'ok') {
						const length = result.data.split('/').length;
						saveAs(result.data, result.data.split('/')[length - 1]);
					}
				}
			);
		} else if (Number(this.SelectForm.value.selectfield) === 4) {

			this.qelementService.generateExcelFileClass(this.bulkuploadform.value).subscribe(
				(result: any) => {

					if (result && result.status === 'ok') {
						const length = result.data.split('/').length;
						saveAs(result.data, result.data.split('/')[length - 1]);
					}
				}
			);
		} else if (Number(this.SelectForm.value.selectfield) === 5) {

			this.qelementService.generateExcelFileTopic(this.bulkuploadform.value).subscribe(
				(result: any) => {

					if (result && result.status === 'ok') {
						const length = result.data.split('/').length;
						saveAs(result.data, result.data.split('/')[length - 1]);
					}
				}
			);
		} else if (Number(this.SelectForm.value.selectfield) === 6) {

			this.qelementService.generateExcelFileSubtopic(this.bulkuploadform.value).subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						const length = result.data.split('/').length;
						saveAs(result.data, result.data.split('/')[length - 1]);
					}
				}
			);
		} else if (Number(this.SelectForm.value.selectfield) === 7) {
			// no api
		} else if (Number(this.SelectForm.value.selectfield) === 8) {
			// no api
		} else if (Number(this.SelectForm.value.selectfield) === 9) {
			// no api
		} else if (Number(this.SelectForm.value.selectfield) === 10) {
			// no api
		} else if (Number(this.SelectForm.value.selectfield) === 11) {
			this.qelementService.userGenerateExcel({role_id: 4}).subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						const length = result.data.split('/').length;
						saveAs(result.data, result.data.split('/')[length - 1]);
					}
				}
			);
		} else if (Number(this.SelectForm.value.selectfield) === 12) {
			this.common.downloadTeacherExcel({role_id: 3}).subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						const length = result.data.split('/').length;
						saveAs(result.data, result.data.split('/')[length - 1]);
					}
				}
			);
		}

	}
 }
