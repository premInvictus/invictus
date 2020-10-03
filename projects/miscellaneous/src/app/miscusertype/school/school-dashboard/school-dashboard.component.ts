import { Component, OnInit } from '@angular/core';
import { CommonAPIService } from 'src/app/_services';
import { Router, ActivatedRoute } from '@angular/router';
import { BranchChangeService } from 'src/app/_services/branchChange.service';

@Component({
  selector: 'app-school-dashboard',
  templateUrl: './school-dashboard.component.html',
  styleUrls: ['./school-dashboard.component.css']
})
export class SchoolDashboardComponent implements OnInit {
  notif: any;
  constructor(private router: Router, private commonAPIService: CommonAPIService,
    private route: ActivatedRoute,private branchChangeService: BranchChangeService) { }

  ngOnInit() {
    if (this.commonAPIService.getNotif()) {
      this.notif = this.commonAPIService.getNotif();
      if (this.notif === 1) {
        this.router.navigate(['misc/school/communication/notification']);
      }
      this.commonAPIService.resetNotif();
    }

    this.branchChangeService.branchSwitchSubject.subscribe((data:any)=>{
			if(data) {
      }
    });
  }
  viewFileSystem() {
    this.router.navigate(['misc/school/fms/school-records']);
  }
}
