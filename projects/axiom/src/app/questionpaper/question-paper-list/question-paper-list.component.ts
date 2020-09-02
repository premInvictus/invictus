import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { QelementService } from '../../questionbank/service/qelement.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { UserAccessMenuService, NotificationService, BreadCrumbService, HtmlToTextService } from '../../_services/index';
import { appConfig } from '../../app.config';
import { Element } from './question-paper-list.model';
import { saveAs } from 'file-saver';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { forEach } from '@angular/router/src/utils/collection';
@Component({
	selector: 'app-question-paper-list',
	templateUrl: './question-paper-list.component.html',
	styleUrls: ['./question-paper-list.component.css']
})

export class QuestionPaperListComponent implements OnInit {

	modalRef: BsModalRef;
	modalRef2: BsModalRef;
	parameterform: FormGroup;
	subjectArrayInCurrentPaperDetails: any[] = [];
	modalForm: FormGroup;
	classArray: any[];
	currentQues: any[];
	hosturl = appConfig.apiUrl;
	subjectArray: any[];
	qpaperArray: any[] = [];
	questionArray: any[];
	essayquestionArray: any[] = [];
	essayGroupArray: any[] = [];
	essayGroupQuestionArray: any[] = [];
	viewCurrentQP: any;
	viewCurrentQPDiv = false;
	paperListDiv = true;
	filterArray: any[];
	filterQuestionList: any[] = [];
	// Used on html
	ReasonArray = ['This is a duplicate question', 'This question is out of course', 'Reason 1', 'Reason 2', 'Reason 3'];
	optionHA = ['A', 'B', 'C', 'D', 'E'];
	optionmatchHA = ['P', 'Q', 'R', 'S', 'T'];
	schoolInfo: any = {};
	loading = false;
	homeUrl: string;
	ELEMENT_DATA: Element[] = [];
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild('deleteModalRef') deleteModalRef;
	public qp_unpublish_remark: any;
	public qp_unpublish_other: any;
	public currentUnpublishedQues: any = {};
	tableCollection = false;
	reasonsArray: any[] = [];
	reason_id: any;
	currentUser: any;

	displayedColumns = ['position', 'name', 'class', 'subject', 'topic', 'marks', 'time', 'action'];
	dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);

	constructor(
		private modalService: BsModalService,
		private qelementService: QelementService,
		private fb: FormBuilder,
		private htt: HtmlToTextService,
		private userAccessMenuService: UserAccessMenuService,
		private notif: NotificationService,
		private breadCrumbService: BreadCrumbService,
		private sanitizer: DomSanitizer
	) { }

	ngOnInit() {
		this.homeUrl = this.breadCrumbService.getUrl();
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.getClass();
		this.buildForm();
		this.getSchool();
		this.getPublishUnpublishReasons();
	}

	applyFilter(filterValue: string) {
		filterValue = filterValue.trim(); // Remove whitespace
		filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
		this.dataSource.filter = filterValue;
	}

	isExistUserAccessMenu(mod_id) {
		return this.userAccessMenuService.isExistUserAccessMenu(mod_id);
	}

	buildForm() {
		this.parameterform = this.fb.group({
			qp_class_id: '',
			qp_sub_id: '',
			from_date: '',
			to_date: '',
		});

		this.modalForm = this.fb.group({
			qp_unpublish_remark: ['', Validators.required],
			reason_id: ['', Validators.required]
		});
	}
	getPublishUnpublishReasons() {
		this.qelementService.publishUnpublishReason({ reason_type: 2 }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.reasonsArray = result.data;
			}
		});
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

	getSubjectsByClass(class_id): void {

		this.qelementService.getSubjectsByClass(class_id).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {

					this.subjectArray = result.data;
				} else {
					this.subjectArray = [];
				}
			}
		);
	}

	getCurrentUnpublishedQues(value) {
		this.currentUnpublishedQues = value;
	}

	isExist(value, valueArray) {
		for (const each of valueArray) {
			if (each.topic_name === value.topic_name) {
				return true;
			}
		}
		return false;
	}
	getQuestionPaper() {
		// Form validations
		this.qpaperArray = [];
		this.ELEMENT_DATA = [];
		const param: any = {};
		param.class_id = this.parameterform.value.qp_class_id;
		param.sub_id = this.parameterform.value.qp_sub_id;
		param.qp_status = 1;
		if (this.parameterform.valid) {

			this.qelementService.getQuestionPaper(param).subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.qpaperArray = result.data;
						let ind = 1;
						let curTopic_name = '';
						let etopicArray = [];

						for (const t of this.qpaperArray) {
							etopicArray = [];
							for (const qus of t.qlist) {
								if (!this.isExist({ topic_name: qus.topic_name }, t.filter)) {
									t.filter.push({ topic_name: qus.topic_name });
								}
							}
							for (const item of t.filter) {
								if (curTopic_name !== item.topic_name) {
									curTopic_name = item.topic_name;
									etopicArray.push({ topic_name: curTopic_name });
								}
							}
							let topic_name_list = '';
							for (const titem of etopicArray) {
								if (etopicArray.length > 1) {
									topic_name_list += ' ' + '<li>' + titem.topic_name + '</li>';
								} else {
									topic_name_list += ' ' + titem.topic_name;
								}
							}
							let sec: any;
							if (t.sec_name) {
								sec = '-' + t.sec_name;
							} else {
								sec = '';
							}
							this.ELEMENT_DATA.push({
								position: ind,
								name: t.qp_name,
								class: t.class_name + sec,
								section: t.sec_name,
								subject: t.sub_name,
								topic: topic_name_list,
								marks: t.tp_marks,
								time: t.tp_time_alloted,
								action: t
							});
							ind++;
							curTopic_name = '';
						}
						this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
						this.dataSource.paginator = this.paginator;
						this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
						this.dataSource.sort = this.sort;
						console.log(this.ELEMENT_DATA);
					} else {
						this.tableCollection = false;
						this.notif.showSuccessErrorMessage('No records found', 'error');
					}

				}
			);
		}
		if (!this.parameterform.value.qp_class_id) {
			this.notif.showSuccessErrorMessage('Class is required', 'error');
		}
		if (!this.parameterform.value.qp_sub_id) {
			this.notif.showSuccessErrorMessage('Subject is required', 'error');
		} else {
			this.tableCollection = true;
		}
	}

	unpublishQuestionPaper(qp_id) {

		this.qpaperArray = [];
		this.qp_unpublish_remark = this.modalForm.value.qp_unpublish_remark;
		this.reason_id = this.modalForm.value.reason_id;
		if (this.modalForm.valid) {
			this.qelementService.publishUnpublishQuestionPaper(qp_id, 0, this.qp_unpublish_remark, this.reason_id, this.currentUser.login_id)
				.subscribe(
					(result: any) => {
						if (result && result.status === 'ok') {
							this.modalRef2.hide();
							this.getQuestionPaper();
							this.notif.showSuccessErrorMessage('Test unpublished successfully', 'success');
						} else {
							this.notif.showSuccessErrorMessage('Error unpublishing the question', 'error');
						}

					}
				);
		} else {
			this.notif.showSuccessErrorMessage('Please select Reasons and enter remarks', 'error');
		}
	}

	getQusPosFromCurrentQP(qus_id) {
		for (const qus of this.viewCurrentQP.qlist) {
			if (qus.qpq_qus_id === qus_id) {
				return qus.qpq_qus_position;
			}
		}
	}
	getEssayDetail(essid) {
		this.qelementService.getEssay({ ess_id: essid }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					return result.data[0];
				}
			}
		);
	}
	getSubName(sub_id) {
		for (const element of this.subjectArray) {
			if (Number(element.sub_id) === Number(sub_id)) {
				return element.sub_name;
			}
		}
		return '';
	}

	viewQuestionPaper(item) {
		this.viewCurrentQP = item;
		this.subjectArrayInCurrentPaperDetails = [];
		const subjectArrayInCurrentPaper = this.viewCurrentQP.qp_sub_id.replace(/\s/g, '').split(',');
		const questionIdArray = [];
		this.filterQuestionList = [];
		this.essayquestionArray = [];
		this.essayGroupQuestionArray = [];
		this.essayGroupArray = [];
		this.questionArray = [];
		for (const qitem of item.qlist) {
			questionIdArray.push(qitem.qpq_qus_id);
		}
		this.qelementService.getQuestionsInTemplate({ qus_id: questionIdArray }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					const questionArrayUnsorted = result.data;
					for (const eachitem of item.qlist) {
						for (const eachqus of questionArrayUnsorted) {
							if (eachitem.qpq_qus_id === eachqus.qus_id) {
								this.questionArray.push(eachqus);
							}
						}
					}
					for (const eachQus of this.questionArray) {
						if (Number(eachQus.qus_qt_id) === 3) {
							const eindex = this.questionArray.findIndex(value => value.qus_id === eachQus.qus_id);
							if (eindex !== -1) {
								this.essayquestionArray.push(eachQus);
								// this.questionArray.splice(eindex, 1);
							}
						}
					}

					for (const eachEQus of this.essayquestionArray) {
						const eindex = this.questionArray.findIndex(value => value.qus_id === eachEQus.qus_id);
						if (eindex !== -1) {
							this.questionArray.splice(eindex, 1);
						}
						if ((this.essayGroupArray.indexOf(eachEQus.qus_ess_id)) === -1) {
							this.essayGroupArray.push(eachEQus.qus_ess_id);
						}
					}
					for (const egroupValue of this.essayGroupArray) {
						const eachGroupQus: any[] = [];
						for (const eachEQus of this.essayquestionArray) {
							if (egroupValue === eachEQus.qus_ess_id) {
								eachGroupQus.push(eachEQus);
							}
						}
						this.essayGroupQuestionArray.push({ ess_id: egroupValue, essayQuestionList: eachGroupQus, ess_sub_id: 0 });
					}

					for (const egq of this.essayGroupQuestionArray) {
						this.qelementService.getEssay({ ess_id: egq.ess_id }).subscribe(
							(result1: any) => {
								if (result1) {
									egq.ess_description = result1.data[0].ess_description;
									egq.ess_title = result1.data[0].ess_title;
									egq.ess_sub_id = result1.data[0].ess_sub_id;
								}
							}
						);
					}
					console.log('this.essayGroupQuestionArray');
					console.log(this.essayGroupQuestionArray);
					this.qelementService.getTemplate({ tp_id: item.qp_tp_id, tp_tt_id: item.tp_tt_id }).subscribe(
						(res: any) => {
							if (res) {
								const templateArray: any[] = res.data;
								let i = 0;
								for (const temp of templateArray) {
									if (Number(temp.tp_id) === Number(item.qp_tp_id)) {
										break;
									} else {
										i++;
									}
								}
								this.filterArray = res.data[i].filters;
								const filters: any[] = [];

								for (const filter of this.filterArray) {
									const filterQuestionArray: any[] = [];

									for (const qitem of item.qlist) {
										if (filter.tf_id === qitem.qpq_tf_id) {
											const findex = this.questionArray.findIndex(ques => ques.qus_id === qitem.qpq_qus_id);
											if (this.questionArray[findex]) {
												filterQuestionArray.push(this.questionArray[findex]);
											}
										}
									}
									filter.qlist = filterQuestionArray;
									filters.push(filter);
									this.filterQuestionList.push(filter);
								}
								if (subjectArrayInCurrentPaper.length > 0) {
									for (const sub of subjectArrayInCurrentPaper) {
										const filterQuestionListSub = [];
										for (const filter of this.filterQuestionList) {
											if (filter.qlist.length > 0) {
												filterQuestionListSub.push(filter);
											}
										}
										this.subjectArrayInCurrentPaperDetails.push({
											sub_id: sub,
											sub_name: this.getSubName(sub),
											filterQuestionList: filterQuestionListSub,
											essayGroupQuestionArray: this.essayGroupQuestionArray
										});
									}
								}
								this.manipulateData(this.viewCurrentQP);
								this.manipulateDataEssay(this.viewCurrentQP);
								this.viewCurrentQPDiv = true;
								this.paperListDiv = false;
							}
						}
					);
				}

			}
		);
	}
	manipulateData(val) {
		for (const item of this.filterQuestionList) {
			if (item.qlist[0]) {
				for (const qitem of item.qlist) {
					for (const qpitem of val.qlist) {
						if (qitem.qus_id === qpitem.qpq_qus_id) {
							qitem.qus_marks = qpitem.qpq_marks;
							break;
						} else {
							continue;
						}
					}
				}
			}
		}
	}
	questionListInHtml(value) {

	}
	manipulateDataEssay(val) {
		for (const item of this.essayGroupQuestionArray) {
			if (item.essayQuestionList[0]) {
				for (const qitem of item.essayQuestionList) {
					for (const qpitem of val.qlist) {
						if (qitem.qus_id === qpitem.qpq_qus_id) {
							qitem.qus_marks = qpitem.qpq_marks;
							break;
						} else {
							continue;
						}
					}
				}
			}
		}
	}


	gotoList() {
		this.filterQuestionList = [];
		this.essayGroupArray = [];
		this.essayquestionArray = [];
		this.essayGroupQuestionArray = [];
		this.viewCurrentQPDiv = false;
		this.paperListDiv = true;
		this.tableCollection = true;
	}

	getSchool() {

		this.qelementService.getSchool().subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {

					this.schoolInfo = result.data[0];
				}

			}
		);
	}
	belongToSub(sub1, sub2) {
		if (Number(sub1) === Number(sub2)) {
			return true;
		} else {
			return false;
		}
	}

	printStudentCopy() {
		const printModal2 = document.getElementById('printModal2');

		const html =
			`<html>
			<head>
			<script type="text/x-mathjax-config">
			setTimeout(function(){
				MathJax.Hub.Config({
				
					
					tex2jax: {
					inlineMath: [['$','$'], ['\\(','\\)']],
					displayMath: [ ['$$','$$'], ["\\[","\\]"] ],
					processEscapes: true,
					
					},
					messageStyle: "none"
				});
			}, 2000);
			</script>
			<script type="text/javascript" async
			src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-AMS_CHTML">
			</script>
		<style>
		
	 
	
		button { display:none; }  
		
		.ques-paper-logo {
			margin-bottom: 10px;
			border-radius: 50%;
			width: 65px;
			height: 65px;
		}
		p {word-break:break-word;white-space:pre-line;margin-bottom:5px}
		.qst_name_head{text-align:center;font-size:14px; font-weight:bold}
		.qp_name_head{text-align:center;font-size:14px;}
		.qp_name{font-size:14px;}
		.logo{text-align:center;}
		.qus_position{width:2% !important}
		
		.ques_name{width:85% !important;}
		.moveTd{width:13% !important;font-weight:bold;}
		.imgClassExpress p img{height:100px;width:auto; margin-bottom:10px} 
		.imgclassQpList p img {height:100px;margin-bottom:10px} 
		table{margin:0px; padding:0px;	font-size: 14px;}
		label{width:100% !important;margin:0px !important;}
		.general-inc{font-size:14px; font-weight:bold;}
		.text-center{text-align:center !important;}
		.text-center h5{text-align:center; margin:0; font-size: 14px;}
		.max_marks,.time_allowed{width:25% !important;}
		body{-webkit-print-color-adjust: exact; !important}
		.modifyWidth{width:80% !important} 
		.ques-paper-table {
			font-size: 14px;
		}
		.MJX_Assistive_MathML{display:none !important}
		mrow.MJX-TeXAtom-ORD{display:none !important}
		
	
		</style>
		</head>
		<body>'
		${printModal2.innerHTML}  
		</body>
	
		</html>`;
		const finalHTML = html.replace('<p>&nbsp;</p>', '');
		this.qelementService.printQuestionPaperPDF({ pdf: finalHTML }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				const length = result.data.split('/').length;
				saveAs(result.data, result.data.split('/')[length - 1]);
			}
		});
	}
	htmlToText(html) {
		return this.htt.htmlToText(html);
	}

	openModal(template: TemplateRef<any>) {
		this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
	}

	openModal2(template: TemplateRef<any>) {
		this.modalRef2 = this.modalService.show(template, { class: 'modal-sm', backdrop: 'static' });
	}
	isEmpty(list) {
		if (list.length === 0) {
			return true;
		} else {
			return false;
		}
	}

}



