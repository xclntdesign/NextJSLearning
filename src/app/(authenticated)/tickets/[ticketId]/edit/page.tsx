import { notFound } from "next/navigation";
import { CardCompact } from "@/components/card-compact";
import { TicketUpsertForm } from "@/features/tickets/components/ticket-upsert-form";
import { getTicket } from "@/features/tickets/queries/get-ticket";
import { Separator } from "@/components/ui/separator";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { homePath, ticketPath } from "@/paths";

type TicketEditPageProps = {
    params: Promise<{
        ticketId: string;
    }>;
};

const TicketEditPage = async ({ params }: TicketEditPageProps) => {
    //const { user } = await getAuth();
    const { ticketId } = await params;
    const ticket = await getTicket(ticketId);

    const isTicketFound = !!ticket;
    //const isTicketOwner = isOwner(user, ticket);

    if (!isTicketFound || !ticket.isOwner) {
        notFound();
    }

    return (
        <div className="flex-1 flex flex-col gap-y-8">
            <Breadcrumbs
                breadcrumbs={[
                    {
                        title: "Tickets",
                        href: homePath()
                    },
                    {
                        title: ticket.title,
                        href: ticketPath(ticket.id)
                    },
                    {
                        title: "Edit"
                    }
                ]}
            />

            <Separator />

            <div className="flex-1 flex flex-col justify-center items-center">
                <CardCompact title="Edit Ticket" description="Edit an existing ticket." className="w-full max-w-[420px] animate-fade-from-top" content={<TicketUpsertForm ticket={ticket} />} />
            </div>
        </div>
    );
};

export default TicketEditPage;