const http = require('http');

class Koa {
  constructor() {
    this.middleWare = [];

    this.context = (req, res) => ({
      req,
      res,
    });
  }

  use(middleWare) {
    this.middleWare.push(middleWare);
    return this;
  }

  callback() {
    return (req, res) => {
      const ctx = this.context(req, res);
      this.middleWare.forEach(middleWare => {
        middleWare(ctx);
      });
      res.end(ctx.body);
    };
  }

  listen(port) {
    http.createServer(this.callback()).listen(port);
  }
}

const app = new Koa();

app
  .use(ctx => {
    ctx.body = 'Hello';
  })
  .use(ctx => {
    ctx.body += ' World';
  })
  .listen(4000);
