import Image from "next/image";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="max-w-2xl m-auto text-gray-600 md:px-0 px-4">
      <header className="border-b">
        <div className="flex mt-4 mb-2 py-1.5">
          <Image src="/CryptoPlaza.png" alt="Crypto Plaza" height={32} width={32} />
          <div className="inline-block ml-2 px-1 font-semibold text-2xl text-gray-800 hover:bg-yellow-300">
            SocialPlaza
          </div>
        </div>
      </header>
      <main className="py-5">{children}</main>
    </div>
  );
}
