function Verified() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-50">
      <h1 className="text-3xl font-bold mb-4 text-green-700">
        ✅ ¡Cuenta confirmada!
      </h1>
      <p className="text-gray-600 text-center max-w-md mb-6">
        Tu correo fue verificado correctamente. Ahora puedes iniciar sesión en
        tu cuenta.
      </p>
      <a
        href="/login"
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
      >
        Ir al inicio de sesión
      </a>
    </div>
  );
}

export default Verified;
