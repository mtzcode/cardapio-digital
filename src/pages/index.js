import Link from "next/link";

export default function Home() {
  const logoUrl = ""; // Substitua pela URL da logo quando disponível.

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-6 sm:py-12">
      {/* Container principal */}
      <div className="text-center bg-white px-6 py-8 rounded-lg shadow-lg max-w-xs sm:max-w-md">
        {/* Logo da Empresa */}
        {logoUrl ? (
          <img
            src={logoUrl}
            alt="Logo do Restaurante"
            className="w-20 h-20 object-contain mx-auto mb-4"
          />
        ) : (
          <div className="w-20 h-20 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
            {/* Espaço reservado para a logo */}
            <span className="text-gray-400 text-xs">Logo</span>
          </div>
        )}

        {/* Título */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Bem-vindo ao <span className="text-blue-500">Seu Restaurante</span>
        </h1>
        {/* Descrição */}
        <p className="text-gray-600 text-sm sm:text-base mb-6 leading-relaxed">
          Explore nosso cardápio delicioso e peça seus pratos favoritos com
          facilidade. Estamos prontos para atender você!
        </p>
        {/* Botões Rápidos */}
        <div className="flex justify-center gap-2 flex-wrap sm:gap-4">
          <Link
            href="/menu"
            className="bg-blue-500 text-white px-4 py-2 sm:px-5 sm:py-3 rounded-lg text-sm font-medium hover:bg-blue-600 transition"
          >
            Cardápio
          </Link>
          <Link
            href="/about"
            className="bg-gray-500 text-white px-4 py-2 sm:px-5 sm:py-3 rounded-lg text-sm font-medium hover:bg-gray-600 transition"
          >
            Sobre Nós
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-gray-400 text-xs text-center mt-6">
        <p>
          © {new Date().getFullYear()} Seu Restaurante. Todos os direitos
          reservados.
        </p>
        <div className="flex justify-center mt-2 space-x-4">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700"
          >
            Facebook
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-500 hover:text-pink-700"
          >
            Instagram
          </a>
          <a
            href="mailto:contato@seurestaurante.com"
            className="text-gray-500 hover:text-gray-700"
          >
            Contato
          </a>
        </div>
      </footer>
    </div>
  );
}
