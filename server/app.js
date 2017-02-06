const path = require('path');
const fs = require('fs');
const koa = require('koa');
const serve = require('koa-static');
const body = require('koa-better-body');
const md5 = require("./md5");

const TOKEN ;
const PORT ;

let app = new koa();

app.use(serve(path.join('..' + '/web')));
app.use(body())
app.use(async (ctx, next) => {
    let date = new Date();
    console.log(date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + '\t' + ctx.path + '\t' + ctx.request.method);
    if (ctx.path === '/data') {
        if (ctx.request.method === 'GET') {
            ctx.response.body = fs.readFileSync('data.json').toString();
        } else if (ctx.request.method === 'POST') {
            if (md5(TOKEN + date.getUTCDate() + date.getUTCHours() + date.getUTCMinutes() === ctx.request.fields.md5)) {
                console.log(ctx.request.fields)
                ctx.response.status = 200;
                let data = ctx.request.fields.data;
                try {
                    fs.writeFileSync('data.json', data);
                    console.log('data.json rewrited.')
                } catch (error) {
                    console.log(err);
                }

            }
        }
    }
})

app.listen(PORT);