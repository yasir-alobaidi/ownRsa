export type ServiceId =
  | "towing"
  | "jump-start"
  | "flat-tire"
  | "lockout"
  | "fuel-delivery"
  | "winching";

export interface ServiceDef {
  id: ServiceId;
  name: string;
  description: string;
}

export const SERVICES: ServiceDef[] = [
  {
    id: "towing",
    name: "Towing",
    description:
      "Light and medium-duty towing to any shop, dealership, or address you choose.",
  },
  {
    id: "jump-start",
    name: "Battery Jump-Start",
    description:
      "A dead battery won't ruin your day \u2014 we'll get your engine running again in minutes.",
  },
  {
    id: "flat-tire",
    name: "Flat Tire Change",
    description: "We'll swap in your spare and have you back on the road safely.",
  },
  {
    id: "lockout",
    name: "Lockout Service",
    description:
      "Locked your keys inside? We'll get you back in fast, with no damage to your vehicle.",
  },
  {
    id: "fuel-delivery",
    name: "Fuel Delivery",
    description: "Ran out of gas? We'll bring enough fuel to get you to the nearest station.",
  },
  {
    id: "winching",
    name: "Winching & Recovery",
    description:
      "Stuck in a ditch, mud, or a tight spot? We'll pull your vehicle free safely.",
  },
];

export const CITIES = [
  "Dallas",
  "Fort Worth",
  "Arlington",
  "Plano",
  "Irving",
  "Garland",
  "Mesquite",
  "Grand Prairie",
  "Richardson",
  "Carrollton",
];

export const BUSINESS = {
  name: "Texas Roadside Assist",
  shortName: "TRA",
  phoneDisplay: "(214) 555-0139",
  phoneTel: "+12145550139",
  email: "help@texasroadsideassist.com",
  domain: "texasroadsideassist.com",
};
