import { Component, OnInit, Input, Output, EventEmitter, ViewChild, Inject } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatSort, MatTableDataSource, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Element } from './model';
import { AdminService } from './../../admin-user-type/admin/services/admin.service';
@Component({
	selector: 'app-support-login-model',
	templateUrl: './support-login-model.component.html',
	styleUrls: ['./support-login-model.component.css']
})
export class SupportLoginModalComponent implements OnInit {
	accountsArray: any[] = [];
	
	school_prefix='';
	
	constructor(public dialogRef: MatDialogRef<SupportLoginModalComponent>,
		@Inject(MAT_DIALOG_DATA) public data,private adminService: AdminService,) {
			console.log('data--', data);
		this.accountsArray = data.apiData.data;
		this.school_prefix = data.apiData.schoolprefix;
	}

	ngOnInit() {

	}

	loginSupportStaff(usertype) {
		console.log('usertype--', usertype);
		var role_id = 2;
		if (usertype == 'admin') {
			role_id = 2;
		} else if (usertype == 'teacher') {
			role_id = 3;
		} else if (usertype == 'student') {
			role_id = 4;
		}
		const hostName = 'https://login.invictusdigisoft.com/login?s='+role_id+'-'+this.school_prefix;
		var left = (screen.width / 2) - (800 / 2);
		var top = (screen.height / 2) - (800 / 2);
		window.open( hostName, 'Staff', 'height=800,width=800,dialog=yes,resizable=no, top=' +
			top + ',' + 'left=' + left);
		//window.open(location.protocol + '//' + hostName + '/login?s=2', "theFrame");
		this.dialogRef.close();

		// var win = window.open('', 'Staff', 'height=800,width=1250,dialog=yes,resizable=no, top=' +
		// 	top + ',' + 'left=' + left);
		// 	setTimeout(() => win.document.title = this.school_prefix,0);
		// win.document.write('<iframe width="1270" height="700" src="'+location.protocol + '//' + hostName +'" frameborder="0" allowfullscreen></iframe>');
		
	}

	closeDialog() {
		this.dialogRef.close();
	}


}
