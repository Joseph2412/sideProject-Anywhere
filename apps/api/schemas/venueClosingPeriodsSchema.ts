export const updateVenueClosingPeriodsSchema = {
  body: {
    type: "object",
    required: ["closingPeriods"],
    properties: {
      closingPeriods: {
        type: "array",
        items: {
          type: "object",
          required: ["start", "end"],
          properties: {
            start: { type: "string", format: "date-time" }, // ISO 8601
            end: { type: "string", format: "date-time" },
            singleDate: { type: "string", format: "date-time", nullable: true }, // ISO 8601, nullable if not present
          },
          additionalProperties: false,
        },
      },
    },
    additionalProperties: false,
  },
};
