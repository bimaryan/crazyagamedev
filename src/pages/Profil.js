import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { auth, db, storage } from '../firebase';
import { ref, listAll, deleteObject } from 'firebase/storage';
import { Link } from 'react-router-dom';

const Profil = () => {
    const [user, setUser] = useState(null);
    const [userPosts, setUserPosts] = useState([]);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
            if (user) {
                fetchUserPosts(user.displayName);
            }
        });

        return () => unsubscribe();
    }, []);

    const fetchUserPosts = async (displayName) => {
        try {
            const postsQuery = query(collection(db, 'posts'), where('displayName', '==', displayName));
            const postsSnapshot = await getDocs(postsQuery);
            const posts = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUserPosts(posts);
        } catch (error) {
            console.error('Error fetching user posts:', error);
        }
    };

    const deletePost = async (postId) => {
        try {
            // Hapus postingan dari Firestore
            await deleteDoc(doc(db, 'posts', postId));

            // Ambil foto terkait dengan postingan
            const storageRef = ref(storage, `Upload/Community/${postId}`);
            const imageList = await listAll(storageRef);
            imageList.items.forEach(async (item) => {
                await deleteObject(item);
            });

            // Hapus komentar terkait dengan postingan
            const commentsRef = ref(db, `komentarPost/${postId}`);
            const commentsSnapshot = await getDocs(commentsRef);
            commentsSnapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref);
            });

            // Perbarui daftar postingan yang ditampilkan di halaman profil
            setUserPosts(userPosts.filter(post => post.id !== postId));

            console.log('Post successfully deleted');
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    if (!user) {
        return <div className='container text-center'>
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>;
    }

    return (
        <div className="container">
            <ul className="nav nav-pills nav-fill gap-2 small rounded-5 shadow" id="pillNav2" role="tablist">
                <li className="nav-item" role="presentation">
                    <Link to="/community" className="nav-link rounded-5">Home</Link>
                </li>
                {user && (
                    <li className="nav-item" role="presentation">
                        <Link to="/community/profil" className="nav-link rounded-5">Profil</Link>
                    </li>
                )}
                <li className="nav-item" role="presentation">
                    <Link to="/community/post" className="nav-link rounded-5">Upload Post</Link>
                </li>
            </ul>
            <div className='row justify-content-center'>
                <div className='col col-md-5'>
                    <div className='card mt-3'>
                        <div className='card-body'>
                            <div class="alert alert-warning alert-dismissible fade show" role="alert">
                                Peringatan jika sudah menekan tombol delete nanti langsung <strong>Refresh</strong> aja!
                                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                            </div>
                            <h5 className='card-title'>{user.displayName}</h5>
                            <small>{user.email}</small>
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
                                                {post.imageUrl && <img src={post.imageUrl} alt="Post" className="card-img" style={{ objectFit: "cover", transform: 'scale(1.0)' }} />}
                                            </div>
                                            {user.displayName === post.displayName && (
                                                <div className="card-footer">
                                                    <button className="btn btn-danger" onClick={() => deletePost(post.id)}>Delete</button>
                                                </div>
                                            )}
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
