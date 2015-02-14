window.AudioContext = window.AudioContext || window.webkitAudioContext;

Array.prototype.max = function() {
  return Math.max.apply(null, this);
};

var SoundCloudWaveform = {

	settings : {
		bar: {
			width: 3,
			gap : 0.2
		},
		wave: {
			color: "#666"
		},
		audioContext: new AudioContext(),
		download: false
	},

	generate: function(file, download, bar_width, bar_gap, wave_color, canvas_width, canvas_height, returnFunction) {

		// preparing canvas
		this.settings.canvas = document.createElement('canvas');
		this.settings.context = this.settings.canvas.getContext('2d');

		this.settings.canvas.width = (canvas_width !== undefined) ? parseInt(canvas_width) : 453;
		this.settings.canvas.height = (canvas_height !== undefined) ? parseInt(canvas_height) : 66;

		// setting fill color
		this.settings.wave.color = (wave_color !== undefined) ? wave_color : this.settings.wave.color;

		// setting bars width and gap
		this.settings.bar.width = (bar_width !== undefined) ? parseInt(bar_width) : this.settings.bar.width;
		this.settings.bar.gap = (bar_gap !== undefined) ? parseFloat(bar_gap) : this.settings.bar.gap;

		this.settings.returnFunction = returnFunction;

		this.settings.download = (download !== undefined) ? download : this.settings.download;

		// read file buffer
		var reader = new FileReader();
        reader.onload = function(event) {
            SoundCloudWaveform.settings.audioContext.decodeAudioData(event.target.result, function(buffer) {
                SoundCloudWaveform.extractBuffer(buffer);
            });
        };
        reader.readAsArrayBuffer(file);
	},

	extractBuffer: function(buffer) {
	    buffer = buffer.getChannelData(0);
	    var sections = this.settings.canvas.width;
	    var len = Math.floor(buffer.length / sections);
	    var maxHeight = this.settings.canvas.height;
	    var vals = [];
	    for (var i = 0; i < sections; i += this.settings.bar.width) {
	        vals.push(this.bufferMeasure(i * len, len, buffer) * 10000);
	    }

	    for (var j = 0; j < sections; j += this.settings.bar.width) {
	        var scale = maxHeight / vals.max();
	        var val = this.bufferMeasure(j * len, len, buffer) * 10000;
	        val *= scale;
	        val += 1;
	        this.drawBar(j, val);
	    }

	    if (this.settings.download) {
	    	this.generateImage();
	    }
	    this.settings.returnFunction(this.settings.canvas.toDataURL('image/png'), this.settings.context.getImageData(0, 0, this.settings.canvas.width, this.settings.canvas.height));
    },

    bufferMeasure: function(position, length, data) {
        var sum = 0.0;
        for (var i = position; i <= (position + length) - 1; i++) {
            sum += Math.pow(data[i], 2);
        }
        return Math.sqrt(sum / data.length);
    },

    drawBar: function(i, h) {

    	this.settings.context.fillStyle = this.settings.wave.color;

		var w = this.settings.bar.width;
        if (this.settings.bar.gap !== 0) {
            w *= Math.abs(1 - this.settings.bar.gap);
        }
        var x = i + (w / 2),
            y = this.settings.canvas.height - h;

        this.settings.context.fillRect(x, y, w, h);
    },

    generateImage: function() {
    	var image = this.settings.canvas.toDataURL('image/png');

    	var link = document.createElement('a');
    	link.href = image;
    	link.setAttribute('download', '');
    	link.click();
    }
}