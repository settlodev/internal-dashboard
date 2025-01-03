import { UserAvatar } from "./avatar";

export function Header (){
    return (
        <header className="flex w-full justify-end items-center p-3 bg-gray-100">
            <UserAvatar />
        </header>
    );
}