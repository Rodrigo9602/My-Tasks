import { IsString, IsStrongPassword, IsNotEmpty, IsEmail } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    name: String;

    @IsNotEmpty()
    @IsEmail()
    email: String;

    @IsNotEmpty()
    @IsStrongPassword()
    password: String;
};
