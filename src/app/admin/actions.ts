'use server';

import { getAdminDb } from '../../lib/firebase-admin';
import os from 'os';

// Config Actions
export async function getConfigAction() {
  try {
    const db = getAdminDb();
    const configDoc = await db.collection('config').doc('metadata').get();

    if (!configDoc.exists) {
      return {
        territoryTypes: [
          { key: 'rural', en: 'Rural', fi: 'Maaseutu' },
          { key: 'suburbs', en: 'Suburbs', fi: 'Esikaupunkialue' },
          { key: 'urban', en: 'Urban Center', fi: 'Keskusta' },
          { key: 'metropolis', en: 'Metropolis', fi: 'Metropoli' },
          { key: 'border', en: 'Border Town', fi: 'Rajakaupunki' },
          { key: 'coastal', en: 'Coastal Port', fi: 'Rannikkosatama' },
          { key: 'caves', en: 'Cave Network', fi: 'Luolaverkosto' },
          { key: 'underground', en: 'Underground City', fi: 'Maanalainen kaupunki' },
          { key: 'mountains', en: 'Mountain Settlement', fi: 'Vuoristokylä' },
          { key: 'desert', en: 'Desert Outpost', fi: 'Aavikkopartioasema' },
          { key: 'arctic', en: 'Arctic Base', fi: 'Arktinen tukikohta' },
          { key: 'moon', en: 'Lunar Colony', fi: 'Kuun siirtokunta' },
          { key: 'orbital', en: 'Orbital Platform', fi: 'Maanlentoalusta' },
          { key: 'spaceStation', en: 'Space Station Alpha', fi: 'Avaruusasema Alfa' },
          { key: 'interstellar', en: 'Interstellar Ark', fi: 'Tähtienvälinen arkki' },
          { key: 'milestone', en: 'Milestone', fi: 'Virstanpylväs' },
        ],
        eventTypes: [
          { key: 'immigration', en: 'Immigration', fi: 'Maahanmuutto' },
          { key: 'emigration', en: 'Emigration', fi: 'Muutto ulkomaille' },
          { key: 'disaster', en: 'Disaster', fi: 'Kaatastrofi' },
          { key: 'opportunity', en: 'Opportunity', fi: 'Mahdollisuus' },
          { key: 'milestone', en: 'Milestone', fi: 'Virstanpylväs' },
        ],
        categories: [
          { key: 'opportunity', en: 'Opportunity', fi: 'Mahdollisuus' },
          { key: 'disaster', en: 'Disaster', fi: 'Kaatastrofi' },
          { key: 'milestone', en: 'Milestone', fi: 'Virstanpylväs' },
          { key: 'neutral', en: 'Neutral', fi: 'Neutraali' },
        ],
      };
    }
    return configDoc.data();
  } catch (err: unknown) {
    console.error('Error fetching config in action', err);
    throw new Error('Failed to load system config');
  }
}

export async function saveConfigAction(prevState: any, payload: any) {
  try {
    const { territoryTypes, eventTypes, categories } = payload;
    const db = getAdminDb();

    await db.collection('config').doc('metadata').set({
      territoryTypes,
      eventTypes,
      categories,
      updatedAt: Date.now(),
    });

    return { success: true, message: 'Configuration saved via Server Action' };
  } catch (err: unknown) {
    console.error('Error updating config', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

// Events Actions

const enrichEvent = (event: Record<string, unknown>) => {
  const now = Date.now();
  return {
    probability: 0.5,
    category: 'opportunity',
    timestamp: now,
    ...event,
    createdAt: event.createdAt ?? now,
    updatedAt: now,
    createdBy: event.createdBy ?? os.hostname(),
    source: event.source ?? 'Next.js Server Action',
  };
};

const removeEventInternal = async (db: FirebaseFirestore.Firestore, id: string, territoryType: string) => {
  if (territoryType === 'milestone') {
    const mileRef = db.collection('events').doc('milestone_events');
    const doc = await mileRef.get();
    const data = doc.exists ? doc.data()! : { milestones: [] };
    data.milestones = (data.milestones || []).filter((e: any) => e.id !== id);
    await mileRef.set(data);
  } else {
    const terrRef = db.collection('events').doc('territory_events');
    const doc = await terrRef.get();
    const data = doc.exists ? doc.data()! : {};
    if (Array.isArray(data[territoryType])) {
      data[territoryType] = data[territoryType].filter((e: any) => e.id !== id);
      await terrRef.set(data);
    }
  }
};

export async function getEventsAction() {
  try {
    const db = getAdminDb();
    const events: Record<string, unknown>[] = [];

    const territoryDoc = await db.collection('events').doc('territory_events').get();
    if (territoryDoc.exists) {
      const territoryData = territoryDoc.data() || {};
      for (const [territoryType, evList] of Object.entries(territoryData)) {
        if (Array.isArray(evList)) {
          evList.forEach((e: Record<string, unknown>) => {
            events.push({ ...e, territoryType });
          });
        }
      }
    }

    const milestoneDoc = await db.collection('events').doc('milestone_events').get();
    if (milestoneDoc.exists) {
      const milestoneData = milestoneDoc.data();
      if (milestoneData && Array.isArray(milestoneData.milestones)) {
        milestoneData.milestones.forEach((e: Record<string, unknown>) => {
          events.push({ ...e, territoryType: 'milestone' });
        });
      }
    }

    return events;
  } catch (err: unknown) {
    console.error('Error fetching events', err);
    throw new Error('Failed to list events');
  }
}

export async function saveEventAction(prevState: any, payload: { event: Record<string, any>, territoryType: string, isEdit: boolean }) {
  try {
    const { event, territoryType, isEdit } = payload;
    if (!event || !territoryType || (isEdit && !event.id)) {
      return { success: false, error: 'Missing required fields' };
    }

    const db = getAdminDb();
    const enriched = enrichEvent(event);

    if (isEdit) {
      await removeEventInternal(db, event.id, territoryType);
    }

    if (territoryType === 'milestone') {
      const mileRef = db.collection('events').doc('milestone_events');
      const doc = await mileRef.get();
      const data = doc.exists ? doc.data()! : { milestones: [] };
      data.milestones = data.milestones || [];
      data.milestones.push(enriched);
      await mileRef.set(data);
    } else {
      const terrRef = db.collection('events').doc('territory_events');
      const doc = await terrRef.get();
      const data = doc.exists ? doc.data()! : {};
      if (!Array.isArray(data[territoryType])) data[territoryType] = [];
      data[territoryType].push(enriched);
      await terrRef.set(data);
    }

    return { success: true, message: isEdit ? 'Event updated' : 'Event created' };
  } catch (err: unknown) {
    console.error('Error saving event', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

export async function deleteEventAction(eventId: string, territoryType: string) {
  try {
    if (!eventId || !territoryType) {
      return { success: false, error: 'Missing event ID or territory Type' };
    }
    const db = getAdminDb();
    await removeEventInternal(db, eventId, territoryType);
    return { success: true };
  } catch (err: unknown) {
    console.error('Error deleting event', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}
