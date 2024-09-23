import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-500 to-purple-500 text-white text-center p-6 md:p-12 lg:p-24">
      <div className="max-w-md sm:max-w-lg md:max-w-2xl">
        <h1 className="text-8xl sm:text-9xl md:text-[10rem] font-bold mb-4 text-shadow-lg">404</h1>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold mb-8 text-shadow-md">
          Page Not Found
        </h2>
        <p className="text-lg sm:text-xl md:text-2xl mb-12 text-shadow-md">
          Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <Link href="/" passHref>
          <a className="bg-white hover:bg-gray-200 text-blue-600 font-semibold py-3 px-6 rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50 inline-block text-lg sm:text-xl md:text-2xl">
            Back to Home
          </a>
        </Link>
      </div>
    </div>
  );
}