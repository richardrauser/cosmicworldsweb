
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container'
import NavLoginDropdown from './NavLoginDropdown'

import 'bootstrap/dist/css/bootstrap.min.css';


export default function AlienNavBar() {

    return (        
        <Navbar bg="light" expand="lg">
        <Container>
              <Navbar.Brand href="/" className="dyna">Alien Worldz</Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                  <Nav.Link href="/recent">Recent Worldz</Nav.Link>
              </Nav>
              <Nav>
              <NavLoginDropdown />
              </Nav>
              </Navbar.Collapse>
          </Container>
        </Navbar>
    )
}