
import { Component, OnInit, ViewChild,AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Element } from './model';
import {SelectionModel} from '@angular/cdk/collections';
import { MatTableDataSource, MatPaginator, PageEvent, MatSort, MatPaginatorIntl } from '@angular/material';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { SisService, CommonAPIService, FaService } from '../../_services/index';
import { ChartOfAccountsCreateComponent } from '../../fa-shared/chart-of-accounts-create/chart-of-accounts-create.component';
import { ChartOfAccountsModalComponent } from '../../fa-shared/chart-of-accounts-modal/chart-of-accounts-modal.component';
import * as Excel from 'exceljs/dist/exceljs';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx'; 
const jsPDF = require('jspdf');
import 'jspdf-autotable';
// declare var jsPDF: any;

@Component({
  selector: 'app-chart-of-accounts',
  templateUrl: './chart-of-accounts.component.html',
  styleUrls: ['./chart-of-accounts.component.scss']
})
export class ChartsofAccountComponent implements OnInit,AfterViewInit {
  @ViewChild(ChartOfAccountsModalComponent)
  tableDivFlag = false;
  currentUser: any;
  ELEMENT_DATA: Element[];
  displayedColumns: string[] = ['select', 'ac_code', 'ac_name', 'ac_group', 'ac_type', 'dependencies_type', 'ac_cloosingbalance','opening_balance','opening_date','status' ,'action'];
  dataSource = new MatTableDataSource<Element>();
  selection = new SelectionModel<Element>(true, []);
  accountsArray:any[] = [];
  @ViewChild('deleteModal') deleteModal;
  @ViewChild('paginator') paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
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

  month_array = [
    {
      id: '04',
      name: 'April'
    },
    {
      id: '05',
      name: 'May'
    },
    {
      id: '06',
      name: 'June'
    },
    {
      id: '07',
      name: 'July'
    },
    {
      id: '08',
      name: 'August'
    },
    {
      id: '09',
      name: 'September'
    },
    {
      id: '10',
      name: 'October'
    },
    {
      id: '11',
      name: 'November'
    },
    {
      id: '12',
      name: 'December'
    },
    {
      id: '01',
      name: 'January'
    },
    {
      id: '02',
      name: 'Feburary'
    },
    {
      id: '03',
      name: 'March'
    },

  ]
  schoolInfo: any;
  session: any;
  date: any;
  notFormatedCellArray: any;
  constructor(
		private fbuild: FormBuilder,
		private sisService: SisService,
		private commonAPIService: CommonAPIService,
		private faService:FaService,
		private dialog: MatDialog
  ) { }
  

  ngOnInit(){
    this.tableDivFlag = true;
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.getAccounts();
  }
  ngAfterViewInit() {
		this.dataSource.paginator = this.paginator;
		this.dataSource.sort = this.sort;
	}

  openDeleteDialog = (data) => this.deleteModal.openModal(data);

  deleteConfirm(element) {
    console.log('value--', element);
    var inputJson = {
      coa_id: element.coa_id,
      coa_code: element.coa_code,
      coa_acc_name: element.coa_acc_name,
      coa_acc_group: {group_id: element.coa_acc_group.group_id, group_name: element.coa_acc_group.group_name },
      coa_acc_type: { acc_type_id: element.coa_acc_type.acc_type_id,acc_type_name: element.coa_acc_type.acc_type_name},
      coa_particulars: element.coa_particulars,
      coa_status:"delete"
    };
    this.faService.updateChartOfAccount(inputJson).subscribe((data:any)=>{
      if (data) {
        this.commonAPIService.showSuccessErrorMessage("Account Updated Successfully", "success");
      } else {
        this.commonAPIService.showSuccessErrorMessage("Error While Updating Account", "error");
      }
      this.getAccounts();
    });
  }

  openCreateModal(value) {
		const dialogRef = this.dialog.open(ChartOfAccountsCreateComponent, {
			height: '520px',
			width: '800px',
			data: {
        title: 'Create Account'
      }
		});
		dialogRef.afterClosed().subscribe(dresult => {
			console.log(dresult);
			this.getAccounts();
		});
  }
  
  editAccountModel(value) {
    const dialogRef = this.dialog.open(ChartOfAccountsCreateComponent, {
			height: '520px',
			width: '800px',
			data: {
        title: 'Update Account',
        formData: value
      }
		});
		dialogRef.afterClosed().subscribe(dresult => {
			console.log(dresult);
			this.getAccounts();
		});
  }

  viewAccountModal(value){
    const dialogRef = this.dialog.open(ChartOfAccountsModalComponent, {
			height: '520px',
			width: '960px',
			data: {
        title: 'View Account',
        accountCode: value
      }
		});
		dialogRef.afterClosed().subscribe(dresult => {
			console.log(dresult);
			// this.getAccounts();
		});
  }

  getAccounts() {
		this.faService.getAllChartsOfAccount({}).subscribe((data:any)=>{
			if(data) {
        this.accountsArray = data;
        let element: any = {};        
        this.ELEMENT_DATA = [];
        this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
        
          let pos = 1;
          
          for (const item of this.accountsArray) {
            element = {
              // srno: pos,
              // verified_on: new DatePipe('en-in').transform(item.verfication_on_date, 'd-MMM-y'),
              // verified_by: item.verfication_by ? item.verfication_by : '-',
              // verfication_by_name: item.verfication_by_name ? item.verfication_by_name : '-',
              // no_of_books: this.bookCount(item.details) ? this.bookCount(item.details) : '-'
              srno: pos,
              ac_id : item.coa_id,
              ac_code: item.coa_code,
              ac_name: item.coa_acc_name,
              ac_group: item.coa_acc_group.group_name,
              ac_type: item.coa_acc_type.acc_type_name,
              dependencies_type: item.dependencies_type,
              ac_cloosingbalance:item.total && item.total[0] && item.total[0]['deviation'] ? this.getTwoDecimalValue(item.total[0]['deviation']) : 0, 
              opening_balance : item.coa_opening_balance_data ? this.getTwoDecimalValue(item.coa_opening_balance_data.opening_balance) : '',
              opening_balance_type : item.coa_opening_balance_data && item.coa_opening_balance_data.opening_balance_type ? item.coa_opening_balance_data.opening_balance_type == 'debit' ? 'dr' : 'cr' : '',
              opening_date : item.coa_opening_balance_data ? item.coa_opening_balance_data.opening_balance_date: '',
              status:item.coa_status,
              opening_balance_cal :item.coa_opening_balance_data ? (item.coa_opening_balance_data.opening_balance) : 0,
              action:item

            };
            this.ELEMENT_DATA.push(element);
            pos++;
            
          }
          this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          // if (this.sort) {
          //   this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
          //   this.dataSource.sort = this.sort;
          // }
        
			} else {
				this.accountsArray = [];
			}
		})
  }
  

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Element): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.ac_code}`;
  }

  lockAccount(element) {
    var inputJson = {
      coa_id: element.coa_id,
      coa_code: element.coa_code,
      coa_acc_name: element.coa_acc_name,
      coa_acc_group: {group_id: element.coa_acc_group.group_id, group_name: element.coa_acc_group.group_name },
      coa_acc_type: { acc_type_id: element.coa_acc_type.acc_type_id,acc_type_name: element.coa_acc_type.acc_type_name},
      coa_particulars: element.coa_particulars,
      coa_status:"lock"
    };
    this.faService.updateChartOfAccount(inputJson).subscribe((data:any)=>{
      if (data) {
        this.commonAPIService.showSuccessErrorMessage("Account Updated Successfully", "success");
      } else {
        this.commonAPIService.showSuccessErrorMessage("Error While Updating Account", "error");
      }
      this.getAccounts();
    });
  }

  changeStatus(element) {
    console.log('element--',element);
    var inputJson = {
      coa_id: element.coa_id,
      coa_code: element.coa_code,
      coa_acc_name: element.coa_acc_name,
      coa_acc_group: {group_id: element.coa_acc_group.group_id, group_name: element.coa_acc_group.group_name },
      coa_acc_type: { acc_type_id: element.coa_acc_type.acc_type_id,acc_type_name: element.coa_acc_type.acc_type_name},
      coa_particulars: element.coa_particulars,
      coa_status: element.coa_status === 'active' ? 'deactive' : 'active'
    };
    this.faService.updateChartOfAccount(inputJson).subscribe((data:any)=>{
      if (data) {
        this.commonAPIService.showSuccessErrorMessage("Account Updated Successfully", "success");
      } else {
        this.commonAPIService.showSuccessErrorMessage("Error While Updating Account", "error");
      }
      this.getAccounts();
    });
  }

  getSchool() {
    this.sisService.getSchool().subscribe((res: any) => {
      if (res && res.status === 'ok') {
        this.schoolInfo = res.data[0];
        console.log('this.schoolInfo 202', this.schoolInfo)
        this.schoolInfo['disable'] = true;
        this.schoolInfo['si_school_prefix'] = this.schoolInfo.school_prefix;
        this.schoolInfo['si_school_name'] = this.schoolInfo.school_name;
      }
    });
  }

  applyFilter(filterValue: string) {
		filterValue = filterValue.trim(); // Remove whitespace
		filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
		this.dataSource.filter = filterValue;
  }
  getTwoDecimalValue(value) {
    // console.log('value',value);
    if (value && value != 0 && value != '') {
      return Number.parseFloat(value.toFixed(2));
    } else {
      return value;
    }

  }
  isExistUserAccessMenu(mod_id) {
		return this.commonAPIService.isExistUserAccessMenu(mod_id);
	}

//   downloadExcel() {
//     const table:any = document.querySelector('#liabilities_side');
//     const table1:any = document.querySelector('#assets_side');
//     let tableArray1 = [];
//     let tableArray2 = [];
//     console.log("i am table", table.tBodies[0].rows);
//     Array.from(table.tBodies[0].rows).forEach((row:any, idx:any) => {
//       let tds = []; 
//       Array.from(row.cells).map((td:any) => tds.push(td.textContent));
      
//       tableArray1.push(tds);
//     });
//     Array.from(table1.tBodies[0].rows).forEach((row:any, idx:any) => {
//       let tds = []; 
//       Array.from(row.cells).map((td:any) => tds.push(td.textContent));
      
//       tableArray2.push(tds);
//     })
//     // console.log('tds content:', tableArray1, tableArray2);

//     let columndefinition = [
//       {
//         name: 'Account Code',
//         id: 'coa_acc_code'
//       },
//       {
//         name: 'Account Name',
//         id: 'coa_acc_name'
//       },
//       {
//         name: 'Account Group',
//         id: 'coa_acc_group'
//       },
//       {
//         name: 'Account Type',
//         id: 'coa_acc_type'
//       },
//       {
//         name: 'Dependencies Type',
//         id: 'opening_balance'
//       },
//       {
//         name: 'Amount ',
//         id: 'opening_balance'
//       },
//       {
//         name: 'Amount ',
//         id: 'opening_balance_date'
//       },
//     ];
//     const columns: any[] = [];
//     const columValue: any[] = [];
//     const workbook = new Excel.Workbook();
//     const worksheet = workbook.addWorksheet('Chart_of_Accounts_report', { properties: { showGridLines: true } },
//       { pageSetup: { fitToWidth: 7 } });
//     for (const item of columndefinition) {
//       columns.push({
//         key: item.id,
//         width: 12
//       });
//       columValue.push(item.name);
//     }
//     let filterdate = '';
//     let arr = this.session[0].ses_name.split('-');
//     if(this.date.length == 1) {
//       filterdate = this.month_array.filter(e => e.id == this.date[0])[0].name + "'" + (parseInt(this.date[0]) < 4 ? arr[1].slice(-2): arr[0].slice(-2))
//     } else {
//       filterdate = this.month_array.filter(e => e.id == this.date[0])[0].name + "'" + (parseInt(this.date[0]) < 4 ? arr[1].slice(-2): arr[0].slice(-2));
//       filterdate += "-" + this.month_array.filter(e => e.id == this.date[this.date.length - 1])[0].name + "'" + (parseInt(this.date[this.date.length - 1]) < 4 ? arr[1].slice(-2): arr[0].slice(-2))
//     }

//     worksheet.properties.defaultRowHeight = 25;
//     worksheet.mergeCells('A1:' + this.alphabetJSON[columns.length] + '1'); // Extend cell over all column headers
//     worksheet.getCell('A1').value =
//       new TitleCasePipe().transform(this.schoolInfo.school_name) + ', ' + this.schoolInfo.school_city + ', ' + this.schoolInfo.school_state;
//     worksheet.getCell('A1').alignment = { horizontal: 'left' };
//     worksheet.mergeCells('A2:' + this.alphabetJSON[columns.length] + '2');
//     worksheet.getCell('A2').value = `Balance Sheet Report - ${filterdate}`;
//     worksheet.getCell(`A2`).alignment = { horizontal: 'left' };
//     worksheet.getRow(4).values = columValue;
//     worksheet.columns = columns;

//     for(let i = 0; i < (tableArray1.length -1 ); i++) {
//       // console.log("i am here", tableArray1[i][2], tableArray2[i][2], parseInt(tableArray1[i][2].replace('( - )', '')), parseInt(tableArray2[i][2].replace('( - )', '')));     
//       let obj={
//         account_code_1: tableArray1[i][0],
//         expenditure: tableArray1[i][1],
//         amount_1: tableArray1[i][2] != '' ? tableArray1[i][2].includes('( - )') ? parseInt(tableArray1[i][2].replace('( - )', '').replace(',', '')): parseInt(tableArray1[i][2].replace(',', '')) : '-' ,
//         account_code_2: tableArray2[i][0],
//         income: tableArray2[i][1],
//         amount_2: tableArray2[i][2] != '' ? tableArray2[i][2].includes('( - )') ? parseInt(tableArray2[i][2].replace('( - )', '').replace(',', '')): parseInt(tableArray2[i][2].replace(',', '')) : '-',
      
//       };

//       // obj2.amount_1 += table1[i] ? table1[i].debit_data.map(t => t.vc_credit).reduce((acc, val) => acc + val, 0) - table1[i].credit_data.map(t => t.vc_debit).reduce((acc, val) => acc + val, 0): 0;
//       // obj2.amount_2 += table[i] ? table[i].credit_data.map(t => t.vc_debit).reduce((acc, val) => acc + val, 0) - table[i].debit_data.map(t => t.vc_credit).reduce((acc, val) => acc + val, 0): 0;
//       // // console.log("i am obj", obj);

//       worksheet.addRow(obj);

//     }
//     let obj={
//       account_code_1: '',
//       expenditure: 'Total',
//       amount_1:  this.getTwoDecimalValue(this.debitTotal),
//       account_code_2: '',
//       income: 'Total',
//       amount_2: this.getTwoDecimalValue(this.creditTotal),
    
//     };
//     worksheet.addRow(obj);

//     worksheet.getRow(worksheet._rows.length).eachCell(cell => {
//       columndefinition.forEach(element => {
//         cell.font = {
//           color: { argb: 'ffffff' },
//           bold: true,
//           name: 'Arial',
//           size: 10
//         };
//         cell.alignment = { wrapText: true, horizontal: 'center' };
//         cell.fill = {
//           type: 'pattern',
//           pattern: 'solid',
//           fgColor: { argb: '439f47' },
//           bgColor: { argb: '439f47' }
//         };
//         cell.border = {
//           top: { style: 'thin' },
//           left: { style: 'thin' },
//           bottom: { style: 'thin' },
//           right: { style: 'thin' }
//         };
//       });
//     });
//     // style all row of excel
//     worksheet.eachRow((row, rowNum) => {
//       if (rowNum === 1) {
//         row.font = {
//           name: 'Arial',
//           size: 14,
//           bold: true
//         };
//       } else if (rowNum === 2) {
//         row.font = {
//           name: 'Arial',
//           size: 12,
//           bold: true
//         };
//       } else if (rowNum === 4) {
//         row.eachCell((cell) => {
//           cell.font = {
//             name: 'Arial',
//             size: 12,
//             bold: true
//           };
//           cell.fill = {
//             type: 'pattern',
//             pattern: 'solid',
//             fgColor: { argb: 'bdbdbd' },
//             bgColor: { argb: 'bdbdbd' },
//           };
//           cell.border = {
//             top: { style: 'thin' },
//             left: { style: 'thin' },
//             bottom: { style: 'thin' },
//             right: { style: 'thin' }
//           };
//           cell.alignment = { horizontal: 'center', wrapText: true };
//         });
//       } else if (rowNum > 4 && rowNum < worksheet._rows.length) {
//         const cellIndex = this.notFormatedCellArray.findIndex(item => item === rowNum);
//         if (cellIndex === -1) {
//           row.eachCell((cell) => {
//             cell.font = {
//               name: 'Arial',
//               size: 10,
//             };
//             cell.alignment = { wrapText: true, horizontal: 'center' };
//           });
//           if (rowNum % 2 === 0) {
//             row.eachCell((cell) => {
//               cell.fill = {
//                 type: 'pattern',
//                 pattern: 'solid',
//                 fgColor: { argb: 'ffffff' },
//                 bgColor: { argb: 'ffffff' },
//               };
//               cell.border = {
//                 top: { style: 'thin' },
//                 left: { style: 'thin' },
//                 bottom: { style: 'thin' },
//                 right: { style: 'thin' }
//               };
//             });
//           } else {
//             row.eachCell((cell) => {
//               cell.fill = {
//                 type: 'pattern',
//                 pattern: 'solid',
//                 fgColor: { argb: 'ffffff' },
//                 bgColor: { argb: 'ffffff' },
//               };
//               cell.border = {
//                 top: { style: 'thin' },
//                 left: { style: 'thin' },
//                 bottom: { style: 'thin' },
//                 right: { style: 'thin' }
//               };
//             });
//           }

//         }
//       }
//       row.defaultRowHeight = 24;
//     });
//     worksheet.mergeCells('A' + (worksheet._rows.length + 1) + ':' +
//     this.alphabetJSON[columns.length] + (worksheet._rows.length + 1));
//   worksheet.getCell('A' + worksheet._rows.length).value = 'Generated On: '
//     + new DatePipe('en-in').transform(new Date(), 'd-MMM-y');
//   worksheet.getCell('A' + worksheet._rows.length).font = {
//     name: 'Arial',
//     size: 10,
//     bold: true
//   };

//   worksheet.mergeCells('A' + (worksheet._rows.length + 1) + ':' +
//     this.alphabetJSON[columns.length] + (worksheet._rows.length + 1));
//   worksheet.getCell('A' + worksheet._rows.length).value = 'Generated By: ' + this.currentUser.full_name;
//   worksheet.getCell('A' + worksheet._rows.length).font = {
//     name: 'Arial',
//     size: 10,
//     bold: true
//   };
//     workbook.xlsx.writeBuffer().then(data => {
//       const blob = new Blob([data], { type: 'application/octet-stream' });
//       saveAs(blob, "Balance_sheet_report" + ".xlsx");
//     });

// // get all rows in the first table body
//     // const rows = table.tBodies[0].rows;
//   }
  /*name of the excel-file which will be downloaded. */ 
  fileName= 'Chart_of_Accounts_report.xlsx';  

  exportExcel(): void 
  {
       /* table id is passed over here */   
       let element = document.getElementById('excel-table'); 
       const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);

       /* generate workbook and add the worksheet */
       const wb: XLSX.WorkBook = XLSX.utils.book_new();
       XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

       /* save to file */
       XLSX.writeFile(wb, this.fileName);
			
  }


  downloadPdf() {
    console.log(this.accountsArray);
    var prepare=[];
    this.accountsArray.forEach(e=>{
      var tempObj =[];
      tempObj.push(e.coa_code);
      tempObj.push(e.coa_acc_name);
      tempObj.push( e.coa_acc_group.group_name);
      tempObj.push( e.coa_acc_type.acc_type_name);
      tempObj.push( e.dependencies_type);
      tempObj.push(e.total && e.total['deviation'] ? e.total[0]['deviation'] + e.coa_opening_balance_data.opening_balance : e.coa_opening_balance_data.opening_balance);
      tempObj.push(e.coa_opening_balance_data.opening_balance + " " + e.coa_opening_balance_data.opening_balance_type);
      tempObj.push(e.coa_opening_balance_data.opening_balance_date);
      prepare.push(tempObj);
    });
    const doc = new jsPDF('p', 'mm', 'a0');
    doc.autoTable({
        head: [['Account Code','Account Name','Account Group','Account Type','Dependency Type','Closing Balance','Opening Balance','Opening Balance Date']],
        body: prepare
    });
    doc.save('Chart_of_Account' + '.pdf');
  }

  debitTotal(debitTotal: any) {
    throw new Error('Method not implemented.');
  }
  creditTotal(creditTotal: any) {
    throw new Error('Method not implemented.');
  }

  // downloadPdf() {
  //   const table:any = document.querySelector('#liabilities_side');
  //   const table1:any = document.querySelector('#assets_side');
  //   let tableArray1 = [];
  //   let tableArray2 = [];
  //   // console.log("i am table", table.tBodies[0].rows);
  //   Array.from(table.tBodies[0].rows).forEach((row:any, idx:any) => {
  //     let tds = []; 
  //     Array.from(row.cells).map((td:any) => tds.push(td.textContent));
      
  //     tableArray1.push(tds);
  //   });
  //   Array.from(table1.tBodies[0].rows).forEach((row:any, idx:any) => {
  //     let tds = []; 
  //     Array.from(row.cells).map((td:any) => tds.push(td.textContent));
      
  //     tableArray2.push(tds);
  //   });
  //   let filterdate = '';
  //   let arr = this.session[0].ses_name.split('-');
  //   if(this.date.length == 1) {
  //     filterdate = this.month_array.filter(e => e.id == this.date[0])[0].name + "'" + (parseInt(this.date[0]) < 4 ? arr[1].slice(-2): arr[0].slice(-2))
  //   } else {
  //     filterdate = this.month_array.filter(e => e.id == this.date[0])[0].name + "'" + (parseInt(this.date[0]) < 4 ? arr[1].slice(-2): arr[0].slice(-2));
  //     filterdate += "-" + this.month_array.filter(e => e.id == this.date[this.date.length - 1])[0].name + "'" + (parseInt(this.date[this.date.length - 1]) < 4 ? arr[1].slice(-2): arr[0].slice(-2))
  //   }
  //   let pdfrowdata = [];
  //   for(let i = 0; i < tableArray2.length - 1; i++) {
  //     pdfrowdata.push(tableArray1[i].concat(tableArray2[i]));
  //   }
  //   pdfrowdata.push(['', 'Total', this.getTwoDecimalValue(this.debitTotal) < 0 ? `( - )  ${new IndianCurrency().transform(this.getTwoDecimalValue(0 - this.debitTotal))}`: ` ${new IndianCurrency().transform(this.getTwoDecimalValue(this.debitTotal))}`, '', 'Total',this.getTwoDecimalValue(this.creditTotal) < 0 ? `( - ) ${new IndianCurrency().transform(this.getTwoDecimalValue(0 - this.creditTotal))}`: ` ${new IndianCurrency().transform(this.getTwoDecimalValue(this.creditTotal))}` ])
  //   console.log("i am here", pdfrowdata);
  //   const doc = new jsPDF('p', 'mm', 'a0');
  //   doc.levelHeading = [];
	// 				doc.levelTotalFooter = [];
	// 				doc.levelSubtotalFooter = [];

	// 	doc.autoTable({
	// 		// tslint:disable-next-line:max-line-length
	// 		head: [[new TitleCasePipe().transform(this.schoolInfo.school_name) + ', ' + this.schoolInfo.school_city + ', ' + this.schoolInfo.school_state]],
	// 		didDrawPage: function (data) {

	// 		},
	// 		headStyles: {
	// 			fontStyle: 'bold',
	// 			fillColor: '#ffffff',
	// 			textColor: 'black',
	// 			halign: 'center',
	// 			fontSize: 50,
	// 		},
	// 		useCss: true,
	// 		theme: 'striped'
	// 	});
  //   doc.autoTable({
  //     head: [[`Balance Sheet Report - ${filterdate}`]],
  //     margin: { bottom: 10 },
  //     didDrawPage: function (data) {

  //     },
  //     headStyles: {
  //       fontStyle: 'bold',
  //       fillColor: '#ffffff',
  //       textColor: 'black',
  //       halign: 'center',
  //       fontSize: 40,
  //       // textAlign: 'center'
  //     },
  //     useCss: true,
  //     theme: 'striped'
  //   });
  //   doc.autoTable({
  //     head: [['Account Code', 'Capital & Liabilites', 'Amount', 'Account Code', 'Assets', 'Amount']],
  //     body: pdfrowdata,
  //     startY: doc.previousAutoTable.finalY + 0.5,
  //     tableLineColor: 'black',
  //     didDrawPage: function (data) {
  //       doc.setFontStyle('bold');
  //     },
  //     willDrawCell: function (data) {
  //       // tslint:disable-next-line:no-shadowed-variable
  //       const doc = data.doc;
  //       const rows = data.table.body;

  //       // level 0
  //       const lfIndex = doc.levelTotalFooter.findIndex(item => item === data.row.index);
  //       if (lfIndex !== -1) {
  //         doc.setFontStyle('bold');
  //         doc.setFontSize('16');
  //         doc.setTextColor('#ffffff');
  //         doc.setFillColor(0, 62, 120);
  //       }

  //       // level more than 0
  //       const lsfIndex = doc.levelSubtotalFooter.findIndex(item => item === data.row.index);
  //       if (lsfIndex !== -1) {
  //         doc.setFontStyle('bold');
  //         doc.setFontSize('16');
  //         doc.setTextColor('#ffffff');
  //         doc.setFillColor(229, 136, 67);
  //       }

  //       // group heading
  //       const lhIndex = doc.levelHeading.findIndex(item => item === data.row.index);
  //       if (lhIndex !== -1) {
  //         doc.setFontStyle('bold');
  //         doc.setFontSize('16');
  //         doc.setTextColor('#5e666d');
  //         doc.setFillColor('#c8d6e5');
  //       }

  //       // grand total
  //       if (data.row.index === rows.length - 1) {
  //         doc.setFontStyle('bold');
  //         doc.setFontSize('16');
  //         doc.setTextColor('#ffffff');
  //         doc.setFillColor(67, 160, 71);
  //       }
  //     },
  //     headStyles: {
  //       fontStyle: 'bold',
  //       fillColor: '#c8d6e5',
  //       textColor: '#5e666d',
  //       fontSize: 16,
  //       halign: 'center',
  //     },
  //     alternateRowStyles: {
  //       fillColor: '#f1f4f7'
  //     },
  //     useCss: true,
  //     styles: {
  //       minCellHeight: 20,
  //       fontSize: 18,
  //       cellWidth: 'auto',
  //       textColor: 'black',
  //       lineColor: '#89a8c8',
  //       valign: 'middle',
  //       halign: 'right',
  //     },
  //     theme: 'grid'
  //   });
  //   doc.autoTable({
  //     // tslint:disable-next-line:max-line-length
  //     head: [['Generated On: '
  //       + new DatePipe('en-in').transform(new Date(), 'd-MMM-y')]],
  //     margin: { top: 10 },
  //     didDrawPage: function (data) {

  //     },
  //     headStyles: {
  //       fontStyle: 'bold',
  //       fillColor: '#ffffff',
  //       textColor: 'black',
  //       halign: 'left',
  //       fontSize: 40,
  //     },
  //     useCss: true,
  //     theme: 'striped'
  //   });
  //   doc.autoTable({
  //     // tslint:disable-next-line:max-line-length
  //     head: [['Generated By: ' + new TitleCasePipe().transform(this.currentUser.full_name)]],
  //     didDrawPage: function (data) {

  //     },
  //     headStyles: {
  //       fontStyle: 'bold',
  //       fillColor: '#ffffff',
  //       textColor: 'black',
  //       halign: 'left',
  //       fontSize: 40,
  //     },
  //     useCss: true,
  //     theme: 'striped'
  //   });
  //   doc.save('Balance_Sheet_Report' + ".pdf");
  // }

}