import { Component, OnInit } from '@angular/core';
import { CommonAPIService } from 'src/app/_services';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-school-dashboard',
  templateUrl: './school-dashboard.component.html',
  styleUrls: ['./school-dashboard.component.css']
})
export class SchoolDashboardComponent implements OnInit {
  notif: any;
  constructor(private router: Router, private commonAPIService: CommonAPIService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    if (this.commonAPIService.getNotif()) {
      this.notif = this.commonAPIService.getNotif();
      if (this.notif === 1) {
        this.router.navigate(['misc/school/communication/notification']);
      }
      this.commonAPIService.resetNotif();
    }
  }
  viewFileSystem() {
    this.router.navigate(['misc/school/fms/school-records']);
  }
}
