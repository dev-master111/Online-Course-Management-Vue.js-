<template>
	<section class="section">
		<div class="container">
			<div class="new-lesson">
				<div class="new-lesson__title">
					<h2 class="title">
						<button class="new-lesson__back" v-if="step !== 0" @click="step = 0">
							<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 22 11" style="enable-background:new 0 0 22 11;" xml:space="preserve">
								<path id="Shape" class="st0" d="M5.5,0C5.3,0,5,0.1,4.8,0.3L0,5.5l4.8,5.2C5,11,5.4,11.1,5.7,11c0.3-0.1,0.6-0.3,0.7-0.6
									c0.1-0.3,0-0.7-0.2-0.9l-2.8-3h17.7c0.3,0,0.6-0.2,0.8-0.5C22,5.7,22,5.3,21.9,5c-0.2-0.3-0.5-0.5-0.8-0.5H3.3l2.8-3
									c0.2-0.3,0.3-0.6,0.2-1C6.2,0.2,5.9,0,5.5,0z"/>
							</svg>
						</button>
						<template v-if="step === 0">
							<span class="title-input" :class="{ 'is-focused': lessonTitleFocused }">
								<input
									v-show="lessonTitleFocused"
									ref="lessonTitleRef"
									placeholder="New Perspective"
									v-model="lessonTitle"
									:disabled="!lessonTitleFocused"
									@blur="lessonTitleBlur"
									@keydown.enter = "lessonTitleOnEnter($event)"
								/>
								<span v-show="!lessonTitleFocused">{{ lessonTitleFixed }}</span>
								<button @click="lessonTitleEdit">
									<b-icon icon="pencil"></b-icon>
								</button>
							</span>
						</template>
						<template v-else>
							Perspective Details
						</template>
					</h2>

					<div class="controls">
						<button :class="{
							'button is-default': true,
							'is-loading': isLoading && isDraft,
							}"
							:disabled="isLoading && !isDraft || isAudioRecording"
							@click="saveNewItem(true)"
						>
							Save Draft
						</button>

						<template v-if="step === 0">
							<b-tooltip
								:label="
									(recording === null && existingLessonId === 0)
										? 'You must have a recording before moving forward.'
										: (estimatedAudioLengthOverLimit) ? 'Estimated audio length is over limit.' : ''"
								type="is-dark"
							>
								<button
									class="button is-primary"
									@click="step = 1"
									:disabled="recording === null && existingLessonId === 0 || estimatedAudioLengthOverLimit"
								>
									Next
									<svg version="1.1" width="5px" height="8px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 5 8" style="enable-background:new 0 0 5 8;" xml:space="preserve">
										<polygon points="1.2,0 0,1.2 2.6,4 0,6.8 1.2,8 5,4 "/>
									</svg>
								</button>
							</b-tooltip>
						</template>
						<template v-else>
							<button
								class="button is-primary"
								:class="{
									'is-loading': isLoading && !isDraft,
								}"
								:disabled="disabledSumit || isLoading && isDraft"
								@click="saveNewItem(false)"
							>
								Submit
							</button>
						</template>
					</div>
				</div>

				<div class="new-lesson__body">
					<div class="box">
						<audio-record :audio="existingRecordUrl" v-show="step === 0" @onChangeStatus="onRecordingStatusChange" />

						<div class="columns is-gapless">
							<div class="column new-lesson__meta">
								<div :class="{'audio-length-block': true, 'has-error': estimatedAudioLengthOverLimit }" v-show="step === 0" >
									<span class="audio-length-block__audio">
										{{ estimatedAudioLength }}
									</span>
									<span class="audio-length-block__icon">
										<svg viewBox="0 0 21.9 25.1">
											<path d="M7.7,0v2.2h6.6V0H7.7z M19,1.7l-1.6,1.5l2.7,2.8l1.6-1.5L19,1.7z M10.9,3.3C4.9,3.3,0,8.2,0,14.2s4.9,10.9,10.9,10.9s10.9-4.9,10.9-10.9S17,3.3,10.9,3.3z M10.9,5.5c4.9,0,8.7,3.9,8.7,8.7S15.8,23,10.9,23s-8.7-3.9-8.7-8.7S6.1,5.5,10.9,5.5z M9.8,7.7v8.7H12V7.7H9.8z"/>
										</svg>
									</span>
									<span class="audio-length-block__max">
										(12 min max)
									</span>
									<div>Estimated audio length</div>
								</div>

								<div class="text-length-block" v-show="step === 0">
									<span class="text-length-block__count">
										{{ wordsCounter }}
									</span>
									<span class="text-length-block__icon">
										<svg viewBox="0 0 20 18">
											<path d="M0,0v2h20V0H0z M0,4v2h15V4H0z M0,8v2h20V8H0z M0,12v2h15v-2H0z M0,16v2h20v-2H0z"/>
										</svg>
									</span>
									<div>Word count</div>
								</div>

								<div
									class="record-tip record-tip--on-top"
									v-if="step === 0 && tipsArray && tipsArray['lesson-screen-one']"
								>
									<div v-for="(tip, index) in tipsArray['lesson-screen-one']" :key="index">
										<span>
											<svg width="26px" height="26px" viewBox="0 0 26 26" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
												<g id="Screens" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
													<g id="Account" transform="translate(-929.000000, -2173.000000)" fill-rule="nonzero" fill="#838486">
														<g id="Billing-details" transform="translate(540.000000, 2089.000000)">
															<g id="Tip-Copy-2" transform="translate(389.000000, 84.000000)">
																<g id="icons8-info">
																	<path d="M13,0 C5.832031,0 0,5.832031 0,13 C0,20.167969 5.832031,26 13,26 C20.167969,26 26,20.167969 26,13 C26,5.832031 20.167969,0 13,0 Z M13,2 C19.085938,2 24,6.914063 24,13 C24,19.085938 19.085938,24 13,24 C6.914063,24 2,19.085938 2,13 C2,6.914063 6.914063,2 13,2 Z M12,7 L12,9 L14,9 L14,7 L12,7 Z M12,11 L12,19 L14,19 L14,11 L12,11 Z" id="Shape"></path>
																</g>
															</g>
														</g>
													</g>
												</g>
											</svg>
											{{ tip.title }}
										</span>
										<p>{{ tip.description }}</p>
									</div>
								</div>

								<div
									class="record-tip"
									v-if="step !== 0 && tipsArray && tipsArray['lesson-screen-two']"
									v-for="(tip, index) in tipsArray['lesson-screen-two']"
									:key="index"
								>
									<span>
										<svg width="26px" height="26px" viewBox="0 0 26 26" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
											<g id="Screens" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
												<g id="Account" transform="translate(-929.000000, -2173.000000)" fill-rule="nonzero" fill="#838486">
													<g id="Billing-details" transform="translate(540.000000, 2089.000000)">
														<g id="Tip-Copy-2" transform="translate(389.000000, 84.000000)">
															<g id="icons8-info">
																<path d="M13,0 C5.832031,0 0,5.832031 0,13 C0,20.167969 5.832031,26 13,26 C20.167969,26 26,20.167969 26,13 C26,5.832031 20.167969,0 13,0 Z M13,2 C19.085938,2 24,6.914063 24,13 C24,19.085938 19.085938,24 13,24 C6.914063,24 2,19.085938 2,13 C2,6.914063 6.914063,2 13,2 Z M12,7 L12,9 L14,9 L14,7 L12,7 Z M12,11 L12,19 L14,19 L14,11 L12,11 Z" id="Shape"></path>
															</g>
														</g>
													</g>
												</g>
											</g>
										</svg>
										{{ tip.title }}
									</span>
									<p>{{ tip.description }}</p>
								</div>
							</div>
							<div :class="{
								'column': true,
								'column--width-content': true,
								'column--width-content-padded': step != 0,
							}">
								<quill-editor
									v-show="step === 0" 
									v-model="transcription"
									:options="editorOption"
									@change="countWords($event)"
								></quill-editor>

								<div class="new-lesson__details account-details" v-show="step !== 0">
									<b-field label="Title *">
										<b-input v-model="lesson.title" placeholder="Enter title" required ref="title"></b-input>
									</b-field>

									<div class="field">
										<label class="label">Keywords</label>
										<div class="control is-clearfix">
											<tags :selected="lesson.keywords" />
										</div>
									</div>

									<b-field label="Description *">
										<b-input v-model="lesson.description" maxlength="500" type="textarea" placeholder="Enter description" ref="description"></b-input>
									</b-field>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="new-lesson__footer" v-if="existingLessonId !== 0">
					<button class="button is-default is-rounded is-delete" @click="deleteLessonDialog(existingLessonId, lesson.title)">Delete</button>
				</div>

				<b-modal :active.sync="modals.notify" :width="480" scroll="keep" ref="notify">
					<div class="card">
						<button class="modal-close is-large" @click="modals.notify=false"></button>
						<div class="card-image">
							<svg viewBox="0 0 100 100">
								<path d="M43.1,66.7c-2,0-3.9-0.8-5.4-2.3l-9.4-9.4c-1.5-1.5-1.5-3.9,0-5.4l0,0c1.5-1.5,3.9-1.5,5.4,0l6.6,6.6c1.5,1.5,3.9,1.5,5.4,0L66.2,36c1.5-1.5,3.9-1.5,5.4,0l0,0c1.5,1.5,1.5,3.9,0,5.4L48.6,64.5C47.1,66,45.1,66.7,43.1,66.7z" />
								<path d="M50,100c-3.5,0-6.8-1.6-9-4.4c-3.2,1.7-6.9,2-10.1,0.6c-3.3-1.4-5.7-4.1-6.6-7.5
									c-3.6,0.4-7.1-0.8-9.6-3.3s-3.7-6-3.3-9.5c-3.5-1-6.2-3.5-7.6-6.7c-1.4-3.3-1.1-6.9,0.6-10C1.6,56.8,0,53.5,0,50s1.6-6.8,4.4-9
									c-1.7-3.2-2-6.9-0.6-10.1c1.4-3.3,4.1-5.7,7.5-6.6c-0.4-3.6,0.8-7.1,3.3-9.6s6-3.7,9.5-3.3c1-3.5,3.5-6.2,6.7-7.6
									c3.3-1.3,6.9-1.1,10,0.6C43.2,1.6,46.5,0,50,0s6.8,1.6,9,4.4c3.2-1.7,6.9-2,10.1-0.6c3.3,1.4,5.7,4.1,6.6,7.5
									c3.6-0.4,7.1,0.8,9.6,3.3c2.5,2.5,3.7,6,3.3,9.5c3.5,1,6.2,3.5,7.6,6.7c1.4,3.3,1.1,6.9-0.6,10c2.8,2.3,4.4,5.6,4.4,9.1
									s-1.6,6.8-4.4,9c1.7,3.2,2,6.8,0.6,10.1c-1.4,3.3-4.1,5.7-7.5,6.6c0.4,3.6-0.8,7.1-3.3,9.6c-2.5,2.5-6,3.7-9.5,3.3
									c-1,3.5-3.5,6.2-6.7,7.6c-3.3,1.4-6.9,1.1-10-0.6C56.8,98.4,53.5,100,50,100z M40.9,91.7c1.2,0,2.3,0.5,3.1,1.5
									c1.5,1.9,3.7,2.9,6,2.9s4.5-1.1,6-2.9c1.2-1.5,3.3-2,5-1c2.1,1.2,4.5,1.3,6.7,0.4c2.2-0.9,3.8-2.7,4.4-5c0.5-1.9,2.3-3.1,4.2-2.8
									c2.4,0.3,4.7-0.5,6.3-2.2c1.7-1.7,2.4-4,2.2-6.3c-0.2-1.9,1-3.7,2.8-4.2c2.3-0.6,4.1-2.3,5-4.4c0.9-2.2,0.7-4.6-0.4-6.7
									c-1-1.7-0.5-3.8,1-5c1.9-1.5,2.9-3.7,2.9-6s-1.1-4.5-2.9-6c-1.5-1.2-1.9-3.3-1-5c1.2-2.1,1.3-4.5,0.4-6.7c-0.9-2.2-2.7-3.8-5-4.4
									c-1.9-0.5-3.1-2.3-2.8-4.2c0.3-2.4-0.5-4.7-2.2-6.3c-1.7-1.7-4-2.4-6.3-2.2c-1.9,0.2-3.7-1-4.2-2.8c-0.6-2.3-2.3-4.1-4.4-5
									c-2.2-0.9-4.6-0.7-6.7,0.4c-1.7,0.9-3.8,0.5-5-1c-1.5-1.9-3.7-2.9-6-2.9s-4.5,1.1-6,2.9c-1.2,1.5-3.3,2-5,1
									c-2.1-1.2-4.5-1.3-6.7-0.4c-2.2,0.9-3.8,2.7-4.4,5c-0.5,1.9-2.3,3.1-4.2,2.8c-2.4-0.3-4.7,0.5-6.3,2.2c-1.7,1.7-2.4,4-2.2,6.3
									c0.2,1.9-1,3.7-2.8,4.2c-2.3,0.6-4.1,2.3-5,4.4c-0.9,2.2-0.7,4.6,0.4,6.7c1,1.7,0.5,3.8-1,5c-1.9,1.5-2.9,3.7-2.9,6s1.1,4.5,2.9,6
									c1.5,1.2,1.9,3.3,1,5c-1.2,2.1-1.3,4.5-0.4,6.7c0.9,2.2,2.7,3.8,5,4.4c1.9,0.5,3.1,2.3,2.8,4.2c-0.3,2.4,0.5,4.7,2.2,6.3
									s4,2.4,6.3,2.2c1.9-0.2,3.7,1,4.2,2.8c0.6,2.3,2.3,4.1,4.4,5c2.2,0.9,4.6,0.7,6.7-0.4C39.6,91.9,40.3,91.7,40.9,91.7z"/>
							</svg>
						</div>

						<div class="card-content">
							<div class="content">
								<h4 class="title is-4">We received your contribution!</h4>
								<p>Your content is being reviewed by our team, we will notify you once it's been approved.</p>
								<button class="button is-primary" @click="savingDone">Ok</button>
							</div>
						</div>
					</div>
				</b-modal>

				<b-modal :active.sync="modals.draft" :width="480" scroll="keep" ref="draft">
					<div class="card account-details">
						<button class="modal-close is-large" @click="modals.draft = false"></button>
						<div class="card-image"></div>
						<div class="card-content">
							<div class="content">
								<h4 class="title is-4">Name for draft recording:</h4>
								<b-field>
									<b-input v-model="fakeTitle" placeholder="Enter title" maxlength="100"></b-input>
								</b-field>
								<button class="button is-primary" @click="draftdone" :disabled="isAudioRecording">Save draft</button>
							</div>
						</div>
					</div>
				</b-modal>
			</div>
		</div>
	</section>
</template>

<script>
/* eslint-disable quote-props */
/* eslint-disable max-len */
import AudioRecord from '@/components/dir/AudioRecord';
import Tags from '@/components/dir/Tags';

import Quill from 'quill';
import { quillEditor } from 'vue-quill-editor';

const icons = Quill.import('ui/icons');
icons.bold = '<svg viewBox="0 0 9.4 12.3"><path d="M7.5,6C8.4,5.4,9,4.4,9,3.5C9,1.5,7.5,0,5.5,0H0v12.3h6.2c1.9,0,3.3-1.5,3.3-3.3C9.4,7.7,8.6,6.5,7.5,6L7.5,6zM2.6,2.2h2.6c0.7,0,1.3,0.6,1.3,1.3c0,0.7-0.6,1.3-1.3,1.3H2.6V2.2L2.6,2.2z M5.6,10.1H2.6V7.5h3.1C6.3,7.5,7,8.1,7,8.8S6.4,10.1,5.6,10.1L5.6,10.1z"/></svg>';
icons.italic = '<svg viewBox="0 0 10.6 12.3"><polygon points="3.5,0 3.5,2.6 5.5,2.6 2.4,9.7 0,9.7 0,12.3 7,12.3 7,9.7 5,9.7 8.1,2.6 10.6,2.6 10.6,0"/></svg>';
icons.underline = '<svg viewBox="0 0 13 17"><path d="M6.6,13c2.9,0,5.3-2.4,5.3-5.3v-7H9.6v7c0,1.7-1.4,3.1-3.1,3.1S3.5,9.4,3.5,7.7v-7H1.3v7C1.3,10.6,3.6,13,6.6,13L6.6,13z M0.4,14.8v1.8h12.3v-1.8H0.4L0.4,14.8z"/></svg>';
icons.align[''] = '<svg viewBox="0 0 15.9 15.7"><path d="M10.6,10.4H0v1.7h10.6V10.4L10.6,10.4z M10.6,3.5H0v1.7h10.6V3.5L10.6,3.5z M0,8.7h15.9V7H0V8.7L0,8.7z M0,15.7h15.9v-1.7H0V15.7L0,15.7z M0,0v1.7h15.9V0H0L0,0z"/></svg>';
icons.align.center = '<svg viewBox="0 0 15.9 15.7"><path d="M3.5,10.4v1.7h8.8v-1.7H3.5L3.5,10.4z M0,15.7h15.9v-1.7H0V15.7L0,15.7z M0,8.7h15.9V7H0V8.7L0,8.7z M3.5,3.5v1.7h8.8V3.5H3.5L3.5,3.5z M0,0v1.7h15.9V0H0L0,0z"/></svg>';
icons.align.right = '<svg viewBox="0 0 15.9 15.7"><path d="M0,15.7h15.9v-1.7H0V15.7L0,15.7z M5.3,12.2h10.6v-1.7H5.3V12.2L5.3,12.2z M0,8.7h15.9V7H0V8.7L0,8.7z M5.3,5.2h10.6V3.5H5.3V5.2L5.3,5.2z M0,0v1.7h15.9V0H0L0,0z"/></svg>';
icons.align.justify = '<svg viewBox="0 0 15.9 15.7"><path d="M0,15.7h15.9v-1.7H0V15.7L0,15.7z M0,12.2h15.9v-1.7H0V12.2L0,12.2z M0,8.7h15.9V7H0V8.7L0,8.7zM0,5.2h15.9V3.5H0V5.2L0,5.2z M0,0v1.7h15.9V0H0L0,0z"/></svg>';

const editorOption = {
	placeholder: 'Type your transcript here',
	modules: {
		toolbar: [
			[{ 'header': [1, 2, 3, 4, false] }],
			['bold', 'italic', 'underline'],
			[{ 'align': [] }],
		],
	},
};

export default {
	components: {
		AudioRecord,
		quillEditor,
		Tags,
	},

	data() {
		return {
			existingLessonId: (this.$route.params.id) ? parseInt(this.$route.params.id, 10) : 0,
			existingRecordUrl: '',
			step: 0,
			isLoading: false,
			isDraft: false,
			modals: {
				notify: false,
				draft: false,
			},
			fakeTitle: '',
			lessonTitleFocused: false,
			contenteditable: false,
			lesson: {
				title: '',
				keywords: [],
				description: '',
			},
			transcription: '',
			wordsCounter: 0,
			voiceSpeed: 'medium', // slow, medium, fast
			editorOption,
			estimatedAudioLengthOverLimit: false,
			isAudioRecording: false,
		};
	},

	computed: {
		tipsArray() {
			return this.$store.state.tips;
		},

		disabledSumit() {
			return ((this.recording !== null && (this.existingLessonId === 0 && this.existingRecordUrl !== ''))
				/* || (this.recording === null && this.existingLessonId === 0 && this.lesson.title) */);
		},

		lessonTitle: {
			set(newValue) {
				this.fakeTitle = newValue;
				this.lesson.title = newValue;
			},
			get() {
				setTimeout(() => {
					this.resizeTitle(this.$refs.lessonTitleRef, 18);
				}, 50);
				return this.lesson.title;
			},
		},

		lessonTitleFixed() {
			const title = this.lessonTitle;
			if (title === '') {
				return 'New Perspective';
			}

			if (title.length > 40) {
				return `${title.substr(0, 40)}...`;
			}

			return title;
		},

		recording() {
			return this.$store.state.recording;
		},

		recordingLength() {
			const recordingLengthSecs = this.$store.state.recordingLength;
			return parseInt(recordingLengthSecs / 60, 10);
		},

		estimatedAudioLength() {
			let totalTimeSec = 0;
			let totalTimeMin = 0;
			// let totalTimeHour = 0;

			if (this.voiceSpeed === 'fast') {
				totalTimeSec = Math.round(this.wordsCounter * 0.3325);
			} else if (this.voiceSpeed === 'slow') {
				totalTimeSec = Math.round(this.wordsCounter * 0.4278);
			} else { // medium by default
				totalTimeSec = Math.round(this.wordsCounter * 0.374);
			}

			if (totalTimeSec === 0) {
				this.estimatedAudioLengthOverLimit = false;
				return '0 min';
			}

			let timeString = `${totalTimeSec}  sec`;

			if (totalTimeSec > 60) {
				totalTimeMin = Math.floor(totalTimeSec / 60);
				totalTimeSec %= 60;
				if (totalTimeMin > 12 && totalTimeSec > 0) {
					this.estimatedAudioLengthOverLimit = true;
				} else {
					this.estimatedAudioLengthOverLimit = false;
				}
				timeString = `${totalTimeMin} min`;
			}

			return timeString;
		},
	},

	methods: {
		resizeTitle(el, int) {
			/* eslint-disable no-param-reassign */
			el.style.width = `${((el.value.length + 1) * int)}px`;
			/* eslint-enable no-param-reassign */
		},

		resizable(el, factor) {
			/* eslint-disable no-param-reassign */
			const int = Number(factor) || 7.7;
			const e = 'keyup,keypress,blur,change'.split(',');
			e.forEach((item) => {
				el.addEventListener(item, () => {
					this.resizeTitle(el, int);
				}, false);
			});
			this.resizeTitle(el, int);
			/* eslint-enable no-param-reassign */
		},

		resetRecording() {
			if (this.recording !== null) {
				this.$store.commit('storeRecording', null);
			}
		},

		getKeywords(tags) {
			const that = this;
			if (tags.length > 0) {
				tags.forEach((item) => {
					that.lesson.keywords.push(item.name);
				});
			}
		},

		fetchLesson(id) {
			if (id !== 0) {
				this.$http.get(`content/${id}`)
					.then((responce) => {
						// console.log(responce.data);
						this.lesson.title = responce.data.title;
						this.getKeywords(responce.data.tags);
						this.lesson.description = (responce.data.description !== null) ? responce.data.description : '';
						this.transcription = (responce.data.recording !== null && responce.data.recording.transcription) ? responce.data.recording.transcription : '';
						this.existingRecordUrl = (responce.data.recording !== null && responce.data.recording.url) ? responce.data.recording.url : '';
					})
					.catch((error) => {
						// console.log(error);
						this.$root.catchError(error.response.data);
					});
			}
		},

		countWords(event) {
			let text = event.text;
			text = text.trim();
			this.wordsCounter = text.length > 0 ? text.split(/\s+/).length : 0;
		},

		generateFakeTitle() {
			const now = new Date();
			const ampm = now.getHours() >= 12 ? 'pm' : 'am';

			// let seconds = now.getSeconds();
			// seconds = seconds < 10 ? `0${seconds}` : seconds;

			let minutes = now.getMinutes();
			minutes = minutes < 10 ? `0${minutes}` : minutes;

			let hours = now.getHours() % 12;
			hours = hours || 12;

			let datee = now.getDate();
			datee = datee < 10 ? `0${datee}` : datee;

			let month = now.getMonth() + 1;
			month = month < 10 ? `0${month}` : month;

			this.fakeTitle = `${month}/${datee}/${now.getFullYear()} ${hours}:${minutes}${ampm}`;
			this.lesson.title = this.fakeTitle;
		},

		saveNewItem(isDraft) {
			const that = this;
			console.log(isDraft);
			this.isDraft = isDraft;
			this.isLoading = true;
			this.existingLessonId = (this.$route.params.id) ? parseInt(this.$route.params.id, 10) : 0;

			// Setting pre-filled title when saving as draft and no title detected
			if (this.isDraft && this.lesson.title === '') {
				this.generateFakeTitle();
				this.modals.draft = true;
				this.isLoading = false;
				return false;
			} else if (!this.isDraft && this.lesson.title === '') {
				this.$refs.title.focus();
				this.isLoading = false;
				return false;
			} else if (!this.isDraft && this.lesson.description === '') {
				this.$refs.description.focus();
				this.isLoading = false;
				return false;
			}

			const formData = new FormData();

			// Prevent sending null recording
			if (that.recording !== null) {
				const fileType = this.recording.type.split('/')[1];
				const fileName = `recording.${fileType}`;
				formData.append('recording', this.recording, fileName);
			}

			formData.append('title', this.lesson.title);
			formData.append('description', this.lesson.description);
			formData.append('transcription', this.transcription);
			formData.append('tags', this.lesson.keywords);
			formData.append('draft', (this.isDraft) ? 1 : 0);

			const saveToUrl = (this.existingLessonId) ? `content/${this.existingLessonId}` : 'content';

			this.$http({
				method: 'post',
				url: saveToUrl,
				headers: {
					'Content-type': 'application/x-www-form-urlencoded',
				},
				data: formData,
			})
				.then((responce) => {
					that.savedId = responce.data.id;
					that.isLoading = false;
					that.resetRecording();
				})
				.then(() => {
					if (!that.isDraft) {
						that.modals.notify = true;
					} else {
						that.$toast.open({
							duration: 5000,
							message: 'Draft saved',
							position: 'is-top',
							type: 'is-success',
						});
						that.$router.push({ path: `/edit/${that.savedId}` });
					}
					that.isDraft = false;
				})
				.catch((error) => {
					console.log(error);
					that.isLoading = false;
					that.isDraft = false;
					that.$root.catchError(error.data);
				});
			return true;
		},

		lessonTitleOnEnter(e) {
			e.preventDefault();
			this.lessonTitleBlur();
		},

		done() {
			const that = this;
			this.modals.notify = false;
			this.$router.push({ path: `/edit/${that.sevedId}`, meta: { noConfirm: true } });
		},

		draftdone() {
			this.lesson.title = this.fakeTitle;
			this.$refs.draft.$emit('close');
			this.modals.draft = false;
			this.saveNewItem(true);
		},

		savingDone() {
			this.$refs.notify.$emit('close');
			this.modals.notify = false;
			this.$router.push({ path: '/' });
		},

		lessonTitleEdit() {
			const input = this.$refs.lessonTitleRef;
			this.lessonTitleFocused = true;

			setTimeout(() => input.focus(), 1);
		},

		lessonTitleBlur() {
			// const input = this.$refs.lessonTitleRef;
			// this.lessonTitle = input.textContent;
			this.lessonTitleFocused = false;
		},

		doneEnterTitle() {
			const input = this.$refs.lessonTitleRef;
			input.blur();
		},

		delete(id) {
			this.$http.delete(`content/${id}`)
				.then(() => {
					// console.log(responce);
					this.$emit('lessondeleted');
					this.$router.push({ path: '/' });
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

		eventFire(el, etype) {
			if (el.fireEvent) {
				el.fireEvent(`on${etype}`);
			} else {
				const evObj = document.createEvent('Events');
				evObj.initEvent(etype, true, false);
				el.dispatchEvent(evObj);
			}
		},

		onRecordingStatusChange(isRecording) {
			this.isAudioRecording = isRecording;
		},
	},

	mounted() {
		this.resizable(this.$refs.lessonTitleRef, 18);

		// console.log('Edit.vue mounted');
		this.resetRecording();

		// Fetch lesson data if lesson id exist
		if (this.existingLessonId !== 0) {
			this.fetchLesson(this.existingLessonId);
		}

		this.$router.beforeEach((to, from, next) => {
			// const isNew = (from.name === 'New');
			// const isEdit = (from.name === 'Edit');

			document.body.className = document.body.className.replace('is-noscroll', ' ');

			// console.log(this.recording);

			// if ((isNew || isEdit) && this.recording !== null) {
			// 	this.$snackbar.open({
			// 		duration: 8000,
			// 		message: 'Are you sure you want to leave? You will lose recorded data.',
			// 		type: 'is-danger',
			// 		position: 'is-top',
			// 		actionText: 'LEAVE',
			// 		onAction: () => {
			// 			this.$root.$emit('stopAudio');
			// 			next();
			// 		},
			// 	});
			// } else {
			// 	this.$root.$emit('stopAudio');
			// 	next();
			// }
			this.$root.$emit('stopAudio');
			next();
		});
	},
};
</script>

<style lang="scss" scoped>
	.title-input {
		display: flex;
		align-items: center;
		font-size: 0;
		height: 44px;
		width: 100%;
		padding-right: 25px;
		max-width: 100%;

		> input,
		> span {
			font-family: "Montserrat", sans-serif;
			font-weight: 700;
			color: #1B1B1B;
			font-size: 26px;
			padding: 5px 0px 5px 0;
			margin-left: 0px;
			border: solid 1px transparent;
			background-color: transparent;
			cursor: default;
			display: inline-block;
			line-height: 1.3;
			white-space: nowrap;
			max-width: 100%;
			overflow: hidden;

			min-width: 220px!important;
			max-width: 99.99%!important;
			// transition: width 0.25s;

			&:focus {
				// margin-left: -20px;
				padding: 5px 20px 5px 20px;
				border: solid 1px #ccc;
				background-color: white;
				width: 99.99% !important;
			}
		}

		&:hover {
			button {
				opacity: 1;
			}
		}

		&.is-focused {
			button {
				display: none;
			}
		}
		button {
			opacity: 0;
			padding: 5px;
			margin: 0;
			border: 0;
			color: #838486;
			cursor: pointer;
			background-color: transparent;

			&:hover {
				color: #25B0F0;
			}
		}
	}
</style>