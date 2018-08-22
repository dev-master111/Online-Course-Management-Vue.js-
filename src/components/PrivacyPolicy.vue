<template>
	<section class="section section--content-middle has-text-centered">
		<div class="container">
			<div class="site-mission-statement">
				<h1 class="title is-1">Privacy Policy</h1>
				<div v-bar class="term-and-conditions">
					<div>
						<p>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem dolor sed viverra ipsum nunc. Sollicitudin tempor id eu nisl nunc. Dolor sit amet consectetur adipiscing elit duis tristique. Blandit massa enim nec dui. Libero id faucibus nisl tincidunt eget nullam. Fermentum odio eu feugiat pretium nibh ipsum. Massa massa ultricies mi quis hendrerit dolor magna eget. Viverra vitae congue eu consequat ac felis donec et. Fringilla est ullamcorper eget nulla facilisi etiam. Nec ullamcorper sit amet risus nullam eget felis. Et leo duis ut diam quam nulla porttitor massa id. Felis donec et odio pellentesque diam volutpat commodo sed.
						</p>
						<p>
							Massa vitae tortor condimentum lacinia quis vel. Imperdiet massa tincidunt nunc pulvinar sapien et ligula ullamcorper malesuada. Neque volutpat ac tincidunt vitae semper quis lectus. Imperdiet nulla malesuada pellentesque elit eget gravida cum. Enim ut sem viverra aliquet eget sit. Viverra accumsan in nisl nisi. Purus ut faucibus pulvinar elementum integer enim neque. Netus et malesuada fames ac turpis. At tempor commodo ullamcorper a lacus vestibulum sed arcu. Eget nulla facilisi etiam dignissim diam quis enim lobortis scelerisque. Lorem sed risus ultricies tristique nulla aliquet enim. Nunc eget lorem dolor sed viverra ipsum nunc aliquet bibendum. Aliquam ultrices sagittis orci a scelerisque purus semper eget duis. Eu lobortis elementum nibh tellus molestie. Imperdiet massa tincidunt nunc pulvinar sapien. Quisque egestas diam in arcu cursus euismod quis viverra. Amet commodo nulla facilisi nullam vehicula ipsum. Mattis ullamcorper velit sed ullamcorper morbi tincidunt ornare massa eget.
						</p>
						<p>
							Nunc mattis enim ut tellus elementum. Vehicula ipsum a arcu cursus. Ultrices gravida dictum fusce ut. Pulvinar mattis nunc sed blandit libero volutpat sed cras. Aenean sed adipiscing diam donec adipiscing tristique risus. Auctor neque vitae tempus quam. Tempor nec feugiat nisl pretium fusce id velit ut tortor. Rutrum tellus pellentesque eu tincidunt. At lectus urna duis convallis convallis tellus id. Ultrices eros in cursus turpis massa tincidunt dui ut. Nibh cras pulvinar mattis nunc sed blandit libero. Velit sed ullamcorper morbi tincidunt ornare massa eget. Augue lacus viverra vitae congue eu consequat ac felis. Enim ut tellus elementum sagittis vitae et leo duis. Et magnis dis parturient montes nascetur ridiculus.
						</p>
						<p>
							Sed euismod nisi porta lorem mollis aliquam. Consequat nisl vel pretium lectus quam id leo in vitae. Pharetra magna ac placerat vestibulum lectus mauris ultrices eros. Sit amet purus gravida quis. Pellentesque elit eget gravida cum sociis natoque penatibus et magnis. Venenatis cras sed felis eget velit aliquet. Quisque egestas diam in arcu cursus euismod quis viverra. Lorem ipsum dolor sit amet consectetur adipiscing. Semper eget duis at tellus at. Risus in hendrerit gravida rutrum quisque non tellus. Facilisi morbi tempus iaculis urna id. Adipiscing elit duis tristique sollicitudin nibh. Iaculis at erat pellentesque adipiscing commodo elit at. Diam maecenas sed enim ut sem viverra aliquet eget. Commodo nulla facilisi nullam vehicula ipsum. Faucibus interdum posuere lorem ipsum.
						</p>
						<p>
							Volutpat diam ut venenatis tellus. Ultrices gravida dictum fusce ut placerat orci nulla pellentesque. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Blandit aliquam etiam erat velit scelerisque in. Dui faucibus in ornare quam viverra orci. Purus ut faucibus pulvinar elementum integer enim neque. Placerat in egestas erat imperdiet sed euismod. Sapien eget mi proin sed libero enim sed. Augue mauris augue neque gravida in. Sagittis orci a scelerisque purus semper eget duis at tellus. Senectus et netus et malesuada fames ac turpis. Enim ut sem viverra aliquet. Sagittis vitae et leo duis ut diam quam. Nisl tincidunt eget nullam non nisi est. At in tellus integer feugiat scelerisque varius morbi enim. Accumsan tortor posuere ac ut consequat semper viverra nam libero.
						</p>
					</div>
				</div>
				<div class="controls">
					<router-link tag="button" to="/" class="button is-primary">
						Back To Dashboard
					</router-link>
				</div>
			</div>
		</div>
	</section>
</template>

<style lang="scss">
	.term-and-conditions {
		.title {
			margin-top: 50px;
		}
	}

	.vb {
		.vb-content {
			// q
		}
		> .vb-dragger {
			z-index: 5;
			width: 12px;
			right: 0;

			> .vb-dragger-styler {
				backface-visibility: hidden;
				transform: rotate3d(0, 0, 0, 0);
				transition: background-color 100ms ease-out, margin 100ms ease-out, height 100ms ease-out;
				background-color: #D8D8D8;
				margin: 5px 0 5px 6px;
				border-radius: 20px;
				height: calc(100% - 10px);
				display: block;
			}
		}

		&.vb-scrolling-phantom > .vb-dragger > .vb-dragger-styler {
			background-color: #D8D8D8;
		}

		> .vb-dragger:hover > .vb-dragger-styler, &.vb-dragging > .vb-dragger > .vb-dragger-styler {
			background-color: #D8D8D8;
			margin: 0px;
			height: 100%;
		}

		&.vb-dragging-phantom > .vb-dragger > .vb-dragger-styler {
			background-color: #D8D8D8;
		}
	}
</style>