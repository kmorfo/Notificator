import { ApiProperty } from "@nestjs/swagger";
import { ArrayMinSize, IsArray, IsOptional, IsString, IsUUID, Matches, MaxLength, MinLength } from "class-validator";

export class CreateApplicationDto {

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
        description: 'Full name of application',
        example: 'Example App',
        minLength: 1
    })
    @IsString()
    @MinLength(2)
    name: string;

    @ApiProperty({
        description: 'App SHA',
        example: ['DA:39:A3:EE:5E:6B:4B:0D:32:55:BF:EF:95:60:18:90:AF:D8:07:09']
    })
    @Matches(
        /^[0-9A-Fa-f]{2}(?::[0-9A-Fa-f]{2}){19}$/,
        { each: true, message: 'Each SHA must be a valid SHA sign' }
    )
    @IsArray()
    @IsOptional()
    @IsString({ each: true })
    validSHA: string[];

    @ApiProperty({
        description: 'Project UID',
        example: '4de45b91-a49d-4670-b3e9-fe8f08af1555'
    })
    @IsUUID()
    projectUID: string;
}
