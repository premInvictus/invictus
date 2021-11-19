import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material';
import { CapitalizePipe } from '../../../../../examination/src/app/_pipes';
import { DatePipe, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-certificate-printing',
  templateUrl: './certificate-printing.component.html',
  styleUrls: ['./certificate-printing.component.scss']
})
export class CertificatePrintingComponent implements OnInit {


  ngOnInit() {
    
  }
}
