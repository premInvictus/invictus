import { Component, OnInit, Input } from '@angular/core';
import { CommonAPIService, SisService, InventoryService } from '../../_services';
import { DecimalPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { CapitalizePipe } from '../../_pipes';
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
  selector: 'app-store-ledger',
  templateUrl: './store-ledger.component.html',
  styleUrls: ['./store-ledger.component.css']
})
export class StoreLedgerComponent implements OnInit {
  @Input() userName: any = '';
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
  nodataFlag = true;
  sessionArray: any[] = [];
  sessionName: any;
  currentUser: any;
  session: any;
  schoolInfo: any;
  itemDetailsArray: any[] = [];
  isLoading = true;
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
  locationArray: any[];
  constructor(private fbuild: FormBuilder, private inventory: InventoryService, private CommonService: CommonAPIService,
    private erpCommonService: ErpCommonService, ) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.session = JSON.parse(localStorage.getItem('session'));
  }

  ngOnInit() {
    this.getItemDetails();
    this.getReport();
    this.getSchool();
    this.getSession();
    this.getAllLocations();
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
  getItemDetails() {
    this.inventory.getItemsFromMaster({}).subscribe((result: any) => {
      if (result) {
        this.itemDetailsArray = result;
      }
    });
  }
  getItemName(item_code) {
    const findex = this.itemDetailsArray.findIndex(f => Number(f.item_code) === Number(item_code));
    if (findex !== -1) {
      return this.itemDetailsArray[findex].item_name;
    }
  }
  getReport() {
    this.getAllLocations();
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
        id: 'date', name: 'Date', field: 'date', sortable: true,
        filterable: true,
        filterSearchType: FieldType.string,
        width: 20,
      },
      {
        id: 'item_code', name: 'Item Code', field: 'item_code', sortable: true,
        filterable: true,
        filterSearchType: FieldType.string,
        width: 15
      }
      ,
      {
        id: 'item_name', name: 'Item Name', field: 'item_name', sortable: true,
        filterable: true,
        filterSearchType: FieldType.string,
        width: 40,
        groupTotalsFormatter: this.srnTotalsFormatter,
      },
      {
        id: 'particulars', name: 'Particulars', field: 'particulars', sortable: true,
        filterable: true,
        filterSearchType: FieldType.string,
        width: 35
      }
      ,
      {
        id: 'location', name: 'Location', field: 'location', sortable: true,
        filterable: true,
        filterSearchType: FieldType.string,
        width: 25
      },
      // {
      //   id: 'stu_name', name: 'Name', field: 'stu_name', sortable: true,
      //   filterable: true,
      //   filterSearchType: FieldType.string,
      //   width: 50,
      // },
      // {
      //   id: 'quantity_in', name: 'Quantity', field: 'quantity_in', sortable: true,
      //   filterable: true,
      //   filterSearchType: FieldType.string,
      //   width: 30,
      //   groupTotalsFormatter: this.sumTotalsFormatter,
      // },
      
     
      {
        id: 'quantity', name: 'Quantity', field: 'quantity', sortable: true,
        filterable: true,
        filterSearchType: FieldType.string,
        width: 20,
        groupTotalsFormatter: this.sumTotalsFormatter,
      }
      ,
      {
        id: 'remarks', name: 'Remarks', field: 'remarks', sortable: true,
        filterable: true,
        filterSearchType: FieldType.string,
        width: 50,
      },
      // {
      //   id: 'quantity_out', name: 'Quantity Out', field: 'quantity_out', sortable: true,
      //   filterable: true,
      //   filterSearchType: FieldType.string,
      //   width: 30,
      //   groupTotalsFormatter: this.sumTotalsFormatter,
      // }
    ];
    this.inventory.getStockLedger().subscribe((result: any) => {
      if (result) {
        repoArray = result;
        let ind = 0;
        for (let item of repoArray) {
          let obj: any = {};
          if (item.particulars === 'Opening Balance') {
            obj['id'] = item.item_name + ind;
            obj['item_code'] = item.item_code;
            obj['item_name'] = '-';
            obj['item_code_name'] =  item.item_code + '-' + new CapitalizePipe().transform(this.getItemName(item.item_code));
            obj['date'] = this.CommonService.dateConvertion(item.date, 'dd-MMM-y');
            obj['particulars'] = item.particulars ? new CapitalizePipe().transform(item.particulars) : '-';
            obj['stu_name'] = item.stu_name ? new CapitalizePipe().transform(item.stu_name) : '-';
            obj['branch_to'] = item.branch_to ? item.branch_to : item.branch_from;
            obj['branch_from'] = item.branch_from ? item.branch_from : '-';
            obj['quantity'] = item.quantity_in ? item.quantity_in : 0;
            obj['location'] = (item.branch_to) ? this.getLocationName(item.branch_to) : this.getLocationName(item.branch_from);
            obj['remarks'] = item.remarks ? item.remarks + '-' + new CapitalizePipe().transform(item.stu_name) : '-';
            // obj['quantity_in'] = item.quantity_in ? item.quantity_in : 0;
            // obj['quantity_out'] = item.quantity_out ? item.quantity_out : '-';
          } else {
            obj['id'] = item.item_name + ind;
            obj['item_code'] = item.item_code;
            obj['item_name'] = new CapitalizePipe().transform(this.getItemName(item.item_code));
            obj['item_code_name'] = item.item_code + '-' + new CapitalizePipe().transform(this.getItemName(item.item_code));
            obj['date'] = item.date && item.date != '-' ? this.CommonService.dateConvertion(item.date, 'dd-MMM-y') : '';
            obj['particulars'] = item.particulars ? new CapitalizePipe().transform(item.particulars) : '-';
            obj['stu_name'] = item.stu_name ? new CapitalizePipe().transform(item.stu_name) : '-';
            console.log(item.item_code, obj['particulars'] );
            obj['branch_to'] = item.branch_to ? item.branch_from : '-';
            obj['branch_from'] = item.branch_from ? item.branch_from : '-';
            if(item.particulars == "Branch-Transfer"){
              obj['quantity'] = item.quantity_out ? item.quantity_out : 0;
            }else if(item.particulars == "Sale"){
              obj['quantity'] = item.quantity_out ? item.quantity_out : 0;
            }else{
              obj['quantity'] = item.quantity_in ? item.quantity_in : 0;
            }
            obj['location'] =  (item.branch_to) ? this.getLocationName(item.branch_to) : this.getLocationName(item.branch_from);
            obj['remarks'] = item.remarks ? item.remarks + '-' + new CapitalizePipe().transform(item.stu_name) : '-';
            // obj['quantity_in'] = item.quantity_in ? item.quantity_in : 0;
            // obj['quantity_out'] = item.quantity_out ? item.quantity_out : 0;
          }
          this.dataset.push(obj);
          ind++; 
        }
        console.log("dataset >>>>>>",this.dataset);
        
        const sortedArr: any[] = this.dataset.sort((a, b) => {
          const isAsc = false;
          return compare(new Date(a.date).getTime(), new Date(b.date).getTime(), isAsc);
        });
        this.dataset = sortedArr;

        this.totalRow = {};
        const obj3: any = {};
        obj3['id'] = 'footer';
        obj3['date'] = '';
        obj3['item_code'] = '';
        obj3['item_name'] = 'Grand Total';
        obj3['particulars'] = '';
        obj3['stu_name'] = '';
        obj3['remarks'] = '';
        obj3['location'] = '';
        // obj3['quantity_in'] = this.dataset.map(t => t['quantity_in']).reduce((acc, val) => Number(acc) + Number(val), 0);
        // obj3['quantity_out'] = this.dataset.map(t => t['quantity_out']).reduce((acc, val) => Number(acc) + Number(val), 0);
        obj3['quantity'] = this.dataset.map(t => t['quantity']).reduce((acc, val) => Number(acc) + Number(val), 0);
        this.totalRow = obj3;
        // this.aggregatearray.push(new Aggregators.Sum('quantity_in'));
        // this.aggregatearray.push(new Aggregators.Sum('quantity_out'));
        this.aggregatearray.push(new Aggregators.Sum('quantity'));
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
        this.isLoading = false;
        setTimeout(() => this.groupByItemName(), 2);
      } else {
        this.nodataFlag = true;
        this.tableFlag = true;
      }
    });
    function compare(a, b, isAsc) {
      return (a > b ? -1 : 1) * (isAsc ? 1 : -1);
    }

  }


  getAllLocations(){
    this.locationArray = [];
    this.inventory.getAllLocations({}).subscribe((result: any) => {
      if (result) {
        console.log(result);
        console.log("all locations",result);
        this.locationArray = result;
      }
    });
}

  getLocationName(location_id) {
    console.log("location name", location_id);
    
    const sindex = this.locationArray.findIndex(f => Number(f.location_id) === Number(location_id));
    if (sindex !== -1) {
      return this.locationArray[sindex].location_hierarchy;
    } else {
      return '-';
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
  sumTotalsFormatter(totals, columnDef) {
    const val = totals.sum && totals.sum[columnDef.field];
    if (val != null) {
      return '<b class="total-footer-report">' + new DecimalPipe('en-in').transform(((Math.round(parseFloat(val) * 100) / 100))) + '</b>';
    }
    return '';
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
          obj3['date'] = '';
          obj3['item_code'] = '';
          obj3['item_name'] = this.getLevelFooter(groupItem.level, groupItem);
          obj3['particulars'] = '';
          obj3['stu_name'] = '';
          obj3['remarks'] = '';
          obj3['location'] = '';
          // obj3['quantity_in'] = groupItem.rows.map(t => t['quantity_in']).reduce((acc, val) => Number(acc) + Number(val), 0);
          // obj3['quantity_out'] = groupItem.rows.map(t => t['quantity_out']).reduce((acc, val) => Number(acc) + Number(val), 0);
          obj3['quantity'] = groupItem.rows.map(t => t['quantity']).reduce((acc, val) => Number(acc) + Number(val), 0);
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
          obj3['date'] = '';
          obj3['item_code'] = '';
          obj3['item_name'] = this.getLevelFooter(groupItem.level, groupItem);
          obj3['particulars'] = '';
          obj3['stu_name'] = '';
          obj3['remarks'] = '';
          obj3['location'] = '';
          // obj3['quantity_in'] = groupItem.rows.map(t => t['quantity_in']).reduce((acc, val) => Number(acc) + Number(val), 0);
          // obj3['quantity_out'] = groupItem.rows.map(t => t['quantity_out']).reduce((acc, val) => Number(acc) + Number(val), 0);
          obj3['quantity'] = groupItem.rows.map(t => t['quantity']).reduce((acc, val) => Number(acc) + Number(val), 0);
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
    reportType = new TitleCasePipe().transform('store_ledger_report') + this.sessionName;
    let reportType2: any = '';
    reportType2 = new TitleCasePipe().transform('store ledger report: ') + this.sessionName;
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
          obj3['date'] = '';
          obj3['item_code'] = '';
          obj3['item_name'] = this.getLevelFooter(groupItem.level, groupItem);
          obj3['particulars'] = '';
          obj3['stu_name'] = '';
          obj3['remarks'] = '';
          obj3['location'] = '';
          // obj3['quantity_in'] = groupItem.rows.map(t => t['quantity_in']).reduce((acc, val) => Number(acc) + Number(val), 0);
          // obj3['quantity_out'] = groupItem.rows.map(t => t['quantity_out']).reduce((acc, val) => Number(acc) + Number(val), 0);
          obj3['quantity'] = groupItem.rows.map(t => t['quantity']).reduce((acc, val) => Number(acc) + Number(val), 0);
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
          obj3['date'] = '';
          obj3['item_code'] = '';
          obj3['item_name'] = this.getLevelFooter(groupItem.level, groupItem);
          obj3['particulars'] = '';
          obj3['stu_name'] = '';
          obj3['remarks'] = '';
          obj3['location'] = '';
          // obj3['quantity_in'] = groupItem.rows.map(t => t['quantity_in']).reduce((acc, val) => Number(acc) + Number(val), 0);
          // obj3['quantity_out'] = groupItem.rows.map(t => t['quantity_out']).reduce((acc, val) => Number(acc) + Number(val), 0);
          obj3['quantity'] = groupItem.rows.map(t => t['quantity']).reduce((acc, val) => Number(acc) + Number(val), 0);
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
  groupByItemName() {
    this.dataviewObj.setGrouping({
      getter: 'item_code_name',
      formatter: (g) => {
        return `<b>${g.value}</b><span style="color:green"> (${g.count})</span>`;
      },
      aggregators: this.aggregatearray,
      aggregateCollapsed: true,
      collapsed: false,
    });
  }
  getLevelFooter(level, groupItem) {
    if (level === 0) {
      return 'Total';
    }
    if (level > 0) {
      return 'Sub Total (' + groupItem.value + ')';
    }
  }

	srnTotalsFormatter(totals, columnDef) {
		console.log('srnTotalsFormatter ', totals);
		if (totals.group.level === 0) {
			return '<b class="total-footer-report">Total</b>';
		}
		if (totals.group.level > 0) {
			return '<b class="total-footer-report">Sub Total level ' + totals.group.level + ' </b>';
		}
	}
  
}
