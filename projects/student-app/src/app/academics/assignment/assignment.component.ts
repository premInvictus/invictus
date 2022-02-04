import { Component, OnInit } from '@angular/core';
import { QelementService } from 'projects/axiom/src/app/questionbank/service/qelement.service';
import { ErpCommonService, CommonAPIService } from 'src/app/_services/index';
import { SmartService } from 'projects/smart/src/app/_services/index';

import { FormGroup, FormBuilder } from '@angular/forms';
import { PreviewDocumentComponent } from '../../shared-module/preview-document/preview-document.component';
import { MatDialog } from '@angular/material/dialog';
import { AssignmentAttachmentDialogComponent } from '../../shared-module/assignment-attachment-dialog/assignment-attachment-dialog.component';



@Component({
	selector: 'app-assignment',
	templateUrl: './assignment.component.html',
	styleUrls: ['./assignment.component.css']
})
export class AssignmentComponent implements OnInit {

	isLinear = true;
	firstFormGroup = null;
	secondFormGroup = null;

	currentUser: any;
	userDetail: any;

	paramForm: FormGroup;
	todaysDate = new Date();
	sub_id;
	assignmentArray: any[] = [];
	currentAssignment: any;
	currentAssignmentIndex: number;
	assignmentPre = true;
	assignmentNext = true;
	testView = 'today';
	toMin = new Date();
	assignmentFlag = false;
	constructor(
		private qelementService: QelementService,
		private erpCommonService: ErpCommonService,
		private commonAPIService: CommonAPIService,
		public dialog: MatDialog,
		private fb: FormBuilder,
		private smartService: SmartService

	) { }

	ngOnInit() {
		this.buildForm();
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.qelementService.getUser({ login_id: this.currentUser.login_id, role_id: '4' }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.userDetail = result.data[0];
					console.log('userDetail', this.userDetail);
					this.getAssignment();
				}
			});
	}
	buildForm() {
		const today = new Date();
		const yesterday = new Date(today);
		yesterday.setDate(today.getDate() - 1);
		this.paramForm = this.fb.group({
			from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
			to: yesterday
		});
	}
	switchView(testView) {
		this.testView = testView;
		this.getAssignment();
	}
	setMinDate() {
		this.toMin = this.paramForm.value.from;
	}
	previewDocuments(attachmentArray, allowDownload) {
		const attArr: any[] = [];
		if (attachmentArray && attachmentArray.length > 0) {
			attachmentArray.forEach(element => {
				attArr.push({
					file_url: element.atmt_url
				});
			});
			const dialogRef = this.dialog.open(PreviewDocumentComponent, {
				height: '80%',
				width: '1000px',
				data: {
					index: '',
					images: attArr,
					allowDownload: allowDownload
				}
			});
		}
	}
	getAssignmentForDate(datestr, cwarray) {
		const tempcw: any[] = [];
		if (cwarray.length > 0) {
			cwarray.forEach(item => {
				if (this.commonAPIService.dateConvertion(item.as_entry_date) === datestr) {
					tempcw.push(item);
				}
			});
		}
		return tempcw;
	}
	async getAssignment() {
		this.assignmentFlag = false;
		this.assignmentArray = [];
		const param: any = {};
		param.class_id = this.userDetail.au_class_id;
		param.sec_id = this.userDetail.au_sec_id;
		param.as_status = ['1'];
		param.withDate = '1';
		if (this.testView === 'today') {
			param.from = this.commonAPIService.dateConvertion(this.todaysDate);
			param.to = this.commonAPIService.dateConvertion(this.todaysDate);
		} else if (this.testView === 'past') {
			param.from = this.commonAPIService.dateConvertion(this.paramForm.value.from);
			param.to = this.commonAPIService.dateConvertion(this.paramForm.value.to);
		}
		// param.sub_id = this.sub_id;
		this.erpCommonService.getAssignment(param).subscribe(async (result: any) => {
			if (result && result.status === 'ok') {
				let assignmentSubmit_arr = [];
				let tempcw: any[] = [];
				this.assignmentArray = [];
				tempcw = result.data;
				let asid_arr = [];
				let param1: any = {};
				param1.as_id = asid_arr;
				param1.sas_login_id = this.currentUser.login_id;
				await this.erpCommonService.getAssignmentSubmit(param1).toPromise().then((result1: any) => {
					if (result1 && result1.status === 'ok') {
						assignmentSubmit_arr = result1.data;
						console.log('assignmentSubmit_arr', assignmentSubmit_arr);

					}
				});
				if (tempcw.length > 0) {
					console.log('assignmentSubmit_arr1', assignmentSubmit_arr);
					tempcw.forEach(element => {
						const findex = assignmentSubmit_arr.findIndex(e => e.as_id == element.as_id);
						if (findex != -1) {
							element['sas_attachment'] = assignmentSubmit_arr[findex].as_attachment;
							element['sas_remarks'] = assignmentSubmit_arr[findex].sas_remarks;
							element['sas_action_status'] = assignmentSubmit_arr[findex].sas_action_status;
						} else {
							element['sas_attachment'] = [];
						}
					});
				}
				const dateSet = new Set();
				if (tempcw.length > 0) {
					tempcw.forEach(element => {
						dateSet.add(this.commonAPIService.dateConvertion(element.as_entry_date));
						asid_arr.push(element.as_id);
					});
				}

				console.log(dateSet);
				dateSet.forEach(item => {
					this.assignmentArray.push({
						as_entry_date: item,
						as_array: this.getAssignmentForDate(item, tempcw)
					});
				});
				console.log(this.assignmentArray);
				this.assignmentFlag = true;
			}
		});
	}
	update(currentAttachment) {
		const dialogRef = this.dialog.open(AssignmentAttachmentDialogComponent, {
			width: '950px',
			height: '500px',
			data: {
				page: 'assignment',
				title: 'Edit Assignment',
				edit: false,
				attachments: currentAttachment.as_attachment ? currentAttachment.as_attachment : [],
				class_id: currentAttachment.class_id,
				sec_id: currentAttachment.sec_id,
				sub_id: currentAttachment.sub_id,
				topic_id: currentAttachment.topic_id,
				assignment_desc: currentAttachment.as_assignment_desc
			}
		});
		dialogRef.afterClosed().subscribe(dresult => {
			console.log('clossing dialog');
			console.log(dresult);
			if (dresult && dresult.assignment_desc) {
				const param: any = {};
				param.as_id = currentAttachment.as_id;
				param.as_assignment_desc = dresult.assignment_desc;
				param.as_attachment = dresult.attachments;
				this.smartService.assignmentUpdate(param).subscribe((result: any) => {
					if (result && result.status === 'ok') {
						this.commonAPIService.showSuccessErrorMessage(result.message, 'success');
						this.getAssignment();
					} else {
						this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
					}
				});
			}
		});
	}
	submit(item) {
		console.log('item', item);
		const dialogRef = this.dialog.open(AssignmentAttachmentDialogComponent, {
			width: '950px',
			height: '500px',
			data: {
				page: 'assignment submit',
				title: 'Assignment Submit',
				edit: false,
				attachments: [],
				as_id: item.as_id,
				login_id: this.currentUser.login_id,
				assignment_desc: ''
			}
		});
		dialogRef.afterClosed().subscribe(dresult => {
			console.log('clossing dialog');
			console.log(dresult);
			if (dresult && dresult.added) {
				console.log(dresult);
				this.getAssignment();
			}
		});
	}



}
