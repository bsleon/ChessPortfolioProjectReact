import React from "react";
import { Link } from "react-router-dom";

function Footer(props) {
	return (
		<footer className="site-footer">
			<div className="container-fluid footer mt-5 pt-4">
				<div className="row">
					<div className="col-4 col-sm-2 col-m-4 offset-2">
						<h5>Links</h5>
						<ul className="list-unstyled">
							<li>
								<Link to="/home" className="text-secondary">
									Home
								</Link>
							</li>
							<li>
								<Link
									to="/playcomputer"
									className="text-secondary"
								>
									Play Computer
								</Link>
							</li>
							<li>
								<Link to="/contact" className="text-secondary">
									Contact Me
								</Link>
							</li>
						</ul>
					</div>
					<div className="col-6 col-sm-3 col-m-4 text-center social">
						<h5>Social</h5>
						<a
							className="btn text-secondary"
							href="https://www.linkedin.com/in/brandonleon/"
							target="_blank"
							rel="noopener noreferrer"
						>
							<i className="fab fa-linkedin" />
						</a>{" "}
						<a
							className="btn text-secondary"
							href="https://github.com/bsleon/"
							target="_blank"
							rel="noopener noreferrer"
						>
							<i className="fab fa-github" />
						</a>{" "}
						<a
							className="btn text-secondary"
							href="https://www.facebook.com/brandon.leon.9022/"
							target="_blank"
							rel="noopener noreferrer"
						>
							<i className="fab fa-facebook" />
						</a>{" "}
						{/* <a
							className="btn text-secondary"
							href="http://youtube.com/"
							target="_blank"
							rel="noopener noreferrer"
						>
							<i className="fab fa-youtube" />
						</a> */}
					</div>

					<div className="col-sm-4 col-m-4 text-center">
						<h5>Contact</h5>
						<a
							role="button"
							className="btn btn-link text-secondary"
							href="tel:+12065551234"
						>
							<i className="fa fa-phone text-secondary" />{" "}
							1-206-555-1234
						</a>
						<br />
						<a
							role="button"
							className="btn btn-link text-secondary"
							href="mailto:bsleon@umich.edu"
						>
							<i className="far fa-envelope text-dasecondaryrk" />{" "}
							bsleon@umich.edu
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
}

export default Footer;
