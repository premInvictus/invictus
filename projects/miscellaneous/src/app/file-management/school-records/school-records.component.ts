import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SisService, CommonAPIService } from '../../_services/index';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatTableDataSource, MatPaginator, PageEvent, MatSort, MatPaginatorIntl, MatDialogRef } from '@angular/material';
import { MatDialog } from '@angular/material';
import { CreateFolderComponent } from '../../misc-shared/create-folder/create-folder.component';
import { type } from 'os';
@Component({
	selector: 'app-school-records',
	templateUrl: './school-records.component.html',
	styleUrls: ['./school-records.component.scss']
})
export class SchoolRecordsComponent implements OnInit {

	fileArray: any[] = [];
	currentIndex = 0;
	parent_id = 0;
	searchForm: FormGroup;
	currentUser: any = {};
	dialogRef: MatDialogRef<CreateFolderComponent>;
	constructor(
		private dialog: MatDialog,
		private fbuild: FormBuilder,
		private route: ActivatedRoute,
		private commonAPIService: CommonAPIService,
		private sisService: SisService
	) {
	}

	ngOnInit() {
		this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
		this.buildForm();
		this.getRecordsBasedOnSchool();
	}
	buildForm() {
		this.searchForm = this.fbuild.group({
			'search': ''
		});
	}

	getRecordsBasedOnSchool() {
		this.commonAPIService.getFolderPerLevel({
			findAll: false,
			parent_id: this.parent_id,
		}).subscribe((res: any) => {
			if (res && res.status === 'ok') {
				this.fileArray = [];
				this.fileArray = res.data;
				console.log(this.fileArray);
			}
		});
	}
	openFolderCreate() {
		this.dialogRef = this.dialog.open(CreateFolderComponent,
			{
				height: '220px'
			});
		this.dialogRef.afterClosed().subscribe((res: any) => {
			if (res && res.fileName) {
				const findex = this.fileArray.findIndex(f => Number(f.parent_id) === this.parent_id && f.name.toLowerCase() ===
					res.fileName.toLowerCase());
				if (findex === -1) {
					this.commonAPIService.insertFileType({
						"file_type_id": "",
						"type": "school",
						"url": "",
						"size": "",
						"name": res.fileName,
						"parent_id": this.parent_id,
						"element_type": "folder",
						"userDetails": {
							"full_name": this.currentUser.full_name,
							"login_id": this.currentUser.login_id,
							"role_id": this.currentUser.role_id
						},
						"entryDate": "",
						"updatedDate": ""
					}).subscribe((res: any) => {
						if (res && res.status === 'ok') {
							this.commonAPIService.showSuccessErrorMessage('Inserted Successfully', 'success');
							this.getRecordsBasedOnSchool();
						}
					});
				} else {
					this.commonAPIService.showSuccessErrorMessage('Duplicate folder cant be created', 'error');
				}
			}
		});
	}


}

