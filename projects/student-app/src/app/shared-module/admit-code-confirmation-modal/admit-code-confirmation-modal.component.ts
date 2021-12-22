import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
	selector: 'app-admit-code-confirmation-modal',
	templateUrl: './admit-code-confirmation-modal.component.html',
	styleUrls: ['./admit-code-confirmation-modal.component.css']
})
export class AdmitCodeConfirmationModalComponent implements OnInit {
	modelRef: BsModalRef;
	inputData: any;
	@Input() admitCodeMessage = 'Are you Sure? You want to AdmitCodeConfirmation .';
	@Output() admitCodeOk = new EventEmitter<any>();
	@Output() admitCodeCancel = new EventEmitter<any>();
	@ViewChild('admitCodeReference') admitCodeReference;
	admitCodeText:any = '';
	constructor(private modalService: BsModalService) { }

	ngOnInit() {
	}

	public openAdmitCodeConfirmationModal(data) {
		this.inputData = data;
		this.modelRef =  this.modalService.show(this.admitCodeReference, { class: 'modal-sm' });
	}

	delete() {
		this.inputData.admitCode = this.admitCodeText;
		console.log(this.inputData)
		this.admitCodeOk.emit(this.inputData);
	}

	cancel() {
		this.admitCodeCancel.emit(this.inputData);
	}

}
