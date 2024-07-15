// auth/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Role } from "../enum/role.enum";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(" ")[1];
    if (!token) {
      return false;
    }

    try {
      const decoded: any = this.jwtService.verify(token);
      request.user = decoded;
      return this.checkUserRole(decoded.role, request.route.path);
    } catch {
      return false;
    }
  }

  private checkUserRole(userRole: Role, routePath: string): boolean {
    // Define the role permissions for each route
    const routePermissions = {
      "/app/admin": [Role.ADMIN],
      "/app/solicitante": [Role.SOLICITANTE, Role.ADMIN],
    };

    const allowedRoles = routePermissions[routePath];
    return allowedRoles ? allowedRoles.includes(userRole) : false;
  }
}
