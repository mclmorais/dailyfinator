import { injectable } from "inversify";


@injectable()
export class NamesManager {

  private names : Array<string> = [];

  public addName(nameToAdd : string): void {
    this.names.push(nameToAdd);
  }

  public listNames() : string {
    return this.names.reduce((previousValue, currentvalue) => `${previousValue}, ${currentvalue}`, '')
  }
}