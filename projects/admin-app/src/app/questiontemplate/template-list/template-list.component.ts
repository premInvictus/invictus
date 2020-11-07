import { Component, OnInit } from '@angular/core';
import { BreadCrumbService } from '../../_services/index';

@Component({
  selector: 'app-template-list',
  templateUrl: './template-list.component.html',
  styleUrls: ['./template-list.component.css']
})
export class TemplateListComponent implements OnInit {

  homeUrl: string;

  constructor(
    private breadCrumbService: BreadCrumbService
  ) { }

  ngOnInit() {
    this.homeUrl = this.breadCrumbService.getUrl();
  }

}
