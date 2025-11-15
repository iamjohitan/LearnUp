import React, {useState} from 'react';
import { register } from '../api/auth'
import {useAuthMutation} from '../hooks/useAuthMutation'

function RegisterPage(){
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const {isLoading, error, execute} = useAuthMutation(register);
    const [isRegistered, setIsRegistered] = useState(false);

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        try{
            await execute({name, email, password})
            
            setIsRegistered(true);
        }catch (err){
            console.error('Fallo en el registro')
        }
    };
    if (isRegistered) {
    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2>¡Registro Casi Completo!</h2>
            <p>Hemos enviado un correo electrónico a **{email}**. Por favor, haz clic en el enlace de verificación para activar tu cuenta.</p>
            <p>Una vez verificado, puedes volver a esta aplicación e iniciar sesión.</p>
        </div>
    );
}
return (
    <form onSubmit={handleSubmit}>
      <h2>Crear Cuenta</h2>
      
      <input 
        type="text" 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        placeholder="Nombre" 
        required 
      />
      
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        placeholder="Email" 
        required 
      />
      <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        placeholder="Contraseña" 
        required 
      />
      
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Registrando...' : 'Registrarse'}
      </button>
      
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </form>
  );
}

export default RegisterPage;


