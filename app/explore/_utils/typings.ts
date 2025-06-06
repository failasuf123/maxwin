export type DataType = {
    deskripsi: string;
    tags: string[];
    akses: {
      stasiun: string;
      terminal_bus: string;
      bandara: string;
      pelabuhan: string
    };
    aktivitas: Activity[];
  };
  
export type Activity = {
    nama: string;
    deskripsi: string;
    akses_lokasi: string;
    icon: IconType;
  };
  
export type IconType =
    | "mountain"
    | "water"
    | "landscape"
    | "museum"
    | "park"
    | "terrain";
