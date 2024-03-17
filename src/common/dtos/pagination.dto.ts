import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsBoolean, IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {

    @ApiProperty({
        default: 10, description: 'How many rows do you need?'
    })
    @IsOptional()
    @IsPositive()
    //Transform param to a Number, is similar to enableImplicitConversions:true 
    @Type(() => Number)
    limit?: number;

    @ApiProperty({
        default: 0, description: 'How many rows do you skip?'
    })
    @IsOptional()
    @Min(0)
    @Type(() => Number)
    offset?: number;

    @ApiProperty({
        description: 'Filter items by state',
        default: true
    })
    @IsOptional()
    isActive: boolean;
}