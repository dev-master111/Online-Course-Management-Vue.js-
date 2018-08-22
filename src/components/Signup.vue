<template>
	<section class="section section--content-middle">
		<div class="container">
			<div class="site-login">
				<h1 class="title is-1">Signup</h1>
				<h4 class="subtitle">Please enter your data to sign up</h4>
				<div class="site-login__form">
					<b-field>
						<b-input 
							v-model="signup.firstName"
							placeholder="First name"
							autocomplete="off"
							required
						>
						</b-input>
					</b-field>
					<b-field>
						<b-input 
							v-model="signup.lastName"
							placeholder="Last name"
							autocomplete="off"
							required
						>
						</b-input>
					</b-field>
					<b-field>
						<b-input 
							type="email"
							v-model="signup.email"
							placeholder="E-mail"
							autocomplete="off"
							required
						>
						</b-input>
					</b-field>
					<b-field>
						<b-input
							type="password"
							v-model="signup.password"
							placeholder="Password"
							password-reveal
							autocomplete="new-password"
							required
						>
						</b-input>
					</b-field>
					<div class="control">
						<button
							:class="{
								'button is-primary': true,
								'is-loading': isLoading,
							}"
							:disabled="signup.email === '' || signup.password ===''"
							@click="userLogin"
						>
							Login
						</button>
					</div>
				</div>
				Have account? <router-link to="login" class="link--forgot">Sign in</router-link>.<br />Or<br />
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
			signup: {
				firstName: '',
				lastName: '',
				email: '',
				password: '',
			},
		};
	},
	methods: {
		userLogin() {
			this.isLoading = true;

			this.$auth.register({
				data: {
					first_name: this.signup.firstName,
					last_name: this.signup.lastName,
					email: this.signup.email,
					password: this.signup.password,
				},
				success(responce) {
					console.log(responce);
					this.isLoading = false;

					this.$toast.open({
						duration: 5000,
						message: 'Welcome to Vennly.',
						position: 'is-top',
						type: 'is-success',
					});
				},
				error(error) {
					this.isLoading = false;
					let errorMessage = error.response.data.message;

					if (error.response.data.errors) {
						Object.keys(error.response.data.errors).forEach((key) => {
							// console.log(error.response.data.errors[key][0]);
							errorMessage = `${errorMessage} ${error.response.data.errors[key][0]}`;
						});
					}

					this.$toast.open({
						duration: 5000,
						message: errorMessage,
						position: 'is-top',
						type: 'is-danger',
					});
					console.log(errorMessage);
				},
				autoLogin: true,
				rememberMe: true,
				redirect: {
					name: 'account',
				},
			});
		},
	},
};
</script>