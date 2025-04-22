import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsStrongPassword, Max, Min } from "class-validator";

export class SignUpDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    username: string

    @ApiProperty()
    @IsStrongPassword()
    password: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    githubAccessKey: string
}