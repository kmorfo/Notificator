import { ExecutionContext, ForbiddenException, InternalServerErrorException, createParamDecorator } from "@nestjs/common";

export const GetUser = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {

        const req = ctx.switchToHttp().getRequest();
        const user = req.user;

        if (!user) throw new InternalServerErrorException('User not found (request)')
        if (!user.isActive) throw new ForbiddenException('User is not active in the system, contact with the administrator.')

        return (!data) ? user : user[data];
    }
);