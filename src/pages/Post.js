import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, auth } from '../firebase';
import { Link } from 'react-router-dom';

const Post = () => {
    const [text, setText] = useState('');
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);

        try {
            let imageUrl = '';
            if (image) {
                const storageRef = ref(storage, `Upload/Community/${image.name}`);
                await uploadBytes(storageRef, image);
                imageUrl = await getDownloadURL(storageRef);
            }

            // Get the current user's display name
            const currentUser = auth.currentUser;
            const displayName = currentUser.displayName;

            // Add post data to Firestore including display name
            const docRef = await addDoc(collection(db, 'posts'), {
                text,
                imageUrl,
                displayName, // Add displayName to the post data
                createdAt: new Date()
            });

            console.log("Document written with ID: ", docRef.id);

            // Reset the form after submission
            setText('');
            setImage(null);
            setUploading(false);
        } catch (error) {
            console.error("Error adding document: ", error);
            setUploading(false);
        }
    };

    return (
        <div className="container">
            <ul className="nav nav-pills nav-fill gap-2 small rounded-5 shadow mb-3" id="pillNav2" role="tablist">
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
            {/* <div className='mb-3'>
                <h5 className="fw-bold">Your Post</h5>
            </div> */}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <center>
                        <div className="mb-3">
                            <input type="file" className="form-control" id="image" onChange={handleImageChange} accept="image/*" />
                        </div>
                        <center>
                            <label className="nav-link bg-secondary rounded mb-3 push"><i className="fa-solid fa-circle-info"></i> Text kamu saat ini dibatasi 200 karakter</label>
                        </center>
                        <div className="mb-3">
                            <textarea name="pesan" id="text" className="form-control border" value={text} onChange={(e) => setText(e.target.value)} required maxLength={200} style={{ resize: "none" }} rows={6}></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary w-100" disabled={uploading}>{uploading ? 'Uploading...' : 'Post'}</button>
                    </center>
                </div>
            </form>
        </div>
    );
}

export default Post;
