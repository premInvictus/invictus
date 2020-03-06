import { Component, OnInit, NgZone } from '@angular/core';
import { CommonAPIService, InventoryService } from '../../_services/index';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-store-common',
  templateUrl: './store-common.component.html',
  styleUrls: ['./store-common.component.css']
})
export class StoreCommonComponent implements OnInit {
  tabSelectedIndex = 0;
  tabIndex: any;
  setBlankArray: any[] = [];
  constructor(
    public inventory: InventoryService,
    private commonAPIService: CommonAPIService,
    private router: Router,
    private route: ActivatedRoute,
    public ngZone: NgZone
  ) { }

  ngOnInit() {
    if (this.inventory.getTabIndex()) {
      this.tabIndex = this.inventory.getTabIndex();
      this.tabSelectedIndex = this.tabIndex.currentTab;
      console.log(this.tabSelectedIndex, 'this.tabSelectedIndex');
      this.inventory.resetTabIndex();
    }
  }
  setTabValue(value) {
    this.tabSelectedIndex = value;
    this.inventory.setTabIndex({ 'currentTab': this.tabSelectedIndex });
  }

  // redirectToPage(index) {
  //   if (index === 'PO') {
  //     this.inventory.setrequisitionArray(this.setBlankArray);
  //     this.router.navigate(['../create-purchase-order'], { relativeTo: this.route });
  //   } else if (index === 'GR') {
  //     this.inventory.setrequisitionArray(this.setBlankArray);
  //     this.router.navigate(['../generate-receipt'], { relativeTo: this.route });
  //   }
  // }

}
