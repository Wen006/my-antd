import exam from "./exam";
import sys from "./sys";
export default [
    {
        path: '/user',
        component: '../layouts/UserLayout',
        routes: [
            {
                path: '/user',
                redirect: '/user/login',
            },
            {
                name: 'login',
                icon: 'smile',
                path: '/user/login',
                component: './user/login',
            },
            {
                name: 'register-result',
                icon: 'smile',
                path: '/user/register-result',
                component: './user/register-result',
            },
            {
                name: 'register',
                icon: 'smile',
                path: '/user/register',
                component: './user/register',
            },
            {
                component: '404',
            },
        ],
    },
    {
        path: '/',
        component: '../layouts/BasicLayout',
        Routes: ['src/pages/Authorized'],
        authority: ['admin', 'user'],
        routes: [
            // ...exam,
            ...sys
        ],
    },


]