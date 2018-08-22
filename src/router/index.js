import Vue from 'vue';
import Router from 'vue-router';

import Tutorial from '@/components/Tutorial';
import Login from '@/components/Login';
// import Signup from '@/components/Signup';
import Forgot from '@/components/Forgot';
import Mission from '@/components/Mission';
import Terms from '@/components/Terms';
import Content from '@/components/Content';
import Edit from '@/components/Edit';
import AccountSettings from '@/components/AccountSettings';
import error404 from '@/components/error404';
import PrivacyPolicy from '@/components/PrivacyPolicy';

Vue.use(Router);

export default new Router({
	mode: 'history',
	routes: [
		{
			path: '/login',
			name: 'Login',
			component: Login,
			meta: {
				auth: false,
			},
		},
		{
			path: '/forgot-password',
			name: 'Forgot',
			component: Forgot,
			meta: {
				auth: false,
			},
		},
		{
			path: '/mission-statement',
			name: 'Mission',
			component: Mission,
			meta: {
				auth: true,
			},
		},
		{
			path: '/terms-and-conditions',
			name: 'Terms',
			component: Terms,
			meta: {
				auth: true,
			},
		},
		{
			path: '/privacy-policy',
			name: 'PrivacyPolicy',
			component: PrivacyPolicy,
			meta: {
				auth: true,
			},
		},
		{
			path: '/tutorial',
			name: 'Tutorial',
			component: Tutorial,
			meta: {
				auth: true,
			},
		},
		{
			path: '/',
			name: 'Main',
			component: Content,
			meta: {
				auth: true,
			},
			beforeRouteLeave() {
				this.$root.$emit('stopAudio');
			},
		},
		{
			path: '/account-settings',
			name: 'Account settings',
			component: AccountSettings,
			meta: {
				auth: true,
			},
		},
		{
			path: '/new',
			name: 'New',
			component: Edit,
			meta: {
				auth: true,
			},
		},
		{
			path: '/edit/:id',
			name: 'Edit',
			component: Edit,
			meta: {
				auth: true,
			},
		},
		{
			path: '/*',
			name: 'Not Found',
			component: error404,
			meta: {
				auth: false,
			},
		},
	],
});
