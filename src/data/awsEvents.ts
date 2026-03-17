/**
 * awsEvents.ts
 *
 * Static event data scraped from the AWS Events Builder page.
 * These events are merged with Luma events in the Upcoming Events section.
 * Filtered by end_at > now so they automatically disappear once past.
 */
import type { LumaEvent } from '../services/lumaService';

export const AWS_REGISTER_URL = 'https://events.builder.aws.com/event/768a0f09-c528-4b97-8e16-21aa32ec533d';

/** Marker value on LumaEvent.url indicating registration should open the modal */
export const AWS_MODAL_MARKER = '__aws_modal__';

export const awsStaticEvents: LumaEvent[] = [
  {
    api_id: 'aws-768a0f09-c528-4b97-8e16-21aa32ec533d',
    name: 'Autharva | CISOevents: AI Agents, Identity & Accountability — The New CISO Playbook',
    description:
      'An invitation-based forum convening CISOs, AI leaders, legal strategists, and security experts to discuss governance of Non-Human Identities and autonomous agents during RSA 2026 week. Features curated expert panels, real-world implementation insights, and executive-level networking.',
    start_at: '2026-03-23T17:00:00-08:00', // 5:00 PM PST — March 23 (confirmed via Cvent API)
    end_at:   '2026-03-23T20:30:00-08:00', // 8:30 PM PST
    // url = AWS_MODAL_MARKER signals the event card to open the register modal
    url: AWS_MODAL_MARKER,
    cover_url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
    location_type: 'offline',
    geo_address_info: {
      full_address: "AWS Builder's Loft, 525 Market Street, San Francisco, CA 94105",
      city_state: 'San Francisco, CA',
      city: 'San Francisco',
      region: 'CA',
      country: 'US',
    },
    hosts: [
      { name: 'CISOevents' },
      { name: 'Autharva' },
    ],
    ticket_info: {
      is_free: false,
      require_approval: true,
    },
    tags: ['CISO', 'AI', 'Identity', 'RSA 2026'],
  },
];
