// src/types/user.types.ts
import { User as FirebaseUser } from 'firebase/auth';
import { UserProfile } from './wordSearch.types';

export interface User extends FirebaseUser {
  profile?: UserProfile;
}