<template>
	<section class="section section--content-middle">
		<div class="container">
			<div class="site-login">
				<h1 class="title is-1">Welcome to Vennly</h1>
				<h4 class="subtitle">Please enter your email and password to sign in</h4>
				<div class="site-login__form">
					<b-field>
						<b-input 
							type="email"
							v-model="login.email"
							placeholder="E-mail"
							autocomplete="off"
							@keydown.enter.native="userLogin"
						>
						</b-input>
					</b-field>
					<b-field>
						<b-input
							type="password"
							v-model="login.password"
							placeholder="Password"
							password-reveal
							@keydown.enter.native="userLogin"
						>
						</b-input>
					</b-field>
					<div class="control">
						<button
							:class="{
								'button is-primary': true,
								'is-loading': isLoading,
							}"
							:disabled="login.email === '' || login.password ===''"
							@click="userLogin"
						>
							Login
						</button>
					</div>
				</div>
				<router-link to="forgot-password" class="link--forgot">Forgot password?</router-link>
			</div>
		</div>
	</section>
</template>

<script>
export default {
	data() {
		return {
			isLoading: false,
			login: {
				email: '',
				password: '',
			},
		};
	},
	methods: {
		userLogin() {
			this.isLoading = true;

			this.$auth.login({
				data: this.login,
				rememberMe: true,
				redirect: false,
				success(response) {
					this.isLoading = false;

					let welcomeMessage = '';
					let redirectTo;

					if (response.data.is_onboarded) {
						welcomeMessage = 'Welcome to Vennly';
						redirectTo = '/';
					} else {
						this.$store.commit('storeOnboarding', true);
						welcomeMessage = 'Welcome to Vennly';
						redirectTo = '/mission-statement';
					}

					// Set user data
					this.$auth.user(response.data);
					window.localStorage.setItem('userData', JSON.stringify(response.data || '[]'));

					this.$router.push({ path: redirectTo });

					// Welcome message
					this.$toast.open({
						duration: 5000,
						message: welcomeMessage,
						position: 'is-top',
						type: 'is-success',
					});
				},
				error(error) {
					this.isLoading = false;

					this.$root.catchError(error.data);
					// console.log(errorMessage);
				},
			});
		},
	},
};
</script>