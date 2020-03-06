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
	previewSRC="https://s.tocd.de/tontopf/BvHHq7JAYz/konfiguratorVorschauGross/32mm_c_hook_jpg";
	constructor(public dialogRef: MatDialogRef<PreviewDocumentComponent>,
		@Inject(MAT_DIALOG_DATA) public data,
		public sanitizer: DomSanitizer) { }

	ngOnInit() {
		this.finalImageArray = [];
		if (this.data.index) {
			this.data.index = this.data.index;
		} else {
			this.data.index = 0;
		}
		for (const item of this.data.images) {
			const url: String = item.imgUrl;
			const fileExt = url.split('.').pop();
			console.log(fileExt);
			if (url && (fileExt.match(/pdf/) || fileExt.match(/PDF/)
				|| fileExt.match(/jpg/) || fileExt.match(/JPG/)
				|| fileExt.match(/png/) || fileExt.match(/PNG/)
				|| fileExt.match(/gif/) || fileExt.match(/GIF/)
				|| fileExt.match(/jpeg/) || fileExt.match(/JPEG/)
				|| fileExt.match(/gif/) || fileExt.match(/GIF/)
				|| fileExt.match(/xlsx/) || fileExt.match(/XLSX/)
				|| fileExt.match(/xls/) || fileExt.match(/XLS/)
				|| fileExt.match(/bmp/) || fileExt.match(/BMP/)
				|| fileExt.match(/doc/) || fileExt.match(/DOC/)
				|| fileExt.match(/docx/) || fileExt.match(/docx/)
				|| fileExt.match(/ppt/) || fileExt.match(/PPT/)
				|| fileExt.match(/pptx/) || url.match(/PPTX/))) {
				this.finalImageArray.push(url);
			}
		}
	}

}
