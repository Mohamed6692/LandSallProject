export interface UserDTO {
  name: string;
  firstName: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: Role;
}

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
  AGENT = 'AGENT'
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: Role;
  };
  token: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: Role;
} 