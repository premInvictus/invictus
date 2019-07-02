import { Component, OnInit, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SmartService } from '../../_services';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
	selector: 'app-edit-syllabus',
	templateUrl: './edit-syllabus.component.html',
	styleUrls: ['./edit-syllabus.component.css']
})
export class EditSyllabusComponent implements OnInit {
	@Input() revieweditform: FormGroup;
	public editArray: any[] = [];
	ckeConfig: any = {};
	inputData: any = {};
	@Input() editMessage;
	@Output() editOk = new EventEmitter<any>();
	@Output() editCancel = new EventEmitter<any>();
	dialogRef: MatDialogRef<EditSyllabusComponent>;
	@ViewChild('editModal') editModal;
	constructor(
		private dialog: MatDialog,
		private fbuild: FormBuilder,
		private syllabusService: SmartService,
	) { }
	buildForm() {
		this.revieweditform = this.fbuild.group({
			class_name: '',
			sub_name: '',
			topic_name: '',
			subtopic_name: '',
			ctr_name: '',
			sd_period_req: '',
			sd_desc: '',
			sd_id: ''
		});
	}
	ngOnInit() {

	}
	openEditModal(data) {
		this.dialogRef = this.dialog.open(this.editModal, {
			height: '550px',
			width: '700px'
		});
		this.buildForm();
		this.buildForm();
		this.getSyllabusDetailsEdit(data);
		this.ckeConfig = {
			allowedContent: true,
			pasteFromWordRemoveFontStyles: false,
			contentsCss: ['https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css'],
			disallowedContent: 'm:omathpara',
			height: '140',
			width: '100%',
			extraPlugins: '',
			scayt_multiLanguageMod: true,
			toolbar: [
				['Bold', 'Italic', 'Underline', 'Strikethrough', 'Image', 'Table', 'Templates']
			],
			removeDialogTabs: 'image:advanced;image:Link'
		};
		this.inputData = data;

	}
	getSyllabusDetailsEdit(value: any) {
		this.syllabusService.getSyllabusDetailsEdit(value)
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.revieweditform.patchValue({
							'class_name': result.data[0].class_name,
							'sub_name': result.data[0].sub_name,
							'topic_name': result.data[0].topic_name,
							'subtopic_name': result.data[0].st_name,
							'ctr_name': result.data[0].ctr_name,
							'sd_desc': result.data[0].sd_desc,
							'sd_period_req': result.data[0].sd_period_req,
							'sd_id': result.data[0].sd_id
						});
					}
				});
	}
	updateSyllabussEdit() {
		if (this.revieweditform.valid) {
			this.inputData.sd_id = this.revieweditform.value.sd_id;
			this.inputData.sd_period_req = this.revieweditform.value.sd_period_req;
			this.inputData.sd_desc = this.revieweditform.value.sd_desc;
			this.editOk.emit(this.inputData);
			this.closeDialog();
		}
	}
	closeDialog() {
		this.dialogRef.close(false);
	}
}
