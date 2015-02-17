# SoundCloud-Waveform-Generator
SoundCloud-Waveform.js is a simple and small library for JavaScript which generates waveform like soundcloud from audio, as PNG and pixels data of the generated image.

You can change the color of the waveform, the width of bars, gap between bars, generated image width/height. **<a href='http://idnan.github.io/SoundCloud-Waveform-Generator/'>Demo</a>**

##How to use


Create soundcloud like waveform by calling the ```generate()``` function of the ```SoundCloudWaveform``` object. The ```generate()``` function will return URLs to a PNG file and pixels data of the generated image in its return function.

###Parameters of the generate() function
```javascript
SoundCloudWaveform.generate(file, {
		canvas_width: integer,
		canvas_height: integer,
		bar_width: integer,
		bar_gap : float,
		wave_color: string,
		download: boolean,
		onComplete: callback function
	});
```

|Parameter | Value|
|--- | ---|
|*file* | File-object|
|*canvas_width* |Width of the final image. ```Default is 453```|
|*canvas_height*|Height of the final image. ```Default is 66```|
|*bar_width*|Width of the bars. ```Default is 1```|
|*bar_gap*|Width of the gaps between bars. ```MUST BE FLOAT VALUE. Default is 0.2```|
|*wave_color*|Color of the outputted waveform. ```Default is '#666'```|
|*download*|Download final image. ```Default is false```|
|*onComplete*|A function to handle the data sent back, 2 parameters. First one is the URL to the PNG, second is pixels data of the generated image.|

##Example usage

####HTML
```html
<input type="file">
<canvas width='453' height='66' id='showcase'></canvas>
```
####JavaScript
````javascript
document.querySelector('input').addEventListener('change', function(e) {
    SoundCloudWaveform.generate(e.target.files[0], {
    	onComplete: function(png, pixels) {
			var canvas = document.getElementById('showcase');
			var context = canvas.getContext('2d');
			context.putImageData(pixels, 0, 0);
		}
    });
}, false);
```