import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const ViewProfile = () => {
    const { displayName } = useParams();
    const [userPosts, setUserPosts] = useState([]);

    useEffect(() => {
        console.log('displayName:', displayName);
    }, [displayName]);

    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                const postsQuery = query(collection(db, 'posts'), where('displayName', '==', displayName));
                const postsSnapshot = await getDocs(postsQuery);
                const userPosts = [];
                postsSnapshot.forEach((doc) => {
                    userPosts.push({ id: doc.id, ...doc.data() });
                });
                setUserPosts(userPosts);
            } catch (error) {
                console.error('Error fetching user posts:', error);
            }
        };

        fetchUserPosts();
    }, [displayName]);

    return (
        <div className="container">
            <a href="/community" className="nav-link"><i className="bi bi-arrow-left-square"></i> Back</a>
            <div className='row'>
            <div className='col-'>

            </div>
            </div>
            <div className="card mt-3 mb-3">
                <div className="card-body">
                    <h5 className="card-title">{displayName}</h5>
                    {userPosts.map((post) => (
                        <div key={post.id} className="card mb-3">
                            <div className="card-body">
                                <p className="card-text">{post.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ViewProfile;
