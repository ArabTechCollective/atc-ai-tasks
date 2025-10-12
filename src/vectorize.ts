import OpenAI from "openai";
import fetch from "node-fetch";
import { Member } from "./controller.types";
import { sanitizeMember, serializeMember } from "./controller.types";
import { Vectorize } from '@cloudflare/workers-types';
import { env } from "cloudflare:workers";

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
const vectorDB = env.VECTORIZE;

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

    res.mutationId && console.log(`Upserted ${vectors.length} vectors with mutation ID: ${res.mutationId}`);
    return res;
}
