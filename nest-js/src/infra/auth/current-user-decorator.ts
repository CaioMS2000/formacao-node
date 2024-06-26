import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { UserPayload } from "./jwt.strategy";

export const CurrentUser = createParamDecorator(
	(_: never, context: ExecutionContext) => {
		const request = context.switchToHttp().getRequest();
		const data = request.user as UserPayload

		return data;
	}
);
