import { Component, OnInit, ViewChild, AfterViewChecked, AfterViewInit } from '@angular/core';
import { QelementService } from '../../questionbank/service/qelement.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HtmlToTextService, BreadCrumbService, NotificationService } from '../../_services/index';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginator, MatTableDataSource, MatSort, MatDialogRef, MatDialog, PageEvent, Sort } from '@angular/material';
import { ViewTemplatePartialComponent } from '../../questionpaper/view-template-partial/view-template-partial.component';
import { DomSanitizer } from '@angular/platform-browser';
import { style, animate, transition, trigger } from '@angular/animations';

@Component({
	selector: 'app-qpspartial',
	templateUrl: './qpspartial.component.html',
	styleUrls: ['./qpspartial.component.css'],
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
export class QpspartialComponent implements OnInit, AfterViewChecked, AfterViewInit {
	@ViewChild('paginator')
	paginator: MatPaginator;
	@ViewChild('paginator2')
	paginator2: MatPaginator;
	@ViewChild('paginator3')
	paginator3: MatPaginator;
	@ViewChild('paginator4')
	paginator4: MatPaginator;
	@ViewChild('paginator5')
	paginator5: MatPaginator;
	@ViewChild('paginator6')
	paginator6: MatPaginator;
	@ViewChild('paginator7')
	paginator7: MatPaginator;
	@ViewChild('paginator8')
	paginator8: MatPaginator;
	@ViewChild('paginator9')
	paginator9: MatPaginator;
	@ViewChild('paginator10')
	paginator10: MatPaginator;
	@ViewChild('paginator11')
	paginator11: MatPaginator;
	@ViewChild('paginator12')
	paginator12: MatPaginator;
	@ViewChild('paginator13')
	paginator13: MatPaginator;
	@ViewChild('paginator14')
	paginator14: MatPaginator;
	@ViewChild('paginator15')
	paginator15: MatPaginator;
	@ViewChild('paginator16')
	paginator16: MatPaginator;
	@ViewChild('paginator17')
	paginator17: MatPaginator;
	@ViewChild('paginator18')
	paginator18: MatPaginator;
	@ViewChild(MatSort)
	sort: MatSort;
	@ViewChild(MatSort)
	sort2: MatSort;
	@ViewChild(MatSort)
	sort3: MatSort;
	@ViewChild(MatSort)
	sort4: MatSort;
	@ViewChild(MatSort)
	sort5: MatSort;
	@ViewChild(MatSort)
	sort6: MatSort;
	@ViewChild(MatSort)
	sort7: MatSort;
	@ViewChild(MatSort)
	sort8: MatSort;
	@ViewChild(MatSort)
	sort9: MatSort;
	@ViewChild(MatSort)
	sort10: MatSort;
	@ViewChild(MatSort)
	sort11: MatSort;
	@ViewChild(MatSort)
	sort12: MatSort;
	@ViewChild(MatSort)
	sort13: MatSort;
	@ViewChild(MatSort)
	sort14: MatSort;
	@ViewChild(MatSort)
	sort15: MatSort;
	@ViewChild(MatSort)
	sort16: MatSort;
	@ViewChild(MatSort)
	sort17: MatSort;
	@ViewChild(MatSort)
	sort18: MatSort;
	selectedSubArray: any[] = [];
	REVIEW_ELEMENT_DATA: ReviewElement[] = [];
	ELEMENT_DATA: Element[] = [];
	MCQ_ELEMENT_DATA: MCQElement[] = [];
	MULTI_MCQ_ELEMENT_DATA: MultiMCQElement[] = [];
	MATCH_ELEMENT_DATA: MatchElement[] = [];
	MATRIX_MATCH_ELEMENT_DATA: MatrixMatchElement[] = [];
	MATRIX_MATCH_ELEMENT_DATA_45: MatrixMatch45Element[] = [];
	SINGLE_ELEMENT_DATA: SingleIntegerElement[] = [];
	DOUBLE_ELEMENT_DATA: DoubleIntegerElement[] = [];
	FILL_ELEMENT_DATA: FillElement[] = [];
	IDENTIFY_ELEMENT_DATA: IdentifyElement[] = [];
	ONE_ELEMENT_DATA: OneElement[] = [];
	VERYSHORT_ELEMENT_DATA: VeryShortElement[] = [];
	SHORT_ELEMENT_DATA: ShortElement[] = [];
	LONG_ELEMENT_DATA: LongElement[] = [];
	VERYLONG_ELEMENT_DATA: VeryLongElement[] = [];
	ESSAYQUESTION_ELEMENT_DATA: ESSAYQUESTIONElement[] = [];
	matchdataSource = new MatTableDataSource<MatchElement>(
		this.MATCH_ELEMENT_DATA
	);
	matrixmatchdataSource = new MatTableDataSource<MatrixMatchElement>(
		this.MATRIX_MATCH_ELEMENT_DATA
	);
	matrixmatch45dataSource = new MatTableDataSource<MatrixMatch45Element>(
		this.MATRIX_MATCH_ELEMENT_DATA_45
	);
	singledataSource = new MatTableDataSource<SingleIntegerElement>(this.SINGLE_ELEMENT_DATA);
	doubledataSource = new MatTableDataSource<DoubleIntegerElement>(this.DOUBLE_ELEMENT_DATA);
	filldataSource = new MatTableDataSource<FillElement>(this.FILL_ELEMENT_DATA);
	identifydataSource = new MatTableDataSource<IdentifyElement>(
		this.IDENTIFY_ELEMENT_DATA
	);
	onedataSource = new MatTableDataSource<OneElement>(this.ONE_ELEMENT_DATA);
	veryshortdataSource = new MatTableDataSource<VeryShortElement>(
		this.VERYSHORT_ELEMENT_DATA
	);
	shortdataSource = new MatTableDataSource<ShortElement>(
		this.SHORT_ELEMENT_DATA
	);
	longdataSource = new MatTableDataSource<LongElement>(this.LONG_ELEMENT_DATA);
	verylongdataSource = new MatTableDataSource<VeryLongElement>(
		this.VERYLONG_ELEMENT_DATA
	);
	essayquestionDatasource = new MatTableDataSource<ESSAYQUESTIONElement>(
		this.ESSAYQUESTION_ELEMENT_DATA
	);
	mcqdisplayedColumns = [
		'select',
		'position',
		'question',
		'options',
		'explanations',
		'skillType',
		'topic',
		'subtopic',
		'suggestedMarks',
		'reference'
	]; // MCQ
	mcqdataSource = new MatTableDataSource<MCQElement>(this.MCQ_ELEMENT_DATA);
	multimcqdataSource = new MatTableDataSource<MultiMCQElement>(
		this.MULTI_MCQ_ELEMENT_DATA
	);
	multimcqdisplayedColumns = [
		'selectMulti',
		'positionMulti',
		'questionMulti',
		'optionsMulti',
		'explanationsMulti',
		'skillTypeMulti',
		'topicMulti',
		'subtopicMulti',
		'suggestedMarksMulti',
		'referenceMulti'
	]; // MRMCQ
	TF_ELEMENT_DATA: TFElement[] = [];
	tfdataSource = new MatTableDataSource<TFElement>(this.TF_ELEMENT_DATA);
	tfdisplayedColumns = [
		'selectTF',
		'positionTF',
		'questionTF',
		'optionsTF',
		'explanationsTF',
		'skillTypeTF',
		'topicTF',
		'subtopicTF',
		'suggestedMarksTF',
		'referenceTF'
	]; // TF
	displayedColumns = ['position', 'topic', 'subtopic', 'action'];
	dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
	reviewdatasource = new MatTableDataSource<ReviewElement>(
		this.REVIEW_ELEMENT_DATA
	);
	reviewdisplayedColumns = [
		'position',
		'question',
		'answer',
		'topic',
		'subtopic',
		/* "lod", */
		'skill',
		'marks',
		'negativemarks',
		'action'
	]; // SUB
	subdisplayedColumns = [
		'selectSub',
		'positionSub',
		'questionSub',
		'answerSub',
		'explanationsSub',
		'skillTypeSub',
		'topicSub',
		'subtopicSub',
		'suggestedMarksSub',
		'referenceSub'
	]; // S
	matchdisplayedColumns = [
		'selectMatch',
		'positionMatch',
		'questionMatch',
		'optionsMatch',
		'explanationsMatch',
		'skillTypeMatch',
		'topicMatch',
		'subtopicMatch',
		'suggestedMarksMatch',
		'referenceMatch'
	]; // Match
	matrixdisplayedColumns = [
		'selectMatrixMatch',
		'positionMatrixMatch',
		'questionMatrixMatch',
		'optionsMatrixMatch',
		'explanationsMatrixMatch',
		'skillTypeMatrixMatch',
		'topicMatrixMatch',
		'subtopicMatrixMatch',
		'suggestedMarksMatrixMatch',
		'referenceMatrixMatch'
	]; // Matrix
	matrix45displayedColumns = [
		'selectMatrixMatch',
		'positionMatrixMatch',
		'questionMatrixMatch',
		'optionsMatrixMatch',
		'explanationsMatrixMatch',
		'skillTypeMatrixMatch',
		'topicMatrixMatch',
		'subtopicMatrixMatch',
		'suggestedMarksMatrixMatch',
		'referenceMatrixMatch'
	]; // Matrix 45

	singledisplayedColumns = [
		'select',
		'position',
		'question',
		'answer',
		'explanations',
		'skillType',
		'topic',
		'subtopic',
		'suggestedMarks',
		'reference'
	]; // Single Integer

	doubledisplayedColumns = [
		'select',
		'position',
		'question',
		'answer',
		'explanations',
		'skillType',
		'topic',
		'subtopic',
		'suggestedMarks',
		'reference'
	]; // Double Integer
	essaydisplayedColumns = [
		'select',
		'position',
		'question',
		'options',
		'essayTitle',
		'explanations',
		'skillType',
		'topic',
		'subtopic',
		'suggestedMarks',
		'reference'
	]; // MCQ
	qpspartial_form: FormGroup;
	qpspartial_form2: FormGroup;
	templateArray: any[] = [];
	currentTemplate: any;
	enableOptionAnswer = false;
	answerReview: any;
	totalTemplateQuestion = 0;
	filtersArray: any[];
	currentFilter: number;
	templates: any[] = [];
	classArray: any[];
	sectionArray: any[];
	subjectArray: any[];
	topicArray: any[];
	subtopicArray: any[];
	questionsArray: any[];
	finalQuestionArray: any[] = [];
	reviewQuestionArray: any[] = [];
	stitems: any[] = [];
	total: number;
	questionsOfEachTemplateFilerArray: any[] = [];
	questionsOfEachSelectedSubArray: any[] = [];
	questionsOfEachEssayFilerArray: any[] = [];
	selectedQuestionIndexArray: any[] = [];
	currentTemplateFilterIndex: number;
	totalselectedQuestion = 0;
	filterarea = false;
	selectQuestion = false;
	selectParameter = true;
	startIndex = 1;
	questionReviewDiv = false;
	public optionHA = ['A', 'B', 'C', 'D', 'E'];
	public optionmatchHA = ['P', 'Q', 'R', 'S', 'T'];
	qpq_qus_position = 0;
	homeUrl: string;
	currSelectedTemplateClass: any = {};
	currSelectedTemplateSection: any = {};
	currSelectedTemplateSubject: any = {};
	currSelectedTemplateTopic: any = {};
	currSelectedTemplateSubtopic: any = {};
	printTemplate: any = {};
	viewCurrentQPFlag = false;
	checkedValue = false;
	mcqSelectedQuestion: any[] = [];
	sum: number;
	noRecordDiv = true;
	bannerdiv = false;

	showTopicSubTopicTable = false;

	// allTabSelectedQuestion: any = {
	//   mcq: [],
	//   multiMcq:[]
	//  };
	currentSelectedTab: any;
	totalSelectedQuestion = 0;
	checkedRow: any;
	mcqmrSelectedQuestion: any[] = [];
	tfSelectedQuestion: any[] = [];
	mtfSelectedQuestion: any[] = [];
	matrixSelectedQuestion: any[] = [];
	matrix45SelectedQuestion: any[] = [];
	singleIntegerSelectedQuestion: any[] = [];
	doubleIntegerSelectedQuestion: any[] = [];
	fillSelectedQuestion: any[] = [];
	identifySelectedQuestion: any[] = [];
	oneSelectedQuestion: any[] = [];
	shortSelectedQuestion: any[] = [];
	veryshortSelectedQuestion: any[] = [];
	longSelectedQuestion: any[] = [];
	verylongSelectedQuestion: any[] = [];
	essaySelectedQuestion: any[] = [];
	dialogRef: MatDialogRef<ViewTemplatePartialComponent>;
	templateStarray: any[] = [];
	essayGroup: any;
	mcqdataSourceArray: any[] = [];
	MCQ_ELEMENT_DATA_FINAL: any[] = [];
	MCQ_ELEMENT_DATA_FINAL_SUB: any[] = [];
	MULTI_MCQ_ELEMENT_DATA_FINAL_SUB: any[] = [];
	TF_ELEMENT_DATA_FINAL_SUB: any[] = [];
	MATCH_ELEMENT_DATA_FINAL_SUB: any[] = [];
	filldataSourceArray: any[] = [];
	FILL_ELEMENT_DATA_FINAL: any[] = [];
	FILL_ELEMENT_DATA_FINAL_SUB: any[] = [];
	multimcqdataSourceArray: any[] = [];
	MULTI_MCQ_ELEMENT_DATA_FINAL: any[] = [];
	tfdataSourceArray: any[] = [];
	TF_ELEMENT_DATA_FINAL: any[] = [];
	matchdataSourceArray: any[] = [];
	matrixmatchdataSourceArray: any[] = [];
	matrixmatch45dataSourceArray: any[] = [];
	singledataSourceArray: any[] = [];
	doubledataSourceArray: any[] = [];
	identifydataSourceArray: any[] = [];
	oneDataSourceArray: any[] = [];
	veryshortdataSourceArray: any[] = [];
	shortdataSourceArray: any[] = [];
	longdataSourceArray: any[] = [];
	verylongdataSourceArray: any[] = [];
	MATCH_ELEMENT_DATA_FINAL: any[] = [];
	MATRIX_MATCH_ELEMENT_FINAL: any[] = [];
	MATRIX_MATCH_ELEMENT_FINAL_SUB: any[] = [];
	MATRIX_MATCH_ELEMENT_FINAL_45: any[] = [];
	MATRIX_MATCH_ELEMENT_FINAL_45_SUB: any[] = [];
	SINGLE_ELEMENT_DATA_FINAL: any[] = [];
	SINGLE_ELEMENT_DATA_FINAL_SUB: any[] = [];
	DOUBLE_ELEMENT_DATA_FINAL: any[] = [];
	DOUBLE_ELEMENT_DATA_FINAL_SUB: any[] = [];
	IDENTIFY_ELEMENT_DATA_FINAL: any[] = [];
	IDENTIFY_ELEMENT_DATA_FINAL_SUB: any[] = [];
	ONE_ELEMENT_DATA_FINAL: any[] = [];
	ONE_ELEMENT_DATA_FINAL_SUB: any[] = [];
	VERYSHORT_ELEMENT_DAT_FINAL: any[] = [];
	VERYSHORT_ELEMENT_DAT_FINAL_SUB: any[] = [];
	SHORT_ELEMENT_DATA_FINAL: any[] = [];
	SHORT_ELEMENT_DATA_FINAL_SUB: any[] = [];
	LONG_ELEMENT_DATA_FINAL: any[] = [];
	LONG_ELEMENT_DATA_FINAL_SUB: any[] = [];
	VERYLONG_ELEMENT_DATA_FINAL: any[] = [];
	VERYLONG_ELEMENT_DATA_FINAL_SUB: any[] = [];
	ESSAYQUESTION_ELEMENT_DATA_FINAL: any[] = [];
	ESSAYQUESTION_ELEMENT_DATA_FINAL_SUB: any[] = [];
	pageEvent: PageEvent;
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
	totalquestionpaper = 0;

	constructor(
		private qelementService: QelementService,
		private fb: FormBuilder,
		private htt: HtmlToTextService,
		private route: ActivatedRoute,
		private router: Router,
		private notif: NotificationService,
		private breadCrumbService: BreadCrumbService,
		private dialog: MatDialog,
		private sanitizer: DomSanitizer
	) { }

	openDialog() {
		this.dialogRef = this.dialog.open(ViewTemplatePartialComponent, {
			height: '550px',
			data: {
				qp_tp_id: this.qpspartial_form.value.qp_tp_id,
				qp_class_id: this.qpspartial_form.value.qp_class_id,
				qp_sec_id: this.qpspartial_form.value.qp_sec_id,
				qp_sub_id: this.qpspartial_form.value.qp_sub_id
			}
		});
		this.dialogRef.afterClosed().subscribe(result => { });
	}
	ngAfterViewInit() {
		this.dataSource.paginator = this.paginator14;
		this.dataSource.sort = this.sort14;
		this.reviewdatasource.paginator = this.paginator13;
		this.reviewdatasource.sort = this.sort13;
		// this.mcqdataSource.paginator = this.paginator;
		// this.mcqdataSource.sort = this.sort;
		this.multimcqdataSource.paginator = this.paginator2;
		this.multimcqdataSource.sort = this.sort2;
		this.tfdataSource.paginator = this.paginator3;
		this.tfdataSource.sort = this.sort3;
		this.matchdataSource.paginator = this.paginator4;
		this.matchdataSource.sort = this.sort4;
		this.matrixmatchdataSource.paginator = this.paginator5;
		this.matrixmatchdataSource.sort = this.sort5;
		this.matrixmatch45dataSource.paginator = this.paginator16;
		this.matrixmatch45dataSource.sort = this.sort16;
		this.singledataSource.paginator = this.paginator17;
		this.singledataSource.sort = this.sort17;
		this.doubledataSource.paginator = this.paginator18;
		this.doubledataSource.sort = this.sort18;
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
		this.essayquestionDatasource.paginator = this.paginator15;
		this.essayquestionDatasource.sort = this.sort15;
	}
	ngOnInit() {
		this.homeUrl = this.breadCrumbService.getUrl();
		this.buildForm();
		this.getClass();
		this.getAllGenericList();
	}
	setCurrentTemplate($event) {
		console.log('$event.value', $event.value);
		const tind = this.templateArray.findIndex(item => item.tp_id === $event.value);
		if (tind !== -1) {
			this.totalquestionpaper = 0;
			for (const item of this.templateArray[tind].filters) {
				this.totalquestionpaper += Number(item.tf_qcount);
			}
		}
		console.log('this.totalquestionpaper', this.totalquestionpaper);
	}
	getNameByclassId(id) {
		const cind = this.classArray.findIndex(item => item.class_id === id);
		if (cind !== -1) {
			return this.classArray[cind].class_name;
		}
		return '';
	}
	getNameBysecId(id) {
		console.log('calling getNameBysecId', id);
		if (id !== 'all') {
			const cind = this.sectionArray.findIndex(item => item.sec_id === id);
			if (cind !== -1) {
				return this.sectionArray[cind].sec_name;
			}
		}
		return 'All';
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
		if (this.MATRIX_MATCH_ELEMENT_DATA_45.length > 0) {
			for (const item of this.MATRIX_MATCH_ELEMENT_DATA_45) {
				MathJax.Hub.Queue(['Typeset', MathJax.Hub, item.showHoverMatrixMatch]);
			}
		}
		if (this.ESSAYQUESTION_ELEMENT_DATA.length > 0) {
			for (const item of this.ESSAYQUESTION_ELEMENT_DATA) {
				MathJax.Hub.Queue(['Typeset', MathJax.Hub, item.showHover]);
			}
		}
	}

	sortDataMCQ(event: Sort, index) {
		this.mcqdataSourceArray[index].sort.active = event.active;
		this.mcqdataSourceArray[index].sort.direction = event.direction;
		this.mcqdataSourceArray[index].sort = this.sort;
	}
	sortDataMCQMR(event: Sort, index) {
		this.multimcqdataSourceArray[index].sort.active = event.active;
		this.multimcqdataSourceArray[index].sort.direction = event.direction;
		this.multimcqdataSourceArray[index].sort = this.sort2;
	}
	sortDataTF(event: Sort, index) {
		this.tfdataSourceArray[index].sort.active = event.active;
		this.tfdataSourceArray[index].sort.direction = event.direction;
		this.tfdataSourceArray[index].sort = this.sort3;
	}
	sortDataMTF(event: Sort, index) {
		this.matchdataSourceArray[index].sort.active = event.active;
		this.matchdataSourceArray[index].sort.direction = event.direction;
		this.matchdataSourceArray[index].sort = this.sort4;
	}
	sortDataMatrix(event: Sort, index) {
		this.matrixmatchdataSourceArray[index].sort.active = event.active;
		this.matrixmatchdataSourceArray[index].sort.direction = event.direction;
		this.matrixmatchdataSourceArray[index].sort = this.sort5;
	}
	sortDataMatrix45(event: Sort, index) {
		this.matrixmatch45dataSourceArray[index].sort.active = event.active;
		this.matrixmatch45dataSourceArray[index].sort.direction = event.direction;
		this.matrixmatch45dataSourceArray[index].sort = this.sort16;
	}
	sortDataSingle(event: Sort, index) {
		this.singledataSourceArray[index].sort.active = event.active;
		this.singledataSourceArray[index].sort.direction = event.direction;
		this.singledataSourceArray[index].sort = this.sort17;
	}
	sortDataDouble(event: Sort, index) {
		this.doubledataSourceArray[index].sort.active = event.active;
		this.doubledataSourceArray[index].sort.direction = event.direction;
		this.doubledataSourceArray[index].sort = this.sort18;
	}
	sortDataFill(event: Sort, index) {
		this.filldataSourceArray[index].sort.active = event.active;
		this.filldataSourceArray[index].sort.direction = event.direction;
		this.filldataSourceArray[index].sort = this.sort6;
	}
	sortDataIdentify(event: Sort, index) {
		this.identifydataSourceArray[index].sort.active = event.active;
		this.identifydataSourceArray[index].sort.direction = event.direction;
		this.identifydataSourceArray[index].sort = this.sort7;
	}
	sortDataOne(event: Sort, index) {
		this.oneDataSourceArray[index].sort.active = event.active;
		this.oneDataSourceArray[index].sort.direction = event.direction;
		this.oneDataSourceArray[index].sort = this.sort8;
	}
	sortDataVeryShort(event: Sort, index) {
		this.veryshortdataSourceArray[index].sort.active = event.active;
		this.veryshortdataSourceArray[index].sort.direction = event.direction;
		this.veryshortdataSourceArray[index].sort = this.sort9;
	}
	sortDataShort(event: Sort, index) {
		this.shortdataSourceArray[index].sort.active = event.active;
		this.shortdataSourceArray[index].sort.direction = event.direction;
		this.shortdataSourceArray[index].sort = this.sort10;
	}
	sortDataLong(event: Sort, index) {
		this.longdataSourceArray[index].sort.active = event.active;
		this.longdataSourceArray[index].sort.direction = event.direction;
		this.longdataSourceArray[index].sort = this.sort11;
	}
	sortDataVeryLong(event: Sort, index) {
		this.verylongdataSourceArray[index].sort.active = event.active;
		this.verylongdataSourceArray[index].sort.direction = event.direction;
		this.verylongdataSourceArray[index].sort = this.sort12;
	}
	getPageChangeMCQ(event: PageEvent, index) {
		this.mcqdataSourceArray[index].paginator.pageIndex = event.pageIndex;
		this.mcqdataSourceArray[index].paginator = this.paginator;
	}
	getPageChangeMCQMR(event: PageEvent, index) {
		this.multimcqdataSourceArray[index].paginator.pageIndex = event.pageIndex;
		this.multimcqdataSourceArray[index].paginator = this.paginator2;
	}
	getPageChangeTF(event: PageEvent, index) {
		this.tfdataSourceArray[index].paginator.pageIndex = event.pageIndex;
		this.tfdataSourceArray[index].paginator = this.paginator3;
	}
	getPageChangeMTF(event: PageEvent, index) {
		this.matchdataSourceArray[index].paginator.pageIndex = event.pageIndex;
		this.matchdataSourceArray[index].paginator = this.paginator4;
	}
	getPageChangeMatrix(event: PageEvent, index) {
		this.matrixmatchdataSourceArray[index].paginator.pageIndex = event.pageIndex;
		this.matrixmatchdataSourceArray[index].paginator = this.paginator5;
	}
	getPageChangeMatrix45(event: PageEvent, index) {
		this.matrixmatch45dataSourceArray[index].paginator.pageIndex = event.pageIndex;
		this.matrixmatch45dataSourceArray[index].paginator = this.paginator16;
	}
	getPageChangeSingle(event: PageEvent, index) {
		this.singledataSourceArray[index].paginator.pageIndex = event.pageIndex;
		this.singledataSourceArray[index].paginator = this.paginator17;
	}
	getPageChangeDouble(event: PageEvent, index) {
		this.doubledataSourceArray[index].paginator.pageIndex = event.pageIndex;
		this.doubledataSourceArray[index].paginator = this.paginator18;
	}
	getPageChangeIdentify(event: PageEvent, index) {
		this.identifydataSourceArray[index].paginator.pageIndex = event.pageIndex;
		this.identifydataSourceArray[index].paginator = this.paginator7;
	}
	getPageChangOne(event: PageEvent, index) {
		this.identifydataSourceArray[index].paginator.pageIndex = event.pageIndex;
		this.identifydataSourceArray[index].paginator = this.paginator8;
	}
	getPageChangeVeryShort(event: PageEvent, index) {
		this.veryshortdataSourceArray[index].paginator.pageIndex = event.pageIndex;
		this.veryshortdataSourceArray[index].paginator = this.paginator9;
	}
	getPageChangeShort(event: PageEvent, index) {
		this.shortdataSourceArray[index].paginator.pageIndex = event.pageIndex;
		this.shortdataSourceArray[index].paginator = this.paginator10;
	}
	getPageChangeLong(event: PageEvent, index) {
		this.longdataSourceArray[index].paginator.pageIndex = event.pageIndex;
		this.longdataSourceArray[index].paginator = this.paginator11;
	}
	getPageChangeVeryLong(event: PageEvent, index) {
		this.verylongdataSourceArray[index].paginator.pageIndex = event.pageIndex;
		this.verylongdataSourceArray[index].paginator = this.paginator12;
	}
	applyFilterMCQ(filterValue: string) {
		filterValue = filterValue.trim().toLowerCase();
		this.mcqdataSource.filter = filterValue;
	}
	applyFilterMultiMCQ(filterValue: string) {
		filterValue = filterValue.trim().toLowerCase();
		this.multimcqdataSource.filter = filterValue;
	}
	applyFilterMatrix(filterValue: string) {
		filterValue = filterValue.trim().toLowerCase();
		this.matrixmatchdataSource.filter = filterValue;
	}
	applyFilterMatrix45(filterValue: string) {
		filterValue = filterValue.trim().toLowerCase();
		this.matrixmatch45dataSource.filter = filterValue;
	}
	applyFilterSingleInteger(filterValue: string) {
		filterValue = filterValue.trim().toLowerCase();
		this.singledataSource.filter = filterValue;
	}
	applyFilterDoubleInteger(filterValue: string) {
		filterValue = filterValue.trim().toLowerCase();
		this.doubledataSource.filter = filterValue;
	}
	applyFilterMatch(filterValue: string) {
		filterValue = filterValue.trim().toLowerCase();
		this.matchdataSource.filter = filterValue;
	}

	applyFilterTF(filterValue: string) {
		filterValue = filterValue.trim().toLowerCase();
		this.tfdataSource.filter = filterValue;
	}
	applyFilterFill(filterValue: string) {
		filterValue = filterValue.trim().toLowerCase();
		this.filldataSource.filter = filterValue;
	}
	applyFilterIdentify(filterValue: string) {
		filterValue = filterValue.trim().toLowerCase();
		this.identifydataSource.filter = filterValue;
	}
	applyFilterOne(filterValue: string) {
		filterValue = filterValue.trim().toLowerCase();
		this.onedataSource.filter = filterValue;
	}
	applyFilterVeryShort(filterValue: string) {
		filterValue = filterValue.trim().toLowerCase();
		this.veryshortdataSource.filter = filterValue;
	}
	applyFilterShort(filterValue: string) {
		filterValue = filterValue.trim().toLowerCase();
		this.shortdataSource.filter = filterValue;
	}
	applyFilterLong(filterValue: string) {
		filterValue = filterValue.trim().toLowerCase();
		this.longdataSource.filter = filterValue;
	}
	applyFilterVeryLong(filterValue: string) {
		filterValue = filterValue.trim().toLowerCase();
		this.verylongdataSource.filter = filterValue;
	}
	applyFilterReview(filterValue: string) {
		filterValue = filterValue.trim().toLowerCase();
		this.reviewdatasource.filter = filterValue;
	}
	selectQuestionFromCheckboxMCQ(value, tab, i, subIndex, $event) {
		const findex = this.mcqSelectedQuestion.findIndex(
			f => f.id === value && f.index === i && f.subIndex === subIndex
		);
		if (findex === -1) {
			if (this.totalSelectedQuestion < this.totalquestionpaper) {
				this.mcqSelectedQuestion.push({ id: value, index: i, subIndex: subIndex });
				this.totalSelectedQuestion++;
			} else {
				this.notif.showSuccessErrorMessage('Exceeding no of question', 'error');
				$event.source.checked = false;
			}
		} else {
			this.mcqSelectedQuestion.splice(findex, 1);
			this.totalSelectedQuestion--;
		}

		// this.mcqSelectedQuestion=this.mcqSelectedQuestion.sort();
		// tslint:disable-next-line:no-shadowed-variable
		for (let i = 0; i < this.mcqSelectedQuestion.length - 1; i++) {
			for (let j = 0; j < this.mcqSelectedQuestion.length - i - 1; j++) {
				if (
					this.mcqSelectedQuestion[j].id > this.mcqSelectedQuestion[j + 1].id &&
					this.mcqSelectedQuestion[j].index === this.mcqSelectedQuestion[j + 1].index &&
					this.mcqSelectedQuestion[j].subIndex === this.mcqSelectedQuestion[j + 1].subIndex
				) {
					const temp = this.mcqSelectedQuestion[j];
					this.mcqSelectedQuestion[j] = this.mcqSelectedQuestion[j + 1];
					this.mcqSelectedQuestion[j + 1] = temp;
				}
			}
		}
	}
	checkMCQCheckboxValue(value, i, subIndex) {
		const findex = this.mcqSelectedQuestion.findIndex(
			f => f.id === value && f.index === i && f.subIndex === subIndex
		);
		return findex;
	}
	selectQuestionFromCheckboxEssay(value, tab, subIndex, $event) {
		const findex = this.essaySelectedQuestion.findIndex(f => f.id === value && f.subIndex === subIndex);
		if (findex === -1) {
			if (this.totalSelectedQuestion < this.totalquestionpaper) {
				this.essaySelectedQuestion.push({ id: value, subIndex: subIndex });
				this.totalSelectedQuestion++;
			} else {
				this.notif.showSuccessErrorMessage('Exceeding no of question', 'error');
				$event.source.checked = false;
			}

		} else {
			this.essaySelectedQuestion.splice(findex, 1);
			this.totalSelectedQuestion--;
		}

		// this.mcqSelectedQuestion=this.mcqSelectedQuestion.sort();
		for (let i = 0; i < this.essaySelectedQuestion.length - 1; i++) {
			for (let j = 0; j < this.essaySelectedQuestion.length - i - 1; j++) {
				if (
					this.essaySelectedQuestion[j].id > this.essaySelectedQuestion[j + 1].id &&
					this.essaySelectedQuestion[j].subIndex === this.essaySelectedQuestion[j + 1].subIndex
				) {
					const temp = this.essaySelectedQuestion[j];
					this.essaySelectedQuestion[j] = this.essaySelectedQuestion[j + 1];
					this.essaySelectedQuestion[j + 1] = temp;
				}
			}
		}
	}
	checkessaySelectedQuestion(value, subIndex) {
		const findex = this.essaySelectedQuestion.findIndex(
			f => f.id === value && f.subIndex === subIndex
		);
		return findex;
	}

	selectQuestionFromCheckboxMCQMR(value, tab, i, subIndex, $event) {
		const findex = this.mcqmrSelectedQuestion.findIndex(
			f => f.id === value && f.index === i && f.subIndex === subIndex
		);
		if (findex === -1) {
			if (this.totalSelectedQuestion < this.totalquestionpaper) {
				this.mcqmrSelectedQuestion.push({ id: value, index: i, subIndex: subIndex });
				this.totalSelectedQuestion++;
			} else {
				this.notif.showSuccessErrorMessage('Exceeding no of question', 'error');
				$event.source.checked = false;
			}
		} else {
			this.mcqmrSelectedQuestion.splice(findex, 1);
			this.totalSelectedQuestion--;
		}

		// this.mcqSelectedQuestion=this.mcqSelectedQuestion.sort();
		// tslint:disable-next-line:no-shadowed-variable
		for (let i = 0; i < this.mcqmrSelectedQuestion.length - 1; i++) {
			for (let j = 0; j < this.mcqmrSelectedQuestion.length - i - 1; j++) {
				if (
					this.mcqmrSelectedQuestion[j].id >
					this.mcqmrSelectedQuestion[j + 1].id &&
					this.mcqmrSelectedQuestion[j].index === this.mcqmrSelectedQuestion[j + 1].index &&
					this.mcqmrSelectedQuestion[j].subIndex === this.mcqmrSelectedQuestion[j + 1].subIndex
				) {
					const temp = this.mcqmrSelectedQuestion[j];
					this.mcqmrSelectedQuestion[j] = this.mcqmrSelectedQuestion[j + 1];
					this.mcqmrSelectedQuestion[j + 1] = temp;
				}
			}
		}
	}
	checkMCQMRCheckboxValue(value, i, subIndex) {
		const findex = this.mcqmrSelectedQuestion.findIndex(
			f => f.id === value && f.index === i && f.subIndex === subIndex
		);
		return findex;
	}

	selectQuestionFromCheckboxTF(value, tab, i, subIndex, $event) {
		const findex = this.tfSelectedQuestion.findIndex(
			f => f.id === value && f.index === i && f.subIndex === subIndex
		);
		if (findex === -1) {

			if (this.totalSelectedQuestion < this.totalquestionpaper) {
				this.tfSelectedQuestion.push({ id: value, index: i, subIndex: subIndex });
				this.totalSelectedQuestion++;
			} else {
				this.notif.showSuccessErrorMessage('Exceeding no of question', 'error');
				$event.source.checked = false;
			}
		} else {
			this.tfSelectedQuestion.splice(findex, 1);
			this.totalSelectedQuestion--;
		}

		// this.mcqSelectedQuestion=this.mcqSelectedQuestion.sort();
		// tslint:disable-next-line:no-shadowed-variable
		for (let i = 0; i < this.tfSelectedQuestion.length - 1; i++) {
			for (let j = 0; j < this.tfSelectedQuestion.length - i - 1; j++) {
				if (
					this.tfSelectedQuestion[j].id > this.tfSelectedQuestion[j + 1].id &&
					this.tfSelectedQuestion[j].index === this.tfSelectedQuestion[j + 1].index &&
					this.tfSelectedQuestion[j].subIndex === this.tfSelectedQuestion[j + 1].subIndex
				) {
					const temp = this.tfSelectedQuestion[j];
					this.tfSelectedQuestion[j] = this.tfSelectedQuestion[j + 1];
					this.tfSelectedQuestion[j + 1] = temp;
				}
			}
		}
	}
	checkTFCheckboxValue(value, i, subIndex) {
		const findex = this.tfSelectedQuestion.findIndex(
			f => f.id === value && f.index === i && f.subIndex === subIndex
		);
		return findex;
	}

	selectQuestionFromCheckboxMTF(value, tab, i, subIndex, $event) {
		const findex = this.mtfSelectedQuestion.findIndex(
			f => f.id === value && f.index === i && f.subIndex === subIndex
		);
		if (findex === -1) {
			if (this.totalSelectedQuestion < this.totalquestionpaper) {
				this.mtfSelectedQuestion.push({ id: value, index: i, subIndex: subIndex });
				this.totalSelectedQuestion++;
			} else {
				this.notif.showSuccessErrorMessage('Exceeding no of question', 'error');
				$event.source.checked = false;
			}

		} else {
			this.mtfSelectedQuestion.splice(findex, 1);
			this.totalSelectedQuestion--;
		}

		// this.mcqSelectedQuestion=this.mcqSelectedQuestion.sort();
		// tslint:disable-next-line:no-shadowed-variable
		for (let i = 0; i < this.mtfSelectedQuestion.length - 1; i++) {
			for (let j = 0; j < this.mtfSelectedQuestion.length - i - 1; j++) {
				if (
					this.mtfSelectedQuestion[j].id > this.mtfSelectedQuestion[j + 1].id &&
					this.mtfSelectedQuestion[j].index === this.mtfSelectedQuestion[j + 1].index &&
					this.mtfSelectedQuestion[j].subIndex === this.mtfSelectedQuestion[j + 1].subIndex
				) {
					const temp = this.mtfSelectedQuestion[j];
					this.mtfSelectedQuestion[j] = this.mtfSelectedQuestion[j + 1];
					this.mtfSelectedQuestion[j + 1] = temp;
				}
			}
		}
	}
	checkMTFCheckboxValue(value, i, subIndex) {
		const findex = this.mtfSelectedQuestion.findIndex(
			f => f.id === value && f.index === i && f.subIndex === subIndex
		);
		return findex;
	}

	selectQuestionFromCheckboxMatrix(value, tab, i, subIndex, $event) {
		const findex = this.matrixSelectedQuestion.findIndex(
			f => f.id === value && f.index === i && f.subIndex === subIndex
		);
		if (findex === -1) {

			if (this.totalSelectedQuestion < this.totalquestionpaper) {
				this.matrixSelectedQuestion.push({ id: value, index: i, subIndex: subIndex });
				this.totalSelectedQuestion++;
			} else {
				this.notif.showSuccessErrorMessage('Exceeding no of question', 'error');
				$event.source.checked = false;
			}
		} else {
			this.matrixSelectedQuestion.splice(findex, 1);
			this.totalSelectedQuestion--;
		}

		// this.mcqSelectedQuestion=this.mcqSelectedQuestion.sort();
		// tslint:disable-next-line:no-shadowed-variable
		for (let i = 0; i < this.matrixSelectedQuestion.length - 1; i++) {
			for (let j = 0; j < this.matrixSelectedQuestion.length - i - 1; j++) {
				if (
					this.matrixSelectedQuestion[j].id >
					this.matrixSelectedQuestion[j + 1].id &&
					this.matrixSelectedQuestion[j].index === this.matrixSelectedQuestion[j + 1].index &&
					this.matrixSelectedQuestion[j].subIndex === this.matrixSelectedQuestion[j + 1].subIndex
				) {
					const temp = this.matrixSelectedQuestion[j];
					this.matrixSelectedQuestion[j] = this.matrixSelectedQuestion[j + 1];
					this.matrixSelectedQuestion[j + 1] = temp;
				}
			}
		}
	}
	checkMatrixCheckboxValue(value, i, subIndex) {
		const findex = this.matrixSelectedQuestion.findIndex(
			f => f.id === value && f.index === i && f.subIndex === subIndex
		);
		return findex;
	}

	// Matrix 45
	selectQuestionFromCheckboxMatrix45(value, tab, i, subIndex, $event) {
		const findex = this.matrix45SelectedQuestion.findIndex(
			f => f.id === value && f.index === i && f.subIndex === subIndex
		);
		if (findex === -1) {

			if (this.totalSelectedQuestion < this.totalquestionpaper) {
				this.matrix45SelectedQuestion.push({ id: value, index: i, subIndex: subIndex });
				this.totalSelectedQuestion++;
			} else {
				this.notif.showSuccessErrorMessage('Exceeding no of question', 'error');
				$event.source.checked = false;
			}
		} else {
			this.matrix45SelectedQuestion.splice(findex, 1);
			this.totalSelectedQuestion--;
		}

		// this.mcqSelectedQuestion=this.mcqSelectedQuestion.sort();
		// tslint:disable-next-line:no-shadowed-variable
		for (let i = 0; i < this.matrix45SelectedQuestion.length - 1; i++) {
			for (let j = 0; j < this.matrix45SelectedQuestion.length - i - 1; j++) {
				if (
					this.matrix45SelectedQuestion[j].id >
					this.matrix45SelectedQuestion[j + 1].id &&
					this.matrix45SelectedQuestion[j].index === this.matrix45SelectedQuestion[j + 1].index &&
					this.matrix45SelectedQuestion[j].subIndex === this.matrix45SelectedQuestion[j + 1].subIndex
				) {
					const temp = this.matrix45SelectedQuestion[j];
					this.matrix45SelectedQuestion[j] = this.matrix45SelectedQuestion[
						j + 1];
					this.matrix45SelectedQuestion[j + 1] = temp;
				}
			}
		}
	}
	checkMatrix45CheckboxValue(value, i, subIndex) {
		const findex = this.matrix45SelectedQuestion.findIndex(
			f => f.id === value && f.index === i && f.subIndex === subIndex
		);
		return findex;
	}
	// End

	// Single Integer
	selectQuestionFromCheckboxSingle(value, tab, i, subIndex, $event) {
		const findex = this.singleIntegerSelectedQuestion.findIndex(
			f => f.id === value && f.index === i && f.subIndex === subIndex
		);
		if (findex === -1) {

			if (this.totalSelectedQuestion < this.totalquestionpaper) {
				this.singleIntegerSelectedQuestion.push({ id: value, index: i, subIndex: subIndex });
				this.totalSelectedQuestion++;
			} else {
				this.notif.showSuccessErrorMessage('Exceeding no of question', 'error');
				$event.source.checked = false;
			}
		} else {
			this.singleIntegerSelectedQuestion.splice(findex, 1);
			this.totalSelectedQuestion--;
		}

		// this.mcqSelectedQuestion=this.mcqSelectedQuestion.sort();
		// tslint:disable-next-line:no-shadowed-variable
		for (let i = 0; i < this.singleIntegerSelectedQuestion.length - 1; i++) {
			for (let j = 0; j < this.singleIntegerSelectedQuestion.length - i - 1; j++) {
				if (
					this.singleIntegerSelectedQuestion[j].id >
					this.singleIntegerSelectedQuestion[j + 1].id &&
					this.singleIntegerSelectedQuestion[j].index === this.singleIntegerSelectedQuestion[j + 1].index &&
					this.singleIntegerSelectedQuestion[j].subIndex === this.singleIntegerSelectedQuestion[j + 1].subIndex
				) {
					const temp = this.singleIntegerSelectedQuestion[j];
					this.singleIntegerSelectedQuestion[j] = this.singleIntegerSelectedQuestion[j + 1];
					this.singleIntegerSelectedQuestion[j + 1] = temp;
				}
			}
		}
	}
	checkSingleCheckboxValue(value, i, subIndex) {
		const findex = this.singleIntegerSelectedQuestion.findIndex(
			f => f.id === value && f.index === i && f.subIndex === subIndex
		);
		return findex;
	}
	// End

	// Double Integer
	selectQuestionFromCheckboxDouble(value, tab, i, subIndex, $event) {
		const findex = this.doubleIntegerSelectedQuestion.findIndex(
			f => f.id === value && f.index === i && f.subIndex === subIndex
		);
		if (findex === -1) {

			if (this.totalSelectedQuestion < this.totalquestionpaper) {
				this.doubleIntegerSelectedQuestion.push({ id: value, index: i, subIndex: subIndex });
				this.totalSelectedQuestion++;
			} else {
				this.notif.showSuccessErrorMessage('Exceeding no of question', 'error');
				$event.source.checked = false;
			}
		} else {
			this.doubleIntegerSelectedQuestion.splice(findex, 1);
			this.totalSelectedQuestion--;
		}

		// this.mcqSelectedQuestion=this.mcqSelectedQuestion.sort();
		// tslint:disable-next-line:no-shadowed-variable
		for (let i = 0; i < this.doubleIntegerSelectedQuestion.length - 1; i++) {
			for (let j = 0; j < this.doubleIntegerSelectedQuestion.length - i - 1; j++) {
				if (
					this.doubleIntegerSelectedQuestion[j].id >
					this.doubleIntegerSelectedQuestion[j + 1].id &&
					this.doubleIntegerSelectedQuestion[j].index === this.doubleIntegerSelectedQuestion[j + 1].index &&
					this.doubleIntegerSelectedQuestion[j].subIndex === this.doubleIntegerSelectedQuestion[j + 1].subIndex
				) {
					const temp = this.doubleIntegerSelectedQuestion[j];
					this.doubleIntegerSelectedQuestion[j] = this.doubleIntegerSelectedQuestion[j + 1];
					this.doubleIntegerSelectedQuestion[j + 1] = temp;
				}
			}
		}
	}
	checkDoubleCheckboxValue(value, i, subIndex) {
		const findex = this.doubleIntegerSelectedQuestion.findIndex(
			f => f.id === value && f.index === i && f.subIndex === subIndex
		);
		return findex;
	}
	// End
	selectQuestionFromCheckboxFill(value, tab, i, subIndex, $event) {
		const findex = this.fillSelectedQuestion.findIndex(
			f => f.id === value && f.index === i && f.subIndex === subIndex
		);
		if (findex === -1) {

			if (this.totalSelectedQuestion < this.totalquestionpaper) {
				this.fillSelectedQuestion.push({ id: value, index: i, subIndex: subIndex });
				this.totalSelectedQuestion++;
			} else {
				this.notif.showSuccessErrorMessage('Exceeding no of question', 'error');
				$event.source.checked = false;

			}
		} else {
			this.fillSelectedQuestion.splice(findex, 1);
			this.totalSelectedQuestion--;
		}

		// this.mcqSelectedQuestion=this.mcqSelectedQuestion.sort();
		// tslint:disable-next-line:no-shadowed-variable
		for (let i = 0; i < this.fillSelectedQuestion.length - 1; i++) {
			for (let j = 0; j < this.fillSelectedQuestion.length - i - 1; j++) {
				if (
					this.fillSelectedQuestion[j].id >
					this.fillSelectedQuestion[j + 1].id &&
					this.fillSelectedQuestion[j].index === this.fillSelectedQuestion[j + 1].index &&
					this.fillSelectedQuestion[j].subIndex === this.fillSelectedQuestion[j + 1].subIndex
				) {
					const temp = this.fillSelectedQuestion[j];
					this.fillSelectedQuestion[j] = this.fillSelectedQuestion[j + 1];
					this.fillSelectedQuestion[j + 1] = temp;
				}
			}
		}
	}
	checkFillCheckboxValue(value, i, subIndex) {
		const findex = this.fillSelectedQuestion.findIndex(
			f => f.id === value && f.index === i && f.subIndex === subIndex
		);
		return findex;
	}

	selectQuestionFromCheckboxIdentify(value, tab, i, subIndex, $event) {
		const findex = this.identifySelectedQuestion.findIndex(
			f => f.id === value && f.index === i && f.subIndex === subIndex
		);
		if (findex === -1) {

			if (this.totalSelectedQuestion < this.totalquestionpaper) {
				this.identifySelectedQuestion.push({ id: value, index: i, subIndex: subIndex });
				this.totalSelectedQuestion++;
			} else {
				this.notif.showSuccessErrorMessage('Exceeding no of question', 'error');
				$event.source.checked = false;
			}
		} else {
			this.identifySelectedQuestion.splice(findex, 1);
			this.totalSelectedQuestion--;
		}

		// this.mcqSelectedQuestion=this.mcqSelectedQuestion.sort();
		// tslint:disable-next-line:no-shadowed-variable
		for (let i = 0; i < this.identifySelectedQuestion.length - 1; i++) {
			for (let j = 0; j < this.identifySelectedQuestion.length - i - 1; j++) {
				if (
					this.identifySelectedQuestion[j].id >
					this.identifySelectedQuestion[j + 1].id &&
					this.identifySelectedQuestion[j].index === this.identifySelectedQuestion[j + 1].index &&
					this.identifySelectedQuestion[j].subIndex === this.identifySelectedQuestion[j + 1].subIndex
				) {
					const temp = this.identifySelectedQuestion[j].id;
					this.identifySelectedQuestion[j].id = this.identifySelectedQuestion[
						j + 1
					].id;
					this.identifySelectedQuestion[j + 1].id = temp;
				}
			}
		}
	}
	checkIdentifyCheckboxValue(value, i, subIndex) {
		const findex = this.identifySelectedQuestion.findIndex(
			f => f.id === value && f.index === i && f.subIndex === subIndex
		);
		return findex;
	}

	selectQuestionFromCheckboxOne(value, tab, i, subIndex, $event) {
		const findex = this.oneSelectedQuestion.findIndex(
			f => f.id === value && f.index === i && f.subIndex === subIndex
		);
		if (findex === -1) {

			if (this.totalSelectedQuestion < this.totalquestionpaper) {
				this.oneSelectedQuestion.push({ id: value, index: i, subIndex: subIndex });
				this.totalSelectedQuestion++;
			} else {
				this.notif.showSuccessErrorMessage('Exceeding no of question', 'error');
				$event.source.checked = false;
			}
		} else {
			this.oneSelectedQuestion.splice(findex, 1);
			this.totalSelectedQuestion--;
		}

		// this.mcqSelectedQuestion=this.mcqSelectedQuestion.sort();
		// tslint:disable-next-line:no-shadowed-variable
		for (let i = 0; i < this.oneSelectedQuestion.length - 1; i++) {
			for (let j = 0; j < this.oneSelectedQuestion.length - i - 1; j++) {
				if (
					this.oneSelectedQuestion[j].id > this.oneSelectedQuestion[j + 1].id &&
					this.oneSelectedQuestion[j].index === this.oneSelectedQuestion[j + 1].index &&
					this.oneSelectedQuestion[j].subIndex === this.oneSelectedQuestion[j + 1].subIndex
				) {
					const temp = this.oneSelectedQuestion[j];
					this.oneSelectedQuestion[j] = this.oneSelectedQuestion[j + 1];
					this.oneSelectedQuestion[j + 1] = temp;
				}
			}
		}
	}
	checkOneCheckboxValue(value, i, subIndex) {
		const findex = this.oneSelectedQuestion.findIndex(
			f => f.id === value && f.index === i && f.subIndex === subIndex
		);
		return findex;
	}

	selectQuestionFromCheckboxShort(value, tab, i, subIndex, $event) {
		const findex = this.shortSelectedQuestion.findIndex(
			f => f.id === value && f.index === i && f.subIndex === subIndex
		);
		if (findex === -1) {

			if (this.totalSelectedQuestion < this.totalquestionpaper) {
				this.shortSelectedQuestion.push({ id: value, index: i, subIndex: subIndex });
				this.totalSelectedQuestion++;
			} else {
				this.notif.showSuccessErrorMessage('Exceeding no of question', 'error');
				$event.source.checked = false;
			}
		} else {
			this.shortSelectedQuestion.splice(findex, 1);
			this.totalSelectedQuestion--;
		}

		// this.mcqSelectedQuestion=this.mcqSelectedQuestion.sort();
		// tslint:disable-next-line:no-shadowed-variable
		for (let i = 0; i < this.shortSelectedQuestion.length - 1; i++) {
			for (let j = 0; j < this.shortSelectedQuestion.length - i - 1; j++) {
				if (
					this.shortSelectedQuestion[j].id >
					this.shortSelectedQuestion[j + 1].id &&
					this.shortSelectedQuestion[j].index === this.shortSelectedQuestion[j + 1].index &&
					this.shortSelectedQuestion[j].subIndex === this.shortSelectedQuestion[j + 1].subIndex
				) {
					const temp = this.shortSelectedQuestion[j].id;
					this.shortSelectedQuestion[j].id = this.shortSelectedQuestion[
						j + 1
					].id;
					this.shortSelectedQuestion[j + 1].id = temp;
				}
			}
		}
	}
	checkShortCheckboxValue(value, i, subIndex) {
		const findex = this.shortSelectedQuestion.findIndex(
			f => f.id === value && f.index === i && f.subIndex === subIndex
		);
		return findex;
	}

	selectQuestionFromCheckboxVeryShort(value, tab, i, subIndex, $event) {
		const findex = this.veryshortSelectedQuestion.findIndex(
			f => f.id === value && f.index === i && f.subIndex === subIndex
		);
		if (findex === -1) {

			if (this.totalSelectedQuestion < this.totalquestionpaper) {
				this.veryshortSelectedQuestion.push({ id: value, index: i, subIndex: subIndex });
				this.totalSelectedQuestion++;
			} else {
				this.notif.showSuccessErrorMessage('Exceeding no of question', 'error');
				$event.source.checked = false;
			}
		} else {
			this.veryshortSelectedQuestion.splice(findex, 1);
			this.totalSelectedQuestion--;
		}

		// this.mcqSelectedQuestion=this.mcqSelectedQuestion.sort();
		// tslint:disable-next-line:no-shadowed-variable
		for (let i = 0; i < this.veryshortSelectedQuestion.length - 1; i++) {
			for (let j = 0; j < this.veryshortSelectedQuestion.length - i - 1; j++) {
				if (
					this.veryshortSelectedQuestion[j].id >
					this.veryshortSelectedQuestion[j + 1].id &&
					this.veryshortSelectedQuestion[j].index === this.veryshortSelectedQuestion[j + 1].index &&
					this.veryshortSelectedQuestion[j].subIndex === this.veryshortSelectedQuestion[j + 1].subIndex
				) {
					const temp = this.veryshortSelectedQuestion[j];
					this.veryshortSelectedQuestion[j] = this.veryshortSelectedQuestion[j + 1];
					this.veryshortSelectedQuestion[j + 1] = temp;
				}
			}
		}
	}
	checkVeryShortCheckboxValue(value, i, subIndex) {
		const findex = this.veryshortSelectedQuestion.findIndex(
			f => f.id === value && f.index === i && f.subIndex === subIndex
		);
		return findex;
	}
	selectQuestionFromCheckboxLong(value, tab, i, subIndex, $event) {
		const findex = this.longSelectedQuestion.findIndex(
			f => f.id === value && f.index === i && f.subIndex === subIndex
		);
		if (findex === -1) {

			if (this.totalSelectedQuestion < this.totalquestionpaper) {
				this.longSelectedQuestion.push({ id: value, index: i, subIndex: subIndex });
				this.totalSelectedQuestion++;
			} else {
				this.notif.showSuccessErrorMessage('Exceeding no of question', 'error');
				$event.source.checked = false;
			}
		} else {
			this.longSelectedQuestion.splice(findex, 1);
			this.totalSelectedQuestion--;
		}

		// this.mcqSelectedQuestion=this.mcqSelectedQuestion.sort();
		// tslint:disable-next-line:no-shadowed-variable
		for (let i = 0; i < this.longSelectedQuestion.length - 1; i++) {
			for (let j = 0; j < this.longSelectedQuestion.length - i - 1; j++) {
				if (
					this.longSelectedQuestion[j].id >
					this.longSelectedQuestion[j + 1].id &&
					this.longSelectedQuestion[j].index === this.longSelectedQuestion[j + 1].index &&
					this.longSelectedQuestion[j].subIndex === this.longSelectedQuestion[j + 1].subIndex
				) {
					const temp = this.longSelectedQuestion[j];
					this.longSelectedQuestion[j] = this.longSelectedQuestion[j + 1];
					this.longSelectedQuestion[j + 1] = temp;
				}
			}
		}
	}
	checkLongCheckboxValue(value, i, subIndex) {
		const findex = this.longSelectedQuestion.findIndex(
			f => f.id === value && f.index === i && f.subIndex === subIndex
		);
		return findex;
	}

	selectQuestionFromCheckboxVeryLong(value, tab, i, subIndex, $event) {
		const findex = this.verylongSelectedQuestion.findIndex(
			f => f.id === value && f.index === i && f.subIndex === subIndex
		);
		if (findex === -1) {

			if (this.totalSelectedQuestion < this.totalquestionpaper) {
				this.verylongSelectedQuestion.push({ id: value, index: i, subIndex: subIndex });
				this.totalSelectedQuestion++;
			} else {
				this.notif.showSuccessErrorMessage('Exceeding no of question', 'error');
				$event.source.checked = false;
			}
		} else {
			this.verylongSelectedQuestion.splice(findex, 1);
			this.totalSelectedQuestion--;
		}

		// this.mcqSelectedQuestion=this.mcqSelectedQuestion.sort();
		// tslint:disable-next-line:no-shadowed-variable
		for (let i = 0; i < this.verylongSelectedQuestion.length - 1; i++) {
			for (let j = 0; j < this.verylongSelectedQuestion.length - i - 1; j++) {
				if (
					this.verylongSelectedQuestion[j].id >
					this.verylongSelectedQuestion[j + 1].id &&
					this.verylongSelectedQuestion[j].index === this.verylongSelectedQuestion[j + 1].index &&
					this.verylongSelectedQuestion[j].subIndex === this.verylongSelectedQuestion[j + 1].subIndex
				) {
					const temp = this.verylongSelectedQuestion[j];
					this.verylongSelectedQuestion[j] = this.verylongSelectedQuestion[j + 1];
					this.verylongSelectedQuestion[j + 1] = temp;
				}
			}
		}
	}
	checkVeryLongCheckboxValue(value, i, subIndex) {
		const findex = this.verylongSelectedQuestion.findIndex(
			f => f.id === value && f.index === i && f.subIndex === subIndex
		);
		return findex;
	}

	buildForm() {
		this.qpspartial_form = this.fb.group({
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
		this.qpspartial_form2 = this.fb.group({
			qp_ssub_id: '',
			qp_topic_id: '',
			qp_st_id: ''
		});
	}

	resetTemplate() {
		this.qpspartial_form.reset();
		this.qpspartial_form2.reset();
		this.templates = [];
	}

	backtoSelectQuestion() {
		this.selectQuestion = true;
		this.sum = 0;
		this.getFilters(this.qpspartial_form.value.qp_tp_id);
		this.questionReviewDiv = false;
	}
	backtoParameter() {
		this.selectParameter = true;
		this.filterarea = true;
		this.questionReviewDiv = false;
		this.sum = 0;
	}
	getAllGenericList() {
		const tt_id = 2;
		const tp_status = 1;
		this.qelementService
			.getAllGenericList({ tt_id: tt_id, tp_status: tp_status })
			.subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.templateArray = result.data;
				}
			});
	}

	htmlToText(html) {
		return this.htt.htmlToText(html);
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
			tf_skill_id: [],
			tf_dl_id: [],
			tf_weightage: [],
			tf_qcount: []
		};
		for (const avalue of arr) {
			if (avalue.tf_qt_id === '3') {
				essayGroupFilter.tf_id.push(avalue.tf_id);
				essayGroupFilter.tf_qst_id.push(avalue.tf_qst_id);
				essayGroupFilter.tf_skill_id.push(avalue.tf_skill_id);
				essayGroupFilter.tf_dl_id.push(avalue.tf_dl_id);
				essayGroupFilter.tf_weightage.push(avalue.tf_weightage);
				essayGroupFilter.tf_qcount.push(avalue.tf_qcount);
			}
		}
		return essayGroupFilter;
	}

	getFilters(tp_id) {
		this.questionsOfEachEssayFilerArray = [];
		this.totalTemplateQuestion = 0;
		this.filtersArray = [];
		this.essayGroup = [];
		this.ESSAYQUESTION_ELEMENT_DATA = [];
		this.essayquestionDatasource = new MatTableDataSource<ESSAYQUESTIONElement>(
			this.ESSAYQUESTION_ELEMENT_DATA
		);
		for (const item of this.templateArray) {
			if (item.tp_id === tp_id) {
				this.printTemplate = item;
				this.filtersArray = this.getFilterWithoutEssay(item.filters);
				this.essayGroup = this.getEssayFilter(item.filters);
				if (this.essayGroup.tf_qst_id.length > 0) {
					this.filtersArray.push(this.essayGroup);
				}

				this.currentTemplate = item;
				for (let eachsubIndex = 0; eachsubIndex < this.selectedSubArray.length; eachsubIndex++) {
					this.MULTI_MCQ_ELEMENT_DATA_FINAL_SUB[eachsubIndex] = [];
					this.MCQ_ELEMENT_DATA_FINAL_SUB[eachsubIndex] = [];
					this.TF_ELEMENT_DATA_FINAL_SUB[eachsubIndex] = [];
					this.MATCH_ELEMENT_DATA_FINAL_SUB[eachsubIndex] = [];
					this.MATRIX_MATCH_ELEMENT_FINAL_SUB[eachsubIndex] = [];
					this.MATRIX_MATCH_ELEMENT_FINAL_45_SUB[eachsubIndex] = [];
					this.SINGLE_ELEMENT_DATA_FINAL_SUB[eachsubIndex] = [];
					this.DOUBLE_ELEMENT_DATA_FINAL_SUB[eachsubIndex] = [];
					this.IDENTIFY_ELEMENT_DATA_FINAL_SUB[eachsubIndex] = [];
					this.FILL_ELEMENT_DATA_FINAL_SUB[eachsubIndex] = [];
					this.ONE_ELEMENT_DATA_FINAL_SUB[eachsubIndex] = [];
					this.SHORT_ELEMENT_DATA_FINAL_SUB[eachsubIndex] = [];
					this.VERYSHORT_ELEMENT_DAT_FINAL_SUB[eachsubIndex] = [];
					this.LONG_ELEMENT_DATA_FINAL_SUB[eachsubIndex] = [];
					this.VERYLONG_ELEMENT_DATA_FINAL_SUB[eachsubIndex] = [];
					const questionsOfEachTemplateFilerArraytemp: any[] = [];
					for (let fi = 0; fi < this.filtersArray.length; fi++) {
						const value = this.filtersArray[fi];
						questionsOfEachTemplateFilerArraytemp[fi] = [];
						if (value.tf_qt_id === '1' || value.tf_qt_id === '2') {
							const param: any = {};
							param.qm_id = 2;
							param.qt_id = value.tf_qt_id;
							param.qst_id = value.tf_qst_id;
							param.sub_id = this.selectedSubArray[eachsubIndex].sub_id;
							param.st_id = this.stitems;
							param.skill_id = value.tf_skill_id;
							param.dl_id = value.tf_dl_id;
							param.qus_marks = value.tf_weightage;
							param.status = 1;
							this.qelementService
								.getQuestionsInTemplate(param)
								.subscribe((result: any) => {
									if (result && result.status === 'ok') {
										this.questionsOfEachTemplateFilerArray[fi] = result.data;
										questionsOfEachTemplateFilerArraytemp[fi] = result.data;
										if (eachsubIndex === 0 && fi === 0) {
											this.getQuestion(eachsubIndex, fi);
										}
										this.selectedQuestionIndexArray[fi] = [];
									}
								});
						} else if (Number(value.tf_qt_id) === 3) {
							if (value.tf_qst_id.length > 0) {
								const questionsOfEachEssayFilerArrayTemp: any[] = [];
								for (let eachType = 0; eachType < value.tf_qst_id.length; eachType++) {
									const param: any = {};
									param.qm_id = 2;
									param.qt_id = value.tf_qt_id;
									param.qst_id = value.tf_qst_id[eachType];
									param.sub_id = this.selectedSubArray[eachsubIndex].sub_id;
									param.st_id = this.stitems;
									param.skill_id = value.tf_skill_id[eachType];
									param.dl_id = value.tf_dl_id[eachType];
									param.qus_marks = value.tf_weightage[eachType];
									param.status = 1;
									this.qelementService
										.getQuestionsInTemplate(param)
										.subscribe((result: any) => {
											if (result && result.status === 'ok') {
												if (result.data.length > 0) {
													for (const eachq of result.data) {
														eachq.tf_id = value.tf_id[eachType];
														questionsOfEachEssayFilerArrayTemp.push(eachq);
													}
												}
											}
										});
								}
								// this.questionsOfEachTemplateFilerArray[fi] = this.questionsOfEachEssayFilerArray;
								questionsOfEachTemplateFilerArraytemp[fi] = questionsOfEachEssayFilerArrayTemp;
								if (eachsubIndex === 0 && fi === 0) {
									this.getQuestion(eachsubIndex, fi);
								}
							}
							this.questionsOfEachEssayFilerArray = [];
						}
						this.totalTemplateQuestion += Number(value.tf_qcount);

					}
					this.questionsOfEachSelectedSubArray[eachsubIndex] = questionsOfEachTemplateFilerArraytemp;
				}
				// console.log('questions in questionsOfEachTemplateFilerArray');
				// console.log(this.questionsOfEachTemplateFilerArray);
				break;
			}
		}
	}
	setSelectedSubject() {
		this.selectedSubArray = [];
		const selectedsubid = this.qpspartial_form.value.qp_sub_id;
		if (selectedsubid.length > 0) {
			selectedsubid.forEach(element => {
				this.subjectArray.forEach(element1 => {
					if (element === element1.sub_id) {
						this.selectedSubArray.push(element1);
					}
				});
			});
			// this.qpspartial_form2.value.qp_ssub_id = this.selectedSubArray[0]
		}

	}
	addQuestionList() {
		this.showTopicSubTopicTable = true;
		this.noRecordDiv = false;
		if (!this.qpspartial_form2.value.qp_topic_id) {
			this.notif.showSuccessErrorMessage('Topic is required', 'error');
		}
		if (!this.qpspartial_form2.value.qp_st_id) {
			this.notif.showSuccessErrorMessage('Subtopic is required', 'error');
		}
		this.dataSource.paginator = this.paginator14;
		if (this.qpspartial_form2.valid) {
			let template: any;
			template = this.qpspartial_form2.value;
			const index = this.templateStarray.indexOf(
				this.qpspartial_form2.value.qp_st_id
			);
			if (index === -1) {
				this.templateStarray.push(this.qpspartial_form2.value.qp_st_id);
			} else {
				this.templateStarray.splice(index, 1);
			}
			for (
				let i = 0;
				i < this.templateStarray[this.templateStarray.length - 1].length;
				i++
			) {
				this.qelementService
					.getSubtopicNameById(
						this.templateStarray[this.templateStarray.length - 1][i].toString()
					)
					.subscribe((result: any) => {
						if (result && result.status === 'ok') {
							template.topic_name = result.data[0].topic_name;
							template.st_name = result.data[0].st_name;
							const findex = this.ELEMENT_DATA.findIndex(
								x =>
									x.subid ===
									this.templateStarray[this.templateStarray.length - 1][
										i
									].toString()
							);
							if (findex === -1) {
								this.ELEMENT_DATA.push({
									position: this.startIndex,
									topic: template.topic_name,
									subtopic: template.st_name,
									action: template,
									subid: this.templateStarray[this.templateStarray.length - 1][
										i
									].toString()
								});
								this.startIndex++;
								this.dataSource = new MatTableDataSource<Element>(
									this.ELEMENT_DATA
								);
								this.dataSource.paginator = this.paginator14;
								this.sort14.sortChange.subscribe(
									() => (this.paginator14.pageIndex = 0)
								);
								this.dataSource.sort = this.sort14;
							} else {
								this.ELEMENT_DATA.slice(findex);
							}
						}
						this.templates.push(template);
						const findex2 = this.stitems.indexOf(
							this.templateStarray[this.templateStarray.length - 1][
								i
							].toString()
						);

						if (findex2 === -1) {
							this.stitems.push(
								this.templateStarray[this.templateStarray.length - 1][
									i
								].toString()
							);
						} else {
							this.stitems.slice(findex2);
						}
					});
			}
		}
	}
	deleteQuestionList(deletei: number) {
		this.startIndex = this.startIndex - 1;
		this.templates.splice(deletei, 1);
		this.stitems.splice(deletei, 1);
		let i = 0,
			j = 0;
		if (this.filterarea) {
			let k = 0;
			for (const item of this.templateStarray[this.templateStarray.length - 1]) {
				if (item === this.ELEMENT_DATA[deletei].subid) {
					const selectedIndex =
						this.qpspartial_form2.controls.qp_st_id.value &&
						this.qpspartial_form2.controls.qp_st_id.value.indexOf(item);
					if (selectedIndex > -1) {
						const newToppingsValue = this.qpspartial_form2.controls.qp_st_id.value.slice();
						newToppingsValue.splice(selectedIndex, 1);
						this.qpspartial_form2.controls.qp_st_id.setValue(newToppingsValue);
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
			for (const element of this.ELEMENT_DATA) {
				if (j > deletei) {
					this.ELEMENT_DATA[j].position = this.ELEMENT_DATA[j].position - 1;
					j++;
				} else {
					j++;
				}
			}
			this.ELEMENT_DATA.splice(deletei, 1);
			this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
			this.dataSource.paginator = this.paginator14;
		} else {
			this.total =
				Number(this.total) - Number(this.REVIEW_ELEMENT_DATA[deletei].marks);
			for (const element of this.REVIEW_ELEMENT_DATA) {
				if (i > deletei) {
					this.REVIEW_ELEMENT_DATA[i].position =
						this.REVIEW_ELEMENT_DATA[i].position - 1;
					i++;
				} else {
					i++;
				}
			}
			this.REVIEW_ELEMENT_DATA.splice(deletei, 1);
			this.reviewdatasource = new MatTableDataSource<ReviewElement>(
				this.REVIEW_ELEMENT_DATA
			);
			this.reviewdatasource.paginator = this.paginator13;
		}
	}
	getQuestion(subIndex, value) {
		const MCQ_ELEMENT_DATA_FINAL_TEMP: any[] = [];
		this.currentTemplateFilterIndex = value;
		this.questionsArray = [];
		this.questionsArray = this.questionsOfEachSelectedSubArray[subIndex][value];
		if (
			Number(this.filtersArray[this.currentTemplateFilterIndex].tf_qst_id) === 1
		) {
			this.currentSelectedTab = 'mcq';
			this.MCQ_ELEMENT_DATA = [];
			this.mcqdataSource = new MatTableDataSource<MCQElement>(
				this.MCQ_ELEMENT_DATA
			);
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
					hoverArray[secondId] =
						hoverArray[secondId] +
						(this.optionHA[id] + ':' + '&nbsp;&nbsp;' + option.qopt_options) +
						'\n';
					if (option.qopt_answer === '1') {
						optionsArray[secondId] =
							optionsArray[secondId] + '<b>' + option.qopt_options + '</b>';
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
					lodType: t.dl_name,
					topic: t.topic_name,
					subtopic: t.st_name,
					suggestedMarks: t.qus_marks,
					reference: t.qus_historical_reference,
					negativeMarks: t.qus_negative_marks,
					showHover: hoverArray[ind2 - 1],
					qusid: t.qus_id
				});
				ind2++;
			}
			this.mcqdataSource = new MatTableDataSource<MCQElement>(
				this.MCQ_ELEMENT_DATA
			);
			this.paginator.length = this.MCQ_ELEMENT_DATA.length;

			this.lengthArrayMCQ[value] = this.MCQ_ELEMENT_DATA.length;
			this.mcqdataSourceArray[value] = this.mcqdataSource;
			this.mcqdataSourceArray[value].paginator = this.paginator;
			this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
			this.mcqdataSourceArray[value].sort = this.sort;
			this.MCQ_ELEMENT_DATA_FINAL[value] = {
				id: this.MCQ_ELEMENT_DATA,
				index: value,
				subIndex: subIndex
			};
			this.MCQ_ELEMENT_DATA_FINAL_SUB[subIndex] = this.MCQ_ELEMENT_DATA_FINAL.concat();
		} else if (
			Number(this.filtersArray[this.currentTemplateFilterIndex].tf_qst_id) === 2
		) {
			this.currentSelectedTab = 'mcqmr';
			this.MULTI_MCQ_ELEMENT_DATA = [];
			this.multimcqdataSource = new MatTableDataSource<MultiMCQElement>(
				this.MULTI_MCQ_ELEMENT_DATA
			);
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
					hoverArray[third] =
						hoverArray[third] +
						(this.optionHA[id2] + ':' + '&nbsp;' + option.qopt_options) +
						'\n';
					if (option.qopt_answer === '1') {
						optionsArray[third] =
							optionsArray[third] + '<b>' + option.qopt_options + '</b>';
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
					lodMulti: t.dl_name,
					topicMulti: t.topic_name,
					subtopicMulti: t.st_name,
					suggestedMarksMulti: t.qus_marks,
					negativeMarks: t.qus_negative_marks,
					referenceMulti: t.qus_historical_reference,
					showHoverMulti: hoverArray[ind3 - 1],
					qusid: t.qus_id
				});
				ind3++;
			}
			this.multimcqdataSource = new MatTableDataSource<MultiMCQElement>(
				this.MULTI_MCQ_ELEMENT_DATA
			);

			this.lengthArrayMCQMR[value] = this.MULTI_MCQ_ELEMENT_DATA.length;
			this.multimcqdataSourceArray[value] = this.multimcqdataSource;
			this.multimcqdataSourceArray[value].paginator = this.paginator2;
			this.sort2.sortChange.subscribe(() => (this.paginator2.pageIndex = 0));
			this.multimcqdataSourceArray[value].sort = this.sort2;
			this.MULTI_MCQ_ELEMENT_DATA_FINAL[value] = {
				id: this.MULTI_MCQ_ELEMENT_DATA,
				index: value,
				subIndex: subIndex
			};
			this.MULTI_MCQ_ELEMENT_DATA_FINAL_SUB[subIndex] = this.MULTI_MCQ_ELEMENT_DATA_FINAL.concat();
		} else if (
			Number(this.filtersArray[this.currentTemplateFilterIndex].tf_qst_id) === 3
		) {
			this.TF_ELEMENT_DATA = [];
			this.currentSelectedTab = 'tf';
			this.tfdataSource = new MatTableDataSource<TFElement>(
				this.TF_ELEMENT_DATA
			);
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
					hoverArray[third] =
						hoverArray[third] +
						(this.optionHA[id2] + ':' + '&nbsp;&nbsp;' + option.qopt_options) +
						'\n';
					if (option.qopt_answer === '1') {
						optionsArray[third] =
							optionsArray[third] + '<b>' + option.qopt_options + '</b>';
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
					lodTF: t.dl_name,
					topicTF: t.topic_name,
					subtopicTF: t.st_name,
					suggestedMarksTF: t.qus_marks,
					negativeMarks: t.qus_negative_marks,
					referenceTF: t.qus_historical_reference,
					showHoverTF: hoverArray[ind3 - 1],
					qusid: t.qus_id
				});
				ind3++;
			}
			this.tfdataSource = new MatTableDataSource<TFElement>(
				this.TF_ELEMENT_DATA
			);
			this.lengthArrayTF[value] = this.TF_ELEMENT_DATA.length;
			this.tfdataSourceArray[value] = this.tfdataSource;
			this.tfdataSourceArray[value].paginator = this.paginator3;
			this.sort3.sortChange.subscribe(() => (this.paginator3.pageIndex = 0));
			this.tfdataSourceArray[value].sort = this.sort3;
			this.TF_ELEMENT_DATA_FINAL[value] = {
				id: this.TF_ELEMENT_DATA,
				index: value,
				subIndex: subIndex
			};
			this.TF_ELEMENT_DATA_FINAL_SUB[subIndex] = this.TF_ELEMENT_DATA_FINAL.concat();
		} else if (
			Number(this.filtersArray[this.currentTemplateFilterIndex].tf_qst_id) === 4
		) {
			this.MATCH_ELEMENT_DATA = [];
			this.currentSelectedTab = 'mtf';
			this.matchdataSource = new MatTableDataSource<MatchElement>(
				this.MATCH_ELEMENT_DATA
			);
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
					hoverArray[fifthId] =
						hoverArray[fifthId] +
						this.optionHA[id4] +
						':' +
						'&nbsp;&nbsp;' +
						t.options[id4].qopt_options +
						'|' +
						this.optionmatchHA[id4] +
						':' +
						'&nbsp;&nbsp;' +
						t.options[id4].qopt_options_match +
						'\n';
					optionsArray4[fifthId] =
						optionsArray4[fifthId] + '<b>' + t.options[id4].qopt_answer + '</b>' + ',';
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
					lodTypeMatch: t.dl_name,
					topicMatch: t.topic_name,
					subtopicMatch: t.st_name,
					suggestedMarksMatch: t.qus_marks,
					negativeMarks: t.qus_negative_marks,
					referenceMatch: t.qus_historical_reference,
					showHoverMatch: hoverArray[ind5 - 1],
					qusid: t.qus_id
				});
				ind5++;
			}
			this.matchdataSource = new MatTableDataSource<MatchElement>(
				this.MATCH_ELEMENT_DATA
			);
			this.lengthArrayMTF[value] = this.MATCH_ELEMENT_DATA.length;
			this.matchdataSourceArray[value] = this.matchdataSource;
			this.matchdataSourceArray[value].paginator = this.paginator4;
			this.sort4.sortChange.subscribe(() => (this.paginator4.pageIndex = 0));
			this.matchdataSourceArray[value].sort = this.sort4;
			this.MATCH_ELEMENT_DATA_FINAL[value] = {
				id: this.MATCH_ELEMENT_DATA,
				index: value,
				subIndex: subIndex
			};
			this.MATCH_ELEMENT_DATA_FINAL_SUB[subIndex] = this.MATCH_ELEMENT_DATA_FINAL.concat();
		} else if (
			Number(this.filtersArray[this.currentTemplateFilterIndex].tf_qst_id) === 5
		) {
			this.MATRIX_MATCH_ELEMENT_DATA = [];
			this.currentSelectedTab = 'matrix';
			this.matrixmatchdataSource = new MatTableDataSource<MatrixMatchElement>(
				this.MATRIX_MATCH_ELEMENT_DATA
			);
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
					optionsArray6[sixthId] =
						optionsArray6[sixthId] +
						this.optionHA[id7] +
						':' +
						option.qopt_options;
					id7++;
				}
				sixthId++;
				for (const option_match of t.options_match) {
					matchArray[seventhId] =
						matchArray[seventhId] +
						this.optionmatchHA[id8] +
						':' +
						option_match.qopt_options_match;
					id8++;
				}
				seventhId++;
				for (const answerrow of t.answer) {
					id13 = 0;
					while (id13 < 4) {
						if (answerrow[id13].qopt_answer === '1') {
							answerArray3[tenthId] =
								answerArray3[tenthId] + this.optionmatchHA[id13];
						} else {
							answerArray3[tenthId] = answerArray3[tenthId] + '';
						}
						id13++;
					}
					tenthId++;
					hoverArray[ninthId] =
						optionsArray6[ninthId] + '\n' + matchArray[ninthId] + '\n';
					answerArray[ninthId] =
						answerArray[ninthId] + '<b>' + answerArray3[id9] + '</b>' + '<br>';
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
					lodTypeMatrixMatch: t.dl_name,
					topicMatrixMatch: t.topic_name,
					subtopicMatrixMatch: t.st_name,
					suggestedMarksMatrixMatch: t.qus_marks,
					negativeMarks: t.qus_negative_marks,
					referenceMatrixMatch: t.qus_historical_reference,
					showHoverMatrixMatch: hoverArray[ind6 - 1],
					qusid: t.qus_id
				});
				ind6++;
			}
			this.matrixmatchdataSource = new MatTableDataSource<MatrixMatchElement>(
				this.MATRIX_MATCH_ELEMENT_DATA
			);
			this.lengthArrayMatrix[value] = this.MATRIX_MATCH_ELEMENT_DATA.length;
			this.matrixmatchdataSourceArray[value] = this.matrixmatchdataSource;
			this.matrixmatchdataSourceArray[value].paginator = this.paginator5;
			this.sort5.sortChange.subscribe(() => (this.paginator5.pageIndex = 0));
			this.matrixmatchdataSourceArray[value].sort = this.sort5;
			this.MATRIX_MATCH_ELEMENT_FINAL[value] = {
				id: this.MATRIX_MATCH_ELEMENT_DATA,
				index: value,
				subIndex: subIndex
			};
			this.MATRIX_MATCH_ELEMENT_FINAL_SUB[subIndex] = this.MATRIX_MATCH_ELEMENT_FINAL.concat();
		} else if (
			Number(this.filtersArray[this.currentTemplateFilterIndex].tf_qst_id) === 13
		) {
			this.MATRIX_MATCH_ELEMENT_DATA_45 = [];
			this.currentSelectedTab = 'matrix45';
			this.matrixmatch45dataSource = new MatTableDataSource<MatrixMatch45Element>(
				this.MATRIX_MATCH_ELEMENT_DATA_45
			);
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
				this.MATRIX_MATCH_ELEMENT_DATA_45.push({
					selectMatrixMatch: ind6 - 1,
					actionMatrixMatch: ind6 - 1,
					positionMatrixMatch: ind6,
					questionMatrixMatch: t.qus_name,
					optionsMatrixMatch: answerArray[ind6 - 1],
					explanationsMatrixMatch: t.qus_explanation,
					skillTypeMatrixMatch: t.skill_name,
					lodTypeMatrixMatch: t.dl_name,
					topicMatrixMatch: t.topic_name,
					subtopicMatrixMatch: t.st_name,
					suggestedMarksMatrixMatch: t.qus_marks,
					negativeMarks: t.qus_negative_marks,
					referenceMatrixMatch: t.qus_historical_reference,
					showHoverMatrixMatch: hoverArray[ind6 - 1],
					qusid: t.qus_id
				});
				ind6++;
			}
			this.matrixmatch45dataSource = new MatTableDataSource<MatrixMatch45Element>(
				this.MATRIX_MATCH_ELEMENT_DATA_45
			);
			this.lengthArrayMatrix45[value] = this.MATRIX_MATCH_ELEMENT_DATA_45.length;
			this.matrixmatch45dataSourceArray[value] = this.matrixmatch45dataSource;
			this.matrixmatch45dataSourceArray[value].paginator = this.paginator16;
			this.sort16.sortChange.subscribe(() => (this.paginator16.pageIndex = 0));
			this.matrixmatch45dataSourceArray[value].sort = this.sort16;
			this.MATRIX_MATCH_ELEMENT_FINAL_45[value] = {
				id: this.MATRIX_MATCH_ELEMENT_DATA_45,
				index: value,
				subIndex: subIndex
			};
			this.MATRIX_MATCH_ELEMENT_FINAL_45_SUB[subIndex] = this.MATRIX_MATCH_ELEMENT_FINAL_45.concat();
		} else if (
			Number(this.filtersArray[this.currentTemplateFilterIndex].tf_qst_id) === 14) {
			this.SINGLE_ELEMENT_DATA = [];
			this.currentSelectedTab = 'single';
			this.singledataSource = new MatTableDataSource<SingleIntegerElement>(
				this.SINGLE_ELEMENT_DATA
			);
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
					answerTemp: t.qopt_answer,
					explanations: t.qus_explanation,
					skillType: t.skill_name,
					lodType: t.dl_name,
					topic: t.topic_name,
					subtopic: t.st_name,
					negativeMarks: t.qus_negative_marks,
					suggestedMarks: t.qus_marks,
					reference: t.qus_historical_reference,
					qus_qst_id: t.qus_qst_id,
					qusid: t.qus_id
				});
				ind++;
			}
			this.singledataSource = new MatTableDataSource<SingleIntegerElement>(
				this.SINGLE_ELEMENT_DATA
			); this.lengthArraySingleInteger[value] = this.SINGLE_ELEMENT_DATA.length;
			this.singledataSourceArray[value] = this.singledataSource;
			this.singledataSourceArray[value].paginator = this.paginator17;
			this.sort17.sortChange.subscribe(() => (this.paginator17.pageIndex = 0));
			this.singledataSourceArray[value].sort = this.sort17;
			this.SINGLE_ELEMENT_DATA_FINAL[value] = {
				id: this.SINGLE_ELEMENT_DATA,
				index: value,
				subIndex: subIndex
			};
			this.SINGLE_ELEMENT_DATA_FINAL_SUB[subIndex] = this.SINGLE_ELEMENT_DATA_FINAL.concat();
		} else if (
			Number(this.filtersArray[this.currentTemplateFilterIndex].tf_qst_id) === 15) {
			this.DOUBLE_ELEMENT_DATA = [];
			this.currentSelectedTab = 'double';
			this.doubledataSource = new MatTableDataSource<DoubleIntegerElement>(
				this.DOUBLE_ELEMENT_DATA
			);
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
					answerTemp: t.qopt_answer,
					explanations: t.qus_explanation,
					skillType: t.skill_name,
					lodType: t.dl_name,
					topic: t.topic_name,
					subtopic: t.st_name,
					negativeMarks: t.qus_negative_marks,
					suggestedMarks: t.qus_marks,
					reference: t.qus_historical_reference,
					qus_qst_id: t.qus_qst_id,
					qusid: t.qus_id
				});
				ind++;
			}
			this.doubledataSource = new MatTableDataSource<DoubleIntegerElement>(
				this.DOUBLE_ELEMENT_DATA
			); this.lengthArrayDoubleInteger[value] = this.DOUBLE_ELEMENT_DATA.length;
			this.doubledataSourceArray[value] = this.doubledataSource;
			this.doubledataSourceArray[value].paginator = this.paginator18;
			this.sort18.sortChange.subscribe(() => (this.paginator18.pageIndex = 0));
			this.doubledataSourceArray[value].sort = this.sort18;
			this.DOUBLE_ELEMENT_DATA_FINAL[value] = {
				id: this.DOUBLE_ELEMENT_DATA,
				index: value,
				subIndex: subIndex
			};
			this.DOUBLE_ELEMENT_DATA_FINAL_SUB[subIndex] = this.DOUBLE_ELEMENT_DATA_FINAL.concat();
		} else if (
			Number(this.filtersArray[this.currentTemplateFilterIndex].tf_qst_id) === 6
		) {
			this.FILL_ELEMENT_DATA = [];
			this.currentSelectedTab = 'fill';
			this.filldataSource = new MatTableDataSource<FillElement>(
				this.FILL_ELEMENT_DATA
			);
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
					lodTypeSub: t.dl_name,
					topicSub: t.topic_name,
					subtopicSub: t.st_name,
					negativeMarks: t.qus_negative_marks,
					suggestedMarksSub: t.qus_marks,
					referenceSub: t.qus_historical_reference,
					qusid: t.qus_id
				});
				ind++;
			}
			this.filldataSource = new MatTableDataSource<FillElement>(
				this.FILL_ELEMENT_DATA
			); this.lengthArrayFill[value] = this.FILL_ELEMENT_DATA.length;
			this.filldataSourceArray[value] = this.filldataSource;
			this.filldataSourceArray[value].paginator = this.paginator6;
			this.sort6.sortChange.subscribe(() => (this.paginator6.pageIndex = 0));
			this.filldataSourceArray[value].sort = this.sort6;
			this.FILL_ELEMENT_DATA_FINAL[value] = {
				id: this.FILL_ELEMENT_DATA,
				index: value,
				subIndex: subIndex
			};
			this.FILL_ELEMENT_DATA_FINAL_SUB[subIndex] = this.FILL_ELEMENT_DATA_FINAL.concat();
		} else if (
			Number(this.filtersArray[this.currentTemplateFilterIndex].tf_qst_id) === 7
		) {
			this.IDENTIFY_ELEMENT_DATA = [];
			this.currentSelectedTab = 'identify';
			this.identifydataSource = new MatTableDataSource<IdentifyElement>(
				this.IDENTIFY_ELEMENT_DATA
			);
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
					lodTypeSub: t.dl_name,
					topicSub: t.topic_name,
					subtopicSub: t.st_name,
					suggestedMarksSub: t.qus_marks,
					negativeMarks: t.qus_negative_marks,
					referenceSub: t.qus_historical_reference,
					qusid: t.qus_id
				});
				ind++;
			}
			this.identifydataSource = new MatTableDataSource<IdentifyElement>(
				this.IDENTIFY_ELEMENT_DATA
			);
			this.lengthArrayIdentify[value] = this.IDENTIFY_ELEMENT_DATA.length;
			this.identifydataSourceArray[value] = this.identifydataSource;
			this.identifydataSourceArray[value].paginator = this.paginator7;
			this.sort7.sortChange.subscribe(() => (this.paginator7.pageIndex = 0));
			this.identifydataSourceArray[value].sort = this.sort7;
			this.IDENTIFY_ELEMENT_DATA_FINAL[value] = {
				id: this.IDENTIFY_ELEMENT_DATA,
				index: value,
				subIndex: subIndex
			};
			this.IDENTIFY_ELEMENT_DATA_FINAL_SUB[subIndex] = this.IDENTIFY_ELEMENT_DATA_FINAL.concat();
		} else if (
			Number(this.filtersArray[this.currentTemplateFilterIndex].tf_qst_id) === 8
		) {
			this.ONE_ELEMENT_DATA = [];
			this.currentSelectedTab = 'one';
			this.onedataSource = new MatTableDataSource<OneElement>(
				this.ONE_ELEMENT_DATA
			);
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
					lodTypeSub: t.dl_name,
					topicSub: t.topic_name,
					subtopicSub: t.st_name,
					suggestedMarksSub: t.qus_marks,
					negativeMarks: t.qus_negative_marks,
					referenceSub: t.qus_historical_reference,
					qusid: t.qus_id
				});
				ind++;
			}
			this.onedataSource = new MatTableDataSource<OneElement>(
				this.ONE_ELEMENT_DATA
			);
			this.lengthArrayOne[value] = this.ONE_ELEMENT_DATA.length;
			this.oneDataSourceArray[value] = this.onedataSource;
			this.oneDataSourceArray[value].paginator = this.paginator8;
			this.sort8.sortChange.subscribe(() => (this.paginator8.pageIndex = 0));
			this.oneDataSourceArray[value].sort = this.sort8;
			this.ONE_ELEMENT_DATA_FINAL[value] = {
				id: this.ONE_ELEMENT_DATA,
				index: value,
				subIndex: subIndex
			};
			this.ONE_ELEMENT_DATA_FINAL_SUB[subIndex] = this.ONE_ELEMENT_DATA_FINAL.concat();
		} else if (
			Number(this.filtersArray[this.currentTemplateFilterIndex].tf_qst_id) === 9
		) {
			this.VERYSHORT_ELEMENT_DATA = [];
			this.currentSelectedTab = 'very short';
			this.veryshortdataSource = new MatTableDataSource<VeryShortElement>(
				this.VERYSHORT_ELEMENT_DATA
			);
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
					lodTypeSub: t.dl_name,
					topicSub: t.topic_name,
					subtopicSub: t.st_name,
					suggestedMarksSub: t.qus_marks,
					negativeMarks: t.qus_negative_marks,
					referenceSub: t.qus_historical_reference,
					qusid: t.qus_id
				});
				ind++;
			}
			this.veryshortdataSource = new MatTableDataSource<VeryShortElement>(
				this.VERYSHORT_ELEMENT_DATA
			);

			this.lengthArrayVeryShort[value] = this.VERYSHORT_ELEMENT_DATA.length;
			this.veryshortdataSourceArray[value] = this.veryshortdataSource;
			this.veryshortdataSourceArray[value].paginator = this.paginator9;
			this.sort9.sortChange.subscribe(() => (this.paginator9.pageIndex = 0));
			this.veryshortdataSourceArray[value].sort = this.sort9;
			this.VERYSHORT_ELEMENT_DAT_FINAL[value] = {
				id: this.VERYSHORT_ELEMENT_DATA,
				index: value,
				subIndex: subIndex
			};
			this.VERYSHORT_ELEMENT_DAT_FINAL_SUB[subIndex] = this.VERYSHORT_ELEMENT_DAT_FINAL.concat();
		} else if (
			Number(this.filtersArray[this.currentTemplateFilterIndex].tf_qst_id) ===
			10
		) {
			this.SHORT_ELEMENT_DATA = [];
			this.currentSelectedTab = 'short';
			this.shortdataSource = new MatTableDataSource<ShortElement>(
				this.SHORT_ELEMENT_DATA
			);
			this.paginator10.pageIndex = 0;
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
					lodTypeSub: t.dl_name,
					topicSub: t.topic_name,
					subtopicSub: t.st_name,
					suggestedMarksSub: t.qus_marks,
					negativeMarks: t.qus_negative_marks,
					referenceSub: t.qus_historical_reference,
					qusid: t.qus_id
				});
				ind++;
			}
			this.shortdataSource = new MatTableDataSource<ShortElement>(
				this.SHORT_ELEMENT_DATA
			);

			this.lengthArrayShort[value] = this.SHORT_ELEMENT_DATA.length;
			this.shortdataSourceArray[value] = this.shortdataSource;
			this.shortdataSourceArray[value].paginator = this.paginator10;
			this.sort10.sortChange.subscribe(() => (this.paginator10.pageIndex = 0));
			this.shortdataSourceArray[value].sort = this.sort10;
			this.SHORT_ELEMENT_DATA_FINAL[value] = {
				id: this.SHORT_ELEMENT_DATA,
				index: value,
				subIndex: subIndex
			};
			this.SHORT_ELEMENT_DATA_FINAL_SUB[subIndex] = this.SHORT_ELEMENT_DATA_FINAL.concat();
		} else if (
			Number(this.filtersArray[this.currentTemplateFilterIndex].tf_qst_id) ===
			11
		) {
			this.LONG_ELEMENT_DATA = [];
			this.currentSelectedTab = 'long';
			this.longdataSource = new MatTableDataSource<LongElement>(
				this.LONG_ELEMENT_DATA
			);
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
					lodTypeSub: t.dl_name,
					topicSub: t.topic_name,
					subtopicSub: t.st_name,
					suggestedMarksSub: t.qus_marks,
					negativeMarks: t.qus_negative_marks,
					referenceSub: t.qus_historical_reference,
					qusid: t.qus_id
				});
				ind++;
			}
			this.longdataSource = new MatTableDataSource<LongElement>(
				this.LONG_ELEMENT_DATA
			);

			this.lengthArrayLong[value] = this.LONG_ELEMENT_DATA.length;
			this.longdataSourceArray[value] = this.longdataSource;
			this.longdataSourceArray[value].paginator = this.paginator11;
			this.sort11.sortChange.subscribe(() => (this.paginator11.pageIndex = 0));
			this.longdataSourceArray[value].sort = this.sort11;
			this.LONG_ELEMENT_DATA_FINAL[value] = {
				id: this.LONG_ELEMENT_DATA,
				index: value,
				subIndex: subIndex
			};
			this.LONG_ELEMENT_DATA_FINAL_SUB[subIndex] = this.LONG_ELEMENT_DATA_FINAL.concat();
		} else if (
			Number(this.filtersArray[this.currentTemplateFilterIndex].tf_qst_id) ===
			12
		) {
			this.VERYLONG_ELEMENT_DATA = [];
			this.currentSelectedTab = 'verylong';
			this.verylongdataSource = new MatTableDataSource<VeryLongElement>(
				this.VERYLONG_ELEMENT_DATA
			);
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
					lodTypeSub: t.dl_name,
					topicSub: t.topic_name,
					subtopicSub: t.st_name,
					suggestedMarksSub: t.qus_marks,
					negativeMarks: t.qus_negative_marks,
					referenceSub: t.qus_historical_reference,
					qusid: t.qus_id
				});
				ind++;
			}
			this.verylongdataSource = new MatTableDataSource<VeryLongElement>(
				this.VERYLONG_ELEMENT_DATA
			);
			this.lengthArrayVeryLong[value] = this.VERYLONG_ELEMENT_DATA.length;
			this.verylongdataSourceArray[value] = this.verylongdataSource;
			this.verylongdataSourceArray[value].paginator = this.paginator12;
			this.sort12.sortChange.subscribe(() => (this.paginator12.pageIndex = 0));
			this.verylongdataSourceArray[value].sort = this.sort12;
			this.VERYLONG_ELEMENT_DATA_FINAL[value] = {
				id: this.VERYLONG_ELEMENT_DATA,
				index: value,
				subIndex: subIndex
			};
			this.VERYLONG_ELEMENT_DATA_FINAL_SUB[subIndex] = this.VERYLONG_ELEMENT_DATA_FINAL.concat();
		}
		if (
			Number(this.filtersArray[this.currentTemplateFilterIndex].tf_qt_id) === 3
		) {
			this.ESSAYQUESTION_ELEMENT_DATA = [];
			this.essayquestionDatasource = new MatTableDataSource<
				ESSAYQUESTIONElement
				>(this.ESSAYQUESTION_ELEMENT_DATA);
			this.currentSelectedTab = 'essay';
			const optionsArray: any[] = [];
			const hoverArray: any[] = [];

			this.questionsOfEachEssayFilerArray = [];
			this.questionsOfEachEssayFilerArray = this.questionsOfEachSelectedSubArray[subIndex][value];
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
					select: ind - 1,
					showHover: hoverArray[ind - 1],
					negativeMarks: t.qus_negative_marks,
					qusid: t.qus_id,
					lodType: t.dl_name,
					tf_id: t.tf_id
				});
				ind++;
			}
			this.essayquestionDatasource = new MatTableDataSource<ESSAYQUESTIONElement>(this.ESSAYQUESTION_ELEMENT_DATA);
			this.essayquestionDatasource.paginator = this.paginator15;
			this.sort15.sortChange.subscribe(() => (this.paginator15.pageIndex = 0));
			this.essayquestionDatasource.sort = this.sort15;
			this.ESSAYQUESTION_ELEMENT_DATA_FINAL[value] = {
				id: this.ESSAYQUESTION_ELEMENT_DATA,
				index: value,
				subIndex: subIndex
			};
			this.ESSAYQUESTION_ELEMENT_DATA_FINAL_SUB[subIndex] = this.ESSAYQUESTION_ELEMENT_DATA_FINAL.concat();
		}
	}
	saveQuestionIndex(qus_id) {
		let addFlag = true;
		if (
			this.selectedQuestionIndexArray[this.currentTemplateFilterIndex].length >
			0
		) {
			for (
				let ci = 0;
				ci <
				this.selectedQuestionIndexArray[this.currentTemplateFilterIndex].length;
				ci++
			) {
				if (
					this.selectedQuestionIndexArray[this.currentTemplateFilterIndex][
					ci
					] === qus_id
				) {
					this.selectedQuestionIndexArray[
						this.currentTemplateFilterIndex
					].splice(ci, 1);
					this.totalselectedQuestion--;
					addFlag = false;
					break;
				}
			}
			if (addFlag) {
				this.totalselectedQuestion++;
				this.selectedQuestionIndexArray[this.currentTemplateFilterIndex].push(
					qus_id
				);
			}
		} else {
			this.totalselectedQuestion++;
			this.selectedQuestionIndexArray[this.currentTemplateFilterIndex].push(
				qus_id
			);
		}
	}

	checkedQuestions(qus_id) {
		for (const item of this.selectedQuestionIndexArray[
			this.currentTemplateFilterIndex
		]) {
			if (item === qus_id) {
				return 'checked';
			}
		}
		return '';
	}

	getColormcqmr(qansa) {
		if (qansa === '1') {
			return '#6c81f7';
		} else {
			return '';
		}
	}

	getClass() {
		this.qelementService.getClass().subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.classArray = result.data;
			}
		});
	}

	getSectionsByClass(): void {
		this.qelementService
			.getSectionsByClass(this.qpspartial_form.value.qp_class_id)
			.subscribe((result: any) => {
				if (result.status === 'ok') {
					this.sectionArray = result.data;
					// this.bannerdiv = true;
				} else {
					this.sectionArray = [];
				}
			});
	}

	getSubjectsByClass(): void {
		this.qelementService
			.getSubjectsByClass(this.qpspartial_form.value.qp_class_id)
			.subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.subjectArray = result.data;
				} else {
					this.subjectArray = [];
				}
			});
	}

	getTopicByClassSubject(): void {
		if (!this.qpspartial_form.value.qp_name) {
			this.notif.showSuccessErrorMessage('Test Name is required', 'error');
		}
		if (!this.qpspartial_form.value.qp_tp_id) {
			this.notif.showSuccessErrorMessage('Template is required', 'error');
		}
		if (!this.qpspartial_form.value.qp_class_id) {
			this.notif.showSuccessErrorMessage('Class is required', 'error');
		}
		if (!this.qpspartial_form.value.qp_sec_id) {
			this.notif.showSuccessErrorMessage('Section is required', 'error');
		}
		if (!this.qpspartial_form.value.qp_sub_id) {
			this.notif.showSuccessErrorMessage('Subject is required', 'error');
		}
		// this.stitems=[];
		// this.templates=[];
		// this.templateStarray=[];
		// this.showTopicSubTopicTable = false;
		// this.noRecordDiv = true;
		this.qelementService.getTopicByClassSubject(this.qpspartial_form.value.qp_class_id, this.qpspartial_form2.value.qp_ssub_id).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.topicArray = result.data;
				}
				this.filterarea = true;
			});
	}

	getSubtopicByTopic(): void {
		this.subtopicArray = [];
		this.qelementService
			.getSubtopicByTopic(this.qpspartial_form2.value.qp_topic_id)
			.subscribe((result: any) => {
				if (result && result.status === 'ok') {
					this.subtopicArray = result.data;
					for (const item of this.topicArray) {
						this.currSelectedTemplateTopic = item.topic_name;
					}
					for (const item of this.subtopicArray) {
						this.currSelectedTemplateSubtopic = item.st_name;
					}
				}
			});
	}
	getCurrentTemplate(value): void {
		this.templateArray.filter(item => {
			if (value === item.tp_id) {
				this.printTemplate = item;
			}
		});
		this.classArray.filter(item => {
			if (value === item.class_id) {
				this.currSelectedTemplateClass = item.class_name;
			}
		});
		this.sectionArray.filter(item => {
			if (value === item.sec_id) {
				this.currSelectedTemplateSection = item.sec_name;
			}
		});
		this.subjectArray.filter(item => {
			if (value === item.sub_id) {
				this.currSelectedTemplateSubject = item.sub_name;
			}
		});
	}
	getTotal(i1, i2) {
		return Number(i1) * Number(i2);
	}
	applybtn() {
		// Logic for form validation
		if (!this.qpspartial_form2.value.qp_topic_id) {
			this.notif.showSuccessErrorMessage('Topic is required', 'error');
		}
		if (!this.qpspartial_form2.value.qp_st_id) {
			this.notif.showSuccessErrorMessage('Sub-Topic is required', 'error');
		}
		if (!this.ELEMENT_DATA[0]) {
			this.notif.showSuccessErrorMessage('Please add to the list', 'error');
			this.selectQuestion = false;
			this.filterarea = true;
			this.selectParameter = true;
		} else {
			this.selectQuestion = true;
			this.filterarea = false;
			this.selectParameter = false;
			this.questionsArray = [];
			this.getFilters(this.qpspartial_form.value.qp_tp_id);
			this.bannerdiv = true;
		}
	}

	reviewQuestion() {
		this.sum = 0;
		this.reviewQuestionArray = [];
		this.REVIEW_ELEMENT_DATA = [];
		let m = 0;
		this.reviewdatasource = new MatTableDataSource<ReviewElement>(
			this.REVIEW_ELEMENT_DATA
		);
		this.qpq_qus_position = 0;
		this.selectParameter = false;
		this.filterarea = false;
		this.selectQuestion = false;
		this.questionReviewDiv = true;
		this.total = 0;
		if (this.qpspartial_form.valid) {
			/* if(this.mcqSelectedQuestion.length>0) {
        this.mcqSelectedQuestion.forEach(element => {
          let titem = this.questionsOfEachSelectedSubArray[element.subIndex][element.index][element.id];
          console.log(titem);
          this.reviewQuestionArray.push({
            qus_name: titem.qus_name,
            //qpq_qus_position: titem.position,
            options: titem.options,
            topic_name: titem.topic_name,
            st_name: titem.st_name,
            skill_name: titem.skill_name,
            qus_marks: titem.qus_marks,
            qus_negative_marks: titem.qus_negative_marks,
            dl_name: titem.dl_name,
            qus_id: titem.qus_id
          });
        })
        console.log('reviewQuestionArray');
        console.log(this.reviewQuestionArray);
      } */
			if (this.mcqSelectedQuestion.length !== 0) {
				for (const MCQ_ELEMENT_DATA_FINAL of this.MCQ_ELEMENT_DATA_FINAL_SUB) {
					for (const item of MCQ_ELEMENT_DATA_FINAL) {
						if (item) {
							for (const titem of item.id) {
								for (const itemMcq of this.mcqSelectedQuestion) {
									if (
										itemMcq.id === titem.select &&
										itemMcq.index === item.index &&
										itemMcq.subIndex === item.subIndex
									) {
										this.reviewQuestionArray.push({
											qus_name: titem.question,
											qpq_qus_position: titem.position,
											options: titem.options,
											topic_name: titem.topic,
											st_name: titem.subtopic,
											skill_name: titem.skillType,
											qus_marks: titem.suggestedMarks,
											qus_negative_marks: titem.negativeMarks,
											dl_name: titem.lodType,
											qus_id: titem.qusid
										});
									} else {
										continue;
									}
								}
							}
						}
					}
				}
			}

			if (this.mcqmrSelectedQuestion.length !== 0) {
				for (const MULTI_MCQ_ELEMENT_DATA_FINAL of this.MULTI_MCQ_ELEMENT_DATA_FINAL_SUB) {
					for (const item of MULTI_MCQ_ELEMENT_DATA_FINAL) {
						if (item) {
							for (const titem of item.id) {
								for (const itemMcqMr of this.mcqmrSelectedQuestion) {
									if (
										itemMcqMr.id === titem.selectMulti &&
										itemMcqMr.index === item.index &&
										itemMcqMr.subIndex === item.subIndex
									) {
										this.reviewQuestionArray.push({
											qus_name: titem.questionMulti,
											qpq_qus_position: titem.positionMulti,
											options: titem.optionsMulti,
											topic_name: titem.topicMulti,
											st_name: titem.subtopicMulti,
											skill_name: titem.skillTypeMulti,
											qus_marks: titem.suggestedMarksMulti,
											qus_negative_marks: titem.negativeMarks,
											dl_name: titem.lodMulti,
											qus_id: titem.qusid
										});
									} else {
										continue;
									}
								}
							}
						}
					}
				}
			}

			if (this.tfSelectedQuestion.length !== 0) {
				for (const TF_ELEMENT_DATA_FINAL of this.TF_ELEMENT_DATA_FINAL_SUB) {
					for (const item of TF_ELEMENT_DATA_FINAL) {
						if (item) {
							for (const titem of item.id) {
								for (const itemTf of this.tfSelectedQuestion) {
									if (
										itemTf.id === titem.selectTF &&
										itemTf.index === item.index &&
										itemTf.subIndex === item.subIndex
									) {
										this.reviewQuestionArray.push({
											qus_name: titem.questionTF,
											qpq_qus_position: titem.positionTF,
											options: titem.optionsTF,
											topic_name: titem.topicTF,
											st_name: titem.subtopicTF,
											skill_name: titem.skillTypeTF,
											qus_marks: titem.suggestedMarksTF,
											qus_negative_marks: titem.negativeMarks,
											dl_name: titem.lodTF,
											qus_id: titem.qusid
										});
									} else {
										continue;
									}
								}
							}
						}
					}
				}
			}

			if (this.mtfSelectedQuestion.length !== 0) {
				for (const MATCH_ELEMENT_DATA_FINAL of this.MATCH_ELEMENT_DATA_FINAL_SUB) {
					for (const item of MATCH_ELEMENT_DATA_FINAL) {
						if (item) {
							for (const titem of item.id) {
								for (const itemMatch of this.mtfSelectedQuestion) {
									if (
										itemMatch.id === titem.selectMatch &&
										itemMatch.index === item.index &&
										itemMatch.subIndex === item.subIndex
									) {
										this.reviewQuestionArray.push({
											qus_name: titem.questionMatch,
											qpq_qus_position: titem.positionMatch,
											options: titem.optionsMatch,
											topic_name: titem.topicMatch,
											st_name: titem.subtopicMatch,
											skill_name: titem.skillTypeMatch,
											qus_marks: titem.suggestedMarksMatch,
											qus_negative_marks: titem.negativeMarks,
											dl_name: titem.lodTypeMatch,
											qus_id: titem.qusid
										});
									} else {
										continue;
									}
								}
							}
						}
					}
				}
			}

			if (this.matrixSelectedQuestion.length !== 0) {
				for (const MATRIX_MATCH_ELEMENT_FINAL of this.MATRIX_MATCH_ELEMENT_FINAL_SUB) {
					for (const item of MATRIX_MATCH_ELEMENT_FINAL) {
						if (item) {
							for (const titem of item.id) {
								for (const itemMatrix of this.matrixSelectedQuestion) {
									if (
										itemMatrix.id === titem.selectMatrixMatch &&
										itemMatrix.index === item.index &&
										itemMatrix.subIndex === item.subIndex
									) {
										this.reviewQuestionArray.push({
											qus_name: titem.questionMatrixMatch,
											qpq_qus_position: titem.positionMatrixMatch,
											options: titem.optionsMatrixMatch,
											topic_name: titem.topicMatrixMatch,
											st_name: titem.subtopicMatrixMatch,
											skill_name: titem.skillTypeMatrixMatch,
											qus_marks: titem.suggestedMarksMatrixMatch,
											qus_negative_marks: titem.negativeMarks,
											dl_name: titem.lodTypeMatrixMatch,
											qus_id: titem.qusid
										});
									} else {
										continue;
									}
								}
							}
						}
					}
				}
			}

			// Matrix 45
			if (this.matrix45SelectedQuestion.length !== 0) {
				for (const MATRIX_MATCH_ELEMENT_FINAL_45 of this.MATRIX_MATCH_ELEMENT_FINAL_45_SUB) {
					for (const item of MATRIX_MATCH_ELEMENT_FINAL_45) {
						if (item) {
							for (const titem of item.id) {
								for (const itemMatrix45 of this.matrix45SelectedQuestion) {
									if (
										itemMatrix45.id === titem.selectMatrixMatch &&
										itemMatrix45.index === item.index &&
										itemMatrix45.subIndex === item.subIndex
									) {
										this.reviewQuestionArray.push({
											qus_name: titem.questionMatrixMatch,
											qpq_qus_position: titem.positionMatrixMatch,
											options: titem.optionsMatrixMatch,
											topic_name: titem.topicMatrixMatch,
											st_name: titem.subtopicMatrixMatch,
											skill_name: titem.skillTypeMatrixMatch,
											qus_marks: titem.suggestedMarksMatrixMatch,
											qus_negative_marks: titem.negativeMarks,
											dl_name: titem.lodTypeMatrixMatch,
											qus_id: titem.qusid
										});
									} else {
										continue;
									}
								}
							}
						}
					}
				}
			}
			// End

			// Single Integer
			if (this.singleIntegerSelectedQuestion.length !== 0) {
				for (const SINGLE_ELEMENT_DATA_FINAL of this.SINGLE_ELEMENT_DATA_FINAL_SUB) {
					for (const item of SINGLE_ELEMENT_DATA_FINAL) {
						if (item) {
							for (const titem of item.id) {
								for (const itemSingle of this.singleIntegerSelectedQuestion) {
									if (
										itemSingle.id === titem.select &&
										itemSingle.index === item.index &&
										itemSingle.subIndex === item.subIndex
									) {
										this.reviewQuestionArray.push({
											qus_name: titem.question,
											qpq_qus_position: titem.position,
											qopt_answer: titem.answerTemp,
											topic_name: titem.topic,
											st_name: titem.subtopic,
											skill_name: titem.skillType,
											qus_marks: titem.suggestedMarks,
											qus_negative_marks: titem.negativeMarks,
											dl_name: titem.lodType,
											qus_id: titem.qusid,
											qus_qst_id: titem.qus_qst_id,
										});
									} else {
										continue;
									}
								}
							}
						}
					}
				}
			}
			// End

			// Single Integer
			if (this.doubleIntegerSelectedQuestion.length !== 0) {
				for (const DOUBLE_ELEMENT_DATA_FINAL of this.DOUBLE_ELEMENT_DATA_FINAL_SUB) {
					for (const item of DOUBLE_ELEMENT_DATA_FINAL) {
						if (item) {
							for (const titem of item.id) {
								for (const itemDouble of this.doubleIntegerSelectedQuestion) {
									if (
										itemDouble.id === titem.select &&
										itemDouble.index === item.index &&
										itemDouble.subIndex === item.subIndex
									) {
										this.reviewQuestionArray.push({
											qus_name: titem.question,
											qpq_qus_position: titem.position,
											qopt_answer: titem.answerTemp,
											topic_name: titem.topic,
											st_name: titem.subtopic,
											skill_name: titem.skillType,
											qus_marks: titem.suggestedMarks,
											qus_negative_marks: titem.negativeMarks,
											dl_name: titem.lodType,
											qus_id: titem.qusid,
											qus_qst_id: titem.qus_qst_id,
										});
									} else {
										continue;
									}
								}
							}
						}
					}
				}
			}
			// End

			if (this.fillSelectedQuestion.length !== 0) {
				const i = 0;
				for (const FILL_ELEMENT_DATA_FINAL of this.FILL_ELEMENT_DATA_FINAL_SUB) {
					for (const item of FILL_ELEMENT_DATA_FINAL) {
						if (item) {
							for (const titem of item.id) {
								for (const itemFill of this.fillSelectedQuestion) {
									if (
										itemFill.id === titem.selectSub &&
										itemFill.index === item.index &&
										itemFill.subIndex === item.subIndex
									) {
										this.reviewQuestionArray.push({
											qus_name: titem.questionSub,
											qpq_qus_position: titem.positionSub,
											qopt_answer: titem.answerSub,
											topic_name: titem.topicSub,
											st_name: titem.subtopicSub,
											skill_name: titem.skillTypeSub,
											qus_marks: titem.suggestedMarksSub,
											qus_negative_marks: titem.negativeMarks,
											dl_name: titem.lodTypeSub,
											qus_id: titem.qusid
										});
									} else {
										continue;
									}
								}
							}
						}
					}
				}
			}

			if (this.identifySelectedQuestion.length !== 0) {
				for (const IDENTIFY_ELEMENT_DATA_FINAL of this.IDENTIFY_ELEMENT_DATA_FINAL_SUB) {
					for (const item of IDENTIFY_ELEMENT_DATA_FINAL) {
						if (item) {
							for (const titem of item.id) {
								for (const itemIden of this.identifySelectedQuestion) {
									if (
										itemIden.id === titem.selectSub &&
										itemIden.index === item.index &&
										itemIden.subIndex === item.subIndex
									) {
										this.reviewQuestionArray.push({
											qus_name: titem.questionSub,
											qpq_qus_position: titem.positionSub,
											qopt_answer: titem.answerSub,
											topic_name: titem.topicSub,
											st_name: titem.subtopicSub,
											skill_name: titem.skillTypeSub,
											qus_marks: titem.suggestedMarksSub,
											qus_negative_marks: titem.negativeMarks,
											dl_name: titem.lodTypeSub,
											qus_id: titem.qusid
										});
									} else {
										continue;
									}
								}
							}
						}
					}
				}
			}

			if (this.oneSelectedQuestion.length !== 0) {
				for (const ONE_ELEMENT_DATA_FINAL of this.ONE_ELEMENT_DATA_FINAL_SUB) {
					for (const item of ONE_ELEMENT_DATA_FINAL) {
						if (item) {
							for (const titem of item.id) {
								for (const itemOne of this.oneSelectedQuestion) {
									if (
										itemOne.id === titem.selectSub &&
										itemOne.index === item.index &&
										itemOne.subIndex === item.subIndex
									) {
										this.reviewQuestionArray.push({
											qus_name: titem.questionSub,
											qpq_qus_position: titem.positionSub,
											qopt_answer: titem.answerSub,
											topic_name: titem.topicSub,
											st_name: titem.subtopicSub,
											skill_name: titem.skillTypeSub,
											qus_marks: titem.suggestedMarksSub,
											qus_negative_marks: titem.negativeMarks,
											dl_name: titem.lodTypeSub,
											qus_id: titem.qusid
										});
									} else {
										continue;
									}
								}
							}
						}
					}
				}
			}

			if (this.shortSelectedQuestion.length !== 0) {
				for (const SHORT_ELEMENT_DATA_FINAL of this.SHORT_ELEMENT_DATA_FINAL_SUB) {
					for (const item of SHORT_ELEMENT_DATA_FINAL) {
						if (item) {
							for (const titem of item.id) {
								for (const itemShort of this.shortSelectedQuestion) {
									if (
										itemShort.id === titem.selectSub &&
										itemShort.index === item.index &&
										itemShort.subIndex === item.subIndex
									) {
										this.reviewQuestionArray.push({
											qus_name: titem.questionSub,
											qpq_qus_position: titem.positionSub,
											qopt_answer: titem.answerSub,
											topic_name: titem.topicSub,
											st_name: titem.subtopicSub,
											skill_name: titem.skillTypeSub,
											qus_marks: titem.suggestedMarksSub,
											qus_negative_marks: titem.negativeMarks,
											dl_name: titem.lodTypeSub,
											qus_id: titem.qusid
										});
									} else {
										continue;
									}
								}
							}
						}
					}
				}
			}

			if (this.veryshortSelectedQuestion.length !== 0) {
				for (const VERYSHORT_ELEMENT_DAT_FINAL of this.VERYSHORT_ELEMENT_DAT_FINAL_SUB) {
					for (const item of VERYSHORT_ELEMENT_DAT_FINAL) {
						if (item) {
							for (const titem of item.id) {
								for (const itemVeryShort of this.veryshortSelectedQuestion) {
									if (
										itemVeryShort.id === titem.selectSub &&
										itemVeryShort.index === item.index &&
										itemVeryShort.subIndex === item.subIndex
									) {
										this.reviewQuestionArray.push({
											qus_name: titem.questionSub,
											qpq_qus_position: titem.positionSub,
											qopt_answer: titem.answerSub,
											topic_name: titem.topicSub,
											st_name: titem.subtopicSub,
											skill_name: titem.skillTypeSub,
											qus_marks: titem.suggestedMarksSub,
											qus_negative_marks: titem.negativeMarks,
											dl_name: titem.lodTypeSub,
											qus_id: titem.qusid
										});
									} else {
										continue;
									}
								}
							}
						}
					}
				}
			}

			if (this.verylongSelectedQuestion.length !== 0) {
				for (const VERYLONG_ELEMENT_DATA_FINAL of this.VERYLONG_ELEMENT_DATA_FINAL_SUB) {
					for (const item of VERYLONG_ELEMENT_DATA_FINAL) {
						if (item) {
							for (const titem of item.id) {
								for (const itemVeryLong of this.verylongSelectedQuestion) {
									if (
										itemVeryLong.id === titem.selectSub &&
										itemVeryLong.index === item.index &&
										itemVeryLong.subIndex === item.subIndex
									) {
										this.reviewQuestionArray.push({
											qus_name: titem.questionSub,
											qpq_qus_position: titem.positionSub,
											qopt_answer: titem.answerSub,
											topic_name: titem.topicSub,
											st_name: titem.subtopicSub,
											skill_name: titem.skillTypeSub,
											qus_marks: titem.suggestedMarksSub,
											qus_negative_marks: titem.negativeMarks,
											dl_name: titem.lodTypeSub,
											qus_id: titem.qusid
										});
									} else {
										continue;
									}
								}
							}
						}
					}
				}
			}

			if (this.longSelectedQuestion.length !== 0) {
				for (const LONG_ELEMENT_DATA_FINAL of this.LONG_ELEMENT_DATA_FINAL_SUB) {
					for (const item of LONG_ELEMENT_DATA_FINAL) {
						if (item) {
							for (const titem of item.id) {
								for (const itemLong of this.longSelectedQuestion) {
									if (
										itemLong.id === titem.selectSub &&
										itemLong.index === item.index &&
										itemLong.subIndex === item.subIndex
									) {
										this.reviewQuestionArray.push({
											qus_name: titem.questionSub,
											qpq_qus_position: titem.positionSub,
											qopt_answer: titem.answerSub,
											topic_name: titem.topicSub,
											st_name: titem.subtopicSub,
											skill_name: titem.skillTypeSub,
											qus_marks: titem.suggestedMarksSub,
											qus_negative_marks: titem.negativeMarks,
											dl_name: titem.lodTypeSub,
											qus_id: titem.qusid
										});
									} else {
										continue;
									}
								}
							}
						}
					}
				}
			}
			for (const filter of this.filtersArray) {
				if (filter.tf_qt_id === 3) {
					/* for (let item of this.ESSAYQUESTION_ELEMENT_DATA) {
            if (this.essaySelectedQuestion[m] == item.select) {
              this.reviewQuestionArray.push({
                qus_name: item.question,
                qpq_qus_position: item.position,
                options: item.options,
                tf_id: item.tf_id,
                topic_name: item.topic,
                st_name: item.subtopic,
                skill_name: item.skillType,
                qus_marks: item.suggestedMarks,
                qus_negative_marks: item.negativeMarks,
                dl_name: item.lodType,
                qus_id: item.qusid
              });
              m++;
            } else {
              continue;
            }
          } */
					for (const ESSAYQUESTION_ELEMENT_DATA_FINAL of this.ESSAYQUESTION_ELEMENT_DATA_FINAL_SUB) {
						for (const item of ESSAYQUESTION_ELEMENT_DATA_FINAL) {
							if (item) {
								for (const titem of item.id) {
									for (const itemLong of this.essaySelectedQuestion) {
										if (
											itemLong.id === titem.select &&
											itemLong.subIndex === item.subIndex
										) {
											this.reviewQuestionArray.push({
												qus_name: titem.question,
												qpq_qus_position: titem.position,
												options: titem.options,
												tf_id: titem.tf_id,
												topic_name: titem.topic,
												st_name: titem.subtopic,
												skill_name: titem.skillType,
												qus_marks: titem.suggestedMarks,
												qus_negative_marks: titem.negativeMarks,
												dl_name: titem.lodType,
												qus_id: titem.qusid
											});
											m++;
										} else {
											continue;
										}
									}
								}
							}
						}
					}
				}
			}
		}
		let startIndex = 1;
		for (const review of this.reviewQuestionArray) {
			if (review.options) {
				this.REVIEW_ELEMENT_DATA.push({
					position: startIndex,
					question: review.qus_name,
					answer: review.options,
					topic: review.topic_name,
					subtopic: review.st_name,
					lod: review.dl_name,
					skill: review.skill_name,
					marks: review.qus_marks,
					negativeMarks: review.qus_negative_marks,
					action: review,
					qpq_qus_id: review.qus_id
				});
				startIndex++;
			} else {
				if (Number(review.qus_qst_id) === 14) {
					this.REVIEW_ELEMENT_DATA.push({
						position: startIndex,
						question: review.qus_name,
						// tslint:disable-next-line:max-line-length
						answer: '<button mat-icon style=\'border-radius:50% !important;border:none !important;color:white;font-weight:bold !important;color:white !important;color:white;background-color:#6c65c8 !important;height:40px !important;width:40px !important\'>'
							+ review.qopt_answer + '</button>',
						topic: review.topic_name,
						subtopic: review.st_name,
						lod: review.dl_name,
						skill: review.skill_name,
						marks: review.qus_marks,
						negativeMarks: review.qus_negative_marks,
						action: review,
						qpq_qus_id: review.qus_id
					});
				} else if (Number(review.qus_qst_id) === 15) {
					this.REVIEW_ELEMENT_DATA.push({
						position: startIndex,
						question: review.qus_name,
						// tslint:disable-next-line:max-line-length
						answer: '<button mat-icon style=\'border-radius:50% !important;border:none !important;color:white;font-weight:bold !important;color:white !important;color:white;background-color:#6c65c8 !important;height:40px !important;width:40px !important\'>'
							+ review.qopt_answer.charAt(0) + '</button>' +
							// tslint:disable-next-line:max-line-length
							'<button mat-icon style=\'border-radius:50% !important;border:none !important;color:white;font-weight:bold !important;color:white !important;color:white;background-color:#6c65c8 !important;height:40px !important;width:40px !important\'>'
							+ review.qopt_answer.charAt(1) + '</button>',
						topic: review.topic_name,
						subtopic: review.st_name,
						lod: review.dl_name,
						skill: review.skill_name,
						marks: review.qus_marks,
						negativeMarks: review.qus_negative_marks,
						action: review,
						qpq_qus_id: review.qus_id
					});
				} else {
					this.REVIEW_ELEMENT_DATA.push({
						position: startIndex,
						question: review.qus_name,
						answer: review.qopt_answer,
						topic: review.topic_name,
						subtopic: review.st_name,
						lod: review.dl_name,
						skill: review.skill_name,
						marks: review.qus_marks,
						negativeMarks: review.qus_negative_marks,
						action: review,
						qpq_qus_id: review.qus_id
					});

				}
				startIndex++;
			}
		}
		this.reviewdatasource = new MatTableDataSource<ReviewElement>(
			this.REVIEW_ELEMENT_DATA
		);
		this.reviewdatasource.paginator = this.paginator13;
		this.sort13.sortChange.subscribe(() => (this.paginator13.pageIndex = 0));
		this.reviewdatasource.sort = this.sort13;
		let v = 0;
		for (const item of this.REVIEW_ELEMENT_DATA) {
			this.total =
				Number(this.total) + Number(this.REVIEW_ELEMENT_DATA[v].marks);
			v++;
		}
	}

	movebackParameter() {
		this.selectParameter = true;
		this.filterarea = true;
		this.selectQuestion = false;
		this.questionReviewDiv = false;
		this.ESSAYQUESTION_ELEMENT_DATA = [];
		setTimeout(() => this.dataSource.paginator = this.paginator14);
	}

	movebackSelectQuestion() {
		this.selectParameter = false;
		this.filterarea = false;
		this.selectQuestion = true;
		this.questionReviewDiv = false;
	}

	movebackReviewQuestion() {
		this.selectParameter = false;
		this.filterarea = false;
		this.selectQuestion = false;
		this.questionReviewDiv = true;
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
		this.finalQuestionArray = [];
		this.qpq_qus_position = 0;
		// Logic for form validation
		if (!this.qpspartial_form.value.qp_name) {
			this.notif.showSuccessErrorMessage('Test Name is required', 'error');
		}
		if (!this.qpspartial_form.value.qp_tp_id) {
			this.notif.showSuccessErrorMessage('Template is required', 'error');
		}
		if (!this.qpspartial_form.value.qp_class_id) {
			this.notif.showSuccessErrorMessage('Class is required', 'error');
		}
		if (!this.qpspartial_form.value.qp_sec_id) {
			this.notif.showSuccessErrorMessage('Section is required', 'error');
		}
		if (!this.qpspartial_form.value.qp_sub_id) {
			this.notif.showSuccessErrorMessage('Subject is required', 'error');
		}
		if (!this.qpspartial_form2.value.qp_topic_id) {
			this.notif.showSuccessErrorMessage('Topic is required', 'error');
		}
		if (!this.qpspartial_form2.value.qp_st_id) {
			this.notif.showSuccessErrorMessage('Sub-Topic is required', 'error');
		}
		if (this.qpspartial_form.valid) {
			/* if(this.REVIEW_ELEMENT_DATA.length > 0){
        this.questionsOfEachTemplateFilerArray=[];
        for(let ssubi=0;ssubi < this.questionsOfEachSelectedSubArray.length;ssubi++){
          for(let mergeti=0; mergeti < this.filtersArray.length; mergeti++){
            this.questionsOfEachTemplateFilerArray[mergeti].push(this.questionsOfEachSelectedSubArray[ssubi][mergeti])
          }
        }
      }
      console.log(this.questionsOfEachTemplateFilerArray); */
			for (let ssubi = 0; ssubi < this.questionsOfEachSelectedSubArray.length; ssubi++) {
				for (let ti = 0; ti < this.questionsOfEachSelectedSubArray[ssubi].length; ti++) {
					const eachTemplateSelectedQuestion = this.REVIEW_ELEMENT_DATA;
					if (this.questionsOfEachSelectedSubArray[ssubi][ti]) {
						const eachTemplateQuestion = this.questionsOfEachSelectedSubArray[ssubi][ti];
						for (let etsi = 0; etsi < eachTemplateSelectedQuestion.length; etsi++) {
							for (const qus of eachTemplateQuestion) {
								if (qus.tf_id) {
									if (qus.qus_id === eachTemplateSelectedQuestion[etsi].qpq_qus_id) {
										this.qpq_qus_position++;
										this.finalQuestionArray.push({
											qpq_qus_position: this.qpq_qus_position,
											qpq_tf_id: qus.tf_id,
											qpq_marks: eachTemplateSelectedQuestion[etsi].marks,
											qpq_negative_marks: eachTemplateSelectedQuestion[etsi].negativeMarks,
											qpq_qus_id: qus.qus_id,
											qpq_topic_id: qus.qus_topic_id,
											qpq_st_id: qus.qus_st_id
										});
									}
								} else {
									if (qus.qus_id === eachTemplateSelectedQuestion[etsi].qpq_qus_id) {
										this.qpq_qus_position++;
										this.finalQuestionArray.push({
											qpq_qus_position: this.qpq_qus_position,
											qpq_tf_id: this.filtersArray[ti].tf_id,
											qpq_marks: eachTemplateSelectedQuestion[etsi].marks,
											qpq_negative_marks: eachTemplateSelectedQuestion[etsi].negativeMarks,
											qpq_qus_id: qus.qus_id,
											qpq_topic_id: qus.qus_topic_id,
											qpq_st_id: qus.qus_st_id
										});
									}
								}
							}
						}
					}
				}
			}
			this.qpspartial_form.controls.qp_qm_id.setValue(2);
			this.qpspartial_form.controls.qlist.setValue(this.finalQuestionArray);
			this.sum = 0;
			for (const item of this.finalQuestionArray) {
				if (item.qpq_marks) {
					this.sum = this.sum + Number(item.qpq_marks);
				}
			}

			if (this.sum === Number(this.printTemplate.tp_marks)) {
				this.qpspartial_form.value.qp_sub_id = this.qpspartial_form.value.qp_sub_id;
				this.qelementService.addQuestionPaper(this.qpspartial_form.value)
					.subscribe((result: any) => {
						if (result && result.status === 'ok') {
							this.notif.showSuccessErrorMessage(
								'Question Paper Created Successfully',
								'success'
							);
							setTimeout(() => {
								this.router.navigate(['../'], {
									relativeTo: this.route
								});
							}, 2000);
						} else {
							this.notif.showSuccessErrorMessage(
								'Submission Failed.Please review all the fields and Submit again',
								'error'
							);
						}
					});
			} else {
				this.notif.showSuccessErrorMessage(
					'Submission Failed. <br>Please select the total no of questions according to total marks of the template created',
					'error'
				);
			}
		}
	}
}



export interface ReviewElement {
	position: number;
	question: any;
	answer: any;
	skill: any;
	topic: any;
	subtopic: any;
	lod: any;
	marks: number;
	negativeMarks: number;
	action: string;
	qpq_qus_id: any;
}

export interface Element {
	topic: string;
	subtopic: string;
	position: number;
	action: string;
	subid: any;
}
export interface MCQElement {
	position: number;
	qusid: any;
	question: any;
	explanations: string;
	options: any;
	showHover: any;
	select: number;
	skillType: any;
	lodType: any;
	topic: any;
	subtopic: any;
	suggestedMarks: number;
	negativeMarks: number;
	reference: any;
	action: number;
}
export interface MultiMCQElement {
	positionMulti: number;
	actionMulti: number;
	questionMulti: any;
	explanationsMulti: string;
	optionsMulti: any;
	showHoverMulti: any;
	selectMulti: number;
	skillTypeMulti: any;
	lodMulti: any;
	topicMulti: any;
	subtopicMulti: any;
	suggestedMarksMulti: number;
	negativeMarks: number;
	referenceMulti: any;
	qusid: any;
}
export interface TFElement {
	positionTF: number;
	questionTF: any;
	actionTF: number;
	explanationsTF: string;
	optionsTF: any;
	showHoverTF: any;
	selectTF: number;
	skillTypeTF: any;
	lodTF: any;
	topicTF: any;
	subtopicTF: any;
	suggestedMarksTF: number;
	negativeMarks: number;
	referenceTF: any;
	qusid: any;
}

export interface MatchElement {
	positionMatch: number;
	actionMatch: number;
	questionMatch: any;
	explanationsMatch: string;
	optionsMatch: any;
	showHoverMatch: any;
	selectMatch: number;
	skillTypeMatch: any;
	lodTypeMatch: any;
	topicMatch: any;
	subtopicMatch: any;
	suggestedMarksMatch: number;
	negativeMarks: number;
	referenceMatch: any;
	qusid: any;
}
export interface MatrixMatchElement {
	positionMatrixMatch: number;
	questionMatrixMatch: any;
	actionMatrixMatch: number;
	explanationsMatrixMatch: string;
	optionsMatrixMatch: any;
	showHoverMatrixMatch: any;
	selectMatrixMatch: number;
	skillTypeMatrixMatch: any;
	lodTypeMatrixMatch: any;
	topicMatrixMatch: any;
	subtopicMatrixMatch: any;
	suggestedMarksMatrixMatch: number;
	negativeMarks: number;
	referenceMatrixMatch: any;
	qusid: any;
}
export interface MatrixMatch45Element {
	positionMatrixMatch: number;
	questionMatrixMatch: any;
	actionMatrixMatch: number;
	explanationsMatrixMatch: string;
	optionsMatrixMatch: any;
	showHoverMatrixMatch: any;
	selectMatrixMatch: number;
	skillTypeMatrixMatch: any;
	lodTypeMatrixMatch: any;
	topicMatrixMatch: any;
	subtopicMatrixMatch: any;
	suggestedMarksMatrixMatch: number;
	negativeMarks: number;
	referenceMatrixMatch: any;
	qusid: any;
}
export interface FillElement {
	positionSub: number;
	questionSub: any;
	actionSub: number;
	explanationsSub: string;
	answerSub: any;
	selectSub: number;
	skillTypeSub: any;
	lodTypeSub: any;
	topicSub: any;
	subtopicSub: any;
	suggestedMarksSub: number;
	negativeMarks: number;
	referenceSub: any;
	qusid: any;
}
export interface IdentifyElement {
	positionSub: number;
	questionSub: any;
	actionSub: number;
	explanationsSub: string;
	answerSub: any;
	selectSub: number;
	skillTypeSub: any;
	lodTypeSub: any;
	topicSub: any;
	subtopicSub: any;
	suggestedMarksSub: number;
	negativeMarks: number;
	referenceSub: any;
	qusid: any;
}
export interface OneElement {
	positionSub: number;
	actionSub: number;
	questionSub: any;
	explanationsSub: string;
	answerSub: any;
	selectSub: number;
	skillTypeSub: any;
	lodTypeSub: any;
	topicSub: any;
	subtopicSub: any;
	suggestedMarksSub: number;
	negativeMarks: number;
	referenceSub: any;
	qusid: any;
}
export interface VeryShortElement {
	positionSub: number;
	questionSub: any;
	actionSub: number;
	explanationsSub: string;
	answerSub: any;
	selectSub: number;
	skillTypeSub: any;
	lodTypeSub: any;
	topicSub: any;
	subtopicSub: any;
	suggestedMarksSub: number;
	negativeMarks: number;
	referenceSub: any;
	qusid: any;
}
export interface ShortElement {
	positionSub: number;
	actionSub: number;
	questionSub: any;
	explanationsSub: string;
	answerSub: any;
	selectSub: number;
	lodTypeSub: any;
	skillTypeSub: any;
	topicSub: any;
	subtopicSub: any;
	suggestedMarksSub: number;
	negativeMarks: number;
	referenceSub: any;
	qusid: any;
}
export interface LongElement {
	positionSub: number;
	questionSub: any;
	actionSub: number;
	explanationsSub: string;
	answerSub: any;
	selectSub: number;
	skillTypeSub: any;
	lodTypeSub: any;
	topicSub: any;
	subtopicSub: any;
	suggestedMarksSub: number;
	negativeMarks: number;
	referenceSub: any;
	qusid: any;
}
export interface VeryLongElement {
	positionSub: number;
	qusid: any;
	questionSub: any;
	actionSub: number;
	explanationsSub: string;
	answerSub: any;
	selectSub: number;
	skillTypeSub: any;
	lodTypeSub: any;
	topicSub: any;
	subtopicSub: any;
	suggestedMarksSub: number;
	negativeMarks: number;
	referenceSub: any;
}
export interface ESSAYQUESTIONElement {
	position: number;
	question: string;
	explanations: string;
	options: any;
	essayTitle: string;
	lodType: any;
	showHover: any;
	skillType: any;
	topic: any;
	subtopic: any;
	suggestedMarks: number;
	reference: any;
	select: number;
	negativeMarks: number;
	qusid: any;
	tf_id: any;
}

export interface SingleIntegerElement {
	position: number;
	question: any;
	action: number;
	explanations: string;
	answer: any;
	answerTemp: any;
	select: number;
	skillType: any;
	qus_qst_id: any;
	lodType: any;
	topic: any;
	subtopic: any;
	suggestedMarks: number;
	negativeMarks: number;
	reference: any;
	qusid: any;
}

export interface DoubleIntegerElement {
	position: number;
	question: any;
	action: number;
	explanations: string;
	answer: any;
	answerTemp: any;
	select: number;
	skillType: any;
	qus_qst_id: any;
	lodType: any;
	topic: any;
	subtopic: any;
	suggestedMarks: number;
	negativeMarks: number;
	reference: any;
	qusid: any;
}
