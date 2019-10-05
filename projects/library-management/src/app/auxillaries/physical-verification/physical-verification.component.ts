import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ErpCommonService, CommonAPIService } from 'src/app/_services';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

import { MatTableDataSource, MatPaginator, PageEvent, MatSort, MatPaginatorIntl } from '@angular/material';
import { MatPaginatorI18n } from '../../library-shared/customPaginatorClass';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-physical-verification',
  templateUrl: './physical-verification.component.html',
  styleUrls: ['./physical-verification.component.css']
})



export class PhysicalVerificationComponent implements OnInit, AfterViewInit {
  newBatchForm: FormGroup;
  verificationLogData:any [] = [];
  bookListData:any [] = [];
  showVerifiedBookLog = true;
  showBookList = false;
  showNewBatchStatus = false;
  currentVerificationData: any;
  enteredVal: any = false;
  searchFlag = false;
  bookData: any[] = [];
  currentDate = new Date();
  showBookDetail = false;

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  VERIFICATION_LOG_ELEMENT: VerificationLogElement[] = [];
  logdataSource = new MatTableDataSource<VerificationLogElement>(this.VERIFICATION_LOG_ELEMENT);
  displayedVerificationLogColumns: string[] = ['srno', 'verified_on', 'verified_by', 'no_of_books'];

  
  VERIFICATION_BATCH_ELEMENT: VerificationBatchElement[] = [];
  batchdataSource = new MatTableDataSource<VerificationBatchElement>(this.VERIFICATION_BATCH_ELEMENT);
  displayedVerificationBatchColumns: string[] = ['srno', 'book_no', 'book_name', 'book_author', 'book_publisher', 'book_location', 'action'];

  
  BOOK_LIST_ELEMENT: BookListElement[] = [];
  booklistdataSource = new MatTableDataSource<BookListElement>(this.BOOK_LIST_ELEMENT);
  displayedBookListColumns: string[] = ['srno', 'book_no', 'book_name', 'book_author', 'book_publisher', 'book_location'];
  
  searchBookId = '';



  // MatPaginator Output
  pageEvent: PageEvent;


  constructor(
    private route: ActivatedRoute,
		private router: Router,
    private fbuild: FormBuilder,
    private common: CommonAPIService, 
    private erpCommonService : ErpCommonService
  ) { }

  ngOnInit() {
      
    this.buildForm();  
    this.getVerificationLog();
    this.VERIFICATION_LOG_ELEMENT = [];
    this.VERIFICATION_BATCH_ELEMENT = [];
    this.BOOK_LIST_ELEMENT = []; 
    this.logdataSource = new MatTableDataSource<VerificationLogElement>(this.VERIFICATION_LOG_ELEMENT);
    this.batchdataSource = new MatTableDataSource<VerificationBatchElement>(this.VERIFICATION_BATCH_ELEMENT);
    this.booklistdataSource = new MatTableDataSource<BookListElement>(this.BOOK_LIST_ELEMENT);
  }

  ngAfterViewInit() {

		// this.logdataSource.paginator = this.paginator;
    // this.logdataSource.sort = this.sort;
    // this.batchdataSource.paginator = this.paginator;
    // this.batchdataSource.sort = this.sort;
    // this.booklistdataSource.paginator = this.paginator;
    // this.booklistdataSource.sort = this.sort;
    
    
	}

  buildForm() {
    var date = new Date(), y = date.getFullYear(), m = date.getMonth();
    this.newBatchForm = this.fbuild.group({
      from_date : new Date(y, m, 1),
      to_date : new Date()
		});
  }

  getVerificationLog() {
    const datePipe = new DatePipe('en-in');
    let inputJson = {
      'verfication_from_date' :  datePipe.transform(this.newBatchForm.value.from_date, 'yyyy-MM-dd'),
      'verfication_to_date' :  datePipe.transform(this.newBatchForm.value.to_date, 'yyyy-MM-dd'),

    }
    this.erpCommonService.getVerificationLog({inputJson}).subscribe((result: any) => {
      let element: any = {};
      let recordArray = [];
      this.VERIFICATION_LOG_ELEMENT = [];
      this.logdataSource = new MatTableDataSource<VerificationLogElement>(this.VERIFICATION_LOG_ELEMENT);
      if (result && result.status === 'ok') {
        let pos = 1;
				this.verificationLogData = recordArray = result.data;
				for (const item of recordArray) {
					element = {
						srno: pos,
						verified_on: new DatePipe('en-in').transform(item.verfication_on_date, 'd-MMM-y'),
            verified_by: item.verfication_by ? item.verfication_by : '-',
            verfication_by_name: item.verfication_by_name ? item.verfication_by_name : '-',
						no_of_books: this.bookCount(item.details) ? this.bookCount(item.details) : '-'
          };
					this.VERIFICATION_LOG_ELEMENT.push(element);
					pos++;
					
				}
				this.logdataSource = new MatTableDataSource<VerificationLogElement>(this.VERIFICATION_LOG_ELEMENT);
			} 
    });
  }

  bookCount(data) {
    return data.length;
  }
 
  onClickVerifiedOn(elementNo) {
    let index = elementNo.srno - 1;
    this.showBookList = true;
    this.showNewBatchStatus = false;
    this.showVerifiedBookLog = false;
    this.bookListData = this.verificationLogData[index].details;

    let element: any = {};
          let recordArray = [];
          this.BOOK_LIST_ELEMENT = [];
          this.booklistdataSource = new MatTableDataSource<BookListElement>(this.BOOK_LIST_ELEMENT);
          if (this.bookListData) {
            let pos = 1;
            recordArray = this.bookListData;
            
            for (const item of recordArray) {
              let aval = '';
              for( const avalue of item.book_author ) {
                aval+= avalue+",";
              }
              element = {
                srno: pos,
                book_no: item.book_no,
                book_name: item.book_name ? item.book_name : '-',
                book_author: aval ? aval.slice(0, -1) : '-',
                book_publisher: item.book_publisher ? item.book_publisher : '-',
                book_location : item.book_location ? item.book_location : '-'
              };
              this.BOOK_LIST_ELEMENT.push(element);
              pos++;
              
            }
            this.booklistdataSource = new MatTableDataSource<BookListElement>(this.BOOK_LIST_ELEMENT);
            
            this.booklistdataSource.paginator = this.paginator;
            if (this.sort) {
              this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
              this.booklistdataSource.sort = this.sort;
            }
          } 


    this.currentVerificationData = this.verificationLogData[index];
  }

  showNewBatch() {
    this.showNewBatchStatus = true;
    this.showBookList = false;
    this.showVerifiedBookLog = false;
    this.VERIFICATION_BATCH_ELEMENT = [];
    this.batchdataSource = new MatTableDataSource<VerificationBatchElement>(this.VERIFICATION_BATCH_ELEMENT);
  }

  searchBoodId(event) {
    this.searchBookId = event.target.value;
  }

  searchBook() {
    if (this.searchBookId) {
      this.enteredVal = true;
      const inputJson = { "filters": [{ "filter_type": "reserv_id", "filter_value": Number(this.searchBookId), "type": "number" }] };
		  this.erpCommonService.getReservoirDataBasedOnFilter
      this.erpCommonService.getReservoirDataBasedOnFilter(inputJson).subscribe((result: any) => {
        if (result && result.data) {
          for (const item of result.data.resultData) {
            item.book_container_class = 'book-title-container-default';
            this.bookData.push(item);
          }
          this.searchFlag = true;
          let element: any = {};
          
          this.VERIFICATION_BATCH_ELEMENT = [];
          this.batchdataSource = new MatTableDataSource<VerificationBatchElement>(this.VERIFICATION_BATCH_ELEMENT);
          if (result && result.status === 'ok') {
            let pos = 1;
            
            for (const item of this.bookData) {
              let aval = '';
              for( const avalue of item.book_author ) {
                aval+= avalue+",";
              }
              element = {
                srno: pos,
                book_no: item.reserv_id,
                book_name: item.title ? item.title : '-',
                book_author: aval ? aval.slice(0,-1) : '-',
                book_publisher: item.publisher ? item.publisher : '-',
                book_location : item.location ? item.location : '-'
              };
              this.VERIFICATION_BATCH_ELEMENT.push(element);
              pos++;
              
            }
            this.batchdataSource = new MatTableDataSource<VerificationBatchElement>(this.VERIFICATION_BATCH_ELEMENT);
            if (this.sort) {
              //this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
              this.batchdataSource.sort = this.sort;
            }
          } 
          this.searchBookId = '';

        }
      });
    } else {
      this.enteredVal = false;
      this.searchBookId = '';
    }
  }

  save() {   
    const datePipe = new DatePipe('en-in');
    let batchArr = [];
    for (var i = 0; i < this.VERIFICATION_BATCH_ELEMENT.length; i++) {
      batchArr.push({
        book_no : this.VERIFICATION_BATCH_ELEMENT[i].book_no,
        book_name : this.VERIFICATION_BATCH_ELEMENT[i].book_name,
        book_author : this.VERIFICATION_BATCH_ELEMENT[i].book_author,
        book_publisher : this.VERIFICATION_BATCH_ELEMENT[i].book_publisher,
        book_location : this.VERIFICATION_BATCH_ELEMENT[i].book_location,
      });
    }
    let inputJson = {
      'verfication_on_date' :  datePipe.transform(new Date(), 'yyyy-MM-dd'),
      'verfication_status' : '1',
      'verification_details' : JSON.stringify(batchArr)
    };
    this.erpCommonService.insertPhysicalVerification(inputJson).subscribe((res: any) => {
      if (res && res.status == 'ok') {
        this.common.showSuccessErrorMessage(res.message, res.status);
        this.showNewBatchStatus = false;
        this.showBookList = false;
        this.showVerifiedBookLog = true;
        this.reset();        
        this.getVerificationLog();
      } else {
        this.common.showSuccessErrorMessage(res.message, res.status);
      }
    });
    this.enteredVal = false;
  }

  backToVerificationLog(event) {
    this.showNewBatchStatus = false;
    this.showBookList = false;
    this.showVerifiedBookLog = true;
  }

  deleteRow(elementNo) {    
    let index = elementNo.srno - 1;
    this.bookData.splice(index,1);
    this.VERIFICATION_BATCH_ELEMENT.splice(index, 1);
    this.batchdataSource = new MatTableDataSource<VerificationBatchElement>(this.VERIFICATION_BATCH_ELEMENT);
  }


  reset() {
    this.bookData = [];
    this.VERIFICATION_LOG_ELEMENT = [];
    
    this.logdataSource = new MatTableDataSource<VerificationLogElement>(this.VERIFICATION_LOG_ELEMENT);
    this.BOOK_LIST_ELEMENT = [];
    this.booklistdataSource = new MatTableDataSource<BookListElement>(this.BOOK_LIST_ELEMENT);

    this.VERIFICATION_BATCH_ELEMENT = [];
    this.batchdataSource = new MatTableDataSource<VerificationBatchElement>(this.VERIFICATION_BATCH_ELEMENT);
    this.enteredVal = false;
  }

  applyFilterVerificationLog(filterValue: string) {
		this.logdataSource.filter = filterValue.trim().toLowerCase();
  }
  
  applyFilterBookList(filterValue: string) {
		this.booklistdataSource.filter = filterValue.trim().toLowerCase();
  }
  
  applyFilterNewBatch(filterValue: string) {
		this.batchdataSource.filter = filterValue.trim().toLowerCase();
  }
  
  fetchData() {

  }

  getBookDetail(element) {
    this.router.navigate(['../book-detail'],  { queryParams: { book_id: element.book_no }, relativeTo: this.route });

  }

}

export interface VerificationLogElement {
	srno: number;
	verified_on: string;
	verified_by: string;
	no_of_books: string;
}

export interface VerificationBatchElement {
  srno: number;
  book_no:string;
  book_name:string;
  book_author:string;
  book_publisher:string;
  book_location:string;
  action:any;
}

export interface BookListElement {
  srno: number;
  book_no:string;
  book_name:string;
  book_author:string;
  book_publisher:string;
  book_location:string;
}

