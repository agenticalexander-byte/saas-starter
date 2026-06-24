import { ClerkProvider, SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";

export const metadata = {
  title: "SaaS Starter - Projects",
  description: "A minimal CRUD app to learn the full stack loop",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#fafafa" }}>
        <ClerkProvider>
          <nav style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", padding: "12px 24px", borderBottom: "1px solid #eee", background: "white" }}>
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button style={{ marginRight: 8, padding: "8px 16px", borderRadius: 6, border: "1px solid #ccc", cursor: "pointer", background: "white" }}>Sign in</button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button style={{ padding: "8px 16px", borderRadius: 6, border: "none", background: "#0070f3", color: "white", cursor: "pointer" }}>Sign up</button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <UserButton />
            </Show>
          </nav>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}