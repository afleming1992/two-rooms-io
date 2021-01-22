import {Card} from "./Card";

export class CardReveal {
  public player: string;
  public card: Card;

  constructor( player: string, card: Card ) {
    this.player = player;
    this.card = card;
  }
}