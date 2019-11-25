import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
	selector: 'app-imagecrop',
	templateUrl: './imagecrop.component.html',
	styleUrls: ['./imagecrop.component.scss']
})
export class ImagecropComponent implements OnInit {

	inputData: any;
	filename = '';
	@Input() cropconfig: any;
	@Output() cropYes = new EventEmitter<any>();
	@Output() cropNo = new EventEmitter<any>();
	dialogRef: MatDialogRef<ImagecropComponent>;
	@ViewChild('cropModal') cropModal;
	imageChangedEvent: any = '';
	croppedImage: any = '';
	constructor(
		private dialog: MatDialog
	) { }

	ngOnInit() {

	}
	openModal(event) {
		this.inputData = event;
		if (this.inputData) {
			this.filename = event.target.files[0].name;
			this.fileChangeEvent(event);
		}
		this.dialogRef = this.dialog.open(this.cropModal, {
			'height': '100vh',
			'width': '100vw',
			position: {
				'top': '5%'
			}
		});
	}
	closeDialog() {
		this.cropNo.emit(this.inputData);
		this.dialogRef.close();
	}
	acceptcrop() {
		this.cropYes.emit({ filename: this.filename, base64: this.croppedImage });
	}
	fileChangeEvent(event: any): void {
		this.imageChangedEvent = event;
	}
	imageCropped(event: ImageCroppedEvent) {
		this.croppedImage = event.base64;
	}
	imageLoaded() {
		// show cropper
	}
	loadImageFailed() {
		// show message
	}

}
