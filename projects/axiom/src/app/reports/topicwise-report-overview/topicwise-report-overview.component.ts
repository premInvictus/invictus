import { Component, OnInit, ViewChild } from '@angular/core';
import { QelementService } from '../../questionbank/service/qelement.service';
import { ReportService } from '../../reports/service/report.service';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource, MatSort, Sort, MatPaginator } from '@angular/material';
import { CommonAPIService, SmartService } from '../../_services/index';
import { createTemplateData } from '@angular/core/src/view/refs';
import { TitleCasePipe, DatePipe } from '@angular/common';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
declare var require;
import * as Excel from 'exceljs/dist/exceljs';
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

  schoolInfo: any;
	session: any;
	sessionName: any;
	sessionArray: any[] = [];
	currentUser: any;
	session_id: any;
	length: any;
	alphabetJSON = {
		1: 'A',
		2: 'B',
		3: 'C',
		4: 'D',
		5: 'E',
		6: 'F',
		7: 'G',
		8: 'H',
		9: 'I',
		10: 'J',
		11: 'K',
		12: 'L',
		13: 'M',
		14: 'N',
		15: 'O',
		16: 'P',
		17: 'Q',
		18: 'R',
		19: 'S',
		20: 'T',
		21: 'U',
		22: 'V',
		23: 'W',
		24: 'X',
		25: 'Y',
		26: 'Z',
		27: 'AA',
		28: 'AB',
		29: 'AC',
		30: 'AD',
		31: 'AE',
		32: 'AF',
		33: 'AG',
		34: 'AH',
		35: 'AI',
		36: 'AJ',
		37: 'AK',
		38: 'AL',
		39: 'AM',
		40: 'AN',
		41: 'AO',
		42: 'AP',
		43: 'AQ',
		44: 'AR',

  };
  norecord = 0;
	constructor(
		private qelementService: QelementService,
		private route: ActivatedRoute,
		private reportService: ReportService,
		private common: CommonAPIService,
		private smartService: SmartService
	) { }

	ngOnInit() {
    this.session_id = JSON.parse(localStorage.getItem('session'));
    this.getSchool();
    this.getSession();
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
				} else {
          this.norecord=1;
        }
			}
		);
  }
  applyFilter(filterValue: string) {
		filterValue = filterValue.trim(); // Remove whitespace
		filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
		this.dataSource.filter = filterValue;
  }
  getMaxlenght(key){
    let maxStringLength=0;
    this.ELEMENT_DATA.forEach(cell => {
      const value = cell[key];
      if(value){
        if(maxStringLength<value.toString().length){
          maxStringLength=value.toString().length;
        }
      }
      
    });
    return maxStringLength;
  }
  // export excel code
	exportAsExcel() {
		let reportType: any = '';
		let reportType2: any = '';
    const columns: any = [];
    columns.push({key:'position'});
    columns.push({key:'class'});
    columns.push({key:'sub',width:this.getMaxlenght('sub')});
    columns.push({key:'topic',width:this.getMaxlenght('topic')});
    columns.push({key:'subtopic',width:this.getMaxlenght('subtopic')});
    columns.push({key:'qt'});
    columns.push({key:'qst'});
    columns.push({key:'count'});
    columns.push({key:'status'});
		
		reportType = new TitleCasePipe().transform('Topicwise Report Overview: ' + this.sessionName);
		const fileName = reportType + '.xlsx';
		const workbook = new Excel.Workbook();
		const worksheet = workbook.addWorksheet(reportType, { properties: { showGridLines: true } },
			{ pageSetup: { fitToWidth: 7 } });
		worksheet.mergeCells('A1:' + this.alphabetJSON[7] + '1');
		worksheet.getCell('A1').value =
			new TitleCasePipe().transform(this.schoolInfo.school_name) + ', ' + this.schoolInfo.school_city + ', ' + this.schoolInfo.school_state;
		worksheet.getCell('A1').alignment = { horizontal: 'left' };
		worksheet.mergeCells('A2:' + this.alphabetJSON[7] + '2');
		worksheet.getCell('A2').value = reportType;
		worksheet.getCell(`A2`).alignment = { horizontal: 'left' };
	
		worksheet.getCell('A6').value = 'SNo.';
		worksheet.getCell('B6').value = 'Class';
		worksheet.getCell('C6').value = 'Subject';
		worksheet.getCell('D6').value = 'Topic';
		worksheet.getCell('E6').value = 'Subtopic';
		worksheet.getCell('F6').value = 'Question Type';
		worksheet.getCell('G6').value = 'Question Subtype';
		worksheet.getCell('H6').value = 'No. of Question';
		worksheet.getCell('I6').value = 'Status';
		worksheet.columns = columns;
		this.length = worksheet._rows.length;
		for (const dety of this.ELEMENT_DATA) {
			const prev = this.length + 1;
			const obj: any = {};
			this.length++;
			worksheet.getCell('A' + this.length).value = dety.position;
			worksheet.getCell('B' + this.length).value = dety.class;
			worksheet.getCell('C' + this.length).value = dety.sub;
			worksheet.getCell('D' + this.length).value = dety.topic;
			worksheet.getCell('E' + this.length).value = dety.subtopic;
			worksheet.getCell('F' + this.length).value = dety.qt;
			worksheet.getCell('G' + this.length).value = dety.qst;
			worksheet.getCell('H' + this.length).value = dety.count;
			worksheet.getCell('I' + this.length).value = dety.status;
			worksheet.addRow(obj);
		}

		worksheet.eachRow((row, rowNum) => {
			if (rowNum === 1) {
				row.font = {
					name: 'Arial',
					size: 16,
					bold: true
				};
			}
			if (rowNum === 2) {
				row.font = {
					name: 'Arial',
					size: 14,
					bold: true
				};
			}
			if (rowNum === 6) {
				row.eachCell(cell => {
					cell.font = {
						name: 'Arial',
						size: 10,
						bold: true,
						color: { argb: '636a6a' }
					};
					cell.fill = {
						type: 'pattern',
						pattern: 'solid',
						fgColor: { argb: 'c8d6e5' },
						bgColor: { argb: 'c8d6e5' },
					};
					cell.border = {
						top: { style: 'thin' },
						left: { style: 'thin' },
						bottom: { style: 'thin' },
						right: { style: 'thin' }
					};
					cell.alignment = { horizontal: 'center', vertical: 'top', wrapText: true };
				});
			}
			if (rowNum > 6 && rowNum <= worksheet._rows.length) {
				row.eachCell(cell => {
					// tslint:disable-next-line: max-line-length
					if (cell._address.charAt(0) !== 'A' && cell._address.charAt(0) !== 'F' && cell._address.charAt(0) !== 'J' && cell._address.charAt(0) !== 'L') {
						cell.fill = {
							type: 'pattern',
							pattern: 'solid',
							fgColor: { argb: 'ffffff' },
							bgColor: { argb: 'ffffff' },
						};
					}
					cell.font = {
						color: { argb: 'black' },
						bold: false,
						name: 'Arial',
						size: 10
					};
					cell.border = {
						top: { style: 'thin' },
						left: { style: 'thin' },
						bottom: { style: 'thin' },
						right: { style: 'thin' }
					};
					cell.alignment = { horizontal: 'center', vertical: 'top', wrapText: true };
				});
			}
		});

		worksheet.eachRow((row, rowNum) => {
			if (rowNum === worksheet._rows.length) {
				row.eachCell(cell => {
					cell.fill = {
						type: 'pattern',
						pattern: 'solid',
						fgColor: { argb: '004261' },
						bgColor: { argb: '004261' },
					};
					cell.font = {
						color: { argb: 'ffffff' },
						bold: true,
						name: 'Arial',
						size: 10
					};
					cell.border = {
						top: { style: 'thin' },
						left: { style: 'thin' },
						bottom: { style: 'thin' },
						right: { style: 'thin' }
					};
					cell.alignment = { horizontal: 'center' };
				});
			}
		});
		workbook.xlsx.writeBuffer().then(data => {
			const blob = new Blob([data], { type: 'application/octet-stream' });
			saveAs(blob, fileName);
		});

	}
	// check the max  width of the cell
	checkWidth(id, header) {
		const res = this.ELEMENT_DATA.map((f) => f[id] !== '-' && f[id] ? f[id].toString().length : 1);
		const max2 = header.toString().length;
		const max = Math.max.apply(null, res);
		return max2 > max ? max2 : max;
  }
  getSession() {
		this.common.getSession()
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						for (const citem of result.data) {
							this.sessionArray[citem.ses_id] = citem.ses_name;
						}
						this.sessionName = this.sessionArray[this.session_id.ses_id];
					}
				});
  }
  getSchool() {
		this.common.getSchool()
			.subscribe(
				(result: any) => {
					if (result && result.status === 'ok') {
						this.schoolInfo = result.data[0];
					}
				});
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