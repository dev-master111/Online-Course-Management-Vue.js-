<template>
	<div
		id="app"
		:class="{
			'is-not-auth': !isAuth
		}"
	>
		<template v-if="$auth.ready()">
			<site-header />
			<router-view :key="$route.fullPath" />
			<site-footer />
		</template>

		<div v-if="!$auth.ready()">
			Site loading...
		</div>

		<button
			v-if="false"
			class="button"
			style="position: fixed; z-index: 10001; right: 50px; bottom: 50px;"
			@click="clearSession()"
		>Clear session</button>
	</div>
</template>

<script>
import SiteHeader from '@/components/Header';
import SiteFooter from '@/components/Footer';

export default {
	components: {
		SiteHeader,
		SiteFooter,
	},
	name: 'app',
	computed: {
		isAuth() {
			return this.$auth.ready() && this.$auth.check();
		},
	},
	methods: {
		loadUserFromLocalStorage() {
			let user = window.localStorage.getItem('userData');
			if (user) {
				user = JSON.parse(user);
				this.$auth.user(user);
			}
		},

		clearSession() {
			this.$http.post('session/invalidate')
				.then((response) => {
					console.log(response);
				})
				.catch((error) => {
					console.log(error);
				});
		},
	},
	created() {
		// console.log()
	},
	mounted() {
		this.loadUserFromLocalStorage();
		this.$store.commit('storeTips');
	},
};
</script>

<style lang="scss">
	@import './assets/scss/main.scss';
</style>