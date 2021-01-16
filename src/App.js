import React, { Suspense } from 'react';
import '../src/assets/css/all.min.css';
import '../src/assets/css/bootstrap.min.css';
import '../src/assets/css/bootstrap.min.css.map';
import '../src/assets/css/jquery.fancybox.min.css';
import '../src/assets/css/owl.carousel.min.css';
import '../src/assets/css/styles.css';
import '../src/assets/css/responsive.css';
import { BrowserRouter } from "react-router-dom";
import Routes from './routes';
class App extends React.Component {

    render() {
        return (
            <>
                <BrowserRouter>
                    <Suspense fallback={<div></div>}>
                        <Routes />
                    </Suspense>
                </BrowserRouter>
            </>
        )
    }
}

export default App;