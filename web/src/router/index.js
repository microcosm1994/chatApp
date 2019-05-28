import login from '../components/login'
import login_form from '../components/login_form'
import login_register from '../components/login_register'
import home from '../components/home'
import message from '../components/message'
import chatWindow from '../components/chatWindow'
export default {
    component: login,
    routes: [
        {
            path: '/login',
            component: login,
            routes: [
                {
                    path: '/login',
                    exact: true,
                    component: login_form,
                },
                {
                    path: '/login/register',
                    exact: true,
                    component: login_register,
                }
            ]
        },
        {
            path: '/',
            component: home,
            routes: [
                {
                    path: '/message',
                    exact: true,
                    component: message,
                },
                {
                    path: '/chatWindow',
                    exact: true,
                    component: chatWindow,
                }
            ]
        }
    ]
}
