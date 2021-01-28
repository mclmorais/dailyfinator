import { injectable } from "inversify";

@injectable()
export class CommandFinder {


  public isPing(stringToSearch : string): boolean {
    return stringToSearch.search(/ping/) >= 0;
  }

  public isNameAddCommand(stringToSearch : string): boolean {
    return stringToSearch.search(/addName/) >= 0;
  }

  public isNameListcommand(stringToSearch : string): boolean {
    return stringToSearch.search(/listNames/) >= 0;
  }
}