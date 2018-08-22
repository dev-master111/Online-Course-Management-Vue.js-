<template>
	<footer
		class="site-footer footer"
		:class="{
			'is-not-auth': !isAuth
		}"
	>
		<div class="container is-fluid">
			<div class="content has-text-centered">
				<nav class="breadcrumb is-small has-bullet-separator is-centered" aria-label="breadcrumbs">
					<ul>
						<li><router-link :to="{ path: '/terms-and-conditions' }">Terms and condition</router-link></li>
						<li><router-link :to="{ path: '/mission-statement' }">Mission statement</router-link></li>
						<li><router-link :to="{ path: '/privacy-policy' }">Privacy policy</router-link></li>
						<li><a href="mailto:support@bevennly.com">Contact Us</a></li>
					</ul>
				</nav>
			</div>
			<div class="content has-text-centered">
				<p>
					&copy; <span v-html="(new Date()).getFullYear()"></span> Vennly. All Rights Reserved
				</p>
			</div>
		</div>
	</footer>
</template>

<script>
export default {
	computed: {
		isAuth() {
			return this.$auth.ready() && this.$auth.check();
		},
	},
};
</script>
