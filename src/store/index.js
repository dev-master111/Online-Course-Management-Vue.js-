import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
/* eslint-disable no-param-reassign */

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		recording: null,
		recordingLength: 0,
		onboardingProcess: false,
		tips: [],
	},

	mutations: {
		storeRecording(state, recording) {
			state.recording = recording;
		},

		storeRecordingLength(state, recordingLength) {
			state.recordingLength = recordingLength;
		},

		storeTips(state) {
			axios.get('cms/tips')
				.then((response) => { state.tips = response.data; });
		},

		storeOnboarding(state, value) {
			state.onboardingProcess = value;
		},
	},
});
