import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class PermissionsGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    //TODO: Create this Guard
    const request = context.switchToHttp().getRequest<Request>();
    // Aquí puedes acceder al usuario autenticado y a los datos de la solicitud para determinar los permisos
    const user = request.user; // Asumiendo que el usuario está en el objeto de solicitud
    console.log(user)
    
    // Verifica el método HTTP para ajustar la extracción de parámetros según corresponda
    const method = request.method;
    let tableName: string;

    if (method === 'PUT' || method === 'POST') {
      // Para métodos PUT y POST, los parámetros pueden estar en el cuerpo de la solicitud
      // Ajusta la lógica según el formato de los datos en el cuerpo de la solicitud en tu aplicación
      tableName = request.body.tableName;
    } else {
      // Para otros métodos como GET, los parámetros pueden estar en la URL
      tableName = request.params.tableName; // Nombre de la tabla de la solicitud, por ejemplo
    }
    console.log(tableName)
    
    // Realiza la lógica para verificar si el usuario tiene permisos
    // Verifica los permisos según sea necesario
    return true; // O implementa tu lógica de verificación de permisos
  }
}