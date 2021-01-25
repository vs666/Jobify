import React from 'react';
import { Nav, Navbar, NavDropdown, Card } from 'react-bootstrap';
import styled from 'styled-components';
import './Nav.css';

const Styles = styled.div`
    .navbar {
        background-color : rgb(20,20,4  0);
    }
    
    .navbar-brand, .navbar-nav, .nav-link{
        color : #bbb;
        $: hover{
            color: white;
        }
    }
`;

const Navigation = () => {
    return (
        <Styles>
                <Navbar raised={true} expand="lg" className="navbar a" fixed="top" style={{backgroundColor: 'rgba(0,0,0,0.3)'}}>
                    {/* <Navbar.Brand href="/"><img src={require("")} alt="PC-Cart" height="64" width="64" /></Navbar.Brand> */}
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar -nav" className="navbar a">
                        <Nav className="mr-auto" style={{ color: '#fff' }}>
                            <Nav.Link href="/" style={{ color: '#fff' }}>Home</Nav.Link>
                            <Nav.Link href="/signup" style={{ color: '#fff' }}>Sign Up</Nav.Link>
                            <Nav.Link href="/login" style={{ color: '#fff' }}>Login</Nav.Link>
                            <Nav.Link href="/logout" style={{ color: '#fff' }}>Logout</Nav.Link>
                            <NavDropdown title={"Options"} style={{ color: '#fff' }} id="basic-nav-dropdown">
                                <NavDropdown.Item href="/dashboard">Dashboard</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                    {/* <SearchBar style={{ alignItems: `right` }} /> */}
                </Navbar>
            </Styles >
    );
}

export default Navigation;