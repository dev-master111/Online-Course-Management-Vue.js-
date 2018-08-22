<template>
	<div 
		class="field-selectize field-selectize--denominations"
		:class="{
			'is-droped': isFocused,
		}"
		v-on:click.self="inputFocus"
		v-on:blur="$emit('change', $event)"
		ref="baseinput"
	>
		<label ref="placeholder" v-if="input === '' && selected.length === 0" v-on:click="inputFocus">Select Denominations</label>

		<span
			ref="items"
			style="width: 100%;"
			@click="isFocused = true"
		>
			<div
				v-for="(item, index) in selected"
				class="field-selectize__item"
				style="display: inline-block;"
				:class="{
					'is-last': index === selected.length - 1
				}"
			>
				{{item}}
				<button class="delete" @click="deleteItem(index)"></button>
			</div>
		</span>

		<input
			type="text"
			autocomplete="off"
			v-model="input"
			v-on:keydown="runQuery($event)"
			@focus="isFocused = true"
			ref="tagsInput"
			maxlength="15"
			style="width: auto; display: none; text-transform: uppercase;"
		/>
		<div class="dropdown" v-show="isFocused && tags" ref="dropdownMenu">
			<div class="dropdown__item" v-if="tags" v-for="tag in tags" @click="addItem(tag.name)">{{tag.name}}</div>
		</div>
	</div>
</template>

<script>
// const tags = [];

export default {
	props: {
		selected: {
			type: Array,
			default: [],
		},
	},

	data() {
		return {
			isFocused: false,
			input: '',
			inputWidth: 1,
			tags: [],
		};
	},

	watch: {
		// selected(val) {
			// console.log('who did this???', val);
		// },
	},

	mounted() {
		this.fetchTags();
	},

	created() {
		if (typeof window !== 'undefined') {
			document.addEventListener('click', this.clickedOutside);
		}
	},

	beforeDestroy() {
		if (typeof window !== 'undefined') {
			document.removeEventListener('click', this.clickedOutside);
		}
	},

	methods: {
		clickedOutside(event) {
			if (!this.isInWhiteList(event.target)) this.isFocused = false;
		},

		isInWhiteList(el) {
			if (el === this.$refs.dropdownMenu) return true;

			if (el === this.$refs.placeholder) return true;

			if (el === this.$refs.baseinput) return true;

			if (el === this.$refs.items) return true;

			if (el === this.$refs.tagsInput) return true;

			// All chidren from dropdown
			if (this.$refs.dropdownMenu !== undefined) {
				const children = this.$refs.dropdownMenu.querySelectorAll('*');
				// eslint-disable-next-line
				[].forEach.call(children, (child) => {
					if (el === child) {
						return true;
					}
				});
			}

			// All children from trigger
			if (this.$refs.items !== undefined) {
				const children = this.$refs.items.querySelectorAll('*');
				// eslint-disable-next-line
				[].forEach.call(children, (child) => {
					if (el === child) {
						return true;
					}
				});
			}

			return false;
		},

		addItem(item) {
			if (item === '') {
				return;
			}

			if (!this.selected.includes(item)) {
				this.selected.push(item);
			}

			this.input = '';
		},

		deleteItem(id) {
			this.selected.splice(id, 1);
		},

		inputFocus() {
			// this.$refs.tagsInput.focus();
			this.isFocused = true;
		},

		runQuery(e) {
			e.preventDefault();
			return false;
		},
		fetchTags() {
			this.$http.get('denominations')
				.then((responce) => {
					this.tags = responce.data;
				});
		},
	},

	computed: {
		testValue() {
			return this.input;
		},
	},
};
</script>

<style lang="scss" scoped>
	.field-selectize.field-selectize--denominations {
		cursor: pointer;
		label {
			cursor: pointer;
		}
	}
	.test {
		position: absolute;
		top: -99999px;
		left: -99999px;
		// top: 0;
		// left: 0;
		width: auto;
		padding: 0 0 0 0;
		white-space: pre;
		text-transform: uppercase;
	}

	.field-selectize {
		cursor: text;
		min-height: 48px;
		border-radius: 6px;
		padding-left: 15px;
		padding-right: 15px;
		font-family: Arial, Helvetica, sans-serif;
		font-size: 16px;
		letter-spacing: 0;
		border: 0;
		box-shadow: none;
		display: inline-flex;
		justify-content: flex-start;
		line-height: 1.5;
		padding-bottom: calc(0.375em - 1px);
		padding-top: calc(0.375em - 1px);
		position: relative;
		vertical-align: top;
		background-color: rgba(238, 238, 238, 0.6);
		color: #3C3D41;
		box-shadow: inset 0 2px 2px 0 rgba(0, 0, 0, 0.1);
		max-width: 100%;
		width: 100%;
		flex-wrap: wrap;
		line-height: 38px;

		&.is-droped {
			border-radius: 6px 6px 0 0;
		}

		label {
			cursor: text;
			font-family: Arial, Helvetica, sans-serif;
			font-size: 16px;
			opacity: 0.6;
			color: #9B9B9B;
			position: absolute;
			top: 6px;
		}

		&__item {
			background: #FFFFFF;
			box-shadow: inset 0 -1px 0 0 #D5D5D5;
			border-radius: 4px;
			height: 34px;
			line-height: 34px;
			padding-left: 13px;
			margin-top: 3px;

			font-family: 'Montserrat', sans-serif;
			font-weight: 600;
			font-size: 11px;
			color: #3C3D41;
			text-transform: uppercase;
			cursor: default;
			white-space: nowrap;
			margin-right: 8px;

			+ .field-selectize__item {
				// margin-left: 8px;
			}

			&.is-last {
				// margin-right: 8px;
			}

			.delete {
				margin-top: 7px;
				background-color: white;
				margin-right: 4px;
				cursor: pointer;

				&:before,
				&:after {
					background-color: #D5D5D5;
				}

				&:hover {
					&:before,
					&:after {
						background-color: #aaa;
					}
				}
			}
		}

		input {
			max-width: 100% !important;
			max-height: none !important;
			min-height: 0 !important;
			padding: 0 !important;
			margin: 0 1px !important;
			line-height: inherit !important;
			text-indent: 0 !important;
			background: none !important;
			border: 0 none !important;
			box-shadow: none !important;
			user-select: auto !important;

			&:focus {
				outline: none;
			}
		}

		input,
		.test {
			font-family: Arial, Helvetica, sans-serif;
			font-size: 16px;
			display: none;
		}

		.dropdown {
			position: absolute;
			top: 100%;
			left: 0;
			width: 100%;
			background-color: #efefef;
			box-shadow: 0 4px 5px rgba(0, 0, 0, 0.25);
			border-radius: 0 0 6px 6px;
			overflow: hidden;
			flex-direction: column;
			z-index: 1001;
			max-height: 320px;
			overflow-y: scroll;

			&__item {
				font-family: 'Montserrat', sans-serif;
				font-weight: 600;
				font-size: 11px;
				color: #3C3D41;
				padding: 0 20px;
				cursor: pointer;
				width: 100%;

				&:hover {
					background-color: #ebf3ff;
				}

				&--add {
					background-color: #e6e7e8;
				}
			}
		}
	}
</style>
