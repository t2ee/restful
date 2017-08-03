import 'reflect-metadata';
import {
    Body,
    DELETE,
    POST,
    GET,
    PUT,
    Field,
    FieldMap,
    Header,
    HeaderMap,
    Headers,
    FormUrlEncoded,
    Multipart,
    Param,
    Part,
    Path,
    Query,
    QueryMap,
    RestfulClient,
    RestfulService,
} from './';
import test from 'ava';
import Koa = require('koa');
import koaBody = require('koa-body');

const app = new Koa();
app.use(koaBody({ multipart: true }));
app.use(async (context, next) => {
    context.body = {
        headers: context.headers,
        body: context.request.body.fields || context.request.body,
        method: context.method,
        path: context.path,
        query: context.query,
    };
    context.status = 200;
    next();
});
app.listen(5000);

const builder = new RestfulService()
    .baseUrl('http://localhost:5000');

interface Response {
    headers: {[key: string]: string};
    body: any;
    method: string;
    path: string;
    query: {[key: string]: string};
}

test('GET Request test', async t => {
    const builder = new RestfulService()
        .baseUrl('http://localhost:5000')
        .query('queryA', 'a')
        .query({
            'queryB': 'b',
            'queryC': 'c',
        })
        .header('headera', 'a')
        .headers({
            'headerb': 'b',
            'headerc': 'c',
        })
        .param('paramA', 'a')
        .params({
            'paramB': 'b',
            'paramC': 'c',
        });
    class Client {
        @GET('/api/{paramA}/{paramB}/{paramC}/{paramD}')
        test(@Query('queryD') queryD: string, @Header('headerd') headerD: string, @Path('paramD') paramD: string): Promise<Response> { return null;}
    }
    const client = builder.create(Client);
    const res = await client.test('d', 'd', 'd');
    t.is(res.path, '/api/a/b/c/d');
    t.is(res.method, 'GET');
    t.is(res.headers['headera'], 'a');
    t.is(res.headers['headerb'], 'b');
    t.is(res.headers['headerc'], 'c');
    t.is(res.headers['headerd'], 'd');
    t.deepEqual(res.query, {
        'queryA': 'a',
        'queryB': 'b',
        'queryC': 'c',
        'queryD': 'd',
    });
});

test('POST json', async t => {
    class Client {
        @POST('/api')
        test(@Body body): Promise<Response> { return null;}
    }
    const client = builder.create(Client);
    const res = await client.test({ hello: 'world' });
    t.deepEqual(res.body, {
        hello: 'world',
    })
});

test('POST form 1', async t => {
    class Client {
        @FormUrlEncoded
        @POST('/api')
        test(@Field('hello') hello: string): Promise<Response> { return null;}
    }
    const client = builder.create(Client);
    const res = await client.test('world');
    t.deepEqual(res.body, {
        hello: 'world',
    })
});

test('POST form 2', async t => {
    class Client {
        @FormUrlEncoded
        @POST('/api')
        test(@FieldMap map): Promise<Response> { return null;}
    }
    const client = builder.create(Client);
    const res = await client.test({'hello': 'world'});
    t.deepEqual(res.body, {
        hello: 'world',
    });
    t.is(res.headers['content-type'], 'application/x-www-form-urlencoded')
});

test('POST multi part', async t => {
    class Client {
        @Multipart
        @POST('/api')
        test(@Field('hello') hello: string, @Part('file') file: Buffer): Promise<Response> { return null;}
    }
    const client = builder.create(Client);
    const res = await client.test('world', new Buffer('test'));
    t.deepEqual(res.body, {
        hello: 'world',
        file: 'test',
    })
    t.true(res.headers['content-type'].indexOf('multipart/form-data') !== -1);
});

test('DELETE', async t => {
    class Client {
        @DELETE('/api')
        test(): Promise<Response> { return null;}
    }
    const client = builder.create(Client);
    const res = await client.test();
    t.is(res.method, 'DELETE')
});

test('PUT', async t => {
    class Client {
        @PUT('/api')
        test(@Body body): Promise<Response> { return null;}
    }
    const client = builder.create(Client);
    const res = await client.test({ hello: 'world' });
    t.deepEqual(res.body, {
        hello: 'world',
    })
    t.is(res.method, 'PUT')
});

test('composite params', async t => {
    class Client {
        @Headers({
            'a': 'a',
        })
        @GET('/api')
        test(@QueryMap queryMap, @HeaderMap headerMap): Promise<Response> { return null;}
    }
    const client = builder.create(Client);
    const res = await client.test(
        {a : 'a'},
        {b : 'b'},
    );
    t.is(res.path, '/api');
    t.is(res.method, 'GET');
    t.is(res.headers['a'], 'a');
    t.is(res.headers['b'], 'b');
    t.deepEqual(res.query, {
        a: 'a',
    });
});

