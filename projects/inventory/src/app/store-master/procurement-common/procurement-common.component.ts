import { Component, OnInit } from '@angular/core';
import { CommonAPIService, InventoryService } from '../../_services/index';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-procurement-common',
  templateUrl: './procurement-common.component.html',
  styleUrls: ['./procurement-common.component.css']
})
export class ProcurementCommonComponent implements OnInit {
  tabSelectedIndex = 0;
  setBlankArray: any[] = [];
  constructor(
    public inventory: InventoryService,
    private commonAPIService: CommonAPIService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.commonAPIService.tabChange.subscribe((result: any) => {
      if (result) {
        this.tabSelectedIndex = result.currrentTab;
      }
    });
  }
  setTabValue(value) {
    this.tabSelectedIndex = value;
    this.commonAPIService.tabChange.next({ 'currrentTab': this.tabSelectedIndex });
  }
  redirectToPage(index) {
    if (index === 'PO') {
      this.inventory.setrequisitionArray(this.setBlankArray);
      this.router.navigate(['../create-purchase-order'], { relativeTo: this.route });
    } else if (index === 'GR') {
      this.inventory.setrequisitionArray(this.setBlankArray);
      this.router.navigate(['../generate-receipt'], { relativeTo: this.route });
    }
  }
}
