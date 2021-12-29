import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reminders',
  templateUrl: './reminders.component.html',
  styleUrls: ['./reminders.component.scss']
})
export class RemindersComponent implements OnInit {

  isLoading : boolean = true;
  loader_status = "Feature Under Construction";
  constructor() { }

  ngOnInit() {
  }

  openDialog(type){
    alert("feature is under development")
  }
  
}
