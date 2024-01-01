import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';

import { IsOptional, IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
    
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    name?: String;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    description?: String;

    @IsOptional()
    @IsNotEmpty()
    @IsDateString()
    endingDate?: Date;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    state?: String;

}
