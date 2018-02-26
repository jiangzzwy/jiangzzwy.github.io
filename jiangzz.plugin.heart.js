$(function(){
	$("body").css("height",window.screen.availHeight+"px");
	$("body").css("width",window.screen.availWidth+"px");
	switch(window.orientation){
  	case 0:
  	    $("body").css("height",window.screen.availHeight+"px");
 	    $("body").css("width",window.screen.availWidth+"px");
  	break;
  	case 90:
  	     $("body").css("height",window.screen.availWidth+"px");
 		 $("body").css("width",window.screen.availHeight+"px");
 		 break;
  	case -90:
 	     $("body").css("height",window.screen.availWidth+"px");
		 $("body").css("width",window.screen.availHeight+"px");
  	     break;
   }
})
jQuery.fn.extend({
	sweetheart:function(options){
        function Vector(x, y) {
		    this.x = x;
		    this.y = y;
		};	
		Vector.prototype = {
		    rotate: function (theta) {
		        var x = this.x;
		        var y = this.y;
		        this.x = Math.cos(theta) * x - Math.sin(theta) * y;
		        this.y = Math.sin(theta) * x + Math.cos(theta) * y;
		        return this;
		    },
		    mult: function (f) {
		        this.x *= f;
		        this.y *= f;
		        return this;
		    },
		    clone: function () {
		        return new Vector(this.x, this.y);
		    },
		    length: function () {
		        return Math.sqrt(this.x * this.x + this.y * this.y);
		    },
		    subtract: function (v) {
		        this.x -= v.x;
		        this.y -= v.y;
		        return this;
		    },
		    set: function (x, y) {
		        this.x = x;
		        this.y = y;
		        return this;
		    }
		};
				
		function Petal(stretchA, stretchB, startAngle, angle, growFactor, bloom) {
		    this.stretchA = stretchA;
		    this.stretchB = stretchB;
		    this.startAngle = startAngle;
		    this.angle = angle;
		    this.bloom = bloom;
		    this.growFactor = growFactor;
		    this.r = 1;
		    this.isfinished = false;
		    //this.tanAngleA = Garden.random(-Garden.degrad(Garden.options.tanAngle), Garden.degrad(Garden.options.tanAngle));
		    //this.tanAngleB = Garden.random(-Garden.degrad(Garden.options.tanAngle), Garden.degrad(Garden.options.tanAngle));
		}
		Petal.prototype = {
		    draw: function () {
		        var ctx = this.bloom.garden.ctx;
		        var v1, v2, v3, v4;
		        v1 = new Vector(0, this.r).rotate(Garden.degrad(this.startAngle));
		        v2 = v1.clone().rotate(Garden.degrad(this.angle));
		        v3 = v1.clone().mult(this.stretchA); //.rotate(this.tanAngleA);
		        v4 = v2.clone().mult(this.stretchB); //.rotate(this.tanAngleB);
		        ctx.strokeStyle = this.bloom.c;
		        ctx.beginPath();
		        ctx.moveTo(v1.x, v1.y);
		        ctx.bezierCurveTo(v3.x, v3.y, v4.x, v4.y, v2.x, v2.y);
		        ctx.stroke();
		    },
		    render: function () {
		        if (this.r <= this.bloom.r) {
		            this.r += this.growFactor; // / 10;
		            this.draw();
		        } else {
		            this.isfinished = true;
		        }
		    }
		}

		function Bloom(p, r, c, pc, garden) {
		    this.p = p;
		    this.r = r;
		    this.c = c;
		    this.pc = pc;
		    this.petals = [];
		    this.garden = garden;
		    this.init();
		    this.garden.addBloom(this);
		}
		Bloom.prototype = {
		    draw: function () {
		        var p, isfinished = true;
		        this.garden.ctx.save();
		        this.garden.ctx.translate(this.p.x, this.p.y);
		        for (var i = 0; i < this.petals.length; i++) {
		            p = this.petals[i];
		            p.render();
		            isfinished *= p.isfinished;
		        }
		        this.garden.ctx.restore();
		        if (isfinished == true) {
		            this.garden.removeBloom(this);
		        }
		    },
		    init: function () {
		        var angle = 360 / this.pc;
		        var startAngle = Garden.randomInt(0, 90);
		        for (var i = 0; i < this.pc; i++) {
		            this.petals.push(new Petal(Garden.random(Garden.options.petalStretch.min, Garden.options.petalStretch.max), Garden.random(Garden.options.petalStretch.min, Garden.options.petalStretch.max), startAngle + i * angle, angle, Garden.random(Garden.options.growFactor.min, Garden.options.growFactor.max), this));
		        }
		    }
		}

		function Garden(ctx) {
		    this.blooms = [];
		    this.ctx = ctx;
		}
		Garden.prototype = {
		    render: function () {
		        for (var i = 0; i < this.blooms.length; i++) {
		            this.blooms[i].draw();
		        }
		    },
		    addBloom: function (b) {
		        this.blooms.push(b);
		    },
		    removeBloom: function (b) {
		        var bloom;
		        for (var i = 0; i < this.blooms.length; i++) {
		            bloom = this.blooms[i];
		            if (bloom === b) {
		                this.blooms.splice(i, 1);
		                return this;
		            }
		        }
		    },
		    createRandomBloom: function (x, y) {
		        this.createBloom(x, y, Garden.randomInt(Garden.options.bloomRadius.min, Garden.options.bloomRadius.max), Garden.randomrgba(Garden.options.color.rmin, Garden.options.color.rmax, Garden.options.color.gmin, Garden.options.color.gmax, Garden.options.color.bmin, Garden.options.color.bmax, Garden.options.color.opacity), Garden.randomInt(Garden.options.petalCount.min, Garden.options.petalCount.max));
		    },
		    createBloom: function (x, y, r, c, pc) {
		        new Bloom(new Vector(x, y), r, c, pc, this);
		    }
		}

		Garden.options = {
		    petalCount: {
		        min: 6,
		        max: 15
		    },
		    petalStretch: {
		        min: 0.1,
		        max: 3
		    },
		    growFactor: {
		        min: 0.1,
		        max: 1
		    },
		    bloomRadius: {
		        min: 8,
		        max: 10
		    },
		    density: 10,
		    growSpeed: 1000 / 60,
		    color: {
				rmin: 128,
				rmax: 255,
				gmin: 0,
				gmax: 128,
				bmin: 0,
				bmax: 128,
		        opacity: 0.1
		    },
		    tanAngle: 60
		};
		Garden.circle = 2 * Math.PI;
		Garden.random = function (min, max) {
		    return Math.random() * (max - min) + min;
		};
		Garden.randomInt = function (min, max) {
		    return Math.floor(Math.random() * (max - min + 1)) + min;
		};
		Garden.degrad = function (angle) {
		    return Garden.circle / 360 * angle;
		};
		Garden.raddeg = function (angle) {
		    return angle / Garden.circle * 360;
		};
		Garden.rgba = function (r, g, b, a) {
		    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
		};
		Garden.randomrgba = function (rmin, rmax, gmin, gmax, bmin, bmax, a) {
			var r = Math.round(Garden.random(rmin, rmax));
			var g = Math.round(Garden.random(gmin, gmax));
			var b = Math.round(Garden.random(bmin, bmax));
			var limit = 5;
			if (Math.abs(r - g) <= limit && Math.abs(g - b) <= limit && Math.abs(b - r) <= limit) {
				return Garden.randomrgba(rmin, rmax, gmin, gmax, bmin, bmax, a);
			} else {
				return Garden.rgba(r, g, b, a);
			}
		};
		//处理心形参数
		$(this).each(function(i,item){
			$(this).attr("width",$(this).parent().width()+"px");
			$(this).attr("height",$(this).parent().height()+"px");
			var startRadian = Math.PI;//初始弧度
			var numberDots=700;
			var numberCount=0;
			var radius=(this.height-50)/(16*2);
			if(this.width<=this.height){
				radius=(this.width-50)/(16*2);
			}
			var radianIncrement=Math.PI*2/numberDots;
			var prefix_x=this.width/2;
			var prefix_y=this.height/2-20;
			var graphics=this.getContext("2d");
			//初始化开始位置
			graphics.moveTo(getPosX(startRadian),getPosY(startRadian));
			//构建鲜花对象
			var garden = new Garden(graphics);
			/*花园信息*/
			setInterval(function () {
			    garden.render();
			}, Garden.options.growSpeed);
			var recordOld=true;
			var lastx=0;
			var lasty=0;
			var interval=window.setInterval(function(){
				if(recordOld){
					lastx=getPosX(startRadian);
					lasty=getPosY(startRadian);
				}
				startRadian+=radianIncrement;
				var x=getPosX(startRadian);
				var y=getPosY(startRadian);

				var distance = Math.sqrt(Math.pow(lastx - x, 2) + Math.pow(lasty - y, 2));
				if (distance < Garden.options.bloomRadius.max * 1.3) {
					recordOld=false;
				}else{
					recordOld=true;
					//创建花朵对象
					garden.createRandomBloom(x,y);
				}
				numberCount++;  
	            if (numberCount>= numberDots) {  
	                clearInterval(interval);  
	            }  
			}, 1);
			//x = 16 sin^3 t, y = (13 cos t - 5 cos 2t - 2 cos 3t - cos 4t) 
			function getPosX(t) {//由弧度得到 X 坐标  
	            return prefix_x+radius * (16 * Math.pow(Math.sin(t), 3));  
		    }  
		    function getPosY(t) {//由弧度得到 Y 坐标  
		        return prefix_y-radius * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));  
		    }  
		});
	},drawbg:function(){
		 
		$(this).each(function(i,item){
			   $(this).attr("width",$(this).parent().width()+"px");
			   $(this).attr("height",$(this).parent().height()+"px");
			   var graphics=this.getContext("2d");
			   var linear=graphics.createLinearGradient(0,0,0, this.height);// 创建一个线性渐变 
			   linear.addColorStop(0,"pink");
			   linear.addColorStop(0.5,"pink");
			   linear.addColorStop(1,"white");
			   graphics.fillStyle=linear;
			  //绘制矩形
			  graphics.fillRect(0,0,this.width,this.height);//必不可少
			  
			  var height=this.height;
			  var width=this.width;
			  
			  
			  drawImage(40,height-(height/5),"images/toahua.png",width/3,(height/5),graphics);
			  drawImage(0,height-(height/3),"images/tz.png",width/3,(height/4),graphics);
			  drawImage(width-(width/3),height-(height/5),"images/heflower.png",width/3,(height/5),graphics);
			  drawImage(width-(width/5),height-(height/3),"images/haihe.png",width/5,(height/3),graphics);
			  drawImage(width-(width/20),(height/8),"images/guajia.png",width/15,(height/4),graphics);

			  drawImage(width-(width/5),height-(height/25),"images/shuibo.png",width/15,(height/65),graphics);
			  drawImage(width-(width/3),height-2*(height/25),"images/shuibo.png",width/15,(height/75),graphics);
			  drawImage(width-1.5*(width/3),height-1.8*(height/25),"images/shuibo.png",width/15,(height/75),graphics);
			  drawImage(width-(width/4),height-1.5*(height/25),"images/shuibo.png",width/15,(height/85),graphics);

		});
		function drawImage(x,y,imgUrl,width,height,g){
			  var img = new Image();
			  //指定图片的URL
			  img.src = imgUrl;
			  //浏览器加载图片完毕后再绘制图片
			  img.onload = function(){
				 g.drawImage(img, x,y,width,height);             
			  };
		}

	 },typewriter:function(){
		 this.each(function() {
				var $ele = $(this), str = $ele.html(), progress = 0;
				$ele.html('');
				var timer = setInterval(function() {
					var current = str.substr(progress, 1);
					if (current == '<') {
						progress = str.indexOf('>', progress) + 1;
					} else {
						progress++;
					}
					
					$ele.html(str.substring(0, progress) + (progress & 1 ? '_' : ''));
					if (progress >= str.length) {
						$ele.html(str.substring(0,str.length-1));
						clearInterval(timer);
					}
				}, 100);
			});
		 return this;
	 }
  }
);
function timeElapse(date){
	var current =new  Date();
	var seconds = (current.getTime() - date.getTime() ) / 1000;
	var days = Math.floor(seconds / (3600 * 24));
	console.log(days);
	seconds = seconds % (3600 * 24);
	var hours = Math.floor(seconds / 3600);
	if (hours < 10) {
		hours = "0" + hours;
	}
	seconds = Math.floor(seconds % 3600);
	var minutes = Math.floor(seconds / 60);
	if (minutes < 10) {
		minutes = "0" + minutes;
	}
	seconds = seconds % 60;
	if (seconds < 10) {
		seconds = "0" + seconds;
	}
	var result = "<span class=\"digit\">" + days + "</span> days <span class=\"digit\">" + hours + "</span> hours <span class=\"digit\">" + minutes + "</span> minutes <span class=\"digit\">" + seconds + "</span> seconds"; 
	$("#elapseClock").html(result);
}