import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SisService, CommonAPIService } from '../../../_services/index';
import { DynamicComponent } from '../../../sharedmodule/dynamiccomponent';
@Component({
	selector: 'app-view-documents',
	templateUrl: './view-documents.component.html',
	styleUrls: ['./view-documents.component.scss']
})
export class ViewDocumentsComponent extends DynamicComponent implements OnInit {
	documentArray: any[] = [];
	imageArray: any[] = [];
	tempImageArray: any[] = [];
	login_id: any;
	imageViewerConfig = {};
	constructor(public dialogRef: MatDialogRef<ViewDocumentsComponent>,
		@Inject(MAT_DIALOG_DATA) public data,
		private sisService: SisService,
		private commomService: CommonAPIService) { super(); }

	ngOnInit() {
		if (this.data.login_id && this.data.editFlag === true) {
			this.login_id = this.data.login_id;
			this.getDocuments(this.data.doc_req_id);
			this.viewImageOnLoad(this.data.doc_req_id);
		}
		if (this.data.viewFlag === false) {
			this.login_id = this.data.view_login_id;
			this.viewImageOnLoad(this.data.doc_req_id);
		}
		this.commomService.studentData.subscribe(data => {
			this.login_id = data;
		});
		this.imageViewerConfig = {
			btnClass: 'default', // The CSS class(es) that will apply to the buttons
			zoomFactor: 0.1, // The amount that the scale will be increased by
			containerBackgroundColor: '#ff0000', // The color to use for the background. This can provided in hex, or rgb(a).
			wheelZoom: true, // If true, the mouse wheel can be used to zoom in
			allowFullscreen: true, // If true, the fullscreen button will be shown, allowing the user to entr fullscreen mode
			allowKeyboardNavigation: true, // If true, the left / right arrow keys can be used for navigation
			btnIcons: { // The icon classes that will apply to the buttons. By default, font-awesome is used.
				zoomIn: 'fa fa-plus',
				zoomOut: 'fa fa-minus',
				rotateClockwise: 'fa fa-repeat',
				rotateCounterClockwise: 'fa fa-undo',
				next: 'fa fa-arrow-right',
				prev: 'fa fa-arrow-left',
				fullscreen: 'fa fa-arrows-alt',
			},
			btnShow: {
				zoomIn: true,
				zoomOut: true,
				rotateClockwise: true,
				rotateCounterClockwise: true,
				next: true,
				prev: true
			}
		};
	}

	handleEvent(event) {
		switch (event.name) {
			case 'print':
				break;
		}
	}

	getDocuments(doc_req_id) {
		this.documentArray = [];
		this.imageArray = [];
		this.sisService.getDocuments({
			login_id: this.login_id,
			ed_docreq_id: doc_req_id
		}).subscribe((result: any) => {
			if (result) {
				this.documentArray = result.data;
				for (const item of this.documentArray) {
					this.imageArray.push(item.ed_link);
				}
			} else {
				this.imageArray = [];
				this.commomService.showSuccessErrorMessage('No Record Found', 'error');
			}
		});
	}
	deleteImage(ed_id, ed_login_id) {
		this.sisService.deleteDocuments({
			ed_id: ed_id,
			ed_login_id: ed_login_id,
		}).subscribe((result: any) => {
			if (result) {
				this.commomService.showSuccessErrorMessage('Deleted Successfully', 'success');
				this.getDocuments(this.data.doc_req_id);
			}
		});
	}
	viewImageOnLoad(doc_req_id) {
		this.tempImageArray = [];
		this.documentArray = [];
		this.imageArray = [];
		this.documentArray = this.data.docArray;
		for (const item of this.data.docArray) {
			if (Number(item.ed_docreq_id) === Number(doc_req_id)) {
				this.tempImageArray.push(item.ed_link);
			}
		}
		this.imageArray = this.tempImageArray;
	}
}
