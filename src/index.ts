import { Router } from "itty-router";
import { validateMemberTable } from "./controller.validators";
import { insertMemberVectors } from "./vectorize";

const router = Router();

router.get("/", () => {
    return new Response("Hello, world!");
});

router.post("/vectorize", insertMemberVectors);

router.all("*", () => new Response("Not found", { status: 404 }));

export default {
    fetch: (request: Request, env: Env, ctx: ExecutionContext) => router.handle(request, env, ctx),
};