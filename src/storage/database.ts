import Dexie, { type EntityTable, type Transaction } from 'dexie';

import { createInitialDomainData, INITIAL_SEED_VERSION } from '../domain/seeds';
import type {
  Exercise,
  ExerciseResult,
  ExerciseSlot,
  WorkoutSession,
  WorkoutTemplate,
} from '../domain/entities';
import { toStorageError } from './errors';

export const DATABASE_NAME = 'fitness-pwa';
export const DATABASE_SCHEMA_VERSION = 1;

export interface StorageMeta {
  key: string;
  value: unknown;
}

export const SEED_VERSION_META_KEY = 'seedVersion';

export class FitnessDatabase extends Dexie {
  exercises!: EntityTable<Exercise, 'id'>;
  workoutTemplates!: EntityTable<WorkoutTemplate, 'id'>;
  exerciseSlots!: EntityTable<ExerciseSlot, 'id'>;
  workoutSessions!: EntityTable<WorkoutSession, 'id'>;
  exerciseResults!: EntityTable<ExerciseResult, 'id'>;
  meta!: EntityTable<StorageMeta, 'key'>;

  constructor(name = DATABASE_NAME) {
    super(name);

    this.version(DATABASE_SCHEMA_VERSION).stores({
      exercises: 'id, active, movementCategory',
      workoutTemplates: 'id, active',
      exerciseSlots: 'id, templateId, [templateId+order]',
      workoutSessions: 'id, status, startedAt, workoutTemplateId',
      exerciseResults:
        'id, workoutSessionId, exerciseId, [exerciseId+createdAt], exerciseSlotId',
      meta: 'key',
    });
    this.on('populate', (transaction) => seedDatabase(transaction));
  }
}

async function seedDatabase(transaction: Transaction): Promise<void> {
  const seed = createInitialDomainData();
  await transaction.table<Exercise>('exercises').bulkAdd(seed.exercises);
  await transaction
    .table<WorkoutTemplate>('workoutTemplates')
    .bulkAdd(seed.workoutTemplates);
  await transaction
    .table<ExerciseSlot>('exerciseSlots')
    .bulkAdd(seed.exerciseSlots);
  await transaction.table<StorageMeta>('meta').add({
    key: SEED_VERSION_META_KEY,
    value: INITIAL_SEED_VERSION,
  });
}

export async function openFitnessDatabase(
  database = new FitnessDatabase(),
): Promise<FitnessDatabase> {
  try {
    await database.open();
    return database;
  } catch (error) {
    database.close();
    throw toStorageError(
      error,
      'Der lokale Speicher konnte nicht geöffnet werden.',
    );
  }
}
