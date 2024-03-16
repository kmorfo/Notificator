import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateProjectDto } from './create-project.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
    @ApiProperty({
        description: 'Indicates if the project is active in the system',
        default: true
    })
    @IsBoolean()
    @IsOptional()
    isActive: boolean;
}
