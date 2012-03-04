Visit [Demo Page](http://the8thocean.com/misc/jqueryplugins/Photo-Viewer-Horizontal/demo/)

## HTML side

		<ul id="unique_id">
			<li>
				<a href="path/to/largeImage" target="_blank">
					<img src="path/to/thumbnail"/>
				</a>
			</li>
			<li>...</li>
			<li>...</li>
		</ul>
	
####	If you have a description for a image, add "showdesc", "imgtitle" and "imgdesc" like this,
	
		<img src="path/to/thumbnail" showdesc="true" imgtitle="Image title" imgdesc="Image description"/>
	
## JAVASCRIPT side

		$('#unique_id').horizontalGallery(duration, loaderSettings);
		
#### Options
		
		* duration: Speed of enlarging thumbnails ... (int / milliseconds)
		* loaderSettings: Set a loader image for loading a large image ... (Array / [0]... Path to the loader image (string) [1]... loader width (int) [2]... loader height (int))
