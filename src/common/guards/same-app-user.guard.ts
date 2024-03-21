import { Injectable, CanActivate, ExecutionContext, NotFoundException } from '@nestjs/common';
import { Request } from 'express';

import { User } from 'src/users/entities/user.entity';

import { ApplicationsService } from 'src/applications/applications.service';
import { Application } from 'src/applications/entities/application.entity';

@Injectable()
export class SameAppUserGuard implements CanActivate {
    constructor(
        private readonly applicationsService: ApplicationsService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest<Request>();
        const user = req.user as User;


        const method = req.method;
        let applicationID

        if (method == 'GET')
            applicationID = (req.params.term != undefined) ? req.params.term : req.query.applicationId

        else
            applicationID = req.body?.['applicationId'];


        if (applicationID == undefined)
            throw new NotFoundException(`Application with UID ${applicationID} not found.`)

        await this.checkUserApp(applicationID, user)

        return true;
    }
    // Method to retrieve application based on applicationId and user
    async checkUserApp(applicationId: string, user: User): Promise<Application | undefined> {
        return await this.applicationsService.checkUserApp(applicationId, user)
    }
}