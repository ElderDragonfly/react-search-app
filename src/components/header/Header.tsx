import { Component } from "react";

import logo from "../../assets/images/Rick_and_Morty-logo.png";

class Header extends Component {
  render() {
    return (
      <header className="header">
        <div className="header__logo">
          <img className="header__logo-image" src={logo} alt="logo" />
          <h1 className="header__title">
            <span className="header__title-accent--rick">Rick</span>{" "}
            <span className="header__title-accent--and">and</span>{" "}
            <span className="header__title-accent--morty">Morty</span>
          </h1>
        </div>
        <nav className="header__navigation">
          <a className="header__link header__link--home">
            Home
          </a>
          <a className="header__link header__link--about">
            About API
          </a>
        </nav>
      </header>
    );
  }
}

export default Header;
