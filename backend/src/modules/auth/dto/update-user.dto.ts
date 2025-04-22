import { PartialType } from "@nestjs/mapped-types";
import { User } from "src/modules/users/schema/user.schema";

export class UpdateUserDto extends PartialType(User) {}