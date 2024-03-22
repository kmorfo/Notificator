import { Injectable, Logger } from '@nestjs/common';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class ErrorHandlingService {
    private logger = new Logger(ErrorHandlingService.name);

    handleDBExceptions(error: any): never {
        console.log(error);
        this.logger.error(error);

        // Handle unique constraint violation error
        if (error.code === '23505') {
            throw new BadRequestException(error.detail);
        }

        // Handle foreign key constraint violation error
        if (error.code === '23503') {
            throw new BadRequestException('Foreign key constraint violation');
        }

        // Handle null constraint violation error
        if (error.code === '23502') {
            throw new BadRequestException('Null constraint violation');
        }

        // If no cases match, throw a generic internal server error exception
        throw new InternalServerErrorException('Unexpected error, check server logs');
    }
}