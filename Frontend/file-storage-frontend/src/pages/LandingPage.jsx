import React from "react";

export default function LandingPage({ onStart }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center px-6 relative overflow-hidden">
            {/* Subtle background accent */}
            <div className="absolute top-20 right-20 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-indigo-100/30 rounded-full blur-3xl"></div>

            <div className="max-w-4xl mx-auto text-center relative z-10">
                {/* Badge with subtle animation */}
                <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-white/60 backdrop-blur-sm rounded-full border border-slate-200/50 shadow-sm hover:shadow-md transition-all duration-300">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-sm font-medium text-slate-700">
                        Powered by AWS
                    </span>
                </div>

                {/* Main Heading */}
                <h1 className="text-6xl sm:text-7xl lg:text-8xl font-semibold text-slate-900 mb-6 tracking-tight leading-none">
                    Secure Cloud
                    <br />
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        File Storage
                    </span>
                </h1>

                {/* Subheading */}
                <p className="text-xl sm:text-2xl text-slate-600 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
                    Upload, download, and manage your files with enterprise-grade security
                </p>

                {/* CTA Button with smooth hover effect */}
                <button
                    onClick={onStart}
                    className="group inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white text-lg font-medium rounded-full hover:bg-slate-800 hover:shadow-xl hover:scale-105 transition-all duration-300 ease-out"
                >
                    Get Started
                    <svg
                        className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                    </svg>
                </button>


            </div>
        </div>
    );
}
