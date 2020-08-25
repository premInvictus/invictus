import { Component, OnInit, ViewChild, AfterViewInit, Inject, AfterViewChecked, OnDestroy } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort, MatTabGroup } from '@angular/material';
import { QbankService } from '../../questionbank/service/qbank.service';
import { QelementService } from '../../questionbank/service/qelement.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HtmlToTextService, NotificationService } from '../../_services/index';
import { ActivatedRoute, Router } from '@angular/router';
//import { BsModalService } from 'ngx-bootstrap/modal';
import { Element, QUESTIONElement, ReviewElement, ESSAYQUESTIONElement } from './express-paper-setup.model';
import { SelectionModel } from '@angular/cdk/collections';
import { AddInstructionComponent } from '../../shared-module/add-instruction/add-instruction.component';
import { MatDialog, MatDialogRef } from '@angular/material';
//import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { style, animate, transition, trigger } from '@angular/animations';
//import { Http } from '@angular/http';
import {tabJSON} from './express-tab-data';
@Component({
	selector: 'app-express-paper-setup',
	templateUrl: './express-paper-setup.component.html',
	styleUrls: ['./express-paper-setup.component.css'],
	animations: [
		trigger('fadeInOut', [
			transition(':enter', [   // :enter is alias to 'void => *'
				style({ opacity: 0 }),
				animate(500, style({ opacity: 1 }))
			]),
			transition(':leave', [   // :leave is alias to '* => void'
				animate(500, style({ opacity: 0 }))
			])
		])
	]
})
export class ExpressPaperSetupComponent implements OnInit, AfterViewInit, AfterViewChecked,OnDestroy {

	express_form_one: FormGroup;
	express_form_two: FormGroup;
	instruction_form: FormGroup;
	classArray: any[];
	sectionArray: any[];
	subjectArray: any[];
	topicArray: any[];
	subtopicArray: any[];
	templates: any[] = [];
	stitems: any[] = [];
	templateArray: any[] = [];
	qpmarks = 0;
	leftmarks = 0;
	instructionArray: any[];
	editInstructionFlag = false;
	totalSelectedQuestion = 0;
	filtersArray: any = [];
	selectedQuestionIndex: any[] = [];
	total: number;
	value: string;
	enableOptionAnswer = false;
	enableOptionMtfAnswer = false;
	answerReview: any = '';
	homeUrl: string;
	selectedSubArray = [];
	currentSelectedSubTab: any = {};
	currentSelectedSubIndex = -1;
	templateStarray: any[] = [];
	qstfilterArray = [];
	tabkeyvalue = {
		mcq: { tf_qt_id: 2, tf_qst_id: 1 },
		mcqmr: { tf_qt_id: 2, tf_qst_id: 2 },
		tf: { tf_qt_id: 2, tf_qst_id: 3 },
		mtf: { tf_qt_id: 2, tf_qst_id: 4 },
		matrix: { tf_qt_id: 2, tf_qst_id: 5 },
		single: { tf_qt_id: 2, tf_qst_id: 14 },
		double: { tf_qt_id: 2, tf_qst_id: 15 },
		matrix45: { tf_qt_id: 2, tf_qst_id: 13 },
		identify: { tf_qt_id: 1, tf_qst_id: 7 },
		fill: { tf_qt_id: 1, tf_qst_id: 6 },
		online: { tf_qt_id: 1, tf_qst_id: 8 },
		short: { tf_qt_id: 1, tf_qst_id: 10 },
		veryshort: { tf_qt_id: 1, tf_qst_id: 9 },
		long: { tf_qt_id: 1, tf_qst_id: 11 },
		veryling: { tf_qt_id: 1, tf_qst_id: 12 },
		essay: { tf_qt_id: 3, tf_qst_id: 0 }
	};
	allTabSelectedQuestion: any = {
		mcq: [],
		mcqmr: [],
		matrix: [],
		mtf: [],
		tf: [],
		single: [],
		double: [],
		matrix45: [],
		identify: [],
		oneline: [],
		fill: [],
		short: [],
		veryshort: [],
		long: [],
		verylong: [],
		essay: []
	};
	arrayTabSelectedQuestion = new Array();
	allTabQuestions: any = {
		mcq: [],
		mcqmr: [],
		matrix: [],
		mtf: [],
		tf: [],
		single: [],
		double: [],
		matrix45: [],
		identify: [],
		oneline: [],
		fill: [],
		short: [],
		veryshort: [],
		long: [],
		verylong: [],
		essay: []
	};
	arrayTabQuestions = new Array();
	finalQuestionArray: any[] = [];
	reviewQuestionArray: any[] = [];
	qpq_qus_position = 0;
	parameterDiv = true;
	startIndex = 1;
	selectQuestionDiv = false;
	questionReviewDiv = false;
	generateQuesBtn = false;
	addInstructBtn = true;
	noRecordDiv = true;

	showTopicSubTopicTable = false;
	selectedQuestionIndexArray: any[] = [];
	editTemplateFlag = false;
	public optionHA = ['A', 'B', 'C', 'D', 'E'];
	public optionmatchHA = ['P', 'Q', 'R', 'S', 'T'];
	public questionsArray: any[] = [];
	papermarksArray: any[] = [];
	noquestion: any[] = [];
	papertimeArray: any[] = [];
	ELEMENT_DATA: Element[] = [];
	QUESTION_ELEMENT_DATA = [];
	ESSAYQUESTION_ELEMENT_DATA = [];
	REVIEW_ELEMENT_DATA: ReviewElement[] = [];
	questionDatasource = new MatTableDataSource<QUESTIONElement>(this.QUESTION_ELEMENT_DATA);
	essayquestionDatasource = new MatTableDataSource<ESSAYQUESTIONElement>(this.ESSAYQUESTION_ELEMENT_DATA);


	displayedColumns = ['position', 'topic', 'subtopic', 'action'];
	// tslint:disable-next-line:max-line-length
	subdisplayedColumns = ['selectSub', 'positionSub', 'questionSub', 'answerSub', 'explanationsSub', 'skillTypeSub', 'topicSub', 'subtopicSub', 'suggestedMarksSub', 'referenceSub']; // TF
	// tslint:disable-next-line:max-line-length
	matrixdisplayedColumns = ['selectMatrixMatch', 'positionMatrixMatch', 'questionMatrixMatch', 'optionsMatrixMatch', 'explanationsMatrixMatch', 'skillTypeMatrixMatch', 'topicMatrixMatch', 'subtopicMatrixMatch', 'suggestedMarksMatrixMatch', 'referenceMatrixMatch']; // Matrix
	// tslint:disable-next-line:max-line-length
	matchdisplayedColumns = ['selectMatch', 'positionMatch', 'questionMatch', 'optionsMatch', 'explanationsMatch', 'skillTypeMatch', 'topicMatch', 'subtopicMatch', 'suggestedMarksMatch', 'referenceMatch']; // Match
	// tslint:disable-next-line:max-line-length
	tfdisplayedColumns = ['selectTF', 'positionTF', 'questionTF', 'optionsTF', 'explanationsTF', 'skillTypeTF', 'topicTF', 'subtopicTF', 'suggestedMarksTF', 'referenceTF']; // TF
	// tslint:disable-next-line:max-line-length
	mcqdisplayedColumns = ['select', 'position', 'question', 'options', 'explanations', 'skillType', 'topic', 'subtopic', 'suggestedMarks', 'reference']; // MCQ
	// tslint:disable-next-line:max-line-length
	multimcqdisplayedColumns = ['selectMulti', 'positionMulti', 'questionMulti', 'optionsMulti', 'explanationsMulti', 'skillTypeMulti', 'topicMulti', 'subtopicMulti', 'suggestedMarksMulti', 'referenceMulti']; // MCQ
	// tslint:disable-next-line:max-line-length
	essaydisplayedColumns = ['select', 'position', 'question', 'options', 'essayTitle', 'explanations', 'skillType', 'topic', 'subtopic', 'suggestedMarks', 'reference']; // MCQ
	reviewdisplayedColumns = ['position', 'question', 'answer',
		'skill', 'marks', 'negativemarks', 'action']; // SUB
	dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
	reviewdatasource = new MatTableDataSource<ReviewElement>(this.REVIEW_ELEMENT_DATA);
	selection = new SelectionModel<Element>(true, []);
	tabs = [];
	currentSelectedTab = 'mcq';
	filterValue = '';
	dialogRef: MatDialogRef<AddInstructionComponent>;


	@ViewChild('paginator') paginator: MatPaginator;
	@ViewChild('paginator2') paginator2: MatPaginator;
	@ViewChild('paginator3') paginator3: MatPaginator;
	@ViewChild('paginator4') paginator4: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild(MatSort) sort2: MatSort;
	@ViewChild(MatSort) sort3: MatSort;
	@ViewChild(MatSort) sort4: MatSort;
	@ViewChild('staticTabs') staticTabs: MatTabGroup;
	validInstruction: any;
	qp_id:any;
	updateExamFlag:any

	isAllSelected() {
		const numSelected = this.selection.selected.length;
		const numRows = this.dataSource.data.length;
		return numSelected === numRows;
	}

	/** Selects all rows if they are not all selected; otherwise clear selection. */
	masterToggle() {
		this.isAllSelected() ?
			this.selection.clear() :
			this.dataSource.data.forEach(row => this.selection.select(row));
	}

	ngOnDestroy(){
		this.express_form_one=null;
		this.express_form_two=null;
		this.instruction_form=null;
		this.classArray=null;
		this.sectionArray=null;
		this.subjectArray=null;
		this.topicArray=null;
		this.subtopicArray=null;
		this.templates=null;
		this.stitems=null;
		this.templateArray=null;
		this.instructionArray=null;
		this.filtersArray=null;
		this.selectedQuestionIndex=null;
		this.answerReview=null;
		this.selectedSubArray =null;
		this.currentSelectedSubTab=null;
		this.templateStarray=null;
		this.qstfilterArray =null;
		this.tabkeyvalue = null;
		this.allTabSelectedQuestion=null;
		this.arrayTabSelectedQuestion =null;
		this.allTabQuestions=null;
		this.arrayTabQuestions =null;
		this.finalQuestionArray=null;
		this.reviewQuestionArray=null;
		this.selectedQuestionIndexArray=null;
		this.questionsArray=null;
		this.papermarksArray=null;
		this.noquestion=null;
		this.papertimeArray=null;
		this.ELEMENT_DATA=null;
		this.QUESTION_ELEMENT_DATA=null;
		this.ESSAYQUESTION_ELEMENT_DATA=null;
		this.REVIEW_ELEMENT_DATA=null;
		this.questionDatasource =null;
		this.essayquestionDatasource =null;
		this.dataSource =null;
		this.reviewdatasource=null;
		this.selection=null;
		this.tabs=null;
		this.dialogRef=null;
		this.validInstruction=null;

		this.fbuild=null;
		this.qbankService=null;
		this.qelementService=null;
		this.route=null;
		this.router=null;
		this.htt=null;
		this.notif=null;
		this.dialog=null;
	}

	ngAfterViewInit() {
		this.dataSource.paginator = this.paginator2;
		this.dataSource.sort = this.sort2;

		this.essayquestionDatasource.paginator = this.paginator3;
		this.essayquestionDatasource.sort = this.sort3;

		this.reviewdatasource.paginator = this.paginator4;
		this.reviewdatasource.sort = this.sort4;

		this.questionDatasource.paginator = this.paginator;
		this.questionDatasource.sort = this.sort;
	}


	applyFilterQuestion(filterValue: string) {
		filterValue = filterValue.trim(); // Remove whitespace
		filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
		this.questionDatasource.filter = filterValue;
	}

	applyFilterReview(filterValue: string) {
		filterValue = filterValue.trim().toLowerCase(); this.reviewdatasource.filter = filterValue;
	}

	onTabSelection(index) {
		this.value = this.tabs[index]['heading'];
		// tslint:disable-next-line:no-eval
		eval(this.tabs[index]['select']);
	}

	constructor(
		private fbuild: FormBuilder,
		private qbankService: QbankService,
		private qelementService: QelementService,
		private route: ActivatedRoute,
		private router: Router,
		private htt: HtmlToTextService,
		private notif: NotificationService,
		public dialog: MatDialog
	) {
		this.tabs = tabJSON.express;
	}
	ngOnInit() {
		for (let i = 1; i <= 1000; i++) {
			this.papermarksArray.push(i);
		}
		for (let i = 1; i <= 300; i++) {
			this.noquestion.push(i);
		}
		for (let i = 1; i <= 300; i++) {
			this.papertimeArray.push(i);
		}
		this.buildForm();
		this.getClass();
		this.getQueryParams();
		this.getInstruction();
	}

	ngAfterViewChecked() {
		if (this.QUESTION_ELEMENT_DATA.length > 0) {
			for (const item of this.QUESTION_ELEMENT_DATA) {
				MathJax.Hub.Queue(['Typeset', MathJax.Hub, item.showHover]);
			}
		}
		if (this.ESSAYQUESTION_ELEMENT_DATA.length > 0) {
			for (const item of this.ESSAYQUESTION_ELEMENT_DATA) {
				MathJax.Hub.Queue(['Typeset', MathJax.Hub, item.showHover]);
			}
		}
	}
	addInstructionDialog(): void {
		this.dialogRef = this.dialog.open(AddInstructionComponent, {
			disableClose: true,
			width: '850px',
			data: {
				ti_id: '',
				ti_instruction: '',
				ti_tags: '',
				ti_description: '',
				tp_ti_id: ''


			}
		});
		this.dialogRef.afterClosed().subscribe(result => {
			let i = 0;
			for (const item of result) {
				if (i === 0) {
					this.express_form_one.patchValue(
						{
							'tp_ti_id': result[0].value.tp_ti_id
						}
					);
				} else {
					this.instruction_form.patchValue(
						{
							'ti_id': result[1].value.ti_id

						}
					);
				}
				i++;

			}
		});




	}



	getQueryParams() {
		if (this.route.snapshot.queryParamMap.get('qp_id')) {
			const qp_id = this.route.snapshot.queryParamMap.get('qp_id');
			this.qp_id = this.route.snapshot.queryParamMap.get('qp_id');
			this.getQuestionPaper(qp_id);
		}
	}

	getQuestionPaper(qp_id) {
		const qp_qm_id = '3';
		const qp_status = '0';
		this.qelementService.getQuestionPaper({ qp_id: qp_id, qp_qm_id: qp_qm_id, qp_status: qp_status }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					
					this.templateArray = result.data;

					const sub_arr = this.templateArray[0].tp_sub_id.replace(/ /g,'').split(',');
					const st_arr = this.templateArray[0].tp_st_id.replace(/ /g,'').split(',');
					this.express_form_one.controls.qp_name.setValue(this.templateArray[0].qp_name);
					this.express_form_one.controls.qp_class_id.setValue(this.templateArray[0].qp_class_id);
					this.getSectionsByClass();
					this.getSubjectsByClass();
					this.express_form_one.controls.qp_sec_id.setValue(this.templateArray[0].qp_sec_id);
					this.express_form_one.controls.qp_sub_id.setValue(sub_arr);
					//this.getTopicByClassSubject();
					//this.setSelectedSubject();
					this.express_form_one.controls.qp_qcount.setValue(Number(this.templateArray[0].tp_qus_count));
					this.express_form_one.controls.qp_marks.setValue(Number(this.templateArray[0].tp_marks));
					this.express_form_one.controls.qp_time_alloted.setValue(Number(this.templateArray[0].tp_time_alloted));
					this.express_form_one.controls.tp_ti_id.setValue(this.templateArray[0].tp_ti_id);
					this.instruction_form.patchValue(
						{'ti_id': this.templateArray[0].tp_ti_id}
					);
					this.templates = this.templateArray[0].filter;
					this.editTemplateFlag = true;
					this.leftmarks = 0;
					this.updateQuestionList(st_arr);
				}
			}
		);
	}

	buildForm() {
		this.express_form_one = this.fbuild.group({
			qp_qm_id: '',
			qp_name: '',
			qp_class_id: '',
			qp_sec_id: '',
			qp_sub_id: '',
			qp_marks: '',
			qp_smarks: '',
			qp_snegative_marks: '',
			qp_qcount: '',
			qp_time_alloted: '',
			tp_ti_id: '',
			filters: [],
			qlist: [],
			subtopiclist:''
		});
		this.express_form_two = this.fbuild.group({
			qp_ssub_id: '',
			qp_topic_id: '',
			qp_st_id: ''
		});
		this.instruction_form = this.fbuild.group({
			ti_id: '',
			ti_instruction: '',
			ti_tags: '',
			ti_description: ''
		});
	}

	filterData(filterValue: string) {
		const tbody = document.getElementById('expressTbody');
		const tr = tbody.getElementsByTagName('tr');

		if (filterValue.length) {
			// Loop through all table rows, and hide those who don't match the search query
			for (let i = 0; i < tr.length; i++) {
				const td = tr[i].getElementsByTagName('td');
				let trDisplay = 'none';
				let j = 0;
				for (j; j < td.length; j++) {
					if (td[j].innerText.indexOf(filterValue) > -1) {
						trDisplay = '';
					}
				}
				if (j === td.length) {
					tr[i].style.display = trDisplay;
				}
			}
		} else {
			for (let i = 0; i < tr.length; i++) {
				tr[i].style.display = '';
			}
		}
	}

	applyFilter(filterValue: string) {
		filterValue = filterValue.trim(); // Remove whitespace
		filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
		this.dataSource.filter = filterValue;
	}

	getClass() {
		this.qelementService.getClass().subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.classArray = result.data;
				}
			}
		);
	}
	getNameByclassId(id) {
		const cind = this.classArray.findIndex(item => item.class_id === id);
		if (cind !== -1) {
			return this.classArray[cind].class_name;
		}
		return '';
	}
	getNameBysecId(id) {
		if (id !== 'all') {
			const cind = this.sectionArray.findIndex(item => item.sec_id === id);
			if (cind !== -1) {
				return this.sectionArray[cind].sec_name;
			}
		}
		return 'All';
	}

	getSectionsByClass(): void {
		this.qelementService.getSectionsByClass(this.express_form_one.value.qp_class_id).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.sectionArray = result.data;
				} else {
					this.sectionArray = [];
				}
			}
		);
	}

	getSubjectsByClass(): void {
		this.subjectArray = [];
		this.qelementService.getSubjectsByClass(this.express_form_one.value.qp_class_id).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.subjectArray = result.data;
					this.setSelectedSubject();
				}
			}
		);
	}
	setSelectedSubject() {
		this.selectedSubArray = [];
		const selectedsubid = this.express_form_one.value.qp_sub_id;
		console.log(selectedsubid);
		if (selectedsubid.length > 0) {
			selectedsubid.forEach(element => {
				this.subjectArray.forEach(element1 => {
					if (element === element1.sub_id) {
						this.selectedSubArray.push(element1);
					}
				});
			});
			this.express_form_two.value.qp_ssub_id = this.selectedSubArray[0];
		}
		console.log('selected sub id');
		console.log(this.selectedSubArray);
	}

	getTopicByClassSubject(): void {
		console.log(this.express_form_two.value.qp_ssub_id);
		this.qelementService.getTopicByClassSubject(this.express_form_one.value.qp_class_id, this.express_form_two.value.qp_ssub_id).subscribe(
			(result: any) => {

				if (result && result.status === 'ok') {
					this.topicArray = result.data;
					this.subtopicArray = [];
				} else {
					this.topicArray = [];
					this.subtopicArray = [];
				}
				this.express_form_two.patchValue({
					'qp_topic_id': '',
					'qp_st_id': ''
				});
			}
		);
	}

	getSubtopicByTopic(): void {

		this.subtopicArray = [];
		this.qelementService.getSubtopicByTopic(this.express_form_two.value.qp_topic_id).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.subtopicArray = result.data;
				}
			}
		);
	}

	getQuestionTypeBySubtype(qst_id) {
		if ((Number(qst_id) < 6) || (Number(qst_id) > 12)) {
			return '2';
		} else {
			return '1';
		}
	}
	setParam(qst_id) {
		return {
			tp_name: this.express_form_one.value.qp_name,
			class_id: this.express_form_one.value.qp_class_id,
			sub_id: this.currentSelectedSubTab.sub_id,
			sec_id: this.express_form_one.value.qp_sec_id,
			tp_marks: this.express_form_one.value.tp_marks,
			tf_qcount: this.express_form_one.value.tf_qcount,
			tp_time_alloted: this.express_form_one.value.tp_time_alloted,
			status: 1,
			qst_id,
			qt_id: this.getQuestionTypeBySubtype(qst_id),
			st_id: this.stitems
		};
	}

	async updateQuestionList(stlist) {
		console.log('stlist',stlist);
		this.templateStarray=[];
		this.ELEMENT_DATA = [];
		this.templateStarray.push(stlist);
		this.showTopicSubTopicTable = true;
		this.noRecordDiv = false;
		setTimeout(() => this.dataSource.paginator = this.paginator2);
		this.qpmarks = this.express_form_one.controls.qp_marks.value;
		for (let i = 0; i < this.templateStarray[this.templateStarray.length - 1].length; i++) {
			const template: any = {};
			await this.qelementService.getSubtopicNameById((this.templateStarray[this.templateStarray.length - 1][i]).toString()).toPromise()
			.then(
				(result: any) => {
					if (result && result.status === 'ok') {
						template.qp_topic_id = result.data[0].topic_id;
						template.qp_st_id = result.data[0].st_id;
						template.qp_sub_id = result.data[0].sub_id;
						template.topic_name = result.data[0].topic_name;
						template.st_name = result.data[0].st_name;
						this.ELEMENT_DATA.push({
							position: this.startIndex, 
							topic: template.topic_name, 
							subtopic: template.st_name,
							action: template, 
							subid: (this.templateStarray[this.templateStarray.length - 1][i]).toString()
						});
						console.log('template',template);
						this.templates.push(template);
						this.stitems.push((this.templateStarray[this.templateStarray.length - 1][i]).toString());
						this.filtersArray.push({
							qf_topic_id: template.qp_topic_id,
							qf_st_id: (this.templateStarray[this.templateStarray.length - 1][i]).toString()
						});
						this.startIndex++;
					}
				}
			);			
		}
		this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
		this.dataSource.paginator = this.paginator2;
		this.sort2.sortChange.subscribe(() => this.paginator2.pageIndex = 0);
		this.dataSource.sort = this.sort2;

		console.log('this.stitems',this.stitems);
	}
	addQuestionList() {
		this.showTopicSubTopicTable = true;
		this.noRecordDiv = false;
		setTimeout(() => this.dataSource.paginator = this.paginator2);
		this.qpmarks = this.express_form_one.controls.qp_marks.value;
		if (this.express_form_one.valid && this.express_form_two.valid) {
			const template: any = {};
			template.qp_topic_id = this.express_form_two.controls.qp_topic_id.value;
			template.qp_st_id = this.express_form_two.controls.qp_st_id.value;
			template.qp_sub_id = this.express_form_two.controls.qp_ssub_id.value;

			const index = this.templateStarray.indexOf(template.qp_st_id);
			if (index === -1) {
				this.templateStarray.push(template.qp_st_id);
			} else {
				this.templateStarray.splice(index, 1);
			}


			for (let i = 0; i < this.templateStarray[this.templateStarray.length - 1].length; i++) {

				this.qelementService.getSubtopicNameById((this.templateStarray[this.templateStarray.length - 1][i]).toString()).subscribe(
					(result: any) => {
						if (result && result.status === 'ok') {
							template.topic_name = result.data[0].topic_name;
							template.st_name = result.data[0].st_name;
							const findex = this.ELEMENT_DATA.findIndex(x => x.subid === (this.templateStarray[this.templateStarray.length - 1][i]).toString());
							if (findex === -1) {
								this.ELEMENT_DATA.push({
									position: this.startIndex, topic: template.topic_name, subtopic: template.st_name,
									action: template, subid: (this.templateStarray[this.templateStarray.length - 1][i]).toString()
								});
								this.startIndex++;
								this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
								this.dataSource.paginator = this.paginator2;
								this.sort2.sortChange.subscribe(() => this.paginator2.pageIndex = 0);
								this.dataSource.sort = this.sort2;
								console.log(template);
							} else {
								this.ELEMENT_DATA.slice(findex);
							}
						}
					},
				);

				this.templates.push(template);
				const findex2 = this.stitems.indexOf((this.templateStarray[this.templateStarray.length - 1][i]).toString());

				if (findex2 === -1) {
					this.stitems.push((this.templateStarray[this.templateStarray.length - 1][i]).toString());
				} else {
					this.stitems.slice(findex2);
				}
				this.filtersArray.push({
					qf_topic_id: template.qp_topic_id,
					qf_st_id: (this.templateStarray[this.templateStarray.length - 1][i]).toString()
				});
			}

		} else {
			if (!this.express_form_one.value.qp_name) {
				this.notif.showSuccessErrorMessage('Test Name is required', 'error');
			} else if (!this.express_form_one.value.qp_class_id) {
				this.notif.showSuccessErrorMessage('Class is required', 'error');
			} else if (!this.express_form_one.value.qp_sec_id) {
				this.notif.showSuccessErrorMessage('Section is required', 'error');
			} else if (!this.express_form_one.value.qp_sub_id) {
				this.notif.showSuccessErrorMessage('Subject is required', 'error');
			} else if (!this.express_form_one.value.qp_marks) {
				this.notif.showSuccessErrorMessage('Marks is required', 'error');
			} else if (!this.express_form_one.value.qp_qcount) {
				this.notif.showSuccessErrorMessage('Questions is required', 'error');
			} else if (!this.express_form_one.value.qp_time_alloted) {
				this.notif.showSuccessErrorMessage('Time is required', 'error');
			}
		}

		console.log('this.stitems',this.stitems);
	}

	getSubTopic() { }

	resetPagination() {
		console.log('this.QUESTION_ELEMENT_DATA', this.QUESTION_ELEMENT_DATA);
		this.questionDatasource = new MatTableDataSource<QUESTIONElement>(this.QUESTION_ELEMENT_DATA);
		setTimeout(() => this.questionDatasource.paginator = this.paginator, 0);
		this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
		this.questionDatasource.sort = this.sort;
	}

	manipulateData() {
		this.QUESTION_ELEMENT_DATA = [];
		// this.questionDatasource = new MatTableDataSource<QUESTIONElement>(this.QUESTION_ELEMENT_DATA);
		const optionsArray: any[] = [];
		const hoverArray: any[] = [];

		for (let i = 0; i < this.questionsArray.length; i++) {
			optionsArray[i] = '';
			hoverArray[i] = '';
		}
		let outerId = 0;
		let ind = 1;
		let t: any;

		for (t of this.questionsArray) {
			let id = 0;
			const showHover = '';
			if (t.options) {
				for (const option of t.options) {
					if (this.currentSelectedTab === 'mcq' ||
						this.currentSelectedTab === 'mcqmr' ||
						this.currentSelectedTab === 'tf') {
						hoverArray[outerId] = (hoverArray[outerId] + (this.optionHA[id] + ':' + '&nbsp;&nbsp;' + option.qopt_options)) + '\n';
						if (option.qopt_answer === '1') {
							optionsArray[outerId] = optionsArray[outerId] + '<b>' + option.qopt_options + '</b>';
						}
					} else if (this.currentSelectedTab === 'mtf') {
						hoverArray[outerId] = (hoverArray[outerId] + this.optionHA[id] + ':' + '&nbsp;&nbsp;' +
							t.options[id].qopt_options + '\n' + this.optionmatchHA[id] + ':' + '&nbsp;&nbsp;' +
							t.options[id].qopt_options_match) + '\n';
						optionsArray[outerId] = optionsArray[outerId] + '<b>' + t.options[id].qopt_answer + '<b>' + ',';
					}
					id++;
				}
			} else {
				if (this.currentSelectedTab === 'single') {
					// tslint:disable-next-line:max-line-length
					optionsArray[outerId] = '<button mat-icon style=\'border-radius:50% !important;border:none !important;color:white;font-weight:bold !important;color:white !important;color:white;background-color:#6c65c8 !important;height:40px !important;width:40px !important\'>'
						+ t.qopt_answer + '</button>';
				} else if (this.currentSelectedTab === 'double') {
					// tslint:disable-next-line:max-line-length
					optionsArray[outerId] = '<button mat-icon style=\'border-radius:50% !important;border:none !important;color:white;font-weight:bold !important;color:white !important;color:white;background-color:#6c65c8 !important;height:40px !important;width:40px !important\'>'
						+ t.qopt_answer.charAt(0) + '</button>' +
						// tslint:disable-next-line:max-line-length
						'<button mat-icon style=\'border-radius:50% !important;border:none !important;color:white;font-weight:bold !important;color:white !important;color:white;background-color:#6c65c8 !important;height:40px !important;width:40px !important\'>'
						+ t.qopt_answer.charAt(1) + '</button>';
				}
			}
			outerId++;
			this.QUESTION_ELEMENT_DATA.push({
				select: ind - 1,
				position: ind,
				question: t.qus_name,
				options: optionsArray[ind - 1],
				explanations: t.qus_explanation,
				skillType: t.skill_name,
				topic: t.topic_name,
				subtopic: t.st_name,
				suggestedMarks: t.qus_marks,
				reference: t.qus_historical_reference,
				showHover: hoverArray[ind - 1]
			});
			ind++;
		}
		this.resetPagination();
	}
	manipulateEssayData() {
		this.ESSAYQUESTION_ELEMENT_DATA = [];
		this.essayquestionDatasource = new MatTableDataSource<ESSAYQUESTIONElement>(this.ESSAYQUESTION_ELEMENT_DATA);
		const optionsArray: any[] = [];
		const hoverArray: any[] = [];

		for (let i = 0; i < this.questionsArray.length; i++) {
			optionsArray[i] = '';
			hoverArray[i] = '';
		}
		let outerId = 0;
		let ind = 1;
		let t: any;

		for (t of this.questionsArray) {
			let id = 0;
			const showHover = '';
			if (t.options) {
				for (const option of t.options) {
					if (Number(t.qus_qst_id) === 1 ||
						Number(t.qus_qst_id) === 2 ||
						Number(t.qus_qst_id) === 3) {
						hoverArray[outerId] = (hoverArray[outerId] + (this.optionHA[id] + ':' + '&nbsp;&nbsp;' + option.qopt_options)) + '\n';
						if (option.qopt_answer === '1') {
							optionsArray[outerId] = optionsArray[outerId] + '<b>' + option.qopt_options + '</b>';
						}
					} else if (Number(t.qus_qst_id) === 4) {
						hoverArray[outerId] = (hoverArray[outerId] + this.optionHA[id] + ':' + '&nbsp;&nbsp;' +
							t.options[id].qopt_options + '\n' + this.optionmatchHA[id] + ':' + '&nbsp;&nbsp;' +
							t.options[id].qopt_options_match) + '\n';
						optionsArray[outerId] = optionsArray[outerId] + '<b>' + t.options[id].qopt_answer + '<b>' + '<br>';
					} else if (Number(t.qus_qst_id) === 5) {
						hoverArray[outerId] = (hoverArray[outerId] + this.optionHA[id] + ':' + '&nbsp;&nbsp;' +
							t.options[id].qopt_options + '\n' + this.optionmatchHA[id] + ':' + '&nbsp;&nbsp;' +
							t.options_match[id].qopt_options_match) + '\n';
						const eachanswer = t.answer[id];
						let ansstring = '';
						for (let ansi = 0; ansi < eachanswer.length; ansi++) {
							if (eachanswer[ansi].qopt_answer === '1') {
								ansstring = ansstring + this.optionmatchHA[ansi] + ' ';
							}
						}
						optionsArray[outerId] = optionsArray[outerId] + '<b>' + ansstring + '<b>' + '<br>';
					} else if (Number(t.qus_qst_id) === 13) {
						hoverArray[outerId] = (hoverArray[outerId] + this.optionHA[id] + ':' + '&nbsp;&nbsp;' +
							t.options[id].qopt_options + '\n' + this.optionmatchHA[id] + ':' + '&nbsp;&nbsp;' +
							t.options_match[id].qopt_options_match) + '\n';
						const eachanswer = t.answer[id];
						let ansstring = '';
						for (let ansi = 0; ansi < eachanswer.length; ansi++) {
							if (eachanswer[ansi].qopt_answer === '1') {
								ansstring = ansstring + this.optionmatchHA[ansi] + ' ';
							}
						}
						optionsArray[outerId] = optionsArray[outerId] + '<b>' + ansstring + '<b>' + '<br>';
					}

					// End

					id++;
					if (id === 4 && Number(t.qus_qst_id) === 13) {
						hoverArray[outerId] = hoverArray[outerId] + this.optionmatchHA[id] + ':' + '&nbsp;&nbsp;' +
							t.options_match[id].qopt_options_match;
					}
				}
			} else {
				if (Number(t.qus_qst_id) > 5 && Number(t.qus_qst_id) < 13) {
					optionsArray[outerId] = t.qopt_answer;
				}
				if (Number(t.qus_qst_id) === 14) {
					// tslint:disable-next-line:max-line-length
					optionsArray[outerId] = '<button mat-icon style=\'border-radius:50% !important;border:none !important;color:white;font-weight:bold !important;color:white !important;color:white;background-color:#6c65c8 !important;height:40px !important;width:40px !important\'>'
						+ t.qopt_answer + '</button>';
				}
				if (Number(t.qus_qst_id) === 15) {
					// tslint:disable-next-line:max-line-length
					optionsArray[outerId] = '<button mat-icon style=\'border-radius:50% !important;border:none !important;color:white;font-weight:bold !important;color:white !important;color:white;background-color:#6c65c8 !important;height:40px !important;width:40px !important\'>'
						+ t.qopt_answer.charAt(0) + '</button>' +
						// tslint:disable-next-line:max-line-length
						'<button mat-icon style=\'border-radius:50% !important;border:none !important;color:white;font-weight:bold !important;color:white !important;color:white;background-color:#6c65c8 !important;height:40px !important;width:40px !important\'>'
						+ t.qopt_answer.charAt(1) + '</button>';
				}
				id++;
			}

			outerId++;
			this.ESSAYQUESTION_ELEMENT_DATA.push({
				select: ind - 1,
				position: ind,
				question: t.qus_name,
				options: optionsArray[ind - 1],
				essayTitle: t.ess_title,
				explanations: t.qus_explanation,
				skillType: t.skill_name,
				topic: t.topic_name,
				subtopic: t.st_name,
				suggestedMarks: t.qus_marks,
				reference: t.qus_historical_reference,
				showHover: hoverArray[ind - 1]
			});
			ind++;
			this.essayquestionDatasource = new MatTableDataSource<ESSAYQUESTIONElement>(this.ESSAYQUESTION_ELEMENT_DATA);
			this.essayquestionDatasource.paginator = this.paginator3;
			this.sort3.sortChange.subscribe(() => this.paginator3.pageIndex = 0);
			this.essayquestionDatasource.sort = this.sort3;
		}
	}

	manipulateDataWithoutHover(tabId) {
		this.QUESTION_ELEMENT_DATA = [];
		this.questionDatasource = new MatTableDataSource<QUESTIONElement>(this.QUESTION_ELEMENT_DATA);

		let ind = 1;
		let t: any;

		for (t of this.questionsArray) {
			this.QUESTION_ELEMENT_DATA.push({
				select: ind - 1,
				position: ind,
				question: t.qus_name,
				options: t.qopt_answer,
				explanations: t.qus_explanation,
				skillType: t.qus_skill_id,
				topic: t.topic_name,
				subtopic: t.st_name,
				suggestedMarks: t.qus_marks,
				reference: t.qus_historical_reference,
				showHover: t.qopt_answer
			});

			ind++;
			this.resetPagination();
		}

	}

	getMcqQuestion() {
		console.log('calling getMcqQuestion');
		this.currentSelectedTab = 'mcq';
		this.questionsArray = [];
		const param: any = this.setParam(1);
		if (this.express_form_one.value.qp_sub_id) {
			if (this.arrayTabQuestions[this.currentSelectedSubIndex]['mcq'].length < 1) {
				this.qelementService.getQuestionsInTemplate(param).subscribe(
					(result: any) => {
						if (result && result.status === 'ok') {
							this.questionsArray = result.data;
							this.arrayTabQuestions[this.currentSelectedSubIndex]['mcq'] = result.data;
							console.log(this.arrayTabQuestions[this.currentSelectedSubIndex]['mcq']);
							this.manipulateData();
						} else {
							this.questionsArray = [];
							this.QUESTION_ELEMENT_DATA = [];
							this.questionDatasource = new MatTableDataSource<QUESTIONElement>(this.QUESTION_ELEMENT_DATA);
							this.notif.showSuccessErrorMessage('No record found for MCQ', 'error');
							this.resetPagination();
						}
					}
				);
			} else {
				console.log('this.arrayTabQuestions mcq', this.arrayTabQuestions[this.currentSelectedSubIndex]['mcq']);
				this.questionsArray = this.arrayTabQuestions[this.currentSelectedSubIndex]['mcq'];
				this.manipulateData();
			}
		}
	}

	getMcqmrQuestion() {
		this.currentSelectedTab = 'mcqmr';
		this.questionsArray = [];
		const param: any = this.setParam(2);
		if (this.express_form_one.value.qp_sub_id) {
			if (this.arrayTabQuestions[this.currentSelectedSubIndex]['mcqmr'].length < 1) {
				this.qelementService.getQuestionsInTemplate(param).subscribe(
					(result: any) => {
						if (result && result.status === 'ok') {
							this.questionsArray = [];
							this.questionsArray = result.data;
							this.arrayTabQuestions[this.currentSelectedSubIndex]['mcqmr'] = result.data;
							this.manipulateData();
						} else {
							this.questionsArray = [];
							this.QUESTION_ELEMENT_DATA = [];
							this.questionDatasource = new MatTableDataSource<QUESTIONElement>(this.QUESTION_ELEMENT_DATA);
							this.notif.showSuccessErrorMessage('No record found for MCQ-MR', 'error');
							this.resetPagination();
						}
					}
				);
			} else {
				this.questionsArray = this.arrayTabQuestions[this.currentSelectedSubIndex]['mcqmr'];
				this.manipulateData();
			}
		}
	}

	getMatrixQuestion() {
		this.currentSelectedTab = 'matrix';
		this.questionsArray = [];
		const param: any = this.setParam(5);
		if (this.express_form_one.value.qp_sub_id) {
			if (this.arrayTabQuestions[this.currentSelectedSubIndex]['matrix'].length < 1) {
				this.qelementService.getQuestionsInTemplate(param).subscribe(
					(result: any) => {
						if (result && result.status === 'ok') {
							this.questionsArray = result.data;
							this.arrayTabQuestions[this.currentSelectedSubIndex]['matrix'] = result.data;
							this.QUESTION_ELEMENT_DATA = [];
							this.questionDatasource = new MatTableDataSource<QUESTIONElement>(this.QUESTION_ELEMENT_DATA);
							const optionsArray6: any[] = [];
							const hoverArray: any[] = [];
							const matchArray: any[] = [];
							const answerArray: any[] = [];
							const answerArray3: any[] = [];

							for (let i = 0; i < this.questionsArray.length; i++) {
								optionsArray6[i] = '';
								matchArray[i] = '';
								answerArray[i] = '';
							}
							let sixthId = 0;
							let seventhId = 0;
							const eighthId = 0;
							let ninthId = 0;
							let ind6 = 1;
							let t: any;
							const id15 = 0;

							for (t of this.questionsArray) {
								let id7 = 0;
								let id8 = 0;
								let id9 = 0;
								const id10 = 0;
								const id11 = 0;
								const id12 = 0;
								let id13;
								const id14 = 0;
								let tenthId = 0;

								for (const option of t.options) {
									optionsArray6[sixthId] = optionsArray6[sixthId] + this.optionHA[id7] + ':' + option.qopt_options;
									id7++;
								}
								sixthId++;
								for (const option_match of t.options_match) {
									matchArray[seventhId] = matchArray[seventhId] + this.optionmatchHA[id8] + ':' + option_match.qopt_options_match;
									id8++;
								}
								seventhId++;
								for (const answerrow of t.answer) {
									id13 = 0;
									let answerText: any = '';
									while (id13 < 4) {
										if (answerrow[id13].qopt_answer === '1') {
											answerArray3[tenthId] = answerText + this.optionmatchHA[id13];
											answerText = answerText + this.optionmatchHA[id13];
										} else {
											answerArray3[tenthId] = answerText + '';
										}
										id13++;
									}
									tenthId++;
									hoverArray[ninthId] = (optionsArray6[ninthId] + '\n' + matchArray[ninthId]);
									answerArray[ninthId] = (answerArray[ninthId] + '<b>' + answerArray3[id9] + '</b>') + ',' + ' ';
									id9++;
								}
								ninthId++;
								this.QUESTION_ELEMENT_DATA.push({
									select: ind6 - 1,
									position: ind6,
									question: t.qus_name,
									options: answerArray[ind6 - 1],
									explanations: t.qus_explanation,
									skillType: t.skill_name,
									topic: t.topic_name,
									subtopic: t.st_name,
									suggestedMarks: t.qus_marks,
									reference: t.qus_historical_reference,
									showHover: hoverArray[ind6 - 1]
								});
								ind6++;

							}
						} else {
							this.questionsArray = [];
							this.QUESTION_ELEMENT_DATA = [];
							this.questionDatasource = new MatTableDataSource<QUESTIONElement>(this.QUESTION_ELEMENT_DATA);
							this.notif.showSuccessErrorMessage('No record found for Matrix', 'error');
						}
						this.resetPagination();
					}
				);
			} else {
				this.questionsArray = this.arrayTabQuestions[this.currentSelectedSubIndex]['matrix'];
				this.QUESTION_ELEMENT_DATA = [];
				this.questionDatasource = new MatTableDataSource<QUESTIONElement>(this.QUESTION_ELEMENT_DATA);
				const optionsArray6: any[] = [];
				const hoverArray: any[] = [];
				const matchArray: any[] = [];
				const answerArray: any[] = [];
				const answerArray3: any[] = [];

				for (let i = 0; i < this.questionsArray.length; i++) {
					optionsArray6[i] = '';
					matchArray[i] = '';
					answerArray[i] = '';
				}
				let sixthId = 0;
				let seventhId = 0;
				const eighthId = 0;
				let ninthId = 0;
				let ind6 = 1;
				let t: any;
				const id15 = 0;

				for (t of this.questionsArray) {
					let id7 = 0;
					let id8 = 0;
					let id9 = 0;
					const id10 = 0;
					const id11 = 0;
					const id12 = 0;
					let id13;
					const id14 = 0;
					let tenthId = 0;

					for (const option of t.options) {
						optionsArray6[sixthId] = optionsArray6[sixthId] + this.optionHA[id7] + ':' + option.qopt_options;
						id7++;
					}
					sixthId++;
					for (const option_match of t.options_match) {
						matchArray[seventhId] = matchArray[seventhId] + this.optionmatchHA[id8] + ':' + option_match.qopt_options_match;
						id8++;
					}
					seventhId++;
					for (const answerrow of t.answer) {
						id13 = 0;
						let answerText: any = '';
						while (id13 < 4) {
							if (answerrow[id13].qopt_answer === '1') {
								answerArray3[tenthId] = answerText + this.optionmatchHA[id13];
								answerText = answerText + this.optionmatchHA[id13];
							} else {
								answerArray3[tenthId] = answerText + '';
							}
							id13++;
						}
						tenthId++;
						hoverArray[ninthId] = (optionsArray6[ninthId] + '\n' + matchArray[ninthId]);
						answerArray[ninthId] = (answerArray[ninthId] + '<b>' + answerArray3[id9] + '</b>') + ',' + ' ';
						id9++;
					}
					ninthId++;
					this.QUESTION_ELEMENT_DATA.push({
						select: ind6 - 1,
						position: ind6,
						question: t.qus_name,
						options: answerArray[ind6 - 1],
						explanations: t.qus_explanation,
						skillType: t.skill_name,
						topic: t.topic_name,
						subtopic: t.st_name,
						suggestedMarks: t.qus_marks,
						reference: t.qus_historical_reference,
						showHover: hoverArray[ind6 - 1]
					});
					ind6++;
					this.resetPagination();
				}
			}
		}
	}

	getMatrix45Question() {
		this.currentSelectedTab = 'matrix45';
		this.questionsArray = [];
		const param: any = this.setParam(13);
		if (this.express_form_one.value.qp_sub_id) {
			if (this.arrayTabQuestions[this.currentSelectedSubIndex]['matrix45'].length < 1) {
				this.qelementService.getQuestionsInTemplate(param).subscribe(
					(result: any) => {
						if (result && result.status === 'ok') {
							this.questionsArray = result.data;
							this.arrayTabQuestions[this.currentSelectedSubIndex]['matrix45'] = result.data;
							this.QUESTION_ELEMENT_DATA = [];
							this.questionDatasource = new MatTableDataSource<QUESTIONElement>(this.QUESTION_ELEMENT_DATA);
							const optionsArray6: any[] = [];
							const hoverArray: any[] = [];
							const matchArray: any[] = [];
							const answerArray: any[] = [];
							const answerArray2: any[] = [];
							const answerArray3: any[] = [];
							for (let i = 0; i < this.questionsArray.length; i++) {
								optionsArray6[i] = '';
								matchArray[i] = '';
								answerArray[i] = '';
								answerArray3[i] = '';
							}
							let sixthId = 0;
							let seventhId = 0;
							let ninthId = 0;
							answerArray3[0] = '';
							answerArray3[1] = '';
							answerArray3[2] = '';
							answerArray3[3] = '';
							let ind6 = 1;
							let t: any;
							for (t of this.questionsArray) {
								let id7 = 0;
								let id8 = 0;
								let id9 = 0;
								let id13;
								let tenthId = 0;
								for (let i = 0; i < this.questionsArray.length; i++) {
									answerArray3[i] = '';
									answerArray3[3] = '';
								}
								for (const option of t.options) {
									optionsArray6[sixthId] = optionsArray6[sixthId] + this.optionHA[id7] + ':' + option.qopt_options;
									id7++;
								}
								sixthId++;
								for (const option_match of t.options_match) {
									matchArray[seventhId] = matchArray[seventhId] + this.optionmatchHA[id8] + ':' + option_match.qopt_options_match;
									id8++;
								}
								seventhId++;
								for (const answerrow of t.answer) {
									id13 = 0;
									let answerText = '';
									for (const answer of answerrow) {
										if (answer.qopt_answer === '1') {
											answerArray3[tenthId] = answerText + this.optionmatchHA[id13];
											answerText = answerText + this.optionmatchHA[id13];
										} else {
											answerArray3[tenthId] = answerText + '';
										}
										id13++;
									}
									tenthId++;
								}
								while (id9 < 4) {
									hoverArray[ninthId] = (optionsArray6[ninthId] + '\n' + matchArray[ninthId]) + '\n';
									answerArray[ninthId] = (answerArray[ninthId] + '<b>' + answerArray3[id9] + '</b>') + '<br>';
									id9++;
								}
								ninthId++;
								this.QUESTION_ELEMENT_DATA.push({
									select: ind6 - 1,
									position: ind6,
									question: t.qus_name,
									options: answerArray[ind6 - 1],
									explanations: t.qus_explanation,
									skillType: t.skill_name,
									topic: t.topic_name,
									subtopic: t.st_name,
									suggestedMarks: t.qus_marks,
									reference: t.qus_historical_reference,
									showHover: hoverArray[ind6 - 1]
								});
								ind6++;
							}


						} else {
							this.questionsArray = [];
							this.QUESTION_ELEMENT_DATA = [];
							this.questionDatasource = new MatTableDataSource<QUESTIONElement>(this.QUESTION_ELEMENT_DATA);
							this.notif.showSuccessErrorMessage('No record found for Matrix 4 X 5', 'error');
						}
						this.resetPagination();
					});
			} else {
				this.questionsArray = this.arrayTabQuestions[this.currentSelectedSubIndex]['matrix45'];
				this.QUESTION_ELEMENT_DATA = [];
				this.questionDatasource = new MatTableDataSource<QUESTIONElement>(this.QUESTION_ELEMENT_DATA);
				const optionsArray6: any[] = [];
				const hoverArray: any[] = [];
				const matchArray: any[] = [];
				const answerArray: any[] = [];
				const answerArray2: any[] = [];
				const answerArray3: any[] = [];
				for (let i = 0; i < this.questionsArray.length; i++) {
					optionsArray6[i] = '';
					matchArray[i] = '';
					answerArray[i] = '';
					answerArray3[i] = '';
				}
				let sixthId = 0;
				let seventhId = 0;
				let ninthId = 0;
				answerArray3[0] = '';
				answerArray3[1] = '';
				answerArray3[2] = '';
				answerArray3[3] = '';
				let ind6 = 1;
				let t: any;
				for (t of this.questionsArray) {
					let id7 = 0;
					let id8 = 0;
					let id9 = 0;
					let id13;
					let tenthId = 0;
					for (let i = 0; i < this.questionsArray.length; i++) {
						answerArray3[i] = '';
						answerArray3[3] = '';
					}
					for (const option of t.options) {
						optionsArray6[sixthId] = optionsArray6[sixthId] + this.optionHA[id7] + ':' + option.qopt_options;
						id7++;
					}
					sixthId++;
					for (const option_match of t.options_match) {
						matchArray[seventhId] = matchArray[seventhId] + this.optionmatchHA[id8] + ':' + option_match.qopt_options_match;
						id8++;
					}
					seventhId++;
					for (const answerrow of t.answer) {
						id13 = 0;
						let answerText = '';
						for (const answer of answerrow) {
							if (answer.qopt_answer === '1') {
								answerArray3[tenthId] = answerText + this.optionmatchHA[id13];
								answerText = answerText + this.optionmatchHA[id13];
							} else {
								answerArray3[tenthId] = answerText + '';
							}
							id13++;
						}
						tenthId++;
					}
					while (id9 < 4) {
						hoverArray[ninthId] = (optionsArray6[ninthId] + '\n' + matchArray[ninthId]) + '\n';
						answerArray[ninthId] = (answerArray[ninthId] + '<b>' + answerArray3[id9] + '</b>') + '<br>';
						id9++;
					}
					ninthId++;
					this.QUESTION_ELEMENT_DATA.push({
						select: ind6 - 1,
						position: ind6,
						question: t.qus_name,
						options: answerArray[ind6 - 1],
						explanations: t.qus_explanation,
						skillType: t.skill_name,
						topic: t.topic_name,
						subtopic: t.st_name,
						suggestedMarks: t.qus_marks,
						reference: t.qus_historical_reference,
						showHover: hoverArray[ind6 - 1]
					});
					ind6++;
				}
				this.resetPagination();
			}
		}
	}

	getMtfQuestion() {
		this.currentSelectedTab = 'mtf';
		this.questionsArray = [];
		const param: any = this.setParam(4);
		if (this.express_form_one.value.qp_sub_id) {
			if (this.arrayTabQuestions[this.currentSelectedSubIndex]['mtf'].length < 1) {
				this.qelementService.getQuestionsInTemplate(param).subscribe(
					(result: any) => {
						if (result && result.status === 'ok') {
							this.questionsArray = result.data;
							this.arrayTabQuestions[this.currentSelectedSubIndex]['mtf'] = result.data;
							this.manipulateData();
						} else {
							this.questionsArray = [];
							this.QUESTION_ELEMENT_DATA = [];
							this.questionDatasource = new MatTableDataSource<QUESTIONElement>(this.QUESTION_ELEMENT_DATA);
							this.notif.showSuccessErrorMessage('No record found for MTF', 'error');
							this.resetPagination();
						}
					}
				);
			} else {
				this.questionsArray = this.arrayTabQuestions[this.currentSelectedSubIndex]['mtf'];
				this.manipulateData();
			}
		}
	}

	getTfQuestion() {
		this.currentSelectedTab = 'tf';
		this.questionsArray = [];
		const param: any = this.setParam(3);

		if (this.express_form_one.value.qp_sub_id) {
			if (this.arrayTabQuestions[this.currentSelectedSubIndex]['tf'].length < 1) {
				this.qelementService.getQuestionsInTemplate(param).subscribe(
					(result: any) => {
						if (result && result.status === 'ok') {
							this.questionsArray = result.data;
							this.arrayTabQuestions[this.currentSelectedSubIndex]['tf'] = result.data;
							this.manipulateData();
						} else {
							this.questionsArray = [];
							this.QUESTION_ELEMENT_DATA = [];
							this.questionDatasource = new MatTableDataSource<QUESTIONElement>(this.QUESTION_ELEMENT_DATA);
							this.notif.showSuccessErrorMessage('No record found for True/False', 'error');
							this.resetPagination();
						}
					}
				);
			} else {
				this.questionsArray = this.arrayTabQuestions[this.currentSelectedSubIndex]['tf'];
				this.manipulateData();
			}
		}
	}
	getSIQuestion() {
		this.currentSelectedTab = 'single';
		this.questionsArray = [];
		const param: any = this.setParam(14);
		if (this.express_form_one.value.qp_sub_id) {
			if (this.arrayTabQuestions[this.currentSelectedSubIndex]['single'].length < 1) {
				this.qelementService.getQuestionsInTemplate(param).subscribe(
					(result: any) => {
						if (result && result.status === 'ok') {
							this.questionsArray = result.data;
							this.arrayTabQuestions[this.currentSelectedSubIndex]['single'] = result.data;
							console.log(this.arrayTabQuestions[this.currentSelectedSubIndex]['single']);
							this.manipulateData();
						} else {
							this.questionsArray = [];
							this.QUESTION_ELEMENT_DATA = [];
							this.questionDatasource = new MatTableDataSource<QUESTIONElement>(this.QUESTION_ELEMENT_DATA);
							this.notif.showSuccessErrorMessage('No record found for Single', 'error');
							this.resetPagination();
						}
					}
				);
			} else {
				this.questionsArray = this.arrayTabQuestions[this.currentSelectedSubIndex]['single'];
				this.manipulateData();
			}
		}
	}
	getDIQuestion() {
		this.currentSelectedTab = 'double';
		this.questionsArray = [];
		const param: any = this.setParam(15);
		if (this.express_form_one.value.qp_sub_id) {
			if (this.arrayTabQuestions[this.currentSelectedSubIndex]['double'].length < 1) {
				this.qelementService.getQuestionsInTemplate(param).subscribe(
					(result: any) => {
						if (result && result.status === 'ok') {
							this.questionsArray = result.data;
							this.arrayTabQuestions[this.currentSelectedSubIndex]['double'] = result.data;
							console.log(this.arrayTabQuestions[this.currentSelectedSubIndex]['double']);
							this.manipulateData();
						} else {
							this.questionsArray = [];
							this.QUESTION_ELEMENT_DATA = [];
							this.questionDatasource = new MatTableDataSource<QUESTIONElement>(this.QUESTION_ELEMENT_DATA);
							this.notif.showSuccessErrorMessage('No record found for Double', 'error');
							this.resetPagination();
						}
					}
				);
			} else {
				this.questionsArray = this.arrayTabQuestions[this.currentSelectedSubIndex]['double'];
				this.manipulateData();
			}
		}
	}

	getIdentifyQuestion() {
		this.currentSelectedTab = 'identify';
		this.questionsArray = [];
		const param: any = this.setParam(7);
		if (this.express_form_one.value.qp_sub_id) {
			if (this.arrayTabQuestions[this.currentSelectedSubIndex]['identify'].length < 1) {
				this.qelementService.getQuestionsInTemplate(param).subscribe(
					(result: any) => {
						if (result && result.status === 'ok') {
							this.questionsArray = result.data;
							this.arrayTabQuestions[this.currentSelectedSubIndex]['identify'] = result.data;
							this.manipulateDataWithoutHover(5);
						} else {
							this.questionsArray = [];
							this.QUESTION_ELEMENT_DATA = [];
							this.questionDatasource = new MatTableDataSource<QUESTIONElement>(this.QUESTION_ELEMENT_DATA);
							this.notif.showSuccessErrorMessage('No record found for Identify', 'error');
							this.resetPagination();
						}
					}
				);
			} else {
				this.questionsArray = this.arrayTabQuestions[this.currentSelectedSubIndex]['identify'];
				this.manipulateDataWithoutHover(5);
			}
		}
	}

	getOnelineQuestion() {
		this.currentSelectedTab = 'oneline';
		this.questionsArray = [];
		const param: any = this.setParam(8);

		if (this.express_form_one.value.qp_sub_id) {
			if (this.arrayTabQuestions[this.currentSelectedSubIndex]['oneline'].length < 1) {
				this.qelementService.getQuestionsInTemplate(param).subscribe(
					(result: any) => {
						if (result && result.status === 'ok') {
							this.questionsArray = result.data;
							this.arrayTabQuestions[this.currentSelectedSubIndex]['oneline'] = result.data;
							this.manipulateDataWithoutHover(6);
						} else {
							this.questionsArray = [];
							this.QUESTION_ELEMENT_DATA = [];
							this.questionDatasource = new MatTableDataSource<QUESTIONElement>(this.QUESTION_ELEMENT_DATA);
							this.notif.showSuccessErrorMessage('No record found for Oneline', 'error');
							this.resetPagination();
						}
					}
				);
			} else {
				this.questionsArray = this.arrayTabQuestions[this.currentSelectedSubIndex]['oneline'];
				this.manipulateDataWithoutHover(6);
			}
		}
	}

	getFillInTheBlankQuestion() {
		this.currentSelectedTab = 'fill';
		this.questionsArray = [];
		const param: any = this.setParam(6);
		if (this.express_form_one.value.qp_sub_id) {
			if (this.arrayTabQuestions[this.currentSelectedSubIndex]['fill'].length < 1) {
				this.qelementService.getQuestionsInTemplate(param).subscribe(
					(result: any) => {
						if (result && result.status === 'ok') {
							this.questionsArray = result.data;
							this.arrayTabQuestions[this.currentSelectedSubIndex]['fill'] = result.data;
							this.manipulateDataWithoutHover(7);
						} else {
							this.questionsArray = [];
							this.QUESTION_ELEMENT_DATA = [];
							this.questionDatasource = new MatTableDataSource<QUESTIONElement>(this.QUESTION_ELEMENT_DATA);
							this.notif.showSuccessErrorMessage('No record found for Fill in the blanks', 'error');
							this.resetPagination();
						}
					}
				);
			} else {
				this.questionsArray = this.arrayTabQuestions[this.currentSelectedSubIndex]['fill'];
				this.manipulateDataWithoutHover(7);
			}
		}
	}

	getShortAnswer() {
		this.currentSelectedTab = 'short';
		this.questionsArray = [];
		const param: any = this.setParam(9);
		if (this.express_form_one.value.qp_sub_id) {
			if (this.arrayTabQuestions[this.currentSelectedSubIndex]['short'].length < 1) {
				this.qelementService.getQuestionsInTemplate(param).subscribe(
					(result: any) => {
						if (result && result.status === 'ok') {
							this.questionsArray = result.data;
							this.arrayTabQuestions[this.currentSelectedSubIndex]['short'] = result.data;
							this.manipulateDataWithoutHover(8);
						} else {
							this.questionsArray = [];
							this.QUESTION_ELEMENT_DATA = [];
							this.questionDatasource = new MatTableDataSource<QUESTIONElement>(this.QUESTION_ELEMENT_DATA);
							this.notif.showSuccessErrorMessage('No record found for Short', 'error');
							this.resetPagination();
						}
					}
				);
			} else {
				this.questionsArray = this.arrayTabQuestions[this.currentSelectedSubIndex]['short'];
				this.manipulateDataWithoutHover(8);
			}
		}
	}

	getVeryShortQuestion() {
		this.currentSelectedTab = 'veryshort';
		this.questionsArray = [];
		const param: any = this.setParam(10);
		if (this.express_form_one.value.qp_sub_id) {
			if (this.arrayTabQuestions[this.currentSelectedSubIndex]['veryshort'].length < 1) {
				this.qelementService.getQuestionsInTemplate(param).subscribe(
					(result: any) => {
						if (result && result.status === 'ok') {
							this.questionsArray = result.data;
							this.arrayTabQuestions[this.currentSelectedSubIndex]['veryshort'] = result.data;
							this.manipulateDataWithoutHover(9);
						} else {
							this.questionsArray = [];
							this.QUESTION_ELEMENT_DATA = [];
							this.questionDatasource = new MatTableDataSource<QUESTIONElement>(this.QUESTION_ELEMENT_DATA);
							this.notif.showSuccessErrorMessage('No record found for Very Short', 'error');
							this.resetPagination();
						}
					}
				);
			} else {
				this.questionsArray = this.arrayTabQuestions[this.currentSelectedSubIndex]['veryshort'];
				this.manipulateDataWithoutHover(9);
			}
		}
	}

	getLongQuestion() {
		this.currentSelectedTab = 'long';
		this.questionsArray = [];
		const param: any = this.setParam(11);

		if (this.express_form_one.value.qp_sub_id) {
			if (this.arrayTabQuestions[this.currentSelectedSubIndex]['long'].length < 1) {
				this.qelementService.getQuestionsInTemplate(param).subscribe(
					(result: any) => {
						if (result && result.status === 'ok') {
							this.questionsArray = result.data;
							this.arrayTabQuestions[this.currentSelectedSubIndex]['long'] = result.data;
							// this.manipulateDataWithoutHover(5);
							this.manipulateDataWithoutHover(10);
						} else {
							this.QUESTION_ELEMENT_DATA = [];
							this.questionDatasource = new MatTableDataSource<QUESTIONElement>(this.QUESTION_ELEMENT_DATA);
							this.questionsArray = [];
							this.notif.showSuccessErrorMessage('No record found for Long', 'error');
							this.resetPagination();
						}
					}
				);
			} else {
				this.questionsArray = this.arrayTabQuestions[this.currentSelectedSubIndex]['long'];
				this.manipulateDataWithoutHover(10);
			}
		}
	}

	getVeryLongQuestion() {
		this.currentSelectedTab = 'verylong';
		this.questionsArray = [];
		const param: any = this.setParam(12);

		if (this.express_form_one.value.qp_sub_id) {
			if (this.arrayTabQuestions[this.currentSelectedSubIndex]['verylong'].length < 1) {
				this.qelementService.getQuestionsInTemplate(param).subscribe(
					(result: any) => {
						if (result && result.status === 'ok') {
							this.questionsArray = result.data;
							this.arrayTabQuestions[this.currentSelectedSubIndex]['verylong'] = result.data;
							this.manipulateDataWithoutHover(11);
						} else {
							this.questionsArray = [];
							this.QUESTION_ELEMENT_DATA = [];
							this.questionDatasource = new MatTableDataSource<QUESTIONElement>(this.QUESTION_ELEMENT_DATA);
							this.notif.showSuccessErrorMessage('No record found for Very Long', 'error');
							this.resetPagination();
						}
					}
				);
			} else {
				this.questionsArray = this.arrayTabQuestions[this.currentSelectedSubIndex]['verylong'];
				this.manipulateDataWithoutHover(11);
			}
		}
	}
	getEssayQuestion() {
		this.currentSelectedTab = 'essay';
		this.questionsArray = [];
		const param: any = {
			tp_name: this.express_form_one.value.qp_name,
			class_id: this.express_form_one.value.qp_class_id,
			sub_id: this.currentSelectedSubTab.sub_id,
			sec_id: this.express_form_one.value.qp_sec_id,
			tp_marks: this.express_form_one.value.tp_marks,
			tf_qcount: this.express_form_one.value.tf_qcount,
			tp_time_alloted: this.express_form_one.value.tp_time_alloted,
			status: 1,
			qt_id: '3',
			st_id: this.stitems
		};

		if (this.express_form_one.value.qp_sub_id) {
			if (this.arrayTabQuestions[this.currentSelectedSubIndex]['essay'].length < 1) {
				this.qelementService.getQuestionsInTemplate(param).subscribe(
					(result: any) => {
						if (result && result.status === 'ok') {
							this.questionsArray = result.data;
							this.arrayTabQuestions[this.currentSelectedSubIndex]['essay'] = result.data;
							this.manipulateEssayData();
						} else {
							this.questionsArray = [];
							this.ESSAYQUESTION_ELEMENT_DATA = [];
							this.essayquestionDatasource = new MatTableDataSource<ESSAYQUESTIONElement>(this.ESSAYQUESTION_ELEMENT_DATA);
							this.notif.showSuccessErrorMessage('No record found for Essay', 'error');
						}
					}
				);
			} else {
				this.questionsArray = this.arrayTabQuestions[this.currentSelectedSubIndex]['essay'];
				this.manipulateEssayData();
			}
		}
	}

	resetpaper() {
		this.finalQuestionArray = [];
	}

	deleteQuestionList(deletei: number) {
		if (!this.questionReviewDiv) {
			let k = 0;
			for (const item of this.templateStarray[this.templateStarray.length - 1]) {
				if (item === this.ELEMENT_DATA[deletei].subid) {
					const selectedIndex = this.express_form_two.controls.qp_st_id.value && this.express_form_two.controls.qp_st_id.value.indexOf(item);
					if (selectedIndex > -1) {
						const newToppingsValue = this.express_form_two.controls.qp_st_id.value.slice();
						newToppingsValue.splice(selectedIndex, 1);
						this.express_form_two.controls.qp_st_id.setValue(newToppingsValue);
						break;
					}
				} else {
					k++;

				}

			}
			let index = 0;
			for (const item of this.stitems) {
				if (item === this.ELEMENT_DATA[deletei].subid) {
					this.stitems.slice(index);
					break;

				} else {
					index++;
				}
			}
			let i = 0;
			this.startIndex = this.startIndex - 1;
			this.stitems.splice(deletei, 1);
			this.templates.splice(deletei, 1);
			for (const element of this.ELEMENT_DATA) {
				if (i > deletei) {
					this.ELEMENT_DATA[i].position = this.ELEMENT_DATA[i].position - 1;
					i++;
				} else {
					i++;
				}
			}
			this.ELEMENT_DATA.splice(deletei, 1);
			this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
			setTimeout(() => this.dataSource.paginator = this.paginator2);
		}
		// this.total = Number(this.total) - Number(this.reviewQuestionArray[deletei].qpq_marks);
		// this.reviewQuestionArray.splice(deletei, 1);
		if (this.questionReviewDiv) {
			let j = 0;
			this.total = Number(this.total) - Number(this.REVIEW_ELEMENT_DATA[deletei].marks);
			for (const element of this.REVIEW_ELEMENT_DATA) {
				if (j > deletei) {
					this.REVIEW_ELEMENT_DATA[j].position = this.REVIEW_ELEMENT_DATA[j].position - 1;
					j++;
				} else {
					j++;
				}
			}
			this.REVIEW_ELEMENT_DATA.splice(deletei, 1);
			this.reviewdatasource = new MatTableDataSource<ReviewElement>(this.REVIEW_ELEMENT_DATA);
			setTimeout(() => this.reviewdatasource.paginator = this.paginator4);
		}

	}

	insertInstruction() {
		if (this.instruction_form.valid) {
			this.qbankService.insertInstruction(this.instruction_form.value).subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.getInstruction();
						this.instruction_form.reset();
					}
				}
			);
		}
	}

	getInstruction() {
		this.qbankService.getInstruction().subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.instructionArray = result.data;
				}
			}
		);
	}

	resetInstruction() {
		this.instruction_form.reset();
	}

	editInstructionForm(value) {
		this.editInstructionFlag = true;
		this.instruction_form.controls.ti_id.setValue(value.ti_id);
		this.instruction_form.controls.ti_instruction.setValue(value.ti_instruction);
		this.instruction_form.controls.ti_tags.setValue(value.ti_tags);
		this.instruction_form.controls.ti_description.setValue(value.ti_description);
	}

	updateInstruction() {
		if (this.instruction_form.valid) {
			this.qbankService.updateInstruction(this.instruction_form.value).subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.getInstruction();
						this.editInstructionFlag = false;
						this.instruction_form.reset();
					}
				}
			);
		}
	}

	getInstructionId(ti_id) {
		this.express_form_one.patchValue({
			'tp_ti_id': ti_id
		});
		this.generateQuesBtn = true;
		this.addInstructBtn = false;
	}

	deleteInstruction(ti_id) {
		if (confirm('Are you sure you want to delete?') === true) {
			this.qbankService.deleteInstruction(ti_id).subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.getInstruction();
					}
				}
			);
		}
	}

	submitInstruction() { }

	htmlToText(html) {
		return this.htt.htmlToText(html);
	}

	disableEnable() {
		for (let i = 0; i < this.tabs.length; i++) {
			this.staticTabs._tabs[i].disabled = !this.staticTabs._tabs[i].disabled;
		}
	}
	setSelectedSubTab(value, subIndex) {
		this.currentSelectedSubTab = value;
		this.currentSelectedSubIndex = subIndex;
		this.getMcqQuestion();
		console.log('currentSelectedSubIndex ' + this.currentSelectedSubIndex);
	}

	selectQuestionFromCheckbox(val, tab, ssubIndex, $event) {

		console.log(val + '  ' + tab + ' ' + ssubIndex);
		console.log($event.checked);
		console.log('this.express_form_one.value.qp_qcount', this.express_form_one.value.qp_qcount);
		const index = this.arrayTabSelectedQuestion[ssubIndex][tab].indexOf(val);

		if (index === -1) {
			if (this.totalSelectedQuestion < this.express_form_one.value.qp_qcount) {
				this.arrayTabSelectedQuestion[ssubIndex][tab].push(val);
				this.totalSelectedQuestion++;
			} else {
				this.notif.showSuccessErrorMessage('Exceeding total no of question', 'error');
				$event.source.checked = false;
			}

		} else {
			this.arrayTabSelectedQuestion[ssubIndex][tab].splice(index, 1);
			this.totalSelectedQuestion--;
		}
		console.log(this.arrayTabSelectedQuestion);
		console.log(this.arrayTabSelectedQuestion[ssubIndex][tab]);
	}

	gotoSelectQuestion() {
		if (!this.ELEMENT_DATA[0]) {
			this.parameterDiv = true;
			this.selectQuestionDiv = false;
			this.notif.showSuccessErrorMessage('Please Add Topic/Subtopic List', 'error');
		}

		if (this.templates.length > 0 && this.instruction_form.value.ti_id && this.ELEMENT_DATA[0]) {
			this.parameterDiv = false;
			this.selectQuestionDiv = true;
			this.currentSelectedSubIndex = 0;
			this.currentSelectedSubTab = this.selectedSubArray[this.currentSelectedSubIndex];

			this.selectedSubArray.forEach(element => {
				this.arrayTabSelectedQuestion.push({
					mcq: [],
					mcqmr: [],
					matrix: [],
					mtf: [],
					tf: [],
					single: [],
					double: [],
					matrix45: [],
					identify: [],
					oneline: [],
					fill: [],
					short: [],
					veryshort: [],
					long: [],
					verylong: [],
					essay: []
				});
				this.arrayTabQuestions.push({
					mcq: [],
					mcqmr: [],
					matrix: [],
					mtf: [],
					tf: [],
					single: [],
					double: [],
					matrix45: [],
					identify: [],
					oneline: [],
					fill: [],
					short: [],
					veryshort: [],
					long: [],
					verylong: [],
					essay: []
				});
			});
			this.getMcqQuestion();
		} else if (this.templates.length > 0 && !this.instruction_form.value.ti_id) {
			this.parameterDiv = true;
			this.selectQuestionDiv = false;
			this.notif.showSuccessErrorMessage('Please Add Instruction', 'error');
		}
	}

	movebackSelectQuestion() {
		this.questionReviewDiv = false;
		this.selectQuestionDiv = true;
		this.getMcqQuestion();
		setTimeout(() => this.questionDatasource.paginator = this.paginator, 0);
		this.parameterDiv = false;
		this.REVIEW_ELEMENT_DATA = [];
		this.reviewdatasource = new MatTableDataSource<ReviewElement>(this.REVIEW_ELEMENT_DATA);
	}

	movebackParameter() {
		this.questionReviewDiv = false;
		this.selectQuestionDiv = false;
		this.parameterDiv = true;
		setTimeout(() => this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA));
		setTimeout(() => this.dataSource.paginator = this.paginator2);
		this.REVIEW_ELEMENT_DATA = [];
		this.reviewdatasource = new MatTableDataSource<ReviewElement>(this.REVIEW_ELEMENT_DATA);
	}
	groupBySubtopic(list, keyGetter) {
		const map = new Map();
		list.forEach((item) => {
			const key = keyGetter(item);
			const collection = map.get(key);
			if (!collection) {
				map.set(key, [item]);
			} else {
				collection.push(item);
			}
		});
		return map;
	}
	totalSelectedSubQuestion(ssaIndex) {
		let totalSelectedSubQus = 0;
		// tslint:disable-next-line:forin
		for (const key in this.arrayTabSelectedQuestion[ssaIndex]) {
			totalSelectedSubQus += this.arrayTabSelectedQuestion[ssaIndex][key].length;
		}
		return totalSelectedSubQus;
	}

	gotoReviewQuestion() {
		this.REVIEW_ELEMENT_DATA = [];
		this.reviewdatasource = new MatTableDataSource<ReviewElement>(this.REVIEW_ELEMENT_DATA);
		this.reviewQuestionArray = [];
		this.finalQuestionArray = [];
		this.qstfilterArray = [];
		this.qpq_qus_position = 1;
		this.total = 0;
		const answerArray: any[] = [];
		const answerArray3: any[] = [];
		const answerArray2: any[] = [];
		const answerArray3_2: any[] = [];
		let ninthId = 0;
		let ninthId_2 = 0;
		let id9 = 0;
		let id9_2 = 0;
		for (let aIndex = 0; aIndex < this.arrayTabSelectedQuestion.length; aIndex++) {
			// tslint:disable-next-line:forin
			for (const key in this.arrayTabSelectedQuestion[aIndex]) {
				if (this.arrayTabSelectedQuestion[aIndex][key].length > 0) {
					this.qstfilterArray.push(this.tabkeyvalue[key]);
					for (const sindex of this.arrayTabSelectedQuestion[aIndex][key]) {
						let id13;
						let id13_2;
						const id14 = 0;
						let tenthId = 0;
						let tenthId2 = 0;
						// review selected question
						// tslint:disable-next-line:max-line-length
						if (this.arrayTabQuestions[aIndex][key][sindex].qus_qst_id !== '5' && this.arrayTabQuestions[aIndex][key][sindex].qus_qst_id !== '13') {
							this.reviewQuestionArray.push({
								qpq_qus_position: this.qpq_qus_position,
								qpq_qus_id: this.arrayTabQuestions[aIndex][key][sindex].qus_id,
								qpq_qus_name: this.arrayTabQuestions[aIndex][key][sindex].qus_name,
								qpq_topic_id: this.arrayTabQuestions[aIndex][key][sindex].qus_topic_id,
								qpq_st_id: this.arrayTabQuestions[aIndex][key][sindex].qus_st_id,
								// tslint:disable-next-line:max-line-length
								qpq_qst_id: this.arrayTabQuestions[aIndex][key][sindex].qus_qt_id !== '3' ? this.arrayTabQuestions[aIndex][key][sindex].qus_qst_id : '0',
								qpq_marks: this.arrayTabQuestions[aIndex][key][sindex].qus_marks,
								qpq_skill_name: this.arrayTabQuestions[aIndex][key][sindex].skill_name,
								qpq_negative_marks: this.arrayTabQuestions[aIndex][key][sindex].qus_negative_marks,
								qpq_dl_name: this.arrayTabQuestions[aIndex][key][sindex].dl_name,
								qpq_options: this.arrayTabQuestions[aIndex][key][sindex].options,
								qpq_answer: this.arrayTabQuestions[aIndex][key][sindex].qopt_answer
							});
						} else {
							if (this.arrayTabQuestions[aIndex][key][sindex].qus_qst_id === '5') {
								for (const answerrow of this.arrayTabQuestions[aIndex][key][sindex].answer) {
									id13 = 0;
									// tslint:disable-next-line:no-shadowed-variable
									let answerText: any = '';
									while (id13 < 4) {
										if (answerrow[id13].qopt_answer === '1') {
											answerArray3[tenthId] = answerText + this.optionmatchHA[id13];
											answerText = answerText + this.optionmatchHA[id13];
										} else {
											answerArray3[tenthId] = answerText + '';
										}
										id13++;
									}
									tenthId++;
								}
								let answerText: any = '';
								while (id9 < 4) {
									answerArray[ninthId] = answerText + answerArray3[id9];
									answerText = answerText + answerArray3[id9] + ',' + ' ';
									id9++;
								}
								this.reviewQuestionArray.push({
									qpq_qus_position: this.qpq_qus_position,
									qpq_qus_id: this.arrayTabQuestions[aIndex][key][sindex].qus_id,
									qpq_qus_name: this.arrayTabQuestions[aIndex][key][sindex].qus_name,
									qpq_topic_id: this.arrayTabQuestions[aIndex][key][sindex].qus_topic_id,
									qpq_st_id: this.arrayTabQuestions[aIndex][key][sindex].qus_st_id,
									// tslint:disable-next-line:max-line-length
									qpq_qst_id: this.arrayTabQuestions[aIndex][key][sindex].qus_qt_id !== '3' ? this.arrayTabQuestions[aIndex][key][sindex].qus_qst_id : '0',
									qpq_marks: this.arrayTabQuestions[aIndex][key][sindex].qus_marks,
									qpq_skill_name: this.arrayTabQuestions[aIndex][key][sindex].skill_name,
									qpq_negative_marks: this.arrayTabQuestions[aIndex][key][sindex].qus_negative_marks,
									qpq_dl_name: this.arrayTabQuestions[aIndex][key][sindex].dl_name,
									qpq_options: this.arrayTabQuestions[aIndex][key][sindex].options,
									qpq_answer: answerArray[ninthId]
								});
							}
							// Matrix 45
							if (this.arrayTabQuestions[aIndex][key][sindex].qus_qst_id === '13') {
								for (const answerrow of this.arrayTabQuestions[aIndex][key][sindex].answer) {
									id13_2 = 0;
									// tslint:disable-next-line:no-shadowed-variable
									let answerText: any = '';
									for (const answer of answerrow) {
										if (answer.qopt_answer === '1') {
											answerArray3_2[tenthId2] = answerText + this.optionmatchHA[id13_2];
											answerText = answerText + this.optionmatchHA[id13_2];
										} else {
											answerArray3_2[tenthId2] = answerText + '';
										}
										id13_2++;
									}
									tenthId2++;
								}
								let answerText: any = '';
								while (id9_2 < 4) {
									answerArray2[ninthId_2] = answerText + answerArray3_2[id9_2];
									answerText = answerText + answerArray3_2[id9_2] + ',' + ' ';
									id9_2++;
								}
								this.reviewQuestionArray.push({
									qpq_qus_position: this.qpq_qus_position,
									qpq_qus_id: this.arrayTabQuestions[aIndex][key][sindex].qus_id,
									qpq_qus_name: this.arrayTabQuestions[aIndex][key][sindex].qus_name,
									qpq_topic_id: this.arrayTabQuestions[aIndex][key][sindex].qus_topic_id,
									qpq_st_id: this.arrayTabQuestions[aIndex][key][sindex].qus_st_id,
									// tslint:disable-next-line:max-line-length
									qpq_qst_id: this.arrayTabQuestions[aIndex][key][sindex].qus_qt_id !== '3' ? this.arrayTabQuestions[aIndex][key][sindex].qus_qst_id : '0',
									qpq_marks: this.arrayTabQuestions[aIndex][key][sindex].qus_marks,
									qpq_skill_name: this.arrayTabQuestions[aIndex][key][sindex].skill_name,
									qpq_negative_marks: this.arrayTabQuestions[aIndex][key][sindex].qus_negative_marks,
									qpq_dl_name: this.arrayTabQuestions[aIndex][key][sindex].dl_name,
									qpq_options: this.arrayTabQuestions[aIndex][key][sindex].options,
									qpq_answer: answerArray2[ninthId_2]
								});
							}

							// End
						}
						// selected question will be submited to database
						// tslint:disable-next-line:max-line-length
						if (this.arrayTabQuestions[aIndex][key][sindex].qus_qst_id !== '5' && this.arrayTabQuestions[aIndex][key][sindex].qus_qst_id !== '13') {
							this.finalQuestionArray.push({
								qpq_qus_position: this.qpq_qus_position,
								qpq_qus_id: this.arrayTabQuestions[aIndex][key][sindex].qus_id,
								qpq_qus_name: this.arrayTabQuestions[aIndex][key][sindex].qus_name,
								qpq_topic_id: this.arrayTabQuestions[aIndex][key][sindex].qus_topic_id,
								qpq_st_id: this.arrayTabQuestions[aIndex][key][sindex].qus_st_id,
								qpq_qt_id: this.arrayTabQuestions[aIndex][key][sindex].qus_qt_id,
								// tslint:disable-next-line:max-line-length
								qpq_qst_id: this.arrayTabQuestions[aIndex][key][sindex].qus_qt_id !== '3' ? this.arrayTabQuestions[aIndex][key][sindex].qus_qst_id : '0',
								qpq_marks: this.arrayTabQuestions[aIndex][key][sindex].qus_marks,
								qpq_options: this.arrayTabQuestions[aIndex][key][sindex].options,
								qpq_answer: this.arrayTabQuestions[aIndex][key][sindex].qopt_answer
							});
						} else {
							if (this.arrayTabQuestions[aIndex][key][sindex].qus_qst_id === '5') {
								this.finalQuestionArray.push({
									qpq_qus_position: this.qpq_qus_position,
									qpq_qus_id: this.arrayTabQuestions[aIndex][key][sindex].qus_id,
									qpq_qus_name: this.arrayTabQuestions[aIndex][key][sindex].qus_name,
									qpq_topic_id: this.arrayTabQuestions[aIndex][key][sindex].qus_topic_id,
									qpq_st_id: this.arrayTabQuestions[aIndex][key][sindex].qus_st_id,
									qpq_qt_id: this.arrayTabQuestions[aIndex][key][sindex].qus_qt_id,
									// tslint:disable-next-line:max-line-length
									qpq_qst_id: this.arrayTabQuestions[aIndex][key][sindex].qus_qt_id !== '3' ? this.arrayTabQuestions[aIndex][key][sindex].qus_qst_id : '0',
									qpq_marks: this.arrayTabQuestions[aIndex][key][sindex].qus_marks,
									qpq_options: this.arrayTabQuestions[aIndex][key][sindex].options,
									qpq_answer: answerArray[ninthId]
								});
							}
							if (this.arrayTabQuestions[aIndex][key][sindex].qus_qst_id === '13') {
								this.finalQuestionArray.push({
									qpq_qus_position: this.qpq_qus_position,
									qpq_qus_id: this.arrayTabQuestions[aIndex][key][sindex].qus_id,
									qpq_qus_name: this.arrayTabQuestions[aIndex][key][sindex].qus_name,
									qpq_topic_id: this.arrayTabQuestions[aIndex][key][sindex].qus_topic_id,
									qpq_st_id: this.arrayTabQuestions[aIndex][key][sindex].qus_st_id,
									qpq_qt_id: this.arrayTabQuestions[aIndex][key][sindex].qus_qt_id,
									// tslint:disable-next-line:max-line-length
									qpq_qst_id: this.arrayTabQuestions[aIndex][key][sindex].qus_qt_id !== '3' ? this.arrayTabQuestions[aIndex][key][sindex].qus_qst_id : '0',
									qpq_marks: this.arrayTabQuestions[aIndex][key][sindex].qus_marks,
									qpq_options: this.arrayTabQuestions[aIndex][key][sindex].options,
									qpq_answer: answerArray2[ninthId_2]
								});
							}
						}
						this.qpq_qus_position++;
						this.total = Number(this.total) + Number(this.arrayTabQuestions[aIndex][key][sindex].qus_marks);
					}
				}
				ninthId++;
				ninthId_2++;

			}
		}
		this.parameterDiv = false;
		this.selectQuestionDiv = false;
		this.questionReviewDiv = true;
		let startIndex = 1;
		console.log(this.reviewQuestionArray);
		for (const review of this.reviewQuestionArray) {
			this.answerReview = '';
			if (review.qpq_options) {
				const j = 0;
				for (const option of review.qpq_options) {
					if (option.qopt_answer === '1') {
						this.enableOptionAnswer = true;
						this.answerReview = this.answerReview + option.qopt_options;
					}
					if (option.qopt_answer === 'P' || option.qopt_answer === 'Q' || option.qopt_answer === 'R' || option.qopt_answer === 'S') {
						this.enableOptionMtfAnswer = true;
						this.answerReview = this.answerReview + option.qopt_answer + ',';

					}
					if (review.qpq_answer) {
						this.enableOptionMtfAnswer = true;
						this.answerReview = review.qpq_answer;

					}
				}
				if ((this.enableOptionAnswer === true) || (this.enableOptionMtfAnswer === true)) {
					this.REVIEW_ELEMENT_DATA.push({
						position: startIndex,
						question: review.qpq_qus_name,
						answer: this.answerReview,
						lod: review.qpq_dl_name,
						skill: review.qpq_skill_name,
						marks: review.qpq_marks,
						negativeMarks: review.qpq_negative_marks,
						action: review
					});
					startIndex++;


				}
			} else {
				if (Number(review.qpq_qst_id) === 14) {
					const subMarks = review.qpq_marks;
					this.REVIEW_ELEMENT_DATA.push({
						position: startIndex,
						question: review.qpq_qus_name,
						// tslint:disable-next-line:max-line-length
						answer: '<button mat-icon style=\'border-radius:50% !important;border:none !important;color:white;font-weight:bold !important;color:white !important;color:white;background-color:#6c65c8 !important;height:40px !important;width:40px !important\'>' + review.qpq_answer + '</button>',
						lod: review.qpq_dl_name,
						skill: review.qpq_skill_name,
						marks: subMarks,
						negativeMarks: review.qpq_negative_marks,
						action: review
					});
					startIndex++;
				} else if (Number(review.qpq_qst_id) === 15) {
					const subMarks = review.qpq_marks;
					this.REVIEW_ELEMENT_DATA.push({
						position: startIndex,
						question: review.qpq_qus_name,
						// tslint:disable-next-line:max-line-length
						answer: '<button mat-icon style=\'border-radius:50% !important;border:none !important;color:white;font-weight:bold !important;color:white !important;color:white;background-color:#6c65c8 !important;height:40px !important;width:40px !important\'>' + review.qpq_answer.charAt(0) + '</button>' +
							// tslint:disable-next-line:max-line-length
							'<button mat-icon style=\'border-radius:50% !important;border:none !important;color:white;font-weight:bold !important;color:white !important;color:white;background-color:#6c65c8 !important;height:40px !important;width:40px !important\'>' + review.qpq_answer.charAt(1) + '</button>',
						lod: review.qpq_dl_name,
						skill: review.qpq_skill_name,
						marks: subMarks,
						negativeMarks: review.qpq_negative_marks,
						action: review
					});
					startIndex++;
				} else {
					const subMarks = review.qpq_marks;
					this.REVIEW_ELEMENT_DATA.push({
						position: startIndex,
						question: review.qpq_qus_name,
						answer: review.qpq_answer,
						lod: review.qpq_dl_name,
						skill: review.qpq_skill_name,
						marks: subMarks,
						negativeMarks: review.qpq_negative_marks,
						action: review
					});
					startIndex++;
				}
			}
		}
		this.reviewdatasource = new MatTableDataSource<ReviewElement>(this.REVIEW_ELEMENT_DATA);
		setTimeout(() => this.reviewdatasource.paginator = this.paginator4);
		this.sort4.sortChange.subscribe(() => this.paginator4.pageIndex = 0);
		this.reviewdatasource.sort = this.sort4;
	}

	reset() {
		this.REVIEW_ELEMENT_DATA = [];
		this.reviewdatasource = new MatTableDataSource<ReviewElement>(this.REVIEW_ELEMENT_DATA);
		this.questionReviewDiv = false;
		this.selectQuestionDiv = true;
	}

	addExpressQuestionPaper() {
		if (this.express_form_one.valid) {
			let sum = 0;
			let allQuestionHasMarks = true;
			for (const item of this.REVIEW_ELEMENT_DATA) {
				if (Number(item.marks) < 1) {
					allQuestionHasMarks = false;
				}
				sum = sum + Number(item.marks);
			}
			this.total = Number(sum);
			// tslint:disable-next-line:max-line-length
			if ((allQuestionHasMarks && this.REVIEW_ELEMENT_DATA.length === Number(this.express_form_one.value.qp_qcount) && this.total === this.express_form_one.value.qp_marks)) {
				/* things.thing = things.thing.filter((thing, index, self) =>
          index === self.findIndex((t) => (
            t.place === thing.place && t.name === thing.name
          ))
        ) */
				this.filtersArray = this.filtersArray.filter((item, index, self) =>
					index === self.findIndex((t) => (
						t.qf_st_id === item.qf_st_id && t.qf_topic_id === item.qf_topic_id
					))
				);
				console.log('finalQuestionArray', this.finalQuestionArray);
				console.log('this.REVIEW_ELEMENT_DATA', this.REVIEW_ELEMENT_DATA);
				const paperquestion: any[] = [];
				this.REVIEW_ELEMENT_DATA.forEach(item => {
					const ind = this.finalQuestionArray.findIndex(element => element.qpq_qus_id === item.action.qpq_qus_id);
					if (ind !== -1) {
						paperquestion.push({
							qpq_qus_position: item.position,
							qpq_marks: item.marks,
							qpq_negative_marks: item.negativeMarks,
							qpq_qus_id: this.finalQuestionArray[ind].qpq_qus_id,
							qpq_qt_id: this.finalQuestionArray[ind].qpq_qt_id,
							qpq_qst_id: this.finalQuestionArray[ind].qpq_qst_id,
							qpq_topic_id: this.finalQuestionArray[ind].qpq_topic_id,
							qpq_st_id: this.finalQuestionArray[ind].qpq_st_id
						});
					}
				});
				this.express_form_one.patchValue({
					'qp_qm_id': '3',
					'qlist': paperquestion,
					'filters': this.qstfilterArray,
					'subtopiclist':this.stitems
				});
				console.log(this.express_form_one.value);
				this.qelementService.addExpressQuestionPaper(this.express_form_one.value).subscribe(
					(result: any) => {
						if (result && result.status === 'ok') {
							this.notif.showSuccessErrorMessage('Question paper created successfully', 'success');
							setTimeout(() => {
								this.router.navigate(['../'], { relativeTo: this.route });
							}, 2000);
						}
					}
				);
			} else {
				// tslint:disable-next-line:max-line-length
				this.notif.showSuccessErrorMessage('Please match the review question length and total marks <br> with the total no of questions <br>selected at the beginning', 'error');
			}
		}
	}
	changeMarks($event, position) {
		this.finalQuestionArray[position - 1].qpq_marks = $event.target.value;
		this.REVIEW_ELEMENT_DATA[position - 1].marks = $event.target.value;
		let sum = 0;
		for (const item of this.REVIEW_ELEMENT_DATA) {
			sum = sum + Number(item.marks);
		}
		this.total = Number(sum);
	}
	changeNmarks($event, position) {
		this.REVIEW_ELEMENT_DATA[position - 1].negativeMarks = $event.target.value;
	}
	setMarks($event) {
		let sum = 0;
		for (const item of this.REVIEW_ELEMENT_DATA) {
			item.marks = $event.target.value;
			sum = sum + Number(item.marks);
		}
		this.total = Number(sum);
	}
	setNmarks($event) {
		for (const item of this.REVIEW_ELEMENT_DATA) {
			item.negativeMarks = $event.target.value;
		}
	}
}
