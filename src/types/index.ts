export type CasteCategory = 'General' | 'OBC' | 'SC' | 'ST' | 'EWS';
export type Qualification = 'School' | 'Intermediate' | 'Graduate' | 'Post Graduate';
export type Occupation = 'Farmer' | 'Student' | 'Worker' | 'Entrepreneur' | 'Unemployed';
export type Gender = 'Male' | 'Female' | 'Other';
export type IncomeRange = '0-2.5L' | '2.5-5L' | '5-10L' | '10L+';

export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  age: number;
  gender: Gender;
  casteCategory: CasteCategory;
  qualification: Qualification;
  occupation: Occupation;
  residence: string;
  annualIncomeRange: string;
  createdAt: string;
  role: 'user' | 'admin';
  avatarUrl?: string;
  avatarType?: 'initials' | 'upload' | 'ai';
}

export interface SchemeDocument {
  name: string;
  description: string;
}

export interface SchemeEligibility {
  ageMin: number;
  ageMax: number;
  gender: 'All' | 'Male' | 'Female';
  state: string;
  caste?: string[];
  incomeMax?: number;
}

export interface Scheme {
  id: string;
  schemeName: string;
  ministry: string;
  category: string;
  description: string;
  eligibilityCriteria: string;
  eligibility: SchemeEligibility;
  incomeLimit: string;
  ageRequirement?: string;
  genderCriteria: 'All' | 'Male' | 'Female';
  stateApplicability: string;
  benefits: string;
  documentsRequired: SchemeDocument[];
  applicationProcess: string;
  officialWebsiteLink: string;
  helpline: string;
  lastUpdated: string;
  tags: string[];
}

export interface Application {
  id: string;
  userId: string;
  schemeId: string;
  schemeName: string;
  status: 'Saved' | 'Applied' | 'Under Review' | 'Approved' | 'Rejected';
  appliedDate: string;
}
