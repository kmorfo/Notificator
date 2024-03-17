import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateApplicationDto } from './create-application.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateApplicationDto extends PartialType(CreateApplicationDto) {
    @ApiProperty({
        description: 'Indicates if the project is active in the system',
        default: true
    })
    @IsBoolean()
    @IsOptional()
    isActive: boolean;
}
