import { ResetPasswordForm } from "@/components/forms/reset_password_form"

function ResetPasswordPage() {
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <ResetPasswordForm />
            </div>
        </div>
    )
}

export default ResetPasswordPage