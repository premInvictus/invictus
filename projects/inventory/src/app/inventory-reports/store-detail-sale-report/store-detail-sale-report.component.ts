import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { CommonAPIService, InventoryService } from '../../_services';
import { DatePipe, DecimalPipe, TitleCasePipe } from '@angular/common';
import { CapitalizePipe, IndianCurrency } from 'src/app/_pipes';
import { ErpCommonService } from 'src/app/_services';
import { FormBuilder, FormGroup } from '@angular/forms';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import * as Excel from 'exceljs/dist/exceljs';
import * as ExcelProper from 'exceljs';
declare var require;
const jsPDF = require('jspdf');
import 'jspdf-autotable';
import {
  GridOption, Column, AngularGridInstance, Grouping, Aggregators,
  FieldType,
  Filters,
  Sorters,
  SortDirectionNumber,
  Formatters
} from 'angular-slickgrid';

@Component({
  selector: 'store-detail-sale-report',
  templateUrl: './store-detail-sale-report.component.html',
  styleUrls: ['./store-detail-sale-report.component.css']
})
export class StoreDetailSaleReportComponent implements OnInit {

  today = new Date();
  @ViewChild('billDetailsModal') billDetailsModal;
  @ViewChild('deleteWithReasonModal') deleteWithReasonModal;
  @ViewChild('searchModal') searchModal;
  @Input() userName: any = '';
  rowsChosen: any[] = [];
  rowChosenData: any[] = [];
  assignListArray: any[] = [];
  notFormatedCellArray: any[] = [];
  pdfrowdata: any[] = [];
  levelHeading: any[] = [];
  levelTotalFooter: any[] = [];
  levelSubtotalFooter: any[] = [];
  reportTypeArray: any[] = [];
  gridHeight: any;
  finalSet: any[] = [];
  reportType = '1';
  gridObj: any;
  filterFlag = false;
  filterResult: any[] = [];
  sortResult: any[] = [];
  totalRow: any;
  aggregatearray: any[] = [];
  feeHeadJson: any[] = [];
  groupColumns: any[] = [];
  groupLength: any;
  submitParam: any = {};
  exportColumnDefinitions: any[] = [];
  reportFilterForm: FormGroup;
  allEmployee: any[] = [];
  // @Output() displyRep = new EventEmitter();
  columnDefinitions1: Column[] = [];
  columnDefinitions2: Column[] = [];
  gridOptions: GridOption = {};
  gridOptions1: GridOption;
  gridOptions2: GridOption;
  tableFlag = false;
  dataset: any[] = [];
  dataset1: any[];
  dataset2: any[];
  selectedGroupingFields: string[] = ['', '', ''];
  draggableGroupingPlugin: any;
  dataviewObj: any;
  angularGrid: AngularGridInstance;
  dataArr: any[] = [];
  columnDefinitions: Column[] = [];
  nodataFlag = true;
  sessionArray: any[] = [];
  sessionName: any;
  currentUser: any;
  session: any;
  itemData: any[] = [];
  schoolInfo: any;
  objectFilter: any = {};
  isLoading: boolean = false;
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
  locationArray: any[] = [];
  constructor(private fbuild: FormBuilder, private inventory: InventoryService, public CommonService: CommonAPIService,
    private erpCommonService: ErpCommonService, ) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.session = JSON.parse(localStorage.getItem('session'));
  }

  ngOnInit() {
    this.allStoreIncharge();
    this.getSchool();
    this.getSession();
    this.buildForm();
    this.inventory.searchItemsFromMaster({}).subscribe((res: any) => {
      if (res && res.status === 'ok') {
        // this.displayList(res.data);
        this.itemData = res.data;
        
      }
    });
    this.erpCommonService.getAllEmployee({}).subscribe((res:any) => {
      console.log("--------------------", res);
      this.allEmployee = res;
    })
  }
  buildForm() {
    this.reportFilterForm = this.fbuild.group({
      'report_type': '',
      'location_id': '',
      'locationid': '',
      'status': '',
      'from_date': this.today,
      'to_date': this.today,
    });
  }
  searchLocationByName($event) {
    if (Number($event.keyCode) !== 40 && Number($event.keyCode) !== 38) {
      if ($event.target.value !== '' && $event.target.value.length >= 3) {
        const inputJson = {
          "filter": $event.target.value,
        };
        this.locationArray = [];
        this.inventory.getParentLocationOnly(inputJson).subscribe((result: any) => {
          if (result) {
            this.locationArray = result;
          }
        });
      }
    }
  }

  getLocationId(item: any) {
    this.reportFilterForm.patchValue({
      location_id: item.location_name,
      locationid: item.location_id
    });
  }
  getSession() {
    this.erpCommonService.getSession().subscribe((result2: any) => {
      if (result2.status === 'ok') {
        this.sessionArray = result2.data;
        this.sessionName = this.getSessionName(this.session.ses_id);
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
  allStoreIncharge() {
    this.inventory.allStoreIncharge({}).subscribe((result: any) => {
      if (result) {
        this.assignListArray = result;
      }
    });
  }
  resetValues() {
    this.reportFilterForm.patchValue({
      'report_type': '',
      'location_id' : '',
      'locationid': '',
      'status': '',
      'from_date': '',
      'to_date': '',
    });
    this.dataset = [];
    this.tableFlag = false;
  }
  
  changeReportType() {
    console.log("i am here", this.objectFilter);
    this.isLoading = true;
    if (this.reportFilterForm.valid) {
      this.dataArr = [];
      this.totalRow = {};
      this.columnDefinitions = [];
      Object.keys(this.reportFilterForm).forEach((k) => this.reportFilterForm[k] == null && delete this.reportFilterForm[k]);
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
        enableCheckboxSelector: true,
        checkboxSelector: {
          columnId: 'checkbox_select'
        },
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
              // this.exportToFile('csv');
            }
          },
          onColumnsChanged: (e, args) => {
            this.updateTotalRow(this.angularGrid.slickGrid);
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
              this.updateTotalRow(this.angularGrid.slickGrid);
            }, 100);
          },
          onExtensionRegistered: (extension) => this.draggableGroupingPlugin = extension,
        }
      };
      let repoArray = [];
      this.columnDefinitions = [];
      this.dataset = [];
      this.columnDefinitions = [
        {
          id: 'srno',
          name: 'SNo.',
          field: 'srno',
          sortable: true,
          width: 15,

        },
        {
          id: 'receipt_date', name: 'Date', field: 'receipt_date', sortable: true,
          filterable: true,
          filterSearchType: FieldType.string,
          width: 40,
          grouping: {
            getter: 'receipt_date',
            formatter: (g) => {
              return `${g.value}  <span style="color:green">(${g.count})</span>`;
            },
            aggregators: this.aggregatearray,
            aggregateCollapsed: true,
            collapsed: false
          },
        },
        {
          id: 'receipt_no', name: 'Receipt No.', field: 'receipt_no', sortable: true,
          filterable: true,
          filterSearchType: FieldType.string,
          width: 25,
          formatter: this.receiptFormatter,
          grouping: {
            getter: 'receipt_no',
            formatter: (g) => {
              return `${g.value}  <span style="color:green">(${g.count})</span>`;
            },
            aggregators: this.aggregatearray,
            aggregateCollapsed: true,
            collapsed: false
          },
        },
        {
          id: 'item_code', name: 'Item', field: 'item_code', sortable: true,
          filterable: true,
          filterSearchType: FieldType.string,
          width: 40,
          grouping: {
            getter: 'item_code',
            formatter: (g) => {
              return `${g.value}  <span style="color:green">(${g.count})</span>`;
            },
            aggregators: this.aggregatearray,
            aggregateCollapsed: true,
            collapsed: false
          },
        },
        
        
        {
          id: 'location', name: 'Location', field: 'location', sortable: true,
          filterable: true,
          filterSearchType: FieldType.string,
          grouping: {
            getter: 'location',
            formatter: (g) => {
              return `${g.value}  <span style="color:green">(${g.count})</span>`;
            },
            aggregators: this.aggregatearray,
            aggregateCollapsed: true,
            collapsed: false
          },
        },
        
        {
          id: 'class', name: 'Class', field: 'class', sortable: true,
          filterable: true,
          filterSearchType: FieldType.string,
          grouping: {
            getter: 'class',
            formatter: (g) => {
              return `${g.value}  <span style="color:green">(${g.count})</span>`;
            },
            aggregators: this.aggregatearray,
            aggregateCollapsed: true,
            collapsed: false,
          },
        },
        
        {
          id: 'rate', name: 'Rate', field: 'rate', sortable: true,
          filterable: true,
          filterSearchType: FieldType.string,
          width: 25,
        }
        ,
        {
          id: 'count', name: 'Qty', field: 'count', sortable: true,
          filterable: true,
          filterSearchType: FieldType.string,
          width: 25,
        }
        // ,
        // {
        //   id: 'contact', name: 'Contact No.', field: 'contact', sortable: true,
        //   filterable: true,
        //   filterSearchType: FieldType.string,
        // }
        ,
        {
          id: 'bill_total', name: 'Amount', field: 'bill_total', sortable: true,
          filterable: true,
          filterSearchType: FieldType.string,
          width: 40,
          groupTotalsFormatter: this.sumTotalsFormatter,
          formatter: this.checkTotalFormatter,
        },
        {
          id: 'emp_id', name: 'Sold To', field: 'emp_id', sortable: true,
          filterable: true,
          filterSearchType: FieldType.string,
          width: 25,
          grouping: {
            getter: 'emp_id',
            formatter: (g) => {
              return `${g.value}  <span style="color:green">(${g.count})</span>`;
            },
            aggregators: this.aggregatearray,
            aggregateCollapsed: true,
            collapsed: false
          },
        },
        {
          id: 'dept_id', name: 'Department', field: 'dept_id', sortable: true,
          filterable: true,
          filterSearchType: FieldType.string,
          width: 25,
          grouping: {
            getter: 'dept_id',
            formatter: (g) => {
              return `${g.value}  <span style="color:green">(${g.count})</span>`;
            },
            aggregators: this.aggregatearray,
            aggregateCollapsed: true,
            collapsed: false
          },
        },
        {
          id: 'mop', name: 'MOP', field: 'mop', sortable: true,
          filterable: true,
          filterSearchType: FieldType.string,
        },
        {
          id: 'status', name: 'Status', field: 'status', sortable: true,
          filterable: true,
          filterSearchType: FieldType.string,
          grouping: {
            getter: 'status',
            formatter: (g) => {
              return `${g.value}  <span style="color:green">(${g.count})</span>`;
            },
            aggregators: this.aggregatearray,
            aggregateCollapsed: true,
            collapsed: false,
          },
        },
        {
          id: 'created_by', name: 'Created By', field: 'created_by', sortable: true,
          filterable: true,
          filterSearchType: FieldType.string,
          grouping: {
            getter: 'created_by',
            formatter: (g) => {
              return `${g.value}  <span style="color:green">(${g.count})</span>`;
            },
            aggregators: this.aggregatearray,
            aggregateCollapsed: true,
            collapsed: false,
          },
        }
        
      ];
      let inputJson: any = {};
      inputJson = {
        "status": this.reportFilterForm.value.status,
        "item_location": this.reportFilterForm.value.locationid,
        "from_date": new DatePipe('en-in').transform(this.reportFilterForm.value.from_date, 'yyyy-MM-dd'),
        "to_date": new DatePipe('en-in').transform(this.reportFilterForm.value.to_date, 'yyyy-MM-dd')
      }
      this.inventory.storeCollection(inputJson).subscribe((result: any) => {
        this.isLoading = false;
        if (result) {
          repoArray = result;
          let ind = 0;
          for (let item of repoArray) 
          {
            for (let data of item.bill_details) 
            {
              // let count = item.bill_details.reduce((a,b) => a += b.item_quantity,0)
              let data_pic:any = {};
              for(let data_i of this.itemData) {
                if(data_i.item_code == data.item_code) {
                  data_pic = data_i;
                  break;
                }
              }
              let data_imp:any = {};
              for(let data_i of this.allEmployee) {
                if(data_i.emp_login_id == item.created_by) {
                  data_imp = data_i;
                  break;
                }
                // console.log("i amhere", data_i.emp_login_id, data.created_by);
              }
              
              let obj: any = {};
              obj['id'] = ind;
              obj['dept_id'] = data_pic.item_category.name;
              obj['item_code'] = data.item_code + ' - ' + data.item_name;
              obj['srno'] = ind + 1;
              obj['rate'] = data.item_selling_price
              obj['receipt_no'] = item.bill_no;
              obj['receipt_date'] = item.created_date ? this.CommonService.dateConvertion(item.created_date, 'dd-MMM-y') : '-';
              if (item.buyer_details.au_role_id == 3) {
                obj['emp_id'] = 'E - ' + item.buyer_details.emp_id + ' - ' + item.buyer_details.au_full_name;
                obj['name'] = item.buyer_details.au_full_name;
                obj['contact'] = item.buyer_details.au_mobile;
              }
              else if (item.buyer_details.au_role_id == 4) {
                obj['emp_id'] =   ((item.buyer_details.em_admission_no != 0) ? ('S - '+ item.buyer_details.em_admission_no): ('P - '+ item.buyer_details.em_provisional_admission_no))  + ' - ' + item.buyer_details.au_full_name;
                obj['name'] = item.buyer_details.au_full_name;
                obj['contact'] = item.buyer_details.active_contact;
              } else {
                obj['emp_id'] =   'O - Nilesh Shukla';
                obj['name'] = item.buyer_details.au_full_name;
                obj['contact'] = item.buyer_details.active_contact;
                
              }
              obj['count'] = data.item_quantity + ' - ' + (data_pic.item_units.name ? data_pic.item_units.name: data_pic.item_units.id);
              obj['location'] = item.location_details.length > 0 ? item.location_details[0].location_id +' - '+item.location_details[0].location_hierarchy : '' ;
              obj['action'] = item;
              obj['class'] = (item.buyer_details.class_name? item.buyer_details.class_name: '')+'-'+(item.buyer_details.sec_name? item.buyer_details.sec_name: '');
              obj['mop'] = new TitleCasePipe().transform(item.mop);
              obj['status'] = new TitleCasePipe().transform(item.status);
              obj['bill_total'] = new TitleCasePipe().transform(item.status) == 'Canceled'?  -data.total_price:data.total_price ;
              obj['au_role_id'] = item.buyer_details.au_role_id;
              obj['bill_details'] = item.bill_details;
              obj['bill_remarks'] = item.bill_remarks;
              obj['created_by'] = data_imp.emp_name;
              let isAvailable = true;
              if(Object.keys(this.objectFilter).length > 0) {
                if(this.objectFilter.created_by) {
                  if(!this.objectFilter.created_by.includes(obj['created_by']) && !this.objectFilter.created_by.includes(item.created_by)) {
                    isAvailable = false
                  }
                }
                if(this.objectFilter.item_code) {
                  if(!this.objectFilter.item_code.includes(obj['dept_id'])) {
                    isAvailable = false
                  }
                }
                if(this.objectFilter.item_location) {
                  console.log("-----------------------", this.objectFilter.item_location, item.location_details[0].location_id);
                  
                  if(!this.objectFilter.item_location.includes(item.location_details[0].location_id)) {
                    isAvailable = false
                  }
                }
                
              } else {
                isAvailable = true;
              }
              if(isAvailable) {
                this.dataset.push(obj);
                ind++;
              }
              
            }
          }
          this.totalRow = {};
          const obj3: any = {};
          obj3['id'] = 'footer';
          obj3['srno'] = '';
          obj3['receipt_no'] = 'Grand Total';
          obj3['receipt_date'] = '';
          obj3['emp_id'] = '';
          obj3['name'] = '';
          obj3['contact'] = '';
          obj3['count'] = '';
          obj3['rate'] = '';
          obj3['item_code'] = '';
          obj3['location'] = '';
          obj3['class'] = '';
          obj3['mop'] = '';
          obj3['dept_id'] = '';
          obj3['status'] = '';
          obj3['created_by'] = '';
          obj3['bill_total'] = new IndianCurrency().transform(this.dataset.map(t => t['bill_total']).reduce((acc, val) => Number(acc) + Number(val), 0));
          this.totalRow = obj3;
          this.aggregatearray.push(new Aggregators.Sum('bill_total'));
          if (this.dataset.length <= 5) {
            this.gridHeight = 350;
          } else if (this.dataset.length <= 10 && this.dataset.length > 5) {
            this.gridHeight = 450;
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
        setTimeout(() => this.groupByPaymentMode(), 2);
				setTimeout(() => this.groupByBankName(), 2);
        this.objectFilter = {}
      });
    } else {
      this.CommonService.showSuccessErrorMessage('Please fill all required fields', 'error');
    }

  }
  groupByPaymentMode() {
		this.dataviewObj.setGrouping({
			getter: 'receipt_date',
			formatter: (g) => {
				return `<b>${g.value}</b><span style="color:green"> (${g.count})</span>`;
			},
			comparer: (a, b) => {
				// (optional) comparer is helpful to sort the grouped data
				// code below will sort the grouped value in ascending order
        
				return Sorters.date(a, b, SortDirectionNumber.desc);
			},
			aggregators: this.aggregatearray,
			aggregateCollapsed: true,
			collapsed: false,
		});
		this.draggableGroupingPlugin.setDroppedGroups('receipt_date');
	}
	groupByBankName() {
		this.dataviewObj.setGrouping({
			getter: 'receipt_no',
			formatter: (g) => {
				return `<b>${g.value}</b><span style="color:green"> (${g.count})</span>`;
			},
			comparer: (a, b) => {
				// (optional) comparer is helpful to sort the grouped data
				// code below will sort the grouped value in ascending order
				return Sorters.string(a.value, b.value, SortDirectionNumber.desc);
			},
			aggregators: this.aggregatearray,
			aggregateCollapsed: true,
			collapsed: false,
		});
		this.draggableGroupingPlugin.setDroppedGroups('receipt_no');
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
    this.updateTotalRow(this.angularGrid.slickGrid);
  }

  expandAllGroups() {
    this.dataviewObj.expandAllGroups();
    this.updateTotalRow(this.angularGrid.slickGrid);
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
  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.gridObj = angularGrid.slickGrid; // grid object
    this.dataviewObj = angularGrid.dataView;
    this.updateTotalRow(angularGrid.slickGrid);
  }
  updateTotalRow(grid: any) {
    if (this.totalRow) {
      let columnIdx = grid.getColumns().length;
      while (columnIdx--) {
        const columnId = grid.getColumns()[columnIdx].id;
        const columnElement: HTMLElement = grid.getFooterRowColumn(columnId);
        columnElement.innerHTML = '<b>' + this.totalRow[columnId] + '<b>';
      }
    }
  }
  receiptFormatter(row, cell, value, columnDef, dataContext) {
    return '<a style="text-decoration:underline !important;cursor:pointer">' + value + '</a>';
  }
  onCellClicked(e, args) {
    if (args.cell === args.grid.getColumnIndex('checkbox_select')) {
			const index = this.rowsChosen.indexOf(args.row);
			if (index === -1) {
				this.rowsChosen.push(args.row);
			} else {
				this.rowsChosen.splice(index, 1);
			}
			const item = args.grid.getDataItem(args.row);
			const index2 = this.rowChosenData.findIndex(f => Number(f.index) === Number(args.row));
			if (index2 === -1) {
				this.rowChosenData.push({
					data: item,
					index: args.row
				});
			} else {
				this.rowChosenData.splice(index2, 1);
			}
			console.log('this.rowChosenData',this.rowChosenData);
		}
    if (args.cell === args.grid.getColumnIndex('receipt_no')) {
      const item: any = args.grid.getDataItem(args.row);
      if (item['receipt_no']) {
        this.actionList(item, false);
      }
    }
  }
  onSelectedRowsChanged(e, args) {
		if (args.rows.length === this.dataset.length) {
			this.rowChosenData = [];
			this.rowsChosen = args.rows;
			for (const item of this.rowsChosen) {
				this.rowChosenData.push({
					data: this.dataset[item],
					index: item
				});
			}
			this.gridObj.setSelectedRows(this.rowsChosen);
		} else if (args.rows.length === 0) {
			this.rowsChosen = [];
			this.rowChosenData = [];
			this.gridObj.setSelectedRows(this.rowsChosen);
		} else {
			this.gridObj.setSelectedRows(this.rowsChosen);
		}
  }
  deleteSaleReceipt(value){
    console.log('value -----',value);
		if(value.reason_id && value.reason_remark) {
      const param:any[] = [];
      const data:any={};
			data.reason_id = value.reason_id;
			data.reason_remark = value.reason_remark;
      data.status = 'canceled';
      if(value.inv_id.length > 0){
        value.inv_id.forEach(element => {
          param.push(element.data.action.bill_id);
        });
        this.inventory.deleteSaleReeipt({bill_id:param,data:data}).subscribe((result:any) => {
          if(result && result.status == 'ok'){
            this.CommonService.showSuccessErrorMessage(result.data,'success');
          }
          this.changeReportType();
        })
      }
		}
  }
  deleteModal() {
    console.log(this.rowChosenData);
		this.deleteWithReasonModal.openModal(this.rowChosenData);
		// const change: any = this.deleteWithReasonModal.subscribeModalChange();
		// change.afterClosed().subscribe((res: any) => {
		// 	if (res && res.data && res.data.length > 0) {
		// 		this.rowsChosen = [];
		// 		this.rowChosenData = [];
		// 		for (const item of res.data) {
		// 			this.rowsChosen.push(item.index);
		// 		}
		// 		this.gridObj.setSelectedRows(this.rowsChosen);
		// 		this.rowChosenData = res.data;

		// 	} else {
		// 		this.rowsChosen = [];
		// 		this.rowChosenData = [];
		// 		this.gridObj.setSelectedRows(this.rowsChosen);
		// 	}
		// });
	}
  actionList(item, action) {
    this.billDetailsModal.openModal(item);
  }
  sumTotalsFormatter(totals, columnDef) {
    const val = totals.sum && totals.sum[columnDef.field];
    if (val != null) {
      return '<b class="total-footer-report">' + new IndianCurrency().transform(((Math.round(parseFloat(val) * 100) / 100))) + '</b>';
    }
    return '';
  }
  exportAsPDF(json: any[]) {
    const headerData: any[] = [];
    this.pdfrowdata = [];
    this.levelHeading = [];
    this.levelTotalFooter = [];
    this.levelSubtotalFooter = [];
    this.exportColumnDefinitions = [];
    let exportColumnDefinitions = this.angularGrid.slickGrid.getColumns();
    for (const item of exportColumnDefinitions) {
      if(!(item.id.includes('checkbox_select'))) {
        this.exportColumnDefinitions.push(item)
      }
    }
    let reportType: any = '';
    this.sessionName = this.getSessionName(this.session.ses_id);
    reportType = new TitleCasePipe().transform('Store Detailed Sales Report: ') + this.sessionName;
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
          arr.push(this.CommonService.htmlToText(this.dataset[key][item2.id]));
        }
        rowData.push(arr);
        this.pdfrowdata.push(arr);
      });
    }
    else {
      // iterate all groups
      this.checkGroupLevelPDF(this.dataviewObj.getGroups(), doc, headerData);
    }
    if (this.totalRow) {
      const arr: any[] = [];
      for (const item of this.exportColumnDefinitions) {
        arr.push(this.totalRow[item.id]);
      }
      rowData.push(arr);
      this.pdfrowdata.push(arr);
    }
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
        if (data.row.index === rows.length - 1) {
          doc.setFontStyle('bold');
          doc.setFontSize('18');
          doc.setTextColor('#ffffff');
          doc.setFillColor(67, 160, 71);
        }
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
    doc.save(reportType + '_' + new Date() + '.pdf');
  }
  getSessionName(id) {
    const findex = this.sessionArray.findIndex(f => Number(f.ses_id) === Number(id));
    if (findex !== -1) {
      return this.sessionArray[findex].ses_name;
    }
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
  checkGroupLevelPDF(item, doc, headerData) {
    if (item.length > 0) {
      for (const groupItem of item) {
        // add and style for groupeditem level heading
        this.pdfrowdata.push([groupItem.value + ' (' + groupItem.rows.length + ')']);
        this.levelHeading.push(this.pdfrowdata.length - 1);
        if (groupItem.groups) {
          this.checkGroupLevelPDF(groupItem.groups, doc, headerData);
          const levelArray: any[] = [];
          const obj3: any = {};

          obj3['id'] = 'footer';
          obj3['srno'] = '';
          obj3['dept_id']='';
          obj3['item_code']='';
          obj3['rate']='';
          obj3['count']='';
          obj3['location']='';
          obj3['action']='';
          obj3['class']='';
          obj3['mop']='';
          obj3['status']='';
          obj3['au_role_id']='';
          obj3['receipt_no'] = this.getLevelFooter(groupItem.level, groupItem);
          obj3['receipt_date'] = '';
          obj3['emp_id'] = '';
          obj3['name'] = '';
          obj3['contact'] = '';
          obj3['bill_total'] = new IndianCurrency().transform(groupItem.rows.map(t => t['bill_total']).reduce((acc, val) => Number(acc) + Number(val), 0));
          for (const col of this.exportColumnDefinitions) {
            Object.keys(obj3).forEach((key: any) => {
              if (col.id === key) {
                levelArray.push(obj3[key]);
              }
            });
          }
          if (groupItem.level === 0) {
            this.pdfrowdata.push(levelArray);
            this.levelTotalFooter.push(this.pdfrowdata.length - 1);
          } else if (groupItem.level > 0) {
            this.pdfrowdata.push(levelArray);
            this.levelSubtotalFooter.push(this.pdfrowdata.length - 1);
          }

        } else {
          const rowData: any[] = [];
          Object.keys(groupItem.rows).forEach(key => {
            const arr: any = [];
            for (const item2 of this.columnDefinitions) {
              if (item2.id === 'receipt_date') {
                arr.push(new DatePipe('en-in').transform((groupItem.rows[key][item2.id])));
              } else {
                arr.push(this.CommonService.htmlToText(groupItem.rows[key][item2.id]));
              }
            }
            rowData.push(arr);
            this.pdfrowdata.push(arr);
          });
          const levelArray: any[] = [];
          const obj3: any = {};
          obj3['id'] = 'footer';
          obj3['srno'] = '';
          obj3['receipt_no'] = this.getLevelFooter(groupItem.level, groupItem);
          obj3['receipt_date'] = '';
          obj3['emp_id'] = '';
          obj3['dept_id']='';
          obj3['item_code']='';
          obj3['rate']='';
          obj3['count']='';
          obj3['location']='';
          obj3['action']='';
          obj3['class']='';
          obj3['mop']='';
          obj3['status']='';
          obj3['au_role_id']='';
          obj3['name'] = '';
          obj3['contact'] = '';
          obj3['bill_total'] = new IndianCurrency().transform(groupItem.rows.map(t => t['bill_total']).reduce((acc, val) => Number(acc) + Number(val), 0));
          for (const col of this.exportColumnDefinitions) {
            Object.keys(obj3).forEach((key: any) => {
              if (col.id === key) {
                levelArray.push(obj3[key]);
              }
            });
          }
          if (groupItem.level === 0) {
            this.pdfrowdata.push(levelArray);
            this.levelTotalFooter.push(this.pdfrowdata.length - 1);
          } else if (groupItem.level > 0) {
            this.pdfrowdata.push(levelArray);
            this.levelSubtotalFooter.push(this.pdfrowdata.length - 1);
          }
        }
      }
    }
  }

  getLevelFooter(level, groupItem) {
    if (level === 0) {
      return 'Total';
    }
    if (level > 0) {
      return 'Sub Total (' + groupItem.value + ')';
    }
  }
  openSearchDialog = (data) => { this.searchModal.openModal(data); }
  exportToExcel(json: any[]) {
    this.notFormatedCellArray = [];
    let reportType: any = '';
    const columns: any[] = [];
    const columValue: any[] = [];
    this.exportColumnDefinitions = [];
    let exportColumnDefinitions = this.angularGrid.slickGrid.getColumns();
    for (const item of exportColumnDefinitions) {
      if(!(item.id.includes('checkbox_select'))) {
        this.exportColumnDefinitions.push(item)
      }
    }
    for (const item of this.exportColumnDefinitions) {
      columns.push({
        key: item.id,
        width: 10
      });
      columValue.push(item.name);
    }
    this.sessionName = this.getSessionName(this.session.ses_id);
    reportType = new TitleCasePipe().transform('store_detail_sales_report') + this.sessionName;
    let reportType2: any = '';
    reportType2 = new TitleCasePipe().transform('Store Detailed Sales Report: ') + this.sessionName;
    const fileName = reportType + '.xlsx';
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
          obj[item2.id] = this.checkReturn(this.CommonService.htmlToText(json[key][item2.id]));

        }
        worksheet.addRow(obj);
      });
    } else {
      // iterate all groups
      this.checkGroupLevel(this.dataviewObj.getGroups(), worksheet);
    }
    if (this.totalRow) {
      worksheet.addRow(this.totalRow);
    }
    //style grand total
    worksheet.getRow(worksheet._rows.length).eachCell(cell => {
      this.columnDefinitions.forEach(element => {
        cell.font = {
          color: { argb: 'ffffff' },
          bold: true,
          name: 'Arial',
          size: 10
        };
        cell.alignment = { wrapText: true, horizontal: 'center' };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '439f47' },
          bgColor: { argb: '439f47' }
        };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    });
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
      } else if (rowNum > 4 && rowNum < worksheet._rows.length) {
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
  checkGroupLevel(item, worksheet) {
    if (item.length > 0) {
      for (const groupItem of item) {
        worksheet.addRow({});
        this.notFormatedCellArray.push(worksheet._rows.length);
        // style for groupeditem level heading
        worksheet.mergeCells('A' + (worksheet._rows.length) + ':' +
          this.alphabetJSON[this.exportColumnDefinitions.length] + (worksheet._rows.length));
        worksheet.getCell('A' + worksheet._rows.length).value = this.CommonService.htmlToText(groupItem.title);
        worksheet.getCell('A' + worksheet._rows.length).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'c8d6e5' },
          bgColor: { argb: 'ffffff' },
        };
        worksheet.getCell('A' + worksheet._rows.length).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        worksheet.getCell('A' + worksheet._rows.length).font = {
          name: 'Arial',
          size: 10,
          bold: true
        };

        if (groupItem.groups) {
          this.checkGroupLevel(groupItem.groups, worksheet);
          const obj3: any = {};
          obj3['id'] = 'footer';
          obj3['srno'] = '';
          obj3['receipt_no'] = this.getLevelFooter(groupItem.level, groupItem);
          obj3['receipt_date'] = '';
          obj3['emp_id'] = '';
          obj3['name'] = '';
          obj3['contact'] = '';
          obj3['bill_total'] = new IndianCurrency().transform(groupItem.rows.map(t => t['bill_total']).reduce((acc, val) => Number(acc) + Number(val), 0));
          worksheet.addRow(obj3);
          this.notFormatedCellArray.push(worksheet._rows.length);
          // style row having total
          if (groupItem.level === 0) {
            worksheet.getRow(worksheet._rows.length).eachCell(cell => {
              this.exportColumnDefinitions.forEach(element => {
                cell.font = {
                  name: 'Arial',
                  size: 10,
                  bold: true,
                  color: { argb: 'ffffff' }
                };
                cell.alignment = { wrapText: true, horizontal: 'center' };
                cell.fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: { argb: '004261' },
                  bgColor: { argb: '004261' },
                };
                cell.border = {
                  top: { style: 'thin' },
                  left: { style: 'thin' },
                  bottom: { style: 'thin' },
                  right: { style: 'thin' }
                };
              });
            });
          } else if (groupItem.level > 0) {
            worksheet.getRow(worksheet._rows.length).eachCell(cell => {
              this.exportColumnDefinitions.forEach(element => {
                cell.font = {
                  name: 'Arial',
                  size: 10,
                };
                cell.alignment = { wrapText: true, horizontal: 'center' };
                cell.border = {
                  top: { style: 'thin' },
                  left: { style: 'thin' },
                  bottom: { style: 'thin' },
                  right: { style: 'thin' }
                };
              });
            });
          }
        } else {
          Object.keys(groupItem.rows).forEach(key => {
            const obj = {};
            for (const item2 of this.exportColumnDefinitions) {
              if (item2.id === 'receipt_date') {
                obj[item2.id] = new DatePipe('en-in').transform((groupItem.rows[key][item2.id]));
              } else {
                obj[item2.id] = this.checkReturn(this.CommonService.htmlToText(groupItem.rows[key][item2.id]));
              }
            }
            worksheet.addRow(obj);
          });
          const obj3: any = {};
          obj3['id'] = 'footer';
          obj3['srno'] = '';
          obj3['receipt_no'] = this.getLevelFooter(groupItem.level, groupItem);
          obj3['receipt_date'] = '';
          obj3['emp_id'] = '';
          obj3['name'] = '';
          obj3['contact'] = '';
          obj3['bill_total'] = new IndianCurrency().transform(groupItem.rows.map(t => t['bill_total']).reduce((acc, val) => Number(acc) + Number(val), 0));
          worksheet.addRow(obj3);
          this.notFormatedCellArray.push(worksheet._rows.length);
          if (groupItem.level === 0) {
            worksheet.getRow(worksheet._rows.length).eachCell(cell => {
              this.exportColumnDefinitions.forEach(element => {
                cell.font = {
                  name: 'Arial',
                  size: 10,
                  bold: true,
                  color: { argb: 'ffffff' }
                };
                cell.alignment = { wrapText: true, horizontal: 'center' };
                cell.fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: { argb: '004261' },
                  bgColor: { argb: '004261' },
                };
                cell.border = {
                  top: { style: 'thin' },
                  left: { style: 'thin' },
                  bottom: { style: 'thin' },
                  right: { style: 'thin' }
                };
              });
            });
          } else if (groupItem.level > 0) {
            worksheet.getRow(worksheet._rows.length).eachCell(cell => {
              this.exportColumnDefinitions.forEach(element => {
                cell.font = {
                  name: 'Arial',
                  size: 10,
                };
                cell.alignment = { wrapText: true, horizontal: 'center' };
                cell.border = {
                  top: { style: 'thin' },
                  left: { style: 'thin' },
                  bottom: { style: 'thin' },
                  right: { style: 'thin' }
                };
              });
            });
          }
        }
      }
    }
  }
  checkWidth(id, header) {
    const res = this.dataset.map((f) => f[id] !== '-' && f[id] ? f[id].toString().length : 1);
    const max2 = header.toString().length;
    const max = Math.max.apply(null, res);
    return max2 > max ? max2 : max;
  }
  checkReturn(data) {
    if (Number(data)) {
      return Number(data);
    } else {
      return data;
    }
  }
  checkTotalFormatter(row, cell, value, columnDef, dataContext) {
    if (value === 0) {
      return 0;
    } else {
      return new IndianCurrency().transform(value);
    }
  }
  searchOk($event) {
    console.log("i am here", $event);
    this.objectFilter = {}
    for(let i = 0; i <$event.filters.length; i++) {
     if(this.objectFilter[$event.filters[i].filter_type] != '') {
      if(this.objectFilter[$event.filters[i].filter_type]) {
        this.objectFilter[$event.filters[i].filter_type].push($event.filters[i].filter_value)
      } else {
        this.objectFilter[$event.filters[i].filter_type] = [$event.filters[i].filter_value]
      }
     }
    }
    
    // this.getAllEmployee($event);
  }
}