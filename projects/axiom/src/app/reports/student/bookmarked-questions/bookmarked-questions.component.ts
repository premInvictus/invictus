import { Component, OnInit, ViewChild, AfterViewInit, AfterViewChecked } from '@angular/core';
import { QelementService } from '../../../questionbank/service/qelement.service';
import { ReportService } from '../../../reports/service/report.service';
import { AcsetupService } from '../../../acsetup/service/acsetup.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NotificationService } from '../../../_services/index';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import {HtmlToTextService } from '../../../_services/index';
import { EssayDialogsComponent } from '../../../questionbank/essay-dialogs/essay-dialogs.component';
import { MatDialog, MatDialogRef } from '@angular/material';

@Component({
	selector: 'app-bookmarked-questions',
	templateUrl: './bookmarked-questions.component.html',
	styleUrls: ['./bookmarked-questions.component.css']
})
export class BookmarkedQuestionsComponent implements OnInit, AfterViewInit, AfterViewChecked {
	bookmarkedQuestionForm: FormGroup;
	subjectArray: any[] = [];
	topicqusArray: any[] = [];
	bookmarkedQuestionArray: any[] = [];
	bookqusidarray: any[] = [];
	public optionHA = ['A', 'B', 'C', 'D', 'E'];
	public optionmatchHA = ['P', 'Q', 'R', 'S', 'T'];
	topicArray: any[] = [];
	essayDialogRef: MatDialogRef<EssayDialogsComponent>;
	userDetail: any = {};
	currentUser: any = {};
	class_id;
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	BOOKMARK_ELEMENT_DATA: BookmarkElement[] = [];
	bookmarkdisplayedColumns = ['position', 'question', 'answer', 'explanations', 'class', 'subtopic', 'details', 'action'];
	bookmarkdatasource = new MatTableDataSource<BookmarkElement>(this.BOOKMARK_ELEMENT_DATA);
	bookmarkdataSourceArray: any[] = [];
	BOOKMARK_ELEMENT_DATA_FINAL: any[] = [];
	showData = false;
	constructor(
		private fbuild: FormBuilder,
		private qelementService: QelementService,
		private reportService: ReportService,
		private acsetupService: AcsetupService,
		private notif: NotificationService,
		private htt: HtmlToTextService,
		public dialog: MatDialog
	) { }


	ngOnInit() {
		this.showData = true;
		this.buildForm();
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.qelementService.getUser({ login_id: this.currentUser.login_id, role_id: this.currentUser.role_id }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.userDetail = result.data[0];
					this.class_id = this.userDetail.au_class_id;
					this.getSubjectsByClass(this.class_id);
				}
			}

		);
	}


	buildForm() {
		this.bookmarkedQuestionForm = this.fbuild.group({
			sub_id: ''
		});
	}

	ngAfterViewInit() {
 this.bookmarkdatasource.paginator = this.paginator;
 this.bookmarkdatasource.sort = this.sort;
	}
	ngAfterViewChecked() {
		for (const item of this.BOOKMARK_ELEMENT_DATA) {
	MathJax.Hub.Queue(['Typeset', MathJax.Hub, item.showHover]);
		}
 }

	applyFilter(filterValue: string, value: number) {
		filterValue = filterValue.trim().toLowerCase(); // Remove whitespace
		this.bookmarkdataSourceArray[value].filter = filterValue;

	}
	getSubjectsByClass(param) {
		this.subjectArray = [];
		this.qelementService.getSubjectsByClass(param).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.subjectArray = result.data;
				}
			}
		);
	}
	getbmid(bmarray, bm_qus_id) {
		for (const bmitem of bmarray) {
			if (bmitem.bm_qus_id === bm_qus_id) {
				return bmitem.bm_id;
			}
		}
	}
	getBookmarkedQuestions() {
		if (this.bookmarkedQuestionForm.value.sub_id) {
			this.reportService.getBookmark({
				login_id: this.currentUser.login_id, class_id: this.class_id, sub_id: this.bookmarkedQuestionForm.value.sub_id }).subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.bookqusidarray = result.data;
						const qusidArray = [];
						for (const item of this.bookqusidarray) {
							qusidArray.push(item.bm_qus_id);
						}
						if (qusidArray.length > 0) {
							this.acsetupService.getTopicByClassSubject({ class_id: this.class_id, sub_id: this.bookmarkedQuestionForm.value.sub_id }).subscribe(
								(result2: any) => {
									if (result2 && result2.status === 'ok') {
										this.topicArray = result2.data;
											this.qelementService.getQuestionsInTemplate({qus_id: qusidArray}).subscribe(
												(result3: any) => {
													if (result3 && result3.status === 'ok') {
														this.bookmarkedQuestionArray = result3.data;
														for (const bmqus of this.bookmarkedQuestionArray) {
															const bm_id = this.getbmid(this.bookqusidarray, bmqus.qus_id);
															bmqus.bm_id = bm_id;
														}
														this.topicqusArray = [];
														for (const topic of this.topicArray) {
															const qusArray = [];
															for (const qus of this.bookmarkedQuestionArray) {
																if (topic.topic_id === qus.qus_topic_id) {
																	qusArray.push(qus);
																}
															}
															this.topicqusArray.push({topic_id: topic.topic_id, topic_name: topic.topic_name, TQArray: qusArray});
														}
													}
												});
									}
								}
							);
						}
					} else {
						this.notif.showSuccessErrorMessage('No recored found', 'error');
						this.topicqusArray = [];
					}
				}
			);
		}
		setTimeout(() => this.getTableData(), 2000);
	}
	deleteBookmarkedQuestion(bm_id) {
		this.reportService.deleteBookmark({bm_id: bm_id}).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.notif.showSuccessErrorMessage('Deleted Successfully', 'success');
					this.getBookmarkedQuestions();
				}
			}
		);

	}
	getTableData() {
		this.bookmarkdataSourceArray = [];
		let optionsArray: any[] = [];
		let hoverArray: any[] = [];
		for (const topic of this.topicqusArray) {
			hoverArray = [];
			optionsArray = [];
			let outerId = 0;
			let ind = 1;


		for (let i = 0; i < 100000; i++) {
			optionsArray[i] = '';
			hoverArray[i] = '';
			}

			this.BOOKMARK_ELEMENT_DATA = [];
			this.bookmarkdatasource = new MatTableDataSource<BookmarkElement>(this.BOOKMARK_ELEMENT_DATA);
			for (const qus of topic.TQArray) {
				let id = 0;
				const showHover = '';
				if (qus.options) {
				for (const option of qus.options) {
						if (Number(qus.qus_qst_id) === 1 ||
						Number(qus.qus_qst_id) === 2 ||
						Number(qus.qus_qst_id) === 3) {
						hoverArray[outerId] = (hoverArray[outerId] + (this.optionHA[id] + ':' + '&nbsp;&nbsp;' + option.qopt_options)) + '\n';
						if (option.qopt_answer === '1') {
								optionsArray[outerId] = optionsArray[outerId] + '<b>' + option.qopt_options + '</b>';
						}
						} else if (Number(qus.qus_qst_id) === 4) {
						hoverArray[outerId] = (hoverArray[outerId] + this.optionHA[id] + ':' + '&nbsp;&nbsp;' +
								qus.options[id].qopt_options + '\n' + this.optionmatchHA[id] + ':' + '&nbsp;&nbsp;' +
								qus.options[id].qopt_options_match) + '\n';
								optionsArray[outerId] = optionsArray[outerId] + '<b>' + qus.options[id].qopt_answer + '<b>' + ',';
						} else if (Number(qus.qus_qst_id) === 5) {
						hoverArray[outerId] = (hoverArray[outerId] + this.optionHA[id] + ':' + '&nbsp;&nbsp;' +
								qus.options[id].qopt_options + '\n' + this.optionmatchHA[id] + ':' + '&nbsp;&nbsp;' +
								qus.options_match[id].qopt_options_match) + '\n';
								const eachanswer = qus.answer[id];
								let ansstring = '';
								for (let ansi = 0; ansi < eachanswer.length; ansi++) {
										if (eachanswer[ansi].qopt_answer === '1') {
												ansstring = ansstring + this.optionmatchHA[ansi] + ' ';
										}
								}
								optionsArray[outerId] = optionsArray[outerId] + '<b>' + ansstring + '<b>' + ',';
						} else if (Number(qus.qus_qst_id) === 13) {
							hoverArray[outerId] = (hoverArray[outerId] + this.optionHA[id] + ':' + '&nbsp;&nbsp;' +
							qus.options[id].qopt_options + '\n' + this.optionmatchHA[id] + ':' + '&nbsp;&nbsp;' +
							qus.options_match[id].qopt_options_match) + '\n';
									const eachanswer = qus.answer[id];
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
					if (id === 4 && Number(qus.qus_qst_id) === 13) {
							hoverArray[outerId] = hoverArray[outerId] + this.optionmatchHA[id] + ':' + '&nbsp;&nbsp;' +
							qus.options_match[id].qopt_options_match;
					}
				}
				} else {
					if ((Number(qus.qus_qst_id) > 5 && Number(qus.qus_qst_id) < 13)) {
							optionsArray[outerId] = qus.qopt_answer;
					}
					if ( Number(qus.qus_qst_id) === 14) {
							// tslint:disable-next-line:max-line-length
							optionsArray[outerId] = '<button mat-icon style=\'border-radius:50% !important;border:none !important;color:white;font-weight:bold !important;color:white !important;color:white;background-color:#6c65c8 !important;height:40px !important;width:40px !important\'>'
							+ qus.qopt_answer + '</button>';
					}
					if ( Number(qus.qus_qst_id) === 15) {
							// tslint:disable-next-line:max-line-length
							optionsArray[outerId] = '<button mat-icon style=\'border-radius:50% !important;border:none !important;color:white;font-weight:bold !important;color:white !important;color:white;background-color:#6c65c8 !important;height:40px !important;width:40px !important\'>'
							+ qus.qopt_answer.charAt(0) + '</button>' +
							// tslint:disable-next-line:max-line-length
							'<button mat-icon style=\'border-radius:50% !important;border:none !important;color:white;font-weight:bold !important;color:white !important;color:white;background-color:#6c65c8 !important;height:40px !important;width:40px !important\'>'
							+ qus.qopt_answer.charAt(1) + '</button>';
					}
					id++;
					}
				let Details = '';
				// tslint:disable-next-line:max-line-length
				Details = Details + '<span>Subject:&nbsp;&nbsp' + qus.sub_name + '</span><br>'
					+ '<span>Skill:&nbsp;&nbsp' + qus.skill_name + '</span><br>'
					+ '<span>Lod:&nbsp;&nbsp' + qus.dl_name + '</span><br>'
					+ '<span>Suggested Marks:&nbsp;&nbsp' + qus.qus_marks + '</span><br>'
					+ '<span>Time:&nbsp;&nbsp' + qus.qus_time_alloted + '</span><br>'
					+ '<span>Neg Marks:&nbsp;&nbsp' + qus.qus_negative_marks + '</span><br>'
					+ '<span>Ref:&nbsp;&nbsp' + qus.qus_historical_reference + '</span>';

				outerId++;
				this.BOOKMARK_ELEMENT_DATA.push({
						position: ind,
						question: qus.qus_name,
						answer: optionsArray[ind - 1],
						class: qus.class_name,
						subtopic: qus.st_name,
						explanations: qus.qus_explanation,
						details: Details,
						showHover: hoverArray[ind - 1],
						action: qus
				});
				ind++;

			}
			this.BOOKMARK_ELEMENT_DATA_FINAL.push(this.BOOKMARK_ELEMENT_DATA);
			this.bookmarkdatasource = new MatTableDataSource<BookmarkElement>(this.BOOKMARK_ELEMENT_DATA);
			this.bookmarkdatasource.paginator = this.paginator;
			this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
			this.bookmarkdatasource.sort = this.sort;
			this.bookmarkdataSourceArray.push(this.bookmarkdatasource);
		}
	}
	htmlToText(html) {
		return this.htt.htmlToText(html);
	}
	openEssayDetails(value) {
		this.essayDialogRef = this.dialog.open(EssayDialogsComponent, {
				height: '600px',
				width: '1000px',
				data: {
					essayDiv: 'detail',
					ess_id: value.qus_ess_id
				}
			});
	}
	checkData(value: number) {
		if (this.BOOKMARK_ELEMENT_DATA_FINAL[value].length === 0) {
			this.showData = false;
		} else {
			this.showData = true;
		}
	}
}
export interface BookmarkElement {
	position: number;
	question: any;
	answer: any;
	showHover: any;
	class: any;
	subtopic: any;
	explanations: any;
	details: any;
	action: any;
}

