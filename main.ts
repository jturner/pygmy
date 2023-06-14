import {
  Application,
  Context,
  helpers,
  Router,
} from "https://deno.land/x/oak@v12.5.0/mod.ts";
import moment from "https://deno.land/x/momentjs@2.29.1-deno/mod.ts";
import {
  deleteUrlByShort,
  getAllUrls,
  getUrlByShort,
  upsertUrl,
} from "./db.ts";

const { getQuery } = helpers;
const router = new Router();

router
  .get("/urls", async (ctx: Context) => {
    ctx.response.body = await getAllUrls();
  })
  .get("/urls/:short", async (ctx: Context) => {
    const { short } = getQuery(ctx, { mergeParams: true });
    const url = await getUrlByShort(short);

    if (url) {
      if (url.expiry > moment().format("YYYY-MM-DD")) {
        ctx.response.redirect(url.url);
      } else {
        ctx.response.body = "Link Expired";
      }
    } else {
      ctx.response.status = 404;
      ctx.response.body = "404";
    }
  })
  .post("/urls", async (ctx: Context) => {
    const body = ctx.request.body();
    const url = await body.value;
    ctx.response.body = await upsertUrl(url);
  })
  .delete("/urls/:short", async (ctx: Context) => {
    const { short } = getQuery(ctx, { mergeParams: true });
    await deleteUrlByShort(short);
  });

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8080 });
