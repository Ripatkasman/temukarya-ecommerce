import { route } from "@/lib/api";
import * as buyer from "@/lib/services/buyer";

/** PATCH /api/profile/password { currentPassword, newPassword, confirmPassword } (buyer). */
export const PATCH = route({ roles: ["buyer"], body: true }, async ({ me, fd }) => buyer.changePassword(me, fd));
