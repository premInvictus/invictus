import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { CommonAPIService, SisService, AxiomService, SmartService, ExamService } from '../../_services';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material';
import { Element } from './exam-alias.model';
import { CapitalizePipe } from '../../../../../examination/src/app/_pipes';

@Component({
	selector: 'app-exam-alias-termwise',
	templateUrl: './exam-alias-termwise.component.html',
	styleUrls: ['./exam-alias-termwise.component.css']
})
export class ExamAliasTermwiseComponent implements OnInit {

	displayedColumns: string[] = ['class', 'term', 'alias', 'action'];
	@ViewChild('deleteModal') deleteModal;
	examAliasForm: FormGroup;
	currentUser: any;
	session: any;
	ckeConfig: any = {};
	subExamArray: any[] = [];
	ELEMENT_DATA: Element[] = [];
	UpdateFlag = false;
	viewOnly = true;
	param: any = {};
	subExamDataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
	classArray: any[] = [];
	termsArray: any[] = [];
	examArray: any[] = [];
	subexamArray: any[] = [];
	currentExam: any;
	exam_alias_arr: any[] = [];
	constructor(
		public dialog: MatDialog,
		private fbuild: FormBuilder,
		private smartService: SmartService,
		public commonService: CommonAPIService,
		public axiomService: AxiomService,
		public sisService: SisService,
		public examService: ExamService
	) {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.session = JSON.parse(localStorage.getItem('session'));
	}
	ngOnInit() {
		this.buildForm();
		this.getClass();
		this.getExamSexamAlias();
	}
	buildForm() {
		this.examAliasForm = this.fbuild.group({
			eat_class_id: '',
			eat_term_id_from: '',
			eat_term_id: '',
			eat_exam_id: '',
			alias_data: this.fbuild.array([])
		});
	}
	get aliasData() {
		return this.examAliasForm.get('alias_data') as FormArray;
	}
	getClass() {
		this.classArray = [];
		this.smartService.getClass({ class_status: '1' }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.classArray = result.data;
			} else {
				// this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}
	getClassTerm() {
		//this.resetAliasData();
		this.termsArray = [];
		this.examService.getClassTerm({ class_id: this.examAliasForm.value.eat_class_id }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				result.data.ect_no_of_term.split(',').forEach(element => {
					this.termsArray.push({ id: element, name: result.data.ect_term_alias + ' ' + element });
				});
			} else {
				// this.commonAPIService.showSuccessErrorMessage(result.message, 'error'); 
			}
		});
	}
	getExamDetails() {
		//this.resetAliasData();
		this.examArray = [];
		this.subexamArray = [];
		this.examService.getExamDetails({ exam_class: this.examAliasForm.value.eat_class_id, term_id: this.examAliasForm.value.eat_term_id_from }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.examArray = result.data;
			}
		});
	}
	setCurrentExam(event) {
		this.resetAliasData();
		this.currentExam = this.examArray.find(e => e.exam_id === event.value);
		console.log(this.currentExam);
		this.aliasData.push(this.fbuild.group({
			eat_exam_sexam_name: this.currentExam.exam_name,
			eat_exam_sexam_id: this.currentExam.exam_id,
			eat_exam_sexam_type: 'exam',
			eat_status: '1',
			eat_alias_name:''
		}));
		this.currentExam.exam_sub_exam_max_marks.forEach(element => {
			this.aliasData.push(this.fbuild.group({
				eat_exam_sexam_name: element.sexam_name,
				eat_exam_sexam_id: element.se_id,
				eat_exam_sexam_type: 'sexam',
				eat_status: '1',
				eat_alias_name:''
			}));
		});

	}
	resetAliasData() {
		//this.examAliasForm.controls['alias_data'] = this.fbuild.array([]);
		/*for (let index = 0; index < this.aliasData.length; index++) {
			this.aliasData.removeAt(index);		
		}*/	
		while (this.aliasData.length !== 0) {
			this.aliasData.removeAt(0)
		}
	}
	
	// delete dialog open modal function
	openDeleteModal(value) {
		this.param.se_id = value;
		this.param.text = 'Delete';
		this.deleteModal.openModal(this.param);
	}
	resetForm() {
		this.examAliasForm.patchValue({
			eat_class_id: '',
			eat_term_id_from: '',
			eat_term_id: '',
			eat_exam_id: '',
		});
		this.resetAliasData();
		this.UpdateFlag = false;
		this.viewOnly = true;
	}

	submit() {
		if (this.examAliasForm.valid) {
			console.log(this.examAliasForm.value);
			this.examService.insertExamSexamAlias(this.examAliasForm.value).subscribe((result: any) => {
				if(result && result.status === 'ok') {
					this.commonService.showSuccessErrorMessage(result.message, 'success');
					this.resetForm();
					this.getExamSexamAlias();
				} else {
					this.commonService.showSuccessErrorMessage(result.message, 'error');
				}
			})
		}
	}
	getExamSexamAlias() {
		this.exam_alias_arr = [];
		this.ELEMENT_DATA = [];
		this.subExamDataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
		this.examService.getExamSexamAlias({eat_status: '1'}).subscribe((result: any) => {
			if(result && result.status === 'ok') {
				this.exam_alias_arr = result.data;
				console.log(this.exam_alias_arr);
				result.data.forEach(element => {
					this.ELEMENT_DATA.push({
						class: element.class_name,
						term: element.term_name,
						exam: '',
						alias: element.alias_data,
						action: element
					});
				});
				this.subExamDataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
			}
		})
	}
	getActiveStatus(value: any) {
		if (value.sexam_status === '1') {
			return true;
		}
	}
	toggleStatus(value: any) {

	}
	formEdit(value: any) {
		this.UpdateFlag = true;
		this.viewOnly = false;
		this.examAliasForm.patchValue({
			se_id: value.se_id,
			sexam_name: value.sexam_name,
			sexam_desc: value.sexam_desc
		});
	}
	updateSubExam() {

	}
	deleteSubExam($event) {

	}

}