export interface User {
  email: string;
  roles: string[];
}

export interface Address {
  name: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}
