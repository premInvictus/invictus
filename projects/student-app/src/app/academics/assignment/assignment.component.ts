import { Component, OnInit } from '@angular/core';
import { QelementService } from 'projects/axiom/src/app/questionbank/service/qelement.service';
import { ErpCommonService, CommonAPIService } from 'src/app/_services/index';
import { FormGroup, FormBuilder } from '@angular/forms';
import { PreviewDocumentComponent } from '../../shared-module/preview-document/preview-document.component';
import { MatDialog } from '@angular/material/dialog';


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
		private fb: FormBuilder

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
	previewDocuments(attachmentArray) {
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
					images: attArr
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
	getAssignment() {
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
		this.erpCommonService.getAssignment(param).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				let tempcw: any[] = [];
				this.assignmentArray = [];
				tempcw = result.data;
				const dateSet = new Set();
				if (tempcw.length > 0) {
					tempcw.forEach(element => {
						dateSet.add(this.commonAPIService.dateConvertion(element.as_entry_date));
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



}
