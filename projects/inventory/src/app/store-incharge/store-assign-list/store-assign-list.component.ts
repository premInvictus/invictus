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
    this.inventory.allStoreIncharge({}).subscribe((result: any) => {
      if (result) {
        this.assignListArray = result;
        console.log(result);
      }
    });
  }
  viewData(item) {
    //console.log(item);
    this.inventory.setAssignEmp(item);
    this.router.navigate(['../assign-store'], { relativeTo: this.route });
  }
}
