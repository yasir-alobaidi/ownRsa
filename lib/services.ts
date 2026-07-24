export type ServiceId =
  | "towing"
  | "battery-jump"
  | "tire-change"
  | "flat-tire-fix"
  | "fuel-delivery"
  | "wheel-lock"
  | "lockout"
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
    description: "Light and medium-duty tow to any shop, dealership, or address.",
  },
  {
    id: "battery-jump",
    name: "Battery Change or Jump-Start",
    description: "Dead battery? We jump-start or replace it on the spot.",
  },
  {
    id: "tire-change",
    name: "Tire Change",
    description: "Swap in your spare or a used tire so you can keep moving.",
  },
  {
    id: "flat-tire-fix",
    name: "Flat Tire Fix",
    description: "Patch or repair a flat tire when a full swap isn't needed.",
  },
  {
    id: "fuel-delivery",
    name: "Fuel Delivery",
    description: "Out of gas? We bring fuel to get you to the nearest station.",
  },
  {
    id: "wheel-lock",
    name: "Unlock Wheel Locks",
    description: "Lost your wheel lock key? We'll get the locks off safely.",
  },
  {
    id: "lockout",
    name: "Locked Out",
    description: "Keys locked inside? We'll get you back in — no damage.",
  },
  {
    id: "winching",
    name: "Winching & Recovery",
    description: "Stuck in a ditch, mud, or tight spot? We'll pull you free.",
  },
];

export const CITIES = [
  "Dallas",
  "Arlington",
  "Irving",
  "Grand Prairie",
  "Mesquite",
  "Garland",
  "Richardson",
  "Plano",
  "Frisco",
  "McKinney",
  "Allen",
  "Carrollton",
  "Lewisville",
  "Denton",
  "The Colony",
  "Euless",
  "Bedford",
  "Hurst",
  "North Richland Hills",
  "Grapevine",
  "Coppell",
  "Farmers Branch",
  "Addison",
  "Rockwall",
  "Rowlett",
  "Sachse",
  "Wylie",
];

export const BUSINESS = {
  name: "Texas Roadside Assist",
  shortName: "TRA",
  phoneDisplay: "(945) 412-1215",
  phoneTel: "+19454121215",
  email: "help@texasroadsideassist.com",
  domain: "texasroadsideassist.com",
};
