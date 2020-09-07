import { Component, OnInit, ViewChild } from '@angular/core';
import { QelementService } from '../../questionbank/service/qelement.service';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { Element } from './studentwiseevaluationElement.model'; 
import { saveAs } from 'file-saver';

@Component({
	selector: 'app-studentwiseevaluation',
	templateUrl: './studentwiseevaluation.component.html',
	styleUrls: ['./studentwiseevaluation.component.css']
})
export class StudentwiseevaluationComponent implements OnInit {

	examCompletedDetail: any;
	examDetails: any;
	presentStudentArray: any[] = [];
	qpmarks: any[] = [];
	es_id: number;
	evaluate: any;
	testinfoDiv = false;
	login_id: string;
	ELEMENT_DATA: Element[] = [];
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	displayedColumns = ['position', 'admission', 'name', 'marks', 'status', 'action'];
	dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);

	constructor(private qelementService: QelementService, private route: ActivatedRoute) { }

	ngOnInit() {
		// this.getTeacherInputMarkAll();
		this.es_id = this.route.snapshot.params['id'];
		const currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.login_id = currentUser.login_id;
		this.getExamAttendence();
		this.qelementService.getScheduledExam({ es_id: this.es_id, es_status: 2, login_id: currentUser.login_id }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.examCompletedDetail = result.data[0];
					this.examDetails = result.data[0];
					this.testinfoDiv = true;
				}
			}
		);
	}

	applyFilter(filterValue: string) {
		filterValue = filterValue.trim().toLowerCase(); this.dataSource.filter = filterValue;
	}

	getExamAttendence() {
		const statusArray: any[] = [];
		this.es_id = this.route.snapshot.params['id'];
		this.qelementService.getExamAttendance({ es_id: this.es_id }).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
					this.presentStudentArray = result.data;
					let ind = 1;
					for (let i = 0; i < this.presentStudentArray.length; i++) {
						statusArray[i] = '';
					}
					for (const eitem of this.presentStudentArray) {
						this.qelementService.getScheduledExam({ es_id: this.es_id, es_status: 2 }).subscribe(
							// tslint:disable-next-line:no-shadowed-variable
							(result1: any) => {
								if (result1 && result1.status === 'ok') {
									this.examCompletedDetail = result.data;
									eitem.qpmarks = this.examCompletedDetail[0].tp_marks;

									if (Number(eitem.eva_status) === 2) {
										// tslint:disable-next-line:max-line-length
										statusArray[ind - 1] = statusArray[ind - 1] + '<i class="fas fa-check text-success"></i>&nbsp;<span class="text-success"><b>Evaluated</b><span>';
									} else {
										// tslint:disable-next-line:max-line-length
										statusArray[ind - 1] = statusArray[ind - 1] + '<i class="fas fa-times text-danger"></i>&nbsp;<span class="text-danger"><b>Not Evaluated</b><span>';
									}
									// tslint:disable-next-line:max-line-length
									this.ELEMENT_DATA.push({ position: ind, admission: eitem.eva_login_id, name: eitem.au_full_name, evaluate: this.evaluate, marks: eitem.qpmarks, status: statusArray[ind - 1], action: eitem });
									ind++;
									this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
									this.dataSource.paginator = this.paginator;
								}
							}
						);
					}
				}
			}
		);
	}

	downloadDocuments(urls:string) {
		if(urls.length > 0){
			const urlArr:any[]=urls.split(',');
			urlArr.forEach(url => {
				const length = url.split('/').length;
				saveAs(url, url.split('/')[length - 1]);
			});
			
		}		
	}
}


