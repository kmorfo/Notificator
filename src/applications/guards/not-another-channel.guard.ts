import { BadRequestException, CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

import { ChannelsService } from '../../channels/channels.service';
import { Channel } from "src/channels/entities/channel.entity";

@Injectable()
export class NotAnotherChannelGuard implements CanActivate {
    constructor(
        private readonly channelsService: ChannelsService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        //Get request
        const req = context.switchToHttp().getRequest<Request>();

        const channelName = req.body?.['name']
        const applicationId = req.body?.['applicationId']

        const checkApp = await this.checkApplicationChannel(channelName, applicationId)

        if (checkApp)
            throw new BadRequestException(`Channel ${channelName} is already registered for this app`)

        return true
    }

    async checkApplicationChannel(channelName: string, applicationId: string): Promise<Channel | undefined> {
        const channel = await this.channelsService.findOneByNameApp(channelName, applicationId)
        return channel;
    }
}