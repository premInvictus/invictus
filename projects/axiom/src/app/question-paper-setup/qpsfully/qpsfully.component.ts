import { Component, OnInit, ViewChild, AfterViewChecked } from '@angular/core';
import { QelementService } from '../../questionbank/service/qelement.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HtmlToTextService, NotificationService, BreadCrumbService } from '../../_services/index';
import { MatPaginator, MatTableDataSource, MatSort, MatTabGroup, PageEvent } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import {
		Element,
		MCQElement,
		MultiMCQElement,
		MatchElement,
		MatrixMatchElement,
		TFElement,
		SubjectiveElement,
		FillElement,
		OneElement,
		LongElement,
		VeryLongElement,
		VeryShortElement,
		ShortElement,
		IdentifyElement, ReviewElement, ESSAYQUESTIONElement, MatrixMatch45Element, SingleIntegerElement, DoubleIntegerElement
} from './Qsubtype.model';
import { ViewTemplateComponent } from '../../questionpaper/view-template/view-template.component';


@Component({
		selector: 'app-qpsfully',
		templateUrl: './qpsfully.component.html',
		styleUrls: ['./qpsfully.component.css']
})
export class QpsfullyComponent implements OnInit, AfterViewChecked {

		bannerdiv = false;
		qpsfully_form: FormGroup;
		qpsfully_modal: FormGroup;
		templateArray: any[] = [];
		currentTemplate: any;
		filtersArray: any[];
		questionsArray: any[];
		questionsOfEachTemplateFilerArray: any[] = [];
		questionsOfEachEssayFilerArray: any[] = [];
		finalQuestionArray: any[] = [];
		reviewQuestionArray: any[] = [];
		public optionHA = ['A', 'B', 'C', 'D', 'E'];
		public optionmatchHA = ['P', 'Q', 'R', 'S', 'T'];
		qpq_qus_position = 0;
		homeUrl: string;
		total: number;
		currSelectedTemplateClass: any = {};
		currSelectedTemplateSubject: any = {};
		currSelectedTemplateSection: any = {};
		currentTemplateFilterIndex: number;
		reviewQuestion = false;
		selectParameter = true;
		finalQuestion = false;
		enableOptionAnswer = false;
		answerReview: any;
		ELEMENT_DATA: Element[] = [];
		@ViewChild('paginator') paginator: MatPaginator;
		@ViewChild('paginator2') paginator2: MatPaginator;
		@ViewChild('paginator3') paginator3: MatPaginator;
		@ViewChild('paginator4') paginator4: MatPaginator;
		@ViewChild('paginator5') paginator5: MatPaginator;
		@ViewChild('paginator6') paginator6: MatPaginator;
		@ViewChild('paginator7') paginator7: MatPaginator;
		@ViewChild('paginator8') paginator8: MatPaginator;
		@ViewChild('paginator9') paginator9: MatPaginator;
		@ViewChild('paginator10') paginator10: MatPaginator;
		@ViewChild('paginator11') paginator11: MatPaginator;
		@ViewChild('paginator12') paginator12: MatPaginator;
		@ViewChild('paginator13') paginator13: MatPaginator;
		@ViewChild('paginator14') paginator14: MatPaginator;
		@ViewChild('paginator15') paginator15: MatPaginator;
		@ViewChild('paginator16') paginator16: MatPaginator;
		@ViewChild('paginator17') paginator17: MatPaginator;
		@ViewChild(MatSort) sort: MatSort;
		@ViewChild(MatSort) sort2: MatSort;
		@ViewChild(MatSort) sort3: MatSort;
		@ViewChild(MatSort) sort4: MatSort;
		@ViewChild(MatSort) sort5: MatSort;
		@ViewChild(MatSort) sort6: MatSort;
		@ViewChild(MatSort) sort7: MatSort;
		@ViewChild(MatSort) sort8: MatSort;
		@ViewChild(MatSort) sort9: MatSort;
		@ViewChild(MatSort) sort10: MatSort;
		@ViewChild(MatSort) sort11: MatSort;
		@ViewChild(MatSort) sort12: MatSort;
		@ViewChild(MatSort) sort13: MatSort;
		@ViewChild(MatSort) sort14: MatSort;
		@ViewChild(MatSort) sort15: MatSort;
		@ViewChild(MatSort) sort16: MatSort;
		@ViewChild(MatSort) sort17: MatSort;
		@ViewChild(MatTabGroup) tabGroup: MatTabGroup;
		pageEvent: PageEvent;
		printTemplate: any = {};
		totalTemplateQuestion = 0;
		totalSelectedQuestion = 0;
		firstItem: string;
		MCQ_ELEMENT_DATA: MCQElement[] = [];
		MULTI_MCQ_ELEMENT_DATA: MultiMCQElement[] = [];
		TF_ELEMENT_DATA: TFElement[] = [];
		MATCH_ELEMENT_DATA: MatchElement[] = [];
		MATRIX_MATCH_ELEMENT_DATA: MatrixMatchElement[] = [];
		MATRIX_MATCH_ELEMENT_4X5_DATA: MatrixMatch45Element[] = [];
		SUB_ELEMENT_DATA: SubjectiveElement[] = [];
		FILL_ELEMENT_DATA: FillElement[] = [];
		SINGLE_ELEMENT_DATA: SingleIntegerElement[] = [];
		DOUBLE_ELEMENT_DATA: DoubleIntegerElement[] = [];
		IDENTIFY_ELEMENT_DATA: IdentifyElement[] = [];
		ONE_ELEMENT_DATA: OneElement[] = [];
		VERYSHORT_ELEMENT_DATA: VeryShortElement[] = [];
		SHORT_ELEMENT_DATA: ShortElement[] = [];
		LONG_ELEMENT_DATA: LongElement[] = [];
		VERYLONG_ELEMENT_DATA: VeryLongElement[] = [];
		REVIEW_ELEMENT_DATA: ReviewElement[] = [];
		ESSAYQUESTION_ELEMENT_DATA: ESSAYQUESTIONElement[] = [];
		multimcqdataSource = new MatTableDataSource<MultiMCQElement>(this.MULTI_MCQ_ELEMENT_DATA);
		mcqdataSource = new MatTableDataSource<MCQElement>(this.MCQ_ELEMENT_DATA);
		tfdataSource = new MatTableDataSource<TFElement>(this.TF_ELEMENT_DATA);
		matchdataSource = new MatTableDataSource<MatchElement>(this.MATCH_ELEMENT_DATA);
		matrixmatchdataSource = new MatTableDataSource<MatrixMatchElement>(this.MATRIX_MATCH_ELEMENT_DATA);
		matrixmatch45dataSource = new MatTableDataSource<MatrixMatch45Element>(this.MATRIX_MATCH_ELEMENT_4X5_DATA);
		subdataSource = new MatTableDataSource<SubjectiveElement>(this.SUB_ELEMENT_DATA);
		singledataSource = new MatTableDataSource<SingleIntegerElement>(this.SINGLE_ELEMENT_DATA);
		doubledataSource = new MatTableDataSource<DoubleIntegerElement>(this.DOUBLE_ELEMENT_DATA);
		filldataSource = new MatTableDataSource<FillElement>(this.FILL_ELEMENT_DATA);
		identifydataSource = new MatTableDataSource<IdentifyElement>(this.IDENTIFY_ELEMENT_DATA);
		onedataSource = new MatTableDataSource<OneElement>(this.ONE_ELEMENT_DATA);
		veryshortdataSource = new MatTableDataSource<VeryShortElement>(this.VERYSHORT_ELEMENT_DATA);
		shortdataSource = new MatTableDataSource<ShortElement>(this.SHORT_ELEMENT_DATA);
		longdataSource = new MatTableDataSource<LongElement>(this.LONG_ELEMENT_DATA);
		verylongdataSource = new MatTableDataSource<VeryLongElement>(this.VERYLONG_ELEMENT_DATA);
		dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
		reviewdatasource = new MatTableDataSource<ReviewElement>(this.REVIEW_ELEMENT_DATA);
		essayquestionDatasource = new MatTableDataSource<ESSAYQUESTIONElement>(this.ESSAYQUESTION_ELEMENT_DATA);
		classArray: any[];
		sectionArray: any[];
		subjectArray: any[];
		topicArray: any[];
		subtopicArray: any[];
		templates: any[] = [];
		value: string;
		dialogRef: MatDialogRef<ViewTemplateComponent>;
		lengthArrayMCQ: any[] = [];
		lengthArrayMCQMR: any[] = [];
		lengthArrayTF: any[] = [];
		lengthArrayMTF: any[] = [];
		lengthArrayMatrix: any[] = [];
		lengthArrayMatrix45: any[] = [];
		lengthArraySingleInteger: any[] = [];
		lengthArrayDoubleInteger: any[] = [];
		lengthArrayFill: any[] = [];
		lengthArrayIdentify: any[] = [];
		lengthArrayOne: any[] = [];
		lengthArrayVeryShort: any[] = [];
		lengthArrayShort: any[] = [];
		lengthArrayLong: any[] = [];
		lengthArrayVeryLong: any[] = [];

		mcqdisplayedColumns = ['position', 'question', 'options', 'explanations', 'skillType', 'topic', 'subtopic',
				'suggestedMarks', 'reference', 'action']; // MCQ
		multimcqdisplayedColumns = ['positionMulti', 'questionMulti', 'optionsMulti', 'explanationsMulti',
				'skillTypeMulti', 'topicMulti', 'subtopicMulti', 'suggestedMarksMulti', 'referenceMulti', 'actionMulti']; // MRMCQ
		tfdisplayedColumns = ['positionTF', 'questionTF', 'optionsTF', 'explanationsTF', 'skillTypeTF', 'topicTF',
				'subtopicTF', 'suggestedMarksTF', 'referenceTF', 'actionTF']; // TF
		matchdisplayedColumns = ['positionMatch', 'questionMatch', 'optionsMatch', 'explanationsMatch', 'skillTypeMatch',
				'topicMatch', 'subtopicMatch', 'suggestedMarksMatch', 'referenceMatch', 'actionMatch']; // Match
		matrixdisplayedColumns = ['positionMatrixMatch', 'questionMatrixMatch', 'optionsMatrixMatch', 'explanationsMatrixMatch',
				'skillTypeMatrixMatch', 'topicMatrixMatch', 'subtopicMatrixMatch', 'suggestedMarksMatrixMatch', 'referenceMatrixMatch',
				'actionMatrixMatch']; // Matrix
		matrixdisplayedColumns45 = ['positionMatrixMatch', 'questionMatrixMatch', 'optionsMatrixMatch', 'explanationsMatrixMatch',
				'skillTypeMatrixMatch', 'topicMatrixMatch', 'subtopicMatrixMatch', 'suggestedMarksMatrixMatch', 'referenceMatrixMatch',
				'actionMatrixMatch']; // Matrix
		displayedColumns = ['position', 'topic', 'subtopic', 'action'];
		subdisplayedColumns = ['positionSub', 'questionSub', 'answerSub', 'explanationsSub', 'skillTypeSub', 'topicSub',
				'subtopicSub', 'suggestedMarksSub', 'referenceSub', 'actionSub']; // SUB


		singledisplayedColumns = ['position', 'question', 'answer', 'explanations', 'skillType', 'topic',
				'subtopic', 'suggestedMarks', 'reference', 'action']; // Single Integer

		doubledisplayedColumns = ['position', 'question', 'answer', 'explanations', 'skillType', 'topic',
				'subtopic', 'suggestedMarks', 'reference', 'action']; // Double Integer

		reviewdisplayedColumns = ['position', 'question', 'answer', 'topic',
				'subtopic', /* 'lod', */'skill', 'marks', 'negativemarks', 'action']; // SUB
		// tslint:disable-next-line:max-line-length
		essaydisplayedColumns = ['position', 'question', 'options', 'essayTitle', 'explanations', 'skillType', 'topic', 'subtopic', 'suggestedMarks', 'reference', 'action']; // MCQ
		enableOptionMtfAnswer: boolean;
		negativeMarks: any;

		// tslint:disable-next-line:use-life-cycle-interface
		ngAfterViewInit() {
				this.dataSource.paginator = this.paginator;
				this.dataSource.sort = this.sort;
				this.reviewdatasource.paginator = this.paginator13;
				setTimeout(() => this.reviewdatasource.paginator = this.paginator13);
				this.mcqdataSource.paginator = this.paginator;
				this.mcqdataSource.sort = this.sort;
				this.multimcqdataSource.paginator = this.paginator2;
				this.multimcqdataSource.sort = this.sort2;
				this.tfdataSource.paginator = this.paginator3;
				this.tfdataSource.sort = this.sort3;
				this.matchdataSource.paginator = this.paginator4;
				this.matchdataSource.sort = this.sort4;
				this.matrixmatchdataSource.paginator = this.paginator5;
				this.matrixmatchdataSource.sort = this.sort5;
				this.matrixmatch45dataSource.paginator = this.paginator15;
				this.matrixmatch45dataSource.sort = this.sort15;
				this.singledataSource.paginator = this.paginator16;
				this.singledataSource.sort = this.sort16;
				this.doubledataSource.paginator = this.paginator17;
				this.doubledataSource.sort = this.sort17;
				this.filldataSource.paginator = this.paginator6;
				this.filldataSource.sort = this.sort6;
				this.identifydataSource.paginator = this.paginator7;
				this.identifydataSource.sort = this.sort7;
				this.onedataSource.paginator = this.paginator8;
				this.onedataSource.sort = this.sort8;
				this.veryshortdataSource.paginator = this.paginator9;
				this.veryshortdataSource.sort = this.sort9;
				this.shortdataSource.paginator = this.paginator10;
				this.shortdataSource.sort = this.sort10;
				this.longdataSource.paginator = this.paginator11;
				this.longdataSource.sort = this.sort11;
				this.verylongdataSource.paginator = this.paginator12;
				this.verylongdataSource.sort = this.sort12;

		}
		ngAfterViewChecked() {
				if (this.MCQ_ELEMENT_DATA.length > 0) {
						for (const item of this.MCQ_ELEMENT_DATA) {
								MathJax.Hub.Queue(['Typeset', MathJax.Hub, item.showHover]);
						}
				}
				if (this.MULTI_MCQ_ELEMENT_DATA.length > 0) {
						for (const item of this.MULTI_MCQ_ELEMENT_DATA) {
								MathJax.Hub.Queue(['Typeset', MathJax.Hub, item.showHoverMulti]);
						}
				}
				if (this.MATCH_ELEMENT_DATA.length > 0) {
						for (const item of this.MATCH_ELEMENT_DATA) {
								MathJax.Hub.Queue(['Typeset', MathJax.Hub, item.showHoverMatch]);
						}
				}
				if (this.MATRIX_MATCH_ELEMENT_DATA.length > 0) {
						for (const item of this.MATRIX_MATCH_ELEMENT_DATA) {
								MathJax.Hub.Queue(['Typeset', MathJax.Hub, item.showHoverMatrixMatch]);
						}
				}
				if (this.MATRIX_MATCH_ELEMENT_4X5_DATA.length > 0) {
						for (const item of this.MATRIX_MATCH_ELEMENT_4X5_DATA) {
								MathJax.Hub.Queue(['Typeset', MathJax.Hub, item.showHoverMatrixMatch]);
						}
				}
				if (this.ESSAYQUESTION_ELEMENT_DATA.length > 0) {
						for (const item of this.ESSAYQUESTION_ELEMENT_DATA) {
								MathJax.Hub.Queue(['Typeset', MathJax.Hub, item.showHover]);
						}
				}

		}
		constructor(
				private qelementService: QelementService,
				private fb: FormBuilder,
				private htt: HtmlToTextService,
				private route: ActivatedRoute,
				private router: Router,
				private notif: NotificationService,
				private breadCrumbService: BreadCrumbService,
				public dialog: MatDialog,
				private sanitizer: DomSanitizer
		) { }
		ngOnInit() {
				this.homeUrl = this.breadCrumbService.getUrl();
				this.buildForm();
				this.getClass();

		}
		openDialog() {
				this.dialogRef = this.dialog.open(ViewTemplateComponent, {
						height: '550px',
						data: {
								'qp_tp_id': this.qpsfully_form.value.qp_tp_id,
								'qp_class_id': this.qpsfully_form.value.qp_class_id,
								'qp_sec_id': this.qpsfully_form.value.qp_sec_id,
								'qp_sub_id': this.qpsfully_form.value.qp_sub_id
						}
				});
				this.dialogRef.afterClosed().subscribe(result => {

				});
		}

		getPageEvent1(event: PageEvent) {
				this.mcqdataSource.paginator.pageIndex = event.pageIndex;
				this.mcqdataSource.paginator = this.paginator;
		}
		getPageEvent2(event: PageEvent) {
				this.multimcqdataSource.paginator.pageIndex = event.pageIndex;
				this.multimcqdataSource.paginator = this.paginator2;
		}

		getPageEvent3(event: PageEvent) {
				this.tfdataSource.paginator.pageIndex = event.pageIndex;
				this.tfdataSource.paginator = this.paginator3;
		}

		getPageEvent4(event: PageEvent) {
				this.matchdataSource.paginator.pageIndex = event.pageIndex;
				this.matchdataSource.paginator = this.paginator4;
		}

		getPageEvent5(event: PageEvent) {
				this.matrixmatchdataSource.paginator.pageIndex = event.pageIndex;
				this.matrixmatchdataSource.paginator = this.paginator5;
		}
		getPageEvent15(event: PageEvent) {
				this.matrixmatch45dataSource.paginator.pageIndex = event.pageIndex;
				this.matrixmatch45dataSource.paginator = this.paginator15;
		}
		getPageEvent16(event: PageEvent) {
				this.singledataSource.paginator.pageIndex = event.pageIndex;
				this.singledataSource.paginator = this.paginator16;
		}
		getPageEvent17(event: PageEvent) {
				this.doubledataSource.paginator.pageIndex = event.pageIndex;
				this.doubledataSource.paginator = this.paginator17;
		}

		getPageEvent6(event: PageEvent) {
				this.filldataSource.paginator.pageIndex = event.pageIndex;
				this.filldataSource.paginator = this.paginator6;
		}

		getPageEvent7(event: PageEvent) {
				this.identifydataSource.paginator.pageIndex = event.pageIndex;
				this.identifydataSource.paginator = this.paginator7;
		}

		getPageEvent8(event: PageEvent) {
				this.onedataSource.paginator.pageIndex = event.pageIndex;
				this.onedataSource.paginator = this.paginator8;
		}

		getPageEvent9(event: PageEvent) {
				this.veryshortdataSource.paginator.pageIndex = event.pageIndex;
				this.veryshortdataSource.paginator = this.paginator9;
		}

		getPageEvent10(event: PageEvent) {
				this.shortdataSource.paginator.pageIndex = event.pageIndex;
				this.shortdataSource.paginator = this.paginator10;
		}

		getPageEvent11(event: PageEvent) {
				this.longdataSource.paginator.pageIndex = event.pageIndex;
				this.longdataSource.paginator = this.paginator11;
		}

		getPageEvent12(event: PageEvent) {
				this.verylongdataSource.paginator.pageIndex = event.pageIndex;
				this.verylongdataSource.paginator = this.paginator12;
		}




		applyFilterMCQ(filterValue: string) {
				filterValue = filterValue.trim().toLowerCase(); this.mcqdataSource.filter = filterValue;
		}
		applyFilterMultiMCQ(filterValue: string) {
				filterValue = filterValue.trim().toLowerCase(); this.multimcqdataSource.filter = filterValue;
		}
		applyFilterMatrix(filterValue: string) {
				filterValue = filterValue.trim().toLowerCase(); this.matrixmatchdataSource.filter = filterValue;
		}
		applyFilterMatrix45(filterValue: string) {
				filterValue = filterValue.trim().toLowerCase(); this.matrixmatch45dataSource.filter = filterValue;
		}
		applyFilterSingleInteger(filterValue: string) {
				filterValue = filterValue.trim().toLowerCase(); this.singledataSource.filter = filterValue;
		}
		applyFilterDoubleInteger(filterValue: string) {
				filterValue = filterValue.trim().toLowerCase(); this.doubledataSource.filter = filterValue;
		}
		applyFilterMatch(filterValue: string) {
				filterValue = filterValue.trim().toLowerCase(); this.matchdataSource.filter = filterValue;
		}
		applyFilterSub(filterValue: string) {
				filterValue = filterValue.trim().toLowerCase(); this.subdataSource.filter = filterValue;
		}
		applyFilterTF(filterValue: string) {
				filterValue = filterValue.trim().toLowerCase(); this.tfdataSource.filter = filterValue;
		}
		applyFilterFill(filterValue: string) {
				filterValue = filterValue.trim().toLowerCase(); this.filldataSource.filter = filterValue;
		}
		applyFilterIdentify(filterValue: string) {
				filterValue = filterValue.trim().toLowerCase(); this.identifydataSource.filter = filterValue;
		}
		applyFilterOne(filterValue: string) {
				filterValue = filterValue.trim().toLowerCase(); this.onedataSource.filter = filterValue;
		}
		applyFilterVeryShort(filterValue: string) {
				filterValue = filterValue.trim().toLowerCase(); this.veryshortdataSource.filter = filterValue;
		}
		applyFilterShort(filterValue: string) {
				filterValue = filterValue.trim().toLowerCase(); this.shortdataSource.filter = filterValue;
		}
		applyFilterLong(filterValue: string) {
				filterValue = filterValue.trim().toLowerCase(); this.longdataSource.filter = filterValue;
		}
		applyFilterVeryLong(filterValue: string) {
				filterValue = filterValue.trim().toLowerCase(); this.verylongdataSource.filter = filterValue;
		}
		applyFilterReview(filterValue: string) {
				filterValue = filterValue.trim().toLowerCase(); this.reviewdatasource.filter = filterValue;
		}
		movebackParameter() {
				this.selectParameter = true;
				this.reviewQuestion = false;
				this.MCQ_ELEMENT_DATA = [];
				this.MULTI_MCQ_ELEMENT_DATA = [];
				this.TF_ELEMENT_DATA = [];
				this.MATCH_ELEMENT_DATA = [];
				this.MATRIX_MATCH_ELEMENT_DATA = [];
				this.SUB_ELEMENT_DATA = [];
				this.FILL_ELEMENT_DATA = [];
				this.IDENTIFY_ELEMENT_DATA = [];
				this.ONE_ELEMENT_DATA = [];
				this.VERYSHORT_ELEMENT_DATA = [];
				this.SHORT_ELEMENT_DATA = [];
				this.LONG_ELEMENT_DATA = [];
				this.VERYLONG_ELEMENT_DATA = [];
				this.multimcqdataSource = new MatTableDataSource<MultiMCQElement>(this.MULTI_MCQ_ELEMENT_DATA);
				this.mcqdataSource = new MatTableDataSource<MCQElement>(this.MCQ_ELEMENT_DATA);
				this.tfdataSource = new MatTableDataSource<TFElement>(this.TF_ELEMENT_DATA);
				this.matchdataSource = new MatTableDataSource<MatchElement>(this.MATCH_ELEMENT_DATA);
				this.matrixmatchdataSource = new MatTableDataSource<MatrixMatchElement>(this.MATRIX_MATCH_ELEMENT_DATA);
				this.subdataSource = new MatTableDataSource<SubjectiveElement>(this.SUB_ELEMENT_DATA);
				this.filldataSource = new MatTableDataSource<FillElement>(this.FILL_ELEMENT_DATA);
				this.identifydataSource = new MatTableDataSource<IdentifyElement>(this.IDENTIFY_ELEMENT_DATA);
				this.onedataSource = new MatTableDataSource<OneElement>(this.ONE_ELEMENT_DATA);
				this.veryshortdataSource = new MatTableDataSource<VeryShortElement>(this.VERYSHORT_ELEMENT_DATA);
				this.shortdataSource = new MatTableDataSource<ShortElement>(this.SHORT_ELEMENT_DATA);
				this.longdataSource = new MatTableDataSource<LongElement>(this.LONG_ELEMENT_DATA);
				this.verylongdataSource = new MatTableDataSource<VeryLongElement>(this.VERYLONG_ELEMENT_DATA);
		}
		gotoReview() {
				this.reviewQuestion = false;
				this.selectParameter = false;
				this.finalQuestion = true;
		}

		deleteQuestionList(deletei: number) {

				let i = 0;
				this.total = Number(this.total) - Number(this.REVIEW_ELEMENT_DATA[deletei].marks);
				for (const element of this.REVIEW_ELEMENT_DATA) {
						if (i > deletei) {
								this.REVIEW_ELEMENT_DATA[i].position = this.REVIEW_ELEMENT_DATA[i].position - 1;
								i++;
						} else {
								i++;
						}
				}
				this.REVIEW_ELEMENT_DATA.splice(deletei, 1);
				this.reviewdatasource = new MatTableDataSource<ReviewElement>(this.REVIEW_ELEMENT_DATA);
				setTimeout(() => this.reviewdatasource.paginator = this.paginator13);
		}

		buildForm() {
				this.qpsfully_form = this.fb.group({
						qp_name: '',
						qp_tp_id: '',
						qp_qm_id: '',
						qp_class_id: '',
						qp_sub_id: '',
						qp_sec_id: '',
						qp_marks: '',
						qp_negative_marks: '',
						qlist: []
				});
		}

		htmlToText(html) {
				return this.htt.htmlToText(html);
		}
		getAllSpecificList() {
				const tt_id = 1;
				const tp_status = 1;
				this.qelementService.getTemplate({
						tt_id: tt_id, tp_status: tp_status, class_id: this.qpsfully_form.value.qp_class_id,
						sub_id: this.qpsfully_form.value.qp_sub_id, sec_id: this.qpsfully_form.value.qp_sec_id
				}).subscribe(
						(result: any) => {
								if (result && result.status === 'ok') {
										this.templateArray = result.data;

								} else {
										this.templateArray = [];
								}
						}
				);
		}
		getFilterWithoutEssay(arr) {
				const arr1 = new Array();
				for (const avalue of arr) {
						if (avalue.tf_qt_id !== '3') {
								arr1.push(avalue);
						}
				}
				return arr1;
		}
		getEssayFilter(arr) {
				const essayGroupFilter: any = {
						tf_qt_id: '3',
						qst_name: 'Essay',
						tf_id: [],
						tf_qst_id: [],
						tf_st_id: [],
						tf_skill_id: [],
						tf_dl_id: [],
						tf_weightage: [],
						tf_qcount: []
				};
				for (const avalue of arr) {
						if (avalue.tf_qt_id === '3') {
								essayGroupFilter.tf_id.push(avalue.tf_id);
								essayGroupFilter.tf_qst_id.push(avalue.tf_qst_id);
								essayGroupFilter.tf_st_id.push(avalue.tf_st_id);
								essayGroupFilter.tf_skill_id.push(avalue.tf_skill_id);
								essayGroupFilter.tf_dl_id.push(avalue.tf_dl_id);
								essayGroupFilter.tf_weightage.push(avalue.tf_weightage);
								essayGroupFilter.tf_qcount.push(avalue.tf_qcount);
						}
				}
				return essayGroupFilter;
		}

		getFilters() {
				// Form validation
				if (!this.qpsfully_form.value.qp_name) {
						this.notif.showSuccessErrorMessage('Test name is required', 'error');
				}
				if (!this.qpsfully_form.value.qp_tp_id) {
						this.notif.showSuccessErrorMessage('Template is required', 'error');
				}
				this.totalTemplateQuestion = 0;
				const tp_id = this.qpsfully_form.value.qp_tp_id;
				this.questionsArray = [];
				this.filtersArray = [];

				this.questionsOfEachTemplateFilerArray = [];
				for (const item of this.templateArray) {
						if (item.tp_id === tp_id) {
								this.printTemplate = item;
								this.filtersArray = this.getFilterWithoutEssay(item.filters);
								const essayGroup = this.getEssayFilter(item.filters);
								if (essayGroup.tf_qst_id.length > 0) {
										this.filtersArray.push(essayGroup);
								}

								this.currentTemplate = item;
								for (let fi = 0; fi < this.filtersArray.length; fi++) {
										const value = this.filtersArray[fi];

										if (value.tf_qt_id === '1' || value.tf_qt_id === '2') {
												this.qelementService.getQuestionsInTemplate({
														qm_id: 1,
														qt_id: value.tf_qt_id,
														qst_id: value.tf_qst_id,
														st_id: value.tf_st_id,
														skill_id: value.tf_skill_id,
														dl_id: value.tf_dl_id,
														qus_marks: value.tf_weightage,
														qus_limit: value.tf_qcount,
														status: 1
												})
														.subscribe(
																(result: any) => {
																		if (result && result.status === 'ok') {
																				if (result.data.length > 0) {
																						this.questionsOfEachTemplateFilerArray[fi] = result.data;
																						if (fi === 0) {
																								this.getQuestion(fi);
																						}
																						this.totalSelectedQuestion += result.data.length;
																				} else {
																						this.questionsOfEachTemplateFilerArray[fi] = [];
																				}
																		}
																		/* this.qpsfully_form.patchValue({
                                        'qp_sub_id': '',
                                    }); */
																});
										} else if (value.tf_qt_id === '3') {

												if (value.tf_qst_id.length > 0) {
														this.questionsOfEachEssayFilerArray = [];
														for (let eachType = 0; eachType < value.tf_qst_id.length; eachType++) {
																this.qelementService.getQuestionsInTemplate({
																		qm_id: 1,
																		qt_id: value.tf_qt_id,
																		qst_id: value.tf_qst_id[eachType],
																		st_id: value.tf_st_id[eachType],
																		skill_id: value.tf_skill_id[eachType],
																		dl_id: value.tf_dl_id[eachType],
																		qus_marks: value.tf_weightage[eachType],
																		qus_limit: value.tf_qcount[eachType],
																		status: 1
																})
																		.subscribe(
																				(result: any) => {
																						if (result && result.status === 'ok') {
																								if (result.data.length > 0) {
																										for (const eachq of result.data) {
																												eachq.tf_id = value.tf_id[eachType];
																												this.questionsOfEachEssayFilerArray.push(eachq);
																										}
																										this.totalSelectedQuestion += result.data.length;
																										if (fi === 0) {
																												this.getQuestion(fi);
																										}


																								}
																						}
																				});
														}
														this.questionsOfEachTemplateFilerArray[fi] = this.questionsOfEachEssayFilerArray;
												}
										}
										this.firstItem = this.filtersArray[0].qst_name;
										this.totalTemplateQuestion += Number(value.tf_qcount);
										this.currentTemplate = item;
										this.reviewQuestion = true;
										this.selectParameter = false;
										this.bannerdiv = true;
								}
								break;
						}
				}

		}
		getCurrentTemplate(value): void {
				for (const item of this.templateArray) {
						if (value === item.tp_id) {
								this.printTemplate = item;
						}
				}
				for (const item of this.classArray) {
						if (value === item.class_id) {
								this.currSelectedTemplateClass = item.class_name;
						}
				}
				for (const item of this.sectionArray) {
						if (value === item.sec_id) {
								this.currSelectedTemplateSection = item.sec_name;
						}
				}
				for (const item of this.subjectArray) {
						if (value === item.sub_id) {
								this.currSelectedTemplateSubject = item.sub_name;
						}
				}
		}
		viewTemplate(item) {
				this.printTemplate = item;
		}
		getTotal(i1, i2) {
				return Number(i1) * Number(i2);
		}
		getQuestion(tf_id_index) {
				this.currentTemplateFilterIndex = tf_id_index;
				this.questionsArray = [];
				this.questionsArray = this.questionsOfEachTemplateFilerArray[tf_id_index];
								if (Number(this.filtersArray[this.currentTemplateFilterIndex].tf_qst_id) === 1 &&
									Number(this.filtersArray[this.currentTemplateFilterIndex].tf_qt_id) === 2) {
						this.MCQ_ELEMENT_DATA = [];
						this.mcqdataSource = new MatTableDataSource<MCQElement>(this.MCQ_ELEMENT_DATA);
						this.paginator.pageIndex = 0;
						const optionsArray: any[] = [];
						const hoverArray: any[] = [];
						for (let i = 0; i < this.questionsArray.length; i++) {
								optionsArray[i] = '';
								hoverArray[i] = '';
						}
						let secondId = 0;
						let ind2 = 1;
						let t: any;
						for (t of this.questionsArray) {
								let id = 0;
								for (const option of t.options) {
										hoverArray[secondId] = (hoverArray[secondId] + (this.optionHA[id] + ':' + '&nbsp;&nbsp;' + option.qopt_options)) + '\n';
										if (option.qopt_answer === '1') {
												optionsArray[secondId] = optionsArray[secondId] + '<b>' + option.qopt_options + '</b>';
										}
										id++;
								}
								secondId++;
								this.MCQ_ELEMENT_DATA.push({
										select: ind2 - 1,
										action: ind2 - 1,
										position: ind2,
										question: t.qus_name,
										options: optionsArray[ind2 - 1],
										explanations: t.qus_explanation,
										skillType: t.skill_name,
										topic: t.topic_name,
										subtopic: t.st_name,
										suggestedMarks: t.qus_marks,
										reference: t.qus_historical_reference,
										showHover: hoverArray[ind2 - 1]
								});
								ind2++;
						}
						this.mcqdataSource = new MatTableDataSource<MCQElement>(this.MCQ_ELEMENT_DATA);

						this.mcqdataSource.paginator = this.paginator;
						this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
						this.mcqdataSource.sort = this.sort;
						this.lengthArrayMCQ[tf_id_index] = this.MCQ_ELEMENT_DATA.length;
								} else if (Number(this.filtersArray[this.currentTemplateFilterIndex].tf_qst_id) === 2
								&& Number(this.filtersArray[this.currentTemplateFilterIndex].tf_qt_id) === 2) {
						this.MULTI_MCQ_ELEMENT_DATA = [];
						this.multimcqdataSource = new MatTableDataSource<MultiMCQElement>(this.MULTI_MCQ_ELEMENT_DATA);
						this.paginator2.pageIndex = 0;
						const optionsArray: any[] = [];
						const hoverArray: any[] = [];
						for (let i = 0; i < this.questionsArray.length; i++) {
								optionsArray[i] = '';
								hoverArray[i] = '';
						}
						let third = 0;
						let ind3 = 1;
						let t: any;
						for (t of this.questionsArray) {
								let id2 = 0;
								for (const option of t.options) {
										hoverArray[third] = (hoverArray[third] + (this.optionHA[id2] + ':' + '&nbsp;' + option.qopt_options)) + '\n';
										if (option.qopt_answer === '1') {
												optionsArray[third] = optionsArray[third] + '<b>' + option.qopt_options + '</b>';
										}
										id2++;
								}
								third++;
								this.MULTI_MCQ_ELEMENT_DATA.push({
										selectMulti: ind3 - 1,
										actionMulti: ind3 - 1,
										positionMulti: ind3,
										questionMulti: t.qus_name,
										optionsMulti: optionsArray[ind3 - 1],
										explanationsMulti: t.qus_explanation,
										skillTypeMulti: t.skill_name,
										topicMulti: t.topic_name,
										subtopicMulti: t.st_name,
										suggestedMarksMulti: t.qus_marks,
										referenceMulti: t.qus_historical_reference,
										showHoverMulti: hoverArray[ind3 - 1]
								});
								ind3++;
						}
						this.multimcqdataSource = new MatTableDataSource<MultiMCQElement>(this.MULTI_MCQ_ELEMENT_DATA);
						this.multimcqdataSource.paginator = this.paginator2;
						this.sort2.sortChange.subscribe(() => this.paginator2.pageIndex = 0);
						this.mcqdataSource.sort = this.sort2;
						this.lengthArrayMCQMR[tf_id_index] = this.MULTI_MCQ_ELEMENT_DATA.length;
								} else if (Number(this.filtersArray[this.currentTemplateFilterIndex].tf_qst_id) === 3
								&& Number(this.filtersArray[this.currentTemplateFilterIndex].tf_qt_id) === 2) {
						this.TF_ELEMENT_DATA = [];
						this.tfdataSource = new MatTableDataSource<TFElement>(this.TF_ELEMENT_DATA);
						this.paginator3.pageIndex = 0;
						const optionsArray: any[] = [];
						const hoverArray: any[] = [];
						for (let i = 0; i < this.questionsArray.length; i++) {
								optionsArray[i] = '';
								hoverArray[i] = '';
						}
						let third = 0;
						let ind3 = 1;
						let t: any;
						for (t of this.questionsArray) {
								let id2 = 0;
								for (const option of t.options) {
										hoverArray[third] = (hoverArray[third] + (this.optionHA[id2] + ':' + '&nbsp;&nbsp;' + option.qopt_options)) + '\n';
										if (option.qopt_answer === '1') {
												optionsArray[third] = optionsArray[third] + '<b>' + option.qopt_options + '</b>';
										}
										id2++;
								}
								third++;
								this.TF_ELEMENT_DATA.push({
										selectTF: ind3 - 1,
										actionTF: ind3 - 1,
										positionTF: ind3,
										questionTF: t.qus_name,
										optionsTF: optionsArray[ind3 - 1],
										explanationsTF: t.qus_explanation,
										skillTypeTF: t.skill_name,
										topicTF: t.topic_name,
										subtopicTF: t.st_name,
										suggestedMarksTF: t.qus_marks,
										referenceTF: t.qus_historical_reference,
										showHoverTF: hoverArray[ind3 - 1]
								});
								ind3++;
						}
						this.tfdataSource = new MatTableDataSource<TFElement>(this.TF_ELEMENT_DATA);
						this.tfdataSource.paginator = this.paginator3;
						this.sort3.sortChange.subscribe(() => this.paginator3.pageIndex = 0);
						this.tfdataSource.sort = this.sort3;
						this.lengthArrayTF[tf_id_index] = this.TF_ELEMENT_DATA.length;
								} else if (Number(this.filtersArray[this.currentTemplateFilterIndex].tf_qst_id) === 4 &&
									Number(this.filtersArray[this.currentTemplateFilterIndex].tf_qt_id) === 2) {
						this.MATCH_ELEMENT_DATA = [];
						this.matchdataSource = new MatTableDataSource<MatchElement>(this.MATCH_ELEMENT_DATA);
						this.paginator4.pageIndex = 0;
						const optionsArray4: any[] = [];
						const hoverArray: any[] = [];
						for (let i = 0; i < this.questionsArray.length; i++) {
								optionsArray4[i] = '';
								hoverArray[i] = '';
						}
						let fifthId = 0;
						let ind5 = 1;
						let t: any;
						for (t of this.questionsArray) {
								let id4 = 0;
								for (const option of t.options) {
										hoverArray[fifthId] = (hoverArray[fifthId] + this.optionHA[id4] + ':' + '&nbsp;&nbsp;' +
												t.options[id4].qopt_options + this.optionmatchHA[id4] + ':' + '&nbsp;&nbsp;' +
												t.options[id4].qopt_options_match) + '\n';
										optionsArray4[fifthId] = optionsArray4[fifthId] + '<b>' + t.options[id4].qopt_answer + '<b>' + ',';
										id4++;
								}
								fifthId++;
								this.MATCH_ELEMENT_DATA.push({
										selectMatch: ind5 - 1,
										actionMatch: ind5 - 1,
										positionMatch: ind5,
										questionMatch: t.qus_name,
										optionsMatch: optionsArray4[ind5 - 1],
										explanationsMatch: t.qus_explanation,
										skillTypeMatch: t.skill_name,
										topicMatch: t.topic_name,
										subtopicMatch: t.st_name,
										suggestedMarksMatch: t.qus_marks,
										referenceMatch: t.qus_historical_reference,
										showHoverMatch: hoverArray[ind5 - 1]
								});
								ind5++;
						}
						this.matchdataSource = new MatTableDataSource<MatchElement>(this.MATCH_ELEMENT_DATA);
						this.matchdataSource.paginator = this.paginator4;
						this.sort4.sortChange.subscribe(() => this.paginator4.pageIndex = 0);
						this.matchdataSource.sort = this.sort4;
						this.lengthArrayMTF[tf_id_index] = this.MATCH_ELEMENT_DATA.length;

								} else if (Number(this.filtersArray[this.currentTemplateFilterIndex].tf_qst_id) === 5 &&
									Number(this.filtersArray[this.currentTemplateFilterIndex].tf_qt_id) === 2) {
						this.MATRIX_MATCH_ELEMENT_DATA = [];
						this.matrixmatchdataSource = new MatTableDataSource<MatrixMatchElement>(this.MATRIX_MATCH_ELEMENT_DATA);
						this.paginator5.pageIndex = 0;
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
										while (id13 < 4) {
												if (answerrow[id13].qopt_answer === '1') {
														answerArray3[tenthId] = answerArray3[tenthId] + this.optionmatchHA[id13];
												} else {
														answerArray3[tenthId] = answerArray3[tenthId] + '';
												}
												id13++;
										}
										tenthId++;
										hoverArray[ninthId] = (optionsArray6[ninthId] + '\n' + matchArray[ninthId]) + '\n';
										answerArray[ninthId] = (answerArray[ninthId] + '<b>' + answerArray3[id9] + '</b>') + '<br>';
										id9++;
								}
								ninthId++;
								this.MATRIX_MATCH_ELEMENT_DATA.push({
										selectMatrixMatch: ind6 - 1,
										actionMatrixMatch: ind6 - 1,
										positionMatrixMatch: ind6,
										questionMatrixMatch: t.qus_name,
										optionsMatrixMatch: answerArray[ind6 - 1],
										explanationsMatrixMatch: t.qus_explanation,
										skillTypeMatrixMatch: t.skill_name,
										topicMatrixMatch: t.topic_name,
										subtopicMatrixMatch: t.st_name,
										suggestedMarksMatrixMatch: t.qus_marks,
										referenceMatrixMatch: t.qus_historical_reference,
										showHoverMatrixMatch: hoverArray[ind6 - 1]
								});
								ind6++;
						}
						this.matrixmatchdataSource = new MatTableDataSource<MatrixMatchElement>(this.MATRIX_MATCH_ELEMENT_DATA);
						this.matrixmatchdataSource.paginator = this.paginator5;
						this.sort5.sortChange.subscribe(() => this.paginator5.pageIndex = 0);
						this.matrixmatchdataSource.sort = this.sort5;
						this.lengthArrayMatrix[tf_id_index] = this.MATRIX_MATCH_ELEMENT_DATA.length;
								} else if (Number(this.filtersArray[this.currentTemplateFilterIndex].tf_qst_id) === 13 &&
									Number(this.filtersArray[this.currentTemplateFilterIndex].tf_qt_id) === 2) {
						this.MATRIX_MATCH_ELEMENT_4X5_DATA = [];
						this.matrixmatch45dataSource = new MatTableDataSource<MatrixMatch45Element>(this.MATRIX_MATCH_ELEMENT_4X5_DATA);
						this.paginator15.pageIndex = 0;
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
								this.MATRIX_MATCH_ELEMENT_4X5_DATA.push({
										selectMatrixMatch: ind6 - 1,
										actionMatrixMatch: ind6 - 1,
										positionMatrixMatch: ind6,
										questionMatrixMatch: t.qus_name,
										optionsMatrixMatch: answerArray[ind6 - 1],
										explanationsMatrixMatch: t.qus_explanation,
										skillTypeMatrixMatch: t.skill_name,
										topicMatrixMatch: t.topic_name,
										subtopicMatrixMatch: t.st_name,
										suggestedMarksMatrixMatch: t.qus_marks,
										referenceMatrixMatch: t.qus_historical_reference,
										showHoverMatrixMatch: hoverArray[ind6 - 1]
								});
								ind6++;
						}
						this.matrixmatch45dataSource = new MatTableDataSource<MatrixMatch45Element>(this.MATRIX_MATCH_ELEMENT_4X5_DATA);
						this.matrixmatch45dataSource.paginator = this.paginator15;
						this.sort5.sortChange.subscribe(() => this.paginator15.pageIndex = 0);
						this.matrixmatch45dataSource.sort = this.sort15;
						this.lengthArrayMatrix45[tf_id_index] = this.MATRIX_MATCH_ELEMENT_4X5_DATA.length;
								} else if (Number(this.filtersArray[this.currentTemplateFilterIndex].tf_qst_id) === 14 &&
									Number(this.filtersArray[this.currentTemplateFilterIndex].tf_qt_id) === 2) {
						this.SINGLE_ELEMENT_DATA = [];
						this.singledataSource = new MatTableDataSource<SingleIntegerElement>(this.SINGLE_ELEMENT_DATA);
						this.paginator16.pageIndex = 0;
						let ind = 1;
						let t: any;
						for (t of this.questionsArray) {
								this.SINGLE_ELEMENT_DATA.push({
										select: ind - 1,
										action: ind - 1,
										position: ind,
										question: t.qus_name,
										// tslint:disable-next-line:max-line-length
										answer: '<button mat-icon style=\'border-radius:50% !important;border:none !important;color:white;font-weight:bold !important;color:white !important;color:white;background-color:#6c65c8 !important;height:40px !important;width:40px !important\'>'
												+ t.qopt_answer + '</button>',
										explanations: t.qus_explanation,
										skillType: t.skill_name,
										topic: t.topic_name,
										subtopic: t.st_name,
										suggestedMarks: t.qus_marks,
										reference: t.qus_historical_reference
								});
								ind++;
						}
						this.singledataSource = new MatTableDataSource<SingleIntegerElement>(this.SINGLE_ELEMENT_DATA);
						this.singledataSource.paginator = this.paginator16;
						this.sort16.sortChange.subscribe(() => this.paginator16.pageIndex = 0);
						this.singledataSource.sort = this.sort16;
						this.lengthArraySingleInteger[tf_id_index] = this.SINGLE_ELEMENT_DATA.length;
								} else if (Number(this.filtersArray[this.currentTemplateFilterIndex].tf_qst_id) === 15 &&
									Number(this.filtersArray[this.currentTemplateFilterIndex].tf_qt_id) === 2) {
						this.DOUBLE_ELEMENT_DATA = [];
						this.doubledataSource = new MatTableDataSource<DoubleIntegerElement>(this.DOUBLE_ELEMENT_DATA);
						this.paginator17.pageIndex = 0;
						let ind = 1;
						let t: any;
						for (t of this.questionsArray) {
								this.DOUBLE_ELEMENT_DATA.push({
										select: ind - 1,
										action: ind - 1,
										position: ind,
										question: t.qus_name,
										// tslint:disable-next-line:max-line-length
										answer: '<button mat-icon style=\'border-radius:50% !important;border:none !important;color:white;font-weight:bold !important;color:white !important;color:white;background-color:#6c65c8 !important;height:40px !important;width:40px !important\'>'
												+ t.qopt_answer.charAt(0) + '</button>' +
												// tslint:disable-next-line:max-line-length
												'<button mat-icon style=\'border-radius:50% !important;border:none !important;color:white;font-weight:bold !important;color:white !important;color:white;background-color:#6c65c8 !important;height:40px !important;width:40px !important\'>'
												+ t.qopt_answer.charAt(1) + '</button>',
										explanations: t.qus_explanation,
										skillType: t.skill_name,
										topic: t.topic_name,
										subtopic: t.st_name,
										suggestedMarks: t.qus_marks,
										reference: t.qus_historical_reference
								});
								ind++;
						}
						this.doubledataSource = new MatTableDataSource<DoubleIntegerElement>(this.DOUBLE_ELEMENT_DATA);
						this.doubledataSource.paginator = this.paginator17;
						this.sort17.sortChange.subscribe(() => this.paginator17.pageIndex = 0);
						this.doubledataSource.sort = this.sort17;
						this.lengthArrayDoubleInteger[tf_id_index] = this.DOUBLE_ELEMENT_DATA.length;
								} else if (Number(this.filtersArray[this.currentTemplateFilterIndex].tf_qst_id) === 6 &&
									Number(this.filtersArray[this.currentTemplateFilterIndex].tf_qt_id) === 1) {
						this.FILL_ELEMENT_DATA = [];
						this.filldataSource = new MatTableDataSource<FillElement>(this.FILL_ELEMENT_DATA);
						this.paginator6.pageIndex = 0;
						let ind = 1;
						let t: any;
						for (t of this.questionsArray) {
								this.FILL_ELEMENT_DATA.push({
										selectSub: ind - 1,
										actionSub: ind - 1,
										positionSub: ind,
										questionSub: t.qus_name,
										answerSub: t.qopt_answer,
										explanationsSub: t.qus_explanation,
										skillTypeSub: t.skill_name,
										topicSub: t.topic_name,
										subtopicSub: t.st_name,
										suggestedMarksSub: t.qus_marks,
										referenceSub: t.qus_historical_reference
								});
								ind++;
						}
						this.filldataSource = new MatTableDataSource<FillElement>(this.FILL_ELEMENT_DATA);
						this.filldataSource.paginator = this.paginator6;
						this.sort6.sortChange.subscribe(() => this.paginator6.pageIndex = 0);
						this.filldataSource.sort = this.sort6;
						this.lengthArrayFill[tf_id_index] = this.FILL_ELEMENT_DATA.length;
								} else if (Number(this.filtersArray[this.currentTemplateFilterIndex].tf_qst_id) === 7 &&
									Number(this.filtersArray[this.currentTemplateFilterIndex].tf_qt_id) === 1) {
						this.IDENTIFY_ELEMENT_DATA = [];
						this.identifydataSource = new MatTableDataSource<IdentifyElement>(this.IDENTIFY_ELEMENT_DATA);
						this.paginator7.pageIndex = 0;
						let ind = 1;
						let t: any;
						for (t of this.questionsArray) {
								this.IDENTIFY_ELEMENT_DATA.push({
										selectSub: ind - 1,
										actionSub: ind - 1,
										positionSub: ind,
										questionSub: t.qus_name,
										answerSub: t.qopt_answer,
										explanationsSub: t.qus_explanation,
										skillTypeSub: t.skill_name,
										topicSub: t.topic_name,
										subtopicSub: t.st_name,
										suggestedMarksSub: t.qus_marks,
										referenceSub: t.qus_historical_reference
								});
								ind++;
						}
						this.identifydataSource = new MatTableDataSource<IdentifyElement>(this.IDENTIFY_ELEMENT_DATA);
						this.identifydataSource.paginator = this.paginator7;
						this.sort7.sortChange.subscribe(() => this.paginator7.pageIndex = 0);
						this.identifydataSource.sort = this.sort7;
						this.lengthArrayIdentify[tf_id_index] = this.IDENTIFY_ELEMENT_DATA.length;
								} else if (Number(this.filtersArray[this.currentTemplateFilterIndex].tf_qst_id) === 8 &&
									Number(this.filtersArray[this.currentTemplateFilterIndex].tf_qt_id) === 1) {
						this.ONE_ELEMENT_DATA = [];
						this.onedataSource = new MatTableDataSource<OneElement>(this.ONE_ELEMENT_DATA);
						this.paginator8.pageIndex = 0;
						let ind = 1;
						let t: any;
						for (t of this.questionsArray) {
								this.ONE_ELEMENT_DATA.push({
										selectSub: ind - 1,
										actionSub: ind - 1,
										positionSub: ind,
										questionSub: t.qus_name,
										answerSub: t.qopt_answer,
										explanationsSub: t.qus_explanation,
										skillTypeSub: t.skill_name,
										topicSub: t.topic_name,
										subtopicSub: t.st_name,
										suggestedMarksSub: t.qus_marks,
										referenceSub: t.qus_historical_reference
								});
								ind++;
						}
						this.onedataSource = new MatTableDataSource<OneElement>(this.ONE_ELEMENT_DATA);
						this.onedataSource.paginator = this.paginator8;
						this.sort8.sortChange.subscribe(() => this.paginator8.pageIndex = 0);
						this.onedataSource.sort = this.sort8;
						this.lengthArrayOne[tf_id_index] = this.ONE_ELEMENT_DATA.length;
								} else if (Number(this.filtersArray[this.currentTemplateFilterIndex].tf_qst_id) === 9 &&
									Number(this.filtersArray[this.currentTemplateFilterIndex].tf_qt_id) === 1) {
						this.VERYSHORT_ELEMENT_DATA = [];
						this.veryshortdataSource = new MatTableDataSource<VeryShortElement>(this.VERYSHORT_ELEMENT_DATA);
						this.paginator9.pageIndex = 0;
						let ind = 1;
						let t: any;
						for (t of this.questionsArray) {
								this.VERYSHORT_ELEMENT_DATA.push({
										selectSub: ind - 1,
										actionSub: ind - 1,
										positionSub: ind,
										questionSub: t.qus_name,
										answerSub: t.qopt_answer,
										explanationsSub: t.qus_explanation,
										skillTypeSub: t.skill_name,
										topicSub: t.topic_name,
										subtopicSub: t.st_name,
										suggestedMarksSub: t.qus_marks,
										referenceSub: t.qus_historical_reference
								});
								ind++;
						}
						this.veryshortdataSource = new MatTableDataSource<VeryShortElement>(this.VERYSHORT_ELEMENT_DATA);
						this.veryshortdataSource.paginator = this.paginator9;
						this.sort9.sortChange.subscribe(() => this.paginator9.pageIndex = 0);
						this.veryshortdataSource.sort = this.sort9;
						this.lengthArrayVeryShort[tf_id_index] = this.VERYSHORT_ELEMENT_DATA.length;
								} else if (Number(this.filtersArray[this.currentTemplateFilterIndex].tf_qst_id) === 10 &&
									Number(this.filtersArray[this.currentTemplateFilterIndex].tf_qt_id) === 1) {
						this.SHORT_ELEMENT_DATA = [];
						this.shortdataSource = new MatTableDataSource<ShortElement>(this.SHORT_ELEMENT_DATA);
						this.paginator.pageIndex = 0;
						let ind = 1;
						let t: any;
						for (t of this.questionsArray) {
								this.SHORT_ELEMENT_DATA.push({
										selectSub: ind - 1,
										actionSub: ind - 1,
										positionSub: ind,
										questionSub: t.qus_name,
										answerSub: t.qopt_answer,
										explanationsSub: t.qus_explanation,
										skillTypeSub: t.skill_name,
										topicSub: t.topic_name,
										subtopicSub: t.st_name,
										suggestedMarksSub: t.qus_marks,
										referenceSub: t.qus_historical_reference
								});
								ind++;
						}
						this.shortdataSource = new MatTableDataSource<ShortElement>(this.SHORT_ELEMENT_DATA);
						this.shortdataSource.paginator = this.paginator10;
						this.sort10.sortChange.subscribe(() => this.paginator10.pageIndex = 0);
						this.shortdataSource.sort = this.sort10;
						this.lengthArrayShort[tf_id_index] = this.SHORT_ELEMENT_DATA.length;
								} else if (Number(this.filtersArray[this.currentTemplateFilterIndex].tf_qst_id) === 11 &&
									Number(this.filtersArray[this.currentTemplateFilterIndex].tf_qt_id) === 1) {
						this.LONG_ELEMENT_DATA = [];
						this.longdataSource = new MatTableDataSource<LongElement>(this.LONG_ELEMENT_DATA);
						this.paginator11.pageIndex = 0;
						let ind = 1;
						let t: any;
						for (t of this.questionsArray) {
								this.LONG_ELEMENT_DATA.push({
										selectSub: ind - 1,
										actionSub: ind - 1,
										positionSub: ind,
										questionSub: t.qus_name,
										answerSub: t.qopt_answer,
										explanationsSub: t.qus_explanation,
										skillTypeSub: t.skill_name,
										topicSub: t.topic_name,
										subtopicSub: t.st_name,
										suggestedMarksSub: t.qus_marks,
										referenceSub: t.qus_historical_reference
								});
								ind++;
						}
						this.longdataSource = new MatTableDataSource<LongElement>(this.LONG_ELEMENT_DATA);
						this.longdataSource.paginator = this.paginator11;
						this.sort11.sortChange.subscribe(() => this.paginator11.pageIndex = 0);
						this.longdataSource.sort = this.sort11;
						this.lengthArrayLong[tf_id_index] = this.LONG_ELEMENT_DATA.length;
								} else if (Number(this.filtersArray[this.currentTemplateFilterIndex].tf_qst_id) === 12 &&
									Number(this.filtersArray[this.currentTemplateFilterIndex].tf_qt_id) === 1) {
						this.VERYLONG_ELEMENT_DATA = [];
						this.verylongdataSource = new MatTableDataSource<VeryLongElement>(this.VERYLONG_ELEMENT_DATA);
						this.paginator12.pageIndex = 0;
						let ind = 1;
						let t: any;
						for (t of this.questionsArray) {
								this.VERYLONG_ELEMENT_DATA.push({
										selectSub: ind - 1,
										actionSub: ind - 1,
										positionSub: ind,
										questionSub: t.qus_name,
										answerSub: t.qopt_answer,
										explanationsSub: t.qus_explanation,
										skillTypeSub: t.skill_name,
										topicSub: t.topic_name,
										subtopicSub: t.st_name,
										suggestedMarksSub: t.qus_marks,
										referenceSub: t.qus_historical_reference
								});
								ind++;
						}
						this.verylongdataSource = new MatTableDataSource<VeryLongElement>(this.VERYLONG_ELEMENT_DATA);
						this.verylongdataSource.paginator = this.paginator12;
						this.sort12.sortChange.subscribe(() => this.paginator12.pageIndex = 0);
						this.verylongdataSource.sort = this.sort12;
						this.lengthArrayVeryLong[tf_id_index] = this.VERYLONG_ELEMENT_DATA.length;
				}
				// tslint:disable-next-line:one-line
				if (Number(this.filtersArray[this.currentTemplateFilterIndex].tf_qt_id) === 3) {
						this.ESSAYQUESTION_ELEMENT_DATA = [];
						this.essayquestionDatasource = new MatTableDataSource<ESSAYQUESTIONElement>(this.ESSAYQUESTION_ELEMENT_DATA);
						const optionsArray: any[] = [];
						const hoverArray: any[] = [];

						for (let i = 0; i < this.questionsOfEachEssayFilerArray.length; i++) {
								optionsArray[i] = '';
								hoverArray[i] = '';
						}
						let outerId = 0;
						let ind = 1;
						let t: any;

						for (t of this.questionsOfEachEssayFilerArray) {
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
										if ((Number(t.qus_qst_id) > 5 && Number(t.qus_qst_id) < 13)) {
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
										action: ind - 1,
										showHover: hoverArray[ind - 1]
								});
								ind++;
								this.essayquestionDatasource = new MatTableDataSource<ESSAYQUESTIONElement>(this.ESSAYQUESTION_ELEMENT_DATA);
								setTimeout(() => this.essayquestionDatasource.paginator = this.paginator14);
								this.sort14.sortChange.subscribe(() => this.paginator14.pageIndex = 0);
								this.essayquestionDatasource.sort = this.sort14;
						}

				}
		}
		backtoParameter() {
				this.finalQuestion = false;
				this.reviewQuestion = false;
				this.selectParameter = true;
				this.qpq_qus_position = 0;
		}
		backtoSelectQuestion() {
				this.finalQuestion = false;
				this.reviewQuestion = true;
				this.getFilters();
				this.selectParameter = false;
				this.qpq_qus_position = 0;
		}
		getColormcqmr(qansa) {
				if (qansa === '1') {
						return '#6c81f7';
				} else {
						return '';
				}
		}
		replaceOneQuestionMulti(indexV) {
				const currentQus = this.questionsArray[indexV];
				this.qelementService.getQuestionsInTemplate({
						qm_id: 1,
						qt_id: currentQus.qus_qt_id,
						qst_id: currentQus.qus_qst_id,
						st_id: currentQus.qus_st_id,
						skill_id: currentQus.qus_skill_id,
						dl_id: currentQus.qus_dl_id,
						qus_marks: currentQus.qus_marks,
						qus_limit: 1,
						status: 1
				})
						.subscribe(
								(result: any) => {
										if (result && result.status === 'ok') {
												const replacedQus = result.data[0];
												if (this.questionsArray.indexOf(replacedQus.qus_id) !== -1) {
														this.replaceOneQuestionMulti(indexV);
												}
												this.questionsArray[indexV] = replacedQus;
												const optionsArray: any[] = [];
												const hoverArray: any[] = [];
												optionsArray[indexV] = '';
												hoverArray[indexV] = '';
												let id2 = 0;
												for (const option of replacedQus.options) {
														// tslint:disable-next-line:max-line-length
														hoverArray[indexV] = (hoverArray[indexV] + (this.optionHA[id2] + ':' + '&nbsp;&nbsp;' + option.qopt_options)) + '\n';
														if (option.qopt_answer === '1') {
																optionsArray[indexV] = optionsArray[indexV] + '<b>' + option.qopt_options + '</b>';
														}
														id2++;
												}
												// For Mulitple MCQ
												this.MULTI_MCQ_ELEMENT_DATA[indexV].questionMulti = replacedQus.qus_name;
												this.MULTI_MCQ_ELEMENT_DATA[indexV].explanationsMulti = replacedQus.qus_explanation;
												this.MULTI_MCQ_ELEMENT_DATA[indexV].optionsMulti = optionsArray[indexV];
												this.MULTI_MCQ_ELEMENT_DATA[indexV].showHoverMulti = hoverArray[indexV];
												this.MULTI_MCQ_ELEMENT_DATA[indexV].skillTypeMulti = replacedQus.qus_skill_id;
												this.MULTI_MCQ_ELEMENT_DATA[indexV].topicMulti = replacedQus.topic_name;
												this.MULTI_MCQ_ELEMENT_DATA[indexV].subtopicMulti = replacedQus.st_name;
												this.MULTI_MCQ_ELEMENT_DATA[indexV].suggestedMarksMulti = replacedQus.qus_marks;
												this.MULTI_MCQ_ELEMENT_DATA[indexV].referenceMulti = replacedQus.qus_historical_reference;
												this.multimcqdataSource = new MatTableDataSource<MultiMCQElement>(this.MULTI_MCQ_ELEMENT_DATA);
												// Multiple MCQ Ends
										}
								}
						);
		}
		replaceOneQuestionMCQ(indexV) {
				const currentQus = this.questionsArray[indexV];
				this.qelementService.getQuestionsInTemplate({
						qm_id: 1,
						qt_id: currentQus.qus_qt_id,
						qst_id: currentQus.qus_qst_id,
						st_id: currentQus.qus_st_id,
						skill_id: currentQus.qus_skill_id,
						dl_id: currentQus.qus_dl_id,
						qus_marks: currentQus.qus_marks,
						qus_limit: 1,
						status: 1
				})
						.subscribe(
								(result: any) => {
										if (result && result.status === 'ok') {
												const replacedQus = result.data[0];
												if (this.questionsArray.indexOf(replacedQus.qus_id) !== -1) {
														this.replaceOneQuestionMCQ(indexV);
												}
												this.questionsArray[indexV] = replacedQus;
												const optionsArray: any[] = [];
												const hoverArray: any[] = [];
												optionsArray[indexV] = '';
												hoverArray[indexV] = '';
												let id2 = 0;
												for (const option of replacedQus.options) {
														// tslint:disable-next-line:max-line-length
														hoverArray[indexV] = (hoverArray[indexV] + (this.optionHA[id2] + ':' + '&nbsp;&nbsp;' + option.qopt_options)) + '\n';
														if (option.qopt_answer === '1') {
																optionsArray[indexV] = optionsArray[indexV] + '<b>' + option.qopt_options + '</b>';
														}
														id2++;
												}
												// For MCQ
												this.MCQ_ELEMENT_DATA[indexV].question = replacedQus.qus_name;
												this.MCQ_ELEMENT_DATA[indexV].explanations = replacedQus.qus_explanation;
												this.MCQ_ELEMENT_DATA[indexV].options = optionsArray[indexV];
												this.MCQ_ELEMENT_DATA[indexV].showHover = hoverArray[indexV];
												this.MCQ_ELEMENT_DATA[indexV].skillType = replacedQus.qus_skill_id;
												this.MCQ_ELEMENT_DATA[indexV].topic = replacedQus.topic_name;
												this.MCQ_ELEMENT_DATA[indexV].subtopic = replacedQus.st_name;
												this.MCQ_ELEMENT_DATA[indexV].suggestedMarks = replacedQus.qus_marks;
												this.MCQ_ELEMENT_DATA[indexV].reference = replacedQus.qus_historical_reference;
												this.mcqdataSource = new MatTableDataSource<MCQElement>(this.MCQ_ELEMENT_DATA);
												// MCQ Ends
										}
								}
						);
		}
		replaceOneQuestionTF(indexV) {
				const currentQus = this.questionsArray[indexV];
				this.qelementService.getQuestionsInTemplate({
						qm_id: 1,
						qt_id: currentQus.qus_qt_id,
						qst_id: currentQus.qus_qst_id,
						st_id: currentQus.qus_st_id,
						skill_id: currentQus.qus_skill_id,
						dl_id: currentQus.qus_dl_id,
						qus_marks: currentQus.qus_marks,
						qus_limit: 1,
						status: 1
				})
						.subscribe(
								(result: any) => {
										if (result && result.status === 'ok') {
												const replacedQus = result.data[0];
												if (this.questionsArray.indexOf(replacedQus.qus_id) !== -1) {
														this.replaceOneQuestionTF(indexV);
												}
												this.questionsArray[indexV] = replacedQus;
												const optionsArray: any[] = [];
												const hoverArray: any[] = [];
												optionsArray[indexV] = '';
												hoverArray[indexV] = '';
												let id2 = 0;
												for (const option of replacedQus.options) {
														// tslint:disable-next-line:max-line-length
														hoverArray[indexV] = (hoverArray[indexV] + (this.optionHA[id2] + ':' + '&nbsp;&nbsp;' + option.qopt_options)) + '\n';
														if (option.qopt_answer === '1') {
																optionsArray[indexV] = optionsArray[indexV] + '<b>' + option.qopt_options + '</b>';
														}
														id2++;
												}
												// For True-False
												this.TF_ELEMENT_DATA[indexV].questionTF = replacedQus.qus_name;
												this.TF_ELEMENT_DATA[indexV].explanationsTF = replacedQus.qus_explanation;
												this.TF_ELEMENT_DATA[indexV].optionsTF = optionsArray[indexV];
												this.TF_ELEMENT_DATA[indexV].showHoverTF = hoverArray[indexV];
												this.TF_ELEMENT_DATA[indexV].skillTypeTF = replacedQus.qus_skill_id;
												this.TF_ELEMENT_DATA[indexV].topicTF = replacedQus.topic_name;
												this.TF_ELEMENT_DATA[indexV].subtopicTF = replacedQus.st_name;
												this.TF_ELEMENT_DATA[indexV].suggestedMarksTF = replacedQus.qus_marks;
												this.TF_ELEMENT_DATA[indexV].referenceTF = replacedQus.qus_historical_reference;
												this.tfdataSource = new MatTableDataSource<TFElement>(this.TF_ELEMENT_DATA);
												// True-False Ends
										}
								}
						);
		}
		replaceOneQuestionMatch(indexV) {
				const currentQus = this.questionsArray[indexV];
				this.qelementService.getQuestionsInTemplate({
						qm_id: 1,
						qt_id: currentQus.qus_qt_id,
						qst_id: currentQus.qus_qst_id,
						st_id: currentQus.qus_st_id,
						skill_id: currentQus.qus_skill_id,
						dl_id: currentQus.qus_dl_id,
						qus_marks: currentQus.qus_marks,
						qus_limit: 1,
						status: 1
				})
						.subscribe(
								(result: any) => {
										if (result && result.status === 'ok') {
												const replacedQus = result.data[0];
												if (this.questionsArray.indexOf(replacedQus.qus_id) !== -1) {
														this.replaceOneQuestionMatch(indexV);
												}
												this.questionsArray[indexV] = replacedQus;
												const optionsArray: any[] = [];
												const hoverArray: any[] = [];
												optionsArray[indexV] = '';
												hoverArray[indexV] = '';
												let id2 = 0;
												for (const option of replacedQus.options) {
														// tslint:disable-next-line:max-line-length
														hoverArray[indexV] = (hoverArray[indexV] + (this.optionHA[id2] + ':' + '&nbsp;&nbsp;' + option.qopt_options + this.optionmatchHA[id2] + ':' + '&nbsp;&nbsp; ' + option.qopt_options_match)) + '\n';
														optionsArray[indexV] = optionsArray[indexV] + '<b>' + option.qopt_answer + '</b>' + ',';
														id2++;
												}
												// For Match the Following
												this.MATCH_ELEMENT_DATA[indexV].questionMatch = replacedQus.qus_name;
												this.MATCH_ELEMENT_DATA[indexV].explanationsMatch = replacedQus.qus_explanation;
												this.MATCH_ELEMENT_DATA[indexV].optionsMatch = optionsArray[indexV];
												this.MATCH_ELEMENT_DATA[indexV].showHoverMatch = hoverArray[indexV];
												this.MATCH_ELEMENT_DATA[indexV].skillTypeMatch = replacedQus.qus_skill_id;
												this.MATCH_ELEMENT_DATA[indexV].topicMatch = replacedQus.topic_name;
												this.MATCH_ELEMENT_DATA[indexV].subtopicMatch = replacedQus.st_name;
												this.MATCH_ELEMENT_DATA[indexV].suggestedMarksMatch = replacedQus.qus_marks;
												this.MATCH_ELEMENT_DATA[indexV].referenceMatch = replacedQus.qus_historical_reference;
												this.matchdataSource = new MatTableDataSource<MatchElement>(this.MATCH_ELEMENT_DATA);
												// Match the Following Ends
										}
								}
						);
		}
		replaceOneQuestionMatrixMatch(indexV) {
				const currentQus = this.questionsArray[indexV];
				this.qelementService.getQuestionsInTemplate({
						qm_id: 1,
						qt_id: currentQus.qus_qt_id,
						qst_id: currentQus.qus_qst_id,
						st_id: currentQus.qus_st_id,
						skill_id: currentQus.qus_skill_id,
						dl_id: currentQus.qus_dl_id,
						qus_marks: currentQus.qus_marks,
						qus_limit: 1,
						status: 1
				})
						.subscribe(
								(result: any) => {
										if (result && result.status === 'ok') {
												const replacedQus = result.data[0];
												if (this.questionsArray.indexOf(replacedQus.qus_id) !== -1) {
														this.replaceOneQuestionMatrixMatch(indexV);
												}
												this.questionsArray[indexV] = replacedQus;
												const optionsArray6: any[] = [];
												const hoverArray: any[] = [];
												const matchArray: any[] = [];
												const answerArray3: any[] = [];
												const answerArray: any[] = [];
												optionsArray6[indexV] = '';
												matchArray[indexV] = '';
												hoverArray[indexV] = '';
												answerArray[indexV] = '';
												answerArray3[indexV] = '';
												answerArray3[0] = '';
												answerArray3[1] = '';
												answerArray3[2] = '';
												answerArray3[3] = '';
												let id7 = 0,
														id8 = 0;
												for (const option of replacedQus.options) {
														optionsArray6[indexV] = optionsArray6[indexV] + this.optionHA[id7] + ':' + option.qopt_options;
														id7++;
												}
												for (const option_match of replacedQus.options_match) {
														matchArray[indexV] = matchArray[indexV] + this.optionmatchHA[id8] + ':' + option_match.qopt_options_match;
														id8++;
												}
												for (const answerrow of replacedQus.answer) {
														let id13 = 0;
														while (id13 < 4) {
																if (answerrow[id13].qopt_answer === '1') {
																		answerArray3[indexV] = answerArray3[indexV] + this.optionmatchHA[id13];
																} else {
																		answerArray3[indexV] = answerArray3[indexV] + '';
																}
																id13++;
														}
												}
												hoverArray[indexV] = (optionsArray6[indexV] + '\n' + matchArray[indexV]) + '\n';
												answerArray[indexV] = answerArray[indexV] + ('<b>' + answerArray3[indexV] + '</b>' + '<br>');
												// For Match the Following
												this.MATRIX_MATCH_ELEMENT_DATA[indexV].questionMatrixMatch = replacedQus.qus_name;
												this.MATRIX_MATCH_ELEMENT_DATA[indexV].explanationsMatrixMatch = replacedQus.qus_explanation;
												this.MATRIX_MATCH_ELEMENT_DATA[indexV].optionsMatrixMatch = answerArray[indexV];
												this.MATRIX_MATCH_ELEMENT_DATA[indexV].showHoverMatrixMatch = hoverArray[indexV];
												this.MATRIX_MATCH_ELEMENT_DATA[indexV].skillTypeMatrixMatch = replacedQus.qus_skill_id;
												this.MATRIX_MATCH_ELEMENT_DATA[indexV].topicMatrixMatch = replacedQus.topic_name;
												this.MATRIX_MATCH_ELEMENT_DATA[indexV].subtopicMatrixMatch = replacedQus.st_name;
												this.MATRIX_MATCH_ELEMENT_DATA[indexV].suggestedMarksMatrixMatch = replacedQus.qus_marks;
												this.MATRIX_MATCH_ELEMENT_DATA[indexV].referenceMatrixMatch = replacedQus.qus_historical_reference;
												this.matrixmatchdataSource = new MatTableDataSource<MatrixMatchElement>(this.MATRIX_MATCH_ELEMENT_DATA);
												// Match the Following Ends
										}
								}
						);
		}
		// Matrix 4 * 5

		replaceOneQuestionMatrixMatch45(indexV) {
				const currentQus = this.questionsArray[indexV];
				this.qelementService.getQuestionsInTemplate({
						qm_id: 1,
						qt_id: currentQus.qus_qt_id,
						qst_id: currentQus.qus_qst_id,
						st_id: currentQus.qus_st_id,
						skill_id: currentQus.qus_skill_id,
						dl_id: currentQus.qus_dl_id,
						qus_marks: currentQus.qus_marks,
						qus_limit: 1,
						status: 1
				})
						.subscribe(
								(result: any) => {
										if (result && result.status === 'ok') {
												const replacedQus = result.data[0];
												if (this.questionsArray.indexOf(replacedQus.qus_id) !== -1) {
														this.replaceOneQuestionMatrixMatch45(indexV);
												}
												this.questionsArray[indexV] = replacedQus;
												const optionsArray6: any[] = [];
												const hoverArray: any[] = [];
												const matchArray: any[] = [];
												const answerArray3: any[] = [];
												const answerArray: any[] = [];
												optionsArray6[indexV] = '';
												matchArray[indexV] = '';
												hoverArray[indexV] = '';
												answerArray[indexV] = '';
												answerArray3[indexV] = '';
												answerArray3[0] = '';
												answerArray3[1] = '';
												answerArray3[2] = '';
												answerArray3[3] = '';
												let id7 = 0,
														id8 = 0,
														tenthId = 0;
												for (const option of replacedQus.options) {
														optionsArray6[indexV] = optionsArray6[indexV] + this.optionHA[id7] + ':' + option.qopt_options;
														id7++;
												}
												for (const option_match of replacedQus.options_match) {
														matchArray[indexV] = matchArray[indexV] + this.optionmatchHA[id8] + ':' + option_match.qopt_options_match;
														id8++;
												}
												for (const answerrow of replacedQus.answer) {
														let id13 = 0;
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
														answerArray3[tenthId] = answerArray3[tenthId] + '<br>';
														tenthId++;
												}
												hoverArray[indexV] = (optionsArray6[indexV] + '\n' + matchArray[indexV]) + '\n';
												answerArray[indexV] = answerArray[indexV] + ('<b>' + answerArray3 + '</b>');
												this.MATRIX_MATCH_ELEMENT_4X5_DATA[indexV].questionMatrixMatch = replacedQus.qus_name;
												this.MATRIX_MATCH_ELEMENT_4X5_DATA[indexV].explanationsMatrixMatch = replacedQus.qus_explanation;
												this.MATRIX_MATCH_ELEMENT_4X5_DATA[indexV].optionsMatrixMatch = answerArray[indexV];
												this.MATRIX_MATCH_ELEMENT_4X5_DATA[indexV].showHoverMatrixMatch = hoverArray[indexV];
												this.MATRIX_MATCH_ELEMENT_4X5_DATA[indexV].skillTypeMatrixMatch = replacedQus.qus_skill_id;
												this.MATRIX_MATCH_ELEMENT_4X5_DATA[indexV].topicMatrixMatch = replacedQus.topic_name;
												this.MATRIX_MATCH_ELEMENT_4X5_DATA[indexV].subtopicMatrixMatch = replacedQus.st_name;
												this.MATRIX_MATCH_ELEMENT_4X5_DATA[indexV].suggestedMarksMatrixMatch = replacedQus.qus_marks;
												this.MATRIX_MATCH_ELEMENT_4X5_DATA[indexV].referenceMatrixMatch = replacedQus.qus_historical_reference;
												this.matrixmatch45dataSource = new MatTableDataSource<MatrixMatch45Element>(this.MATRIX_MATCH_ELEMENT_4X5_DATA);
										}
								}
						);
		}

		// End

		// Single Integer
		replaceOneQuestionSingleInteger(indexV) {
				const currentQus = this.questionsArray[indexV];
				this.qelementService.getQuestionsInTemplate({
						qm_id: 1,
						qt_id: currentQus.qus_qt_id,
						qst_id: currentQus.qus_qst_id,
						st_id: currentQus.qus_st_id,
						skill_id: currentQus.qus_skill_id,
						dl_id: currentQus.qus_dl_id,
						qus_marks: currentQus.qus_marks,
						qus_limit: 1,
						status: 1
				})
						.subscribe(
								(result: any) => {
										if (result && result.status === 'ok') {
												const replacedQus = result.data[0];
												if (this.questionsArray.indexOf(replacedQus.qus_id) !== -1) {
														this.replaceOneQuestionSingleInteger(indexV);
												}
												this.questionsArray[indexV] = replacedQus;
												// For Fill in the blank
												this.SINGLE_ELEMENT_DATA[indexV].question = replacedQus.qus_name;
												this.SINGLE_ELEMENT_DATA[indexV].explanations = replacedQus.qus_explanation;
												// tslint:disable-next-line:max-line-length
												this.SINGLE_ELEMENT_DATA[indexV].answer = '<button mat-icon style=\'border-radius:50% !important;border:none !important;color:white;font-weight:bold !important;color:white !important;color:white;background-color:#6c65c8 !important;height:40px !important;width:40px !important\'>' + replacedQus.qopt_answer + '</button>';
												this.SINGLE_ELEMENT_DATA[indexV].skillType = replacedQus.qus_skill_id;
												this.SINGLE_ELEMENT_DATA[indexV].topic = replacedQus.topic_name;
												this.SINGLE_ELEMENT_DATA[indexV].subtopic = replacedQus.st_name;
												this.SINGLE_ELEMENT_DATA[indexV].suggestedMarks = replacedQus.qus_marks;
												this.SINGLE_ELEMENT_DATA[indexV].reference = replacedQus.qus_historical_reference;
												this.singledataSource = new MatTableDataSource<SingleIntegerElement>(this.SINGLE_ELEMENT_DATA);
												// Fill in the blank Ends
										}
								}
						);

		}
		// End

		// Double Integer
		replaceOneQuestionDoubleInteger(indexV) {
				const currentQus = this.questionsArray[indexV];
				this.qelementService.getQuestionsInTemplate({
						qm_id: 1,
						qt_id: currentQus.qus_qt_id,
						qst_id: currentQus.qus_qst_id,
						st_id: currentQus.qus_st_id,
						skill_id: currentQus.qus_skill_id,
						dl_id: currentQus.qus_dl_id,
						qus_marks: currentQus.qus_marks,
						qus_limit: 1,
						status: 1
				})
						.subscribe(
								(result: any) => {
										if (result && result.status === 'ok') {
												const replacedQus = result.data[0];
												if (this.questionsArray.indexOf(replacedQus.qus_id) !== -1) {
														this.replaceOneQuestionDoubleInteger(indexV);
												}
												this.questionsArray[indexV] = replacedQus;
												// For Fill in the blank
												this.DOUBLE_ELEMENT_DATA[indexV].question = replacedQus.qus_name;
												this.DOUBLE_ELEMENT_DATA[indexV].explanations = replacedQus.qus_explanation;
												// tslint:disable-next-line:max-line-length
												this.DOUBLE_ELEMENT_DATA[indexV].answer = '<button mat-icon style=\'border-radius:50% !important;border:none !important;color:white;font-weight:bold !important;color:white !important;color:white;background-color:#6c65c8 !important;height:40px !important;width:40px !important\'>' + replacedQus.qopt_answer.charAt(0) + '</button>' +
														// tslint:disable-next-line:max-line-length
														'<button mat-icon style=\'border-radius:50% !important;border:none !important;color:white;font-weight:bold !important;color:white !important;color:white;background-color:#6c65c8 !important;height:40px !important;width:40px !important\'>' + replacedQus.qopt_answer.charAt(1) + '</button>';
												this.DOUBLE_ELEMENT_DATA[indexV].skillType = replacedQus.qus_skill_id;
												this.DOUBLE_ELEMENT_DATA[indexV].topic = replacedQus.topic_name;
												this.DOUBLE_ELEMENT_DATA[indexV].subtopic = replacedQus.st_name;
												this.DOUBLE_ELEMENT_DATA[indexV].suggestedMarks = replacedQus.qus_marks;
												this.DOUBLE_ELEMENT_DATA[indexV].reference = replacedQus.qus_historical_reference;
												this.doubledataSource = new MatTableDataSource<DoubleIntegerElement>(this.DOUBLE_ELEMENT_DATA);
												// Fill in the blank Ends
										}
								}
						);

		}
		// End
		replaceOneQuestionFill(indexV) {
				const currentQus = this.questionsArray[indexV];
				this.qelementService.getQuestionsInTemplate({
						qm_id: 1,
						qt_id: currentQus.qus_qt_id,
						qst_id: currentQus.qus_qst_id,
						st_id: currentQus.qus_st_id,
						skill_id: currentQus.qus_skill_id,
						dl_id: currentQus.qus_dl_id,
						qus_marks: currentQus.qus_marks,
						qus_limit: 1,
						status: 1
				})
						.subscribe(
								(result: any) => {
										if (result && result.status === 'ok') {
												const replacedQus = result.data[0];
												if (this.questionsArray.indexOf(replacedQus.qus_id) !== -1) {
														this.replaceOneQuestionFill(indexV);
												}
												this.questionsArray[indexV] = replacedQus;
												// For Fill in the blank
												this.FILL_ELEMENT_DATA[indexV].questionSub = replacedQus.qus_name;
												this.FILL_ELEMENT_DATA[indexV].explanationsSub = replacedQus.qus_explanation;
												this.FILL_ELEMENT_DATA[indexV].answerSub = replacedQus.qopt_answer;
												this.FILL_ELEMENT_DATA[indexV].skillTypeSub = replacedQus.qus_skill_id;
												this.FILL_ELEMENT_DATA[indexV].topicSub = replacedQus.topic_name;
												this.FILL_ELEMENT_DATA[indexV].subtopicSub = replacedQus.st_name;
												this.FILL_ELEMENT_DATA[indexV].suggestedMarksSub = replacedQus.qus_marks;
												this.FILL_ELEMENT_DATA[indexV].referenceSub = replacedQus.qus_historical_reference;
												this.filldataSource = new MatTableDataSource<FillElement>(this.FILL_ELEMENT_DATA);
												// Fill in the blank Ends
										}
								}
						);
		}
		replaceOneQuestionIdentify(indexV) {
				const currentQus = this.questionsArray[indexV];
				this.qelementService.getQuestionsInTemplate({
						qm_id: 1,
						qt_id: currentQus.qus_qt_id,
						qst_id: currentQus.qus_qst_id,
						st_id: currentQus.qus_st_id,
						skill_id: currentQus.qus_skill_id,
						dl_id: currentQus.qus_dl_id,
						qus_marks: currentQus.qus_marks,
						qus_limit: 1,
						status: 1
				})
						.subscribe(
								(result: any) => {
										if (result && result.status === 'ok') {
												const replacedQus = result.data[0];
												if (this.questionsArray.indexOf(replacedQus.qus_id) !== -1) {
														this.replaceOneQuestionIdentify(indexV);
												}
												this.questionsArray[indexV] = replacedQus;
												// For Identify
												this.IDENTIFY_ELEMENT_DATA[indexV].questionSub = replacedQus.qus_name;
												this.IDENTIFY_ELEMENT_DATA[indexV].explanationsSub = replacedQus.qus_explanation;
												this.IDENTIFY_ELEMENT_DATA[indexV].answerSub = replacedQus.qopt_answer;
												this.IDENTIFY_ELEMENT_DATA[indexV].skillTypeSub = replacedQus.qus_skill_id;
												this.IDENTIFY_ELEMENT_DATA[indexV].topicSub = replacedQus.topic_name;
												this.IDENTIFY_ELEMENT_DATA[indexV].subtopicSub = replacedQus.st_name;
												this.IDENTIFY_ELEMENT_DATA[indexV].suggestedMarksSub = replacedQus.qus_marks;
												this.IDENTIFY_ELEMENT_DATA[indexV].referenceSub = replacedQus.qus_historical_reference;
												this.filldataSource = new MatTableDataSource<FillElement>(this.FILL_ELEMENT_DATA);
												// identify Ends
										}
								}
						);
		}
		replaceOneQuestionOne(indexV) {
				const currentQus = this.questionsArray[indexV];
				this.qelementService.getQuestionsInTemplate({
						qm_id: 1,
						qt_id: currentQus.qus_qt_id,
						qst_id: currentQus.qus_qst_id,
						st_id: currentQus.qus_st_id,
						skill_id: currentQus.qus_skill_id,
						dl_id: currentQus.qus_dl_id,
						qus_marks: currentQus.qus_marks,
						qus_limit: 1,
						status: 1
				})
						.subscribe(
								(result: any) => {
										if (result && result.status === 'ok') {
												const replacedQus = result.data[0];
												if (this.questionsArray.indexOf(replacedQus.qus_id) !== -1) {
														this.replaceOneQuestionOne(indexV);
												}
												this.questionsArray[indexV] = replacedQus;
												// For Identify
												this.ONE_ELEMENT_DATA[indexV].questionSub = replacedQus.qus_name;
												this.ONE_ELEMENT_DATA[indexV].explanationsSub = replacedQus.qus_explanation;
												this.ONE_ELEMENT_DATA[indexV].answerSub = replacedQus.qopt_answer;
												this.ONE_ELEMENT_DATA[indexV].skillTypeSub = replacedQus.qus_skill_id;
												this.ONE_ELEMENT_DATA[indexV].topicSub = replacedQus.topic_name;
												this.ONE_ELEMENT_DATA[indexV].subtopicSub = replacedQus.st_name;
												this.ONE_ELEMENT_DATA[indexV].suggestedMarksSub = replacedQus.qus_marks;
												this.ONE_ELEMENT_DATA[indexV].referenceSub = replacedQus.qus_historical_reference;
												this.onedataSource = new MatTableDataSource<OneElement>(this.ONE_ELEMENT_DATA);
												// identify Ends
										}
								}
						);
		}
		replaceOneQuestionVeryShort(indexV) {
				const currentQus = this.questionsArray[indexV];
				this.qelementService.getQuestionsInTemplate({
						qm_id: 1,
						qt_id: currentQus.qus_qt_id,
						qst_id: currentQus.qus_qst_id,
						st_id: currentQus.qus_st_id,
						skill_id: currentQus.qus_skill_id,
						dl_id: currentQus.qus_dl_id,
						qus_marks: currentQus.qus_marks,
						qus_limit: 1,
						status: 1
				})
						.subscribe(
								(result: any) => {
										if (result && result.status === 'ok') {
												const replacedQus = result.data[0];
												if (this.questionsArray.indexOf(replacedQus.qus_id) !== -1) {
														this.replaceOneQuestionVeryShort(indexV);
												}
												this.questionsArray[indexV] = replacedQus;
												// For Very Short
												this.VERYSHORT_ELEMENT_DATA[indexV].questionSub = replacedQus.qus_name;
												this.VERYSHORT_ELEMENT_DATA[indexV].explanationsSub = replacedQus.qus_explanation;
												this.VERYSHORT_ELEMENT_DATA[indexV].answerSub = replacedQus.qopt_answer;
												this.VERYSHORT_ELEMENT_DATA[indexV].skillTypeSub = replacedQus.qus_skill_id;
												this.VERYSHORT_ELEMENT_DATA[indexV].topicSub = replacedQus.topic_name;
												this.VERYSHORT_ELEMENT_DATA[indexV].subtopicSub = replacedQus.st_name;
												this.VERYSHORT_ELEMENT_DATA[indexV].suggestedMarksSub = replacedQus.qus_marks;
												this.VERYSHORT_ELEMENT_DATA[indexV].referenceSub = replacedQus.qus_historical_reference;
												this.veryshortdataSource = new MatTableDataSource<VeryShortElement>(this.VERYSHORT_ELEMENT_DATA);
												// Very Short Ends
										}
								}
						);
		}
		replaceOneQuestionShort(indexV) {
				const currentQus = this.questionsArray[indexV];
				this.qelementService.getQuestionsInTemplate({
						qm_id: 1,
						qt_id: currentQus.qus_qt_id,
						qst_id: currentQus.qus_qst_id,
						st_id: currentQus.qus_st_id,
						skill_id: currentQus.qus_skill_id,
						dl_id: currentQus.qus_dl_id,
						qus_marks: currentQus.qus_marks,
						qus_limit: 1,
						status: 1
				})
						.subscribe(
								(result: any) => {
										if (result && result.status === 'ok') {
												const replacedQus = result.data[0];
												if (this.questionsArray.indexOf(replacedQus.qus_id) !== -1) {
														this.replaceOneQuestionShort(indexV);
												}
												this.questionsArray[indexV] = replacedQus;
												// For Very Short
												this.SHORT_ELEMENT_DATA[indexV].questionSub = replacedQus.qus_name;
												this.SHORT_ELEMENT_DATA[indexV].explanationsSub = replacedQus.qus_explanation;
												this.SHORT_ELEMENT_DATA[indexV].answerSub = replacedQus.qopt_answer;
												this.SHORT_ELEMENT_DATA[indexV].skillTypeSub = replacedQus.qus_skill_id;
												this.SHORT_ELEMENT_DATA[indexV].topicSub = replacedQus.topic_name;
												this.SHORT_ELEMENT_DATA[indexV].subtopicSub = replacedQus.st_name;
												this.SHORT_ELEMENT_DATA[indexV].suggestedMarksSub = replacedQus.qus_marks;
												this.SHORT_ELEMENT_DATA[indexV].referenceSub = replacedQus.qus_historical_reference;
												this.shortdataSource = new MatTableDataSource<ShortElement>(this.SHORT_ELEMENT_DATA);
												// Very Short Ends
										}
								}
						);
		}
		replaceOneQuestionLong(indexV) {
				const currentQus = this.questionsArray[indexV];
				this.qelementService.getQuestionsInTemplate({
						qm_id: 1,
						qt_id: currentQus.qus_qt_id,
						qst_id: currentQus.qus_qst_id,
						st_id: currentQus.qus_st_id,
						skill_id: currentQus.qus_skill_id,
						dl_id: currentQus.qus_dl_id,
						qus_marks: currentQus.qus_marks,
						qus_limit: 1,
						status: 1
				})
						.subscribe(
								(result: any) => {
										if (result && result.status === 'ok') {
												const replacedQus = result.data[0];
												if (this.questionsArray.indexOf(replacedQus.qus_id) !== -1) {
														this.replaceOneQuestionLong(indexV);
												}
												this.questionsArray[indexV] = replacedQus;
												// For Very Short
												this.LONG_ELEMENT_DATA[indexV].questionSub = replacedQus.qus_name;
												this.LONG_ELEMENT_DATA[indexV].explanationsSub = replacedQus.qus_explanation;
												this.LONG_ELEMENT_DATA[indexV].answerSub = replacedQus.qopt_answer;
												this.LONG_ELEMENT_DATA[indexV].skillTypeSub = replacedQus.qus_skill_id;
												this.LONG_ELEMENT_DATA[indexV].topicSub = replacedQus.topic_name;
												this.LONG_ELEMENT_DATA[indexV].subtopicSub = replacedQus.st_name;
												this.LONG_ELEMENT_DATA[indexV].suggestedMarksSub = replacedQus.qus_marks;
												this.LONG_ELEMENT_DATA[indexV].referenceSub = replacedQus.qus_historical_reference;
												this.longdataSource = new MatTableDataSource<LongElement>(this.LONG_ELEMENT_DATA);
												// Very Short Ends
										}
								}
						);
		}
		replaceOneQuestionVeryLong(indexV) {
				const currentQus = this.questionsArray[indexV];
				this.qelementService.getQuestionsInTemplate({
						qm_id: 1,
						qt_id: currentQus.qus_qt_id,
						qst_id: currentQus.qus_qst_id,
						st_id: currentQus.qus_st_id,
						skill_id: currentQus.qus_skill_id,
						dl_id: currentQus.qus_dl_id,
						qus_marks: currentQus.qus_marks,
						qus_limit: 1,
						status: 1
				})
						.subscribe(
								(result: any) => {
										if (result && result.status === 'ok') {
												const replacedQus = result.data[0];
												if (this.questionsArray.indexOf(replacedQus.qus_id) !== -1) {
														this.replaceOneQuestionVeryLong(indexV);
												}
												this.questionsArray[indexV] = replacedQus;
												// For Very Short
												this.VERYLONG_ELEMENT_DATA[indexV].questionSub = replacedQus.qus_name;
												this.VERYLONG_ELEMENT_DATA[indexV].explanationsSub = replacedQus.qus_explanation;
												this.VERYLONG_ELEMENT_DATA[indexV].answerSub = replacedQus.qopt_answer;
												this.VERYLONG_ELEMENT_DATA[indexV].skillTypeSub = replacedQus.qus_skill_id;
												this.VERYLONG_ELEMENT_DATA[indexV].topicSub = replacedQus.topic_name;
												this.VERYLONG_ELEMENT_DATA[indexV].subtopicSub = replacedQus.st_name;
												this.VERYLONG_ELEMENT_DATA[indexV].suggestedMarksSub = replacedQus.qus_marks;
												this.VERYLONG_ELEMENT_DATA[indexV].referenceSub = replacedQus.qus_historical_reference;
												this.verylongdataSource = new MatTableDataSource<LongElement>(this.VERYLONG_ELEMENT_DATA);
												// Very Short Ends
										}
								}
						);
		}
		replaceOneQuestionEssay(indexV) {
				const currentQus = this.questionsOfEachEssayFilerArray[indexV];
				this.qelementService.getQuestionsInTemplate({
						qm_id: 1,
						qt_id: currentQus.qus_qt_id,
						qst_id: currentQus.qus_qst_id,
						st_id: currentQus.qus_st_id,
						skill_id: currentQus.qus_skill_id,
						dl_id: currentQus.qus_dl_id,
						qus_marks: currentQus.qus_marks,
						ess_id: currentQus.qus_ess_id,
						qus_limit: 1,
						status: 1
				})
						.subscribe(
								(result: any) => {
										if (result && result.status === 'ok') {
												const replacedQus = result.data[0];
												if (this.questionsOfEachEssayFilerArray.indexOf(replacedQus.qus_id) !== -1) {
														this.replaceOneQuestionEssay(indexV);
												}
												let optionsArray = '';
												let hoverArray = '';
												let id = 0;
												if (replacedQus.options) {
														for (const option of replacedQus.options) {
																if (Number(replacedQus.qus_qst_id) === 1 ||
																		Number(replacedQus.qus_qst_id) === 2 ||
																		Number(replacedQus.qus_qst_id) === 3) {
																		hoverArray = (hoverArray + (this.optionHA[id] + ':' + '&nbsp;&nbsp;' + option.qopt_options)) + '\n';
																		if (option.qopt_answer === '1') {
																				optionsArray = optionsArray + '<b>' + option.qopt_options + '</b>';
																		}
																} else if (Number(replacedQus.qus_qst_id) === 4) {
																		hoverArray = (hoverArray + this.optionHA[id] + ':' + '&nbsp;&nbsp;' +
																				replacedQus.options[id].qopt_options + '\n' + this.optionmatchHA[id] + ':' + '&nbsp;&nbsp;' +
																				replacedQus.options[id].qopt_options_match) + '\n';
																		optionsArray = optionsArray + '<b>' + replacedQus.options[id].qopt_answer + '<b>' + ',';
																} else if (Number(replacedQus.qus_qst_id) > 5) {
																		optionsArray = optionsArray + '<b>' + replacedQus.options[id].qopt_answer + '<b>' + ',';
																}
																id++;
														}
												} else {
														if (Number(replacedQus.qus_qst_id) > 5) {
																optionsArray = replacedQus.qopt_answer;
														}
														id++;
												}
												this.questionsOfEachEssayFilerArray[indexV] = replacedQus;
												this.ESSAYQUESTION_ELEMENT_DATA[indexV].question = replacedQus.qus_name;
												this.ESSAYQUESTION_ELEMENT_DATA[indexV].explanations = replacedQus.qus_explanation;
												this.ESSAYQUESTION_ELEMENT_DATA[indexV].options = optionsArray;
												this.ESSAYQUESTION_ELEMENT_DATA[indexV].essayTitle = replacedQus.ess_title;
												this.ESSAYQUESTION_ELEMENT_DATA[indexV].skillType = replacedQus.qus_skill_id;
												this.ESSAYQUESTION_ELEMENT_DATA[indexV].topic = replacedQus.topic_name;
												this.ESSAYQUESTION_ELEMENT_DATA[indexV].subtopic = replacedQus.st_name;
												this.ESSAYQUESTION_ELEMENT_DATA[indexV].suggestedMarks = replacedQus.qus_marks;
												this.ESSAYQUESTION_ELEMENT_DATA[indexV].reference = replacedQus.qus_historical_reference;
												this.essayquestionDatasource = new MatTableDataSource<ESSAYQUESTIONElement>(this.ESSAYQUESTION_ELEMENT_DATA);
												// Very Short Ends
										}
								}
						);
		}
		reviewQuestionPaper() {
				this.reviewQuestionArray = [];
				this.REVIEW_ELEMENT_DATA = [];
				this.reviewdatasource = new MatTableDataSource<ReviewElement>(this.REVIEW_ELEMENT_DATA);
				this.total = 0;
				for (let qi = 0; qi < this.questionsOfEachTemplateFilerArray.length; qi++) {
						if (this.questionsOfEachTemplateFilerArray[qi]) {
								const eachTemplateQuestion = this.questionsOfEachTemplateFilerArray[qi];
								for (const qus of eachTemplateQuestion) {
										if (qus.tf_id) {
												this.qpq_qus_position++;
												this.reviewQuestionArray.push({
														qpq_qus_position: this.qpq_qus_position,
														qus_info: qus,
														qpq_tf_id: qus.tf_id,
														qpq_qus_id: qus.qus_id,
														qpq_topic_id: qus.qus_topic_id,
														qpq_st_id: qus.qus_st_id

												});
										} else {
												this.qpq_qus_position++;
												this.reviewQuestionArray.push({
														qpq_qus_position: this.qpq_qus_position,
														qus_info: qus,
														qpq_tf_id: this.filtersArray[qi].tf_id,
														qpq_qus_id: qus.qus_id,
														qpq_topic_id: qus.qus_topic_id,
														qpq_st_id: qus.qus_st_id

												});

										}
										this.total = Number(this.total) + Number(this.reviewQuestionArray[this.qpq_qus_position - 1].qus_info.qus_marks);
								}
						}
				}
				let startIndex = 1;
				const answerArray: any[] = [];
				const answerArray3: any[] = [];
				const answerArray2: any[] = [];
				const answerArray3_2: any[] = [];
				let ninthId = 0;
				let ninthId_2 = 0;
				for (const review of this.reviewQuestionArray) {
						let id13;
						const id14 = 0;
						let tenthId = 0;
						let tenthId2 = 0;
						let id13_2;
						let id9 = 0;
						let id9_2 = 0;
						this.answerReview = '';
						// tslint:disable-next-line:max-line-length
						if (review.qus_info.options && (Number(review.qus_info.qus_qst_id) === 1 || Number(review.qus_info.qus_qst_id) === 2 || Number(review.qus_info.qus_qst_id) === 3 || Number(review.qus_info.qus_qst_id) === 4)) {
								for (const option of review.qus_info.options) {
										if (option.qopt_answer === '1') {
												this.enableOptionAnswer = true;
												this.answerReview = this.answerReview + option.qopt_options;
										} else if (option.qopt_answer === 'P' || option.qopt_answer === 'Q' || option.qopt_answer === 'R' || option.qopt_answer === 'S') {
												this.enableOptionMtfAnswer = true;
												this.answerReview = this.answerReview + option.qopt_answer + ',';

										}
								}
								if (this.enableOptionAnswer === true || this.enableOptionMtfAnswer === true) {
										const negativeMarks = review.qus_info.qus_negative_marks;
										this.REVIEW_ELEMENT_DATA.push({
												position: startIndex,
												question: review.qus_info.qus_name,
												answer: this.answerReview,
												topic: review.qus_info.topic_name,
												subtopic: review.qus_info.st_name,
												lod: review.qus_info.dl_name,
												skill: review.qus_info.skill_name,
												marks: review.qus_info.qus_marks,
												negativeMarks: Number(negativeMarks),
												action: review,
												tf_id: review.qpq_tf_id,
												qus_topic_id: review.qpq_topic_id,
												qus_id: review.qpq_qus_id,
												qus_st_id: review.qpq_st_id
										});
										startIndex++;
								}
						} else if (review.qus_info.options && Number(review.qus_info.qus_qst_id) === 5) {
								for (const answerrow of review.qus_info.answer) {
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
								const negativeMarks = review.qus_info.qus_negative_marks;
								this.REVIEW_ELEMENT_DATA.push({
										position: startIndex,
										question: review.qus_info.qus_name,
										answer: answerArray[ninthId],
										topic: review.qus_info.topic_name,
										subtopic: review.qus_info.st_name,
										lod: review.qus_info.dl_name,
										skill: review.qus_info.skill_name,
										marks: review.qus_info.qus_marks,
										negativeMarks: Number(negativeMarks),
										action: review,
										tf_id: review.qpq_tf_id,
										qus_topic_id: review.qpq_topic_id,
										qus_id: review.qpq_qus_id,
										qus_st_id: review.qpq_st_id
								});
								startIndex++;
						} else if (review.qus_info.options && Number(review.qus_info.qus_qst_id) === 13) {
								for (const answerrow of review.qus_info.answer) {
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
								const negativeMarks = review.qus_info.qus_negative_marks;
								this.REVIEW_ELEMENT_DATA.push({
										position: startIndex,
										question: review.qus_info.qus_name,
										answer: answerArray2[ninthId_2],
										topic: review.qus_info.topic_name,
										subtopic: review.qus_info.st_name,
										lod: review.qus_info.dl_name,
										skill: review.qus_info.skill_name,
										marks: review.qus_info.qus_marks,
										negativeMarks: Number(negativeMarks),
										action: review,
										tf_id: review.qpq_tf_id,
										qus_topic_id: review.qpq_topic_id,
										qus_id: review.qpq_qus_id,
										qus_st_id: review.qpq_st_id
								});
								startIndex++;
						} else {
								if (!review.qus_info.options) {
										if (Number(review.qus_info.qus_qst_id) === 14) {
												const negativeMarks = review.qus_info.qus_negative_marks;
												this.REVIEW_ELEMENT_DATA.push({
														position: startIndex,
														question: review.qus_info.qus_name,
														// tslint:disable-next-line:max-line-length
														answer: '<button mat-icon style=\'border-radius:50% !important;border:none !important;color:white;font-weight:bold !important;color:white !important;color:white;background-color:#6c65c8 !important;height:40px !important;width:40px !important\'>' + review.qus_info.qopt_answer + '</button>',
														topic: review.qus_info.topic_name,
														subtopic: review.qus_info.st_name,
														lod: review.qus_info.dl_name,
														skill: review.qus_info.skill_name,
														marks: review.qus_info.qus_marks,
														negativeMarks: Number(negativeMarks),
														action: review,
														tf_id: review.qpq_tf_id,
														qus_topic_id: review.qpq_topic_id,
														qus_id: review.qpq_qus_id,
														qus_st_id: review.qpq_st_id
												});
										} else if (Number(review.qus_info.qus_qst_id) === 15) {
												const negativeMarks = review.qus_info.qus_negative_marks;
												this.REVIEW_ELEMENT_DATA.push({
														position: startIndex,
														question: review.qus_info.qus_name,
														// tslint:disable-next-line:max-line-length
														answer: '<button mat-icon style=\'border-radius:50% !important;border:none !important;color:white;font-weight:bold !important;color:white !important;color:white;background-color:#6c65c8 !important;height:40px !important;width:40px !important\'>' + review.qus_info.qopt_answer.charAt(0) + '</button>' +
																// tslint:disable-next-line:max-line-length
																'<button mat-icon style=\'border-radius:50% !important;border:none !important;color:white;font-weight:bold !important;color:white !important;color:white;background-color:#6c65c8 !important;height:40px !important;width:40px !important\'>' + review.qus_info.qopt_answer.charAt(1) + '</button>',
														topic: review.qus_info.topic_name,
														subtopic: review.qus_info.st_name,
														lod: review.qus_info.dl_name,
														skill: review.qus_info.skill_name,
														marks: review.qus_info.qus_marks,
														negativeMarks: Number(negativeMarks),
														action: review,
														tf_id: review.qpq_tf_id,
														qus_topic_id: review.qpq_topic_id,
														qus_id: review.qpq_qus_id,
														qus_st_id: review.qpq_st_id
												});

										} else {
												const negativeMarks = review.qus_info.qus_negative_marks;
												this.REVIEW_ELEMENT_DATA.push({
														position: startIndex,
														question: review.qus_info.qus_name,
														answer: review.qus_info.qopt_answer,
														topic: review.qus_info.topic_name,
														subtopic: review.qus_info.st_name,
														lod: review.qus_info.dl_name,
														skill: review.qus_info.skill_name,
														marks: review.qus_info.qus_marks,
														negativeMarks: Number(negativeMarks),
														action: review,
														tf_id: review.qpq_tf_id,
														qus_topic_id: review.qpq_topic_id,
														qus_id: review.qpq_qus_id,
														qus_st_id: review.qpq_st_id
												});

										}
										startIndex++;

								}

						}
						this.reviewdatasource = new MatTableDataSource<ReviewElement>(this.REVIEW_ELEMENT_DATA);
						setTimeout(() => this.reviewdatasource.paginator = this.paginator13);
						this.sort13.sortChange.subscribe(() => this.paginator13.pageIndex = 0);
						this.reviewdatasource.sort = this.sort13;
						ninthId++;
						ninthId_2++;


				}


		}
		changeMarks($event, position) {
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
		addQuestionPaper() {
				// Form validations
				if (this.qpsfully_form.value.qp_name && this.templateArray.length > 0) {
						// this.qpq_qus_position = 1;
						if (this.qpsfully_form.value.qp_name) {
								this.finalQuestionArray = [];
								for (const item of this.REVIEW_ELEMENT_DATA) {
										this.finalQuestionArray.push({
												qpq_qus_position: item.position,
												qpq_tf_id: item.tf_id,
												qpq_qus_id: item.qus_id,
												qpq_topic_id: item.qus_topic_id,
												qpq_st_id: item.qus_st_id,
												qpq_marks: item.marks,
												qpq_negative_marks: item.negativeMarks
										});
								}
								this.qpsfully_form.patchValue({
										qp_qm_id: 1,
										qlist: this.finalQuestionArray,
										qp_class_id: this.currentTemplate.tp_class_id,
										qp_sub_id: [this.currentTemplate.tp_sub_id],
										qp_sec_id: this.currentTemplate.tp_sec_id
								});
								let sum = 0;
								for (const item of this.finalQuestionArray) {
										if (item.qpq_marks) {
												sum = sum + Number(item.qpq_marks);
										}

								}
								if (sum === Number(this.printTemplate.tp_marks)) {
										this.qelementService.addQuestionPaper(this.qpsfully_form.value)
												.subscribe(
														(result: any) => {
																if (result && result.status === 'ok') {
																		this.notif.showSuccessErrorMessage('Submitted Successfully', 'success');
																		setTimeout(() => {
																				this.router.navigate(['../'], { relativeTo: this.route });
																		}, 2000);
																} else {
																		this.notif.showSuccessErrorMessage('Please select atleast one question type before submitting', 'error');
																}
																this.qpsfully_form.patchValue({
																		'qp_name': '',
																		'qp_tp_id': ''
																});
																this.filtersArray = [];
																this.questionsArray = [];
														}
												);
								} else {
										// tslint:disable-next-line:max-line-length
										this.notif.showSuccessErrorMessage('Submission Failed. <br>Please check total marks according to marks of the template created', 'error');
								}
						}
				}
		}
		resetTemplate() {
				this.qpsfully_form.patchValue({
						'qp_name': '',
						'qp_tp_id': ''
				});
				this.templateArray = [];
		}
		reset() {
				this.qpsfully_form.reset();
		}
		getClass() {
				this.qelementService.getClass()
						.subscribe(
								(result: any) => {
										if (result && result.status === 'ok') {
												this.classArray = result.data;
										}
								}
						);
		}
		getSectionsByClass(): void {
				this.qelementService.getSectionsByClass(this.qpsfully_form.value.qp_class_id)
						.subscribe(
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
				this.qelementService.getSubjectsByClass(this.qpsfully_form.value.qp_class_id)
						.subscribe(
								(result: any) => {
										if (result && result.status === 'ok') {
												this.subjectArray = result.data;
										} else {
												this.subjectArray = [];
										}
								}
						);
		}
		getTopicByClassSubject(): void {
				this.qelementService.getTopicByClassSubject(this.qpsfully_form.value.qp_class_id, this.qpsfully_form.value.sub_id)
						.subscribe(
								(result: any) => {
										if (result && result.status === 'ok') {
												this.topicArray = result.data;
										}
								}
						);
		}
		getSubtopicByTopic(): void {
				this.subtopicArray = [];
				this.qelementService.getSubtopicByTopic(this.qpsfully_form.value.topic_id)
						.subscribe(
								(result: any) => {
										if (result && result.status === 'ok') {
												this.subtopicArray = result.data;
										}
								}
						);
		}
		addQuestionList() {
				if (this.qpsfully_form.valid) {
						let template: any;
						template = this.qpsfully_form.value;
						this.qelementService.getSubtopicNameById(this.qpsfully_form.value.st_id)
								.subscribe(
										(result: any) => {
												if (result && result.status === 'ok') {
														template.topic_name = result.data[0].topic_name;
														template.st_name = result.data[0].st_name;
												}
												this.templates.push(template);
										}
								);
				}
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
}

