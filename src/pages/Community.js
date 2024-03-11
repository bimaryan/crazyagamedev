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
    const [showAllComments, setShowAllComments] = useState(false);
    const [selectedPostComments, setSelectedPostComments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        if (user) {
            const filteredUsers = user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ? [user] : [];
            setSearchResults(filteredUsers);
        }
    }, [searchTerm, user]);

    const handleSearchTermChange = (e) => {
        setSearchTerm(e.target.value);
    };

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
        setSelectedPostComments(Object.values(comments[postId]));
        setShowAllComments(true);
    };

    if (!loading) {

    }

    return (
        <>
            <div className="container">
                <ul className="nav nav-pills nav-fill gap-2 small rounded-5 shadow" id="pillNav2" role="tablist">
                    <li className="nav-item" role="presentation">
                        <Link to="/community" className="nav-link rounded-5">Home</Link>
                    </li>
                    <li className="nav-item" role="presentation">
                        <Link to="/community/profil" className="nav-link rounded-5">Profil</Link>
                    </li>
                    <li className="nav-item" role="presentation">
                        <Link to="/community/post" className="nav-link rounded-5">Upload Post</Link>
                    </li>
                </ul>
                <div className='row gap-3 mt-3'>
                    <div className='col-md-3'>
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            className="form-control"
                            onChange={handleSearchTermChange}
                        />
                        <div>
                            {searchTerm !== '' && searchResults.map((result) => (
                                <div key={result.id}>
                                    <a href={`/community/profil/${result.displayName}`} className="text-decoration-none mt-3">{result.displayName}</a>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='col-md-6'>
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
                                    {post.imageUrl && post.imageUrl.endsWith('.mp4') ? (
                                        <video controls className="card-img-top" style={{ transform: 'scale(0.9)' }}>
                                            <source src={post.imageUrl} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    ) : (
                                        <img src={post.imageUrl} alt="Post" className="card-img-top" style={{ transform: 'scale(0.9)' }} />                                        
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
                                        <textarea className="form-control" value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Add a comment..." rows="1" style={{ resize: "none" }} required></textarea>
                                        <button className="btn btn-primary" onClick={() => handleCommentSubmit(post.id)}><i className="bi bi-send"></i></button>
                                    </div>
                                </div>
                                <hr />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {showAllComments && (
                <div className="modal fade show" style={{ display: "block" }} tabIndex="-1" role="dialog">
                    <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-overflow" style={{ overflowY: 'auto' }}>
                        <div className="modal-content">
                            {posts.map((post) => (
                                <div key={post.id} className=''>
                                    <div className='card'>
                                        <div className=''>
                                            {post.imageUrl && post.imageUrl.endsWith('.mp4') ? (
                                                <video controls className='card-img-top'>
                                                    <source src={post.imageUrl} type="video/mp4" />
                                                    Your browser does not support the video tag.
                                                </video>
                                            ) : (
                                                <img src={post.imageUrl} alt="Post" className='card-img-top' />
                                            )}
                                        </div>
                                        <div className='card-body'>
                                            <div className='d-flex justify-content-between align-items-center mb-2'>
                                                <div>
                                                    <Link to={`/community/profil/${post.displayName}`} className="nav-link">{post.displayName}</Link>
                                                </div>
                                                <div>
                                                    <small className="nav-link text-muted">{new Date(post.createdAt?.seconds * 1000).toLocaleDateString()}</small>
                                                </div>
                                            </div>
                                            <hr />
                                            <div>
                                                <ReactMarkdown
                                                    className="card-text"
                                                    remarkPlugins={[remarkToc]}
                                                    toc
                                                    children={post.text}
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
                                                    <textarea className="form-control" value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Add a comment..." rows="1" style={{ resize: "none" }} required></textarea>
                                                    <button className="btn btn-primary" onClick={() => handleCommentSubmit(post.id)}><i className="bi bi-send"></i></button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-footer">
                                            <button type="button" className="btn btn-secondary" onClick={() => setShowAllComments(false)}>Close</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Community;
