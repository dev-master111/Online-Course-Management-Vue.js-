import axios from 'axios';

let aContext;

if ('webkitAudioContext' in window) {
	// eslint-disable-next-line
	aContext = new webkitAudioContext();
} else {
	aContext = new AudioContext();
}

function getFile(url) {
	return new Promise((resolve, reject) => {
		axios.get(url, {
			responseType: 'arraybuffer',
			transformRequest: [(data, headers) => {
				// eslint-disable-next-line
				delete headers.common;
				return data;
			}],
		})
			.then((responce) => {
				resolve(responce.data);
			})
			.catch((error) => {
				reject(error);
			});
	});
}

function readFile(file, dataType) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader[`readAs${dataType}`](file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = err => reject(err);
	});
}

function readArrayBuffer(file) {
	const attaybuffer = readFile(file, 'ArrayBuffer');
	attaybuffer.then(() => {
		console.log('Promise Resolved');
	});
	attaybuffer.catch(() => {
		console.log('Promise Rejected');
	});
	return attaybuffer;
}

function sliceAudioBuffer(audioBuffer, start = 0, end = audioBuffer.length) {
	// window.console.log(audioBuffer, start, end);
	if (start === end) {
		return 0;
	}

	const newBuffer = aContext.createBuffer(
		audioBuffer.numberOfChannels,
		end - start,
		audioBuffer.sampleRate,
	);

	for (let i = 0; i < audioBuffer.numberOfChannels; i += 1) {
		newBuffer.copyToChannel(audioBuffer.getChannelData(i).slice(start, end), i);
	}

	return newBuffer;
}

function appendBuffer(buffer1, buffer2) {
	if (buffer2 === 0) {
		return buffer1;
	}

	if (buffer1 === 0) {
		return buffer2;
	}

	const numberOfChannels = Math.min(buffer1.numberOfChannels, buffer2.numberOfChannels);
	const tmp = aContext
		.createBuffer(numberOfChannels, (buffer1.length + buffer2.length), buffer1.sampleRate);
	for (let i = 0; i < numberOfChannels; i += 1) {
		const channel = tmp.getChannelData(i);
		channel.set(buffer1.getChannelData(i), 0);
		channel.set(buffer2.getChannelData(i), buffer1.length);
	}
	return tmp;
}

const decodeFunction = async function decode(blob) {
	console.log('Running: decodeFunction');
	let arrayBuffer;
	if (typeof blob === 'string') {
		arrayBuffer = await getFile(blob);
	} else {
		arrayBuffer = await readArrayBuffer(blob);
	}
	const audioBuffer = await aContext.decodeAudioData(arrayBuffer);
	return audioBuffer;
};

export { decodeFunction as decode, sliceAudioBuffer, appendBuffer };
