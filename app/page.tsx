import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col items-center justify-center p-6">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold text-slate-800 mb-4">Ticket System</h1>
        <p className="text-xl text-slate-600 mb-12">
          Simple support ticket management for everyone.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/submit"
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition duration-200 shadow-lg shadow-blue-200"
          >
            Submit a Ticket
          </Link>
          <Link
            href="/login"
            className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl transition duration-200 shadow-lg border border-slate-200"
          >
            Admin Login
          </Link>
        </div>
      </div>
    </div>
  );
}
