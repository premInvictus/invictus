import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CommonAPIService } from 'src/app/_services';
import { SisService } from '../../_services';

@Component({
	selector: 'app-search-dialog',
	templateUrl: './search-dialog.component.html',
	styleUrls: ['./search-dialog.component.css']
})
export class SearchDialogComponent implements OnInit {


	inputData: any;
	searchForm: FormGroup;
	reasonArr: any;
	@Input() deleteMessage;
	@Output() deleteOk = new EventEmitter<any>();
	@Output() deleteCancel = new EventEmitter<any>();
	dialogRef: MatDialogRef<SearchDialogComponent>;
	@ViewChild('searchDialogModal') searchDialogModal;
	constructor(private sisService: SisService, private dialog: MatDialog, private fbuild: FormBuilder, public common: CommonAPIService, ) { }

	ngOnInit() {
		this.buildForm();
	}

	buildForm() {
		this.searchForm = this.fbuild.group({
			'inv_id': '',
			'receipt_number': ''
		});
	}


	openModal(data) {
		console.log('data', data);
		this.inputData = data;
		this.searchForm.patchValue({
			'inv_id': data,
			'receipt_number': ''
		});
		this.dialogRef = this.dialog.open(this.searchDialogModal, {
			'height': '50vh',
			position: {
				'top': '20%'
			}
		});
	}


	search() {
		if (this.searchForm.valid) {
			this.deleteOk.emit(this.searchForm.value);
			this.dialogRef.close();
			this.searchForm.patchValue({
				'inv_id': [],
				'receipt_number': ''
			});
		} else {
			this.common.showSuccessErrorMessage('Please choose reason to delete invoice', 'error');
		}

	}

	cancel() {
		this.deleteCancel.emit(this.searchForm.value);
	}
	closeDialog() {
		this.dialogRef.close();
	}

}
