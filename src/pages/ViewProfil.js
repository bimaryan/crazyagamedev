import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const ViewProfile = () => {
    const { displayName } = useParams();
    const [userPosts, setUserPosts] = useState([]);

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

    const removeBlur = () => {
        const images = document.querySelectorAll('.post-image');
        images.forEach(image => {
            image.style.filter = 'none';
        });
    };

    return (
        <div className="container">
            <a href="/community" className="nav-link"><i className="bi bi-arrow-left-square"></i> Back</a>
            <div className='row justify-content-center'>
                <div className='col-md-5'>
                    <div className="card mt-3 mb-3">
                        <div className="card-body">
                            <h5 className="card-title">{displayName}</h5>
                            <hr />
                            <ul className="nav nav-pills nav-fill gap-2 small rounded-5 shadow" id="pillNav2" role="tablist">
                                <li className="nav-item" role="presentation">
                                    <button className="nav-link rounded-5" id="home-tab2">Post</button>
                                </li>
                            </ul>
                            <div className='row row-cols-3 justify-content-start mt-3'>
                                {userPosts.map((post) => (
                                    <div className='col' key={post.id}>
                                        <div className="card h-100">
                                            <div className="card-body">
                                                {post.imageUrl && <img src={post.imageUrl} alt="Post" className="card-img post-image" onLoad={removeBlur} style={{ objectFit: "cover", transform: 'scale(1.0)', filter: 'blur(5px)' }} />}
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
};

export default ViewProfile;
