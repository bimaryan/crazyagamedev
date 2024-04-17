import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { Nav, Tab, Modal} from 'react-bootstrap';

const Admin = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState('');
    const [image, setImage] = useState(null);
    const [link, setLink] = useState('');
    const [description, setDescription] = useState('');
    const [uploading, setUploading] = useState(false);
    const [learnTitle, setLearnTitle] = useState('');
    const [learnDescription, setLearnDescription] = useState('');
    const [games, setGames] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedGame, setSelectedGame] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const gamesSnapshot = await getDocs(collection(db, 'games'));
                const gamesData = gamesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setGames(gamesData);
            } catch (error) {
                console.error('Error fetching games:', error);
            }
        };

        fetchGames();
    }, []);

    // Redirect user to the community page if they logged in with Google
    useEffect(() => {
        if (user && user.providerData[0].providerId === 'google.com') {
            window.location.href = '/community'; // Redirect to community page
        }
    }, [user]);

    // Function to handle form submission for adding a game
    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);

        try {
            const storageRef = ref(storage, `images/${image.name}`);
            await uploadBytes(storageRef, image);

            const imageUrl = await getDownloadURL(storageRef);

            const docRef = await addDoc(collection(db, "games"), {
                title,
                image: imageUrl,
                link,
                description
            });

            setTitle('');
            setImage(null);
            setLink('');
            setDescription('');
            setUploading(false);
        } catch (error) {
            console.error("Error adding document: ", error);
            setUploading(false);
        }
    };

    // Function to handle form submission for adding a learning resource
    const handleLearnSubmit = async (e) => {
        e.preventDefault();

        try {
            const docRef = await addDoc(collection(db, "learn"), {
                title: learnTitle,
                description: learnDescription,
            });

            // Reset the form after submission
            setLearnTitle('');
            setLearnDescription('');
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    };

    const handleEditClick = (game) => {
        setSelectedGame(game);
        setShowModal(true);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        // Logic to update game details in Firebase Firestore
        setShowModal(false);
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

    // Redirect non-admin users to the home page
    if (!user || !user.email) {
        return <Navigate to="/" />;
    }

    function hideAllCards() {
        var cards = ['addGame', 'editGame', 'learn'];
        cards.forEach(function (cardId) {
            var card = document.getElementById(cardId);
            if (card) {
                card.style.display = 'none';
            }
        });
    }

    function showCard(cardId) {
        hideAllCards();
        var card = document.getElementById(cardId);
        if (card) {
            card.style.display = 'block';
        }
    }

    return (
        <div className="container">
            <Tab.Container defaultActiveKey="addGame">
                <Nav variant="tabs">
                    <Nav.Item>
                        <Nav.Link eventKey="addGame" onClick={() => showCard('addGame')}>
                            Add New Game
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="editGame" onClick={() => showCard('editGame')}>
                            Edit Game
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="learn" onClick={() => showCard('learn')}>
                            Learn
                        </Nav.Link>
                    </Nav.Item>
                </Nav>
                <Tab.Content>
                    <Tab.Pane eventKey="addGame">
                        <div className='card'>
                            <div className='card-body'>
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="title" className="form-label">Title:</label>
                                        <input type="text" className="form-control" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="image" className="form-label">Image:</label>
                                        <input type="file" className="form-control" id="image" onChange={(e) => setImage(e.target.files[0])} required />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="link" className="form-label">Link:</label>
                                        <input type="text" className="form-control" id="link" value={link} onChange={(e) => setLink(e.target.value)} required />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="description" className="form-label">Description:</label>
                                        <textarea className="form-control" id="description" rows="3" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
                                    </div>
                                    <button type="submit" className="btn btn-primary" disabled={uploading}>{uploading ? 'Uploading...' : 'Submit'}</button>
                                </form>
                            </div>
                        </div>
                    </Tab.Pane>
                    <Tab.Pane eventKey="editGame">
                        <div className='card'>
                            <div className='card-body'>
                                {games.map(game => (
                                    <div key={game.id}>
                                        <div className='card mb-2'>
                                            <div className='card-body'>
                                                <div className='row row-cols-1 row-cols-lg-2'>
                                                    <div className='col text-center'>
                                                        <img src={game.image} alt={game.title} className='img-thumbnail' />
                                                    </div>
                                                    <div className='col'>
                                                        <div className='d-flex mt-2 justify-content-between align-items-center'>
                                                            <h3>{game.title}</h3>
                                                            <button className="btn btn-primary" onClick={() => handleEditClick(game)}>Edit</button>
                                                        </div>
                                                        <p>{game.description}</p>
                                                        <a href={game.link} target="_blank" rel="noopener noreferrer">Play Now</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <Modal show={showModal} onHide={() => setShowModal(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title>Edit Game</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <form onSubmit={handleEditSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="editTitle" className="form-label">Title:</label>
                                        <input type="text" className="form-control" id="editTitle" value={selectedGame?.title} onChange={(e) => setSelectedGame({ ...selectedGame, title: e.target.value })} required />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="editDescription" className="form-label">Description:</label>
                                        <textarea className="form-control" id="editDescription" rows="3" value={selectedGame?.description} onChange={(e) => setSelectedGame({ ...selectedGame, description: e.target.value })} required></textarea>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="editLink" className="form-label">Link:</label>
                                        <input type="text" className="form-control" id="editLink" value={selectedGame?.link} onChange={(e) => setSelectedGame({ ...selectedGame, link: e.target.value })} required />
                                    </div>
                                    <button type="submit" className="btn btn-primary">Save Changes</button>
                                </form>
                            </Modal.Body>
                        </Modal>
                    </Tab.Pane>
                    <Tab.Pane eventKey="learn">
                        <div className='card'>
                            <div className='card-body'>
                                <form onSubmit={handleLearnSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="learnTitle" className="form-label">Title:</label>
                                        <input type="text" className="form-control" id="learnTitle" value={learnTitle} onChange={(e) => setLearnTitle(e.target.value)} required />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="learnDescription" className="form-label">Description:</label>
                                        <textarea className="form-control" id="learnDescription" rows="6" value={learnDescription} onChange={(e) => setLearnDescription(e.target.value)} required></textarea>
                                    </div>
                                    <button type="submit" className="btn btn-primary">Create</button>
                                </form>
                            </div>
                        </div>
                    </Tab.Pane>
                </Tab.Content>
            </Tab.Container>
        </div>
    );
};

export default Admin;