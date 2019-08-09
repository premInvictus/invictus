import { Component, OnInit, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AxiomService, SmartService } from '../../_services';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
	selector: 'app-edit-syllabus',
	templateUrl: './edit-syllabus.component.html',
	styleUrls: ['./edit-syllabus.component.css']
})
export class EditSyllabusComponent implements OnInit {
	@Input() revieweditform: FormGroup;
	editArray: any[] = [];
	ctrArray: any[] = [];
	subtopicArray: any[] = [];
	ckeConfig: any = {};
	inputData: any = {};
	@Input() editMessage;
	@Output() editOk = new EventEmitter<any>();
	@Output() addOk = new EventEmitter<any>();
	dialogRef: MatDialogRef<EditSyllabusComponent>;
	@ViewChild('editModal') editModal;
	constructor(
		private dialog: MatDialog,
		private fbuild: FormBuilder,
		public axiomService: AxiomService,
		private syllabusService: SmartService,
	) { }
	buildForm() {
		this.ctrList();
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
		if (data.text === 'Edit') {
			this.getSyllabusDetailsEdit({ sd_id: data.sd_id });
		} else {
			this.addSubtopicByTopicwise(data);
			console.log(data);
		}
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

	//  Get CTR List function
	ctrList() {
		this.syllabusService.ctrList()
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.ctrArray = result.data;
					}
				}
			);
	}
	//  Get Subtopic List function
	getSubtopicByTopic(value) {
		this.syllabusService.getSubTopic({st_topic_id: value})
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.subtopicArray = result.data;
					} else {
						this.subtopicArray = [];
					}
				}
			);
	}
	getSyllabusDetailsEdit(value: any) {
		this.syllabusService.getSyllabusDetailsEdit(value)
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.getSubtopicByTopic(result.data[0].sd_topic_id);
						this.revieweditform.patchValue({
							'class_name': result.data[0].class_name,
							'sub_name': result.data[0].sub_name,
							'topic_name': result.data[0].topic_name,
							'subtopic_name': result.data[0].sd_st_id,
							'ctr_name': result.data[0].sd_ctr_id,
							'sd_desc': result.data[0].sd_desc,
							'sd_period_req': result.data[0].sd_period_req,
							'sd_id': result.data[0].sd_id
						});
					}
				});
	}
	addSubtopicByTopicwise(value) {
		this.syllabusService.addSubtopicByTopicwise({ syl_id: value.syl_id })
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						const subTopicParam: any = {};
						subTopicParam.syl_id = value.syl_id;
						subTopicParam.sd_topic_id = value.topic_id;
						this.syllabusService.getSyllabusSubTopicId(subTopicParam)
							.subscribe(
								(subtopic_r: any) => {
									if (subtopic_r && subtopic_r.status === 'ok') {
										for (const citem of subtopic_r.data) {
											for (const item of this.subtopicArray) {
												if (citem.sd_st_id === item.st_id) {
													const rindex = this.subtopicArray.findIndex(f => f.st_id === item.st_id);
													if (rindex !== -1) {
														this.subtopicArray.splice(rindex, 1);
														break;
													}
												}
											}
										}
									}
								});
						this.syllabusService.getTopicNameByTopicId({ topic_id: value.topic_id })
							.subscribe(
								(topic_r: any) => {
									if (topic_r && topic_r.status === 'ok') {
										this.getSubtopicByTopic(topic_r.data[0].topic_id);
										this.revieweditform.patchValue({
											'class_name': result.data[0].class_name,
											'sub_name': result.data[0].sub_name,
											'topic_name': topic_r.data[0].topic_name,
										});
									}
								});
					}
				});
	}
	addSyllabussEdit() {
		if (this.revieweditform.valid) {
			this.inputData.sd_st_id = this.revieweditform.value.subtopic_name;
			this.inputData.sd_ctr_id = this.revieweditform.value.ctr_name;
			this.inputData.sd_period_req = this.revieweditform.value.sd_period_req;
			this.inputData.sd_desc = this.revieweditform.value.sd_desc;
			this.addOk.emit(this.inputData);
			this.closeDialog();
		}
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
