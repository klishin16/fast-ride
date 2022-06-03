import { ArgsType, Field, InputType } from "@nestjs/graphql";

@InputType()
export class GeometryBoundArgs {
  @Field({ nullable: true })
  topLeftLng?: number;
  @Field({ nullable: true })
  topLeftLat?: number;
  @Field({ nullable: true })
  bottomRightLat?: number;
  @Field({ nullable: true })
  bottomRightLnt?: number;
}
