<template>
	<div class="vue-sound-wrapper">
		<div class="vue-sound__player">
			<div :class="{ 'vue-sound__player-controls': true, 'has-no-record': file === null }">
<!-- 				<button
					v-if="false"
					@click="stop()"
					title="Stop"
				>Stop</button> -->

				<button
					@click="(!playing) ? play() : pause()"
					:title="(!playing) ? 'Play' : 'Pause'"
					:class="{
						'play': !playing,
						'pause': playing,
					}">
					<svg v-show="!playing" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 40 40" width="40px" height="40px">
						<path d="M20,38c9.9,0,18-8.1,18-18S29.9,2,20,2S2,10.1,2,20S10.1,38,20,38z M20,40C9,40,0,31,0,20S9,0,20,0s20,9,20,20S31,40,20,40z"/>
						<polygon points="16,29 16,11 27,20 "/>
					</svg>

					<svg v-show="playing" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 40 40" width="40px" height="40px">
						<path d="M20,38c9.9,0,18-8.1,18-18S29.9,2,20,2S2,10.1,2,20S10.1,38,20,38z M20,40C9,40,0,31,0,20S9,0,20,0s20,9,20,20S31,40,20,40z"/>
						<rect x="13" y="11" width="4" height="18"/>
						<rect x="22" y="11" width="4" height="18"/>
					</svg>
				</button>

<!-- 				<button
					v-if="playing"
					@click="pause()"
					title="Pause"
					class="pause">
					<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 40 40" width="40px" height="40px">
						<path d="M20,38c9.9,0,18-8.1,18-18S29.9,2,20,2S2,10.1,2,20S10.1,38,20,38z M20,40C9,40,0,31,0,20S9,0,20,0 s20,9,20,20S31,40,20,40z"/>
						<rect x="12" y="12" width="16" height="16" />
					</svg>
				</button> -->
				<button v-on:click="setPosition" class="vue-sound__playback-time-wrapper" title="Jump to time">
					<div v-bind:style="progressStyle" class="vue-sound__playback-time-indicator"></div>
				</button>
				<span class="vue-sound__playback-time-current">{{currentTime}}</span>
				<span v-if="false" class="vue-sound__playback-time-separator"></span>
				<span class="vue-sound__playback-time-total">{{duration}}</span>
				<button v-if="false" @click="download()" class="btn btn-default"><i class="glyphicon glyphicon-floppy-disk"></i></button>
				<button v-if="false" @click="mute()" class="muted" title="Mute"><i class="icon-white glyphicon glyphicon-volume-off"></i></button>
				<button v-if="false" v-on:mouseover="toggleVolume()" class="btn btn-default" title="Volume"><i class="icon-white glyphicon glyphicon-equalizer"></i></button>
			</div>
			<input orient="vertical" v-model.lazy="volumeValue" v-on:change="updateVolume()" v-show="hideVolumeSlider" type="range" min="0" max="100" class="volume-slider"/>
		</div>
		<audio v-bind:id="playerId" ref="audiofile" :src="file" preload="auto" style="display:none;"></audio>
	</div>
</template>

<script>
	const baseVolumeValue = 5;

	/* eslint-disable no-underscore-dangle */
	const generateUUID = () => 'xxxxxxxx-xxxx-4xxx'.replace(/[xy]/g, (c) => {
		// eslint-disable-next-line
		const r = Math.random() * 16 | 0;
		// eslint-disable-next-line
		const v = c === 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});

	const convertTimeHHMMSS = (val) => {
		const hhmmss = new Date(val * 1000).toISOString().substr(11, 8);
		return (hhmmss.indexOf('00:') === 0) ? hhmmss.substr(3) : hhmmss;
	};

	export default {
		name: 'vue-audio',
		props: {
			file: {
				type: String,
				default: null,
			},
			autoPlay: {
				type: Boolean,
				default: false,
			},
			audioduration: {
				type: Number,
				default: 0,
			},
		},
		computed: {
			duration() {
				return this.file ? convertTimeHHMMSS(this.audioduration) : '00:00';
			},
			playerId() {
				return `player-${this.uuid}`;
			},
		},
		data() {
			return {
				isMuted: false,
				loaded: false,
				playing: false,
				paused: false,
				progressStyle: '',
				currentTime: '00:00',
				uuid: 0,
				audio: undefined,
				totalDuration: 0,
				hideVolumeSlider: false,
				volumeValue: baseVolumeValue,
			};
		},
		methods: {
			setPosition(e) {
				let tag = e.target;
				if (!this.playing) return;
				if (e.target.tagName === 'SPAN') {
					tag = e.target.parentElement;
				}
				const pos = tag.getBoundingClientRect();
				const seekPos = (e.clientX - pos.left) / pos.width;
				this.audio.currentTime = parseInt(this.audio.duration * seekPos, 10);
			},
			updateVolume() {
				this.hideVolumeSlider = false;
				this.audio.volume = this.volumeValue / 100;
				if (this.volumeValue / 100 > 0) {
					this.isMuted = false;
					this.audio.muted = false;
				}
			},
			toggleVolume() {
				this.hideVolumeSlider = true;
			},
			stop() {
				this.paused = false;
				this.playing = false;
				this.audio.pause();
				this.audio.currentTime = 0;
			},
			play() {
				this.$root.$emit('stopAudio');
				if (this.file === null) {
					return;
				}
				if (this.playing) {
					return;
				}
				this.paused = false;
				this.audio.play();
				this.playing = true;
			},
			pause() {
				if (this.paused) {
					return;
				}
				this.playing = false;
				this.audio.pause();
				this.paused = true;
			},
			download() {
				this.audio.pause();
				window.open(this.file, 'download');
			},
			mute() {
				this.isMuted = !this.isMuted;
				this.audio.muted = this.isMuted;
				this.volumeValue = this.isMuted ? 0 : 75;
			},
			_handleLoaded() {
				if (this.audio.readyState >= 2) {
					if (this.autoPlay) {
						this.audio.play();
					}
					this.loaded = true;
					this.totalDuration = parseInt(this.audio.duration, 10);
				} else {
					throw new Error('Failed to load sound file');
				}
			},
			_handlePlayingUI() {
				const currTime = parseInt(this.audio.currentTime, 10);
				const percentage = parseInt((currTime / this.totalDuration) * 100, 10);
				this.progressStyle = `width:${percentage}%;`;
				this.currentTime = convertTimeHHMMSS(currTime);
				if (percentage === 100) {
					this.stop();
				}
			},
			_handlePlayPause(e) {
				if (e.type === 'pause' && this.paused === false && this.playing === false) {
					this.progressStyle = 'width:0%;';
					this.currentTime = '00:00';
				}
			},
			init() {
				this.audio.addEventListener('timeupdate', this._handlePlayingUI);
				this.audio.addEventListener('loadeddata', this._handleLoaded);
				this.audio.addEventListener('pause', this._handlePlayPause);
				this.audio.addEventListener('play', this._handlePlayPause);
			},
			getAudio() {
				return this.$el.querySelectorAll('audio')[0];
			},
		},
		mounted() {
			this.uuid = generateUUID();
			this.audio = this.$el.querySelectorAll('audio')[0];
			this.init();

			this.$root.$on('stopAudio', () => {
				this.stop();
			});
		},
		beforeDestroy() {
			this.audio.removeEventListener('timeupdate', this._handlePlayingUI);
			this.audio.removeEventListener('loadeddata', this._handleLoaded);
			this.audio.removeEventListener('pause', this._handlePlayPause);
			this.audio.removeEventListener('play', this._handlePlayPause);
		},
	};
</script>

<style lang="scss" scoped>
	.vue-sound-wrapper {
		width: 100%;
		height: 40px;
	}
	.vue-sound__player {
		.play,
		.pause {
			svg {
				fill: #9B59FE;
			}

			&:hover {
				fill: #8557DD;
			}
		}
	}
	.vue-sound__player-controls {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: space-between;
		align-items: center;
		position: relative;
		user-select: none;

		&.has-no-record {
			cursor: default !important;
			filter: grayscale(1);

			> * {
				cursor: default !important;
			}
		}

		> * {
			flex: 1;
		}

		button:not(.vue-sound__playback-time-wrapper) {
			padding: 0;
			margin: 0;
			border: 0;
			background-color: transparent;

			&.play,
			&.pause {
				cursor: pointer;
				width: 40px;
				height: 40px;
				flex: 0 0 40px;

				&:focus {
					outline: none;
				}
			}
		}
	}
	.vue-sound__playback-time-current {
		position: absolute;
		left: 55px;
		top: 20px;
	}
	.vue-sound__playback-time-total {
		right: 0;
		top: 20px;
		position: absolute;
	}
	.vue-sound__playback-time-total,
	.vue-sound__playback-time-current {
		font-family: 'Montserrat', sans-serif;
		font-weight: 500;
		font-size: 14px;
		color: #9B59FE;
		letter-spacing: 2px;
		line-height: 14px;
		flex: 0 0 45px;
		text-align: right;
	}
	.vue-sound__playback-time-wrapper {
		background-color: #EAEAEA;
		border-radius: 5px;
		height: 6px;
		margin: -20px 0 0 15px;
		flex: 1 0 auto;
		border: 0;
		padding: 0;
		overflow: hidden;
		cursor: pointer;

		&:focus {
			outline: none;
		}
	}
	.vue-sound__playback-time-indicator {
		height: 100%;
		width: 0;
		background-color: #149FEC;
	}
</style>