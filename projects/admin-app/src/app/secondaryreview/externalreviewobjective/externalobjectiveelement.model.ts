export interface MCQElement {
		position: number;
		question: any;
		explanations: string;
		options: any;
		topic: any;
		subtopic: any[];
		info: string;
		details: string;
		action: any;
		class: any;
		reasons: any;
		skill: any[];
		lod: any[];
		topic_id: any;
		st_name: any;
		skill_name: any;
		dl_name: any;
		tooltip: any;
		qus_id: any;
}
export interface MultiMCQElement {
		positionMulti: number;
		questionMulti: any;
		explanationsMulti: string;
		optionsMulti: any;
		infoMulti: string;
		detailsMulti: string;
		actionMulti: any;
		topicMulti: any;
		subtopicMulti: any[];
		classMulti: any;
		reasons: any;
		skillMulti: any[];
		lodMulti: any[];
		topic_id: any;
		st_name: any;
		skill_name: any;
		dl_name: any;
		tooltip: any;
		qus_id: any;
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
		subtopicTF: any[];
		reasons: any;
		skillTF: any[];
		lodTF: any[];
		topic_id: any;
		st_name: any;
		skill_name: any;
		dl_name: any;
		tooltip: any;
		qus_id: any;
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
		subtopicMatch: any[];
		reasons: any;
		skillMatch: any[];
		lodMatch: any[];
		topic_id: any;
		st_name: any;
		skill_name: any;
		dl_name: any;
		tooltip: any;
		qus_id: any;
}
export interface MatrixMatchElement {
		positionMatrixMatch: number;
		questionMatrixMatch: any;
		explanationsMatrixMatch: string;
		answerMatrixMatch: any;
		detailsMatrixMatch: string;
		actionMatrixMatch: any;
		classMatrixMatch: any;
		topicMatrixMatch: any;
		subtopicMatrixMatch: any[];
		reasons: any;
		skillMatrixMatch: any[];
		lodMatrixMatch: any[];
		topic_id: any;
		st_name: any;
		skill_name: any;
		dl_name: any;
		tooltip: any;
		qus_id: any;
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
		subtopicMatrixMatch: any[];
		reasons: any;
		skillMatrixMatch: any[];
		lodMatrixMatch: any[];
		topic_id: any;
		st_name: any;
		skill_name: any;
		dl_name: any;
		tooltip: any;
		qus_id: any;
}
export interface SingleIntegerElement {
		position: number;
		question: any;
		answer: any;
		info: string;
		details: string;
		action: any;
		class: any;
		explanations: any;
		topic: any;
		reasons: any;
		subtopic: any[];
		skill: any[];
		lod: any[];
		topic_id: any;
		st_name: any;
		skill_name: any;
		dl_name: any;
		tooltip: any;
		qus_id: any;
	}

	export interface DoubleIntegerElement {
		position: number;
		question: any;
		answer: any;
		info: string;
		details: string;
		action: any;
		class: any;
		explanations: any;
		topic: any;
		reasons: any;
		subtopic: any[];
		skill: any[];
		lod: any[];
		topic_id: any;
		st_name: any;
		skill_name: any;
		dl_name: any;
		tooltip: any;
		qus_id: any;
	}
