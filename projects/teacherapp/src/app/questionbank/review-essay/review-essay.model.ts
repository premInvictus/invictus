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
		reasons: any;
		action: any;
}
export interface MCQElement {
		position: number;
		question: string;
		explanations: string;
		options: any;
		topic: any;
		subtopic: any;
		info: string;
		details: string;
		action: any;
		class: any;
}
export interface MultiMCQElement {
		positionMulti: number;
		questionMulti: string;
		explanationsMulti: string;
		optionsMulti: any;
		infoMulti: string;
		detailsMulti: string;
		actionMulti: any;
		topicMulti: any;
		subtopicMulti: any;
		classMulti: any;
}
export interface TrueFalseElement {
		positionTF: number;
		questionTF: string;
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
		questionMatch: string;
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
		questionMatrixMatch: string;
		explanationsMatrixMatch: string;
		answerMatrixMatch: any;
		detailsMatrixMatch: string;
		actionMatrixMatch: any;
		classMatrixMatch: any;
		topicMatrixMatch: any;
		subtopicMatrixMatch: any;
}
