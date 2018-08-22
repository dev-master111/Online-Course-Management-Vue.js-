<template>
	<section class="section">
		<div class="container">
			<h3 class="title is-3">
				<span v-if="isUserNew">Start Here</span>
				<span v-else>Perspectives</span>

				<button :class="{ 'button is-pulled-right button--view-type-switcher is-last': true, 'is-active': viewTypeIsGrid }" @click="setViewType('grid')">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
						<path d="M0,0v4h4V0H0z M6,0v4h4V0H6z M12,0v4h4V0H12z M0,6v4h4V6H0z M6,6v4h4V6H6z M12,6v4h4V6H12z M0,12v4h4 v-4H0z M6,12v4h4v-4H6z M12,12v4h4v-4H12z"/>
					</svg>
				</button>

				<button :class="{ 'button is-pulled-right button--view-type-switcher ': true, 'is-active': !viewTypeIsGrid }" @click="setViewType('list')">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 18" width="20" height="18">
						<path d="M0,0v8h8V0H0z M10,1v2h10V1H10z M2,2h4v4H2V2z M5,4L3,3v2L5,4z M10,5v2h7V5H10z M0,10v8h8v-8H0z M10,11v2h10v-2H10z M2,12h4v4H2V12z M3,13v2l2-1L3,13z M10,15v2h7v-2H10z"/>
					</svg>
				</button>

				<span class="field is-pulled-right" @click="setGroupBy()">
					<b-switch size="is-small" v-model="grouped">Group by status</b-switch>
				</span>
			</h3>

			<div class="columns is-multiline">
				<div
					v-if="isUserNew"
					class="column"
					:class="{
						'is-4': viewTypeIsGrid,
						'is-12': !viewTypeIsGrid
					}"
				>
					<lesson :isStart="true" />
				</div>

				<template v-if="!isUserNew">
					<div :class="{ 'column': true, 'is-4': viewTypeIsGrid, 'is-12': !viewTypeIsGrid }">
						<lesson :isAddCard="true" />
					</div>

					<div :class="{ 'column': true, 'is-4': viewTypeIsGrid, 'is-12': !viewTypeIsGrid }" v-for="(lesson, index) in groupedLessons" :key="index">
						<lesson :item="lesson" v-on:lessondeleted="fetchContent()"/>
					</div>
				</template>
			</div>

			<hr>

			<h3 class="title is-3">Sample Perspectives</h3>
			<div class="columns is-multiline">
				<div :class="{ 'column': true, 'is-4': viewTypeIsGrid, 'is-12': !viewTypeIsGrid }">
					<lesson
						:item="{
							title: 'Tutorial: How to work with Vennly',
							recording: {
								transcoded: 1,
								url: '',
							},
							created_at: '2018-01-08 05:40:41',
							tags: [],
						}"
						:isExample="true"
					/>
				</div>
				<div :class="{ 'column': true, 'is-4': viewTypeIsGrid, 'is-12': !viewTypeIsGrid }">
					<lesson
						:item="{
							title: 'Tutorial: How to work with Vennly',
							recording: {
								transcoded: 1,
								url: '',
							},
							created_at: '2018-01-08 05:40:41',
							tags: [],
						}"
						:isExample="true"
					/>
				</div>
				<div :class="{ 'column': true, 'is-4': viewTypeIsGrid, 'is-12': !viewTypeIsGrid }">
					<lesson
						:item="{
							title: 'Tutorial: How to work with Vennly',
							recording: {
								transcoded: 1,
								url: '',
							},
							created_at: '2018-01-08 05:40:41',
							tags: [],
						}"
						:isExample="true"
					/>
				</div>
			</div>
		</div>
	</section>
</template>

<script>
	import orderBy from 'lodash.orderby';
	import Lesson from '@/components/dir/Lesson';
	import SiteAudio from '@/components/dir/Audio';

	export default {
		components: {
			Lesson,
			SiteAudio,
		},
		data() {
			return {
				viewTypeIsGrid: true,
				grouped: false,
				lessons: [],
			};
		},

		computed: {
			isUserNew() {
				return (this.$auth.user().pending_required_profile_fields)
					? this.$auth.user().pending_required_profile_fields.length !== 0
					: false;
			},

			groupedLessons() {
				if (this.lessons.data) {
					return (this.grouped === true)
						? orderBy(this.lessons.data, [item => ['live', 'pending', 'draft', 'denied'].indexOf(item.status), item => new Date(item.created_at)], ['asc', 'desc'])
						: this.lessons.data;
				}
				return {};
			},
		},

		methods: {
			getStatus(lesson) {
				return lesson.status;
			},

			fetchContent() {
				const loadingComponent = this.$loading.open();

				this.$http.get('profile/content')
					.then((responce) => {
						this.lessons = responce.data;
						loadingComponent.close();
					})
					.catch((error) => {
						console.log(error);
						loadingComponent.close();
					});
			},

			setViewType(type) {
				if (type === 'grid') {
					this.viewTypeIsGrid = true;
				} else {
					this.viewTypeIsGrid = false;
				}
				window.localStorage.setItem('contentViewType', type);
			},

			setGroupBy() {
				setTimeout(() => {
					window.localStorage.setItem('gropedby', this.grouped);
				}, 1000);
			},

			getViewType() {
				const view = window.localStorage.getItem('contentViewType');
				this.grouped = (window.localStorage.getItem('gropedby') === 'true');
				if (view) {
					this.setViewType(view);
				}
			},
		},

		mounted() {
			this.getViewType();
			this.fetchContent();
		},
	};
</script>

<style lang="scss" scoped>
	.title {
		.field {
			margin-right: 20px;
		}
		.button {
			position: relative;
			top: -3px;

			&.button--view-type-switcher {
				border: 0;
				background-color: transparent;
				// padding: 0;
				margin: 0 0 0 10px;
				padding: 0 10px;

				&:focus,
				&.is-focused {
					outline: none;
					box-shadow: none;
				}

				svg {
					fill: #9B9B9B;
				}

				&.is-active {
					svg {
						fill: #9B59FE;
					}
				}
			}

			&.is-last {
				margin-right: -10px;
			}
		}
	}
</style>