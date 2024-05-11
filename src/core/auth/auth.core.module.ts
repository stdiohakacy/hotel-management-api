import { DynamicModule, Module, Provider } from '@nestjs/common';
import { AuthGoogleOAuth2LoginStrategy } from '../../core/auth/guards/google-oauth2/auth.google-oauth2-login.strategy';
import { AuthGoogleOAuth2SignUpStrategy } from '../../core/auth/guards/google-oauth2/auth.google-oauth2-sign-up.strategy';
import { AuthJwtAccessStrategy } from '../../core/auth/guards/jwt-access/auth.jwt-access.strategy';
import { AuthJwtRefreshStrategy } from '../../core/auth/guards/jwt-refresh/auth.jwt-refresh.strategy';
import { AuthService } from '../../core/auth/services/auth.service';

@Module({
    providers: [AuthService],
    exports: [AuthService],
    controllers: [],
    imports: [],
})
export class AuthCoreModule {
    static forRoot(): DynamicModule {
        const providers: Provider<any>[] = [
            AuthJwtAccessStrategy,
            AuthJwtRefreshStrategy,
        ];

        if (
            process.env.SSO_GOOGLE_CLIENT_ID &&
            process.env.SSO_GOOGLE_CLIENT_SECRET
        ) {
            providers.push(AuthGoogleOAuth2LoginStrategy);
            providers.push(AuthGoogleOAuth2SignUpStrategy);
        }

        return {
            module: AuthCoreModule,
            providers,
            exports: [],
            controllers: [],
            imports: [],
        };
    }
}
