import DiscoverySection from '../components/DiscoverySection.jsx';
import { usePosts } from '../hooks/usePosts.js';

export default function Descubrir({ currentUser }) {
  const postsApi = usePosts(currentUser);

  return (
    <div className="container py-4">
      <DiscoverySection
        currentUser={currentUser}
        onSavePhoto={postsApi.createPost}
      />
    </div>
  );
}