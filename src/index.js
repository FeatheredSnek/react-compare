import App from './components/App.js';
import { toggle } from './helpers.js';

const appRoot = ReactDOM.createRoot(document.getElementById('root'));
appRoot.render(<App/>);

// mobile navigation
const navToggle = document.getElementById('nav-toggle')
const nav = document.querySelector('nav')
navToggle.addEventListener('click', () => {
  toggle(nav)
})