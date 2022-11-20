import { words } from "./data/ptbr-words";

interface Options {
    length: number;
}

export default class WordService{

    private static _words: Array<string>
    
    static getRandom(length: number){
        this._words = length ? words.filter(w => w.length === length) : words;
        const randomIndex = this.getRandomIndex(0, this._words.length - 1)
        return this._words[randomIndex].toUpperCase()
    }

    private static getRandomIndex(min: number, max: number) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    static checkIfExists(word: string){
        if(this._words.includes(word)) return true;
        return false;
    }
}