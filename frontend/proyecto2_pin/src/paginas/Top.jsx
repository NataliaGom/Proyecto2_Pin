import UserForm from '../components/UserForm.jsx';

export default function Top({ currentUser, saveUser }) {
  return (
    <div className="container py-5">

      <UserForm
        currentUser={currentUser}
        onSaveUser={saveUser}
      />

    </div>
  );
}