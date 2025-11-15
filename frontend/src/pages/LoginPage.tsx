import React, {useState} from 'react';
import {login} from "../api/auth"
import { useAuthMutation } from '../hooks/useAuthMutation';

function LoginPage(){
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const {isLoading, error, execute} = useAuthMutation(login);

    const handleSubmit = async (e: React.FormEvent) =>{
        e.preventDefault()
        try{
            const result= await execute({email, password});
            alert('Login exitoso');
            console.log('Usuario logeado', result.user)
        }catch(err){
            console.error('Fallo en el login: ', error);
        }
    };

    return(
        <form onSubmit={handleSubmit}>
      <h2>Iniciar Sesión</h2>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" required />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Conectando...' : 'Entrar'}
      </button>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </form>
    );
}
export default LoginPage