import { Component, OnInit, ViewChild } from '@angular/core';
import { QelementService } from '../../questionbank/service/qelement.service';
import { ReportService } from '../../reports/service/report.service';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource, MatSort, Sort, MatPaginator } from '@angular/material';
import { CommonAPIService, SmartService } from '../../_services/index';
import { createTemplateData } from '@angular/core/src/view/refs';

@Component({
  selector: 'app-topicwise-report-overview',
  templateUrl: './topicwise-report-overview.component.html',
  styleUrls: ['./topicwise-report-overview.component.css']
})
export class TopicwiseReportOverviewComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
  reportArray: any[] = [];
	ELEMENT_DATA: ReportElement[] = [];
	dataSource = new MatTableDataSource<ReportElement>(this.ELEMENT_DATA);
  displayedColumns =['position','class','sub','topic','subtopic','qt','qst','count','status'];
  tableCollection = true;
	constructor(
		private qelementService: QelementService,
		private route: ActivatedRoute,
		private reportService: ReportService,
		private common: CommonAPIService,
		private smartService: SmartService
	) { }

	ngOnInit() {
		this.topicWiseReportOverview();
	}

	topicWiseReportOverview() {
    this.ELEMENT_DATA=[];
    this.dataSource = new MatTableDataSource<ReportElement>(this.ELEMENT_DATA);
		this.reportService.topicWiseReportOverview({}).subscribe(
			(result: any) => {
				if (result && result.status === 'ok') {
          this.reportArray = result.data;
          let srno=1;
          this.reportArray.forEach(element => {
            const temdata:any = {};
            temdata.position=srno++;
            temdata.class=element.class_name;
            temdata.sub=element.sub_name;
            temdata.topic=element.topic_name;
            temdata.subtopic=element.st_name;
            temdata.qt=element.typ_name;
            temdata.qst=element.subtype_name;
            temdata.count=element.count_qus_class;
            temdata.status = element.qus_status_name;
            this.ELEMENT_DATA.push(temdata);
          });
					this.dataSource = new MatTableDataSource<ReportElement>(this.ELEMENT_DATA);
          this.dataSource.paginator = this.paginator;
          this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
          this.dataSource.sort = this.sort;
          this.tableCollection = false
				}
			}
		);
	}
	
}
export interface ReportElement {
  position: number;
  class:any;
  sub:any;
  topic:any;
  subtopic:any;
  qt:any;
  qst:any;
  count:any;
  status:any
}