export interface EnrollmentData {
  // Step 1 — Personal
  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  // Step 2 — Property Address
  street: string;
  city: string;
  state: string;
  zip: string;

  // Step 3 — System Age
  installedPastYear: "yes" | "no" | "";

  // Step 4 — System Type
  systemType: "eligible" | "cesspool" | "";

  // Step 5 — Maintenance
  maintainsSystem: "yes" | "no" | "";
  maintenanceFrequency: string;
  bedrooms: string;
  occupants: string;

  // Plan / Promo
  promoCode: string;
  finalPrice: number;

  // UTM
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
}

export const COVERED_STATES = ["MA", "PA", "NJ", "NY", "CT", "VA", "DE", "MD", "RI", "NH", "ME", "VT"];

export const US_STATES = [
  { abbr: "AL", name: "Alabama" }, { abbr: "AK", name: "Alaska" },
  { abbr: "AZ", name: "Arizona" }, { abbr: "AR", name: "Arkansas" },
  { abbr: "CA", name: "California" }, { abbr: "CO", name: "Colorado" },
  { abbr: "CT", name: "Connecticut" }, { abbr: "DE", name: "Delaware" },
  { abbr: "FL", name: "Florida" }, { abbr: "GA", name: "Georgia" },
  { abbr: "HI", name: "Hawaii" }, { abbr: "ID", name: "Idaho" },
  { abbr: "IL", name: "Illinois" }, { abbr: "IN", name: "Indiana" },
  { abbr: "IA", name: "Iowa" }, { abbr: "KS", name: "Kansas" },
  { abbr: "KY", name: "Kentucky" }, { abbr: "LA", name: "Louisiana" },
  { abbr: "ME", name: "Maine" }, { abbr: "MD", name: "Maryland" },
  { abbr: "MA", name: "Massachusetts" }, { abbr: "MI", name: "Michigan" },
  { abbr: "MN", name: "Minnesota" }, { abbr: "MS", name: "Mississippi" },
  { abbr: "MO", name: "Missouri" }, { abbr: "MT", name: "Montana" },
  { abbr: "NE", name: "Nebraska" }, { abbr: "NV", name: "Nevada" },
  { abbr: "NH", name: "New Hampshire" }, { abbr: "NJ", name: "New Jersey" },
  { abbr: "NM", name: "New Mexico" }, { abbr: "NY", name: "New York" },
  { abbr: "NC", name: "North Carolina" }, { abbr: "ND", name: "North Dakota" },
  { abbr: "OH", name: "Ohio" }, { abbr: "OK", name: "Oklahoma" },
  { abbr: "OR", name: "Oregon" }, { abbr: "PA", name: "Pennsylvania" },
  { abbr: "RI", name: "Rhode Island" }, { abbr: "SC", name: "South Carolina" },
  { abbr: "SD", name: "South Dakota" }, { abbr: "TN", name: "Tennessee" },
  { abbr: "TX", name: "Texas" }, { abbr: "UT", name: "Utah" },
  { abbr: "VT", name: "Vermont" }, { abbr: "VA", name: "Virginia" },
  { abbr: "WA", name: "Washington" }, { abbr: "WV", name: "West Virginia" },
  { abbr: "WI", name: "Wisconsin" }, { abbr: "WY", name: "Wyoming" },
];

export const defaultEnrollmentData: EnrollmentData = {
  firstName: "", lastName: "", email: "", phone: "",
  street: "", city: "", state: "", zip: "",
  installedPastYear: "",
  systemType: "",
  maintainsSystem: "", maintenanceFrequency: "", bedrooms: "", occupants: "",
  promoCode: "", finalPrice: 499,
  utm_source: "", utm_medium: "", utm_campaign: "", utm_content: "",
};
