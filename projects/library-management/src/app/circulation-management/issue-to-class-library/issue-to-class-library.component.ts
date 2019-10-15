import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ErpCommonService, CommonAPIService } from 'src/app/_services';
import { Router, ActivatedRoute } from '@angular/router';

import { MatTableDataSource, MatPaginator, PageEvent, MatSort, MatPaginatorIntl } from '@angular/material';
import { MatPaginatorI18n } from '../../library-shared/customPaginatorClass';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-issue-to-class-library',
  templateUrl: './issue-to-class-library.component.html',
  styleUrls: ['./issue-to-class-library.component.css']
})
export class IssueToClassLibraryComponent implements OnInit {
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  issuedToClassForm: FormGroup;
  classArray: any [] = [];
  sectionArray: any [] = [];
  bookIssuedData: any[] = [];
  ISSUED_BOOK_ELEMENT: IssuedBookElement[] = [];
  issuedBookDataSource = new MatTableDataSource<IssuedBookElement>(this.ISSUED_BOOK_ELEMENT);
  displayedIssuedBookColumns: string[] = ['srno', 'book_no', 'title', 'author','publisher','issued_on','return_date','action'];
  currentClassName = '';
  currentSectionName = '';
  noOfStudents = 0;
  currentClassTeacher = '';
  teacherArray: any[] = [];
  studentArray: any[] = [];
  constructor(private fbuild: FormBuilder,
              private erpCommonService : ErpCommonService,
              private commonService: CommonAPIService
    ) { }

  ngOnInit() {
    this.buildForm();
    this.getClass('');
    this.getSection('');
    this.ISSUED_BOOK_ELEMENT = [];
    this.issuedBookDataSource = new MatTableDataSource<IssuedBookElement>(this.ISSUED_BOOK_ELEMENT);
  }

  buildForm() {
    this.issuedToClassForm = this.fbuild.group({
      class_id : '',
      sec_id : ''
		});
  }

  getClass(event) {
    this.classArray = [];
    this.currentClassName  = event ? event.target.innerText.trim() : '';
		this.erpCommonService.getClass({}).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.classArray = result.data;
			} else {
				this.classArray = [];
			}
		});
  }

  getSection(event) {
    this.sectionArray = [];
    this.currentSectionName  = event ? event.target.innerText.trim() : '';
		this.erpCommonService.getSection({}).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.sectionArray = result.data;
			} else {
				this.sectionArray = [];
			}
		});
  }

  getBookIssued() {
    if (this.issuedToClassForm.value.class_id && this.issuedToClassForm.value.sec_id)  {
      
     // this.getClassTeacher();
      this.getUser();
      this.erpCommonService.getBookIssued({class_id : this.issuedToClassForm.value.class_id , sec_id : this.issuedToClassForm.value.sec_id}).subscribe((result: any) => {
        if (result.status === 'ok') {
          this.bookIssuedData = result.data ? result.data.students : [];
          let element: any = {};
          this.ISSUED_BOOK_ELEMENT = [];
          this.issuedBookDataSource = new MatTableDataSource<IssuedBookElement>(this.ISSUED_BOOK_ELEMENT);
          if (result && result.status === 'ok') {
            let pos = 1;
            for (const item of this.bookIssuedData) {
              element = {
                srno: pos,
                book_no: item.reserv_id,
                title: item.title ? item.title : '-',
                author: item.authors ? item.authors : '-',
                publisher: item.publisher ? item.publisher : '-',
                issued_on: item.issued_on ? item.issued_on : '',
                return_date: item.returned_on ? item.returned_on : '',
                action: item
              };
              this.ISSUED_BOOK_ELEMENT.push(element);
              pos++;
              
            }
            this.issuedBookDataSource = new MatTableDataSource<IssuedBookElement>(this.ISSUED_BOOK_ELEMENT);
            console.log('this.issuedBookDataSource', this.issuedBookDataSource);
          } 

        } else {
          this.bookIssuedData = [];
        }
      });
    } else {
      this.commonService.showSuccessErrorMessage('Please Choose Class to Proceed', 'error');
    }
		
  }

  getBookDetail(bookId) {

  }

  getClassName() {
    this.currentClassName = '';
  }

  getSectionName() {
    this.currentSectionName = '';
  }

  getClassTeacher() {
    this.teacherArray = [];
		this.erpCommonService.getClassTeacher({'class_id' : this.issuedToClassForm.value.class_id, 'sec_id' : this.issuedToClassForm.value.sec_id}).subscribe((result: any) => {
			if (result.status === 'ok') {
        this.teacherArray = result.data;
        console.log('this.teacherArray', this.teacherArray);
			} else {
				this.teacherArray = [];
			}
		});
  }

  getUser() {
    this.studentArray = [];
		this.erpCommonService.getUser({'class_id' : this.issuedToClassForm.value.class_id, 'sec_id' : this.issuedToClassForm.value.sec_id, 'role_id' : '4'}).subscribe((result: any) => {
			if (result.status === 'ok') {
        this.studentArray = result.data;
        this.noOfStudents = this.studentArray.length;
        console.log('this.studentArray', this.studentArray);
			} else {
        this.noOfStudents = 0;
				this.studentArray = [];
			}
		});
  }

}

export interface IssuedBookElement {
  srno: number;
  book_no:string;
  title:string;
  author:string;
  publisher:string;
  issued_on:string;
  return_date:string;
  action:any
}
