export class NotFoundException extends Error {
  constructor(entity: any) {
    super(`Entity ${entity?.name} not found`);
  }
}
