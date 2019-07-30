const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const PassThrough = require('stream').PassThrough;
// const compose = require('koa-compose');

const devMiddleware = (compiler, opts) => {
  const action = webpackDevMiddleware(compiler, opts);
  return async (ctx, next) => {
    await action(ctx.req, {
      end: (content) => {
        ctx.body = content;
      },
      setHeader: (name, value) => {
        ctx.set(name, value);
      },
    }, next);
  };
};

const hotMiddleware = (compiler, opts) => {
  const action = webpackHotMiddleware(compiler, opts);
  return async (ctx, next) => {
    const stream = new PassThrough();
    ctx.body = stream;
    await action(ctx.req, {
      write: stream.write.bind(stream),
      writeHead: (status, headers) => {
        ctx.status = status;
        ctx.set(headers);
      },
      end: (content) => {
        ctx.body = content;
      },
    }, next);
  };
};

// const koaHotMiddleware = (compiler, opts) => {
//   return compose([
//     devMiddleware(compiler, opts),
//     hotMiddleware(compiler, opts),
//   ]);
// };

module.exports = {
  devMiddleware,
  hotMiddleware,
};
