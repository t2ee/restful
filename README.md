# Introduction

This is a `typescript` library for create simple restful services.

You need to also install `reflect-metadata` on your own

# Usage

## Basic Example

```typescript
import {
    GET,
    Path,
    Query,
    RestfulService,
}

interface Repository {
    id: number;
    name: string;
    //...
}

class GithubRepo {
    @GET('/users/{username}/repos')
    listUserRepos(@Path('username') username: string, @Query('type') type): Promise<Repository[]> {return null}
}

const builder = new RestfulService().baseUrl('https://api.github.com/');
const client = builder.create(GithubRepo);

const repos = await client.listUserRepos('t2ee', 'all');

```

## POST Request

```typescript
@POST('/users/new')
createUser(@Body user: User): Promise<User> {return null}
```

## Form Example

```typescript
@FormUrlEncoded
@POST('/users/new')
createUser(@Field('name') name, @Field('age') age): Promise<User> {return null}
```

## Multipart Example

```typescript
@Multipart
@POST('/upload')
upload(@Field('file_name') name: string, @Part('file') file: string | Buffer): Promise<void>;
```

## Static Headers
```typescript
@Headers('Cookie', '123')
@Headers({ 'Cookie': '345' })
get(): Promise<User> {return null}
```

# API

## @GET(), @POST(), @DELETE(), @PUT(), @Multipart, @FormUrlEncoded, @Headers

These decorators can be used on methods only.

## @Param(), @Path(), @Query(), @QueryMap, @Header(), @HeaderMap, @Field(), @FieldMap, @Body

These decorators can be used on method parameters only.
