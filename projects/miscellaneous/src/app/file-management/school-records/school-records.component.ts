import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SisService, CommonAPIService } from '../../_services/index';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatTableDataSource, MatPaginator, PageEvent, MatSort, MatPaginatorIntl, MatDialogRef } from '@angular/material';
import { MatDialog } from '@angular/material';
import { CreateFolderComponent } from '../../misc-shared/create-folder/create-folder.component';
import { type } from 'os';
import { UploadFileModalComponent } from '../../misc-shared/upload-file-modal/upload-file-modal.component';
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
	breadcrumArr: any[] = [{ name: 'Home', parent_id: '' }];
	currentUser: any = {};
	dialogRef: MatDialogRef<CreateFolderComponent>;
	dialogRef2: MatDialogRef<UploadFileModalComponent>;
	constructor(
		private dialog: MatDialog,
		private fbuild: FormBuilder,
		private route: ActivatedRoute,
		private commonAPIService: CommonAPIService,
		private sisService: SisService
	) {
	}

	ngOnInit() {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
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
						'file_type_id': '',
						'type': 'school',
						'url': '',
						'size': '',
						'name': res.fileName,
						'parent_id': this.parent_id,
						'element_type': 'folder',
						'userDetails': {
							'full_name': this.currentUser.full_name,
							'login_id': this.currentUser.login_id,
							'role_id': this.currentUser.role_id
						},
						'entryDate': '',
						'updatedDate': ''
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
	openUploadModal() {
		this.dialogRef2 = this.dialog.open(UploadFileModalComponent,
			{
				height: 'auto',
				width: '70%'
			});
	}
	setParentId(id, name) {
		this.parent_id = id;
		const findex = this.breadcrumArr.findIndex(f => f.name.toLowerCase() === name.toLowerCase && f.parent_id === id);
		if (findex === -1) {
			this.breadcrumArr.push({
				'name': name,
				'parent_id': id
			});
		}
		this.getRecordsBasedOnSchool();
	}
	setParentId2(id) {
		let index = 0;
		if (id === '') {
			this.parent_id = 0;
			this.breadcrumArr = [
				{ name: 'Home', parent_id: '' }
			];
			this.getRecordsBasedOnSchool();
		} else {
			this.parent_id = id;
			for (const item of this.breadcrumArr) {
				if (index > 0) {
					if (item.parent_id !== this.parent_id) {
						this.breadcrumArr.splice(index, 1);
					}
				}
				index++;
			}
			this.getRecordsBasedOnSchool();
		}
	}
}

