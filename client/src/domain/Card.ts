import {Team} from "./Team";

export class Card {
    public key: string
    public title: string
    public howToWin: string
    public cardImage: string
    public team: Team

    constructor( key: string, title: string, howToWin: string, cardImage: string, team: Team) {
        this.key = key;
        this.title = title;
        this.howToWin = howToWin;
        this.cardImage = cardImage;
        this.team = team;
    }
}