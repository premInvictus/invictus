import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-accession-master',
  templateUrl: './accession-master.component.html',
  styleUrls: ['./accession-master.component.css']
})
export class AccessionMasterComponent implements OnInit {

  assessionMasterContainer = true;
  addBookContainer = false;

  constructor() { }

  ngOnInit() {
  }

  addBook() {
    this.assessionMasterContainer =  false;
    this.addBookContainer = true;
  }

}
