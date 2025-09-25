export const updateVenuePaymentsDetailsSchema = {
  body: {
    type: "object",
    required: [
      "companyName",
      "address",
      "iban",
      "bicSwift",
      "countryCode",
      "currencyCode",
    ],
    //Metto obbligatori TUTTI I CAMPI
    //Doppia verifica BE<->FE
    properties: {
      id: { type: "number" },
      companyName: { type: "string", minLength: 1 },
      address: { type: "string", minLength: 1 },
      iban: { type: "string", maxLength: 27 }, //l'iban di norma sono 27 caratteri
      bicSwift: { type: "string", minLength: 8, maxLength: 11 }, //il bic/swift di norma sono da 8 a 11 caratteri
      countryCode: { type: "string", minLength: 2, maxLength: 3 }, //il codice paese può essere da 2 a 3 caratteri
      currencyCode: { type: "string", minLength: 3, maxLength: 3 }, //il codice valuta è esattamente 3 caratteri
    },
    additionalProperties: false,
  },
};
