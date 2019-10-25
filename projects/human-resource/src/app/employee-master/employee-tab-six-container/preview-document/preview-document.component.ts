import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
	selector: 'app-preview-document',
	templateUrl: './preview-document.component.html',
	styleUrls: ['./preview-document.component.scss']
})
export class PreviewDocumentComponent implements OnInit {
	tempimageArray: any;
	imageArray: any[] = [];
	finalImageArray: any[] = [];
	showImage = false;
	showDoc = false;
	docArray: any[] = [];
	constructor(public dialogRef: MatDialogRef<PreviewDocumentComponent>,
		@Inject(MAT_DIALOG_DATA) public data,
		public sanitizer: DomSanitizer) { }

	ngOnInit() {
		this.finalImageArray = [];
		this.docArray = [];
		this.imageArray = [];
		this.imageArray.push(this.data.imageArray);
		if (this.data.index) {
			this.data.index = this.data.index;
		} else {
			this.data.index = 0;
		}
		for (const item of this.imageArray[0]) {
			if (item.imgName) {
				this.finalImageArray.push(item.imgName);

			}
			if (item.erd_doc_link) {
				this.finalImageArray.push(item.erd_doc_link); 

			}
			if (item.file_url) {
				this.finalImageArray.push(item.file_url);
			}
			if (item.tcd_doc_link) {
				this.finalImageArray.push(item.tcd_doc_link);
			}
		}
	}
}
