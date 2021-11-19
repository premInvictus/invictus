import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
	selector: 'app-past-assignments-report',
	templateUrl: './past-assignments-report.component.html',
	styleUrls: ['./past-assignments-report.component.css']
})
export class PastAssignmentsReportComponent implements OnInit {

	constructor(
		private route: ActivatedRoute,
		private router: Router
	) { }

	ngOnInit() {
		this.router.navigate(['../../assignment/past-assignments'], {relativeTo: this.route});
	}

}
