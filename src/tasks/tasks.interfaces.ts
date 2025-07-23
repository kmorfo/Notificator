import * as cron from 'node-cron';

export interface TaskInfo {
  task: cron.ScheduledTask;
  jobName: string;
  applicationId: string;
  cronPattern: string;
  createdAt: Date;
}

export interface ExtendedScheduledTask extends cron.ScheduledTask {
  jobName?: string;
}