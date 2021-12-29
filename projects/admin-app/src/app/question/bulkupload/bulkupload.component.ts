import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { QbankService } from '../../questionbank/service/qbank.service';
import { QelementService } from '../../questionbank/service/qelement.service';
import {AdminService} from 'projects/axiom/src/app/user-type/admin/services/admin.service';
import { ActivatedRoute } from '@angular/router';
import { BreadCrumbService, NotificationService, CommonAPIService } from 'projects/axiom/src/app/_services/index';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-bulkupload',
	templateUrl: './bulkupload.component.html',
	styleUrls: ['./bulkupload.component.css']
})
export class BulkuploadComponent implements OnInit {

	bulkuploadform: FormGroup;
	boardArray: any[];
	classArray: any[];
	subjectArray: any[];
	topicArray: any[];
	subtopicArray: any[];
	questionTypeArray: any[];
	questionSubtypeArray: any[];
	skillTypeArray: any[];
	schoolinfoArray: any = {};
	schoolArray: any[];
	lodArray: any[];
	generateDiv = false;
	public role_id: any;
	homeUrl: string;
	currentUser: any;

	constructor(
		private fbuild: FormBuilder,
		private qbankService: QbankService,
		private qelementService: QelementService,
		private adminService: AdminService,
		private notif: NotificationService,
		private route: ActivatedRoute,
		private breadCrumbService: BreadCrumbService,
		private commonAPIService: CommonAPIService
	) { }

	ngOnInit() {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.homeUrl = this.breadCrumbService.getUrl();
		this.buildForm();
		this.getBoard();
		this.getClass();
		this.getSkillData();
		// this.getLodData();
		this.getSchool();
	}

	buildForm(): void {
		this.bulkuploadform = this.fbuild.group({
			qus_board_id: '',
			qus_class_id: '',
			qus_sub_id: '',
			qus_topic_id: '',
			qus_st_id: '',
			qus_qt_id: '',
			qus_qst_id: '',
			qus_skill_id: '',
			qus_dl_id: '1'
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
					this.getQuestionTypeData();
				} else {
					this.classArray = [];
					this.notif.showSuccessErrorMessage('No Record Found', 'error');
				}
			}
		);
	}

	getSubjectsByClass(): void {
		if (this.currentUser.role_id === '1') {
			// tslint:disable-next-line:max-line-length
			this.adminService.getUserAccessSubject({login_id: this.currentUser.login_id, class_id: this.bulkuploadform.value.qus_class_id}).subscribe((result: any) => {
					if (result && result.status === 'ok') {
						this.subjectArray = result.data;
					} else {
						this.subjectArray = [];
						this.notif.showSuccessErrorMessage('No Record Found', 'error');
					}
				});
	} else {
		this.qelementService.getSubjectsByClass(this.bulkuploadform.value.qus_class_id).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.subjectArray = result.data;
				} else {
					this.subjectArray = [];
					this.notif.showSuccessErrorMessage('No Record Found', 'error');
				}
			}
		);
		}
		this.bulkuploadform.patchValue({qus_topic_id: '', qus_st_id: '', qus_sub_id: '',
				qus_qt_id: '', qus_qst_id: '', qus_skill_id: '', qus_dl_id: '1'});
	}

	getTopicByClassSubject(): void {
		if (this.currentUser.role_id === '1') {
			// tslint:disable-next-line:max-line-length
			this.adminService.getUserAccessTopic({login_id: this.currentUser.login_id, class_id: this.bulkuploadform.value.qus_class_id, sub_id: this.bulkuploadform.value.qus_sub_id}).subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.topicArray = result.data;
				} else {
					this.topicArray = [];
				}
			});
		} else {
		this.qelementService.getTopicByClassSubject(this.bulkuploadform.value.qus_class_id, this.bulkuploadform.value.qus_sub_id).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.topicArray = result.data;
				} else {
					this.topicArray = [];
					this.notif.showSuccessErrorMessage('No Record Found', 'error');
				}
			}
		);
		}
		this.bulkuploadform.patchValue({qus_topic_id: '', qus_st_id: '', qus_qt_id: '', qus_qst_id: '', qus_skill_id: '', qus_dl_id: '1'});
	}

	getSubtopicByTopic(): void {
		this.qelementService.getSubtopicByTopic(this.bulkuploadform.value.qus_topic_id).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.subtopicArray = result.data;
				} else {
					this.subtopicArray = [];
					this.notif.showSuccessErrorMessage('No Record Found', 'error');
				}
				this.bulkuploadform.patchValue({qus_qt_id: '', qus_qst_id: '', qus_skill_id: '', qus_dl_id: '1'});
			}
		);
	}

	getQuestionTypeData(): void {
		this.commonAPIService.getQtype().subscribe(
			(result: any) => {
				if (result) {
					this.questionTypeArray = result;
				} else {
					this.questionTypeArray = [];
					this.notif.showSuccessErrorMessage('No Record Found', 'error');
				}
			}
		);
	}

	getQuestionSubtypeDataByQuestiontype(): void {
		this.commonAPIService.getQsubtype(this.bulkuploadform.value.qus_qt_id).subscribe(
			(result: any) => {
				if (result) {
					this.questionSubtypeArray = result;
				} else {
					this.questionSubtypeArray = [];
					this.notif.showSuccessErrorMessage('No Record Found', 'error');
				}
				this.bulkuploadform.patchValue({qus_qst_id: '', qus_skill_id: '', qus_dl_id: '1'});
			}
		);
	}

	getSkillData(): void {
		this.qelementService.getSkillData().subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.skillTypeArray = result.data;
				} else {
					this.skillTypeArray = [];
					this.notif.showSuccessErrorMessage('No Record Found', 'error');
				}
			}
		);
	}

	getLodData(): void {
		this.qelementService.getLodData().subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.lodArray = result.data;
				} else {
					this.skillTypeArray = [];
					this.notif.showSuccessErrorMessage('No Record Found', 'error');
				}
			}
		);
	}

	transferDataSuccess($event) {
		// loading the FileList from the data transfer
		const dataTransfer: DataTransfer = $event.mouseEvent.dataTransfer;
		if (dataTransfer && dataTransfer.files) {
			const files: FileList = dataTransfer.files;
			// uploading the files one by one asynchrounusly
			for (let i = 0; i < files.length; i++) {
				const file: File = files[i];
				// collecting the data to post
				const data = new FormData();
				data.append('file', file);
				data.append('uploadFile', file.name);
				data.append('fileType', file.type);
				// data.append('fileLastMod', file.lastModifiedDate);
			}
		}
	}

	fileChange(event) {
		this.qbankService.uploadExcelFile(event.target.files).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.notif.showSuccessErrorMessage('File uploaded successfully', 'success');
				}
			}
		);
	}

	generateExcel() {
		if (!this.bulkuploadform.value.qus_board_id) {
			this.notif.showSuccessErrorMessage('Board is required', 'error');
		}
		if (!this.bulkuploadform.value.qus_class_id) {
			this.notif.showSuccessErrorMessage('Class is required', 'error');
		}
		if (!this.bulkuploadform.value.qus_sub_id) {
			this.notif.showSuccessErrorMessage('Subject is required', 'error');
		}
		if (!this.bulkuploadform.value.qus_qt_id) {
			this.notif.showSuccessErrorMessage('Question type is required', 'error');
		}
		if (!this.bulkuploadform.value.qus_qst_id) {
			this.notif.showSuccessErrorMessage('Question sub-type is required', 'error');
		}
		if (this.bulkuploadform.valid) {
			this.qelementService.generateExcelFile(this.bulkuploadform.value).subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						let url: string = result.data;
						url = environment.apiAxiomUrl + url;
						window.location.href = url;
					}
				}
			);
		}
	}
}
