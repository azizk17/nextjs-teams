import { validateRequest } from "./lucia-auth"
import { NextRequest, NextResponse } from "next/server"

export async function authGuard(
    req: NextRequest,
    resource: string,
    action: string
) {
    const { user, session } = await validateRequest()

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // const e = await enforcer()
    // const canAccess = await e.enforce(`user:${user.id}`, resource, action)

    // if (!canAccess) {
    //     return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    // }

    return { user, session }
}