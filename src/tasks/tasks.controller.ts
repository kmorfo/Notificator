import { Body, Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators';
import { SameAppUserGuard } from 'src/common/guards/same-app-user.guard';
import { DeleteTaskDto } from './dto/delete-task.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) { }

    @Get(':term')
    @Auth()
    @UseGuards(AuthGuard(), SameAppUserGuard)
    @ApiResponse({ status: 200, description: 'Returns array of tasks filtered', type: Array<String> })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden. Token related.' })
    @ApiResponse({ status: 404, description: 'Not Found. No tasks found with these params.' })
    findAllTasks(
        @Param('term') term: string
    ) {
        return this.tasksService.findTasksBy(term);
    }

    @Delete()
    @Auth()
    @UseGuards(AuthGuard(), SameAppUserGuard)
    @ApiResponse({ status: 200, description: 'Task was removed' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden. Token related.' })
    @ApiResponse({ status: 404, description: 'Not Found' })
    removeTasksBy(@Body() deleteTaskDto: DeleteTaskDto) {
        return this.tasksService.removeTasksBy(deleteTaskDto);
    }
}
