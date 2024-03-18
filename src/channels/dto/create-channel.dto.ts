import { ApiProperty } from "@nestjs/swagger";
import { IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateChannelDto {
    @ApiProperty({
        description: 'Full name of Channel',
        example: 'News',
        minLength: 1
    })
    @IsString()
    @MinLength(2)
    name: string;

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
}
