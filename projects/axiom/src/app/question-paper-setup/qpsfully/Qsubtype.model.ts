export interface Element {
		position: number;
		qus: string;
		ans: string;
		skill: string;
		topic: string;
		subtopic: string;
		mark: string;
		ref: string;
		action: string;
}
export interface MCQElement {
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
		action: number;
}
export interface MultiMCQElement {
		positionMulti: number;
		actionMulti: number;
		questionMulti: any;
		explanationsMulti: string;
		optionsMulti: any;
		showHoverMulti: any;
		selectMulti: number;
		skillTypeMulti: any;
		topicMulti: any;
		subtopicMulti: any;
		suggestedMarksMulti: number;
		referenceMulti: any;
}
export interface TFElement {
		positionTF: number;
		questionTF: any;
		actionTF: number;
		explanationsTF: string;
		optionsTF: any;
		showHoverTF: any;
		selectTF: number;
		skillTypeTF: any;
		topicTF: any;
		subtopicTF: any;
		suggestedMarksTF: number;
		referenceTF: any;
}
export interface MatchElement {
		positionMatch: number;
		actionMatch: number;
		questionMatch: any;
		explanationsMatch: string;
		optionsMatch: any;
		showHoverMatch: any;
		selectMatch: number;
		skillTypeMatch: any;
		topicMatch: any;
		subtopicMatch: any;
		suggestedMarksMatch: number;
		referenceMatch: any;
}
export interface MatrixMatchElement {
		positionMatrixMatch: number;
		questionMatrixMatch: any;
		actionMatrixMatch: number;
		explanationsMatrixMatch: string;
		optionsMatrixMatch: any;
		showHoverMatrixMatch: any;
		selectMatrixMatch: number;
		skillTypeMatrixMatch: any;
		topicMatrixMatch: any;
		subtopicMatrixMatch: any;
		suggestedMarksMatrixMatch: number;
		referenceMatrixMatch: any;
}

export interface MatrixMatch45Element {
		positionMatrixMatch: number;
		questionMatrixMatch: any;
		actionMatrixMatch: number;
		explanationsMatrixMatch: string;
		optionsMatrixMatch: any;
		showHoverMatrixMatch: any;
		selectMatrixMatch: number;
		skillTypeMatrixMatch: any;
		topicMatrixMatch: any;
		subtopicMatrixMatch: any;
		suggestedMarksMatrixMatch: number;
		referenceMatrixMatch: any;
}
export interface SubjectiveElement {
		positionSub: number;
		questionSub: any;
		explanationsSub: string;
		answerSub: any;
		selectSub: number;
		skillTypeSub: any;
		topicSub: any;
		subtopicSub: any;
		suggestedMarksSub: number;
		referenceSub: any;
}
export interface FillElement {
		positionSub: number;
		questionSub: any;
		actionSub: number;
		explanationsSub: string;
		answerSub: any;
		selectSub: number;
		skillTypeSub: any;
		topicSub: any;
		subtopicSub: any;
		suggestedMarksSub: number;
		referenceSub: any;
}
export interface IdentifyElement {
		positionSub: number;
		questionSub: any;
		actionSub: number;
		explanationsSub: string;
		answerSub: any;
		selectSub: number;
		skillTypeSub: any;
		topicSub: any;
		subtopicSub: any;
		suggestedMarksSub: number;
		referenceSub: any;
}
export interface OneElement {
		positionSub: number;
		actionSub: number;
		questionSub: any;
		explanationsSub: string;
		answerSub: any;
		selectSub: number;
		skillTypeSub: any;
		topicSub: any;
		subtopicSub: any;
		suggestedMarksSub: number;
		referenceSub: any;
}
export interface VeryShortElement {
		positionSub: number;
		questionSub: any;
		actionSub: any;
		explanationsSub: string;
		answerSub: any;
		selectSub: number;
		skillTypeSub: any;
		topicSub: any;
		subtopicSub: any;
		suggestedMarksSub: number;
		referenceSub: any;
}
export interface ShortElement {
		positionSub: number;
		actionSub: number;
		questionSub: any;
		explanationsSub: string;
		answerSub: any;
		selectSub: number;
		skillTypeSub: any;
		topicSub: any;
		subtopicSub: any;
		suggestedMarksSub: number;
		referenceSub: any;
}
export interface LongElement {
		positionSub: number;
		questionSub: any;
		actionSub: number;
		explanationsSub: string;
		answerSub: any;
		selectSub: number;
		skillTypeSub: any;
		topicSub: any;
		subtopicSub: any;
		suggestedMarksSub: number;
		referenceSub: any;
}
export interface VeryLongElement {
		positionSub: number;
		questionSub: any;
		actionSub: number;
		explanationsSub: string;
		answerSub: any;
		selectSub: number;
		skillTypeSub: any;
		topicSub: any;
		subtopicSub: any;
		suggestedMarksSub: number;
		referenceSub: any;
}

export interface ReviewElement {
		position: number;
		question: any;
		answer: any;
		skill: any;
		topic: any;
		subtopic: any;
		lod: any;
		marks: number;
		negativeMarks: number;
		action: string;
		tf_id: any;
		qus_id: any;
		qus_topic_id: any;
		qus_st_id: any;
}
export interface ESSAYQUESTIONElement {
		position: number;
		question: any;
		explanations: string;
		options: any;
		essayTitle: string;
		showHover: any;
		skillType: any;
		topic: any;
		subtopic: any;
		suggestedMarks: number;
		reference: any;
		action: any;
	}
	export interface SingleIntegerElement {
		position: number;
		question: any;
		explanations: string;
		answer: any;
		select: number;
		skillType: any;
		topic: any;
		action: any;
		subtopic: any;
		suggestedMarks: number;
		reference: any;
	}
	export interface DoubleIntegerElement {
		position: number;
		question: any;
		explanations: string;
		answer: any;
		select: number;
		skillType: any;
		topic: any;
		action: any;
		subtopic: any;
		suggestedMarks: number;
		reference: any;
	}
