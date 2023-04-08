// export interface Repository {
//   save(entity: any): Promise<any>;
// }

import { WithId, WithTimestamps } from '../types';

export type EntityRepresenter<Entity> = Entity & WithId & WithTimestamps;

export abstract class Repository {
  abstract save<Entity>(entity: Entity): Promise<Entity>;
  abstract get<Entity>(id: string): Promise<Entity>;
  toEntity<Doc, Entity>(doc: Doc, entity: any): Entity {
    if (!doc) return null;
    return new entity(doc);
  }
}
