import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ticketPath, ticketEditPath } from "@/paths";
import { TICKET_ICONS } from "../constants";
import { LucideArrowUpRightFromSquare, LucideTrash, LucidePencil, LucideMoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { deleteTicket } from "../actions/delete-ticket";
import { toCurrencyFromCent } from "@/utils/currency";
import { TicketMoreMenu } from "./ticket-more-menu";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { TicketWithMetadata } from "../types";
import { getAuth } from "@/features/auth/queries/get-auth";
import { isOwner } from "@/features/auth/utils/is-owner";

type TicketItemProps = {
    ticket: TicketWithMetadata;
    isDetail?: boolean;
};

const TicketItem = async ({ ticket, isDetail }: TicketItemProps) => {
    const { user } = await getAuth();
    const isTicketOwner = isOwner(user, ticket);

    const detailButton = (
        <Button variant="outline" size="icon" asChild>
            <Link prefetch href={ticketPath(ticket.id)}>
                <LucideArrowUpRightFromSquare className="h-4 w-4" />
            </Link>
        </Button>
    );

    const handleDeleteTicket = async () => {
        await deleteTicket(ticket.id);
    };

    const deleteButton = (
        <ConfirmDialog title="Delete Ticket" description="Are you sure you want to delete this ticket?" action={deleteTicket.bind(null, ticket.id)} trigger={<Button variant="outline" size="icon">
            <LucideTrash className="h-4 w-4" />
        </Button>} />
    );

    const editButton = isTicketOwner ? (
        <Button variant="outline" size="icon" asChild>
            <Link prefetch href={ticketEditPath(ticket.id)}>
                <LucidePencil className="h-4 w-4" />
            </Link>
        </Button>
    ) : null;

    const moreMenu = isTicketOwner ? (
        <TicketMoreMenu ticket={ticket} trigger={<Button variant="outline" size="icon"><LucideMoreVertical className="h-4 w-4" /></Button>} />
    ) : null;

    return (
        <div className={clsx("w-full flex gap-x-1", {
            "max-w-[580px]": isDetail,
            "max-w-[420px]": !isDetail
        })}>
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>
                        <span>{TICKET_ICONS[ticket.status]}</span>
                        <span className="truncate">{ticket.title}</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <span className={clsx("whitespace-break-spaces", {
                        "line-clamp-3": !isDetail
                    })}>
                        {ticket.content}
                    </span>
                </CardContent>
                <CardFooter>
                    <p className="text-sm text-muted-foreground">{ticket.deadline} by {ticket.user.username}</p>
                    <p className="text-sm text-muted-foreground">{toCurrencyFromCent(ticket.bounty)}</p>
                </CardFooter>
            </Card>
            <div className="flex flex-col gap-y-1">
                {isDetail ? (
                    <>
                    {editButton}
                    {moreMenu}
                    </>
                ) : (
                    <>
                    {detailButton}
                    {editButton}
                    </>
                )
                }
            </div>
        </div>
    );
};

export { TicketItem };