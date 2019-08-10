import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
	selector: 'app-familywise-fee-reciept',
	templateUrl: './familywise-fee-reciept.component.html',
	styleUrls: ['./familywise-fee-reciept.component.css']
})
export class FamilywiseFeeRecieptComponent implements OnInit {

	constructor(
		private route: ActivatedRoute,
		private router: Router) { }

	ngOnInit() {
	}

	moveToAddFamily() {
		this.router.navigate(['../add-family'], { relativeTo: this.route });
	}

}
