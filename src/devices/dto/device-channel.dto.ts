
import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class DeviceChannelDto {
    @ApiProperty({
        description: 'Name of Channel to subscribe/unsubscribe',
        example: 'News',
        minLength: 2
    })
    @IsString()
    channel: string;
}