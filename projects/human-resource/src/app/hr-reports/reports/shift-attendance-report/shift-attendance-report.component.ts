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
  reportdate = new DatePipe('en-in').transform(new Date(), 'd-MMM-y');
  @ViewChild('searchModal') searchModal;
  @ViewChild('paginator') paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
  monthArray: any[] = [];
  currentUser:any;
  session:any;
  filterdata:any;
  reportTypeArr:any[]=['detail', 'consolidate']
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
  parameters_arr = ['in','out','duration','remarks','status'];
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
  
  gridHeight: any;
  monthEntryAvailable = false;
  att_id: any;
  defaultsrc: any;
  columnDefinitions1: Column[] = [];
  exportColumnDefinitions: any[] = [];
  tableFlag = false;
  columnDefinitions: Column[] = [];
  gridOptions: GridOption = {};
  dataset: any[] = [];
  angularGrid: AngularGridInstance;
  dataviewObj: any;
  draggableGroupingPlugin: any;
  gridObj: any;
  totalRow: any;
  requiredAll = true;
  employeeCatDeptAvail = false;
  dataArr: any[] = [];
  groupColumns: any[] = [];
  groupLength: any;
  selectedGroupingFields: string[] = ['', '', ''];
  notFormatedCellArray: any[] = [];

  pdfrowdata: any[] = [];
  levelHeading: any[] = [];
  levelTotalFooter: any[] = [];
  levelSubtotalFooter: any[] = [];
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
      report_type:'',
      month_id: ''
    });

  }
  getReport(){
    if(this.acumulativeReport.value.report_type && this.acumulativeReport.value.month_id) {
      this.getShiftAttendanceReport();
    }
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
    let currSess;
    let serviceName='getAllEmployee';
    if (Number(this.acumulativeReport.value.month_id) === 1 || Number(this.acumulativeReport.value.month_id) === 2 || Number(this.acumulativeReport.value.month_id) === 3) {
      currSess = this.sessionName.split('-')[1];
    } else {
      currSess = this.sessionName.split('-')[0];
    }
    let inputJson:any = {};
    if(this.filterdata){
      inputJson = this.filterdata;
      serviceName = 'getFilterData';
    } else {
      inputJson = {
        'month_id': this.acumulativeReport.value.month_id,
        'emp_status': 'all',
        from_attendance: true,
        year:currSess
      };      
    }
    this.dateArray=[];
    this.EMPLOYEE_ELEMENT = [];
    this.displayedEmployeeColumns = ['emp_code_no', 'emp_name', 'emp_shift','parameters'];;
    
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
        this.displayedEmployeeColumns.push('total_absent');
        this.displayedEmployeeColumns.push('total_present');
      }
    });
    await this.commonAPIService.getAllEmployeeLeaveData().toPromise().then((result: any) => {
      if(result) {
        this.allemployeeleavearr = result;
      }
    });
    console.log('dateArray',this.dateArray);
    this.employeedataSource = new MatTableDataSource<EmployeeElement>(this.EMPLOYEE_ELEMENT);
		this.commonAPIService[serviceName](inputJson).subscribe((result1: any) => {
      if(serviceName == 'getFilterData') {
        result1 = result1.data;
      }
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
              console.log('employeeData',employeeData);
              pos++;
              let shift_arr:any[] = [];
              if(employeeData && employeeData.emp_shift_details && employeeData.emp_shift_details.length > 0) {
                employeeData.emp_shift_details.forEach(element => {
                  shift_arr.push(new TitleCasePipe().transform(element.shift_name));
                });				
              }
              console.log('shift_arr',shift_arr);
              this.parameters_arr.forEach(para => {
                let element:any = {
                  srno: pos,
                  emp_code_no: employeeData.emp_code_no ? employeeData.emp_code_no : '-',
                  emp_name: employeeData.emp_name,
                  emp_shift: shift_arr,
                  parameters: para,
                  dateArray:JSON.parse(JSON.stringify(this.dateArray)),
                  total_absent:0,
                  total_present:0
                };
                element.dateArray.forEach(dt => {
                  if(dt.attendance == 'H') {
                    if(para == 'in' || para == 'out' || para == 'duration' || para == 'remarks') {
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
                    if(para == 'out') {
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
                          remarks += (intm.remarks ? intm.remarks+' ' : '');
                        }
                        if(exittm) {
                          remarks += (exittm.remarks ? exittm.remarks+' ' : '');
                        }
                        dt.data = remarks;
                      }  else {
                        dt.data = '';
                      }
                    }
                    if(para == 'status') {
                      let temp;
                      let status='';
                      if(shiftdayAtt && shiftdayAtt.employeeList && shiftdayAtt.employeeList.length > 0){
                        status='P';
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
                        } else {
                          dt.data=status;
                        }
                      }  else {
                        dt.data = 'A';
                      }
                    }
                  }
                });
                if(para == 'status') {
                  if(element.dateArray && element.dateArray.length > 0){
                    let ab=0;
                    element.dateArray.forEach(e => {
                      if(e.data == 'A') {
                        ab++;
                      }
                    });
                    element.total_absent = ab;
                    element.total_present = this.dateArray.length - ab;
                  }

                } else {
                  element.total_absent = '';
                  element.total_present = '';
                }
                this.EMPLOYEE_ELEMENT.push(element);
              });
              
            });

            if(this.acumulativeReport.value.report_type == 'detail') {
              this.employeedataSource = new MatTableDataSource<EmployeeElement>(this.EMPLOYEE_ELEMENT);
              this.employeedataSource.paginator = this.paginator;
              this.cacheSpan('emp_code_no', d => d.emp_code_no);
              this.cacheSpan('emp_name', d => d.emp_name);
              this.cacheSpan('emp_shift', d => d.emp_shift);
              this.cacheSpan('total_absent', d => d.total_absent);
              this.cacheSpan('total_present', d => d.total_present);
              console.log('this.EMPLOYEE_ELEMENT',this.EMPLOYEE_ELEMENT)
            } else if(this.acumulativeReport.value.report_type == 'consolidate') {
              this.prepareConsolidateReport();
            }
            
          }
        });
      }
    });
  }
  prepareConsolidateReport(){
    if(this.EMPLOYEE_ELEMENT.length > 0){
      this.dataArr = [];
      this.totalRow = {};
      this.columnDefinitions = [];
      this.dataset = [];
      this.tableFlag = false;
      this.nodataFlag = false;
      this.gridOptions = {
        enableDraggableGrouping: true,
        createPreHeaderPanel: true,
        showPreHeaderPanel: true,
        enableHeaderMenu: true,
        preHeaderPanelHeight: 40,
        enableFiltering: true,
        enableSorting: true,
        enableColumnReorder: true,
        createFooterRow: true,
        showFooterRow: true,
        footerRowHeight: 35,
        enableExcelCopyBuffer: true,
        fullWidthRows: true,
        enableAutoTooltip: true,
        enableCellNavigation: true,
        headerMenu: {
          iconColumnHideCommand: 'fas fa-times',
          iconSortAscCommand: 'fas fa-sort-up',
          iconSortDescCommand: 'fas fa-sort-down',
          title: 'Sort'
        },
        exportOptions: {
          sanitizeDataExport: true,
          exportWithFormatter: true
        },
        gridMenu: {
          customItems: [{
            title: 'pdf',
            titleKey: 'Export as PDF',
            command: 'exportAsPDF',
            iconCssClass: 'fas fa-download'
          },
          {
            title: 'excel',
            titleKey: 'Export Excel',
            command: 'exportAsExcel',
            iconCssClass: 'fas fa-download'
          },
          {
            title: 'expand',
            titleKey: 'Expand Groups',
            command: 'expandGroup',
            iconCssClass: 'fas fa-expand-arrows-alt'
          },
          {
            title: 'collapse',
            titleKey: 'Collapse Groups',
            command: 'collapseGroup',
            iconCssClass: 'fas fa-compress'
          },
          {
            title: 'cleargroup',
            titleKey: 'Clear Groups',
            command: 'cleargroup',
            iconCssClass: 'fas fa-eraser'
          }
          ],
          onCommand: (e, args) => {
            if (args.command === 'toggle-preheader') {
              // in addition to the grid menu pre-header toggling (internally), we will also clear grouping
              this.clearGrouping();
            }
            if (args.command === 'exportAsPDF') {
              // in addition to the grid menu pre-header toggling (internally), we will also clear grouping
  
              this.exportAsPDF(this.dataset);
            }
            if (args.command === 'expandGroup') {
              // in addition to the grid menu pre-header toggling (internally), we will also clear grouping
              this.expandAllGroups();
            }
            if (args.command === 'collapseGroup') {
              // in addition to the grid menu pre-header toggling (internally), we will also clear grouping
              this.collapseAllGroups();
            }
            if (args.command === 'cleargroup') {
              // in addition to the grid menu pre-header toggling (internally), we will also clear grouping
              this.clearGrouping();
            }
            if (args.command === 'exportAsExcel') {
              // in addition to the grid menu pre-header toggling (internally), we will also clear grouping
  
              this.exportToExcel(this.dataset);
            }
            if (args.command === 'export-csv') {
              this.exportToFile('csv');
            }
          },
          onColumnsChanged: (e, args) => {
            // this.updateTotalRow(this.angularGrid.slickGrid);
          },
        },
        draggableGrouping: {
          dropPlaceHolderText: 'Drop a column header here to group by the column',
          // groupIconCssClass: 'fa fa-outdent',
          deleteIconCssClass: 'fa fa-times',
          onGroupChanged: (e, args) => {
            this.groupColumns = [];
            this.groupColumns = args.groupColumns;
            this.onGroupChanged(args && args.groupColumns);
            setTimeout(() => {
              // this.updateTotalRow(this.angularGrid.slickGrid);
            }, 100);
          },
          onExtensionRegistered: (extension) => this.draggableGroupingPlugin = extension,
        }
      };
      let repoArray:any[] = [];
      this.columnDefinitions = [];
      this.dataset = [];
      this.columnDefinitions = [
        {
          id: 'srno',
          name: 'SNo.',
          field: 'srno',
          sortable: true,
          maxWidth: 40,
  
        },
        {
          id: 'emp_code_no', name: 'Emp No.', field: 'emp_code_no', sortable: true,
          filterable: true,
          filterSearchType: FieldType.string,
          width: 80
        },
        {
          id: 'full_name', name: 'Full Name', field: 'full_name', sortable: true,
          filterable: true,
          filterSearchType: FieldType.string,
          width: 120
        },
        {
          id: 'emp_shift', name: 'Shift', field: 'emp_shift', sortable: true,
          filterable: true,
          filterSearchType: FieldType.string,
          width: 80
        }
      ];
  
      if (this.EMPLOYEE_ELEMENT.length > 0) {
        //get only status row
        this.EMPLOYEE_ELEMENT.forEach(e => {
          if(e.parameters == 'status') {
            repoArray.push(e);
          }
        });
        let index = 0;
        for (const item of repoArray) {
          if (index === 0) {
            for (const dety of item.dateArray) {
              let date = this.commonAPIService.dateConvertion(dety.date, 'dd-MMM-y')
              let date_name = this.commonAPIService.dateConvertion(dety.date, 'dd');
              this.columnDefinitions.push({
                id: dety.shortdate, name: dety.shortdate, field: dety.shortdate, sortable: true,
                filterable: true,
                filterSearchType: FieldType.string,
                // formatter: this.iconFormatter
              });
            }
            this.columnDefinitions.push({
              id: 'total_absent', name: 'Total Absent', field: 'total_absent', sortable: true,
              filterable: true,
              filterSearchType: FieldType.string
            });
            this.columnDefinitions.push({
              id: 'total_present', name: 'Total Present', field: 'total_present', sortable: true,
              filterable: true,
              filterSearchType: FieldType.string
            });
          }
          const obj: any = {};
          obj['id'] = (index + 1);
          obj['srno'] = (index + 1);
          obj['emp_code_no'] = item.emp_code_no;
          obj['full_name'] = item.emp_name ? new CapitalizePipe().transform(item.emp_name) : '-';
          obj['emp_shift'] = item.emp_shift;
          var dateFormate;
          for (const dety of item.dateArray) {
            obj[dety.shortdate] = dety.data
          }
          obj['total_absent'] = item.total_absent;
          obj['total_present'] = item.total_present;
          this.dataset.push(obj);
          index++;
        }
        this.totalRow = {};
        const obj3: any = {};
        obj3['id'] = 'footer';
        obj3['srno'] = '';
        obj3['full_name'] = 'Totat';
        for (const item of repoArray) {
          for (const dety of item.dateArray) {
            obj3[dety.shortdate]='';
          }
        }
        obj3['total_absent'] = '';
        obj3['total_present'] = '';
        // obj3['total_absent'] = this.dataset.map(t => t['total']).reduce((acc, val) => Number(acc) + Number(val), 0);
        // obj3['total_present'] = this.dataset.map(t => t['total_absent']).reduce((acc, val) => Number(acc) + Number(val), 0);
        this.totalRow = obj3;
        if (this.dataset.length <= 5) {
          this.gridHeight = 300;
        } else if (this.dataset.length <= 10 && this.dataset.length > 5) {
          this.gridHeight = 400;
        } else if (this.dataset.length > 10 && this.dataset.length <= 20) {
          this.gridHeight = 550;
        } else if (this.dataset.length > 20) {
          this.gridHeight = 750;
        }
        this.tableFlag = true;
        this.nodataFlag = false;
      } else {
        this.nodataFlag = true;
        this.tableFlag = true;
      }
    }
  }
  clearGroupsAndSelects() {
    this.selectedGroupingFields.forEach((g, i) => this.selectedGroupingFields[i] = '');
    this.clearGrouping();
  }

  clearGrouping() {
    if (this.draggableGroupingPlugin && this.draggableGroupingPlugin.setDroppedGroups) {
      this.draggableGroupingPlugin.clearDroppedGroups();
    }
  }

  collapseAllGroups() {
    this.dataviewObj.collapseAllGroups();
    //this.updateTotalRow(this.angularGrid.slickGrid);
  }

  expandAllGroups() {
    this.dataviewObj.expandAllGroups();
    //this.updateTotalRow(this.angularGrid.slickGrid);
  }
  onGroupChanged(groups: Grouping[]) {
    if (Array.isArray(this.selectedGroupingFields) && Array.isArray(groups) && groups.length > 0) {
      // update all Group By select dropdown
      this.selectedGroupingFields.forEach((g, i) => this.selectedGroupingFields[i] = groups[i] && groups[i].getter || '');
    }
  }

  showPreHeader() {
    this.gridObj.setPreHeaderPanelVisibility(true);
  }
  iconFormatter(row, cell, value, columnDef, dataContext) {
    if (value !== '-') {
      if (value === 1) {
        return "<i class='fas fa-check' style='color:green'></i>";
      } else if (value === 'h') {
        return '<i class="fas fa-hospital-symbol" style="color:orange"></i>';
      } else {
        return "<i class='fas fa-times' style='color:red'></i>";
      }
    } else {
      return "-";
    }
  }
  selectTrackByFn(index, item) {
    return index;
  }
  openSearchDialog = (data) => { this.searchModal.openModal(data); }
  searchOk($event) {
    this.filterdata = $event;
    this.getShiftAttendanceReport();
  }
  reset(){
    this.filterdata = null;
    this.getShiftAttendanceReport();
  }

  getMonthName(id){
    return this.monthArray.find(e => e.fm_id == id).fm_name;
  }
  exportToExcel(json: any[]) {
    this.notFormatedCellArray = [];
    let reportType: any = '';
    const columns: any[] = [];
    const columValue: any[] = [];
    this.exportColumnDefinitions = [];
    this.exportColumnDefinitions = this.angularGrid.slickGrid.getColumns();
    for (const item of this.exportColumnDefinitions) {
      columns.push({
        key: item.id,
        width: 10
      });
      columValue.push(item.name);
    }
    this.sessionName = this.getSessionName(this.session.ses_id);
    reportType = new TitleCasePipe().transform('employee_attendance_') + this.sessionName;
    let reportType2: any = '';
    reportType2 = new TitleCasePipe().transform('employee attendance report: ') + this.sessionName;
    const fileName =reportType + '_' + this.reportdate +'.xlsx';
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet(reportType, { properties: { showGridLines: true } },
      { pageSetup: { fitToWidth: 7 } });
    worksheet.mergeCells('A1:' + this.alphabetJSON[columns.length] + '1'); // Extend cell over all column headers
    worksheet.getCell('A1').value =
      new TitleCasePipe().transform(this.schoolInfo.school_name) + ', ' + this.schoolInfo.school_city + ', ' + this.schoolInfo.school_state;
    worksheet.getCell('A1').alignment = { horizontal: 'left' };
    worksheet.mergeCells('A2:' + this.alphabetJSON[columns.length] + '2');
    worksheet.getCell('A2').value = reportType2;
    worksheet.getCell(`A2`).alignment = { horizontal: 'left' };
    worksheet.getRow(4).values = columValue;
    worksheet.columns = columns;
    if (this.dataviewObj.getGroups().length === 0) {
      Object.keys(json).forEach(key => {
        const obj: any = {};
        for (const item2 of this.exportColumnDefinitions) {
          obj[item2.id] = this.checkReturn(this.commonAPIService.htmlToText(json[key][item2.id]));

        }
        worksheet.addRow(obj);
      });
    }
    // if (this.totalRow) {
    //   worksheet.addRow(this.totalRow);
    // }
    //style grand total
    // worksheet.getRow(worksheet._rows.length).eachCell(cell => {
    //   this.columnDefinitions.forEach(element => {
    //     cell.font = {
    //       color: { argb: 'ffffff' },
    //       bold: true,
    //       name: 'Arial',
    //       size: 10
    //     };
    //     cell.alignment = { wrapText: true, horizontal: 'center' };
    //     cell.fill = {
    //       type: 'pattern',
    //       pattern: 'solid',
    //       fgColor: { argb: '439f47' },
    //       bgColor: { argb: '439f47' }
    //     };
    //     cell.border = {
    //       top: { style: 'thin' },
    //       left: { style: 'thin' },
    //       bottom: { style: 'thin' },
    //       right: { style: 'thin' }
    //     };
    //   });
    // });
    // style all row of excel
    worksheet.eachRow((row, rowNum) => {
      if (rowNum === 1) {
        row.font = {
          name: 'Arial',
          size: 14,
          bold: true
        };
      } else if (rowNum === 2) {
        row.font = {
          name: 'Arial',
          size: 12,
          bold: true
        };
      } else if (rowNum === 4) {
        row.eachCell((cell) => {
          cell.font = {
            name: 'Arial',
            size: 12,
            bold: true
          };
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'bdbdbd' },
            bgColor: { argb: 'bdbdbd' },
          };
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
          cell.alignment = { horizontal: 'center' };
        });
      } else if (rowNum > 4 && rowNum < worksheet._rows.length+1) {
        const cellIndex = this.notFormatedCellArray.findIndex(item => item === rowNum);
        if (cellIndex === -1) {
          row.eachCell((cell) => {
            cell.font = {
              name: 'Arial',
              size: 10,
            };
            cell.alignment = { wrapText: true, horizontal: 'center' };
          });
          if (rowNum % 2 === 0) {
            row.eachCell((cell) => {
              cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'ffffff' },
                bgColor: { argb: 'ffffff' },
              };
              cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
              };
            });
          } else {
            row.eachCell((cell) => {
              cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'ffffff' },
                bgColor: { argb: 'ffffff' },
              };
              cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
              };
            });
          }

        }
      }
    });

    worksheet.addRow({});
    if (this.groupColumns.length > 0) {
      worksheet.mergeCells('A' + (worksheet._rows.length + 1) + ':' +
        this.alphabetJSON[columns.length] + (worksheet._rows.length + 1));
      worksheet.getCell('A' + worksheet._rows.length).value = 'Groupded As: ' + this.getGroupColumns(this.groupColumns);
      worksheet.getCell('A' + worksheet._rows.length).font = {
        name: 'Arial',
        size: 10,
        bold: true
      };
    }

    worksheet.mergeCells('A' + (worksheet._rows.length + 1) + ':' +
      this.alphabetJSON[columns.length] + (worksheet._rows.length + 1));
    // worksheet.getCell('A' + worksheet._rows.length).value = 'Report Filtered as:' + this.getParamValue();
    worksheet.getCell('A' + worksheet._rows.length).font = {
      name: 'Arial',
      size: 10,
      bold: true
    };

    worksheet.mergeCells('A' + (worksheet._rows.length + 1) + ':' +
      this.alphabetJSON[columns.length] + (worksheet._rows.length + 1));
    worksheet.getCell('A' + worksheet._rows.length).value = 'No of records: ' + json.length;
    worksheet.getCell('A' + worksheet._rows.length).font = {
      name: 'Arial',
      size: 10,
      bold: true
    };

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
  exportToFile(type = 'csv') {
    let reportType: any = '';
    this.sessionName = this.getSessionName(this.session.ses_id);
    reportType = new TitleCasePipe().transform('Accession Master:') + this.sessionName;
    this.angularGrid.exportService.exportToFile({
      delimiter: (type === 'csv') ? DelimiterType.comma : DelimiterType.tab,
      filename: reportType + '_' + new Date(),
      format: (type === 'csv') ? FileType.csv : FileType.txt
    });
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
    columns.push({
			key: 'total_absent',
			width: this.checkWidth('total_absent', 'Total Absent')
    });
    columns.push({
			key: 'total_present',
			width: this.checkWidth('total_present', 'Total Present')
		});
		reportType = new TitleCasePipe().transform('shift_attendance_report: ' + this.sessionName+'_'+this.getMonthName(this.acumulativeReport.value.month_id));
    let reportType1 = new TitleCasePipe().transform('shift Attendance Report: ' + this.sessionName+'_'+this.getMonthName(this.acumulativeReport.value.month_id));
    const fileName =reportType + '_' + this.reportdate +'.xlsx';
		const workbook = new Excel.Workbook();
		const worksheet = workbook.addWorksheet(reportType, { properties: { showGridLines: true } },
			{ pageSetup: { fitToWidth: 7 } });
		worksheet.mergeCells('A1:' + this.alphabetJSON[7] + '1');
		worksheet.getCell('A1').value =
			new TitleCasePipe().transform(this.schoolInfo.school_name) + ', ' + this.schoolInfo.school_city + ', ' + this.schoolInfo.school_state;
		worksheet.getCell('A1').alignment = { horizontal: 'left' };
		worksheet.mergeCells('A2:' + this.alphabetJSON[7] + '2');
		worksheet.getCell('A2').value = reportType1;
		worksheet.getCell(`A2`).alignment = { horizontal: 'left' };
		worksheet.getCell('A4').value = 'Emp. No.';
		worksheet.getCell('B4').value = 'Emp. Name';
		worksheet.getCell('C4').value = 'Shift';
    worksheet.getCell('D4').value = 'Parameters';
    let headerColIndex = 5;
    if(this.dateArray && this.dateArray.length > 0) {
      this.dateArray.forEach(dt => {
        worksheet.getCell(this.alphabetJSON[headerColIndex++]+'4').value = dt.shortdate.toString();
      });
    }
    worksheet.getCell(this.alphabetJSON[headerColIndex++]+'4').value = 'Total Absent';
    worksheet.getCell(this.alphabetJSON[headerColIndex++]+'4').value = 'Total Present';
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
      worksheet.getCell(this.alphabetJSON[headerColIndex++]+this.length).value = dety.total_absent;
      worksheet.getCell(this.alphabetJSON[headerColIndex++]+this.length).value = dety.total_present;
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
			if (rowNum === 4) {
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
			if (rowNum > 4 && rowNum <= worksheet._rows.length) {
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
  exportAsPDF(json: any[]) {
    const headerData: any[] = [];
    this.pdfrowdata = [];
    this.levelHeading = [];
    this.levelTotalFooter = [];
    this.levelSubtotalFooter = [];
    this.exportColumnDefinitions = [];
    this.exportColumnDefinitions = this.angularGrid.slickGrid.getColumns();
    let reportType: any = '';
    this.sessionName = this.getSessionName(this.session.ses_id);
    reportType = new TitleCasePipe().transform('Employee Attendance Report: ') + this.sessionName;
    const doc = new jsPDF('p', 'mm', 'a0');
    doc.autoTable({
      // tslint:disable-next-line:max-line-length
      head: [[new TitleCasePipe().transform(this.schoolInfo.school_name) + ', ' + this.schoolInfo.school_city + ', ' + this.schoolInfo.school_state]],
      didDrawPage: function (data) {

      },
      headStyles: {
        fontStyle: 'bold',
        fillColor: '#ffffff',
        textColor: 'black',
        halign: 'left',
        fontSize: 22,
      },
      useCss: true,
      theme: 'striped'
    });
    doc.autoTable({
      head: [[reportType]],
      margin: { top: 0 },
      didDrawPage: function (data) {

      },
      headStyles: {
        fontStyle: 'bold',
        fillColor: '#ffffff',
        textColor: 'black',
        halign: 'left',
        fontSize: 20,
      },
      useCss: true,
      theme: 'striped'
    });
    const rowData: any[] = [];
    for (const item of this.exportColumnDefinitions) {
      headerData.push(item.name);
    }
    if (this.dataviewObj.getGroups().length === 0) {
      Object.keys(this.dataset).forEach((key: any) => {
        const arr: any[] = [];
        for (const item2 of this.exportColumnDefinitions) {
          arr.push(this.commonAPIService.htmlToText(this.dataset[key][item2.id]));
        }
        rowData.push(arr);
        this.pdfrowdata.push(arr);
      });
    }
    // if (this.totalRow) {
    //   const arr: any[] = [];
    //   for (const item of this.exportColumnDefinitions) {
    //     arr.push(this.totalRow[item.id]);
    //   }
    //   rowData.push(arr);
    //   this.pdfrowdata.push(arr);
    // }
    doc.levelHeading = this.levelHeading;
    doc.levelTotalFooter = this.levelTotalFooter;
    doc.levelSubtotalFooter = this.levelSubtotalFooter;
    doc.autoTable({
      head: [headerData],
      body: this.pdfrowdata,
      startY: doc.previousAutoTable.finalY + 0.5,
      tableLineColor: 'black',
      didDrawPage: function (data) {
        doc.setFontStyle('bold');

      },
      willDrawCell: function (data) {
        const doc = data.doc;
        const rows = data.table.body;

        // level 0
        const lfIndex = doc.levelTotalFooter.findIndex(item => item === data.row.index);
        if (lfIndex !== -1) {
          doc.setFontStyle('bold');
          doc.setFontSize('18');
          doc.setTextColor('#ffffff');
          doc.setFillColor(0, 62, 120);
        }

        // level more than 0
        const lsfIndex = doc.levelSubtotalFooter.findIndex(item => item === data.row.index);
        if (lsfIndex !== -1) {
          doc.setFontStyle('bold');
          doc.setFontSize('18');
          doc.setTextColor('#ffffff');
          doc.setFillColor(229, 136, 67);
        }

        // group heading
        const lhIndex = doc.levelHeading.findIndex(item => item === data.row.index);
        if (lhIndex !== -1) {
          doc.setFontStyle('bold');
          doc.setFontSize('18');
          doc.setTextColor('#5e666d');
          doc.setFillColor('#c8d6e5');
        }
        // grand total
        // if (data.row.index === rows.length - 1) {
        //   doc.setFontStyle('bold');
        //   doc.setFontSize('18');
        //   doc.setTextColor('#ffffff');
        //   doc.setFillColor(67, 160, 71);
        // }
      },
      headStyles: {
        fontStyle: 'bold',
        fillColor: '#c8d6e5',
        textColor: '#5e666d',
        fontSize: 18,
      },
      alternateRowStyles: {
        fillColor: '#f1f4f7'
      },
      useCss: true,
      styles: {
        fontSize: 18,
        cellWidth: 'auto',
        textColor: 'black',
        lineColor: '#89a8c8',
      },
      theme: 'grid'
    });
    if (this.groupColumns.length > 0) {
      doc.autoTable({
        // tslint:disable-next-line:max-line-length
        head: [['Groupded As:  ' + this.getGroupColumns(this.groupColumns)]],
        didDrawPage: function (data) {

        },
        headStyles: {
          fontStyle: 'bold',
          fillColor: '#ffffff',
          textColor: 'black',
          halign: 'left',
          fontSize: 20,
        },
        useCss: true,
        theme: 'striped'
      });
    }
    doc.autoTable({
      // tslint:disable-next-line:max-line-length
      head: [['No of records: ' + json.length]],
      didDrawPage: function (data) {

      },
      headStyles: {
        fontStyle: 'bold',
        fillColor: '#ffffff',
        textColor: 'black',
        halign: 'left',
        fontSize: 20,
      },
      useCss: true,
      theme: 'striped'
    });
    doc.autoTable({
      // tslint:disable-next-line:max-line-length
      head: [['Generated On: '
        + new DatePipe('en-in').transform(new Date(), 'd-MMM-y')]],
      didDrawPage: function (data) {

      },
      headStyles: {
        fontStyle: 'bold',
        fillColor: '#ffffff',
        textColor: 'black',
        halign: 'left',
        fontSize: 20,
      },
      useCss: true,
      theme: 'striped'
    });
    doc.autoTable({
      // tslint:disable-next-line:max-line-length
      head: [['Generated By: ' + new TitleCasePipe().transform(this.currentUser.full_name)]],
      didDrawPage: function (data) {

      },
      headStyles: {
        fontStyle: 'bold',
        fillColor: '#ffffff',
        textColor: 'black',
        halign: 'left',
        fontSize: 20,
      },
      useCss: true,
      theme: 'striped'
    });
    doc.save(reportType + '_' + this.reportdate + '.pdf');
  }
  getGroupColumns(columns) {
    let grName = '';
    for (const item of columns) {
      for (const titem of this.columnDefinitions) {
        if (item.getter === titem.id) {
          grName = grName + titem.name + ',';
          break;
        }
      }
    }
    return grName.substring(0, grName.length - 1);
  }
  checkReturn(data) {
    if (Number(data)) {
      return Number(data);
    } else {
      return data;
    }
  }
  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.gridObj = angularGrid.slickGrid; // grid object
    this.dataviewObj = angularGrid.dataView;
    //this.updateTotalRow(angularGrid.slickGrid);
  }


}
export interface EmployeeElement {
	srno: number;
  emp_code_no:string,
	emp_name: string;
	parameters: string;
  emp_shift: any;
  dateArray:any;
  total_absent:number;
  total_present:number;
}
