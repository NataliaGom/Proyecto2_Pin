import UserForm from '../components/UserForm.jsx';
import logo from '../imagenes/MosaicLogo.png';

export default function Top({ currentUser, saveUser }) {
  return (
    <div className="container py-5 text-center">

      <img
        src={logo}
        alt="Mosaic Logo"
        style={{
          width: '120px',
          marginBottom: '24px',
        }}
      />

      <h1 className="display-3 fw-bold mb-3">
        Mosaic
      </h1>

      <p className="lead text-secondary mb-5">
        Descubre, crea y organiza inspiración visual
        en un espacio limpio y moderno.
      </p>

      <div className="mx-auto" style={{ maxWidth: '700px' }}>
        <UserForm
          currentUser={currentUser}
          onSaveUser={saveUser}
        />
      </div>

    </div>
  );
}