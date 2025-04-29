export interface User {
    id_usuario: number;
    nombre: string;
    apellido: string;
    email: string;
    pass: string;
    fono: string;
  }
  
  export interface UserLoginRequest {
    email: string;
    pass: string;
  }
  
  export interface UserRegisterRequest {
    nombre: string;
    apellido: string;
    email: string;
    pass: string;
    fono: string;
  }