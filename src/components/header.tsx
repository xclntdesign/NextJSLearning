"use client";

import Link from "next/link";
import { homePath, ticketsPath, signUpPath, signInPath } from "@/paths";
import { LucideKanban, LucideLogOut } from "lucide-react";
import { buttonVariants } from "./ui/button";
import { ThemeSwitcher } from "./theme/theme-switcher";
import { signOut } from "@/features/auth/actions/sign-out";
import { SubmitButton } from "./form/submit-button";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { AccountDropdown } from "./account-dropdown";

const Header = () => {
    const { user, isFetched } = useAuth();

    if (!isFetched) {
        return null;
    }

    const navItems = user ? (
        <AccountDropdown user={user} />
    ) : (
        <>
            <Link href={signUpPath()} className={buttonVariants({ variant: "outline" })}>
                Sign Up
            </Link>
            <Link href={signInPath()} className={buttonVariants({ variant: "default" })}>
                Sign In
            </Link>
        </>
    );

    return (
        <nav className="support-backdrop-blur:bg-background/60 fixed left-0 right-0 top-0 z-20 border-b bg-background/95 backdrop-blur w-full flex py-2.5 px-5 justify-between animate-header-from-top">
            <div className="flex items-center gap-x-2">
                <Link href={homePath()} className={buttonVariants({ variant: "ghost" })}>
                    <LucideKanban />
                    <h1 className="text-lg font-semibold">TicketBounty</h1>
                </Link>
            </div>
            <div className="flex items-center gap-x-2">
                <ThemeSwitcher />
                {navItems}
            </div>
        </nav>
    );
};

export { Header };