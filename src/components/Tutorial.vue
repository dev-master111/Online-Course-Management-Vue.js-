<template>
	<section class="section section--content-middle has-text-centered">
		<div class="container">
			<div class="site-tutorial">
				<h1 class="title is-1" v-if="tutorialSteps.length > 0">{{tutorialSteps[currentStep].title}}</h1>
				<h6 class="subtitle">{{currentStep + 1}} of 5</h6>
				<div class="vennly-videos" v-if="tutorialSteps.length > 0">
					<transition name="fade" mode="in-out" :key="n" v-for="n in 5">
						<site-video
							v-show="currentStep === n - 1"
							:sources="[{ src: tutorialSteps[n - 1].url }]"
							:options="{ poster: tutorialSteps[n - 1].poster }"
						/>
					</transition>
				</div>
				<div class="control field has-addons">
					<button class="button is-primary is-go-back"
						v-if="currentStep > 0"
						@click="prevStep"
					>
						<svg width="7px" height="11px" viewBox="0 0 7 11" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
							<g id="Screens" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
								<g id="Home" transform="translate(-748.000000, -682.000000)" fill="#FFFFFF">
									<g id="Group-5" transform="translate(384.000000, 278.000000)">
										<g id="Group-4" transform="translate(146.000000, 377.000000)">
											<g id="Group-6">
												<g id="Group-2" transform="translate(156.000000, 18.000000)">
													<polygon id="Arrow" points="63.6348684 9 62 10.6831897 65.7072368 14.5 62 18.3168103 63.6348684 20 69 14.5"></polygon>
												</g>
											</g>
										</g>
									</g>
								</g>
							</g>
						</svg>
						Prev
					</button>
					<button class="button is-primary"
						v-if="currentStep < tutorialSteps.length - 1"
						@click="nextStep()"
					>
						<span>Next</span>
						<svg width="7px" height="11px" viewBox="0 0 7 11" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
							<g id="Screens" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
								<g id="Home" transform="translate(-748.000000, -682.000000)" fill="#FFFFFF">
									<g id="Group-5" transform="translate(384.000000, 278.000000)">
										<g id="Group-4" transform="translate(146.000000, 377.000000)">
											<g id="Group-6">
												<g id="Group-2" transform="translate(156.000000, 18.000000)">
													<polygon id="Arrow" points="63.6348684 9 62 10.6831897 65.7072368 14.5 62 18.3168103 63.6348684 20 69 14.5"></polygon>
												</g>
											</g>
										</g>
									</g>
								</g>
							</g>
						</svg>
					</button>
					<router-link v-else tag="a" :to="{ path: '/' }" class="button is-primary"><span>Done</span></router-link>
				</div>
				<router-link :to="{ path: '/' }" class="link--skip-tutorial">Skip Tutorial</router-link>
			</div>
		</div>
	</section>
</template>

<script>
import SiteVideo from '@/components/dir/Video';

export default {
	components: {
		SiteVideo,
	},

	data() {
		return {
			currentStep: 0,
			tutorialSteps: [],
		};
	},

	computed: {
		isOnboarding() {
			return this.$store.state.onboardingProcess;
		},
	},

	created() {
		this.fetchVideos();
	},

	methods: {
		fetchVideos() {
			this.$http.get('/onboarding/videos')
				.then((response) => {
					// console.log(response);
					this.tutorialSteps = response.data;
				})
				.catch((error) => {
					console.log(error);
				});
		},

		stepChange() {
			this.$root.$emit('tutorialStepChange');
		},

		nextStep() {
			this.stepChange();
			if (this.currentStep < this.tutorialSteps.length - 1) {
				this.currentStep += 1;
			}
		},

		prevStep() {
			this.stepChange();
			if (this.currentStep > 0) {
				this.currentStep -= 1;
			} else {
				this.currentStep = this.tutorialSteps.length - 1;
			}
		},
	},
};
</script>

<style lang="scss">
	.fade-leave-to {
		opacity: 0;
		// transform: translateX(-30%);
	}
	.fade-enter {
		opacity: 0;
		// transform: translateX(30%);
	}
	.fade-leave-active {
		position: absolute;
		top: 0;
		width: 100%;
		left: 0;
		height: 100%;
		z-index: 2;
	}
</style>