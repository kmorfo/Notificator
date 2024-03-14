import { ApiProperty } from "@nestjs/swagger";
import { IsString, Matches, MaxLength, MinLength } from "class-validator";

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
}
