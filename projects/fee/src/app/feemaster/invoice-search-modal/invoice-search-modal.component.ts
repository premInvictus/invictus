import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FeeService, CommonAPIService, SisService, ProcesstypeFeeService } from '../../_services/index';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-invoice-search-modal',
  templateUrl: './invoice-search-modal.component.html',
  styleUrls: ['./invoice-search-modal.component.css']
})
export class InvoiceSearchModalComponent implements OnInit {

  dialogRef: MatDialogRef<InvoiceSearchModalComponent>;
  @ViewChild('searchModal') searchModal;
  @Output() searchOk = new EventEmitter;
  formGroupArray: any[] = [];
  placeholder: any[] = [];
  fieldType: any[] = [];
  genreArray: any[] = [];
  filterArray: any[] = [];
  currentUser: any = {};
  classArray: any[] = [];
  sectionArray: any[] = [];
  feePeriod: any[] = [];
  constructor(
    private dialog: MatDialog,
    private fbuild: FormBuilder,
    private feeService: FeeService,
    private sisService: SisService
  ) { }
  generalFilterForm: FormGroup;
  ngOnInit() {
    this.getClass();
    this.getInvoiceFeeMonths();
  }
  openModal(data) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.filterArray = [
      {
        id: 'inv_process_usr_no',
        name: 'Enrollment No.',
        type: 'text',
        placeholder: 'Enrollment No.'
      },
      {
        id: 'user_name',
        name: 'Name',
        type: 'text',
        placeholder: 'Name'
      },
      {
        id: 'invoice_no',
        name: 'Invoice No.',
        type: 'text',
        placeholder: 'Invoice No.'
      }
    ];
    this.dialogRef = this.dialog.open(this.searchModal, {
      width: '750px',
    });
    this.formGroupArray = [];
    this.buildForm();
  }
  getGenres() {
    this.genreArray = [];
  }
  setPlaceHolder(val, index) {
    const findex = this.filterArray.findIndex(f => f.id === val);
    if (findex !== -1) {
      this.placeholder[index] = this.filterArray[findex].placeholder;
      this.fieldType[index] = this.filterArray[findex].type;
      this.formGroupArray[index].formGroup.patchValue({
        'type': this.filterArray[findex].type
      });
    }
  }
  addNewFilter(index) {
    this.formGroupArray.push({
      id: index + 1,
      formGroup: this.fbuild.group({
        'filter_type': '',
        'filter_value': '',
        'type': ''
      })
    });
  }
  deleteForm(i) {
    const findex = this.formGroupArray.findIndex(f => Number(f.id) === i);
    if (findex !== -1) {
      this.formGroupArray.splice(findex, 1);
    }
  }
  buildForm() {
    this.formGroupArray = [
      {
        id: '1',
        formGroup: this.fbuild.group({
          'filter_type': '',
          'filter_value': '',
          'type': ''
        })
      }
    ];
    this.generalFilterForm = this.fbuild.group({
      class_id: '',
      sec_id: '',
      inv_fm_id: '',
      from_date: '',
      to_date: '',
      status: '',
    });
  }
  closeDialog() {
    this.dialogRef.close();
  }
  submit() {
    const dataArr: any[] = [];
    for (const item of this.formGroupArray) {
      dataArr.push(item.formGroup.value);
    }
    if (this.generalFilterForm.value.from_date || this.generalFilterForm.value.to_date) {
      this.generalFilterForm.patchValue({
        from_date: new DatePipe('en-in').transform(this.generalFilterForm.value.from_date, 'yyyy-MM-dd'),
        to_date: new DatePipe('en-in').transform(this.generalFilterForm.value.to_date, 'yyyy-MM-dd')
      });
    }
    this.searchOk.emit({
      filters: dataArr,
      generalFilters: this.generalFilterForm.value
    });
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
  getClass() {
		this.classArray = [];
		this.sisService.getClass({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.classArray = result.data;
			}
		});
	}
	getSectionsByClass() {
		this.sectionArray = [];
		this.sisService.getSectionsByClass({ class_id: this.generalFilterForm.value.class_id }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.sectionArray = result.data;
			}
		});
	}

	getInvoiceFeeMonths() {
		this.feePeriod = [];
		this.feeService.getInvoiceFeeMonths({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.feePeriod = result.data.fm_data;
			}
		});
	}

}
