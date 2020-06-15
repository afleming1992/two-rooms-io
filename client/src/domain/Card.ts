import {Team} from "./Team";

export class Card {
    public title: string
    public howToWin: string
    public cardImage: string
    public team: Team

    constructor( title: string, howToWin: string, cardImage: string, team: Team) {
        this.title = title;
        this.howToWin = howToWin;
        this.cardImage = cardImage;
        this.team = team;
    }
}