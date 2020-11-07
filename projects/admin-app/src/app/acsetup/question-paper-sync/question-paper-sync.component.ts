import { Component, OnInit, ViewChild, AfterViewInit, TemplateRef, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AcsetupService } from '../service/acsetup.service';
import { AdminService } from '../../admin-user-type/admin/services/admin.service';
import { BreadCrumbService,  NotificationService, UserAccessMenuService, CommonAPIService } from 'projects/axiom/src/app/_services/index';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';

@Component({
	selector: 'app-question-paper-sync',
	templateUrl: './question-paper-sync.component.html',
	styleUrls: ['./question-paper-sync.component.css']
})

export class QuestionPaperSyncComponent implements OnInit, AfterViewInit {
	currentUser:any;
	questionPaperArray:any[] = [];
	schoolArray:any[] = [];
	qSyncForm:FormGroup;
	constructor(
		private fbuild: FormBuilder,
		private adminService:AdminService,
		private acsetupService: AcsetupService,
		private userAccessMenuService: UserAccessMenuService,
		private commonAPIService: CommonAPIService,
		private notif: NotificationService, private breadCrumbService: BreadCrumbService,
	) { }

	ngOnInit() {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.getQuestionPaper();
		this.getSchools();
		this.buildForm();
	}

	buildForm() {
		this.qSyncForm = this.fbuild.group({
			'qp_ids':'',
			'school_prefix_ids':''
		})

	}

	ngAfterViewInit() {
	}

	getQuestionPaper() {
		this.adminService.getQuestionPaper({}).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					console.log('result--', result);
					this.questionPaperArray= result.data;
				}
			});

	}

	getSchools() {
		this.adminService.getSchools({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				console.log(result);
				this.schoolArray = result.data;
			} else {
				this.schoolArray = [];
			}
		});

	}
	syncQuestionPaper() {
		let  inputJson = {
			qp_ids: this.qSyncForm.value.qp_ids,
			school_prefix_ids: this.qSyncForm.value.school_prefix_ids,
			
		};
		console.log('inputJson--',inputJson,this.qSyncForm);
		this.adminService.exportQuestionPaper(inputJson).subscribe((data:any)=> {
			this.notif.showSuccessErrorMessage('Question Paper Sync Succcessfully ', 'success')
		})

	}

}

