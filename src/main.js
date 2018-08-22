// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Buefy from 'buefy';
import Vuebar from 'vuebar';
import axios from 'axios';
import VueAxios from 'vue-axios';
import VueAuth from '@websanova/vue-auth';

import VueAuthBearer from '@websanova/vue-auth/drivers/auth/bearer';
import VueAuthAxios from '@websanova/vue-auth/drivers/http/axios.1.x';
import VueAuthRouter from '@websanova/vue-auth/drivers/router/vue-router.2.x';

import App from './App';
import router from './router';
import store from './store';

// Enable devtools
Vue.config.devtools = true;
Vue.config.productionTip = false;
Vue.router = router;

Vue.use(VueAxios, axios);
Vue.axios.defaults.baseURL = 'https://api.vennly.thinklabserver.com/';
Vue.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
Vue.axios.defaults.headers.common['Content-Type'] = 'application/json';
// eslint-disable-next-line
// Vue.axios.defaults.headers.common.Authorization = `Bearer ${window.localStorage.getItem('accessToken')}`;
Vue.axios.defaults.headers.common.Authorization = `Bearer ${window.localStorage.getItem('default_auth_token')}`;

Vue.use(VueAuth, {
	auth: VueAuthBearer,
	http: VueAuthAxios,
	router: VueAuthRouter,
	loginData: {
		url: 'user/login',
		fetchUser: false,
	},
	registerData: {
		url: 'user/signup',
	},
	refreshData: {
		enabled: false,
	},
	fetchData: {
		url: 'user/account',
		enabled: false,
	},
});

Vue.use(Buefy, {
	defaultIconPack: 'mdi',
});

Vue.use(Vuebar);

Vue.axios.interceptors.response.use(
	// eslint-disable-next-line
	(response) => {
		return response;
	},
	(error) => {
		if (error.response.status === 403 && !error.response.config.url.includes('user/login')) {
			Vue.auth.logout({
				success() {
					window.localStorage.removeItem('userData');
				},
				redirect: '/login',
			});
		} else if (error.response.status !== 200
				&& error.response.status !== 403
				&& error.response.status !== 422) {
			Vue.$toast.open({
				duration: 5000,
				message: error.response,
				position: 'is-top',
				type: 'is-danger',
			});
		}
		return Promise.reject(error.response);
	},
);

/* eslint-disable no-new */
new Vue({
	el: '#app',
	store,
	router,
	template: '<App/>',
	components: { App },
	methods: {
		catchError(response) {
			console.log(response);
			let errorMessage = response.message;

			if (response.errors) {
				if (response.errors.title) {
					Object.keys(response.errors.title).forEach((key) => {
						errorMessage = `${errorMessage} ${response.errors.title[key].message}`;
					});
				} else {
					Object.keys(response.errors).forEach((key) => {
						errorMessage = `${errorMessage} ${response.errors[key][0]}`;
					});
				}
			}

			this.$toast.open({
				duration: 5000,
				message: errorMessage,
				position: 'is-top',
				type: 'is-danger',
				queue: false,
			});
		},
	},
});
