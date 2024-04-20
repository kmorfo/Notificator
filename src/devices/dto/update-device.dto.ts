import { ApiProperty, PartialType } from '@nestjs/swagger';

import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

import { CreateDeviceDto } from './create-device.dto';

export class UpdateDeviceDto extends PartialType(CreateDeviceDto) {
    @ApiProperty({
        description: 'Indicates if the device is active in the system',
        default: true
    })
    @IsBoolean()
    @IsOptional()
    isActive: boolean;

    @ApiProperty({
        description: 'Name of Channels to subscribe',
        example: '[News,Sports]',
        nullable:true
    })
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    channels?: string[];
}
