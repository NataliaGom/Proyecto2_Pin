import { useState } from 'react';

import PinGrid from '../components/PinGrid.jsx';
import Pagination from '../components/Pagination.jsx';

import PostDetailModal from '../components/PostDetailModal.jsx';
import EditPostModal from '../components/EditPostModal.jsx';
import DeletePostModal from '../components/DeletePostModal.jsx';

import { usePosts } from '../hooks/usePosts.js';

export default function Feed({ currentUser }) {
  const postsApi = usePosts(currentUser);

  const [detailState, setDetailState] = useState({
    post: null,
    loading: false,
    error: '',
  });

  const [editingPost, setEditingPost] = useState(null);
  const [deletingPost, setDeletingPost] = useState(null);

  async function openDetail(postId) {
    setDetailState({ post: null, loading: true, error: '' });

    try {
      const post = await postsApi.getPost(postId);

      setDetailState({
        post,
        loading: false,
        error: '',
      });
    } catch (error) {
      setDetailState({
        post: null,
        loading: false,
        error: error.message,
      });
    }
  }

  function closeDetail() {
    setDetailState({
      post: null,
      loading: false,
      error: '',
    });
  }

  function handlePageSizeChange(size) {
    postsApi.setPageSize(size);
    postsApi.setPage(1);
  }

  function openEdit(post) {
    closeDetail();
    setEditingPost(post);
  }

  function openDelete(post) {
    closeDetail();
    setDeletingPost(post);
  }

  return (
    <div className="container py-4">

      <PinGrid
        posts={postsApi.posts}
        loading={postsApi.loading}
        error={postsApi.error}
        onDetail={openDetail}
        onEdit={openEdit}
        onDelete={openDelete}
      />

      <Pagination
        pagination={postsApi.pagination}
        page={postsApi.page}
        pageSize={postsApi.pageSize}
        onPageChange={postsApi.setPage}
        onPageSizeChange={handlePageSizeChange}
      />

      <PostDetailModal
        post={detailState.post}
        loading={detailState.loading}
        error={detailState.error}
        onClose={closeDetail}
        onEdit={openEdit}
        onDelete={openDelete}
      />

      <EditPostModal
        post={editingPost}
        onClose={() => setEditingPost(null)}
        onPatch={postsApi.patchPost}
        onReplace={postsApi.replacePost}
      />

      <DeletePostModal
        post={deletingPost}
        onClose={() => setDeletingPost(null)}
        onConfirm={postsApi.deletePost}
      />
    </div>
  );
}