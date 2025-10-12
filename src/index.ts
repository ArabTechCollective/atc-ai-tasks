import { AutoRouter } from "itty-router";
import { insertMemberVectors } from "./vectorize";

const router = AutoRouter();


router.get("/", async (request: Request, env: Env, ctx: ExecutionContext): Promise<Response> => {
    return new Response("Hello, world!");
});

router.post("/vectorize", insertMemberVectors);

router.all("*", () => new Response("Not found", { status: 404 }));

export default {
   ...router,
};
