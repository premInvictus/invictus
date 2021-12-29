export class BoardElement {
    name: string;
    position: number;
    alias: string;
    action: any;
  }

  export class SectionElement {
    name: string;
    position: number;
    action: any;
  }
  
  export class SubjectElement {
    name: string;
    position: number;
    action: any;
  }
  
  export class ClassElement {
    name: string;
    position: number;
    board:any;
    action: any;
    section: string;
    subject: string;
  }
  
  export class TopicElement {
    board: string;
    name: string;
    class: string;
    position: number;
    action: any;
    subject: string;
  }
  
  export class SubTopicElement {
    board: string;
    name: string;
    class: string;
    position: number;
    action: any;
    subject: string;
    topic: string;
  }
  
  export class QuestionSubTypeElement {
    name: string;
    position: number;
    action: any;
  }

  export class QuestionTypeElement {
    name: string;
    position: number;
    action: any;
    quessubtype: string;
  }
  
  export class SkillTypeElement {
    name: string;
    position: number;
    action: any;
  }
  
  export class LODElement {
    name: string;
    position: number;
    action: any;
  }