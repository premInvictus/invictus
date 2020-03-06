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
	selector: 'app-student-records',
	templateUrl: './student-records.component.html',
	styleUrls: ['./student-records.component.scss'],
	providers: [
		{ provide: MatPaginatorIntl, useClass: MatPaginatorI18n }
	]
})
export class StudentRecordsComponent implements OnInit, AfterViewInit {
	
	
	fileArray: any[] = [];
	max_id: any = 0;
	documents: any[] = [];
	totalRecords: number;
	filterFlag = false;
	filterValue = '';
	uploadFlag = false;
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
		if (this.filterValue) {
			this.getRecordsBasedOnFilter(this.filterValue);
		} else {
			this.getRecordsBasedOnSchool();
		}
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
		this.documents = [];
		this.uploadFlag = true;
		this.datasource = new MatTableDataSource<any>(this.fileArray);
		this.commonAPIService.getFolderPerLevel({
			findAll: false,
			type: 'student',
			parent_id: this.parent_id,
			pageIndex: this.bookpageindex,
			pageSize: this.bookpagesize,
		}).subscribe((res: any) => {
			if (res && res.status === 'ok') {
				this.uploadFlag = false;
				this.fileArray = [];
				this.totalRecords = Number(res.data.totalRecords);
				this.max_id = res.data.max_id;
				localStorage.setItem('invoiceBulkRecords', JSON.stringify({ records: this.totalRecords }));
				this.fileArray = res.data.records;
				this.datasource = new MatTableDataSource<any>(this.fileArray);
				this.datasource.paginator.length = this.paginator.length = this.totalRecords;
				this.datasource.paginator = this.paginator;
			} else {
				this.uploadFlag = false;
			}
		});
	}
	getRecordsBasedOnFilter(val) {
		if (val) {
			this.uploadFlag = true;
			this.documents = [];
			this.fileArray = [];
			this.filterFlag = true;
			this.filterValue = val;
			this.datasource = new MatTableDataSource<any>(this.fileArray);
			this.commonAPIService.getFolderPerLevel({
				findMatch: true,
				type: 'student',
				parent_id: this.parent_id,
				pageIndex: this.bookpageindex,
				pageSize: this.bookpagesize,
				name: this.filterValue
			}).subscribe((res: any) => {
				if (res && res.status === 'ok') {
					this.fileArray = [];
					this.totalRecords = Number(res.data.totalRecords);
					localStorage.setItem('invoiceBulkRecords', JSON.stringify({ records: this.totalRecords }));
					this.fileArray = res.data.records;
					this.max_id = res.data.max_id;
					console.log(this.fileArray);
					this.datasource = new MatTableDataSource<any>(this.fileArray);
					this.datasource.paginator.length = this.paginator.length = this.totalRecords;
					this.datasource.paginator = this.paginator;
					this.uploadFlag = false;
				}
			});
		} else {
			this.filterValue = '';
			this.filterFlag = false;
			this.uploadFlag = false;
			this.getRecordsBasedOnSchool();
		}
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
						'type': 'student',
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
							if (this.filterValue) {
								this.getRecordsBasedOnFilter(this.filterValue);
							} else {
								this.getRecordsBasedOnSchool();
							}
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
				const json2: any[] = [];
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
						'projectType': 'student',
						'path': path,
						'name': item.ed_name,
						'data': item.base64,
						'content_type': item.content_type,
						'file_type_id': this.max_id,
						'type': 'student',
						'url': '',
						'size': item.size,
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
					this.max_id = this.max_id + 1;
				}
				this.commonAPIService.uploadFilesToS3(json).subscribe((res: any) => {
					if (res && res.status === 'ok') {
						if (this.filterValue) {
							this.getRecordsBasedOnFilter(this.filterValue);
						} else {
							this.getRecordsBasedOnSchool();
						}
					}
				});
			}
		});
	}
	checkAllDocuments($event) {
		if ($event.checked) {
			this.documents = [];
			for (const item of this.fileArray) {
				this.documents.push({
					id: item.file_type_id,
					details: item
				});
			}
		} else {
			this.documents = [];
		}
	}
	checkSubChecked(id) {
		if (this.documents.length > 0) {
			const findex = this.documents.findIndex(f => Number(f.id) === Number(id));
			if (findex !== -1) {
				return true;
			} else {
				return false;
			}
		}
	}
	checkInter() {
		if (this.documents.length > 0) {
			if (this.documents.length < this.fileArray.length) {
				return true;
			}
		} else {
			return false;
		}
	}
	checkMultipleFiles(item) {
		const findex = this.documents.findIndex(f => Number(f.id) === Number(item.file_type_id));
		if (findex === -1) {
			this.documents.push({
				id: item.file_type_id,
				details: item
			})
		} else {
			this.documents.splice(findex, 1);
		}
	}
	deleteFiles($event) {
		if ($event && this.documents.length === 0) {
			const files: any = $event;
			let filesJson = {};
			if (files.element_type === 'folder') {
				filesJson = {
					projectType: 'student',
					path: files.name,
					type: 'student',
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
					projectType: 'student',
					type: 'student',
					path: path,
					name: files.name,
					element_type: files.element_type,
					file_type_id: files.file_type_id,
					parent_id: files.parent_id
				};
			}
			this.commonAPIService.deleteFilesFromS3(filesJson).subscribe((res: any) => {
				if (res && res.status === 'ok') {
					if (this.filterValue) {
						this.getRecordsBasedOnFilter(this.filterValue);
					} else {
						this.getRecordsBasedOnSchool();
					}
				}
			});
		} else if ($event && this.documents.length > 0) {
			let docInd = 0;
			let docs: any[] = [];
			docs = this.documents;
			for (const value of docs) {
				const files: any = $event;
				let filesJson = {};
				if (value.details.element_type === 'folder') {
					filesJson = {
						projectType: 'student',
						path: value.details.name,
						type: 'student',
						element_type: value.details.element_type,
						file_type_id: value.details.file_type_id,
						parent_id: value.details.parent_id
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
						projectType: 'student',
						type: 'student',
						path: path,
						name: value.details.name,
						element_type: value.details.element_type,
						file_type_id: value.details.file_type_id,
						parent_id: value.details.parent_id
					};
				}

				this.commonAPIService.deleteFilesFromS3(filesJson).subscribe((res: any) => {
					if (res && res.status === 'ok') {
						if (this.filterValue) {
							this.getRecordsBasedOnFilter(this.filterValue);
						} else {
							this.getRecordsBasedOnSchool();
						}
					}
				});
				docInd++;
			}

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
			if (this.filterValue) {
				this.getRecordsBasedOnFilter(this.filterValue);
			} else {
				this.getRecordsBasedOnSchool();
			}
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
			if (this.filterValue) {
				this.getRecordsBasedOnFilter(this.filterValue);
			} else {
				this.getRecordsBasedOnSchool();
			}
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
			if (this.filterValue) {
				this.getRecordsBasedOnFilter(this.filterValue);
			} else {
				this.getRecordsBasedOnSchool();
			}
		}
	}
	getTotalSize(bytes, decimals = 2) {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const dm = decimals < 0 ? 0 : decimals;
		const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
	}

	downLoadFile(value) {
		if (value.element_type === 'file') {
			saveAs(value.url, value.name);
			this.commonAPIService.showSuccessErrorMessage('Downloaded SuccessFully', 'success');
		} else {
			let path: any = '';
			for (const item of this.breadcrumArr) {
				if (item.parent_id !== '') {
					path = path + item.name + '/';
				}
			}
			path = path.substring(0, path.length - 1);
			this.commonAPIService.downLoadZipFromS3({
				projectType: "student",
				path: (this.parent_id === 0) ? value.name : (path + '/' + value.name)
			}).subscribe((res: any) => {
				if (res && res.status === 'ok') {
					saveAs(res.data, value.name + '.zip');
				}
			});
		}
	}
}

