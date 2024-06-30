import { ObjectSchema, object, string } from "yup";
import { extractPathParamsFromRequest } from "./validate-params";
import { APIGatewayProxyEvent } from "aws-lambda";

export const getIdFromHeader = (event: APIGatewayProxyEvent) => {
    const { id } = extractPathParamsFromRequest({ event, schema: getIdSchema });
    return id;
};

const getIdSchema: ObjectSchema<{ id: string }> = object({
	id: string().required()
});