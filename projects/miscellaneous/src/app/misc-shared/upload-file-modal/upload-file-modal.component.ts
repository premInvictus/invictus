import { Component, OnInit } from '@angular/core';
import { SisService } from '../../_services';
import { MatDialogRef } from '@angular/material';

@Component({
	selector: 'app-upload-file-modal',
	templateUrl: './upload-file-modal.component.html',
	styleUrls: ['./upload-file-modal.component.css']
})
export class UploadFileModalComponent implements OnInit {
	files: any[] = [];
	finalDocumentArray: any[] = [];
	currentFileChangeEvent: any;
	multipleFileArray: any[] = [];
	counter: any = 0;
	imageArray: any[] = [];
	sizeArray: any[] = [];
	base64Images: any[] = [];
	currentImage: string | ArrayBuffer;
	constructor(private sisService: SisService, private dialogRef: MatDialogRef<UploadFileModalComponent>) { }

	ngOnInit() {
	}
	fileChangeEvent(fileInput) {
		this.multipleFileArray = [];
		this.sizeArray = [];
		this.base64Images = [];
		this.counter = 0;
		this.currentFileChangeEvent = fileInput;
		const files = fileInput.target.files;
		for (let i = 0; i < files.length; i++) {
			this.IterateFileLoop(files[i]);
		}
	}

	IterateFileLoop(files) {
		const reader = new FileReader();
		reader.onloadend = (e) => {
			this.currentImage = reader.result;
			console.log(files);
			const fileJson = {
				fileName: files.name,
				imagebase64: this.currentImage,
				module: 'attachment'
			};
			this.multipleFileArray.push(fileJson);
			this.sizeArray.push(files.size);
			this.base64Images.push(this.currentImage);
			this.counter++;
			if (this.counter === this.currentFileChangeEvent.target.files.length) {
				this.sisService.uploadDocuments(this.multipleFileArray).subscribe((result: any) => {
					if (result) {
						let index = 0;
						for (const item of result.data) {

							this.finalDocumentArray.push({
								ed_name: item.file_name,
								ed_link: item.file_url,
								size: this.sizeArray[index],
								base64: this.base64Images[index]
							});
							index++;
						}
						console.log(this.finalDocumentArray);
					}
				});
			}
		};
		reader.readAsDataURL(files);
	}
	getTotalSize() {
		let count = 0;
		for (const item of this.finalDocumentArray) {
			count = count + item.size;
		}
		return (count / 1024).toFixed(2);
	}
	deleteFile(index) {
		this.finalDocumentArray.splice(index, 1);
	}
	closeDialog() {
		this.dialogRef.close();
	}
	submitFiles() {
		this.dialogRef.close({ files: this.finalDocumentArray })
	}

}
