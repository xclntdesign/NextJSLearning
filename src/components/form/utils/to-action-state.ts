import { UnknownTypedSql } from "@prisma/client/runtime/library";
import { ZodError } from "zod";

export type ActionState <T = any> = {
    status?: "SUCCESS" | "ERROR",
    message: string,
    payload?: FormData,
    fieldErrors: Record<string, string[] | undefined>,
    timestamp: number;
    data?: T;
};

export const EMPTY_ACTION_STATE: ActionState = {
    message: "",
    fieldErrors: {},
    timestamp: Date.now()
};

export const fromErrorToActionState = ( error: unknown, formData?: FormData ): ActionState => {
   if (error instanceof ZodError) {
    return {
        status: "ERROR",
        message: error.errors[0].message,
        payload: formData,
        fieldErrors: error.flatten().fieldErrors,
        timestamp: Date.now()
    }
   } else if (error instanceof Error) {
    return {
        status: "ERROR",
        message: error.message,
        payload: formData,
        fieldErrors: {},
        timestamp: Date.now()
    }
   } else {
    return {
        status: "ERROR",
        message: "An unknown error occurred.",
        payload: formData,
        fieldErrors: {},
        timestamp: Date.now()
    }
   }
};

export const toActionState = ( status: ActionState["status"], message: string, formData?: FormData, data?: unknown ): ActionState => {
    return {
        status,
        message,
        fieldErrors: {},
        payload: formData,
        timestamp: Date.now(),
        data,
    };
};