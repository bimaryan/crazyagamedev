import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const Learn = () => {
    const [learn, setLearn] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "learn"));
                const learnData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setLearn(learnData);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching games: ", error);
                setLoading(false);
            }
        };

        fetchGames();
    }, []);

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
                <a href="/" className="nav-link"><i className="bi bi-arrow-left-square"></i> Back</a>
                <div className="card mt-3">
                    <div className='card-header'>
                    Learn
                    </div>
                    <div className="card-body">
                        <ol className="card-text">
                            {learn.map(learn => (
                                <li key={learn.id}><a className='text-decoration-none' href={`/learn/${learn.id}`}>{learn.title}</a></li>
                            ))}
                        </ol>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Learn;