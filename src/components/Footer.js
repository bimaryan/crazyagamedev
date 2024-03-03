import React from "react";

const Footer = () => {
    return (
        <>
            <footer className="bd-footer py-1 py-md-1">
                <div className="container py-4 py-md- px-5 px-md-">
                    <div className="row">
                        <div className="col-lg-3 mb-3">
                            <a className="d-inline-flex align-items-center mb-2 nav-link" href="/" aria-label="Bootstrap">
                                <h5>CrazyGamedev</h5>
                            </a>
                            <ul className="list-unstyled small text-muted">
                                <li className="mb-2">
                                    Kami sadar kalau studio ini masih culun. Selama kami masih membuat game dan dengan dukungan kalian semua, kami akan terus berjuang untuk mengembangkan Game-Game lain nya agar menjadi lebih baik lagi. Setiap unduhan dari kamu adalah sebuah dukungan untuk kami.
                                </li>
                            </ul>
                        </div>
                        <div className="col-6 col-lg-2 offset-lg-1 mb-3">
                            <h5>Links</h5>
                            <ul className="list-unstyled">
                                <li className="mb-2">
                                    <a className="nav-link" href="https://www.instagram.com/crazy.gamedev/" target="_blank" rel="noopener noreferrer"><i className="bi bi-instagram"></i> Instagram</a>
                                </li>
                                <li className="mb-2">
                                    <a className="nav-link" href="https://www.youtube.com/channel/UCai-4PijNwR1vr_ZRqK9mVg" target="_blank" rel="noopener noreferrer"><i className="bi bi-youtube"></i> Youtube</a>
                                </li>
                                <li className="mb-2">
                                    <a className="nav-link" href="/privacypolicy" target="_blank" rel="noopener noreferrer"><i className="bi bi-shield-fill-exclamation"></i> Privacy Policy</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}

export default Footer;
