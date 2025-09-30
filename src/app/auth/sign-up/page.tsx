"use client";

import { useState } from "react";
import { signUp } from "@/lib/actions/auth-actions";
import { authClient } from "@/lib/auth-client";

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

   const { data: session, isPending } = authClient.useSession();
   
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await signUp(name, email, password);
  }
  if(isPending) {
    return <p>Loading...</p>
  }

  return (
    <>
    <div>
      {session ? (
        <div>
          <p>Signed in as {session.user.name}</p>
          <button onClick={() => authClient.signOut()}>Sign out</button>
        </div>
      ) : (
        <p>Not signed in</p>
      )}
    </div>
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </label>

      <label>
        Email:
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>

      <label>
        Password:
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>

      <button type="submit">Sign up</button>
    </form>
    
    </>
  );
}
