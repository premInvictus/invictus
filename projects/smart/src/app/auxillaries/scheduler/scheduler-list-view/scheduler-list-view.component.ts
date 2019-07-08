import { Component, OnInit, ViewChild, AfterViewInit, Input, OnChanges } from '@angular/core';
import { SmartService, CommonAPIService } from '../../../_services';
import { MatTableDataSource, MatPaginator, PageEvent, MatSort, MatPaginatorIntl } from '@angular/material';
import { SchedulerList } from './scheduler-list.model';
import { MatDialog } from '@angular/material';
import { AddSchedulerComponent } from '../add-scheduler/add-scheduler.component';

@Component({
	selector: 'app-scheduler-list-view',
	templateUrl: './scheduler-list-view.component.html',
	styleUrls: ['./scheduler-list-view.component.css']
})
export class SchedulerListViewComponent implements OnInit, AfterViewInit, OnChanges {

	@Input() reloadScheduler;
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild('deleteModalRef') deleteModalRef;
	ELEMENT_DATA: SchedulerList[] = [];
	displayedColumns = ['srno', 'publishedon', 'eventdate', 'eventname', 'eventdesc', 'class', 'eventcategory', 'action'];
	dataSource = new MatTableDataSource<SchedulerList>(this.ELEMENT_DATA);
	nodataFlag = true;
	schedulerArray: any[] = [];
	pageLength: number;
	pageSize = 10;
	pageSizeOptions = [5, 10, 25, 100];

	constructor(
		private smartService: SmartService,
		private commonAPIService: CommonAPIService,
		public dialog: MatDialog
	) { }

	ngOnInit() {
		this.getScheduler();
	}
	ngAfterViewInit() {
		this.dataSource.paginator = this.paginator;
	}
	ngOnChanges() {
    console.log('calling ngonchanges', this.reloadScheduler);
		if (this.reloadScheduler > 0) {
			this.getScheduler();
		}
	}
	openModal = (data) => {
		data.text = 'Delete';
		this.deleteModalRef.openModal(data);
	}
	openAddScheduler(value) {
		const dialogRef = this.dialog.open(AddSchedulerComponent, {
			height: '70%',
			width: '800px',
			data: {
				title: 'Edit Scheduler',
				schedulerDetails: value
			}
		});
		dialogRef.afterClosed().subscribe(dresult => {
      console.log(dresult);
      if (dresult && dresult.reloadScheduler) {
				this.getScheduler();
			}
		});
	}
	deleteScheduler(value) {
		this.smartService.deleteScheduler({ sc_id: value.sc_id }).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'success');
				this.getScheduler();
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
			}
		});
	}
	getScheduler() {
    console.log('in getScheduler reloadScheduler', this.reloadScheduler);
		this.smartService.getScheduler({}).subscribe((result: any) => {
			if (result && result.status === 'ok') {
				this.ELEMENT_DATA = [];
				this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
				this.schedulerArray = result.data;
				console.log(result.data);
				if (this.schedulerArray.length > 0) {
					this.nodataFlag = false;
					let i = 0;
					this.schedulerArray.forEach(item => {
						const each: any = {};
						each.srno = ++i;
						each.sc_id = item.sc_id;
						each.publishedon = this.commonAPIService.dateConvertion(item.sc_created_on);
						each.eventdate = this.commonAPIService.dateConvertion(item.sc_from, 'd MMM') +
							' - ' + this.commonAPIService.dateConvertion(item.sc_to, 'd MMM');
						each.eventname = item.sc_title;
						each.eventdesc = item.sc_description;
						if (item.classes && item.classes.length > 0) {
							const classNameArray = [];
							item.classes.forEach(element => {
								classNameArray.push(element.class_name);
							});
							each.class = classNameArray;
						} else {
							each.class = '-';
						}
						each.eventcategory = item.ec_name;
						each.action = item;
						this.ELEMENT_DATA.push(each);
					});
					this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
					this.dataSource.paginator = this.paginator;
					this.pageLength = this.ELEMENT_DATA.length;
					console.log(this.ELEMENT_DATA);

				} else {
					this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
					this.nodataFlag = true;
				}
			} else {
				this.commonAPIService.showSuccessErrorMessage(result.message, 'error');
				this.nodataFlag = true;
			}
		});
	}
	changePage(pageEvent: PageEvent) {
		console.log(pageEvent);
		// this.paginator.length = 100;
	}
}
