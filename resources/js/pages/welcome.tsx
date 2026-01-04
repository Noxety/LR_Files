import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>

            {/* Navigation */}
            <header className="mb-8 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-7xl mx-auto px-4 lg:px-8">
                <nav className="flex items-center justify-end gap-4 py-6">
                    {auth.user ? (
                        <Link
                            href={route('dashboard')}
                            className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b] transition-colors"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                href={route('login')}
                                className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A] transition-colors"
                            >
                                Log in
                            </Link>
                            <Link
                                href={route('register')}
                                className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b] transition-colors bg-gradient-to-r from-[#f8f7f5] to-[#f5f4f2] dark:from-[#2a2a28] dark:to-[#252524]"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </nav>
            </header>

            {/* Hero Section */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center mb-20">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium text-[#1b1b18] dark:text-[#EDEDEC] leading-tight mb-6">
                        Welcome to
                        <span className="block bg-gradient-to-r from-[#191400] to-[#4a4100] bg-clip-text text-transparent dark:from-[#EDEDEC] dark:to-[#A8A19F]">
                            Your App
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl text-[#4a4a47] dark:text-[#A8A19F] max-w-2xl mx-auto mb-10 leading-relaxed">
                        Build amazing applications with speed and simplicity. Get started in minutes with our modern stack.
                    </p>
                    {!auth.user && (
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link
                                href={route('register')}
                                className="inline-flex items-center px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-[#191400] to-[#4a4100] hover:from-[#191400]/90 hover:to-[#4a4100]/90 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                            >
                                Get Started Free
                            </Link>
                            <Link
                                href={route('login')}
                                className="inline-flex items-center px-8 py-4 text-lg font-medium text-[#1b1b18] border-2 border-[#19140035] hover:border-[#1915014a] rounded-xl hover:bg-[#f8f7f5] dark:text-[#EDEDEC] dark:border-[#3E3E3A] dark:hover:border-[#62605b] dark:hover:bg-[#2a2a28] transition-all duration-300"
                            >
                                View Demo
                            </Link>
                        </div>
                    )}
                </div>

                {/* Features */}
                <section className="grid md:grid-cols-3 gap-8 mb-24">
                    <div className="text-center p-8 rounded-2xl border border-[#19140010] hover:border-[#19140035] dark:border-[#3E3E3A]/50 hover:dark:border-[#62605b]/50 transition-all duration-300 hover:shadow-lg bg-gradient-to-br from-white/80 to-[#f8f7f5]/80 dark:from-[#1f1f1d]/80 dark:to-[#2a2a28]/80 backdrop-blur-sm">
                        <div className="w-16 h-16 bg-gradient-to-r from-[#191400] to-[#4a4100] rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-[#1b1b18] dark:text-[#EDEDEC] mb-4">Lightning Fast</h3>
                        <p className="text-[#4a4a47] dark:text-[#A8A19F]">
                            Built with modern React and Inertia.js for incredible performance and developer experience.
                        </p>
                    </div>

                    <div className="text-center p-8 rounded-2xl border border-[#19140010] hover:border-[#19140035] dark:border-[#3E3E3A]/50 hover:dark:border-[#62605b]/50 transition-all duration-300 hover:shadow-lg bg-gradient-to-br from-white/80 to-[#f8f7f5]/80 dark:from-[#1f1f1d]/80 dark:to-[#2a2a28]/80 backdrop-blur-sm">
                        <div className="w-16 h-16 bg-gradient-to-r from-[#191400] to-[#4a4100] rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-[#1b1b18] dark:text-[#EDEDEC] mb-4">Simple Setup</h3>
                        <p className="text-[#4a4a47] dark:text-[#A8A19F]">
                            Get started immediately with our battle-tested authentication and scaffolding.
                        </p>
                    </div>

                    <div className="text-center p-8 rounded-2xl border border-[#19140010] hover:border-[#19140035] dark:border-[#3E3E3A]/50 hover:dark:border-[#62605b]/50 transition-all duration-300 hover:shadow-lg bg-gradient-to-br from-white/80 to-[#f8f7f5]/80 dark:from-[#1f1f1d]/80 dark:to-[#2a2a28]/80 backdrop-blur-sm">
                        <div className="w-16 h-16 bg-gradient-to-r from-[#191400] to-[#4a4100] rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-[#1b1b18] dark:text-[#EDEDEC] mb-4">Beautiful Design</h3>
                        <p className="text-[#4a4a47] dark:text-[#A8A19F]">
                            Modern, accessible design system that looks great on every device and screen size.
                        </p>
                    </div>
                </section>

                {/* CTA Section */}
                {!auth.user && (
                    <div className="text-center py-20 bg-gradient-to-r from-[#f8f7f5]/50 to-[#f5f4f2]/50 dark:from-[#2a2a28]/50 dark:to-[#252524]/50 rounded-3xl backdrop-blur-sm">
                        <h2 className="text-3xl md:text-4xl font-semibold text-[#1b1b18] dark:text-[#EDEDEC] mb-6">
                            Ready to get started?
                        </h2>
                        <p className="text-xl text-[#4a4a47] dark:text-[#A8A19F] mb-10 max-w-md mx-auto">
                            Join thousands of developers building with our platform today.
                        </p>
                        <Link
                            href={route('register')}
                            className="inline-flex items-center px-10 py-5 text-xl font-semibold text-white bg-gradient-to-r from-[#191400] to-[#4a4100] hover:from-[#191400]/90 hover:to-[#4a4100]/90 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                            Start Building Now
                        </Link>
                    </div>
                )}
            </main>
        </>
    );
}
