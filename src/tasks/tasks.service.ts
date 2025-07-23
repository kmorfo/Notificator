import { Inject, Injectable, Logger, NotFoundException, forwardRef } from '@nestjs/common';

import * as cron from 'node-cron';

import { MessagesService } from '../messages/messages.service';
import { DeleteTaskDto } from './dto/delete-task.dto';
import { TaskInfo } from './tasks.interfaces';


@Injectable()
export class TasksService {
  private readonly logger = new Logger('TasksService');
  private scheduledTasks: Map<string, TaskInfo> = new Map();

  constructor(
    @Inject(forwardRef(() => MessagesService))
    private readonly messagesService: MessagesService,
  ) {}

  scheduleTask(createMessageDto, channelMsg, user, tokens): string {
    const cronPattern = this.buildCronPattern(createMessageDto);
    
    const task = cron.schedule(cronPattern, () => {
      this.messagesService.createMessage(createMessageDto, channelMsg, user, tokens);
    });

    const jobName = `${createMessageDto.applicationId}#${cronPattern}#${Date.now()}`;
    
    const taskInfo: TaskInfo = {
      task,
      jobName,
      applicationId: createMessageDto.applicationId,
      cronPattern,
      createdAt: new Date()
    };

    this.scheduledTasks.set(jobName, taskInfo);
    
    this.logger.log(`Task scheduled: ${jobName}`);
    return `The message was scheduled correctly #${cronPattern}`;
  }

  private buildCronPattern(createMessageDto): string {
    let cronPattern = '';
    
    if (createMessageDto.time) {
      const [hour, minute] = createMessageDto.time.split(':');
      cronPattern += `${minute || '*'} ${hour || '*'} `;
    } else {
      cronPattern += '0 0 ';
    }

    cronPattern += createMessageDto.day ? `${createMessageDto.day} ` : '* ';
    
    if (createMessageDto.months?.length > 0) {
      cronPattern += `${createMessageDto.months.join(',')} `;
    } else {
      cronPattern += '* ';
    }

    if (createMessageDto.days?.length > 0) {
      cronPattern += createMessageDto.days.join(',');
    } else {
      cronPattern += '*';
    }

    return cronPattern;
  }

  findTasksBy(applicationID: string): string[] {
    const tasks = Array.from(this.scheduledTasks.values())
      .filter(taskInfo => taskInfo.applicationId === applicationID);
    
    return tasks.map(taskInfo => taskInfo.jobName);
  }

  removeTasksBy(deleteTaskDto: DeleteTaskDto): string {
    const taskInfo = this.scheduledTasks.get(deleteTaskDto.taskId);
    
    if (!taskInfo) {
      throw new NotFoundException(`Task with id ${deleteTaskDto.taskId} not found.`);
    }

    taskInfo.task.stop();
    this.scheduledTasks.delete(deleteTaskDto.taskId);
    
    this.logger.log(`Task removed: ${deleteTaskDto.taskId}`);
    return `Task with id: ${deleteTaskDto.taskId} was removed`;
  }

  // Métodos adicionales útiles
  getAllTasks(): TaskInfo[] {
    return Array.from(this.scheduledTasks.values());
  }

  getTaskById(taskId: string): TaskInfo | undefined {
    return this.scheduledTasks.get(taskId);
  }

  stopAllTasks(): void {
    this.scheduledTasks.forEach(taskInfo => {
      taskInfo.task.stop();
    });
    this.scheduledTasks.clear();
    this.logger.log('All tasks stopped and cleared');
  }
}