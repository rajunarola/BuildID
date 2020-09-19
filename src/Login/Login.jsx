import React from 'react'
import { userLogin } from '../Services/CommonAPI';

export default class Login extends React.Component {

    state = {
        email: "",
        password: ""
    }

    changeHandler = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    userLogin = (e) => {
        e.preventDefault();
        const data = {
            user: this.state.email,
            password: this.state.password
        }
        userLogin(data).then(response => {
            if (response.data.status === true) {
                localStorage.setItem('userID', response.data.data)
                this.props.history.push("/dashboard");
            }
        }).catch(err => {
            console.log('err => ', err);
        });
    }

    render() {
        return (
            <>
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
                                <ul class="login-social">
                                    <li><a href="javascript:void(0)" style={{ 'backgroundColor': '#4268b3' }}><i class="fab fa-facebook-f"></i></a></li>
                                    <li><a href="javascript:void(0)" style={{ 'backgroundColor': '#1ca1ee' }}><i class="fab fa-twitter"></i></a></li>
                                    <li><a href="javascript:void(0)" style={{ 'backgroundColor': '#d44439' }}><i class="fab fa-google-plus-g"></i></a></li>
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
            </>
        )
    }
}
