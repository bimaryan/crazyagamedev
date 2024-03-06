import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Navigate } from 'react-router-dom';
import "../App.css"

const Community = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'posts'));
                const fetchedPosts = [];
                querySnapshot.forEach((doc) => {
                    fetchedPosts.push({ id: doc.id, ...doc.data() });
                });
                setPosts(fetchedPosts);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, []);

    if (loading) {
        return (
            <div className='container text-center'>
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    // Redirect to the login page if user is not logged in or not using Google login
    if (!user || user.providerData[0].providerId !== 'google.com') {
        return <Navigate to="/community/login" />;
    }

    return (
        <div className="container">
            {posts.map((post) => (
                <div key={post.id} className="card-container">
                    <div className="card mb-3">
                        <div className="card-body">
                            <a href='/community/profil' className="nav-link card-title">{post.displayName}</a>
                            <hr />
                            <p className="card-text">{post.text}</p>
                            {post.imageUrl && <img src={post.imageUrl} alt="Post" className="card-img-top" />}
                            <small className="text-muted">{new Date(post.createdAt?.seconds * 1000).toLocaleDateString()}</small>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Community;
