import dotenv from "dotenv";
import * as z from "zod";
dotenv.config();
const envSchema = z.object({
    JWT_SECRET: z.string(),
    REFRESH_SECRET: z.string(),
});
export const env = envSchema.parse(process.env);
//# sourceMappingURL=env.js.map