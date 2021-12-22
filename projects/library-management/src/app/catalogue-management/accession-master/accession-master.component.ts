import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { ErpCommonService } from 'src/app/_services';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SmartService, SisService, CommonAPIService } from '../../_services';

import { AccessionMasterModel } from './accession-master.model';
import { MatTableDataSource, MatPaginator, MatSort, PageEvent, MatPaginatorIntl, MatDialog } from '@angular/material';
import { TitleCasePipe } from '@angular/common';
import { MatPaginatorI18n } from '../../library-shared/customPaginatorClass';
@Component({
	selector: 'app-accession-master',
	templateUrl: './accession-master.component.html',
	styleUrls: ['./accession-master.component.css'],
	providers: [
		{ provide: MatPaginatorIntl, useClass: MatPaginatorI18n }
	]
})
export class AccessionMasterComponent implements OnInit, AfterViewInit {
	@ViewChild('cropModal') cropModal;
	@ViewChild('bookDet') bookDet;
	@ViewChild('fileInput') myInputVariable: ElementRef;
	@ViewChild('paginator') paginator: MatPaginator;
	@ViewChild('searchModal') searchModal;
	@ViewChild('editReservoir') editReservoir;
	@ViewChild(MatSort) sort: MatSort;
	filters: any = {};
	bookpagesize = 100;
	pageEvent: PageEvent;
	disableApiCall = false;
	bookpageindex = 0;
	bookpagesizeoptions = [100, 300, 500, 1000];
	result: any = {};
	languageArray: any[] = [];
	imageFlag = false;
	bookImage: any = '';
	genreArray: any[] = [];
	bookDetailsArray: any[] = [];
	typeArray: any[] = [{
		type_id: '1',
		type_name: 'Hardbound',
	},
	{
		type_id: '2',
		type_name: 'Paperback',
	},
	{
		type_id: '3',
		type_name: 'ePub/eBook',
	},
	{
		type_id: '4',
		type_name: 'PDF',
	}];
	booktypeArray: any[] = [{
		type_id: '1',
		type_name: 'General',
	},
	{
		type_id: '2',
		type_name: 'Reference',
	},
	{
		type_id: '3',
		type_name: 'Periodical',
	},
	{
		type_id: '4',
		type_name: 'Sample',
	}];
	accessionSequenceArray: any[] = [{
		type_id: 'G',
		type_name: 'General',
	},
	{
		type_id: 'S',
		type_name: 'Specimen',
	}];
	statusArray: any[] = [
		{
			type_id: 'available',
			type_name: 'Available',
		},
		{
			type_id: 'flagged',
			type_name: 'Flagged',
		}
	];
	categoryArray: any[] = [
		{
			type_id: 'read-only',
			type_name: 'Read Only',
		},
		{
			type_id: 'damaged',
			type_name: 'Damaged',
		},
		{
			type_id: 'under-maintain',
			type_name: 'Under Maintanance',
		},
		{
			type_id: 'marked-return',
			type_name: 'Marked for return',
		},
		{
			type_id: 'donated',
			type_name: 'Donated'
		},
		{
			type_id: 'lost',
			type_name: 'Lost'
		}
	];
	sourceArray: any[] = [
		{
			type_id: 'Purchased',
			type_name: 'Purchased',
		},
		{
			type_id: 'Donated',
			type_name: 'Donated',
		},
		{
			type_id: 'Gifted',
			type_name: 'Gifted',
		},
		{
			type_id: 'Specimen',
			type_name: 'Specimen',
		}
	];
	classArray: any[] = [];
	sectionArray: any[] = [];
	subjectArray: any[] = [];
	vendorDetail: any = {};
	bookDetails: any = {};
	url: any;
	imageUrl: any = '';
	enableMultiFlag = false;
	displayedColumns: any[] = ['sr_no', 'book_no', 'book_name', 'author', 'publisher', 'location', 'status','verification', 'action'];
	BOOK_ELEMENT_DATA: AccessionMasterModel[] = [];
	bookDataSource = new MatTableDataSource<AccessionMasterModel>(this.BOOK_ELEMENT_DATA);
	totalRecords: number;
	filteredFlag = false;
	currentUser: any;
	searchViaSearch = false;
	searchViaText = false;
	delMessage = 'Do you want to archive';
	delText = 'Archive';
	@ViewChild('deleteModal') deleteModal;
	constructor(private common: ErpCommonService, private fbuild: FormBuilder,
		public dialog: MatDialog,
		private notif: CommonAPIService,
		private sis: SisService,
		private smart: SmartService) { }
	assessionMasterContainer = true;
	addBookContainer = false;
	bookForm: FormGroup;
	searchForm: FormGroup;
	session:any;
	openDeleteModal(id) {
		const itemL: any = {};
		itemL.id = id;
		this.deleteModal.openModal(itemL);
	}
	deleteOk($event) {
		if ($event.id) {
			this.common.deleteReservoirData({
				reserv_id: $event.id
			}).subscribe((res: any) => {
				if (res && res.status === 'ok') {
					this.notif.showSuccessErrorMessage(res.message, 'success');
					if (!this.filteredFlag) {
						this.getReservoirData();
					} else {
						this.getReservoirDataBasedOnFilter();
					}
				}
			});
		}
	}
	deleteCancel($event) {
		this.deleteModal.closeDialog();
	}
	ngOnInit() {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		localStorage.removeItem('invoiceBulkRecords');
		this.session = JSON.parse(localStorage.getItem('session'));
		this.getLanguages();
		this.getGenres();
		this.builForm();
		this.getClass();
		this.getSection();
		this.getSubject();
		this.getReservoirData();
	}
	updateOk($event) {
		if ($event) {
			let data: any = {}
			data = $event;
			data.value['language_details'] = {
				lang_code: data.value.lang_id,
				lang_name: this.getLanguageName(data.value.lang_id)
			};
			data.value['genre'] = {
				genre_name: data.value.genre_id,
				genre_id: this.getGenreId(data.value.genre_id)
			};
			data.value.authors = [data.value.authors];
			data.value.images_links = {
				smallThumbnail: data.value.bookImage,
				thumbnail: data.value.bookImage
			};
			data.value['location'] = data.value.stack + '-' + data.value.row;
			this.common.updateReservoirData({
				bookDetails: data.value
			}).subscribe((res: any) => {
				if (res && res.status === 'ok') {
					this.notif.showSuccessErrorMessage(res.message, 'success');
					if (!this.filteredFlag) {
						this.getReservoirData();
					} else {
						this.getReservoirDataBasedOnFilter();
					}
				}
			});
		}
	}
	updateCancel() {
		this.editReservoir.closeDialog();
	}
	editReserv(id) {
		const iteml: any = {};
		iteml.id = id;
		this.editReservoir.openModal(iteml);
	}
	ngAfterViewInit() {
		this.bookDataSource.paginator = this.paginator;
		this.bookDataSource.sort = this.sort;
	}
	backToListing() {
		this.assessionMasterContainer = true;
		this.addBookContainer = false;
		this.getReservoirData();
	}
	getSection() {
		this.common.getSection({}).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.sectionArray = result.data;
				
			}
		});
	}
	searchOk($event) {
		this.BOOK_ELEMENT_DATA = [];
		this.filteredFlag = false;
		this.filters = {};
		let i = 0;
		localStorage.removeItem('invoiceBulkRecords');
		this.bookDataSource = new MatTableDataSource<AccessionMasterModel>(this.BOOK_ELEMENT_DATA);
		if ($event) {
			this.filters = $event;
			this.filteredFlag = true;
			this.common.getReservoirDataBasedOnFilter({
				filters: $event.filters,
				generalFilters: $event.generalFilters,
				page_index: this.bookpageindex,
				page_size: this.bookpagesize,
				search_from: 'master'
			}).subscribe((res: any) => {
				if (res && res.status === 'ok') {
					this.searchViaText = true;
					this.searchViaSearch = false;
					this.totalRecords = Number(res.data.totalRecords);
					localStorage.setItem('invoiceBulkRecords', JSON.stringify({ records: this.totalRecords }));
					this.prepareDatasource(res.data.resultData);
				}
			});
		}
	}
	getClass() {
		this.smart.getClass({}).subscribe((res: any) => {
			if (res && res.status === 'ok') {
				this.classArray = [];
				this.classArray = res.data;
			}
		});
	}
	getSubject() {
		this.smart.getSubject({}).subscribe((res: any) => {
			if (res && res.status === 'ok') {
				this.subjectArray = [];
				this.subjectArray = res.data;
			}
		});
	}
	getReservoirDataBasedOnFilter() {
		let i = 0;
		this.BOOK_ELEMENT_DATA = [];
		this.common.getReservoirDataBasedOnFilter({
			filters: this.filters.filters,
			generalFilters: this.filters.generalFilters,
			page_index: this.bookpageindex,
			page_size: this.bookpagesize,
			search_from: 'master'
		}).subscribe((res: any) => {
			if (res && res.status === 'ok') {
				this.searchViaText = false;
				this.searchViaSearch = true;
				this.totalRecords = Number(res.data.totalRecords);
				localStorage.setItem('invoiceBulkRecords', JSON.stringify({ records: this.totalRecords }));
				this.prepareDatasource(res.data.resultData);
			}
		});
	}
	builForm() {
		this.bookForm = this.fbuild.group({
			isbn: '',
			title: '',
			subtitle: '',
			isbn_details: [],
			authors: '',
			publisher: '',
			tags: '',
			publishedDate: '',
			description: '',
			genre_id: '',
			images_links: '',
			lang_id: '',
			preview_link: '',
			info_link: '',
			canonical_volume_link: '',
			source: '',
			page_count: '',
			price: '',
			location_type: '',
			location_class_id : '',
			location_sec_id : '',
			location_class_name : '',
			location_sec_name : '',
			stack: '',
			row: '',
			buy_link: '',
			type_id: '',
			category_id: '',
			accessionsequence:'',
			project_type_id: '6',
			reserv_class_id: [],
			reserv_status: '',
			status: '',
			reserv_sub_id: '',
			no_of_copies: '',
			vendor_id: '',
			vendor_name: '',
			vendor_po_no: '',
			volumeInfo: '',
			vendor_invoice_no: '',
			vendor_address: '',
			vendor_contact: '',
			vendor_email: '',
			name: '',
			desgnation: '',
			contact: '',
			ven_gst_no: '',
			ven_pan_no: ''
		});
		this.searchForm = this.fbuild.group({
			search: '',
			page_size: this.bookpagesize,
			page_index: this.bookpageindex,
			role_id: this.currentUser.role_id,
			search_for: 'master'
		});
	}
	readUrl(event: any) {
		this.openCropDialog(event);
	}
	searchBook() {
		this.filters = {};
		this.BOOK_ELEMENT_DATA = [];
		let i = 0;
		this.bookDataSource = new MatTableDataSource<any>(this.BOOK_ELEMENT_DATA);
		if (this.searchForm.value.search) {
			this.common.searchReservoir(this.searchForm.value).subscribe((res: any) => {
				if (res && res.data.resultData) {
					this.searchViaText = true;
					this.searchViaSearch = false;
					this.totalRecords = Number(res.data.totalRecords);
					localStorage.setItem('invoiceBulkRecords', JSON.stringify({ records: this.totalRecords }));
					this.prepareDatasource(res.data.resultData);
				}
			});
		} else {
			this.searchForm.patchValue(
				{
					'search': ''
				}
			);
			this.BOOK_ELEMENT_DATA = [];
			this.bookDataSource = new MatTableDataSource<any>(this.BOOK_ELEMENT_DATA);
		}
	}

	openCropDialog = (imageFile) => this.cropModal.openModal(imageFile);
	uploadImage(fileName, au_profileimage) {
		this.imageFlag = false;
		this.sis.uploadDocuments([
			{ fileName: fileName, imagebase64: au_profileimage, module: 'profile' }]).subscribe((result: any) => {
				if (result.status === 'ok') {
					this.bookImage = result.data[0].file_url;
					this.imageFlag = true;
					this.myInputVariable.nativeElement.value = '';
				} else {
					this.myInputVariable.nativeElement.value = '';
				}
			});
	}
	openBookModal(book_no) {
		this.bookDet.openModal(book_no);
	}
	acceptCrop(result) {
		this.uploadImage(result.filename, result.base64);
	}
	acceptNo(event) {
		event.target.value = '';
	}
	getLanguages() {
		this.common.getLanguages({}).subscribe((res: any) => {
			if (res && res.status === 'ok') {
				this.languageArray = [];
				this.languageArray = res.data;
			}
		});
	}
	getGenres() {
		this.common.getGenres({}).subscribe((res: any) => {
			if (res && res.status === 'ok') {
				this.genreArray = [];
				this.genreArray = res.data;
			}
		});
	}
	addBook() {
		this.assessionMasterContainer = false;
		this.addBookContainer = true;
	}
	getBooksBasedOnISBN($event) {
		this.imageFlag = false;
		this.bookImage = '';
		if ($event.target.value) {
			this.notif.startLoading();
			this.result = {};
			this.bookDetails = {};
			this.bookDetailsArray = [];
			this.bookForm.patchValue({
				title: '',
				subtitle: '',
				isbn_details: [],
				authors: '',
				publisher: '',
				tags: '',
				publishedDate: '',
				description: '',
				genre_id: '',
				images_links: '',
				lang_id: '',
				preview_link: '',
				info_link: '',
				canonical_volume_link: '',
				source: '',
				page_count: '',
				price: '',
				stack: '',
				buy_link: '',
			});
			const method = 'get';
			const url: any = 'https://www.googleapis.com/books/v1/volumes?q=isbn:' + $event.target.value;
			const xhr = new XMLHttpRequest();
			xhr.open(method, url, true);
			xhr.send();
			xhr.onloadend = () => {
				if (xhr.response && xhr.status === 200) {
					this.notif.stopLoading();
					const jsonString = xhr.response;
					this.result = JSON.parse(jsonString);
					this.bookDetails.TotalItems = this.result.totalItems;
					if (this.bookDetails.TotalItems > 0) {
						this.bookDetails = this.result.items[0];

						if (this.bookDetails.volumeInfo.readingModes.image===true) {
							this.bookImage = this.bookDetails.volumeInfo.imageLinks.smallThumbnail;
							this.imageFlag = true;
						}
						this.bookForm.patchValue({
							isbn: $event.target.value,
							title: this.bookDetails.volumeInfo.title ? this.bookDetails.volumeInfo.title : '',
							subtitle: this.bookDetails.volumeInfo.subtitle ? this.bookDetails.volumeInfo.subtitle : '',
							isbn_details: this.bookDetails.volumeInfo.industryIdentifiers ? this.bookDetails.volumeInfo.industryIdentifiers : [],
							authors: this.bookDetails.volumeInfo.authors ? this.bookDetails.volumeInfo.authors : [],
							publisher: this.bookDetails.volumeInfo.publisher ? this.bookDetails.volumeInfo.publisher : '',
							publishedDate: this.bookDetails.volumeInfo.publishedDate ? this.bookDetails.volumeInfo.publishedDate : '',
							lang_id: this.bookDetails.volumeInfo.language ? this.bookDetails.volumeInfo.language : '',
							description: this.bookDetails.volumeInfo.description ? this.bookDetails.volumeInfo.description : '',
							images_links: this.bookDetails.volumeInfo.imageLinks ? this.bookDetails.volumeInfo.imageLinks : '',
							preview_link: this.bookDetails.volumeInfo.previewLink ? this.bookDetails.volumeInfo.previewLink : '',
							page_count: this.bookDetails.volumeInfo.pageCount ? this.bookDetails.volumeInfo.pageCount : 0,
							info_link: this.bookDetails.volumeInfo.infoLink ? this.bookDetails.volumeInfo.infoLink : '',
							price: this.bookDetails.saleInfo.saleability === 'FOR_SALE' ? this.bookDetails.saleInfo.listPrice.amount : '',
							canonical_volume_link: this.bookDetails.volumeInfo.canonicalVolumeLink ? this.bookDetails.volumeInfo.canonicalVolumeLink : '',
							buy_link: this.bookDetails.saleInfo.buyLink ? this.bookDetails.saleInfo.buyLink : ''
						});
					}
				} else {
					this.notif.stopLoading();
				}
			};
		} else {
			this.notif.stopLoading();
		}
		document.getElementById('isbn_id').blur();
	} 
	openSearchDialog = (data) => this.searchModal.openModal(data);
	getLanguageName(code) {
		const findex = this.languageArray.findIndex(f => f.lang_code === code);
		if (findex !== -1) {
			return this.languageArray[findex].lang_name;
		}
	}
	getGenreId(name) {
		const findex = this.genreArray.findIndex(f => f.genre_name === name);
		if (findex !== -1) {
			return this.genreArray[findex].genre_id;
		} else {
			return '';
		}
	}
	getVenderDetails($event) {
		if ($event.target.value) {
			this.common.getVendor({
				ven_id: Number($event.target.value)
			}).subscribe((res: any) => {
				if (res && res.status === 'ok') {
					this.vendorDetail = {};
					this.vendorDetail = res.data[0];
					this.bookForm.patchValue({
						vendor_name: this.vendorDetail.ven_name,
						vendor_po_no: this.vendorDetail.ven_po_no,
						vendor_address: this.vendorDetail.ven_address,
						vendor_contact: this.vendorDetail.ven_contact,
						vendor_email: this.vendorDetail.ven_email,
						ven_pan_no: this.vendorDetail.ven_pan_no,
						ven_gst_no: this.vendorDetail.ven_gst_no,
						name: this.vendorDetail.ven_authorised_person_detail_name,
						desgnation: this.vendorDetail.ven_authorised_person_detail_designation,
						contact: this.vendorDetail.ven_authorised_person_detail_contact,
					});
				}
			});
		}
	}
	getReservoirData() {
		
		let i = 0;
		localStorage.removeItem('invoiceBulkRecords');
		this.common.getReservoirData({
			page_index: this.bookpageindex,
			page_size: this.bookpagesize
		}).subscribe((res: any) => {
			if (res && res.status === 'ok') {
				this.BOOK_ELEMENT_DATA = [];
				this.bookDataSource = new MatTableDataSource<AccessionMasterModel>(this.BOOK_ELEMENT_DATA);
				this.searchViaText = false;
				
				this.searchViaSearch = true;
				this.totalRecords = Number(res.data.totalRecords);
				localStorage.setItem('invoiceBulkRecords', JSON.stringify({ records: this.totalRecords }));
				this.prepareDatasource(res.data.resultData);
				
			} else {
				this.BOOK_ELEMENT_DATA = [];
				this.bookDataSource = new MatTableDataSource<AccessionMasterModel>(this.BOOK_ELEMENT_DATA);
			}
		});
	}
	async prepareDatasource(data){
		console.log(data);
		this.BOOK_ELEMENT_DATA = [];
		this.bookDataSource = new MatTableDataSource<AccessionMasterModel>(this.BOOK_ELEMENT_DATA);
		let i=0;
		for (const item of data) {
			let authName = '';
			if (item && item.authors) {
			for (const aut of item.authors) {
				authName = authName + aut + ',';
			}
			if(authName && authName.length > 0) {
				authName = authName.substring(0, authName.length - 1);
			} }
			let tempverification = '';
			if(item.verfication_log && item.verfication_log.length > 0){
				let findex = item.verfication_log.findIndex(e => e.ses_id == this.session.ses_id);
				if(findex != -1){
					tempverification = item.verfication_log[findex].status;
				}
			}
			this.BOOK_ELEMENT_DATA.push({
				sr_no: i + 1,
				book_name: item.title ? item.title : '',
				book_no: item.book_no,
				authors: authName,
				publisher: item.publisher ? item.publisher :'',
				location: item.location ? item.location : '',
				status: item.reserv_flagged_status.status ? item.reserv_flagged_status.status : item.reserv_status,
				verification: tempverification,
				action: item
			});
			i++;
		}
		this.paginator.pageIndex = this.bookpageindex;
		this.paginator.pageSize = this.bookpagesize;
		this.bookDataSource = new MatTableDataSource<AccessionMasterModel>(this.BOOK_ELEMENT_DATA);
		this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
		this.bookDataSource.sort = this.sort;
		
		this.bookDataSource.paginator['length'] = this.paginator['length'] = this.totalRecords;
		this.bookDataSource.paginator = this.paginator;
	}
	submitBook() {
		if (Object.keys(this.bookDetails).length > 0) {
			this.bookForm.value['language_details'] = {
				lang_code: this.bookDetails.volumeInfo && this.bookDetails.volumeInfo.language ? this.bookDetails.volumeInfo.language : '',
				lang_name: this.getLanguageName(this.bookDetails.volumeInfo.language)
			};
			if (this.bookDetails.volumeInfo.categories) {
				this.bookForm.value['genre'] = {
					genre_name: this.bookDetails.volumeInfo.categories ? this.bookDetails.volumeInfo.categories[0] : '',
					// tslint:disable-next-line: max-line-length
					genre_id: this.getGenreId(this.bookDetails.volumeInfo && this.bookDetails.volumeInfo.categories ? this.bookDetails.volumeInfo.categories[0] : '')
				};
			} else {
				this.bookForm.value['genre'] = {
					genre_name: this.bookForm.value.genre_id,
					genre_id: this.getGenreId(this.bookForm.value.genre_id)
				};
			}
		} else {
			this.bookForm.value['language_details'] = {
				lang_code: this.bookForm.value.lang_id,
				lang_name: this.getLanguageName(this.bookForm.value.lang_id)
			};
			this.bookForm.value['genre'] = {
				genre_name: this.bookForm.value.genre_id,
				genre_id: this.getGenreId(this.bookForm.value.genre_id)
			};
			this.bookForm.value.isbn_details = [

				{
					'type': 'ISBN_13',
					'identifier': ''
				},
				{
					'type': 'ISBN_10',
					'identifier': ''
				}
			];
			this.bookForm.value.authors = [this.bookForm.value.authors];
			this.bookForm.value.images_links = {
				smallThumbnail: this.bookImage,
				thumbnail: this.bookImage
			};
		}
		this.bookForm.value['location'] = this.bookForm.value.stack + '-' + this.bookForm.value.row;
		if (this.bookForm.valid) {
			this.disableApiCall = true;
			this.common.insertReservoirData({
				bookDetails: this.bookForm.value
			}).subscribe((res: any) => {
				if (res && res.status === 'ok') {
					this.notif.showSuccessErrorMessage(res.message, 'success');
					if (!this.enableMultiFlag) {
						this.assessionMasterContainer = true;
						this.addBookContainer = false;
						this.getReservoirData();
						this.disableApiCall = false;
					}
					this.builForm();
					this.imageFlag = false;
					this.bookDetails = {};
					this.bookImage = '';
					this.disableApiCall = false;
				} else {
					this.notif.showSuccessErrorMessage(res.message, 'error');
					this.disableApiCall = false;
				}
			});
		} else {
			this.disableApiCall = false;
		}
	}
	fetchData(event?: PageEvent) {
		this.bookpageindex = event.pageIndex;
		this.bookpagesize = event.pageSize;
		if (!this.filteredFlag) {
			this.getReservoirData();
		} else {
			this.getReservoirDataBasedOnFilter();
		}
		return event;
	}
	enableMulti($event) {
		if ($event.checked) {
			this.enableMultiFlag = true;
		} else {
			this.enableMultiFlag = false;
		}
	}

	setClassLocation(event) {
		this.bookForm.patchValue({
			'location_class_name' : event ? event : ''
		});
	}

	setSectionLocation(event) {
		this.bookForm.patchValue({
			'location_sec_name' : event ? event : ''
		});
	}

}
