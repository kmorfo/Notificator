import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class FilterMessageDto {

    @ApiProperty({
        description: 'ApplicationID must have a valid name',
        example: 'com.example.appname',
        minLength: 6,
        maxLength: 100
    })
    @IsString()
    @MinLength(6)
    @MaxLength(100)
    @Matches(
        /^([a-zA-Z]{2,4})\.[a-zA-Z0-9_]+(?:\.[a-zA-Z0-9_]+)+$/, {
        message: 'The ApplicationId must have a valid name like: com.example.appname'
    })
    applicationId: string;

    @ApiProperty({
        description: 'Notifications channel name',
        example: 'News',
        default: "default"
    })
    @IsOptional()
    @IsString()
    @MinLength(2)
    channel?: string;

    @ApiProperty({
        example: '08/06/2023, 11:49:13',
        description: 'TimeStamp date of the message from',
        default: 'First day of month',
        nullable: false
    })
    @IsDate()
    @IsOptional()
    @Type(() => Date)
    from?: Date;

    @ApiProperty({
        example: '08/06/2023, 11:49:13',
        description: 'TimeStamp date of the message to',
        default: 'Today',
        nullable: true
    })
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    to?: Date;
}
