

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
              <h1>This is for testing layout</h1>
        {children}

    </div>


  );
}
