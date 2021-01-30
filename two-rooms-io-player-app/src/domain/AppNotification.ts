import * as uuid from 'uuid';

export default class AppNotification {
  public id: string
  public text: string
  public options: any
  public dismissed: boolean

  constructor( text: string, options: any ) {
    this.id = uuid.v4();
    this.text = text;
    this.options = options;
    this.dismissed = false;
  }
}