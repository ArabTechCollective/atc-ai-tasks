import { z } from "zod";

// 1️⃣ Define Zod schema matching your Member type
export const MemberSchema = z.object({
    id: z.string(),
    timestamp: z.preprocess(
        (arg) => {
            // convert string to Date if needed
            if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
        },
        z.instanceof(Date)
    ),
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    connection: z.string(),
    school: z.string().optional(),
    studentEmail: z.string().email().optional(),
    currentCompany: z.string().optional(),
    jobCategory: z.string().optional(),
    workEmail: z.string().email().optional(),
    openToMentoring: z.boolean(),
});

// 2️⃣ Schema for a table (array of rows)
export const MemberTableSchema = z.array(MemberSchema);

// 3️⃣ Type inference (optional)
export type Member = z.infer<typeof MemberSchema>;
export type MemberTable = z.infer<typeof MemberTableSchema>;

// 4️⃣ Validation function
export function validateMemberTable(input: unknown): MemberTable {
    return MemberTableSchema.parse(input); // throws if invalid
}