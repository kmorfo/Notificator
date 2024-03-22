import { Module } from '@nestjs/common';
import { ErrorHandlingService } from './error-handling/error-handling.service';

@Module({
    providers: [ErrorHandlingService],
    exports: [ErrorHandlingService],
})
export class CommonModule { }
