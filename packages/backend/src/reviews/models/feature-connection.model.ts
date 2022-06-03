import { ObjectType } from "@nestjs/graphql";
import PaginatedResponse from "../../common/pagination/pagination";
import { Feature } from "./feature.model";

@ObjectType()
export class FeatureConnection extends PaginatedResponse(Feature) {}
