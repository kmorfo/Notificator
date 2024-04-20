import { ApiProperty, PartialType } from '@nestjs/swagger';

import {  IsBoolean, IsOptional } from 'class-validator';

import { CreateDeviceDto } from './create-device.dto';

export class UpdateDeviceDto extends PartialType(CreateDeviceDto) {
    @ApiProperty({
        description: 'Indicates if the device is active in the system',
        default: true
    })
    @IsBoolean()
    @IsOptional()
    isActive: boolean;
}
