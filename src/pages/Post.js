import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, auth } from '../firebase'; // Import 'auth' from your firebase config

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
            <div className='mb-3'>
                <h5 class="fw-bold">Your Post</h5>
            </div>
            <center>
                <a class="nav-link disabled btn btn-secondary mb-3 push"><i class="fa-solid fa-circle-info"></i> Text kamu saat ini dibatasi 200 karakter</a>
            </center>
            <form onSubmit={handleSubmit}>
                <div class="form-group">
                    <center>
                        {/* <div className="mb-3">
                            <input type="file" className="form-control" id="image" onChange={handleImageChange} accept="image/*" />
                        </div> */}
                        <div className="mb-3">
                            {/* <textarea className="form-control" id="text" rows="3" required></textarea> */}
                            <textarea name="pesan" id="text" class="form-control border" value={text} onChange={(e) => setText(e.target.value)} required style={{ resize: "none" }}></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary w-100" disabled={uploading}>{uploading ? 'Uploading...' : 'Post'}</button>
                    </center>
                </div>
            </form>
        </div>
    );
}

export default Post;
