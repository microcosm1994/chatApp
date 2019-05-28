import React from 'react';
import { BrowserRouter, Switch } from 'react-router-dom'
import { renderRoutes } from 'react-router-config'
import { LocaleProvider } from 'antd'
import routes from './router/index'
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
              <BrowserRouter>
                  <Switch>
                      {renderRoutes(routes.routes)}
                  </Switch>
              </BrowserRouter>
          </LocaleProvider>
      </div>
  )
}

export default App;
