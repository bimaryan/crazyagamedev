import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Link } from 'react-router-dom';
import { ref, set, push, onValue } from 'firebase/database';
import "../App.css"
import { database } from '../firebase';
import ReactMarkdown from 'react-markdown';
import remarkToc from 'remark-toc';

const Community = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState([]);
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState({});
    const [selectedPost, setSelectedPost] = useState(null);
    const [selectedPostComments, setSelectedPostComments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
            setLoading(false);
            if (user) {
                setIsLoggedIn(true);
            } else {
                setIsLoggedIn(false);
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

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

    const handleViewAllComments = (postId) => {
        const selectedPost = posts.find(post => post.id === postId);
        setSelectedPost(selectedPost, true);
        setSelectedPostComments(Object.values(comments[postId] || {}));
    };

    if (loading) {
        return <div className='container text-center'>
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>;
    }

    return (
        <>
            <div className="container">
                <ul className="nav nav-pills nav-fill gap-2 small rounded-5 shadow" id="pillNav2" role="tablist">
                    <li className="nav-item" role="presentation">
                        <Link to="/community" className="nav-link rounded-5">Home</Link>
                    </li>
                    {user && (
                        <li className="nav-item" role="presentation">
                            <Link to="/community/profil" className="nav-link rounded-5">Profil</Link>
                        </li>
                    )}
                    <li className="nav-item" role="presentation">
                        <Link to="/community/post" className="nav-link rounded-5">Upload Post</Link>
                    </li>
                </ul>
                <div className='row gap-3 mt-3 justify-content-center'>
                    <div className='col-md-5'>
                        {posts.map((post) => (
                            <div key={post.id} className="container mb-3">
                                <div className='d-flex justify-content-between align-items-center mb-2'>
                                    <div>
                                        <Link to={`/community/profil/${post.displayName}`} className="nav-link card-title">{post.displayName}</Link>
                                    </div>
                                    <div>
                                        <small className="nav-link text-muted">{new Date(post.createdAt?.seconds * 1000).toLocaleDateString()}</small>
                                    </div>
                                </div>
                                <div className='border rounded'>
                                    {post.imageUrl && (
                                        <>
                                            {imageLoading && <div className="placeholder" style={{ backgroundImage: `url(${post.imageUrl})` }} />}
                                            <img
                                                src={post.imageUrl}
                                                alt="Post"
                                                className={`card-img-top ${imageLoading ? 'hidden' : ''}`}
                                                onLoad={() => setImageLoading(false)}
                                                style={{ transform: "scale(0.9)" }}
                                            />
                                        </>
                                    )}
                                </div>
                                <div className='mt-2'>
                                    <ReactMarkdown
                                        className="card-text"
                                        remarkPlugins={[remarkToc]}
                                        toc
                                        children={post.text}
                                    />
                                </div>
                                <div className=''>
                                    {comments && comments[post.id] && (
                                        <div className="mb-2">
                                            {Object.values(comments[post.id]).slice(0, 1).map((comment, index) => (
                                                <div key={index}>
                                                    <small>{comment.displayName}: {comment.text}</small>
                                                </div>
                                            ))}
                                            <a className="text-decoration-none cursor-pointer" onClick={() => handleViewAllComments(post.id)}>View All Comments</a>
                                        </div>
                                    )}
                                    <div className="d-flex">
                                        {isLoggedIn ? (
                                            <>
                                                <textarea className="form-control" value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Add a comment..." rows="1" style={{ resize: "none" }} required></textarea>
                                                <button className="btn btn-primary" onClick={() => handleCommentSubmit(post.id)}><i className="bi bi-send"></i></button>
                                            </>
                                        ) : (
                                            <>
                                                <p className="text-muted">You need to <a href='/community/signin'>Login</a> to comment.</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <hr />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {selectedPost && (
                <div className="modal fade show" style={{ display: "block" }} tabIndex="-1" role="dialog">
                    <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-overflow" style={{ overflowY: 'auto' }}>
                        <div className="modal-content">
                            <div key={selectedPost.id} className=''>
                                <div className='card'>
                                    <div className=''>
                                        {selectedPost.imageUrl && (
                                            <>
                                                {imageLoading && <div className="placeholder" style={{ backgroundImage: `url(${selectedPost.imageUrl})` }} />}
                                                <img
                                                    src={selectedPost.imageUrl}
                                                    alt="Post"
                                                    className={`card-img-top ${imageLoading ? 'hidden' : ''}`}
                                                    onLoad={() => setImageLoading(false)}
                                                />
                                            </>
                                        )}
                                    </div>
                                    <div className='card-body'>
                                        <div className='d-flex justify-content-between align-items-center mb-2'>
                                            <div>
                                                <Link to={`/community/profil/${selectedPost.displayName}`} className="nav-link">{selectedPost.displayName}</Link>
                                            </div>
                                            <div>
                                                <small className="nav-link text-muted">{new Date(selectedPost.createdAt?.seconds * 1000).toLocaleDateString()}</small>
                                            </div>
                                        </div>
                                        <hr />
                                        <div>
                                            <ReactMarkdown
                                                className="card-text"
                                                remarkPlugins={[remarkToc]}
                                                toc
                                                children={selectedPost.text}
                                            />
                                        </div>
                                        <div>
                                            {selectedPostComments.map((comment, index) => (
                                                <div key={index} className="mb-2">
                                                    <small>{comment.displayName}: {comment.text}</small>
                                                </div>
                                            ))}
                                        </div>
                                        <div>
                                            <div className="d-flex">
                                                {isLoggedIn ? (
                                                    <>
                                                        <textarea className="form-control" value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Add a comment..." rows="1" style={{ resize: "none" }} required></textarea>
                                                        <button className="btn btn-primary" onClick={() => handleCommentSubmit(selectedPost.id)}><i className="bi bi-send"></i></button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <p className="text-muted">You need to <a href='/community/signin'>Login</a> to comment.</p>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-footer">
                                        <button type="button" className="btn btn-secondary" onClick={() => setSelectedPost(false)}>Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Community;
