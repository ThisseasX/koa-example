const http = require('http');

const noop = () => {};

class Koa {
  constructor() {
    this.middleware = [];
  }

  callback() {
    return (req, res) => {
      const ctx = { req, res, body: '' };

      const middlewareChain = this.middleware.reduceRight(
        (chain, middleware) => middleware.bind(null, ctx, chain),
        noop,
      );

      middlewareChain(ctx);

      res.end(ctx.body);
    };
  }

  use(middleware) {
    this.middleware.push(middleware);
    return this;
  }

  listen(port) {
    return http
      .createServer(this.callback())
      .listen(port);
  }
}

const app = new Koa();

app

  .use((ctx, next) => {
    console.log('Before 1');

    ctx.body = 'Hello ';
    next();

    console.log('After 1');
  })

  .use(ctx => {
    console.log('Before 2');

    ctx.body += 'World!';

    console.log('After 2');
  })

  .listen(4000);
