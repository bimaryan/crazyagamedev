import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Navigate } from 'react-router-dom';
import { ref, set, push, onValue } from 'firebase/database';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import "../App.css"
import { database } from '../firebase';

const Community = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState([]);
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState({});

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

    useEffect(() => {
        const commentsRef = ref(database, 'komentarPost');
        // Listen for changes to comments in real-time
        onValue(commentsRef, (snapshot) => {
            if (snapshot.exists()) {
                setComments(snapshot.val());
            } else {
                setComments({});
            }
        });

        // Cleanup function to remove the listener
        return () => {
            // Detach the listener when the component is unmounted
            setComments({});
        };
    }, []);

    const handleCommentSubmit = (postId) => {
        const commentsRef = ref(database, `komentarPost/${postId}`);
        const newCommentRef = push(commentsRef); // Generate a new key for the comment
        const currentUser = auth.currentUser;
        const commentData = {
            text: commentText,
            displayName: currentUser.displayName,
            createdAt: new Date().toString()
        };

        set(newCommentRef, commentData)
            .then(() => {
                console.log('Comment added successfully');
                // Clear comment text field after submission
                setCommentText('');
            })
            .catch((error) => {
                console.error('Error adding comment: ', error);
            });
    };

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
            <h3 className='text-center mb-4'>CrazyGamedev Community</h3>
            <div className='row justify-content-center'>
                <div className='col-md-6'>
                    {posts.map((post) => (
                        <div key={post.id} className="card mb-3">
                            <div className='card-header'>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <div>
                                        <Link to={`/community/view/${post.id}`} className="nav-link card-title">{post.displayName}</Link>
                                    </div>
                                    <div>
                                        <small className="nav-link text-muted">{new Date(post.createdAt?.seconds * 1000).toLocaleDateString()}</small>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">
                                <p className="card-text">{post.text}</p>
                                {post.imageUrl && <img src={post.imageUrl} alt="Post" className="card-img-top" />}
                            </div>
                            <div className='card-footer'>
                                {comments && comments[post.id] && (
                                    <ul className="list-group mb-2">
                                        {Object.values(comments[post.id]).slice(0, 1).map((comment, index) => (
                                            <li key={index} className="list-group-item">{comment.displayName}: {comment.text}</li>
                                        ))}
                                    </ul>
                                )}
                                <div className="d-flex">
                                    <textarea className="form-control" value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Add a comment..." rows="1" style={{ resize: "none" }} required></textarea>
                                    <button className="btn btn-primary" onClick={() => handleCommentSubmit(post.id)}><i className="bi bi-send"></i></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Community;
