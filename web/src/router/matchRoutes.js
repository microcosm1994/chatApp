import matchPath from 'react-router/matchPath'
import Router from 'react-router/Router'

const { computeMatch } = Router.prototype

const matchRoutes = (routes, pathname, branch = []) => {
    routes.some((route) => {
        const match = route.path
            ? matchPath(pathname, route)
            : branch.length
                ? branch[branch.length - 1].match
                : computeMatch(pathname)
        if (match) {
            branch.push({ route, match })

            if (route.routes) {
                matchRoutes(route.routes, pathname, branch)
            }
        }

        return match
    })

    return branch
}

export default matchRoutes
