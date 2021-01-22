import {Team} from "./Team";
import {Card} from "./Card";

export default class ShareReveal {
  public id: string;
  public player: string;
  public team: Team | undefined;
  public role: Card | undefined;

  constructor( id: string, player: string ) {
    this.id = id;
    this.player = player;
  }

  static colourReveal(id: string, player: string, team: Team) {
    let shareReveal = new ShareReveal( id, player );
    shareReveal.team = team;
    return shareReveal;
  }

  static roleReveal(id: string, player: string, role: Card) {
    let shareReveal = new ShareReveal( id, player );
    shareReveal.role = role;
    return shareReveal;
  }
}