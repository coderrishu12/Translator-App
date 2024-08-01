import React, { useEffect, useState } from 'react';
import lang from '../languages';

function Translate() {
    const [fromText, setFromText] = useState('');
    const [toText, setToText] = useState('');
    const [fromLanguage, setFromLanguage] = useState('en-GB');
    const [toLanguage, setToLanguage] = useState('hi-IN');
    const [languages, setLanguages] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLanguages(lang);
    }, []);

    const copyContent = (text) => {
        navigator.clipboard.writeText(text);
    };

    const utterText = (text, language) => {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language;
        synth.speak(utterance);
    };

    const handleExchange = () => {
        let tempValue = fromText;
        setFromText(toText);
        setToText(tempValue);

        let tempLang = fromLanguage;
        setFromLanguage(toLanguage);
        setToLanguage(tempLang);
    };

    const handleTranslate = () => {
        setLoading(true);
        let url = `https://api.mymemory.translated.net/get?q=${fromText}&langpair=${fromLanguage}|${toLanguage}`;

        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                setToText(data.responseData.translatedText);
                setLoading(false);
            });
    };

    const handleIconClick = (target, id) => {
        if (!fromText || !toText) return;

        if (target.classList.contains('fa-copy')) {
            if (id === 'from') {
                copyContent(fromText);
            } else {
                copyContent(toText);
            }
        } else {
            if (id === 'from') {
                utterText(fromText, fromLanguage);
            } else {
                utterText(toText, toLanguage);
            }
        }
    };

    return (
        <>
            <div className="wrapper p-4  ">
                <div className="text-input">
                    <textarea
                        name="from"
                        className="from-text border p-2 rounded text"
                        placeholder="Enter Text"
                        id="from"
                        value={fromText}
                        onChange={(e) => setFromText(e.target.value)}
                    ></textarea>
                    <textarea
                        name="to"
                        className="to-text border p-2 rounded"
                        id="to"
                        value={toText}
                        readOnly
                    ></textarea>
                </div>
                <ul className="controls flex items-center space-x-4 mt-2">
                    <li className="row from flex items-center space-x-2">
                        <div className="icons">
                            <i
                                id="from"
                                className="fa-solid fa-volume-high cursor-pointer"
                                onClick={(e) => handleIconClick(e.target, 'from')}
                            ></i>
                            <i
                                id="from"
                                className="fa-solid fa-copy cursor-pointer"
                                onClick={(e) => handleIconClick(e.target, 'from')}
                            ></i>
                        </div>
                        <select
                            value={fromLanguage}
                            onChange={(e) => setFromLanguage(e.target.value)}
                            className="border p-2 rounded"
                        >
                            {Object.entries(languages).map(([code, name]) => (
                                <option key={code} value={code}>
                                    {name}
                                </option>
                            ))}
                        </select>
                    </li>
                    <li className="exchange cursor-pointer" onClick={handleExchange}>
                        <i className="fa-solid fa-arrow-right-arrow-left"></i>
                    </li>
                    <li className="row to flex items-center space-x-2">
                        <select
                            value={toLanguage}
                            onChange={(e) => setToLanguage(e.target.value)}
                            className="border p-2 rounded"
                        >
                            {Object.entries(languages).map(([code, name]) => (
                                <option key={code} value={code}>
                                    {name}
                                </option>
                            ))}
                        </select>
                        <div className="icons">
                            <i
                                id="to"
                                className="fa-solid fa-copy cursor-pointer"
                                onClick={(e) => handleIconClick(e.target, 'to')}
                            ></i>
                            <i
                                id="to"
                                className="fa-solid fa-volume-high cursor-pointer"
                                onClick={(e) => handleIconClick(e.target, 'to')}
                            ></i>
                        </div>
                    </li>
                </ul>
            </div>
            <button
                className="bg-stone-800 hover:bg-stone-700 text-balance text-white font-bold py-2 px-4 rounded mt-4"
                onClick={handleTranslate}
                disabled={loading}
            >
                {loading ? 'Translating...' : 'Translate Text'}
            </button>
        </>
    );
}

export default Translate;
