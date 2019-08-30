import { Component, OnInit, Inject } from '@angular/core';
import {MatDialogRef , MAT_DIALOG_DATA} from '@angular/material/dialog';
@Component({
	selector: 'app-ongoing-test-instruction',
	templateUrl: './ongoing-test-instruction.component.html',
	styleUrls: ['./ongoing-test-instruction.component.css']
})
export class OngoingTestInstructionComponent implements OnInit {
	instructionStatus: any;
	questionSubtypeHeader: any;
	trueFalseArray: any[] = [
		{name: 'True', value: '0'},
		{name: 'False', value: '1'}];
		matchArray: any[] = [{name: 'A', value: ['P', 'Q', 'R', 'S']},
		{name: 'B', value: ['P', 'Q', 'R', 'S']},
		{name: 'C', value: ['P', 'Q', 'R', 'S']},
		{name: 'D', value: ['P', 'Q', 'R', 'S']}];

		matrixMatchArray: any[] = [{name: 'A',
		value: [{index: 0, id: 'P'}, {index: 1, id: 'Q'}, {index: 2, id: 'R'}, {index: 3, id: 'S'}]},
		{name: 'B',
		value: [{index: 4, id: 'P'}, {index: 5, id: 'Q'}, {index: 6, id: 'R'}, {index: 7, id: 'S'}]},
		{name: 'C',
		value: [{index: 8, id: 'P'}, {index: 9, id: 'Q'}, {index: 10, id: 'R'}, {index: 11, id: 'S'}]},
		{name: 'D',
		value: [{index: 12, id: 'P'}, {index: 13, id: 'Q'}, {index: 14, id: 'R'}, {index: 15, id: 'S'}]}];

		matrixMatch45Array: any[] = [{name: 'A',
		value: [{index: 0, id: 'P'}, {index: 1, id: 'Q'}, {index: 2, id: 'R'}, {index: 3, id: 'S'}, {index: 4, id: 'T'}]},
		{name: 'B',
		value: [{index: 5, id: 'P'}, {index: 6, id: 'Q'}, {index: 7, id: 'R'}, {index: 8, id: 'S'}, {index: 9, id: 'T'}]},
		{name: 'C',
		value: [{index: 10, id: 'P'}, {index: 11, id: 'Q'}, {index: 12, id: 'R'}, {index: 13, id: 'S'}, {index: 14, id: 'T'}]},
		{name: 'D',
		value: [{index: 15, id: 'P'}, {index: 16, id: 'Q'}, {index: 17, id: 'R'}, {index: 18, id: 'S'}, {index: 19, id: 'T'}]}];
	optionHA: any[] = ['A', 'B', 'C', 'D'];
	singleIntegerArray: any[] = [{id: '0'}, {id: '1'}, {id: '2'}, {id: '3'}, {id: '4'}, {id: '5'}, {id: '6'}, {id: '7'}, {id: '8'}, {id: '9'}];
	doubleIntegerArray1: any[] = [
		{id: '0'}, {id: '1'}, {id: '2'}, {id: '3'}, {id: '4'}, {id: '5'}, {id: '6'}, {id: '7'}, {id: '8'}, {id: '9'}];
	doubleIntegerArray2: any[] = [
		{id: '0'}, {id: '1'}, {id: '2'}, {id: '3'}, {id: '4'}, {id: '5'}, {id: '6'}, {id: '7'}, {id: '8'}, {id: '9'}];
	matchAnswer: any[] = [{evd_qus_answer: 'P'}, {evd_qus_answer: 'Q'}, {evd_qus_answer: 'R'}, {evd_qus_answer: 'S'}];
	matrixmatchAnswer: any[] = [
	{evd_qus_answer: '1'},
	{evd_qus_answer: '0'},
	{evd_qus_answer: '0'},
	{evd_qus_answer: '0'},
	{evd_qus_answer: '1'},
	{evd_qus_answer: '1'},
	{evd_qus_answer: '1'},
	{evd_qus_answer: '0'},
	{evd_qus_answer: '1'},
	{evd_qus_answer: '1'},
	{evd_qus_answer: '1'},
	{evd_qus_answer: '1'},
	{evd_qus_answer: '0'},
	{evd_qus_answer: '1'},
	{evd_qus_answer: '1'},
	{evd_qus_answer: '0'}];

	matrixmatch45Answer: any[] = [
		{evd_qus_answer: '1'},
		{evd_qus_answer: '0'},
		{evd_qus_answer: '0'},
		{evd_qus_answer: '0'},
		{evd_qus_answer: '1'},
		{evd_qus_answer: '1'},
		{evd_qus_answer: '1'},
		{evd_qus_answer: '1'},
		{evd_qus_answer: '0'},
		{evd_qus_answer: '1'},
		{evd_qus_answer: '1'},
		{evd_qus_answer: '1'},
		{evd_qus_answer: '1'},
		{evd_qus_answer: '1'},
		{evd_qus_answer: '1'},
		{evd_qus_answer: '0'},
		{evd_qus_answer: '1'},
		{evd_qus_answer: '1'},
		{evd_qus_answer: '0'},
		{evd_qus_answer: '1'}, ];
	constructor(public dialogRef: MatDialogRef<OngoingTestInstructionComponent>,
							@Inject(MAT_DIALOG_DATA) public data) { }

	ngOnInit() {
		console.log(this.data);
		this.instructionStatus = Number(this.data.item.qus_qst_id);
		if (this.instructionStatus === 1) {
			this.questionSubtypeHeader = 'Only one option correct Type';
		}
		if (this.instructionStatus === 2) {
			this.questionSubtypeHeader = 'One or More options Correct Type';
		}
		if (this.instructionStatus === 3) {
			this.questionSubtypeHeader = 'True or False Type';
		}
		if (this.instructionStatus === 4) {
			this.questionSubtypeHeader = 'Match the following Type';
		}
		if (this.instructionStatus === 5) {
			this.questionSubtypeHeader = 'Matching the column Type';
		}
		if (this.instructionStatus > 5 && this.instructionStatus < 13) {
			this.questionSubtypeHeader = 'Subjective Type';
		}
		if (this.instructionStatus === 13) {
			this.questionSubtypeHeader = 'Matching the column Type';
		}
		if (this.instructionStatus === 14) {
			this.questionSubtypeHeader = 'Integer Value Correct Type';
		}
		if (this.instructionStatus === 15) {
			this.questionSubtypeHeader = 'Integer Answer Type';
		}
	}
	closeMainDialog()  {
		this.dialogRef.close();
	}
	checkMatchStatus(val, index) {
		if (this.matchAnswer[index].evd_qus_answer === val) {
			return true;
		} else {
			return false;
		}
	}
	checkMatrixStatus(index) {
		if (Number(this.matrixmatchAnswer[index].evd_qus_answer) === 1) {
			return true;
		} else {
			return false;
		}
	}

	checkMatrix45Status(index) {
		if (Number(this.matrixmatch45Answer[index].evd_qus_answer) === 1) {
			return true;
		} else {
			return false;
		}
	}
}
