import { Colleges, GuidanceServices, TargetGroups } from '@su-gtd/api-enums';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class AnnualFormActivity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  annualFormIdentifier: string;

  @Column({
    type: 'enum',
    enum: GuidanceServices,
  })
  guidanceServiceType: GuidanceServices;

  @Column()
  activityName: string;

  @Column()
  startDateOfActivity: string;

  @Column()
  endDateOfActivity: string;

  @Column({
    type: 'enum',
    enum: Colleges,
  })
  college: Colleges;

  @Column({
    type: 'enum',
    enum: TargetGroups,
  })
  targetGroup: TargetGroups;

  @Column()
  totalTargetGroup: number;

  @Column()
  numOfAttendees: number;

  @Column()
  percentage: number;

  @Column()
  year: number;

  constructor(data: Partial<AnnualFormActivity> = {}) {
    Object.assign(this, data);
  }
}
