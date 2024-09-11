import { OAuth2RequestError, Google } from "arctic";
import env from "@/env";


const redirectUri = `${env.APP_URL}/api/connect/youtube/callback`;


export const google = new Google(env.GOOGLE_CLIENT_ID, env.GOOGLE_CLIENT_SECRET, redirectUri);

