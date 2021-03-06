export const tabJSON = {
		'express': [{
			'heading': 'MCQ',
			'id': 'mcq',
			'select': 'this.getMcqQuestion()',
			'previousBtn': {
				'visible': false
			},
			'nextBtn': {
				'visible': true,
				'text': 'Next -> MCQ-MR',
				'tooltip': 'View List of Question For Selection to Build Question Paper',
				'click': ''
			}
		}, {
			'heading': 'MCQ-MR',
			'id': 'mcqmr',
			'select': 'this.getMcqmrQuestion()',
			'previousBtn': {
				'visible': true,
				'text': 'MCQ <- Previous',
				'tooltip': 'Add Question to Question Paper from Active Tab',
				'click': ''
			},
			'nextBtn': {
				'visible': true,
				'text': 'Next -> Matrix',
				'tooltip': 'Save & Next',
				'click': ''
			}
		}, {
			'heading': 'MATRIX',
			'id': 'matrix',
			'select': 'this.getMatrixQuestion()',
			'previousBtn': {
				'visible': true,
				'text': 'MCQ-MR <- Previous',
				'tooltip': 'Add Question to Question Paper from Active Tab',
				'click': ''
			},
			'nextBtn': {
				'visible': true,
				'text': 'Next -> MTF',
				'tooltip': 'Save & Next',
				'click': ''
			}
		}, {
			'heading': 'MTF',
			'id': 'mtf',
			'select': 'this.getMtfQuestion()',
			'previousBtn': {
				'visible': true,
				'text': 'Matrix <- Previous',
				'tooltip': 'Add Question to Question Paper from Active Tab',
				'click': ''
			},
			'nextBtn': {
				'visible': true,
				'text': 'Next -> True/False',
				'tooltip': 'Save & Next',
				'click': ''
			}
		}, {
			'heading': 'TRUE/FALSE',
			'id': 'tf',
			'select': 'this.getTfQuestion()',
			'previousBtn': {
				'visible': true,
				'text': 'MTF <- Previous',
				'tooltip': 'Add Question to Question Paper from Active Tab',
				'click': ''
			},
			'nextBtn': {
				'visible': true,
				'text': 'Next -> Identify',
				'tooltip': 'Save & Next',
				'click': ''
			}
		}, {
			'heading': 'SINGLE INTEGER',
			'id': 'si',
			'select': 'this.getSIQuestion()',
			'previousBtn': {
				'visible': true,
				'text': 'TF <- Previous',
				'tooltip': 'Add Question to Question Paper from Active Tab',
				'click': ''
			},
			'nextBtn': {
				'visible': true,
				'text': 'Next -> DI',
				'tooltip': 'Save & Next',
				'click': ''
			}
		}, {
			'heading': 'DOUBLE INTEGER',
			'id': 'di',
			'select': 'this.getDIQuestion()',
			'previousBtn': {
				'visible': true,
				'text': 'SI <- Previous',
				'tooltip': 'Add Question to Question Paper from Active Tab',
				'click': ''
			},
			'nextBtn': {
				'visible': true,
				'text': 'Next -> Matrix 4X5',
				'tooltip': 'Save & Next',
				'click': ''
			}
		}, {
			'heading': 'MATRIX 4X5',
			'id': 'matrix45',
			'select': 'this.getMatrix45Question()',
			'previousBtn': {
				'visible': true,
				'text': 'DI <- Previous',
				'tooltip': 'Add Question to Question Paper from Active Tab',
				'click': ''
			},
			'nextBtn': {
				'visible': true,
				'text': 'Next -> Identify',
				'tooltip': 'Save & Next',
				'click': ''
			}
		}, {
			'heading': 'IDENTIFY',
			'id': 'identify',
			'select': 'this.getIdentifyQuestion()',
			'previousBtn': {
				'visible': true,
				'text': 'True / False <- Previous',
				'tooltip': 'Add Question to Question Paper from Active Tab',
				'click': ''
			},
			'nextBtn': {
				'visible': true,
				'text': 'Next -> One Line',
				'tooltip': 'Save & Next',
				'click': ''
			}
		}, {
			'heading': 'ONE LINE',
			'id': 'oneline',
			'select': 'this.getOnelineQuestion()',
			'previousBtn': {
				'visible': true,
				'text': 'Identify <- Previous',
				'tooltip': 'Add Question to Question Paper from Active Tab',
				'click': ''
			},
			'nextBtn': {
				'visible': true,
				'text': 'Next -> Fill in the blank',
				'tooltip': 'Save & Next',
				'click': ''
			}
		}, {
			'heading': 'FILL IN THE BLANKS',
			'id': 'fill',
			'select': 'this.getFillInTheBlankQuestion()',
			'previousBtn': {
				'visible': true,
				'text': 'Fill in the blank <- Previous',
				'tooltip': 'Add Question to Question Paper from Active Tab',
				'click': ''
			},
			'nextBtn': {
				'visible': true,
				'text': 'Next -> Short Answer',
				'tooltip': 'Save & Next',
				'click': ''
			}
		}, {
			'heading': 'SHORT ANSWER',
			'id': 'short',
			'select': 'this.getShortAnswer()',
			'previousBtn': {
				'visible': true,
				'text': 'Fill in the blank <- Previous',
				'tooltip': 'Add Question to Question Paper from Active Tab',
				'click': ''
			},
			'nextBtn': {
				'visible': true,
				'text': 'Next -> Very Short',
				'tooltip': 'Save & Next',
				'click': ''
			}
		}, {
			'heading': 'VERY SHORT ANSWER',
			'id': 'veryshort',
			'select': 'this.getVeryShortQuestion()',
			'previousBtn': {
				'visible': true,
				'text': 'Short Answer <- Previous',
				'tooltip': 'Add Question to Question Paper from Active Tab',
				'click': ''
			},
			'nextBtn': {
				'visible': true,
				'text': 'Next -> Long Answer',
				'tooltip': 'Save & Next',
				'click': ''
			}
		}, {
			'heading': 'LONG ANSWER',
			'id': 'long',
			'select': 'this.getLongQuestion()',
			'previousBtn': {
				'visible': true,
				'text': 'Fill in the blank <- Previous',
				'tooltip': 'Add Question to Question Paper from Active Tab',
				'click': ''
			},
			'nextBtn': {
				'visible': true,
				'text': 'Next -> Long Answer',
				'tooltip': 'Save & Next',
				'click': ''
			}
		}, {
			'heading': 'VERY LONG ANSWER',
			'id': 'verylong',
			'select': 'this.getVeryLongQuestion()',
			'previousBtn': {
				'visible': true,
				'text': '<- Previous',
				'tooltip': 'Add Question to Question Paper from Active Tab',
				'click': ''
			},
			'nextBtn': {
				'visible': false
			}
		}, {
			'heading': 'ESSAY',
			'id': 'essay',
			'select': 'this.getEssayQuestion()',
			'previousBtn': {
				'visible': true,
				'text': 'Essay <- Previous',
				'tooltip': 'Add Question to Question Paper from Active Tab',
				'click': ''
			},
			'nextBtn': {
				'visible': true,
				'text': 'Next -> Long Answer',
				'tooltip': 'Save & Next',
				'click': ''
			}
		}]
	};
