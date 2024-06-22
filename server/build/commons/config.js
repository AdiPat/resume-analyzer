import dotenv from "dotenv";
// Load environment variables based on NODE_ENV
if (process.env.NODE_ENV === "production") {
    dotenv.config({ path: ".env" });
}
else {
    dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
}
