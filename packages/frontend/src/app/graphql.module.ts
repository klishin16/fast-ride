import {NgModule} from '@angular/core';
import {ApolloModule, APOLLO_OPTIONS} from 'apollo-angular';
import { ApolloClientOptions, ApolloLink, InMemoryCache } from "@apollo/client/core";
import {HttpLink} from 'apollo-angular/http';
import { StorageService } from "./services/storage.service";
import { setContext } from "@apollo/client/link/context";
import {environment} from "../environments/environment";
// import { onError } from "@apollo/client/link/error";

const url = environment.backend_url
console.log('Backend url:', url); // <-- add the URL of the GraphQL server here
export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
  const basic = setContext((operation, context) => ({
    headers: {
      Accept: 'charset=utf-8'
    }
  }));

  const auth = setContext((operation, context) => {
    const token = StorageService.getCookie('accessToken')

    if (token === null) {
      console.log("Token null");
      return {};
    } else {
      return {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      };
    }
  });

  // const errorLink = onError(({ graphQLErrors, networkError }) => {
  //   if (graphQLErrors)
  //     graphQLErrors.map(({ message, locations, path }) =>
  //       console.log(
  //         `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
  //       ),
  //     );
  //   if (networkError) console.log(`[Network error]: ${networkError}`);
  // });

  return {
    link: ApolloLink.from([basic, auth, httpLink.create({uri: url})]),
    cache: new InMemoryCache(),
  };
}

@NgModule({
  exports: [ApolloModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
