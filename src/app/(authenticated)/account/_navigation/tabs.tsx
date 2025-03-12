"use client";

import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { accountPasswordPath, accountProfilePath } from "@/paths";
import { usePathname } from "next/navigation";

const AccountTabs = () => {
    const pathName = usePathname();

    return (
        <Tabs value={pathName.split("/").at(-1)}>
            <TabsList>
                <TabsTrigger value="profile" asChild>
                    <Link href={accountProfilePath()}>
                        Profile
                    </Link>
                </TabsTrigger>
                <TabsTrigger value="password" asChild>
                    <Link href={accountPasswordPath()}>
                        Password
                    </Link>
                </TabsTrigger>
            </TabsList>
        </Tabs>
    );
};

export { AccountTabs };