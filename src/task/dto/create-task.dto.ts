import { IsString, IsDateString, IsNotEmpty } from "class-validator";


export class CreateTaskDto {
    @IsNotEmpty()
    @IsString()
    name: String;

    @IsNotEmpty()
    @IsString()
    description: String;


    @IsNotEmpty()
    @IsDateString()
    endingDate: Date;
};
