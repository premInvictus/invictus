import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-common-attendance',
  templateUrl: './common-attendance.component.html',
  styleUrls: ['./common-attendance.component.css']
})
export class CommonAttendanceComponent implements OnInit {
  checked = false;
  constructor() { }
  ngOnInit() {

  }
  toggleStatus() {
    // console.log(this.checked);
  }
}
