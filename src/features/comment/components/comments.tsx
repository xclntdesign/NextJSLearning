"use client";

import { CommentItem } from "./comment-item";
import { CardCompact } from "@/components/card-compact";
import { CommentCreateForm } from "./comment-create-form";
import { CommentDeleteButton } from "./comment-delete-button";
import { CommentWithMetadata } from "../types";
import { Button } from "@/components/ui/button";
import { getComments } from "../queries/get-comments";
import { PaginatedData } from "@/types/pagination";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Skeleton } from "@/components/ui/skeleton";

type CommentsProps = {
    ticketId: string;
    paginatedComments: PaginatedData<CommentWithMetadata>;
};

//const Comments = async ({ ticketId, comments = [] }: CommentsProps) => {
const Comments = ({ ticketId, paginatedComments }: CommentsProps) => {
    const queryKey = ["comments", ticketId];

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: queryKey,
        queryFn: ({ pageParam }) => getComments(ticketId, pageParam),
        initialPageParam: undefined as string | undefined,
        getNextPageParam: (lastPage) => lastPage.metadata.hasNextPage ? lastPage.metadata.cursor : undefined,
        initialData: {
            pages: [
                {
                    list: paginatedComments.list,
                    metadata: paginatedComments.metadata
                },
            ],
            pageParams: [undefined],
        }
    });

    const comments = data.pages.flatMap((page) => page.list);

    const handleMore = () => fetchNextPage();

    const queryClient = useQueryClient();

    const handleCreateComment = () => queryClient.invalidateQueries({ queryKey });

    const handleDeleteComment = () => queryClient.invalidateQueries({ queryKey });

    const { ref, inView } = useInView();

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    },[fetchNextPage, hasNextPage, inView, isFetchingNextPage]);

    return (
        <>
            <CardCompact
                title="Create Comment"
                description="A new comment will be created."
                content={<CommentCreateForm ticketId={ticketId} onCreateComment={handleCreateComment} />}
            />
            
            <div className="flex flex-col gap-y-2 ml-8">
                {comments.map((comment) => (
                    <CommentItem key={comment.id} comment={comment} buttons={[
                        ...(comment.isOwner
                        ? [<CommentDeleteButton key="0" id={comment.id} onDeleteComment={handleDeleteComment} />]
                        : [])
                    ]} />
                ))}

                {isFetchingNextPage && (
                    <>
                        <div className="flex gap-x-2">
                            <Skeleton className="h-[82px] w-full" />
                            <Skeleton className="h-[40px] w-[40px]" />
                        </div>
                        <div className="flex gap-x-2">
                            <Skeleton className="h-[82px] w-full" />
                            <Skeleton className="h-[40px] w-[40px]" />
                        </div>
                    </>
                )}
            </div>

            <div ref={ref}>
                {!hasNextPage && (
                    <p className="text-right text-xs italic">No more comments.</p>
                )}
            </div>

            {hasNextPage && (
                <Button
                    variant="ghost"
                    disabled={isFetchingNextPage}
                >
                    More
                </Button>
            )}
        </>
    );
};

export { Comments };