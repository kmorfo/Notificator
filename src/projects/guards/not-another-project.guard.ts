import { BadRequestException, CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { ProjectsService } from "../projects.service";

@Injectable()
export class NotAnotherProjectGuard implements CanActivate {
    constructor(
        private readonly projectsService: ProjectsService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        //Get request
        const req = context.switchToHttp().getRequest<Request>();

        const projectName = req.body?.['name']

        if (await this.checkProject(projectName))
            throw new BadRequestException(`Project ${projectName} is already registered.`)

        return true
    }

    async checkProject(name: string): Promise<boolean> {
        const project = await this.projectsService.findOneByName(name)
        return (project != null || project != undefined);
    }
}