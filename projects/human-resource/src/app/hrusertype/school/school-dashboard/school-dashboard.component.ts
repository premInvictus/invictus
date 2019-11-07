import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-school-dashboard',
  templateUrl: './school-dashboard.component.html',
  styleUrls: ['./school-dashboard.component.css']
})
export class SchoolDashboardComponent implements OnInit {

  constructor( private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
  }
  viewEmployee() {
    this.router.navigate(['hr/school/employee/employee-details']);
  }
}
