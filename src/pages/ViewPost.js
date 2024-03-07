import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ref, onValue, push, set, get } from 'firebase/database';
import { database, auth } from '../firebase';

const ViewPost = () => {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');

    useEffect(() => {
        const postRef = ref(database, `posts/${postId}`);
        const commentsRef = ref(database, `komentarPost/${postId}`);

        // Fetch post data
        onValue(postRef, (snapshot) => {
            if (snapshot.exists()) {
                setPost(snapshot.val());
            } else {
                setPost(null);
            }
        });

        // Fetch comments data
        onValue(commentsRef, (snapshot) => {
            if (snapshot.exists()) {
                setComments(snapshot.val());
            } else {
                setComments([]);
            }
        });

        return () => {
            setPost(null);
            setComments([]);
        };
    }, [postId]);

    const handleCommentSubmit = () => {
        const currentUser = auth.currentUser;
        const newCommentRef = push(ref(database, `komentarPost/${postId}`)); // Generate a new key for the comment
        const commentData = {
            text: commentText,
            displayName: currentUser.displayName,
            createdAt: new Date().toString()
        };

        set(newCommentRef, commentData)
            .then(() => {
                console.log('Comment added successfully');
                setCommentText('');
            })
            .catch((error) => {
                console.error('Error adding comment: ', error);
            });
    };

    return (
        <div className="container">
            {post && (
                <div className="card mb-3">
                    <div className="card-body">
                        <h5 className="card-title">{post.title}</h5>
                        <p className="card-text">{post.content}</p>
                    </div>
                </div>
            )}
            <h5>Comments</h5>
            <ul className="list-group mb-3">
                {comments && Object.values(comments).map((comment, index) => (
                    <li key={index} className="list-group-item">{comment.displayName}: {comment.text}</li>
                ))}
            </ul>
            <div className="mb-3">
                <textarea
                    className="form-control"
                    rows="3"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment..."
                ></textarea>
            </div>
            <button className="btn btn-primary" onClick={handleCommentSubmit}>Submit Comment</button>
        </div>
    );
};

export default ViewPost;
