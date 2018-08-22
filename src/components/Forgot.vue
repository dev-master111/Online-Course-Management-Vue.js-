<template>
	<section class="section section--content-middle">
		<div class="container">
			<div class="site-login">
				<h1 class="title is-1">Forgot Password?</h1>
				<h4 class="subtitle">Please enter your email address to retrieve your password.</h4>
				<div class="site-login__form">
					<b-field>
						<b-input 
							type="email"
							v-model="email"
							placeholder="E-mail"
							autocomplete="off"
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
							:disabled="email === ''"
							@click="resetPassword"
						>
							Send Reset Link
						</button>
					</div>
				</div>
				<router-link tag="a" to="login" class="link--forgot">Login</router-link>
			</div>
		</div>
	</section>
</template>

<script>
	export default {
		data() {
			return {
				email: '',
				isLoading: false,
			};
		},
		methods: {
			resetPassword() {
				this.isLoading = true;
				this.$http.post('password/email', {
					email: this.email,
				}).then((responce) => {
					this.isLoading = false;

					if (!responce.data.success) {
						this.$root.catchError({ message: responce.data.message });
						return;
					}

					this.$router.push({ path: '/login' });

					// Welcome message
					this.$toast.open({
						duration: 5000,
						message: responce.data.message,
						position: 'is-top',
						type: 'is-success',
					});
				}).catch((error) => {
					this.isLoading = false;
					this.$root.catchError(error);
				});
			},
		},
	};
</script>