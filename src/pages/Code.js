import React, { useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import hljs from 'highlight.js/lib/highlight';
import 'highlight.js/styles/night-owl.css';
import javascript from 'highlight.js/lib/languages/javascript';
import html from 'highlight.js/lib/languages/php';
import ruby from 'highlight.js/lib/languages/ruby';
import go from 'highlight.js/lib/languages/go';
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('html', html);
hljs.registerLanguage('ruby', ruby);
hljs.registerLanguage('go', go);


const Nulis = () => {
    const [text, setText] = useState('');

    useEffect(() => {
        highlightCode();
    }, [text]);

    const handleSubmit = () => {
        const element = document.getElementById('kertas');

        html2canvas(element).then((canvas) => {
            const link = document.createElement('a');
            link.download = 'code.png';
            link.href = canvas.toDataURL();
            link.click();
        });
    };

    const highlightCode = () => {
        const kertasElement = document.getElementById('kertas');
        const codeBlocks = kertasElement.querySelectorAll('pre code');
        codeBlocks.forEach((codeBlock) => {
            hljs.highlightBlock(codeBlock);
        });
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card mt-3">
                        <div className="card-body">
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                rows="10"
                                className="form-control"
                                placeholder="Write code something..."
                                style={{ resize: 'none' }}
                            ></textarea>
                            <button onClick={handleSubmit} className="btn btn-primary mt-3">Download as Image</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row justify-content-center mt-3">
                <div className="col-md-6">
                    <div id="kertas" className="card" style={{ whiteSpace: 'pre-line' }}>
                        <div className='card-body'>
                            <pre>
                                <div className='d-flex gap-2 mb-3'>
                                    <i className="bi bi-circle-fill text-danger"></i>
                                    <i className="bi bi-circle-fill text-warning"></i>
                                    <i className="bi bi-circle-fill text-success"></i>
                                </div>
                                <code className="javascript html ruby go rounded">
                                    {text}
                                </code>
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Nulis;
