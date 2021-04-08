import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonAPIService, SisService, AxiomService, InventoryService } from '../../_services';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-store-assign-list',
  templateUrl: './store-assign-list.component.html',
  styleUrls: ['./store-assign-list.component.css']
})
export class StoreAssignListComponent implements OnInit {
  assignListArray: any[] = [];
  constructor(private fbuild: FormBuilder,
    public commonService: CommonAPIService,
    public axiomService: AxiomService,
    public sisService: SisService,
    public inventory: InventoryService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.allStoreIncharge();
  }
  allStoreIncharge() {
    this.assignListArray = [];
    this.inventory.allStoreIncharge({}).subscribe((result: any) => {
      if (result) {
        for(let item of result){
          item['emp_name'] = [];
          if(item.employees) {
            const emp = item.employees.map(e => e.emp_name);
            console.log('emp',emp);
            item['emp_name'] = emp;
          }  
          this.assignListArray.push(item);         
        }
      }
    });
  }
  viewData(item) {
    this.inventory.setAssignEmp(item);
    this.inventory.receipt.next({ 'currentTab': 0, currentChildTab:''});
  }
  bundleList(item) {
    this.inventory.setAssignEmp(item);
    this.inventory.receipt.next({ 'currentTab': 0, currentChildTab:'bundlelist'});
  }
}
