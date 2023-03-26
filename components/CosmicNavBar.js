
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import NavLoginDropdown from './NavLoginDropdown';
import styles from '@styles/AlienNavBar.module.css';

export default function CosmicNavBar() {
    return (        
        <Navbar fixed="top" bg="light" expand="lg" className={styles.navBar}>
            <Container>
                <Navbar.Brand href="/" className="awz">Cosmic Worlds</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link href="/recent">Recent Worlds</Nav.Link>
                </Nav>
                <Nav>
                    <NavLoginDropdown />
                </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}