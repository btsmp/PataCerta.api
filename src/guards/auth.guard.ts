import { JwtService } from '@nestjs/jwt';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);
  constructor(private readonly jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    this.logger.debug(`Request path: ${request.path}`);
    this.logger.debug(`Request cookies: ${JSON.stringify(request.cookies)}`);
    this.logger.debug(`Cookie header: ${request.headers.cookie}`);

    const token = this.extractTokenFromCookie(request);
    this.logger.debug(
      `Extracted token: ${token ? token.substring(0, 15) + '...' : 'null'}`,
    );

    if (!token) {
      this.logger.error('Authentication failed: Token is missing');
      throw new UnauthorizedException('Token is missing');
    }

    try {
      this.logger.debug(
        `JWT Secret length: ${
          process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 0
        } characters`,
      );
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      this.logger.debug(
        `JWT verified successfully: ${JSON.stringify(payload)}`,
      );
      request['user'] = payload;
    } catch (error) {
      this.logger.error(`JWT verification failed: ${error.message}`);
      this.logger.debug(
        `JWT verification error details: ${JSON.stringify(error)}`,
      );
      throw new UnauthorizedException('Token invalid');
    }

    return true;
  }

  private extractTokenFromCookie(request: any): string | null {
    const cookies = request.cookies;
    const cookieHeader = request.headers.cookie;

    this.logger.debug(`Cookies object: ${JSON.stringify(cookies)}`);
    this.logger.debug(`Cookie header: ${cookieHeader}`);

    // Try to extract from the cookies object first
    let token = this.extractTokenFromCookies(cookies);

    // If no token found and we have a cookie header, try that instead
    if (!token && cookieHeader) {
      this.logger.debug(`No token in cookies object, trying cookie header`);
      token = this.extractTokenFromCookies(cookieHeader);
    }

    this.logger.debug(
      `Extracted token result: ${token ? 'found' : 'not found'}`,
    );
    return token || null;
  }

  private extractTokenFromCookies(
    cookies: string | Record<string, any>,
  ): string | undefined {
    this.logger.debug(`Extracting token from cookies type: ${typeof cookies}`);

    // Handle case when cookies is an object (from cookie-parser middleware)
    if (cookies && typeof cookies === 'object') {
      this.logger.debug(
        `Cookies object keys: ${Object.keys(cookies).join(', ')}`,
      );
      const token = cookies.access_token;
      this.logger.debug(
        `Token from cookies object: ${token ? 'found' : 'not found'}`,
      );
      return token;
    }

    // Handle case when cookies is a string (raw Cookie header)
    if (cookies && typeof cookies === 'string') {
      this.logger.debug(`Raw cookies string: ${cookies}`);
      const cookieArray = cookies.split(';');
      this.logger.debug(`Cookie array: ${JSON.stringify(cookieArray)}`);

      const accessTokenCookie = cookieArray.find((cookie) =>
        cookie.trim().startsWith('access_token='),
      );

      this.logger.debug(
        `Access token cookie: ${accessTokenCookie || 'not found'}`,
      );

      if (accessTokenCookie) {
        const token = accessTokenCookie.split('=')[1];
        this.logger.debug(
          `Extracted token from string: ${
            token ? token.substring(0, 15) + '...' : 'undefined'
          }`,
        );
        return token;
      }

      return undefined;
    }

    this.logger.debug('No valid cookies found');
    return undefined;
  }
}
