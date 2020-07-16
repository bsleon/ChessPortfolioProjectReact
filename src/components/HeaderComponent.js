import React, { Component } from "react";
import { Navbar, NavbarBrand, Nav, NavbarToggler, NavItem, Collapse} from "reactstrap";
import { NavLink } from "react-router-dom";

class Header extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isNavOpen: false,
		};

		this.toggleNav = this.toggleNav.bind(this);
	}

	toggleNav() {
		this.setState({
			isNavOpen: !this.state.isNavOpen,
		});
	}

	render() {
		return (
			<React.Fragment>
				<Navbar dark expand="md">
					<div className="container">
						<NavbarBrand className="mr-auto">
							<NavLink className="nav-link" to="/home">
								<i className="fas fa-chess fa-lg" />
								CHESSFEN
							</NavLink>
						</NavbarBrand>
						<NavbarToggler onClick={this.toggleNav} />
						<Collapse isOpen={this.state.isNavOpen} navbar>
							<Nav navbar>
								<NavItem>
									<NavLink className="nav-link" to="/home">
										Board
									</NavLink>
								</NavItem>
								<NavItem>
									<NavLink
										className="nav-link"
										to="/playcomputer"
									>
										Play Computer
									</NavLink>
								</NavItem>
								<NavItem>
									<NavLink className="nav-link" to="/contact">
										Contact Me
									</NavLink>
								</NavItem>
							</Nav>
						</Collapse>
					</div>
				</Navbar>
			</React.Fragment>
		);
	}
}

export default Header;
