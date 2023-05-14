import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Navbar from '@/components/Navbar';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div>
      <Navbar />
      <div className="min-h-[calc(100svh-96px)] flex flex-col px-4">
        <div className="pt-12">
          <Component {...pageProps} />
        </div>
        <footer className="pb-6 pt-12 text-center text-brandDark mt-auto">
              <p>Follow us on<a href="https://twitter.com/TibetSwap" target="_blank" rel="noopener noreferrer" className="underline ml-1">Twitter</a></p>
        </footer>
      </div>
    </div>
  );
}
