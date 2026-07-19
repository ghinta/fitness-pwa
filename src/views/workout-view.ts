import { navigate } from '../app/router';
import {
  button,
  element,
  field,
  formatDate,
  formatWeight,
  statusMessage,
} from '../components/dom';
import {
  recommendNextWeight,
  type Exercise,
  type ExerciseResult,
} from '../domain';
import type { ActiveWorkout } from '../services/fitness-service';
import type { ViewContext } from './context';

export async function createWorkoutView(
  context: ViewContext,
): Promise<HTMLElement> {
  const workout = await context.fitness.getActiveWorkout();
  if (!workout) {
    const empty = element('section', { className: 'stack' });
    empty.append(
      element('h1', { text: 'Kein aktives Training' }),
      statusMessage('Starte zuerst Training A oder Training B.'),
    );
    const home = button('Zur Startseite', 'button button--primary');
    home.addEventListener('click', () => navigate('/'));
    empty.append(home);
    return empty;
  }

  const slots = workout.plan.slots.filter(({ slot }) => slot.active);
  const workingBySlot = new Map(
    workout.results
      .filter(({ setType }) => setType === 'working')
      .map((result) => [result.exerciseSlotId, result]),
  );
  const currentIndex = slots.findIndex(
    ({ slot }) => !workingBySlot.has(slot.id),
  );
  return currentIndex === -1
    ? createReview(
        context,
        workout,
        slots.map(({ slot }) => workingBySlot.get(slot.id) as ExerciseResult),
      )
    : createStep(context, workout, currentIndex);
}

async function createStep(
  context: ViewContext,
  workout: ActiveWorkout,
  currentIndex: number,
): Promise<HTMLElement> {
  const activeSlots = workout.plan.slots.filter(({ slot }) => slot.active);
  const current = activeSlots[currentIndex];
  if (!current) throw new Error('Der aktuelle Übungsplatz fehlt.');
  const exerciseId = workout.session.exerciseSelections[current.slot.id];
  const exercise = current.exercises.find(({ id }) => id === exerciseId);
  if (!exercise) throw new Error('Die ausgewählte Übung fehlt.');
  const previous = await context.fitness.previousWorkingResults(exercise.id);
  const existingWarmup = workout.results.find(
    ({ exerciseSlotId, setType }) =>
      exerciseSlotId === current.slot.id && setType === 'warmup',
  );

  const section = element('section', { className: 'stack workout' });
  const header = element('header', { className: 'workout__header' });
  header.append(
    element('p', {
      className: 'eyebrow',
      text: `${workout.session.templateNameSnapshot} · Übung ${currentIndex + 1} von ${activeSlots.length}`,
    }),
    element('h1', { text: exercise.name }),
    element('p', { className: 'muted', text: current.slot.label }),
  );
  const progress = element('progress');
  progress.max = activeSlots.length;
  progress.value = currentIndex;
  progress.ariaLabel = 'Trainingsfortschritt';
  header.append(progress);
  section.append(header);

  if (existingWarmup) {
    const saved = element('article', { className: 'card card--compact' });
    saved.append(
      element('h2', { text: 'Aufwärmsatz gespeichert' }),
      element('p', {
        text: `${formatWeight(existingWarmup.weightKg)} · ${existingWarmup.durationSeconds} Sekunden`,
      }),
    );
    section.append(saved);
  } else {
    section.append(
      createSetForm(
        context,
        workout,
        current.slot,
        exercise,
        'warmup',
        previous[0],
      ),
    );
  }
  section.append(
    createSetForm(
      context,
      workout,
      current.slot,
      exercise,
      'working',
      previous[0],
    ),
    createPreviousCard(previous, exercise),
  );
  const leave = button('Später fortsetzen', 'button button--quiet');
  leave.addEventListener('click', () => {
    if (
      !document.querySelector('form[data-dirty="true"]') ||
      window.confirm(
        'Nicht gespeicherte Eingaben verwerfen und später fortsetzen?',
      )
    ) {
      context.setDirty(false);
      navigate('/');
    }
  });
  section.append(leave);
  return section;
}

function createSetForm(
  context: ViewContext,
  workout: ActiveWorkout,
  slot: ActiveWorkout['plan']['slots'][number]['slot'],
  exercise: Exercise,
  setType: 'warmup' | 'working',
  previous?: ExerciseResult,
): HTMLFormElement {
  const isWarmup = setType === 'warmup';
  const form = element('form', {
    className: `card set-form ${isWarmup ? 'set-form--warmup' : 'card--accent'}`,
  });
  form.dataset.dirty = 'false';
  form.append(
    element('h2', {
      text: isWarmup ? 'Optionaler Aufwärmsatz' : 'Arbeitssatz',
    }),
  );

  const grid = element('div', { className: 'input-grid' });
  const weight = element('input');
  weight.type = 'number';
  weight.name = 'weight';
  weight.inputMode = 'decimal';
  weight.min = '0';
  weight.max = '100000';
  weight.step = 'any';
  weight.placeholder =
    exercise.equipmentType === 'bodyweight' ? 'optional' : '0';
  if (previous?.weightKg !== null && previous?.weightKg !== undefined) {
    weight.value = String(previous.weightKg);
  }
  weight.required = exercise.equipmentType !== 'bodyweight';

  const duration = element('input');
  duration.type = 'number';
  duration.name = 'duration';
  duration.inputMode = 'numeric';
  duration.min = '1';
  duration.max = '86400';
  duration.step = '1';
  duration.required = true;
  grid.append(
    field(
      exercise.equipmentType === 'bodyweight'
        ? 'Zusatzgewicht (kg)'
        : 'Gewicht (kg)',
      weight,
      exercise.equipmentType === 'bodyweight'
        ? 'Leer lassen für reines Körpergewicht'
        : undefined,
    ),
    field('Dauer (Sekunden)', duration, 'Zielbereich: 60–90 Sekunden'),
  );
  const notes = element('textarea');
  notes.name = 'notes';
  notes.rows = 2;
  notes.maxLength = 2000;
  const messages = element('div');
  const save = button(
    isWarmup ? 'Aufwärmsatz speichern' : 'Arbeitssatz speichern & weiter',
    isWarmup ? 'button' : 'button button--primary',
    'submit',
  );
  form.append(grid, field('Notiz (optional)', notes), messages, save);

  form.addEventListener('input', () => {
    form.dataset.dirty = 'true';
    context.setDirty(true);
  });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    void (async () => {
      messages.replaceChildren();
      save.disabled = true;
      const parsedWeight =
        weight.value.trim() === '' ? null : Number(weight.value);
      try {
        await context.fitness.saveSet(workout.session, slot, {
          setType,
          weightKg: parsedWeight,
          durationSeconds: Number(duration.value),
          notes: notes.value,
        });
        form.dataset.dirty = 'false';
        context.setDirty(false);
        await context.refresh();
      } catch (error) {
        messages.append(statusMessage(toMessage(error), 'error'));
        save.disabled = false;
        const first = form.querySelector<HTMLElement>(
          'input:invalid, textarea:invalid',
        );
        first?.focus();
      }
    })();
  });
  return form;
}

function createPreviousCard(
  previous: ExerciseResult[],
  exercise: Exercise,
): HTMLElement {
  const card = element('article', { className: 'card' });
  card.append(element('h2', { text: 'Bisherige Ergebnisse' }));
  if (previous.length === 0) {
    card.append(
      element('p', {
        className: 'muted',
        text: 'Noch kein Arbeitssatz gespeichert.',
      }),
    );
    return card;
  }
  const list = element('ul', { className: 'result-list' });
  for (const result of previous.slice(0, 5)) {
    const item = element('li');
    item.append(
      element('strong', {
        text: `${formatWeight(result.weightKg)} · ${result.durationSeconds} s`,
      }),
      element('span', { text: formatDate(result.createdAt) }),
    );
    list.append(item);
  }
  card.append(
    list,
    recommendationText(previous[0] as ExerciseResult, exercise),
  );
  return card;
}

function recommendationText(
  result: ExerciseResult,
  exercise: Exercise,
): HTMLElement {
  const recommendation = recommendNextWeight(
    result.weightKg,
    result.durationSeconds,
    exercise.weightIncrementKg,
  );
  let text: string;
  if (recommendation.action === 'increase') {
    text =
      recommendation.suggestedWeightKg === null
        ? 'Über 90 Sekunden: Beim nächsten Mal die Schwierigkeit bzw. das Zusatzgewicht um etwa 2,5 % erhöhen.'
        : `Über 90 Sekunden: Nächstes Mal unverbindlich ${formatWeight(recommendation.suggestedWeightKg)} (+2,5 %) versuchen.`;
  } else if (recommendation.durationBand === 'below-target') {
    text =
      'Unter 60 Sekunden: Gewicht zunächst beibehalten; bei unsauberer Ausführung reduzieren.';
  } else {
    text = '60–90 Sekunden: Gewicht beim nächsten Mal beibehalten.';
  }
  return statusMessage(text, 'info');
}

function createReview(
  context: ViewContext,
  workout: ActiveWorkout,
  workingResults: ExerciseResult[],
): HTMLElement {
  const section = element('section', { className: 'stack' });
  section.append(
    element('p', {
      className: 'eyebrow',
      text: workout.session.templateNameSnapshot,
    }),
    element('h1', { text: 'Training prüfen' }),
    element('p', {
      className: 'lead',
      text: 'Alle fünf Arbeitssätze sind gespeichert.',
    }),
  );
  const list = element('ol', { className: 'review-list card' });
  for (const result of workingResults) {
    const item = element('li');
    item.append(
      element('strong', { text: result.exerciseNameSnapshot }),
      element('span', {
        text: `${formatWeight(result.weightKg)} · ${result.durationSeconds} Sekunden`,
      }),
    );
    const exercise = workout.plan.slots
      .flatMap(({ exercises }) => exercises)
      .find(({ id }) => id === result.exerciseId);
    if (exercise) item.append(recommendationText(result, exercise));
    list.append(item);
  }
  const messages = element('div');
  const complete = button('Training abschließen', 'button button--primary');
  complete.addEventListener('click', () => {
    void (async () => {
      complete.disabled = true;
      try {
        await context.fitness.completeWorkout(workout.session.id);
        context.setDirty(false);
        navigate('/verlauf');
      } catch (error) {
        messages.append(statusMessage(toMessage(error), 'error'));
        complete.disabled = false;
      }
    })();
  });
  section.append(list, messages, complete);
  return section;
}

function toMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : 'Das Ergebnis konnte nicht gespeichert werden.';
}
