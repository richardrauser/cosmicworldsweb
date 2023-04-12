
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import NavLoginDropdown from './NavLoginDropdown';
import styles from '@styles/CosmicNavBar.module.css';

export default function CosmicNavBar() {
    return (        
        <Navbar fixed="top" expand="lg" className={styles.navBar}>
            <Container>
                <Navbar.Brand href="/" className="cosmicWorlds">Cosmic Worlds</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}