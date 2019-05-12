import { Component, OnInit, ViewChild, AfterViewInit, TemplateRef, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AcsetupService } from '../service/acsetup.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BreadCrumbService, NotificationService, UserAccessMenuService, CommonAPIService } from 'projects/axiom/src/app/_services/index';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { BoardElement, SubjectElement, ClassElement, TopicElement,
	SubTopicElement, SectionElement, QuestionTypeElement, QuestionSubTypeElement, SkillTypeElement, LODElement } from './system.model';

@Component({
	selector: 'app-systeminfo',
	templateUrl: './systeminfo.component.html',
	styleUrls: ['./systeminfo.component.css']
})

export class SysteminfoComponent implements OnInit, AfterViewInit {
	valueSystemInfo = 0;
	private formBoard: FormGroup;
	private formSection: FormGroup;
	private formSubject: FormGroup;
	private formClass: FormGroup;
	private formTopic: FormGroup;
	private formSubtopic: FormGroup;
	private formQsubtype: FormGroup;
	private formQtype: FormGroup;
	private formSkill: FormGroup;
	private formLod: FormGroup;
	modalRef: BsModalRef;
	currentsec: any[];
	private editFlag = false;
	private arrayBoard: any[] = [];
	private arraySection: any[] = [];
	private arraySubject: any[] = [];
	private arrayClass: any[] = [];
	private arrayTopic: any[] = [];
	private arraySubtopic: any[] = [];
	private arrayQsubtype: any[] = [];
	private arrayQtype: any[] = [];
	private arraySkill: any[] = [];
	private arrayLod: any[] = [];
	public role_id: any;
	public currentUser: any;
	homeUrl: string;
	format = /[0-9!@#$%^&*()_+\-=\[\]{};':'\\|,.<>\/?]/;
	format1 = /[!@#$%^&*()_+\-=\[\]{};':'\\|,.<>\/?]/;
	BOARD_ELEMENT_DATA: BoardElement[] = [];
	SECTION_ELEMENT_DATA: SectionElement[] = [];
	SUBJECT_ELEMENT_DATA: SubjectElement[] = [];
	CLASS_ELEMENT_DATA: ClassElement[] = [];
	TOPIC_ELEMENT_DATA: TopicElement[] = [];
	SUBTOPIC_ELEMENT_DATA: SubTopicElement[] = [];
	QUESTIONSUBTYPE_ELEMENT_DATA: QuestionSubTypeElement[] = [];
	QUESTIONTYPE_ELEMENT_DATA: QuestionTypeElement[] = [];
	SKILLTYPE_ELEMENT_DATA: SkillTypeElement[] = [];
	LOD_ELEMENT_DATA: LODElement[] = [];
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	boarddisplayedColumns = ['position', 'name', 'alias', 'action', 'modify'];
	sectiondisplayedColumns = ['position', 'name', 'action', 'modify'];
	subjectdisplayedColumns = ['position', 'board', 'name', 'action', 'modify'];
	classdisplayedColumns = ['position', 'name', 'section', 'board', 'subject', 'action', 'modify'];
	topicdisplayedColumns = ['position', 'board', 'class', 'subject', 'name', 'action', 'modify'];
	subtopicdisplayedColumns = ['position', 'board', 'class', 'subject', 'topic', 'name', 'action', 'modify'];
	questionsubtypedisplayedColumns = ['position', 'name', 'action', 'modify'];
	questiontypedisplayedColumns = ['position', 'name', 'quessubtype', 'action', 'modify'];
	skilltypedisplayedColumns = ['position', 'name', 'action', 'modify'];
	loddisplayedColumns = ['position', 'name', 'action', 'modify'];

	boarddataSource = new MatTableDataSource<BoardElement>(this.BOARD_ELEMENT_DATA);
	sectiondataSource = new MatTableDataSource<SectionElement>(this.SECTION_ELEMENT_DATA);
	subjectdataSource = new MatTableDataSource<SubjectElement>(this.SUBJECT_ELEMENT_DATA);
	classdataSource = new MatTableDataSource<ClassElement>(this.CLASS_ELEMENT_DATA);
	topicdataSource = new MatTableDataSource<TopicElement>(this.TOPIC_ELEMENT_DATA);
	subtopicdataSource = new MatTableDataSource<SubTopicElement>(this.SUBTOPIC_ELEMENT_DATA);
	quessubtypedataSource = new MatTableDataSource<QuestionSubTypeElement>(this.QUESTIONSUBTYPE_ELEMENT_DATA);
	questypedataSource = new MatTableDataSource<QuestionTypeElement>(this.QUESTIONTYPE_ELEMENT_DATA);
	skilltypedataSource = new MatTableDataSource<SkillTypeElement>(this.SKILLTYPE_ELEMENT_DATA);
	loddataSource = new MatTableDataSource<LODElement>(this.LOD_ELEMENT_DATA);
	@ViewChild('deleteModalRef') deleteModalRef;
	constructor(
		private fbuild: FormBuilder,
		private modalService: BsModalService,
		private acsetupService: AcsetupService,
		private userAccessMenuService: UserAccessMenuService,
		private commonAPIService: CommonAPIService,
		private notif: NotificationService, private breadCrumbService: BreadCrumbService,
	) { }

	ngOnInit() {
		this.homeUrl = this.breadCrumbService.getUrl();
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.buildForm();
	}

	ngAfterViewInit() {
		this.boarddataSource.paginator = this.paginator;
		this.boarddataSource.sort = this.sort;
		this.sectiondataSource.paginator = this.paginator;
		this.sectiondataSource.sort = this.sort;
		this.subjectdataSource.paginator = this.paginator;
		this.subjectdataSource.sort = this.sort;
		this.classdataSource.paginator = this.paginator;
		this.classdataSource.sort = this.sort;
		this.topicdataSource.paginator = this.paginator;
		this.topicdataSource.sort = this.sort;
		this.subtopicdataSource.paginator = this.paginator;
		this.subtopicdataSource.sort = this.sort;
		this.quessubtypedataSource.paginator = this.paginator;
		this.quessubtypedataSource.sort = this.sort;
		this.questypedataSource.paginator = this.paginator;
		this.questypedataSource.sort = this.sort;
		this.skilltypedataSource.paginator = this.paginator;
		this.skilltypedataSource.sort = this.sort;
		this.loddataSource.paginator = this.paginator;
		this.loddataSource.sort = this.sort;
	}

	deleteComOk({ data, type }) {
		switch (type) {
			case 'board':
				this.deleteEntry(data, 'deleteBoard', this.getBoardALL);
				break;
			case 'section':
				this.deleteEntry(data, 'deleteSection', this.getSectionAll);
				break;
			case 'subject':
				this.deleteEntry(data, 'deleteSubject', this.getSubjectAll);
				break;
			case 'class':
				this.deleteEntry(data, 'deleteClass', this.getClassAll);
				break;
			case 'topic':
				this.deleteEntry(data, 'deleteTopic', this.getTopicAll);
				break;
			case 'subTopic':
				this.deleteEntry(data, 'deleteSubtopic', this.getSubtopicAll);
				break;
			case 'questionSubType':
				this.deleteEntry(data, 'deleteQsubtype', this.getQsubtype);
				break;
			case 'questionType':
				this.deleteEntry(data, 'deleteQtype', this.getQtype);
				break;
			case 'skill':
				this.deleteEntry(data, 'deleteSkill', this.getSkillAll);
				break;
			case 'LOD':
				this.deleteEntry(data, 'deleteLod', this.getLodAll);
				break;
		}
	}

	deleteComCancel() {
	}

	applyFilter(filterValue: string, type: string) {
		filterValue = filterValue.trim().toLowerCase();
		switch (type) {
			case 'board':
				this.boarddataSource.filter = filterValue;
				break;
			case 'section':
				this.sectiondataSource.filter = filterValue;
				break;
			case 'subject':
				this.subjectdataSource.filter = filterValue;
				break;
			case 'class':
				this.classdataSource.filter = filterValue;
				break;
			case 'topic':
				this.topicdataSource.filter = filterValue;
				break;
			case 'subTopic':
				this.subtopicdataSource.filter = filterValue;
				break;
			case 'questionSubType':
				this.quessubtypedataSource.filter = filterValue;
				break;
			case 'questionType':
				this.questypedataSource.filter = filterValue;
				break;
			case 'skill':
				this.skilltypedataSource.filter = filterValue;
				break;
			case 'LOD':
				this.loddataSource.filter = filterValue;
				break;
		}
	}

	isExistUserAccessMenu(mod_id) {
		return this.userAccessMenuService.isExistUserAccessMenu(mod_id);
	}

	buildForm() {
		this.formBoard = this.fbuild.group({
			board_id: '',
			board_name: '',
			board_alias: '',
			board_status: ''
		});
		this.formSection = this.fbuild.group({
			sec_id: '',
			sec_name: '',
			sec_status: '',
			section_id: '',
		});
		this.formSubject = this.fbuild.group({
			board_id: '',
			sub_id: '',
			sub_name: '',
			sub_status: ''
		});
		this.formClass = this.fbuild.group({
			board_id: '',
			class_id: '',
			class_name: '',
			sec_id: this.fbuild.array,
			sub_id: this.fbuild.array,
			class_status: ''
		});
		this.formTopic = this.fbuild.group({
			topic_id: '',
			board_id: '',
			class_id: '',
			sub_id: '',
			topic_name: '',
			topic_status: ''
		});
		this.formSubtopic = this.fbuild.group({
			st_id: '',
			board_id: '',
			class_id: '',
			sub_id: '',
			topic_id: '',
			st_name: '',
			st_status: ''
		});
		this.formQsubtype = this.fbuild.group({
			qst_id: '',
			qst_name: '',
			qst_status: ''
		});
		this.formQtype = this.fbuild.group({
			qt_id: '',
			qt_name: '',
			qst_id: [['']],
			qt_status: ''

		});
		this.formSkill = this.fbuild.group({
			skill_id: '',
			skill_name: '',
			skill_status: ''
		});
		this.formLod = this.fbuild.group({
			dl_id: '',
			dl_name: '',
			dl_status: ''
		});
	}

	loadSystemInfo(value): void {
		this.valueSystemInfo = parseInt(value, 10);
		this.editFlag = false;
		if (this.valueSystemInfo === 1) {
			this.getBoardALL(this);
			this.formBoard.reset();
		} else if (this.valueSystemInfo === 2) {
			this.getSectionAll(this);
			this.formSection.reset();
		} else if (this.valueSystemInfo === 3) {
			this.getBoardALL(this);
			this.getSubjectAll(this);
			this.formSubject.reset();
		} else if (this.valueSystemInfo === 4) {
			this.formClass.reset();
			this.getClassAll(this);
			this.getSection();
			this.getSubject();
		} else if (this.valueSystemInfo === 5) {
			this.formTopic.reset();
			this.getBoard();
			this.getClass();
			this.getTopicAll(this);
		} else if (this.valueSystemInfo === 6) {
			this.formSubtopic.reset();
			this.getBoard();
			this.getClass();
			this.getSubtopicAll(this);
		} else if (this.valueSystemInfo === 7) {
			this.formQsubtype.reset();
			this.getQsubtype(this);
		} else if (this.valueSystemInfo === 8) {
			this.formQtype.reset();
			this.getQtype(this);
		} else if (this.valueSystemInfo === 9) {
			this.formSkill.reset();
			this.getSkillAll(this);
		} else if (this.valueSystemInfo === 10) {
			this.formLod.reset();
			this.getLodAll(this);
		}
	}

	validateField(event) {
		const value: string = event;
		if (this.format.test(value)) {
			this.notif.showSuccessErrorMessage('Please do not enter special characters & numbers', 'error');
		}
	}

	validateSChar(event) {
		const value: string = event;
		if (this.format1.test(value)) {
			this.notif.showSuccessErrorMessage('Please do not enter special characters', 'error');
		}
	}

	addBoard() {
		/*Adding Form Validation for board dropdown */
		if (!this.formBoard.value.board_name) {
			this.notif.showSuccessErrorMessage('Board name is required', 'error');
		}
		if (!this.formBoard.value.board_alias) {
			this.notif.showSuccessErrorMessage('Alias name is required', 'error');
		}

		/* Form Validation Ends */
		if (this.formBoard.valid) {
			this.acsetupService.addBoard(this.formBoard.value)
				.subscribe(
					(result: any) => {
						if (result && result.status === 'ok') {
							this.getBoardALL(this);
							this.notif.showSuccessErrorMessage(result.data, 'success');
						}
					}
				);
			this.formBoard.patchValue({
				board_name: '',
				board_alias: ''
			});
		}
	}

	addSection(value: any) {
		/*Adding Form Validation for section dropdown*/
		if (!this.formSection.value.sec_name) {
			this.notif.showSuccessErrorMessage('Section name is required', 'error');
		}
		/* Form Validation Ends */
		if (this.formSection.valid) {
			this.acsetupService.addSection(this.formSection.value)
				.subscribe(
					(result: any) => {
						if (result && result.status === 'ok') {
							this.getSectionAll(this);
							this.notif.showSuccessErrorMessage(result.data, 'success');
						}});
						this.formSection.patchValue({sec_name: '', section_id: ''});
		}
	}

	addSubject() {
		/*Adding Form Validation for subject dropdown*/
		if (!this.formSubject.value.sub_name) {
			this.notif.showSuccessErrorMessage('Subject name is required', 'error');
		}
		if (!this.formSubject.value.board_id) {
			this.notif.showSuccessErrorMessage('Board name is required', 'error');
		}
		/* Form Validation Ends */
		if (this.formSubject.valid) {
			this.acsetupService.addSubject(this.formSubject.value)
				.subscribe(
					(result: any) => {
						if (result && result.status === 'ok') {
							this.getSubjectAll(this);
							this.acsetupService.exportSubject(
								{
									board_id: this.formSubject.value.board_id,
									sub_name: this.formSubject.value.sub_name,

								}).subscribe((result2: any) => {
									if (result2 && result2.status === 'ok') {
										this.notif.showSuccessErrorMessage(result2.data, 'success');
										this.formSubject.controls.sub_name.setValue('');
									}
								});
						}
					}
				);
		}
	}

	addClass() {
		/*Adding Form Validation for Class dropdown*/
		if (!this.formClass.value.class_name) {
			this.notif.showSuccessErrorMessage('Class name is required', 'error');
		}
		if (Number(this.currentUser.role_id) === 2) {
		if (!this.formClass.value.sec_id) {
			this.notif.showSuccessErrorMessage('Section is required', 'error');
		}
	} else {
		this.formClass.value.sec_id = [];
	}
		if (!this.formClass.value.sub_id) {
			this.notif.showSuccessErrorMessage('Subject is required', 'error');
		}
		if (!this.formClass.value.board_id) {
			this.notif.showSuccessErrorMessage('Board is required', 'error');
		}
		/* Form Validation Ends */
		if (this.formClass.valid) {
			this.acsetupService.addClass(this.formClass.value)
				.subscribe(
					(result: any) => {
						if (result && result.status === 'ok') {
							this.getClassAll(this);
							this.acsetupService.exportClass(
						{
							board_id: this.formClass.value.board_id,
							class_name: this.formClass.value.class_name,
							sub_id: this.formClass.value.sub_id,
							sec_id: this.formClass.value.sec_id

						}).subscribe((result2: any) => {
								if (result2 && result2.status === 'ok') {
									this.notif.showSuccessErrorMessage(result2.data, 'success');
									this.formClass.patchValue({class_name: '', sec_id: [], sub_id: []});
								}
							});

						}
					}
				);
			}
		this.getClassAll(this);
	}

	addTopic() {
		/*Adding Form Validation for topic dropdown*/
		if (!this.formTopic.value.board_id) {
			this.notif.showSuccessErrorMessage('Board is required', 'error');
		}
		if (!this.formTopic.value.class_id) {
			this.notif.showSuccessErrorMessage('Class is required', 'error');
		}
		if (!this.formTopic.value.sub_id) {
			this.notif.showSuccessErrorMessage('Subject is required', 'error');
		}
		if (!this.formTopic.value.topic_name) {
			this.notif.showSuccessErrorMessage('Topic is required', 'error');
		}
		/* Form Validation Ends */
		if (this.formTopic.valid) {
			this.acsetupService.addTopic(this.formTopic.value).subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.getTopicAll(this);
						this.acsetupService.exportTopic(
							{
								board_id: this.formTopic.value.board_id,
								class_id: this.formTopic.value.class_id,
								sub_id: this.formTopic.value.sub_id,
								topic_name: this.formTopic.value.topic_name

							}).subscribe((result2: any) => {
								if (result2 && result2.status === 'ok') {
									this.notif.showSuccessErrorMessage(result2.data, 'success');
									this.formTopic.controls.topic_name.setValue('');
								}
							});

					}
				}
			);
		}
	}

	addSubtopic() {
		/*Adding Form Validation */
		if (!this.formSubtopic.value.board_id) {
			this.notif.showSuccessErrorMessage('Board is required', 'error');
		}
		if (!this.formSubtopic.value.class_id) {
			this.notif.showSuccessErrorMessage('Class is required', 'error');
		}
		if (!this.formSubtopic.value.sub_id) {
			this.notif.showSuccessErrorMessage('Subject is required', 'error');
		}
		if (!this.formSubtopic.value.topic_id) {
			this.notif.showSuccessErrorMessage('Topic is required', 'error');
		}
		if (!this.formSubtopic.value.st_name) {
			this.notif.showSuccessErrorMessage('Sub-topic is required', 'error');
		}
		/* Form Validation Ends */
		if (this.formSubtopic.valid) {
			this.acsetupService.addSubtopic(this.formSubtopic.value).subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.getSubtopicAll(this);
						this.acsetupService.exportSubTopic(
							{
								board_id: this.formSubtopic.value.board_id,
								class_id: this.formSubtopic.value.class_id,
								sub_id: this.formSubtopic.value.sub_id,
								topic_id: this.formSubtopic.value.topic_id,
								st_name: this.formSubtopic.value.st_name

							}).subscribe((result2: any) => {
								if (result2 && result2.status === 'ok') {
									this.notif.showSuccessErrorMessage(result2.data, 'success');
									this.formSubtopic.controls.st_name.setValue('');
								}
							});
					}
				}
			);
		}
	}

	addQsubtype() {
		/*Adding Form Validation for Question subtype dropdown*/
		if (!this.formQsubtype.value.qst_name) {
			this.notif.showSuccessErrorMessage('Question sub-type is required', 'error');
		}
		/* Form Validation Ends */
		if (this.formQsubtype.valid) {
			this.acsetupService.addQsubtype(this.formQsubtype.value)
				.subscribe(
					(result: any) => {
						if (result && result.status === 'ok') {
							this.getQsubtype(this);
							this.notif.showSuccessErrorMessage(result.data, 'success');
						}
					}
				);
			this.formQsubtype.controls.qst_name.setValue('');
		}
	}

	addQtype(value: any) {
		/*Adding Form Validation for question type dropdown*/
		if (!this.formQtype.value.qt_name) {
			this.notif.showSuccessErrorMessage('Question type is required', 'error');
		}
		/* Form Validation Ends */
		if (this.formQtype.valid) {
			this.acsetupService.addQtype(this.formQtype.value)
				.subscribe(
					(result: any) => {
						if (result && result.status === 'ok') {
							this.getQtype(this);
							this.notif.showSuccessErrorMessage(result.data, 'success');
						}
					}
				);
			this.formQtype.patchValue({qt_name: '', qst_id: ['']});
		}
	}

	addSkill() {
		/*Adding Form Validation for skill type dropdown*/
		if (!this.formSkill.value.skill_name) {
			this.notif.showSuccessErrorMessage('Skill type is required', 'error');
		}
		/* Form Validation Ends */
		if (this.formSkill.valid) {
			this.acsetupService.addSkill(this.formSkill.value)
				.subscribe(
					(result: any) => {
						if (result && result.status === 'ok') {
							this.getSkillAll(this);
							this.notif.showSuccessErrorMessage(result.data, 'success');
						}
					}
				);
			this.formSkill.controls.skill_name.setValue('');
		}
	}

	addLod() {
		/*Adding Form Validation for level of difficulty dropdown */
		if (!this.formLod.value.dl_name) {
			this.notif.showSuccessErrorMessage('Level of difficulty is required', 'error');
		}
		/* Form Validation Ends */
		if (this.formLod.valid) {
			this.acsetupService.addLod(this.formLod.value)
				.subscribe(
					(result: any) => {
						if (result && result.status === 'ok') {
							this.getLodAll(this);
							this.notif.showSuccessErrorMessage(result.data, 'success');
						}
					}
				);
			this.formLod.controls.dl_name.setValue('');
		}
	}

	// Get list of all boards active or inactive
	getBoardALL(that) {
		that.arrayBoard = [];
		that.BOARD_ELEMENT_DATA = [];
		that.acsetupService.getBoardALL().subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					that.arrayBoard = result.data;
					let ind = 1;
					for (const t of that.arrayBoard) {
						that.BOARD_ELEMENT_DATA.push({ position: ind, name: t.board_name, alias: t.board_alias, action: t });
						ind++;
						that.boarddataSource = new MatTableDataSource<BoardElement>(that.BOARD_ELEMENT_DATA);
						that.boarddataSource.paginator = that.paginator;
						that.sort.sortChange.subscribe(() => that.paginator.pageIndex = 0);
						that.boarddataSource.sort = that.sort;
					}
				}
			}
		);
	}

	// Get list of board of active
	getBoard() {
		this.acsetupService.getBoard().subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.arrayBoard = result.data;
				}
			}
		);
	}

	// Get list of Section of active or inactive
	getSectionAll(that) {
		that.arraySection = [];
		that.SECTION_ELEMENT_DATA = [];
		that.acsetupService.getSectionAll().subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					that.arraySection = result.data;
					let ind = 1;
					for (const t of that.arraySection) {
						that.SECTION_ELEMENT_DATA.push({ position: ind, name: t.sec_name, action: t });
						ind++;
						that.sectiondataSource = new MatTableDataSource<SectionElement>(that.SECTION_ELEMENT_DATA);
						that.sectiondataSource.paginator = that.paginator;
						that.sort.sortChange.subscribe(() => that.paginator.pageIndex = 0);
						that.sectiondataSource.sort = that.sort;
					}
				}
			}
		);
	}

	// Get list of Section of active
	getSection() {
		this.acsetupService.getSection().subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.arraySection = result.data;
				}
			}
		);
	}

	// Get list of subject of active or inactive
	getSubjectAll(that) {
		that.arraySubject = [];
		that.SUBJECT_ELEMENT_DATA = [];
		that.acsetupService.getSubjectAll().subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					that.arraySubject = result.data;
					let ind = 1;
					for (const t of that.arraySubject) {
						that.SUBJECT_ELEMENT_DATA.push({ position: ind, board: t.board_name , name: t.sub_name, action: t });
						ind++;
						that.subjectdataSource = new MatTableDataSource<SubjectElement>(that.SUBJECT_ELEMENT_DATA);
						that.subjectdataSource.paginator = that.paginator;
						that.sort.sortChange.subscribe(() => that.paginator.pageIndex = 0);
						that.subjectdataSource.sort = that.sort;
					}
				}
			}
		);
	}

	// Get list of subject of active
	getSubject() {
		this.acsetupService.getSubject().subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.arraySubject = result.data;
				}
			}
		);
	}

	// Get list of class of active
	getClassAll(that) {
		that.arrayClass = [];
		that.CLASS_ELEMENT_DATA = [];
		that.classdataSource = new MatTableDataSource<ClassElement>(that.CLASS_ELEMENT_DATA);
		that.acsetupService.getClassAll().subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					that.arrayClass = result.data;
					let ind = 1;

					for (const t of that.arrayClass) {
						let secName = '';
						let subName = '';
						for (const sec of t.sec_id) {
							secName = secName + sec.sec_name + ',';
						}
						for (const sub of t.sub_id) {
							subName = subName + sub.sub_name + ',';
						}
						// tslint:disable-next-line:max-line-length
						that.CLASS_ELEMENT_DATA.push({ position: ind, name: t.class_name, section: secName, board: t.board_name, subject: subName, action: t });
						ind++;
						that.classdataSource = new MatTableDataSource<ClassElement>(that.CLASS_ELEMENT_DATA);
						that.classdataSource.paginator = that.paginator;
						that.sort.sortChange.subscribe(() => that.paginator.pageIndex = 0);
						that.classdataSource.sort = that.sort;
					}
				}
			}
		);
	}

	// Get list of class of active
	getClass() {
		this.arrayClass = [];
		this.CLASS_ELEMENT_DATA = [];
		this.acsetupService.getClass().subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.arrayClass = result.data;
				}
			}
		);
	}

	// Get list of topic of active or inactive
	getTopicAll(that) {
		that.arrayTopic = [];
		that.TOPIC_ELEMENT_DATA = [];
		that.acsetupService.getTopicAll().subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					that.arrayTopic = result.data;
					let ind = 1;
					for (const t of that.arrayTopic) {
						that.TOPIC_ELEMENT_DATA.push({ position: ind, board: t.board_name,
							class: t.class_name, subject: t.sub_name, name: t.topic_name, action: t });
						ind++;
						that.topicdataSource = new MatTableDataSource<TopicElement>(that.TOPIC_ELEMENT_DATA);
						that.topicdataSource.paginator = that.paginator;
						that.sort.sortChange.subscribe(() => that.paginator.pageIndex = 0);
						that.topicdataSource.sort = that.sort;
					}
				}
			}
		);
	}

	// Get list of topic of active
	getTopic() {
		this.acsetupService.getTopic().subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.arrayTopic = result.data;
				}
			}
		);
	}

	// Get all subtopics
	getSubtopicAll(that) {
		that.arraySubtopic = [];
		that.SUBTOPIC_ELEMENT_DATA = [];
		that.acsetupService.getSubtopicAll().subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					that.arraySubtopic = result.data;
					let ind = 1;
					for (const t of that.arraySubtopic) {
						that.SUBTOPIC_ELEMENT_DATA.push({ position: ind, board: t.board_name,
							class: t.class_name, subject: t.sub_name, topic: t.topic_name, name: t.st_name, action: t });
						ind++;
						that.subtopicdataSource = new MatTableDataSource<SubTopicElement>(that.SUBTOPIC_ELEMENT_DATA);
						that.subtopicdataSource.paginator = that.paginator;
						that.sort.sortChange.subscribe(() => that.paginator.pageIndex = 0);
						that.subtopicdataSource.sort = that.sort;
					}
				}
			}
		);
	}

	getQsubtype(that) {
		that.arrayQsubtype = [];
		that.QUESTIONSUBTYPE_ELEMENT_DATA = [];
		that.acsetupService.getQsubtypeAll().subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					that.arrayQsubtype = result.data;
					let ind = 1;
					for (const t of that.arrayQsubtype) {
						that.QUESTIONSUBTYPE_ELEMENT_DATA.push({ position: ind, name: t.qst_name, action: t });
						ind++;
						that.quessubtypedataSource = new MatTableDataSource<QuestionSubTypeElement>(that.QUESTIONSUBTYPE_ELEMENT_DATA);
						that.quessubtypedataSource.paginator = that.paginator;
						that.sort.sortChange.subscribe(() => that.paginator.pageIndex = 0);
						that.quessubtypedataSource.sort = that.sort;
					}
				}
			}
		);
	}

	getQtype(that) {
		that.arrayQtype = [];
		that.QUESTIONTYPE_ELEMENT_DATA = [];
		that.commonAPIService.getQtype().subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					console.log('called in component');
					that.arrayQtype = result;
					console.log(that.arrayQtype);
					let ind = 1;
					for (const t of that.arrayQtype) {
						let quesSubName = '';

						for (const qst of t.qst_id) {
							quesSubName = quesSubName + qst.qst_name + ', ';
						}
						that.QUESTIONTYPE_ELEMENT_DATA.push({ position: ind, name: t.qt_name, quessubtype: quesSubName, action: t });
						ind++;
						that.questypedataSource = new MatTableDataSource<QuestionTypeElement>(that.QUESTIONTYPE_ELEMENT_DATA);
						that.questypedataSource.paginator = that.paginator;
						that.sort.sortChange.subscribe(() => that.paginator.pageIndex = 0);
						that.questypedataSource.sort = that.sort;
					}
				}
			}
		);
	}

	getSkillAll(that) {
		that.arraySkill = [];
		that.SKILLTYPE_ELEMENT_DATA = [];
		that.acsetupService.getSkillAll().subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					that.arraySkill = result.data;
					let ind = 1;
					for (const t of that.arraySkill) {
						that.SKILLTYPE_ELEMENT_DATA.push({ position: ind, name: t.skill_name, action: t });
						ind++;
						that.skilltypedataSource = new MatTableDataSource<SkillTypeElement>(that.SKILLTYPE_ELEMENT_DATA);
						that.skilltypedataSource.paginator = that.paginator;
						that.sort.sortChange.subscribe(() => that.paginator.pageIndex = 0);
						that.skilltypedataSource.sort = that.sort;
					}
				}
			}
		);
	}

	getLodAll(that) {
		that.arrayLod = [];
		that.LOD_ELEMENT_DATA = [];
		that.acsetupService.getLodAll().subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					that.arrayLod = result.data;
					let ind = 1;
					for (const t of that.arrayLod) {
						that.LOD_ELEMENT_DATA.push({ position: ind, name: t.dl_name, action: t });
						ind++;
						that.loddataSource = new MatTableDataSource<LODElement>(that.LOD_ELEMENT_DATA);
						that.loddataSource.paginator = that.paginator;
						that.sort.sortChange.subscribe(() => that.paginator.pageIndex = 0);
						that.loddataSource.sort = that.sort;
					}
				}
			}
		);
	}

	formeditBoard(value: any) {
		this.editFlag = true;
		this.formBoard.patchValue({board_id: value.board_id, board_name: value.board_name,
			board_alias: value.board_alias, board_status: value.board_status});
	}

	formeditSection(value: any) {
		this.editFlag = true;
		this.formSection.patchValue({sec_id: value.sec_id, sec_name: value.sec_name, sec_status: value.sec_status});
	}

	formeditSubject(value: any) {
		this.editFlag = true;
		this.formSubject.patchValue({board_id: value.board_id, sub_id: value.sub_id, sub_name: value.sub_name, sub_status: value.sub_status});
	}

	getIdArray(value: any) {
		const idArray = [];
		for (const item of value) {
			idArray.push(item.sec_id);
		}
		return idArray;
	}

	getSubIdArray(value: any) {
		const idArray = [];
		for (const item of value) {
			idArray.push(item.sub_id);
		}
		return idArray;
	}

	getSecIdArray(value: any) {
		const idArray = [];
		for (const item of value) {
			idArray.push(item.sec_id);
		}
		return idArray;
	}

	formeditClass(value: any) {
		this.editFlag = true;
		this.formClass.patchValue({class_id: value.class_id, class_name: value.class_name, sec_id: this.getSecIdArray(value.sec_id),
			sub_id: this.getSubIdArray(value.sub_id), class_status: value.class_status, board_id: value.board_id});
	}

	formeditTopic(value: any) {
		this.editFlag = true;
		this.formTopic.controls.topic_id.setValue(value.topic_id);
		this.formTopic.controls.board_id.setValue(value.board_id);
		this.formTopic.controls.class_id.setValue(value.class_id);
		this.getSubjecstByClass();
		this.formTopic.controls.sub_id.setValue(value.sub_id);
		this.formTopic.controls.topic_name.setValue(value.topic_name);
		this.formTopic.controls.topic_status.setValue(value.topic_status);
	}

	formeditSubtopic(value: any) {
		this.editFlag = true;
		this.formSubtopic.controls.st_id.setValue(value.st_id);
		this.formSubtopic.controls.board_id.setValue(value.board_id);
		this.formSubtopic.controls.class_id.setValue(value.class_id);
		this.getSubjecstByClassInSubtopic();
		this.formSubtopic.controls.sub_id.setValue(value.sub_id);
		this.getTopicByBoardClassSubject();
		this.formSubtopic.controls.topic_id.setValue(value.topic_id);
		this.formSubtopic.controls.st_name.setValue(value.st_name);
		this.formSubtopic.controls.st_status.setValue(value.st_status);
	}

	formeditQsubtype(value: any) {
		this.editFlag = true;
		this.formQsubtype.patchValue({qst_id: value.qst_id, qst_name: value.qst_name, qst_status: value.qst_status });
	}

	formeditQtype(value: any) {
		this.editFlag = true;
		this.formQtype.patchValue({qt_id: value.qt_id, qt_name: value.qt_name,
			qst_id: this.getIdArray(value.qst_id), qt_status: value.qt_status});
	}

	formeditSkill(value: any) {
		this.editFlag = true;
		this.formSkill.patchValue({skill_id: value.skill_id, skill_name: value.skill_name, skill_status: value.skill_status });
	}

	formeditLod(value: any) {
		this.editFlag = true;
		this.formLod.patchValue({dl_id: value.dl_id, dl_name: value.dl_name, dl_status: value.dl_status});
	}

	editBoard(value: any) {
		/* Form Validation */
		if (!this.formBoard.value.board_name) {
			this.notif.showSuccessErrorMessage('Board name is required', 'error');
		}
		if (!this.formBoard.value.board_alias) {
			this.notif.showSuccessErrorMessage('Alias name is required', 'error');
		}
		/* Form Validation Ends */
		if (this.formBoard.valid) {
			this.acsetupService.editBoard(value).subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.getBoardALL(this);
						this.notif.showSuccessErrorMessage(result.data, 'success');
					}
				}
			);
			this.formBoard.patchValue({board_name: '', board_alias: ''});
		}
	}

	editSection(value: any) {
		/*Adding Form Validation for section dropdown*/
		if (!this.formSection.value.sec_name) {
			this.notif.showSuccessErrorMessage('Section name is required', 'error');
		}
		/* Form Validation Ends */
		if (this.formSection.valid) {
			this.acsetupService.editSection(value).subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.getSectionAll(this);
						this.notif.showSuccessErrorMessage(result.data, 'success');
					}
				}
			);
			this.formSection.controls.sec_name.setValue('');
			this.editFlag = false;
		}
	}

	editSubject(value: any) {
		/*Adding Form Validation for subject dropdown*/
		if (!this.formSubject.value.sub_name) {
			this.notif.showSuccessErrorMessage('Subject name is required', 'error');
		}
		if (!this.formSubject.value.board_id) {
			this.notif.showSuccessErrorMessage('Board name is required', 'error');
		}
		/* Form Validation Ends */
		if (this.formSubject.valid) {
			this.acsetupService.editSubject(value).subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.getSubjectAll(this);
						this.notif.showSuccessErrorMessage(result.data, 'success');
					}
				}
			);
			this.editFlag = false;
			this.formSubject.controls.sub_name.setValue('');
		}
	}

	editClass(value: any) {
		/*Adding Form Validation for Class dropdown*/
		if (!this.formClass.value.class_name) {
			this.notif.showSuccessErrorMessage('Class name is required', 'error');
		}
		if (Number(this.currentUser.role_id) === 2) {
		if (!this.formClass.value.sec_id) {
			this.notif.showSuccessErrorMessage('Section is required', 'error');
		}
	} else {
		this.formClass.value.sec_id = [];
	}
		if (!this.formClass.value.sub_id) {
			this.notif.showSuccessErrorMessage('Subject is required', 'error');
		}
		if (!this.formClass.value.board_id) {
			this.notif.showSuccessErrorMessage('Board is required', 'error');
		}
		/* Form Validation Ends */
		if (this.formClass.valid) {
			this.acsetupService.editClass(value).subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.getClassAll(this);
						this.notif.showSuccessErrorMessage(result.data, 'success');
					}
				}
			);
			this.editFlag = false;
			this.formClass.controls.class_name.setValue('');
			this.formClass.controls.sec_id.setValue(['']);
			this.formClass.controls.sub_id.setValue(['']);
		}
	}

	editTopic(value: any) {
		/*Adding Form Validation for topic dropdown*/
		if (!this.formTopic.value.board_id) {
			this.notif.showSuccessErrorMessage('Board is required', 'error');
		}
		if (!this.formTopic.value.class_id) {
			this.notif.showSuccessErrorMessage('Class is required', 'error');
		}
		if (!this.formTopic.value.sub_id) {
			this.notif.showSuccessErrorMessage('Subject is required', 'error');
		}
		if (!this.formTopic.value.topic_name) {
			this.notif.showSuccessErrorMessage('Topic is required', 'error');
		}
		/* Form Validation Ends */
		if (this.formTopic.valid) {
			this.acsetupService.editTopic(value).subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.getTopicAll(this);
						this.notif.showSuccessErrorMessage(result.data, 'success');
					}
				}
			);
			this.editFlag = false;
			this.formTopic.patchValue({topic_id: '', board_id: '', class_id: '', sub_id: '', topic_name: ''});
		}
	}

	editSubtopic(value: any) {
		/*Adding Form Validation */
		if (!this.formSubtopic.value.board_id) {
			this.notif.showSuccessErrorMessage('Board is required', 'error');
		}
		if (!this.formSubtopic.value.class_id) {
			this.notif.showSuccessErrorMessage('Class is required', 'error');
		}
		if (!this.formSubtopic.value.sub_id) {
			this.notif.showSuccessErrorMessage('Subject is required', 'error');
		}
		if (!this.formSubtopic.value.topic_id) {
			this.notif.showSuccessErrorMessage('Topic is required', 'error');
		}
		if (!this.formSubtopic.value.st_name) {
			this.notif.showSuccessErrorMessage('Sub-topic is required', 'error');
		}
		/* Form Validation Ends */
		if (this.formSubtopic.valid) {
			this.acsetupService.editSubtopic(value).subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.getSubtopicAll(this);
						this.notif.showSuccessErrorMessage(result.data, 'success');
					}
				});
			this.editFlag = false;
			this.formSubtopic.patchValue({st_id: '', board_id: '', class_id: '', sub_id: '', topic_id: '', st_name: ''});
		}
	}

	editQsubtype(value: any) {
		this.editFlag = false;
		this.acsetupService.editQsubtype(value).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.getQsubtype(this);
					this.notif.showSuccessErrorMessage(result.data, 'success');
				}
			}
		);
		this.formQsubtype.controls.qst_name.setValue('');
	}

	editQtype(value: any) {
		this.editFlag = false;
		this.acsetupService.editQtype(value).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.getQtype(this);
					this.notif.showSuccessErrorMessage(result.data, 'success');
				}
			});
			this.formQtype.patchValue({qt_id: '', qt_name: '', qst_id: ''});
	}

	editSkill(value: any) {
		/*Adding Form Validation for skill type dropdown*/
		if (!this.formSkill.value.skill_name) {
			this.notif.showSuccessErrorMessage('Skill type is required', 'error');
		}
		/* Form Validation Ends */
		if (this.formSkill.valid) {
			this.acsetupService.editSkill(value).subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.getSkillAll(this);
						this.notif.showSuccessErrorMessage(result.data, 'success');
					}
				}
			);
			this.editFlag = false;
			this.formSkill.patchValue({skill_id: '', skill_name: ''});
		}

	}

	editLod(value: any) {
		if (!this.formLod.value.dl_name) {
			this.notif.showSuccessErrorMessage('Level of difficulty is required', 'error');
		}
		/* Form Validation Ends */
		if (this.formLod.valid) {
			this.acsetupService.editLod(value).subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.getLodAll(this);
						this.notif.showSuccessErrorMessage(result.data, 'success');
					}
				}
			);
			this.editFlag = false;
			this.formLod.patchValue({dl_id: '', dl_name: ''});
		}
	}
	toggleBoardStatus(value: any) {
		if (value.board_status === '1') {
			value.board_status = '0';
		} else {
			value.board_status = '1';
		}
		this.acsetupService.editBoard(value).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.getBoardALL(this);
				}
			}
		);
	}

	toggleSectionStatus(value: any) {
		if (value.sec_status === '1') {
			value.sec_status = '0';
		} else {
			value.sec_status = '1';
		}
		this.acsetupService.editSection(value).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.getSectionAll(this);
				}

			}
		);
	}

	toggleSubjectStatus(value: any) {
		if (value.sub_status === '1') {
			value.sub_status = '0';
		} else {
			value.sub_status = '1';
		}
		this.acsetupService.editSubject(value).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.getSubjectAll(this);
				}
			}
		);
	}

	toggleClassStatus(value: any) {
		if (value.class_status === '1') {
			value.class_status = '0';
		} else {
			value.class_status = '1';
		}
		const param: any = {};
		if (value.class_id) {
			param.class_id = value.class_id;
		}
		if (value.class_status) {
			param.class_status = value.class_status;
		}
		this.acsetupService.editClass(param).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.getClassAll(this);
				}
			}
		);
	}

	toggleTopicStatus(value: any) {
		if (value.topic_status === '1') {
			value.topic_status = '0';
		} else {
			value.topic_status = '1';
		}
		this.acsetupService.editTopic(value).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.getTopicAll(this);
				}
			}
		);
	}

	toggleSubtopicStatus(value: any) {
		if (value.st_status === '1') {
			value.st_status = '0';
		} else {
			value.st_status = '1';
		}
		this.acsetupService.editSubtopic(value).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.getSubtopicAll(this);
				}
			}
		);
	}

	toggleQsubtypeStatus(value: any) {
		if (value.qst_status === '1') {
			value.qst_status = '0';
		} else {
			value.qst_status = '1';
		}
		this.acsetupService.editQsubtype(value).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.getQsubtype(this);
				}
			}
		);
	}

	toggleQtypeStatus(value: any) {
		if (value.qt_status === '1') {
			value.qt_status = '0';
		} else {
			value.qt_status = '1';
		}
		this.acsetupService.editQtype(value).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.getQtype(this);
				}
			}
		);
	}

	toggleSkillStatus(value: any) {
		if (value.skill_status === '1') {
			value.skill_status = '0';
		} else {
			value.skill_status = '1';
		}
		this.acsetupService.editSkill(value).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.getSkillAll(this);
				}
			}
		);
	}

	toggleLodStatus(value: any) {
		if (value.dl_status === '1') {
			value.dl_status = '0';
		} else {
			value.dl_status = '1';
		}
		this.acsetupService.editLod(value).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.getLodAll(this);
				}
			}
		);
	}

	getSubjecstByClass() {
		const class_id = this.formTopic.value.class_id;
		if (class_id) {
			this.acsetupService.getSubjecstByClass(class_id).subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.arraySubject = result.data;
					}
				}
			);
		} else {
			this.notif.showSuccessErrorMessage('Class is required', 'error');
		}
	}

	getSubjecstByClassInSubtopic() {
		const class_id = this.formSubtopic.value.class_id;
		if (class_id) {
			this.acsetupService.getSubjecstByClass(class_id).subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.arraySubject = result.data;
					}
				}
			);
		} else {
			this.notif.showSuccessErrorMessage('Class is required', 'error');
		}
	}

	getTopicByBoardClassSubject() {
		const board_id = this.formSubtopic.value.board_id;
		if (board_id) {
			const class_id = this.formSubtopic.value.class_id;
			if (class_id) {
				const sub_id = this.formSubtopic.value.sub_id;
				if (sub_id) {
					this.acsetupService.getTopicByBoardClassSubject(board_id, class_id, sub_id).subscribe(
						(result: any) => {
							if (result && result.status === 'ok') {
								this.arrayTopic = result.data;
							}
						}
					);
				} else {
					this.notif.showSuccessErrorMessage('Select subject', 'error');
				}

			} else {
				this.notif.showSuccessErrorMessage('Select class', 'error');
			}
		} else {
			this.notif.showSuccessErrorMessage('Select board', 'error');
		}
	}

	openModal = (data) => this.deleteModalRef.openDeleteModal(data);
		// this.modalRef = this.modalService.show(template, { class: 'modal-sm' });

	closeFirstModal() {
		this.modalRef.hide();
		this.modalRef = null;
	}

	deleteEntry(deletedData, serFnName , next) {
		this.acsetupService[serFnName](deletedData).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					next(this);
					this.notif.showSuccessErrorMessage(result.data, 'success');
				}
			}
		);
	}
}

