export interface Usuario {
    id?: string;
    nombre?: string; // si
    nombre_factura?: string; // si
    nit?: string; // si
    correo?: string; // si
    edad?: number;
    fecha_nacimiento?: number | string;
    telefono?: string // si
    creacion?: number;
    sistema?: string;
    version?: string;
    marca?: string;
    ultima_conexion?: number;
    uid?: string;
    proveedor?: string;
    dispositivo?: string;
    password?: string;
    developer?: boolean;
    sexo?: string
}
