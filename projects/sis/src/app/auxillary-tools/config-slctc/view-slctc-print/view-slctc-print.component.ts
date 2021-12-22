import { Component, OnInit, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {SisService} from '../../../_services/index';
import {DomSanitizer} from '@angular/platform-browser';
@Component({
	selector: 'app-view-slctc-print',
	templateUrl: './view-slctc-print.component.html',
	styleUrls: ['./view-slctc-print.component.scss']
})
export class ViewSlctcPrintComponent implements OnInit {
	prefetchArray: any[] = [];
	formGroupArray: any[] = [];
	customArray: any[] = [];
	html: any;
	constructor(public dialogRef: MatDialogRef<ViewSlctcPrintComponent>,
		private sisService: SisService,
		@Inject(MAT_DIALOG_DATA) public data,
		public sanitizer: DomSanitizer) { }

	ngOnInit() {
		this.sisService.insertSlcTcPrintSetting(this.data.customJSON).subscribe((result: any) => {
			if (result.status === 'ok') {
				this.html = result.data;
			}
		});
	}

}
