import { Link } from 'react-router-dom';
import "../index.css"

const PageNotFound = () => {
  return (
    <div className="min-h-screen bg-linear-to-b from-blue-900 to-purple-900 flex items-center justify-center px-4 py-12">
      <div className="text-center max-w-2xl">
        <div className="mb-8 animate-bounce-slow">
          <img
            src="https://i.redd.it/hnmq0ai8j6od1.jpeg"
            alt="Sulley looking surprised - Oops!"
            className="mx-auto w-64 sm:w-80 md:w-96 rounded-2xl shadow-2xl border-4 border-purple-500"
          />
        </div>

        {/* Main Title */}
        <h1 className="text-5xl sm:text-7xl font-extrabold text-white tracking-tight mb-4 drop-shadow-lg">
          OOOPS! PAGE NOT FOUND
        </h1>

        {/* Subtitle / Fun message */}
        <p className="text-xl sm:text-2xl text-purple-200 mb-8 max-w-lg mx-auto">
          You must have picked the wrong door... Sulley can't seem to find the page you're looking for!
        </p>

        {/* Extra attraction: small playful hint */}
        <p className="text-lg text-gray-300 mb-10 italic">
          Maybe Mike hid it in the scare floor? 👀
        </p>

        {/* Back to Home Button */}
        <Link
          to="/"
          className="inline-block px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-400"
        >
          BACK TO HOME
        </Link>
      </div>
    </div>
  );
};

export default PageNotFound;