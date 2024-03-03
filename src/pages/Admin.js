import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { Nav, Tab } from 'react-bootstrap';

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


    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

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
            console.log("Document written with ID: ", docRef.id);

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

    const handleLearnSubmit = async (e) => {
        e.preventDefault();

        try {
            const docRef = await addDoc(collection(db, "learn"), {
                title: learnTitle,
                description: learnDescription,
            });
            console.log("Document written with ID: ", docRef.id);

            // Reset the form after submission
            setLearnTitle('');
            setLearnDescription('');
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    };

    if (loading) {
        return <div className='container text-center'>
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>;
    }

    if (!user) {
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
                                        <input type="file" className="form-control" id="image" onChange={handleImageChange} required />
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

                            </div>
                        </div>
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
