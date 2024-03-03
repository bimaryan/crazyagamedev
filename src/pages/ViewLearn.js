import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import ReactMarkdown from 'react-markdown';
import remarkToc from 'remark-toc';
import { ref, push, set, onValue } from 'firebase/database'; // Import necessary functions from Firebase Realtime Database
import { database } from '../firebase';

const ViewLearn = () => {
    const { id } = useParams();
    const [learn, setLearn] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [name, setName] = useState('');

    useEffect(() => {
        const fetchLearn = async () => {
            try {
                const learnDoc = await getDoc(doc(db, "learn", id));
                if (learnDoc.exists()) {
                    setLearn({ id: learnDoc.id, ...learnDoc.data() });
                    setLoading(false);
                } else {
                    console.log("No such document!");
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error fetching learning resource: ", error);
                setLoading(false);
            }
        };

        fetchLearn();
    }, [id]);

    useEffect(() => {
        const commentsRef = ref(database, `comments/learn/${id}`);
        onValue(commentsRef, (snapshot) => {
            const commentsData = snapshot.val();
            if (commentsData) {
                const commentsArray = Object.values(commentsData);
                setComments(commentsArray);
            } else {
                setComments([]);
            }
        });
    }, [id]);

    const handleSubmitComment = (e) => {
        e.preventDefault();
        if (name.trim() === '' || newComment.trim() === '') {
            return;
        }
        const newCommentData = {
            name: name.trim(),
            comment: newComment.trim(),
            timestamp: Date.now()
        };
        push(ref(database, `comments/learn/${id}`), newCommentData);
        setNewComment('');
    };

    if (loading) {
        return <div className='container text-center'>
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>;
    }

    if (!learn) {
        return <div className='container'>
            <div className='card'>
                <div className='card-body'>
                    <div className='card-text'>
                        Learning resource not found.
                    </div>
                </div>
            </div>
        </div>;
    }

    return (
        <div className="container">
            <a href="/learn" className="nav-link"><i className="bi bi-arrow-left-square"></i> Back</a>
            <div className='card mt-3'>
                <div className='card-header'>{learn.title}</div>
                <div className='card-body'>
                    <div className='card-text'>
                        <ReactMarkdown
                            remarkPlugins={[remarkToc]} // Add remark-toc plugin
                            toc
                            children={learn.description} // Pass the Markdown content
                        />
                    </div>
                </div>
            </div>
            <div className='card mt-3'>
                <div className='card-header'>
                    Comments
                </div>
                <div className='card-body'>
                    <div className='card-text'>
                        <ul className="list-group">
                            {comments.map((comment, index) => (
                                <li key={index} className="list-group-item">
                                    <strong>{comment.name}: </strong> {comment.comment}
                                </li>
                            ))}
                        </ul>
                        <form onSubmit={handleSubmitComment} className="mt-3">
                            <div className="mb-3">
                                <input type="text" className="form-control" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} required />
                            </div>
                            <div className="mb-3">
                                <textarea className="form-control" rows="3" placeholder="Your Comment" value={newComment} onChange={(e) => setNewComment(e.target.value)} required></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewLearn;
