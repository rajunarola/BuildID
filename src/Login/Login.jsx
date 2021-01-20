import React from 'react'
import Loader from '../Loader/Loader';
import { userLogin } from '../Services/CommonAPI';
import { Link } from 'react-router-dom';

export default class Login extends React.Component {

    state = {
        email: "",
        password: "",
        loading: false
    }

    changeHandler = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    userLogin = (e) => {
        this.setState({ loading: true })
        e.preventDefault();
        const data = {
            user: this.state.email,
            password: this.state.password
        }
        userLogin(data).then(response => {
            console.log('response => ', response);
            if (response.data.status === true) {
                this.setState({ loading: false });
                localStorage.setItem('userID', response.data.data.userId);
                localStorage.setItem('userImage', response.data.data.pictureUrl)
                localStorage.setItem('userName', response.data.data.firstName + " " + response.data.data.lastName);
                this.props.history.push("/dashboard");
            }
        }).catch(err => {
            this.setState({ loading: false });
            console.log('err => ', err);
        });
    }

    render() {
        return (
            <>
                {this.state.loading ? <Loader /> :
                    <div className="login-sec login-block">
                        <div className="container">
                            <div className="row align-items-center justify-content-between alternate">
                                <div className="col-lg-5 col-md-6">
                                    <h1><small>Welcome to</small>BUILD <b>ID</b></h1>
                                    <p>Help us help you showcase the projects that you have been a part of that make you be proud of working in construction. </p>
                                    <p>oh and get builders bucks that you can exchange for chances to win prizes tools and other cool things</p>
                                </div>
                                <div className="col-lg-5 col-md-6">
                                    <h2>BUILD <b>ID</b></h2>
                                    <h3>Hello and welcome Back, login in to your account</h3>
                                    <h4>Login with your social media account</h4>
                                    <ul className="login-social">
                                        <li><Link style={{ 'backgroundColor': '#4268b3' }}><i className="fab fa-facebook-f"></i></Link></li>
                                        <li><Link style={{ 'backgroundColor': '#1ca1ee' }}><i className="fab fa-twitter"></i></Link></li>
                                        <li><Link style={{ 'backgroundColor': '#d44439' }}><i className="fab fa-google-plus-g"></i></Link></li>
                                    </ul>
                                    <form onSubmit={(e) => this.userLogin(e)}>
                                        <div className="form-group">
                                            <label>Email</label>
                                            <input type="text" name="email" className="form-control" placeholder="email@address.com" onChange={(event) => this.changeHandler(event)} />
                                        </div>
                                        <div className="form-group">
                                            <label>Password</label>
                                            <input type="password" name="password" className="form-control" placeholder="********" onChange={(event) => this.changeHandler(event)} />
                                        </div>
                                        <button type="submit" className="btn-blue btn-login">Login</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </>
        )
    }
}
