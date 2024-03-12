import { ApiProperty } from "@nestjs/swagger";
import { IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateApplicationDto {

    @ApiProperty({
        description: 'Application package. The package must have a valid package name',
        example: 'com.example.appname',
        minLength: 6,
        maxLength: 100
    })
    @IsString()
    @MinLength(6)
    @MaxLength(100)
    @Matches(
        /^([a-zA-Z]{2,4})\.[a-zA-Z0-9_]+(?:\.[a-zA-Z0-9_]+)+$/, {
        message: 'Application package. The package must have a valid package name like: com.example.appname '
    })
    package: string;

    @ApiProperty({
        description: 'Full name of user',
        example: 'Pedro Garcia',
        minLength: 1
    })
    @IsString()
    @MinLength(2)
    name: string;

    @ApiProperty({
        description: 'App Token',
        example: 'asdfasdfasdf',
        minLength: 1
    })
    @IsString()
    @MinLength(2)
    token: string;

}
