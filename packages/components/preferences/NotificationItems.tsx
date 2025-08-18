import { NotificationType } from "./NotificationType";
export const NotificationItems: { key: NotificationType; label: string }[] = [
  {
    key: "meeting_cancelled_by_organizer",
    label: "The organizer cancelled the meeting you were invited to.",
  },

  {
    key: "reservation_cancelled_by_admin",
    label: "An administrator canceled your reservation.",
  },

  {
    key: "reservation_cancelled_due_to_settings",
    label: "Your reservation was cancelled due to changes in settings.",
  },

  {
    key: "meeting_room_checkin_missing",
    label: "You haven't confirmed check-in for the meeting room.",
  },

  {
    key: "booking_cancelled_due_to_low_participation",
    label:
      "Your booking was cancelled because the minimum number of people in the office was not reached.",
  },

  {
    key: "checkin_reminder",
    label: "Remember to check in before it expires.",
  },

  {
    key: "reservation_updated",
    label: "You have changed the reservation correctly.",
  },

  {
    key: "multiple_booking_by_admin",
    label: "An administrator made a multiple booking of an entity for you.",
  },
  {
    key: "invited_to_meeting",
    label: "You've been invited to an event in a meeting room.",
  },

  {
    key: "meeting_room_checkin_confirm",
    label: "Check-in to confirm the meeting room.",
  },

  {
    key: "meeting_room_details_edited",
    label: "Booking details on the meeting room have been edited.",
  },

  {
    key: "external_visitor_arrived",
    label: "The external visitor you invited has confirmed his arrival.",
  },
];
