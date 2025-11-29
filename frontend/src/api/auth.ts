import axiosClient from "./axiosClient";

interface LoginCredentials{
    email: string;
    password: string;
}

interface RegisterCredentials extends LoginCredentials {
    name: string;
}

interface RegisterSuccessResponse{
    message: string;
    emailSent: boolean;
}

interface AuthResponse {
    token: string;
    user: {id: string, email: string, name: string};
}

// Llamada al endpoint de login y guardar el token

export const login = async(credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await axiosClient.post<AuthResponse>('/auth/login', credentials)

    //Si el login es existoso se guarda el token en el local storage
    localStorage.setItem('accessToken', response.data.token);
    localStorage.setItem('userId', response.data.user.id);
    localStorage.setItem('name', response.data.user.name);
    localStorage.setItem('userName', response.data.user.name);

    return response.data
};


// Llama al endpoinjt de registro e inicia sesion si es exitoso

export const register = async(credentials: RegisterCredentials): Promise<RegisterSuccessResponse> =>{
    await axiosClient.post('/auth/register', credentials);

    return{
        message: 'Registro exitoso. Revisa tu correo electronico para verificar',
        emailSent: true
    }
};
