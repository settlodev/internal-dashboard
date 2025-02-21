import { userWithInSession } from "@/lib/actions/user-actions";
import { UserAvatar } from "./avatar";

export  async function Header (){
    const user = await userWithInSession();
    return (
        <header className="flex w-full justify-end items-center p-3 bg-gray-100">
            {user && <UserAvatar user={user}/>}
        </header>
    );
}