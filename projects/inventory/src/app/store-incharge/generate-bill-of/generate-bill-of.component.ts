import { Component, OnInit, NgZone } from '@angular/core';
import { CommonAPIService, InventoryService } from '../../_services/index';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-generate-bill-of',
  templateUrl: './generate-bill-of.component.html',
  styleUrls: ['./generate-bill-of.component.css']
})
export class GenerateBillOfComponent implements OnInit {

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
    this.inventory.receipt.subscribe((result: any) => {
      if (result) {
        this.tabIndex = result.currentTab;
        this.setTabValue(this.tabIndex)
      }
    })
  }
  setTabValue(value) {
    this.tabSelectedIndex = value;
    this.inventory.setTabIndex({ 'currentTab': this.tabSelectedIndex });
  }
}
