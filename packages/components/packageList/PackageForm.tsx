import Tab from "../tabs/tab";
import { PackageDetails } from "./details/PackageDetails";
import { PackagePlans } from "./plans/PackagePlans";
import { ImageUpload } from "../imageUpload/imageUpload";

//Componente CONTENITORE PACCHETTI
//Comprende le tab con le diciture Dettagli,Piani,Immagini

//Da Qui richiami i vari componenti:
//PackageDetails = il form con i dati del pacchetti
//PackagePlans = la tabella con i piani del pacchetto
//ImageUpload = il componente per il caricamento delle immagini

export const PackageForm = () => {
  const tabs = [
    {
      key: "details",
      label: "Dettagli",
      children: <PackageDetails />,
    },
    { key: "plans", label: "Piani", children: <PackagePlans /> },
    { key: "images", label: "Immagini", children: <ImageUpload /> },
  ];

  return (
    <>
      <Tab tabs={tabs} />
    </>
  );
};
