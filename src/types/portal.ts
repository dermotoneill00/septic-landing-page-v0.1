import type { Database } from "./database";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Policy = Database["public"]["Tables"]["policies"]["Row"];

export type PolicyStatus = "Active" | "Expired" | "Cancelled" | "Pending";
