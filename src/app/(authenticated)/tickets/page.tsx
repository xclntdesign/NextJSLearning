import { Heading } from "@/components/heading";
import { Suspense } from "react";
import { TicketList } from "@/features/tickets/components/ticket-list";
import { Spinner } from "@/components/spinner";
import { ErrorBoundary } from "react-error-boundary";
import { Placeholder } from "@/components/placeholder";
import { CardCompact } from "@/components/card-compact";
import { TicketUpsertForm } from "@/features/tickets/components/ticket-upsert-form";
import { getAuth } from "@/features/auth/queries/get-auth";
import { SearchParams } from "@/features/tickets/search-params";

type TicketsPageProps = {
    searchParams: Promise<SearchParams>;
}

const TicketsPage = async ({ searchParams }: TicketsPageProps) => {
    const { user } = await getAuth();

    return (
        <>
            <div className="flex-1 flex flex-col gap-y-8">
                <Heading title="My Tickets" description="All your tickets in one place." />

                <CardCompact title="Create Ticket" description="A new ticket will be created." className="w-full max-w-[420px] self-center" content={<TicketUpsertForm />} />
                
                <ErrorBoundary fallback={<Placeholder label="Something went wrong!" />}>
                    <Suspense fallback={<Spinner />}>
                        <TicketList userId={user?.id} searchParams={await searchParams}/>
                    </Suspense>
                </ErrorBoundary>
            </div>
        </>
    );
}

export default TicketsPage;