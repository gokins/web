import Vue from 'vue'
import Router from 'vue-router'

// Containers
const TheContainer = () =>
    import ('@/containers/TheContainer')

// Views
const Dashboard = () =>
    import ('@/views/Dashboard')

// Views - Pages
const Page404 = () =>
    import ('@/views/pages/Page404')
const Page500 = () =>
    import ('@/views/pages/Page500')
const Login = () =>
    import ('@/views/pages/Login')
    // const Register = () => import ('@/views/pages/Register')

Vue.use(Router)

export default new Router({
    mode: 'hash', // https://router.vuejs.org/api/#mode
    linkActiveClass: 'active',
    scrollBehavior: () => ({ y: 0 }),
    routes: configRoutes()
})

function configRoutes() {
    return [{
            path: '/',
            redirect: '/org',
            name: 'Home',
            component: TheContainer,
            children: [{
                    path: 'dashboard',
                    name: 'Dashboard',
                    component: Dashboard
                },
                {
                    path: '/user',
                    redirect: '/user/list',
                    name: 'User',
                    component: {
                        render(c) { return c('router-view') }
                    },
                    children: [{
                        path: 'list',
                        name: 'List',
                        component: () =>
                            import ('@/views/user/list')
                    }, {
                        path: 'info/:id',
                        name: 'Info',
                        component: () =>
                            import ('@/views/user/info')
                    }, ]
                },
                {
                    path: '/org',
                    redirect: '/org/list',
                    name: 'Org',
                    component: {
                        render(c) { return c('router-view') }
                    },
                    children: [{
                            path: 'list',
                            name: 'List',
                            component: () =>
                                import ('@/views/orgs/list')
                        },
                        {
                            path: 'new',
                            name: 'New',
                            component: () =>
                                import ('@/views/orgs/new')
                        },
                        {
                            path: 'info/:id',
                            name: 'Info',
                            component: () =>
                                import ('@/views/orgs/info')
                        },
                    ]
                }, {
                    path: '/art',
                    redirect: '/org/list',
                    name: 'Artifact',
                    component: {
                        render(c) { return c('router-view') }
                    },
                    children: [{
                        path: 'info/:id',
                        name: 'Info',
                        component: () =>
                            import ('@/views/arts/info')
                    }, ]
                },
                {
                    path: '/pipelineVersion',
                    redirect: '/pipelineVersion/list',
                    name: 'PipelineVersions',
                    component: {
                        render(c) { return c('router-view') }
                    },
                    children: [{
                            path: 'list/:pipelineId',
                            name: 'List',
                            component: () =>
                                import ('@/views/pipelineversions/list')
                        },
                        {
                            path: 'list',
                            name: 'List',
                            component: () =>
                                import ('@/views/pipelineversions/list')
                        },
                    ]
                },
                {
                    path: '/pipeline',
                    redirect: '/pipeline/list',
                    name: 'Pipeline',
                    component: {
                        render(c) { return c('router-view') }
                    },
                    children: [{
                            path: 'list/:orgId',
                            name: 'List',
                            component: () =>
                                import ('@/views/pipeline/list')
                        },
                        {
                            path: 'new/:orgId',
                            name: 'New',
                            component: () =>
                                import ('@/views/pipeline/new')
                        },
                        {
                            path: 'info/:id',
                            name: 'Info',
                            component: () =>
                                import ('@/views/pipeline/info')
                        },
                        {
                            path: 'build/:id',
                            name: 'Build',
                            component: () =>
                                import ('@/views/pipelineversions/info')
                        },
                        {
                            path: 'list',
                            name: 'List',
                            component: () =>
                                import ('@/views/pipeline/list')
                        },
                        {
                            path: 'new',
                            name: 'New',
                            component: () =>
                                import ('@/views/pipeline/new')
                        },
                        {
                            path: 'info',
                            name: 'Info',
                            component: () =>
                                import ('@/views/pipeline/info')
                        },
                    ]
                }
            ]
        },
        /* {
            path: '/pages',
            redirect: '/pages/404',
            name: 'Pages',
            component: {
                render(c) { return c('router-view') }
            },
            children: [
                {
                    path: 'login',
                    name: 'Login',
                    component: Login
                },
                {
                    path: 'register',
                    name: 'Register',
                    component: Register
                }
            ]
        }, */
        {
            path: '/login',
            name: 'Login',
            component: Login
        },
        {
            path: '/500',
            name: 'Page500',
            component: Page500
        },
        {
            path: '/404',
            name: 'Page404',
            component: Page404
        },
        {
            path: '*',
            name: 'Page404',
            component: Page404
        },
    ]
}