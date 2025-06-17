import { DiscoveryDocument, Scope } from '../../discovery-document';

export class CalendarDiscoveryDocument extends DiscoveryDocument {
  static readonly canonicalName = 'Google Calendar v3';
  static readonly logoUrl = '/img/google-calendar-logo.png';
  static readonly description = 'Manipulates events and other calendar data.';
  static readonly shortDescription = this.description;
  static readonly documentationLink =
    'https://developers.google.com/workspace/calendar/firstapp';

  static readonly scopes: Scope[] = [
    {
      id: 'https://www.googleapis.com/auth/calendar',
      description:
        'See, edit, share, and permanently delete all the calendars you can access using Google Calendar',
    },
    {
      id: 'https://www.googleapis.com/auth/calendar.acls',
      description:
        'See and change the sharing permissions of Google calendars you own',
    },
    {
      id: 'https://www.googleapis.com/auth/calendar.acls.readonly',
      description: 'See the sharing permissions of Google calendars you own',
    },
    {
      id: 'https://www.googleapis.com/auth/calendar.app.created',
      description:
        'Make secondary Google calendars, and see, create, change, and delete events on them',
    },
    {
      id: 'https://www.googleapis.com/auth/calendar.calendarlist',
      description: 'See, add, and remove Google calendars you’re subscribed to',
    },
    {
      id: 'https://www.googleapis.com/auth/calendar.calendarlist.readonly',
      description: 'See the list of Google calendars you’re subscribed to',
    },
    {
      id: 'https://www.googleapis.com/auth/calendar.calendars',
      description:
        'See and change the properties of Google calendars you have access to, and create secondary calendars',
    },
    {
      id: 'https://www.googleapis.com/auth/calendar.calendars.readonly',
      description:
        'See the title, description, default time zone, and other properties of Google calendars you have access to',
    },
    {
      id: 'https://www.googleapis.com/auth/calendar.events',
      description: 'View and edit events on all your calendars',
    },
    {
      id: 'https://www.googleapis.com/auth/calendar.events.freebusy',
      description:
        'See the availability on Google calendars you have access to',
    },
    {
      id: 'https://www.googleapis.com/auth/calendar.events.owned',
      description:
        'See, create, change, and delete events on Google calendars you own',
    },
    {
      id: 'https://www.googleapis.com/auth/calendar.events.owned.readonly',
      description: 'See the events on Google calendars you own',
    },
    {
      id: 'https://www.googleapis.com/auth/calendar.events.public.readonly',
      description: 'See the events on public calendars',
    },
    {
      id: 'https://www.googleapis.com/auth/calendar.events.readonly',
      description: 'View events on all your calendars',
    },
    {
      id: 'https://www.googleapis.com/auth/calendar.freebusy',
      description: 'View your availability in your calendars',
    },
    {
      id: 'https://www.googleapis.com/auth/calendar.readonly',
      description:
        'See and download any calendar you can access using your Google Calendar',
    },
    {
      id: 'https://www.googleapis.com/auth/calendar.settings.readonly',
      description: 'View your Calendar settings',
    },
  ];

  static get lightweightScopes(): Scope[] {
    const scopeIds = [
      'https://www.googleapis.com/auth/calendar.events.owned.readonly',
    ];
    return scopeIds
      .map((id) => this.scopes.find((s) => s.id === id))
      .filter((s) => s != null);
  }
}
