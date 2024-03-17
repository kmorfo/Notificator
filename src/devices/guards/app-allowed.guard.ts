import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';

import { ApplicationsService } from 'src/applications/applications.service';
import { Application } from 'src/applications/entities/application.entity';

@Injectable()
export class AppAllowedGuard implements CanActivate {
    constructor(
        private readonly applicationsService: ApplicationsService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // Extract request object
        const req = context.switchToHttp().getRequest<Request>();

        // Extract applicationId and sha from request body
        const applicationId = req.body?.['applicationId']
        const sha = req.body?.['sha']

        // Retrieve application based on applicationId
        const application = await this.getApp(applicationId)

        // Check if the provided sha is included in the validSHA array of the application
        if (!application.validSHA.includes(sha))
            throw new ForbiddenException(`Non valid SHA sign`)

        // If sha is valid, allow access
        return true
    }

    // Method to retrieve application based on applicationId
    async getApp(applicationId: string): Promise<Application | undefined> {
        return await this.applicationsService.findOneByAppId(applicationId)
    }
}