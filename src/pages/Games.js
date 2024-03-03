import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const Games = () => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "games"));
                const gamesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setGames(gamesData);
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
                        Games
                    </div>
                    <div className="card-body">
                        <ol className="card-text">
                            {games.map(game => (
                                <li key={game.id}><a className='text-decoration-none' href={`/games/${game.id}`}>{game.title}</a></li>
                            ))}
                        </ol>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Games;