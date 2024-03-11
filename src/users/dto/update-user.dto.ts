import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsBoolean, IsOptional } from "class-validator";
import { CreateUserDto } from "src/auth/dto";

export class UpdateUserDto extends PartialType(CreateUserDto) {

    @ApiProperty({
        description: 'Indicates if the user is active in the system',
        default: true
    })
    @IsBoolean()
    @IsOptional()
    isActive: boolean;


}