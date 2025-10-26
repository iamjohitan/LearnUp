function Pending() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4 text-blue-700">
        📧 Verifica tu correo
      </h1>
      <p className="text-gray-600 text-center max-w-md">
        Te enviamos un enlace de confirmación a tu correo institucional. Haz
        clic en el enlace para activar tu cuenta y luego podrás iniciar sesión.
      </p>
    </div>
  );
}

export default Pending;
