import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
	selector: 'app-delete-modal',
	templateUrl: './delete-modal.component.html',
	styleUrls: ['./delete-modal.component.css']
})
export class DeleteModalComponent implements OnInit {
	modelRef: BsModalRef;
	inputData: any;
	@Input() deleteMessage = 'Are you Sure? You want to Delete .';
	@Output() deleteOk = new EventEmitter<any>();
	@Output() deleteCancel = new EventEmitter<any>();
	@ViewChild('deleteComReference') deleteComReference;
	constructor(private modalService: BsModalService) { }

	ngOnInit() {
	}

	public openDeleteModal(data) {
		this.inputData = data;
		this.modelRef =  this.modalService.show(this.deleteComReference, { class: 'modal-sm' });
	}

	delete() {
		this.deleteOk.emit(this.inputData);
	}

	cancel() {
		this.deleteCancel.emit(this.inputData);
	}

}
