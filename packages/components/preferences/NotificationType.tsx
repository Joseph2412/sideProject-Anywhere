export type NotificationType =
  | 'meeting_cancelled_by_organizer'
  | 'reservation_cancelled_by_admin'
  | 'reservation_cancelled_due_to_settings'
  | 'meeting_room_checkin_missing'
  | 'booking_cancelled_due_to_low_participation'
  | 'checkin_reminder'
  | 'reservation_updated'
  | 'multiple_booking_by_admin'
  | 'invited_to_meeting'
  | 'meeting_room_checkin_confirm'
  | 'meeting_room_details_edited'
  | 'external_visitor_arrived';

export type NotificationChannel = 'push' | 'email';
