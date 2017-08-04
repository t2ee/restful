<p align="center">
    <a href="https://t2ee.org">
        <img width="200" src="https://t2ee.org/img/logos/t2ee.png">
    </a>
</p>
<p align="center">
    <a href="https://restful.t2ee.org">
        <img width="200" src="https://t2ee.org/img/logos/restful.png">
    </a>
</p>

<p align="center">
    <a href="https://travis-ci.org/t2ee/restful">
        <img src="https://img.shields.io/travis/t2ee/restful/master.svg?style=flat-square">
    </a>
    <a href="https://coveralls.io/r/t2ee/restful?branch=master">
        <img src="https://img.shields.io/coveralls/t2ee/restful/master.svg?style=flat-square">
    </a>
</p>

# Introduction

`@t2ee/restful` allows you to write restful clients that have verbal meanings, easy to read and easy to code.

For detailed introduction and examples, please visit [core.t2ee.org](//core.t2ee.org).

# Installation

`npm i reflect-metadata @t2ee/core @t2ee/restful -S`

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
