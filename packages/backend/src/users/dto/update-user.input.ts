import { InputType, Field } from '@nestjs/graphql';
import {Role} from "@prisma/client";

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  firstname?: string;
  @Field({ nullable: true })
  lastname?: string;

  @Field(() => [Role], { nullable: true })
  roles?: Array<Role>
}
