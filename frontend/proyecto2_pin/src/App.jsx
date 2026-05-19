import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar.jsx';
import UserForm from './components/UserForm.jsx';

import Top from './paginas/Top.jsx';
import Feed from './paginas/Feed.jsx';
import Crear from './paginas/Crear.jsx';
import Descubrir from './paginas/Descubrir.jsx';

import { useCurrentUser } from './hooks/useCurrentUser.js';

export default function App() {
  const { currentUser, saveUser, clearUser } = useCurrentUser();

  return (
    <>
      <Navbar
        currentUser={currentUser}
        onClearUser={clearUser}
      />

      <main className="container-fluid px-3 px-lg-5 py-4 py-lg-5">

        <Routes>
          <Route
            path="/"
            element={
            <Top
              currentUser={currentUser}
              saveUser={saveUser}
            />
            }
          />

          <Route
            path="/feed"
            element={<Feed currentUser={currentUser} />}
          />

          <Route
            path="/crear"
            element={<Crear currentUser={currentUser} />}
          />

          <Route
            path="/descubrir"
            element={<Descubrir currentUser={currentUser} />}
          />
        </Routes>

      </main>
    </>
  );
}