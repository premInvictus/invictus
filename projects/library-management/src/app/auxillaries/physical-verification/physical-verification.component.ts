import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-physical-verification',
  templateUrl: './physical-verification.component.html',
  styleUrls: ['./physical-verification.component.css']
})
export class PhysicalVerificationComponent implements OnInit {

  showMainPhyicalVerification = true;
  showBookList = false;

  constructor() { }

  ngOnInit() {
    
  }

  onClickVerifiedOn() {
    this.showMainPhyicalVerification = false;
    this.showBookList = true;
  }

}
