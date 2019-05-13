
export interface SubjectiveElement {
		positionSub: number;
		questionSub: any;
		answerSub: any;
		infoSub: string;
		detailsSub: string;
		actionSub: any;
		classSub: any;
		topicSub: any;
		subtopicSub: any;
}

export interface MCQElement {
		position: number;
		question: any;
		explanations: string;
		options: any;
		details: string;
		action: any;
		class: any;
		topic: any;
		subtopic: any;
}

export interface MultiMCQElement {
		positionMulti: number;
		questionMulti: any;
		explanationsMulti: string;
		optionsMulti: any;
		infoMulti: string;
		detailsMulti: string;
		actionMulti: any;
		classMulti: any;
		topicMulti: any;
		subtopicMulti: any;
}

export interface TrueFalseElement {
		positionTF: number;
		questionTF: any;
		explanationsTF: string;
		optionsTF: any;
		infoTF: string;
		detailsTF: string;
		actionTF: any;
		classTF: any;
		topicTF: any;
		subtopicTF: any;
}

export interface MatchElement {
		positionMatch: number;
		questionMatch: any;
		explanationsMatch: string;
		optionsMatch: any;
		infoMatch: string;
		detailsMatch: string;
		actionMatch: any;
		classMatch: any;
		topicMatch: any;
		subtopicMatch: any;
}

export interface MatrixMatchElement {
		positionMatrixMatch: number;
		questionMatrixMatch: any;
		explanationsMatrixMatch: string;
		answerMatrixMatch: any;
		infoMatrixMatch: string;
		detailsMatrixMatch: string;
		actionMatrixMatch: any;
		classMatrixMatch: any;
		topicMatrixMatch: any;
		subtopicMatrixMatch: any;
}
export interface ReviewElement {
		position: number;
		question: any;
		answer: any;
		showHover: any;
		class: any;
		topic: any;
		subtopic: any;
		explanations: any;
		details: any;
		action: any;
		toolid: any;
}
export interface MatrixMatch4X5Element {
		positionMatrixMatch: number;
		questionMatrixMatch: any;
		explanationsMatrixMatch: string;
		answerMatrixMatch: any;
		detailsMatrixMatch: string;
		actionMatrixMatch: any;
		classMatrixMatch: any;
		topicMatrixMatch: any;
		subtopicMatrixMatch: any;
		reasons: any;
}

export interface SingleIntegerElement {
		position: number;
		question: any;
		answer: any;
		info: string;
		details: string;
		action: any;
		class: any;
		topic: any;
		reasons: any;
		subtopic: any;
	}

	export interface DoubleIntegerElement {
		position: number;
		question: any;
		answer: any;
		info: string;
		details: string;
		action: any;
		class: any;
		topic: any;
		reasons: any;
		subtopic: any;
	}

