import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateChannelDto } from './create-channel.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateChannelDto extends PartialType(CreateChannelDto) {
    @ApiProperty({
        description: 'Indicates if the channel is active in the application',
        default: true
    })
    @IsBoolean()
    @IsOptional()
    isActive: boolean;
}
