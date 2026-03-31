export interface UserAuthState {
  email: string | null;
  id: string | null;
  username: string | null;
  role: string | null;
  token: string | null;
}

export interface Property {
  id: number;
  host_profile_id: number;
  name: string;
  street_address: string;
  city: string;
  capacity: number;
  specific_tags: string | null;
  status: "Active" | "Suspended" | "Inactive";
  latitude?: number;
  longitude?: number;
} 

export interface UserData{
  id: number;
  email: string;
  full_name: string;
  phone_number: string;
  user_role: string;
  verification_status: string;
  documents_url: string | null;
}

export interface BookingRequest{
  id: number;
  availability_slot_id : number;
  family_id : number;
  requested_start_date : string;
  requested_end_date: string;
  requested_capacity : number;
  family_message: string | null;
  request_status : string;
}

export interface AvailabilitySlot{
  id: number;
  property_id: number;
  start_date: string;
  end_date: string;
  slot_status:string;
  created_at: string;
}