import { Component, OnInit, Input } from '@angular/core';
import { CommonAPIService, SisService, InventoryService } from '../../_services';
import { DecimalPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { CapitalizePipe } from '../../_pipes';
import { MatDialog } from '@angular/material';
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
  selector: 'app-item-master-reports',
  templateUrl: './item-master-reports.component.html',
  styleUrls: ['./item-master-reports.component.css']
})
export class ItemMasterReportsComponent implements OnInit {
  @Input() userName: any = '';
  reportTypeArray: any[] = [];
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
  constructor(private fbuild: FormBuilder
    , private inventory: InventoryService) { }

  ngOnInit() {
    this.buildForm();
    this.reportTypeArray.push({
      report_type: 'department', report_name: 'Department-wise Report'
    },
      {
        report_type: 'location', report_name: 'Location-wise Report'
      });

  }
  buildForm() {
    this.reportFilterForm = this.fbuild.group({
      'report_type': ''
    });
  }
  changeReportType($event) {
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
    // this.updateTotalRow(angularGrid.slickGrid);
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
            "filter_type": "item_code",
            "filter_value": "",
            "type": "text"
          }
        ]
      };
      this.inventory.filterItemsFromMaster(collectionJSON).subscribe((result: any) => {
        if (result && result.status === 'ok') {
          repoArray = result.data;
          let i = 1;
          for (let item of repoArray) {
            const obj: any = {};
            if (Number(i) === 1) {
              this.columnDefinitions = [
                {
                  id: 'srno',
                  name: 'Sr.No.',
                  field: 'srno',
                  sortable: true,

                },
                {
                  id: 'item_code',
                  name: 'Item Code',
                  field: 'item_code',
                  sortable: true,
                  filterable: true,
                  filterSearchType: FieldType.string,
                  filter: { model: Filters.compoundInput }
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
          this.tableFlag = true;
          setTimeout(() => this.groupByDepartment(), 2);
        } else {
          this.tableFlag = true;
        }
      });

    } else if (this.reportType === 'location') {
      console.log('fffff');
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
      this.inventory.filterItemsFromMaster(collectionJSON).subscribe((result: any) => {
        if (result && result.status === 'ok') {
          repoArray = result.data;
          let ind = 0;

          for (let item of repoArray) {
            let object: any = {};
            for (let titem of item.item_location) {
              console.log(titem);
              object['item_code'] = item.item_code;
              object['item_name'] = item.item_name;
              object['item_category'] = item.item_category.name;
              object['item_nature'] = item.item_nature.name;
              object['item_location'] = titem.location_id;
              object['item_reorder_level'] = item.item_reorder_level;
              object['item_qty'] = titem.item_qty;
              this.finalSet.push(object);
              console.log('dddd', this.finalSet);
            }
          }


          // for (let item of repoArray) {
          //   if (Number(ind) === 1) {
          //     this.columnDefinitions = [
          //       {
          //         id: 'srno',
          //         name: 'Sr.No.',
          //         field: 'srno',
          //         sortable: true,

          //       },
          //       {
          //         id: 'item_code',
          //         name: 'Item Code',
          //         field: 'item_code',
          //         sortable: true,
          //         filterable: true,
          //         filterSearchType: FieldType.string,
          //         filter: { model: Filters.compoundInput }
          //       },
          //       {
          //         id: 'item_name',
          //         name: 'Item name',
          //         field: 'item_name',
          //         sortable: true,
          //         filterable: true,
          //         filterSearchType: FieldType.string,
          //         filter: { model: Filters.compoundInput },

          //       },
          //       {
          //         id: 'item_category',
          //         name: ' Department',
          //         field: 'item_category',
          //         sortable: true,
          //         filterable: true,
          //         filterSearchType: FieldType.string,
          //         filter: { model: Filters.compoundInput },

          //       },
          //       {
          //         id: 'item_nature',
          //         name: ' Item Nautre',
          //         field: 'item_nature',
          //         sortable: true,
          //         filterable: true,
          //         filterSearchType: FieldType.string,
          //         filter: { model: Filters.compoundInput },

          //       },
          //       {
          //         id: 'item_location',
          //         name: ' Location',
          //         field: 'item_location',
          //         sortable: true,
          //         filterable: true,
          //         filterSearchType: FieldType.string,
          //         filter: { model: Filters.compoundInput },

          //       },
          //       {
          //         id: 'item_reorder_level',
          //         name: 'Reorder Level',
          //         field: 'item_reorder_level',
          //         sortable: true,
          //         filterable: true,
          //         filterSearchType: FieldType.string,
          //         filter: { model: Filters.compoundInput },

          //       },
          //       {
          //         id: 'item_qty',
          //         name: 'Quantity',
          //         field: 'item_qty',
          //         sortable: true,
          //         filterable: true,
          //         filterSearchType: FieldType.string,
          //         filter: { model: Filters.compoundInput },
          //       }
          //     ];
          //   }

          //   const obj = {};
          //   for (let titem of item.item_location) {

          //     obj['id'] = titem.location_id.toString() + item.item_code;
          //     obj['srno'] = ind;
          //     obj['item_code'] = item.item_code;
          //     obj['item_name'] = item.item_name;
          //     obj['item_category'] = item.item_category.name;
          //     obj['item_nature'] = item.item_nature.name;
          //     obj['item_location'] = this.getLocation(titem.location_id, item.locs);
          //     obj['item_reorder_level'] = item.item_reorder_level;
          //     obj['item_qty'] = titem.item_qty;
          //     this.dataset.push(obj);
          //     console.log(this.dataset);
          //   }
          //   ind++;
          // }
          // this.tableFlag = true;
          //setTimeout(() => this.groupByDepartment(), 2);
        } else {
          this.tableFlag = true;
        }
      });
    }
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
  getLocation(id, array: any[]) {
    const findex = array.findIndex(f => Number(f.location_id) === Number(id));
    if (findex !== -1) {
      return array[findex].location_hierarchy;
    } else {
      return '-';
    }
  }
}
