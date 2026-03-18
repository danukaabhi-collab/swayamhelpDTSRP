import { Scheme } from './types';
import schemesData from './data/schemes.json';

export const SCHEMES: Scheme[] = schemesData.map((s: any) => ({
  id: s.id || `scheme-${Math.random()}`,
  schemeName: s.schemeName || 'Unknown Scheme',
  ministry: s.ministry || 'Government of India',
  category: s.category || 'General',
  description: s.description || `The ${s.schemeName} is a major initiative to provide support and benefits.`,
  eligibilityCriteria: s.eligibilityCriteria || 'Refer to the official portal for detailed eligibility criteria.',
  eligibility: {
    ageMin: s.eligibility?.ageMin ?? 0,
    ageMax: s.eligibility?.ageMax ?? 100,
    gender: s.eligibility?.gender || 'All',
    state: s.states && s.states.length === 1 ? s.states[0] : (s.states ? 'Multiple States' : 'All India'),
  },
  incomeLimit: s.incomeLimit || 'Check official guidelines',
  genderCriteria: s.eligibility?.gender || 'All',
  stateApplicability: s.states ? s.states.join(', ') : 'All India',
  benefits: s.benefits || 'Financial assistance and support',
  documentsRequired: s.documentsRequired || [
    { name: 'Aadhaar Card', description: 'Identity proof' },
    { name: 'Bank Passbook', description: 'Account details for DBT' },
    { name: 'Resident Proof', description: 'State domicile if applicable' }
  ],
  applicationProcess: s.applicationProcess || 'Apply online via the official portal or visit the nearest CSC center.',
  officialWebsiteLink: s.officialWebsiteLink || 'https://www.india.gov.in',
  helpline: s.helpline || '1800-111-111',
  lastUpdated: s.lastUpdated || new Date().toISOString().split('T')[0],
  tags: s.tags || [s.category || 'Scheme']
}));
export const CATEGORIES = [
  { id: 'agriculture', title: 'Agriculture & Farmers', icon: 'Sprout' },
  { id: 'education', title: 'Education & Scholarships', icon: 'GraduationCap' },
  { id: 'health', title: 'Health & Insurance', icon: 'HeartPulse' },
  { id: 'jobs', title: 'Jobs & Employment', icon: 'Briefcase' },
  { id: 'startup', title: 'Startup & Business', icon: 'Rocket' },
  { id: 'women', title: 'Women & Child Development', icon: 'UserRound' },
  { id: 'housing', title: 'Housing & Urban Development', icon: 'Home' },
  { id: 'financial', title: 'Financial Support & Banking', icon: 'Banknote' },
  { id: 'skill', title: 'Skill Development', icon: 'Wrench' },
  { id: 'social', title: 'Social Welfare', icon: 'Users' },
  { id: 'technology', title: 'Technology & Digital India', icon: 'Cpu' },
  { id: 'state', title: 'State Government Schemes', icon: 'Map' }
];

export const STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

export const CASTE_CATEGORIES = ['General', 'OBC', 'SC', 'ST', 'EWS'];
export const QUALIFICATIONS = ['School', 'Intermediate', 'Graduate', 'Post Graduate'];
export const OCCUPATIONS = ['Farmer', 'Student', 'Worker', 'Entrepreneur', 'Unemployed'];
export const INCOME_RANGES = ['Below ₹1 Lakh', '₹1 - ₹2.5 Lakh', '₹2.5 - ₹5 Lakh', '₹5 - ₹10 Lakh', 'Above ₹10 Lakh'];
