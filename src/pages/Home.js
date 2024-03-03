import React, { useEffect, useState } from "react";

const Home = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(false);
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
                <div className="card mb-5">
                    <div className="card-body">
                        <div className="card-text">
                        COMING SOON
                        </div>
                    </div>
                </div>
                <h6 className="text-center">BROWSE CRAZYGAMEDEV STORE</h6>
                <div className="card">
                    <div className="card-body">
                        <div className="row text-center">
                            <div className="col">
                                <a href="/games" className="nav-link"><i className="bi bi-controller"></i> Games</a>
                            </div>
                            <div className="col">
                                <a href="/learn" className="nav-link"><i className="bi bi-book"></i> Learn</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Home;