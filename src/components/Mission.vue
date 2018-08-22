<template>
	<section class="section section--content-middle has-text-centered">
		<div class="container">
			<div class="site-mission-statement">
				<h1 class="title is-1">Mission Statement</h1>
				<p class="subtitle">
					Bringing wisdom and inspiration to those who seek it.
				</p>
				<div class="title"></div>
				<p class="subtitle">
					Our mission is to create an inclusive community where individuals can explore spirituality through the perspective of faith and spiritual leaders of different backgrounds and denominations.
				</p>
				<div class="control">
					<router-link v-if="isOnboarding" :to="{ path: '/terms-and-conditions' }" tag="a" class="button is-primary">
						Yes, I'd like to join the vennly community
					</router-link>
					<router-link v-else :to="{ path: '/' }" tag="a" class="button is-primary">
						Back To Dashboard
					</router-link>
				</div>
			</div>
		</div>
	</section>
</template>

<script>
export default {
	data() {
		return {
			step: 0,
		};
	},

	computed: {
		isOnboarding() {
			return this.$store.state.onboardingProcess;
		},
	},
};
</script>
