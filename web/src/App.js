import React from 'react';
import {BrowserRouter, Switch} from 'react-router-dom'
import {renderRoutes} from 'react-router-config'
import {LocaleProvider} from 'antd'
import routes from './router/index'
import {Provider} from 'react-redux'
import store from './store/index.js'
import zhCN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import './App.css';
import 'antd/dist/antd.css'

moment.locale('zh-cn')

function App() {
    return (
        <div className="App">
            <LocaleProvider locale={zhCN}>
                <Provider store={store}>
                    <BrowserRouter>
                        <Switch>
                            {renderRoutes(routes.routes)}
                        </Switch>
                    </BrowserRouter>
                </Provider>
            </LocaleProvider>
        </div>
    )
}

export default App;
