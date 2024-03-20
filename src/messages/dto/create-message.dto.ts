import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateMessageDto {
    @ApiProperty({
        description: 'Title of the message',
        example: 'This is the title',
        minLength: 1
    })
    @IsString()
    @MinLength(2)
    title: string;

    @ApiProperty({
        description: 'Body of the message',
        example: 'This is the body',
        minLength: 1
    })
    @IsString()
    @MinLength(2)
    body: string;

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
        minLength: 1
    })
    @IsOptional()
    @IsString()
    @MinLength(2)
    channel?: string;
}
