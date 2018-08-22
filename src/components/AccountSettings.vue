<template>
	<section class="section">
		<div class="container">
			<h3 class="title is-3">Account Settings</h3>
			<div class="columns">
				<div class="column is-4">
					<div class="box">
						<div class="account-photo">
							<!-- div class="account-photo-fake" v-if="account.profileImageUrl !== ''" :style="{ 'background-image': `url(${account.profileImageUrl})` }"></div -->

							<div class="account-photo-img">
								<img v-if="avatar !== ''" :src="avatar">

								<a v-if="avatar !== ''" class="button is-small is-primary" @click="toggleShow">Change photo</a>

								<a v-else class="picture-inner-text" @click="toggleShow">
									<svg class="icon" width="10px" height="12px" viewBox="0 0 10 12" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
										<g id="Screens" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
											<g id="Account" transform="translate(-281.000000, -297.000000)" fill="#9B9B9B">
												<g id="Audio" transform="translate(150.000000, 173.000000)">
													<g id="Avatar" transform="translate(82.000000, 30.000000)">
														<g id="Group" transform="translate(49.000000, 90.000000)">
															<path d="M7.85407725,14.66 L2.14592275,14.66 L2.14592275,16 L7.85407725,16 L7.85407725,14.66 Z M7.14592275,8 L7.14592275,4 L2.85407725,4 L2.85407725,8 L0,8 L5,13.34 L10,8 L7.14592275,8 Z" id="Icon"></path>
														</g>
													</g>
												</g>
											</g>
										</g>
									</svg>
									Upload photo</a>

							</div>

							<my-upload
								:url="`${$http.defaults.baseURL}user/account`"
								field="profile_image"
								:params="{}"
								:headers="{
									Authorization: `Bearer ${$auth.token()}`,
								}"
								:langExt="{
									hint: 'Click or drag the file here to upload',
									loading: 'Uploading…',
									noSupported: 'Browser is not supported, please use IE10+ or other browsers',
									success: 'Upload success',
									fail: 'Upload failed',
									preview: 'Preview',
									btn: {
										off: 'Cancel',
										close: 'Close',
										back: 'Back',
										save: 'Save'
									},
									error: {
										onlyImg: 'Image only',
										outOfSize: 'Image exceeds size limit: ',
										lowestPx: 'Image\'s size is too low. Expected at least: '
									}
								}"
								:width="600"
								:height="600"
								:noSquare="true"
								:withCredentials="false"
								@crop-success="cropSuccess"
								@crop-upload-success="cropUploadSuccess"
								@crop-upload-fail="cropUploadFail"
								v-model="isAvaModalActive"
								img-format="jpg">
							</my-upload>
							

							<div class="account-status-progress">
								<div :class="['pie-wrapper', `progress-${account.progress}`, 'style-2']">
									<div class="pie">
										<div class="left-side half-circle"></div>
										<div class="right-side half-circle"></div>
									</div>
									<div class="shadow"></div>
								</div>
							</div>

						</div>

						<div class="account-status">
							<div class="account-status__perc">
								{{account.progress}}%
							</div>
							<div class="account-status__hint" v-if="account.progress < 100">
								Please fill remaining fields to complete your account
							</div>
							<div class="account-status__hint" v-else>
								Your account is complete 
							</div>
						</div>
					</div>
				</div>

				<div class="column is-8 account-details">
					<form ref="accountForm">
						<div class="box">
							<h4 class="title is-4">Account Details

								<button 
									class="button is-primary is-pulled-right is-rounded"
									:class="{
										'is-loading': isLoading,
									}"
									:disabled="isDisabled"
									@click="saveAccountData"
								>Save</button>
							</h4>
	
							<b-field label="" grouped>
								<b-field label="First name *">
									<b-input v-model="account.base.firstName" placeholder="Enter your first name" required></b-input>
								</b-field>
								<b-field label="Last name *">
									<b-input v-model="account.base.lastName" placeholder="Enter your last name" required></b-input>
								</b-field>
							</b-field>

							<b-field label="How would you like your name represented on the app? *">
								<b-input v-model="account.base.nickname" placeholder="Rev. Landau" required></b-input>
							</b-field>

							<b-field label="Title *">
								<b-input v-model="account.base.title" placeholder="Enter title" required></b-input>
							</b-field>
	
							<b-field label="BIO *">
								<b-input v-model="account.base.bio" maxlength="200" type="textarea" required></b-input>
							</b-field>

							<b-field
								label="Audio BIO"
								:class="{
									'has-addons-not': (account.base.audio_bio !== null && (typeof account.base.audio_bio === 'string' || account.base.audio_bio instanceof String)) || account.base.audio_bio === null
								}"
							>
								<b-upload
									v-if="account.base.audio_bio === null"
									v-model="account.base.audio_bio"
									v-on:input="uploadAudioBio"
									accept="audio/*"
									drag-drop
								>
									<section class="section">
										<div class="content has-text-centered">
											<p>
												<b-icon
												icon="upload"
												size="is-large">
												</b-icon>
											</p>
											<p>Drop your files here or click to upload</p>
										</div>
									</section>
								</b-upload>

								<div class="tags" v-if="account.base.audio_bio !== null && !(typeof account.base.audio_bio === 'string' || account.base.audio_bio instanceof String)">
									<span v-for="(file, index) in account.base.audio_bio"
										:key="index"
										class="tag is-primary is-medium" >
										{{file.name}}
										<button class="audio-loading button is-primary is-loading" />
										<!-- button class="delete is-small"
											type="button"
										>
										</button -->
									</span>
								</div>
								<div class="audio-controller" v-if="account.base.audio_bio !== null && (typeof account.base.audio_bio === 'string' || account.base.audio_bio instanceof String)">
									<audio controls :src="account.base.audio_bio" />
									<a class="delete" @click="deleteDropFile()"></a>
								</div>
							</b-field>
	
							<!-- b-field label="Personal Interests">
								<b-input v-model="account.base.interests" placeholder="Enter personal interests"></b-input>
							</b-field -->

							<!-- div class="field">
								<label class="label">Personal Interests</label>
								<div class="control is-clearfix">
									<tags :selected="account.base.interests" />
								</div>
							</div -->

							<b-field label="Personal Interests">
								<b-taginput v-model="account.base.interests" rounded></b-taginput>
							</b-field>
	
							<b-field grouped>
								<!-- <b-field label="Denomination(s) *">
									<b-input v-model="account.base.denomination" placeholder="Enter denomination" required></b-input>
								</b-field> -->
								<div class="field">
									<label class="label">Faith Tradition(s) *</label>
									<div class="control is-clearfix">
										<denominations :selected="account.base.denominations" />
										<div 
											class="required-message"
											v-if="!account.base.denominations || account.base.denominations.length === 0"
										>
											Please fill out this field.
										</div>
									</div>
								</div>
								<b-field label="Zip Code *">
									<b-input v-model="account.base.zip" placeholder="Enter Zip Code" required></b-input>
								</b-field>
							</b-field>
	
							<div class="field">
								<label class="label">Areas of Expertise</label>
								<div class="control is-clearfix">
									<tags :selected="account.base.keywords" />
								</div>
							</div>
							<!-- b-field label="Keywords">
								<b-input v-model="account.base.keywords" placeholder="Enter keywords"></b-input>
							</b-field -->
						</div>
	
						<div class="box">
							<h4 class="title is-4">Social Networks</h4>
							<b-field label="Facebook">
								<b-input v-model="account.social.facebook" placeholder="Enter Facebook URL"></b-input>
							</b-field>
	
							<b-field label="Instagram">
								<b-input v-model="account.social.instagram" placeholder="Enter Instagram URL"></b-input>
							</b-field>
	
							<b-field label="Twitter">
								<b-input v-model="account.social.twitter" placeholder="Enter Twitter URL"></b-input>
							</b-field>
	
							<b-field label="Pinterest">
								<b-input v-model="account.social.pinterest" placeholder="Enter Pinterest URL"></b-input>
							</b-field>
	
							<b-field label="YouTube">
								<b-input v-model="account.social.youtube" placeholder="Enter YouTube channel URL"></b-input>
							</b-field>
						</div>
	
						<div class="box">
							<h4 class="title is-4">Legal Information</h4>
	
							<b-field>
								<b-field
									:label="'Organization *'"
								>
									<b-input v-model="account.legal.organization" placeholder="Enter organization" required></b-input>
								</b-field>
							</b-field>
	
							<div class="field">
								<label class="label" for="">Is this organization a 501C(3)? *</label>
								<div class="field--radio">
									<b-radio v-model="account.legal['501c']" native-value="Yes">Yes</b-radio>
								</div>
								<div class="field--radio">
									<b-radio v-model="account.legal['501c']" native-value="No">No</b-radio>
								</div>
							</div>
	
							<b-field v-if="(account.legal['501c'] === 'Yes')">
								<b-field label="TAX ID">
									<b-input v-model="account.legal.taxId" placeholder="Enter TAX ID number"></b-input>
								</b-field>
							</b-field>
							<div class="columns">
								<div class="field column is-6">
									<label for="" class="label">Affiliation</label>
									<div class="input-with-remove" v-for="(ind, val) in account.legal.affiliations.length">
										<b-input
											v-model="account.legal.affiliations[ind - 1]"
											:key="ind"
											placeholder="Affiliation name"
										>
										</b-input>
										<button @click="deleteAffiliations(val)" class="delete is-medium"></button>
									</div>
									<button class="button is-text" @click="addAffiliations">+ ADD AFFILIATION</button>
								</div>
							</div>
						</div>
	
						<div class="box">
							<h4 class="title is-4">Billing Details</h4>
							<div class="columns">
								<div class="column">
									<div class="field">
										<label class="label" for="">Where would you like to send your royalty payments to? *</label>
										<div class="field--radio">
											<b-radio v-model="account.billing.to" native-value="vennly">Vennly Foundation</b-radio>
										</div>
										<div class="field--radio">
											<b-radio v-model="account.billing.to" native-value="bank">My Bank Account</b-radio>
										</div>
									</div>
									<b-field label="Account number" v-if="(account.billing.to === 'bank')">
										<b-input v-model="account.billing.accountNumber" placeholder="Account number"></b-input>
									</b-field>
									<b-field label="Routing #" v-if="(account.billing.to === 'bank')">
										<b-input v-model="account.billing.routingNumber" placeholder="Enter routing number"></b-input>
									</b-field>
								</div>
								<div class="column">
									<div class="billing-tip-box"
										v-if="tipsArray && tipsArray['account-billing']"
										v-for="tip in tipsArray['account-billing']"
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
							</div>
						</div>

						<div class="box">
							<h4 class="title is-4">Change Password?</h4>
							<div class="columns">
								<div class="column">
									<b-field label="New Password">
										<b-input v-model="account.password" type="password" placeholder="Enter new password"></b-input>
									</b-field>
									
								</div>
								<div class="column">
									<b-field label="Confirm New Password">
										<b-input v-model="account.passwordConfirm" type="password" placeholder="Enter confirm password"></b-input>
									</b-field>
								</div>
							</div>
						</div>

						<div class="box">
							<div class="controls">
								<button 
									:class="{
										'button is-primary': true,
										'is-loading': isLoading,
									}"
									:disabled="isDisabled"
									@click="saveAccountData"
								>Save</button>
								<button
									class="button is-white"
									@click="deleteAccount"
								>
									<b-icon
										pack="mdi"
										icon="delete">
									</b-icon>
									Delete this account
								</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>

		<b-modal :active="false">
			
		</b-modal>
	</section>
</template>

<script>
import Tags from '@/components/dir/Tags';
import Denominations from '@/components/dir/Denominations';
import MyUpload from '@/components/dir/Upload';

export default {
	components: {
		Tags,
		Denominations,
		MyUpload,
	},
	data() {
		return {
			isLoading: false,
			isDisabled: false,
			isAvaModalActive: false,
			account: {
				progress: 0,
				profileImageUrl: '',
				password: '',
				passwordConfirm: '',
				base: {
					firstName: '', // required
					lastName: '', // required
					nickname: '', // required
					title: '', // required
					bio: '', // required
					audio_bio: null,
					denominations: [], // required
					zip: '', // required
					interests: [],
					keywords: [],
				},
				social: {
					facebook: '',
					instagram: '',
					twitter: '',
					pinterest: '',
					youtube: '',
				},
				legal: {
					organization: '', // required
					taxId: '', // required
					'501c': '', // required
					affiliations: [],
				},
				billing: {
					to: 'vennly',  // required
					accountNumber: '',
					routingNumber: '',
				},
			},
		};
	},
	computed: {
		tipsArray() {
			return this.$store.state.tips;
		},

		avatar() {
			return this.$auth.user().profile_image_url || '';
		},
	},

	methods: {
		save() {
			this.saveAccountData();
		},

		delete() {
			this.$http.delete('user')
				.then(() => {
					this.$auth.logout();
				})
				.catch((error) => {
					console.log(error);
				});
		},

		deleteAccount() {
			// q /user
			const that = this;
			this.$dialog.confirm({
				title: 'Deleting account',
				message: 'Are you sure you want to <b class="has-text-danger">delete</b> your account? This action cannot be undone.',
				confirmText: 'Delete',
				type: 'is-danger',
				hasIcon: true,
				onConfirm() {
					that.delete();
				},
			});
		},

		toggleShow() {
			this.isAvaModalActive = !this.isAvaModalActive;
		},

		cropSuccess() {
			// this.imgDataUrl = imgDataUrl;
		},

		deleteDropFile() {
			this.$http.delete('/user/profile/audio_bio')
				.then(() => {
					this.account.base.audio_bio = null;
					this.$toast.open({
						duration: 5000,
						message: 'Your Audio Bio was successfully deleted.',
						position: 'is-top',
						type: 'is-success',
					});
				})
				.catch((error) => {
					console.log(error);
				});
		},

		uploadAudioBio() {
			if (!this.account.base.audio_bio || this.account.base.audio_bio.length === 0) {
				this.$toast.open({
					duration: 5000,
					message: 'Invalid audio file. Please select correct audio file.',
					position: 'is-top',
					type: 'is-danger',
				});
				this.account.base.audio_bio = null;
				return;
			}
			const formData = new FormData();

			if (this.account.base.audio_bio !== null) {
				formData.append('audio_bio', this.account.base.audio_bio[0]);
			}

			this.$http({
				method: 'post',
				url: 'user/account',
				headers: {
					'Content-type': 'application/x-www-form-urlencoded',
				},
				params: {
					filename: this.account.base.audio_bio[0].name,
					'Content-Type': this.account.base.audio_bio[0].type,
				},
				data: formData,
			}).then((res) => {
				this.$toast.open({
					duration: 5000,
					message: 'Your Audio Bio was successfully updated.',
					position: 'is-top',
					type: 'is-success',
				});
				this.account.base.audio_bio = res.data.audio_bio_url;
			}).catch((error) => {
				console.log(error);
			});
		},

		cropUploadSuccess(jsonData) {
			this.toggleShow();

			this.$toast.open({
				duration: 5000,
				message: 'Your profile picture was successfully updated.',
				position: 'is-top',
				type: 'is-success',
			});

			this.$auth.user(jsonData);
			window.localStorage.setItem('userData', JSON.stringify(jsonData || '[]'));
		},

		cropUploadFail(status) {
			console.log('-------- upload fail --------');
			console.log(status);
			// console.log(`field: ${field}`);
		},

		affiliations() {
			const newaff = [];
			for (let i = 0; i < this.account.legal.affiliations.length; i += 1) {
				if (this.account.legal.affiliations[i] !== '') {
					newaff.push(this.account.legal.affiliations[i]);
				}
			}
			return newaff;
		},

		addAffiliations() {
			this.account.legal.affiliations.push('');
		},

		deleteAffiliations(id) {
			this.account.legal.affiliations.splice(id, 1);
		},

		retriveSocialNetworks(socialNetworks) {
			socialNetworks.map((item) => {
				if (Object.prototype.hasOwnProperty.call(this.account.social, item.social_network)) {
					this.account.social[`${item.social_network}`] = item.url;
				}
				return true;
			});
		},

		retriveDenominations(denominations) {
			denominations.map((item) => {
				this.account.base.denominations.push(item.name);
				return true;
			});
		},

		retriveOrganisation(organization) {
			this.account.legal.organization = organization.name;
			this.account.legal.taxId = organization.tax_id;
			this.account.legal['501c'] = (organization.is_501c3 === 1) ? 'Yes' : 'No';
			organization.affiliations.map((item) => {
				this.account.legal.affiliations.push(item.name);
				return true;
			});
		},

		retriveInterests(interests) {
			interests.map((item) => {
				this.account.base.interests.push(item.name);
				return true;
			});
		},

		fetchAccountData() {
			this.isDisabled = true;
			this.$http.get('user/account')
				.then((responce) => {
					const userData = responce.data;

					// Saving user data
					this.$auth.user(userData);
					window.localStorage.setItem('userData', JSON.stringify(userData || '[]'));

					// Setting user pic
					this.account.profileImageUrl = userData.profile_image_url;

					// Base account data
					this.account.progress = parseInt(userData.profile_completion, 10);
					this.account.base.firstName = userData.first_name;
					this.account.base.lastName = userData.last_name;
					this.account.base.nickname = userData.nickname;
					this.account.base.title = userData.title;
					this.account.base.bio = userData.bio;
					this.account.base.audio_bio = userData.audio_bio_url;
					this.retriveInterests(userData.interests);
					this.retriveDenominations(userData.denominations);
					this.account.base.zip = userData.zip_code;
					// this.account.base.keywords = [];

					// Social networks data
					this.retriveSocialNetworks(userData.social_networks);

					// Organisation data
					this.retriveOrganisation(userData.organization);

					// Billing data
					this.account.billing.to = (userData.royalty_payment_details !== null) ? userData.royalty_payment_details.send_payments_to : '';
					if (userData.royalty_payment_details !== null && userData.royalty_payment_details.send_payments_to === 'bank') {
						this.account.billing.accountNumber = userData.royalty_payment_details.account_number;
						this.account.billing.routingNumber = userData.royalty_payment_details.routing_number;
					}

					this.isDisabled = false;
				}).catch((error) => {
					console.log(error);
					this.isDisabled = false;
				});
		},

		saveAccountData() {
			if (!this.account.base.denominations || this.account.base.denominations.length === 0) {
				this.isLoading = false;
				return false;
			}
			this.isLoading = true;
			if (this.$refs.accountForm.checkValidity()) {
				// If inbrowser HTML5 form validated
				// console.log('saveAccountData');

				if (this.account.legal['501c'] === '') {
					this.$toast.open({
						duration: 5000,
						message: 'Please choose your organisation type',
						position: 'is-top',
						type: 'is-danger',
					});
					this.isLoading = false;
					return false;
				}

				if (this.account.billing.to === '') {
					this.$toast.open({
						duration: 5000,
						message: 'Please fill billing details',
						position: 'is-top',
						type: 'is-danger',
					});
					this.isLoading = false;
					return false;
				}

				const savingData = {
					first_name: this.account.base.firstName,
					last_name: this.account.base.lastName,
					nickname: this.account.base.nickname,
					title: this.account.base.title,
					bio: this.account.base.bio,
					interests: this.account.base.interests,
					denominations: this.account.base.denominations,
					zip_code: this.account.base.zip,

					facebook: this.account.social.facebook,
					instagram: this.account.social.instagram,
					twitter: this.account.social.twitter,
					pinterest: this.account.social.pinterest,
					youtube: this.account.social.youtube,

					organization_name: this.account.legal.organization,
					organization_tax_id: (this.account.legal['501c'] === 'Yes') ? this.account.legal.taxId : '',
					organization_is_501c3: (this.account.legal['501c'] === 'Yes') ? 1 : 0,
					organization_affiliations: this.affiliations(),

					royalty: this.account.billing.to,
				};

				if (this.account.password !== '' && this.account.passwordConfirm !== '') {
					if (this.account.password !== this.account.passwordConfirm) {
						this.$toast.open({
							duration: 5000,
							message: 'Passwords doesn`t match',
							position: 'is-top',
							type: 'is-danger',
						});
						this.isLoading = false;
						return false;
					}
					savingData.password = this.account.password;
				}

				if (savingData.royalty === 'bank') {
					savingData.royalty_bank_account = this.account.billing.accountNumber;
					savingData.royalty_bank_routing = this.account.billing.routingNumber;
				}

				this.$http.put('user/account', savingData)
					.then((resp) => {
						this.isLoading = false;
						// console.log(resp);

						this.$auth.user(resp.data);
						window.localStorage.setItem('userData', JSON.stringify(resp.data || '[]'));

						this.$toast.open({
							duration: 5000,
							message: 'Your account was successfully updated.',
							position: 'is-top',
							type: 'is-success',
						});
					})
					.catch((error) => {
						this.isLoading = false;
						let errorMessage = error.response.data.message;

						if (error.response.data.errors) {
							Object.keys(error.response.data.errors).forEach((key) => {
								errorMessage = `${errorMessage} ${error.response.data.errors[key][0]}`;
							});
						}

						this.$toast.open({
							duration: 5000,
							message: errorMessage,
							position: 'is-top',
							type: 'is-danger',
						});
					});
			} else {
				this.isLoading = false;
			}
			return true;
		},

		// deleteAccount() {
			// q
		// },
	},
	mounted() {
		this.fetchAccountData();
		this.$refs.accountForm.onsubmit = () => false;
	},
};
</script>

<style lang="scss">
	.modal {
		z-index: 10010;
	}

	.required-message {
		color: red;
		font-size: 0.75rem;
    margin-top: 0.25rem;
	}

	.tags {
		.button.is-loading {
			height: 100%;
		}
	}

	.field.has-addons.has-addons-not {
		display: block;
		margin-top: -18px;

		> div {
			display: flex;
			align-items: center;

			.delete {
				margin-left: 10px;
			}
		}
	}

	.upload-draggable.is-primary {
		width: 100%;

		.section {
			padding: 10px;
		}
	}

	.taginput .taginput-container {
		a.delete {
			background: transparent;
			width: 20px;
			height: 20px;
			max-width: 20px;
			max-height: 20px;
			top: 5px;
			
			&:before,
			&:after {
				background-color: #D5D5D5;
			}
		}
		span.tag.is-rounded {
			background: #FFFFFF;
			-webkit-box-shadow: inset 0 -1px 0 0 #D5D5D5;
			box-shadow: inset 0 -1px 0 0 #D5D5D5;
			border-radius: 4px;
			height: 34px !important;
			line-height: 34px !important;
			padding-left: 13px;
			margin-top: 1px;
			font-family: 'Montserrat', sans-serif;
			font-weight: 600;
			font-size: 11px !important;
			color: #3C3D41;
			text-transform: uppercase;
			cursor: default;
			white-space: nowrap;
			margin-right: 8px;
		}
		.autocomplete input {
			background-color: transparent;
		}
	}

	.vue-image-crop-upload .vicp-wrap .vicp-step2 .vicp-crop .vicp-crop-left .vicp-img-container .vicp-img {
		max-width: none;
	}

	.account-photo > .account-photo-img {
		position: relative;
		z-index: 40;
		width: 173px;
		height: 173px;
		border-radius: 50%;
		margin: 0 auto;
		display: block;
		background-color: rgba(238, 238, 238, .6);
		box-shadow: inset 0 2px 2px 0 rgba(0,0,0,0.10);

		> .button {
			opacity: 0;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translateX(-50%) translateY(-50%);
			z-index: 40;
			transition: opacity 200ms ease-in-out;
		}

		&:hover {
			> .button {
				opacity: 1;
			}
		}

		> img {
			width: 100%;
			height: 100%;
			border-radius: 50%;
			box-shadow: inset 0 2px 2px 0 rgba(0,0,0,0.10);
		}
	}
</style>
