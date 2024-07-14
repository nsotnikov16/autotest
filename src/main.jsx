import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/App.jsx'
import YandexMetrika from './components/YandexMetrika.jsx';
import './assets/scss/normalize.scss';
import './assets/scss/main.scss';
ReactDOM.createRoot(document.getElementById('root')).render(
    <>
        {import.meta.env.MODE === 'production' && <YandexMetrika />}
        <App />
    </>
)
