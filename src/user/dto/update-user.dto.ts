
import { IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    name?: String;    
}
