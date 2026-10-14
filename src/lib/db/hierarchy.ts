import type { DbData, EngineId, MediaProduct, Placement, PlacementGroup, Position } from './types';

/**
 * Walking the inventory: placement group → placement → position, and the
 * media products (packages) a position is sold in. One place, so every
 * surface reads the hierarchy the same way.
 */

export const placementOf = (db: DbData, position: Pick<Position, 'placementId'>): Placement | undefined =>
  db.placements.find((p) => p.id === position.placementId);

export const groupOf = (db: DbData, placement: Pick<Placement, 'groupId'> | undefined): PlacementGroup | undefined =>
  placement ? db.placementGroups.find((g) => g.id === placement.groupId) : undefined;

export const groupOfPosition = (db: DbData, position: Pick<Position, 'placementId'>): PlacementGroup | undefined =>
  groupOf(db, placementOf(db, position));

export const engineOfPosition = (db: DbData, position: Pick<Position, 'placementId'>): EngineId | undefined =>
  groupOfPosition(db, position)?.engine;

export const groupsOf = (db: DbData, engine: EngineId): PlacementGroup[] =>
  db.placementGroups.filter((g) => g.engine === engine);

export const placementsOfGroup = (db: DbData, groupId: string): Placement[] =>
  db.placements.filter((p) => p.groupId === groupId);

export const positionsOfPlacement = (db: DbData, placementId: string): Position[] =>
  db.positions.filter((p) => p.placementId === placementId);

export const positionsOfGroup = (db: DbData, groupId: string): Position[] => {
  const ids = new Set(placementsOfGroup(db, groupId).map((p) => p.id));
  return db.positions.filter((p) => ids.has(p.placementId));
};

/** The products a position is sold in — single lines first, as listed. */
export const productsOfPosition = (db: DbData, positionId: string): MediaProduct[] =>
  db.mediaProducts.filter((m) => m.positionIds.includes(positionId));

/** "Frozen › Ice cream" — where a position sits, for pickers and tables. */
export function whereLabel(db: DbData, position: Pick<Position, 'placementId'>): string {
  const placement = placementOf(db, position);
  const group = groupOf(db, placement);
  return [group?.name, placement?.name].filter(Boolean).join(' › ');
}
