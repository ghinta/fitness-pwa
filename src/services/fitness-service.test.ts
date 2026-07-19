import 'fake-indexeddb/auto';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  FitnessDatabase,
  createRepositories,
  openFitnessDatabase,
} from '../storage';
import { FitnessService } from './fitness-service';

describe('fitness service', () => {
  let database: FitnessDatabase;
  let service: FitnessService;
  let idCounter: number;

  beforeEach(async () => {
    database = await openFitnessDatabase(
      new FitnessDatabase(`fitness-service-${crypto.randomUUID()}`),
    );
    idCounter = 100;
    service = new FitnessService(
      createRepositories(database),
      () => new Date(`2026-07-19T12:${String(idCounter).slice(-2)}:00.000Z`),
      () => `90000000-0000-4000-8000-${String(idCounter++).padStart(12, '0')}`,
    );
  });

  afterEach(async () => {
    database.close();
    await database.delete();
  });

  it('starts with session-local alternatives and resumes persisted progress', async () => {
    const plan = (await service.listPlans())[0]!;
    const selections = Object.fromEntries(
      plan.slots.map(({ slot, exercises }, index) => [
        slot.id,
        index === 1 ? exercises[1]!.id : slot.primaryExerciseId,
      ]),
    );
    const session = await service.startWorkout(plan.template.id, selections);
    const first = plan.slots[0]!;

    await service.saveSet(session, first.slot, {
      setType: 'working',
      weightKg: 50,
      durationSeconds: 91,
      notes: 'kontrolliert',
    });

    const resumed = await service.getActiveWorkout();
    expect(resumed?.session.exerciseSelections[plan.slots[1]!.slot.id]).toBe(
      plan.slots[1]!.exercises[1]!.id,
    );
    expect(resumed?.results).toHaveLength(1);
    await expect(service.completeWorkout(session.id)).rejects.toThrow(
      'Arbeitssatz',
    );
  });

  it('records optional warmups, bodyweight without load, and completes all slots', async () => {
    const plan = (await service.listPlans())[0]!;
    const selections = Object.fromEntries(
      plan.slots.map(({ slot }) => [slot.id, slot.primaryExerciseId]),
    );
    const session = await service.startWorkout(plan.template.id, selections);
    await service.saveSet(session, plan.slots[0]!.slot, {
      setType: 'warmup',
      weightKg: 20,
      durationSeconds: 30,
      notes: '',
    });
    for (const { slot, exercises } of plan.slots) {
      await service.saveSet(session, slot, {
        setType: 'working',
        weightKg: exercises[0]!.equipmentType === 'bodyweight' ? null : 50,
        durationSeconds: 75,
        notes: '',
      });
    }

    await service.completeWorkout(session.id);

    const history = await service.listHistory();
    expect(await service.getActiveWorkout()).toBeUndefined();
    expect(history).toHaveLength(1);
    expect(history[0]!.results).toHaveLength(6);
  });

  it('updates an existing exercise increment without rewriting its identity', async () => {
    const exercise = (await service.repositories.exercises.list(true))[0]!;

    await service.updateExercise(exercise, {
      name: exercise.name,
      muscleGroup: exercise.muscleGroup,
      weightIncrementKg: 1.25,
      active: exercise.active,
    });

    expect(
      (await service.repositories.exercises.get(exercise.id))
        ?.weightIncrementKg,
    ).toBe(1.25);
  });
});
