export const updateVenueOpeningDaysSchema = {
  body: {
    type: "object",
    required: ["openingDays"],
    properties: {
      openingDays: {
        type: "array",
        items: {
          type: "object",
          required: ["day", "isClosed"],
          properties: {
            day: {
              type: "string",
              enum: [
                "MONDAY",
                "TUESDAY",
                "WEDNESDAY",
                "THURSDAY",
                "FRIDAY",
                "SATURDAY",
                "SUNDAY",
              ],
            },
            isClosed: { type: "boolean" },
            periods: {
              type: "array",
              items: {
                type: "string",
                pattern:
                  "^([01]?\\d|2[0-3]):([0-5]\\d)-([01]?\\d|2[0-3]):([0-5]\\d)$", // HH:mm-HH:mm format
              },
            },
          },
          additionalProperties: false,
        },
      },
    },
    additionalProperties: false,
  },
};
