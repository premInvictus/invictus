import { Component, OnInit, Input } from '@angular/core';
import { CommonAPIService, SisService, InventoryService } from '../../_services';
import { DecimalPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { CapitalizePipe } from '../../_pipes';
import { MatDialog } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ErpCommonService } from 'src/app/_services';
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
  selector: 'app-item-master-reports',
  templateUrl: './item-master-reports.component.html',
  styleUrls: ['./item-master-reports.component.css']
})
export class ItemMasterReportsComponent implements OnInit {
  notFormatedCellArray: any[] = [];
  pdfrowdata: any[] = [];
  levelHeading: any[] = [];
  levelTotalFooter: any[] = [];
  levelSubtotalFooter: any[] = [];
  reportTypeArray: any[] = [];
  @Input() userName: any = '';
  sessionArray: any[] = [];
  sessionName: any;
  currentUser: any;
  session: any;
  schoolInfo: any;
  finalSet: any[] = [];
  reportType = '1';
  gridObj: any;
  gridHeight: any;
  filterFlag = false;
  filterResult: any[] = [];
  sortResult: any[] = [];
  totalRow: any;
  aggregatearray: any[] = [];
  feeHeadJson: any[] = [];
  groupColumns: any[] = [];
  groupLength: any;
  exportColumnDefinitions: any[] = [];
  reportFilterForm: FormGroup;
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
  constructor(private fbuild: FormBuilder, private inventory: InventoryService,
    private erpCommonService: ErpCommonService, private CommonService: CommonAPIService,) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.session = JSON.parse(localStorage.getItem('session'));
  }

  ngOnInit() {
    this.buildForm();
    this.getSchool();
    this.getSession();
    // this.reportTypeArray.push({
    //   report_type: 'department', report_name: 'Department-wise Report'
    // },
    //   {
    //     report_type: 'location', report_name: 'Location-wise Report'
    //   });
    if (this.CommonService.isExistUserAccessMenu('680')) {
      this.reportTypeArray.push({ report_type: 'department', report_name: 'Department-wise Report' });
    }
    if (this.CommonService.isExistUserAccessMenu('681')) {
      this.reportTypeArray.push({ report_type: 'location', report_name: 'Location-wise Report' });
    }

  }
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
  getSchool() {
    this.erpCommonService.getSchool()
      .subscribe(
        (result: any) => {
          if (result && result.status === 'ok') {
            this.schoolInfo = result.data[0];
          }
        });
  }
  buildForm() {
    this.reportFilterForm = this.fbuild.group({
      'report_type': ''
    });
  }
  changeReportType($event) {
    this.isLoading = true;
    this.filterResult = [];
    this.sortResult = [];
    this.tableFlag = false;
    this.reportType = $event.value
    if ($event.value === 'department' || $event.value === 'location') {
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
        footerRowHeight: 21,
        enableExcelCopyBuffer: true,
        enableAutoTooltip: true,
        enableCellNavigation: true,
        fullWidthRows: true,
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
          customItems: [
            {
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
            },

          ],
          onCommand: (e, args) => {
            if (args.command === 'toggle-preheader') {
              // in addition to the grid menu pre-header toggling (internally), we will also clear grouping
              this.clearGrouping();
            }

            if (args.command === 'expandGroup') {
              // in addition to the grid menu pre-header toggling (internally), we will also clear grouping
              this.expandAllGroups();
            }
            if (args.command === 'exportAsPDF') {
              // in addition to the grid menu pre-header toggling (internally), we will also clear grouping

              this.exportAsPDF(this.dataset);
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
          },
          onColumnsChanged: (e, args) => {
            console.log('Column selection changed from Grid Menu, visible columns: ', args.columns);
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
          },
          onExtensionRegistered: (extension) => this.draggableGroupingPlugin = extension,
        }
      };
      this.filterFlag = false;
      this.getItemReport(this.reportFilterForm.value);
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
  angularGridReady(angularGrid: AngularGridInstance) {
    this.angularGrid = angularGrid;
    this.gridObj = angularGrid.slickGrid; // grid object
    this.dataviewObj = angularGrid.dataView;
    this.updateTotalRow(angularGrid.slickGrid);
  }
  updateTotalRow(grid: any) {
    let columnIdx = grid.getColumns().length;
    while (columnIdx--) {
      const columnId = grid.getColumns()[columnIdx].id;
      const columnElement: HTMLElement = grid.getFooterRowColumn(columnId);
      columnElement.innerHTML = '<b>' + this.totalRow[columnId] + '<b>';
    }
  }
  getItemReport(value: any) {
    this.dataArr = [];
    this.columnDefinitions = [];
    this.dataset = [];
    this.finalSet = [];
    this.aggregatearray = [];
    this.tableFlag = false;
    let repoArray = [];
    if (this.reportType === 'department') {
      const collectionJSON: any = {
        "filters": [
          {
            "filter_type": "",
            "filter_value": "",
            "type": "text"
          }
        ]
      };
      this.inventory.searchItemsFromMaster({}).subscribe((result: any) => {
        if (result && result.status === 'ok') {
          this.isLoading = false;
          repoArray = result.data;
          let i = 1;
          for (let item of repoArray) {
            const obj: any = {};
            if (Number(i) === 1) {
              this.columnDefinitions = [
                {
                  id: 'item_code',
                  name: 'Item Code',
                  field: 'item_code',
                  sortable: true,
                  filterable: true,
                  filterSearchType: FieldType.string,
                  filter: { model: Filters.compoundInput },
                  width: 25,
                },
                {
                  id: 'item_name',
                  name: 'Item name',
                  field: 'item_name',
                  sortable: true,
                  filterable: true,
                  filterSearchType: FieldType.string,
                  filter: { model: Filters.compoundInput },

                },
                {
                  id: 'item_category',
                  name: ' Department',
                  field: 'item_category',
                  sortable: true,
                  filterable: true,
                  filterSearchType: FieldType.string,
                  filter: { model: Filters.compoundInput },

                },
                {
                  id: 'item_nature',
                  name: ' Item Nautre',
                  field: 'item_nature',
                  sortable: true,
                  filterable: true,
                  filterSearchType: FieldType.string,
                  filter: { model: Filters.compoundInput },

                },
                {
                  id: 'item_reorder_level',
                  name: 'Reorder Level',
                  field: 'item_reorder_level',
                  sortable: true,
                  filterable: true,
                  filterSearchType: FieldType.string,
                  filter: { model: Filters.compoundInput },

                },
                {
                  id: 'item_qty',
                  name: 'Quantity',
                  field: 'item_qty',
                  sortable: true,
                  filterable: true,
                  filterSearchType: FieldType.string,
                  filter: { model: Filters.compoundInput },
                  width: 25,
                  groupTotalsFormatter: this.sumTotalsFormatter,
                }
              ];
            }
            obj['id'] = item.item_code + i;
            obj['srno'] = i;
            obj['item_code'] = item.item_code;
            obj['item_name'] = item.item_name;
            obj['item_category'] = item.item_category.name;
            obj['item_nature'] = item.item_nature.name;
            obj['item_reorder_level'] = item.item_reorder_level;
            let quantity = 0;
            for (let titem of item.item_location) {
              if (titem.item_qty) {
                quantity = Number(quantity) + Number(titem.item_qty);
              }
            }
            if (quantity) {
              obj['item_qty'] = quantity;
            } else {
              obj['item_qty'] = 0;
            }
            i++;
            if (Object.keys(obj).length > 0) {
              this.dataset.push(obj);
            }
          }
          this.totalRow = {};
          const obj3: any = {};
          obj3['id'] = 'footer';
          obj3['item_code'] = 'Grand Total';
          obj3['item_name'] = '';
          obj3['item_category'] = '';
          obj3['item_nature'] = '';
          obj3['item_reorder_level'] = '';
          obj3['item_qty'] = this.dataset.map(t => t['item_qty']).reduce((acc, val) => Number(acc) + Number(val), 0);
          this.totalRow = obj3;
          this.aggregatearray.push(new Aggregators.Sum('item_qty'));
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
          setTimeout(() => this.groupByDepartment(), 2);
        } else {
          this.tableFlag = true;
        }
      });

    } else if (this.reportType === 'location') {
      const collectionJSON: any = {
        "filters": [
          {
            "filter_type": "item_code",
            "filter_value": "",
            "type": "text"
          }
        ]
      };
      // const obj: any = {};
      this.inventory.searchItemsFromMaster({}).subscribe((result: any) => {
        if (result && result.status === 'ok') {
          this.isLoading = false;
          repoArray = result.data;
          let finalSet = [];
          for (let item of repoArray) {
            for (let titem of item.item_location) {
              let object: any = {};
              object['item_code'] = item.item_code;
              object['item_name'] = new CapitalizePipe().transform(item.item_name);
              object['item_category'] = item.item_category.name;
              object['item_nature'] = item.item_nature.name;
              object['item_location'] = titem.location_id;
              object['item_reorder_level'] = item.item_reorder_level;
              object['locs'] = item.locs;
              object['item_qty'] = titem.item_qty;
              finalSet.push(object);
            }
          }
          let ind = 0;
          for (let item of finalSet) {
            const obj = {};
            if (Number(ind) === 0) {
              this.columnDefinitions = [
                {
                  id: 'item_code',
                  name: 'Item Code',
                  field: 'item_code',
                  sortable: true,
                  filterable: true,
                  filterSearchType: FieldType.string,
                  filter: { model: Filters.compoundInput },
                  width: 25,
                },
                {
                  id: 'item_name',
                  name: 'Item name',
                  field: 'item_name',
                  sortable: true,
                  filterable: true,
                  filterSearchType: FieldType.string,
                  filter: { model: Filters.compoundInput },

                },
                {
                  id: 'item_category',
                  name: ' Department',
                  field: 'item_category',
                  sortable: true,
                  filterable: true,
                  filterSearchType: FieldType.string,
                  filter: { model: Filters.compoundInput },

                },
                {
                  id: 'item_nature',
                  name: ' Item Nautre',
                  field: 'item_nature',
                  sortable: true,
                  filterable: true,
                  filterSearchType: FieldType.string,
                  filter: { model: Filters.compoundInput },

                },
                {
                  id: 'item_location',
                  name: ' Location',
                  field: 'item_location',
                  sortable: true,
                  filterable: true,
                  filterSearchType: FieldType.string,
                  filter: { model: Filters.compoundInput },

                },
                {
                  id: 'item_reorder_level',
                  name: 'Reorder Level',
                  field: 'item_reorder_level',
                  sortable: true,
                  filterable: true,
                  filterSearchType: FieldType.string,
                  filter: { model: Filters.compoundInput },

                },
                {
                  id: 'item_qty',
                  name: 'Quantity',
                  field: 'item_qty',
                  sortable: true,
                  filterable: true,
                  filterSearchType: FieldType.string,
                  filter: { model: Filters.compoundInput },
                  width: 25,
                  groupTotalsFormatter: this.sumTotalsFormatter,
                }
              ];
            }
            obj['id'] = item.item_code + ind;
            obj['item_code'] = item.item_code;
            obj['item_name'] = new CapitalizePipe().transform(item.item_name);
            obj['item_category'] = item.item_category;
            obj['item_nature'] = item.item_nature;
            obj['item_location'] = this.getLocation(item.item_location, item.locs);
            obj['item_reorder_level'] = item.item_reorder_level;
            obj['item_qty'] = item.item_qty;
            this.dataset.push(obj);
            ind++;
          }
          this.totalRow = {};
          const obj3: any = {};
          obj3['id'] = 'footer';
          obj3['item_code'] = 'Grand Total';
          obj3['item_name'] = '';
          obj3['item_category'] = '';
          obj3['item_nature'] = '';
          obj3['item_location'] = '';
          obj3['item_reorder_level'] = '';
          obj3['item_qty'] = this.dataset.map(t => t['item_qty']).reduce((acc, val) => Number(acc) + Number(val), 0);
          this.totalRow = obj3;
          this.aggregatearray.push(new Aggregators.Sum('item_qty'));
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
          setTimeout(() => this.groupByLocation(), 2);
        } else {
          this.tableFlag = true;
        }
      });
    }
  }
  sumTotalsFormatter(totals, columnDef) {
    const val = totals.sum && totals.sum[columnDef.field];
    if (val != null) {
      return '<b class="total-footer-report">' + new DecimalPipe('en-in').transform(((Math.round(parseFloat(val) * 100) / 100))) + '</b>';
    }
    return '';
  }
  srnTotalsFormatter(totals, columnDef) {
    if (totals.group.level === 0) {
      return '<b class="total-footer-report">Total</b>';
    }
    if (totals.group.level > 0) {
      return '<b class="total-footer-report">Sub Total (' + totals.group.value + ') </b>';
    }
  }
  groupByDepartment() {
    this.dataviewObj.setGrouping({
      getter: 'item_category',
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
    this.draggableGroupingPlugin.setDroppedGroups('item_category');
  }
  groupByLocation() {
    this.dataviewObj.setGrouping({
      getter: 'item_location',
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
    this.draggableGroupingPlugin.setDroppedGroups('item_location');
  }
  getLocation(id, array: any[]) {
    const findex = array.findIndex(f => Number(f.location_id) === Number(id));
    if (findex !== -1) {
      return array[findex].location_hierarchy;
    } else {
      return '-';
    }
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
    reportType = new TitleCasePipe().transform('item_master_report') + this.sessionName;
    let reportType2: any = '';
    reportType2 = new TitleCasePipe().transform('item master report: ') + this.sessionName;
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
          obj3['item_name'] = '';
          obj3['item_category'] = this.getLevelFooter(groupItem.level, groupItem);
          obj3['item_nature'] = '';
          obj3['item_location'] = '';
          obj3['item_reorder_level'] = '';
          obj3['locs'] = '';
          obj3['item_qty'] = groupItem.rows.map(t => t['item_qty']).reduce((acc, val) => Number(acc) + Number(val), 0);
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
          obj3['item_name'] = '';
          obj3['item_category'] = this.getLevelFooter(groupItem.level, groupItem);
          obj3['item_nature'] = '';
          obj3['item_location'] = '';
          obj3['item_reorder_level'] = '';
          obj3['locs'] = '';
          obj3['item_qty'] = groupItem.rows.map(t => t['item_qty']).reduce((acc, val) => Number(acc) + Number(val), 0);
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
  getLevelFooter(level, groupItem) {
    if (level === 0) {
      return 'Total';
    }
    if (level > 0) {
      return 'Sub Total (' + groupItem.value + ')';
    }
  }
  checkReturn(data) {
    if (Number(data)) {
      return Number(data);
    } else {
      return data;
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
    reportType = new TitleCasePipe().transform('store ledger Report: ') + this.sessionName;
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
    } {
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
    doc.save(reportType + '_' + new Date() + '.pdf');
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
          obj3['item_name'] = '';
          obj3['item_category'] = this.getLevelFooter(groupItem.level, groupItem);
          obj3['item_nature'] = '';
          obj3['item_location'] = '';
          obj3['item_reorder_level'] = '';
          obj3['locs'] = '';
          obj3['item_qty'] = groupItem.rows.map(t => t['item_qty']).reduce((acc, val) => Number(acc) + Number(val), 0);
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
          obj3['item_name'] = '';
          obj3['item_category'] = this.getLevelFooter(groupItem.level, groupItem);
          obj3['item_nature'] = '';
          obj3['item_location'] = '';
          obj3['item_reorder_level'] = '';
          obj3['locs'] = '';
          obj3['item_qty'] = groupItem.rows.map(t => t['item_qty']).reduce((acc, val) => Number(acc) + Number(val), 0);
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
}
