import AppRoutes from "./routes";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../services/firebase";

function App() {

  const [user, setUser] = useState(null);

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();

  }, []);

  return <AppRoutes user={user} />;
}

export default App;