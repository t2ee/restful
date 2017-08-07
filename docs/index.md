<p align="center">
    <a href="//t2ee.org">
        <img width="200" src="//t2ee.org/img/logos/t2ee.png">
    </a>
</p>
<p align="center">
    <a href="//restful.t2ee.org">
        <img width="200" src="//t2ee.org/img/logos/restful.png">
    </a>
</p>

<p align="center">
    <a href="https://www.npmjs.com/package/@t2ee/restful">
        <img src="https://badge.fury.io/js/%40t2ee%2Frestful.svg">
    </a>
    <a href="https://travis-ci.org/t2ee/restful">
        <img src="https://img.shields.io/travis/t2ee/restful/master.svg?style=flat-square">
    </a>
    <a href="https://coveralls.io/r/t2ee/restful?branch=master">
        <img src="https://img.shields.io/coveralls/t2ee/restful/master.svg?style=flat-square">
    </a>
</p>


# Introduction

This projects aims to be foundation component for the rest of [@t2ee](https://github.com/t2ee) projects. It provides dependency injection and auto configuration functionalities.

# Installation

`npm i reflect-metadata @t2ee/core @t2ee/restful -S`

# Usage

## Basic Example

```typescript
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

## Decorators for function arguments

### @Body

Body to be sent when sending as a JSON request.

### @Path()

Value for parameters in path

### @Field()

A form request field, or multipart request field.

### @Query()

Value in query

### @Part()

Files to be uploaded (either path to file or a buffer) when issuing a multipart request

### @Header()

Vaue in Header

### @FieldMap

An object contains all the form/multipart request fields.

### @QueryMap

An object for query

### @HeaderMap

An object for header

## Decorators for functions

## @GET(), @POST(), @PUT(), @DELETE()

Declare url and http method.

## @Headers()

Provide headers to be sent

## @FormUrlEncoded

An url encoded form request

## @Multipart

A multipart request
