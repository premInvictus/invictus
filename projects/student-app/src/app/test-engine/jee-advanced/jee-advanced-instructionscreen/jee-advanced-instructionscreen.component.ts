import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
@Component({
	selector: 'app-jee-advanced-instructionscreen',
	templateUrl: './jee-advanced-instructionscreen.component.html',
	styleUrls: ['./jee-advanced-instructionscreen.component.css']
})
export class JeeAdvancedInstructionscreenComponent implements OnInit {

	constructor(@Inject(MAT_DIALOG_DATA) public data,
							private diaogRef: MatDialogRef<JeeAdvancedInstructionscreenComponent>) { }

	ngOnInit() {
	}
	closeDialog() {
		this.diaogRef.close();
	}

}
