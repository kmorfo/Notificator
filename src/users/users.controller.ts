import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { Body, Controller, Get, Patch } from "@nestjs/common";

import { Auth, GetUser } from "src/auth/decorators";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";
import { UsersService } from "./users.service";
import { ValidRoles } from "src/auth/interfaces";


@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    @Auth(ValidRoles.root)    
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    findAll() {
        return this.usersService.findAll();
    }

    @Patch()
    @Auth()
    @ApiResponse({ status: 200, description: 'User was updated', type: User })
    @ApiResponse({ status: 400, description: 'The Email sent belongs to another user' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    update(
        @Body() updateUserDto: UpdateUserDto,
        @GetUser() user: User
    ) {
        return this.usersService.update(updateUserDto, user);
    }

}