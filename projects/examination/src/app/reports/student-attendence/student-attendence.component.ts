import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AxiomService, SisService, SmartService, CommonAPIService, ExamService, FeeService } from '../../_services';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import {
  GridOption, Column, AngularGridInstance, Grouping, Aggregators,
  FieldType,
  Filters,
  Formatters,
  DelimiterType,
  FileType
} from 'angular-slickgrid';
declare var slickgroup:any;
//const slickgroup =  require('slickgrid-colgroup-plugin');
//declare const slickgroup: any;
//import * as slickgroup from 'slickgrid-colgroup-plugin'

//import * as slickgroup from './../../../../../../node_modules/slickgrid-colgroup-plugin/src/slick.colgroup.js';

@Component({
  selector: 'app-student-attendence',
  templateUrl: './student-attendence.component.html',
  styleUrls: ['./student-attendence.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class StudentAttendenceComponent implements OnInit {

  paramform: FormGroup
  classArray: any[] = [];
  subjectArray: any[] = [];
  subSubjectArray: any[] = [];
  sectionArray: any[] = [];
  studentArray: any[] = [];
  monthArray: any[] = [];

  columnDefinitions: any[] = [];
  gridOptions: GridOption = {};
  dataset: any[] = [];
  angularGrid: AngularGridInstance;
  dataviewObj: any;
  gridObj: any;
  gridHeight: any;
  tableFlag = false;
  totalRow: any;
  ngOnInit() {
    this.buildForm();
    this.getClass();
    this.getFeeMonths();
    
    

    


    this.gridOptions = {
      enableDraggableGrouping: false,
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
     
      //colspanCallback: this.renderDifferentColspan,
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
        }
        ],
        onCommand: (e, args) => {
          if (args.command === 'exportAsPDF') {
            // in addition to the grid menu pre-header toggling (internally), we will also clear grouping
            //this.exportAsPDF(this.dataset);
          }
          if (args.command === 'exportAsExcel') {
            // in addition to the grid menu pre-header toggling (internally), we will also clear grouping
            //this.exportToExcel(this.dataset);
          }
          if (args.command === 'export-csv') {
            //this.exportToFile('csv');
          }
        },
        onColumnsChanged: (e, args) => {
          console.log('Column selection changed from Grid Menu, visible columns: ', args.columns);
         // this.updateTotalRow(this.angularGrid.slickGrid);
        },
      }
    };
    console.log(slickgroup);
    if (new slickgroup.ColGroup()) {
      console.log(new slickgroup.ColGroup());
      this.gridOptions['registerPlugins'] = [new slickgroup.ColGroup()];
    }
  }
  constructor(
    private fbuild: FormBuilder,
    private examService: ExamService,
    private sisService: SisService,
    private smartService: SmartService,
    private commonAPIService: CommonAPIService,
    public dialog: MatDialog,
    public feeService: FeeService
  ) { }
  buildForm() {
    this.paramform = this.fbuild.group({
      class_id: '',
      sec_id: '',
      fm_id: ''
    })
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
  getSectionsByClass() {
    this.paramform.patchValue({
      sec_id: ''
    });
    this.sectionArray = [];
    this.smartService.getSectionsByClass({ class_id: this.paramform.value.class_id }).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        this.sectionArray = result.data;
      } else {
        this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
      }
    });
  }
  getRollNoUser() {
    if (this.paramform.value.class_id && this.paramform.value.sec_id) {
      this.studentArray = [];
      this.examService.getRollNoUser({ au_class_id: this.paramform.value.class_id, au_sec_id: this.paramform.value.sec_id }).subscribe((result: any) => {
        if (result && result.status === 'ok') {
          this.studentArray = result.data;
        } else {
          this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
        }
      });
    }
  }
  submit() {
    this.resetDataset();
    this.examService.getStudentAttendence(this.paramform.value).subscribe((result: any) => {
      if (result && result.status === 'ok') {
        console.log(result.data);
        this.prepareDataSource(result.data);
      }
    })
  }
  resetDataset() {
    this.dataset = [];
    this.columnDefinitions = [];
    this.tableFlag = false;
  }
  angularGridReady(angularGrid: AngularGridInstance) {
		this.angularGrid = angularGrid;
    const grid = angularGrid.slickGrid; // grid object
    


		//this.updateTotalRow(angularGrid.slickGrid);
	}
  updateTotalRow(grid: any) {
		//console.log('this.groupColumns', this.groupColumns);
		let columnIdx = grid.getColumns().length;
		while (columnIdx--) {
      const columnId = grid.getColumns()[columnIdx].id;
      if (columnId) {
        const columnElement: HTMLElement = grid.getFooterRowColumn(columnId);
			  columnElement.innerHTML = '<b>' + this.totalRow[columnId] + '<b>';
      }
			
		}
	}
  iconFormatter(row, cell, value, columnDef, dataContext) {
    if (value !== '-') {
      if (value === '1') {
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
  prepareDataSource(value) {
    this.columnDefinitions = [
      { id: 'au_admission_no', name: 'Admission no', field: 'au_admission_no', sortable: true, filterable: true, resizable: false, },
      { id: 'au_full_name', name: 'Name', field: 'au_full_name', sortable: true, filterable: true, resizable: false, columnGroup: 'info' },
    ];
    for (let index = 1; index <= value.no_of_days_in_month; index++) {
      this.columnDefinitions.push({
        id: index.toString(), name: index.toString(), field: index.toString(), sortable: true, filterable: true, resizable: false, formatter: this.iconFormatter, columnGroup: 'days'
      });
    }
    this.columnDefinitions.push(
      { id: 'present', name: 'Present', field: 'present', sortable: true, filterable: true, resizable: false, columnGroup: 'attendance' }
    );
    this.columnDefinitions.push(
      { id: 'absent', name: 'Absent', field: 'absent', sortable: true, filterable: true, resizable: false, columnGroup: 'attendance' }
    );

    this.columnDefinitions.push(
      { id: 'absent1', name: 'Absent1', field: 'attendance', sortable: true, filterable: true, resizable: false, columnGroup: 'attendance1' }
    );

   

    for (let i = 0; i < value.attendence.length; i++) {
      const tempObj = {};
      tempObj['id'] = i;
      tempObj['au_admission_no'] = value.attendence[i]['au_admission_no'];
      tempObj['au_full_name'] = value.attendence[i]['au_full_name'];
      tempObj['present'] = value.attendence[i]['present'];
      tempObj['absent'] = value.attendence[i]['absent'];
      for (let key in value.attendence[i]['attendence']) {
        tempObj[key] = value.attendence[i]['attendence'][key];
      }
      this.dataset.push(tempObj);
    }
    const blankTempObj = {};
		blankTempObj['id'] = value.attendence.length;
		blankTempObj['au_admission_no'] = 'Grand Total';
    blankTempObj['au_full_name'] = '';
    blankTempObj['present'] = '';
    blankTempObj['absent'] = '';
    for (let index = 1; index <= value.no_of_days_in_month; index++) {
      let totalpresent = 0;
      for (let i = 0; i < value.attendence.length; i++) {
        if( value.attendence[i]['attendence'][index] === '1') {
          totalpresent++;
        }
      }
      blankTempObj[index.toString()] = totalpresent;
    }
		this.totalRow = blankTempObj;
    console.log('dataset  ', this.dataset);
    if (this.dataset.length > 20) {
      this.gridHeight = 750;
    } else if (this.dataset.length > 10) {
      this.gridHeight = 550;
    } else if (this.dataset.length > 5) {
      this.gridHeight = 400;
    } else {
      this.gridHeight = 300;
    }
    this.tableFlag = true;
  }
  renderDifferentColspan(item: any) {
    if (item.id % 2 === 1) {
      return {
        columns: {
          duration: {
            colspan: 3 // "duration" will span over 3 columns
          }
        }
      };
    } else {
      return {
        columns: {
          0: {
            colspan: '*' // starting at column index 0, we will span accross all column (*)
          }
        }
      };
    }
  }

}
