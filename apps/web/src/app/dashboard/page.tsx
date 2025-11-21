'use client';

import { useEffect, useState } from 'react';
import { postsApi, setAuthToken } from '@/lib/api';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  tenantId: string;
}

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  status: string;
  createdAt: string;
  author: {
    name: string;
  };
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token || !userStr) {
      window.location.href = '/login';
      return;
    }

    setAuthToken(token);
    setUser(JSON.parse(userStr));

    // Fetch posts
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const response = await postsApi.getAll();
      setPosts(response.data.data);
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthToken(null);
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="container">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="header">
        <div className="header-content">
          <h1>No-Blogg CMS</h1>
          <nav className="nav">
            <span>{user?.name} ({user?.role})</span>
            <button onClick={handleLogout} className="button button-secondary">
              Logout
            </button>
          </nav>
        </div>
      </div>

      <div className="container">
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem' }}>Posts</h2>
            {(user?.role === 'ADMIN' || user?.role === 'EDITOR') && (
              <button className="button">Create Post</button>
            )}
          </div>

          {posts.length === 0 ? (
            <p style={{ color: '#666' }}>No posts found. Create your first post!</p>
          ) : (
            <div className="grid">
              {posts.map((post) => (
                <div key={post.id} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem' }}>{post.title}</h3>
                    <span className={`badge badge-${post.status.toLowerCase()}`}>
                      {post.status}
                    </span>
                  </div>
                  {post.excerpt && (
                    <p style={{ color: '#666', marginBottom: '0.5rem' }}>{post.excerpt}</p>
                  )}
                  <div style={{ fontSize: '0.875rem', color: '#999' }}>
                    By {post.author.name} • {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
