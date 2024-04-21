import { ApiProperty } from "@nestjs/swagger";
import { IsString, Matches, MaxLength, MinLength } from "class-validator";

export class DeleteTaskDto {
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
        description: 'TaskId',
        example: 'com.example.appname#57 16 * * *#1713540422530',
        minLength: 1
    })
    @IsString()
    @MinLength(8)
    taskId: string;
}
