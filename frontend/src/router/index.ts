import { createRouter, createWebHistory } from "vue-router";
import HomeView from '../views/HomeView.vue'

const router = createRouter({
    routes: [
        {
            path: '/',
            component: HomeView
        }
    ],
    history: createWebHistory(),
});

export default router;
