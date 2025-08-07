import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { useRouter } from 'next/router';

const socket = io('http://localhost:4000'); 

function Game () {
    
    const router = useRouter();
    const { lobbyId } = router.query;
    
    const [status, setStatus] = useState('waiting');
    const [round, setRound] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [answer, setAnswer] = useState({ title: '', artist: '' });
    const [roundResult, setRoundResult] = useState(null);
    const [finalScores, setFinalScores] = useState(null);

    const audioRef = useRef();

    if (!router.isReady || !lobbyId) {
        return <div>Chargement du lobby...</div>;
    }

    useEffect(() => {
        socket.emit('joinLobby', lobbyId);

        socket.on('newRound', ({ index, total, previewUrl, duration }) => {
            setStatus('in-game');
            setRound({ index, total, previewUrl, duration });
            setRoundResult(null);
            setFinalScores(null);
            setTimeLeft(duration);
            setAnswer({ title: '', artist: '' });
        });

        socket.on('roundEnded', ({ correctAnswer, allAnswers }) => {
            setRoundResult({ correctAnswer, allAnswers });
        });

        socket.on('gameEnded', ({ scores }) => {
            setFinalScores(scores);
            setStatus('ended');
            setRound(null);
        });

        return () => {
            socket.off('newRound');
            socket.off('roundEnded');
            socket.off('gameEnded');
        };
    }, [lobbyId, router.isReady]);


    useEffect(() => {
        if (round && audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = round.previewUrl;
            audioRef.current.volume = 0.30;
            audioRef.current.play();
        }
    }, [round]);

    useEffect(() => {
        let timerId;
        if (timeLeft > 0) {
            timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        }
        return () => clearTimeout(timerId);
    }, [timeLeft]);

    const sendAnswer = () => {
        if (!answer.title && !answer.artist) return;
        socket.emit('answer', {
            lobbyId,
            title: answer.title,
            artist: answer.artist,
        });
        setAnswer({ title: '', artist: '' });
    };

    if (status === 'waiting') {
        return <div>En attente du début de la partie...</div>;
    }

    if (status === 'ended') {
        return (
            <div>
                <h2>Résultats finaux</h2>
                <ul>
                    {Object.entries(finalScores || {}).map(([playerId, score]) => (
                        <li key={playerId}>
                            {playerId}: {score} point{score > 1 ? 's' : ''}
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    return (
        <div>
            <h2>
                Manche {round?.index} / {round?.total}
            </h2>
            <audio ref={audioRef} controls />
            <p>Temps restant: {timeLeft}s</p>

            <div>
                <input
                    placeholder="Titre"
                    value={answer.title}
                    onChange={(e) => setAnswer({ ...answer, title: e.target.value })}
                    disabled={timeLeft === 0}
                    onKeyDown={(e) => e.key === 'Enter' && sendAnswer()}
                />
                <input
                    placeholder="Artiste"
                    value={answer.artist}
                    onChange={(e) => setAnswer({ ...answer, artist: e.target.value })}
                    disabled={timeLeft === 0}
                    onKeyDown={(e) => e.key === 'Enter' && sendAnswer()}
                />
                <button onClick={sendAnswer} disabled={timeLeft === 0}>
                    Envoyer
                </button>
            </div>

            {roundResult && (
                <div>
                    <h3>Réponses de la manche :</h3>
                    <p>
                        Réponse correcte: {roundResult.correctAnswer.title} -{' '}
                        {roundResult.correctAnswer.artist}
                    </p>
                    <ul>
                        {Object.entries(roundResult.allAnswers).map(([playerId, ans]) => (
                            <li key={playerId}>
                                {playerId}: {ans.title} - {ans.artist}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default Game;
