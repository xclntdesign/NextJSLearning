import { CommentItem } from "./comment-item";
import { CardCompact } from "@/components/card-compact";
import { CommentCreateForm } from "./comment-create-form";
import { CommentDeleteButton } from "./comment-delete-button";
import { getAuth } from "@/features/auth/queries/get-auth";
import { isOwner } from "@/features/auth/utils/is-owner";
import { CommentWithMetadata } from "../types";

type CommentsProps = {
    ticketId: string;
    comments?: CommentWithMetadata[];
};

const Comments = async ({ ticketId, comments = [] }: CommentsProps) => {
    const { user } = await getAuth();

    return (
        <>
            <CardCompact
                title="Create Comment"
                description="A new comment will be created."
                content={<CommentCreateForm ticketId={ticketId} />}
            />
            
            <div className="flex flex-col gap-y-2 ml-8">
                {comments.map((comment) => (
                    <CommentItem key={comment.id} comment={comment} buttons={[
                        ...(isOwner(user, comment)
                        ? [<CommentDeleteButton key="0" id={comment.id} />]
                        : [])
                    ]} />
                ))}
            </div>
        </>
    );
};

export { Comments };