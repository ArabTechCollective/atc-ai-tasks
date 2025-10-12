import { Router } from "itty-router";
import { validateMemberTable } from "./controller.validators";

const router = Router();

router.get("/", () => {
    return new Response("Hello, world!");
});

router.post("/vectorize", async (req: Request) => {
    const reqMembers = await req.json();
    const url = new URL(req.url);
    const table_type = url.searchParams.get('table_type');
    if (table_type === 'member') {
        const members = validateMemberTable(reqMembers);
        
    }
    
    return Response.json({ received: data });
});

router.all("*", () => new Response("Not found", { status: 404 }));

export default {
    fetch: (request: Request, env: Env, ctx: ExecutionContext) => router.handle(request, env, ctx),
};