import {
  Colleges,
  Genders,
  GuidanceServices,
  TargetGroups,
} from '@su-gtd/api-enums';
export interface Message {
  message: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  password: string;
  birthday: string;
  email: string;
  gender: Genders;
}

export interface AnnualFormActivity {
  id: number;
  annualFormIdentifier: string;
  guidanceServiceType: GuidanceServices;
  activityName: string;
  startDateOfActivity: string;
  endDateOfActivity: string;
  college: Colleges;
  totalTargetGroup: number;
  numOfAttendees: number;
  percentage: number;
  year: number;
  targetGroup: TargetGroups;
}
