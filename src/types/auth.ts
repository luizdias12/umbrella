// types/auth.ts

export interface UsuarioLDAP {
  uid: string;
  nome: string;
  email: string;
  grupos: string[];
  logadoEm: string;
  chapa?: string;
  funcao?: string;
  secao?: string;
  cpf?: string;
}

export interface LoginResponse {
  status: number;
  message: string;
  token: string;
  usuario: {
    uid: string;
    nome: string;
    email: string;
    grupos: string | string[]; // Suporta string única ou array vindo do LDAP
  };
  funcionario?: {
    CHAPA: string;
    FUNCAO: string;
    SECAO: string;
    CPF: string;
  };
}

export interface AuthContextData {
  logado: boolean;
  usuario: UsuarioLDAP | null;
  loading: boolean;
  iniciarSessao: (respostaApi: LoginResponse) => Promise<void>;
  encerrarSessao: () => Promise<void>;
}