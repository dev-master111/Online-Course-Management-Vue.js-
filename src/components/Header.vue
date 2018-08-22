<template>
	<nav class="site-header navbar" role="navigation" aria-label="main navigation">
		<div class="container is-fluid">
			<div class="navbar-brand" >
				<router-link class="site-logo navbar-item" to="/">
					<logo />
				</router-link>
	
				<!-- button class="button navbar-burger">
					<span></span>
					<span></span>
					<span></span>
				</button -->
			</div>

			<b-dropdown position="is-bottom-left" v-if="$auth.ready() && $auth.check()">
				<button class="button is-default button--user" slot="trigger">
					<div
						class="button--user__photo"
						:style="{
							backgroundImage: `url('${avatar}')`
						}"
					></div>
					<span v-if="$auth.user().first_name && $auth.user().last_name">{{$auth.user().first_name}} {{$auth.user().last_name.charAt(0)}}.</span>
					<b-icon icon="menu-down"></b-icon>
				</button>

				<b-dropdown-item has-link>
					<router-link to="/">
						<b-icon icon="view-dashboard"></b-icon> Dashboard
					</router-link>
				</b-dropdown-item>
				<b-dropdown-item has-link>
					<a href="/new" @click.prevent="pushNew()" v-if="!isUserNew">
						<b-icon icon="plus-box"></b-icon> Create new perspective
					</a>
				</b-dropdown-item>
				<b-dropdown-item has-link>
					<router-link to="/account-settings">
						<b-icon icon="account-settings-variant"></b-icon> Account settings
					</router-link>
				</b-dropdown-item>
				<b-dropdown-item has-link>
					<router-link to="/tutorial">
						<b-icon icon="help-box"></b-icon> Tutorial
					</router-link>
				</b-dropdown-item>
				<b-dropdown-item has-link>
					<a href="mailto:support@bevennly.com">
						<b-icon icon="email-outline"></b-icon> Contact Us
					</a>
				</b-dropdown-item>
				<hr class="dropdown-divider">
				<b-dropdown-item v-on:click="logout"><b-icon icon="logout-variant"></b-icon> Logout</b-dropdown-item>
			</b-dropdown>
		</div>
	</nav>
</template>

<script>
import Logo from '@/components/dir/Logo';

export default {
	components: {
		Logo,
	},
	computed: {
		avatar() {
			return this.$auth.user().profile_image_url || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60.7 57.7"%3E%3Cpath fill="%23D8D8D8" d="M2.8,55.8c1.7-0.9,3.5-1.9,5.2-2.7c1.7-0.8,3.5-1.5,5.3-2.3c1.7-0.7,3.3-1.4,5-2.1c0.3-0.1,0.6-0.4,0.7-0.7 c0.4-0.9,0.7-1.9,1-2.8c0.2-0.7,0.4-1.4,1.3-1.6c0.2,0,0.5-0.4,0.6-0.7c0.2-1.4,0.3-2.8,0.4-4.2c0-0.3-0.1-0.7-0.3-0.9 c-1.2-1.4-1.9-2.9-2.2-4.8c-0.1-0.9-0.6-1.8-0.9-2.6c-0.3-1.2-0.6-2.4-0.9-3.6c-0.1-0.4,0-0.9-0.1-1.4c-0.1-0.7-0.1-1.2,0.7-1.4 c0.2-0.1,0.4-0.6,0.4-0.9c0-1.9,0-3.9,0-5.8c0-1.2,0-2.4,0.1-3.6c0.2-2.3,1.5-3.9,3.2-5.3c2.5-2,5.4-3,8.4-3.7 c1.6-0.4,3.2-0.6,4.8-0.9c0.4-0.1,0.9,0,1.3,0C36.8,3.8,36.9,3.9,37,4c-0.3,0.2-0.7,0.4-1,0.7c-0.7,0.7-0.6,1.1,0.1,1.7 c1.5,1.2,2.9,2.5,4.3,3.7c1.2,1.1,1.7,2.6,1.7,4.2c0,2.8,0,5.7,0,8.5c0,0.6,0,1.2,0.7,1.4c0.2,0.1,0.3,0.4,0.3,0.6 c-0.1,1.5-0.3,2.9-0.4,4.4c0,0.1,0,0.1,0,0.2c-1.3,1.9-1.5,4.2-2.4,6.3c0,0.1-0.1,0.2-0.1,0.2c-1.7,2-1.2,4.5-1.2,6.8 c0,0.2,0.2,0.6,0.4,0.7c0.7,0.3,0.9,0.9,1.1,1.6c0.3,1,0.6,2,1,3c0.2,0.4,0.6,0.7,1,0.8c5.3,2,10.6,4.2,15.7,6.8 c1,0.5,1.9,1.2,2.6,1.9V0C40.5,0,20.2,0,0,0v57.7C0.8,56.9,1.8,56.3,2.8,55.8z"/%3E%3C/svg%3E%0A';
		},
		isUserNew() {
			if (this.$auth.user().pending_required_profile_fields) {
				return this.$auth.user().pending_required_profile_fields.length !== 0;
			}
			return false;
		},
	},
	methods: {
		pushNew() {
			this.$router.push('/');
			setTimeout(() => {
				this.$router.push('/new');
			}, 100);
		},
		logout() {
			this.$auth.logout({
				success() {
					window.localStorage.removeItem('userData');
				},
				redirect: '/login',
			});
		},
	},
	mounted() {
		// console.log(this.avatar);
	},
};
</script>
