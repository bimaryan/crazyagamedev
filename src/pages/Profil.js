import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { Link } from 'react-router-dom';

const Profil = () => {
    const [user, setUser] = useState(null);
    const [userPosts, setUserPosts] = useState([]);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
            if (user) {
                fetchUserPosts(user.uid);
            }
        });

        return () => unsubscribe();
    }, []);

    const fetchUserPosts = async (userId) => {
        try {
            const userPostsRef = collection(db, 'posts');
            const snapshot = await getDocs(userPostsRef);
            const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUserPosts(posts);
        } catch (error) {
            console.error('Error fetching user posts:', error);
        }
    };

    if (!user) {
        return (
            <div className="container">
                <h2>Loading...</h2>
            </div>
        );
    }

    return (
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
            <div className='row justify-content-center'>
                <div className='col col-md-5'>
                    <div className='card mt-3'>
                        <div className='card-body'>
                            <h5 className='card-title'>{user.displayName}</h5>
                            <small>{user.email}</small>
                            <hr />
                            <ul className="nav nav-pills nav-fill gap-2 small rounded-5 shadow" id="pillNav2" role="tablist">
                                <li className="nav-item" role="presentation">
                                    <button className="nav-link rounded-5" id="home-tab2">Post</button>
                                </li>
                                {/* <li className="nav-item" role="presentation">
                                    <button className="nav-link rounded-5" id="profile-tab2">Reels</button>
                                </li> */}
                            </ul>
                            <div className='row row-cols-3 justify-content-start mt-3'>
                                {userPosts.map((post) => (
                                    <div className='col' key={post.id}>
                                        <div className="card h-100">
                                            <div className="card-body">
                                                {post.imageUrl && <img src={post.imageUrl} alt="Post" className="card-img" style={{ objectFit: "cover", transform: 'scale(1.0)' }} />}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profil;
