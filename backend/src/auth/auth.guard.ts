import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import supabase from "src/infra/supabase.client";

@Injectable()
export class AuthGuard implements CanActivate{
    async canActivate(context: ExecutionContext): Promise<boolean>{
        const request = context.switchToHttp().getRequest();

         // Validar que venga el header Authorization
        const authHeader = request.headers?.authorization;
        if (!authHeader) {
        throw new UnauthorizedException('Falta el encabezado Authorization');
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            throw new UnauthorizedException('Token no proporcionado');
        }
        console.log('Header recibido:', request.headers);
        const {data, error} = await supabase.auth.getUser(token);

        if(error|| !data?.user ) throw new UnauthorizedException('Token invalido o expirado')
        
        request.user = data.user;
        return true;
    }
}