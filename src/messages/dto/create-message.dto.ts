import { ApiProperty } from "@nestjs/swagger";
import { IsObject, IsOptional, IsString, IsUrl, Matches, MaxLength, MinLength } from "class-validator";

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
        description: 'Message Image URL ',
        example: 'https://tuapp.com/image.png'
    })
    @IsOptional()
    @IsUrl()
    image: string;

    @ApiProperty({
        description: 'Extra custom data',
        example: "score: '850' time: '2:45'"
    })
    @IsObject()
    @IsOptional()
    data: Record<string, any>;

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
