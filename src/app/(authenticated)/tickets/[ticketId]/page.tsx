import { TicketItem } from "@/features/tickets/components/ticket-item";
import { getTicket } from "@/features/tickets/queries/get-ticket";
import { notFound } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { homePath } from "@/paths";
import { getComments } from "@/features/comment/queries/get-comments";
import { Comments } from "@/features/comment/components/comments";

type TicketPageProps = {
    params: Promise<{
        ticketId: string;
    }>
}

const TicketPage = async ({ params }: TicketPageProps) => {
    const { ticketId } = await params;

    const ticketPromise = getTicket(ticketId);
    const commentsPromise = getComments(ticketId);
    const [ ticket, paginatedComments ] = await Promise.all([
        ticketPromise,
        commentsPromise,
    ]);

    if(!ticket) {
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
                    }
                ]}
            />

            <Separator />
            
            <div className="flex justify-center animate-fade-from-top">
                <TicketItem ticket={ticket} isDetail comments={<Comments ticketId={ticket.id} paginatedComments={paginatedComments} />} />
            </div>
        </div>
    );
}

export default TicketPage;