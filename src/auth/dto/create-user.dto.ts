
import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEmail, IsIn, IsOptional, IsString, Matches, MaxLength, MinLength, ValidateNested } from "class-validator";

export class CreateUserDto {

    @ApiProperty({
        description: 'Registration user email',
        example: 'test@test.com'
    })
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'Account password. The password must have a Uppercase, lowercase letter and a number',
        minLength: 6,
        maxLength: 50
    })
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;

    @ApiProperty({
        description: 'User name',
        example: 'Pedro Garcia',
        minLength: 1
    })
    @IsString()
    @MinLength(1)
    username: string;

    @ApiProperty({
        description: 'List of user roles',
        example: ['ADMIN', 'USER'],
        default: ['USER']
    })
    @IsString({ each: true })
    @IsArray()
    @IsIn(['ADMIN', 'USER'])
    @IsOptional()
    roles?: string[];

} 