import Tab from "../tabs/tab";
import { VenueDetailsForm } from "./components/VenueDetailsForm";
import { VenueHoursForm } from "./components/VenueHours/VenueHoursForm";
import { VenueClosingDays } from "./components/VenueClosingDays/VenueClosingDays";
import { ImageUpload } from "./../imageUpload/imageUpload";

const tabs = [
  { key: "details", label: "Dettagli", children: <VenueDetailsForm /> },
  { key: "hours", label: "Orari", children: <VenueHoursForm /> },
  {
    key: "closing",
    label: "Giorni di chiusura",
    children: <VenueClosingDays />,
  },
  { key: "images", label: "Immagini", children: <ImageUpload /> },
];

export const Venue = () => <Tab tabs={tabs} />;
