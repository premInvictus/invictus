import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonAPIService, SisService } from '../../_services/index';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-party-wise-accounts',
  templateUrl: './party-wise-accounts.component.html',
  styleUrls: ['./party-wise-accounts.component.scss']
})
export class PartyWiseAccountsComponent implements OnInit {
  ngOnInit() {

  }
}
