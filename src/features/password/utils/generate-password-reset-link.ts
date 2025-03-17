import { getBaseUrl } from "@/utils/url";
import { passwordResetPath } from "@/paths";
import { generateRandomToken, hashToken } from "@/utils/crypto";
import { prisma } from "@/lib/prisma";

const PASSWORD_RESET_TOKEN_LIFETIME_MS = 1000 * 60 * 60 * 2;

export const generatePasswordResetLink = async (userId: string) => {
    await prisma.passwordResetToken.deleteMany({
        where: {
            userId,
        },
    });

    const tokenId = generateRandomToken();
    const tokenHash = hashToken(tokenId);

    await prisma.passwordResetToken.create({
        data: {
            tokenHash,
            userId,
            expiresAt: new Date(Date.now() + PASSWORD_RESET_TOKEN_LIFETIME_MS),
        }
    })

    const pageUrl = getBaseUrl() + passwordResetPath();
    const passwordResetLink = pageUrl + `/${tokenId}`;

    return passwordResetLink;
};