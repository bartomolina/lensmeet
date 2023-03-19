import Image from "next/image";
import { SignInWithLens, Theme, Size } from "@lens-protocol/widgets-react";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  async function onSignIn(tokens, profile) {
    console.log("tokens: ", tokens);
    console.log("profile: ", profile);
  }

  return (
    <div className="max-w-2xl m-auto text-gray-900 md:px-0 px-4">
      <header className="border-b">
        <div className="flex mt-4 mb-2 py-1.5 justify-between">
          <div className="flex">
            <div className="w-10 flex-none">
              <Image src="/CryptoPlaza.png" alt="Crypto Plaza" height={32} width={32} />
            </div>
            <div className="inline-block px-1 font-semibold text-2xl">SocialPlaza</div>
          </div>
          <SignInWithLens onSignIn={onSignIn} theme={Theme.lavender} size={Size.small} />
        </div>
      </header>
      <main className="py-5">{children}</main>
    </div>
  );
};

export default Layout;
