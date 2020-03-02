import { Component, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SisService, CommonAPIService } from '../../_services/index';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatTableDataSource, MatPaginator, PageEvent, MatSort, MatPaginatorIntl, MatDialogRef } from '@angular/material';
import { MatDialog } from '@angular/material';
import { CreateFolderComponent } from '../../misc-shared/create-folder/create-folder.component';
import { type } from 'os';
import { UploadFileModalComponent } from '../../misc-shared/upload-file-modal/upload-file-modal.component';
import { PreviewDocumentComponent } from '../../misc-shared/preview-document/preview-document.component';
import { MatPaginatorI18n } from '../../misc-shared/customPaginatorClass';
import { saveAs } from 'file-saver';
@Component({
	selector: 'app-school-records',
	templateUrl: './school-records.component.html',
	styleUrls: ['./school-records.component.scss'],
	providers: [
		{ provide: MatPaginatorIntl, useClass: MatPaginatorI18n }
	]
})
export class SchoolRecordsComponent implements OnInit, AfterViewInit {

	fileArray: any[] = [];
	totalRecords: number;
	currentIndex = 0;
	bookpagesize = 100;
	@ViewChild('deleteModal') deleteModal;
	parent_id = 0;
	pageEvent: PageEvent;
	@ViewChild('paginator') paginator: MatPaginator;
	delMsg = 'delmsg';
	datasource = new MatTableDataSource<any>(this.fileArray);
	bookpageindex = 0;
	bookpagesizeoptions = [100, 300, 500, 1000];
	searchForm: FormGroup;
	breadcrumArr: any[] = [{ name: 'Home', parent_id: '' }];
	currentUser: any = {};
	dialogRef: MatDialogRef<CreateFolderComponent>;
	dialogRef2: MatDialogRef<UploadFileModalComponent>;
	dialogRef3: MatDialogRef<PreviewDocumentComponent>;
	constructor(
		private dialog: MatDialog,
		private fbuild: FormBuilder,
		private route: ActivatedRoute,
		private commonAPIService: CommonAPIService,
		private sisService: SisService
	) {
	}
	fetchData(event?: PageEvent) {
		this.bookpageindex = event.pageIndex;
		this.bookpagesize = event.pageSize;
		this.getRecordsBasedOnSchool();
		return event;
	}

	ngOnInit() {
		localStorage.removeItem('invoiceBulkRecords');
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.buildForm();
		this.getRecordsBasedOnSchool();
	}
	ngAfterViewInit() {
		this.datasource.paginator = this.paginator;
	}
	buildForm() {
		this.searchForm = this.fbuild.group({
			'search': ''
		});
	}

	getRecordsBasedOnSchool() {
		this.fileArray = [];
		this.datasource = new MatTableDataSource<any>(this.fileArray);
		this.commonAPIService.getFolderPerLevel({
			findAll: false,
			type: 'school',
			parent_id: this.parent_id,
			pageIndex: this.bookpageindex,
			pageSize: this.bookpagesize,
		}).subscribe((res: any) => {
			if (res && res.status === 'ok') {
				this.fileArray = [];
				this.totalRecords = Number(res.data.totalRecords);
				localStorage.setItem('invoiceBulkRecords', JSON.stringify({ records: this.totalRecords }));
				this.fileArray = res.data.records;
				console.log(this.fileArray);
				this.datasource = new MatTableDataSource<any>(this.fileArray);
				this.datasource.paginator.length = this.paginator.length = this.totalRecords;
				this.datasource.paginator = this.paginator;
			}
		});
	}
	openDeleteModal(item) {
		this.deleteModal.openModal(item);
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
				width: '70%',
				hasBackdrop: false
			});
		this.dialogRef2.afterClosed().subscribe((res: any) => {
			if (res.files && res.files.length > 0) {
				const files: any[] = res.files;
				const json: any[] = [];
				let path: any = '';
				let ind = 0;
				for (const item of this.breadcrumArr) {
					if (item.parent_id === '') {
						item.name = '';
					}
					path = path + item.name + '/';
					if (ind === 0) {
						item.name = 'Home';
					}
					ind++;
				}
				path = path.substring(0, path.length - 1);
				for (const item of files) {
					json.push({
						'file_type_id': '',
						'type': 'school',
						'url': item.ed_link,
						'size': item.size,
						'name': item.ed_name,
						'parent_id': this.parent_id,
						'element_type': 'file',
						'userDetails': {
							'full_name': this.currentUser.full_name,
							'login_id': this.currentUser.login_id,
							'role_id': this.currentUser.role_id
						},
						'entryDate': '',
						'updatedDate': ''
					});
				}
				this.commonAPIService.insertMultipleFiles(json).subscribe((res: any) => {
					if (res && res.status === 'ok') {
						this.commonAPIService.showSuccessErrorMessage('Inserted Successfully', 'success');
						this.getRecordsBasedOnSchool();
					}
				});
				for (const item of files) {
					this.commonAPIService.uploadFilesToS3({
						projectType: 'school',
						path: path,
						name: item.ed_name,
						data: item.base64
					}).subscribe((res: any) => {
					});
				}
			}
		});
	}
	deleteFiles($event) {
		if ($event) {
			const files: any = $event;
			let filesJson = {};
			if (files.element_type === 'folder') {
				filesJson = {
					projectType: 'school',
					path: files.name,
					type: 'school',
					element_type: files.element_type,
					file_type_id: files.file_type_id,
					parent_id: files.parent_id
				};
			} else {
				let path: any = '';
				let ind = 0;
				for (const item of this.breadcrumArr) {
					if (item.parent_id === '') {
						item.name = '';
					}
					path = path + item.name + '/';
					if (ind === 0) {
						item.name = 'Home';
					}
					ind++;
				}
				path = path.substring(0, path.length - 1);
				filesJson = {
					projectType: 'school',
					type: 'school',
					path: path,
					name: files.name,
					element_type: files.element_type,
					file_type_id: files.file_type_id,
					parent_id: files.parent_id
				};
			}
			this.commonAPIService.deleteFilesFromS3(filesJson).subscribe((res: any) => {
				if (res && res.status === 'ok') {
					this.getRecordsBasedOnSchool();
				}
			});
		}
	}
	previewImage(imgUrl, index) {
		const imgArray = [];
		imgArray.push({
			imgUrl: imgUrl
		});
		this.dialogRef3 = this.dialog.open(PreviewDocumentComponent, {
			data: {
				images: imgArray,
				index: index
			},
			height: '80vh',
			width: '80vh'
		});
	}
	setParentId(id, name, item) {
		if (item.element_type === 'folder') {
			this.parent_id = id;
			const findex = this.breadcrumArr.findIndex(f => f.name.toLowerCase() === name.toLowerCase && f.parent_id === id);
			if (findex === -1) {
				this.breadcrumArr.push({
					'name': name,
					'parent_id': id
				});
			}
			this.getRecordsBasedOnSchool();
		} else {
			this.previewImage(item.url, 0);
		}
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
			const findex = this.breadcrumArr.findIndex(f => Number(f.parent_id) === this.parent_id);
			for (const item of this.breadcrumArr) {
				if (index > findex) {
					if (item.parent_id !== this.parent_id) {
						this.breadcrumArr.splice(index, 1);
					}
				}
				index++;
			}
			this.getRecordsBasedOnSchool();
		}
	}
	getTotalSize(size) {
		return (size / 1024).toFixed(2);
	}
	downLoadFile(item) {
		if (item.element_type === 'file') {
			saveAs(item.url, item.name);
			this.commonAPIService.showSuccessErrorMessage('Downloaded SuccessFully', 'success');
		}
	}
}

