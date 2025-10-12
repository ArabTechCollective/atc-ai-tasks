import OpenAI from "openai";
import fetch from "node-fetch";
import { Member } from "./controller.types";
import { sanitizeMember, serializeMember } from "./controller.types";
import { Vectorize } from '@cloudflare/workers-types';
import { env as cloudflareEnv } from "cloudflare:workers";

const openai = new OpenAI({ apiKey: cloudflareEnv.OPENAI_API_KEY });
const vectorDB = cloudflareEnv.VECTORIZE;

export async function insertMemberVectors(members: Member[]) {
    const serializedMembers = members.map(member => serializeMember(sanitizeMember(member)));
    const embedding = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: serializedMembers,
    });


    if (serializedMembers.length !== embedding.data.length) {
        throw new Error("Mismatch between number of members and embeddings");
    }

    // the members array and the embeddings array should be in the same order
    const vectors = serializedMembers.map((member, index) => ({
        id: members[index].id,
        values: embedding.data[index].embedding,
    }));

    const res = await vectorDB.upsert(vectors);

    console.log(`Upserted ${res.count} vectors`);
    console.log(`Upserted ids: ${res.ids}`);
    return res;
}
