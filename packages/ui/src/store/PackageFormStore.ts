import { atom } from "jotai";
import { Package } from "./LayoutStore";

export const packageFormAtom = atom<{
  type: "Sala" | "Desk";
  name: string;
} | null>(null);

export const packagesAtom = atom<Package[]>([]);

export const fetchPackagesAtom = atom(null, async (get, set) => {
  console.log("fetchPackagesAtom CALLED"); // DEBUG LOG
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_HOST}/api/packages`,
      {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );
    if (res.ok) {
      const data = await res.json();
      console.log("API /api/packages response:", data); // DEBUG LOG
      set(packagesAtom, data);
    }
  } catch (error) {
    console.error("Errore fetchPackagesAtom:", error); // DEBUG LOG
  }
});
