import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "@/infra/auth/auth.module";
import { envSchema } from "./env";
import { HTTPModule } from "./http/http.module";

@Module({
	imports: [
		ConfigModule.forRoot({
			validate: (env) => envSchema.parse(env),
			isGlobal: true,
		}),
		AuthModule,
		HTTPModule,
	],
	providers: [],
})
export class AppModule {}
