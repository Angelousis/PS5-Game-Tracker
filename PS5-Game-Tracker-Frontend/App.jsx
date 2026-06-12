
const { useState, useEffect } = React;

function EditGameForm({ game, onSave, onCancel }) {
    const [form, setForm] = useState({
        id: game.id,
        title: game.title,
        genre: game.genre || '',
        status: game.status,
        rating: game.rating || '',
        notes: game.notes || '',
        coverUrl: game.coverUrl || '',
        dateAdded: game.dateAdded,
        dateFinished: game.dateFinished
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onSave(form);
    };

    return (
        <div className="edit-overlay">
            <form onSubmit={handleSubmit} className="edit-form">
                <h2>✏️ Επεξεργασία Παιχνιδιού</h2>
                <input
                    placeholder="Τίτλος *"
                    value={form.title}
                    onChange={e => setForm({...form, title: e.target.value})}
                    required
                />
                <input
                    placeholder="Genre"
                    value={form.genre}
                    onChange={e => setForm({...form, genre: e.target.value})}
                />
                <select
                    value={form.status}
                    onChange={e => setForm({...form, status: e.target.value})}
                >
                    <option value="ToPlay">⏳ To Play</option>
                    <option value="Playing">🎮 Playing</option>
                    <option value="Played">✅ Played</option>
                </select>
                <input
                    placeholder="Rating (1-10)"
                    type="number" min="1" max="10"
                    value={form.rating}
                    onChange={e => setForm({...form, rating: e.target.value})}
                />
                <input
                    placeholder="Cover URL (προαιρετικό)"
                    value={form.coverUrl}
                    onChange={e => setForm({...form, coverUrl: e.target.value})}
                />
                <textarea
                    placeholder="Σημειώσεις"
                    value={form.notes}
                    onChange={e => setForm({...form, notes: e.target.value})}
                />
                <div className="edit-buttons">
                    <button type="submit" className="save-btn">💾 Αποθήκευση</button>
                    <button type="button" className="cancel-btn" onClick={onCancel}>❌ Άκυρο</button>
                </div>
            </form>
        </div>
    );
}


function GameCard({ game, onDelete, onEdit }) {
    return (
        <div className="game-card">
            {game.coverUrl
                ? <img
                    src={game.coverUrl}
                    alt={game.title}
                    className="game-cover"
                    onError={e => e.target.style.display='none'}
                  />
                : <div className="game-cover-placeholder">🎮</div>
            }
            <div className="game-info">
                <h3>{game.title}</h3>
                <span className={`status-badge status-${game.status}`}>
                    {game.status === 'Played'  ? '✅ Played'  : ''}
                    {game.status === 'Playing' ? '🎮 Playing' : ''}
                    {game.status === 'ToPlay'  ? '⏳ To Play' : ''}
                </span>
                {game.genre  && <p>🎭 {game.genre}</p>}
                {game.rating && <p>⭐ {game.rating}/10</p>}
                {game.notes  && <p>📝 {game.notes}</p>}
            </div>
            <div className="card-buttons">
                <button className="edit-btn" onClick={() => onEdit(game)}>✏️ Επεξεργασία</button>
                <button className="delete-btn" onClick={() => onDelete(game.id)}>🗑️ Διαγραφή</button>
            </div>
        </div>
    );
}


function AddGameForm({ onAdd }) {
    const [form, setForm] = useState({
        title: '', genre: '', status: 'ToPlay',
        rating: '', notes: '', coverUrl: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onAdd(form);
        setForm({ title: '', genre: '', status: 'ToPlay', rating: '', notes: '', coverUrl: '' });
    };

   
    return (
        <form onSubmit={handleSubmit} className="add-form">
            <h2>➕ Προσθήκη Παιχνιδιού</h2>
            <div className="form-grid">
                <input
                    placeholder="Τίτλος *"
                    value={form.title}
                    onChange={e => setForm({...form, title: e.target.value})}
                    required
                />
                <input
                    placeholder="Genre"
                    value={form.genre}
                    onChange={e => setForm({...form, genre: e.target.value})}
                />
                <select
                    value={form.status}
                    onChange={e => setForm({...form, status: e.target.value})}
                >
                    <option value="ToPlay">⏳ To Play</option>
                    <option value="Playing">🎮 Playing</option>
                    <option value="Played">✅ Played</option>
                </select>
                <input
                    placeholder="Rating (1-10)"
                    type="number" min="1" max="10"
                    value={form.rating}
                    onChange={e => setForm({...form, rating: e.target.value})}
                />
                <input
                    className="full-width"
                    placeholder="Cover URL (προαιρετικό)"
                    value={form.coverUrl}
                    onChange={e => setForm({...form, coverUrl: e.target.value})}
                />
                <textarea
                    className="full-width"
                    placeholder="Σημειώσεις"
                    value={form.notes}
                    onChange={e => setForm({...form, notes: e.target.value})}
                />
            </div>
            <button type="submit">➕ Προσθήκη</button>
        </form>
    );

}

function App() {
    const [games, setGames] = useState([]);
    const [filter, setFilter] = useState('All');
    const [editingGame, setEditingGame] = useState(null);
    const API_URL = 'http://localhost:5180/api/games';

    useEffect(() => {
        fetch(API_URL)
            .then(res => res.json())
            .then(data => setGames(data))
            .catch(err => console.error('Error:', err));
    }, []);

    const handleAdd = async (game) => {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(game)
        });
        const newGame = await response.json();
        setGames([...games, newGame]);
    };

    const handleDelete = async (id) => {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        setGames(games.filter(g => g.id !== id));
    };

    const handleEditClick = (game) => {
        setEditingGame(game);
    };

    const handleSave = async (updatedGame) => {
        await fetch(`${API_URL}/${updatedGame.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedGame)
        });
        setGames(games.map(g => g.id === updatedGame.id ? updatedGame : g));
        setEditingGame(null);
    };

    const filteredGames = filter === 'All'
        ? games
        : games.filter(g => g.status === filter);

    return (
        <div className="app">
            <header>
                <h1>🎮 PS5 Game Tracker</h1>
            </header>

            
            {/* ✅ Stats Bar */}
                    <div className="stats-bar">
                        <div className="stat-card">
                            <div className="number">{games.length}</div>
                            <div className="label">Σύνολο</div>
                        </div>
                        <div className="stat-card">
                            <div className="number">{games.filter(g => g.status === 'Playing').length}</div>
                            <div className="label">🎮 Playing</div>
                        </div>
                        <div className="stat-card">
                            <div className="number">{games.filter(g => g.status === 'Played').length}</div>
                            <div className="label">✅ Played</div>
                        </div>
                        <div className="stat-card">
                            <div className="number">{games.filter(g => g.status === 'ToPlay').length}</div>
                            <div className="label">⏳ To Play</div>
                        </div>
                    </div>


            <AddGameForm onAdd={handleAdd} />

            <div className="filters">
                {['All', 'Playing', 'Played', 'ToPlay'].map(f => (
                    <button
                        key={f}
                        className={filter === f ? 'active' : ''}
                        onClick={() => setFilter(f)}
                    >
                        {f}
                    </button>
                ))}
            </div>

            <div className="games-grid">
                {filteredGames.map(game => (
                    <GameCard
                        key={game.id}
                        game={game}
                        onDelete={handleDelete}
                        onEdit={handleEditClick}
                    />
                ))}
            </div>

            {editingGame && (
                <EditGameForm
                    game={editingGame}
                    onSave={handleSave}
                    onCancel={() => setEditingGame(null)}
                />
            )}
        </div>
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
