import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AnnualFormActivity } from '@su-gtd/api-interfaces';
import { environment } from '../../../environments/environment';
import { Colleges, GuidanceServices, TargetGroups } from '@su-gtd/api-enums';
import { firstValueFrom } from 'rxjs';

const { api } = environment;

@Injectable({
  providedIn: 'root',
})
export class AnnualFormService {
  sampleGuidanceServices = {
    INFORMATION_AND_ORIENTATION: [
      'Campus tours',
      'Policy briefings',
      'Career guidance',
      'Study skills workshops',
      'Info materials creation',
      'Extracurricular information',
      'Mental health talks',
    ],

    INDIVIDUAL_INVENTORY: [
      'Personality tests',
      'Interest surveys',
      'Transcript reviews',
      'Learning style assessments',
      'Test score analysis',
      'Extracurricular evaluation',
      'Leadership assessment',
    ],

    COUNSELING: [
      'Individual sessions',
      'Group therapy',
      'Crisis intervention',
      'Personal support',
      'Suicide risk assessments',
      'Mental health support',
      'Support groups',
    ],

    TESTING: [
      'Standardized tests',
      'Test score analysis',
      'Test prep guidance',
      'Accommodations for disabilities',
      'Alternative testing options',
      'Research studies',
      'Testing tool evaluation',
    ],

    REFERRAL_OR_FOLLOW_UP: [
      'Outside referrals',
      'Resource recommendations',
      'Follow-up support',
      'Referral tracking',
      'Service coordination',
      'Referral evaluation',
      'Progress monitoring',
    ],
    SOCIAL_PROGRAMS_OR_ENRICHMENT: [
      'Extracurricular activity planning',
      'Leadership development',
      'Volunteer opportunities',
      'Community service projects',
      'Cultural events',
      'Educational workshops',
      'Social skills training',
    ],
  };
  years = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023];

  constructor(private http: HttpClient) {
    // Uncomment the next line when creating sample activities
    // this.createAnnualReportSamples();
  }

  /**
   * This is to initialize a list of random activities for each college per year and per guidance services
   */
  async createAnnualReportSamples() {
    console.log('Creating samples....');
    for (let year = 0; year < this.years.length; year++) {
      for (const guidanceServiceKey in GuidanceServices) {
        for (const collegeKey in Colleges) {
          const numOfActivities = Math.floor(Math.random() * (3 - 1 + 1) + 1);

          for (let n = 0; n < numOfActivities; n++) {
            const numOfAttendees = Math.floor(Math.random() * (50 - 0 + 1) + 0);
            const totalTargetGroup = 50;
            const percentage = Math.round(
              (numOfAttendees / totalTargetGroup) * 100
            );
            const randomTargetGroupIndex = Math.floor(
              Math.random() * Object.keys(TargetGroups).length
            );
            const randomTargetGroupValue =
              Object.values(TargetGroups)[randomTargetGroupIndex];
            const dateRange = this.generateRandomDateRange(this.years[year]);
            await firstValueFrom(
              this.saveForm({
                activityName:
                  this.sampleGuidanceServices[guidanceServiceKey][
                    Math.floor(
                      Math.random() *
                        this.sampleGuidanceServices[guidanceServiceKey].length
                    )
                  ],
                college: Colleges[collegeKey],
                startDateOfActivity: dateRange[0],
                endDateOfActivity: dateRange[1],
                guidanceServiceType: GuidanceServices[guidanceServiceKey],
                numOfAttendees: numOfAttendees,
                totalTargetGroup: totalTargetGroup,
                targetGroup: randomTargetGroupValue,
                percentage: percentage,
                year: this.years[year],
              })
            );
          }
        }
      }
    }
  }

  // This performs a GET to get all activities from DB
  getAllActivities() {
    return this.http.get<AnnualFormActivity[]>(`${api}/annual-form/activities`);
  }

  // This performs a GET to get all
  getAllActivitiesByCollegeAndYear(year: number, college: Colleges) {
    return this.http.get<AnnualFormActivity[]>(
      `${api}/annual-form/${college}/${year}`
    );
  }

  // This performs a POST to save the annual report
  saveForm(annualForm: Partial<AnnualFormActivity>) {
    annualForm = {
      ...annualForm,
      annualFormIdentifier: `${this.createIdentifier(
        annualForm.college,
        annualForm.year
      )}`,
      startDateOfActivity: this.formatDate(
        new Date(annualForm.startDateOfActivity)
      ),
      endDateOfActivity: this.formatDate(
        new Date(annualForm.endDateOfActivity)
      ),
    };
    return this.http.post<AnnualFormActivity>(
      `${api}/annual-form/activity`,
      annualForm
    );
  }

  // This performs a DELETE to delete an activity by ID
  deleteActivityById(id: number) {
    return this.http.delete(`${api}/annual-form/activity/${id}`);
  }

  // This is to format the date to keep all dates consistent
  formatDate(date: Date): string {
    const month = date.toLocaleString('en-US', { month: 'long' });
    const day = date.toLocaleString('en-US', { day: 'numeric' });
    const yearString = date.getFullYear().toString();
    return `${month}, ${day}, ${yearString}`;
  }

  /**
   * This is to create an identifier that follows this format: <year | YYYY><college_acronym> e.g. 2023CBA
   * @param inputString
   * @param year
   * @returns null
   */
  createIdentifier(inputString: string, year: number): string {
    let uppercaseLetters = '';
    inputString = inputString.trim();
    for (let i = 0; i < inputString.length; i++) {
      const currentChar = inputString.charAt(i);
      if (currentChar === currentChar.toUpperCase() && currentChar !== ' ') {
        uppercaseLetters += currentChar;
      }
    }
    return `${year}${uppercaseLetters}`;
  }

  // This is a utility function that generates a random date given a range
  generateRandomDateRange(year: number): [string, string] {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);
    const randomStartTimestamp =
      startDate.getTime() +
      Math.random() *
        (endDate.getTime() - startDate.getTime() - 7 * 24 * 60 * 60 * 1000); // subtract 7 days worth of milliseconds
    const randomEndTimestamp =
      randomStartTimestamp + Math.random() * (7 * 24 * 60 * 60 * 1000); // add up to 7 days worth of milliseconds
    const randomStartDate = new Date(randomStartTimestamp);
    const randomEndDate = new Date(randomEndTimestamp);
    const startMonth = randomStartDate.toLocaleString('en-US', {
      month: 'long',
    });
    const startDay = randomStartDate.toLocaleString('en-US', {
      day: 'numeric',
    });
    const startYearString = randomStartDate.getFullYear().toString();
    const endMonth = randomEndDate.toLocaleString('en-US', {
      month: 'long',
    });
    const endDay = randomEndDate.toLocaleString('en-US', { day: 'numeric' });
    const endYearString = randomEndDate.getFullYear().toString();
    const startDateString = `${startMonth}, ${startDay}, ${startYearString}`;
    const endDateString = `${endMonth}, ${endDay}, ${endYearString}`;
    return [startDateString, endDateString];
  }

  // This performs a GET to get all activities by the annualFormIdentifier
  getAllActivitiesByIdentifier(annualForm: Partial<AnnualFormActivity>) {
    const identifier = this.createIdentifier(
      annualForm.college,
      annualForm.year
    );

    return this.http.get<AnnualFormActivity[]>(
      `${api}/annual-form/${identifier}`
    );
  }
}
