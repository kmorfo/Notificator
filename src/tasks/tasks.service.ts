import { Inject, Injectable, Logger, NotFoundException, forwardRef } from '@nestjs/common';

import * as cron from 'node-cron';

import { MessagesService } from '../messages/messages.service';
import { DeleteTaskDto } from './dto/delete-task.dto';

@Injectable()
export class TasksService {
    private readonly logger = new Logger('MessagesService');

    private cron: typeof cron;
    private scheduledTasks: Record<string, cron.ScheduledTask>;

    constructor(
        @Inject(forwardRef(() => MessagesService))
        private readonly messagesService: MessagesService,
    ) {
        this.cron = cron;
        this.scheduledTasks = {};
    }

    scheduleTask(createMessageDto, channelMsg, user, tokens): String {
        let cronPattern = '';

        //If we had sent any time params, it will add to cronPattern
        if (createMessageDto.time) {
            const [hour, minute] = createMessageDto.time.split(':');
            cronPattern += `${minute || '*'} ${hour || '*'} `;
        } else {
            cronPattern += '0 0 ';
        }

        if (createMessageDto.day) {
            cronPattern += `${createMessageDto.day} `;
        } else {
            cronPattern += '* ';
        }

        if (createMessageDto.months && createMessageDto.months.length > 0) {
            const monthsPattern = createMessageDto.months.join(',');
            cronPattern += `${monthsPattern} `;
        } else {
            cronPattern += '* ';
        }

        if (createMessageDto.days && createMessageDto.days.length > 0) {
            const daysPattern = createMessageDto.days.join(',');
            cronPattern += `${daysPattern} `;
        } else {
            cronPattern += '*';
        }

        const task = this.cron.schedule(cronPattern, () => {
            this.messagesService.createMessage(createMessageDto, channelMsg, user, tokens)
        });

        task.jobName = `${createMessageDto.applicationId}#${cronPattern}#${new Date().getTime().toString()}`
        this.scheduledTasks[task.jobName] = task;

        return `The message was scheduled correctly #${cronPattern}`;
    }

    findTasksBy(applicationID: String): string[] {
        const tasks = Object.values(this.scheduledTasks).filter(task => task.jobName.includes(applicationID));
        return tasks.map(task => task.jobName);
    }

    removeTasksBy(deleteTaskDto: DeleteTaskDto): string {
        const taskToDelete = this.scheduledTasks[deleteTaskDto.taskId]

        if (!taskToDelete || taskToDelete == undefined)
            throw new NotFoundException(`Task with id ${deleteTaskDto.taskId} not found.`);

        taskToDelete.stop();

        delete this.scheduledTasks[deleteTaskDto.taskId];

        return `Task with id: ${deleteTaskDto.taskId} was removed`
    }

}
