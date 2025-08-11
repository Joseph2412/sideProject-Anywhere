import { NotificationType } from './NotificationType';

export const NotificationGroups = [
  {
    title: 'Office cancellations',
    description: 'List of notifications you can receive when your booking is cancelled',
    items: [
      'meeting_cancelled_by_organizer',
      'reservation_cancelled_by_admin',
      'reservation_cancelled_due_to_settings',
      'meeting_room_checkin_missing',
      'booking_cancelled_due_to_low_participation',
      'checkin_reminder',
      'reservation_updated',
      'multiple_booking_by_admin',
      'invited_to_meeting',
      'meeting_room_checkin_confirm',
      'meeting_room_details_edited',
    ] as NotificationType[],
  },
  {
    title: 'Visitor',
    description: 'Notifications concerning the invitation of external visitors',
    items: ['external_visitor_arrived'] as NotificationType[],
  },
];
