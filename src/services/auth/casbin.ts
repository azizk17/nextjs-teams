import { Enforcer, newEnforcer } from "casbin";
// import { lucia, validateRequest } from "./lucia-auth";
import { Session, User } from "lucia";
import { DrizzleAdapter } from "casbin-drizzle-adapter"
import { casbinTable } from "@/db/schema";
import db from "@/db";
import path from "path";

export type IAuth = {
    user: User,
    session: Session,
    isAuth: boolean
    roles: string[]
}

let enforcerInstance: Enforcer | null = null;


export const enforcer = async (): Promise<Enforcer> => {
    if (enforcerInstance) {
        return enforcerInstance;
    }

    const dbClient = await DrizzleAdapter.newAdapter(db, casbinTable);
    const rbac_model = path.join(process.cwd(), 'rbac_model.conf')
    enforcerInstance = await newEnforcer(rbac_model, dbClient)
    return enforcerInstance;
}