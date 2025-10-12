import { timeStamp } from "console";
import { createHash } from "crypto";

// use FNV-1a hash function for lightweight hashing
function fnv1a(str?: string): number {
    if (str === null || str === undefined) {
        return 0;
    }
    let hash = 0x811c9dc5; // FNV offset basis
    for (let i = 0; i < str.length; i++) {
        hash ^= str.charCodeAt(i);
        hash = Math.imul(hash, 0x01000193) >>> 0; // FNV prime
    }
    return hash;
}
// A single row in the table
export type Member = {
    id: string; // assuming unique identifier
    timestamp: Date; // represents a date/time
    email: string;
    firstName: string;
    lastName: string;
    connection?: string; // could be 'friend', 'colleague', etc.
    school?: string; // optional, not every row may have this
    studentEmail?: string; // optional, specific to students
    currentCompany?: string; // optional
    jobCategory?: string; // optional, e.g., 'Engineering', 'Marketing'
    workEmail?: string; // optional, if employed
    openToMentoring: boolean; // inferred as yes/no
};

// The full table is just an array of rows
export type DataTable = Member[];

export const sanitizeMember = (member: Member): Member => {
    return {
        ...member,
        email: fnv1a(member.email).toString(),
        firstName: fnv1a(member.firstName).toString(),
        lastName: fnv1a(member.lastName).toString(),
        studentEmail: fnv1a(member.studentEmail).toString(),
        workEmail: fnv1a(member.workEmail).toString(),
        connection: fnv1a(member.connection).toString(),
    };
}


export const serializeMember = (member: Member): string => {
    return `member joined ${timeStamp} with connection ${member.connection || 'N/A'}, school ${member.school || 'N/A'}, current company ${member.currentCompany || 'N/A'}, job category ${member.jobCategory || 'N/A'}, open to mentoring: ${member.openToMentoring}`;
}