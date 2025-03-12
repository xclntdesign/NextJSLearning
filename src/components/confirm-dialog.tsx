"use client";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useState, cloneElement, useActionState } from "react";
import { Form } from "./form/form";
import { SubmitButton } from "./form/submit-button";
import { ActionState, EMPTY_ACTION_STATE } from "./form/utils/to-action-state";

type ConfirmDialogProps = {
    title?: string;
    description?: string;
    action: () => Promise<ActionState>;
    trigger: React.ReactElement;
};

const ConfirmDialog = ({ title, description, action, trigger }: ConfirmDialogProps) => {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <form action={action}>
                            <Button type="submit">Confirm</Button>
                        </form>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

type useFormDialogArgs = {
    title?: string;
    description?: string;
    action: (payload: FormData) => void;
    trigger: React.ReactElement;
};

const useConfirmDialog = ({ title = "Are you absolutely sure?", description = "This action cannot be undone. Make sure you understand the consequences.", action, trigger }: useFormDialogArgs) => {
    const [isOpen, setIsOpen] = useState(false);

    const dialogTrigger = cloneElement(trigger, {
        onClick: () => setIsOpen((state) => !state)
    });

    const [actionState, formAction] = useActionState(action, EMPTY_ACTION_STATE);

    const handleSuccess = () => {
        setIsOpen(false);
    };

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
                        <Form action={formAction} actionState={actionState} onSuccess={handleSuccess}>
                            <SubmitButton label="Confirm" />
                        </Form>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );

    return [dialogTrigger, dialog] as const;
};

export { ConfirmDialog };
export { useConfirmDialog };