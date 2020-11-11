import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AxiomService, SmartService, SisService, CommonAPIService, FeeService } from '../../../_services';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource, MatPaginator, PageEvent, MatSort, MatPaginatorIntl } from '@angular/material';
import { CapitalizePipe, IndianCurrency } from '../../../_pipes';
import { DatePipe, TitleCasePipe, DecimalPipe } from '@angular/common';
import {
  GridOption, Column, AngularGridInstance, Grouping, Aggregators,
  FieldType,
  Filters,
  Formatters,
  DelimiterType,
  FileType
} from 'angular-slickgrid';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import * as Excel from 'exceljs/dist/exceljs';
import * as ExcelProper from 'exceljs';
import { TranslateService } from '@ngx-translate/core';
import { ErpCommonService } from 'src/app/_services';
declare var require;
const jsPDF = require('jspdf');
import 'jspdf-autotable';


@Component({
  selector: 'app-shift-attendance-report',
  templateUrl: './shift-attendance-report.component.html',
  styleUrls: ['./shift-attendance-report.component.scss']
})
export class ShiftAttendanceReportComponent implements OnInit {
  @ViewChild('paginator') paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
  monthArray: any[] = [];
  currentUser:any;
  session:any;
  acumulativeReport: FormGroup;
  schoolInfo: any;
  nodataFlag=true;
  employeeData: any
	EMPLOYEE_ELEMENT: EmployeeElement[] = [];
	session_id: any = {};
  categoryOneArray: any[] = [];
  holidayArray: any[] = [];
  dateArray: any[] = [];
  emp_shift_arr: any[] = [];
	employeedataSource = new MatTableDataSource<EmployeeElement>(this.EMPLOYEE_ELEMENT);
	//'emp_present',
  displayedEmployeeColumns: string[] = ['emp_code_no', 'emp_name', 'emp_shift','parameters'];
  parameters_arr = ['in','exit','duration','remarks','status'];
  spans = [];
  allemployeeleavearr:any[]=[];
	sessionName: any;
  sessionArray: any[] = [];
  length:any;
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
  constructor(
    public dialog: MatDialog,
    private fbuild: FormBuilder,
    private smartService: SmartService,
    public commonAPIService: CommonAPIService,
    public axiomService: AxiomService,
    public sisService: SisService,
    private erpCommonService: ErpCommonService,
    public feeService: FeeService
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.session = JSON.parse(localStorage.getItem('session'));
  }

  ngOnInit() {
    this.buildForm();
    this.getFeeMonths();
    this.getSchool();
    this.getSession();
  }
  buildForm() {
    this.acumulativeReport = this.fbuild.group({
      month_id: ''
    });

  }
  // get session year of the selected session
	getSession() {
    this.erpCommonService.getSession().subscribe((result2: any) => {
      if (result2.status === 'ok') {
        this.sessionArray = result2.data;
        this.sessionName = this.getSessionName(this.session.ses_id);
      }
    });
  }
  getSessionName(id) {
    const findex = this.sessionArray.findIndex(f => Number(f.ses_id) === Number(id));
    if (findex !== -1) {
      return this.sessionArray[findex].ses_name;
    }
  }
  getFeeMonths() {
    this.monthArray = [];
    this.feeService.getFeeMonths({}).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.monthArray = result.data;
      } else {
      }
    });
  }
  getSchool() {
    this.erpCommonService.getSchool()
      .subscribe(
        (result: any) => {
          if (result && result.status === 'ok') {
            this.schoolInfo = result.data[0];
          }
        });
  }
  getDaysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  };
  getdaystatus(shortdate,element){
    const fdata = element.find(e => e.shortdate == shortdate)
    if(fdata){
      return fdata.data;
    }
    return '';
  }
  getRowSpan(col, index) {
    //console.log('col '+col, 'index'+index);
    return this.spans[index] && this.spans[index][col];
  }
  cacheSpan(key, accessor) {
    //console.log(key, accessor);
    for (let i = 0; i < this.EMPLOYEE_ELEMENT.length;) {
      let currentValue = accessor(this.EMPLOYEE_ELEMENT[i]);
      let count = 1;
      //console.log('currentValue',currentValue);
      // Iterate through the remaining rows to see how many match
      // the current value as retrieved through the accessor.
      for (let j = i + 1; j < this.EMPLOYEE_ELEMENT.length; j++) {
        if (currentValue != accessor(this.EMPLOYEE_ELEMENT[j])) {
          break;
        }
        count++;
      }

      if (!this.spans[i]) {
        this.spans[i] = {};
      }

      // Store the number of similar values that were found (the span)
      // and skip i to the next unique row.
      this.spans[i][key] = count;
      i += count;
    }
  }
  async getShiftAttendanceReport(){

    let inputJson = {
			'month_id': this.acumulativeReport.value.month_id,
			'emp_status': 'all',
			from_attendance: true,
    };
    this.dateArray=[];
    this.EMPLOYEE_ELEMENT = [];
    var no_of_days = this.getDaysInMonth(this.acumulativeReport.value.month_id, new Date().getFullYear());
    const inputJson1: any = {};
    inputJson1.datefrom = new Date().getFullYear() + '-' + this.acumulativeReport.value.month_id + '-1';
    inputJson1.dateto = new Date().getFullYear() + '-' + this.acumulativeReport.value.month_id + '-' + no_of_days;

    await this.smartService.getHolidayOnly(inputJson1).toPromise().then((res: any) => {
      if (res) {
        this.holidayArray = res.data ? res.data : [];
        var date;
        var dateFormate;
        for (let i = 1; i <= no_of_days; i++) {
          this.displayedEmployeeColumns.push(i.toString());
          date = new Date().getFullYear() + '-' + this.acumulativeReport.value.month_id + '-' + ("0" + i).slice(-2);;
          dateFormate = this.commonAPIService.dateConvertion(date, 'y-MM-dd');
          if (i !== 0) {
            const findex = this.holidayArray.indexOf(dateFormate);
            if (findex !== -1) {
              this.dateArray.push({
                date: date,
                attendance: 'H',
                shortdate:i.toString(),
                data:'H'
              });
            } else {
              this.dateArray.push({
                date: date,
                attendance: '',
                shortdate:i.toString(),
                data:''
              });
            }

          }
        }
      }
    });
    await this.commonAPIService.getAllEmployeeLeaveData().toPromise().then((result: any) => {
      if(result) {
        this.allemployeeleavearr = result;
      }
    });
    console.log('dateArray',this.dateArray);
    this.employeedataSource = new MatTableDataSource<EmployeeElement>(this.EMPLOYEE_ELEMENT);
		this.commonAPIService.getAllEmployee(inputJson).subscribe((result1: any) => {
      if(result1 && result1.length > 0) {
        let inputJson = {
          month_id: this.acumulativeReport.value.month_id,
          ses_id:this.session.ses_id,
        };
        this.commonAPIService.getShiftAttendanceAll(inputJson).subscribe((result: any) => {
          if (result) {
            this.emp_shift_arr = result;
            let pos = 0;
            result1.forEach(employeeData => {
              pos++;
              let shift_arr:any[] = [];
              if(employeeData && employeeData.emp_shift_details && employeeData.emp_shift_details.length > 0) {
                employeeData.emp_shift_details.forEach(element => {
                  shift_arr.push(new TitleCasePipe().transform(element.shift_name));
                });				
              }
              this.parameters_arr.forEach(para => {
                let element:any = {
                  srno: pos,
                  emp_code_no: employeeData.emp_code_no ? employeeData.emp_code_no : '-',
                  emp_name: employeeData.emp_name,
                  emp_shift: shift_arr,
                  parameters: para,
                  dateArray:JSON.parse(JSON.stringify(this.dateArray))
                };
                element.dateArray.forEach(dt => {
                  if(dt.attendance == 'H') {
                    if(para == 'in' || para == 'exit' || para == 'duration' || para == 'remarks') {
                      dt.data='';
                    }
                  } else {
                    const shiftdayAtt = this.emp_shift_arr.find(e => e.entrydate == dt.date);
                    if(para == 'in') {
                      if(shiftdayAtt && shiftdayAtt.employeeList && shiftdayAtt.employeeList.length > 0){
                        let temp = shiftdayAtt.employeeList.find(e => e.in == true && e.emp_code_no == employeeData.emp_code_no);
                        if(temp){
                          dt.data = temp.datetime.split(' ')[1];
                          // dt.data = temp.datetime;
                        }
                      }  else {
                        // dt.data = 'A';
                      }
                    }
                    if(para == 'exit') {
                      if(shiftdayAtt && shiftdayAtt.employeeList && shiftdayAtt.employeeList.length > 0){
                        let temp = shiftdayAtt.employeeList.find(e => e.exit == true && e.emp_code_no == employeeData.emp_code_no);
                        if(temp){
                          dt.data = temp.datetime.split(' ')[1];
                          // dt.data = temp.datetime;
                        }
                      }  else {
                        // dt.data = 'A';
                      }
                    }
                    if(para == 'duration') {
                      if(shiftdayAtt && shiftdayAtt.employeeList && shiftdayAtt.employeeList.length > 0){
                        const intm = shiftdayAtt.employeeList.find(e => e.in == true && e.emp_code_no == employeeData.emp_code_no);
                        const exittm = shiftdayAtt.employeeList.find(e => e.exit == true && e.emp_code_no == employeeData.emp_code_no);
                        if(intm && exittm) {
                          var exitdate = new Date(exittm.datetime);
                          var indate = new Date(intm.datetime);
                          const diff = exitdate.getTime()-indate.getTime();
                          let hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                          let minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                          let seconds = Math.floor((diff % (1000 * 60)) / 1000);
                          dt.data = hours + 'h ' + minutes + 'm ' + seconds + 's ';
                        }
                      }  else {
                        // dt.data = 'A';
                      }
                    }
                    if(para == 'remarks') {
                      if(shiftdayAtt && shiftdayAtt.employeeList && shiftdayAtt.employeeList.length > 0){
                        const intm = shiftdayAtt.employeeList.find(e => e.in == true && e.emp_code_no == employeeData.emp_code_no);
                        const exittm = shiftdayAtt.employeeList.find(e => e.exit == true && e.emp_code_no == employeeData.emp_code_no);
                        let remarks = '';
                        if(intm) {
                          remarks += intm.remarks+' ';
                        }
                        if(exittm) {
                          remarks += exittm.remarks+' ';
                        }
                      }  else {
                        // dt.data = 'A';
                      }
                    }
                    if(para == 'status') {
                      let temp;
                      let status='';
                      if(shiftdayAtt && shiftdayAtt.employeeList && shiftdayAtt.employeeList.length > 0){
                        temp = shiftdayAtt.employeeList.find(e => e.shortleave == true && e.emp_code_no == employeeData.emp_code_no);
                        if(temp){
                          status='Shortleave';
                        }
                        temp = shiftdayAtt.employeeList.find(e => e.emp_code_no == employeeData.emp_code_no);
                        if(!temp){
                          let day_emp_leave:any;
                          let emp_leave_arr:any[]=[];
                          if(this.allemployeeleavearr && this.allemployeeleavearr.length > 0) {
                            for(let e of this.allemployeeleavearr) {
                              if(e.leave_emp_detail.emp_id == employeeData.emp_id){
                                emp_leave_arr.push(e)
                              }
                            }
                            console.log('emp_leave_arr',emp_leave_arr);
                            if(emp_leave_arr && emp_leave_arr.length > 0) {
                              for(let item of emp_leave_arr) {
                                if(item.leave_request_schedule_data && item.leave_request_schedule_data.length > 0){
                                  for(let item1 of item.leave_request_schedule_data) {
                                    console.log('item1.date',item1.date);
                                    if(item1.date == dt.date) {

                                      day_emp_leave = item;
                                      console.log('inner, day_emp_leave',day_emp_leave);
                                    }
                                  }
                                }
                              }
                            }

                          }
                          console.log('outer, day_emp_leave',dt.date,day_emp_leave);
                          if(day_emp_leave) {
                            status = day_emp_leave.leave_type.aliasname;
                          } else {
                            status='A';
                          }
                          dt.data=status;
                        }
                      }  else {
                        dt.data = 'A';
                      }
                    }
                  }
                });
                this.EMPLOYEE_ELEMENT.push(element);
              });
            });
            this.employeedataSource = new MatTableDataSource<EmployeeElement>(this.EMPLOYEE_ELEMENT);
            this.employeedataSource.paginator = this.paginator;
            // if (this.sort) {
            // this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
            // this.employeedataSource.sort = this.sort;
            // }
            //this.cacheSpan('srno', d => d.srno);
            this.cacheSpan('emp_code_no', d => d.emp_code_no);
            this.cacheSpan('emp_name', d => d.emp_name);
            this.cacheSpan('emp_shift', d => d.emp_shift);
            console.log('this.EMPLOYEE_ELEMENT',this.EMPLOYEE_ELEMENT)
          }
        });
      }
    });
  }

  getMonthName(id){
    return this.monthArray.find(e => e.fm_id == id).fm_name;
  }
  // export excel code
	exportAsExcel() {
		let reportType: any = '';
		let reportType2: any = '';
    const columns: any = [];
		columns.push({
			key: 'emp_code_no',
			width: this.checkWidth('emp_code_no', 'Emp. No.')
		});
		columns.push({
			key: 'emp_name',
			width: this.checkWidth('emp_name', 'Emp. Name')
		});
		columns.push({
			key: 'emp_shift',
			width: this.checkWidth('emp_shift', 'Shift')
		});
		columns.push({
			key: 'parameters',
			width: this.checkWidth('parameters', 'Parameters')
    });
    if(this.dateArray && this.dateArray.length > 0) {
      this.dateArray.forEach(dt => {
        columns.push({
          key: dt.shortdate.toString(),
          width: this.checkWidth(dt.shortdate.toString(), '08:10')
        });
      });
    }
		reportType = new TitleCasePipe().transform('shift_attendance_report: ' + this.sessionName+'_'+this.getMonthName(this.acumulativeReport.value.month_id));
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
		worksheet.getCell('A6').value = 'Emp. No.';
		worksheet.getCell('B6').value = 'Emp. Name';
		worksheet.getCell('C6').value = 'Shift';
    worksheet.getCell('D6').value = 'Parameters';
    let headerColIndex = 5;
    if(this.dateArray && this.dateArray.length > 0) {
      this.dateArray.forEach(dt => {
        worksheet.getCell(this.alphabetJSON[headerColIndex++]+'6').value = dt.shortdate.toString();
      });
    }
		worksheet.columns = columns;
    this.length = worksheet._rows.length;
    let mergelength = worksheet._rows.length+1;
    console.log(this.length);
		for (const dety of this.EMPLOYEE_ELEMENT) {
      let tshift = dety.emp_shift[0];
      for (let ti = 1; ti < dety.emp_shift.length; ti++) {
        const element = dety.emp_shift[ti];
        tshift += ','+element
        
      }
			const obj: any = {};
      this.length++;
      //worksheet.mergeCells('A' + this.length);
			worksheet.getCell('A' + this.length).value = dety.emp_code_no;
			worksheet.getCell('B' + this.length).value = new TitleCasePipe().transform(dety.emp_name);
			worksheet.getCell('C' + this.length).value = new TitleCasePipe().transform(tshift);
      worksheet.getCell('D' + this.length).value = new TitleCasePipe().transform(dety.parameters);
      headerColIndex = 5;
      if(this.dateArray && this.dateArray.length > 0) {
        this.dateArray.forEach(dt => {
          worksheet.getCell(this.alphabetJSON[headerColIndex++]+this.length).value = this.getdaystatus(dt.shortdate,dety.dateArray)
        });
      }
			worksheet.addRow(obj);
    }

    const parameterslength = this.parameters_arr.length;
    console.log('parameterslength',parameterslength)
    console.log('mergelength',mergelength)
    for (let index = 0; index < this.EMPLOYEE_ELEMENT.length; index=index+parameterslength) {
      worksheet.mergeCells('A'+(mergelength+index)+':A'+(mergelength + index + parameterslength - 1));
      worksheet.mergeCells('B'+(mergelength+index)+':B'+(mergelength + index + parameterslength - 1));
      worksheet.mergeCells('C'+(mergelength+index)+':C'+(mergelength + index + parameterslength - 1));
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
    worksheet.mergeCells('A' + (worksheet._rows.length + 1) + ':' +
      this.alphabetJSON[columns.length] + (worksheet._rows.length + 1));
    worksheet.getCell('A' + worksheet._rows.length).value = 'Generated On: '
      + new DatePipe('en-in').transform(new Date(), 'd-MMM-y');
    worksheet.getCell('A' + worksheet._rows.length).font = {
      name: 'Arial',
      size: 10,
      bold: true
    };

    worksheet.mergeCells('A' + (worksheet._rows.length + 1) + ':' +
      this.alphabetJSON[columns.length] + (worksheet._rows.length + 1));
    worksheet.getCell('A' + worksheet._rows.length).value = 'Generated By: ' + this.currentUser.full_name;
    worksheet.getCell('A' + worksheet._rows.length).font = {
      name: 'Arial',
      size: 10,
      bold: true
    };
		workbook.xlsx.writeBuffer().then(data => {
			const blob = new Blob([data], { type: 'application/octet-stream' });
			saveAs(blob, fileName);
		});

  }
  checkWidth(id, header) {
		const res = this.EMPLOYEE_ELEMENT.map((f) => f[id] !== '-' && f[id] ? f[id].toString().length : 1);
		const max2 = header.toString().length;
		const max = Math.max.apply(null, res);
		return max2 > max ? max2 : max;
	}
	getColor(element) {
		if (element && element.colorCode) {
			return element.colorCode;
		}
	}

	getBorder(element) {
		if (element && element.colorCode) {
			return element.colorCode;
		}
	}


}
export interface EmployeeElement {
	srno: number;
  emp_code_no:string,
	emp_name: string;
	parameters: string;
  emp_shift: any;
  dateArray:any
}
