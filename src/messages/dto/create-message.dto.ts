import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMaxSize, ArrayMinSize, ArrayUnique, IsArray, IsInt, IsObject, IsOptional, IsString, IsUrl, MAX, Matches, Max, MaxLength, Min, MinLength, Validate } from "class-validator";

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

    //TODO Añadir Swagger docs al timer

    @IsOptional()
    @IsString()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)?$/, { message: 'Time format must be HH:MM' })
    time?: string;

    @IsOptional()
    @IsInt({ message: 'Day must be a number' })
    @Min(1, { message: 'Day must be between 1 and 31' })
    @Max(31, { message: 'Day must be between 1 and 31' })
    day?: number;

    @IsOptional()
    @IsArray()
    @ArrayMinSize(1, { message: 'You must provide at least one day.' })
    @ArrayMaxSize(7, { message: 'Cannot provide more than 7 days.' })
    @Min(0, {each: true}) // each number in array is 0 or higher
    @Max(7, {each: true}) // each number in array is 2 or lower
    @ArrayUnique((value: number) => value, { message: 'The days must be unique.' })
    @Type(() => Number)
    readonly days?: number[];

    @IsOptional()
    @IsArray()
    @ArrayMinSize(1, { message: 'You must provide at least one month.' })
    @ArrayMaxSize(12, { message: 'Cannot provide more than 12 months.' })
    @Min(1, {each: true}) // each number in array is 0 or higher
    @Max(12, {each: true}) // each number in array is 2 or lower
    @ArrayUnique((value: number) => value, { message: 'The months must be unique.' })
    @Type(() => Number)
    readonly months?: number[];
}
