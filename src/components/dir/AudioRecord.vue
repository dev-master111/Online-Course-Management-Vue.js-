<template>
	<div class="site-audio-record">
		<div class="record-lineup__mode"
			:class="{
				'is-disabled': isRecording || isWaveformLoading || (recordingData === null && audio === '')
			}">
			<b-dropdown hoverable>
				<b-switch v-model="overwriteMode" size="is-small" slot="trigger">
					Edit Mode
				</b-switch>
				<b-dropdown-item custom>
					Overwrite Mode: <strong><span v-show="overwriteMode">Active</span><span v-show="!overwriteMode">Inactive</span></strong><br/><br/>
					When <strong>active</strong>, this will allow you to overwrite the part of the audio from the start point until you end recording.<br/><br/>
					When <strong>inactive</strong>, your audio will be added to the recording starting from the time you select until you end recording
				</b-dropdown-item>
			</b-dropdown>
		</div>

		<div class="record-lineup__revert"
			v-if="!isRecording && !isWaveformLoading && (recordingData !== null && audio !== '')" @click="revert()">
				<b-tooltip label="Revert original" position="is-right" animated>
					<b-icon icon="backup-restore" size="is-small"></b-icon>
				</b-tooltip>
		</div>

		<button class="button--rec"
			:class="{
				'is-loading': callStop
			}"
			v-if="!isRecording" v-on:click.stop.prevent="startRecording()">
			<i class="record icon"></i>
		</button>

		<button class="button--rec button--rec-stop"
			:class="{
				'is-loading': callStop
			}"
			v-show="isRecording" v-on:click.stop.prevent="stopRecording()">
			<i class="stop icon"></i>
		</button>

		<div class="record-lineup"
			:class="{ 'record-lineup--loading': isWaveformLoading }">
			<div id="waveform" ref="waveform"></div>

			

			<div
				v-if="isRecording"
				class="record-lineup__message record-lineup__recording">
				Recording
				<span>
					<span class="current-time" v-html="recordTime"></span>
				</span>
			</div>

			<div
				v-if="!isRecording && !isWaveformLoading && (recordingData !== null || audio !== '')"
				class="record-lineup__message record-lineup__playing"
				@click="togglePlay"
			>
				<span v-if="wavesurfer && !wavesurfer.isPlaying()">
					<svg width="12px" height="14px" viewBox="0 0 12 14" xmlns="http://www.w3.org/2000/svg">
						<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
							<g transform="translate(-488.000000, -129.000000)" fill="#FFFFFF" fill-rule="nonzero">
								<g transform="translate(473.000000, 119.000000)">
									<g transform="translate(15.000000, 10.000000)">
										<polygon points="0 0 0 14 12 7"></polygon>
									</g>
								</g>
							</g>
						</g>
					</svg>
					Play
					<span class="current-time">{{ currentTime }}</span>
				</span>
				<span v-else>
					<svg width="12px" height="14px" viewBox="0 0 12 14" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
						<g id="Screens" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
							<g id="Record---Stop" transform="translate(-488.000000, -129.000000)" fill="#FFFFFF">
								<g id="Group-8" transform="translate(473.000000, 119.000000)">
									<g id="Group-9" transform="translate(15.000000, 10.000000)">
										<rect id="Rectangle-7" x="0" y="0" width="3" height="14"></rect>
										<rect id="Rectangle-7-Copy" x="9" y="0" width="3" height="14"></rect>
									</g>
								</g>
							</g>
						</g>
					</svg>
					Pause
					<span class="current-time">{{ currentTime }}</span>
				</span>
			</div>

			<div class="record-lineup__jump" v-if="wavesurfer && !isWaveformLoading && (recordingData !== null || audio !== '')">
				<div class="record-lineup__jump-inner">
					<button class="button is-primary" @click="wavesurfer.skipBackward()">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14.3 10" width="14.3" height="10">
							<polygon fill="#ffffff" points="7.9,0 0,5 7.9,10 7.9,5.9 14.3,10 14.3,0 7.9,4.1 "/>
						</svg>
						15 sec back
					</button>
					<button class="button is-primary" @click="wavesurfer.skipForward()">
						15 sec forward
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14.3 10" width="14.3" height="10">
							<polygon fill="#ffffff" points="6.4,0 14.3,5 6.4,10 6.4,5.9 0,10 0,0 6.4,4.1 "/>
						</svg>
					</button>
				</div>
			</div>
		</div>

		<div class="record-length" v-html="recordTime"></div>
	</div>
</template>

<script>
// import RecordRTC from 'recordrtc';
import { RecordRTCPromisesHandler } from 'recordrtc';
import WaveSurferJS from 'wavesurfer.js';
import MicrophonePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.microphone';
import RegionsPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions';
import toWav from 'audiobuffer-to-wav';
import { decode, sliceAudioBuffer, appendBuffer } from '../../helpers/audio';

/* eslint-disable no-undef */
/* eslint-disable no-alert */
/* eslint-disable max-len */

export default {
	props: {
		audio: {
			type: String,
			default: '',
		},
	},

	data() {
		return {
			isEdge: navigator.userAgent.indexOf('Edge') !== -1 && (!!navigator.msSaveOrOpenBlob || !!navigator.msSaveBlob),
			isSafari: (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)),
			microphone: null,
			recorder: null,
			wavesurfer: null,
			updateInterval: 300, // wavesurfer update interval while recording
			wavesurferSelectedTime: null,
			wavesurferRegions: null,
			regions: [],
			overwriteMode: false,
			audioRecorderMime: 'audio/wav',
			recordingData: null,
			recordingTimer: null, // setInterval
			currentPlayingSec: 0,
			callStop: false,
			timer: {
				timeBegan: null,
				timeEnd: null,
				timeStopped: null,
				stoppedDuration: 0,
				started: null,
				min: 0,
				sec: 0,
				ms: 0,
			},
			maxRecordDuration: 12 * 1000 * 60,
			recordDropdown: false,
			isWaveformLoading: false,
			isRecording: false,
		};
	},

	watch: {
		audio() {
			// Load wevasurfer for existing audio
			if (this.audio !== '') {
				this.isWaveformLoading = true;
				this.wavesurfer.load(this.audio);
			}
		},
		isRecording() {
			this.$emit('onChangeStatus', this.isRecording);
		},
	},

	computed: {
		recordTime() {
			return `<span>${this.$options.filters.padTime(this.timer.min)}</span>:<span>${this.$options.filters.padTime(this.timer.sec)}</span>:<span>${this.$options.filters.padTime(this.timer.ms)}</span>`;
		},

		currentTime() {
			const millis = this.currentPlayingSec * 1000;
			const minutes = Math.floor(millis / 60000);
			const seconds = ((millis % 60000) / 1000).toFixed(0);
			return `${this.$options.filters.padTime(minutes)}:${this.$options.filters.padTime(seconds)}`;
		},
	},

	mounted() {
		this.init();
	},

	filters: {
		padTime(value) {
			const valString = `${value}`;
			if (valString.length < 2) {
				return `0${valString}`;
			} else if (valString.length > 2) {
				return valString.substr(0, 2);
			}
			return valString;
		},

		padTimeCur(value) {
			function padTime(val) {
				const valString = `${val}`;
				if (valString.length < 2) {
					return `0${valString}`;
				} else if (valString.length > 2) {
					return valString.substr(0, 2);
				}
				return valString;
			}
			const millis = value * 1000;
			const minutes = Math.floor(millis / 60000);
			const seconds = ((millis % 60000) / 1000).toFixed(0);
			return `${padTime(minutes)}:${padTime(seconds)}`;
		},
	},
	methods: {
		init() {
			window.addEventListener('unhandledrejection', (event) => {
				console.warn('WARNING: Unhandled promise rejection. Shame on you! Reason: ', event.reason);
			});

			const that = this;

			that.wavesurfer = WaveSurferJS.create({
				container: that.$refs.waveform,
				cursorColor: '#4D2DDE',
				cursorWidth: 1.5,
				fillParent: true,
				height: that.$refs.waveform.offsetHeight,
				waveColor: '#fff',
				progressColor: 'rgba(255,255,255,.5)',
				normalize: false,
				skipLength: 15,
				plugins: [
					MicrophonePlugin.create({
						constraints: {
							video: false,
							audio: true,
						},
						bufferSize: 1024,
						numberOfInputChannels: 1,
					}),
					RegionsPlugin.create(),
				],
			});

			that.wavesurfer.on('audioprocess', (position) => {
				that.currentPlayingSec = position;
			});

			that.wavesurfer.on('seek', () => {
				that.wavesurferSelectedTime = that.wavesurfer.getCurrentTime();
			});

			that.wavesurfer.on('region-created', (regionObject) => {
				regionObject.element.removeAttribute('title');
				console.log(regionObject);

				const closeButton = document.createElement('i');
				closeButton.className = 'mdi mdi-delete';

				regionObject.element.append(closeButton);
				closeButton.addEventListener('click', () => {
					that.removeRecordedPart(regionObject);
				});
			});

			that.wavesurfer.on('ready', () => {
				if (that.isWaveformLoading) {
					that.isWaveformLoading = false;
				}

				if (!that.isRecording) {
					const dur = that.wavesurfer.getDuration();
					this.setDuration(new Date(dur * 1000));

					if (that.regions.length > 0) {
						that.updateRegions();
					} else {
						that.wavesurfer.clearRegions();
					}
				}
			});

			if (this.audio !== '') {
				this.isWaveformLoading = true;
				this.wavesurfer.load(this.audio);
			}

			this.$root.$on('stopAudio', () => {
				this.wavesurfer.stop();
			});
		},

		revert() {
			this.recordingData = null;

			// Recorder data visialisation
			this.isWaveformLoading = true;
			this.wavesurferSelectedTime = 0;
			this.regions = [];
			this.updateRegions();
			this.wavesurfer.load(this.audio);

			// Store recorder data
			this.$store.commit('storeRecording', null);
		},

		runTimer() {
			const that = this;
			that.timer.currentTime = new Date();
			const timeElapsed = new Date(that.timer.currentTime - that.timer.timeBegan - that.timer.stoppedDuration);
			this.setDuration(timeElapsed);
			if (that.timer.timeEnd === that.timer.currentTime) {
				that.stopTimer();
			}
		},

		setDuration(date) {
			this.timer.min = date.getUTCMinutes();
			this.timer.sec = date.getUTCSeconds();
			this.timer.ms = date.getUTCMilliseconds();
		},

		startTimer() {
			const that = this;
			if (that.timer.timeBegan === null) {
				that.timer.timeBegan = new Date();
				that.timer.timeEnd = new Date(that.timer.timeBegan.getTime() + (12 * 60000));

				this.recordingTimer = setInterval(() => {
					that.runTimer();
				}, 10);
			}
		},

		stopTimer() {
			clearInterval(this.recordingTimer);
			this.timer.timeBegan = null;
			this.timer.timeStopped = null;
		},

		togglePlay() {
			this.wavesurfer.playPause();
		},

		startRecording() {
			if (this.callStop) return;

			const that = this;

			// Restart if mediaDevices is not initialised
			if (!this.microphone) {
				this.captureMicrophone((mic) => {
					that.microphone = mic;
					that.startRecording();
				});
				return;
			}

			// recording options
			const options = {
				// recorderType: StereoAudioRecorder,
				type: 'audio',
				// mimeType: this.audioRecorderMime,
				numberOfAudioChannels: this.isEdge ? 1 : 2,
				checkForInactiveTracks: true,
				// audioBitsPerSecond: 128000,
				bufferSize: 1024, // 16384,
				// sampleRate: 22050,
				// desiredSampRate: 8 * 1000, // 16 * 1000,
				timeSlice: this.updateInterval,
			};

			// if (navigator.platform && navigator.platform.toString().toLowerCase().indexOf('win') === -1) {
				// options.sampleRate = 48000; // or 44100 or remove this line for default
			// }

			if (this.recorder) {
				this.recorder.recordRTC.destroy();
				this.recorder = null;
			}

			this.recorder = new RecordRTCPromisesHandler(this.microphone, options);

			this.recorder.recordRTC
				.setRecordingDuration(this.maxRecordDuration)
				.onRecordingStopped(() => {
					that.onStopRecording();
				});

			this.recorder
				.startRecording()
				.then(() => {
					that.startTimer();
					that.wavesurfer.microphone.start();
					that.isRecording = true;
				});
		},

		captureMicrophone(callback) {
			if (this.microphone) {
				callback(microphone);
				return;
			}

			if (typeof navigator.mediaDevices === 'undefined' || !navigator.mediaDevices.getUserMedia) {
				alert('This browser does not supports WebRTC getUserMedia API.');
				if (navigator.getUserMedia) {
					alert('This browser seems supporting deprecated getUserMedia API.');
				}
			}

			navigator.mediaDevices
				.getUserMedia({
					audio: this.isEdge ? true : { echoCancellation: false },
				})
					.then((mic) => {
						callback(mic);
					})
					.catch((error) => {
						alert('Unable to capture your microphone. Please check console logs.');
						console.error(error);
					});
		},

		newRegionConf(from, to) {
			function randomRgba() {
				return `rgba(${Math.round(Math.random() * 255)},${Math.round(Math.random() * 255)},${Math.round(Math.random() * 255)}, 0.3)`;
			}

			return {
				start: from,
				end: to,
				drag: false,
				resize: false,
				color: randomRgba(),
			};
		},

		addRegion(from, to) {
			this.regions.push(this.newRegionConf(from, to));
		},

		removeRegion(reg) {
			const that = this;
			if (that.regions.length > 0) {
				[].forEach.call(that.regions, (item, index) => {
					if (`ws-${index}` === reg.id) {
						console.log(that.regions);
						delete that.regions[index];
						console.log(that.regions);
					}
				});
			}
		},

		updateRegions() {
			const that = this;
			this.wavesurfer.clearRegions();
			if (this.regions.length > 0) {
				[].forEach.call(that.regions, (item, index) => {
					const i = item;
					i.id = `ws-${index}`;
					that.wavesurfer.addRegion(i);
				});
			}
		},

		async removeRecordedPart(reg) {
			this.isWaveformLoading = true;

			let slice1;
			let slice2;
			let newBlob;

			console.log(reg);
			const removeFrom = reg.start;
			const removeTo = reg.end;
			const { type } = this.recordingData;
			const oldAC = await decode(this.recordingData);
			const oldlength = oldAC.length;
			const oldduration = oldAC.duration;

			if (removeFrom !== 0 && removeTo < oldduration) {
				// eslint-disable-next-line
				slice1 = sliceAudioBuffer(oldAC, 0, ~~(oldlength * removeFrom / oldduration));
				// eslint-disable-next-line
				slice2 = sliceAudioBuffer(oldAC, ~~(oldlength * removeTo / oldduration), oldlength);
				newBlob = new Blob([toWav(appendBuffer(slice1, slice2))], { type });
			}

			if (removeFrom === 0 && removeTo < oldduration) {
				// eslint-disable-next-line
				slice1 = sliceAudioBuffer(oldAC, ~~(oldlength * removeTo / oldduration), oldlength);
				newBlob = new Blob([toWav(slice1)], { type });
			}

			if (removeFrom !== 0 && removeTo === oldduration) {
				// eslint-disable-next-line
				slice1 = sliceAudioBuffer(oldAC, 0, ~~(oldlength * removeFrom / oldduration));
				newBlob = new Blob([toWav(slice1)], { type });
			}

			this.removeRegion(reg);

			this.updateRecording(newBlob);
		},

		/* eslint-disable no-else-return */
		/* eslint-disable arrow-body-style */
		async getRecordedData() {
			const newData = this.recorder.getBlob();
			const { type } = newData;
			let oldAC;
			let newAC;
			let newrectype;

			if (this.audio === '' && this.recordingData === null) {
				console.log('Return New Recording');
				return newData;
			}

			console.log('Return New Recording');

			if (this.wavesurferSelectedTime === null) {
				newrectype = 'append';
			} else {
				newrectype = this.wavesurferSelectedTime;
			}

			console.log('Getting recording data of type: ', newrectype);

			switch (newrectype) {
			case 'append': {
				// Append to old
				if (this.audio !== '' && this.recordingData === null) {
					oldAC = await decode(this.audio);
				} else {
					oldAC = await decode(this.recordingData);
				}
				newAC = await decode(newData);
				this.addRegion(oldAC.duration, oldAC.duration + newAC.duration);
				return new Blob([toWav(appendBuffer(oldAC, newAC))], { type });
			}
			default: {
				// Overwrite from time
				const overwriteFromTime = newrectype;

				if (this.audio !== '') {
					oldAC = await decode(this.audio);
				} else {
					oldAC = await decode(this.recordingData);
				}
				newAC = await decode(newData);

				const oldlength = oldAC.length;
				const oldduration = oldAC.duration;
				// const newlength = newAC.length;
				const newduration = newAC.duration;
				let oldACSliced;
				let resultAC;

				/* Using sliceAudioBuffer
				*
				*	await sliceAudioBuffer(
				*		oldAC, // audioBuffer
				*		~~((length * startTime) / duration), // from
				*		~~(length * endTime / duration), // to
				*	);
				*
				*/

				// Overwrite mode
				if (this.overwriteMode) {
					if (overwriteFromTime === 0 && newduration >= oldduration) {
						this.addRegion(overwriteFromTime, newduration);
						return new Blob([toWav(newAC)], { type });
					} else if (overwriteFromTime === 0 && newduration < oldduration) {
						// eslint-disable-next-line
						const oldACSliced1 = sliceAudioBuffer(oldAC, ~~(oldlength * (overwriteFromTime + newduration) / oldduration), oldlength);
						resultAC = appendBuffer(newAC, oldACSliced1);
						this.addRegion(0, newduration);
						return new Blob([toWav(resultAC)], { type });
					}

					// If the new record is longer than the rewritable part
					if (newduration >= (oldduration - overwriteFromTime)) {
						// eslint-disable-next-line
						oldACSliced = sliceAudioBuffer(oldAC, 0, ~~(oldlength * overwriteFromTime / oldduration));
						resultAC = appendBuffer(oldACSliced, newAC);
						this.addRegion(overwriteFromTime, overwriteFromTime + newAC.duration);
						return new Blob([toWav(resultAC)], { type });
					} else {
						// eslint-disable-next-line
						const oldACSliced1 = sliceAudioBuffer(oldAC, 0, ~~(oldlength * overwriteFromTime / oldduration));
						// eslint-disable-next-line
						const oldACSliced2 = sliceAudioBuffer(oldAC, ~~(oldlength * (oldACSliced1.duration + newduration) / oldduration), ~~(oldlength * oldduration / oldduration));
						resultAC = appendBuffer(appendBuffer(oldACSliced1, newAC), oldACSliced2);
						this.addRegion(overwriteFromTime, overwriteFromTime + newAC.duration);
						return new Blob([toWav(resultAC)], { type });
					}
				} else {
					// eslint-disable-next-line
					const oldACSliced1 = sliceAudioBuffer(oldAC, 0, ~~(oldlength * overwriteFromTime / oldduration));
					// eslint-disable-next-line
					const oldACSliced2 = sliceAudioBuffer(oldAC, ~~(oldlength * overwriteFromTime / oldduration), ~~(oldlength * oldduration / oldduration));
					resultAC = appendBuffer(appendBuffer(oldACSliced1, newAC), oldACSliced2);
					this.addRegion(overwriteFromTime, overwriteFromTime + newAC.duration);
					return new Blob([toWav(resultAC)], { type });
				}
			}
			}
		},
		/* eslint-enable no-else-return */
		/* eslint-enable arrow-body-style */
		onStopRecording() {
			// Toggle stage
			this.isRecording = false;

			// Stop live wave visualisation
			this.stopTimer();
			this.wavesurfer.microphone.stop();
			this.isWaveformLoading = true;

			// Getting recorded data
			this.getRecordedData()
				.then((blob) => {
					// console.log('Promise resolve: getRecordedData');
					this.updateRecording(blob);

					this.callStop = false;

					if (this.isSafari) {
						if (this.microphone) {
							this.microphone.stop();
							this.microphone = null;
						}
					}
				});
		},

		stopRecording() {
			if (this.callStop) return;
			this.callStop = true;
			const that = this;
			that.recorder.stopRecording().then(() => {
				that.onStopRecording();
			});
		},

		updateRecording(blob) {
			const newblob = blob;
			const fileType = newblob.type.split('/')[1];
			newblob.name = `recording.${fileType}`;

			this.recordingData = newblob;
			console.log('Before: updateRecording load', newblob);
			// Recorder data visialisation
			this.wavesurfer.loadBlob(newblob);
			console.log('After: updateRecording load');

			// Store recorder data
			this.$store.commit('storeRecording', newblob);
		},
	},
};
</script>

<style lang="scss">
	.site-audio-record .record-lineup {
		margin-left: 67px;
	}

	.record-lineup__message,
	.record-length {
		user-select: none;
	}

	.site-audio-record {
		position: relative;
	}

	.record-lineup__mode {
		position: absolute;
		left: 100px;
		top: 48%;

		&.is-disabled {
			opacity: .666;

			&:before {
				content: '';
				position: absolute;
				top: -100%;
				left: -20%;
				width: 140%;
				height: 200%;
				display: block;
				z-index: 10;
			}
		}

		.switch .control-label {
			color: white;
			font-weight: bold;
			text-transform: uppercase;
			text-align: center;
			position: absolute;
			padding: 0;
			white-space: nowrap;
			font-size: 10px;
			left: 50%;
			transform: translateX(-50%);
			top: -14px;
		}

		.switch input[type=checkbox] + .check {
			background: #e8e6e6;
			width: 40px;
		}

		.switch input[type=checkbox]:checked + .check {
			background: #4D2DDE;
		}

		.switch input[type=checkbox]:checked + .check:before {
			transform: translate3d(22px, 0, 0);
		}

		.dropdown-menu {
			left: -13px;
		}

		.dropdown-content {
			min-width: 330px;
		}

		.dropdown-item {
			strong {
				color: inherit;
			}
		}

		.dropdown-trigger {
			line-height: 1;
		}

		.switch.is-small {
			font-size: 12px;
		}
	}

	.record-lineup__revert {
		position: absolute;
		left: 9px;
		top: 50%;
		margin-top: -12px;

		&:hover {
			.icon {
				transform-origin: 50%;
				transform: scale(1.1);
			}
		}

		.icon {
			font-size: 24px;
			color: white;
			cursor: pointer;
			display: inline-block;
			width: 24px;
			height: 24px;
			line-height: 24px;
			transition: transform 100ms ease-in-out;
		}
	}

	.site-audio-record .dropdown-menu:after {
		content: '';
		display: block;
		width: 20px;
		height: 20px;
		background-color: #3C3D41;
		position: absolute;
		top: -5px;
		-webkit-transform: rotate(45deg);
		transform: rotate(45deg);
		left: 14px;
		z-index: 0;
	}

	.site-audio-record .dropdown-item {
		position: relative;
		z-index: 1;
	}

	.site-audio-record .dropdown-menu {
		top: calc(100% + 16px);
	}

	#waveform > wave {
		overflow: hidden !important;
	}

	.wavesurfer-region {
		z-index: 10;
		i {
			opacity: 0;
			padding: 1px 5px;
			position: absolute;
			right: 3px;
			top: 3px;
			color: #4D2DDE;
			background-color: white;
			border-radius: 4px;
			cursor: pointer;
			transition: all 200ms ease-in-out;
		}
		&:hover {
			i {
				opacity: 1;
			}
		}
	}
</style>