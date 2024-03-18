import { Injectable, CanActivate, ExecutionContext, NotFoundException } from '@nestjs/common';
import { Request } from 'express';

import { User } from 'src/users/entities/user.entity';

import { ApplicationsService } from 'src/applications/applications.service';
import { Application } from 'src/applications/entities/application.entity';
import { ChannelsService } from '../channels.service';

@Injectable()
export class SameAppUserGuard implements CanActivate {
    constructor(
        private readonly applicationsService: ApplicationsService,
        private readonly channelService: ChannelsService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest<Request>();
        const user = req.user as User;

        // Extract applicationID from request body
        const applicationID = req.body?.['applicationId']

        await this.checkUserApp(applicationID, user)
    
        return true;
    }
    // Method to retrieve application based on applicationId and user
    async checkUserApp(applicationId: string, user: User): Promise<Application | undefined> {
        return await this.applicationsService.checkUserApp(applicationId, user)
    }
}