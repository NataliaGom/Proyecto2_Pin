import { Link } from 'react-router-dom';
import logo from '../imagenes/MosaicLogo.png';

export default function Navbar({ currentUser, onClearUser }) {
  return (
    <nav className="navbar navbar-expand-lg sticky-top bg-body-tertiary border-bottom glass-nav">
      <div className="container-fluid px-3 px-lg-5">
        <a className="navbar-brand fw-black d-flex align-items-center gap-2" href="#top">
          <span className="brand-mark">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M9 1 L10.4 7.6 L17 9 L10.4 10.4 L9 17 L7.6 10.4 L1 9 L7.6 7.6 Z"
                fill="white"
              />
              <circle cx="9" cy="9" r="1.8" fill="white" opacity="0.6"/>
            </svg>
          </span>
          Mosaic
        </a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavbar" aria-controls="mainNavbar" aria-expanded="false" aria-label="Abrir navegación">
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">

            <li className="nav-item">
              <Link className="nav-link" to="/feed">
                Feed
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/crear">
                Crear
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/descubrir">
                Descubrir
              </Link>
            </li>

            {currentUser && (
              <li className="nav-item d-flex align-items-center gap-2 ms-lg-3">
                <span className="badge rounded-pill text-bg-dark px-3 py-2">
                  <i className="bi bi-person-circle me-1" />
                  {currentUser}
                </span>

                <button
                  className="btn btn-sm btn-outline-dark rounded-pill"
                  onClick={onClearUser}
                >
                  Cambiar
                </button>
              </li>
            )}

          </ul>
        </div>
      </div>
    </nav>
  );
}