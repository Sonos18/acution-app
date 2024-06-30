import { readNotification } from "~/service/notification";
import { HandlerFn, customErrorOutput } from "~/utils/createHandler";
import { getIdFromHeader } from "~/utils/validate-request/validate-id-header";

export const handler: HandlerFn = async (event, context, callback) => {
    try {
        const id = getIdFromHeader(event);
        await readNotification(id);
        callback(null, { statusCode: 200, body: JSON.stringify({ message: "Notification read" }) });
    } catch (error) {
        customErrorOutput(error as Error, callback);
    }
}