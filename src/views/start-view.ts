import { button, element, formatDate, statusMessage } from '../components/dom';
import { navigate } from '../app/router';
import type { TemplatePlan } from '../services/fitness-service';
import type { ViewContext } from './context';

export async function createStartView(
  context: ViewContext,
): Promise<HTMLElement> {
  const section = element('section', { className: 'stack' });
  section.append(
    element('h1', { text: 'Start' }),
    element('p', {
      className: 'lead',
      text: 'Wähle einen Plan. Die konkrete Übung wählst du direkt vor jedem Satz.',
    }),
  );

  const active = await context.fitness.getActiveWorkout();
  if (active) {
    const completed = new Set(
      active.results
        .filter(({ setType }) => setType === 'working')
        .map(({ exerciseSlotId }) => exerciseSlotId),
    ).size;
    const card = element('article', { className: 'card card--accent' });
    card.append(
      element('p', { className: 'eyebrow', text: 'Aktives Training' }),
      element('h2', { text: active.session.templateNameSnapshot }),
      element('p', {
        text: `${completed} von ${active.plan.slots.filter(({ slot }) => slot.active).length} Übungen gespeichert · begonnen ${formatDate(active.session.startedAt)}`,
      }),
    );
    const actions = element('div', { className: 'button-row' });
    const resume = button('Training fortsetzen', 'button button--primary');
    resume.addEventListener('click', () => navigate('/training'));
    const discard = button('Training verwerfen', 'button button--danger-quiet');
    discard.addEventListener('click', () => {
      void (async () => {
        if (
          !window.confirm(
            'Aktives Training und alle bereits erfassten Sätze wirklich verwerfen?',
          )
        )
          return;
        try {
          await context.fitness.discardWorkout(active.session.id);
          await context.refresh();
        } catch (error) {
          card.append(statusMessage(toMessage(error), 'error'));
        }
      })();
    });
    actions.append(resume, discard);
    card.append(actions);
    section.append(card);
    return section;
  }

  const plans = await context.fitness.listPlans();
  for (const plan of plans) section.append(createPlanCard(context, plan));
  if (plans.length === 0) {
    section.append(
      statusMessage(
        'Es ist kein aktiver Trainingsplan vorhanden. Aktiviere einen Plan in den Einstellungen.',
      ),
    );
  }
  return section;
}

function createPlanCard(context: ViewContext, plan: TemplatePlan): HTMLElement {
  const form = element('form', { className: 'card plan-card' });
  form.append(
    element('h2', { text: plan.template.name }),
    element('p', {
      className: 'muted',
      text: 'Ein optionaler Aufwärmsatz und ein Arbeitssatz pro Übung.',
    }),
  );
  const activeSlots = plan.slots.filter(({ slot }) => slot.active);
  const list = element('ol', { className: 'plan-slot-list' });
  for (const { slot, exercises } of activeSlots) {
    const primary = exercises.find(({ id }) => id === slot.primaryExerciseId);
    const item = element('li');
    item.append(
      element('strong', { text: slot.label }),
      element('span', {
        className: 'muted',
        text: `Standard: ${primary?.name ?? 'nicht verfügbar'}`,
      }),
    );
    list.append(item);
  }
  form.append(list);
  const messageHost = element('div');
  const start = button('Training starten', 'button button--primary', 'submit');
  form.append(messageHost, start);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    void (async () => {
      start.disabled = true;
      messageHost.replaceChildren();
      try {
        await context.fitness.startWorkout(plan.template.id);
        navigate('/training');
      } catch (error) {
        messageHost.append(statusMessage(toMessage(error), 'error'));
        start.disabled = false;
      }
    })();
  });
  return form;
}

function toMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : 'Die Aktion konnte nicht ausgeführt werden.';
}
