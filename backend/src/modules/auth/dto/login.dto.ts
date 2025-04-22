import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsStrongPassword, Max } from "class-validator";

export class LoginDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    username: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    password: string
}