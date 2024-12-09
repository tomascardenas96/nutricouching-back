import { Days } from 'src/common/enum/days.enum';

export interface AvailabilityInterface {
  startTime: string;
  endTime: string;
  interval: number;
  day: Days[];
}
