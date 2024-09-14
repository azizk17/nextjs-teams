import { PasswordResetForm } from "../_forms";

export default function Page({ searchParams }: { searchParams: { key: string } }) {

    // TODO: check if token is valid
    // TODO: if token is valid, show the form
    // TODO: if token is invalid, show the error
    if (searchParams.key) { }
    return <div className=" flex items-center justify-center h-screen">
        <PasswordResetForm tokenKey={searchParams.key} />
    </div>
}

