import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: any;
  /** A field whose value is a JSON Web Token (JWT): https://jwt.io/introduction. */
  JWT: any;
};

export type Auth = {
  __typename?: 'Auth';
  /** JWT access token */
  accessToken: Scalars['JWT'];
  /** JWT refresh token */
  refreshToken: Scalars['JWT'];
  user: User;
};

export type ChangePasswordInput = {
  newPassword: Scalars['String'];
  oldPassword: Scalars['String'];
};

export type Comment = {
  __typename?: 'Comment';
  author?: Maybe<User>;
  /** Identifies the date and time when the object was created. */
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  likes: Array<CommentLike>;
  review: Review;
  text: Scalars['String'];
  /** Identifies the date and time when the object was last updated. */
  updatedAt: Scalars['DateTime'];
};

export type CommentConnection = {
  __typename?: 'CommentConnection';
  edges?: Maybe<Array<CommentEdge>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type CommentEdge = {
  __typename?: 'CommentEdge';
  cursor: Scalars['String'];
  node: Comment;
};

export type CommentLike = {
  __typename?: 'CommentLike';
  author: User;
  comment: Comment;
  /** Identifies the date and time when the object was created. */
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  /** Identifies the date and time when the object was last updated. */
  updatedAt: Scalars['DateTime'];
};

export type CreateCommentInput = {
  authorId?: InputMaybe<Scalars['String']>;
  reviewId?: InputMaybe<Scalars['String']>;
  text: Scalars['String'];
};

export type CreateEstimationInput = {
  reviewId: Scalars['String'];
  road_congestion: Scalars['Int'];
  road_quality: Scalars['Int'];
  travel_safety: Scalars['Int'];
};

export type CreateFeatureInput = {
  geometry: Array<Array<Scalars['Int']>>;
  reviewId: Scalars['String'];
};

export type CreatePostInput = {
  content: Scalars['String'];
  title: Scalars['String'];
};

export type CreateReviewInput = {
  commentsId?: InputMaybe<Array<Scalars['String']>>;
  estimationId?: InputMaybe<Scalars['String']>;
  featureId?: InputMaybe<Scalars['String']>;
  title: Scalars['String'];
};

export type Estimation = {
  __typename?: 'Estimation';
  /** Identifies the date and time when the object was created. */
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  review: Review;
  road_congestion: Scalars['Int'];
  road_quality: Scalars['Int'];
  travel_safety: Scalars['Int'];
  /** Identifies the date and time when the object was last updated. */
  updatedAt: Scalars['DateTime'];
};

export type Feature = {
  __typename?: 'Feature';
  bottomRightLat: Scalars['Int'];
  bottomRightLnt: Scalars['Int'];
  /** Identifies the date and time when the object was created. */
  createdAt: Scalars['DateTime'];
  geometry: Array<Array<Scalars['Int']>>;
  id: Scalars['ID'];
  mapId: Scalars['Int'];
  review?: Maybe<Review>;
  topLeftLat: Scalars['Int'];
  topLeftLng: Scalars['Int'];
  /** Identifies the date and time when the object was last updated. */
  updatedAt: Scalars['DateTime'];
};

export type FeatureConnection = {
  __typename?: 'FeatureConnection';
  edges?: Maybe<Array<FeatureEdge>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type FeatureEdge = {
  __typename?: 'FeatureEdge';
  cursor: Scalars['String'];
  node: Feature;
};

export type GeometryBoundArgs = {
  bottomRightLat?: InputMaybe<Scalars['Int']>;
  bottomRightLnt?: InputMaybe<Scalars['Int']>;
  topLeftLat?: InputMaybe<Scalars['Int']>;
  topLeftLng?: InputMaybe<Scalars['Int']>;
};

export type GetFeaturesInput = {
  authorId?: InputMaybe<Scalars['String']>;
  in_progress?: InputMaybe<Scalars['Boolean']>;
};

export type GetReviewInput = {
  authorId: Scalars['String'];
  in_progress: Scalars['Boolean'];
};

export type LoginInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  changePassword: User;
  createComment: Comment;
  createEstimation: Estimation;
  createFeature: Feature;
  createPost: Post;
  /** Create new review */
  createReview: Review;
  login: Auth;
  refreshToken: Token;
  signup: Auth;
  updateComment: Comment;
  updateEstimation: Estimation;
  updateFeature: Feature;
  updateReview: Review;
  updateUser: User;
};


export type MutationChangePasswordArgs = {
  data: ChangePasswordInput;
};


export type MutationCreateCommentArgs = {
  data: CreateCommentInput;
};


export type MutationCreateEstimationArgs = {
  data: CreateEstimationInput;
};


export type MutationCreateFeatureArgs = {
  data: CreateFeatureInput;
};


export type MutationCreatePostArgs = {
  data: CreatePostInput;
};


export type MutationCreateReviewArgs = {
  data: CreateReviewInput;
};


export type MutationLoginArgs = {
  data: LoginInput;
};


export type MutationRefreshTokenArgs = {
  token: Scalars['JWT'];
};


export type MutationSignupArgs = {
  data: SignupInput;
};


export type MutationUpdateCommentArgs = {
  data: UpdateCommentInput;
};


export type MutationUpdateEstimationArgs = {
  data: UpdateEstimationInput;
};


export type MutationUpdateFeatureArgs = {
  data: UpdateFeatureInput;
};


export type MutationUpdateReviewArgs = {
  data: UpdateReviewInput;
};


export type MutationUpdateUserArgs = {
  data: UpdateUserInput;
};

/** Possible directions in which to order a list of items when provided an `orderBy` argument. */
export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']>;
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
  startCursor?: Maybe<Scalars['String']>;
};

export type Post = {
  __typename?: 'Post';
  author: User;
  content: Scalars['String'];
  /** Identifies the date and time when the object was created. */
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  published: Scalars['Boolean'];
  title: Scalars['String'];
  /** Identifies the date and time when the object was last updated. */
  updatedAt: Scalars['DateTime'];
};

export type PostConnection = {
  __typename?: 'PostConnection';
  edges?: Maybe<Array<PostEdge>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type PostEdge = {
  __typename?: 'PostEdge';
  cursor: Scalars['String'];
  node: Post;
};

export type PostOrder = {
  direction: OrderDirection;
  field: PostOrderField;
};

/** Properties by which post connections can be ordered. */
export enum PostOrderField {
  Content = 'content',
  CreatedAt = 'createdAt',
  Id = 'id',
  Published = 'published',
  Title = 'title',
  UpdatedAt = 'updatedAt'
}

export type Query = {
  __typename?: 'Query';
  comments: CommentConnection;
  estimations: Array<Estimation>;
  features: Array<Feature>;
  featuresWithPagination: FeatureConnection;
  me: User;
  post: Post;
  publishedPosts: PostConnection;
  review?: Maybe<Review>;
  reviews: Array<Review>;
  reviewsWithPagination: ReviewConnection;
  userPosts: Array<Post>;
  usersWithPagination: UsersConnection;
};


export type QueryCommentsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  query?: InputMaybe<Scalars['String']>;
  reviewId?: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
};


export type QueryFeaturesArgs = {
  bounds: GeometryBoundArgs;
  data: GetFeaturesInput;
};


export type QueryFeaturesWithPaginationArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  query?: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
};


export type QueryPostArgs = {
  postId: Scalars['String'];
};


export type QueryPublishedPostsArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PostOrder>;
  query?: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
};


export type QueryReviewArgs = {
  data: GetReviewInput;
};


export type QueryReviewsArgs = {
  userId?: InputMaybe<Scalars['String']>;
};


export type QueryReviewsWithPaginationArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  query?: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
};


export type QueryUserPostsArgs = {
  userId: Scalars['String'];
};


export type QueryUsersWithPaginationArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  query?: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
};

export type Review = {
  __typename?: 'Review';
  comments: Array<Comment>;
  /** Identifies the date and time when the object was created. */
  createdAt: Scalars['DateTime'];
  estimation?: Maybe<Estimation>;
  feature?: Maybe<Feature>;
  id: Scalars['ID'];
  in_progress: Scalars['Boolean'];
  title: Scalars['String'];
  /** Identifies the date and time when the object was last updated. */
  updatedAt: Scalars['DateTime'];
};

export type ReviewConnection = {
  __typename?: 'ReviewConnection';
  edges?: Maybe<Array<ReviewEdge>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type ReviewEdge = {
  __typename?: 'ReviewEdge';
  cursor: Scalars['String'];
  node: Review;
};

/** User role */
export enum Role {
  Admin = 'ADMIN',
  User = 'USER'
}

export type SignupInput = {
  email: Scalars['String'];
  firstname?: InputMaybe<Scalars['String']>;
  lastname?: InputMaybe<Scalars['String']>;
  password: Scalars['String'];
};

export type Subscription = {
  __typename?: 'Subscription';
  postCreated: Post;
  reviewCreated: Review;
};

export type Token = {
  __typename?: 'Token';
  /** JWT access token */
  accessToken: Scalars['JWT'];
  /** JWT refresh token */
  refreshToken: Scalars['JWT'];
};

export type UpdateCommentInput = {
  authorId?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
  reviewId?: InputMaybe<Scalars['String']>;
  text: Scalars['String'];
};

export type UpdateEstimationInput = {
  estimationId: Scalars['String'];
  road_congestion: Scalars['Int'];
  road_quality: Scalars['Int'];
  travel_safety: Scalars['Int'];
};

export type UpdateFeatureInput = {
  featureId: Scalars['String'];
  geometry: Array<Array<Scalars['Int']>>;
};

export type UpdateReviewInput = {
  in_progress: Scalars['Boolean'];
  reviewId: Scalars['String'];
};

export type UpdateUserInput = {
  firstname?: InputMaybe<Scalars['String']>;
  lastname?: InputMaybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  /** Identifies the date and time when the object was created. */
  createdAt: Scalars['DateTime'];
  email: Scalars['String'];
  firstname?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  lastname?: Maybe<Scalars['String']>;
  posts: Array<Post>;
  role: Role;
  /** Identifies the date and time when the object was last updated. */
  updatedAt: Scalars['DateTime'];
};

export type UserEdge = {
  __typename?: 'UserEdge';
  cursor: Scalars['String'];
  node: User;
};

export type UsersConnection = {
  __typename?: 'UsersConnection';
  edges?: Maybe<Array<UserEdge>>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int'];
};

export type AuthLoginMutationVariables = Exact<{
  data: LoginInput;
}>;


export type AuthLoginMutation = { __typename?: 'Mutation', login: { __typename?: 'Auth', accessToken: any, refreshToken: any, user: { __typename?: 'User', id: string, email: string } } };

export type AuthSignupMutationVariables = Exact<{
  data: SignupInput;
}>;


export type AuthSignupMutation = { __typename?: 'Mutation', signup: { __typename?: 'Auth', accessToken: any, refreshToken: any, user: { __typename?: 'User', id: string, email: string, role: Role } } };

export type GetCommentsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
}>;


export type GetCommentsQuery = { __typename?: 'Query', comments: { __typename?: 'CommentConnection', totalCount: number, edges?: Array<{ __typename?: 'CommentEdge', node: { __typename?: 'Comment', id: string, text: string, author?: { __typename?: 'User', email: string } | null } }> | null, pageInfo: { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage: boolean } } };

export type UpdateCommentMutationVariables = Exact<{
  data: UpdateCommentInput;
}>;


export type UpdateCommentMutation = { __typename?: 'Mutation', updateComment: { __typename?: 'Comment', id: string, text: string } };

export type GetReviewCommentsQueryVariables = Exact<{
  reviewId?: InputMaybe<Scalars['String']>;
}>;


export type GetReviewCommentsQuery = { __typename?: 'Query', comments: { __typename?: 'CommentConnection', edges?: Array<{ __typename?: 'CommentEdge', node: { __typename?: 'Comment', id: string, text: string, updatedAt: any, author?: { __typename?: 'User', email: string } | null, likes: Array<{ __typename?: 'CommentLike', id: string }> } }> | null } };

export type CreateCommentMutationVariables = Exact<{
  data: CreateCommentInput;
}>;


export type CreateCommentMutation = { __typename?: 'Mutation', createComment: { __typename?: 'Comment', id: string, text: string, updatedAt: any, likes: Array<{ __typename?: 'CommentLike', id: string }>, author?: { __typename?: 'User', email: string } | null } };

export type CreateEstimationMutationVariables = Exact<{
  data: CreateEstimationInput;
}>;


export type CreateEstimationMutation = { __typename?: 'Mutation', createEstimation: { __typename?: 'Estimation', id: string, road_congestion: number, road_quality: number, travel_safety: number } };

export type UpdateEstimationMutationVariables = Exact<{
  data: UpdateEstimationInput;
}>;


export type UpdateEstimationMutation = { __typename?: 'Mutation', updateEstimation: { __typename?: 'Estimation', id: string, road_congestion: number, road_quality: number, travel_safety: number } };

export type UpdateFeatureMutationVariables = Exact<{
  data: UpdateFeatureInput;
}>;


export type UpdateFeatureMutation = { __typename?: 'Mutation', updateFeature: { __typename?: 'Feature', id: string, topLeftLat: number, topLeftLng: number, bottomRightLat: number, bottomRightLnt: number, geometry: Array<Array<number>> } };

export type CreateFeatureMutationVariables = Exact<{
  data: CreateFeatureInput;
}>;


export type CreateFeatureMutation = { __typename?: 'Mutation', createFeature: { __typename?: 'Feature', id: string } };

export type FeaturesQueryVariables = Exact<{
  bounds: GeometryBoundArgs;
  data: GetFeaturesInput;
}>;


export type FeaturesQuery = { __typename?: 'Query', features: Array<{ __typename?: 'Feature', id: string, geometry: Array<Array<number>>, mapId: number, review?: { __typename?: 'Review', id: string, estimation?: { __typename?: 'Estimation', road_congestion: number, road_quality: number, travel_safety: number } | null } | null }> };

export type GetFeaturesQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
}>;


export type GetFeaturesQuery = { __typename?: 'Query', featuresWithPagination: { __typename?: 'FeatureConnection', totalCount: number, edges?: Array<{ __typename?: 'FeatureEdge', node: { __typename?: 'Feature', id: string, topLeftLat: number, topLeftLng: number, bottomRightLat: number, bottomRightLnt: number } }> | null, pageInfo: { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage: boolean } } };

export type CreateReviewMutationVariables = Exact<{
  data: CreateReviewInput;
}>;


export type CreateReviewMutation = { __typename?: 'Mutation', createReview: { __typename?: 'Review', id: string } };

export type ReviewQueryVariables = Exact<{
  data: GetReviewInput;
}>;


export type ReviewQuery = { __typename?: 'Query', review?: { __typename?: 'Review', id: string, feature?: { __typename?: 'Feature', id: string, geometry: Array<Array<number>> } | null, estimation?: { __typename?: 'Estimation', id: string, travel_safety: number, road_quality: number, road_congestion: number } | null, comments: Array<{ __typename?: 'Comment', id: string, text: string }> } | null };

export type UpdateReviewMutationVariables = Exact<{
  data: UpdateReviewInput;
}>;


export type UpdateReviewMutation = { __typename?: 'Mutation', updateReview: { __typename?: 'Review', id: string } };

export type GetReviewsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
}>;


export type GetReviewsQuery = { __typename?: 'Query', reviewsWithPagination: { __typename?: 'ReviewConnection', totalCount: number, edges?: Array<{ __typename?: 'ReviewEdge', node: { __typename?: 'Review', id: string, title: string } }> | null, pageInfo: { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage: boolean } } };

export type GetMyReviewsQueryVariables = Exact<{
  userId?: InputMaybe<Scalars['String']>;
}>;


export type GetMyReviewsQuery = { __typename?: 'Query', reviews: Array<{ __typename?: 'Review', id: string, title: string, createdAt: any, updatedAt: any, in_progress: boolean, feature?: { __typename?: 'Feature', id: string, topLeftLat: number, topLeftLng: number, bottomRightLat: number, bottomRightLnt: number } | null, estimation?: { __typename?: 'Estimation', id: string, road_congestion: number, road_quality: number, travel_safety: number } | null }> };

export type GetUsersQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
}>;


export type GetUsersQuery = { __typename?: 'Query', usersWithPagination: { __typename?: 'UsersConnection', totalCount: number, edges?: Array<{ __typename?: 'UserEdge', node: { __typename?: 'User', id: string, email: string, firstname?: string | null, lastname?: string | null, createdAt: any, updatedAt: any } }> | null, pageInfo: { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage: boolean } } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'User', id: string, email: string, role: Role } };

export const AuthLoginDocument = gql`
    mutation AuthLogin($data: LoginInput!) {
  login(data: $data) {
    accessToken
    refreshToken
    user {
      id
      email
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class AuthLoginGQL extends Apollo.Mutation<AuthLoginMutation, AuthLoginMutationVariables> {
    override document = AuthLoginDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const AuthSignupDocument = gql`
    mutation AuthSignup($data: SignupInput!) {
  signup(data: $data) {
    accessToken
    refreshToken
    user {
      id
      email
      role
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class AuthSignupGQL extends Apollo.Mutation<AuthSignupMutation, AuthSignupMutationVariables> {
    override document = AuthSignupDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetCommentsDocument = gql`
    query GetComments($first: Int, $after: String) {
  comments(first: $first, after: $after) {
    edges {
      node {
        id
        author {
          email
        }
        text
      }
    }
    pageInfo {
      endCursor
      hasNextPage
    }
    totalCount
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetCommentsGQL extends Apollo.Query<GetCommentsQuery, GetCommentsQueryVariables> {
    override document = GetCommentsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateCommentDocument = gql`
    mutation UpdateComment($data: UpdateCommentInput!) {
  updateComment(data: $data) {
    id
    text
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateCommentGQL extends Apollo.Mutation<UpdateCommentMutation, UpdateCommentMutationVariables> {
    override document = UpdateCommentDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetReviewCommentsDocument = gql`
    query GetReviewComments($reviewId: String) {
  comments(reviewId: $reviewId) {
    edges {
      node {
        id
        author {
          email
        }
        likes {
          id
        }
        text
        updatedAt
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetReviewCommentsGQL extends Apollo.Query<GetReviewCommentsQuery, GetReviewCommentsQueryVariables> {
    override document = GetReviewCommentsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateCommentDocument = gql`
    mutation CreateComment($data: CreateCommentInput!) {
  createComment(data: $data) {
    id
    text
    likes {
      id
    }
    author {
      email
    }
    updatedAt
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateCommentGQL extends Apollo.Mutation<CreateCommentMutation, CreateCommentMutationVariables> {
    override document = CreateCommentDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateEstimationDocument = gql`
    mutation CreateEstimation($data: CreateEstimationInput!) {
  createEstimation(data: $data) {
    id
    road_congestion
    road_quality
    travel_safety
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateEstimationGQL extends Apollo.Mutation<CreateEstimationMutation, CreateEstimationMutationVariables> {
    override document = CreateEstimationDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateEstimationDocument = gql`
    mutation UpdateEstimation($data: UpdateEstimationInput!) {
  updateEstimation(data: $data) {
    id
    road_congestion
    road_quality
    travel_safety
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateEstimationGQL extends Apollo.Mutation<UpdateEstimationMutation, UpdateEstimationMutationVariables> {
    override document = UpdateEstimationDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateFeatureDocument = gql`
    mutation UpdateFeature($data: UpdateFeatureInput!) {
  updateFeature(data: $data) {
    id
    topLeftLat
    topLeftLng
    bottomRightLat
    bottomRightLnt
    geometry
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateFeatureGQL extends Apollo.Mutation<UpdateFeatureMutation, UpdateFeatureMutationVariables> {
    override document = UpdateFeatureDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateFeatureDocument = gql`
    mutation CreateFeature($data: CreateFeatureInput!) {
  createFeature(data: $data) {
    id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateFeatureGQL extends Apollo.Mutation<CreateFeatureMutation, CreateFeatureMutationVariables> {
    override document = CreateFeatureDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const FeaturesDocument = gql`
    query Features($bounds: GeometryBoundArgs!, $data: GetFeaturesInput!) {
  features(bounds: $bounds, data: $data) {
    id
    review {
      id
      estimation {
        road_congestion
        road_quality
        travel_safety
      }
    }
    geometry
    mapId
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class FeaturesGQL extends Apollo.Query<FeaturesQuery, FeaturesQueryVariables> {
    override document = FeaturesDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetFeaturesDocument = gql`
    query GetFeatures($first: Int, $after: String) {
  featuresWithPagination(first: $first, after: $after) {
    edges {
      node {
        id
        topLeftLat
        topLeftLng
        bottomRightLat
        bottomRightLnt
      }
    }
    pageInfo {
      endCursor
      hasNextPage
    }
    totalCount
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetFeaturesGQL extends Apollo.Query<GetFeaturesQuery, GetFeaturesQueryVariables> {
    override document = GetFeaturesDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateReviewDocument = gql`
    mutation CreateReview($data: CreateReviewInput!) {
  createReview(data: $data) {
    id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateReviewGQL extends Apollo.Mutation<CreateReviewMutation, CreateReviewMutationVariables> {
    override document = CreateReviewDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const ReviewDocument = gql`
    query Review($data: GetReviewInput!) {
  review(data: $data) {
    id
    feature {
      id
      geometry
    }
    estimation {
      id
      travel_safety
      road_quality
      road_congestion
    }
    comments {
      id
      text
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ReviewGQL extends Apollo.Query<ReviewQuery, ReviewQueryVariables> {
    override document = ReviewDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const UpdateReviewDocument = gql`
    mutation UpdateReview($data: UpdateReviewInput!) {
  updateReview(data: $data) {
    id
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class UpdateReviewGQL extends Apollo.Mutation<UpdateReviewMutation, UpdateReviewMutationVariables> {
    override document = UpdateReviewDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetReviewsDocument = gql`
    query GetReviews($first: Int, $after: String) {
  reviewsWithPagination(first: $first, after: $after) {
    edges {
      node {
        id
        title
      }
    }
    pageInfo {
      endCursor
      hasNextPage
    }
    totalCount
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetReviewsGQL extends Apollo.Query<GetReviewsQuery, GetReviewsQueryVariables> {
    override document = GetReviewsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetMyReviewsDocument = gql`
    query GetMyReviews($userId: String) {
  reviews(userId: $userId) {
    id
    title
    createdAt
    updatedAt
    feature {
      id
      topLeftLat
      topLeftLng
      bottomRightLat
      bottomRightLnt
    }
    estimation {
      id
      road_congestion
      road_quality
      travel_safety
    }
    in_progress
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetMyReviewsGQL extends Apollo.Query<GetMyReviewsQuery, GetMyReviewsQueryVariables> {
    override document = GetMyReviewsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetUsersDocument = gql`
    query GetUsers($first: Int, $after: String) {
  usersWithPagination(first: $first, after: $after) {
    edges {
      node {
        id
        email
        firstname
        lastname
        createdAt
        updatedAt
      }
    }
    pageInfo {
      endCursor
      hasNextPage
    }
    totalCount
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetUsersGQL extends Apollo.Query<GetUsersQuery, GetUsersQueryVariables> {
    override document = GetUsersDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const MeDocument = gql`
    query Me {
  me {
    id
    email
    role
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class MeGQL extends Apollo.Query<MeQuery, MeQueryVariables> {
    override document = MeDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }