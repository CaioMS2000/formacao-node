import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "@/infra/auth/auth.module";
import { envSchema } from "./env/env";
import { HTTPModule } from "./http/http.module";
import { EnvModule } from "./env/env.module";
import { EventsModle } from "./events/events.module";

@Module({
	imports: [
		ConfigModule.forRoot({
			validate: (env) => envSchema.parse(env),
			isGlobal: true,
		}),
		AuthModule,
		HTTPModule,
		EnvModule,
		EventsModle,
	],
	providers: [],
})
export class AppModule {}
