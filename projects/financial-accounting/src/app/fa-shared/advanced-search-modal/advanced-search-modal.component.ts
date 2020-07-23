import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonAPIService } from '../../_services/index';
import { ErpCommonService } from 'src/app/_services';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-advanced-search-modal',
  templateUrl: './advanced-search-modal.component.html',
  styleUrls: ['./advanced-search-modal.component.css']
})
export class AdvancedSearchModalComponent implements OnInit {
  dialogRef: MatDialogRef<AdvancedSearchModalComponent>;
  @ViewChild('searchModal') searchModal;
  @Output() searchOk = new EventEmitter;
  @Output() searchCancel = new EventEmitter;
  generalFilterForm: FormGroup;
  currentUser: any = {};
  today=new Date();
  constructor(private dialog: MatDialog, private fbuild: FormBuilder,
    private common: ErpCommonService,
    private commonAPIService: CommonAPIService) { }

 
  ngOnInit() {
  }
  openModal(data) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.dialogRef = this.dialog.open(this.searchModal, {
      width: '750px',
    });
    this.buildForm();
  }
  
  
  
  buildForm() {
    this.generalFilterForm = this.fbuild.group({
      from_date:'',
      to_date:''
    });
  }
  closeDialog() {
    this.dialogRef.close();
    this.searchCancel.emit();
  }
  submit() {
    if (this.generalFilterForm.value.from_date) {
      this.generalFilterForm.patchValue({
        'from_date': new DatePipe('en-in').transform(this.generalFilterForm.value.from_date, 'yyyy-MM-dd'),
      });
    }

    if (this.generalFilterForm.value.to_date) {
      this.generalFilterForm.patchValue({
        'to_date': new DatePipe('en-in').transform(this.generalFilterForm.value.to_date, 'yyyy-MM-dd'),
      });
    }
    this.searchOk.emit(this.generalFilterForm.value);
    this.closeDialog();
  }
  cancel() {
    this.closeDialog();
  }
  getFromDate(value) {
    this.generalFilterForm.patchValue({
      from_date: new DatePipe('en-in').transform(value, 'yyyy-MM-dd')
    });
  }
  getToDate(value) {
    this.generalFilterForm.patchValue({
      to_date: new DatePipe('en-in').transform(value, 'yyyy-MM-dd')
    });
  }

}
