export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center text-white mb-16">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
            LedgerPay
          </h1>
          <p className="text-2xl mb-8 text-gray-300">Modern Financial Management for Enterprises</p>
          <p className="text-lg max-w-2xl mx-auto text-gray-400 mb-12">
            Transform your accounting with cloud-based ledger management, real-time transaction processing, and comprehensive financial analytics.
          </p>
          
          <div className="space-x-4">
            <a
              href="/login"
              className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 hover:scale-105"
            >
              Sign In
            </a>
            <a
              href="/register"
              className="inline-block px-8 py-4 bg-transparent border-2 border-white hover:bg-white hover:text-blue-900 text-white font-semibold rounded-lg transition-all duration-300"
            >
              Get Started
            </a>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20 mb-20">
          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-white mb-2">Real-Time Analytics</h3>
            <p className="text-gray-300">Monitor your financial health with live dashboards and insights.</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-bold text-white mb-2">Enterprise Security</h3>
            <p className="text-gray-300">Bank-level encryption and role-based access control for your data.</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold text-white mb-2">Lightning Fast</h3>
            <p className="text-gray-300">Process thousands of transactions per second with microservices architecture.</p>
          </div>
        </div>

        {/* Trusted By Section */}
        <div className="text-center text-white mt-16">
          <p className="text-sm text-gray-400 mb-8">Trusted by leading enterprises</p>
          <div className="grid grid-cols-5 gap-8 opacity-50">
            <div className="bg-white/10 rounded-lg p-4">Company A</div>
            <div className="bg-white/10 rounded-lg p-4">Company B</div>
            <div className="bg-white/10 rounded-lg p-4">Company C</div>
            <div className="bg-white/10 rounded-lg p-4">Company D</div>
            <div className="bg-white/10 rounded-lg p-4">Company E</div>
          </div>
        </div>
      </div>
    </div>
  );
}
