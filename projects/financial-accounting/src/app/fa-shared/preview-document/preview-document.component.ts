import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
	selector: 'app-preview-document',
	templateUrl: './preview-document.component.html',
	styleUrls: ['./preview-document.component.css']
})
export class PreviewDocumentComponent implements OnInit {

	finalImageArray: any[] = [];
	showImage = false;
	showDoc = false;
	constructor(public dialogRef: MatDialogRef<PreviewDocumentComponent>,
		@Inject(MAT_DIALOG_DATA) public data,
		public sanitizer: DomSanitizer) { }

	ngOnInit() {
		console.log('preview document - this.data',this.data)
		this.finalImageArray = [];
		if (this.data.index) {
			this.data.index = this.data.index;
		} else {
			this.data.index = 0;
		}
		for (const item of this.data.images) {
			if (item.imgUrl) {
				this.finalImageArray.push(item.imgUrl);
			}
		}
	}

}
