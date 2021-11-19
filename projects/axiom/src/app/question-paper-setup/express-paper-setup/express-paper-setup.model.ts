
export interface Element {
		topic: string;
		subtopic: string;
		position: number;
		action: string;
		subid: any;
	}

	export interface QUESTIONElement {
		position: number;
		question: any;
		explanations: string;
		options: any;
		showHover: any;
		select: number;
		skillType: any;
		topic: any;
		subtopic: any;
		suggestedMarks: number;
		reference: any;
	}
	export interface ESSAYQUESTIONElement {
		position: number;
		question: string;
		explanations: string;
		options: any;
		essayTitle: string;
		showHover: any;
		select: number;
		skillType: any;
		topic: any;
		subtopic: any;
		suggestedMarks: number;
		reference: any;
	}
	export interface ReviewElement {
		position: number;
		question: any;
		answer: any;
		skill: any;
		lod: any;
		marks: number;
		negativeMarks: number;
		action: any;
}

