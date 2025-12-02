import Link from "next/link";

export default function Unauthorized() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 font-sans transition-colors duration-300
      bg-gradient-to-br from-gray-50 to-gray-100 
      dark:from-slate-900 dark:to-slate-800"
    >
      <div className="max-w-lg w-full">
        <div className="relative">
          {/* Decorative background blobs (Adaptive for both themes) */}
          <div
            className="absolute -top-10 -left-10 w-32 h-32 rounded-full filter blur-xl animate-blob 
            bg-purple-300 opacity-30 mix-blend-multiply 
            dark:bg-purple-500 dark:opacity-20 dark:mix-blend-normal"
          ></div>
          <div
            className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full filter blur-xl animate-blob animation-delay-2000
            bg-indigo-300 opacity-30 mix-blend-multiply 
            dark:bg-indigo-500 dark:opacity-20 dark:mix-blend-normal"
          ></div>

          {/* Main Card */}
          <div
            className="relative backdrop-blur-xl rounded-2xl p-10 text-center shadow-2xl border transition-colors duration-300
            bg-white/60 border-white/50 
            dark:bg-slate-800/50 dark:border-slate-700"
          >
            {/* Icon Circle */}
            <div
              className="mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-6 ring-4 transition-colors duration-300
              bg-indigo-50 ring-white
              dark:bg-slate-700/50 dark:ring-slate-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-indigo-500 dark:text-indigo-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>

            {/* Content Text */}
            <h1
              className="text-3xl font-extrabold mb-2 tracking-tight transition-colors duration-300
              text-gray-900 
              dark:text-white"
            >
              Restricted Access
            </h1>

            <p
              className="mb-8 text-lg transition-colors duration-300
              text-gray-600 
              dark:text-slate-400"
            >
              You do not have permission to view this page. Please contact your
              administrator if you believe this is a mistake.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={"/"}>
                <button className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all transform hover:-translate-y-0.5 shadow-lg shadow-indigo-500/30">
                  Go Home
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Code */}
        <div
          className="text-center mt-6 text-xs uppercase tracking-widest transition-colors duration-300
          text-gray-400 
          dark:text-slate-600"
        >
          Error Code: 403 Forbidden
        </div>
      </div>
    </div>
  );
}
