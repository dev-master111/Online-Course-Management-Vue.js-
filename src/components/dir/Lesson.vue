<template>
	<div class="site-lesson card">
		<div class="card-content card-content--start" v-if="isStart">
			<div>Start by setting up your account</div>
			<router-link to="account-settings">Edit profile</router-link>
		</div>

		<div class="card-content card-content--processing" v-else-if="item.recording && item.recording.processing === true">
			<b-notification :closable="false">
				<b-loading :is-full-page="false" :active="true" :canCancel="true"></b-loading>
			</b-notification>
			<h4 class="title is-4">
				{{item.title}}
			</h4>
			<div class="tags"></div>
			<div class="card-footer">
					<div class="site-lesson__status card-footer-item">
						<div :class="[`status--loading`]">
							<span>Loading...</span>
						</div>
					</div>
					<div class="site-lesson__date card-footer-item">
						<span v-if="item.created_at">{{getLocalDate(item.created_at) | getFormatedDate}}</span>
					</div>
				</div>
		</div>

		<template v-else>
			<div class="card-content card-content--new" v-if="isAddCard">
				<router-link
					to="new"
					tag="button"
					class="button is-primary"
				>
					<b-icon
						pack="mdi"
						icon="microphone"
					>
					</b-icon>
					Add perspective
				</router-link>
			</div>

			<div class="card-content" v-if="item.id || isExample">
				<site-audio
					:file="(item.recording && item.recording.transcoded === 1) ? item.recording.url : null"
					:audioduration="item.recording ? item.recording.audio_duration : 0"
				></site-audio>

				<h4 class="title is-4">
					<router-link v-if="item.id" :to="{path: `/edit/${item.id}`}">{{item.title}}</router-link>
					<span v-else>{{item.title}}</span>
				</h4>

				<div 
					class="tags"
					v-if="item.tags"
				>
					{{tagLine}}
				</div>

				<div class="card-footer">
					<div class="site-lesson__status card-footer-item">
						<div :class="[`status--${status}`]">
							<span v-if="status === 'example'">Example</span>
							<span v-else-if="status === 'pending'"><b-icon pack="mdi" icon="timer-sand-empty"></b-icon> Pending</span>
							<span v-else-if="status === 'live'">Live</span>
							<span v-else-if="status === 'denied'">Denied</span>
							<span v-else>Draft</span>
						</div>
					</div>
					<div class="site-lesson__date card-footer-item">
						<span v-if="item.created_at">{{getLocalDate(item.created_at) | getFormatedDate}}</span>

						<b-dropdown v-model="itemDD" position="is-top-left" v-if="!isExample">
							<button slot="trigger">
								<svg width="4px" height="20px" viewBox="0 0 4 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
									<g id="Screens" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
										<g id="Content" transform="translate(-484.000000, -643.000000)" fill="#9B9B9B">
											<g id="Group" transform="translate(150.000000, 124.000000)">
												<g id="Group-3" transform="translate(334.000000, 519.000000)">
													<circle id="Oval" cx="2" cy="2" r="2"></circle>
													<circle id="Oval-Copy" cx="2" cy="10" r="2"></circle>
													<circle id="Oval-Copy-2" cx="2" cy="18" r="2"></circle>
												</g>
											</g>
										</g>
									</g>
								</svg>
							</button>

							<b-dropdown-item
								custom
								v-if="status === 'live'"
								:style="{
									'display': 'flex',
									'justify-content': 'space-between'
								}"
							>
								Share
								<div class="is-on-right">
									<a href="#" target="_blank">
										<b-icon icon="facebook" pack="mdi"></b-icon>
									</a>
									<a href="#" target="_blank">
										<b-icon icon="twitter" pack="mdi"></b-icon>
									</a>
									<a href="#" target="_blank">
										<b-icon icon="twitter" pack="mdi"></b-icon>
									</a>
								</div>
							</b-dropdown-item>

							<b-dropdown-item
								:style="{
									'display': 'flex',
									'justify-content': 'space-between'
								}"
								has-link
								v-if="status === 'live'"
							>
								Embed
								<div class="is-on-right">
									<a href="#">Copy Code</a>
								</div>
							</b-dropdown-item>

							<b-dropdown-item has-link v-if="status === 'live'">
								<a href="#">See Analytics</a>
							</b-dropdown-item>

							<b-dropdown-item has-link>
								<router-link v-if="item.id" :to="{path: `/edit/${item.id}`}">Edit</router-link>
							</b-dropdown-item>


							<!-- hr class="dropdown-divider" v-if="status === 'live'" -->

							<b-dropdown-item class="has-text-danger" @click="deleteLessonDialog(item.id, item.title)">
								<strong>Delete</strong>
							</b-dropdown-item>
						</b-dropdown>
					</div>
				</div>
			</div>
		</template>
	</div>
</template>
<script>
	import dateFormat from 'dateformat';
	import moment from 'moment';
	import SiteAudio from '@/components/dir/Audio';

	export default {
		props: {
			isExample: {
				type: Boolean,
				default: false,
			},

			isStart: {
				type: Boolean,
				default: false,
			},

			isAddCard: {
				type: Boolean,
				default: false,
			},

			item: {
				type: Object,
				default() {
					return {};
				},
			},
		},

		data() {
			return {
				itemDD: [],
			};
		},

		computed: {
			tagLine() {
				const tagsList = [];
				if (this.item) {
					this.item.tags.map((item) => {
						tagsList.push(item.name);
						return true;
					});
					return tagsList.join(', ');
				}
				return tagsList;
			},

			status() {
				if (this.item.draft === 1) {
					return 'draft';
				}
				if (this.item.denied === 1) {
					return 'denied';
				}
				if (this.item.draft === 0 && this.item.published === 1) {
					return 'live';
				}
				if (this.isExample) {
					return 'example';
				}
				return 'pending';
			},
		},

		filters: {
			getFormatedDate(value) {
				// 2018-01-08 05:40:41 -> ISO format
				return dateFormat(new Date(value.replace(' ', 'T')), 'mmmm d, yyyy h:MM tt');
			},
		},

		components: {
			SiteAudio,
		},

		methods: {
			delete(id) {
				this.$http.delete(`content/${id}`)
					.then((responce) => {
						console.log(responce);
						this.$emit('lessondeleted');
					})
					.catch((error) => {
						console.log(error);
					});
			},

			deleteLessonDialog(id, name) {
				const that = this;
				this.$dialog.confirm({
					title: 'Deleting perspective',
					message: `Are you sure you want to <b class="has-text-danger">delete</b>: <b>"${name}"</b>? This action cannot be undone.`,
					confirmText: 'Delete',
					type: 'is-danger',
					hasIcon: true,
					onConfirm() {
						that.delete(id);
					},
				});
			},
			getLocalDate(utcDateString) {
				const utcDate = moment.utc(utcDateString).toDate();
				const localDate = moment(utcDate).local().format('YYYY-MM-DD HH:mm:ss');
				return localDate;
			},
		},
		mounted() {
			// console.log('Lesson: ', this.item);
		},
	};
</script>

<style lang="scss">
	.card-content--processing .media {
		height: 0px;
	}

	.card-content--processing article.notification {
		width: 100%;
		margin-bottom: 0;
	}

	.card-content--processing .loading-overlay .loading-icon:after {
		width: 30px;
		height: 30px;
		top: calc(50% - 15px);
		left: calc(50% - 15px);
		border-width: 0.15em;
	}
</style>

