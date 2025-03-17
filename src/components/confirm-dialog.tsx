"use client";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useState, useActionState, useEffect, useRef } from "react";
import { ActionState, EMPTY_ACTION_STATE } from "./form/utils/to-action-state";
import { Button } from "@/components/ui/button";
import { useActionFeedback } from "./form/hooks/use-action-feedback";
import { toast } from "sonner";

type useConfirmDialogArgs = {
    title?: string;
    description?: string;
    action: () => Promise<ActionState>;
    trigger: React.ReactElement | ((isLoading: boolean) => React.ReactElement);
    onSuccess?: (actionState: ActionState) => void;
};

const useConfirmDialog = ({ title = "Are you absolutely sure?", description = "This action cannot be undone. Make sure you understand the consequences.", action, trigger, onSuccess }: useConfirmDialogArgs) => {
    const [isOpen, setIsOpen] = useState(false);

    const [actionState, formAction, isPending] = useActionState(action, EMPTY_ACTION_STATE);

    const dialogTrigger = () => setIsOpen((state) => !state);

    const toastRef = useRef<string | number | null>(null);

    useEffect(() => {
        if (isPending) {
            toastRef.current = toast.loading("Deleting...");
        } else {
            toast.dismiss(toastRef.current);
        }

        return () => {
            if (toastRef.current) {
                toast.dismiss(toastRef.current);
            }
        };
    }, [isPending]);

    useActionFeedback(actionState, {
        onSuccess: ({ actionState }) => {
            if (actionState.message) {
                toast.success(actionState.message);
            }

            onSuccess?.(actionState);
        },
        onError: ({ actionState }) => {
            if (actionState.message) {
                toast.error(actionState.message);
            }
        },
    });

    const dialog = (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction asChild>
                       <form action={formAction}>
                        <Button type="submit">Confirm</Button>
                        </form>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );

    return [dialogTrigger, dialog] as const;
};

export { useConfirmDialog };