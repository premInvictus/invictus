import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { Subject } from 'rxjs';
import { TreeviewItem } from 'ngx-treeview';
import { NotificationsService } from 'angular2-notifications';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';
import { CookieService } from 'ngx-cookie';
import { environment } from 'src/environments/environment';

@Injectable()
export class BranchChangeService {
	menus: any[] = [];
	homeUrl: string;
	userData: any;
	reserv_id: any;
	constructor(private http: HttpClient, private _cookieService: CookieService,
		private _notificationService: NotificationsService) {
		this.menus = (JSON.parse(localStorage.getItem('userAccessMenu'))) ?
			(JSON.parse(localStorage.getItem('userAccessMenu'))).menus : [];
	}
	
	branchSwitchSubject = new Subject();
	
}
