
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Element } from './model';
import {SelectionModel} from '@angular/cdk/collections';
import { MatTableDataSource, MatPaginator, PageEvent, MatSort, MatPaginatorIntl } from '@angular/material';
import { TitleCasePipe } from '@angular/common';
import { SisService, CommonAPIService, FaService } from '../../_services/index';
import { ChartOfAccountsCreateComponent } from '../../fa-shared/chart-of-accounts-create/chart-of-accounts-create.component';

@Component({
  selector: 'app-chart-of-accounts',
  templateUrl: './chart-of-accounts.component.html',
  styleUrls: ['./chart-of-accounts.component.scss']
})
export class ChartsofAccountComponent implements OnInit {
  tableDivFlag = false;
  ELEMENT_DATA: Element[];
  displayedColumns: string[] = ['select', 'ac_code', 'ac_name', 'ac_group', 'ac_type', 'ac_cloosingbalance',  'action'];
  dataSource = new MatTableDataSource<Element>();
  selection = new SelectionModel<Element>(true, []);
  accountsArray:any[] = [];
  @ViewChild('deleteModal') deleteModal;
  @ViewChild('paginator') paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
  constructor(
		private fbuild: FormBuilder,
		private sisService: SisService,
		private commonAPIService: CommonAPIService,
		private faService:FaService,
		private dialog: MatDialog
  ) { }
  

  ngOnInit(){
    this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
    this.tableDivFlag = true;
    this.getAccounts();
  }

  openDeleteDialog = (data) => this.deleteModal.openModal(data);

  deleteConfirm(element) {
    console.log('value--', element);
    var inputJson = {
      coa_id: element.coa_id,
      coa_code: element.coa_code,
      coa_acc_name: element.coa_acc_name,
      coa_acc_group: {group_id: element.coa_acc_group},
      coa_acc_type: { acc_type_id: element.coa_acc_type,"acc_type_name": "test"},
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
              ac_code: item.coa_code,
              ac_name: item.coa_acc_name,
              ac_group: item.coa_acc_group.group_name,
              ac_type: item.coa_acc_type.acc_type_name,
              ac_cloosingbalance:0,
              status:item.coa_status,
              action:item

            };
            this.ELEMENT_DATA.push(element);
            pos++;
            
          }
          this.dataSource = new MatTableDataSource<Element>(this.ELEMENT_DATA);
          this.dataSource.paginator = this.paginator;
          if (this.sort) {
            this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
            this.dataSource.sort = this.sort;
          }
        
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
      coa_acc_group: {group_id: element.coa_acc_group},
      coa_acc_type: { acc_type_id: element.coa_acc_type,"acc_type_name": "test"},
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

  applyFilter(filterValue: string) {
		filterValue = filterValue.trim(); // Remove whitespace
		filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
		this.dataSource.filter = filterValue;
	}
}