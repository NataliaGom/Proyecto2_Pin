import PostForm from '../components/PostForm.jsx';
import { usePosts } from '../hooks/usePosts.js';

export default function Crear({ currentUser }) {
  const postsApi = usePosts(currentUser);

  return (
    <div className="container py-4">
      <PostForm
        currentUser={currentUser}
        onSubmit={postsApi.createPost}
      />
    </div>
  );
}