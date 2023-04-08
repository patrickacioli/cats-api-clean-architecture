export abstract class Usecase {
  abstract execute(input?: any): Promise<any>;
}
