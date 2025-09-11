let idCounter = 1;

export default class Item{
    constructor(question,answer){
        this.id = idCounter ++;
        this.question = question;
        this.answer = answer;
    }
}