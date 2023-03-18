type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="max-w-2xl m-auto text-gray-600 md:px-0 px-4">
      <header className="border-b">
        <div className="inline-block mt-4 mb-2 py-1.5 pr-1 font-semibold text-2xl text-gray-800 hover:bg-yellow-300">
          SocialPlaza
        </div>
      </header>
      <main className="py-5">{children}</main>
    </div>
  );
}
