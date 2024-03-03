import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { ref, push, onValue } from 'firebase/database';
import { database } from '../firebase';

const ViewGames = () => {
    const { id } = useParams();
    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [name, setName] = useState('');

    useEffect(() => {
        const fetchGame = async () => {
            try {
                const gameDoc = await getDoc(doc(db, "games", id));
                if (gameDoc.exists()) {
                    setGame({ id: gameDoc.id, ...gameDoc.data() });
                    setLoading(false);
                } else {
                    console.log("No such document!");
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error fetching game: ", error);
                setLoading(false);
            }
        };

        fetchGame();
    }, [id]);

    useEffect(() => {
        const commentsRef = ref(database, `comments/games/${id}`);
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
        push(ref(database, `comments/games/${id}`), newCommentData);
        setNewComment('');
    };

    if (loading) {
        return <div className='container text-center'>
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>;
    }

    if (!game) {
        return <div className='container'>
            <div className='card'>
                <div className='card-body'>
                    <div className='card-text'>
                        Game not found.
                    </div>
                </div>
            </div>
        </div>;
    }

    return (
        <div className="container">
            <a href="/games" className="nav-link"><i className="bi bi-arrow-left-square"></i> Back</a>
            <div className='card mt-3'>
                <div className='card-header text-center'>{game.title}</div>
                <div className='card-body'>
                    <div className='card-text'><img src={game.image} alt={game.title} className="img-fluid mb-3" /></div>
                </div>
            </div>
            <div className='card mt-3'>
                <div className='card-header'>Link Download</div>
                <div className='card-body'>
                    <div className='card-text'>
                        <div className='row'>
                            <div className='col'>
                                {game.title}
                            </div>
                            <div className='col d-flex justify-content-end'>
                                <a href={game.link} className='btn btn-primary text-decoration-none'><i className="bi bi-cloud-download"></i> Download</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='card mt-3'>
                <div className='card-header'>Description</div>
                <div className='card-body'>
                    <div className='card-text'>{game.description}</div>
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

export default ViewGames;
