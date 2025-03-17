"use server";

import { z } from "zod";
import {
  ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import { generatePasswordResetLink } from "../utils/generate-password-reset-link";
import { getAuthOrRedirect } from "@/features/auth/queries/get-auth-or-redirect";
import { verifyPasswordHash } from "@/features/password/utils/hash-and-verify";

const passwordChangeSchema = z.object({
    password: z.string().min(6).max(191),
});

export const passwordChange = async (_actionState: ActionState, formData: FormData) => {

    const auth = await getAuthOrRedirect();

    try {
        const { password } = passwordChangeSchema.parse({
            password: formData.get("password"),
        });

        const validPassword = await verifyPasswordHash(auth.user.passwordHash, password);

        if (!validPassword) {
            return toActionState("ERROR", "Incorrect password.", formData);
        }

        const passwordResetLink = await generatePasswordResetLink(auth.user.id);

        console.log(passwordResetLink);
    } catch (error) {
        return fromErrorToActionState(error, formData);
    }

    return toActionState("SUCCESS", "Check your email for a reset link.");
};