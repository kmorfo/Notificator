import { Injectable, CanActivate, ExecutionContext, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';

import { User } from 'src/users/entities/user.entity';
import { DevicesService } from '../devices.service';
import { ApplicationsService } from 'src/applications/applications.service';
import { Device } from '../entities/device.entity';
import { Application } from 'src/applications/entities/application.entity';

@Injectable()
export class SameAppGuard implements CanActivate {
    constructor(
        private readonly applicationsService: ApplicationsService,
        private readonly devicesService: DevicesService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest<Request>();
        const user = req.user as User;

        //Extract id token from params
        const deviceToken = req.params.term

        const { device, applicationID } = await this.getDeviceData(deviceToken)
        if (!device) throw new NotFoundException(`Device ${deviceToken} not found.`)

        if (!applicationID || applicationID == undefined)
            throw new NotFoundException(`App ${applicationID} not found.`)

        const app = this.checkUserApp(applicationID, user)

        return true;
    }

    async getDeviceData(deviceToken: string) {
        const { device, applicationID } = await this.devicesService.findOne(deviceToken);
        return { device, applicationID }
    }

    async checkUserApp(applicationID: string, user: User): Promise<Application> {
        return await this.applicationsService.checkUserApp(applicationID, user)
    }


}