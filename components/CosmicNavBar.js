
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import NavLoginDropdown from './NavLoginDropdown';
import styles from '@styles/CosmicNavBar.module.css';

export default function CosmicNavBar() {
    return (        
        <Navbar fixed="top" bg="light" expand="lg" className={styles.navBar}>
            <Container>
                <Navbar.Brand href="/" className="cosmicWorlds">Cosmic Worlds</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link href="/recent">Recent Worlds</Nav.Link>
                    <Nav.Link href="/yours">Your Worlds</Nav.Link>
                    <Nav.Link href="/about">About</Nav.Link>
                </Nav>
                <Nav>
                    <NavLoginDropdown />
                </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}