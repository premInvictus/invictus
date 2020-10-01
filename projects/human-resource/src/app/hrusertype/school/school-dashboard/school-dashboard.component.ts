import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BranchChangeService } from 'src/app/_services/branchChange.service';
@Component({
  selector: 'app-school-dashboard',
  templateUrl: './school-dashboard.component.html',
  styleUrls: ['./school-dashboard.component.css']
})
export class SchoolDashboardComponent implements OnInit {

  constructor( private router: Router,
    private route: ActivatedRoute,
    private branchChangeService: BranchChangeService) { }

  ngOnInit() {
    this.branchChangeService.branchSwitchSubject.subscribe((data:any)=>{
			if(data) {
      }
    });
  }
  viewEmployee() {
    this.router.navigate(['hr/school/employee/employee-details']);
  }
}
