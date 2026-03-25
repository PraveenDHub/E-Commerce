import crypto from "crypto";

const token = crypto.randomBytes(16).toString("hex");
const token2 = crypto.createHash("sha256").update(token).digest("hex");



console.log(token);
console.log(token2);